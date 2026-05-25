// Wrap everything in this listener to ensure DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    
    // Select existing elements
    const startGameButton = document.getElementById("startGame");
    const resetGameButton = document.getElementById("resetGame");
    const boardInput = document.getElementById("boardSize");
    const board = document.getElementById("gameBoard");
    const message = document.getElementById("message");

    let queens = [];

    // Check if buttons exist before adding listeners to avoid console errors
    if (startGameButton && resetGameButton) {
        startGameButton.addEventListener("click", startGame);
        resetGameButton.addEventListener("click", resetGame);
    }

    function startGame() {
        const n = parseInt(boardInput.value);
        if (isNaN(n) || n < 4) {
            alert("Please enter a valid board size (minimum 4).");
            return;
        }

        resetGame();

        // Use board.offsetWidth to dynamically set square size if needed, 
        // but repeat(${n}, 60px) works for fixed grids.
        board.style.gridTemplateColumns = `repeat(${n}, 60px)`;
        board.innerHTML = "";
        message.textContent = "";

        for (let i = 0; i < n * n; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.addEventListener("click", () => placeQueen(i, n));
            board.appendChild(square);
        }

        queens = [];
        startGameButton.style.display = "none";
        resetGameButton.style.display = "inline-block";
    }

    function placeQueen(index, n) {
        const row = Math.floor(index / n);
        const col = index % n;

        // Check if queen already exists at this exact position
        if (queens.some(([r, c]) => r === row && c === col)) return;

        if (queens.some(([r, c]) => r === row || c === col || Math.abs(r - row) === Math.abs(c - col))) {
            message.textContent = "Invalid placement! Queens are attacking each other.";
            message.classList.add("error");
            highlightConflicts(row, col, n);
            return;
        }

        queens.push([row, col]);
        const squares = document.querySelectorAll(".square");
        squares[index].innerHTML = `<span class="queen">&#9819;</span>`;
        message.textContent = "";

        if (queens.length === n) {
            message.textContent = "Congratulations! You've placed all queens safely!";
            message.classList.remove("error");
        }
    }

    function highlightConflicts(row, col, n) {
        const squares = document.querySelectorAll(".square");
        squares.forEach((square, index) => {
            const r = Math.floor(index / n);
            const c = index % n;

            if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
                square.classList.add("highlight");
                // Remove highlight after a short delay for better UX
                setTimeout(() => square.classList.remove("highlight"), 1000);
            }
        });
    }

    function resetGame() {
        board.innerHTML = "";
        queens = [];
        message.textContent = "";
        message.classList.remove("error");
        if(startGameButton) startGameButton.style.display = "inline-block";
        if(resetGameButton) resetGameButton.style.display = "none";
    }
});