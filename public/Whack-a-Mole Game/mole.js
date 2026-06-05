let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let moleInterval = null;  // track mole interval to prevent duplicates
let plantInterval = null; // track plant interval to prevent duplicates

window.onload = function () {
    setGame();
}

function setGame() {

    // set up grid
    for (let i = 0; i < 9; i++) {

        let tile = document.createElement("div");
        tile.id = i.toString();

        tile.addEventListener("click", selectTile);

        document.getElementById("board").appendChild(tile);
    }

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

function getRandomTile() {

    let num = Math.floor(Math.random() * 9);

    return num.toString();
}

function setMole() {

    if (gameOver) {
        return;
    }

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();

    if (currPlantTile && currPlantTile.id == num) {
        return;
    }

    currMoleTile = document.getElementById(num);

    currMoleTile.appendChild(mole);
}

function setPlant() {

    if (gameOver) {
        return;
    }

    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();

    if (currMoleTile && currMoleTile.id == num) {
        return;
    }

    currPlantTile = document.getElementById(num);

    currPlantTile.appendChild(plant);
}

function selectTile() {

    if (gameOver) {
        return;
    }

    if (this == currMoleTile) {

        score += 10;

        document.getElementById("score").innerText = score.toString();
    }

    else if (this == currPlantTile) {

        document.getElementById("score").innerText =
            "GAME OVER: " + score.toString();

        gameOver = true;

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

        // dark overlay
        document.body.classList.add("game-over");
    }
}

function restartGame() {

    score = 0;

    gameOver = false;

    document.getElementById("score").innerText = score;

    // hide button
    document.getElementById("restart-btn").style.display = "none";

    // remove overlay
    document.body.classList.remove("game-over");

    // clear mole
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    // clear plant
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    currMoleTile = null;
    currPlantTile = null;

    // Restart intervals fresh — previous ones were cleared on game over
    // so there is no risk of concurrent loop accumulation
    moleInterval = setInterval(setMole, 1000);
    plantInterval = setInterval(setPlant, 2000);
}