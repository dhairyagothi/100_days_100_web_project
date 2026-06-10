document.addEventListener('DOMContentLoaded', () => {
  const startGameButton = document.getElementById('startGame');
  const resetGameButton = document.getElementById('resetGame');
  const toggleMarkButton = document.getElementById('toggleMark');
  const showInvalidCheckbox = document.getElementById('showInvalid');
  const hintButton = document.getElementById('hintBtn');
  const solveButton = document.getElementById('solveBtn');
  const boardInput = document.getElementById('boardSize');
  const board = document.getElementById('gameBoard');
  const message = document.getElementById('message');
  const timerLabel = document.getElementById('timer');
  const moveLabel = document.getElementById('moveCount');
  const queenCountLabel = document.getElementById('queenCount');
  const queenTargetLabel = document.getElementById('queenTarget');

  let boardSize = 4;
  let queens = [];
  let marks = new Set();
  let moveCount = 0;
  let timerSeconds = 0;
  let timerId = null;
  let markingMode = false;
  let showInvalidCells = false;
  let gameActive = false;

  startGameButton.addEventListener('click', startGame);
  resetGameButton.addEventListener('click', resetBoard);
  toggleMarkButton.addEventListener('click', toggleMarkMode);
  showInvalidCheckbox.addEventListener('change', toggleInvalidView);
  hintButton.addEventListener('click', showHint);
  solveButton.addEventListener('click', autoSolve);

  function startGame() {
    const size = parseInt(boardInput.value, 10);
    if (isNaN(size) || size < 4 || size > 12) {
      showMessage('Choose a board size between 4 and 12.', true);
      return;
    }

    boardSize = size;
    queenTargetLabel.textContent = boardSize;

    queens = [];
    marks.clear();
    moveCount = 0;
    timerSeconds = 0;
    markingMode = false;
    gameActive = true;

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, var(--cell-size))`;
    const cellSize = boardSize <= 5 ? '108px' : boardSize <= 8 ? '78px' : '58px';
    board.style.setProperty('--cell-size', cellSize);

    for (let index = 0; index < boardSize * boardSize; index += 1) {
      const row = Math.floor(index / boardSize);
      const col = index % boardSize;
      const square = document.createElement('button');
      square.type = 'button';
      square.classList.add('square');
      square.dataset.row = row;
      square.dataset.col = col;
      square.dataset.index = index;
      square.setAttribute('aria-label', `Row ${row + 1} column ${col + 1}`);

      if ((row + col) % 2 === 0) {
        square.classList.add('light-tile');
      } else {
        square.classList.add('dark-tile');
      }

      square.addEventListener('click', () => handleSquareClick(row, col));

      board.appendChild(square);
    }

    updateControls();
    updateBoard();
    updateStatus();
    startTimer();
    showMessage('Game ready. Place the queens by clicking the cells.');
  }

  function resetBoard() {
    if (!gameActive) return;
    queens = [];
    marks.clear();
    moveCount = 0;
    timerSeconds = 0;
    markingMode = false;
    clearInterval(timerId);
    timerId = null;
    updateBoard();
    updateStatus();
    updateControls();
    showMessage('Board cleared. Start placing queens again.');
  }

  function updateControls() {
    const enabled = gameActive;
    resetGameButton.disabled = !enabled;
    toggleMarkButton.disabled = !enabled;
    showInvalidCheckbox.disabled = !enabled;
    hintButton.disabled = !enabled;
    solveButton.disabled = !enabled;
    boardInput.disabled = enabled;
    if (!enabled) {
      toggleMarkButton.textContent = 'Mark Unsafe Cells';
      showInvalidCheckbox.checked = false;
      markingMode = false;
      showInvalidCells = false;
    }
  }

  function handleSquareClick(row, col) {
    if (!gameActive) return;
    const positionKey = `${row},${col}`;

    const existingIndex = queens.findIndex(([qRow, qCol]) => qRow === row && qCol === col);
    if (existingIndex >= 0) {
      queens.splice(existingIndex, 1);
      moveCount += 1;
      showMessage('Queen removed.');
      updateBoard();
      return;
    }

    if (markingMode) {
      if (marks.has(positionKey)) {
        marks.delete(positionKey);
        showMessage('Unsafe mark removed.');
      } else {
        marks.add(positionKey);
        showMessage('Unsafe cell marked.');
      }
      moveCount += 1;
      updateBoard();
      return;
    }

    if (!isSafe(row, col)) {
      showMessage('Invalid placement! Queens attack this cell.', true);
      highlightAttackPath(row, col);
      return;
    }

    queens.push([row, col]);
    moveCount += 1;
    marks.delete(positionKey);
    showMessage('Queen placed successfully.');
    updateBoard();

    if (queens.length === boardSize) {
      showMessage('Congratulations! All queens are safely placed.', false, 'success');
      stopTimer();
    }
  }

  function isSafe(row, col) {
    return !queens.some(([qRow, qCol]) => qRow === row || qCol === col || Math.abs(qRow - row) === Math.abs(qCol - col));
  }

  function updateBoard() {
    const attackedCells = getAttackedCells();
    const squares = board.querySelectorAll('.square');

    squares.forEach((square) => {
      const row = Number(square.dataset.row);
      const col = Number(square.dataset.col);
      const key = `${row},${col}`;
      const queenHere = queens.some(([qRow, qCol]) => qRow === row && qCol === col);
      const invalidHere = showInvalidCells && attackedCells.has(key) && !queenHere && !marks.has(key);
      const showAttacked = showInvalidCells && attackedCells.has(key) && !queenHere;
      const queenClass = square.classList.contains('dark-tile') ? 'queen-white' : 'queen-black';

      square.classList.toggle('attacked', showAttacked);
      square.classList.toggle('invalid', invalidHere);
      square.classList.toggle('marked', marks.has(key) && !queenHere);
      square.classList.remove('hint', 'highlight');
      square.innerHTML = '';

      if (queenHere) {
        square.innerHTML = `<span class="queen ${queenClass}">&#9819;</span>`;
      } else if (marks.has(key)) {
        square.innerHTML = '<span class="mark">✕</span>';
      }
    });

    updateStatus();
  }

  function getAttackedCells() {
    const attacked = new Set();

    queens.forEach(([qRow, qCol]) => {
      for (let row = 0; row < boardSize; row += 1) {
        for (let col = 0; col < boardSize; col += 1) {
          if (row === qRow && col === qCol) continue;
          if (row === qRow || col === qCol || Math.abs(qRow - row) === Math.abs(qCol - col)) {
            attacked.add(`${row},${col}`);
          }
        }
      }
    });

    return attacked;
  }

  function showAttackGuides(row, col) {
    if (!gameActive) return;

    const squares = board.querySelectorAll('.square');
    squares.forEach((square) => {
      const r = Number(square.dataset.row);
      const c = Number(square.dataset.col);
      if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
        square.classList.add('hint');
      }
    });
  }

  function clearAttackGuides() {
    const squares = board.querySelectorAll('.square');
    squares.forEach((square) => {
      square.classList.remove('hint');
    });
  }

  function highlightAttackPath(row, col) {
    const squares = board.querySelectorAll('.square');
    squares.forEach((square) => {
      const r = Number(square.dataset.row);
      const c = Number(square.dataset.col);
      if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
        square.classList.add('highlight');
        setTimeout(() => square.classList.remove('highlight'), 700);
      }
    });
  }

  function updateStatus() {
    moveLabel.textContent = moveCount;
    queenCountLabel.textContent = queens.length;
    timerLabel.textContent = formatTime(timerSeconds);
  }

  function toggleInvalidView(event) {
    showInvalidCells = event.target.checked;
    updateBoard();
  }

  function showMessage(text, isError = false, extraClass = '') {
    message.textContent = text;
    message.classList.toggle('error', isError);
    message.classList.toggle('success', !isError && extraClass === 'success');
  }

  function toggleMarkMode() {
    if (!gameActive) return;
    markingMode = !markingMode;
    toggleMarkButton.textContent = markingMode ? 'Place Queens Mode' : 'Mark Unsafe Cells';
    showMessage(markingMode ? 'Tap a cell to add or remove an unsafe mark.' : 'Tap a square to place or remove a queen.');
  }

  function clearMarks() {
    if (!gameActive) return;
    marks.clear();
    updateBoard();
    showMessage('All unsafe marks cleared.');
  }

  function showHint() {
    if (!gameActive) return;

    if (!isBoardValid()) {
      const conflictQueen = findConflictQueen();
      if (conflictQueen) {
        showMessage(
          `Hint: remove the queen at row ${conflictQueen.row + 1}, column ${conflictQueen.col + 1}.`, 
          true
        );
        return;
      }
    }

    const nextHint = findHint();
    if (!nextHint) {
      showMessage('No safe hint available from this arrangement. Try removing a queen.', true);
      return;
    }

    const hintSquare = board.querySelector(`.square[data-row='${nextHint.row}'][data-col='${nextHint.col}']`);
    if (hintSquare) {
      hintSquare.classList.add('hint');
      setTimeout(() => hintSquare.classList.remove('hint'), 1200);
    }

    showMessage(`Hint: place a queen at row ${nextHint.row + 1}, column ${nextHint.col + 1}.`);
  }

  function findHint() {
    for (let row = 0; row < boardSize; row += 1) {
      if (queens.some(([qRow]) => qRow === row)) continue;
      for (let col = 0; col < boardSize; col += 1) {
        if (isSafe(row, col)) {
          return { row, col };
        }
      }
    }
    return null;
  }

  function findConflictQueen() {
    for (let i = 0; i < queens.length; i += 1) {
      for (let j = i + 1; j < queens.length; j += 1) {
        const [r1, c1] = queens[i];
        const [r2, c2] = queens[j];
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          return { row: r1, col: c1 };
        }
      }
    }
    return null;
  }

  async function autoSolve() {
    if (!gameActive) return;

    if (!isBoardValid()) {
      showMessage('Current layout conflicts with the rules. Remove a queen first.', true);
      return;
    }

    const solution = solveFromPartial();
    if (!solution) {
      showMessage('No valid full solution exists from the current arrangement.', true);
      return;
    }

    showMessage('Auto-solving with backtracking...');
    disableInteraction(true);

    queens = [];
    marks.clear();
    updateBoard();

    for (let row = 0; row < boardSize; row += 1) {
      const col = solution[row];
      queens.push([row, col]);
      updateBoard();
      await sleep(180);
    }

    updateBoard();
    showMessage('Solution complete! Review the board or make changes.', false, 'success');
    stopTimer();
    disableInteraction(false);
  }

  function disableInteraction(disabled) {
    gameActive = !disabled;
    toggleMarkButton.disabled = disabled;
    hintButton.disabled = disabled;
    solveButton.disabled = disabled;
    resetGameButton.disabled = disabled;
    boardInput.disabled = disabled;
  }

  function isBoardValid() {
    for (let i = 0; i < queens.length; i += 1) {
      for (let j = i + 1; j < queens.length; j += 1) {
        const [r1, c1] = queens[i];
        const [r2, c2] = queens[j];
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          return false;
        }
      }
    }
    return true;
  }

  function solveFromPartial() {
    const cols = new Array(boardSize).fill(false);
    const diag1 = new Array(boardSize * 2).fill(false);
    const diag2 = new Array(boardSize * 2).fill(false);
    const solution = new Array(boardSize).fill(null);

    for (const [qRow, qCol] of queens) {
      solution[qRow] = qCol;
      cols[qCol] = true;
      diag1[qRow - qCol + boardSize] = true;
      diag2[qRow + qCol] = true;
    }

    function backtrack(row) {
      if (row === boardSize) {
        return true;
      }

      if (solution[row] !== null) {
        return backtrack(row + 1);
      }

      for (let col = 0; col < boardSize; col += 1) {
        const d1 = row - col + boardSize;
        const d2 = row + col;
        if (cols[col] || diag1[d1] || diag2[d2]) continue;
        solution[row] = col;
        cols[col] = true;
        diag1[d1] = true;
        diag2[d2] = true;

        if (backtrack(row + 1)) {
          return true;
        }

        solution[row] = null;
        cols[col] = false;
        diag1[d1] = false;
        diag2[d2] = false;
      }

      return false;
    }

    return backtrack(0) ? solution : null;
  }

  function startTimer() {
    clearInterval(timerId);
    timerSeconds = 0;
    updateStatus();
    timerId = setInterval(() => {
      timerSeconds += 1;
      updateStatus();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
