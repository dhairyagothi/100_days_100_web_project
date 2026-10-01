// script.js - Epic Sliding Puzzle
let board = [];
let size = 4;
let emptyIndex = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let isSolved = false;
let isPaused = false;
let history = []; // For undo
let currentTheme = "dark";
let isImageMode = false;
let puzzleImage = null;
let showNumbers = true;

const bestScores = {};

// DOM Elements
const boardEl = document.getElementById("board");
const setupModal = new bootstrap.Modal(document.getElementById("setupModal"));

// Load from localStorage
function loadData() {
  const savedScores = localStorage.getItem("slidingBestScores");
  if (savedScores) Object.assign(bestScores, JSON.parse(savedScores));

  const savedTheme = localStorage.getItem("slidingTheme");
  if (savedTheme) {
    currentTheme = savedTheme;
    document.body.setAttribute("data-theme", currentTheme);
  }
}

function saveBestScores() {
  localStorage.setItem("slidingBestScores", JSON.stringify(bestScores));
}

// Format time
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Start Timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  seconds = 0;
  document.getElementById("timer").textContent = "00:00";
  timerInterval = setInterval(() => {
    if (!isPaused && !isSolved) {
      seconds++;
      document.getElementById("timer").textContent = formatTime(seconds);
    }
  }, 1000);
}

// Count inversions
function countInversions(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) count++;
    }
  }
  return count;
}

// Check solvability
function isSolvable(puzzle) {
  const inversions = countInversions(puzzle);
  if (size % 2 === 1) return inversions % 2 === 0;
  const emptyRow = Math.floor(puzzle.indexOf(0) / size);
  return (inversions + emptyRow) % 2 === 0;
}

// Generate random solvable puzzle
function generatePuzzle() {
  let puzzle;
  do {
    puzzle = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    puzzle.push(0);
    for (let i = puzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
    }
  } while (!isSolvable(puzzle));
  return puzzle;
}

// Create board UI
function createBoard() {
  boardEl.innerHTML = "";
  boardEl.className = `board size-${size}`;

  board.forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = index;

    if (value === 0) {
      tile.classList.add("empty");
    } else {
      if (isImageMode && puzzleImage) {
        const row = Math.floor((value - 1) / size);
        const col = (value - 1) % size;
        tile.style.backgroundImage = `url(${puzzleImage})`;
        tile.style.backgroundSize = `${size * 100}%`;
        tile.style.backgroundPosition = `${col * 100}% ${row * 100}%`;
      }
      if (showNumbers || !isImageMode) {
        tile.textContent = value;
      }
      tile.dataset.number = value;
    }

    tile.addEventListener("click", () => handleMove(index));
    boardEl.appendChild(tile);
  });
}

// Check adjacency
function isAdjacent(i1, i2) {
  const r1 = Math.floor(i1 / size),
    c1 = i1 % size;
  const r2 = Math.floor(i2 / size),
    c2 = i2 % size;
  return (
    (r1 === r2 && Math.abs(c1 - c2) === 1) ||
    (c1 === c2 && Math.abs(r1 - r2) === 1)
  );
}

// Move tile with animation
function handleMove(index) {
  if (isSolved || isPaused || !isAdjacent(index, emptyIndex)) return;

  // Save current state for undo
  history.push([...board]);
  if (history.length > 10) history.shift();

  const tiles = document.querySelectorAll(".tile");
  const movingTile = tiles[index];

  movingTile.classList.add("moving");

  // Swap
  [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];

  setTimeout(() => {
    createBoard();
    moves++;
    document.getElementById("moves").textContent = moves;
    emptyIndex = index;

    if (checkWin()) handleWin();
  }, 180);
}

// Check win condition
function checkWin() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return true;
}

