document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("startGame");
    const resetGameButton = document.getElementById("resetGame");
    const boardInput = document.getElementById("boardSize");
    const board = document.getElementById("gameBoard");
    const message = document.getElementById("message");

     // ── Theme Toggle ─────────────────────────────────────────
    const themeToggle = document.getElementById("themeToggle");
 
    // Restore saved preference on load
    if (localStorage.getItem("nqueens-theme") === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
 
    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light");
        themeToggle.textContent = isLight ? "☀️" : "🌙";
        localStorage.setItem("nqueens-theme", isLight ? "light" : "dark");
    });
    
    let queens = [];
    let boardSize = 4;

    if (startGameButton && resetGameButton) {
        startGameButton.addEventListener("click", startGame);
        resetGameButton.addEventListener("click", resetGame);
    }

    function startGame() {
        boardSize = parseInt(boardInput.value);
        if (isNaN(boardSize) || boardSize < 4 || boardSize > 12) {
            alert("Please enter a valid board size between 4 and 12.");
            return;
        }

        resetGame();

        board.style.gridTemplateColumns = `repeat(${boardSize}, 55px)`;
        board.innerHTML = "";
        message.textContent = "";

        for (let i = 0; i < boardSize * boardSize; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            
            // Mathematical checkboard pattern matching calculation
            const row = Math.floor(i / boardSize);
            const col = i % boardSize;
            if ((row + col) % 2 === 0) {
                square.classList.add("light-tile");
            } else {
                square.classList.add("dark-tile");
            }

            // Interactive UI Guidance Tracking listeners
            square.addEventListener("mouseenter", () => showGuides(row, col));
            square.addEventListener("mouseleave", clearGuides);
            square.addEventListener("click", () => handleSquareClick(i));
            
            board.appendChild(square);
        }

        queens = [];
        if (startGameButton) startGameButton.style.display = "none";
        if (resetGameButton) resetGameButton.style.display = "inline-block";
    }

    function handleSquareClick(index) {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        const squares = document.querySelectorAll(".square");

        // If a queen is clicked, remove it
        const existingQueenIndex = queens.findIndex(([r, c]) => r === row && c === col);
        if (existingQueenIndex !== -1) {
            queens.splice(existingQueenIndex, 1);
            squares[index].innerHTML = "";
            message.textContent = "";
            message.classList.remove("error");
            return;
        }

        // Check rules restriction constraints
        if (queens.some(([r, c]) => r === row || c === col || Math.abs(r - row) === Math.abs(c - col))) {
            message.textContent = "Invalid placement! Queens are attacking each other.";
            message.classList.add("error");
            highlightConflicts(row, col);
            return;
        }

        // Add queen securely
        queens.push([row, col]);
        squares[index].innerHTML = `<span class="queen">&#9819;</span>`;
        message.textContent = "";
        message.classList.remove("error");

        if (queens.length === boardSize) {
            message.textContent = "Congratulations! You've placed all queens safely!";
            message.classList.remove("error");
        }
    }

    // Creative Enhancement Feature: Real-time diagonal/orthogonal coordinate tracking indicators
    function showGuides(row, col) {
        const squares = document.querySelectorAll(".square");
        squares.forEach((square, index) => {
            const r = Math.floor(index / boardSize);
            const c = index % boardSize;
            if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
                square.classList.add("guideline");
            }
        });
    }

    function clearGuides() {
        const squares = document.querySelectorAll(".square");
        squares.forEach(square => square.classList.remove("guideline"));
    }

    function highlightConflicts(row, col) {
        const squares = document.querySelectorAll(".square");
        squares.forEach((square, index) => {
            const r = Math.floor(index / boardSize);
            const c = index % boardSize;

            if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
                square.classList.add("highlight");
                setTimeout(() => square.classList.remove("highlight"), 800);
            }
        });
    }

    function resetGame() {
        board.innerHTML = "";
        queens = [];
        message.textContent = "";
        message.classList.remove("error");
        if (startGameButton) startGameButton.style.display = "inline-block";
        if (resetGameButton) resetGameButton.style.display = "none";
    }
});
