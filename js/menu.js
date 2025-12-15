export function initMenu(startGameCallback) {
// ===== MENU LOGIC =====
let gameMode = 1; // Default: single player

const menu = document.getElementById('menu');
const modeButtons = document.getElementsByName('mode');
const startButton = document.getElementById('startButton');

const menuSpeed1 = document.getElementById('menuSpeed1');
const menuSpeed2 = document.getElementById('menuSpeed2');

// Load speeds into sliders once API/localStorage finishes loading
function applyMenuValues() {
  menuSpeed1.value = step1;
  menuSpeed2.value = step2;
}

startButton.onclick = () => {
  // Set mode
  modeButtons.forEach(rb => { if (rb.checked) gameMode = Number(rb.value); });

  // Apply slider values
  step1 = Number(menuSpeed1.value);
  step2 = Number(menuSpeed2.value);

  // Save them immediately
  syncSave();

  // Hide menu, show game
  menu.style.display = "none";

  //Show Save Now button
  saveButton.style.display = 'block';

  // Hide Player 2 if single-player
  if (gameMode === 1) {
    player2.style.display = "none";
  }

  startTimer();
  requestAnimationFrame(gameLoop);
};
}
