/**
 * 2048 — script.js
 * GSSoC Contribution
 *
 * Features:
 *  - Classic 4×4, Timed 60s, Zen 5×5 modes
 *  - Smooth tile animations with particle bursts on merge
 *  - Score floats, combo streak labels
 *  - Sound effects via Web Audio API
 *  - Dark / Light theme toggle
 *  - Undo (one step)
 *  - Achievements system
 *  - Full stats modal with localStorage persistence
 *  - Confetti on winning
 *  - Keyboard (arrows + WASD) and swipe support
 *  - Reduced-motion aware
 */

/* =========================================================
   Constants & tile palette
   ========================================================= */

const TILE_STYLES = {
  2: { fontSize: '36px' },
  4: { fontSize: '36px' },
  8: { fontSize: '36px' },
  16: { fontSize: '36px' },
  32: { fontSize: '36px' },
  64: { fontSize: '36px' },
  128: { fontSize: '28px' },
  256: { fontSize: '28px' },
  512: { fontSize: '28px' },
  1024: { fontSize: '22px' },
  2048: { fontSize: '22px' },
};

const PARTICLE_COLORS = ['#ff6b6b', '#ffd54f', '#69f0ae', '#4fc3f7', '#e040fb', '#ff9800'];

const ACHIEVEMENTS = [
  { id: 'first256', label: 'Quarter Way', desc: 'Reach 256', check: (b) => maxTile(b) >= 256 },
  { id: 'first512', label: 'Halfway', desc: 'Reach 512', check: (b) => maxTile(b) >= 512 },
  { id: 'first1024', label: 'So Close', desc: 'Reach 1024', check: (b) => maxTile(b) >= 1024 },
  { id: 'first2048', label: 'Winner!', desc: 'Reach 2048', check: (b) => maxTile(b) >= 2048 },
  { id: 'moves100', label: 'Century', desc: 'Play 100 moves', check: () => moves >= 100 },
  { id: 'score2000', label: 'High Scorer', desc: 'Score over 2000', check: () => score >= 2000 },
];

const COMBO_LABELS = {
  3: '3× combo!',
  4: '4× chain!',
  5: 'On fire!',
  6: 'Inferno!',
  7: 'Unstoppable!',
  8: 'LEGENDARY!',
};

/* =========================================================
   State
   ========================================================= */

let N = 4; // grid size
let TS = 94; // tile size in px
let GAP = 10; // gap between tiles
let PAD = 12; // board padding
let paused = false;
let board, score, best, prevBoard, prevScore;
let moves = 0;
let combo = 0;
let over = false;
let won = false;
let undoLocked = false;
let dark = false;
let soundOn = true;
let mode = 'classic';

let timerInterval = null;
let timeLeft = 60;

let confettiFrameId = null;
let confettiParticles = [];

let stats = { best: 0, games: 0, wins: 0, bestTile: 2, earned: [] };

/* =========================================================
   Persistence
   ========================================================= */

function loadStats() {
  try {
    const s = localStorage.getItem('2048stats');
    if (s) stats = JSON.parse(s);
  } catch (_) {}
}

function saveStats() {
  try {
    localStorage.setItem('2048stats', JSON.stringify(stats));
  } catch (_) {}
}

function logGameScore(s) {
  stats.scoreHistory = stats.scoreHistory || [];
  stats.scoreHistory.push(s);
  if (stats.scoreHistory.length > 10) stats.scoreHistory.shift();
  saveStats();
}

function togglePause() {
  if (mode !== 'timed' || over) return;
  paused = !paused;
  const btn = document.getElementById('pausebtn');
  if (paused) {
    clearInterval(timerInterval);
    btn.textContent = '▶ Resume';
    showOverlayPause();
  } else {
    startTimer();
    btn.textContent = '⏸ Pause';
    document.getElementById('ov').style.display = 'none';
  }

  // REPLACE this entire function:
  function showOverlayPause() {
    const ov = document.getElementById('ov');
    ov.className = 'ov';
    ov.innerHTML = `
    <div class="ov-title" style="color:#4fc3f7">⏸ Paused</div>
    <div class="ov-sub">Game is paused</div>
    <button class="btn" id="ov-resume-btn">▶ Resume</button>
  `;
    ov.style.display = 'flex';
    document.getElementById('ov-resume-btn').addEventListener('click', togglePause);
  }
}

