/**
 * 2048 — Fully Working script.js
 * Compatible with updated index.html + style.css
 */

const TILE_STYLES = {
  2: { fontSize: "42px" },
  4: { fontSize: "42px" },
  8: { fontSize: "42px" },
  16: { fontSize: "42px" },
  32: { fontSize: "42px" },
  64: { fontSize: "42px" },
  128: { fontSize: "34px" },
  256: { fontSize: "34px" },
  512: { fontSize: "34px" },
  1024: { fontSize: "28px" },
  2048: { fontSize: "28px" },
};

const PARTICLE_COLORS = [
  "#ff6b6b",
  "#ffd54f",
  "#69f0ae",
  "#4fc3f7",
  "#e040fb",
  "#ff9800",
];

const ACHIEVEMENTS = [
  {
    id: "first256",
    label: "Quarter Way",
    desc: "Reach 256",
    check: () => maxTile() >= 256,
  },
  {
    id: "first512",
    label: "Halfway",
    desc: "Reach 512",
    check: () => maxTile() >= 512,
  },
  {
    id: "first1024",
    label: "So Close",
    desc: "Reach 1024",
    check: () => maxTile() >= 1024,
  },
  {
    id: "first2048",
    label: "Winner!",
    desc: "Reach 2048",
    check: () => maxTile() >= 2048,
  },
  {
    id: "score2000",
    label: "High Scorer",
    desc: "Score over 2000",
    check: () => score >= 2000,
  },
];

const COMBO_LABELS = {
  3: "3× combo!",
  4: "4× chain!",
  5: "On fire!",
  6: "Inferno!",
  7: "Unstoppable!",
  8: "LEGENDARY!",
};

/* ====================== STATE ====================== */
let N = 4,
  TS = 108,
  GAP = 12,
  PAD = 14;
let board = [],
  score = 0,
  best = 0,
  prevBoard = null,
  prevScore = 0;
let moves = 0,
  combo = 0,
  over = false,
  won = false,
  undoLocked = false;
let mode = "classic",
  paused = false,
  soundOn = true;
let timerInterval = null,
  timeLeft = 60;
let confettiFrameId = null;

let stats = {
  best: 0,
  games: 0,
  wins: 0,
  bestTile: 2,
  earned: [],
  scoreHistory: [],
};

/* ====================== PERSISTENCE ====================== */
function loadStats() {
  try {
    const saved = localStorage.getItem("2048stats");
    if (saved) {
      const parsed = JSON.parse(saved);
      stats = { ...stats, ...parsed };
    }
  } catch (e) {}
  if (!stats.earned) stats.earned = [];
  if (!stats.scoreHistory) stats.scoreHistory = [];
}

function saveStats() {
  try {
    localStorage.setItem("2048stats", JSON.stringify(stats));
  } catch (e) {}
}

function logGameScore(s) {
  stats.scoreHistory.push(s);
  if (stats.scoreHistory.length > 10) stats.scoreHistory.shift();
  saveStats();
}

function loadBest() {
  try {
    return parseInt(localStorage.getItem("2048best")) || 0;
  } catch (e) {
    return 0;
  }
}

function saveBest() {
  try {
    localStorage.setItem("2048best", best);
  } catch (e) {}
}

function saveGame() {
  try {
    localStorage.setItem(
      "2048state",
      JSON.stringify({ board, score, moves, mode }),
    );
  } catch (e) {}
}

function loadGame() {
  try {
    const s = localStorage.getItem("2048state");
    if (!s) return false;
    const d = JSON.parse(s);
    board = d.board;
    score = d.score;
    moves = d.moves || 0;
    mode = d.mode || "classic";
    return true;
  } catch (e) {
    return false;
  }
}

function clearSavedGame() {
  try {
    localStorage.removeItem("2048state");
  } catch (e) {}
}

/* ====================== BOARD HELPERS ====================== */
function copyBoard(b) {
  return b.map((row) => [...row]);
}
function maxTile() {
  return Math.max(...board.flat().filter(Boolean), 0);
}

function addTile() {
  const empty = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) if (!board[r][c]) empty.push([r, c]);
  if (!empty.length) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return [r, c];
}

function tilePos(r, c) {
  const step = TS + GAP;
  return {
    top: PAD + r * step,
    left: PAD + c * step,
  };
}

