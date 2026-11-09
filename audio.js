// Sons synthétisés avec l'API Web Audio : aucun fichier audio externe.
// Le navigateur crée le son seulement après un clic ou une touche.

let audio = null;
let gainGeneral = null;
let sonActif = true;

function preparerAudio() {
  if (!audio) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audio = new AudioCtx();
    gainGeneral = audio.createGain();
    gainGeneral.gain.value = 0.3;
    gainGeneral.connect(audio.destination);
  }
  if (audio.state === "suspended") audio.resume();
}
function basculerSon() {
  sonActif = !sonActif;
  if (audio && gainGeneral) {
    gainGeneral.gain.setTargetAtTime(sonActif ? 0.3 : 0, audio.currentTime, 0.02);
  }
  return sonActif;
}

// Une note courte : fréquence en hertz, durée en secondes.
function note(frequence, duree, type, volume, glisse) {
  if (!sonActif) return;
  preparerAudio();
  if (!audio) return;
  const maintenant = audio.currentTime;
  const oscillateur = audio.createOscillator();
  const gain = audio.createGain();
  oscillateur.type = type || "sine";
  oscillateur.frequency.setValueAtTime(frequence, maintenant);
  if (glisse) {
    const arrivee = Math.max(30, frequence + glisse);
    oscillateur.frequency.exponentialRampToValueAtTime(arrivee, maintenant + duree);
  }
  gain.gain.setValueAtTime(0.0001, maintenant);
  gain.gain.exponentialRampToValueAtTime(volume || 0.2, maintenant + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, maintenant + duree);
  oscillateur.connect(gain);
  gain.connect(gainGeneral);
  oscillateur.start(maintenant);
  oscillateur.stop(maintenant + duree + 0.03);
}
function sonSuite(notes, duree, type, volume) {
  for (let i = 0; i < notes.length; i++) {
    setTimeout(function () { note(notes[i], duree, type, volume, 0); }, i * 70);
  }
}
function sonCristal(multiplicateur) {
  const base = 540 + Math.min(multiplicateur, 6) * 70;
  note(base, 0.1, "triangle", 0.2, 90);
  note(base * 1.5, 0.07, "sine", 0.07, 30);
}
function sonDore() {
  sonSuite([660, 880, 1170, 1560], 0.12, "triangle", 0.16);
}
function sonBombe() {
  note(120, 0.35, "sawtooth", 0.4, -90);
  note(70, 0.45, "square", 0.25, -30);
}
function sonPerte() {
  note(220, 0.16, "sawtooth", 0.14, -80);
  setTimeout(function () { note(150, 0.22, "sawtooth", 0.12, -40); }, 90);
}
function sonNiveau() {
  sonSuite([520, 660, 880], 0.11, "square", 0.09);
}
function sonClic() {
  note(680, 0.05, "square", 0.07, 120);
}
function sonRecord() {
  sonSuite([523, 659, 784, 1046, 1318], 0.16, "triangle", 0.15);
}
