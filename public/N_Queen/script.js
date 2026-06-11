/**
 * N-Queens Interactive Game
 * Place N queens on an N×N board so that no two queens attack each other.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM references ────────────────────────────────────────────────
  const startGameButton = document.getElementById('startGame');
  const resetGameButton = document.getElementById('resetGame');
  const toggleMarkButton = document.getElementById('toggleMark');
  const showInvalidCheckbox = document.getElementById('showInvalid');
  const hintButton = document.getElementById('hintBtn');
  const solveButton = document.getElementById('solveBtn');
  const boardInput = document.getElementById('boardSize');
  const boardEl = document.getElementById('gameBoard');
  const messageEl = document.getElementById('message');
  const timerLabel = document.getElementById('timer');
  const moveLabel = document.getElementById('moveCount');
  const queenCountLabel = document.getElementById('queenCount');
  const queenTargetLabel = document.getElementById('queenTarget');

  // ── State ─────────────────────────────────────────────────────────
  let boardSize = 4;
  let queens = []; // Array of [row, col] pairs
  let marks = new Set(); // Set of "row,col" strings
  let moveCount = 0;
  let timerSeconds = 0;
  let timerId = null;
  let markingMode = false;
  let showAttacked = false;
  let gameActive = false;
  let solving = false;

  // ── Game lifecycle ────────────────────────────────────────────────

  /** Initialises a fresh game with the chosen board size. */
  const startGame = () => {
    const size = parseInt(boardInput.value, 10);
    if (isNaN(size) || size < 4 || size > 12) {
      showMsg('Board size must be between 4 and 12.', 'error');
      return;
    }

    boardSize = size;
    queens = [];
    marks.clear();
    moveCount = 0;
    timerSeconds = 0;
    markingMode = false;
    showAttacked = false;
    gameActive = true;
    solving = false;

    queenTargetLabel.textContent = String(boardSize);
    showInvalidCheckbox.checked = false;
    toggleMarkButton.textContent = 'Mark Cells';
    toggleMarkButton.classList.remove('is-active');

    buildGrid();
    setControls(true);
    renderBoard();
    updateStatus();
    startTimer();
    showMsg(`Place ${boardSize} queens so none attack each other.`);
  };

  /** Clears all queens and marks without changing board size. */
  const resetBoard = () => {
    if (!gameActive || solving) return;
    queens = [];
    marks.clear();
    moveCount = 0;
    timerSeconds = 0;
    markingMode = false;
    toggleMarkButton.textContent = 'Mark Cells';
    toggleMarkButton.classList.remove('is-active');
    renderBoard();
    updateStatus();
    startTimer();
    showMsg('Board cleared.');
  };

  // ── Grid construction ─────────────────────────────────────────────

  /** Builds the DOM grid for the current boardSize. */
  const buildGrid = () => {
    boardEl.innerHTML = '';

    // Scale cell size based on board size for readability
    const cellPx = boardSize <= 5 ? 72 : boardSize <= 8 ? 60 : 48;
    boardEl.style.gridTemplateColumns = `repeat(${boardSize}, ${cellPx}px)`;
    boardEl.style.setProperty('--cell-size', `${cellPx}px`);

 fix-nqueen-input-validation
function startGame() {
    const n = parseInt(boardInput.value);
    if (isNaN(n) || n < 4 || n > 12) {
    alert("Please enter a valid board size between 4 and 12.");
    return;
}
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const sq = document.createElement('button');
        sq.type = 'button';
        sq.className = `square ${(r + c) % 2 === 0 ? '' : 'square--dark'}`.trim();
        sq.dataset.row = String(r);
        sq.dataset.col = String(c);
        sq.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}`);
        sq.addEventListener('click', () => handleClick(r, c));
        boardEl.appendChild(sq);
      }
    }
  };
 Main

  // ── Click handler ─────────────────────────────────────────────────

  /**
   * Handles a click on a board square.
   * - Clicking a queen removes it.
   * - In mark mode, toggles an unsafe mark.
   * - Otherwise attempts to place a queen.
   */
  const handleClick = (row, col) => {
    if (!gameActive || solving) return;
    const key = `${row},${col}`;

    // Remove existing queen
    const qi = queens.findIndex(([r, c]) => r === row && c === col);
    if (qi >= 0) {
      queens.splice(qi, 1);
      moveCount++;
      renderBoard();
      showMsg('Queen removed.');
      return;
    }

    // Toggle unsafe mark
    if (markingMode) {
      if (marks.has(key)) {
        marks.delete(key);
      } else {
        marks.add(key);
      }
      moveCount++;
      renderBoard();
      return;
    }

    // Attempt placement
    if (!isSafe(row, col)) {
      flashConflictingQueens(row, col);
      showMsg('A queen already attacks this cell.', 'error');
      return;
    }

    queens.push([row, col]);
    marks.delete(key);
    moveCount++;
    renderBoard();

    if (queens.length === boardSize) {
      showMsg(`Solved! All ${boardSize} queens placed.`, 'success');
      stopTimer();
    } else {
      showMsg('');
    }
  };

  // ── Board rendering ───────────────────────────────────────────────

  /** Re-renders every square based on current state. */
  const renderBoard = () => {
    const attackedCells = showAttacked ? getAttackedCells() : new Set();

    boardEl.querySelectorAll('.square').forEach((sq) => {
      const r = Number(sq.dataset.row);
      const c = Number(sq.dataset.col);
      const key = `${r},${c}`;
      const hasQueen = queens.some(([qr, qc]) => qr === r && qc === c);
      const isAttacked = attackedCells.has(key) && !hasQueen;
      const isMarked = marks.has(key) && !hasQueen;

      sq.classList.toggle('square--attacked', isAttacked);
      sq.classList.toggle('square--marked', isMarked);
      sq.classList.remove('square--hint', 'square--conflict');
      sq.innerHTML = '';

      if (hasQueen) {
        const colorClass = sq.classList.contains('square--dark') ? 'queen--on-dark' : 'queen--on-light';
        sq.innerHTML = `<span class="queen ${colorClass}" aria-hidden="true">&#9819;</span>`;
      } else if (isMarked) {
        sq.innerHTML = '<span class="mark" aria-hidden="true">&#10005;</span>';
      }
    });

    updateStatus();
  };

  /**
   * Briefly outlines queens that attack the given cell,
   * giving visual feedback when an invalid placement is attempted.
   */
  const flashConflictingQueens = (row, col) => {
    queens.forEach(([qr, qc]) => {
      const attacks =
        qr === row || qc === col || Math.abs(qr - row) === Math.abs(qc - col);
      if (!attacks) return;

      const sq = boardEl.querySelector(`.square[data-row='${qr}'][data-col='${qc}']`);
      if (sq) {
        sq.classList.add('square--conflict');
        setTimeout(() => sq.classList.remove('square--conflict'), 600);
      }
    });
  };

  // ── Hint ──────────────────────────────────────────────────────────

  /**
   * Shows a hint by running the backtracking solver on the current
   * partial state and highlighting the next recommended cell.
   * This ensures the hint is always part of a real solution.
   */
  const showHint = () => {
    if (!gameActive || solving) return;

    if (!isBoardValid()) {
      flashAllConflicts();
      showMsg('Resolve the conflict before asking for a hint.', 'error');
      return;
    }

    const solution = solveFromPartial(queens);
    if (!solution) {
      showMsg('No solution from this position — try removing a queen.', 'error');
      return;
    }

    // Find the lowest-indexed row that still needs a queen
    for (let r = 0; r < boardSize; r++) {
      if (queens.some(([qr]) => qr === r)) continue;

      const c = solution[r];
      const sq = boardEl.querySelector(`.square[data-row='${r}'][data-col='${c}']`);
      if (sq) {
        sq.classList.add('square--hint');
        setTimeout(() => sq.classList.remove('square--hint'), 1800);
      }
      showMsg(`Hint: row ${r + 1}, column ${c + 1}.`);
      return;
    }
  };

  // ── Auto-solve ────────────────────────────────────────────────────

  /**
   * Completes the board from the current partial state using backtracking.
   * Existing valid queens are kept; missing queens are animated in row order.
   */
  const autoSolve = async () => {
    if (!gameActive || solving) return;

    if (!isBoardValid()) {
      showMsg('Resolve conflicts before auto-solving.', 'error');
      return;
    }

    const solution = solveFromPartial(queens);
    if (!solution) {
      showMsg('No solution from this position — try resetting.', 'error');
      return;
    }

    try {
      solving = true;
      setControls(false);
      showMsg('Solving…');

      for (let r = 0; r < boardSize; r++) {
        // Skip rows that already have a queen placed by the user
        if (queens.some(([qr]) => qr === r)) continue;
        await sleep(220);
        queens.push([r, solution[r]]);
        renderBoard();
      }

      showMsg('Solved!', 'success');
      stopTimer();
    } catch (error) {
      console.error('Auto-solve failed:', error);
      showMsg('Something went wrong. Please try again.', 'error');
    } finally {
      solving = false;
      // Restore controls: keep game active but disable solve/hint since board is complete
      resetGameButton.disabled = false;
      toggleMarkButton.disabled = false;
      hintButton.disabled = true;
      solveButton.disabled = true;
      boardInput.disabled = true;
    }
  };

  // ── Backtracking solver ───────────────────────────────────────────

  /**
   * Solves the N-Queens problem from a partial board state.
   *
   * Uses bitmasked backtracking:
   * - `cols`  tracks which columns are occupied.
   * - `diag1` tracks occupied "/" diagonals (row - col + offset).
   * - `diag2` tracks occupied "\" diagonals (row + col).
   *
   * @param {Array<[number, number]>} fixed - Already-placed queens.
   * @returns {number[]|null} Column index per row, or null if unsolvable.
   */
  const solveFromPartial = (fixed) => {
    const cols = new Array(boardSize).fill(false);
    const diag1 = new Array(boardSize * 2).fill(false);
    const diag2 = new Array(boardSize * 2).fill(false);
    const result = new Array(boardSize).fill(null);

    // Pre-fill constraints from already-placed queens
    for (const [r, c] of fixed) {
      if (cols[c] || diag1[r - c + boardSize] || diag2[r + c]) {
        return null; // Fixed queens already conflict
      }
      result[r] = c;
      cols[c] = true;
      diag1[r - c + boardSize] = true;
      diag2[r + c] = true;
    }

    const backtrack = (row) => {
      if (row === boardSize) return true;
      if (result[row] !== null) return backtrack(row + 1); // Row already filled

      for (let c = 0; c < boardSize; c++) {
        const d1 = row - c + boardSize;
        const d2 = row + c;
        if (cols[c] || diag1[d1] || diag2[d2]) continue;

        // Place
        result[row] = c;
        cols[c] = true;
        diag1[d1] = true;
        diag2[d2] = true;

        if (backtrack(row + 1)) return true;

        // Undo
        result[row] = null;
        cols[c] = false;
        diag1[d1] = false;
        diag2[d2] = false;
      }

      return false;
    };

    return backtrack(0) ? result : null;
  };

  // ── Board logic helpers ───────────────────────────────────────────

  /**
   * Returns true if placing a queen at (row, col) would not conflict
   * with any already-placed queen.
   */
  const isSafe = (row, col) =>
    !queens.some(
      ([r, c]) => r === row || c === col || Math.abs(r - row) === Math.abs(c - col)
    );

  /** Returns true if no two queens on the board attack each other. */
  const isBoardValid = () => {
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const [r1, c1] = queens[i];
        const [r2, c2] = queens[j];
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          return false;
        }
      }
    }
    return true;
  };

  /** Returns a Set of "row,col" strings for all cells attacked by placed queens. */
  const getAttackedCells = () => {
    const attacked = new Set();
    queens.forEach(([qr, qc]) => {
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (r === qr && c === qc) continue;
          if (r === qr || c === qc || Math.abs(qr - r) === Math.abs(qc - c)) {
            attacked.add(`${r},${c}`);
          }
        }
      }
    });
    return attacked;
  };

  /** Flashes all queens that are in conflict with another queen. */
  const flashAllConflicts = () => {
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const [r1, c1] = queens[i];
        const [r2, c2] = queens[j];
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          [[r1, c1], [r2, c2]].forEach(([r, c]) => {
            const sq = boardEl.querySelector(`.square[data-row='${r}'][data-col='${c}']`);
            if (sq) {
              sq.classList.add('square--conflict');
              setTimeout(() => sq.classList.remove('square--conflict'), 900);
            }
          });
        }
      }
    }
  };

  // ── UI helpers ────────────────────────────────────────────────────

  /** Enables or disables all game controls based on active state. */
  const setControls = (active) => {
    resetGameButton.disabled = !active;
    toggleMarkButton.disabled = !active;
    showInvalidCheckbox.disabled = !active;
    hintButton.disabled = !active;
    solveButton.disabled = !active;
    boardInput.disabled = active;
  };

  /** Toggles between queen-placement and cell-marking modes. */
  const toggleMarkMode = () => {
    if (!gameActive || solving) return;
    markingMode = !markingMode;
    toggleMarkButton.textContent = markingMode ? 'Place Queens' : 'Mark Cells';
    toggleMarkButton.classList.toggle('is-active', markingMode);
    showMsg(markingMode ? 'Click cells to mark them unsafe.' : '');
  };

  /**
   * Updates the message bar.
   * @param {string} text
   * @param {'error'|'success'|''} type
   */
  const showMsg = (text, type = '') => {
    messageEl.textContent = text;
    messageEl.className = `message${type ? ` message--${type}` : ''}`;
  };

  /** Syncs the status bar with current game state. */
  const updateStatus = () => {
    moveLabel.textContent = String(moveCount);
    queenCountLabel.textContent = String(queens.length);
    timerLabel.textContent = formatTime(timerSeconds);
  };

  // ── Timer ─────────────────────────────────────────────────────────

  const startTimer = () => {
    clearInterval(timerId);
    timerSeconds = 0;
    timerLabel.textContent = formatTime(0);
    timerId = setInterval(() => {
      timerSeconds++;
      timerLabel.textContent = formatTime(timerSeconds);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
  };

  /** Formats seconds as MM:SS. */
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /** Returns a Promise that resolves after the given number of milliseconds. */
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ── Event listeners ───────────────────────────────────────────────
  // Registered after all function declarations to avoid
  // ReferenceError from const arrow functions not being hoisted.
  startGameButton.addEventListener('click', startGame);
  resetGameButton.addEventListener('click', resetBoard);
  toggleMarkButton.addEventListener('click', toggleMarkMode);
  showInvalidCheckbox.addEventListener('change', (e) => {
    showAttacked = e.target.checked;
    renderBoard();
  });
  hintButton.addEventListener('click', showHint);
  solveButton.addEventListener('click', autoSolve);
});