/**
 * script.js — Flappy Bird (Enhanced)
 *
 * Architecture
 * ─────────────────────────────────────────────────────────────────────────────
 * Single requestAnimationFrame loop with delta-time scaling.
 * All physics values are defined at a nominal 60 fps; each frame
 * multiplies by (dt / TARGET_MS) so the game runs identically on
 * 60 Hz, 120 Hz, 144 Hz, or any other refresh rate.
 *
 * Background
 * ─────────────────────────────────────────────────────────────────────────────
 * bgImg is tiled with two side-by-side copies that scroll at BG_SPEED
 * (20% of pipeSpeed). The speed contrast with the pipes (100%) creates
 * natural parallax depth without any additional overlay layers.
 */

'use strict';

// ─── Canvas Setup ─────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 1000;
canvas.height = 600;

// ─── Sprites ──────────────────────────────────────────────────────────────────
const topPipeImg    = new Image(); topPipeImg.src    = 'toppipe.png';
const bottomPipeImg = new Image(); bottomPipeImg.src = 'bottompipe.png';
const birdImg       = new Image(); birdImg.src       = 'flappybird.png';
const bgImg         = new Image(); bgImg.src         = 'flappybirdbg.png';

// ─── Timing ───────────────────────────────────────────────────────────────────
/** Nominal frame duration — all physics constants are calibrated to this. */
const TARGET_MS = 1000 / 60;
/** Cap on delta to prevent tunnelling after tab focus returns. */
const MAX_DT    = TARGET_MS * 4;
let lastTime    = 0;

// ─── Physics (at 60 fps) ──────────────────────────────────────────────────────
const GRAVITY  = 0.45;  // px/frame² downward
const JUMP_VEL = -8;    // px/frame upward on flap
const TERM_VEL = 11;    // terminal velocity cap

// ─── Geometry ─────────────────────────────────────────────────────────────────
const PIPE_WIDTH = 70;
const GROUND_H   = 28;   // taller ground strip for the grass detail
const BIRD_R     = 13;   // collision radius (1 px forgiveness)

// ─── Pipe / Difficulty ────────────────────────────────────────────────────────
const BASE_GAP     = 200;  // opening at level 1
const MIN_GAP      = 150;  // floor at max difficulty
const VAR_GAP      = 30;   // ± random variance added to each pipe's opening
const BASE_SPEED   = 2.5;
const MAX_SPEED    = 5.0;
const GAP_MARGIN   = MIN_GAP / 2 + 30;                      // 105 px
const GAP_MIN_Y    = GAP_MARGIN;
const GAP_MAX_Y    = canvas.height - GROUND_H - GAP_MARGIN;
const MAX_GAP_JUMP = 110;  // max vertical shift between consecutive pipes
const PIPE_SPACING = 380;  // px between leading edges

// ─── Screen Shake ─────────────────────────────────────────────────────────────
const SHAKE_FRAMES = 40;

// ─── Audio ────────────────────────────────────────────────────────────────────
let audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/**
 * Synthesises a short tone via Web Audio API.
 * Errors are swallowed so audio failures never interrupt gameplay.
 */
function beep(freq, type, dur, vol = 0.22) {
  try {
    const ac = getAC(), o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.start(); o.stop(ac.currentTime + dur);
  } catch (_) {}
}
const playFlap  = () => beep(540, 'sine',     0.08, 0.18);
const playScore = () => beep(880, 'sine',     0.14, 0.28);
const playDeath = () => beep(160, 'sawtooth', 0.45, 0.38);

// ─── Game State ───────────────────────────────────────────────────────────────
let score       = 0;
let bestScore   = 0;
let gameStarted = false;
let gameOver    = false;
let paused      = false;
let flashTimer  = 0;
let deathShake  = 0;
let pipeSpeed   = BASE_SPEED;
let pipeGap     = BASE_GAP;
let lastGapY    = (GAP_MIN_Y + GAP_MAX_Y) / 2;
let spawnTimer  = null;

