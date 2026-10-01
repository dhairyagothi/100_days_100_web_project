/**
 * Sudoku Game Engine & Theme Management
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const boardElement = document.getElementById("board");
    const numberPad = document.getElementById("numberPad");
    const timerElement = document.getElementById("timer");
    const mistakeElement = document.getElementById("mistakes");
    const messageElement = document.getElementById("message");
    const difficultyElement = document.getElementById("difficulty");
    const notesButton = document.getElementById("notesButton");
    const themeToggleBtn = document.getElementById("themeToggle");

    // --- Game Constants ---
    const EMPTY = 0;
    const SIZE = 9;
    const BOX = 3;
    const difficultyBlanks = {
        easy: 36,
        medium: 45,
        hard: 54
    };

    // --- State Variables ---
    let solution = [];
    let puzzle = [];
    let currentBoard = [];
    let selectedCell = null;
    let notesMode = false;
    let mistakes = 0;
    let seconds = 0;
    let timerId = null;
    let gameOver = false;

    // ==========================================
    // 1. Theme Management System
    // ==========================================
    function initTheme() {
        if (!themeToggleBtn) return;

        const sunIcon = themeToggleBtn.querySelector(".sun-icon");
        const moonIcon = themeToggleBtn.querySelector(".moon-icon");

        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        function setTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);

            if (sunIcon && moonIcon) {
                if (theme === "dark") {
                    sunIcon.style.display = "none";
                    moonIcon.style.display = "inline-block";
                } else {
                    sunIcon.style.display = "inline-block";
                    moonIcon.style.display = "none";
                }
            }
        }

        // Initialize theme
        setTheme(initialTheme);

        // Click Handler
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setTheme(currentTheme === "dark" ? "light" : "dark");
        });

        // Watch System Changes
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        });
    }

    // ==========================================
    // 2. Core Grid Utilities & Logic
    // ==========================================
    function cloneGrid(grid) {
        return grid.map(row => row.slice());
    }

    function shuffle(values) {
        const copy = values.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function isSafe(grid, row, col, value) {
        for (let i = 0; i < SIZE; i++) {
            if (grid[row][i] === value || grid[i][col] === value) return false;
        }

        const boxRow = Math.floor(row / BOX) * BOX;
        const boxCol = Math.floor(col / BOX) * BOX;
        for (let r = boxRow; r < boxRow + BOX; r++) {
            for (let c = boxCol; c < boxCol + BOX; c++) {
                if (grid[r][c] === value) return false;
            }
        }
        return true;
    }

    function fillGrid(grid) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (grid[row][col] !== EMPTY) continue;

                for (const value of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
                    if (isSafe(grid, row, col, value)) {
                        grid[row][col] = value;
                        if (fillGrid(grid)) return true;
                        grid[row][col] = EMPTY;
                    }
                }
                return false;
            }
        }
        return true;
    }

    function generateSolution() {
        const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
        fillGrid(grid);
        return grid;
    }

    function makePuzzle(fullGrid, blanks) {
        const grid = cloneGrid(fullGrid);
        const cells = shuffle(Array.from({ length: SIZE * SIZE }, (_, index) => index));

        for (let i = 0; i < blanks; i++) {
            const row = Math.floor(cells[i] / SIZE);
            const col = cells[i] % SIZE;
            grid[row][col] = EMPTY;
        }
        return grid;
    }

    // ==========================================
    // 3. UI Control & Rendering
    // ==========================================
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const secs = (totalSeconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    }

    function startTimer() {
        clearInterval(timerId);
        seconds = 0;
        timerElement.textContent = "00:00";
        timerId = setInterval(() => {
            if (!gameOver) {
                seconds++;
                timerElement.textContent = formatTime(seconds);
            }
        }, 1000);
    }

    function getCell(row, col) {
        return boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    function buildNotes(notes) {
        return `<div class="notes">${Array.from({ length: SIZE }, (_, index) => {
            const value = index + 1;
            return `<span>${notes.has(value) ? value : ""}</span>`;
        }).join("")}</div>`;
    }

    function renderBoard() {
        // Optimized using a DocumentFragment to prevent browser layout thrashing
        const fragment = document.createDocumentFragment();
        boardElement.innerHTML = "";

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = document.createElement("button");
                const value = currentBoard[row][col];

                cell.type = "button";
                cell.className = "cell";
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.setAttribute("role", "gridcell");
                cell.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);

                // Check grid intersections to apply visual board border-weights
                if (row % 3 === 0 && row !== 0) cell.classList.add("top-boundary");
                if (col % 3 === 0 && col !== 0) cell.classList.add("left-boundary");

                if (puzzle[row][col] !== EMPTY) {
                    cell.classList.add("fixed");
                    cell.textContent = puzzle[row][col];
                } else if (value && value instanceof Set) {
                    cell.innerHTML = buildNotes(value);
                } else if (value !== EMPTY) {
                    cell.textContent = value;
                }

                cell.addEventListener("click", () => selectCell(row, col));
                fragment.appendChild(cell);
            }
        }
        boardElement.appendChild(fragment);
    }

    function renderNumberPad() {
        const fragment = document.createDocumentFragment();
        numberPad.innerHTML = "";

        for (let value = 1; value <= SIZE; value++) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = value;
            button.addEventListener("click", () => placeNumber(value));
            fragment.appendChild(button);
        }

        const erase = document.createElement("button");
        erase.type = "button";
        erase.className = "erase";
        erase.textContent = "Erase";
        erase.addEventListener("click", eraseCell);
        fragment.appendChild(erase);
        
        numberPad.appendChild(fragment);
    }

    function clearHighlights() {
        boardElement.querySelectorAll(".cell").forEach(cell => {
            cell.classList.remove("selected", "peer", "same", "error");
        });
    }

    function selectCell(row, col) {
        if (gameOver) return;
        selectedCell = { row, col };
        clearHighlights();

        const selectedValue = currentBoard[row][col];
        boardElement.querySelectorAll(".cell").forEach(cell => {
            const cellRow = Number(cell.dataset.row);
            const cellCol = Number(cell.dataset.col);
            const sameBox = Math.floor(cellRow / BOX) === Math.floor(row / BOX)
                && Math.floor(cellCol / BOX) === Math.floor(col / BOX);

            if (cellRow === row && cellCol === col) {
                cell.classList.add("selected");
            } else if (cellRow === row || cellCol === col || sameBox) {
                cell.classList.add("peer");
            }

            if (typeof selectedValue === "number" && selectedValue !== EMPTY && currentBoard[cellRow][cellCol] === selectedValue) {
                cell.classList.add("same");
            }
        });
    }

    function setMessage(text) {
        messageElement.textContent = text;
    }

    // ==========================================
    // 4. Gameplay Logic Iterations
    // ==========================================
    function placeNumber(value) {
        if (!selectedCell || gameOver) return;
        const { row, col } = selectedCell;
        if (puzzle[row][col] !== EMPTY) {
            setMessage("This number is part of the puzzle.");
            return;
        }

        if (notesMode) {
            const notes = currentBoard[row][col] instanceof Set ? currentBoard[row][col] : new Set();
            notes.has(value) ? notes.delete(value) : notes.add(value);
            currentBoard[row][col] = notes.size ? notes : EMPTY;
            renderBoard();
            selectCell(row, col);
            return;
        }

        if (solution[row][col] !== value) {
            mistakes++;
            mistakeElement.textContent = mistakes;
            const cell = getCell(row, col);
            if (cell) cell.classList.add("error");
            setMessage("That number does not fit here.");

            if (mistakes >= 3) {
                gameOver = true;
                clearInterval(timerId);
                setMessage("Game over. Start a new puzzle and try again.");
            }
            return;
        }

        currentBoard[row][col] = value;
        removeSolvedNumberFromNotes(row, col, value);
        renderBoard();
        selectCell(row, col);
        setMessage("Nice move.");
        checkWin();
    }

    function removeSolvedNumberFromNotes(row, col, value) {
        for (let i = 0; i < SIZE; i++) {
            [currentBoard[row][i], currentBoard[i][col]].forEach(item => {
                if (item instanceof Set) item.delete(value);
            });
        }

        const boxRow = Math.floor(row / BOX) * BOX;
        const boxCol = Math.floor(col / BOX) * BOX;
        for (let r = boxRow; r < boxRow + BOX; r++) {
            for (let c = boxCol; c < boxCol + BOX; c++) {
                if (currentBoard[r][c] instanceof Set) currentBoard[r][c].delete(value);
            }
        }
    }

    function eraseCell() {
        if (!selectedCell || gameOver) return;
        const { row, col } = selectedCell;
        if (puzzle[row][col] !== EMPTY) return;

        currentBoard[row][col] = EMPTY;
        renderBoard();
        selectCell(row, col);
        setMessage("Cell cleared.");
    }

    function giveHint() {
        if (gameOver) return;

        const emptyCells = [];
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (puzzle[row][col] === EMPTY && currentBoard[row][col] !== solution[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (!emptyCells.length) return;
        const hint = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        currentBoard[hint.row][hint.col] = solution[hint.row][hint.col];
        renderBoard();
        selectCell(hint.row, hint.col);
        setMessage("Hint added.");
        checkWin();
    }

    function checkWin() {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (currentBoard[row][col] !== solution[row][col]) return;
            }
        }

        gameOver = true;
        clearInterval(timerId);
        setMessage(`Solved in ${formatTime(seconds)} with ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`);
    }

    function resetGame() {
        currentBoard = cloneGrid(puzzle);
        mistakes = 0;
        gameOver = false;
        selectedCell = null;
        mistakeElement.textContent = "0";
        setMessage("Puzzle reset.");
        startTimer();
        renderBoard();
    }

    function newGame() {
        const blanks = difficultyBlanks[difficultyElement.value] || difficultyBlanks.medium;
        solution = generateSolution();
        puzzle = makePuzzle(solution, blanks);
        currentBoard = cloneGrid(puzzle);
        mistakes = 0;
        selectedCell = null;
        gameOver = false;
        mistakeElement.textContent = "0";
        notesMode = false;
        notesButton.classList.remove("active");
        notesButton.setAttribute("aria-pressed", "false");
        setMessage("Select a blank cell and fill the board.");
        renderBoard();
        startTimer();
    }

    // ==========================================
    // 5. Global Listeners & Orchestration
    // ==========================================
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("resetGame").addEventListener("click", resetGame);
    document.getElementById("hintButton").addEventListener("click", giveHint);
    
    notesButton.addEventListener("click", () => {
        notesMode = !notesMode;
        notesButton.classList.toggle("active", notesMode);
        notesButton.setAttribute("aria-pressed", String(notesMode));
        setMessage(notesMode ? "Notes mode on." : "Notes mode off.");
    });

    // Keyboard Integration Updates
    document.addEventListener("keydown", event => {
        if (/^[1-9]$/.test(event.key)) placeNumber(Number(event.key));
        if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") eraseCell();
        if (event.key.toLowerCase() === "n") {
            notesButton.click();
        }
        
        // Grid Navigation Keys
        if (selectedCell && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            let { row, col } = selectedCell;
            if (event.key === "ArrowUp" && row > 0) row--;
            if (event.key === "ArrowDown" && row < SIZE - 1) row++;
            if (event.key === "ArrowLeft" && col > 0) col--;
            if (event.key === "ArrowRight" && col < SIZE - 1) col++;
            selectCell(row, col);
        }
    });

    // Initialize systems
    initTheme();
    renderNumberPad();
    newGame();
});