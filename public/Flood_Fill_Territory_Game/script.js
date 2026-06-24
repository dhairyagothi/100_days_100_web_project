const GRID_SIZE = 10;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const EMPTY = 0;
const FLOOD_RADIUS = 1;

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
const claimedCells = document.getElementById("claimedCells");
const resultMessage = document.getElementById("resultMessage");
const restartButton = document.getElementById("restartButton");
const turnCard = document.getElementById("turnCard");

let board = [];
let currentPlayer = 1;
let gameOver = false;

function createBoard() {
  board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(EMPTY));
  currentPlayer = 1;
  gameOver = false;
  gridBoard.innerHTML = "";

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
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

  updateDisplay("Choose an open cell to begin.");
}

function handleCellClick(event) {
  if (gameOver) {
    return;
  }

  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);

  if (board[row][col] !== EMPTY) {
    return;
  }

  const claimedThisMove = floodFill(row, col, currentPlayer);
  renderBoard(claimedThisMove);
  updateScores();

  if (isGameFinished()) {
    endGame();
    return;
  }

  // Turn switching happens after a legal flood fill move is completed.
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateDisplay(`${claimedThisMove.size} cells captured. ${players[currentPlayer].name}, choose your next territory.`);
}

function floodFill(startRow, startCol, player) {
  const capturedCells = [];
  const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
  const queue = [[startRow, startCol, 0]];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  visited[startRow][startCol] = true;

  // Flood fill logic: BFS expands through unclaimed cells only.
  // It stops at grid edges, visited cells, opponent-owned territory, and
  // a small wave radius so one opening move cannot claim the entire board.
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
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
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

  // Scoring system: each owned cell adds one point to that player's score.
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

  playerOneScore.textContent = scores.player1;
  playerTwoScore.textContent = scores.player2;
  claimedCells.textContent = `${totalClaimed} / ${TOTAL_CELLS}`;
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

  if (scores.player1 > scores.player2) {
    resultMessage.textContent = "Player 1 wins!";
  } else if (scores.player2 > scores.player1) {
    resultMessage.textContent = "Player 2 wins!";
  } else {
    resultMessage.textContent = "Draw game!";
  }
}

restartButton.addEventListener("click", createBoard);

createBoard();
