var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;
var isProcessing = false;
var hintTimer;
var HINT_DELAY = 7000;

window.onload = function() {
    startGame();
    resetHintTimer();

    // Reset button functionality
    document.getElementById("Reset").addEventListener("click", function() {
        if (isProcessing) return;
        score = 0;
        document.getElementById("score1").innerText = score;
        board = [];
        document.getElementById("board").innerHTML = "";
        startGame();
        resetHintTimer();
    });
}
    


function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

function startGame() {
    isProcessing = false;
    score = 0;
    document.getElementById("score1").innerText = score;
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    board = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let candy;
            do {
                candy = randomCandy();
            } while (
                (c >= 2 && row[c - 1].src.includes(candy) && row[c - 2].src.includes(candy)) ||
                (r >= 2 && board[r - 1][c].src.includes(candy) && board[r - 2][c].src.includes(candy))
            );
            let tile = document.createElement("img");
            tile.draggable = true;
            tile.id = r + "-" + c;
            tile.src = "./images/" + candy + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            boardElement.append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    if (!hasAvailableMoves()) {
        shuffleBoard();
    }
}

function dragStart() {
    if (isProcessing) return;
    clearHint();
    resetHintTimer();
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

async function dragEnd() {
    if (isProcessing || !otherTile) return;

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            currTile.src = currImg;
            otherTile.src = otherImg;
        } else {
            await resolveCascades();
        }
    }
    otherTile = null;
    resetHintTimer();
}

function findMatches() {
    let matches = new Set();
    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                matches.add(candy1);
                matches.add(candy2);
                matches.add(candy3);
            }
        }
    }
    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                matches.add(candy1);
                matches.add(candy2);
                matches.add(candy3);
            }
        }
    }
    return Array.from(matches);
}

function checkValid() {
    return findMatches().length > 0;
}

async function resolveCascades() {
    clearHint();
    clearTimeout(hintTimer);
    isProcessing = true;
    let combo = 1;
    while (true) {
        let matches = findMatches();
        if (matches.length === 0) break;

        if (combo > 1) {
            showCombo(combo);
        }

        score += matches.length * 10 * combo;
        document.getElementById("score1").innerText = score;

        matches.forEach(tile => {
            tile.src = "./images/blank.png";
        });

        await new Promise(resolve => setTimeout(resolve, 300));

        await slideAndRefill();
        combo++;
    }
    
    if (!hasAvailableMoves()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        shuffleBoard();
        await resolveCascades();
    }
    
    isProcessing = false;
    resetHintTimer();
}

async function slideAndRefill() {
    // Sliding logic
    for (let c = 0; c < columns; c++) {
        let emptySpaces = 0;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c].src.includes("blank")) {
                emptySpaces++;
            } else if (emptySpaces > 0) {
                board[r + emptySpaces][c].src = board[r][c].src;
                board[r][c].src = "./images/blank.png";
            }
        }
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Refill logic
    for (let c = 0; c < columns; c++) {
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "./images/" + randomCandy() + ".png";
            }
        }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
}

function resetHintTimer() {
    clearHint();
    clearTimeout(hintTimer);

    hintTimer = setTimeout(() => {
        if (!isProcessing) {
            showHint();
        }
    }, HINT_DELAY);
}

function clearHint() {
    document.querySelectorAll(".candy-hint").forEach(tile => {
        tile.classList.remove("candy-hint");
    });
}

function findAvailableMove() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && testSwap(r, c, r, c + 1)) {
                return [board[r][c], board[r][c + 1]];
            }

            if (r < rows - 1 && testSwap(r, c, r + 1, c)) {
                return [board[r][c], board[r + 1][c]];
            }
        }
    }

    return [];
}

function showHint() {
    clearHint();

    const hintTiles = findAvailableMove();
    hintTiles.forEach(tile => {
        tile.classList.add("candy-hint");
    });
}

function hasAvailableMoves() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Try swapping with right
            if (c < columns - 1) {
                if (testSwap(r, c, r, c + 1)) return true;
            }
            // Try swapping with down
            if (r < rows - 1) {
                if (testSwap(r, c, r + 1, c)) return true;
            }
        }
    }
    return false;
}

function testSwap(r1, c1, r2, c2) {
    let img1 = board[r1][c1].src;
    let img2 = board[r2][c2].src;
    
    // Temporary swap
    board[r1][c1].src = img2;
    board[r2][c2].src = img1;
    
    let valid = checkValid();
    
    // Swap back
    board[r1][c1].src = img1;
    board[r2][c2].src = img2;
    
    return valid;
}

function shuffleBoard() {
    clearHint();

    let allCandies = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            allCandies.push(board[r][c].src);
        }
    }

    do {
        // Shuffle the array
        for (let i = allCandies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCandies[i], allCandies[j]] = [allCandies[j], allCandies[i]];
        }

        // Apply to board
        let idx = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                board[r][c].src = allCandies[idx++];
            }
        }
    } while (checkValid() || !hasAvailableMoves());
}

function showCombo(combo) {
    const display = document.getElementById("combo-display");
    display.innerText = "COMBO x" + combo + "!";
    display.classList.add("show");
    setTimeout(() => {
        display.classList.remove("show");
    }, 800);
}
