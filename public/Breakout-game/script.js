const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameRunning = false;
let paused = false;
let brickRowCount = 10;
let brickColumnCount = 5;
let W = window.innerWidth;
let H = window.innerHeight;

function setupDisplay() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const pw = Math.round(W * dpr);
    const ph = Math.round(H * dpr);
    canvas.width = pw;
    canvas.height = ph;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const sx = pw / W;
    const sy = ph / H;
    ctx.setTransform(sx, 0, 0, sy, 0, 0);
}

setupDisplay();

const scale = W / 800;

const initialBallSpeed = Math.max(5, Math.round(4 * scale));

const ball = {
    x: W / 2,
    y: H / 2,
    size: Math.max(4, Math.round(5 * scale)),
    speed: initialBallSpeed,
    dx: 0,
    dy: 0,
};

const paddle = {
    x: W / 2 - 40 * scale,
    y: H - 30,
    w: Math.max(60, Math.round(80 * scale)),
    h: Math.max(10, Math.round(12 * scale)),
    speed: Math.max(6, Math.round(8 * scale)),
    dx: 0,
};

const brickPadding = 8;
const brickTopOffset = 50;
const brickAreaTop = brickTopOffset;

function initBricks() {
    brickRowCount = Math.max(8, Math.floor(W / 85));
    const brickW = Math.max(20, Math.round(((W - brickPadding * (brickRowCount + 1)) / brickRowCount) * 0.85));
    const brickH = Math.max(10, Math.round(brickW * 0.45));
    brickColumnCount = Math.max(3, Math.floor((H * 0.5 - brickAreaTop - brickPadding) / (brickH + brickPadding)));
    const brickOffsetX = (W - (brickRowCount * (brickW + brickPadding) - brickPadding)) / 2;

    bricks = [];
    for (let i = 0; i < brickRowCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickColumnCount; j++) {
            const x = i * (brickW + brickPadding) + brickOffsetX;
            const y = j * (brickH + brickPadding) + brickAreaTop + brickPadding;
            bricks[i][j] = { x, y, w: brickW, h: brickH, visible: true, color: getRandomColor() };
        }
    }
}

initBricks();

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = secondaryColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    const r = paddle.h / 2;
    ctx.moveTo(paddle.x + r, paddle.y);
    ctx.lineTo(paddle.x + paddle.w - r, paddle.y);
    ctx.quadraticCurveTo(paddle.x + paddle.w, paddle.y, paddle.x + paddle.w, paddle.y + r);
    ctx.lineTo(paddle.x + paddle.w, paddle.y + paddle.h - r);
    ctx.quadraticCurveTo(paddle.x + paddle.w, paddle.y + paddle.h, paddle.x + paddle.w - r, paddle.y + paddle.h);
    ctx.lineTo(paddle.x + r, paddle.y + paddle.h);
    ctx.quadraticCurveTo(paddle.x, paddle.y + paddle.h, paddle.x, paddle.y + paddle.h - r);
    ctx.lineTo(paddle.x, paddle.y + r);
    ctx.quadraticCurveTo(paddle.x, paddle.y, paddle.x + r, paddle.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawScore() {
    ctx.font = '600 16px Poppins, "Segoe UI", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 15, 24);
}

function drawTitle() {
    ctx.font = '700 14px Poppins, "Segoe UI", sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    ctx.fillText('Breakout Game', W / 2, 22);
}

function drawPauseOverlay() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '700 48px Poppins, "Segoe UI", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', W / 2, H / 2);
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
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    drawBall();
    drawPaddle();
    drawScore();
    drawTitle();
    drawBricks();
    if (paused) drawPauseOverlay();
}

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
    if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > W || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    if (
        ball.x + ball.size > paddle.x &&
        ball.x - ball.size < paddle.x + paddle.w &&
        ball.y + ball.size >= paddle.y &&
        ball.y - ball.size <= paddle.y + paddle.h &&
        ball.dy > 0
    ) {
        ball.dy = -ball.speed;
        ball.y = paddle.y - ball.size - 1;
    }

    let hitBrick = false;
    for (let i = 0; i < bricks.length && !hitBrick; i++) {
        for (let j = 0; j < bricks[i].length && !hitBrick; j++) {
            const brick = bricks[i][j];
            if (brick.visible) {
                if (
                    ball.x + ball.size > brick.x &&
                    ball.x - ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    hitBrick = true;

                    increaseScore();
                    checkWin();
                }
            }
        }
    }

    if (ball.y + ball.size > H) {
        showGameOver();
    }
}

