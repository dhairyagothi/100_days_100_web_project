const diskSelect = document.getElementById("disk-count");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const stepButton = document.getElementById("step-button");
const autoButton = document.getElementById("auto-button");
const moveCountElement = document.getElementById("move-count");
const minimumMovesElement = document.getElementById("minimum-moves");
const messageElement = document.getElementById("message");
const towerButtons = Array.from(document.querySelectorAll(".tower-zone"));
const towerStacks = [
  document.getElementById("tower-0"),
  document.getElementById("tower-1"),
  document.getElementById("tower-2")
];

const diskColors = {
  1: "#df5b47",
  2: "#efb51c",
  3: "#5abc61",
  4: "#347bd6",
  5: "#834fde",
  6: "#ff7f50",
  7: "#20b9b0",
  8: "#ec4899"
};

let towers = [];
let diskCount = 5;
let moveCount = 0;
let selectedTower = null;
let solutionMoves = [];
let solutionIndex = 0;
let isAutoRunning = false;
let autoTimer = null;

function minimumMovesFor(count) {
  return Math.pow(2, count) - 1;
}

function setMessage(text, type = "") {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`.trim();
}

function buildSolution(count, from, to, helper) {
  // Recursive idea:
  // 1. Move the top n-1 disks to the helper tower.
  // 2. Move the largest disk to the destination tower.
  // 3. Move the n-1 helper disks onto the largest disk.
  if (count === 0) {
    return;
  }

  buildSolution(count - 1, from, helper, to);
  solutionMoves.push([from, to]);
  buildSolution(count - 1, helper, to, from);
}

function prepareSolution() {
  solutionMoves = [];
  solutionIndex = 0;
  buildSolution(diskCount, 0, 2, 1);
}

function updateStats() {
  moveCountElement.textContent = moveCount;
  minimumMovesElement.textContent = minimumMovesFor(diskCount);
}

function renderTowers() {
  towerStacks.forEach((stack, towerIndex) => {
    stack.innerHTML = "";

    towers[towerIndex].forEach((disk) => {
      const diskElement = document.createElement("span");
      const width = 34 + disk * (58 / diskCount);
      diskElement.className = "disk";
      diskElement.textContent = disk;
      diskElement.style.setProperty("--disk-width", `${width}%`);
      diskElement.style.setProperty("--disk-color", diskColors[disk]);
      stack.appendChild(diskElement);
    });
  });

  towerButtons.forEach((button, index) => {
    button.classList.toggle("selected", selectedTower === index);
  });
}

function clearAutoTimer() {
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
}

function setAutoControls(running) {
  isAutoRunning = running;
  diskSelect.disabled = running;
  startButton.disabled = running;
  resetButton.disabled = false;
  stepButton.disabled = running;
  autoButton.disabled = running;
  towerButtons.forEach((button) => {
    button.disabled = running;
  });
}

function startGame() {
  clearAutoTimer();
  setAutoControls(false);
  diskCount = Number(diskSelect.value);
  towers = [
    Array.from({ length: diskCount }, (_, index) => diskCount - index),
    [],
    []
  ];
  moveCount = 0;
  selectedTower = null;
  prepareSolution();
  updateStats();
  renderTowers();
  setMessage("Click a tower to pick up the top disk.");
}

function isMoveValid(from, to) {
  const movingDisk = towers[from][towers[from].length - 1];
  const targetDisk = towers[to][towers[to].length - 1];
  return movingDisk !== undefined && (targetDisk === undefined || movingDisk < targetDisk);
}

function showInvalidMove(towerIndex) {
  const tower = towerButtons[towerIndex];
  tower.classList.add("invalid");
  setTimeout(() => tower.classList.remove("invalid"), 280);
}

function hasWon() {
  return towers[2].length === diskCount;
}

function moveDisk(from, to, showFeedback = true) {
  if (from === to || !isMoveValid(from, to)) {
    if (showFeedback) {
      showInvalidMove(to);
      setMessage("Invalid move: a larger disk cannot sit on a smaller disk.", "error");
    }
    return false;
  }

  const disk = towers[from].pop();
  towers[to].push(disk);
  moveCount += 1;
  selectedTower = null;
  updateStats();
  renderTowers();

  if (hasWon()) {
    setMessage(`You solved it in ${moveCount} moves. Minimum possible: ${minimumMovesFor(diskCount)}.`, "win");
  } else if (showFeedback) {
    setMessage(`Moved disk ${disk} from Tower ${String.fromCharCode(65 + from)} to Tower ${String.fromCharCode(65 + to)}.`);
  }

  return true;
}

function handleTowerClick(event) {
  if (isAutoRunning) {
    return;
  }

  const towerIndex = Number(event.currentTarget.dataset.tower);

  if (selectedTower === null) {
    if (towers[towerIndex].length === 0) {
      showInvalidMove(towerIndex);
      setMessage("Choose a tower that has a disk to move.", "error");
      return;
    }

    selectedTower = towerIndex;
    renderTowers();
    setMessage(`Tower ${String.fromCharCode(65 + towerIndex)} selected. Choose a destination.`);
    return;
  }

  moveDisk(selectedTower, towerIndex);
  selectedTower = null;
  renderTowers();
}

function syncSolutionIndex() {
  while (solutionIndex < solutionMoves.length) {
    const [from, to] = solutionMoves[solutionIndex];
    if (isMoveValid(from, to)) {
      return;
    }
    solutionIndex += 1;
  }
}

function stepSolution(showFeedback = true) {
  if (hasWon()) {
    setMessage("Puzzle already solved. Press Start or Reset to play again.", "win");
    return false;
  }

  selectedTower = null;
  syncSolutionIndex();

  if (solutionIndex >= solutionMoves.length) {
    setMessage("No solution step is available from this position. Press Reset to restart.", "error");
    renderTowers();
    return false;
  }

  const [from, to] = solutionMoves[solutionIndex];
  solutionIndex += 1;
  return moveDisk(from, to, showFeedback);
}

function runAuto() {
  if (!stepSolution(false)) {
    setAutoControls(false);
    return;
  }

  if (hasWon()) {
    setAutoControls(false);
    return;
  }

  autoTimer = setTimeout(runAuto, 520);
}

function startAuto() {
  if (hasWon()) {
    setMessage("Puzzle already solved. Press Start or Reset to play again.", "win");
    return;
  }

  setMessage("Auto solving...");
  setAutoControls(true);
  runAuto();
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", startGame);
stepButton.addEventListener("click", stepSolution);
autoButton.addEventListener("click", startAuto);
towerButtons.forEach((button) => button.addEventListener("click", handleTowerClick));

startGame();
