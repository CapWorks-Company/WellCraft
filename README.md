# WellCraft — GitHub Pages (site) + Cloudflare Worker (backend)

- **Le site** (HTML/CSS/JS, ce dossier) est hébergé sur **GitHub Pages**.
- **Le backend** (API + base de données KV) tourne sur un **Cloudflare
  Worker** séparé — un unique fichier `worker.js` fourni à part.

Tout le contenu modifiable (grades, crafts, nouveautés, fonctionnalités,
commandes, galerie, FAQ, évènement, IP du serveur) se gère depuis
`/admin.html`, qui appelle ce Worker.

## Partie 1 — Déployer le Worker sur Cloudflare (backend)

1. Dashboard Cloudflare → **Workers & Pages** → **Create** → onglet
   **Workers** → donne-lui un nom, ex. `wellcraft-api` → **Deploy** (ça crée
   un Worker "Hello World" par défaut, on va remplacer le code).
2. Une fois créé, clique **Edit code** (éditeur en ligne dans le navigateur).
3. Supprime tout le code par défaut, colle le contenu du fichier `worker.js`
   que je t'ai donné → **Deploy**.
4. Note l'URL de ton Worker, affichée en haut (du style
   `https://wellcraft-api.tonpseudo.workers.dev`).
5. Crée la base KV : **Workers & Pages** → onglet **KV** → **Create a
   namespace** → nomme-la `SITE_DATA_KV`.
6. Lie-la au Worker : retourne sur ton Worker → **Settings** → **Variables**
   → section **KV Namespace Bindings** → **Add binding** → variable name
   `SITE_DATA_KV` → sélectionne le namespace créé → **Save**.
7. Ajoute le mot de passe admin : toujours **Settings** → **Variables** →
   section **Environment Variables** → **Add variable** → nom `ADMIN_TOKEN`
   → colle un token long et aléatoire → clique **Encrypt** (pour qu'il soit
   stocké en secret) → **Save**.

## Partie 2 — Configurer le site avec l'URL du Worker

Avant de publier le site, ouvre `data.js` et remplace la ligne :
```js
window.API_BASE = "https://wellcraft-api.TON-COMPTE.workers.dev";
```
par l'URL exacte notée à l'étape 4 ci-dessus (sans `/` à la fin).

## Partie 3 — Publier le site sur GitHub Pages

1. Crée un repo GitHub, upload tous les fichiers de ce dossier (avec
   `data.js` modifié) à la racine du repo.
2. Sur GitHub → **Settings** du repo → **Pages** → *Source* : **Deploy from
   a branch** → branche `main`, dossier `/ (root)` → **Save**.
3. GitHub te donne une URL du style `https://tonpseudo.github.io/wellcraft/`.

## Partie 4 — Initialiser le contenu

Ouvre `https://tonpseudo.github.io/wellcraft/admin.html`, connecte-toi avec
ton `ADMIN_TOKEN`, clique une fois sur **💾 Sauvegarder** — ça initialise la
base KV avec le contenu de départ. Ensuite, toute modification se fait
depuis cette page, plus jamais besoin de re-publier le site pour changer une
valeur.

## Comment fonctionne la protection de l'admin

- `/admin.html` n'affiche **jamais** de formulaire tant que le token n'a pas
  été validé par le Worker (`POST /api/admin/verify`, comparaison en temps
  constant). Sans le vrai `ADMIN_TOKEN`, il renvoie systématiquement 401 et
  le panneau ne se construit jamais, même via la console du navigateur.
- La sauvegarde (`PUT /api/data`) vérifie ce même token à chaque appel.
- Le token n'est jamais dans le code du site : c'est une variable
  d'environnement **chiffrée** côté Worker, jamais exposée au navigateur.
- Le token saisi côté client est gardé uniquement dans `sessionStorage`
  (effacé à la fermeture de l'onglet), jamais dans `localStorage`.
- Le Worker autorise les requêtes cross-origin (`Access-Control-Allow-Origin:
  *`) puisque GitHub Pages et le Worker sont sur deux domaines différents —
  c'est nécessaire et sans risque ici, aucune donnée sensible n'est
  renvoyée sans le token.

## Si tu dois éditer le contenu à la main malgré tout

`data.js` contient des valeurs par défaut utilisées uniquement si le Worker
est indisponible ou pas encore initialisé. Ce n'est **pas** l'endroit à
modifier au quotidien — utilise `/admin.html`.