function increaseScore() {
    score++;
}

function checkWin() {
    const allBricksBroken = bricks.every((column) =>
        column.every((brick) => !brick.visible)
    );

    if (allBricksBroken) {
        gameRunning = false;
        paused = false;

        document.getElementById("pause-btn").classList.add("hidden");

        document
            .getElementById("game-over-container")
            .classList.remove("hidden");

        document.querySelector(
            ".game-over-content h2"
        ).innerText = "You Win! 🎉";

        document.getElementById("final-score").innerText = score;

        if (score > highScore) {
            highScore = score;

            localStorage.setItem("highScore", highScore);
        }

        document.getElementById("high-score").innerText =
            highScore;
    }
}

function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    else if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        document.getElementById("pause-btn").click();
    }
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

function update() {
    if (!paused) {
        movePaddle();
        moveBall();
    }
    draw();
    if (gameRunning && !paused) {
        requestAnimationFrame(update);
    }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
canvas.addEventListener("mousemove", (e) => {
    paddle.x = e.clientX - paddle.w / 2;
    if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
    if (paddle.x < 0) paddle.x = 0;
});

document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    paddle.x = touch.clientX - paddle.w / 2;
    if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
    if (paddle.x < 0) paddle.x = 0;
}, { passive: true });

window.addEventListener("resize", () => {
    const oldW = W;
    const oldH = H;
    const ratioX = window.innerWidth / oldW;
    const ratioY = window.innerHeight / oldH;

    setupDisplay();

    ball.x *= ratioX;
    ball.y *= ratioY;
    ball.size = Math.max(4, Math.round(5 * (W / 800)));
    ball.speed = Math.max(5, Math.round(4 * (W / 800)));

    paddle.x *= ratioX;
    paddle.y = H - 30;
    paddle.w = Math.max(60, Math.round(80 * (W / 800)));
    paddle.h = Math.max(10, Math.round(12 * (W / 800)));
    paddle.speed = Math.max(6, Math.round(8 * (W / 800)));

    initBricks();
    draw();
});

document.getElementById("pause-btn").addEventListener("click", () => {
    if (!gameRunning) return;
    paused = !paused;
    document.getElementById("pause-icon").textContent = paused ? "play_arrow" : "pause";
    if (!paused) update();
    else draw();
});

function startGame() {
    document.getElementById("rules-container").style.display = "none";

    document
        .getElementById("game-over-container")
        .classList.add("hidden");

    document.querySelector(".game-over-content h2").innerText = "Game Over";

    paused = false;
    document.getElementById("pause-icon").textContent = "pause";
    document.getElementById("pause-btn").classList.remove("hidden");

    resetGame();

    document.getElementById("high-score").innerText = highScore;

    if (!gameRunning) {
        startCountdown();
    }
}

function resetGame() {
    score = 0;

    ball.x = W / 2;
    ball.y = H / 2;

    ball.speed = initialBallSpeed;

    ball.dx = ball.speed;
    ball.dy = -ball.speed;

    paddle.x = W / 2 - paddle.w / 2;

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
    paused = false;

    document.getElementById("pause-btn").classList.add("hidden");

    document
        .getElementById("game-over-container")
        .classList.remove("hidden");

    document.getElementById("final-score").innerText = score;

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

            update();
        }
    }, 1000);
}
