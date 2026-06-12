const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CELL = 25;
const COLS = 32;
const ROWS = 24;

let maze = [],
  player = { x: 1, y: 1, px: CELL * 1, py: CELL * 1 },
  exit = {},
  revealed = new Set();
let time = 0,
  level = 1,
  gameOver = false,
  paused = false;
let timerInterval;
let keys = {};
let trail = [];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function beep(freq = 400, dur = 60) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  gain.gain.value = 0.2;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  setTimeout(() => osc.stop(), dur);
}

function generateMaze() {
  maze = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(1));
  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = [
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0],
    ].sort(() => Math.random() - 0.5);
    for (let [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (
        nx > 0 &&
        nx < COLS - 1 &&
        ny > 0 &&
        ny < ROWS - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }
  carve(1, 1);
  exit = { x: COLS - 2, y: ROWS - 2 };
  maze[exit.y][exit.x] = 0;
}

function resetGame(newLevel = 1) {
  level = newLevel;
  generateMaze();
  player = { x: 1, y: 1, px: CELL * 1, py: CELL * 1 };
  revealed.clear();
  trail = [];
  time = 0;
  gameOver = false;
  paused = false;

  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("pauseScreen").style.display = "none";
  document.getElementById("hud").style.display = "flex";
  document.getElementById("level").textContent = level;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameOver && !paused) time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  draw();
}

function returnToHome() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("hud").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

function update() {
  if (gameOver || paused) return;

  let dx = 0,
    dy = 0;
  if (keys["ArrowLeft"] || keys["a"]) dx = -1;
  if (keys["ArrowRight"] || keys["d"]) dx = 1;
  if (keys["ArrowUp"] || keys["w"]) dy = -1;
  if (keys["ArrowDown"] || keys["s"]) dy = 1;

  const speed = 0.32;
  const nextX = player.px + dx * speed * CELL;
  const nextY = player.py + dy * speed * CELL;

  const gridX = Math.floor(nextX / CELL);
  const gridY = Math.floor(nextY / CELL);

  if (maze[gridY] && maze[gridY][gridX] === 0) {
    player.px = nextX;
    player.py = nextY;
    player.x = Math.round(player.px / CELL);
    player.y = Math.round(player.py / CELL);

    trail.push({ x: player.px + CELL / 2, y: player.py + CELL / 2 });
    if (trail.length > 14) trail.shift();
  } else if (dx || dy) {
    beep(180, 50);
  }

  const radius = 5.5;
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const rx = player.x + x;
      const ry = player.y + y;
      if (rx >= 0 && rx < COLS && ry >= 0 && ry < ROWS)
        revealed.add(`${rx},${ry}`);
    }
  }

  if (player.x === exit.x && player.y === exit.y) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById("finalStats").innerHTML =
      `Level ${level}<br>Time: ${time}s`;
    document.getElementById("gameOverScreen").style.display = "flex";
  }
}

function draw() {
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = 5.5;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dist = Math.hypot(x - player.x, y - player.y);
      if (dist > radius && !revealed.has(`${x},${y}`)) continue;

      if (maze[y][x] === 1) {
        let shade;
        if (x < COLS / 2 && y < ROWS / 2)
          shade = "#00ff88"; // Top-Left
        else if (x >= COLS / 2 && y < ROWS / 2)
          shade = "#00cc77"; // Top-Right
        else if (x < COLS / 2 && y >= ROWS / 2)
          shade = "#00aa66"; // Bottom-Left
        else shade = "#00ff99"; // Bottom-Right

        ctx.fillStyle = dist < radius ? shade : "#001a11";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  // Trail
  ctx.shadowBlur = 18;
  ctx.shadowColor = "#00ffff";
  for (let i = 0; i < trail.length; i++) {
    ctx.globalAlpha = (i / trail.length) * 0.7;
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(trail[i].x - 5, trail[i].y - 5, 10, 10);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Player
  ctx.shadowBlur = 45;
  ctx.shadowColor = "#00ffff";
  ctx.fillStyle = "#00ffff";
  ctx.beginPath();
  ctx.arc(
    player.px + CELL / 2,
    player.py + CELL / 2,
    CELL * 0.38,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.shadowBlur = 0;

  // Exit
  ctx.shadowBlur = 50;
  ctx.shadowColor = "#00ff44";
  ctx.fillStyle = "#00ff44";
  ctx.fillRect(exit.x * CELL + 6, exit.y * CELL + 6, CELL - 12, CELL - 12);
  ctx.shadowBlur = 0;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === "f" || e.key === "F") toggleFullscreen();
  if (e.key === "p" || e.key === "P") togglePause();
  if (e.key === "h" || e.key === "H") toggleHelp();
  if (e.key === "r" || e.key === "R") resetGame(level);
});

window.addEventListener("keyup", (e) => (keys[e.key] = false));

function togglePause() {
  paused = !paused;
  document.getElementById("pauseScreen").style.display = paused
    ? "flex"
    : "none";
}

function toggleHelp() {
  const help = document.getElementById("helpScreen");
  help.style.display = help.style.display === "flex" ? "none" : "flex";
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function startGame(lvl) {
  document.getElementById("startScreen").style.display = "none";
  resetGame(lvl);
  gameLoop();
}

// Initial Load
document.getElementById("startScreen").style.display = "flex";