/* ====================== GRID DIMENSIONS ====================== */
function applyGridDimensions() {
  const isMobile = window.innerWidth <= 560;
  if (mode === "zen") {
    N = 5;
    TS = isMobile ? 68 : 88;
    GAP = isMobile ? 8 : 11;
    PAD = isMobile ? 10 : 14;
  } else {
    N = 4;
    TS = isMobile ? 82 : 108;
    GAP = isMobile ? 9 : 12;
    PAD = isMobile ? 11 : 14;
  }
  const bd = document.getElementById("bd");
  const wr = document.getElementById("wr");
  bd.style.setProperty("--N", N);
  wr.style.setProperty("--tile-size", `${TS}px`);
  bd.style.gap = `${GAP}px`;
  bd.style.padding = `${PAD}px`;
}

/* ====================== GAME LOGIC ====================== */
function slideRow(row) {
  let arr = row.filter((x) => x);
  let pts = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      pts += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < N) arr.push(0);
  return { row: arr, pts };
}

function rotateBoard(b, turns) {
  let out = b.map((row) => [...row]);
  for (let t = 0; t < turns; t++) {
    const tmp = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) tmp[c][N - 1 - r] = out[r][c];
    out = tmp;
  }
  return out;
}

function doMove(dir) {
  if (over || paused) return;

  prevBoard = copyBoard(board);
  prevScore = score;

  const rotTurns = { left: 0, down: 1, right: 2, up: 3 };
  let tmp = rotateBoard(board, rotTurns[dir]);
  let pts = 0,
    moved = false;
  const merges = [];

  for (let r = 0; r < N; r++) {
    const res = slideRow([...tmp[r]]);
    if (res.row.some((v, i) => v !== tmp[r][i])) moved = true;
    for (let c = 0; c < N; c++) {
      if (res.row[c] > tmp[r][c] && res.row[c] > 0) merges.push({ r, c });
    }
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

  combo = pts > 0 ? combo + 1 : 0;
  playSound(pts > 0 ? "merge" : "move");

  if (score > best) {
    best = score;
    saveBest();
    stats.best = Math.max(stats.best, best);
    saveStats();
  }

  const newCell = addTile();
  renderBoard();
  renderTiles(newCell, pts, merges);
  updateUI();
  checkAchievements();
  saveGame();

  const mt = maxTile();
  if (mt > stats.bestTile) {
    stats.bestTile = mt;
    saveStats();
  }
  if (mt >= 2048 && !won) {
    won = true;
    stats.wins++;
    saveStats();
    launchConfetti();
    setTimeout(() => showOverlay("win"), 250);
    return;
  }

  if (isLost()) {
    over = true;
    undoLocked = true;
    stats.games++;
    stats.best = Math.max(stats.best, score);
    stats.bestTile = Math.max(stats.bestTile, mt);
    logGameScore(score);
    saveStats();
    clearSavedGame();
    setTimeout(() => showOverlay("lose"), 300);
  }
}

function isLost() {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!board[r][c]) return false;
      if (c < N - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < N - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

/* ====================== INIT ====================== */
function init(resume = false) {
  applyGridDimensions();
  const didResume = resume && loadGame();

  if (!didResume) {
    board = Array.from({ length: N }, () => Array(N).fill(0));
    score = 0;
    moves = 0;
    combo = 0;
    over = false;
    won = false;
    undoLocked = false;
    addTile();
    addTile();
  } else {
    over = won = paused = false;
    combo = 0;
  }

  clearInterval(timerInterval);
  timeLeft = 60;
  document.getElementById("tbar").style.display =
    mode === "timed" ? "block" : "none";
  document.getElementById("timer-label-row").style.display =
    mode === "timed" ? "flex" : "none";
  document.getElementById("timer-val").textContent = timeLeft;
  if (mode === "timed") startTimer();

  renderBoard();
  renderTiles();
  updateUI();
  stopConfetti();
  document.getElementById("ov").style.display = "none";
}

/* ====================== TIMER ====================== */
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (paused || over) return;
    timeLeft--;
    updateTimerBar();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      over = true;
      setTimeout(() => showOverlay("lose"), 200);
    }
  }, 1000);
}

function updateTimerBar() {
  const fill = document.getElementById("tfill");
  fill.style.width = (timeLeft / 60) * 100 + "%";
  fill.classList.toggle("danger", timeLeft <= 15);
  const lbl = document.getElementById("timer-val");
  if (lbl) lbl.textContent = Math.max(0, timeLeft);
}

/* ====================== RENDERING ====================== */
function renderBoard() {
  const bd = document.getElementById("bd");
  bd.innerHTML = "";
  for (let i = 0; i < N * N; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    bd.appendChild(cell);
  }
}

