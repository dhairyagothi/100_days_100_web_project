let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;

window.onload = function() {
    setGame();
}

function setGame() {

    // set up the grid in html
    for (let i = 0; i < 9; i++) {

        // <div id="0-8"></div>
        let tile = document.createElement("div");

        tile.id = i.toString();

        tile.addEventListener("click", selectTile);

        document.getElementById("board").appendChild(tile);
    }

    // 1000 milliseconds = 1 second
    setInterval(setMole, 1000);

    // 2000 milliseconds = 2 seconds
    setInterval(setPlant, 2000);
}

function getRandomTile() {

    // math.random --> 0-1
    // (0-1) * 9 = (0-9)
    // round down to (0-8)

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

        document.getElementById("score").innerText =
            score.toString();
    }

    else if (this == currPlantTile) {

        document.getElementById("score").innerText =
            "GAME OVER: " + score.toString();

        gameOver = true;
    }
}

function restartGame() {

    location.reload();
}