// Win handler with confetti
function handleWin() {
  isSolved = true;
  stopTimer();

  // Save best score
  const best = bestScores[size] || { moves: Infinity, time: Infinity };
  if (moves < best.moves || (moves === best.moves && seconds < best.time)) {
    bestScores[size] = { moves, time: seconds };
    saveBestScores();
  }

  // Show win modal
  document.getElementById("win-moves").textContent = `${moves} moves`;
  document.getElementById("win-time").textContent = `in ${formatTime(seconds)}`;
  new bootstrap.Modal(document.getElementById("winModal")).show();

  // Confetti
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Update best score display
function updateBestDisplay() {
  const best = bestScores[size] || { moves: Infinity, time: Infinity };
  const text =
    best.moves === Infinity
      ? "—"
      : `${best.moves} moves (${formatTime(best.time)})`;
  document.getElementById("best-score").textContent = text;
}

// New Game (always fresh puzzle)
function newGame() {
  board = generatePuzzle();
  emptyIndex = board.indexOf(0);
  moves = 0;
  isSolved = false;
  history = [];
  isPaused = false;

  document.getElementById("moves").textContent = "0";
  document.getElementById("pause-overlay").classList.add("d-none");

  createBoard();
  updateBestDisplay();
  startTimer();
}

// Restart current board
function restartGame() {
  newGame(); // Always fresh puzzle as requested
}

// Undo
function undo() {
  if (history.length === 0 || isSolved) return;
  board = history.pop();
  emptyIndex = board.indexOf(0);
  moves = Math.max(0, moves - 1);
  document.getElementById("moves").textContent = moves;
  createBoard();
}

// Pause / Resume
function togglePause() {
  isPaused = !isPaused;
  document
    .getElementById("pause-overlay")
    .classList.toggle("d-none", !isPaused);
}

// Hint
function showHint() {
  if (isSolved || isPaused) return;
  const movable = [];
  for (let i = 0; i < board.length; i++) {
    if (isAdjacent(i, emptyIndex)) movable.push(i);
  }
  const tiles = document.querySelectorAll(".tile");
  movable.forEach((idx) => {
    tiles[idx].style.boxShadow = "0 0 0 6px #22c55e";
    setTimeout(() => {
      if (tiles[idx]) tiles[idx].style.boxShadow = "";
    }, 1200);
  });
}

// Theme Change
function changeTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("slidingTheme", theme);
}

// Initialize everything
function init() {
  loadData();

  // Setup Modal
  document.getElementById("start-game-btn").addEventListener("click", () => {
    size = parseInt(document.getElementById("setup-size").value);
    document.getElementById("size-select").value = size;
    setupModal.hide();
    newGame();
  });

  // Size select
  document.getElementById("size-select").addEventListener("change", (e) => {
    size = parseInt(e.target.value);
    newGame();
  });

  // Buttons
  document.getElementById("new-game").addEventListener("click", newGame);
  document.getElementById("restart").addEventListener("click", restartGame);
  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("pause").addEventListener("click", togglePause);
  document.getElementById("hint").addEventListener("click", showHint);
  document.getElementById("resume-btn").addEventListener("click", togglePause);

  // Modals
  document.getElementById("show-rules").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("rulesModal")).show();
  });
  document.getElementById("show-help").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("helpModal")).show();
  });
  document.getElementById("show-keyboard").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("keyboardModal")).show();
  });

  // Theme dropdown
  document.querySelectorAll(".theme-option").forEach((item) => {
    item.addEventListener("click", (e) => {
      changeTheme(e.target.dataset.theme);
    });
  });

  // Image Upload
  const imageInputs = ["image-upload", "image-upload-main"];
  imageInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            puzzleImage = ev.target.result;
            isImageMode = true;
            newGame();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // Keyboard Controls
  document.addEventListener("keydown", (e) => {
    if (isSolved || isPaused) return;

    let target = emptyIndex;
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        target -= size;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        target += size;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        target -= 1;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        target += 1;
        break;
      case "n":
      case "N":
        newGame();
        return;
      case "r":
      case "R":
        restartGame();
        return;
      case "p":
      case "P":
        togglePause();
        return;
      case "h":
      case "H":
        showHint();
        return;
      case "u":
      case "U":
        undo();
        return;
    }

    if (target >= 0 && target < size * size) {
      handleMove(target);
    }
  });

  // Play Again
  document.getElementById("play-again").addEventListener("click", newGame);

  // Show setup modal on start
  setupModal.show();
}

// Start the application
init();
