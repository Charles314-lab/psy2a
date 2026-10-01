// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Configuration Astro — vitrine PSY2A.
 *
 * Choix clés :
 * - `output: 'static'`  → 100 % HTML pré-rendu : perf maximale et surface
 *   d'attaque minimale (aucun serveur applicatif à pirater côté vitrine).
 * - `site`              → domaine cible (psy2a.com) : sert aux URLs absolues,
 *   au sitemap et aux balises canoniques. À conserver même avant la bascule DNS.
 * - `compressHTML`      → HTML minifié en sortie (poids réseau réduit).
 */
export default defineConfig({
  site: 'https://psy2a.com',
  output: 'static',
  compressHTML: true,
  // Génère sitemap-index.xml + sitemap-0.xml au build (référencé par robots.txt).
  integrations: [sitemap()],
  build: {
    // Inline les petites feuilles de style critiques, garde les grosses en fichier.
    inlineStylesheets: 'auto',
  },
  // Le dynamique (RDV, visio) arrivera en phase 2 dans un service séparé.
});
