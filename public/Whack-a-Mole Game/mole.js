let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;

// Global tracking references for intervals to prevent memory leaks
let moleIntervalId = null;
let plantIntervalId = null;

window.onload = function () {
    setGame();
};

function setGame() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Ensure the container is empty before initializing

    // --- SETUP GRID TEMPLATE ---
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        board.appendChild(tile);
    }

    // --- CENTRALIZED EVENT DELEGATION ---
    board.addEventListener("click", function (e) {
        // Intercept target element ensuring it's an active grid tile div
        const clickedTile = e.target.closest("#board > div");
        if (!clickedTile) return;

        selectTile(clickedTile);
    });

    // Start background loops
    startIntervals();
}

function startIntervals() {
    // Clear any loose running loops first
    clearInterval(moleIntervalId);
    clearInterval(plantIntervalId);

    moleIntervalId = setInterval(setMole, 1000);
    plantIntervalId = setInterval(setPlant, 2000);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) return;

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();

    // Prevent overwriting a position already occupied by a plant
    if (currPlantTile && currPlantTile.id === num) {
        return;
    }

    currMoleTile = document.getElementById(num);
    if (currMoleTile) {
        currMoleTile.appendChild(mole);
    }
}

function setPlant() {
    if (gameOver) return;

    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();

    // Prevent overwriting a position already occupied by a mole
    if (currMoleTile && currMoleTile.id === num) {
        return;
    }

    currPlantTile = document.getElementById(num);
    if (currPlantTile) {
        currPlantTile.appendChild(plant);
    }
}

function selectTile(tile) {
    if (gameOver) return;

    // Hit a mole successfully!
    if (tile === currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();

        // Clear immediately so user cannot double-click spam the same mole
        currMoleTile.innerHTML = "";
        currMoleTile = null;
    }
    // Hit a plant — Game Over!
    else if (tile === currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString();
        gameOver = true;

        // Clear active process background timers
        clearInterval(moleIntervalId);
        clearInterval(plantIntervalId);

        // UI state displays
        document.getElementById("restart-btn").style.display = "inline-block";
        document.body.classList.add("game-over");
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score;

    // Clean UI overlays
    document.getElementById("restart-btn").style.display = "none";
    document.body.classList.remove("game-over");

    // Clear grid structures
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";

    currMoleTile = null;
    currPlantTile = null;

    // Reactivate clean, non-accumulated engine intervals
    startIntervals();
}