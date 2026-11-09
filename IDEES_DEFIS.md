# Huit idées de défis pour Copilot

Chaque défi se fait en 15 à 30 minutes, dans l'ordre que tu veux. Ils repartent tous du jeu actuel : lis d'abord `config.js`, `jeu.js` et `dessin.js`, puis demande à Copilot de t'expliquer la partie que tu vas modifier avant d'écrire du code.

Règle commune : un seul défi à la fois, tu testes dans le navigateur, tu gardes le prompt exact dans `JOURNAL.md`.

## 1. Aimant à cristaux

**But** : un bonus ramasse les cristaux proches du rail pendant 6 secondes.

**À toucher** : `jeu.js` pour l'état et la durée, `dessin.js` pour l'aura autour du rail, `config.js` pour la durée et la fréquence.

**Prompt Copilot** : "Ajoute un power-up aimant dans mon jeu canvas. Pendant 6 secondes après la prise, les cristaux situés à moins de 120 pixels du rail sont attirés vers lui. Affiche une aura cyan autour du rail et un compte à rebours dans le HUD. Ne change pas les autres règles."

**Réussi si** : le bonus apparaît rarement, l'aura et le compteur sont visibles, les cristaux reviennent à la normale après 6 secondes.

## 2. Bouclier d'urgence

**But** : un bouclier absorbe la prochaine bombe à la place d'une vie.

**À toucher** : `jeu.js` pour l'état `bouclier`, `index.html` et `style.css` pour l'indicateur du HUD, `audio.js` pour le son de rupture.

**Prompt Copilot** : "Ajoute un bouclier au jeu. Quand le joueur attrape une bombe avec un bouclier actif, il ne perd pas de vie, le bouclier disparaît, une explosion différente se déclenche et un texte 'BOUCLIER BRISÉ' apparaît. Un seul bouclier à la fois."

**Réussi si** : le bouclier se voit dans le HUD, il ne se cumule pas, et une bombe sans bouclier enlève bien une vie.

## 3. Cristal de glace

**But** : un nouvel objet ralentit tous les objets qui tombent pendant 4 secondes.

**À toucher** : `config.js` pour le type et la durée, `jeu.js` pour l'effet, `dessin.js` pour le cristal bleu glacé, `audio.js` pour le son.

**Prompt Copilot** : "Ajoute un troisième type d'objet 'glace', plus rare que le doré. Quand on l'attrape, tous les objets ralentissent à 35 pour cent de leur vitesse pendant 4 secondes, puis reprennent leur vitesse. Dessine-le en bleu clair avec des petits éclats et affiche le temps restant."

**Réussi si** : le ralentissement est net, temporaire, et le jeu reste fluide quand plusieurs objets sont à l'écran.

## 4. Le Briseur, boss de passage

**But** : toutes les 45 secondes, un vaisseau boss traverse le haut de l'écran et lâche des bombes pendant 8 secondes.

**À toucher** : `jeu.js` pour l'apparition et le minuteur, `dessin.js` pour le vaisseau, `audio.js` pour une alarme.

**Prompt Copilot** : "Ajoute un boss toutes les 45 secondes. Il apparaît en haut, se déplace de gauche à droite pendant 8 secondes et laisse tomber une bombe toutes les 0,8 seconde. Il n'est pas destructible : il faut survivre. Affiche 'LE BRISEUR' et une barre de temps en haut de l'écran."

**Réussi si** : le boss ne bloque pas le reste du jeu, les bombes sont attrapables et le boss repart après 8 secondes.

## 5. Niveaux à objectif

**But** : remplacer la difficulté au temps par des vagues de 15 cristaux à attraper.

**À toucher** : `jeu.js` pour le compteur de vague et la transition, `index.html` et `style.css` pour le texte de niveau.

**Prompt Copilot** : "Transforme la montée en difficulté en niveaux à objectif. Chaque niveau demande d'attraper 15 cristaux. Quand l'objectif est atteint, le jeu se met en pause 1 seconde, affiche 'NIVEAU RÉUSSI', puis accélère un peu et remet le compteur à zéro. Les bombes ne comptent pas."

**Réussi si** : le compteur est visible, le passage de niveau est clair, et une partie perdue ne fait pas avancer le niveau suivant.

## 6. Thème perso

**But** : proposer trois ambiances de couleurs sur l'écran titre, sans toucher au gameplay.

**À toucher** : `style.css` avec des variables de couleurs, `config.js` ou `jeu.js` pour le choix, `dessin.js` pour les couleurs du canvas.

**Prompt Copilot** : "Ajoute un sélecteur de thème sur l'écran titre avec trois boutons : Néon, Sunset et Forêt. Chaque thème change les couleurs du fond, du rail, des cristaux et des accents du HUD. Garde le thème choisi dans localStorage et applique-le aussi au canvas."

**Réussi si** : les trois thèmes sont vraiment différents, le choix survit au rechargement, et les bombes restent reconnaissables.

## 7. Classement local

**But** : garder les cinq meilleurs scores avec un pseudo, et les afficher sur l'écran titre.

**À toucher** : `jeu.js` pour le stockage et l'écran de fin, `index.html` et `style.css` pour la liste et le champ pseudo.

**Prompt Copilot** : "Remplace le record unique par un classement local de cinq scores. À la fin d'une partie, demande un pseudo de trois lettres maximum, ajoute le score dans un tableau localStorage, trie du plus grand au plus petit et garde cinq entrées. Affiche le classement sur l'écran titre."

**Réussi si** : le classement résiste au rechargement, les doublons ne cassent rien et un petit score ne chasse pas un grand.

## 8. Mode frénésie

**But** : un mode de 30 secondes avec pluie dense et score doublé.

**À toucher** : `jeu.js` pour le mode et le chrono, `index.html` et `style.css` pour le bouton et l'affichage, `config.js` pour les réglages.

**Prompt Copilot** : "Ajoute un bouton 'FRÉNÉSIE' sur l'écran titre. Ce mode dure 30 secondes, fait tomber deux fois plus d'objets, double tous les points et supprime les vies : une bombe enlève 3 secondes au chrono. À la fin, affiche le score et le meilleur score du mode."

**Réussi si** : le chrono est visible, le mode se termine tout seul et le score de la frénésie est séparé du mode normal.
