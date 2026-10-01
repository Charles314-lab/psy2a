# Audit sécurité & performance — Refonte design v2 (2026-08-04)

Portée : refonte visuelle complète (charte bleu/vert, hero d'ambiance sur l'accueil,
héros dégradés sur les pages internes, modernisation de la page Contact, intégration
du logo final, recentrage France/téléconsultation). Aucun changement de logique serveur.

## Sécurité

| Point | État | Détail |
|---|---|---|
| Nouveaux hôtes externes | ✅ Aucun | Tout est servi en `'self'` (logos, portrait en WebP local). Pas de CDN, pas de police externe. |
| CSP (`public/_headers`) | ✅ Toujours valide | `img-src 'self' data:` couvre les `data:` SVG (bruit du hero). `frame-src youtube-nocookie` inchangé. `style-src`/`script-src` inchangés. |
| Surface JS | ✅ Inchangée | Aucun nouveau script. Le formulaire Contact garde sa logique (honeypot anti-spam, validation, fallback mailto). |
| Formulaire Contact | ✅ | Honeypot intact, `novalidate` + `checkValidity`, `maxlength` sur le message, pas de donnée en clair dans l'URL (mailto encodé). |
| Liens externes | ✅ | `rel="noopener noreferrer"` sur WhatsApp / réseaux. |
| Données de santé | ✅ | Le site vitrine n'en collecte aucune (rappelé en page Confidentialité). Téléconsultation = phase 2 (RGPD/HDS à traiter séparément). |

⚠️ Rappel : si un endpoint `PUBLIC_CONTACT_ENDPOINT` cross-origin est branché en phase 2,
il faudra l'ajouter à `connect-src` dans la CSP.

## Performance

| Point | État | Détail |
|---|---|---|
| Héros (photos) | ✅ Bon | Photos du domaine (Unsplash, self-hébergées) sous voile de marque, en WebP `astro:assets` (`quality 58`, srcset 768/1280/1920). Viewports courants : 83–226 Ko. La plus lourde (`serenite`, feuillage dense) monte à ~528 Ko au-delà de 1280 px seulement. |
| Photos self-hébergées | ✅ | Aucune requête tierce au chargement (téléchargées dans le dépôt) → bon pour la perf ET la vie privée (santé). Sources/licences dans `src/assets/photos/ASSETS.md` (licence Unsplash, usage commercial, sans attribution). |
| Images de galerie événementielles | ✅ Retirées | Plus référencées → **non incluses dans le build** (Astro ne bundle que les assets importés). |
| Images ajoutées (galerie, CTA, section écoute) | ✅ | Toutes en `loading="lazy"` (hors héros), WebP `quality 60-62`, srcset. Chargées à la demande → pas d'impact sur le premier rendu. |
| Favicon | ✅ | Généré depuis la marque du logo (`favicon-16/32.png`, `apple-touch-icon.png`), 0,5–23 Ko. |
| Logo | ✅ Optimisé | Marque d'en-tête : PNG 186 kB → **WebP ~9 kB**. Logo complet du footer : 937 kB → **WebP ~48 kB** (`astro:assets`, srcset). |
| Portrait | ✅ | WebP ~20 kB, tailles responsives. |
| Polices | ✅ | Pile système + Georgia (display). Aucune requête réseau, aucun FOUT. |
| Animations | ✅ | Aurores/reveal coupés si `prefers-reduced-motion`. `will-change` limité aux blobs. |
| Accessibilité | ✅ | Contrastes AA (texte blanc sur dégradé de marque foncé), focus visibles, cibles tactiles ≥ 44 px, `aria-hidden` sur le décoratif. |

## Points restants (hors design, à valider par le client)

- **Mentions légales** : `[À COMPLÉTER]` = adresse du siège + adresse complète de l'hébergeur.
- **Confidentialité** : `[À COMPLÉTER]` = durée de conservation des messages.
- **Hébergeur** : la mention « Bluehost » est à confirmer selon l'hébergement retenu.
- Activer les en-têtes (`public/_headers` ou équivalent nginx, voir `docs/entetes-securite.md`) sur l'hôte réel.

## Verdict

Sécurité : **maintenue** (aucune régression, aucune nouvelle surface). Performance :
**améliorée** (héros sans image, galerie lourde retirée, logo optimisé). Prêt pour revue
visuelle et, une fois les champs légaux complétés, pour déploiement.