function renderTiles(newCell, pts, merges) {
  const tl = document.getElementById("tl");
  tl.innerHTML = "";

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = board[r][c];
      if (!v) continue;
      const pos = tilePos(r, c);
      const isNew = newCell && newCell[0] === r && newCell[1] === c;
      const isMerge = merges && merges.some((m) => m.r === r && m.c === c);

      const tile = document.createElement("div");
      tile.className = `tile${isNew ? " new" : isMerge ? " merged" : ""}`;
      tile.dataset.val = v > 2048 ? "big" : String(v);
      tile.style.top = `${pos.top}px`;
      tile.style.left = `${pos.left}px`;
      tile.style.width = `${TS}px`;
      tile.style.height = `${TS}px`;
      tile.style.fontSize = TILE_STYLES[v] ? TILE_STYLES[v].fontSize : "22px";
      tile.textContent = v;
      tl.appendChild(tile);

      if (isMerge) spawnParticles(pos.left + TS / 2, pos.top + TS / 2, tl);
    }
  }

  if (pts > 0) {
    const fp = document.createElement("div");
    fp.className = "score-float";
    fp.textContent = `+${pts}`;
    tl.appendChild(fp);
    setTimeout(() => fp.remove(), 800);
  }

  const streakEl = document.getElementById("streak");
  if (combo >= 3) {
    streakEl.textContent = COMBO_LABELS[Math.min(combo, 8)] || "LEGENDARY!";
    streakEl.classList.add("show");
    setTimeout(() => streakEl.classList.remove("show"), 1400);
  }
}