// ─── Difficulty ───────────────────────────────────────────────────────────────
function updateDifficulty() {
  if (pipeSpeed >= MAX_SPEED && pipeGap <= MIN_GAP) return;
  const lvl = Math.floor(score / 5);
  pipeSpeed = Math.min(BASE_SPEED + lvl * 0.25, MAX_SPEED);
  pipeGap   = Math.max(BASE_GAP   - lvl * 6,    MIN_GAP);
}

// ─── Spawner ──────────────────────────────────────────────────────────────────
function scheduleNextPipe() {
  const ms = (PIPE_SPACING / pipeSpeed) * TARGET_MS;
  spawnTimer = setTimeout(() => {
    if (gameStarted && !gameOver && !paused && !document.hidden) createPipe();
    if (gameStarted && !gameOver) scheduleNextPipe();
  }, ms);
}
function stopSpawner() {
  if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
}

// ─── Background Scroll ─────────────────────────────────────────────────────────
/**
 * bgImg is tiled as two side-by-side copies that scroll at 20% of pipeSpeed.
 * The speed contrast with the pipes (100%) creates natural parallax depth.
 * offX cycles 0 → canvas.width so the seam is always hidden off-screen.
 */
const BG_SPEED = 0.20;  // fraction of pipeSpeed
let bgX = 0;

function drawBackground() {
  if (!bgImg.complete || bgImg.naturalWidth === 0) {
    // Fallback sky colour while the image loads
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const w    = canvas.width;
  const offX = bgX % w;
  ctx.drawImage(bgImg, -offX,    0, w, canvas.height);
  ctx.drawImage(bgImg,  w - offX, 0, w, canvas.height);
}

function updateBackground(dt) {
  if (gameStarted && !gameOver && !paused)
    bgX = (bgX + pipeSpeed * BG_SPEED * dt) % canvas.width;
}

// ─── Ground ───────────────────────────────────────────────────────────────────
let groundX = 0;

function drawGround() {
  // Dirt base
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, GROUND_H);
  // Grass strip on top
  ctx.fillStyle = '#558b2f';
  ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, 7);
  // Scrolling dashes on dirt
  ctx.save();
  ctx.strokeStyle    = '#8d6e63';
  ctx.lineWidth      = 2;
  ctx.setLineDash([18, 12]);
  ctx.lineDashOffset = -groundX;
  ctx.beginPath();
  ctx.moveTo(0,            canvas.height - GROUND_H + 14);
  ctx.lineTo(canvas.width, canvas.height - GROUND_H + 14);
  ctx.stroke();
  ctx.restore();
}

function updateGround(dt) {
  if (gameStarted && !gameOver && !paused)
    groundX = (groundX + pipeSpeed * dt) % 30;
}

// ─── Particles ────────────────────────────────────────────────────────────────
/** Each particle: { x, y, vx, vy, life, maxLife, r, color } */
const particles = [];

function spawnParticles(x, y) {
  for (let i = 0; i < 7; i++) {
    const angle = Math.PI + (Math.random() - 0.5) * 1.2;
    const speed = 1.5 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx:      Math.cos(angle) * speed,
      vy:      Math.sin(angle) * speed - 1,
      life:    20 + Math.random() * 10,
      maxLife: 30,
      r:       2 + Math.random() * 2,
      color:   ['#ffe082','#fff176','#ffffff','#ffcc02'][Math.floor(Math.random()*4)]
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x    += p.vx * dt;
    p.y    += p.vy * dt;
    p.vy   += 0.15 * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife) * 0.85;
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ─── Score Popups ─────────────────────────────────────────────────────────────
const popups = [];

function spawnPopup(x, y) {
  popups.push({ x, y, life: 40, maxLife: 40 });
}

function updatePopups(dt) {
  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].y    -= 1.2 * dt;
    popups[i].life -= dt;
    if (popups[i].life <= 0) popups.splice(i, 1);
  }
}

function drawPopups() {
  popups.forEach(p => {
    const a = p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textAlign   = 'center';
    ctx.fillStyle   = '#ffe082';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth   = 3;
    ctx.font        = `bold ${18 + (1 - a) * 10}px Flappy, sans-serif`;
    ctx.strokeText('+1', p.x, p.y);
    ctx.fillText('+1', p.x, p.y);
    ctx.restore();
  });
}

