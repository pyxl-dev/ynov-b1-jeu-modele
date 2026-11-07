// Attrape-fruits : déplace le panier et attrape ce qui tombe.
// Pas de bibliothèque, pas d'installation : ouvre index.html dans le navigateur.

const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");

// --- Réglages : modifie-les pour personnaliser ton jeu ---
const COULEURS = { fond: "#1e1e2e", panier: "#f5c542", objet: "#e5484d", texte: "#ffffff" };
const VITESSE_PANIER = 6;
const VITESSE_CHUTE = 2;
const VIES_DEPART = 3;

// --- État du jeu ---
let panier = { x: 170, y: 460, largeur: 60, hauteur: 20 };
let objets = []; // chaque objet : { x, y, rayon }
let score = 0;   // le score est compté mais pas encore affiché
let vies = VIES_DEPART;
let touches = {}; // touches pressées, par exemple touches["ArrowLeft"] vaut true

// --- Entrées clavier, souris et doigt ---
window.addEventListener("keydown", (e) => {
  touches[e.key] = true;
  if (e.key === " " && vies <= 0) recommencer();
});
window.addEventListener("keyup", (e) => { touches[e.key] = false; });
canvas.addEventListener("pointermove", (e) => {
  const zone = canvas.getBoundingClientRect();
  const xCanvas = (e.clientX - zone.left) * (canvas.width / zone.width);
  panier.x = xCanvas - panier.largeur / 2;
});
canvas.addEventListener("pointerdown", () => { if (vies <= 0) recommencer(); });

// --- Logique ---
function recommencer() {
  objets = [];
  score = 0;
  vies = VIES_DEPART;
}

function creerObjet() {
  const rayon = 12;
  objets.push({ x: rayon + Math.random() * (canvas.width - 2 * rayon), y: -rayon, rayon: rayon });
}

function estAttrape(objet) {
  return objet.y + objet.rayon >= panier.y &&
    objet.y - objet.rayon <= panier.y + panier.hauteur &&
    objet.x >= panier.x &&
    objet.x <= panier.x + panier.largeur;
}

function mettreAJour() {
  if (vies <= 0) return;

  if (touches["ArrowLeft"]) panier.x -= VITESSE_PANIER;
  if (touches["ArrowRight"]) panier.x += VITESSE_PANIER;
  panier.x = Math.max(0, Math.min(canvas.width - panier.largeur, panier.x));

  if (Math.random() < 0.02) creerObjet();

  for (const objet of objets) objet.y += VITESSE_CHUTE;

  for (const objet of objets) {
    if (estAttrape(objet)) {
      score = score + 1;
      objet.fini = true;
    } else if (objet.y - objet.rayon > canvas.height) {
      vies = vies - 1;
      objet.fini = true;
    }
  }
  objets = objets.filter((objet) => !objet.fini);
}

// --- Dessin ---
function dessiner() {
  ctx.fillStyle = COULEURS.fond;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = COULEURS.panier;
  ctx.fillRect(panier.x, panier.y, panier.largeur, panier.hauteur);

  ctx.fillStyle = COULEURS.objet;
  for (const objet of objets) {
    ctx.beginPath();
    ctx.arc(objet.x, objet.y, objet.rayon, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = COULEURS.texte;
  ctx.font = "18px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Vies : " + vies, canvas.width - 10, 24);

  if (vies <= 0) {
    ctx.textAlign = "center";
    ctx.font = "32px sans-serif";
    ctx.fillText("Perdu !", canvas.width / 2, 230);
    ctx.font = "16px sans-serif";
    ctx.fillText("Espace ou clic pour rejouer", canvas.width / 2, 265);
  }
}

// --- Boucle : environ 60 images par seconde ---
function boucle() {
  mettreAJour();
  dessiner();
  requestAnimationFrame(boucle);
}
boucle();
