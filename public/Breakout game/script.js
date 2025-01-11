const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");
let score = 0;
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
    drawBricks();
}

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
    if (ball.y + ball.size > canvas.height) {
        resetGame(); //
    }
}



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

function showGameOver() {
    resetGame();
    update();
}
function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
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
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function startGame() {
    document.getElementById("rules-container").style.display = "none";
    resetGame();
    update();
}

function resetGame() {
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed; 
    ball.dx = ball.speed;
    ball.dy = -ball.speed; 
    resetBricks();
}

function resetBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => (brick.visible = true));
    });
}

function showGameOver() {
    resetGame();  
    update();  
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