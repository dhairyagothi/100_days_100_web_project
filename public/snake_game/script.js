const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLS = 24;
const ROWS = 24;
const CELL = 20;
canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;
// Target audio tags loaded from HTML
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

let snake, dir, nextDir, food, score, level, speed, running, paused;

let highScore = 0;
let isGameOver = false;
let finalScore = 0;

// ─── RAF game loop state ───────────────────────────────────────────────────
let rafId        = null;   // requestAnimationFrame handle (main loop)
let lastTickTime = 0;      // timestamp of last logic tick
let accumulator  = 0;      // ms accumulated since last tick
// ──────────────────────────────────────────────────────────────────────────

// ─── Page Visibility API — pause/resume on tab switch ─────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (running && !paused) {
      setPaused(true);
      paused_by_visibility = true;
    }
  } else {
    if (paused_by_visibility) {
      setPaused(false);
      paused_by_visibility = false;
    }
  }
});
let paused_by_visibility = false; // tracks auto-pause vs user-pause

function setPaused(value) {
  paused = value;
  const overlay = document.getElementById('pauseOverlay');
  if (overlay) {
    value ? overlay.classList.remove('hidden') : overlay.classList.add('hidden');
  }
  if (!value) {
    lastTickTime = performance.now();
    accumulator  = 0;
  }
}
// ──────────────────────────────────────────────────────────────────────────

// ─── Web Audio sound engine ────────────────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Some browsers suspend the context until a user gesture
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}


function playTone(freq, type = 'square', duration = 0.08, gainPeak = 0.18) {
  try {
    const ac  = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);

    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(gainPeak, ac.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration + 0.01);
  } catch (e) {

  }
}

function soundEat() {
  // Quick rising blip — classic 8-bit pick-up
  playTone(440, 'square', 0.06, 0.15);
  setTimeout(() => playTone(660, 'square', 0.08, 0.12), 40);
}

function soundLevelUp() {
  // Ascending fanfare
  [330, 440, 550, 660].forEach((f, i) =>
    setTimeout(() => playTone(f, 'square', 0.12, 0.14), i * 60)
  );
}

function soundDie() {
  // Descending crunch
  [220, 180, 140, 100].forEach((f, i) =>
    setTimeout(() => playTone(f, 'sawtooth', 0.12, 0.20), i * 70)
  );
}

function initGame() {
  const startX = Math.floor(COLS / 2);
  const startY = Math.floor(ROWS / 2);
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];


  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  level = 1;
  speed = 160;
  running = false;
  setPaused(false);

  placeFood();
  updateHUD();
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function updateHUD(bumped) {
  const scoreEl = document.getElementById('score');
  const hsEl = document.getElementById('highscore');
  const lvlEl = document.getElementById('level');

  scoreEl.textContent = score;
  hsEl.textContent = highScore;
  lvlEl.textContent = level;

  if (bumped) {
    [scoreEl, hsEl, lvlEl].forEach(el => {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
      el.addEventListener('transitionend', () => el.classList.remove('bump'), { once: true });
    });
  }
}

function draw() {
  // Background
  ctx.fillStyle = '#050a05';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid dots
  ctx.fillStyle = '#0d1f0d';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillRect(c * CELL + CELL / 2 - 1, r * CELL + CELL / 2 - 1, 2, 2);
    }
  }

  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 300));

  ctx.save();
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 15 * pulse;
  ctx.fillStyle = `hsl(0, 100%, ${45 + 15 * pulse}%)`;
  ctx.beginPath();
  ctx.arc(fx, fy, (CELL / 2 - 3) * pulse * 0.9 + 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
// Snake
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    const t = i / (snake.length - 1 || 1);

    const g = Math.round(255 * (1 - t * 0.65));
    const color = isHead ? '#39ff14' : `rgb(0, ${g}, 0)`;

    const padding = isHead ? 1 : Math.min(3, 1 + t * 2);
    const x = seg.x * CELL + padding;
    const y = seg.y * CELL + padding;
    const size = CELL - padding * 2;

    ctx.save();
    if (isHead) {
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.restore();

    // Eyes
    if (isHead) {
      ctx.fillStyle = '#050a05';
      const eyeSize = 3;
      let e1, e2;
      if (dir.x === 1) { e1 = [x + size - 5, y + 3]; e2 = [x + size - 5, y + size - 6]; }
      else if (dir.x === -1) { e1 = [x + 2, y + 3]; e2 = [x + 2, y + size - 6]; }
      else if (dir.y === -1) { e1 = [x + 3, y + 2]; e2 = [x + size - 6, y + 2]; }
      else { e1 = [x + 3, y + size - 5]; e2 = [x + size - 6, y + size - 5]; }
      ctx.fillRect(e1[0], e1[1], eyeSize, eyeSize);
      ctx.fillRect(e2[0], e2[1], eyeSize, eyeSize);
    }
  });
}

// ─── Logic tick (called by RAF loop when enough time has elapsed) ──────────
function tick() {
  dir = { ...nextDir };

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y,
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame();
    return;
  }

  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);
  // Food eaten
  if (head.x === food.x && head.y === food.y) {
    score += level * 10;
    if (score > highScore) highScore = score;

    // Play EAT Sound Effect smoothly
    if (eatSound) {
      eatSound.currentTime = 0;
      eatSound.play().catch(err => console.log("Audio play blocked by browser config", err));
    }

    const foodsEaten = snake.length - 3;
    const newLevel = Math.floor(foodsEaten / 5) + 1;
    if (newLevel !== level) {
      level = newLevel;
      speed = Math.max(60, 150 - (level - 1) * 15);
      soundLevelUp();
    } else {
      soundEat();
    }

    updateHUD(true);
    placeFood();
  } else {
    snake.pop();
    updateHUD(false);
  }
}