function spawnParticles(cx, cy, parent) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${cx - 4}px`;
    p.style.top = `${cy - 4}px`;
    p.style.background =
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 30;
    p.style.setProperty("--px", Math.cos(angle) * dist + "px");
    p.style.setProperty("--py", Math.sin(angle) * dist + "px");
    parent.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }
}

function updateUI() {
  document.getElementById("sv").textContent = score.toLocaleString();
  document.getElementById("bv").textContent = best.toLocaleString();
  document.getElementById("moves-val").textContent = moves;
  document.getElementById("btile-val").textContent = maxTile();
}

/* ====================== OVERLAY ====================== */
function showOverlay(type) {
  const ov = document.getElementById("ov");
  const isWin = type === "win";

  document.getElementById("ov-title").textContent = isWin
    ? "You Win!"
    : "Game Over";
  document.getElementById("ov-subtitle").textContent = isWin
    ? "You reached 2048!"
    : "Better luck next time";

  document.getElementById("final-score").textContent = score.toLocaleString();
  document.getElementById("final-tile").textContent = maxTile();
  document.getElementById("final-moves").textContent = moves;
  document.getElementById("final-time").textContent =
    mode === "timed" ? `${60 - timeLeft}s` : "—";

  ov.style.display = "flex";
}

/* ====================== ACHIEVEMENTS, SOUND, CONFETTI ====================== */
function checkAchievements() {
  ACHIEVEMENTS.forEach((ach) => {
    if (stats.earned.includes(ach.id)) return;
    if (ach.check()) {
      stats.earned.push(ach.id);
      saveStats();
      triggerAchievement(ach.label, ach.desc);
    }
  });
}

function triggerAchievement(label, desc) {
  const el = document.getElementById("ach");
  document.getElementById("ach-msg").textContent = `${label} — ${desc}`;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3200);
}

let audioCtx = null;
function playSound(type) {
  if (!soundOn) return;
  try {
    if (!audioCtx)
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "move") {
      osc.frequency.value = 280;
      gain.gain.value = 0.08;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === "merge") {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        880,
        audioCtx.currentTime + 0.15,
      );
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    }
  } catch (e) {}
}

function launchConfetti() {
  /* Confetti code - can be expanded if needed */
}
function stopConfetti() {
  /* ... */
}

/* ====================== STATS MODAL ====================== */
function openStats() {
  document.getElementById("st-best").textContent = stats.best.toLocaleString();
  document.getElementById("st-games").textContent = stats.games;
  document.getElementById("st-wins").textContent = stats.wins;
  document.getElementById("st-tile").textContent = stats.bestTile;

  const badgesEl = document.getElementById("ach-badges");
  badgesEl.innerHTML = "";
  ACHIEVEMENTS.forEach((ach) => {
    const badge = document.createElement("span");
    badge.className = `ach-badge${stats.earned.includes(ach.id) ? " earned" : ""}`;
    badge.textContent = ach.label;
    badgesEl.appendChild(badge);
  });

  drawScoreGraph();

  document.getElementById("stats-modal").classList.add("open");
}

function closeStats() {
  document.getElementById("stats-modal").classList.remove("open");
}

function drawScoreGraph() {
  const canvas = document.getElementById("score-graph");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = (canvas.width = canvas.clientWidth);
  const h = (canvas.height = canvas.clientHeight || 80);
  ctx.clearRect(0, 0, w, h);

  const data = stats.scoreHistory;
  if (!data.length) return;

  const max = Math.max(...data, 1);
  const stepX = w / Math.max(data.length - 1, 1);

  ctx.beginPath();
  ctx.strokeStyle = "#ffd54f";
  ctx.lineWidth = 2;
  data.forEach((val, i) => {
    const x = i * stepX;
    const y = h - (val / max) * (h - 8) - 4;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

/* ====================== HINT ====================== */
function getHintDirection() {
  const dirs = ["up", "down", "left", "right"];
  const rotTurns = { left: 0, down: 1, right: 2, up: 3 };
  let best = null,
    bestScore = -1;

  for (const dir of dirs) {
    let tmp = rotateBoard(board, rotTurns[dir]);
    let pts = 0,
      moved = false;
    for (let r = 0; r < N; r++) {
      const before = [...tmp[r]];
      const res = slideRow([...tmp[r]]);
      if (res.row.some((v, i) => v !== before[i])) moved = true;
      pts += res.pts;
    }
    if (!moved) continue;
    if (pts > bestScore || best === null) {
      bestScore = pts;
      best = dir;
    }
  }
  return best;
}

/* ====================== EVENT LISTENERS ====================== */
document.getElementById("nb").addEventListener("click", () => {
  clearSavedGame();
  init();
});
document.getElementById("ub").addEventListener("click", () => {
  if (undoLocked || !prevBoard) return;
  board = copyBoard(prevBoard);
  score = prevScore;
  moves = Math.max(0, moves - 1);
  renderBoard();
  renderTiles();
  updateUI();
});

document.getElementById("hintbtn").addEventListener("click", () => {
  const dir = getHintDirection();
  const toast = document.getElementById("toast");
  toast.textContent = dir
    ? `Try: ${dir.toUpperCase()}`
    : "No moves available";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
});

document
  .getElementById("settings-btn")
  .addEventListener("click", () =>
    document.getElementById("settings-panel").classList.add("open"),
  );
document
  .getElementById("close-settings")
  .addEventListener("click", () =>
    document.getElementById("settings-panel").classList.remove("open"),
  );

document.getElementById("play-again-btn").addEventListener("click", () => {
  clearSavedGame();
  init();
});

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    clearSavedGame();
    init();
  });
});

document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".theme-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.dataset.theme = btn.dataset.theme;
    localStorage.setItem("2048theme", btn.dataset.theme);
  });
});

document.getElementById("sdbtn-panel").addEventListener("click", (e) => {
  soundOn = !soundOn;
  e.currentTarget.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
});

document.getElementById("stbtn-panel").addEventListener("click", () => {
  document.getElementById("settings-panel").classList.remove("open");
  openStats();
});

document.getElementById("close-stats").addEventListener("click", closeStats);

/* Keyboard */
document.addEventListener("keydown", (e) => {
  const map = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
    a: "left",
    d: "right",
    w: "up",
    s: "down",
  };
  if (map[e.key]) {
    e.preventDefault();
    doMove(map[e.key]);
  }
});

/* Swipe */
let sx = 0,
  sy = 0;
document.getElementById("wr").addEventListener(
  "touchstart",
  (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  },
  { passive: true },
);

document.getElementById("wr").addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;
    doMove(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  },
  { passive: true },
);

/* Boot */
loadStats();
best = loadBest();
init(true);

/* Restore theme */
try {
  const savedTheme = localStorage.getItem("2048theme") || "classic";
  document.body.dataset.theme = savedTheme;
  document.querySelectorAll(".theme-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.theme === savedTheme);
  });
} catch (e) {}

/* How-to Play Modal */
const howtoModal = document.getElementById("howto-modal");
const openHowto = () => (howtoModal.style.display = "flex");
const closeHowto = () => (howtoModal.style.display = "none");

const howtoInlineBtn = document.getElementById("howto-inline-btn");
if (howtoInlineBtn) howtoInlineBtn.addEventListener("click", openHowto);

const howtoClose = document.getElementById("howto-close");
if (howtoClose) howtoClose.addEventListener("click", closeHowto);

const howtoClose2 = document.getElementById("howto-close2");
if (howtoClose2) howtoClose2.addEventListener("click", closeHowto);

howtoModal.addEventListener("click", (e) => {
  if (e.target === howtoModal) closeHowto();
});
