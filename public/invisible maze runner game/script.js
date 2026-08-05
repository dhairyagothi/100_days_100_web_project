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
  round = 1,
  gameOver = false,
  paused = false;

let timerInterval;
let keys = {};
let trail = [];
let particles = [];
let gameStarted = false;

// Movement state
let isMoving = false;
let targetPx = CELL * 1, targetPy = CELL * 1;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq = 400, dur = 60, type = "square", vol = 0.15) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur / 1000);
}

function playStep() {
  beep(280 + Math.random() * 60, 30, "sine", 0.04);
}

function playBump() {
  beep(120, 80, "sawtooth", 0.1);
}

function playRoundComplete() {
  beep(523, 80, "sine", 0.2);
  setTimeout(() => beep(659, 80, "sine", 0.2), 80);
  setTimeout(() => beep(784, 150, "sine", 0.22), 160);
}

function playLevelComplete() {
  beep(523, 100, "sine", 0.2);
  setTimeout(() => beep(659, 100, "sine", 0.2), 100);
  setTimeout(() => beep(784, 100, "sine", 0.2), 200);
  setTimeout(() => beep(1047, 300, "sine", 0.25), 300);
}

// Iterative maze generation (avoids stack overflow + ensures connectivity)
function generateMaze() {
  maze = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(1));

  const stack = [[1, 1]];
  maze[1][1] = 0;

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const dirs = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    let carved = false;
    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < COLS - 1 && ny > 0 && ny < ROWS - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        maze[ny][nx] = 0;
        stack.push([nx, ny]);
        carved = true;
        break;
      }
    }
    if (!carved) stack.pop();
  }

  // Difficulty scaling: add loops as rounds increase.
  // More loops = more paths = harder to navigate in fog of war.
  const loopsToAdd = (round - 1) * 2;
  let added = 0, attempts = 0;
  while (added < loopsToAdd && attempts < loopsToAdd * 20) {
    attempts++;
    const x = 1 + Math.floor(Math.random() * (COLS - 2));
    const y = 1 + Math.floor(Math.random() * (ROWS - 2));
    if (maze[y][x] === 1) {
      const horizontal = (maze[y][x - 1] === 0 && maze[y][x + 1] === 0);
      const vertical = (maze[y - 1] && maze[y + 1] && maze[y - 1][x] === 0 && maze[y + 1][x] === 0);
      if (horizontal || vertical) {
        maze[y][x] = 0;
        added++;
      }
    }
  }

  // Exit at a valid odd-odd reachable position (FIX: original was unreachable)
  exit = { x: COLS - 3, y: ROWS - 3 };
}

function spawnTrailParticles(x, y) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      life: 1.0,
      size: 1 + Math.random() * 2.5,
      hue: Math.random() < 0.5 ? "#00ffff" : "#d902ee"
    });
  }
}

function resetGame(newLevel = 1, newRound = 1) {
  level = newLevel;
  round = newRound;
  generateMaze();
  player = { x: 1, y: 1, px: CELL * 1, py: CELL * 1 };
  targetPx = CELL * 1;
  targetPy = CELL * 1;
  isMoving = false;
  revealed.clear();
  trail = [];
  particles = [];
  if (newRound === 1) time = 0;
  gameOver = false;
  paused = false;

  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("pauseScreen").style.display = "none";
  document.getElementById("hud").style.display = "flex";

  const levelNames = ["", "BEGINNER", "INTERMEDIATE", "EXPERT"];
  document.getElementById("level").textContent = levelNames[level] || level;
  document.getElementById("round").textContent = `${round}/10`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameOver && !paused) time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  draw();
}

function showRoundTransition(text, callback) {
  const el = document.getElementById("roundTransition");
  const txt = document.getElementById("roundTransitionText");
  txt.textContent = text;
  el.style.display = "flex";
  // Re-trigger animation
  txt.style.animation = "none";
  void txt.offsetWidth;
  txt.style.animation = "";
  setTimeout(() => {
    el.style.display = "none";
    callback();
  }, 900);
}

