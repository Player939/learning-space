export function startGame() {
     // ===== SAVE NOW BUTTON =====
const saveButton = document.getElementById('saveButton');

saveButton.onclick = () => {
  syncSave();
  alert('Scores and speeds saved!');
};

  // ---------- GAME AREA ----------
  const gameArea = document.createElement('div');
  Object.assign(gameArea.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    backgroundColor: '#222',
    border: '3px solid #000',
    zIndex: 9999
  });
  document.body.appendChild(gameArea);

  // ---------- PLAYER CREATION ----------
  function createPlayer(color, startX, startY) {
    const player = document.createElement('div');
    Object.assign(player.style, {
      position: 'absolute',
      width: '40px',
      height: '40px',
      backgroundColor: color,
      top: startY + 'px',
      left: startX + 'px'
    });
    return player;
  }

  // Player 1 (WASD)
  const player1 = createPlayer('#ff4d4d', 100, 180);
  gameArea.appendChild(player1);
  let score1 = 0;
  let highScore1 = Number(localStorage.getItem('highScore1')) || 0;
  let step1 = Number(localStorage.getItem('player1Speed')) || 3;

  // Player 2 (Arrow Keys)
  const player2 = createPlayer('#4d4dff', 450, 180);
  gameArea.appendChild(player2);
  let score2 = 0;
  let highScore2 = Number(localStorage.getItem('highScore2')) || 0;
  let step2 = Number(localStorage.getItem('player2Speed')) || 3;

  // ---------- SCORE DISPLAYS ----------
  function makeLabel(text, top, left) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
      position: 'absolute',
      top, left,
      color: 'white',
      fontWeight: 'bold'
    });
    gameArea.appendChild(el);
    return el;
  }

  const scoreDisplay1 = makeLabel('Score: 0', '5px', '5px');
  const highScoreDisplay1 = makeLabel('High Score: ' + highScore1, '25px', '5px');
  const scoreDisplay2 = makeLabel('Score: 0', '5px', '500px');
  const highScoreDisplay2 = makeLabel('High Score: ' + highScore2, '25px', '500px');

  // ---------- TIMER ----------
  const timerDisplay = makeLabel('Time: 60', '5px', '50%');
  timerDisplay.style.transform = 'translateX(-50%)';

  // ---------- COINS ----------
  let coins = [];
  function spawnCoin() {
    const coin = document.createElement('div');
    Object.assign(coin.style, {
      position: 'absolute',
      width: '30px',
      height: '30px',
      backgroundColor: 'gold',
      borderRadius: '50%',
      left: Math.floor(Math.random() * 570) + 'px',
      top: Math.floor(Math.random() * 570) + 'px'
    });
    gameArea.appendChild(coin);
    coins.push(coin);
  }
  for (let i = 0; i < 10; i++) spawnCoin();

  // ---------- INPUT ----------
  const keysPressed = {};
  document.addEventListener('keydown', e => keysPressed[e.key] = true);
  document.addEventListener('keyup', e => keysPressed[e.key] = false);

  // ---------- GAME LOOP ----------
  function gameLoop() {
    if (!gameOver) {
      movePlayer(player1, step1, 'w', 's', 'a', 'd');
      movePlayer(player2, step2, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');
      checkCollision(player1, 1);
      checkCollision(player2, 2);
    }
    requestAnimationFrame(gameLoop);
  }

  function movePlayer(player, step, up, down, leftKey, rightKey) {
    let top = parseInt(player.style.top);
    let left = parseInt(player.style.left);
    if (keysPressed[up]) top -= step;
    if (keysPressed[down]) top += step;
    if (keysPressed[leftKey]) left -= step;
    if (keysPressed[rightKey]) left += step;
    player.style.top = Math.max(0, Math.min(560, top)) + 'px';
    player.style.left = Math.max(0, Math.min(560, left)) + 'px';
  }

  // ---------- COLLISION ----------
  function checkCollision(player, id) {
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      const cx = parseInt(coin.style.left);
      const cy = parseInt(coin.style.top);
      const px = parseInt(player.style.left);
      const py = parseInt(player.style.top);
      if (px < cx + 30 && px + 40 > cx && py < cy + 30 && py + 40 > cy) {
        gameArea.removeChild(coin);
        coins.splice(i, 1);
        spawnCoin();
        if (id === 1) {
          score1++;
          scoreDisplay1.textContent = 'Score: ' + score1;
        } else {
          score2++;
          scoreDisplay2.textContent = 'Score: ' + score2;
        }
      }
    }
  }

  // ---------- TIMER ----------
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = 'Time: ' + timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameOver = true;
        Object.keys(keysPressed).forEach(k => keysPressed[k] = false);
        updateHighScores();
      }
    }, 1000);
  }

  function updateHighScores() {
    if (score1 > highScore1) {
      highScore1 = score1;
      highScoreDisplay1.textContent = 'High Score: ' + highScore1;
    }
    if (score2 > highScore2) {
      highScore2 = score2;
      highScoreDisplay2.textContent = 'High Score: ' + highScore2;
    }
    syncSave();
    replayButton.style.display = 'block';
    alert(`Time's up!\nPlayer 1: ${score1}\nPlayer 2: ${score2}`);
  }

  // ---------- REPLAY ----------
  const replayButton = document.createElement('button');
  replayButton.textContent = 'Replay';
  Object.assign(replayButton.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 16px',
    fontWeight: 'bold',
    display: 'none',
    zIndex: 10000
  });
  document.body.appendChild(replayButton);
  replayButton.onclick = () => location.reload();
}
