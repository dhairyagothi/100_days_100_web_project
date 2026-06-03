let paused = false;
let board = [];
let initialPuzzle = []; 
let solution = [];
let selectedCell = null;
let mistakes = 0;
let seconds = 0;
let timerInterval;
let currentDifficulty = "easy";
let undoStack = [];
let maxMistakes = 7;

const difficultyCount = {
    easy: 30,
    medium: 40,
    hard: 50
};

const difficultyMistakes = {
    easy: 7,
    medium: 5,
    hard: 3
};

// THEME TOGGLE CONTROLLERS
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("sudoku-theme", targetTheme);
    
    updateThemeButtonUI(targetTheme);
}

function updateThemeButtonUI(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    if (theme === "dark") {
        btn.innerText = "☀️";
    } else {
        btn.innerText = "🌙";
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("sudoku-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeButtonUI(savedTheme);
}

// TIMER ENGINES
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimer();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    let secs = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").innerText = `${mins}:${secs}`;
}

function togglePause() {
    paused = !paused;
    const btn = document.getElementById("pauseBtn");
    const cells = document.querySelectorAll(".cell");

    if (paused) {
        clearInterval(timerInterval);
        btn.innerText = "▶";
        cells.forEach(cell => {
            cell.disabled = true;
        });
    } else {
        startResumeTimer();
        btn.innerText = "⏸";
        cells.forEach(cell => {
            if (!cell.classList.contains("locked")) {
                cell.disabled = false;
            }
        });
    }
}

function startResumeTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

// SUDOKU MATHEMATICS MODEL
function generateSolvedBoard() {
    let b = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(b, r, c, num) {
        for (let i = 0; i < 9; i++) {
            if (b[r][i] === num || b[i][c] === num) {
                return false;
            }
        }
        let sr = Math.floor(r / 3) * 3;
        let sc = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (b[sr + i][sc + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function fill() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (b[r][c] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let n of nums) {
                        if (isValid(b, r, c, n)) {
                            b[r][c] = n;
                            if (fill()) return true;
                            b[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fill();
    return b;
}

function createPuzzle(sol, removeCount) {
    let p = sol.map(row => [...row]);
    while (removeCount > 0) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (p[r][c] !== 0) {
            p[r][c] = 0;
            removeCount--;
        }
    }
    return p;
}

// GRAPHICS RENDERING AND CAPTURE DELEGATES
function render(currentBoard) {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    let prevRow = selectedCell ? parseInt(selectedCell.dataset.row) : null;
    let prevCol = selectedCell ? parseInt(selectedCell.dataset.col) : null;
    selectedCell = null; 

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let input = document.createElement("input");
            input.className = "cell";
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;

            const boxRow = Math.floor(r / 3);
            const boxCol = Math.floor(c / 3);
            if ((boxRow + boxCol) % 2 === 0) {
                input.classList.add("box-light");
            } else {
                input.classList.add("box-dark");
            }

            if (currentBoard[r][c] !== 0) {
                input.value = currentBoard[r][c];
                
                if (initialPuzzle[r][c] !== 0) {
                    input.disabled = true;
                    input.classList.add("locked");
                } else if (currentBoard[r][c] !== solution[r][c]) {
                    input.classList.add("error");
                }
            }

            if (prevRow !== null && prevRow === r && prevCol === c) {
                selectedCell = input;
            }

            input.addEventListener("click", () => {
                if (paused) return;
                selectedCell = input;
                highlightCells(r, c);
            });

            input.addEventListener("input", () => {
                let val = parseInt(input.value);

                if (isNaN(val) || val < 1 || val > 9) {
                    input.value = "";
                    let oldValue = board[r][c];
                    
                    undoStack.push({ row: r, col: c, oldValue, newValue: 0 });
                    board[r][c] = 0;
                    input.classList.remove("error");
                    highlightCells(r, c);
                    return;
                }

                let oldValue = board[r][c];
                undoStack.push({ row: r, col: c, oldValue, newValue: val });
                board[r][c] = val;

                if (val !== solution[r][c]) {
                    input.classList.add("error");
                    mistakes++;
                    document.getElementById("mistakeCount").innerText = `${mistakes}/${maxMistakes}`;

                    if (mistakes >= maxMistakes) {
                        showResult("lose");
                        return;
                    }
                } else {
                    input.classList.remove("error");
                }

                highlightCells(r, c);

                if (checkWin()) {
                    clearInterval(timerInterval);
                    setTimeout(() => { showResult("win"); }, 200);
                }
            });

            boardDiv.appendChild(input);
        }
    }

    if (prevRow !== null && prevCol !== null) {
        highlightCells(prevRow, prevCol);
    }
}

function showResult(type) {
    clearInterval(timerInterval);
    const modal = document.getElementById("resultModal");
    const title = document.getElementById("resultTitle");
    const message = document.getElementById("resultMessage");

    let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    let secs = String(seconds % 60).padStart(2, "0");

    if (type === "win") {
        title.innerText = "🎉 Puzzle Solved";
        message.innerHTML = `Difficulty: <b>${currentDifficulty}</b><br><br>Time: <b>${mins}:${secs}</b><br><br>Mistakes: <b>${mistakes}</b>`;
    } else {
        title.innerText = "💀 Game Over";
        message.innerHTML = `You reached the maximum mistake limit.<br><br>Difficulty: <b>${currentDifficulty}</b><br><br>Time: <b>${mins}:${secs}</b>`;
    }
    modal.classList.remove("hidden");
}

function closeModalAndNewGame() {
    document.getElementById("resultModal").classList.add("hidden");
    newGame(currentDifficulty);
}

function highlightCells(row, col) {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("selected", "highlight", "same-number");

        let r = parseInt(cell.dataset.row);
        let c = parseInt(cell.dataset.col);

        if (r === row || c === col) {
            cell.classList.add("highlight");
        }
    });

    if (selectedCell) {
        selectedCell.classList.add("selected");
        const selectedValue = selectedCell.value;

        if (selectedValue !== "") {
            document.querySelectorAll(".cell").forEach(cell => {
                if (cell.value === selectedValue) {
                    cell.classList.add("same-number");
                }
            });
        }
    }
}

function createNumberPad() {
    const pad = document.getElementById("numberPad");
    pad.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement("button");
        btn.className = "number-btn";
        btn.innerText = i;
        btn.addEventListener("click", () => {
            if (selectedCell && !selectedCell.disabled && !paused) {
                selectedCell.value = i;
                selectedCell.dispatchEvent(new Event("input"));
            }
        });
        pad.appendChild(btn);
    }
}

function giveHint() {
    if (paused) return;
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0 || board[r][c] !== solution[r][c]) {
                board[r][c] = solution[r][c];
                
                let currentSelected = selectedCell ? { row: selectedCell.dataset.row, col: selectedCell.dataset.col } : null;
                
                render(board);
                
                if (currentSelected) {
                    selectedCell = document.querySelector(`[data-row="${currentSelected.row}"][data-col="${currentSelected.col}"]`);
                    highlightCells(parseInt(currentSelected.row), parseInt(currentSelected.col));
                }

                if (checkWin()) {
                    clearInterval(timerInterval);
                    setTimeout(() => { showResult("win"); }, 200);
                }
                return;
            }
        }
    }
}

function undoMove() {
    if (undoStack.length === 0 || paused) return;

    let move = undoStack.pop();
    board[move.row][move.col] = move.oldValue;

    render(board);
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}

// SETUP INITIALIZATION PIPELINES
function newGame(level) {
    maxMistakes = difficultyMistakes[level];
    currentDifficulty = level;
    paused = false;

    document.getElementById("pauseBtn").innerText = "⏸";
    mistakes = 0;
    document.getElementById("mistakeCount").innerText = `0/${maxMistakes}`;

    document.querySelectorAll(".difficulty button").forEach(btn => {
        btn.classList.remove("active", "easy", "medium", "hard");
    });
    document.getElementById(level + "Btn").classList.add("active", level);

    solution = generateSolvedBoard();
    let puzzle = createPuzzle(solution, difficultyCount[level]);
    
    initialPuzzle = puzzle.map(row => [...row]);
    board = puzzle.map(row => [...row]);

    undoStack = [];
    selectedCell = null;

    render(board);
    startTimer();
}

initTheme();
createNumberPad();
newGame("easy");
