// Particules, textes flottants, secousse et flash : le game feel.

const particules = [];
const textesFlottants = [];
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let forceSecousse = 0;
let flashAlpha = 0;
let flashCouleur = "#ffffff";

function hasard(min, max) {
  return min + Math.random() * (max - min);
}
function creerParticules(x, y, couleur, nombre, puissance) {
  for (let i = 0; i < nombre; i++) {
    const angle = Math.random() * Math.PI * 2;
    const vitesse = hasard(puissance * 0.2, puissance);
    particules.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * vitesse,
      vy: Math.sin(angle) * vitesse - 30,
      taille: hasard(1.5, 4.5),
      vie: hasard(0.3, 0.8),
      vieMax: 0.8,
      couleur: couleur
    });
  }
  if (particules.length > 320) particules.splice(0, particules.length - 320);
}
function ajouterTexte(x, y, texte, couleur) {
  textesFlottants.push({ x: x, y: y, texte: texte, couleur: couleur, vie: 0.9, vieMax: 0.9 });
}
function secouer(force) {
  if (!mouvementReduit) forceSecousse = Math.max(forceSecousse, force);
}
function flasher(couleur, force) {
  flashCouleur = couleur;
  flashAlpha = Math.max(flashAlpha, mouvementReduit ? force * 0.35 : force);
}
function mettreAJourEffets(dt) {
  for (let i = particules.length - 1; i >= 0; i--) {
    const p = particules[i];
    p.vie -= dt;
    if (p.vie <= 0) {
      particules.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 260 * dt;
    p.vx *= 0.98;
  }
  for (let i = textesFlottants.length - 1; i >= 0; i--) {
    const t = textesFlottants[i];
    t.vie -= dt;
    if (t.vie <= 0) textesFlottants.splice(i, 1);
    else t.y -= 42 * dt;
  }
  forceSecousse = Math.max(0, forceSecousse - dt * 30);
  flashAlpha = Math.max(0, flashAlpha - dt * 2.4);
}
function dessinerEffets(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const p of particules) {
    ctx.globalAlpha = Math.max(0, p.vie / p.vieMax);
    ctx.fillStyle = p.couleur;
    ctx.fillRect(p.x - p.taille / 2, p.y - p.taille / 2, p.taille, p.taille);
  }
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "700 15px ui-monospace, Menlo, monospace";
  for (const t of textesFlottants) {
    ctx.globalAlpha = Math.max(0, t.vie / t.vieMax);
    ctx.fillStyle = t.couleur;
    ctx.shadowColor = t.couleur;
    ctx.shadowBlur = 12;
    ctx.fillText(t.texte, t.x, t.y);
  }
  ctx.restore();
}
function dessinerFlash(ctx) {
  if (flashAlpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(0.75, flashAlpha);
  ctx.fillStyle = flashCouleur;
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);
  ctx.restore();
}
