const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 80,
  y: 300,
  width: 32,
  height: 42,
  vx: 0,
  vy: 0,
  speed: 6,
  jumpPower: -15,
  grounded: false,
  facing: 1,
};
let keys = {};
let gravity = 0.75;
let time = 0;
let maxRewinds = 3;
let rewindsUsed = 0;
let history = [];
let ghosts = [];
let particles = [];
let isPaused = false;
let currentLevel = 1;

let platforms = [],
  switches = [],
  doors = [],
  movingPlatforms = [],
  pressurePlates = [];
let goal = { x: 700, y: 100, width: 40, height: 40 };

const RECORD_INTERVAL = 2;

const tabContents = [
  `<div class="help-section"><h3>🎮 Controls</h3>
        <p><strong>← → / A D</strong> — Move</p>
        <p><strong>SPACE / W / ↑</strong> — Jump</p>
        <p><strong>E</strong> — Interact (Switches)</p>
        <p><strong>R</strong> — Rewind Time</p>
        <p><strong>P</strong> — Pause</p>
        <p><strong>H</strong> — Help</p>
        <p><strong>Shift + R</strong> — Restart Level</p>
        <p><strong>ESC</strong> — Close Menus</p></div>`,

  `<div class="help-section"><h3>⏳ How to Play</h3>
        <p>• Rewind time to create ghosts of your past actions.</p>
        <p>• Ghosts repeat exactly what you did.</p>
        <p>• Use ghosts to press switches and hold platforms.</p>
        <p>• Reach the glowing star to complete the level.</p></div>`,

  `<div class="help-section"><h3>⭐ Tips</h3>
        <p>• Stack multiple ghosts for harder puzzles.</p>
        <p>• Moving platforms can be held by ghosts.</p>
        <p>• Plan your rewinds carefully.</p>
        <p>• Timing is everything!</p></div>`,
];

function switchTab(n) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn, i) => btn.classList.toggle("active", i === n));
  document.getElementById("tabContent").innerHTML = tabContents[n];
}

function showHelp() {
  document.getElementById("helpPanel").style.display = "block";
  switchTab(0);
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseMenu").style.display = isPaused
    ? "flex"
    : "none";
}

function resumeGame() {
  isPaused = false;
  document.getElementById("pauseMenu").style.display = "none";
}

function restartLevel() {
  isPaused = false;
  document.getElementById("pauseMenu").style.display = "none";
  document.getElementById("levelComplete").style.display = "none";
  loadLevel(currentLevel);
}

function quitToMenu() {
  if (confirm("Return to main menu?")) {
    alert("Main Menu - Demo Version");
    isPaused = false;
    document.getElementById("pauseMenu").style.display = "none";
    loadLevel(1);
  }
}

function createParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * 6 - 5,
      life: 25 + Math.random() * 25,
      color,
    });
  }
}

function loadLevel(level) {
  platforms = [];
  switches = [];
  doors = [];
  movingPlatforms = [];
  pressurePlates = [];
  ghosts = [];
  history = [];
  rewindsUsed = 0;
  time = 0;
  player.x = 80;
  player.y = 300;
  player.vx = 0;
  player.vy = 0;

  if (level === 1) {
    platforms.push({ x: 0, y: 520, w: 800, h: 80 });
    platforms.push({ x: 180, y: 420, w: 180, h: 20 });
    platforms.push({ x: 480, y: 320, w: 160, h: 20 });
    switches.push({ x: 520, y: 280, w: 35, h: 35, activated: false });
    doors.push({ x: 680, y: 420, w: 35, h: 100, open: false });
    goal.x = 730;
    goal.y = 200;
  } else if (level === 2) {
    platforms.push({ x: 0, y: 520, w: 800, h: 80 });
    movingPlatforms.push({
      x: 200,
      y: 400,
      w: 140,
      h: 20,
      speed: 2,
      minX: 200,
      maxX: 450,
    });
    platforms.push({ x: 520, y: 280, w: 120, h: 20 });
    pressurePlates.push({ x: 250, y: 500, w: 60, h: 15, activated: false });
    switches.push({ x: 580, y: 240, w: 35, h: 35, activated: false });
    doors.push({ x: 650, y: 380, w: 35, h: 140, open: false });
    goal.x = 720;
    goal.y = 120;
  } else if (level === 3) {
    platforms.push({ x: 0, y: 520, w: 800, h: 80 });
    platforms.push({ x: 100, y: 380, w: 120, h: 20 });
    movingPlatforms.push({
      x: 300,
      y: 300,
      w: 100,
      h: 20,
      speed: 1.5,
      minX: 280,
      maxX: 520,
    });
    platforms.push({ x: 550, y: 220, w: 150, h: 20 });
    pressurePlates.push({ x: 150, y: 500, w: 60, h: 15, activated: false });
    switches.push({ x: 180, y: 340, w: 35, h: 35, activated: false });
    switches.push({ x: 620, y: 180, w: 35, h: 35, activated: false });
    doors.push({ x: 680, y: 420, w: 35, h: 100, open: false });
    goal.x = 730;
    goal.y = 80;
  }

  document.getElementById("levelDisplay").textContent = `Level ${level}`;
}

