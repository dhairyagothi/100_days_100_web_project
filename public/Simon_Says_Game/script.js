let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let lives = 3;
let maxLives = 3;
let gameMode = "normal"; // "normal" | "endless" | "strict"
let soundEnabled = true;
let flashSpeed = 600;
let clickable = true;
let paused = false;
let sequenceInterval = null;

// ── DOM refs ──────────────────────────────
const splashScreen       = document.getElementById("splash-screen");
const gameScreen         = document.getElementById("game-screen");
const statusMsg          = document.getElementById("status-msg");
const currentLevelDisplay= document.getElementById("current-level-display");
const highscoreDisplay   = document.getElementById("highscore-display");
const clickCounter       = document.getElementById("click-counter");
const clicksDone         = document.getElementById("clicks-done");
const clicksTotal        = document.getElementById("clicks-total");
const clickPipTrack      = document.getElementById("click-pip-track");
const modal              = document.getElementById("game-modal");
const modalEmoji         = document.getElementById("modal-emoji");
const modalTitle         = document.getElementById("modal-title");
const modalScoreVal      = document.getElementById("modal-score-val");
const modalBestVal       = document.getElementById("modal-best-val");
const modalNameRow       = document.getElementById("modal-name-row");
const modalNameInput     = document.getElementById("modal-name-input");
const modalBtn           = document.getElementById("modal-btn");
const soundToggle        = document.getElementById("sound-toggle");
const modePicker         = document.getElementById("mode-picker");
const modeButtons        = document.querySelectorAll(".mode-btn");
const livesRow           = document.getElementById("lives-row");
const lifeButtons        = document.querySelectorAll(".life-btn");
const themeToggle        = document.getElementById("theme-toggle");
const startBtn           = document.getElementById("start-btn");
const stopBtn            = document.getElementById("stop-btn");
const pauseBtn           = document.getElementById("pause-btn");
const playBtn            = document.getElementById("play-btn");
const leaderboardBtn     = document.getElementById("leaderboard-btn");
const leaderboardModal   = document.getElementById("leaderboard-modal");
const leaderboardList    = document.getElementById("leaderboard-list");
const leaderboardCloseBtn= document.getElementById("leaderboard-close-btn");
const leaderboardClearBtn= document.getElementById("leaderboard-clear-btn");
const allBtns            = document.querySelectorAll(".btn");

let highScore = parseInt(localStorage.getItem("simonHighScore") || "0");
highscoreDisplay.textContent = highScore;

// ── Splash → Game ────────────────────────
playBtn.addEventListener("click", () => {
  gameScreen.scrollIntoView({ behavior: "smooth" });
});

// ── Web Audio ────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getCtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

const colorFreq = { red: 261.6, yellow: 329.6, green: 392.0, purple: 466.2 };

function playTone(color, dur = 0.3) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = colorFreq[color] || 300;
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}

function playSuccessSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    [523.3, 659.3, 783.9].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    });
  } catch(e) {}
}

function playErrorSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sawtooth"; osc.frequency.value = 110;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

// ── Leaderboard ───────────────────────────
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem("simonLeaderboard") || "[]"); }
  catch { return []; }
}
function saveLeaderboard(e) { localStorage.setItem("simonLeaderboard", JSON.stringify(e)); }
function addLeaderboardEntry(name, score) {
  const entries = getLeaderboard();
  entries.push({ name: name.trim() || "Anonymous", score, date: new Date().toLocaleDateString() });
  entries.sort((a,b) => b.score - a.score);
  saveLeaderboard(entries.slice(0, 10));
}

