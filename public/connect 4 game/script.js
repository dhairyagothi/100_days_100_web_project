const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 'red';
let gameOver = false;
let mode = 'pvp'; // pvp or pve
let lastHoveredCol = -1;

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');
const previewRowDiv = document.getElementById('preview-row');
const previewDisc = document.getElementById('preview-disc');

document.getElementById('pvpBtn').onclick = () => setMode('pvp');
document.getElementById('pveBtn').onclick = () => setMode('pve');
document.getElementById('restartBtn').onclick = () => resetGame();

function setMode(m) {
  mode = m;
  document.getElementById('pvpBtn').classList.toggle('active', m === 'pvp');
  document.getElementById('pveBtn').classList.toggle('active', m === 'pve');
  resetGame();
}

// Create preview row slots
function createPreviewRow() {
  // Clear old slots but keep the preview-disc
  previewRowDiv.innerHTML = '';
  previewRowDiv.appendChild(previewDisc);

  for (let c = 0; c < COLS; c++) {
    const slot = document.createElement('div');
    slot.classList.add('preview-slot');
    slot.dataset.col = c;

    slot.addEventListener('mouseenter', () => updateHover(c));
    slot.addEventListener('click', () => {
      if (gameOver) return;
      if (mode === 'pve' && currentPlayer === 'yellow') return;
      const col = Number(slot.dataset.col);
      dropPiece(col, currentPlayer);
    });

    previewRowDiv.appendChild(slot);
  }
}

// Update hover preview disc positioning and classes
function updateHover(col) {
  lastHoveredCol = col;
  if (gameOver || (mode === 'pve' && currentPlayer === 'yellow')) {
    hideHover();
    return;
  }

  previewDisc.style.opacity = '1';
  previewDisc.style.setProperty('--col', col);
  previewDisc.className = currentPlayer; // 'red' or 'yellow'
}

function hideHover() {
  previewDisc.style.opacity = '0';
}

// Attach mouseleave to hide hover
boardDiv.addEventListener('mouseleave', () => {
  lastHoveredCol = -1;
  hideHover();
});
previewRowDiv.addEventListener('mouseleave', () => {
  lastHoveredCol = -1;
  hideHover();
});

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
      cell.addEventListener('mouseenter', () => updateHover(c));
      boardDiv.appendChild(cell);
    }
  }
}

// Click handler for board cells
boardDiv.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;
  if (gameOver) return;

  const col = Number(e.target.dataset.col);
  if (mode === 'pve' && currentPlayer === 'yellow') return;

  dropPiece(col, currentPlayer);
});

// Get winning cells coordinates
function getWinningCells(row, col) {
  const player = board[row][col];
  const directions = [
    [[0, 1], [0, -1]],   // horizontal
    [[1, 0], [-1, 0]],   // vertical
    [[1, 1], [-1, -1]],  // main diagonal
    [[1, -1], [-1, 1]]   // anti-diagonal
  ];

  for (const dir of directions) {
    const cells = [[row, col]];
    for (const [dr, dc] of dir) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    if (cells.length >= 4) {
      return cells.slice(0, 4);
    }
  }
  return [];
}

// Drop piece
function dropPiece(col, player) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = player;
      renderPiece(row, col, player);

      const winningCells = getWinningCells(row, col);
      if (winningCells.length > 0) {
        statusDiv.textContent = `${player.toUpperCase()} Wins 🎉`;
        statusDiv.className = player === 'red' ? 'winner-red' : 'winner-yellow';
        gameOver = true;
        boardDiv.classList.remove('active');

        // Highlight winning cells
        winningCells.forEach(([r, c]) => {
          const index = r * COLS + c;
          boardDiv.children[index].classList.add('winner');
        });

        hideHover();
        return;
      }

      if (isDraw()) {
        statusDiv.textContent = "It's a Draw!";
        statusDiv.className = 'draw';
        gameOver = true;
        boardDiv.classList.remove('active');
        hideHover();
        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      statusDiv.textContent = `${currentPlayer.toUpperCase()}'s Turn`;
      statusDiv.className = `${currentPlayer}-turn`;

      // Update hover preview for the next player
      if (lastHoveredCol !== -1) {
        updateHover(lastHoveredCol);
      } else {
        hideHover();
      }

      if (mode === 'pve' && currentPlayer === 'yellow') {
        hideHover();
        setTimeout(botMove, 400);
      }

      return;
    }
  }
}

// Bot (simple smart logic: block or win or random)
function botMove() {
  if (gameOver) return;

  // 1. try winning move
  for (let c = 0; c < COLS; c++) {
    let r = getAvailableRow(c);
    if (r !== -1) {
      board[r][c] = 'yellow';
      const winningCells = getWinningCells(r, c);
      board[r][c] = null;
      if (winningCells.length > 0) {
        dropPiece(c, 'yellow');
        return;
      }
    }
  }

  // 2. block red win
  for (let c = 0; c < COLS; c++) {
    let r = getAvailableRow(c);
    if (r !== -1) {
      board[r][c] = 'red';
      const winningCells = getWinningCells(r, c);
      board[r][c] = null;
      if (winningCells.length > 0) {
        dropPiece(c, 'yellow');
        return;
      }
    }
  }

  // 3. random move
  let col;
  let attempts = 0;
  do {
    col = Math.floor(Math.random() * COLS);
    attempts++;
  } while (board[0][col] !== null && attempts < 100);

  // Fallback if full
  if (board[0][col] !== null) {
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        col = c;
        break;
      }
    }
  }

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

// draw
function isDraw() {
  return board[0].every((cell) => cell !== null);
}

// reset
function resetGame() {
  currentPlayer = 'red';
  gameOver = false;
  statusDiv.textContent = "RED's Turn";
  statusDiv.className = 'red-turn';
  lastHoveredCol = -1;
  hideHover();
  createBoard();
  createPreviewRow();
}

// init
resetGame();