function rectCollision(a, b) {
  return (
    a.x < b.x + (b.w || b.width) &&
    a.x + a.width > b.x &&
    a.y < b.y + (b.h || b.height) &&
    a.y + a.height > b.y
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f1429";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = "rgba(0, 255, 180, 0.08)";
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Platforms
  ctx.fillStyle = "#6677aa";
  platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.w, p.h));

  // Moving Platforms
  ctx.fillStyle = "#44aaff";
  movingPlatforms.forEach((mp) => ctx.fillRect(mp.x, mp.y, mp.w, mp.h));

  // Doors
  ctx.fillStyle = "#aa44aa";
  doors.forEach((d) => {
    if (!d.open) ctx.fillRect(d.x, d.y, d.w, d.h);
  });

  // Pressure Plates
  ctx.fillStyle = "#ff8800";
  pressurePlates.forEach((p) => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
    if (p.activated) {
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(p.x, p.y, p.w, 8);
      ctx.fillStyle = "#ff8800";
    }
  });

  // Switches
  switches.forEach((s) => {
    ctx.fillStyle = s.activated ? "#00ff88" : "#ffaa00";
    ctx.fillRect(s.x, s.y, s.w, s.h);
  });

  // Goal
  ctx.save();
  ctx.translate(goal.x + 20, goal.y + 20);
  ctx.rotate(time / 25);
  ctx.fillStyle = "#ffff44";
  ctx.fillRect(-18, -18, 36, 36);
  ctx.restore();

  // Ghosts
  ctx.globalAlpha = 0.45;
  ghosts.forEach((ghost) => {
    if (ghost.frame < ghost.path.length) {
      const p = ghost.path[ghost.frame];
      ctx.fillStyle = "#77aaff";
      ctx.fillRect(p.x, p.y, player.width, player.height);
    }
  });
  ctx.globalAlpha = 1;

  // Player
  const bob = Math.sin(time / 8) * 1.5;
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y + bob, player.width, player.height);
  ctx.fillStyle = "#002233";
  ctx.fillRect(
    player.x + (player.facing > 0 ? 18 : 8),
    player.y + 12 + bob,
    8,
    10,
  );

  // Particles
  ctx.globalAlpha = 0.9;
  particles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 6, 6);
  });
  ctx.globalAlpha = 1;
}

function update() {
  if (isPaused) return;

  player.vx = 0;
  if (keys["ArrowLeft"] || keys["a"]) {
    player.vx = -player.speed;
    player.facing = -1;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.vx = player.speed;
    player.facing = 1;
  }

  if ((keys[" "] || keys["w"] || keys["ArrowUp"]) && player.grounded) {
    player.vy = player.jumpPower;
    player.grounded = false;
    createParticles(player.x + 16, player.y + 40, 12, "#88ffff");
  }

  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;
  [...platforms, ...movingPlatforms].forEach((p) => {
    if (rectCollision(player, p)) {
      if (player.vy > 0) {
        player.y = p.y - player.height;
        player.vy = 0;
        player.grounded = true;
      }
    }
  });

  // Moving platforms
  movingPlatforms.forEach((mp) => {
    mp.x += mp.speed;
    if (mp.x <= mp.minX || mp.x >= mp.maxX) mp.speed *= -1;
  });

  // Interactions
  if (keys["e"] || keys["E"]) {
    switches.forEach((s) => {
      if (!s.activated && Math.hypot(player.x - s.x, player.y - s.y) < 70) {
        s.activated = true;
        createParticles(s.x + 17, s.y + 17, 20, "#00ff88");
        doors.forEach((d) => (d.open = true));
      }
    });
    keys["e"] = false;
  }

  // Goal
  if (Math.hypot(player.x - goal.x, player.y - goal.y) < 50) {
    document.getElementById("levelComplete").style.display = "flex";
    document.getElementById("levelTime").textContent = Math.floor(time / 60);
    document.getElementById("rewindsUsed").textContent = rewindsUsed;
  }

  // Record history
  if (time % RECORD_INTERVAL === 0) {
    history.push({ x: player.x, y: player.y });
  }

  time++;
  document.getElementById("timeDisplay").textContent =
    `Time: ${Math.floor(time / 60)}s`;
  document.getElementById("rewindCount").textContent =
    `Rewinds: ${rewindsUsed}/${maxRewinds}`;

  ghosts.forEach((g) => g.frame++);

  // Update particles
  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.life--;
    return p.life > 0;
  });
}

function rewind() {
  if (rewindsUsed >= maxRewinds || history.length < 100) return;
  rewindsUsed++;
  const rewindFrames = Math.min(360, Math.floor(history.length * 0.75));
  const ghostPath = history.splice(-rewindFrames);
  ghosts.push({ path: ghostPath, frame: 0 });
  const past = ghostPath[0];
  player.x = past.x;
  player.y = past.y;
  player.vy = 0;
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key.toLowerCase() === "r") {
    if (e.shiftKey) restartLevel();
    else rewind();
  }
  if (e.key.toLowerCase() === "p") togglePause();
  if (e.key.toLowerCase() === "h") showHelp();
  if (e.key === "Escape") {
    const help = document.getElementById("helpPanel");
    if (help.style.display === "block") help.style.display = "none";
    else togglePause();
  }
});

window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Button listeners
document.getElementById("pauseBtn").onclick = togglePause;
document.getElementById("restartBtn").onclick = restartLevel;
document.getElementById("helpBtn").onclick = showHelp;
document.getElementById("closeHelp").onclick = () =>
  (document.getElementById("helpPanel").style.display = "none");

function nextLevel() {
  document.getElementById("levelComplete").style.display = "none";
  currentLevel++;
  if (currentLevel > 3) {
    alert("🎉 Congratulations! You completed the demo!");
    currentLevel = 1;
  }
  loadLevel(currentLevel);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
loadLevel(1);
gameLoop();
