const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

const W = canvas.width, H = canvas.height;
const COLS = 11;
const R = 18;
const BUBBLE_DIAM = R * 2;
const SHOOTER_Y = H - 50;
const SHOOTER_X = W / 2;
const MAX_ROWS = 14;

const COLORS = [
  { name:'cyan',   hex:'#00f5ff' },
  { name:'pink',   hex:'#ff006e' },
  { name:'yellow', hex:'#ffea00' },
  { name:'green',  hex:'#39ff14' },
  { name:'orange', hex:'#ff6d00' },
  { name:'purple', hex:'#bf5fff' },
];

// Safe color getter
function getColor(idx) {
  if (idx === null || idx === undefined || idx < 0 || idx >= COLORS.length) return null;
  return COLORS[idx];
}

// ---- Audio ----
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, dur, type='sine', vol=0.2) {
  try {
    const ac = getAudio();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.start(); o.stop(ac.currentTime + dur);
  } catch(e) {}
}
function playShoot() { playTone(300, 0.08, 'sine', 0.15); }
function playPop(i) { playTone(350 + i * 70, 0.12, 'sine', 0.25); }
function playCombo(n) { playTone(300 + n * 80, 0.18, 'square', 0.12); }

// ---- State ----
let grid = [];
let currentBubble = 0;
let nextBubble = 1;
let shooting = false;
let bulletX, bulletY, bulletVX, bulletVY, bulletColor;
let mouseX = W/2, mouseY = H/2;
let score = 0, highScore = Number(localStorage.getItem('HighScore')) || 0, level = 1, shots = 0, popped = 0;
let combo = 1, bestCombo = 1, levelProgress = 0;
let paused = false, gameActive = false;
let particles = [];
let rafId = null;

function numColors() {
  if (level <= 2) return 4;
  if (level <= 4) return 5;
  return 6;
}

function safeRandomColor() {
  return Math.floor(Math.random() * numColors());
}

// ---- Grid helpers ----
function bubbleXY(row, col) {
  const offset = (row % 2 === 1) ? R : 0;
  const startX = (W - COLS * BUBBLE_DIAM) / 2;
  const x = startX + col * BUBBLE_DIAM + R + offset;
  const y = row * (BUBBLE_DIAM - 4) + R + 10;
  return { x, y };
}

function colsInRow(row) {
  return (row % 2 === 0) ? COLS : COLS - 1;
}

function initGrid() {
  grid = [];
  const numRows = 5 + Math.min(level, 5);
  for (let r = 0; r < numRows; r++) {
    grid[r] = [];
    const cols = colsInRow(r);
    for (let c = 0; c < cols; c++) {
      grid[r][c] = safeRandomColor();
    }
  }
}

function getCell(r, c) {
  if (r < 0 || r >= grid.length) return null;
  if (!grid[r]) return null;
  if (c < 0 || c >= grid[r].length) return null;
  return grid[r][c];
}

function setCell(r, c, val) {
  while (grid.length <= r) grid.push([]);
  if (!grid[r]) grid[r] = [];
  // Ensure row has enough slots
  const needed = colsInRow(r);
  while (grid[r].length < needed) grid[r].push(null);
  if (c >= 0 && c < needed) grid[r][c] = val;
}

function getNeighbors(r, c) {
  const isOdd = (r % 2 === 1);
  return [
    [r,   c-1], [r,   c+1],
    [r-1, c  ], [r+1, c  ],
    [r-1, isOdd ? c+1 : c-1],
    [r+1, isOdd ? c+1 : c-1],
  ].filter(([nr, nc]) => nr >= 0 && nc >= 0 && nc < colsInRow(nr));
}

// BFS match group
function findGroup(startR, startC) {
  const target = getCell(startR, startC);
  if (target === null || target === undefined) return [];
  const visited = new Set();
  const queue = [[startR, startC]];
  const group = [];
  let safety = 0;
  while (queue.length && safety++ < 500) {
    const [r, c] = queue.shift();
    const key = r * 100 + c;
    if (visited.has(key)) continue;
    visited.add(key);
    if (getCell(r, c) !== target) continue;
    group.push([r, c]);
    for (const [nr, nc] of getNeighbors(r, c)) {
      const nkey = nr * 100 + nc;
      if (!visited.has(nkey)) queue.push([nr, nc]);
    }
  }
  return group;
}

// BFS connected to top row
function findConnected() {
  const connected = new Set();
  if (!grid[0]) return connected;
  const queue = [];
  for (let c = 0; c < grid[0].length; c++) {
    if (grid[0][c] !== null && grid[0][c] !== undefined) {
      const key = 0 * 100 + c;
      if (!connected.has(key)) { connected.add(key); queue.push([0, c]); }
    }
  }
  let safety = 0;
  while (queue.length && safety++ < 2000) {
    const [r, c] = queue.shift();
    for (const [nr, nc] of getNeighbors(r, c)) {
      const nkey = nr * 100 + nc;
      if (!connected.has(nkey) && getCell(nr, nc) !== null && getCell(nr, nc) !== undefined) {
        connected.add(nkey);
        queue.push([nr, nc]);
      }
    }
  }
  return connected;
}

