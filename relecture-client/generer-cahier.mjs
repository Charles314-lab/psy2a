/**
 * Génère le « cahier de relecture » à remettre au client (Dr Haïdara).
 *
 * Chaîne de production :
 *   contenu-site.json  ->  (ce script)  ->  cahier-relecture-psy2a.html
 *                      ->  (creer-docx.ps1, via Word)  ->  Cahier-de-relecture-PSY2A.docx
 *
 * Le HTML est volontairement simple (tableaux + styles en ligne) : c'est le
 * format que Word importe le plus fidèlement. Le fichier est écrit avec un BOM
 * pour que Word détecte l'UTF-8 sans ambiguïté (accents).
 *
 * Usage : node generer-cahier.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ici = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(ici, 'contenu-site.json'), 'utf8'));

/** Échappe les caractères sensibles du HTML (aucune donnée n'est du HTML ici). */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Cellule vide où le client écrit. `h` = hauteur minimale en centimètres. */
const caseVide = (h = 1.1) =>
  `<td class="rep" style="height:${h}cm">&nbsp;</td>`;

/** Rend le contenu d'un bloc : texte simple, liste à puces ou paires clé/valeur. */
function rendreContenu(bloc) {
  if (bloc.liste) {
    return `<ul class="l">${bloc.liste.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }
  if (bloc.paires) {
    return `<ul class="l">${bloc.paires
      .map(([k, v]) => `<li><b>${esc(k)}</b> : ${esc(v)}</li>`)
      .join('')}</ul>`;
  }
  return `<p class="txt">${esc(bloc.texte ?? '')}</p>`;
}

/** Une ligne de tableau par bloc de texte du site. */
function rendreBloc(bloc) {
  const note = bloc.note ? `<p class="note">À vérifier : ${esc(bloc.note)}</p>` : '';
  return `<tr>
    <td class="ref">${esc(bloc.ref)}</td>
    <td class="cur"><p class="lab">${esc(bloc.label)}</p>${rendreContenu(bloc)}${note}</td>
    ${caseVide()}
  </tr>`;
}

/** Une page du site = un titre + un tableau. */
function rendrePage(page, index) {
  const lignes = [];

  for (const section of page.sections) {
    const noteSection = section.note
      ? `<span class="secnote"> (${esc(section.note)})</span>`
      : '';
    lignes.push(
      `<tr><td class="sec" colspan="3">${esc(section.titre)}${noteSection}</td></tr>`
    );
    for (const bloc of section.blocs) lignes.push(rendreBloc(bloc));
  }

  if (page.images?.length) {
    lignes.push(`<tr>
      <td class="ref">${page.code}-IMG</td>
      <td class="cur"><p class="lab">Images et photos de cette page</p>
        <ul class="l">${page.images.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <p class="note">Indiquez ici les photos à remplacer, à retirer, ou celles que vous nous enverrez.</p></td>
      ${caseVide(1.6)}
    </tr>`);
  }

  lignes.push(`<tr>
    <td class="ref">${page.code}-REM</td>
    <td class="cur"><p class="lab">Vos remarques générales sur cette page</p>
      <p class="txt">Ce qui manque, l'ordre des sections, le ton employé, une section à ajouter ou à supprimer.</p></td>
    ${caseVide(2.6)}
  </tr>`);

  return `<h1 class="${index === 0 ? 'first' : ''}">${esc(page.titre)}</h1>
  <p class="url">Adresse : ${esc(page.url)}</p>
  <p class="intro">${esc(page.intro)}</p>
  <table>
    <thead><tr>
      <th class="ref">Réf.</th>
      <th>Texte actuellement en ligne</th>
      <th>Votre nouvelle version, ou vos remarques</th>
    </tr></thead>
    <tbody>${lignes.join('\n')}</tbody>
  </table>`;
}

const styles = `
  body { font-family: Calibri, "Segoe UI", Arial, sans-serif; font-size: 10.5pt; color: #16233b; }
  h1 { font-size: 17pt; color: #10428f; margin: 0 0 2pt; page-break-before: always; page-break-after: avoid; }
  h1.first { page-break-before: auto; }
  h2 { font-size: 13pt; color: #10428f; margin: 14pt 0 4pt; page-break-after: avoid; }
  p { margin: 0 0 6pt; }
  .url, .intro { font-size: 9.5pt; color: #5a6a85; margin: 0 0 4pt; }
  .intro { margin-bottom: 8pt; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 0.75pt solid #b9c4d6; padding: 4pt 5pt; vertical-align: top; }
  th { background: #10428f; color: #ffffff; font-size: 9.5pt; text-align: left; }
  th.ref, td.ref { width: 1.7cm; }
  td.cur { width: 9.1cm; background: #f7f9fc; }
  td.rep { width: 6.9cm; background: #ffffff; }
  td.ref { font-size: 8.5pt; color: #6b7a94; font-weight: bold; background: #f7f9fc; }
  td.sec { background: #dbe7f8; color: #10428f; font-weight: bold; font-size: 10.5pt; }
  .secnote { font-weight: normal; font-size: 9pt; color: #3d5a86; }
  .lab { font-size: 8.5pt; color: #6b7a94; margin: 0 0 2pt; }
  .txt { margin: 0; }
  .note { font-size: 9pt; color: #b45309; font-style: italic; margin: 3pt 0 0; }
  ul.l { margin: 0; padding-left: 14pt; }
  ul.l li { margin: 0 0 1pt; }
  .garde-titre { font-size: 26pt; color: #10428f; font-weight: bold; margin: 0 0 6pt; }
  .garde-sous { font-size: 13pt; color: #2f855a; margin: 0 0 22pt; }
  .encadre { border: 1pt solid #b9c4d6; background: #f7f9fc; padding: 10pt 12pt; margin: 0 0 12pt; }
  .encadre h2 { margin-top: 0; }
  ol.regles li { margin-bottom: 6pt; }
  .cle { background: #dbe7f8; padding: 6pt 8pt; border-left: 3pt solid #2f855a; }
`;

/* ------------------------------ Page de garde ----------------------------- */
const garde = `
<p class="garde-titre">${esc(data.meta.titre)}</p>
<p class="garde-sous">${esc(data.meta.sousTitre)}</p>

<div class="encadre">
  <h2>À quoi sert ce document</h2>
  <p>Le site est aujourd'hui en préparation et n'est pas encore accessible en ligne. Ce document
  reprend <b>l'intégralité des textes du site</b>, page par page, dans l'ordre où ils apparaissent
  à l'écran. Il vous permet de relire, corriger et commenter tous les contenus sans avoir à
  toucher au site lui-même.</p>
  <p style="margin-bottom:0">Une fois complété, renvoyez simplement ce fichier : vos modifications
  seront reportées sur le site à l'identique.</p>
</div>

<h2>Comment le remplir</h2>
<ol class="regles">
  <li><b>Colonne du milieu</b> : le texte tel qu'il apparaît aujourd'hui sur le site.
      <b>Colonne de droite</b> : c'est votre espace. Écrivez-y votre nouvelle version, ou votre remarque.</li>
  <li><b>Une case de droite laissée vide veut dire « ce texte me convient, on n'y touche pas ».</b>
      Vous n'avez donc à remplir que ce que vous voulez changer.</li>
  <li>Pour <b>supprimer</b> un texte du site, écrivez simplement <b>SUPPRIMER</b> dans la case de droite.</li>
  <li>La <b>référence</b> de la première colonne (par exemple ACC-12) sert à retrouver l'emplacement
      exact du texte sur le site. Merci de ne pas la modifier.</li>
  <li>En fin de chaque page, deux cases vous permettent de commenter <b>les photos</b> et de faire
      <b>une remarque générale</b> sur la page (une section à ajouter, un ordre à revoir, un ton à changer).</li>
  <li>Les mentions en <span style="color:#b45309;font-style:italic">orange</span> signalent un point
      sur lequel nous avons besoin de votre réponse.</li>
  <li>Vous pouvez écrire directement au clavier, ou imprimer le document et le remplir à la main
      avant de nous le renvoyer scanné ou photographié.</li>
</ol>

<p class="cle">Les <b>7 pages du site</b> sont reprises ici : Accueil, Votre Psychologue, Consultations,
Presse &amp; TV, Contact, Mentions légales, Politique de confidentialité. La première partie
regroupe les éléments qui apparaissent sur toutes les pages (menu, coordonnées, pied de page).</p>

<p style="font-size:9.5pt;color:#5a6a85;margin-top:16pt">Version ${esc(data.meta.version)},
${esc(data.meta.date)}. Document de travail interne, non diffusé.</p>
`;

/* ------------------------- Questions de fin de doc ------------------------- */
const questions = `
<h1>Questions en attente de votre réponse</h1>
<p class="intro">Ces points bloquent la mise en ligne ou méritent votre arbitrage. Merci d'y répondre
dans la colonne de droite.</p>
<table>
  <thead><tr><th class="ref">Réf.</th><th>Question</th><th>Votre réponse</th></tr></thead>
  <tbody>
  ${data.questions
    .map(
      (q, i) => `<tr>
      <td class="ref">Q-${String(i + 1).padStart(2, '0')}</td>
      <td class="cur"><p class="txt">${esc(q)}</p></td>
      ${caseVide(1.5)}
    </tr>`
    )
    .join('\n')}
    <tr>
      <td class="ref">Q-LIB</td>
      <td class="cur"><p class="lab">Vos remarques sur l'ensemble du site</p>
        <p class="txt">Tout ce que vous souhaitez ajouter : impression générale, couleurs, logo,
        éléments manquants, idées pour la suite (prise de rendez-vous en ligne, visioconsultation).</p></td>
      ${caseVide(6)}
    </tr>
  </tbody>
</table>
`;

const html = `<html><head><meta charset="utf-8" />
<title>${esc(data.meta.titre)}</title>
<style>${styles}</style>
</head><body>
${garde}
${data.pages.map(rendrePage).join('\n')}
${questions}
</body></html>`;

const sortie = join(ici, 'cahier-relecture-psy2a.html');
writeFileSync(sortie, '﻿' + html, 'utf8');

const nbBlocs = data.pages.reduce(
  (n, p) => n + p.sections.reduce((m, s) => m + s.blocs.length, 0),
  0
);
console.log(`OK : ${sortie}`);
console.log(`${data.pages.length} parties, ${nbBlocs} blocs de texte, ${data.questions.length} questions.`);
