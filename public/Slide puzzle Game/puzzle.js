var rows = 3;
var column = 3;

var currTile;
var otherTile; // blank tile

var turns = 0;

var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
var winOrder = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift() + ".jpg";

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); // click an image
            tile.addEventListener("dragover", dragOver); // moving image around
            tile.addEventListener("dragenter", dragEnter); // dragging image onto another one
            tile.addEventListener("dragleave", dragLeave); // dragged image leaving another image
            tile.addEventListener("drop", dragDrop); // dropping the image
            tile.addEventListener("dragend", dragEnd); // swap the two tiles

            document.getElementById("board").append(tile);
        }
    }

    // Set a timer for 5 minutes (300,000 milliseconds) and display the countdown
    startTimer(5 * 60);
};

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("time").innerText = "Time Left: " + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
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
            alert("Congratulations! You've solved the puzzle!");
        }
    }
}

function checkWin() {
    let tiles = document.getElementsByTagName("img");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].src.includes(winOrder[i]) === false) {
            return false;
        }
    }
    return true;
}
