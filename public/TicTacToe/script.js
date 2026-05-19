document.addEventListener('DOMContentLoaded', () => {

  const cells = Array.from(document.querySelectorAll('.cell'));
  const modal = document.getElementById('resultModal');
  const resultMessage = document.getElementById('resultMessage');
  const closeModal = document.getElementById('closeModal');
  const newGameButton = document.getElementById('newGame');
  const restartGameButton = document.getElementById('restartGame');
  const playerXWins = document.getElementById('playerXWins');
  const playerOWins = document.getElementById('playerOWins');
  const draws = document.getElementById('draws');
  const themeToggle = document.getElementById('themeToggle');

  let currentPlayer = 'X';
  let gameActive = true;
  let boardState = Array(9).fill('');

  let playerXScore = 0;
  let playerOScore = 0;
  let tieCount = 0;

  const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  // =========================
  // THEME MODE
  // =========================

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '☀️ Light Mode';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    if (document.body.classList.contains('light-mode')) {
      themeToggle.textContent = '☀️ Light Mode';
      localStorage.setItem('theme', 'light');
    } else {
      themeToggle.textContent = '🌙 Dark Mode';
      localStorage.setItem('theme', 'dark');
    }
  });

  // =========================
  // UPDATE SCOREBOARD
  // =========================

  function updateScoreboard(winner) {

    if (winner === 'X') {
      playerXScore++;
      playerXWins.textContent =
        `Player X Wins: ${playerXScore}`;

    } else if (winner === 'O') {
      playerOScore++;
      playerOWins.textContent =
        `Player O Wins: ${playerOScore}`;

    } else {
      tieCount++;
      draws.textContent =
        `Draws: ${tieCount}`;
    }
  }

  // =========================
  // CELL CLICK
  // =========================

  function handleCellClick(e) {

    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] !== '' || !gameActive) {
      return;
    }
  }

    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // CLICK ANIMATION

    cell.style.transform = 'scale(0)';

    setTimeout(() => {
      cell.style.transform = 'scale(1)';
    }, 100);

    // PLAYER COLORS

    if (currentPlayer === 'X') {

      cell.style.color = '#00f7ff';
      cell.style.textShadow = '0 0 15px #00f7ff';

    } else {

      cell.style.color = '#ff4df0';
      cell.style.textShadow = '0 0 15px #ff4df0';
    }
    return null;
  }

    // CHECK WINNER

    if (checkWin()) {

      gameActive = false;

      highlightWinningCells();

      setTimeout(() => {

        updateScoreboard(currentPlayer);

        showResult(`${currentPlayer} Wins! 🎉`);

      }, 700);

      return;
    }

    // DRAW

    if (boardState.every(cell => cell !== '')) {

      gameActive = false;

      setTimeout(() => {

        updateScoreboard('draw');

        showResult('It\'s a Draw! 🤝');

      }, 500);

      return;
    }

    currentPlayer =
      currentPlayer === 'X' ? 'O' : 'X';
  }

  // =========================
  // CHECK WIN
  // =========================

  function checkWin() {

    return winningConditions.some(condition => {

      return condition.every(index => {

        return boardState[index] === currentPlayer;

      });

    });
  }

  // =========================
  // HIGHLIGHT WINNING CELLS
  // =========================

  function highlightWinningCells() {

    winningConditions.forEach(condition => {

      if (
        condition.every(index =>
          boardState[index] === currentPlayer
        )
      ) {

        condition.forEach(index => {

          cells[index].style.background =
            'linear-gradient(145deg, #00ff99, #00c853)';

          cells[index].style.boxShadow =
            '0 0 25px #00ff99';

          cells[index].style.transform =
            'scale(1.1)';
        });
      }
    });
  }

  // =========================
  // SHOW RESULT
  // =========================

  function showResult(message) {

    resultMessage.textContent = message;

    modal.style.display = 'block';
  }

  // =========================
  // RESET GAME
  // =========================

  function restartGame() {

    boardState = Array(9).fill('');

    currentPlayer = 'X';

    gameActive = true;

    cells.forEach(cell => {

      cell.textContent = '';

      cell.style.background =
        'linear-gradient(145deg, #b000e6, #7b00b3)';

      cell.style.boxShadow =
        '0 0 15px rgba(138,0,196,0.5)';

      cell.style.transform = 'scale(1)';

      cell.style.color = 'white';

      cell.style.textShadow = 'none';
    });

    modal.style.display = 'none';
  }

  // =========================
  // OVERALL WINNER
  // =========================

  function determineOverallWinner() {

    let winnerMessage;

    if (playerXScore > playerOScore) {

      winnerMessage =
        '🏆 Player X Wins Overall!';

    } else if (playerOScore > playerXScore) {

      winnerMessage =
        '🏆 Player O Wins Overall!';

    } else if (
      playerXScore === playerOScore &&
      (playerXScore > 0 || playerOScore > 0)
    ) {

      winnerMessage =
        '🤝 Overall Match Tied!';

    } else {

      winnerMessage =
        'No Games Played Yet!';
    }

    alert(winnerMessage);
  }

  // =========================
  // EVENT LISTENERS
  // =========================

  cells.forEach(cell => {

    cell.addEventListener(
      'click',
      handleCellClick
    );

  });

  closeModal.addEventListener('click', () => {

    modal.style.display = 'none';

  });

  newGameButton.addEventListener(
    'click',
    restartGame
  );

  restartGameButton.addEventListener(
    'click',
    restartGame
  );

  // =========================
  // RESET SCOREBOARD
  // =========================

  const resetScoreboardButton =
    document.getElementById(
      'resetScoreboard'
    );

  resetScoreboardButton.addEventListener(
    'click',
    () => {

      determineOverallWinner();

      playerXScore = 0;
      playerOScore = 0;
      tieCount = 0;

      playerXWins.textContent =
        `Player X Wins: ${playerXScore}`;

      playerOWins.textContent =
        `Player O Wins: ${playerOScore}`;

      draws.textContent =
        `Draws: ${tieCount}`;

      restartGame();
    }
  );
});
