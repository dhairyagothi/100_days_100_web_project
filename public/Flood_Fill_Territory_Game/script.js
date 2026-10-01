const EMPTY = 0;
const FLOOD_RADIUS = 1;
const TIME_LIMIT = 30; // seconds per turn

const players = {
  1: {
    name: "Player 1",
    className: "player-1"
  },
  2: {
    name: "Player 2",
    className: "player-2"
  }
};

const gridBoard = document.getElementById("gridBoard");
const currentPlayerText = document.getElementById("currentPlayer");
const playerOneScore = document.getElementById("playerOneScore");
const playerTwoScore = document.getElementById("playerTwoScore");
const playerOnePercent = document.getElementById("playerOnePercent");
const playerTwoPercent = document.getElementById("playerTwoPercent");
const claimedCells = document.getElementById("claimedCells");
const progressFill = document.getElementById("progressFill");
const resultMessage = document.getElementById("resultMessage");
const restartButton = document.getElementById("restartButton");
const turnCard = document.getElementById("turnCard");
const boardSizeSelect = document.getElementById("boardSize");
const gameModeSelect = document.getElementById("gameMode");
const timerDisplay = document.getElementById("timerDisplay");
const timerContainer = document.getElementById("timerContainer");
const moveCountDisplay = document.getElementById("moveCount");
const timeRule = document.getElementById("timeRule");

let board = [];
let currentPlayer = 1;
let gameOver = false;
let currentGridSize = 10;
let gameMode = 'timeattack';
let moveCount = 0;
let timer = null;
let timeRemaining = TIME_LIMIT;
let isTimerRunning = false;

function createBoard() {
  // Clear any existing timer
  clearTimer();
  
  const size = parseInt(boardSizeSelect.value);
  currentGridSize = size;
  gameMode = gameModeSelect.value;
  moveCount = 0;
  
  board = Array.from({ length: size }, () => Array(size).fill(EMPTY));
  currentPlayer = 1;
  gameOver = false;
  timeRemaining = TIME_LIMIT;
  
  gridBoard.innerHTML = "";
  gridBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.setAttribute("aria-label", `Claim row ${row + 1}, column ${col + 1}`);
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      gridBoard.appendChild(cell);
    }
  }

  // Show/hide timer based on game mode
  timerContainer.style.display = gameMode === 'timeattack' ? 'flex' : 'none';
  timeRule.style.display = gameMode === 'timeattack' ? 'list-item' : 'none';
  
  if (gameMode === 'timeattack') {
    startTimer();
  }

  updateDisplay("Choose an open cell to begin.");
  updateScores();
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isTimerRunning = false;
}

function startTimer() {
  clearTimer();
  timeRemaining = TIME_LIMIT;
  updateTimerDisplay();
  isTimerRunning = true;
  
  timer = setInterval(() => {
    timeRemaining -= 1;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeRemaining;
  timerDisplay.className = 'timer-display';
  
  if (timeRemaining <= 5) {
    timerDisplay.classList.add('danger');
  } else if (timeRemaining <= 10) {
    timerDisplay.classList.add('warning');
  }
}

function resetTimer() {
  clearTimer();
  if (gameMode === 'timeattack' && !gameOver) {
    startTimer();
  }
}

function handleTimeout() {
  if (gameOver) return;
  
  clearTimer();
  resultMessage.textContent = `⏱️ ${players[currentPlayer].name} ran out of time!`;
  
  // Switch turn
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateDisplay(`${players[currentPlayer].name}, your turn! (time saved)`);
  resetTimer();
}

function handleCellClick(event) {
  if (gameOver) {
    return;
  }

  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);

  if (board[row][col] !== EMPTY) {
    resultMessage.textContent = "This cell is already claimed!";
    return;
  }

  const claimedThisMove = floodFill(row, col, currentPlayer);
  moveCount += 1;
  moveCountDisplay.textContent = moveCount;
  
  renderBoard(claimedThisMove);
  updateScores();

  // Reset timer on successful move
  if (gameMode === 'timeattack') {
    resetTimer();
  }

  if (isGameFinished()) {
    endGame();
    return;
  }

  // Turn switching
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateDisplay(`${claimedThisMove.size} cells captured. ${players[currentPlayer].name}, choose your next territory.`);
}

function floodFill(startRow, startCol, player) {
  const capturedCells = [];
  const visited = Array.from({ length: currentGridSize }, () => Array(currentGridSize).fill(false));
  const queue = [[startRow, startCol, 0]];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  visited[startRow][startCol] = true;

  while (queue.length > 0) {
    const [row, col, depth] = queue.shift();

    if (board[row][col] !== EMPTY) {
      continue;
    }

    board[row][col] = player;
    capturedCells.push(`${row}-${col}`);

    if (depth >= FLOOD_RADIUS) {
      continue;
    }

    directions.forEach(([rowStep, colStep]) => {
      const nextRow = row + rowStep;
      const nextCol = col + colStep;

      if (!isInsideBoard(nextRow, nextCol)) {
        return;
      }

      if (visited[nextRow][nextCol] || board[nextRow][nextCol] !== EMPTY) {
        return;
      }

      visited[nextRow][nextCol] = true;
      queue.push([nextRow, nextCol, depth + 1]);
    });
  }

  return new Set(capturedCells);
}

function isInsideBoard(row, col) {
  return row >= 0 && row < currentGridSize && col >= 0 && col < currentGridSize;
}

function renderBoard(recentlyClaimed = new Set()) {
  const cells = gridBoard.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const owner = board[row][col];
    const key = `${row}-${col}`;

    cell.className = "cell";

    if (owner !== EMPTY) {
      cell.classList.add("owned", players[owner].className);
      cell.disabled = true;
    }

    if (recentlyClaimed.has(key)) {
      cell.classList.add("just-claimed");
      window.setTimeout(() => cell.classList.remove("just-claimed"), 280);
    }
  });
}

