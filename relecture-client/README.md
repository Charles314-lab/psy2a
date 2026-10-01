# Cahier de relecture client (Dr Haïdara)

Le site n'étant pas encore en ligne, le client ne peut pas relire les textes dans un
navigateur. Ce dossier produit un **document Word** qui reproduit l'intégralité des
textes du site, page par page, avec une colonne vide où le client écrit ses
corrections et ses remarques. Il le renvoie complété, on reporte dans le code.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `contenu-site.json` | Source de vérité du cahier : tous les blocs de texte, avec leur référence (`ACC-12`), leur emplacement à l'écran et le fichier source correspondant. |
| `generer-cahier.mjs` | Génère le HTML de travail à partir du JSON. |
| `cahier-relecture-psy2a.html` | Fichier intermédiaire (généré, ne pas éditer à la main). |
| `creer-docx.ps1` | Pilote Word pour convertir le HTML en `.docx` (A4, marges, pied de page numéroté, largeurs de colonnes). |
| `Cahier-de-relecture-PSY2A.docx` | **Le document à envoyer au client.** |

## Régénérer le document

```bash
node relecture-client/generer-cahier.mjs
```

```bash
pwsh -NoProfile -File relecture-client/creer-docx.ps1
```

Deux points d'attention sous Windows :

- utiliser **`pwsh`** (PowerShell 7) et non `powershell` (5.1), qui échoue à charger la
  bibliothèque de types de Word ;
- le script bascule la culture du thread en `en-US`, sinon l'automatisation Word
  renvoie `Error loading type library/DLL` sur un Windows en français.

Microsoft Word doit être installé sur la machine.

## Exploiter les retours du client

1. Ouvrir le `.docx` renvoyé. Une case de droite vide = aucun changement demandé.
2. Pour chaque case remplie, retrouver la référence (`ACC-12`) dans `contenu-site.json` :
   le champ `source` indique le fichier à modifier (`pages/index.astro`,
   `config/site.ts`, ...).
3. Appliquer la modification dans le code, puis **mettre à jour le texte dans
   `contenu-site.json`** pour que le prochain cahier parte du contenu réellement en ligne.
4. Regénérer le cahier (version suivante) et le renvoyer si un nouveau tour est nécessaire.

Les valeurs reprises sur tout le site (nom, téléphone, e-mail, horaires, références
professionnelles) sont regroupées sous les références `GEN-xx` et vivent toutes dans
`src/config/site.ts` : une seule modification suffit.

## Conventions

- Aucune référence au code, aucun chemin de fichier n'apparaît dans le document remis
  au client (le champ `source` du JSON reste interne).
- Les points en attente d'une décision du client portent une `note` : elle s'affiche en
  orange dans le document, et les questions bloquantes sont reprises en dernière page.
- Règle projet : aucun tiret cadratin ni demi-cadratin, ni dans le document ni sur le site.
