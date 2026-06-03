alert("Scroll down to read the game rules!")
const boardSize = 5; // 5x5 grid
const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

const hintButton = document.getElementById("hint-button");
const MAX_HINTS = 3;
let moves = 0;
let hintsUsed = 0;
let hintCellIndex = -1;
let toastTimeout = null;

let grid = [];

// Create the game board
function createBoard() {
  board.innerHTML = ""; // Clear board
  grid = generateSolvableGrid();
  moves = 0;
  hintsUsed = 0;
  hintCellIndex = -1;
  hintButton.disabled = false;
  updateMoveCount();
  updatePips();
  clearToast();

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (!grid[row][col]) cell.classList.add("off"); // If off, add 'off' class
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(row, col));
      board.appendChild(cell);
    }
  }
}

// Toggle the clicked light and its neighbors
function toggleLights(row, col) {
  const directions = [
    [0, 0],     // Current cell
    [-1, 0],    // Top
    [1, 0],     // Bottom
    [0, -1],    // Left
    [0, 1],     // Right
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
      grid[newRow][newCol] = !grid[newRow][newCol];
      const cell = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
      cell.classList.toggle("off");
    }
  });

  checkWin();
}

// Check if the player has won
function checkWin() {
  const allOff = grid.every(row => row.every(light => !light));
  if (allOff) {
    showToast(`🎉 Solved in ${moves} moves!`, "success", 6000);
    hintButton.disabled = true;
  }
}

// 

function generateSolvableGrid() {
  let g = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
  const clicks = 8 + Math.floor(Math.random() * 8);
  for (let i = 0; i < clicks; i++) {
    const r = Math.floor(Math.random() * boardSize);
    const c = Math.floor(Math.random() * boardSize);
    applyToggle(g, r, c);
  }
  return g;
}

function applyToggle(g, row, col) {
  const directions = [[0,0],[-1,0],[1,0],[0,-1],[0,1]];
  directions.forEach(([dx, dy]) => {
    const nr = row + dx, nc = col + dy;
    if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize)
      g[nr][nc] = !g[nr][nc];
  });
}

function handleCellClick(row, col) {
  clearHint();
  toggleLights(row, col);
  moves++;
  updateMoveCount();
  checkWin();
}

function updateMoveCount() {
  document.getElementById("move-count").textContent = moves;
}

function updatePips() {
  for (let i = 0; i < MAX_HINTS; i++) {
    const pip = document.getElementById(`pip-${i}`);
    pip.className = "pip" + (i < hintsUsed ? " used" : "");
  }
}

function clearHint() {
  if (hintCellIndex >= 0) {
    const r = Math.floor(hintCellIndex / boardSize);
    const c = hintCellIndex % boardSize;
    const cell = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
    if (cell) cell.classList.remove("hint-glow");
  }
  hintCellIndex = -1;
  clearTimeout(hintButton._autoHide);
}

function showToast(msg, type = "info", duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show " + type;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.className = "toast";
    toast.textContent = "";
  }, duration);
}

function clearToast() {
  const toast = document.getElementById("toast");
  toast.className = "toast";
  toast.textContent = "";
  clearTimeout(toastTimeout);
}

function gf2Solve(flatBoard) {
  const n = boardSize * boardSize;
  const mat = [];
  for (let i = 0; i < n; i++) {
    const row = new Array(n + 1).fill(0);
    const r = Math.floor(i / boardSize), c = i % boardSize;
    row[i] = 1;
    if (r > 0)             row[i - boardSize] = 1;
    if (r < boardSize - 1) row[i + boardSize] = 1;
    if (c > 0)             row[i - 1] = 1;
    if (c < boardSize - 1) row[i + 1] = 1;
    row[n] = flatBoard[i] ? 1 : 0;
    mat.push(row);
  }
  const pivotCols = [];
  let pivotRow = 0;
  for (let col = 0; col < n && pivotRow < n; col++) {
    let found = -1;
    for (let r = pivotRow; r < n; r++) { if (mat[r][col] === 1) { found = r; break; } }
    if (found === -1) continue;
    [mat[pivotRow], mat[found]] = [mat[found], mat[pivotRow]];
    pivotCols.push(col);
    for (let r = 0; r < n; r++) {
      if (r !== pivotRow && mat[r][col] === 1)
        for (let j = 0; j <= n; j++) mat[r][j] ^= mat[pivotRow][j];
    }
    pivotRow++;
  }
  const solution = new Array(n).fill(0);
  pivotCols.forEach((col, i) => { solution[col] = mat[i][n]; });
  return solution;
}

function showHint() {
  if (hintsUsed >= MAX_HINTS) { showToast("No hints left!", "warn"); return; }
  if (grid.every(row => row.every(l => !l))) { showToast("Already solved!", "warn"); return; }
  const solution = gf2Solve(grid.flat());
  const candidates = solution.map((v, i) => v ? i : -1).filter(i => i >= 0);
  if (candidates.length === 0) { showToast("Try resetting.", "warn"); return; }
  clearHint();
  hintCellIndex = candidates[0];
  hintsUsed++;
  updatePips();
  const r = Math.floor(hintCellIndex / boardSize);
  const c = hintCellIndex % boardSize;
  document.querySelector(`[data-row='${r}'][data-col='${c}']`).classList.add("hint-glow");
  showToast("Hint: click the highlighted cell", "info");
  if (hintsUsed >= MAX_HINTS) hintButton.disabled = true;
  hintButton._autoHide = setTimeout(clearHint, 4000);
}

// Reset the game
resetButton.addEventListener("click", createBoard);

//show hint
hintButton.addEventListener("click", showHint);

// Initialize the game board
createBoard();
