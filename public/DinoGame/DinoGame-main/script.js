const dino = document.getElementById("dino");
const gameCanvas = document.getElementById("gameCanvas");
const gameOverText = document.getElementById("gameover");
const scoreText = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let obstacles = [];
let score = 0;
let gameInterval, obstacleInterval;

function makeObstacle() {
    let obs = document.createElement("div");
    obs.className = "dynamic-obstacle";
    gameCanvas.appendChild(obs);
    obstacles.push({ el: obs, x: 800 });
}

function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= 5;
        obs.el.style.right = (700 - obs.x) + "px";
        if (obs.x < -70) {
            gameCanvas.removeChild(obs.el);
            obstacles.splice(i, 1);
            score += 10;
            scoreText.textContent = score;
        }
    }
}

function checkHit() {
    for (let obs of obstacles) {
        if (obs.x > 30 && obs.x < 130) {
            let dinoRect = dino.getBoundingClientRect();
            let obsRect = obs.el.getBoundingClientRect();
            if (dinoRect.bottom > obsRect.top &&
                dinoRect.right > obsRect.left &&
                dinoRect.left < obsRect.right) {
                endGame();
            }
        }
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    finalScoreText.textContent = score;
    gameOverText.classList.add("over");
    restartBtn.style.display = "inline-block";
}

function restartGame() {
    obstacles.forEach(obs => gameCanvas.removeChild(obs.el));
    obstacles = [];
    gameOverText.classList.remove("over");
    startGame();
}

function jump() {
    if (!dino.classList.contains("animD")) {
        dino.classList.add("animD");
        setTimeout(() => dino.classList.remove("animD"), 1000);
    }
}

function startGame() {
    gameRunning = true;
    score = 0;
    scoreText.textContent = score;
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    obstacleInterval = setInterval(makeObstacle, 2000);
    gameInterval = setInterval(() => {
        moveObstacles();
        checkHit();
    }, 20);
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        e.preventDefault();
        if (!gameRunning) startGame();
        jump();
    }
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
