const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highEl = document.getElementById("high");
const levelEl = document.getElementById("level");
const menu = document.getElementById("menu");

const themeBtn = document.getElementById("themeBtn");

let grid = 20;
let snake, food, dir;
let score = 0;
let level = 1;
let speed = 120;
let running = false;
let loop;

let high = localStorage.getItem("high") || 0;
highEl.textContent = high;

/* INIT */
function init() {
    snake = [{x:200,y:200}];
    dir = {x:grid,y:0};
    score = 0;
    level = 1;
    speed = 120;
    spawnFood();
    updateUI();
}

/* FOOD */
function spawnFood() {
    food = {
        x: Math.floor(Math.random()*25)*grid,
        y: Math.floor(Math.random()*25)*grid
    };
}

/* UI */
function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
}

/* DRAW */
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,500,500);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid, grid);

    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, grid, grid));

    let head = {
        x: snake[0].x + dir.x,
        y: snake[0].y + dir.y
    };

    if(head.x < 0 || head.y < 0 || head.x >= 500 || head.y >= 500)
        return gameOver();

    if(snake.some(s => s.x === head.x && s.y === head.y))
        return gameOver();

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y) {
        score++;
        spawnFood();

        if(score % 5 === 0) {
            level++;
            speed -= 10;
            restartLoop();
        }

        updateUI();
    } else {
        snake.pop();
    }
}

/* LOOP */
function gameLoop() {
    if(!running) return;
    draw();
    loop = setTimeout(gameLoop, speed);
}

/* START */
function start() {
    if(running) return;
    running = true;
    menu.classList.remove("show");
    gameLoop();
}

/* RESTART LOOP */
function restartLoop() {
    clearTimeout(loop);
    gameLoop();
}

/* GAME OVER */
function gameOver() {
    running = false;

    if(score > high) {
        high = score;
        localStorage.setItem("high", high);
        highEl.textContent = high;
    }

    alert("Game Over!");
}

/* CONTROLS */
document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") dir = {x:0,y:-grid};
    if(e.key === "ArrowDown") dir = {x:0,y:grid};
    if(e.key === "ArrowLeft") dir = {x:-grid,y:0};
    if(e.key === "ArrowRight") dir = {x:grid,y:0};
});

/* BUTTONS */
document.getElementById("startBtn").onclick = () => { init(); start(); };
document.getElementById("restartBtn").onclick = () => { init(); start(); };
document.getElementById("pauseBtn").onclick = () => running = false;
document.getElementById("playBtn").onclick = () => { init(); start(); };

/* THEME */
themeBtn.onclick = () => {
    document.body.classList.toggle("light");
};

/* START STATE */
init();
menu.classList.add("show");