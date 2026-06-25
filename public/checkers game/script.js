const boardSize = 8;

let board = [];
let selected = null;
let currentPlayer = 'red';
let gameMode = null; // "pvp" or "bot"
let mustContinueJump = false;
let jumpPiece = null;
let gameOver = false;

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');

function startGame(mode) {
  gameMode = mode;
  gameOver = false;
  initBoard();
  render();
  setStatus(`${currentPlayer.toUpperCase()}'s turn`);
  closeModal();
}

function resetGame() {
  selected = null;
  currentPlayer = 'red';
  gameMode = null;
  mustContinueJump = false;
  gameOver = false;
  board = [];
  boardDiv.innerHTML = '';
  setStatus('Select a mode to start');
  closeModal();
}

function initBoard() {
  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < boardSize; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: 'black', king: false };
    }
  }

  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < boardSize; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: 'red', king: false };
    }
  }
}

function render() {
  boardDiv.innerHTML = '';

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const square = document.createElement('div');
      square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;

      square.dataset.r = r;
      square.dataset.c = c;

      if (board[r][c]) {
        const piece = document.createElement('div');
        piece.className = `piece ${board[r][c].color}`;

        if (board[r][c].king) piece.classList.add('king');

        piece.onclick = () => selectPiece(r, c);
        square.appendChild(piece);
      } else {
        square.onclick = () => movePiece(r, c);
      }

      boardDiv.appendChild(square);
    }
  }
}

function setStatus(msg) {
  statusDiv.innerText = msg;
}

function selectPiece(r, c) {
  if (gameOver) return;
  if (!board[r][c]) return;
  if (board[r][c].color !== currentPlayer) return;

  if (gameMode === 'bot' && currentPlayer === 'black') return;

  const capturesAvailable = playerHasCapture(currentPlayer);

  if (capturesAvailable && getValidCaptures(r, c).length === 0) {
    setStatus('Capture available! You must capture.');
    return;
  }

  selected = { r, c };
  render();
}

function movePiece(r, c) {
  if (gameOver) return;
  if (!selected) return;

  const piece = board[selected.r][selected.c];
  if (!piece) return;

  const moves = getValidMoves(selected.r, selected.c);
  const move = moves.find((m) => m.r === r && m.c === c);

  if (!move) return;

  board[r][c] = piece;
  board[selected.r][selected.c] = null;

  // capture
  if (move.capture) {
    board[move.capture.r][move.capture.c] = null;
  }

  // kinging
  if (piece.color === 'red' && r === 0) piece.king = true;
  if (piece.color === 'black' && r === 7) piece.king = true;

  selected = null;

  // multi jump
  if (move.capture && getValidCaptures(r, c).length > 0) {
    selected = { r, c };
    mustContinueJump = true;
    jumpPiece = { r, c };
  } 
  else {
    mustContinueJump = false;
    jumpPiece = null;
  }
  
  render();
  checkWinner();
  
  if (gameOver) {return;}
  if (!mustContinueJump) {switchTurn();}
  
  if (!gameOver && gameMode === 'bot' && currentPlayer === 'black') {setTimeout(botMove, 500);}
}
  
function switchTurn() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    setStatus(`${currentPlayer.toUpperCase()}'s turn`);
}

function getValidMoves(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  let directions = [];

  if (piece.color === 'red' || piece.king) {
    directions.push([-1, -1], [-1, 1]);
  }
  if (piece.color === 'black' || piece.king) {
    directions.push([1, -1], [1, 1]);
  }

  let moves = [];

  for (let [dr, dc] of directions) {
    let nr = r + dr;
    let nc = c + dc;

    if (inBounds(nr, nc) && !board[nr][nc]) {
      moves.push({ r: nr, c: nc });
    }

    // capture
    let er = r + dr * 2;
    let ec = c + dc * 2;

    if (
      inBounds(er, ec) &&
      board[nr][nc] &&
      board[nr][nc].color !== piece.color &&
      !board[er][ec]
    ) {
      moves.push({
        r: er,
        c: ec,
        capture: { r: nr, c: nc },
      });
    }
  }

  if (mustContinueJump) {
  if (
    jumpPiece &&
    jumpPiece.r === r &&
    jumpPiece.c === c
  ) {
    return getValidCaptures(r, c);
  }

  return [];
}

  const capturesAvailable = playerHasCapture(piece.color);

  if (capturesAvailable) {
    return moves.filter((move) => move.capture);
  }

  return moves;
}

function getValidCaptures(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  let moves = [];
  let directions = [];

  if (piece.color === 'red' || piece.king) {
    directions.push([-1, -1], [-1, 1]);
  }
  if (piece.color === 'black' || piece.king) {
    directions.push([1, -1], [1, 1]);
  }

  for (let [dr, dc] of directions) {
    let nr = r + dr;
    let nc = c + dc;
    let er = r + dr * 2;
    let ec = c + dc * 2;

    if (
      inBounds(er, ec) &&
      board[nr][nc] &&
      board[nr][nc].color !== piece.color &&
      !board[er][ec]
    ) {
      moves.push({
        r: er,
        c: ec,
        capture: { r: nr, c: nc },
      });
    }
  }

  return moves;
}

function playerHasCapture(color) {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (
        board[r][c] &&
        board[r][c].color === color &&
        getValidCaptures(r, c).length > 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/* ---------------- BOT ---------------- */

function botMove() {
  let bestMove = null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === 'black') {
        let moves = getValidMoves(r, c);
        if (moves.length > 0) {
          bestMove = { from: { r, c }, to: moves[0] };
          break;
        }
      }
    }
  }

  if (!bestMove) {
  gameOver = true;

  setStatus('RED WINS 🎉');

  showNotification(
    'Game Over',
    'Black has no legal moves remaining. Red wins the game!'
  );

  return;
}

  selected = bestMove.from;
  movePiece(bestMove.to.r, bestMove.to.c);
}

/* ---------------- WIN CHECK ---------------- */

function checkWinner() {
  let red = 0,
    black = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === 'red') red++;
      if (board[r][c]?.color === 'black') black++;
    }
  }

  if (red === 0) {
    setStatus('BLACK WINS 🎉');
    gameOver = true;
    showNotification('Game Over', 'Black wins! Red has no pieces remaining.');
    return;
  }
  if (black === 0) {
    setStatus('RED WINS 🎉');
    gameOver = true;
    showNotification('Game Over', 'Red wins! Black has no pieces remaining.');
    return;
  }

  // Check if current player has any legal moves available
  if (!hasLegalMoves(currentPlayer)) {
    const opponent = currentPlayer === 'red' ? 'black' : 'red';
    setStatus(`${opponent.toUpperCase()} WINS 🎉`);
    gameOver = true;
    showNotification(
      'Game Over',
      `${currentPlayer.toUpperCase()} has no legal moves remaining. ${opponent.toUpperCase()} wins the game!`
    );
  }
}

function hasLegalMoves(player) {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] && board[r][c].color === player) {
        if (getValidMoves(r, c).length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

/* ---------------- NOTIFICATION MODAL ---------------- */

function showNotification(title, message) {
  const modal = document.getElementById('notification-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  if (modal && modalTitle && modalMessage) {
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.classList.add('show');
  }
}

function closeModal() {
  const modal = document.getElementById('notification-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}
