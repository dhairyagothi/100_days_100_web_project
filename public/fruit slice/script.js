const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");

let W, H;
function resize() {
  W = canvas.width = bgCanvas.width = window.innerWidth;
  H = canvas.height = bgCanvas.height = window.innerHeight;
  drawBG();
}
window.addEventListener("resize", resize);
resize();

// ---- BG ----
function drawBG() {
  const grad = bgCtx.createRadialGradient(
    W / 2,
    H / 2,
    0,
    W / 2,
    H / 2,
    Math.max(W, H),
  );
  grad.addColorStop(0, "#1a0a2e");
  grad.addColorStop(0.5, "#0d0d1a");
  grad.addColorStop(1, "#000008");
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, W, H);
  // Stars
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * W,
      y = Math.random() * H,
      r = Math.random() * 1.5;
    bgCtx.beginPath();
    bgCtx.arc(x, y, r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.6 + 0.1})`;
    bgCtx.fill();
  }
}

// ---- GAME STATE ----
let score = 0,
  lives = 3,
  level = 1,
  gameRunning = false,
  gamePaused = false;
let fruits = [],
  particles = [],
  sliceTrails = [],
  splats = [];
let combo = 0,
  comboTimer = 0;
let highScore = parseInt(localStorage.getItem("fruitHS") || "0");
let frameCount = 0,
  spawnTimer = 0;
let mouseX = 0,
  mouseY = 0,
  prevMouseX = 0,
  prevMouseY = 0;
let mouseSpeed = 0;
let animId;

const FRUIT_TYPES = [
  {
    emoji: "🍉",
    name: "watermelon",
    color: "#ff4466",
    juice: "#ff2244",
    points: 3,
    radius: 34,
  },
  {
    emoji: "🍊",
    name: "orange",
    color: "#ff8800",
    juice: "#ff6600",
    points: 2,
    radius: 28,
  },
  {
    emoji: "🍋",
    name: "lemon",
    color: "#ffee00",
    juice: "#ffdd00",
    points: 2,
    radius: 26,
  },
  {
    emoji: "🍇",
    name: "grape",
    color: "#9933ff",
    juice: "#7700cc",
    points: 4,
    radius: 27,
  },
  {
    emoji: "🍓",
    name: "strawberry",
    color: "#ff2255",
    juice: "#cc0033",
    points: 3,
    radius: 25,
  },
  {
    emoji: "🍑",
    name: "peach",
    color: "#ffaa66",
    juice: "#ff8844",
    points: 2,
    radius: 27,
  },
  {
    emoji: "🍍",
    name: "pineapple",
    color: "#ffdd00",
    juice: "#ffaa00",
    points: 5,
    radius: 32,
  },
  {
    emoji: "🥝",
    name: "kiwi",
    color: "#66cc44",
    juice: "#449922",
    points: 3,
    radius: 26,
  },
];

// ---- UI REFS ----
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const pauseBtn = document.getElementById("pause-btn");
const comboEl = document.getElementById("combo-display");
const levelFlash = document.getElementById("level-flash");
const levelFlashText = document.getElementById("level-flash-text");

function updateScore(pts) {
  score += pts;
  scoreEl.textContent = score;
  scoreEl.classList.remove("pop");
  void scoreEl.offsetWidth;
  scoreEl.classList.add("pop");
  setTimeout(() => scoreEl.classList.remove("pop"), 100);
  // Level up every 30 pts
  const newLevel = Math.floor(score / 30) + 1;
  if (newLevel > level) {
    level = newLevel;
    levelEl.textContent = level;
    showLevelFlash();
  }
}

function showLevelFlash() {
  levelFlashText.textContent = `LEVEL ${level}!`;
  levelFlash.style.opacity = "1";
  setTimeout(() => {
    levelFlash.style.opacity = "0";
  }, 1200);
}

function updateLives(delta) {
  lives += delta;
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`life-${i}`);
    el.classList.toggle("lost", i > lives);
  }
  if (lives <= 0) endGame();
}

// ---- FRUIT ----
function spawnFruit() {
  const isBomb = Math.random() < 0.12 + level * 0.01;
  const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
  const x = 80 + Math.random() * (W - 160);
  const vy = -(9 + Math.random() * 6 + level * 0.4);
  const vx = (Math.random() - 0.5) * 4;
  fruits.push({
    x,
    y: H + 60,
    vx,
    vy,
    ay: 0.28,
    radius: isBomb ? 30 : type.radius,
    isBomb,
    type: isBomb ? null : type,
    emoji: isBomb ? "💣" : type.emoji,
    color: isBomb ? "#333" : type.color,
    juice: isBomb ? "#555" : type.juice,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.1,
    sliced: false,
    opacity: 1,
    // For sliced halves
    half1: null,
    half2: null,
  });
}

function sliceFruit(fruit, mx, my) {
  if (fruit.sliced) return;
  fruit.sliced = true;

  if (fruit.isBomb) {
    // BOMB!
    triggerBombEffect(fruit.x, fruit.y);
    updateLives(-1);
    return;
  }

  const pts = (fruit.type.points || 1) * (combo >= 3 ? 2 : 1);
  updateScore(pts);

  // Combo
  combo++;
  comboTimer = 90;
  if (combo >= 3) showCombo();

  // Create halves
  const angle = Math.atan2(my - fruit.y, mx - fruit.x) + Math.PI / 2;
  createHalves(fruit, angle);
  // Juice splatter
  createJuiceSplatter(fruit.x, fruit.y, fruit.juice, fruit.radius);
  // Score float
  createScoreFloat(fruit.x, fruit.y - fruit.radius, "+" + pts);
}

function createHalves(fruit, angle) {
  for (let s = -1; s <= 1; s += 2) {
    particles.push({
      type: "half",
      x: fruit.x,
      y: fruit.y,
      vx: Math.cos(angle) * s * 3 + fruit.vx,
      vy: Math.sin(angle) * s * 3 + fruit.vy * 0.5,
      ay: 0.25,
      emoji: fruit.emoji,
      side: s,
      rotation: fruit.rotation,
      rotSpeed: fruit.rotSpeed + s * 0.12,
      opacity: 1,
      radius: fruit.radius,
      life: 80,
      maxLife: 80,
    });
  }
}

function createJuiceSplatter(x, y, color, r) {
  // Static splat on canvas
  splats.push({ x, y, color, r, opacity: 0.7, life: 220, maxLife: 220 });
  // Particles
  const count = 18 + Math.floor(r);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5;
    particles.push({
      type: "juice",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      ay: 0.18,
      color,
      radius: 2 + Math.random() * 5,
      opacity: 0.9,
      life: 40 + Math.random() * 30,
      maxLife: 70,
    });
  }
}

function createScoreFloat(x, y, text) {
  particles.push({
    type: "score",
    x,
    y,
    vx: 0,
    vy: -1.5,
    ay: 0,
    text,
    opacity: 1,
    life: 60,
    maxLife: 60,
  });
}

function triggerBombEffect(x, y) {
  // Big explosion particles
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 2 + Math.random() * 7;
    particles.push({
      type: "juice",
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 3,
      ay: 0.2,
      color: i % 3 === 0 ? "#ff4400" : i % 3 === 1 ? "#ffaa00" : "#ff0000",
      radius: 3 + Math.random() * 7,
      opacity: 1,
      life: 60 + Math.random() * 40,
      maxLife: 100,
    });
  }
  particles.push({
    type: "score",
    x,
    y: y - 40,
    vx: 0,
    vy: -2,
    ay: 0,
    text: "💥",
    opacity: 1,
    life: 60,
    maxLife: 60,
  });
}

function showCombo() {
  comboEl.textContent = `🔥 ${combo}x COMBO!`;
  comboEl.style.opacity = "1";
}

// ---- SLICE TRAIL ----
canvas.addEventListener("mousemove", (e) => {
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  mouseX = e.clientX;
  mouseY = e.clientY;
  const dx = mouseX - prevMouseX,
    dy = mouseY - prevMouseY;
  mouseSpeed = Math.sqrt(dx * dx + dy * dy);

  if (gameRunning && !gamePaused) {
    sliceTrails.push({ x: mouseX, y: mouseY, opacity: 1, life: 12 });
    if (mouseSpeed > 8) {
      checkSlice(prevMouseX, prevMouseY, mouseX, mouseY);
    }
  }
});

// Touch support
let lastTouch = null;
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  lastTouch = { x: t.clientX, y: t.clientY };
});
canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!lastTouch) return;
    prevMouseX = lastTouch.x;
    prevMouseY = lastTouch.y;
    mouseX = t.clientX;
    mouseY = t.clientY;
    const dx = mouseX - prevMouseX,
      dy = mouseY - prevMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    if (gameRunning && !gamePaused) {
      sliceTrails.push({ x: mouseX, y: mouseY, opacity: 1, life: 12 });
      if (mouseSpeed > 5) checkSlice(prevMouseX, prevMouseY, mouseX, mouseY);
    }
    lastTouch = { x: t.clientX, y: t.clientY };
  },
  { passive: false },
);

function checkSlice(x1, y1, x2, y2) {
  fruits.forEach((f) => {
    if (f.sliced) return;
    // Line-circle intersection
    const dx = x2 - x1,
      dy = y2 - y1;
    const fx = x1 - f.x,
      fy = y1 - f.y;
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - f.radius * f.radius;
    const disc = b * b - 4 * a * c;
    if (disc >= 0) sliceFruit(f, (x1 + x2) / 2, (y1 + y2) / 2);
  });
}

// ---- MAIN LOOP ----
function gameLoop() {
  if (!gameRunning) return;
  if (gamePaused) {
    animId = requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, W, H);
  frameCount++;

  // Spawn
  const spawnRate = Math.max(30 - level * 3, 10);
  spawnTimer++;
  if (spawnTimer >= spawnRate) {
    const count = 1 + (level > 3 ? 1 : 0) + (level > 6 ? 1 : 0);
    for (let i = 0; i < count; i++) setTimeout(spawnFruit, i * 180);
    spawnTimer = 0;
  }

  // Combo timer
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) {
      combo = 0;
      comboEl.style.opacity = "0";
    }
  }

  // Draw splats (juice on ground)
  splats.forEach((s) => {
    s.life--;
    s.opacity = (s.life / s.maxLife) * 0.65;
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y + s.r * 0.5, s.r * 1.2, s.r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Drips
    for (let i = 0; i < 4; i++) {
      const ox = (i - 1.5) * s.r * 0.4;
      const ht = s.r * (0.3 + Math.sin(i * 1.3) * 0.3);
      ctx.beginPath();
      ctx.ellipse(
        s.x + ox,
        s.y + s.r * 0.5 + ht * 0.5,
        s.r * 0.12,
        ht * 0.5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  });
  splats = splats.filter((s) => s.life > 0);

  // Draw slice trail
  sliceTrails.forEach((t, i) => {
    t.life--;
    t.opacity = t.life / 12;
  });
  if (sliceTrails.length > 1) {
    ctx.save();
    ctx.lineCap = "round";
    for (let i = 1; i < sliceTrails.length; i++) {
      const t = sliceTrails[i],
        p = sliceTrails[i - 1];
      ctx.globalAlpha = t.opacity * 0.8;
      ctx.strokeStyle = `hsl(${(frameCount * 5) % 360},100%,75%)`;
      ctx.lineWidth = 3 * t.opacity;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }
    ctx.restore();
  }
  sliceTrails = sliceTrails.filter((t) => t.life > 0);

  // Draw fruits
  fruits.forEach((f) => {
    if (f.sliced) return;
    f.x += f.vx;
    f.y += f.vy;
    f.vy += f.ay;
    f.rotation += f.rotSpeed;

    // Miss fruit
    if (f.y > H + 80 && !f.sliced) {
      f.sliced = true;
      if (!f.isBomb) {
        updateLives(-1);
        particles.push({
          type: "score",
          x: f.x,
          y: H - 40,
          vx: 0,
          vy: -1.5,
          ay: 0,
          text: "MISS!",
          opacity: 1,
          life: 60,
          maxLife: 60,
          color: "#ff4444",
        });
      }
    }

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.font = `${f.radius * 1.8}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Shadow glow
    ctx.shadowColor = f.isBomb ? "#ff4400" : f.color;
    ctx.shadowBlur = 15;
    ctx.fillText(f.emoji, 0, 0);
    ctx.restore();
  });
  fruits = fruits.filter((f) => f.y < H + 100);

  // Draw particles
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.ay;
    p.life--;
    p.opacity = p.life / p.maxLife;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);

    if (p.type === "juice") {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      const r = Math.max(0.01, p.radius * p.opacity);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "half") {
      p.rotation += p.rotSpeed;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Clip half
      ctx.beginPath();
      ctx.rect(
        p.side < 0 ? -p.radius * 2 : 0,
        -p.radius * 2,
        p.radius * 2,
        p.radius * 4,
      );
      ctx.clip();
      ctx.font = `${p.radius * 1.8}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 5;
      ctx.fillText(p.emoji, 0, 0);
      // Cut face (juice color)
      ctx.globalAlpha = p.opacity * 0.8;
      ctx.fillStyle = p.side < 0 ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)";
      ctx.fillRect(
        p.side < 0 ? -p.radius * 0.1 : -p.radius * 0.1,
        -p.radius,
        p.radius * 0.2,
        p.radius * 2,
      );
    } else if (p.type === "score") {
      ctx.fillStyle = p.color || "#ffee00";
      ctx.font = `bold ${28 + (p.text.length < 4 ? 10 : 0)}px 'Bangers', cursive`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = p.color || "#ffcc00";
      ctx.shadowBlur = 12;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.restore();
  });
  particles = particles.filter((p) => p.life > 0);

  animId = requestAnimationFrame(gameLoop);
}

// ---- CONTROLS ----
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  resetState();
  gameRunning = true;
  pauseBtn.style.display = "flex";
  document.getElementById("instructions").style.display = "block";
  gameLoop();
}

function resetState() {
  score = 0;
  lives = 3;
  level = 1;
  combo = 0;
  comboTimer = 0;
  frameCount = 0;
  spawnTimer = 0;
  fruits = [];
  particles = [];
  sliceTrails = [];
  splats = [];
  scoreEl.textContent = "0";
  levelEl.textContent = "1";
  for (let i = 1; i <= 3; i++)
    document.getElementById(`life-${i}`).classList.remove("lost");
  comboEl.style.opacity = "0";
  levelFlash.style.opacity = "0";
}

function endGame() {
  gameRunning = false;
  gamePaused = false;
  cancelAnimationFrame(animId);
  pauseBtn.style.display = "none";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("fruitHS", highScore);
  }
  document.getElementById("final-score").textContent = score;
  document.getElementById("high-score-label").textContent =
    `HIGH SCORE: ${highScore}`;
  document.getElementById("gameover-screen").style.display = "flex";
}

function restartGame() {
  document.getElementById("gameover-screen").style.display = "none";
  document.getElementById("pause-overlay").style.display = "none";
  cancelAnimationFrame(animId);
  gameRunning = false;
  gamePaused = false;
  resetState();
  gameRunning = true;
  pauseBtn.style.display = "flex";
  pauseBtn.textContent = "⏸";
  gameLoop();
}

function resumeGame() {
  gamePaused = false;
  document.getElementById("pause-overlay").style.display = "none";
  pauseBtn.textContent = "⏸";
}

pauseBtn.addEventListener("click", () => {
  if (!gameRunning) return;
  if (gamePaused) {
    resumeGame();
  } else {
    gamePaused = true;
    pauseBtn.textContent = "▶";
    document.getElementById("pause-overlay").style.display = "flex";
  }
});

// Keyboard pause
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "KeyP") {
    if (!gameRunning) return;
    if (gamePaused) resumeGame();
    else {
      gamePaused = true;
      pauseBtn.textContent = "▶";
      document.getElementById("pause-overlay").style.display = "flex";
    }
  }
});
