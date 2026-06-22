let currMoleTile = null;
let currPlantTile = null;
let score = 0;
let gameOver = false;
let moleInterval = null;  // track mole interval to prevent duplicates
let plantInterval = null; // track plant interval to prevent duplicates

// Global interval tracking to prevent memory leak accumulation
let moleIntervalId = null;
let plantIntervalId = null;

window.onload = function () {
    setGame();
};

function setGame() {
    const board = document.getElementById("board");
    board.replaceChildren(); // Safe initialization clear

    // --- SETUP GRID TEMPLATE ---
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        board.appendChild(tile);
    }

    // --- CENTRALIZED EVENT DELEGATION ---
    board.addEventListener("click", function (e) {
        // Intercept target element ensuring it's a grid tile inside the board
        const clickedTile = e.target.closest("#board > div");
        if (!clickedTile) return;

        selectTile(clickedTile);
    });

    // Initialize game background loops
    startIntervals();
    // Clear any existing intervals before starting new ones to prevent
    // concurrent loop accumulation if setGame() is ever called more than once
    if (moleInterval !== null) {
        clearInterval(moleInterval);
    }
    if (plantInterval !== null) {
        clearInterval(plantInterval);
    }

    moleInterval = setInterval(setMole, 1000);
    plantInterval = setInterval(setPlant, 2000);
}

function startIntervals() {
    // Clear any loose running loops first to keep memory clean
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
        currMoleTile.replaceChildren(); // Safe alternative to innerHTML = ""
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
        currPlantTile.replaceChildren(); // Safe alternative to innerHTML = ""
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
        document.getElementById("score").textContent = score.toString(); // Safe text rendering

        // Play the hit sound
        let hitSound = new Audio("./hit sound.mp3");
        hitSound.currentTime = 0.1;
        hitSound.play();

        // Clear immediately so user cannot double-click spam the same mole frame
        currMoleTile.replaceChildren();
        currMoleTile = null;
    }
    // Hit a plant — Game Over!
    else if (tile === currPlantTile) {
        let hitSound = new Audio("./die.mp3");
        hitSound.volume  = 0.2;
        hitSound.play();
        document.getElementById("score").textContent = "GAME OVER: " + score.toString();
        gameOver = true;

        // Clear active engine intervals completely
        clearInterval(moleIntervalId);
        clearInterval(plantIntervalId);
        // Stop intervals immediately so moles/plants freeze on game over
        if (moleInterval !== null) {
            clearInterval(moleInterval);
            moleInterval = null;
        }
        if (plantInterval !== null) {
            clearInterval(plantInterval);
            plantInterval = null;
        }

        // show restart button
        document.getElementById("restart-btn").style.display =
            "inline-block";

        // UI state toggles
        document.getElementById("restart-btn").style.display = "inline-block";
        document.body.classList.add("game-over");
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    document.getElementById("score").textContent = score.toString();

    // Hide UI elements
    document.getElementById("restart-btn").style.display = "none";
    document.body.classList.remove("game-over");

    // Clear tile nodes securely without parsing strings
    if (currMoleTile) currMoleTile.replaceChildren();
    if (currPlantTile) currPlantTile.replaceChildren();

    currMoleTile = null;
    currPlantTile = null;

    // Reactivate game engine tracking loops safely
    startIntervals();
    // Restart intervals fresh — previous ones were cleared on game over
    // so there is no risk of concurrent loop accumulation
    moleInterval = setInterval(setMole, 1000);
    plantInterval = setInterval(setPlant, 2000);
}