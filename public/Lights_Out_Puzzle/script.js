alert("Scroll down to read the game rules!")
const boardSize = 5; // 5x5 grid
const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

let grid = [];

// Create the game board
function createBoard() {
  board.innerHTML = ""; // Clear board
  grid = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => Math.random() > 0.5) // Random lights on/off
  );

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (!grid[row][col]) cell.classList.add("off"); // If off, add 'off' class
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => toggleLights(row, col));
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
    setTimeout(() => alert("Congratulations! You turned off all the lights!"), 100);
  }
}

// Reset the game
resetButton.addEventListener("click", createBoard);

// Initialize the game board
createBoard();