function getScores() {
  let player1 = 0;
  let player2 = 0;

  board.forEach((row) => {
    row.forEach((owner) => {
      if (owner === 1) {
        player1 += 1;
      }
      if (owner === 2) {
        player2 += 1;
      }
    });
  });

  return { player1, player2 };
}

function updateScores() {
  const scores = getScores();
  const totalClaimed = scores.player1 + scores.player2;
  const totalCells = currentGridSize * currentGridSize;
  const percent1 = totalCells > 0 ? Math.round((scores.player1 / totalCells) * 100) : 0;
  const percent2 = totalCells > 0 ? Math.round((scores.player2 / totalCells) * 100) : 0;

  playerOneScore.textContent = scores.player1;
  playerTwoScore.textContent = scores.player2;
  playerOnePercent.textContent = `${percent1}%`;
  playerTwoPercent.textContent = `${percent2}%`;
  claimedCells.textContent = `${totalClaimed} / ${totalCells}`;
  
  const progress = totalCells > 0 ? (totalClaimed / totalCells) * 100 : 0;
  progressFill.style.width = `${progress}%`;
}

function updateDisplay(message) {
  currentPlayerText.textContent = players[currentPlayer].name;
  resultMessage.textContent = message;
  turnCard.classList.toggle("player-two-turn", currentPlayer === 2);
  updateScores();
}

function hasValidMove() {
  return board.some((row) => row.some((owner) => owner === EMPTY));
}

function isGameFinished() {
  return !hasValidMove();
}

function endGame() {
  const scores = getScores();
  gameOver = true;
  clearTimer();

  if (scores.player1 > scores.player2) {
    resultMessage.textContent = "🏆 Player 1 wins!";
  } else if (scores.player2 > scores.player1) {
    resultMessage.textContent = "🏆 Player 2 wins!";
  } else {
    resultMessage.textContent = "🤝 Draw game!";
  }
  
  // Add a small celebration animation
  document.querySelectorAll('.cell.owned').forEach((cell, index) => {
    setTimeout(() => {
      cell.classList.add('highlight');
    }, index * 10);
  });
}

function restartGame() {
  clearTimer();
  createBoard();
}

// Event listeners
restartButton.addEventListener("click", restartGame);

boardSizeSelect.addEventListener("change", () => {
  if (confirm("Changing board size will restart the game. Continue?")) {
    restartGame();
  } else {
    boardSizeSelect.value = currentGridSize;
  }
});

gameModeSelect.addEventListener("change", () => {
  if (confirm("Changing game mode will restart the game. Continue?")) {
    restartGame();
  } else {
    gameModeSelect.value = gameMode;
  }
});

// Keyboard shortcut: 'R' to restart
document.addEventListener("keydown", (e) => {
  if (e.key === 'r' || e.key === 'R') {
    if (!e.ctrlKey && !e.metaKey) {
      restartGame();
    }
  }
});

// Initialize game
createBoard();