
  // ---------- GOOGLE SHEETS ----------
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwct-j94qIwoqet8fc3uss54WZ0uK2EsBpQSUkcb6N5nOtHofouSSsldnVZiaJ7XKlvOw/exec';

  export async function syncLoad() {
    try {
      const res = await fetch(SHEET_URL + '?action=getData');
      const data = await res.json();
      data.forEach(([p, h, s]) => {
        if (p === 'Player1') { highScore1 = h; step1 = s; }
        if (p === 'Player2') { highScore2 = h; step2 = s; }
      });
      applyMenuValues();

    } catch {
      step1 = Number(localStorage.getItem('player1Speed')) || step1;
      step2 = Number(localStorage.getItem('player2Speed')) || step2;
      applyMenuValues();

    }
  }

  export async function syncSave() {
    try {
      fetch(`${SHEET_URL}?action=setData&player=Player1&highScore=${highScore1}&speed=${step1}`);
      fetch(`${SHEET_URL}?action=setData&player=Player2&highScore=${highScore2}&speed=${step2}`);
      localStorage.setItem('player1Speed', step1);
      localStorage.setItem('player2Speed', step2);
      localStorage.setItem('highScore1', highScore1);
      localStorage.setItem('highScore2', highScore2);
    } catch {
      localStorage.setItem('player1Speed', step1);
      localStorage.setItem('player2Speed', step2);
      localStorage.setItem('highScore1', highScore1);
      localStorage.setItem('highScore2', highScore2);
    }
  }
