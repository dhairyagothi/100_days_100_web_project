const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 'red';
let gameOver = false;
let mode = 'pvp'; // pvp or pve

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');

document.getElementById('pvpBtn').onclick = () => setMode('pvp');
document.getElementById('pveBtn').onclick = () => setMode('pve');

function setMode(m) {
  mode = m;
  document.getElementById('pvpBtn').classList.toggle('active', m === 'pvp');
  document.getElementById('pveBtn').classList.toggle('active', m === 'pve');
  resetGame();
}

// Create board
function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  boardDiv.innerHTML = '';
  boardDiv.classList.add('active');
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.col = c;
      boardDiv.appendChild(cell);
    }
  }
}

// Click handler
boardDiv.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;

  if (gameOver) return;

  const col = Number(e.target.dataset.col);

  if (mode === 'pve' && currentPlayer === 'yellow') return;

  dropPiece(col, currentPlayer);
});

// Drop piece
function dropPiece(col, player) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = player;
      renderPiece(row, col, player);

      if (checkWin(row, col)) {
        statusDiv.textContent = `${player.toUpperCase()} Wins 🎉`;
        gameOver = true;

        boardDiv.classList.remove('active');

        return;
      }

      if (isDraw()) {
        statusDiv.textContent = "It's a Draw!";
        gameOver = true;

        boardDiv.classList.remove('active');

        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      statusDiv.textContent = `${currentPlayer.toUpperCase()}'s Turn`;

      if (mode === 'pve' && currentPlayer === 'yellow') {
        setTimeout(botMove, 400);
      }

      return;
    }
  }
}

// Bot (simple smart logic: block or random)
function botMove() {
  if (gameOver) return;

  // 1. try winning move
  for (let c = 0; c < COLS; c++) {
    let r = getAvailableRow(c);
    if (r !== -1) {
      board[r][c] = 'yellow';
      if (checkWin(r, c)) {
        board[r][c] = null;
        dropPiece(c, 'yellow');
        return;
      }
      board[r][c] = null;
    }
  }

  // 2. block red win
  for (let c = 0; c < COLS; c++) {
    let r = getAvailableRow(c);
    if (r !== -1) {
      board[r][c] = 'red';
      if (checkWin(r, c)) {
        board[r][c] = null;
        dropPiece(c, 'yellow');
        return;
      }
      board[r][c] = null;
    }
  }

  // 3. random move
  let col;
  do {
    col = Math.floor(Math.random() * COLS);
  } while (board[0][col] !== null);

  dropPiece(col, 'yellow');
}

// helper
function getAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) return r;
  }
  return -1;
}

// render
function renderPiece(row, col, player) {
  const index = row * COLS + col;
  const cell = boardDiv.children[index];

  const piece = document.createElement('div');
  piece.classList.add('piece', player);

  cell.appendChild(piece);
}

// win check
function checkWin(row, col) {
  return (
    count(row, col, 0, 1) + count(row, col, 0, -1) > 2 ||
    count(row, col, 1, 0) > 2 ||
    count(row, col, 1, 1) + count(row, col, -1, -1) > 2 ||
    count(row, col, 1, -1) + count(row, col, -1, 1) > 2
  );
}

function count(row, col, dr, dc) {
  let r = row + dr;
  let c = col + dc;
  let total = 0;

  while (
    r >= 0 &&
    r < ROWS &&
    c >= 0 &&
    c < COLS &&
    board[r][c] === currentPlayer
  ) {
    total++;
    r += dr;
    c += dc;
  }

  return total;
}

// draw
function isDraw() {
  return board[0].every((cell) => cell !== null);
}

// reset
function resetGame() {
  currentPlayer = 'red';
  gameOver = false;
  statusDiv.textContent = "Red's Turn";
  createBoard();
}

// init
createBoard();