// ─── Bird ─────────────────────────────────────────────────────────────────────
let bobTime = 0;

const bird = {
  x: 220, y: 280,
  width: 44, height: 32,
  velocity: 0,

  update(dt) {
    this.velocity += GRAVITY * dt;
    this.velocity  = Math.min(this.velocity, TERM_VEL);
    this.y        += this.velocity * dt;
    if (this.y + BIRD_R >= canvas.height - GROUND_H) {
      this.y = canvas.height - GROUND_H - BIRD_R;
      if (!gameOver) { playDeath(); deathShake = SHAKE_FRAMES; }
      gameOver = true;
    }
    if (this.y - BIRD_R <= 0) { this.y = BIRD_R; this.velocity = 0; }
  },

  /** @param {number} [overrideY] - optional Y override for idle bob */
  draw(overrideY) {
    const drawY = overrideY !== undefined ? overrideY : this.y;
    ctx.save();
    ctx.translate(this.x, drawY);
    ctx.rotate(Math.max(-0.4, Math.min(this.velocity * 0.05, 1.2)));
    ctx.drawImage(birdImg, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  },

  flap() {
    this.velocity = JUMP_VEL;
    playFlap();
    spawnParticles(this.x - 10, this.y + 8);
  },

  reset() { this.x = 220; this.y = 280; this.velocity = 0; }
};

// ─── Pipes ────────────────────────────────────────────────────────────────────
const pipes = [];

function createPipe() {
  const lo      = Math.max(GAP_MIN_Y, lastGapY - MAX_GAP_JUMP);
  const hi      = Math.min(GAP_MAX_Y, lastGapY + MAX_GAP_JUMP);
  const gapY    = lo + Math.random() * (hi - lo);
  lastGapY      = gapY;
  const thisGap = Math.max(MIN_GAP, pipeGap + (Math.random() * 2 - 1) * VAR_GAP);
  const half    = thisGap / 2;
  pipes.push({
    x:      canvas.width,
    topH:   gapY - half,
    botH:   canvas.height - GROUND_H - gapY - half,
    gap:    thisGap,
    scored: false
  });
}

function birdNearPipe(p) {
  return Math.abs((p.x + PIPE_WIDTH / 2) - bird.x) < 80;
}

function drawPipes() {
  pipes.forEach(p => {
    ctx.save();
    if (birdNearPipe(p)) {
      ctx.shadowColor = 'rgba(255,50,50,0.75)';
      ctx.shadowBlur  = 18;
    }
    ctx.drawImage(topPipeImg,    p.x, 0,                                  PIPE_WIDTH, p.topH);
    ctx.drawImage(bottomPipeImg, p.x, canvas.height - GROUND_H - p.botH, PIPE_WIDTH, p.botH);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(p.x + 2, p.topH - 14,                       PIPE_WIDTH - 4, 14);
    ctx.fillRect(p.x + 2, canvas.height - GROUND_H - p.botH, PIPE_WIDTH - 4, 14);
  });
}

function updatePipes(dt) {
  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= pipeSpeed * dt;
    if (!p.scored && p.x + PIPE_WIDTH < bird.x - BIRD_R) {
      score++;
      p.scored = true;
      playScore();
      updateDifficulty();
      if (score > bestScore) bestScore = score;
      if (score % 5 === 0) flashTimer = 40;
      spawnPopup(bird.x, bird.y - 30);
    }
    const inX = bird.x + BIRD_R > p.x && bird.x - BIRD_R < p.x + PIPE_WIDTH;
    if (inX && (bird.y - BIRD_R < p.topH || bird.y + BIRD_R > canvas.height - GROUND_H - p.botH)) {
      if (!gameOver) { playDeath(); deathShake = SHAKE_FRAMES; }
      gameOver = true;
    }
    if (p.x + PIPE_WIDTH < 0) pipes.splice(i, 1);
  }
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function drawHUD() {
  ctx.save();
  ctx.textAlign   = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur  = 8;
  ctx.fillStyle   = 'white';
  ctx.font        = '76px Flappy';
  ctx.fillText(score, canvas.width / 2, 76);
  ctx.restore();

  drawPill(12,                 10, `LVL ${Math.floor(score / 5) + 1}`, 'rgba(0,0,0,0.45)', '#ffe082');
  drawPill(canvas.width - 165, 10, `BEST ${bestScore}`,               'rgba(0,0,0,0.45)', '#80cbc4');

  const barW   = 140;
  const barX   = canvas.width / 2 - barW / 2;
  const barY   = 10;
  const barH   = 6;
  const filled = (pipeSpeed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRect(ctx, barX, barY, barW, barH, 3);
  if (filled > 0) {
    ctx.fillStyle = filled > 0.75 ? '#ff5252' : filled > 0.4 ? '#ffe082' : '#80cbc4';
    roundRect(ctx, barX, barY, Math.max(6, barW * filled), barH, 3);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font      = '11px Flappy';
  ctx.textAlign = 'center';
  ctx.fillText('SPEED', canvas.width / 2, barY + barH + 14);
  ctx.restore();

  if (flashTimer > 0) {
    const a = flashTimer / 40;
    ctx.save();
    ctx.fillStyle = `rgba(255,235,59,${a * 0.18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255,235,59,${a})`;
    ctx.font      = `${46 + (40 - flashTimer)}px Flappy`;
    ctx.fillText(`${score} PTS!`, canvas.width / 2, canvas.height / 2 - 60);
    ctx.restore();
    flashTimer--;
  }
}

function drawPill(x, y, text, bg, fg) {
  ctx.save();
  const pad = 10, h = 30;
  ctx.font = '16px Flappy';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = bg;
  roundRect(ctx, x, y, tw + pad * 2, h, 15);
  ctx.fillStyle = fg;
  ctx.fillText(text, x + pad, y + 21);
  ctx.restore();
}

// ─── Medal Helper ───────────────────────────────────────────────────────────
function getMedal(s) {
  if (s >= 40) return { label: '🏅 PLATINUM', color: '#e0e0e0', glow: 'rgba(200,200,255,0.6)' };
  if (s >= 20) return { label: '🥇 GOLD',     color: '#ffe082', glow: 'rgba(255,220,50,0.6)'  };
  if (s >= 10) return { label: '🥈 SILVER',   color: '#cfd8dc', glow: 'rgba(180,200,220,0.6)' };
  if (s >=  1) return { label: '🥉 BRONZE',   color: '#ffcc80', glow: 'rgba(200,140,60,0.5)'  };
  return null;
}

// ─── Overlay Screens ──────────────────────────────────────────────────────────
function drawStartScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const bobY = bird.y + Math.sin(bobTime * 0.05) * 10;
  bird.draw(bobY);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  roundRect(ctx, canvas.width / 2 - 240, canvas.height / 2 - 100, 480, 190, 18);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';  ctx.font = '40px Flappy';
  ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 34);
  ctx.font = '21px Flappy'; ctx.fillStyle = 'rgba(255,255,255,0.80)';
  ctx.fillText('SPACE  /  Tap  to  Start', canvas.width / 2, canvas.height / 2 + 12);
  ctx.font = '15px Flappy'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('Difficulty rises every 5 points  ·  P to pause', canvas.width / 2, canvas.height / 2 + 48);
  ctx.restore();
}

function drawGameOver() {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(28,18,18,0.80)';
  roundRect(ctx, canvas.width / 2 - 280, 130, 560, 330, 24);
  ctx.strokeStyle = 'rgba(255,80,80,0.5)'; ctx.lineWidth = 2;
  roundRectStroke(ctx, canvas.width / 2 - 280, 130, 560, 330, 24);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff5252'; ctx.font = '68px Flappy';
  ctx.fillText('GAME OVER', canvas.width / 2, 216);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 210, 232); ctx.lineTo(canvas.width / 2 + 210, 232);
  ctx.stroke();
  ctx.font = '24px Flappy'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Score', canvas.width / 2 - 110, 272);
  ctx.fillText('Best',  canvas.width / 2 + 110, 272);
  ctx.font = '40px Flappy';
  ctx.fillStyle = '#ffe082'; ctx.fillText(score,     canvas.width / 2 - 110, 322);
  ctx.fillStyle = '#80cbc4'; ctx.fillText(bestScore, canvas.width / 2 + 110, 322);
  const medal = getMedal(score);
  if (medal) {
    ctx.shadowColor = medal.glow; ctx.shadowBlur = 16;
    ctx.fillStyle = medal.color; ctx.font = '20px Flappy';
    ctx.fillText(medal.label, canvas.width / 2, 360);
    ctx.shadowBlur = 0;
  }
  if (score > 0 && score === bestScore) {
    ctx.fillStyle = '#ffe082'; ctx.font = '15px Flappy';
    ctx.fillText('★  NEW BEST  ★', canvas.width / 2, medal ? 388 : 362);
  }
  ctx.font = '19px Flappy'; ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('SPACE  /  Tap  to  Restart', canvas.width / 2, 424);
  ctx.restore();
}