function returnToHome() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("hud").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

function update() {
  if (gameOver || paused) return;

  const speed = 3.5;

  if (isMoving) {
    if (player.px < targetPx) player.px = Math.min(player.px + speed, targetPx);
    else if (player.px > targetPx) player.px = Math.max(player.px - speed, targetPx);

    if (player.py < targetPy) player.py = Math.min(player.py + speed, targetPy);
    else if (player.py > targetPy) player.py = Math.max(player.py - speed, targetPy);

    player.x = Math.round(player.px / CELL);
    player.y = Math.round(player.py / CELL);

    if (player.px === targetPx && player.py === targetPy) {
      isMoving = false;
      trail.push({ x: player.px + CELL / 2, y: player.py + CELL / 2, life: 1 });
      if (trail.length > 25) trail.shift();
      spawnTrailParticles(player.px + CELL / 2, player.py + CELL / 2);
    }
  } else {
    // Grid-locked step movement
    let dx = 0, dy = 0;
    if (keys["arrowleft"] || keys["a"]) dx = -1;
    else if (keys["arrowright"] || keys["d"]) dx = 1;
    else if (keys["arrowup"] || keys["w"]) dy = -1;
    else if (keys["arrowdown"] || keys["s"]) dy = 1;

    if (dx !== 0 || dy !== 0) {
      const nextX = player.x + dx;
      const nextY = player.y + dy;

      if (maze[nextY] && maze[nextY][nextX] === 0) {
        targetPx = nextX * CELL;
        targetPy = nextY * CELL;
        isMoving = true;
        playStep();
      } else {
        if (!keys["bumped"]) {
          playBump();
          keys["bumped"] = true;
        }
      }
    } else {
      keys["bumped"] = false;
    }
  }

  // Fog of war reveal
  const baseRadius = 6 - level * 0.8;
  const radius = Math.max(2, baseRadius - (round * 0.15));

  for (let y = -Math.ceil(radius); y <= Math.ceil(radius); y++) {
    for (let x = -Math.ceil(radius); x <= Math.ceil(radius); x++) {
      if (Math.hypot(x, y) <= radius) {
        const rx = player.x + x;
        const ry = player.y + y;
        if (rx >= 0 && rx < COLS && ry >= 0 && ry < ROWS)
          revealed.add(`${rx},${ry}`);
      }
    }
  }

  // Fade trail
  for (let t of trail) t.life *= 0.97;
  trail = trail.filter(t => t.life > 0.05);

  // Update stardust particles
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life *= 0.93;
    p.size *= 0.98;
  }
  particles = particles.filter(p => p.life > 0.05);

  // Exit condition
  if (!isMoving && player.x === exit.x && player.y === exit.y) {
    if (round < 10) {
      paused = true;
      playRoundComplete();
      const nextRound = round + 1;
      showRoundTransition(`ROUND ${nextRound}`, () => {
        resetGame(level, nextRound);
      });
    } else {
      gameOver = true;
      playLevelComplete();
      clearInterval(timerInterval);
      const levelNames = ["", "BEGINNER", "INTERMEDIATE", "EXPERT"];
      document.getElementById("finalStats").innerHTML =
        `${levelNames[level]} COMPLETE<br>Total Time: ${time}s`;
      document.getElementById("gameOverScreen").style.display = "flex";
    }
  }
}