// Single Game Loop Engine using high precision requestAnimationFrame (Fixes choppy lag)
function gameEngine(timestamp) {
  if (!lastTickTime) lastTickTime = timestamp;

  if (running && !paused) {
    const elapsed = timestamp - lastTickTime;

    // Guard: if the tab was hidden and visibility API didn't fire (edge case),
    // a huge elapsed value would cause multiple rapid ticks. Cap it to one tick worth.
    if (elapsed > speed * 3) {
      lastTickTime = timestamp;
    } else if (elapsed >= speed) {
      tick();
      lastTickTime = timestamp;
    }
  } else {
    lastTickTime = timestamp; // Keep synced while resting
  }

  // Draw continuously for buttery smooth animations
  if (!isGameOver) {
    draw();
  }

  requestAnimationFrame(gameEngine);
}

function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

// ──────────────────────────────────────────────────────────────────────────

function startGame() {
  document.getElementById('startOverlay').classList.add('hidden');
  document.getElementById('gameOverOverlay').classList.add('hidden');

  isGameOver = false;
  initGame();
  running = true;
  lastTickTime = 0;

  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);
}

// ─── Game-over flash — uses RAF, not a competing setInterval ──────────────
function endGame() {
  finalScore = score;
  running = false;
  isGameOver = true;

  document.removeEventListener('keydown', handleKeyDown);

  // Play GAME OVER sound asset
  if (gameOverSound) {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(err => console.log("Audio play blocked", err));
  }

  let flashes = 0;
  const flashInterval = setInterval(() => {
    flashes++;
    if (flashes % 2 === 1) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      draw();
    }

    if (flashes >= 6) {
      clearInterval(flashInterval);
      draw();
      document.getElementById('finalScore').textContent = `SCORE: ${finalScore}  |  BEST: ${highScore}`;
      document.getElementById('gameOverOverlay').classList.remove('hidden');
    }
  }, 120); // Steady interval rate clears excessive flickering
}

const KEY_MAP = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

function handleKeyDown(e) {
  if (isGameOver) return;

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  const newDir = KEY_MAP[e.key];

  if (newDir && !running) {
    startGame();
    if (newDir.x !== -dir.x || newDir.y !== -dir.y) {
      nextDir = newDir;
    }
  } else if (newDir && running && !paused) {
    if (newDir.x !== -dir.x || newDir.y !== -dir.y) {
      nextDir = newDir;
    }
  }

  if ((e.key === 'p' || e.key === 'P') && running) {
  e.preventDefault();
  setPaused(!paused);
 }
}

document.addEventListener('keydown', handleKeyDown);

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Idle animation on start screen
function animateIdle() {
  if (!running && !isGameOver) {
    draw();
    rafId = requestAnimationFrame(animateIdle);
  }
}

initGame();
requestAnimationFrame(gameEngine);

// ========== MOBILE TOUCH CONTROLS ==========
(function () {
  const mobileCanvas = document.getElementById('gameCanvas');
  const controls = document.getElementById('mobileControls');

  if (!controls) return;

  let lastTouch = 0;
  let startX = 0, startY = 0;

  const setDir = (direction) => {
    if (typeof isGameOver !== 'undefined' && isGameOver) return;

    const now = Date.now();
    if (now - lastTouch < 80) return;
    lastTouch = now;

    const dirMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    const newDir = dirMap[direction];
    if (!newDir) return;

    if (typeof running !== 'undefined' && !running) {
      if (typeof startGame === 'function') {
        startGame();
      }
      if (typeof nextDir !== 'undefined' && typeof dir !== 'undefined') {
        if (newDir.x !== -dir.x || newDir.y !== -dir.y) nextDir = newDir;
      }
      return;
    }

    if (typeof running !== 'undefined' && running &&
        typeof paused  !== 'undefined' && !paused) {
      if (typeof dir !== 'undefined' && typeof nextDir !== 'undefined') {
        if (newDir.x !== -dir.x || newDir.y !== -dir.y) {
          nextDir = newDir;
          if ('vibrate' in navigator) navigator.vibrate(20);
        }
      }
    }
  };

  // D-pad buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click',      e => { e.preventDefault(); setDir(btn.dataset.dir); });
    btn.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); setDir(btn.dataset.dir); });
  });

  // Swipe on canvas
  if (mobileCanvas) {
    mobileCanvas.addEventListener('touchstart', e => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: false });

    mobileCanvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

      const swipe = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up');

      setDir(swipe);
    });

    mobileCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const isMobile = () => window.innerWidth <= 768 || 'ontouchstart' in window;
  const toggle = () => {
    if (controls) {
      controls.style.display = isMobile() ? 'flex' : 'none';
    }
  };

  toggle();
  window.addEventListener('resize', toggle);
  console.log('✅ Mobile touch controls loaded');
})();

const themeToggle = document.getElementById("themeToggle");

let isLight = localStorage.getItem("theme") === "light";

function applyTheme() {
  if (isLight) {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

applyTheme();

themeToggle.addEventListener("click", () => {
  isLight = !isLight;
  localStorage.setItem("theme", isLight ? "light" : "dark");
  applyTheme();
});