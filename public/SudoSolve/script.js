const SIZE = 9;
const BOX = 3;
const EMPTY = 0;
const CLUES = {
  easy: 45,
  medium: 36,
  hard: 30,
  extreme: 24
};

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const boardElement = document.getElementById("board");
const numberPad = document.getElementById("number-pad");
const timerElement = document.getElementById("timer");
const levelLabel = document.getElementById("level-label");
const message = document.getElementById("message");
const startButton = document.getElementById("start-game");
const solveButton = document.getElementById("solve-btn");
const pauseSolveButton = document.getElementById("pause-solve-btn");
const hintButton = document.getElementById("hint-btn");
const speedControl = document.getElementById("speed-control");
const speedLabel = document.getElementById("speed-label");
const newPuzzleButton = document.getElementById("new-puzzle-btn");
const menuButton = document.getElementById("menu-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-option");

let selectedDifficulty = "easy";
let puzzle = [];
let solution = [];
let cells = [];
let selectedCell = null;
let timerId = null;
let seconds = 0;
let solved = false;
let solving = false;
let solverPaused = false;
let solverCancelled = false;
let solverRunId = 0;
let solveDelay = Number(speedControl.value);
const mobileInputQuery = window.matchMedia("(max-width: 860px), (pointer: coarse)");

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((option) => {
      option.classList.remove("active");
      option.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    selectedDifficulty = button.dataset.difficulty;
  });
});

startButton.addEventListener("click", launchSelectedGame);

function launchSelectedGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startGame(selectedDifficulty);
}

newPuzzleButton.addEventListener("click", () => {
  cancelSolver();
  startGame(selectedDifficulty);
});

menuButton.addEventListener("click", () => {
  cancelSolver();
  stopTimer();
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

solveButton.addEventListener("click", startVisualSolve);

pauseSolveButton.addEventListener("click", () => {
  if (!solving) return;
  solverPaused = !solverPaused;
  pauseSolveButton.textContent = solverPaused ? "Start" : "Pause";
  message.textContent = solverPaused ? "Solver paused." : "Solver running...";
});

hintButton.addEventListener("click", useHint);

speedControl.addEventListener("input", () => {
  solveDelay = Number(speedControl.value);
  speedLabel.textContent = `${solveDelay} ms`;
});

mobileInputQuery.addEventListener("change", updateCellInputMode);

function startGame(difficulty) {
  selectedDifficulty = difficulty;
  levelLabel.textContent = capitalize(difficulty);
  message.textContent = "";
  solved = false;
  solving = false;
  solverPaused = false;
  solverCancelled = false;
  solverRunId += 1;
  selectedCell = null;
  seconds = 0;
  updateTimer();
  updateSolverControls();

  const generated = generatePuzzle(CLUES[difficulty]);
  puzzle = generated.puzzle;
  solution = generated.solution;
  renderBoard();
  startTimer();
}

function renderBoard() {
  boardElement.innerHTML = "";
  cells = [];

  puzzle.flat().forEach((value, index) => {
    const input = document.createElement("input");
    input.className = "cell";
    input.type = "text";
    input.maxLength = 1;
    input.dataset.fixed = value !== EMPTY ? "true" : "false";
    input.inputMode = shouldUseTouchPadOnly() ? "none" : "numeric";
    input.setAttribute("aria-label", `Row ${Math.floor(index / SIZE) + 1}, Column ${(index % SIZE) + 1}`);

    if (value !== EMPTY) {
      input.value = value;
      input.classList.add("fixed");
    }

    input.readOnly = value !== EMPTY || shouldUseTouchPadOnly();
    input.addEventListener("pointerdown", (event) => handleCellPointerDown(event, input));
    input.addEventListener("touchstart", (event) => handleCellTouchStart(event, input), { passive: false });
    input.addEventListener("click", () => {
      if (shouldUseTouchPadOnly()) selectCell(input);
    });
    input.addEventListener("focus", () => selectCell(input));
    input.addEventListener("input", () => handleInput(input));
    input.addEventListener("keydown", (event) => handleKeydown(event, input));
    boardElement.appendChild(input);
    cells.push(input);
  });

  renderNumberPad();
}

function renderNumberPad() {
  numberPad.innerHTML = "";
  for (let number = 1; number <= SIZE; number += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = number;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      fillSelectedCell(String(number));
    });
    button.addEventListener("click", () => fillSelectedCell(String(number)));
    numberPad.appendChild(button);
  }

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.textContent = "Clear";
  clearButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    fillSelectedCell("");
  });
  clearButton.addEventListener("click", () => fillSelectedCell(""));
  numberPad.appendChild(clearButton);
}

function shouldUseTouchPadOnly() {
  return mobileInputQuery.matches;
}

function updateCellInputMode() {
  cells.forEach((cell) => {
    const isFixed = cell.dataset.fixed === "true";
    cell.readOnly = isFixed || shouldUseTouchPadOnly();
    cell.inputMode = shouldUseTouchPadOnly() ? "none" : "numeric";
    if (shouldUseTouchPadOnly() && document.activeElement === cell) {
      cell.blur();
    }
  });
}