function drawScoreGraph() {
  const history = stats.scoreHistory || [];
  const cv = document.getElementById('score-graph');
  if (!cv || history.length < 2) return;
  const ctx = cv.getContext('2d');
  const W = (cv.width = cv.offsetWidth || 260);
  const H = (cv.height = 80);
  ctx.clearRect(0, 0, W, H);
  const max = Math.max(...history, 1);
  const step = W / (history.length - 1);
  ctx.beginPath();
  ctx.strokeStyle = '#ff9800';
  ctx.lineWidth = 2.5;
  history.forEach((v, i) => {
    const x = i * step;
    const y = H - (v / max) * (H - 8) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  // Dots
  history.forEach((v, i) => {
    const x = i * step;
    const y = H - (v / max) * (H - 8) - 4;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd54f';
    ctx.fill();
  });
}

function loadBest() {
  try {
    return parseInt(localStorage.getItem('2048best'), 10) || 0;
  } catch (_) {
    return 0;
  }
}

function saveBest() {
  try {
    localStorage.setItem('2048best', best);
  } catch (_) {}
}

function saveGame() {
  try {
    localStorage.setItem('2048state', JSON.stringify({ board, score, moves, mode }));
  } catch (_) {}
}

function loadGame() {
  try {
    const s = localStorage.getItem('2048state');
    if (!s) return false;
    const d = JSON.parse(s);
    board = d.board;
    score = d.score;
    moves = d.moves || 0;
    mode = d.mode || 'classic';
    return true;
  } catch (_) {
    return false;
  }
}

function clearSavedGame() {
  try {
    localStorage.removeItem('2048state');
  } catch (_) {}
}

/* =========================================================
   Board helpers
   ========================================================= */

function copyBoard(b) {
  return b.map((row) => [...row]);
}

function maxTile(b = board) {
  let m = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) m = Math.max(m, b[r][c]);
  return m;
}

function addTile(b = board) {
  const empty = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!b[r][c]) empty.push([r, c]);
  if (!empty.length) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return [r, c];
}

function tilePos(r, c) {
  let scale = 1;

  if (window.innerWidth <= 415) scale = 0.88;
  if (window.innerWidth <= 390) scale = 0.82;

  const step = (TS + GAP) * scale;

  return {
    top: PAD * scale + r * step,
    left: PAD * scale + c * step,
  };
}

/* =========================================================
   Board dimensions by mode
   ========================================================= */

function applyGridDimensions() {
  if (mode === 'zen') {
    N = 5;
  } else {
    N = 4;
  }

  const styles = getComputedStyle(document.documentElement);

  TS = parseInt(styles.getPropertyValue('--tile-size'));
  GAP = parseInt(styles.getPropertyValue('--tile-gap'));
  PAD = parseInt(styles.getPropertyValue('--board-pad'));

  // For Zen 5×5, auto-shrink tile size so the board fits inside the container
  if (mode === 'zen') {
    const wrap = document.getElementById('wr');
    const availableWidth = wrap.clientWidth || (window.innerWidth - 48);
    // board total width = PAD*2 + N*TS + (N-1)*GAP  =>  solve for TS
    const maxTS = Math.floor((availableWidth - PAD * 2 - (N - 1) * GAP) / N);
    TS = Math.min(TS, maxTS);
    // Clamp to reasonable min
    TS = Math.max(TS, 44);
  }

  const bd = document.getElementById('bd');

  bd.style.gridTemplateColumns = `repeat(${N}, ${TS}px)`;
  bd.style.gridTemplateRows = `repeat(${N}, ${TS}px)`;
}

/* =========================================================
   Slide logic (left-direction; board gets rotated as needed)
   ========================================================= */

function slideRow(row) {
  const arr = row.filter((x) => x);
  let pts = 0,
    didMerge = false;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && !didMerge) {
      arr[i] *= 2;
      pts += arr[i];
      arr.splice(i + 1, 1);
      didMerge = true;
    } else {
      didMerge = false;
    }
  }
  while (arr.length < N) arr.push(0);
  return { row: arr, pts };
}

function rotateBoard(b, turns) {
  let out = b;
  for (let t = 0; t < turns; t++) {
    const tmp = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) tmp[c][N - 1 - r] = out[r][c];
    out = tmp;
  }
  return out;
}

/* =========================================================
   Core move
   ========================================================= */

