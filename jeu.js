// Logique de Pluie de Néon : état, entrées, règles et boucle du jeu.
// Les éléments de la page.
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
const scene = document.getElementById("scene");
const ecranTitre = document.getElementById("ecran-titre");
const ecranFin = document.getElementById("ecran-fin");
const elementScore = document.getElementById("score");
const elementNiveau = document.getElementById("niveau");
const elementCombo = document.getElementById("combo");
const elementComboValeur = document.getElementById("combo-valeur");
const elementComboJauge = document.getElementById("combo-jauge");
const elementVies = document.getElementById("vies").getElementsByTagName("i");
const boutonSon = document.getElementById("bouton-son");
const boutonJouer = document.getElementById("bouton-jouer");
const boutonRejouer = document.getElementById("bouton-rejouer");
const recordTitre = document.getElementById("record-titre");
const finScore = document.getElementById("fin-score");
const finRecord = document.getElementById("fin-record");
const badgeRecord = document.getElementById("badge-record");
// L'état de la partie.
let etat = "titre";
let score = 0;
let record = 0;
let vies = REGLAGES.viesDepart;
let niveau = 1;
let tempsJeu = 0;
let combo = 0;
let chronoCombo = 0;
let objets = [];
let chronoSpawn = 0;
let dernierTemps = 0;
let panier = { x: LARGEUR / 2 - REGLAGES.largeurPanier / 2, y: HAUTEUR - 74, largeur: REGLAGES.largeurPanier, hauteur: REGLAGES.hauteurPanier, vitesse: 0, cibleX: null };
let touches = {};
// Record, multiplicateur et affichage du HUD.
function lireRecord() {
  try { return parseInt(localStorage.getItem(CLE_RECORD), 10) || 0; } catch (erreur) { return 0; }
}
function ecrireRecord() {
  try { localStorage.setItem(CLE_RECORD, String(record)); } catch (erreur) {}
}
function multiplicateur() {
  return Math.min(REGLAGES.multiplicateurMax, 1 + Math.floor(combo / 3));
}
function majHud() {
  elementScore.textContent = score;
  elementNiveau.textContent = "NIVEAU " + niveau;
  elementComboValeur.textContent = "x" + multiplicateur();
  elementCombo.classList.toggle("fort", multiplicateur() > 1);
  for (let i = 0; i < elementVies.length; i++) {
    elementVies[i].classList.toggle("perdue", i >= vies);
  }
  elementComboJauge.style.transform = "scaleX(" + Math.max(0, chronoCombo / REGLAGES.dureeCombo) + ")";
}
// Lancer, terminer et recommencer une partie.
function demarrerPartie() {
  preparerAudio();
  etat = "jeu";
  score = 0; vies = REGLAGES.viesDepart; niveau = 1; tempsJeu = 0;
  combo = 0; chronoCombo = 0; objets = []; chronoSpawn = 0.45;
  panier.x = LARGEUR / 2 - panier.largeur / 2; panier.cibleX = null; panier.vitesse = 0;
  ecranTitre.classList.add("cache");
  ecranFin.classList.add("cache");
  scene.dataset.etat = "jeu";
  majHud();
  sonClic();
}
function terminerPartie() {
  etat = "fin";
  const nouveauRecord = score > record;
  if (nouveauRecord) { record = score; ecrireRecord(); }
  creerParticules(panier.x + panier.largeur / 2, panier.y, COULEURS.cyan, 26, 280);
  secouer(20);
  flasher(COULEURS.blanc, 0.4);
  finScore.textContent = score;
  finRecord.textContent = record;
  badgeRecord.classList.toggle("cache", !nouveauRecord);
  scene.dataset.etat = "fin";
  ecranFin.classList.remove("cache");
  if (nouveauRecord) setTimeout(sonRecord, 250);
}
// Créer les objets et régler la difficulté.
function creerObjet() {
  const tirage = Math.random();
  let type = CRISTAL;
  if (tirage < Math.min(0.42, REGLAGES.hasardBombe + (niveau - 1) * 0.03)) type = BOMBE;
  else if (tirage > 1 - REGLAGES.hasardDore) type = DORE;
  const rayon = type === DORE ? 17 : type === BOMBE ? 15 : 13;
  const vitesse = Math.min(REGLAGES.vitesseChuteMax, REGLAGES.vitesseChute + (niveau - 1) * 28);
  objets.push({
    type: type, x: hasard(rayon + 12, LARGEUR - rayon - 12), y: -rayon - 8, rayon: rayon,
    vitesse: vitesse * hasard(0.85, 1.15), rotation: Math.random() * 6.28,
    vitesseRotation: hasard(-2.2, 2.2), pulsation: Math.random() * 10
  });
}
function majPanier(dt) {
  const direction = (touches.ArrowRight || touches.KeyD ? 1 : 0) - (touches.ArrowLeft || touches.KeyA ? 1 : 0);
  const avant = panier.x;
  if (direction !== 0) {
    panier.x += direction * REGLAGES.vitessePanier * dt;
    panier.cibleX = panier.x + panier.largeur / 2;
  } else if (panier.cibleX !== null) {
    panier.x += (panier.cibleX - panier.largeur / 2 - panier.x) * Math.min(1, dt * 16);
  }
  panier.x = Math.max(REGLAGES.margePanier, Math.min(LARGEUR - panier.largeur - REGLAGES.margePanier, panier.x));
  panier.vitesse = (panier.x - avant) / Math.max(dt, 0.001);
}
function estAttrape(objet) {
  return objet.y + objet.rayon >= panier.y &&
    objet.y - objet.rayon <= panier.y + panier.hauteur &&
    objet.x + objet.rayon * 0.5 >= panier.x &&
    objet.x - objet.rayon * 0.5 <= panier.x + panier.largeur;
}
function toucherObjet(objet) {
  if (objet.type === BOMBE) {
    creerParticules(objet.x, objet.y, COULEURS.magenta, 28, 320);
    perdreVie(objet.x, objet.y, true);
    return;
  }
  combo += 1;
  chronoCombo = REGLAGES.dureeCombo;
  const multi = multiplicateur();
  const points = (objet.type === DORE ? 50 : 10) * multi;
  const couleur = objet.type === DORE ? COULEURS.or : COULEURS.cyan;
  score += points;
  creerParticules(objet.x, objet.y, couleur, objet.type === DORE ? 24 : 14, 280);
  ajouterTexte(objet.x, objet.y - 10, "+" + points, couleur);
  if (objet.type === DORE) { sonDore(); flasher(COULEURS.or, 0.18); }
  else { sonCristal(multi); flasher(COULEURS.cyan, 0.06); }
  secouer(3);
}
function perdreVie(x, y, bombe) {
  vies -= 1;
  combo = 0;
  chronoCombo = 0;
  creerParticules(x, y, COULEURS.rouge, 24, 260);
  secouer(12);
  flasher(COULEURS.rouge, 0.3);
  ajouterTexte(panier.x + panier.largeur / 2, panier.y - 28, "-1 VIE", COULEURS.rouge);
  if (bombe) sonBombe();
  else sonPerte();
  if (vies <= 0) terminerPartie();
}
// Mise à jour de la partie à chaque image.
function mettreAJour(dt) {
  mettreAJourEffets(dt);
  if (etat !== "jeu") return;

  tempsJeu += dt;
  const nouveauNiveau = 1 + Math.floor(tempsJeu / REGLAGES.dureeNiveau);
  if (nouveauNiveau > niveau) {
    niveau = nouveauNiveau;
    flasher(COULEURS.cyan, 0.15);
    sonNiveau();
    ajouterTexte(LARGEUR / 2, HAUTEUR * 0.36, "NIVEAU " + niveau, COULEURS.cyan);
  }
  if (chronoCombo > 0) {
    chronoCombo -= dt;
    if (chronoCombo <= 0) { chronoCombo = 0; combo = 0; }
  }
  majPanier(dt);
  chronoSpawn -= dt;
  if (chronoSpawn <= 0) {
    creerObjet();
    chronoSpawn = Math.max(REGLAGES.intervalleMin, REGLAGES.intervalleObjet - (niveau - 1) * 0.075) * hasard(0.8, 1.15);
  }
  for (let i = objets.length - 1; i >= 0; i--) {
    const objet = objets[i];
    objet.y += objet.vitesse * dt;
    objet.rotation += objet.vitesseRotation * dt;
    if (objet.type === DORE && Math.random() < dt * 18) {
      creerParticules(objet.x, objet.y, COULEURS.or, 1, 30);
    }
    if (estAttrape(objet)) {
      objets.splice(i, 1);
      toucherObjet(objet);
    } else if (objet.y - objet.rayon > HAUTEUR + 20) {
      objets.splice(i, 1);
      if (objet.type === CRISTAL) perdreVie(objet.x, HAUTEUR - 30, false);
      else if (objet.type === DORE) ajouterTexte(objet.x, HAUTEUR - 40, "CRISTAL DORÉ PERDU", COULEURS.or);
    }
  }
  majHud();
}
// Dessin de la scène.
function dessiner() {
  ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
  const temps = performance.now() / 1000;
  dessinerFond(ctx, temps);
  ctx.save();
  if (forceSecousse > 0) {
    ctx.translate(hasard(-forceSecousse, forceSecousse), hasard(-forceSecousse, forceSecousse));
  }
  if (etat !== "titre") {
    dessinerPanier(ctx, panier, temps);
    for (const objet of objets) dessinerObjet(ctx, objet, temps);
  }
  dessinerEffets(ctx);
  ctx.restore();
  dessinerFlash(ctx);
}
function positionX(evenement) {
  const zone = canvas.getBoundingClientRect();
  return Math.max(0, Math.min(LARGEUR, (evenement.clientX - zone.left) * (LARGEUR / zone.width)));
}
// Entrées clavier, souris et doigt.
window.addEventListener("keydown", function (evenement) {
  const code = evenement.code;
  if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD", "Enter"].includes(code)) evenement.preventDefault();
  touches[code] = true;
  preparerAudio();
  if ((code === "Space" || code === "Enter") && etat !== "jeu") demarrerPartie();
});
window.addEventListener("keyup", function (evenement) { touches[evenement.code] = false; });
window.addEventListener("blur", function () { touches = {}; });
canvas.addEventListener("pointermove", function (evenement) {
  panier.cibleX = positionX(evenement);
  if (etat === "jeu") preparerAudio();
});
canvas.addEventListener("pointerdown", function (evenement) {
  preparerAudio();
  panier.cibleX = positionX(evenement);
  if (canvas.setPointerCapture) canvas.setPointerCapture(evenement.pointerId);
});
boutonJouer.addEventListener("click", demarrerPartie);
boutonRejouer.addEventListener("click", demarrerPartie);
document.getElementById("bouton-menu").addEventListener("click", function () { location.reload(); });
boutonSon.addEventListener("click", function () {
  basculerSon();
  boutonSon.textContent = sonActif ? "SON ACTIF" : "SON COUPÉ";
  boutonSon.setAttribute("aria-pressed", sonActif ? "true" : "false");
  if (sonActif) sonClic();
});
// La boucle du jeu.
function boucle(horodatage) {
  const dt = Math.min((horodatage - dernierTemps) / 1000, 0.033);
  dernierTemps = horodatage;
  mettreAJour(dt);
  dessiner();
  requestAnimationFrame(boucle);
}

record = lireRecord();
recordTitre.textContent = record;
majHud();
requestAnimationFrame(boucle);
