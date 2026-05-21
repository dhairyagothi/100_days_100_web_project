const board = document.getElementById("game-board");
const mineCountText = document.getElementById("mine-count");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");

const difficultyButtons =
  document.querySelectorAll(".difficulty-btn");

const toggleHelp =
  document.getElementById("toggle-help");

const helpPanel =
  document.getElementById("help-panel");

let rows = 8;
let cols = 8;
let mineCount = 10;

let boardArray = [];
let gameOver = false;

let timer = 0;
let timerInterval;

let currentDifficulty = "easy";

const difficulties = {
  easy: {
    rows: 8,
    cols: 8,
    mines: 10,
  },

  medium: {
    rows: 12,
    cols: 12,
    mines: 20,
  },

  hard: {
    rows: 15,
    cols: 15,
    mines: 40,
  },
};

toggleHelp.addEventListener("click", () => {
  helpPanel.classList.toggle("hidden");
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((btn) =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentDifficulty =
      button.dataset.level;

    startGame();
  });
});

restartBtn.addEventListener("click", () => {
  startGame();
});

function startGame() {
  clearInterval(timerInterval);

  timer = 0;
  timerText.textContent = timer;

  gameOver = false;

  board.innerHTML = [];

  const config =
    difficulties[currentDifficulty];

  rows = config.rows;
  cols = config.cols;
  mineCount = config.mines;

  mineCountText.textContent = mineCount;

  boardArray = [];

  const cellSize =
    window.innerWidth < 768 ? 34 : 42;

  board.style.gridTemplateColumns =
    `repeat(${cols}, ${cellSize}px)`;

  createBoard();

  placeMines();

  calculateNumbers();

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameOver) {
      timer++;
      timerText.textContent = timer;
    }
  }, 1000);
}

function createBoard() {
  for (let row = 0; row < rows; row++) {
    let currentRow = [];

    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.dataset.row = row;
      cell.dataset.col = col;

      const cellData = {
        row,
        col,
        mine: false,
        revealed: false,
        flagged: false,
        number: 0,
        element: cell,
      };

      cell.addEventListener("click", () => {
        revealCell(cellData);
      });

      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        toggleFlag(cellData);
      });

      board.appendChild(cell);

      currentRow.push(cellData);
    }

    boardArray.push(currentRow);
  }
}

function placeMines() {
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const randomRow =
      Math.floor(Math.random() * rows);

    const randomCol =
      Math.floor(Math.random() * cols);

    const cell =
      boardArray[randomRow][randomCol];

    if (!cell.mine) {
      cell.mine = true;
      minesPlaced++;
    }
  }
}

function calculateNumbers() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell =
        boardArray[row][col];

      if (cell.mine) continue;

      let count = 0;

      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const newRow = row + r;
          const newCol = col + c;

          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols
          ) {
            if (
              boardArray[newRow][newCol].mine
            ) {
              count++;
            }
          }
        }
      }

      cell.number = count;
    }
  }
}

function revealCell(cell) {
  if (
    gameOver ||
    cell.revealed ||
    cell.flagged
  ) {
    return;
  }

  cell.revealed = true;

  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.textContent = "💣";

    endGame(false);

    return;
  }

  if (cell.number > 0) {
    cell.element.textContent =
      cell.number;

    setNumberColor(
      cell.element,
      cell.number
    );
  } else {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = cell.row + r;
        const newCol = cell.col + c;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols
        ) {
          const neighbor =
            boardArray[newRow][newCol];

          if (!neighbor.revealed) {
            revealCell(neighbor);
          }
        }
      }
    }
  }

  checkWin();
}

function toggleFlag(cell) {
  if (
    gameOver ||
    cell.revealed
  ) {
    return;
  }

  cell.flagged = !cell.flagged;

  if (cell.flagged) {
    cell.element.textContent = "🚩";
    cell.element.classList.add("flagged");
  } else {
    cell.element.textContent = "";
    cell.element.classList.remove("flagged");
  }
}

function checkWin() {
  let safeCells = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell =
        boardArray[row][col];

      if (
        !cell.mine &&
        cell.revealed
      ) {
        safeCells++;
      }
    }
  }

  if (
    safeCells ===
    rows * cols - mineCount
  ) {
    endGame(true);
  }
}

function endGame(win) {
  gameOver = true;

  clearInterval(timerInterval);

  revealAllMines();

  setTimeout(() => {
    if (win) {
      alert("🎉 You Win!");
    } else {
      alert("💥 Game Over!");
    }
  }, 200);
}

function revealAllMines() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell =
        boardArray[row][col];

      if (cell.mine) {
        cell.element.classList.add("mine");
        cell.element.textContent = "💣";
      }
    }
  }
}

function setNumberColor(element, number) {
  const colors = {
    1: "#2563eb",
    2: "#16a34a",
    3: "#dc2626",
    4: "#7c3aed",
    5: "#ea580c",
    6: "#0891b2",
    7: "#111827",
    8: "#475569",
  };

  element.style.color =
    colors[number] || "black";
}

window.addEventListener("resize", () => {
  const cellSize =
    window.innerWidth < 768 ? 34 : 42;

  board.style.gridTemplateColumns =
    `repeat(${cols}, ${cellSize}px)`;
});

startGame();