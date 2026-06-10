const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameRunning = false;
let gamePaused = false;

// --- LIVES SYSTEM ---
let lives = 3;
const maxLives = 3;

const brickRowCount = 9;
const brickColumnCount = 5;
const heightRatio = 0.75;
canvas.height = canvas.width * heightRatio;
ctx.canvas.width = 800;
ctx.canvas.height = ctx.canvas.width * heightRatio;

const initialBallSpeed = 4;
let currentBrickColor = getRandomColor();

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: initialBallSpeed,
    dx: 0,
    dy: 0,
};

const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
};

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
    color: getRandomColor(),
};

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// --- DRAW FUNCTIONS ---

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = secondaryColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = 'bold 20px "Balsamiq Sans"';
    ctx.fillStyle = color;
    ctx.fillText(`Score: ${score}`, 45, 30);
}

// --- LIVES DISPLAY ---
function drawLives() {
    ctx.font = 'bold 18px "Balsamiq Sans"';
    ctx.fillStyle = color;
    let heartsText = "";
    for (let i = 0; i < lives; i++) heartsText += "❤️ ";
    ctx.fillText(heartsText, canvas.width - 120, 30);
}

function drawBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? brick.color : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawBricks();
}

// --- MOVEMENT ---

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
    if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                    checkWin();
                    currentBrickColor = getRandomColor();
                    bricks.forEach((col) => {
                        col.forEach((b) => {
                            b.color = currentBrickColor;
                        });
                    });
                }
            }
        });
    });

    // --- LIVES: lose a life instead of instant game over ---
    if (ball.y + ball.size > canvas.height) {
        lives--;
        if (lives <= 0) {
            showGameOver();
        } else {
            resetBallAndPaddle();
        }
    }
}

// Reset only ball and paddle (keep score and bricks)
function resetBallAndPaddle() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed;
    ball.dx = ball.speed;
    ball.dy = -ball.speed;
    paddle.x = canvas.width / 2 - 40;
    paddle.dx = 0;
}

// --- SCORE ---

function increaseScore() {
    score++;
    if (score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks();
    }
}

function showAllBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => (brick.visible = true));
    });
}

function checkWin() {
    const allBricksBroken = bricks.every((column) =>
        column.every((brick) => !brick.visible)
    );
    if (allBricksBroken) {
        gameRunning = false;
        document.getElementById("game-over-container").classList.remove("hidden");
        document.querySelector(".game-over-content h2").innerText = "You Win! 🎉";
        document.getElementById("final-score").innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        document.getElementById("high-score").innerText = highScore;
        document.getElementById("pause-btn").classList.add("hidden");
    }
}

// --- KEYBOARD CONTROLS ---

function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    else if (e.key === "p" || e.key === "P") togglePause();
}

function keyUp(e) {
    if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
    ) {
        paddle.dx = 0;
    }
}

// --- MOUSE CONTROL ---

canvas.addEventListener("mousemove", function (e) {
    if (!gameRunning || gamePaused) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.x = mouseX - paddle.w / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
    paddle.dx = 0;
});

// --- PAUSE SYSTEM ---

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        document.getElementById("pause-container").classList.remove("hidden");
    } else {
        document.getElementById("pause-container").classList.add("hidden");
        update();
    }
}

document.getElementById("resume-btn").addEventListener("click", function () {
    gamePaused = false;
    document.getElementById("pause-container").classList.add("hidden");
    update();
});

document.getElementById("pause-restart-btn").addEventListener("click", function () {
    gamePaused = false;
    gameRunning = false;
    document.getElementById("pause-container").classList.add("hidden");
    startGame();
});

document.getElementById("pause-btn").addEventListener("click", togglePause);

// --- GAME LOOP ---

function update() {
    if (!gameRunning || gamePaused) return;
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// --- GAME LIFECYCLE ---

function startGame() {
    document.getElementById("rules-container").style.display = "none";
    document.getElementById("game-over-container").classList.add("hidden");
    document.querySelector(".game-over-content h2").innerText = "Game Over";
    resetGame();
    document.getElementById("high-score").innerText = highScore;
    if (!gameRunning) {
        startCountdown();
    }
}

function resetGame() {
    score = 0;
    lives = maxLives;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed;
    ball.dx = ball.speed;
    ball.dy = -ball.speed;
    paddle.x = canvas.width / 2 - 40;
    paddle.dx = 0;
    resetBricks();
    document.getElementById("final-score").innerText = 0;
    draw();
}

function resetBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => (brick.visible = true));
    });
}

function showGameOver() {
    gameRunning = false;
    document.getElementById("game-over-container").classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
    document.getElementById("pause-btn").classList.add("hidden");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("high-score").innerText = highScore;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    countdownEl.classList.remove("hidden");
    let count = 3;
    countdownEl.innerText = count;
    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.innerText = count;
        } else if (count === 0) {
            countdownEl.innerText = "GO!";
        } else {
            clearInterval(timer);
            countdownEl.classList.add("hidden");
            gameRunning = true;
            gamePaused = false;
            document.getElementById("pause-btn").classList.remove("hidden");
            update();
        }
    }, 1000);
}