# En-têtes de sécurité, configuration par hébergeur

La vitrine étant **statique**, les en-têtes de sécurité se posent au niveau de
l'hébergeur / du reverse proxy (pas dans le code). Le fichier `public/_headers`
couvre **Netlify / Cloudflare Pages**. Voici les équivalents pour les autres hôtes.

> Une fois en ligne, vérifier le résultat sur https://securityheaders.com et
> https://observatory.mozilla.org.

## Valeurs cibles
- **Content-Security-Policy** : `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.youtube-nocookie.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'`
- **Strict-Transport-Security** : `max-age=63072000; includeSubDomains; preload`
- **X-Content-Type-Options** : `nosniff`
- **X-Frame-Options** : `DENY`
- **Referrer-Policy** : `strict-origin-when-cross-origin`
- **Permissions-Policy** : `camera=(), microphone=(), geolocation=()`

> `'unsafe-inline'` (style + script) est un compromis v1 (styles scopés Astro +
> petit script anti-flash de thème). À durcir ensuite via hash/nonce. En phase 2,
> la route de visioconsultation devra autoriser `camera=(self), microphone=(self)`.

## nginx
```nginx
server {
    # ... TLS (certbot), root /var/www/psy2a/dist ...
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.youtube-nocookie.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    server_tokens off;               # masque la version nginx
    gzip on; # (ou brotli) sur text/css application/javascript image/svg+xml
}
```

## Apache (.htaccess)
```apache
Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.youtube-nocookie.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

Voir aussi les skills `sysadmin-hardening` (TLS, firewall, durcissement hôte) et
`dns-domain-config` (pointage de `psy2a.com`).