function draw() {
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const baseRadius = 6 - level * 0.8;
  const radius = Math.max(2, baseRadius - (round * 0.15));

  // Draw walls with proximity-based brightness
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dist = Math.hypot(x - player.x, y - player.y);
      const inView = dist <= radius;
      const wasRevealed = revealed.has(`${x},${y}`);

      if (!inView && !wasRevealed) continue;

      if (maze[y][x] === 1) {
        let shade;
        if (x < COLS / 2 && y < ROWS / 2) shade = "#c51f5d";
        else if (x >= COLS / 2 && y < ROWS / 2) shade = "#b01755";
        else if (x < COLS / 2 && y >= ROWS / 2) shade = "#8b114d";
        else shade = "#4a1c40";

        if (inView) {
          const brightness = Math.max(0.35, 1 - (dist / radius) * 0.6);
          ctx.fillStyle = shade;
          ctx.globalAlpha = brightness;
        } else {
          ctx.fillStyle = "#1a081a";
          ctx.globalAlpha = 0.45;
        }
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Smooth light aura around player
  const auraGrad = ctx.createRadialGradient(
    player.px + CELL / 2, player.py + CELL / 2, 0,
    player.px + CELL / 2, player.py + CELL / 2, radius * CELL
  );
  auraGrad.addColorStop(0, "rgba(0, 255, 255, 0.18)");
  auraGrad.addColorStop(0.5, "rgba(120, 0, 180, 0.08)");
  auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Trail (fading stardust)
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    ctx.globalAlpha = t.life * 0.7;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00ffff";
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 2 + Math.sin(Date.now() / 100 + i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Stardust particles
  for (let p of particles) {
    ctx.globalAlpha = p.life;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.hue;
    ctx.fillStyle = p.hue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Player - bright pulsing cyan orb with glow halo
  const playerPulse = 1 + Math.sin(Date.now() / 200) * 0.12;
  const pcx = player.px + CELL / 2;
  const pcy = player.py + CELL / 2;

  const playerGrad = ctx.createRadialGradient(pcx, pcy, 0, pcx, pcy, CELL * 0.85);
  playerGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
  playerGrad.addColorStop(0.3, "rgba(0, 255, 255, 0.9)");
  playerGrad.addColorStop(0.7, "rgba(0, 180, 220, 0.4)");
  playerGrad.addColorStop(1, "rgba(0, 100, 200, 0)");
  ctx.fillStyle = playerGrad;
  ctx.beginPath();
  ctx.arc(pcx, pcy, CELL * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 45;
  ctx.shadowColor = "#00ffff";
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(pcx, pcy, CELL * 0.3 * playerPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Exit - swirling pulsating portal
  const ecx = exit.x * CELL + CELL / 2;
  const ecy = exit.y * CELL + CELL / 2;
  const exitPulse = 1 + Math.sin(Date.now() / 200) * 0.2;
  const exitGlow = 25 + Math.sin(Date.now() / 200) * 15;

  const exitGrad = ctx.createRadialGradient(ecx, ecy, 0, ecx, ecy, CELL * 1.3);
  exitGrad.addColorStop(0, "rgba(255, 100, 255, 0.95)");
  exitGrad.addColorStop(0.4, "rgba(180, 0, 200, 0.5)");
  exitGrad.addColorStop(1, "rgba(120, 0, 150, 0)");
  ctx.fillStyle = exitGrad;
  ctx.beginPath();
  ctx.arc(ecx, ecy, CELL * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Swirling rings
  ctx.strokeStyle = "rgba(255, 150, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.shadowBlur = exitGlow;
  ctx.shadowColor = "#d902ee";

  for (let i = 0; i < 3; i++) {
    const offset = (Date.now() / 250 + i * Math.PI * 0.7) % (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(ecx, ecy, CELL * 0.4 * exitPulse + i * 3, offset, offset + Math.PI * 1.3);
    ctx.stroke();
  }

  // Center bright dot
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ecx, ecy, CELL * 0.15 * exitPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === "f") toggleFullscreen();
  if (k === "p") togglePause();
  if (k === "h") toggleHelp();
  if (k === "r") resetGame(level, 1);
  if (["arrowleft", "arrowright", "arrowup", "arrowdown", "w", "a", "s", "d"].includes(k)) {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  keys[k] = false;
  if (["arrowleft", "arrowright", "arrowup", "arrowdown", "w", "a", "s", "d"].includes(k)) {
    keys["bumped"] = false;
  }
});

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  document.getElementById("pauseScreen").style.display = paused ? "flex" : "none";
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
  resetGame(lvl, 1);
  if (!gameStarted) {
    gameStarted = true;
    gameLoop();
  }
}

document.getElementById("startScreen").style.display = "flex";

