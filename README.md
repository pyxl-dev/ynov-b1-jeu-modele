# Pluie de Néon - jeu modèle

Jeu d'arcade web en HTML, CSS et JavaScript pour le cours Outils IA, Bachelor 1, Ynov. Ce dépôt est la base de départ des défis GitHub Copilot : le jeu fonctionne déjà, à toi de l'améliorer.

## Le but

Déplace le rail néon en bas de l'écran et attrape les cristaux qui tombent. Évite les bombes. Enchaîne les prises pour faire monter le multiplicateur.

- Cristal cyan : 10 points.
- Cristal doré, plus rare : 50 points.
- Bombe : tu perds une vie et ton combo retombe à zéro.
- Trois vies au départ.
- Le combo reste actif 3 secondes. À partir de 3 cristaux, le multiplicateur passe à x2, puis x3, x4 et x5.
- Toutes les 18 secondes, le niveau augmente : les objets tombent plus vite, arrivent plus souvent et les bombes se multiplient.
- Le meilleur score est conservé dans le navigateur avec `localStorage`.

## Lancer le jeu

Ouvre `index.html` dans un navigateur récent. Il n'y a ni serveur, ni installation, ni build.

Pour publier sur GitHub Pages : dans le dépôt, **Settings**, **Pages**, **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**. L'adresse du jeu apparaît après une à deux minutes.

## Commandes

- Flèches gauche et droite, ou touches A et D.
- Souris ou doigt : le rail suit la position horizontale.
- Entrée ou Espace : lancer la partie, puis rejouer.
- Bouton `SON ACTIF` / `SON COUPÉ` : couper ou remettre les sons.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | couleurs, vitesses, vies, raretés, réglages du jeu |
| `audio.js` | sons synthétisés avec l'API Web Audio, sans fichier audio |
| `effets.js` | particules, textes flottants, secousse d'écran et flash |
| `dessin.js` | décor néon, rail, cristaux et bombes |
| `jeu.js` | état, entrées clavier et tactile, collisions, score, écrans, boucle |
| `index.html`, `style.css` | la page, les écrans et l'interface |
| `JOURNAL.md` | tes prompts et le compte rendu des défis |
| `IDEES_DEFIS.md` | huit extensions à réaliser avec Copilot |
| `.github/copilot-instructions.md` | consignes lues par Copilot sur ce dépôt |

Le JavaScript fait moins de 600 lignes au total. Il est découpé en fichiers courts, sans classe ni framework, avec des commentaires en français.

## Personnaliser

La plupart des réglages sont dans `config.js` : palette, vitesse du rail, vitesse de chute, intervalle entre les objets, durée d'un niveau, durée du combo, nombre de vies. Commence par là avant de toucher à la logique.

Pour vérifier la syntaxe après une modification :

```bash
node --check config.js
node --check audio.js
node --check effets.js
node --check dessin.js
node --check jeu.js
```

## Défis

Les huit idées d'extensions sont dans `IDEES_DEFIS.md`. Le détail des défis, les prompts à garder et ce qui est évalué sont dans le sujet du cours et dans `JOURNAL.md`.
