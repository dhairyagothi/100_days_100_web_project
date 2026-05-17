document.addEventListener('DOMContentLoaded', () => {
  
  const cells = document.querySelectorAll('.cell');
  const turnIndicator = document.getElementById('turnIndicator');
  const playerXWinsSpan = document.getElementById('playerXWins');
  const playerOWinsSpan = document.getElementById('playerOWins');
  const drawsSpan = document.getElementById('drawsCount');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const restartBtn = document.getElementById('restartGameBtn');
  const modal = document.getElementById('resultModal');
  const resultMessage = document.getElementById('resultMessage'); // modal message paragraph
  const closeModal = document.getElementById('closeModal');
  const newGameBtn = document.getElementById('newGame');
  const winnerFlashCard = document.getElementById('winnerFlashcard'); // note: id matches HTML
  const flashWinnerNameSpan = document.getElementById('flashWinnername');
  const playerXInput = document.getElementById('playerXNameInput');
  const playerOInput = document.getElementById('playerONameInput');

  
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;
  let winsX = 0, winsO = 0, draws = 0;
  let playerXName = "UserName(X)";
  let playerOName = "UserName(O)";
  let flashTimeout = null;

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function fireBottomCornerConfetti() {
    canvasConfetti({
      particleCount: 140, spread: 70, origin: { x: 0, y: 1 },
      startVelocity: 25, colors: ['#FFD966', '#FF6B6B', '#4ECDC4', '#FFB347'],
      angle: 60, decay: 0.9
    });
    canvasConfetti({
      particleCount: 140, spread: 70, origin: { x: 1, y: 1 },
      startVelocity: 25, colors: ['#FFE484', '#FF8C9E', '#A855F7', '#6EE7B7'],
      angle: 120, decay: 0.9
    });
    setTimeout(() => {
      canvasConfetti({ particleCount: 90, spread: 55, origin: { x: 0, y: 1 }, startVelocity: 20 });
      canvasConfetti({ particleCount: 90, spread: 55, origin: { x: 1, y: 1 }, startVelocity: 20 });
    }, 120);
  }

  function updateUI() {
    playerXWinsSpan.innerHTML = `🔥 ${playerXName} (X) Wins: ${winsX}`;
    playerOWinsSpan.innerHTML = `💧 ${playerOName} (O) Wins: ${winsO}`;
    drawsSpan.innerHTML = `🤝 Draws: ${draws}`;
    if (gameActive) {
      turnIndicator.innerHTML = (currentPlayer === 'X')
        ? `🎯 ${playerXName}'s turn (X)`
        : `🌀 ${playerOName}'s turn (O)`;
    } else {
      turnIndicator.innerHTML = `⏸️ Game over · Press Restart`;
    }
  }

  // Render board from array
  function renderBoard() {
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = board[i];
      if (board[i] === 'X') cells[i].setAttribute('data-mark', 'X');
      else if (board[i] === 'O') cells[i].setAttribute('data-mark', 'O');
      else cells[i].removeAttribute('data-mark');
    }
  }

  // Winner celebration: flash card + modal + confetti
  function showWinnerCelebration(winnerMark) {
    const winnerName = (winnerMark === 'X') ? playerXName : playerOName;
    // Flash card
    flashWinnerNameSpan.innerText = winnerName;
    winnerFlashCard.classList.add('show');
    if (flashTimeout) clearTimeout(flashTimeout);
    flashTimeout = setTimeout(() => winnerFlashCard.classList.remove('show'), 2600);
    // Modal
    resultMessage.innerText = `🏆 ${winnerName} (${winnerMark}) WINS! 🏆`;
    modal.style.display = 'flex';
    // Confetti
    fireBottomCornerConfetti();
  }

  function showDrawCelebration() {
    resultMessage.innerText = `🤝 It's a DRAW! 🤝`;
    modal.style.display = 'flex';
  }

  // Check win/draw and update game status
  function checkGameStatus() {
    let winner = null;
    for (let pattern of winningConditions) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winner = board[a];
        break;
      }
    }
    if (winner) {
      gameActive = false;
      if (winner === 'X') winsX++;
      else winsO++;
      updateUI();
      showWinnerCelebration(winner);
      return;
    }
    const isDraw = board.every(cell => cell !== '');
    if (isDraw) {
      gameActive = false;
      draws++;
      updateUI();
      showDrawCelebration();
      return;
    }
    // Switch player
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    updateUI();
  }

  function handleCellClick(index) {
    if (!gameActive) return;
    if (board[index] !== '') return;
    board[index] = currentPlayer;
    renderBoard();
    checkGameStatus();
  }

  function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    renderBoard();
    if (modal.style.display === 'flex') modal.style.display = 'none';
    if (winnerFlashCard.classList.contains('show')) winnerFlashCard.classList.remove('show');
    if (flashTimeout) clearTimeout(flashTimeout);
    updateUI();
  }

  function determineOverallWinner() {
    let winnerMessage;
    if (winsX > winsO) {
      winnerMessage = `🏆 ${playerXName} (X) Wins Overall! 🏆`;
    } else if (winsO > winsX) {
      winnerMessage = `🏆 ${playerOName} (O) Wins Overall! 🏆`;
    } else if (winsX === winsO && (winsX > 0 || winsO > 0)) {
      winnerMessage = `🤝 It's a Tie between ${playerXName} and ${playerOName}! 🤝`;
    } else {
      winnerMessage = '🤝 No wins yet — keep playing!';
    }
    alert(winnerMessage);
  }

  function resetScoreboard() {
    determineOverallWinner();
    winsX = 0; winsO = 0; draws = 0;
    resetBoard();
  }

  function updateNames() {
    let newX = playerXInput.value.trim();
    let newO = playerOInput.value.trim();
    playerXName = newX !== "" ? newX : "UserName(X)";
    playerOName = newO !== "" ? newO : "UserName(O)";
    updateUI();
  }

  // ---------- EVENT LISTENERS ----------
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      handleCellClick(idx);
    });
  }

  playerXInput.addEventListener('input', updateNames);
  playerOInput.addEventListener('input', updateNames);
  resetScoreBtn.addEventListener('click', resetScoreboard);
  restartBtn.addEventListener('click', resetBoard);
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  newGameBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetBoard();
  });
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Initial render
  renderBoard();
  updateUI();
  updateNames();
});