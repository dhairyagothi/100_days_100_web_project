const boardSize = 8;

let board = [];
let selected = null;
let currentPlayer = "red";
let gameMode = null; // "pvp" or "bot"
let mustContinueJump = false;

const boardDiv = document.getElementById("board");
const statusDiv = document.getElementById("status");

function startGame(mode) {
  gameMode = mode;
  initBoard();
  render();
  setStatus(`${currentPlayer.toUpperCase()}'s turn`);
}

function resetGame() {
  selected = null;
  currentPlayer = "red";
  gameMode = null;
  mustContinueJump = false;
  board = [];
  boardDiv.innerHTML = "";
  setStatus("Select a mode to start");
}

function initBoard() {
  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < boardSize; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: "black", king: false };
    }
  }

  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < boardSize; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: "red", king: false };
    }
  }
}

function render() {
  boardDiv.innerHTML = "";

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const square = document.createElement("div");
      square.className = `square ${(r + c) % 2 === 0 ? "light" : "dark"}`;

      square.dataset.r = r;
      square.dataset.c = c;

      if (board[r][c]) {
        const piece = document.createElement("div");
        piece.className = `piece ${board[r][c].color}`;

        if (board[r][c].king) piece.classList.add("king");

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
  if (!board[r][c]) return;
  if (board[r][c].color !== currentPlayer) return;

  if (gameMode === "bot" && currentPlayer === "black") return;

  selected = { r, c };
  render();
}

function movePiece(r, c) {
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
  if (piece.color === "red" && r === 0) piece.king = true;
  if (piece.color === "black" && r === 7) piece.king = true;

  selected = null;

  // multi jump
  if (move.capture && getValidCaptures(r, c).length > 0) {
    selected = { r, c };
    mustContinueJump = true;
  } else {
    mustContinueJump = false;
    switchTurn();
  }

  render();
  checkWinner();

  if (gameMode === "bot" && currentPlayer === "black") {
    setTimeout(botMove, 500);
  }
}

function switchTurn() {
  currentPlayer = currentPlayer === "red" ? "black" : "red";
  setStatus(`${currentPlayer.toUpperCase()}'s turn`);
}

function getValidMoves(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  let directions = [];

  if (piece.color === "red" || piece.king) {
    directions.push([-1, -1], [-1, 1]);
  }
  if (piece.color === "black" || piece.king) {
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

  return mustContinueJump ? getValidCaptures(r, c) : moves;
}

function getValidCaptures(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  let moves = [];
  let directions = [];

  if (piece.color === "red" || piece.king) {
    directions.push([-1, -1], [-1, 1]);
  }
  if (piece.color === "black" || piece.king) {
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

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/* ---------------- BOT ---------------- */

function botMove() {
  let bestMove = null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === "black") {
        let moves = getValidMoves(r, c);
        if (moves.length > 0) {
          bestMove = { from: { r, c }, to: moves[0] };
          break;
        }
      }
    }
  }

  if (!bestMove) return;

  selected = bestMove.from;
  movePiece(bestMove.to.r, bestMove.to.c);
}

/* ---------------- WIN CHECK ---------------- */

function checkWinner() {
  let red = 0,
    black = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === "red") red++;
      if (board[r][c]?.color === "black") black++;
    }
  }

  if (red === 0) setStatus("BLACK WINS 🎉");
  if (black === 0) setStatus("RED WINS 🎉");
}
