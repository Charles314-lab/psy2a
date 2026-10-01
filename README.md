# PSY2A — Site vitrine

Refonte du site du cabinet de psychologie **PSY2A** (Dr Ibrahim Haïdara), 1er cabinet de psychologie au Mali. Vitrine construite **from scratch** avec [Astro](https://astro.build) (sortie 100 % statique : rapide, sûre, excellent SEO).

> La **téléconsultation** (prise de RDV + visio) fera l'objet d'une **phase 2** dans un service dédié. Cette phase 1 couvre la vitrine.

## Prérequis
- [Node.js](https://nodejs.org) 18.20+ (ou 20+ recommandé)
- npm

## Démarrer
```bash
npm install        # installe les dépendances (crée package-lock.json)
npm run dev        # serveur de développement : http://localhost:4321
```

## Scripts
| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de dev avec rechargement à chaud |
| `npm run build` | Génère le site statique dans `dist/` |
| `npm run preview` | Sert le build local pour vérification |
| `npm run check` | Vérifie les types et le code Astro |

## Structure
```
psy2a/
├── public/            # servi tel quel (favicon, robots.txt, images finales)
├── src/
│   ├── components/    # Header, Footer, sections réutilisables
│   ├── config/        # site.ts — source unique (nav, contact, réseaux)
│   ├── layouts/       # BaseLayout.astro (head SEO commun)
│   ├── pages/         # une page = une route
│   └── styles/        # tokens.css (design system) + global.css
├── content-source/    # contenu extrait du site original (référence)
├── astro.config.mjs
└── .env.example       # variables attendues (phase 2) — ne jamais committer .env
```

## Sécurité & qualité
- Sortie statique → surface d'attaque minimale (pas de serveur applicatif en prod).
- Aucun secret dans le dépôt (`.env` ignoré). Liens externes en `rel="noopener noreferrer"`.
- Les **en-têtes de sécurité** (CSP, HSTS, X-Content-Type-Options…) sont à configurer au niveau de l'hébergeur / du reverse proxy (voir le rapport d'audit livré).
- Thème clair/sombre, accessibilité (navigation clavier, contrastes AA), responsive mobile-first.

## Déploiement & domaine
Le site est prévu pour le domaine **psy2a.com** (détenu par le client). Le pointage DNS se fait côté registrar du client, **sans accès au code** (une fiche d'instructions DNS est fournie séparément).
