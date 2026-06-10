const ROWS = 6;
const COLUMNS = 7;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;

const boardElement = document.getElementById("board");
const turnIndicator = document.getElementById("turn-indicator");
const statusMessage = document.getElementById("status-message");
const moveCountElement = document.getElementById("move-count");
const restartButton = document.getElementById("restart-button");
const playerOneCard = document.getElementById("player-one-card");
const playerTwoCard = document.getElementById("player-two-card");
const celebration = document.getElementById("celebration");

let board = [];
let currentPlayer = PLAYER_ONE;
let moveCount = 0;
let gameOver = false;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
}

function getPlayerName(player) {
  return player === PLAYER_ONE ? "Player 1" : "Player 2";
}

function getPlayerClass(player) {
  return player === PLAYER_ONE ? "player-one" : "player-two";
}

function updateStatus(message) {
  statusMessage.textContent = message;
  turnIndicator.textContent = gameOver ? "Game Over" : getPlayerName(currentPlayer);
  moveCountElement.textContent = String(moveCount);
  playerOneCard.classList.toggle("active", !gameOver && currentPlayer === PLAYER_ONE);
  playerTwoCard.classList.toggle("active", !gameOver && currentPlayer === PLAYER_TWO);
}

function clearCelebration() {
  celebration.innerHTML = "";
}

function launchCelebration(player) {
  const message = document.createElement("div");
  const particleColors = ["#22f7ff", "#9a4dff", "#ff2db2", "#ff2d45", "#ffd21a"];

  clearCelebration();

  message.className = "celebration-message";
  message.textContent = `${getPlayerName(player)} Wins!`;
  celebration.appendChild(message);

  for (let i = 0; i < 54; i += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 54;
    const distance = 120 + Math.random() * 260;

    particle.className = "particle";
    particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--rotation", `${Math.random() * 360}deg`);
    particle.style.setProperty(
      "--particle-color",
      particleColors[i % particleColors.length]
    );
    particle.style.animationDelay = `${Math.random() * 160}ms`;
    celebration.appendChild(particle);
  }
}

function renderBoard(winningCells = []) {
  const winningKeys = new Set(
    winningCells.map(([row, col]) => `${row}-${col}`)
  );

  boardElement.innerHTML = "";

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      const cell = document.createElement("button");
      const cellValue = board[row][col];

      cell.type = "button";
      cell.className = "cell";
      cell.dataset.column = String(col);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);

      if (cellValue !== 0) {
        cell.classList.add(getPlayerClass(cellValue));
        cell.setAttribute(
          "aria-label",
          `${getPlayerName(cellValue)} disc in row ${row + 1}, column ${col + 1}`
        );
      }

      if (winningKeys.has(`${row}-${col}`)) {
        cell.classList.add("winning-cell");
      }

      cell.disabled = gameOver;
      cell.addEventListener("click", () => handleColumnClick(col));
      boardElement.appendChild(cell);
    }
  }
}

function findAvailableRow(column) {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][column] === 0) {
      return row;
    }
  }

  return -1;
}

function collectWinningCells(row, col, rowStep, colStep) {
  const player = board[row][col];
  const cells = [[row, col]];

  for (const direction of [-1, 1]) {
    let nextRow = row + rowStep * direction;
    let nextCol = col + colStep * direction;

    while (
      nextRow >= 0 &&
      nextRow < ROWS &&
      nextCol >= 0 &&
      nextCol < COLUMNS &&
      board[nextRow][nextCol] === player
    ) {
      cells.push([nextRow, nextCol]);
      nextRow += rowStep * direction;
      nextCol += colStep * direction;
    }
  }

  return cells;
}

function checkWin(row, col) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [rowStep, colStep] of directions) {
    const cells = collectWinningCells(row, col, rowStep, colStep);

    if (cells.length >= 4) {
      return cells.slice(0, 4);
    }
  }

  return [];
}

function switchPlayer() {
  currentPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

function handleColumnClick(column) {
  if (gameOver) {
    return;
  }

  const row = findAvailableRow(column);

  if (row === -1) {
    updateStatus(
      `Column ${column + 1} is full. ${getPlayerName(
        currentPlayer
      )}, choose another column.`
    );
    return;
  }

  board[row][column] = currentPlayer;
  moveCount += 1;

  const winningCells = checkWin(row, column);

  if (winningCells.length > 0) {
    gameOver = true;
    renderBoard(winningCells);
    updateStatus(`🏆 ${getPlayerName(currentPlayer)} Wins! ${moveCount} moves.`);
    launchCelebration(currentPlayer);
    return;
  }

  if (moveCount === ROWS * COLUMNS) {
    gameOver = true;
    renderBoard();
    updateStatus("It's a draw. The board is full.");
    return;
  }

  switchPlayer();
  renderBoard();
  updateStatus(`${getPlayerName(currentPlayer)}, choose a column.`);
}

function resetGame() {
  board = createEmptyBoard();
  currentPlayer = PLAYER_ONE;
  moveCount = 0;
  gameOver = false;
  clearCelebration();
  renderBoard();
  updateStatus("Player 1, choose a column.");
}

restartButton.addEventListener("click", resetGame);

resetGame();
