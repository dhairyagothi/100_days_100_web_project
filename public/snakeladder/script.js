// ===== GAME DATA =====
const SNAKES = { 99:78, 94:56, 87:24, 62:19, 54:34, 48:16, 36:6, 32:10 };
const LADDERS = { 2:38, 7:14, 8:31, 15:26, 21:42, 28:84, 36:44, 51:67, 71:91 };

const DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

let players = [
  { name: 'Player 1', pos: 1, moves: 0, token: '🔴', color: '#ff6b6b', id: 0 },
  { name: 'Player 2', pos: 1, moves: 0, token: '🔵', color: '#4ecdc4', id: 1 }
];
let currentPlayer = 0;
let gameActive = false;
let isAnimating = false;

// ===== AUDIO =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'dice') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'snake') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.start(); osc.stop(ctx.currentTime + 0.65);
    } else if (type === 'ladder') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start(); osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'win') {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.4);
      });
    } else if (type === 'step') {
      osc.type = 'sine';
      osc.frequency.value = 600 + Math.random() * 200;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    }
  } catch(e) {}
}

// ===== BOARD DRAWING =====
function getCanvasSize() {
  return window.innerWidth <= 900 ? 360 : 540;
}

function getCellSize() {
  return getCanvasSize() / 10;
}

function cellToXY(pos) {
  if (pos < 1 || pos > 100) return null;
  const idx = pos - 1;
  const row = 9 - Math.floor(idx / 10);
  const col = (Math.floor(idx / 10) % 2 === 0) ? (idx % 10) : (9 - idx % 10);
  const cs = getCellSize();
  return { x: col * cs + cs / 2, y: row * cs + cs / 2 };
}

