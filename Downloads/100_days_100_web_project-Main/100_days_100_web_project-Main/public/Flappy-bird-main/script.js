
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');


const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const bestDisplay  = document.getElementById('best-display');
const finalScore   = document.getElementById('finalScore');

const startScreen    = document.getElementById('startScreen');
const pauseScreen    = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('restartBtn').addEventListener('click', startGame);


let state         = 'idle'; // idle | playing | paused | gameover
let score         = 0;
let bestScore     = 0;
let elapsedMs     = 0;
let lastTimestamp = null;
let animId        = null;


const GAME_DURATION = 60000; // 60 seconds in ms
let timeLeftMs      = GAME_DURATION;


const BIRD_SIZE  = 22;
const BIRD_SPEED = 180; // pixels per second

const bird = { x: 300, y: 225, vx: 0, vy: 0 };


const keys = {};

window.addEventListener('keydown', e => {
  keys[e.code] = true;

  
  if (e.code === 'Space') {
    e.preventDefault();
    if      (state === 'playing') pauseGame();
    else if (state === 'paused')  resumeGame();
  }

  
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});


const STAR_RADIUS   = 14;
const STAR_LIFETIME = 3000; 
const STAR_MARGIN   = 40;   
const RESPAWN_DELAY = 600; 

const star = {
  x: 300,
  y: 200,
  spawnTime:    0,
  visible:      false,
  respawnTimer: 0
};

function randomStarPosition() {
  return {
    x: STAR_MARGIN + Math.random() * (canvas.width  - STAR_MARGIN * 2),
    y: STAR_MARGIN + Math.random() * (canvas.height - STAR_MARGIN * 2)
  };
}

function spawnStar() {
  const pos      = randomStarPosition();
  star.x         = pos.x;
  star.y         = pos.y;
  star.spawnTime = elapsedMs;
  star.visible   = true;
}


const particles = [];

function spawnParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
    const speed = 40 + Math.random() * 80;
    particles.push({
      x,
      y,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      life:  1,
      decay: 0.8 + Math.random() * 0.8,
      r:     2 + Math.random() * 3,
      color: Math.random() < 0.5 ? '#ffd700' : '#ff6b35'
    });
  }
}


const pops = [];

function spawnScorePop(x, y) {
  const el       = document.createElement('div');
  el.className   = 'score-pop';
  el.textContent = '+1';
  el.style.left  = (x - 15) + 'px';
  el.style.top   = (y - 20) + 'px';
  canvas.parentElement.appendChild(el);
  pops.push(el);
  setTimeout(() => {
    el.remove();
    pops.splice(pops.indexOf(el), 1);
  }, 800);
}


function startGame() {
  score         = 0;
  elapsedMs     = 0;
  timeLeftMs    = GAME_DURATION;
  lastTimestamp = null;

  particles.length = 0;
  pops.forEach(p => p.remove());
  pops.length = 0;

  bird.x  = canvas.width  / 2;
  bird.y  = canvas.height / 2;
  bird.vx = 0;
  bird.vy = 0;

  star.visible      = false;
  star.respawnTimer = 0;

  updateHUD();
  hideAll();

  state = 'playing';
  spawnStar();

  if (animId) cancelAnimationFrame(animId);
  animId = requestAnimationFrame(loop);
}

function pauseGame() {
  state = 'paused';
  pauseScreen.classList.remove('hidden');
}

function resumeGame() {
  state         = 'playing';
  lastTimestamp = null; 
  pauseScreen.classList.add('hidden');
}

function endGame() {
  state = 'gameover';
  if (score > bestScore) {
    bestScore = score;
    bestDisplay.textContent = bestScore;
  }
  finalScore.textContent = score;

  
  const playedSec = Math.floor(elapsedMs / 1000);
  const mm = String(Math.floor(playedSec / 60)).padStart(2, '0');
  const ss = String(playedSec % 60).padStart(2, '0');
  document.getElementById('finalTime').textContent = mm + ':' + ss;

  gameOverScreen.classList.remove('hidden');
}

function hideAll() {
  startScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
}


function loop(timestamp) {
  animId = requestAnimationFrame(loop);

  if (state !== 'playing') {
    drawFrame();
    return;
  }

  
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
  lastTimestamp = timestamp;

  elapsedMs  += dt * 1000;
  timeLeftMs -= dt * 1000;

  
  if (timeLeftMs <= 0) {
    timeLeftMs = 0;
    updateHUD();
    endGame();
    return;
  }

  update(dt);
  drawFrame();
  updateHUD();
}