// Snap bullet to nearest empty cell
function snapToGrid(bx, by) {
  let bestRow = 0, bestCol = 0, bestDist = Infinity;
  const checkRows = Math.min(grid.length + 2, MAX_ROWS);
  for (let r = 0; r < checkRows; r++) {
    const cols = colsInRow(r);
    for (let c = 0; c < cols; c++) {
      if (getCell(r, c) !== null && getCell(r, c) !== undefined) continue;
      const { x, y } = bubbleXY(r, c);
      const d = Math.hypot(bx - x, by - y);
      if (d < bestDist) { bestDist = d; bestRow = r; bestCol = c; }
    }
  }
  return { row: bestRow, col: bestCol };
}

// ---- Draw helpers ----
function drawBubbleOn(c, x, y, r, colorIdx) {
  const col = getColor(colorIdx);
  if (!col) return;
  c.save();
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col.hex;
  c.fill();
  const grad = c.createRadialGradient(x - r*0.3, y - r*0.35, r*0.05, x, y, r);
  grad.addColorStop(0, 'rgba(255,255,255,0.65)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0.38)');
  c.fillStyle = grad;
  c.fill();
  c.strokeStyle = col.hex;
  c.lineWidth = 1.5;
  c.shadowColor = col.hex;
  c.shadowBlur = 10;
  c.stroke();
  c.restore();
}

function drawGrid() {
  for (let r = 0; r < grid.length; r++) {
    if (!grid[r]) continue;
    for (let c = 0; c < grid[r].length; c++) {
      const val = grid[r][c];
      if (val === null || val === undefined) continue;
      if (!getColor(val)) continue;
      const { x, y } = bubbleXY(r, c);
      drawBubbleOn(ctx, x, y, R, val);
    }
  }
}

function drawBullet() {
  if (!shooting) return;
  if (!getColor(bulletColor)) return;
  drawBubbleOn(ctx, bulletX, bulletY, R, bulletColor);
}

function drawShooter() {
  const rawAngle = Math.atan2(mouseY - SHOOTER_Y, mouseX - SHOOTER_X);
  // Allow full left to full right in upward hemisphere
  const clampedAngle = Math.max(-Math.PI + 0.05, Math.min(-0.05, rawAngle));
  const angle = clampedAngle;

  const dx = Math.cos(clampedAngle);
  const dy = Math.sin(clampedAngle);

  // --- Dotted aim line with wall bounce ---
ctx.save();
ctx.setLineDash([5, 9]);
ctx.strokeStyle = 'rgba(0,245,255,0.28)';
ctx.lineWidth = 1.5;

ctx.beginPath();

let tx = SHOOTER_X;
let ty = SHOOTER_Y;
let tvx = dx;
let tvy = dy;

ctx.moveTo(tx, ty);

for (let i = 0; i < 400; i++) {
  tx += tvx * 3;
  ty += tvy * 3;

  // bounce left wall
  if (tx < R) {
    tx = R;
    tvx *= -1;
    ctx.lineTo(tx, ty);
    ctx.moveTo(tx, ty);
  }

  // bounce right wall
  if (tx > W - R) {
    tx = W - R;
    tvx *= -1;
    ctx.lineTo(tx, ty);
    ctx.moveTo(tx, ty);
  }

  ctx.lineTo(tx, ty);

  if (ty < 0) break;
}

ctx.stroke();
ctx.restore();

  // --- Shooter base (circle platform) ---
  ctx.save();
  ctx.beginPath();
  ctx.arc(SHOOTER_X, SHOOTER_Y, 22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,20,40,0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,245,255,0.5)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00f5ff';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.restore();

  // --- Rotating cannon barrel ---
  ctx.save();
  ctx.translate(SHOOTER_X, SHOOTER_Y);
  ctx.rotate(clampedAngle + Math.PI / 2); // +90deg so "up" = angle -PI/2

  // Barrel body
  const barrelW = 10, barrelH = 34;
  const grad = ctx.createLinearGradient(-barrelW/2, 0, barrelW/2, 0);
  grad.addColorStop(0,   'rgba(0,180,220,0.6)');
  grad.addColorStop(0.4, 'rgba(0,245,255,1)');
  grad.addColorStop(1,   'rgba(0,130,160,0.6)');
  ctx.fillStyle = grad;
  ctx.shadowColor = '#00f5ff';
  ctx.shadowBlur = 16;
  // Draw from center upward (negative y = upward after rotation)
  ctx.beginPath();
  ctx.roundRect(-barrelW/2, -barrelH, barrelW, barrelH, 3);
  ctx.fill();

  // Barrel tip highlight
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.roundRect(-2, -barrelH, 4, barrelH * 0.6, 2);
  ctx.fill();

  // Arrowhead at tip of barrel
  ctx.fillStyle = '#00f5ff';
  ctx.shadowColor = '#00f5ff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(0, -barrelH - 10);   // tip point
  ctx.lineTo(-7, -barrelH + 2);   // left base
  ctx.lineTo( 7, -barrelH + 2);   // right base
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // --- Current bubble inside base ---
  if (!shooting && getColor(currentBubble)) {
    drawBubbleOn(ctx, SHOOTER_X, SHOOTER_Y, R - 4, currentBubble);
  }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 0.028;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
}

