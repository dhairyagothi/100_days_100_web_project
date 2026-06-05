let board = [];
let solution = [];
let timer = 0;
let interval;
let darkMode = false;

function initBoard() {
  board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solution = generateSolvedBoard(JSON.parse(JSON.stringify(board)));
}

function generateSolvedBoard(grid) {
  fillGrid(grid);
  return grid;
}

function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  let startRow = row - (row % 3);
  let startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function removeNumbers(level) {
  let attempts = level === "easy" ? 35 : level === "medium" ? 45 : 55;

  let puzzle = JSON.parse(JSON.stringify(solution));

  while (attempts > 0) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);

    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      attempts--;
    }
  }

  board = puzzle;
}

function renderBoard() {
  const container = document.getElementById("sudoku-board");
  container.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let input = document.createElement("input");
      input.className = "cell";

      if (board[i][j] !== 0) {
        input.value = board[i][j];
        input.disabled = true;
        input.classList.add("fixed");
      }

      input.addEventListener("input", () => {
        board[i][j] = parseInt(input.value) || 0;
        saveState();
      });

      container.appendChild(input);
    }
  }
}

function newGame() {
  clearInterval(interval);
  timer = 0;
  startTimer();

  initBoard();
  let level = document.getElementById("difficulty").value;
  removeNumbers(level);
  renderBoard();
}

function checkSolution() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== solution[i][j]) {
        document.getElementById("status").innerText = "Incorrect Solution!";
        return;
      }
    }
  }
  document.getElementById("status").innerText = "🎉 Puzzle Solved!";
  clearInterval(interval);
}

function getHint() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        board[i][j] = solution[i][j];
        renderBoard();
        return;
      }
    }
  }
}

function solvePuzzle() {
  board = JSON.parse(JSON.stringify(solution));
  renderBoard();
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = `Time: ${timer}s`;
  }, 1000);
}

function toggleTheme() {
    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );
}

function saveState() {
  localStorage.setItem("sudoku", JSON.stringify(board));
}

newGame();
