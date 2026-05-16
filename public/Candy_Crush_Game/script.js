const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const rows = 9;
const columns = 9;
const imageBasePath = "/public/Candy_Crush_Game/images";

let board = [];
let score = 0;
let moves = 0;
let selectedTile = null;
let draggedTile = null;
let droppedTile = null;
let gameLoop;

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const movesElement = document.getElementById("moves");
const messageElement = document.getElementById("message");
const resetButton = document.getElementById("Reset");

function candyPath(candy) {
    return `${imageBasePath}/${candy}.png`;
}

function getCandyName(tile) {
    const fileName = tile.src.split("/").pop();
    return fileName.replace(".png", "");
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function updateStats() {
    scoreElement.textContent = score;
    movesElement.textContent = moves;
}

function setMessage(message) {
    messageElement.textContent = message;
}

function clearSelection() {
    if (selectedTile) {
        selectedTile.classList.remove("selected");
    }
    selectedTile = null;
}

function areAdjacent(tileA, tileB) {
    const [rowA, columnA] = tileA.id.split("-").map(Number);
    const [rowB, columnB] = tileB.id.split("-").map(Number);
    const rowDistance = Math.abs(rowA - rowB);
    const columnDistance = Math.abs(columnA - columnB);

    return rowDistance + columnDistance === 1;
}

function swapTiles(tileA, tileB) {
    const firstSource = tileA.src;
    tileA.src = tileB.src;
    tileB.src = firstSource;
}

function wouldCreateStartingMatch(row, column, candy) {
    const leftMatch = column >= 2 &&
        getCandyName(board[row][column - 1]) === candy &&
        getCandyName(board[row][column - 2]) === candy;
    const topMatch = row >= 2 &&
        getCandyName(board[row - 1][column]) === candy &&
        getCandyName(board[row - 2][column]) === candy;

    return leftMatch || topMatch;
}

function getStartingCandy(row, column) {
    let candy = randomCandy();

    while (wouldCreateStartingMatch(row, column, candy)) {
        candy = randomCandy();
    }

    return candy;
}

function createTile(row, column) {
    const tile = document.createElement("img");
    tile.id = `${row}-${column}`;
    tile.src = candyPath(getStartingCandy(row, column));
    tile.alt = "Candy";
    tile.draggable = true;

    tile.addEventListener("dragstart", () => {
        draggedTile = tile;
    });
    tile.addEventListener("dragover", (event) => event.preventDefault());
    tile.addEventListener("dragenter", (event) => event.preventDefault());
    tile.addEventListener("drop", () => {
        droppedTile = tile;
    });
    tile.addEventListener("dragend", handleDragEnd);
    tile.addEventListener("click", () => handleTileClick(tile));

    return tile;
}

function createBoard() {
    board = [];
    boardElement.innerHTML = "";

    for (let row = 0; row < rows; row++) {
        const boardRow = [];
        board.push(boardRow);

        for (let column = 0; column < columns; column++) {
            const tile = createTile(row, column);
            boardElement.appendChild(tile);
            boardRow.push(tile);
        }
    }
}

function handleTileClick(tile) {
    if (!selectedTile) {
        selectedTile = tile;
        selectedTile.classList.add("selected");
        setMessage("Now choose an adjacent candy to swap.");
        return;
    }

    if (selectedTile === tile) {
        clearSelection();
        setMessage("Selection cleared.");
        return;
    }

    tryMove(selectedTile, tile);
    clearSelection();
}

function handleDragEnd() {
    if (!draggedTile || !droppedTile) {
        draggedTile = null;
        droppedTile = null;
        return;
    }

    tryMove(draggedTile, droppedTile);
    draggedTile = null;
    droppedTile = null;
}

function tryMove(tileA, tileB) {
    if (!areAdjacent(tileA, tileB)) {
        setMessage("Candies must be next to each other.");
        return false;
    }

    if (getCandyName(tileA) === "blank" || getCandyName(tileB) === "blank") {
        return false;
    }

    swapTiles(tileA, tileB);

    if (!hasValidMatch()) {
        swapTiles(tileA, tileB);
        setMessage("No match there. Try another swap.");
        return false;
    }

    moves++;
    updateStats();
    setMessage("Sweet match!");
    crushCandy();
    return true;
}

function crushCandy() {
    let crushedAny = false;
    crushedAny = crushMatches() || crushedAny;

    if (crushedAny) {
        updateStats();
    }

    return crushedAny;
}

function crushMatches() {
    const matchedTiles = new Set();

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns - 2; column++) {
            const firstCandy = getCandyName(board[row][column]);

            if (
                firstCandy !== "blank" &&
                firstCandy === getCandyName(board[row][column + 1]) &&
                firstCandy === getCandyName(board[row][column + 2])
            ) {
                matchedTiles.add(board[row][column]);
                matchedTiles.add(board[row][column + 1]);
                matchedTiles.add(board[row][column + 2]);
            }
        }
    }

    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows - 2; row++) {
            const firstCandy = getCandyName(board[row][column]);

            if (
                firstCandy !== "blank" &&
                firstCandy === getCandyName(board[row + 1][column]) &&
                firstCandy === getCandyName(board[row + 2][column])
            ) {
                matchedTiles.add(board[row][column]);
                matchedTiles.add(board[row + 1][column]);
                matchedTiles.add(board[row + 2][column]);
            }
        }
    }

    matchedTiles.forEach((tile) => {
        tile.src = candyPath("blank");
    });

    score += matchedTiles.size * 10;
    return matchedTiles.size > 0;
}

function hasValidMatch() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns - 2; column++) {
            const candy = getCandyName(board[row][column]);

            if (
                candy !== "blank" &&
                candy === getCandyName(board[row][column + 1]) &&
                candy === getCandyName(board[row][column + 2])
            ) {
                return true;
            }
        }
    }

    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows - 2; row++) {
            const candy = getCandyName(board[row][column]);

            if (
                candy !== "blank" &&
                candy === getCandyName(board[row + 1][column]) &&
                candy === getCandyName(board[row + 2][column])
            ) {
                return true;
            }
        }
    }

    return false;
}

function slideCandy() {
    for (let column = 0; column < columns; column++) {
        let fillRow = rows - 1;

        for (let row = rows - 1; row >= 0; row--) {
            if (getCandyName(board[row][column]) !== "blank") {
                board[fillRow][column].src = board[row][column].src;
                fillRow--;
            }
        }

        for (let row = fillRow; row >= 0; row--) {
            board[row][column].src = candyPath("blank");
        }
    }
}

function generateCandy() {
    for (let column = 0; column < columns; column++) {
        if (getCandyName(board[0][column]) === "blank") {
            board[0][column].src = candyPath(randomCandy());
        }
    }
}

function runBoardCycle() {
    const crushedAny = crushCandy();
    slideCandy();
    generateCandy();

    if (crushedAny) {
        setMessage("Candies crushed. Keep going!");
    }
}

function resetGame() {
    window.clearInterval(gameLoop);
    score = 0;
    moves = 0;
    clearSelection();
    createBoard();
    updateStats();
    setMessage("Select a candy, then choose an adjacent candy.");
    gameLoop = window.setInterval(runBoardCycle, 140);
}

resetButton.addEventListener("click", resetGame);
resetGame();