function doMove(dir) {
  if (over) return;

  prevBoard = copyBoard(board);
  prevScore = score;

  const rotTurns = { left: 0, down: 1, right: 2, up: 3 };
  let tmp = rotateBoard(board, rotTurns[dir]);
  let pts = 0;
  let moved = false;
  const mergePositions = [];

  for (let r = 0; r < N; r++) {
    const res = slideRow([...tmp[r]]);
    if (res.row.some((v, i) => v !== tmp[r][i])) moved = true;
    for (let c = 0; c < N; c++)
      if (res.row[c] > tmp[r][c] && res.row[c] > 0) mergePositions.push({ r, c, v: res.row[c] });
    tmp[r] = res.row;
    pts += res.pts;
  }

  if (!moved) {
    combo = 0;
    return;
  }

  board = rotateBoard(tmp, (4 - rotTurns[dir]) % 4);
  score += pts;
  moves++;

  if (pts > 0) {
    combo++;
    playSound('merge');
  } else {
    combo = 0;
    playSound('move');
  }

  if (score > best) {
    best = score;
    saveBest();
    stats.best = Math.max(stats.best, best);
    document.getElementById('bc').classList.add('gold-flash');
    setTimeout(() => document.getElementById('bc').classList.remove('gold-flash'), 800);
  }

  const newCell = addTile();
  renderBoard();
  renderTiles(newCell, pts, mergePositions);
  updateUI();
  checkAchievements();
  saveGame();

  const mt = maxTile();
  if (mt >= 2048 && !won) {
    won = true;
    stats.wins++;
    stats.games++;
    stats.best = Math.max(stats.best, score);
    stats.bestTile = Math.max(stats.bestTile, mt);
    saveStats();
    clearSavedGame();
    if (mode === 'timed') clearInterval(timerInterval);
    setTimeout(() => {
      showOverlay('win');
      launchConfetti();
    }, 300);
    return;
  }

  if (isLost()) {
    over = true;
    undoLocked = true;

    showToast('Game Over');
    if (mode === 'timed') clearInterval(timerInterval);
    stats.games++;
    stats.best = Math.max(stats.best, score);
    stats.bestTile = Math.max(stats.bestTile, mt);
    logGameScore(score);
    saveStats();
    clearSavedGame();
    setTimeout(() => showOverlay('lose'), 350);
  }
}

function isLost() {
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (!board[r][c]) return false;
      if (c < N - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < N - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  return true;
}

/* =========================================================
   Initialise / restart
   ========================================================= */

function init(resume = false) {
  applyGridDimensions();

  let didResume = false;
  if (resume) didResume = loadGame();

  if (!didResume) {
    board = Array.from({ length: N }, () => Array(N).fill(0));
    score = 0;
    moves = 0;
    combo = 0;
    paused = false;
    over = false;
    won = false;
    undoLocked = false;
    prevBoard = null;
    prevScore = 0;
    addTile();
    addTile();
  } else {
    over = false;
    won = false;
    combo = 0;
    prevBoard = null;
  }

  clearInterval(timerInterval);
  timeLeft = 60;
  document.getElementById('tbar').style.display = mode === 'timed' ? 'block' : 'none';
  if (mode === 'timed') startTimer();

  renderBoard();
  renderTiles();
  updateUI();
  stopConfetti();

  document.getElementById('ov').style.display = 'none';
  document.getElementById('stats-modal').classList.remove('open');
}

/* =========================================================
   Timer (timed mode)
   ========================================================= */

function startTimer() {
  clearInterval(timerInterval);

  updateTimerBar();

  timerInterval = setInterval(() => {
    if (paused || over) return;

    timeLeft--;

    updateTimerBar();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      over = true;

      setTimeout(() => showOverlay('lose'), 200);
    }
  }, 1000);
}

function updateTimerBar() {
  const fill = document.getElementById('tfill');
  fill.style.width = (timeLeft / 60) * 100 + '%';
  fill.className = 'timer-fill' + (timeLeft <= 15 ? ' danger' : '');
}

/* =========================================================
   Rendering
   ========================================================= */
function renderBoard() {
  const bd = document.getElementById('bd');
  bd.innerHTML = '';
  const size = PAD * 2 + N * TS + (N - 1) * GAP;
  bd.style.width = size + 'px';
  bd.style.height = size + 'px';
  const tl = document.getElementById('tl');
  tl.style.width = size + 'px';
  tl.style.height = size + 'px';

  for (let i = 0; i < N * N; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.width = TS + 'px';
    cell.style.height = TS + 'px';
    bd.appendChild(cell);
  }
}