function handleCellPointerDown(event, input) {
  if (!shouldUseTouchPadOnly()) return;
  event.preventDefault();
  selectCell(input);
}

function handleCellTouchStart(event, input) {
  if (!shouldUseTouchPadOnly()) return;
  event.preventDefault();
  selectCell(input);
}

function selectCell(input) {
  cells.forEach((cell) => cell.classList.remove("selected"));
  selectedCell = input;
  input.classList.add("selected");
}

function handleInput(input) {
  const cleanValue = input.value.replace(/[^1-9]/g, "").slice(-1);
  input.value = cleanValue;
  validateBoard();
  checkWin();
}

function fillSelectedCell(value) {
  if (!selectedCell || selectedCell.dataset.fixed === "true" || solved) return;
  const resumedManualPlay = solving && solverPaused;
  if (solving && !solverPaused) return;
  if (resumedManualPlay) {
    cancelSolver();
  }
  selectedCell.value = value;
  validateBoard();
  checkWin();
  if (resumedManualPlay && !solved) {
    message.textContent = "Solver stopped. You can continue manually.";
  }
  if (!shouldUseTouchPadOnly()) {
    selectedCell.focus();
  }
}

function handleKeydown(event, input) {
  const index = cells.indexOf(input);
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const movement = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  };

  if (event.key === "Backspace" || event.key === "Delete") {
    if (input.dataset.fixed !== "true" && (!solving || solverPaused)) {
      if (solving && solverPaused) {
        cancelSolver();
      }
      input.value = "";
      validateBoard();
    }
    return;
  }

  if (!movement[event.key]) return;
  event.preventDefault();
  const [rowDelta, colDelta] = movement[event.key];
  const nextRow = Math.min(SIZE - 1, Math.max(0, row + rowDelta));
  const nextCol = Math.min(SIZE - 1, Math.max(0, col + colDelta));
  cells[nextRow * SIZE + nextCol].focus();
}

function validateBoard() {
  cells.forEach((cell) => cell.classList.remove("conflict"));

  for (let index = 0; index < cells.length; index += 1) {
    const value = cells[index].value;
    if (!value) continue;

    for (const peerIndex of getPeerIndexes(index)) {
      if (cells[peerIndex].value === value) {
        cells[index].classList.add("conflict");
        cells[peerIndex].classList.add("conflict");
      }
    }
  }
}

function useHint() {
  if (solved || solving) return;

  validateBoard();
  if (cells.some((cell) => cell.classList.contains("conflict"))) {
    message.textContent = "Fix highlighted conflicts before using a hint.";
    return;
  }

  const board = getBoardFromCells();
  const hintTarget = findBestEmptyCell(board);
  if (!hintTarget) {
    checkWin();
    return;
  }

  const solvedBoard = cloneBoard(board);
  if (!solveBoard(solvedBoard)) {
    message.textContent = "No valid hint is available from the current entries.";
    return;
  }

  const cell = cells[hintTarget.row * SIZE + hintTarget.col];
  cell.value = solvedBoard[hintTarget.row][hintTarget.col];
  cell.classList.add("hint");
  selectCell(cell);
  validateBoard();
  checkWin();
  if (!solved) {
    message.textContent = "Hint added.";
    setTimeout(() => cell.classList.remove("hint"), 900);
  }
}

function checkWin() {
  const hasEmpty = cells.some((cell) => !cell.value);
  const hasConflict = cells.some((cell) => cell.classList.contains("conflict"));
  if (hasEmpty || hasConflict || solved) return;

  const matchesSolution = cells.every((cell, index) => Number(cell.value) === solution[Math.floor(index / SIZE)][index % SIZE]);
  if (!matchesSolution) return;

  solved = true;
  stopTimer();
  message.textContent = `Congratulations! Solved in ${timerElement.textContent}.`;
}

async function startVisualSolve() {
  if (solved || solving) return;

  validateBoard();
  if (cells.some((cell) => cell.classList.contains("conflict"))) {
    message.textContent = "Fix highlighted conflicts before starting the solver.";
    return;
  }

  const board = getBoardFromCells();
  if (!isBoardSolvableSeed(board)) {
    message.textContent = "This board has no valid solution from the current entries.";
    return;
  }

  solving = true;
  solverPaused = false;
  solverCancelled = false;
  const currentRunId = solverRunId;
  message.textContent = "Solver running...";
  stopTimer();
  updateSolverControls();

  const success = await visualBacktrack(board, currentRunId);
  if (solverCancelled || currentRunId !== solverRunId) return;

  solving = false;
  solved = success;
  updateSolverControls();
  cells.forEach((cell) => cell.classList.remove("solving"));
  validateBoard();
  message.textContent = success ? "Solved by smart backtracking." : "This board cannot be solved.";
}