function renderLeaderboard() {
  const entries = getLeaderboard();
  leaderboardList.innerHTML = "";
  if (!entries.length) {
    leaderboardList.innerHTML = "<li><span class='lb-empty'>No scores yet — play a game!</span></li>";
    return;
  }
  const medals = ["🥇","🥈","🥉"];
  entries.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="lb-rank">${medals[i] || i+1}</span><span class="lb-name">${e.name}</span><span class="lb-score">${e.score}</span><span class="lb-date">${e.date}</span>`;
    leaderboardList.appendChild(li);
  });
}

leaderboardBtn.addEventListener("click", () => { renderLeaderboard(); leaderboardModal.classList.remove("hidden"); });
leaderboardCloseBtn.addEventListener("click", () => leaderboardModal.classList.add("hidden"));
leaderboardClearBtn.addEventListener("click", () => {
  if (confirm("Clear all leaderboard scores?")) { saveLeaderboard([]); renderLeaderboard(); }
});

// ── Click counter (pip track) ─────────────
function buildPips(total) {
  clickPipTrack.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const pip = document.createElement("span");
    pip.className = "pip";
    pip.id = `pip-${i}`;
    clickPipTrack.appendChild(pip);
  }
}

function updateClickCounter() {
  const done = userSeq.length;
  const total = gameSeq.length;
  clicksDone.textContent = done;
  clicksTotal.textContent = total;
  // colour pips up to 'done'
  for (let i = 0; i < total; i++) {
    const pip = document.getElementById(`pip-${i}`);
    if (pip) pip.classList.toggle("done", i < done);
  }
}

function showClickCounter(visible) {
  clickCounter.classList.toggle("hidden", !visible);
  if (visible) updateClickCounter();
}

// ── Level display ─────────────────────────
function setLevelDisplay(val) {
  currentLevelDisplay.textContent = val === null ? "—" : val;
}

// ── Flash ─────────────────────────────────
function gameFlash(btn) {
  playTone(btn.id);
  btn.classList.add("flash");
  btn.addEventListener("animationend", () => btn.classList.remove("flash"), { once: true });
}

function userFlash(btn) {
  playTone(btn.id, 0.18);
  btn.classList.add("userflash");
  btn.addEventListener("animationend", () => btn.classList.remove("userflash"), { once: true });
}

// ── Game logic ────────────────────────────
function startGame() {
  if (started) return;
  started = true;
  level = 0; lives = maxLives;
  gameSeq = []; userSeq = [];
  setStatus("Get ready! 👀");
  levelUp();
}

function levelUp() {
  if (gameMode !== "endless" && level === 20) {
    updateHighScore();
    showModal("🎉", "You Won!", level, true);
    resetGame(); return;
  }
  userSeq = [];
  level++;
  flashSpeed = Math.max(200, 600 - level * 20);
  setStatus(`Level ${level} 🎯`, true);
  setLevelDisplay(level);

  const randColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);

  clickable = false;
  showClickCounter(false);
  buildPips(gameSeq.length);
  setTimeout(playSequence, 600);
}

function playSequence() {
  let i = 0;
  sequenceInterval = setInterval(() => {
    if (paused) return;
    gameFlash(document.getElementById(gameSeq[i]));
    i++;
    if (i >= gameSeq.length) {
      clearInterval(sequenceInterval); sequenceInterval = null;
      clickable = true;
      setStatus("Your turn! 👆");
      showClickCounter(true);
    }
  }, flashSpeed + 100);
}

function togglePause() {
  if (!started) return;
  paused = !paused;
  if (paused) {
    clickable = false;
    if (sequenceInterval) clearInterval(sequenceInterval);
    setStatus("⏸ Paused");
    pauseBtn.textContent = "▶ Resume";
  } else {
    setStatus("Resuming…");
    clickable = false;
    showClickCounter(false);
    setTimeout(() => playSequence(), 500);
    pauseBtn.textContent = "⏸ Pause";
  }
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      clickable = false;
      showClickCounter(false);
      playSuccessSound();
      setStatus("✅ Correct!");
      setTimeout(levelUp, 900);
    }
  } else {
    playErrorSound();
    if (gameMode === "strict") {
      lives--;
      if (lives > 0) {
        setStatus(`❌ Wrong! ${lives} ${lives === 1 ? "life" : "lives"} left`);
        userSeq = [];
        clickable = false;
        showClickCounter(false);
        setTimeout(playSequence, 1200);
      } else {
        gameOver();
      }
    } else {
      setStatus("❌ Oops! Try again…");
      userSeq = [];
      clickable = false;
      showClickCounter(false);
      setTimeout(playSequence, 1000);
    }
  }
}

function stopGame() {
  if (!started) return;
  updateHighScore();
  showModal("🛑", "Stopped", level, true);
  resetGame();
}

function gameOver() {
  updateHighScore();
  showModal("💀", "Game Over!", level, true);
  resetGame();
}

function updateHighScore() {
  if (level > highScore) {
    highScore = level;
    localStorage.setItem("simonHighScore", highScore);
    highscoreDisplay.textContent = highScore;
    // brief pop animation
    highscoreDisplay.classList.remove("new-record");
    void highscoreDisplay.offsetWidth;
    highscoreDisplay.classList.add("new-record");
  }
}

function setStatus(msg, levelUp = false) {
  statusMsg.textContent = msg;
  if (levelUp) {
    statusMsg.classList.remove("level-up");
    void statusMsg.offsetWidth;
    statusMsg.classList.add("level-up");
  }
}

function btnPress() {
  if (!started || !clickable || paused) return;
  userFlash(this);
  if (navigator.vibrate) navigator.vibrate(50);
  userSeq.push(this.id);
  // bump pip
  const pip = document.getElementById(`pip-${userSeq.length - 1}`);
  if (pip) { pip.classList.add("done"); }
  updateClickCounter();
  checkAns(userSeq.length - 1);
}

function showModal(emoji, title, score, offerLeaderboard = false) {
  modalEmoji.textContent = emoji;
  modalTitle.textContent = title;
  modalScoreVal.textContent = score;
  modalBestVal.textContent = highScore;
  modalBtn.textContent = "Play Again";
  if (offerLeaderboard && score > 0) {
    modalNameRow.classList.remove("hidden");
    modalNameInput.value = "";
  } else {
    modalNameRow.classList.add("hidden");
  }
  modal.classList.remove("hidden");
}

modalBtn.addEventListener("click", () => {
  const score = parseInt(modalScoreVal.textContent) || 0;
  if (!modalNameRow.classList.contains("hidden") && score > 0) {
    addLeaderboardEntry(modalNameInput.value, score);
  }
  modal.classList.add("hidden");
  startGame();
});

function resetGame() {
  started = false; paused = false;
  if (sequenceInterval) clearInterval(sequenceInterval);
  gameSeq = []; userSeq = [];
  level = 0; clickable = true;
  pauseBtn.textContent = "⏸ Pause";
  setLevelDisplay(null);
  showClickCounter(false);
  setStatus("Press Start to play 🙌");
}

// ── Event listeners ───────────────────────
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
pauseBtn.addEventListener("click", togglePause);
allBtns.forEach(btn => btn.addEventListener("click", btnPress));

// ── Mode picker ───────────────────────────
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (started) return; // can't change mode mid-game
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gameMode = btn.dataset.mode;
    livesRow.classList.toggle("hidden", gameMode !== "strict");
  });
});

lifeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    lifeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    maxLives = parseInt(btn.dataset.lives);
  });
});
soundToggle.addEventListener("change", e => { soundEnabled = e.target.checked; });

const themeIcon = document.querySelector(".theme-icon");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  themeIcon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