function drawDangerLine() {
  const dy = H - 80;
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = 'rgba(255,0,110,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, dy); ctx.lineTo(W, dy); ctx.stroke();
  ctx.restore();
}

function drawBg() {
  ctx.clearRect(0, 0, W, H);
  const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.8);
  vg.addColorStop(0, 'rgba(10,22,40,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ---- Particles ----
function spawnParticles(x, y, colorHex, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i / count) + Math.random() * 0.5;
    const spd = 2 + Math.random() * 4;
    particles.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, r: 4+Math.random()*4, color: colorHex, life: 0.8+Math.random()*0.3 });
  }
}

// ---- Combo popup ----
function showPopup(text, x, y) {
  const el = document.createElement('div');
  el.className = 'combo-popup';
  el.textContent = text;
  const rect = canvas.getBoundingClientRect();
  el.style.left = (rect.left + x - 30) + 'px';
  el.style.top  = (rect.top  + y - 20) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ---- Bubble landing logic ----
function onBubbleLand(row, col) {
  // Clamp col
  const maxCol = colsInRow(row) - 1;
  col = Math.max(0, Math.min(col, maxCol));

  // Validate color
  if (!getColor(bulletColor)) { shooting = false; nextBubble = safeRandomColor(); updateUI(); return; }

  setCell(row, col, bulletColor);
  shots++;

  const group = findGroup(row, col);

  if (group.length >= 3) {
    group.forEach(([r, c]) => {
      const val = getCell(r, c);
      const col2 = getColor(val);
      if (col2) {
        const { x, y } = bubbleXY(r, c);
        spawnParticles(x, y, col2.hex, 14);
        playPop(val);
      }
      setCell(r, c, null);
    });

    // Floaters
    const connected = findConnected();
    let floaters = 0;
    for (let r = 0; r < grid.length; r++) {
      if (!grid[r]) continue;
      for (let c2 = 0; c2 < grid[r].length; c2++) {
        const val = getCell(r, c2);
        if (val !== null && val !== undefined && !connected.has(r * 100 + c2)) {
          const col3 = getColor(val);
          if (col3) {
            const { x, y } = bubbleXY(r, c2);
            spawnParticles(x, y, col3.hex, 8);
          }
          setCell(r, c2, null);
          floaters++;
        }
      }
    }

    popped += group.length + floaters;
    score += (group.length * 50 + floaters * 100) * combo;
    levelProgress += (group.length + floaters) * 6;
    if (score > highScore) 
      {
        highScore = score;
        localStorage.setItem('HighScore', highScore);
      }

    combo = Math.min(combo + 1, 10);
    if (combo > bestCombo) bestCombo = combo;
    playCombo(combo);

    const { x: px, y: py } = bubbleXY(row, col);
    if (combo >= 2) showPopup(`COMBO x${combo}!`, px, py);
    if (floaters > 0) showPopup(`+${floaters*100}!`, px + 50, py - 10);
  } else {
    combo = 1;
  }

  currentBubble = nextBubble;
  nextBubble = safeRandomColor();
  shooting = false;
  updateUI();

  // Check win
  let any = false;
  outer: for (let r = 0; r < grid.length; r++) {
    if (!grid[r]) continue;
    for (let c2 = 0; c2 < grid[r].length; c2++) {
      if (getCell(r, c2) !== null && getCell(r, c2) !== undefined) { any = true; break outer; }
    }
  }
  if (!any) {
    score += 1000 * level;
    document.getElementById('winScore').textContent = score;
    document.getElementById('winOverlay').classList.remove('hidden');
    gameActive = false; return;
  }

  // Check game over — bottom rows
  for (let r = 0; r < grid.length; r++) {
    if (!grid[r]) continue;
    for (let c2 = 0; c2 < grid[r].length; c2++) {
      if (getCell(r, c2) !== null && getCell(r, c2) !== undefined) {
        const { y } = bubbleXY(r, c2);
        if (y + R > H - 80) {
          document.getElementById('finalScore').textContent = score;
          document.getElementById('gameOverOverlay').classList.remove('hidden');
          gameActive = false; return;
        }
      }
    }
  }

  // Level up
  if (levelProgress >= 100) {
    levelProgress = 0; level++;
    const newRow = [];
    const cols = colsInRow(grid.length % 2);
    for (let c2 = 0; c2 < cols; c2++) newRow.push(safeRandomColor());
    grid.unshift(newRow);
  }
}

// ---- Bullet movement ----
function moveBullet() {
  if (!shooting) return;
  const speed = 8 + level * 0.4;
  bulletX += bulletVX * speed;
  bulletY += bulletVY * speed;

  if (bulletX < R)     { bulletX = R;     bulletVX =  Math.abs(bulletVX); }
  if (bulletX > W - R) { bulletX = W - R; bulletVX = -Math.abs(bulletVX); }

  if (bulletY < R + 5) {
    const { row, col } = snapToGrid(bulletX, R + 5);
    onBubbleLand(row, col); return;
  }

  for (let r = 0; r < grid.length; r++) {
    if (!grid[r]) continue;
    for (let c = 0; c < grid[r].length; c++) {
      if (getCell(r, c) === null || getCell(r, c) === undefined) continue;
      const { x, y } = bubbleXY(r, c);
      if (Math.hypot(bulletX - x, bulletY - y) < BUBBLE_DIAM - 3) {
        const { row, col: sc } = snapToGrid(bulletX, bulletY);
        onBubbleLand(row, sc); return;
      }
    }
  }
}

// ---- Shoot ----
function shoot() {
  if (shooting || !gameActive || paused) return;
  if (!getColor(currentBubble)) { currentBubble = safeRandomColor(); }
  const angle = Math.atan2(mouseY - SHOOTER_Y, mouseX - SHOOTER_X);
  const clampedAngle = Math.max(-Math.PI + 0.05, Math.min(-0.05, angle));
  bulletX = SHOOTER_X; bulletY = SHOOTER_Y;
  bulletVX = Math.cos(clampedAngle);
  bulletVY = Math.sin(clampedAngle);
  bulletColor = currentBubble;
  shooting = true;
  playShoot();
}

// ---- UI ----
function updateUI() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('levelDisplay').textContent = level;
  document.getElementById('comboDisplay').textContent = 'x' + combo;
  document.getElementById('shotsDisplay').textContent = shots;
  document.getElementById('poppedDisplay').textContent = popped;
  document.getElementById('highScoreDisplay').textContent = highScore;
  document.getElementById('bestComboDisplay').textContent = 'x' + bestCombo;
  document.getElementById('levelBar').style.width = Math.min(levelProgress, 100) + '%';
  drawNextBubble();
}