async function visualBacktrack(board, runId) {
  if (solverCancelled || runId !== solverRunId) return false;

  const nextCell = findBestEmptyCell(board);
  if (!nextCell) return true;

  const { row, col, candidates } = nextCell;
  const cell = cells[row * SIZE + col];

  for (const number of candidates) {
    await waitForSolver(runId);
    if (solverCancelled || runId !== solverRunId) return false;

    board[row][col] = number;
    cell.value = number;
    cell.classList.add("solving");
    await wait(solveDelay);

    if (await visualBacktrack(board, runId)) return true;

    await waitForSolver(runId);
    if (solverCancelled || runId !== solverRunId) return false;

    board[row][col] = EMPTY;
    cell.value = "";
    cell.classList.remove("solving");
    await wait(Math.max(10, solveDelay / 2));
  }

  cell.classList.remove("solving");
  return false;
}

async function waitForSolver(runId) {
  while (solverPaused && !solverCancelled && runId === solverRunId) {
    await wait(80);
  }
}

function cancelSolver() {
  solverCancelled = true;
  solving = false;
  solverPaused = false;
  solverRunId += 1;
  updateSolverControls();
}

function updateSolverControls() {
  solveButton.disabled = solved || solving;
  pauseSolveButton.disabled = !solving;
  hintButton.disabled = solved || solving;
  pauseSolveButton.textContent = solverPaused ? "Start" : "Pause";
}

function getBoardFromCells() {
  return Array.from({ length: SIZE }, (_, row) => (
    Array.from({ length: SIZE }, (_, col) => Number(cells[row * SIZE + col].value) || EMPTY)
  ));
}

function isBoardSolvableSeed(board) {
  const testBoard = cloneBoard(board);
  return solveBoard(testBoard);
}

function generatePuzzle(clueCount) {
  let bestPuzzle = null;
  let bestSolution = null;
  let bestClueCount = SIZE * SIZE;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const fullBoard = createEmptyBoard();
    solveBoard(fullBoard, true);
    const puzzleBoard = cloneBoard(fullBoard);
    const positions = shuffle([...Array(SIZE * SIZE).keys()]);

    for (const position of positions) {
      if (countClues(puzzleBoard) <= clueCount) break;

      const row = Math.floor(position / SIZE);
      const col = position % SIZE;
      const backup = puzzleBoard[row][col];
      puzzleBoard[row][col] = EMPTY;

      if (countSolutions(cloneBoard(puzzleBoard), 2) !== 1) {
        puzzleBoard[row][col] = backup;
      }
    }

    const currentClueCount = countClues(puzzleBoard);
    if (currentClueCount < bestClueCount) {
      bestPuzzle = puzzleBoard;
      bestSolution = fullBoard;
      bestClueCount = currentClueCount;
    }

    if (currentClueCount <= clueCount) {
      return {
        puzzle: puzzleBoard,
        solution: fullBoard
      };
    }
  }

  return {
    puzzle: bestPuzzle,
    solution: bestSolution
  };
}

function solveBoard(board, randomize = false) {
  const emptyCell = randomize ? findEmptyCell(board) : findBestEmptyCell(board);
  if (!emptyCell) return true;

  const row = Array.isArray(emptyCell) ? emptyCell[0] : emptyCell.row;
  const col = Array.isArray(emptyCell) ? emptyCell[1] : emptyCell.col;
  const numbers = randomize ? shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]) : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (const number of numbers) {
    if (isValidMove(board, row, col, number)) {
      board[row][col] = number;
      if (solveBoard(board, randomize)) return true;
      board[row][col] = EMPTY;
    }
  }

  return false;
}

function countSolutions(board, limit) {
  const emptyCell = findBestEmptyCell(board);
  if (!emptyCell) return 1;

  const { row, col } = emptyCell;
  let count = 0;

  for (let number = 1; number <= SIZE; number += 1) {
    if (isValidMove(board, row, col, number)) {
      board[row][col] = number;
      count += countSolutions(board, limit);
      board[row][col] = EMPTY;
      if (count >= limit) return count;
    }
  }

  return count;
}

function isValidMove(board, row, col, number) {
  for (let index = 0; index < SIZE; index += 1) {
    if (board[row][index] === number || board[index][col] === number) return false;
  }

  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      if (board[r][c] === number) return false;
    }
  }

  return true;
}

function findEmptyCell(board) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] === EMPTY) return [row, col];
    }
  }
  return null;
}

function findBestEmptyCell(board) {
  let best = null;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== EMPTY) continue;

      const candidates = [];
      for (let number = 1; number <= SIZE; number += 1) {
        if (isValidMove(board, row, col, number)) candidates.push(number);
      }

      if (!best || candidates.length < best.candidates.length) {
        best = { row, col, candidates };
      }

      if (best.candidates.length === 1) return best;
    }
  }

  return best;
}

function getPeerIndexes(index) {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const peers = new Set();

  for (let i = 0; i < SIZE; i += 1) {
    peers.add(row * SIZE + i);
    peers.add(i * SIZE + col);
  }

  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      peers.add(r * SIZE + c);
    }
  }

  peers.delete(index);
  return peers;
}

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function countClues(board) {
  return board.flat().filter(Boolean).length;
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    seconds += 1;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function updateTimer() {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  timerElement.textContent = `${minutes}:${remainingSeconds}`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