function update(dt) {
  
  let dx = 0, dy = 0;
  if (keys['ArrowLeft']  || keys['KeyA']) dx -= 1;
  if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
  if (keys['ArrowUp']    || keys['KeyW']) dy -= 1;
  if (keys['ArrowDown']  || keys['KeyS']) dy += 1;

  
  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

  bird.x += dx * BIRD_SPEED * dt;
  bird.y += dy * BIRD_SPEED * dt;

  
  bird.x = Math.max(BIRD_SIZE, Math.min(canvas.width  - BIRD_SIZE, bird.x));
  bird.y = Math.max(BIRD_SIZE, Math.min(canvas.height - BIRD_SIZE, bird.y));


  if (star.visible) {
    const age = elapsedMs - star.spawnTime;

    const ddx  = bird.x - star.x;
    const ddy  = bird.y - star.y;
    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

    if (dist < BIRD_SIZE + STAR_RADIUS - 4) {
      
      score++;
      spawnParticles(star.x, star.y);
      spawnScorePop(star.x, star.y);
      star.visible      = false;
      star.respawnTimer = elapsedMs + RESPAWN_DELAY;

    } else if (age >= STAR_LIFETIME) {
    
      star.visible      = false;
      star.respawnTimer = elapsedMs + RESPAWN_DELAY;
    }

  } else {
    
    if (elapsedMs >= star.respawnTimer) {
      spawnStar();
    }
  }


  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x    += p.vx * dt;
    p.y    += p.vy * dt;
    p.vx   *= 0.92;
    p.vy   *= 0.92;
    p.life -= p.decay * dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}


function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, '#050510');
  bg.addColorStop(1, '#0a1628');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  ctx.strokeStyle = 'rgba(0,229,255,0.04)';
  ctx.lineWidth   = 1;
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Particles
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Star
  if (star.visible) {
    const age   = elapsedMs - star.spawnTime;
    const ratio = age / STAR_LIFETIME; 

    
    const pulseSpeed = 1 + ratio * 5;
    const pulseScale = 1 + 0.12 * Math.sin(elapsedMs / 200 * pulseSpeed);

    
    const alpha = ratio > 0.8 ? 1 - (ratio - 0.8) / 0.2 : 1;

    
    const arcEnd = -Math.PI / 2 + (1 - ratio) * Math.PI * 2;
    ctx.save();
    ctx.globalAlpha  = alpha * 0.55;
    ctx.strokeStyle  = ratio < 0.5 ? '#00e676' : ratio < 0.8 ? '#ffd700' : '#ff1744';
    ctx.lineWidth    = 3;
    ctx.beginPath();
    ctx.arc(star.x, star.y, STAR_RADIUS + 7, -Math.PI / 2, arcEnd);
    ctx.stroke();
    ctx.restore();

    
    ctx.save();
    ctx.globalAlpha = alpha * 0.35;
    const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, STAR_RADIUS * 2.5);
    grd.addColorStop(0, '#ffd700');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(star.x, star.y, STAR_RADIUS * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(star.x, star.y);
    ctx.scale(pulseScale, pulseScale);
    ctx.rotate(elapsedMs / 1500);
    drawStar5(ctx, STAR_RADIUS, STAR_RADIUS * 0.45);
    ctx.fillStyle   = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur  = 18;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();
  }

  // Bird
  drawBird(bird.x, bird.y);
}

function drawStar5(ctx, outerR, innerR, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r     = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    i === 0
      ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
      : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
}

function drawBird(x, y) {
  ctx.save();
  ctx.translate(x, y);


  const leanX = ((keys['ArrowRight'] || keys['KeyD']) ? 1 : 0)
              - ((keys['ArrowLeft']  || keys['KeyA']) ? 1 : 0);
  const leanY = ((keys['ArrowDown']  || keys['KeyS']) ? 1 : 0)
              - ((keys['ArrowUp']    || keys['KeyW']) ? 1 : 0);
  ctx.rotate(leanX * 0.25 + leanY * 0.1);

  
  ctx.shadowColor = '#ff6b35';
  ctx.shadowBlur  = 20;

  
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE, BIRD_SIZE * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff9a6c';
  ctx.beginPath();
  ctx.ellipse(-2, -3, BIRD_SIZE * 0.5, BIRD_SIZE * 0.4, -0.2, 0, Math.PI * 2);
  ctx.fill();


  const flapAngle = Math.sin(elapsedMs / 120) * 0.4;
  ctx.fillStyle = '#e05a28';
  ctx.save();
  ctx.translate(-6, 0);
  ctx.rotate(-flapAngle);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Eye white
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(7, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(8, -5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8.5, -6, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE - 4, -2);
  ctx.lineTo(BIRD_SIZE + 8, -1);
  ctx.lineTo(BIRD_SIZE - 4,  3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}


function updateHUD() {
  scoreDisplay.textContent = score;

  const totalSec = Math.ceil(timeLeftMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  timerDisplay.textContent = mm + ':' + ss;

  
  if (timeLeftMs <= 10000) {
    timerDisplay.style.color      = '#ff1744';
    timerDisplay.style.textShadow = '0 0 10px #ff1744';
    timerDisplay.style.animation  = 'timerUrgent 0.5s ease-in-out infinite';
  } else {
    timerDisplay.style.color      = '';
    timerDisplay.style.textShadow = '';
    timerDisplay.style.animation  = '';
  }

  bestDisplay.textContent = Math.max(bestScore, score);
}

drawFrame();
