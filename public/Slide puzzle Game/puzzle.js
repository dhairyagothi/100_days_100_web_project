var rows = 3;
var columns = 3;

var currTile;
var otherTile; // blank tile

var turns = 0;
var timerInterval;

// The blank tile is 3.jpg in this project. 
// We will use 0 to represent the blank tile in our logic.
// The tiles 1-8 will map to 1.jpg, 2.jpg, 4.jpg, 5.jpg, 6.jpg, 7.jpg, 8.jpg, 9.jpg.
var imgOrder = [4, 2, 8, 5, 1, 6, 7, 9, 0];
var winOrder = ["1.jpg", "2.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "3.jpg"];

window.onload = function() {
    createBoard();

    document.getElementById("shuffleBtn").addEventListener("click", randomizeBoard);

    // Set a timer for 5 minutes (300,000 milliseconds) and display the countdown
    startTimer(5 * 60);
};

/**
 * Maps our internal tile numbers to the actual image filenames.
 * 0 is the blank tile, which corresponds to 3.jpg.
 * Other numbers map to themselves, except numbers > 2 which map to (n+1).jpg
 * because 3.jpg is skipped (it's the blank).
 * 
 * @param {number} n - internal tile number
 * @returns {string} - filename
 */
function getImgFilename(n) {
    if (n === 0) return "3.jpg";
    if (n <= 2) return n + ".jpg";
    return (n + 1) + ".jpg";
}

function createBoard() {
    document.getElementById("board").innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            
            let tileValue = imgOrder[r * columns + c];
            tile.src = getImgFilename(tileValue);

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }
}

/**
 * Checks if a given board configuration is solvable.
 * 
 * The math behind solvability:
 * 1. Count inversions: a pair (i, j) where i < j but tiles[i] > tiles[j], ignoring 0.
 * 2. If the grid width is odd (e.g. 3x3), the board is solvable if inversions is even.
 * 3. If the grid width is even (e.g. 4x4), the board is solvable if:
 *    - the blank is on an even row from bottom and inversions is odd.
 *    - the blank is on an odd row from bottom and inversions is even.
 * This can be simplified to: (inversions + blankRowFromBottom) % 2 === 0.
 * 
 * @param {number[]} tiles - 1D array of tile values (0 = blank tile)
 * @param {number} gridSize - The width/height of the grid (e.g. 4 for 4x4)
 * @returns {boolean} - True if solvable
 */
function isSolvable(tiles, gridSize) {
    let inversions = 0;
    
    // Count inversions, ignoring the blank tile (0)
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] !== 0 && tiles[j] !== 0 && tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }

    if (gridSize % 2 !== 0) {
        // For odd-width grids (like 3x3): solvable if inversions is even
        return inversions % 2 === 0;
    } else {
        // For even-width grids (like 4x4): find the row of the blank tile counting from bottom (1-indexed)
        const blankIndex = tiles.indexOf(0);
        const blankRowFromTop = Math.floor(blankIndex / gridSize);
        const blankRowFromBottom = gridSize - blankRowFromTop;
        
        // returns true if (inversions + blankRowFromBottom) is even
        return (inversions + blankRowFromBottom) % 2 === 0;
    }
}

/**
 * Generates a guaranteed solvable tile array using Fisher-Yates and parity correction.
 * 
 * @param {number} gridSize - The width/height of the grid
 * @returns {number[]} - A guaranteed-solvable 1D array
 */
function generateSolvableBoard(gridSize) {
    const totalTiles = gridSize * gridSize;
    
    // 1. Creates a solved board array [1, 2, 3, ... n*n-1, 0]
    let tiles = [];
    for (let i = 1; i < totalTiles; i++) {
        tiles.push(i);
    }
    tiles.push(0);

    // 2. Applies Fisher-Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // 3. Calls isSolvable() — if false, swaps tiles[0] and tiles[1] (both non-zero) to flip parity
    if (!isSolvable(tiles, gridSize)) {
        // Ensure we swap two non-zero tiles to flip parity without moving the blank
        let idx1 = 0, idx2 = 1;
        if (tiles[idx1] === 0 || tiles[idx2] === 0) {
            // Find two indices that are not 0
            let nonZeroIndices = [];
            for (let i = 0; i < tiles.length && nonZeroIndices.length < 2; i++) {
                if (tiles[i] !== 0) nonZeroIndices.push(i);
            }
            idx1 = nonZeroIndices[0];
            idx2 = nonZeroIndices[1];
        }
        [tiles[idx1], tiles[idx2]] = [tiles[idx2], tiles[idx1]];
    }

    // 4. Returns the guaranteed-solvable tile array
    return tiles;
}

function randomizeBoard() {
    // Generate a solvable board
    imgOrder = generateSolvableBoard(columns);

    createBoard();

    turns = 0;
    document.getElementById("turns").innerText = "Turns: 0";
    startTimer(5 * 60);
}

function startTimer(duration) {

    clearInterval(timerInterval);

    var timer = duration, minutes, seconds;

    timerInterval = setInterval(function () {

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("time").innerText = "Time Left: " + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            alert("Time's up! 5 minutes have passed.");
        }

    }, 1000);
}

function dragStart() {
    currTile = this;
    console.log("Drag Start: " + currTile.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
    console.log("Drag Drop: " + otherTile.id);
}

function dragEnd() {
    if (!otherTile.src.includes("3.jpg")) {
        console.log("Not a valid move. Tile is not blank.");
        return;
    }

    console.log("Drag End: " + currTile.id + " -> " + otherTile.id);

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    console.log("Is Adjacent: " + isAdjacent);

    if (isAdjacent) {

        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns++;

        document.getElementById("turns").innerText = "Turns: " + turns;

        console.log("Turns: " + turns);

        // Check if the player has won
        if (checkWin()) {
            clearInterval(timerInterval);
            alert("Congratulations! You've solved the puzzle!");
        }
    }
}

function checkWin() {

    let tiles = document.querySelectorAll("#board img");

    for (let i = 0; i < tiles.length; i++) {

        if (tiles[i].src.includes(winOrder[i]) === false) {
            return false;
        }
    }

    return true;
}