function renderTiles(newCell, pts, merges) {
  const tl = document.getElementById('tl');
  tl.innerHTML = '';

  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const v = board[r][c];
      if (!v) continue;

      const { top, left } = tilePos(r, c);
      const isMerge = merges && merges.some((m) => m.r === r && m.c === c);
      const isNew = newCell && newCell[0] === r && newCell[1] === c;
      const style = TILE_STYLES[v] || { fontSize: '16px' };
      const dataAttr = TILE_STYLES[v] ? String(v) : 'big';

      const el = document.createElement('div');
      el.className = 'tile' + (isNew ? ' new' : isMerge ? ' merged' : '');
      el.dataset.val = dataAttr;
      el.style.top = top + 'px';
      el.style.left = left + 'px';
      el.style.width = TS + 'px';
      el.style.height = TS + 'px';
      el.style.fontSize = style.fontSize;
      el.textContent = v;
      tl.appendChild(el);

      if (isMerge) spawnParticles(left + TS / 2, top + TS / 2, tl);
    }

  if (pts > 0) {
    const fp = document.createElement('div');
    fp.className = 'score-float';
    fp.style.top = PAD + 6 + 'px';
    fp.style.left = PAD + 4 + 'px';
    fp.textContent = '+' + pts.toLocaleString();
    tl.appendChild(fp);
    setTimeout(() => fp.remove(), 750);
  }

  const streakEl = document.getElementById('streak');
  if (combo >= 3) {
    streakEl.textContent = COMBO_LABELS[Math.min(combo, 8)] || 'LEGENDARY!';
    streakEl.classList.add('show');
    setTimeout(() => streakEl.classList.remove('show'), 1300);
  }
}

function spawnParticles(cx, cy, parent) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 28 + Math.random() * 28;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = cx - 3.5 + 'px';
    p.style.top = cy - 3.5 + 'px';
    p.style.background = color;
    p.style.setProperty('--px', px + 'px');
    p.style.setProperty('--py', py + 'px');
    parent.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }
}

function updateUI() {
  const sv = document.getElementById('sv');
  sv.textContent = score.toLocaleString();
  sv.classList.remove('bump');
  void sv.offsetWidth;
  sv.classList.add('bump');

  document.getElementById('bv').textContent = best.toLocaleString();
  document.getElementById('moves-val').textContent = moves;

  let tileCount = 0,
    mt = 0;
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (board[r][c]) tileCount++;
      mt = Math.max(mt, board[r][c]);
    }
  document.getElementById('tiles-val').textContent = tileCount;
  document.getElementById('btile-val').textContent = mt;
}

/* =========================================================
   Overlays
   ========================================================= */

function showOverlay(type) {
  const ov = document.getElementById('ov');
  ov.className = 'ov';
  ov.innerHTML = `
    <div class="ov-title ${type === 'win' ? 'win' : 'lose'}">${type === 'win' ? 'You Win!' : 'Game Over'}</div>
    <div class="ov-sub">${type === 'win' ? 'You reached 2048!' : ''}</div>
    <div class="ov-stats">
      <div class="ov-stat"><div class="ov-stat-lbl">Score</div><div class="ov-stat-val">${score.toLocaleString()}</div></div>
      <div class="ov-stat"><div class="ov-stat-lbl">Moves</div><div class="ov-stat-val">${moves}</div></div>
      <div class="ov-stat"><div class="ov-stat-lbl">Best Tile</div><div class="ov-stat-val">${maxTile()}</div></div>
    </div>
    <button class="btn" id="ov-replay-btn">Play Again</button>
  `;
  ov.style.display = 'flex';
  ov.style.zIndex = '9999';
  // FIX: Clear out any previous listeners using a fresh replacement element reference
  const replayBtn = document.getElementById('ov-replay-btn');
  replayBtn.onclick = () => init();

  // Keep incoming button 2 feature from main branch while maintaining memory leak safety
  const replayBtn2 = document.getElementById('ov-replay-btn2');
  if (replayBtn2) {
    replayBtn2.onclick = watchReplay;
  }
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1700);
}

/* =========================================================
   Achievements
   ========================================================= */

function checkAchievements() {
  ACHIEVEMENTS.forEach((a) => {
    if (stats.earned.includes(a.id)) return;
    if (a.check(board)) {
      stats.earned.push(a.id);
      saveStats();
      triggerAchievement(a.label, a.desc);
    }
  });
}

function triggerAchievement(label, desc) {
  const el = document.getElementById('ach');
  document.getElementById('ach-msg').textContent = label + ' — ' + desc;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
  playSound('achieve');
}

/* =========================================================
   Stats modal
   ========================================================= */

function openStats() {
  document.getElementById('st-best').textContent = stats.best.toLocaleString();
  document.getElementById('st-games').textContent = stats.games;
  document.getElementById('st-wins').textContent = stats.wins;
  document.getElementById('st-tile').textContent = stats.bestTile;

  const badges = document.getElementById('ach-badges');
  badges.innerHTML = '';
  ACHIEVEMENTS.forEach((a) => {
    const b = document.createElement('span');
    const earned = stats.earned.includes(a.id);
    b.className = 'ach-badge' + (earned ? ' earned' : '');
    b.textContent = (earned ? '★ ' : '') + a.label;
    b.title = a.desc;
    badges.appendChild(b);
  });

  document.getElementById('stats-modal').classList.add('open');
}

