# Instructions pour Copilot

Ce fichier est lu automatiquement par Copilot quand il travaille sur ce dépôt. Il décrit le jeu modèle et les règles à respecter.

## Le projet

- Jeu d'arcade web en HTML, CSS et JavaScript simples, joué dans le navigateur.
- Aucune bibliothèque, aucun framework, aucun outil de build, pas de npm.
- Cinq fichiers JavaScript chargés dans cet ordre : `config.js`, `audio.js`, `effets.js`, `dessin.js`, `jeu.js`.
- `config.js` contient les réglages. `jeu.js` contient l'état, les entrées, les règles et la boucle.
- Le jeu doit fonctionner en ouvrant `index.html`, sans serveur, y compris sur GitHub Pages.

## Règles à respecter

- Code court et lisible par un débutant : fonctions simples, pas de classes, pas de modules, pas de syntaxe avancée.
- Noms de variables et de fonctions en français, sans accents dans le code. Commentaires en français.
- Les réglages (couleurs, vitesses, vies, raretés) restent dans `config.js`.
- Pas de fichiers audio ni d'images externes : les sons passent par Web Audio, les dessins par le canvas.
- Pas d'emoji et pas de tiret long dans les textes affichés.
- Garde le JavaScript total sous 600 lignes et ne duplique pas une fonction existante.
- Ne renomme pas et ne réorganise pas le code existant sans que je le demande.
- Les accès à `localStorage` restent protégés par `try` et `catch`.

## Quand tu modifies le code

- Explique en deux phrases ce que tu as changé et pourquoi.
- Dis comment vérifier le résultat dans le navigateur, avec les touches ou les clics à faire.
- Si ma demande est ambiguë, pose une question avant d'écrire du code.
- Après une modification JavaScript, lance `node --check` sur le fichier touché.
