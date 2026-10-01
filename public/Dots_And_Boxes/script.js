const boardElement = document.getElementById("gameBoard");
const restartButton = document.getElementById("restartButton");
const playerOneCard = document.getElementById("playerOneCard");
const playerTwoCard = document.getElementById("playerTwoCard");
const playerOneScore = document.getElementById("playerOneScore");
const playerTwoScore = document.getElementById("playerTwoScore");
const turnIndicator = document.getElementById("turnIndicator");
const moveCountElement = document.getElementById("moveCount");
const completedBoxesElement = document.getElementById("completedBoxes");
const gameMessage = document.getElementById("gameMessage");

const gridSize = 4;
const totalBoxes = (gridSize - 1) * (gridSize - 1);
const totalLines = gridSize * (gridSize - 1) * 2;

let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let totalMoves = 0;
let completedBoxes = 0;
let gameOver = false;
let selectedLines = {};
let claimedBoxes = {};

function createLineId(type, row, col) {
  return `${type}-${row}-${col}`;
}

function getPlayerName(player) {
  return player === 1 ? "Player 1" : "Player 2";
}

function getPlayerColorName(player) {
  return player === 1 ? "Blue" : "Red";
}

function resetGameState() {
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  totalMoves = 0;
  completedBoxes = 0;
  gameOver = false;
  selectedLines = {};
  claimedBoxes = {};
}

function buildBoard() {
  boardElement.innerHTML = "";

  createBoxes();
  createLines();
  createDots();
}

function createDots() {
  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.style.left = `${(col / (gridSize - 1)) * 100}%`;
      dot.style.top = `${(row / (gridSize - 1)) * 100}%`;
      boardElement.appendChild(dot);
    }
  }
}

function createBoxes() {
  const boxSize = 100 / (gridSize - 1);

  for (let row = 0; row < gridSize - 1; row += 1) {
    for (let col = 0; col < gridSize - 1; col += 1) {
      const box = document.createElement("div");
      box.className = "box";
      box.dataset.boxId = `box-${row}-${col}`;
      box.style.left = `${col * boxSize + 2}%`;
      box.style.top = `${row * boxSize + 2}%`;
      box.style.width = `${boxSize - 4}%`;
      box.style.height = `${boxSize - 4}%`;
      boardElement.appendChild(box);
    }
  }
}

function createLines() {
  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize - 1; col += 1) {
      addLine("h", row, col);
    }
  }

  for (let row = 0; row < gridSize - 1; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      addLine("v", row, col);
    }
  }
}

function addLine(type, row, col) {
  const line = document.createElement("button");
  const lineId = createLineId(type, row, col);
  const gap = 100 / (gridSize - 1);

  line.type = "button";
  line.className = type === "h" ? "line horizontal" : "line vertical";
  line.dataset.lineId = lineId;
  line.dataset.type = type;
  line.dataset.row = row;
  line.dataset.col = col;
  line.setAttribute("aria-label", `Claim ${type === "h" ? "horizontal" : "vertical"} line at row ${row + 1}, column ${col + 1}`);

  if (type === "h") {
    line.style.left = `${col * gap}%`;
    line.style.top = `${row * gap}%`;
    line.style.width = `${gap}%`;
  } else {
    line.style.left = `${col * gap}%`;
    line.style.top = `${row * gap}%`;
    line.style.height = `${gap}%`;
  }

  line.addEventListener("click", handleLineClick);
  boardElement.appendChild(line);
}

function handleLineClick(event) {
  if (gameOver) {
    return;
  }

  const line = event.currentTarget;
  const lineId = line.dataset.lineId;

  if (selectedLines[lineId]) {
    return;
  }

  // Claim the clicked line for the current player.
  selectedLines[lineId] = currentPlayer;
  totalMoves += 1;
  line.classList.add("selected", `player-${currentPlayer}`);
  line.disabled = true;

  const boxesMade = checkCompletedBoxes(line.dataset.type, Number(line.dataset.row), Number(line.dataset.col));

  if (boxesMade > 0) {
    scores[currentPlayer] += boxesMade;
    completedBoxes += boxesMade;
    gameMessage.textContent = `${getPlayerColorName(currentPlayer)} completed ${boxesMade} box${boxesMade > 1 ? "es" : ""} and gets another turn.`;
  } else {
    switchPlayer();
    gameMessage.textContent = `${getPlayerColorName(currentPlayer)} Player's turn.`;
  }

  updateDisplay();
  checkForWinner();
}

function checkCompletedBoxes(type, row, col) {
  let boxesMade = 0;
  const possibleBoxes = getPossibleBoxes(type, row, col);

  possibleBoxes.forEach((box) => {
    const boxId = `box-${box.row}-${box.col}`;

    if (!claimedBoxes[boxId] && isBoxComplete(box.row, box.col)) {
      claimedBoxes[boxId] = currentPlayer;
      boxesMade += 1;
      markBoxClaimed(boxId);
    }
  });

  return boxesMade;
}

function getPossibleBoxes(type, row, col) {
  const boxes = [];

  // A horizontal line can finish the box above it or below it.
  if (type === "h") {
    if (row > 0) {
      boxes.push({ row: row - 1, col });
    }

    if (row < gridSize - 1) {
      boxes.push({ row, col });
    }
  }

  // A vertical line can finish the box to its left or right.
  if (type === "v") {
    if (col > 0) {
      boxes.push({ row, col: col - 1 });
    }

    if (col < gridSize - 1) {
      boxes.push({ row, col });
    }
  }

  return boxes;
}

function isBoxComplete(row, col) {
  const top = selectedLines[createLineId("h", row, col)];
  const bottom = selectedLines[createLineId("h", row + 1, col)];
  const left = selectedLines[createLineId("v", row, col)];
  const right = selectedLines[createLineId("v", row, col + 1)];

  return Boolean(top && bottom && left && right);
}

function markBoxClaimed(boxId) {
  const box = boardElement.querySelector(`[data-box-id="${boxId}"]`);

  if (box) {
    box.classList.add("claimed", `player-${currentPlayer}`);
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateDisplay() {
  playerOneScore.textContent = scores[1];
  playerTwoScore.textContent = scores[2];
  moveCountElement.textContent = totalMoves;
  completedBoxesElement.textContent = completedBoxes;
  turnIndicator.textContent = `${getPlayerName(currentPlayer)}'s Turn`;

  playerOneCard.classList.toggle("active-player", currentPlayer === 1);
  playerTwoCard.classList.toggle("active-player", currentPlayer === 2);
  turnIndicator.style.color = currentPlayer === 1 ? "var(--blue)" : "var(--red)";
}

function checkForWinner() {
  if (completedBoxes < totalBoxes || totalMoves < totalLines) {
    return;
  }

  gameOver = true;

  if (scores[1] > scores[2]) {
    gameMessage.textContent = `Player 1 wins ${scores[1]} to ${scores[2]}.`;
  } else if (scores[2] > scores[1]) {
    gameMessage.textContent = `Player 2 wins ${scores[2]} to ${scores[1]}.`;
  } else {
    gameMessage.textContent = `It's a draw at ${scores[1]} boxes each.`;
  }
}

function startNewGame() {
  resetGameState();
  buildBoard();
  updateDisplay();
  gameMessage.textContent = "Click any open line between adjacent dots to begin.";
}

restartButton.addEventListener("click", startNewGame);

startNewGame();