function drawPauseScreen() {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  roundRect(ctx, canvas.width / 2 - 180, canvas.height / 2 - 70, 360, 140, 18);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff'; ctx.font = '52px Flappy';
  ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 4);
  ctx.font = '20px Flappy'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('Press  P  to  resume', canvas.width / 2, canvas.height / 2 + 42);
  ctx.restore();
}

// ─── Canvas Helpers ───────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath(); ctx.fill();
}
function roundRectStroke(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath(); ctx.stroke();
}

// ─── Input ────────────────────────────────────────────────────────────────────
function handleAction() {
  if (gameOver)     { restartGame(); return; }
  if (!gameStarted) { gameStarted = true; scheduleNextPipe(); }
  if (paused)       return;
  bird.flap();
}
document.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); handleAction(); }
  if (e.code === 'KeyP' && gameStarted && !gameOver) paused = !paused;
});
canvas.addEventListener('touchstart', e => { e.preventDefault(); handleAction(); }, { passive: false });
canvas.addEventListener('click', handleAction);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && gameStarted && !gameOver) paused = true;
});

// ─── Restart ──────────────────────────────────────────────────────────────────
function restartGame() {
  stopSpawner();
  bird.reset();
  pipes.length     = 0;
  particles.length = 0;
  popups.length    = 0;
  score       = 0;
  gameOver    = false;
  gameStarted = false;
  paused      = false;
  flashTimer  = 0;
  deathShake  = 0;
  pipeSpeed   = BASE_SPEED;
  pipeGap     = BASE_GAP;
  lastGapY    = (GAP_MIN_Y + GAP_MAX_Y) / 2;
  lastTime    = 0;
  bobTime     = 0;
  bgX         = 0;
}

