# Déploiement de la page maintenance, psy2a.com

**Setup client**
- Domaine `psy2a.com` : registrar **OVHcloud** (gestion DNS).
- Hébergement : **Bluehost** (cPanel : dépôt des fichiers, SSL AutoSSL).

Objectif : afficher la page maintenance sur `psy2a.com` en HTTPS, en attendant le site final. Rappel : agir sur le DNS ne donne accès ni au code ni au serveur.

Fichiers à publier : le contenu du dossier `maintenance/` du projet (`index.html` + `logo.png`), page autonome (CSS en ligne).

---

## Volet A : déposer la page sur Bluehost (cPanel)

1. Se connecter à **Bluehost > cPanel**.
2. S'assurer que `psy2a.com` est le **domaine principal** du plan (sinon l'ajouter et l'assigner au dossier `public_html`).
3. Ouvrir **Gestionnaire de fichiers** (File Manager) > dossier **`public_html`**.
4. **Supprimer ou renommer** le fichier par défaut de Bluehost (`index.html` / `default.html`) pour que le nôtre s'affiche.
5. **Téléverser** `index.html` et `logo.png` (depuis `maintenance/`) directement dans `public_html`.
6. Vérifier l'accès temporaire (avant DNS) via l'aperçu Bluehost ou l'URL temporaire du compte.

> Plus tard : pour publier le site final, remplacer le contenu de `public_html` par le contenu du dossier **`dist/`** (généré par `npm run build`).

---

## Volet B : pointer psy2a.com (OVH) vers Bluehost

Deux stratégies. **Choisir l'une des deux**, pas les deux.

### Stratégie 1 (recommandée si aucun e-mail @psy2a.com à préserver) : déléguer le DNS à Bluehost
Dans **OVH > espace client > domaine psy2a.com > onglet « Serveurs DNS »**, remplacer les serveurs DNS OVH par ceux de **Bluehost**.
- Nameservers Bluehost typiques : `ns1.bluehost.com` et `ns2.bluehost.com`.
- ⚠️ **Confirmer les valeurs EXACTES** affichées dans le compte Bluehost (certains comptes ont des nameservers spécifiques).

Avantages : Bluehost gère tout le DNS et **émet le certificat SSL automatiquement** (AutoSSL). Le plus simple.
Inconvénient : le DNS n'est plus géré chez OVH (les e-mails éventuels @psy2a.com se gèrent alors côté Bluehost).

### Stratégie 2 (si on garde le DNS chez OVH, ex. e-mails OVH) : enregistrement A
1. Récupérer l'**IP du serveur Bluehost** : cPanel > **Server Information** > « Shared IP Address » (ou portail Bluehost > My Sites).
2. Dans **OVH > zone DNS** de psy2a.com :
   - `A` — hôte `@` — valeur `<IP Bluehost>` — TTL 300
   - `www` — `CNAME` — valeur `psy2a.com.` (ou `A` vers la même IP)
   - **Ne pas toucher** aux enregistrements `MX` / e-mail existants.
3. Dans Bluehost, ajouter `psy2a.com` comme domaine assigné à `public_html`.

Avantage : OVH garde la main sur le DNS (e-mails, autres enregistrements).
Inconvénient : il faut l'IP Bluehost ; le SSL AutoSSL s'active une fois le domaine résolu vers Bluehost.

---

## HTTPS (SSL)
- Bluehost émet un certificat gratuit (**AutoSSL / Let's Encrypt**) une fois que `psy2a.com` résout vers Bluehost. Cela peut prendre de quelques minutes à quelques heures.
- Activer **« Force HTTPS »** dans Bluehost pour la redirection http vers https.
- Vérifier ensuite sur https://www.ssllabs.com/ssltest/ et https://securityheaders.com.

## Vérification après bascule
- Résolution : `nslookup psy2a.com` et `nslookup www.psy2a.com` doivent renvoyer Bluehost.
- La page maintenance s'affiche sur `https://psy2a.com` et `https://www.psy2a.com`.
- Propagation DNS : de quelques minutes à 48 h selon TTL et cache.

---

## Fiche à remettre au Dr (si c'est lui qui touche OVH), Stratégie 1
> Dans OVH, pour le domaine **psy2a.com**, onglet « Serveurs DNS », remplacer les serveurs DNS par :
> - `ns1.bluehost.com`
> - `ns2.bluehost.com`
> (valeurs exactes à confirmer dans le compte Bluehost)
> Cela fait pointer le domaine vers l'hébergement. Aucun accès au code n'est donné.

## Fiche à remettre au Dr, Stratégie 2
> Dans OVH, pour **psy2a.com**, zone DNS :
> - Type `A`, hôte `@`, valeur `<IP Bluehost>`, TTL 300
> - Type `CNAME`, hôte `www`, valeur `psy2a.com.`
> Ne pas modifier les enregistrements e-mail (`MX`). Aucun accès au code n'est donné.