function drawBoard() {
  const canvas = document.getElementById('game-canvas');
  const cs = getCellSize();
  const size = cs * 10;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a1650';
  ctx.fillRect(0, 0, size, size);

  // Cells
  const colors = [
    ['#2d2060','#261d55'],
    ['#1e3a5f','#1a3454'],
    ['#2d2060','#261d55'],
  ];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const rowParity = r % 2;
      const colParity = c % 2;
      const base = (rowParity + colParity) % 2 === 0 ? '#2a1d6e' : '#1e2860';
      ctx.fillStyle = base;
      ctx.fillRect(c * cs, r * cs, cs, cs);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(c * cs, r * cs, cs, cs);
    }
  }

  // Special cell highlights
  Object.keys(SNAKES).forEach(pos => {
    const xy = cellToXY(parseInt(pos));
    if (!xy) return;
    ctx.fillStyle = 'rgba(255,71,87,0.18)';
    ctx.beginPath();
    ctx.arc(xy.x, xy.y, cs * 0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  Object.keys(LADDERS).forEach(pos => {
    const xy = cellToXY(parseInt(pos));
    if (!xy) return;
    ctx.fillStyle = 'rgba(46,213,115,0.18)';
    ctx.beginPath();
    ctx.arc(xy.x, xy.y, cs * 0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw SNAKES
  Object.entries(SNAKES).forEach(([from, to]) => {
    const start = cellToXY(parseInt(from));
    const end = cellToXY(parseInt(to));
    if (!start || !end) return;

    const cp1x = start.x + (end.x - start.x) * 0.3 + 30;
    const cp1y = start.y + (end.y - start.y) * 0.3 - 20;
    const cp2x = start.x + (end.x - start.x) * 0.7 - 30;
    const cp2y = start.y + (end.y - start.y) * 0.7 + 20;

    // Snake body (thick)
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
    ctx.strokeStyle = 'rgba(255,71,87,0.85)';
    ctx.lineWidth = cs * 0.18;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Snake highlight
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1x - 4, cp1y - 4, cp2x - 4, cp2y - 4, end.x, end.y);
    ctx.strokeStyle = 'rgba(255,150,150,0.4)';
    ctx.lineWidth = cs * 0.08;
    ctx.stroke();

    // Snake head
    ctx.beginPath();
    ctx.arc(start.x, start.y, cs * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2d3d';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Snake eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(start.x - 3, start.y - 3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(start.x + 3, start.y - 3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(start.x - 3, start.y - 3, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(start.x + 3, start.y - 3, 1, 0, Math.PI * 2); ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.arc(end.x, end.y, cs * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,71,87,0.7)';
    ctx.fill();
  });

  // Draw LADDERS
  Object.entries(LADDERS).forEach(([from, to]) => {
    const bottom = cellToXY(parseInt(from));
    const top = cellToXY(parseInt(to));
    if (!bottom || !top) return;

    const angle = Math.atan2(top.y - bottom.y, top.x - bottom.x) + Math.PI / 2;
    const offset = cs * 0.1;
    const dx = Math.cos(angle) * offset;
    const dy = Math.sin(angle) * offset;

    // Rails
    [[-1, 1], [1, -1]].forEach(([s1, s2]) => {
      ctx.beginPath();
      ctx.moveTo(bottom.x + s1 * dx, bottom.y + s1 * dy);
      ctx.lineTo(top.x + s1 * dx, top.y + s1 * dy);
      ctx.strokeStyle = 'rgba(46,213,115,0.9)';
      ctx.lineWidth = cs * 0.065;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Rungs
    const dist = Math.hypot(top.x - bottom.x, top.y - bottom.y);
    const rungs = Math.max(3, Math.floor(dist / (cs * 0.5)));
    for (let i = 1; i < rungs; i++) {
      const t = i / rungs;
      const rx = bottom.x + (top.x - bottom.x) * t;
      const ry = bottom.y + (top.y - bottom.y) * t;
      ctx.beginPath();
      ctx.moveTo(rx - dx, ry - dy);
      ctx.lineTo(rx + dx, ry + dy);
      ctx.strokeStyle = 'rgba(100,255,170,0.75)';
      ctx.lineWidth = cs * 0.045;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // End circles
    [bottom, top].forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, cs * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = '#2ed573';
      ctx.fill();
    });
  });

  // Cell numbers
  for (let pos = 1; pos <= 100; pos++) {
    const xy = cellToXY(pos);
    if (!xy) continue;
    ctx.font = `bold ${cs * 0.22}px Nunito, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(pos, xy.x - cs * 0.3, xy.y - cs * 0.45);
  }
}

// ===== TOKEN RENDERING =====
function renderTokens() {
  const grid = document.getElementById('board-grid');
  grid.innerHTML = '';
  const cs = getCellSize();
  const size = cs * 10;
  grid.style.width = size + 'px';
  grid.style.height = size + 'px';
  grid.style.display = 'block'; // Override grid layout for O(1) absolute positioning

  const tokensByPos = {};
  players.forEach(p => {
    if (p.pos >= 1) {
      if (!tokensByPos[p.pos]) tokensByPos[p.pos] = [];
      tokensByPos[p.pos].push(p);
    }
  });

  Object.entries(tokensByPos).forEach(([pos, ps]) => {
    const xy = cellToXY(parseInt(pos));
    if (!xy) return;

    // Anchor exactly to the math vector provided by cellToXY
    const cell = document.createElement('div');
    cell.style.position = 'absolute';
    cell.style.left = (xy.x - cs / 2) + 'px';
    cell.style.top = (xy.y - cs / 2) + 'px';
    cell.style.width = cs + 'px';
    cell.style.height = cs + 'px';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';
    cell.style.zIndex = '20';

    ps.forEach(p => {
      const tok = document.createElement('div');
      tok.style.cssText = `
        width:${cs*0.4}px;height:${cs*0.4}px;border-radius:50%;
        background:${p.color};display:flex;align-items:center;justify-content:center;
        font-size:${cs*0.25}px;box-shadow:0 2px 8px rgba(0,0,0,0.5),0 0 12px ${p.color}88;
        border:2px solid rgba(255,255,255,0.6);animation:tokenJump 0.4s ease;
        margin:1px;flex-shrink:0;
      `;
      tok.textContent = p.token;
      cell.appendChild(tok);
    });
    grid.appendChild(cell);
  });
}

// ===== ENVIRONMENT & LOGGING =====
const ENV = 'production'; // Toggle to 'development' during local testing
const sysLogger = {
  log: (...args) => { if (ENV === 'development') console.log('[GameDebug]:', ...args); },
  warn: (...args) => { if (ENV === 'development') console.warn('[GameWarn]:', ...args); },
  error: (...args) => { if (ENV === 'development') console.error('[GameError]:', ...args); }
};

// ===== GAME LOGIC =====
function startGame() {
  const p1n = document.getElementById('p1-name').value.trim() || 'Player 1';
  const p2n = document.getElementById('p2-name').value.trim() || 'Player 2';
  players[0].name = p1n;
  players[1].name = p2n;

  document.getElementById('p1-display-name').textContent = p1n;
  document.getElementById('p2-display-name').textContent = p2n;

  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');

  gameActive = true;
  currentPlayer = 0;
  players.forEach(p => { p.pos = 1; p.moves = 0; });

  setTimeout(() => {
    drawBoard();
    renderTokens();
    updateUI();
    addLog(`🎮 Game started! ${players[0].name} goes first.`, 'p1');
  }, 100);
}

function updateUI() {
  players.forEach((p, i) => {
    document.getElementById(`p${i+1}-pos`).textContent = p.pos || '—';
    document.getElementById(`p${i+1}-moves`).textContent = p.moves;
  });
  document.getElementById('turn-name').textContent = players[currentPlayer].name;
  document.getElementById('p1-card').classList.toggle('active-turn', currentPlayer === 0);
  document.getElementById('p2-card').classList.toggle('active-turn', currentPlayer === 1);
  document.getElementById('roll-btn').disabled = !gameActive || isAnimating;
}

function rollDice() {
  if (!gameActive || isAnimating) return;
  isAnimating = true;
  document.getElementById('roll-btn').disabled = true;

  playSound('dice');

  const dice = document.getElementById('dice');
  dice.classList.add('rolling');

  let count = 0;
  const interval = setInterval(() => {
    dice.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
    count++;
    if (count >= 8) {
      clearInterval(interval);
      const roll = Math.floor(Math.random() * 6) + 1;
      dice.textContent = DICE_FACES[roll - 1];
      dice.classList.remove('rolling');
      processMove(roll);
    }
  }, 70);
}

async function processMove(roll) {
  const p = players[currentPlayer];
  const pClass = `p${currentPlayer + 1}`;

  // 1. Calculate theoretical next position
  let newPos = p.pos + roll;

  // 2. Strict State Machine: Exact Roll to Win Boundary Rule
  if (newPos > 100) {
    addLog(`🎲 ${p.name} rolled ${roll}, but needs exactly ${100 - p.pos}. Bounce back!`, pClass);
    const overshoot = newPos - 100;
    newPos = 100 - overshoot; // Calculate bounce vector
    
    // Animate forward to 100, then bounce back the remaining steps
    await animateMove(p, p.pos, 100);
    await animateMove(p, 100, newPos);
    p.pos = newPos;
    p.moves++;
  } else {
    addLog(`🎲 ${p.name} rolled a ${roll}! (${p.pos} → ${newPos})`, pClass);
    p.moves++;
    highlightCell(newPos, 'safe-highlight');

    // Linear path traversal O(n)
    await animateMove(p, p.pos, newPos);
    p.pos = newPos;
  }

  renderTokens();
  updateUI();

  // 3. Graph Edge Translation O(1) - FIX FOR "RANDOM JUMP" BUG
  if (SNAKES[newPos]) {
    await sleep(400);
    playSound('snake');
    const snakeTo = SNAKES[newPos];
    addLog(`🐍 Oh no! ${p.name} got bitten! ${newPos} → ${snakeTo}`, 'snake');
    
    // Directly translate position coordinates. DO NOT use animateMove here.
    p.pos = snakeTo; 
    renderTokens();
    updateUI();
  } else if (LADDERS[newPos]) {
    await sleep(400);
    playSound('ladder');
    const ladderTo = LADDERS[newPos];
    addLog(`🪜 Yay! ${p.name} climbed a ladder! ${newPos} → ${ladderTo}`, 'ladder');
    
    // Directly translate position coordinates. DO NOT use animateMove here.
    p.pos = ladderTo; 
    renderTokens();
    updateUI();
  }

  // Check win validation
  if (p.pos === 100) {
    await sleep(400);
    playSound('win');
    gameActive = false;
    addLog(`🏆 ${p.name} WINS in ${p.moves} moves!`, 'win');
    launchConfetti();
    setTimeout(() => showWinner(p), 1200);
    return;
  }

  // Switch turn
  currentPlayer = 1 - currentPlayer;
  isAnimating = false;
  updateUI();
}

async function animateMove(player, from, to) {
  if (from === to) return;
  const step = from < to ? 1 : -1;
  for (let pos = from + step; pos !== to + step; pos += step) {
    player.pos = pos;
    renderTokens();
    playSound('step');
    await sleep(120);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function highlightCell(pos, cls) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(c => c.classList.remove('safe-highlight', 'snake-warn', 'ladder-highlight'));
}

function addLog(msg, type = '') {
  const log = document.getElementById('history-log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = msg;
  log.prepend(entry);
}

// ===== CONFETTI =====
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#ff6b6b','#4ecdc4','#ffe66d','#a29bfe','#fd79a8','#55efc4','#fdcb6e'];
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
      transform: rotate(${Math.random() * 360}deg);
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ===== WINNER =====
function showWinner(player) {
  document.getElementById('game-screen').classList.remove('active');
  document.getElementById('winner-screen').classList.add('active');
  document.getElementById('winner-name').textContent = `${player.token} ${player.name}`;
  document.getElementById('winner-stats').textContent = `Finished in ${player.moves} moves! 🎉`;
}

function newGame() {
  document.getElementById('winner-screen').classList.remove('active');
  document.getElementById('setup-screen').classList.add('active');
  players.forEach(p => { p.pos = 1; p.moves = 0; });
  document.getElementById('history-log').innerHTML = '';
  document.getElementById('p1-name').value = '';
  document.getElementById('p2-name').value = '';
}

function restartGame() {
  document.getElementById('winner-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  players.forEach(p => { p.pos = 1; p.moves = 0; });
  currentPlayer = 0;
  gameActive = true;
  isAnimating = false;
  document.getElementById('history-log').innerHTML = '';
  document.getElementById('dice').textContent = '🎲';
  setTimeout(() => {
    drawBoard();
    renderTokens();
    updateUI();
    addLog(`🔄 Game restarted! ${players[0].name} goes first.`, 'p1');
  }, 100);
}

// ===== RESIZE =====
window.addEventListener('resize', () => {
  if (gameActive || !gameActive) {
    const cs = getCellSize();
    const size = cs * 10;
    const grid = document.getElementById('board-grid');
    const canvas = document.getElementById('game-canvas');
    const wrapper = document.querySelector('.board-wrapper');
    if (wrapper) {
      wrapper.style.width = size + 'px';
      wrapper.style.height = size + 'px';
    }
    if (canvas) { canvas.width = size; canvas.height = size; }
    drawBoard();
    renderTokens();
  }
});