function closeStats() {
  document.getElementById('stats-modal').classList.remove('open');
}

/* =========================================================
   Sound (Web Audio API)
   ========================================================= */

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  if (!soundOn) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'move') {
      osc.type = 'sine';
      osc.frequency.value = 220;
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'merge') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'achieve') {
      osc.type = 'triangle';
      [523, 659, 784].forEach((freq, i) =>
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      );
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (_) {}
}

/* =========================================================
   Confetti
   ========================================================= */

function launchConfetti() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const cv = document.getElementById('confetti-canvas');
  const ctx = cv.getContext('2d');
  cv.width = cv.offsetWidth || 476;
  cv.height = cv.offsetHeight || 520;

  confettiParticles = Array.from({ length: 90 }, () => ({
    x: Math.random() * cv.width,
    y: Math.random() * -cv.height * 0.5,
    r: 4 + Math.random() * 5,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 8,
  }));

  function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      if (p.y > cv.height) {
        p.y = -10;
        p.x = Math.random() * cv.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    confettiFrameId = requestAnimationFrame(frame);
  }
  frame();
  setTimeout(stopConfetti, 5000);
}

function stopConfetti() {
  if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
  confettiFrameId = null;
  const cv = document.getElementById('confetti-canvas');
  cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
}

/* =========================================================
   Event listeners
   ========================================================= */

document.getElementById('nb').addEventListener('click', () => {
  clearSavedGame();
  init();
  showToast('New game!');
});

document.getElementById('ub').addEventListener('click', () => {
  if (undoLocked) {
    showToast('Undo unavailable after game over');
    return;
  }

  if (!prevBoard) {
    showToast('Nothing to undo');
    return;
  }

  board = copyBoard(prevBoard);
  score = prevScore;
  prevBoard = null;

  moves = Math.max(0, moves - 1);

  renderBoard();
  renderTiles();
  updateUI();

  showToast('Undone!');
});

document.getElementById('tb').addEventListener('click', () => {
  dark = !dark;
  document.body.className = dark ? 'dark' : 'light';
  document.getElementById('g').className = '';
  document.getElementById('tb').textContent = dark ? '🌙' : '☀';
  renderBoard();
  renderTiles();
});

document.getElementById('stbtn').addEventListener('click', openStats);
document.getElementById('close-stats').addEventListener('click', closeStats);

document.getElementById('sdbtn').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('sdbtn').textContent = soundOn ? '🔊' : '🔇';
  showToast(soundOn ? 'Sound on' : 'Sound off');
});

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    // Toggle zen-mode class on container for wider layout
    document.getElementById('g').classList.toggle('zen-mode', mode === 'zen');
    clearSavedGame();
    init();
  });
});

/* Keyboard */
const KEY_MAP = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
};

document.addEventListener('keydown', (e) => {
  const dir = KEY_MAP[e.key];
  if (dir) {
    e.preventDefault();
    doMove(dir);
  }
});

/* Touch / swipe */
let touchStart = { x: 0, y: 0 };

document.getElementById('wr').addEventListener(
  'touchstart',
  (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  },
  { passive: true }
);

document.getElementById('wr').addEventListener(
  'touchend',
  (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  },
  { passive: true }
);

/* =========================================================
   Auto Pause On Tab Switch
   ========================================================= */

document.addEventListener('visibilitychange', () => {
  if (mode !== 'timed' || over) return;

  if (document.hidden) {
    paused = true;
    clearInterval(timerInterval);

    document.getElementById('tfill').classList.add('paused');

    showToast('Timer paused');
  } else {
    if (paused) {
      paused = false;
      startTimer();

      document.getElementById('tfill').classList.remove('pgit aused');

      showToast('Timer resumed');
    }
  }
});

/* =========================================================
   Boot
   ========================================================= */

loadStats();
best = loadBest();
init(true);
// Restore zen-mode class if saved mode was zen
if (mode === 'zen') {
  document.getElementById('g').classList.add('zen-mode');
  document.querySelectorAll('.mode-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.mode === 'zen');
  });
}

// Re-apply dimensions on resize (important for zen 5×5 responsiveness)
window.addEventListener("resize", () => {
  if (mode === "zen") {
    applyGridDimensions();
    renderBoard();
    renderTiles(null, 0, null);
  }
});