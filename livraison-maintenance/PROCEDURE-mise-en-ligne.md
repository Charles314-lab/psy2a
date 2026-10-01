# Mise en ligne de la page maintenance, psy2a.com

Bonjour,

Ce dossier contient une **page de maintenance** (le site est en préparation) à mettre en ligne sur le domaine **psy2a.com**. Il y a deux opérations :
1. déposer les fichiers sur l'hébergement **Bluehost**,
2. faire pointer le domaine **psy2a.com** (registrar **OVHcloud**) vers Bluehost.

La page est autonome : HTML + CSS + un logo, aucune base de données ni dépendance externe.

## Fichiers fournis
- `psy2a-maintenance.zip` : archive à téléverser (contient `index.html` et `logo.png`).
- Les deux fichiers `index.html` et `logo.png` sont aussi fournis à part, au choix.

## 1. Déposer les fichiers sur Bluehost (cPanel)
1. Se connecter à Bluehost, ouvrir **cPanel > Gestionnaire de fichiers (File Manager)**.
2. Aller dans le dossier racine du site : **`public_html`** (ou le dossier assigné à psy2a.com).
3. Si un `index.html` ou `default.html` par défaut existe déjà, le **supprimer ou le renommer**.
4. Téléverser **`psy2a-maintenance.zip`** dans `public_html`, puis clic droit sur l'archive > **Extract** (extraire). On peut aussi téléverser directement `index.html` et `logo.png`.
5. Vérifier que `index.html` et `logo.png` sont bien **à la racine de `public_html`** (et non dans un sous-dossier).
6. S'assurer que **psy2a.com** est le domaine assigné à ce `public_html`.

## 2. Faire pointer psy2a.com (OVHcloud) vers Bluehost
Méthode recommandée, la plus simple : **déléguer le DNS à Bluehost via les nameservers**.
1. Dans le compte **Bluehost**, récupérer les **serveurs de noms (nameservers)** du compte (généralement `ns1.bluehost.com` et `ns2.bluehost.com`).
2. Dans **OVHcloud > espace client > domaine psy2a.com > onglet « Serveurs DNS »**, cliquer **« Modifier les serveurs DNS »**, choisir **serveurs DNS externes**, saisir les nameservers Bluehost, puis enregistrer.

Alternative, si vous préférez garder la gestion du DNS chez OVHcloud (par exemple pour des e-mails @psy2a.com) : au lieu de changer les nameservers, créez dans la **zone DNS OVH** :
- `A`, hôte `@`, valeur = **l'IP du serveur Bluehost** (visible dans cPanel > Server Information), TTL 300
- `www`, `CNAME`, valeur `psy2a.com.`

et ne touchez pas aux enregistrements e-mail (`MX`).

## 3. HTTPS (SSL)
Une fois le domaine résolu vers Bluehost, activer le **SSL** (Bluehost émet un certificat gratuit Let's Encrypt / AutoSSL automatiquement), puis activer **« Force HTTPS »** pour la redirection.

## 4. Vérification
- La page doit s'afficher sur **https://psy2a.com** et **https://www.psy2a.com**.
- La propagation DNS prend de quelques minutes à 48 heures.

Pour toute question, merci de revenir vers l'expéditeur de ce document.
