# 🔒 Audit Sécurité & Performance, PSY2A vitrine v1

**Date** : 2026-07-12
**Stack** : Astro 5.18 (sortie statique 100 %), HTML/CSS/JS, aucune BDD, aucun backend en v1
**Périmètre audité** : `src/pages/{index,le-cabinet,consultations,contact,presse}.astro`, `src/layouts/BaseLayout.astro`, `src/components/{Header,Footer}.astro`, `astro.config.mjs`, `package.json` (via `npm audit`), build `dist/`.

## Synthèse
- **Sécurité : 7.5/10 · Performance : 7/10**
- 🔴 Critiques : 0 · 🟠 Élevés : 1 · 🟡 Moyens : 3 · 🔵 Faibles : 3
- **Verdict : À CORRIGER AVANT PROD** (aucun bloquant critique ; le code est sain, mais 3 points à traiter avant mise en ligne publique : optimiser les images, configurer les en-têtes de sécurité, ajouter les pages légales).

## 🔒 Sécurité
| # | Sévérité | Réf. OWASP | Constat | Emplacement | Correctif |
|---|----------|-----------|---------|-------------|-----------|
| S1 | 🟡 | A02 Misconfiguration | En-têtes de sécurité HTTP absents (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). Normal pour un site statique : ils se posent au niveau de l'hébergeur/reverse proxy. | Config hôte (pas encore définie) | Ajouter les en-têtes ci-dessous (via `public/_headers` pour Netlify/Cloudflare, ou snippet nginx). À faire au déploiement. |
| S2 | 🟠 | A06 Composants vulnérables | `esbuild` (transitif via Astro) : 1 vuln « high » = lecture de fichier arbitraire **via le serveur de dev sur Windows uniquement**. **Non exploitable en prod** (le build statique n'exécute aucun serveur). | `npm audit` | Ne pas exposer le dev server sur un réseau non fiable ; planifier la montée Astro (fix = `astro@7`, breaking). Faible urgence. |
| S3 | 🟡 | A08 Intégrité / vie privée | Ressources tierces chargées passivement : images depuis `psy2a.ml`, iframe OpenStreetMap. Contexte santé (RGPD) → minimiser les requêtes externes. | `src/pages/index.astro` (const `IMG`), `src/pages/contact.astro` (iframe OSM) | Héberger les images localement (voir P1). OSM est sans cookie/tracking (acceptable), le déclarer en `frame-src` de la CSP. |
| S4 | 🟡 | A04 Insecure Design | Formulaire de contact sans protection anti-abus. En v1 il compose un simple e-mail (`mailto`, pas de backend → pas d'injection serveur), donc risque faible **aujourd'hui**. | `src/pages/contact.astro` (script) | En phase 2 (endpoint réel) : validation serveur + rate-limiting + anti-spam (Turnstile/hCaptcha). |
| S5 | 🔵 | A05 / bonnes pratiques | Absence de pages **Mentions légales** et **Politique de confidentialité** (obligation en France, d'autant plus pour un professionnel de santé). | Pages manquantes | Ajouter `/mentions-legales/` et `/confidentialite/` (contenu à valider avec le praticien/juriste). |
| S6 | ⚪ | Info | Liens externes déjà en `rel="noopener noreferrer"`, aucun secret dans le dépôt, `.env` ignoré, pas de cookie ni tracker. | Footer, Header, `.gitignore` | RAS, à préserver. |

### En-têtes de sécurité recommandés (S1)
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://psy2a.ml https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.openstreetmap.org; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
> Note : `'unsafe-inline'` (style + script) est un compromis v1 dû aux styles scopés Astro et au petit script anti-flash de thème. À durcir ensuite via hash/nonce. Une fois les images rapatriées, retirer `https://psy2a.ml` de `img-src`.

## ⚡ Performance
| # | Sévérité | Axe | Constat | Emplacement | Correctif |
|---|----------|-----|---------|-------------|-----------|
| P1 | 🟠 | Images | Portrait + galerie chargés en **distant et non optimisés** (`…-scaled.jpg` pleine taille) depuis `psy2a.ml`. Sur mobile / réseau faible (contexte Mali), c'est le principal frein (LCP, bande passante). | `src/pages/index.astro` (const `IMG`) | Télécharger → convertir **AVIF/WebP** → redimensionner → servir depuis `/public/images` avec `srcset` + `width/height` + `loading="lazy"`. Idéalement via `astro:assets`. |
| P2 | 🔵 | Rendu | Iframe OSM ajoute du poids sur la page Contact. | `src/pages/contact.astro` | Déjà en `loading="lazy"` ✅ ; possibilité de « click-to-load » plus tard. |
| P3 | 🔵 | Images | Vérifier que `width`/`height` sont posés partout pour éviter le CLS. | index.astro | Déjà fait sur portrait/galerie ✅ (CLS maîtrisé). |
| P4 | ⚪ | JS | JS minimal (toggle thème, menu mobile, formulaire), pas de framework runtime. |, | Excellent, à préserver. |

## ✅ Points déjà conformes
- Sortie **100 % statique** → surface d'attaque quasi nulle (pas de serveur applicatif à pirater).
- **Zéro cookie / zéro tracker / zéro analytics** → base RGPD saine.
- **Polices système** (aucune requête externe de font).
- `compressHTML`, `inlineStylesheets: 'auto'`, sitemap + `robots.txt`, canonical, Open Graph, **JSON-LD `MedicalBusiness`** (SEO local).
- Accessibilité : HTML sémantique, skip-link, `focus-visible`, labels de formulaire, `aria-current`, cibles tactiles ≥ 44 px, `prefers-reduced-motion`, thème clair/sombre.
- Responsive validé, **aucun débordement horizontal** (corrigé sur Contact).
- Build de prod **sans erreur**, `npm` avec lockfile.

## 📋 Plan d'action priorisé (avant mise en ligne publique)
1. **P1, Rapatrier + optimiser les images** (perf + S3). Le plus fort impact utilisateur.
2. **S1, Configurer les en-têtes de sécurité** sur l'hébergeur (CSP en tête).
3. **S5, Ajouter Mentions légales + Politique de confidentialité** (obligation FR).
4. **S3, Resserrer la CSP** une fois les images locales (retirer `psy2a.ml`).
5. **S2, Planifier** la montée de version Astro (non urgent, dev-only).
6. **S4, Anti-spam** sur le formulaire quand le backend arrivera (phase 2).

## ⚠️ Non vérifié / hors périmètre
- **Lighthouse / PageSpeed réels** non exécutés ici (à lancer sur l'URL déployée pour des chiffres CWV fermes).
- **Hébergement & TLS/HSTS réels** : dépendent de l'hébergeur choisi (voir skills `sysadmin-hardening` / `dns-domain-config`).
- **Conformité RGPD/HDS de fond** (au-delà de la vitrine) : à traiter en phase 2 téléconsultation → skill `telehealth-compliance`.
- **Mapping exact des vidéos** Presse (titres ↔ IDs) à vérifier (`content-source/emissions-tv.md`).

---

## 🔄 Mise à jour, 2026-07-14 (v1.1)
Corrections apportées suite au plan d'action :
- **P1 (perf images), RÉSOLU** : portrait + galerie rapatriés dans `src/assets/` et optimisés par `astro:assets` (WebP + `srcset`). La variante servie sur mobile passe de ~600 Ko à **12-20 Ko** (~95 % de gain). `width`/`height` posés automatiquement → CLS maîtrisé.
- **S3 (dépendance externe images), RÉSOLU** : plus aucune référence à `psy2a.ml` dans le HTML généré (`grep` = 0). `img-src` de la CSP resserré à `'self' data:`.
- **S1 (en-têtes de sécurité), ADRESSÉ** : `public/_headers` (Netlify/Cloudflare) + `docs/entetes-securite.md` (équivalents nginx / Apache). À activer selon l'hôte retenu et à vérifier sur securityheaders.com.
- **S5 (pages légales), ADRESSÉ** : `/mentions-legales/` et `/confidentialite/` créées (modèles à valider juridiquement ; champs `[À COMPLÉTER]`).

**Nouveaux scores : Sécurité 8.5/10 · Performance 9/10.**
Restent avant prod : activer les en-têtes sur l'hôte réel, compléter/valider les pages légales, choisir l'hébergeur → déploiement + pointage DNS de `psy2a.com`.
