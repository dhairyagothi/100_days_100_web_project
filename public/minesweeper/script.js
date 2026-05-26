// --- Configuration & Game Settings ---
const CONFIG = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
};

let currentLevel = 'easy';
let rows = CONFIG[currentLevel].rows;
let cols = CONFIG[currentLevel].cols;
let totalMines = CONFIG[currentLevel].mines;

// --- State Variables ---
let boardData = [];       // Hidden 2D Matrix storage tracking data logic
let flagsPlaced = 0;
let timeElapsed = 0;
let timerId = null;
let isFirstClick = true;
let isGameOver = false;

// --- DOM Elements ---
const boardElement = document.getElementById('board');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const difficultySelect = document.getElementById('difficulty');

// --- Initialization Engine ---
function initGame() {
    // 1. Read layout properties based on chosen selection
    currentLevel = difficultySelect.value;
    rows = CONFIG[currentLevel].rows;
    cols = CONFIG[currentLevel].cols;
    totalMines = CONFIG[currentLevel].mines;

    // 2. Set Up UI CSS Engine Variables
    boardElement.style.setProperty('--grid-cols', cols);
    boardElement.style.setProperty('--grid-rows', rows);

    // 3. Reset Operational Counters
    flagsPlaced = 0;
    timeElapsed = 0;
    isFirstClick = true;
    isGameOver = false;
    resetBtn.innerText = "😊";
    mineCountDisplay.innerText = totalMines;
    timerDisplay.innerText = "0";

    clearInterval(timerId);
    timerId = null;

    // 4. Fire Sequence Loops
    createBoardMemory();
    renderVisualBoard();
}

// --- Step 1: Initialize Empty Tracking Map Array ---
function createBoardMemory() {
    boardData = [];
    for (let r = 0; r < rows; r++) {
        let rowArray = [];
        for (let c = 0; c < cols; c++) {
            rowArray.push({
                row: r,
                col: c,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMineCount: 0
            });
        }
        boardData.push(rowArray);
    }
}

// --- Step 2: Plant Mines (Safeguarded for First Click Fair Play) ---
function plantMines(firstRow, firstCol) {
    let minesPlanted = 0;
    while (minesPlanted < totalMines) {
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * cols);

        // Guard Condition: Do not plant a mine on or adjacent to the user's initial click area
        const isStartZone = Math.abs(randomRow - firstRow) <= 1 && Math.abs(randomCol - firstCol) <= 1;

        if (!boardData[randomRow][randomCol].isMine && !isStartZone) {
            boardData[randomRow][randomCol].isMine = true;
            minesPlanted++;
        }
    }
    calculateNeighbors();
}

// --- Step 3: Count Adjacent Neighbor Proximity Mines ---
function calculateNeighbors() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (boardData[r][c].isMine) continue;

            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nRow = r + i;
                    let nCol = c + j;
                    if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
                        if (boardData[nRow][nCol].isMine) count++;
                    }
                }
            }
            boardData[r][c].neighborMineCount = count;
        }
    }
}

// --- Step 4: Render Visual Structural Grid to the Screen ---
function renderVisualBoard() {
    boardElement.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = r;
            cellDiv.dataset.col = c;

            // Register Mouse Interactive Listeners
            cellDiv.addEventListener('click', handleLeftClick);
            cellDiv.addEventListener('contextmenu', handleRightClick);

            boardElement.appendChild(cellDiv);
        }
    }
}

// --- Step 5: Start Operational Display Clock ---
function startTimer() {
    timerId = setInterval(() => {
        timeElapsed++;
        timerDisplay.innerText = timeElapsed;
    }, 1000);
}

// --- Step 6: Left Click Core Handlers (Dig Logic) ---
function handleLeftClick(e) {
    if (isGameOver) return;
    const r = parseInt(e.target.dataset.row);
    const c = parseInt(e.target.dataset.col);
    let cell = boardData[r][c];

    if (cell.isRevealed || cell.isFlagged) return;

    // First Click Initialization Step (Ensures Zero-Mine Start)
    if (isFirstClick) {
        isFirstClick = false;
        plantMines(r, c);
        startTimer();
    }

    revealCell(r, c);
    checkWinCondition();
}

// --- Step 7: Recursive Grid Expansion Strategy (Flood Fill) ---
function revealCell(r, rCol) {
    // Boundary Guards
    if (r < 0 || r >= rows || rCol < 0 || rCol >= cols) return;
    let cell = boardData[r][rCol];
    if (cell.isRevealed || cell.isFlagged) return;

    // Reveal Action State Processing
    cell.isRevealed = true;
    const cellDiv = boardElement.querySelector(`[data-row="${r}"][data-col="${rCol}"]`);
    cellDiv.classList.add('revealed');

    // Scenario A: Detonation Hit
    if (cell.isMine) {
        triggerGameOver(false);
        cellDiv.innerText = "💥";
        return;
    }

    // Scenario B: Proximity Number Hit
    if (cell.neighborMineCount > 0) {
        cellDiv.innerText = cell.neighborMineCount;
        cellDiv.classList.add(`num-${cell.neighborMineCount}`);
        return;
    }

    // Scenario C: Empty Value Grid Space -> Cascade Search Loop Directions
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            revealCell(r + i, rCol + j);
        }
    }
}

// --- Step 8: Flag Placement Mechanics (Right Click) ---
function handleRightClick(e) {
    e.preventDefault(); // Disables normal browser popup window options menu
    if (isGameOver) return;

    const r = parseInt(e.target.dataset.row);
    const c = parseInt(e.target.dataset.col);
    let cell = boardData[r][c];

    if (cell.isRevealed) return;

    const cellDiv = e.target;
    if (!cell.isFlagged) {
        cell.isFlagged = true;
        flagsPlaced++;
        cellDiv.classList.add('flagged');
        cellDiv.innerText = "🚩";
    } else {
        cell.isFlagged = false;
        flagsPlaced--;
        cellDiv.classList.remove('flagged');
        cellDiv.innerText = "";
    }

    mineCountDisplay.innerText = totalMines - flagsPlaced;
}

// --- Step 9: Validate Win/Loss End States ---
function checkWinCondition() {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!boardData[r][c].isMine && !boardData[r][c].isRevealed) {
                unrevealedSafeCells++;
            }
        }
    }
    if (unrevealedSafeCells === 0) {
        triggerGameOver(true);
    }
}

function triggerGameOver(didWin) {
    isGameOver = true;
    clearInterval(timerId);

    // Uncover hidden mine positions globally
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (boardData[r][c].isMine) {
                const cellDiv = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (!boardData[r][c].isRevealed) {
                    cellDiv.classList.add('revealed', 'mine');
                    cellDiv.innerText = "💣";
                }
            }
        }
    }

    resetBtn.innerText = didWin ? "😎" : "😵";
    setTimeout(() => {
        alert(didWin ? "🎉 Outstanding Strategy! You Win!" : "💥 Boom! Game Over. Try again!");
    }, 150);
}

// --- Event Registrations ---
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);

// Run initialization routine on load
initGame();