function drawNextBubble() {
  nextCtx.clearRect(0, 0, 50, 50);
  if (getColor(nextBubble)) drawBubbleOn(nextCtx, 25, 25, R, nextBubble);
}

function hideAllOverlays() {
  ['startOverlay','pauseOverlay','gameOverOverlay','winOverlay'].forEach(id =>
    document.getElementById(id).classList.add('hidden'));
}

// ---- Game control ----
function startGame() {
  if (rafId) cancelAnimationFrame(rafId);
  score = 0; level = 1; shots = 0; popped = 0;
  combo = 1; bestCombo = 1; levelProgress = 0;
  particles = []; shooting = false; paused = false; gameActive = true;
  initGrid();
  currentBubble = safeRandomColor();
  nextBubble = safeRandomColor();
  updateUI();
  hideAllOverlays();
  document.getElementById('pauseBtn').textContent = '⏸ PAUSE';
  rafId = requestAnimationFrame(gameLoop);
}

function nextLevel() {
  level++; levelProgress = 0; particles = []; shooting = false;
  initGrid();
  currentBubble = safeRandomColor();
  nextBubble = safeRandomColor();
  updateUI(); hideAllOverlays();
  rafId = requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (!gameActive) return;
  paused = !paused;
  document.getElementById('pauseBtn').textContent = paused ? '▶ RESUME' : '⏸ PAUSE';
  if (paused) {
    document.getElementById('pauseOverlay').classList.remove('hidden');
  } else {
    document.getElementById('pauseOverlay').classList.add('hidden');
    rafId = requestAnimationFrame(gameLoop);
  }
}

// ---- Game loop ----
function gameLoop() {
  if (!gameActive || paused) return;
  drawBg();
  drawDangerLine();
  drawGrid();
  drawBullet();
  drawParticles();
  drawShooter();
  moveBullet();
  rafId = requestAnimationFrame(gameLoop);
}

// ---- Events ----
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
canvas.addEventListener('click', shoot);