// ─── Game Loop ────────────────────────────────────────────────────────────────
function update(dt) {
  if (!gameStarted || gameOver || paused) {
    if (!gameStarted) bobTime += dt;
    return;
  }
  bird.update(dt);
  updatePipes(dt);
  updateGround(dt);
  updateBackground(dt);
  updateParticles(dt);
  updatePopups(dt);
}

function draw() {
  let sx = 0, sy = 0;
  if (deathShake > 0 && !paused) {
    const mag = (deathShake / SHAKE_FRAMES) * 7;
    sx = (Math.random() - 0.5) * mag;
    sy = (Math.random() - 0.5) * mag;
    deathShake--;
  }

  ctx.save();
  ctx.translate(sx, sy);
  ctx.clearRect(-20, -20, canvas.width + 40, canvas.height + 40);

  // Layer 0: tiled scrolling background (clean, no overlay)
  drawBackground();
  // Layer 1: pipes, ground, particles, bird, HUD
  drawPipes();
  drawGround();
  drawParticles();
  if (gameStarted) bird.draw();
  drawPopups();
  drawHUD();
  ctx.restore();

  // Overlays drawn outside the shake transform
  if (!gameStarted)        drawStartScreen();
  if (gameOver)            drawGameOver();
  if (paused && !gameOver) drawPauseScreen();
}

function gameLoop(now) {
  if (lastTime === 0) lastTime = now;
  const rawDt = now - lastTime;
  lastTime    = now;
  const dt    = Math.min(rawDt, MAX_DT) / TARGET_MS;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
