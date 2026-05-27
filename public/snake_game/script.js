
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

const COLS = 24;
const ROWS = 24;
const CELL = 20;
canvas.width  = COLS * CELL;
canvas.height = ROWS * CELL;

let snake, dir, nextDir, food, score, level, speed, gameLoop, running, paused;

let highScore = 0;
let isGameOver = false; // FIX 1: new flag — single source of truth for dead state
let finalScore = 0;     // FIX 2: captures score the instant collision occurs 

function initGame() {
  
  const startX = Math.floor(COLS / 2);
  const startY = Math.floor(ROWS / 2);
  snake = [
    { x: startX,     y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  level   = 1;
  speed   = 160; // ms per tick
  running = false;
  paused  = false;
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
  const hsEl    = document.getElementById('highscore');
  const lvlEl   = document.getElementById('level');

  scoreEl.textContent = score;
  hsEl.textContent    = highScore;
  lvlEl.textContent   = level;

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
  
  ctx.fillStyle = '#050a05';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  
  ctx.fillStyle = '#0d1f0d';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillRect(c * CELL + CELL / 2 - 1, r * CELL + CELL / 2 - 1, 2, 2);
    }
  }

  
  const fx    = food.x * CELL + CELL / 2;
  const fy    = food.y * CELL + CELL / 2;
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 300));

  ctx.save();
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur  = 15 * pulse;
  ctx.fillStyle   = `hsl(0, 100%, ${45 + 15 * pulse}%)`;
  ctx.beginPath();
  ctx.arc(fx, fy, (CELL / 2 - 3) * pulse * 0.9 + 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    const t      = i / (snake.length - 1 || 1);

  
    const g     = Math.round(255 * (1 - t * 0.65));
    const color = isHead ? '#39ff14' : `rgb(0, ${g}, 0)`;

    const padding = isHead ? 1 : Math.min(3, 1 + t * 2);
    const x       = seg.x * CELL + padding;
    const y       = seg.y * CELL + padding;
    const size    = CELL - padding * 2;

    ctx.save();
    if (isHead) {
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur  = 12;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.restore();

    
    if (isHead) {
      ctx.fillStyle = '#050a05';
      const eyeSize = 3;
      let e1, e2;
      if      (dir.x ===  1) { e1 = [x + size - 5, y + 3];          e2 = [x + size - 5, y + size - 6]; }
      else if (dir.x === -1) { e1 = [x + 2,         y + 3];          e2 = [x + 2,         y + size - 6]; }
      else if (dir.y === -1) { e1 = [x + 3,         y + 2];          e2 = [x + size - 6,  y + 2]; }
      else                   { e1 = [x + 3,         y + size - 5];   e2 = [x + size - 6,  y + size - 5]; }
      ctx.fillRect(e1[0], e1[1], eyeSize, eyeSize);
      ctx.fillRect(e2[0], e2[1], eyeSize, eyeSize);
    }
  });
}


function tick() {
  if (!running || paused) return;

  dir = { ...nextDir };

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y,
  };

  
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame();
    return;
  }

  
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  
  if (head.x === food.x && head.y === food.y) {
    score += level * 10;
    if (score > highScore) highScore = score;

    
    const foodsEaten = snake.length - 3;
    const newLevel   = Math.floor(foodsEaten / 5) + 1;
    if (newLevel !== level) {
      level = newLevel;
      speed = Math.max(60, 150 - (level - 1) * 15);
      restartLoop();
    }

    updateHUD(true);
    placeFood();
    
  } else {
    snake.pop();
    updateHUD(false);
  }

  draw();
}

function restartLoop() {
  clearInterval(gameLoop);
  gameLoop = setInterval(tick, speed);
}

function startGame() {
  document.getElementById('startOverlay').classList.add('hidden');
  document.getElementById('gameOverOverlay').classList.add('hidden');
  cancelAnimationFrame(animFrame); // stop idle animation

  isGameOver = false; // FIX 1: clear the flag so inputs can be taken again
 
  // FIX 3: re-attach the listener as the player has restarted the game
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);

  
  initGame();
  running = true;
  draw();
  restartLoop();
}

function endGame() {

  // FIX 2: Changes finalScore early
  finalScore = score;

  running = false;
  isGameOver = true; // FIX 1: raises the dead flag
  clearInterval(gameLoop);

  // FIX 3: remove the listener when game ends so no more inputs are taken after death
  document.removeEventListener('keydown', handleKeyDown);

  
  let flashes = 0;
  const flash = setInterval(() => {
    ctx.fillStyle = flashes % 2 === 0 ? 'rgba(255,0,0,0.15)' : 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (++flashes >= 6) {
      clearInterval(flash);
      draw();
      document.getElementById('finalScore').textContent =
        `SCORE: ${finalScore}  |  BEST: ${highScore}`; // FIX 2: Chooses between finalScore and highScore (Not score, which could have changed at death)
      document.getElementById('gameOverOverlay').classList.remove('hidden');
    }
  }, 80);
}


const KEY_MAP = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
  w: { x:  0, y: -1 },
  s: { x:  0, y:  1 },
  a: { x: -1, y:  0 },
  d: { x:  1, y:  0 },
  W: { x:  0, y: -1 },
  S: { x:  0, y:  1 },
  A: { x: -1, y:  0 },
  D: { x:  1, y:  0 },
};
function handleKeyDown(e) { // FIX 3: Named the function so it can be added/removed cleanly

  // FIX 1: If the game is over, dont take any key input
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

  
  if (e.key === ' ' && running) {
    paused = !paused;
    if (!paused) {
      draw();
      restartLoop();
    }
  }
};

// Attach the named listener on start screen
document.addEventListener('keydown', handleKeyDown);

// FIX 4: Play Again button is the only restart path
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

//NOTE: the mousedown "click anywhere to start" listener has been intentionally removed.
// document.addEventListener('mousedown', e => {
//   if (!running && e.target.id !== 'startBtn' && e.target.id !== 'restartBtn') {
//     startGame();
//   }
// });

let animFrame;

function animateIdle() {
  if (!running) {
    draw();
    animFrame = requestAnimationFrame(animateIdle);
  }
}


initGame();
animateIdle();
