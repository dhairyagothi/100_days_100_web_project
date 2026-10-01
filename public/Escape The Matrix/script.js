// ================================================================
//  ESCAPE THE MATRIX — Game Engine
//  Single-page hacking terminal game
// ================================================================

//  TABLE OF CONTENTS
//  -----------------
//  1.  Matrix Rain
//  2.  Custom Cursor
//  3.  Audio Engine
//  4.  Save / Load (localStorage)
//  5.  Game State & Constants
//  6.  Screen Manager
//  7.  Terminal Helpers
//  8.  Boot Sequence
//  9.  Main Menu
//  10. Game Start & Level Manager
//  11. Timer
//  12. Trace Meter
//  13. Attempts UI
//  14. Hint Panel
//  15. Achievement Popup
//  16. Level Complete / Game Over / Victory
//  17. Level 1 — Password Crack
//  18. Level 2 — Command Challenge
//  19. Level 3 — Trace Avoidance (Ciphers)
//  20. Level 4 — Firewall Puzzle (Simon sequence)
//  21. Level 5 — Escape Sequence
//  22. Input Handler
//  23. Periodic AI Messages & Glitch Effects
//  24. Init
// ================================================================

// ── 1. Matrix Rain ──────────────────────────────────────────────
const MC = document.getElementById("mc");
const CTX = MC.getContext("2d");
let cols = [],
  FS = 14;
const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF><{}[]|/\\$#@%^&*";

function initRain() {
  MC.width = window.innerWidth;
  MC.height = window.innerHeight;
  const n = Math.floor(MC.width / FS);
  cols = Array.from({ length: n }, () =>
    Math.floor((Math.random() * MC.height) / FS),
  );
}

function drawRain() {
  CTX.fillStyle = "rgba(0,0,0,0.045)";
  CTX.fillRect(0, 0, MC.width, MC.height);
  cols.forEach((y, i) => {
    const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
    CTX.font = FS + "px Share Tech Mono,monospace";
    CTX.fillStyle =
      i % 9 === 0 ? "#ffffff" : i % 4 === 0 ? "#00ffaa" : "#00ff41";
    CTX.globalAlpha = 0.5 + Math.random() * 0.4;
    CTX.fillText(ch, i * FS, y * FS);
    if (y * FS > MC.height && Math.random() > 0.975) cols[i] = 0;
    else cols[i]++;
  });
  CTX.globalAlpha = 1;
}

initRain();
window.addEventListener("resize", initRain);
setInterval(drawRain, 55);

// ── 2. Custom Cursor ────────────────────────────────────────────
const curEl = document.getElementById("cur");
document.addEventListener("mousemove", (e) => {
  curEl.style.left = e.clientX + "px";
  curEl.style.top = e.clientY + "px";
});
document.addEventListener("mousedown", () => {
  curEl.style.width = "14px";
  curEl.style.height = "14px";
});
document.addEventListener("mouseup", () => {
  curEl.style.width = "10px";
  curEl.style.height = "10px";
});

// ── 3. Audio Engine ─────────────────────────────────────────────
let AC = null,
  soundOn = true;

function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  return AC;
}

function playTone(freq, dur, type = "square", vol = 0.12) {
  if (!soundOn) return;
  try {
    const ac = getAC();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(vol, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.start();
    osc.stop(ac.currentTime + dur);
  } catch (e) {
    /* AudioContext may be blocked until user interaction */
  }
}

function playKeyClick() {
  playTone(800 + Math.random() * 400, 0.04, "square", 0.06);
}
function playBeep() {
  playTone(1200, 0.1, "square", 0.1);
}

function playSuccess() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.2, "sine", 0.15), i * 80),
  );
}

function playFail() {
  [300, 250, 200].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.25, "sawtooth", 0.12), i * 100),
  );
}

function playAlert() {
  playTone(880, 0.15, "sawtooth", 0.1);
}

function playGlitch() {
  for (let i = 0; i < 5; i++)
    setTimeout(
      () => playTone(50 + Math.random() * 200, 0.05, "sawtooth", 0.08),
      i * 30,
    );
}

function playWarp() {
  if (!soundOn) return;
  try {
    const ac = getAC();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ac.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
    osc.start();
    osc.stop(ac.currentTime + 0.5);
  } catch (e) {}
}

// ── 4. Save / Load ──────────────────────────────────────────────
const SAVE_KEY = "etm_save";

function saveGame() {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      level: G.level,
      diff: G.diff,
      trace: G.trace,
      ts: Date.now(),
    }),
  );
}

function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return null;
  }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ── 5. Game State & Constants ────────────────────────────────────
const DIFF = {
  easy: {
    timer: 120,
    maxAttempts: 8,
    traceSpeed: 0.4,
    pwLen: 4,
    label: "EASY",
  },
  med: { timer: 90, maxAttempts: 6, traceSpeed: 0.9, pwLen: 5, label: "MED" },
  hard: { timer: 55, maxAttempts: 4, traceSpeed: 1.8, pwLen: 6, label: "HARD" },
};

const MISSIONS = [
  { id: 1, name: "PASSWORD CRACK", badge: "LEVEL 1 — PWD CRACK" },
  { id: 2, name: "CMD CHALLENGE", badge: "LEVEL 2 — CMD INJECT" },
  { id: 3, name: "TRACE AVOIDANCE", badge: "LEVEL 3 — EVADE TRACE" },
  { id: 4, name: "FIREWALL PUZZLE", badge: "LEVEL 4 — FIREWALL" },
  { id: 5, name: "ESCAPE SEQUENCE", badge: "LEVEL 5 — ESCAPE" },
];

const G = {
  level: 1,
  diff: "med",
  trace: 0,
  soundOn: true,
  timer: null,
  timerVal: 0,
  timerActive: false,
  traceInterval: null,
  levelState: {},
  inputLocked: false,
};

// Helper
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 6. Screen Manager ────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".scr").forEach((s) => s.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}

// ── 7. Terminal Helpers ──────────────────────────────────────────
const tout = document.getElementById("tout");
const tiEl = document.getElementById("ti");

/** Append a line to the terminal output */
function tLine(txt, cls = "out", delay = 0) {
  return new Promise((res) =>
    setTimeout(() => {
      const d = document.createElement("div");
      d.className = "tl " + cls;
      d.innerHTML = txt;
      tout.appendChild(d);
      tout.scrollTop = tout.scrollHeight;
      res();
    }, delay),
  );
}

/** Append a blank spacer line */
function tEmpty(delay = 0) {
  return tLine("", "emp", delay);
}

/** Type text character by character with key-click sounds */
async function tType(txt, cls = "out", speed = 25) {
  const d = document.createElement("div");
  d.className = "tl " + cls;
  tout.appendChild(d);
  for (const ch of txt) {
    d.textContent += ch;
    playKeyClick();
    tout.scrollTop = tout.scrollHeight;
    await sleep(speed + Math.random() * 15);
  }
  tout.scrollTop = tout.scrollHeight;
}

/** Clear terminal output */
function tClear() {
  tout.innerHTML = "";
}

/** Show typed user command in terminal */
function tCmd(cmd) {
  tLine(
    `<span class="psym">$</span><span class="pusr"> ${escHtml(cmd)}</span>`,
    "cmd",
  );
}

/** Show an AI_CORE message block */
function aiMsg(txt) {
  const d = document.createElement("div");
  d.className = "tl aim";
  d.innerHTML = `<span class="ail">AI_CORE &gt;</span><span>${escHtml(txt)}</span>`;
  tout.appendChild(d);
  tout.scrollTop = tout.scrollHeight;
}

/** Escape HTML entities to prevent injection */
function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── 8. Boot Sequence ─────────────────────────────────────────────
const BOOT_LINES = [
  {
    t: "[ BIOS v3.9.1 ] Initializing quantum processor array...",
    s: "ok",
    d: 200,
  },
  { t: "[ MEM ] Allocating 128TB secure enclave...", s: "ok", d: 350 },
  {
    t: "[ NET ] Connecting to encrypted node cluster [7731]...",
    s: "ok",
    d: 500,
  },
  { t: "[ SEC ] Validating cryptographic certificates...", s: "ok", d: 650 },
  { t: "[ FW ] Probing firewall topology...", s: "warn", d: 820 },
  {
    t: "[ FW ] External intrusion attempt detected — suppressing...",
    s: "warn",
    d: 1000,
  },
  {
    t: "[ FW ] Bypass route established via onion relay #44...",
    s: "ok",
    d: 1200,
  },
  { t: "[ CRYPT ] Decrypting credential store...", s: "ok", d: 1400 },
  { t: "[ AUTH ] Spoofing identity token...", s: "ok", d: 1600 },
  { t: "[ NET ] Tunneling through 17 proxy layers...", s: "ok", d: 1800 },
  { t: "[ SYS ] Loading matrix core modules...", s: "ok", d: 2000 },
  {
    t: "[ ERR ] Anomalous activity pattern — flagged by AI_CORE",
    s: "er",
    d: 2200,
  },
  { t: "[ SYS ] Suppressing AI_CORE telemetry...", s: "ok", d: 2400 },
  { t: "[ AUTH ] Root privileges escalated.", s: "ok", d: 2650 },
  { t: "[ MATRIX ] ACCESS GRANTED", s: "ok", d: 2900 },
];

async function runBoot() {
  showScreen("sboot");
  const blog = document.getElementById("blog");
  const pbf = document.getElementById("pbf");
  const bpct = document.getElementById("bpct");

  blog.innerHTML = "";

  BOOT_LINES.forEach((bl, i) => {
    const d = document.createElement("div");
    d.className = "bl";

    let sym = "";
    if (bl.s === "ok") sym = '<span class="ok">[ OK ]</span>';
    else if (bl.s === "er") sym = '<span class="er">[ ERR ]</span>';
    else if (bl.s === "warn") sym = '<span class="wn">[ WARN ]</span>';

    d.innerHTML = `<span class="px">${escHtml(bl.t)}</span>${sym}`;
    blog.appendChild(d);

    setTimeout(() => {
      d.classList.add("v");
      const pct = Math.round(((i + 1) / BOOT_LINES.length) * 100);
      pbf.style.width = pct + "%";
      bpct.textContent = pct + "%";
      if (bl.s === "er") playGlitch();
      else if (bl.s === "warn") playAlert();
      else playBeep();
    }, bl.d);
  });

  await sleep(3400);
  playWarp();
  await sleep(400);
  showMenu();
}

// ── 9. Main Menu ─────────────────────────────────────────────────
function showMenu() {
  showScreen("smenu");
  const sv = loadSave();
  const btnCont = document.getElementById("btnCont");
  const saveInfo = document.getElementById("saveInfo");

  if (sv && sv.level > 1) {
    btnCont.style.display = "";
    const d = new Date(sv.ts);
    saveInfo.textContent = `SAVED PROGRESS: LEVEL ${sv.level}/5 — ${d.toLocaleDateString()}`;
    G.level = sv.level;
    G.diff = sv.diff || "med";
  } else {
    btnCont.style.display = "none";
    saveInfo.textContent = "NO SAVED PROGRESS FOUND";
  }

  updateDiffCards();
  document.getElementById("hDiff").textContent = DIFF[G.diff].label;
  updateSoundBtn();
}

function updateSoundBtn() {
  document.getElementById("btnSound").textContent = soundOn
    ? "[ SOUND: ON ]"
    : "[ SOUND: OFF ]";
}

// ── Menu Button Listeners ────────────────────────────────────────
document.getElementById("btnNew").addEventListener("click", () => {
  clearSave();
  G.level = 1;
  startGame();
});

document.getElementById("btnCont").addEventListener("click", () => {
  const sv = loadSave();
  if (sv) {
    G.level = sv.level;
    G.diff = sv.diff || "med";
  }
  startGame();
});

document
  .getElementById("btnDiff")
  .addEventListener("click", () => showScreen("sdiff"));

document.getElementById("btnSound").addEventListener("click", () => {
  soundOn = !soundOn;
  updateSoundBtn();
  playBeep();
});

document.getElementById("btnDiffOk").addEventListener("click", () => {
  showMenu();
  document.getElementById("hDiff").textContent = DIFF[G.diff].label;
});

document
  .getElementById("btnDiffBack")
  .addEventListener("click", () => showMenu());

document.getElementById("btnSnd").addEventListener("click", () => {
  soundOn = !soundOn;
  document.getElementById("btnSnd").textContent = soundOn ? "♪" : "♪̸";
});

document.getElementById("btnMenu2").addEventListener("click", () => {
  stopAllTimers();
  showMenu();
});

document.getElementById("btnPlayAgain").addEventListener("click", () => {
  clearSave();
  G.level = 1;
  startGame();
});

document.getElementById("btnMenuVic").addEventListener("click", showMenu);
document
  .getElementById("btnRetry")
  .addEventListener("click", () => startLevel(G.level));
document.getElementById("btnMenuGov").addEventListener("click", () => {
  clearSave();
  showMenu();
});

// Difficulty card selection
document.querySelectorAll(".dc").forEach((dc) => {
  dc.addEventListener("click", () => {
    document.querySelectorAll(".dc").forEach((d) => d.classList.remove("sel"));
    dc.classList.add("sel");
    G.diff = dc.dataset.d;
    playBeep();
  });
});

function updateDiffCards() {
  document.querySelectorAll(".dc").forEach((d) => {
    d.classList.toggle("sel", d.dataset.d === G.diff);
  });
}

// ── 10. Game Start & Level Manager ───────────────────────────────
function startGame() {
  startLevel(G.level);
}

function startLevel(n) {
  G.level = n;
  G.trace = 0;
  G.inputLocked = false;
  G.levelState = {};

  stopAllTimers();
  showScreen("sgame");
  tClear();

  document.getElementById("mBadge").textContent = MISSIONS[n - 1].badge;
  document.getElementById("hLevel").textContent = `${n}/5`;
  document.getElementById("hDiff").textContent = DIFF[G.diff].label;
  document.getElementById("tTitle").textContent =
    `TERMINAL — MATRIX NODE #${7000 + n * 117 + Math.floor(Math.random() * 50)}`;
  document.getElementById("sFirewall").style.display = "none";

  updateTrace(0);
  buildMissionSteps(n);
  focusInput();

  const runners = [null, runLevel1, runLevel2, runLevel3, runLevel4, runLevel5];
  runners[n]();
}

/** Rebuild the mission progress list in the sidebar */
function buildMissionSteps(current) {
  const el = document.getElementById("msteps");
  el.innerHTML = "";
  MISSIONS.forEach((m, i) => {
    const div = document.createElement("div");
    const state = i + 1 < current ? "done" : i + 1 === current ? "act" : "lck";
    const icon = i + 1 < current ? "✓" : i + 1 === current ? "►" : "○";
    div.className = `mstep ${state}`;
    div.innerHTML = `<div class="snum">${icon}</div><div>${m.name}</div>`;
    el.appendChild(div);
  });
}

function stopAllTimers() {
  clearInterval(G.timer);
  clearInterval(G.traceInterval);
  G.timerActive = false;
}

function focusInput() {
  setTimeout(() => tiEl.focus(), 100);
}

// ── 11. Timer ────────────────────────────────────────────────────
function startTimer(seconds, onTick, onExpire) {
  G.timerVal = seconds;
  G.timerActive = true;
  document.getElementById("hTimerWrap").style.display = "";
  updateTimerUI(seconds);

  G.timer = setInterval(() => {
    G.timerVal--;
    updateTimerUI(G.timerVal);
    if (onTick) onTick(G.timerVal);
    if (G.timerVal <= 0) {
      clearInterval(G.timer);
      G.timerActive = false;
      if (onExpire) onExpire();
    }
  }, 1000);
}

function updateTimerUI(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(Math.max(s, 0) % 60).padStart(2, "0");
  const txt = `${m}:${sec}`;
  const cls = s <= 10 ? "dng" : s <= 30 ? "wn" : "";

  document.getElementById("hTimer").textContent = txt;
  document.getElementById("tdsp").textContent = txt;
  document.getElementById("tdsp").className = "tdsp " + cls;
  document.getElementById("hTimer").className = "v " + (cls || "");
}

function stopTimer() {
  clearInterval(G.timer);
  G.timerActive = false;
  document.getElementById("hTimerWrap").style.display = "none";
  document.getElementById("tdsp").textContent = "--:--";
}

// ── 12. Trace Meter ──────────────────────────────────────────────
function startTrace(speed) {
  G.traceInterval = setInterval(() => {
    G.trace = Math.min(100, G.trace + speed);
    updateTrace(G.trace);

    if (G.trace >= 100) {
      clearInterval(G.traceInterval);
      gameOver(
        "TRACE DETECTION REACHED 100%\nLOCATION COMPROMISED — SYSTEM LOCKDOWN",
      );
    }
    if (G.trace >= 80 && G.trace < 80 + speed) {
      playAlert();
      tLine("⚠ WARNING: TRACE LEVEL CRITICAL", "wrn");
      aiMsg(
        "Trace detection near threshold. Recommend immediate countermeasures.",
      );
    }
  }, 1000);
}

function updateTrace(val) {
  G.trace = Math.max(0, Math.min(100, val));
  const cls = G.trace < 40 ? "s" : G.trace < 75 ? "w" : "d";
  const label = G.trace < 40 ? "SAFE" : G.trace < 75 ? "ELEVATED" : "CRITICAL";
  document.getElementById("tbf").style.width = G.trace + "%";
  document.getElementById("tval").className = "tv " + cls;
  document.getElementById("tval").textContent =
    Math.round(G.trace) + "% — " + label;
}

// ── 13. Attempts UI ──────────────────────────────────────────────
function setAttempts(max, used) {
  const el = document.getElementById("adots");
  el.innerHTML = "";
  for (let i = 0; i < max; i++) {
    const d = document.createElement("div");
    d.className = "adot" + (i < used ? " used" : "");
    el.appendChild(d);
  }
}

// ── 14. Hint Panel ───────────────────────────────────────────────
function setHint(html) {
  document.getElementById("hintText").innerHTML = html;
}

// ── 15. Achievement Popup ────────────────────────────────────────
function showAch(title, msg) {
  const a = document.getElementById("achPop");
  document.getElementById("achTitle").textContent = title;
  document.getElementById("achMsg").textContent = msg;
  a.classList.add("sh");
  setTimeout(() => a.classList.remove("sh"), 3500);
}

// ── 16. Level Complete / Game Over / Victory ─────────────────────
async function levelComplete(msg = "") {
  stopAllTimers();
  playSuccess();
  await tEmpty();
  await tLine("═".repeat(50), "suc");
  await tLine("  MISSION OBJECTIVE COMPLETE", "suc");
  await tLine("═".repeat(50), "suc");
  if (msg) await tLine(msg, "suc");
  await tEmpty();

  showAch(
    `LEVEL ${G.level} CLEARED`,
    MISSIONS[G.level - 1].name + " — COMPLETE",
  );
  G.level++;
  saveGame();

  if (G.level > 5) {
    await sleep(1200);
    showVictory();
  } else {
    await tLine(`Advancing to ${MISSIONS[G.level - 1].name}...`, "inf");
    await sleep(1800);
    startLevel(G.level);
  }
}

async function gameOver(reason = "") {
  stopAllTimers();
  G.inputLocked = true;
  playFail();

  await tEmpty();
  await tLine("╔" + "═".repeat(48) + "╗", "err");
  await tLine("  MISSION FAILED", "err");
  if (reason) await tLine("  " + reason, "err");
  await tLine("╚" + "═".repeat(48) + "╝", "err");

  await sleep(400);
  document.getElementById("govTxt").innerHTML =
    `LEVEL ${G.level} — ${MISSIONS[G.level - 1].name}<br><br>` +
    escHtml(reason) +
    "<br><br>AGENT IDENTITY COMPROMISED<br>SYSTEM QUARANTINE INITIATED";

  await sleep(800);
  showScreen("sgov");
}

function showVictory() {
  clearSave();
  document.getElementById("vicTxt").innerHTML =
    `CONGRATULATIONS, AGENT.<br><br>` +
    `YOU HAVE BREACHED ALL 5 SECURITY LAYERS<br>` +
    `AND SUCCESSFULLY ESCAPED THE MATRIX.<br><br>` +
    `DIFFICULTY: ${DIFF[G.diff].label}<br>` +
    `ALL MISSIONS COMPLETED<br><br>` +
    `THE SYSTEM HAS BEEN COMPROMISED.<br>FREEDOM ACHIEVED.`;
  showScreen("svic");
  playSuccess();
  setTimeout(playSuccess, 600);
}

// ══════════════════════════════════════════════════════════════════
//  17. LEVEL 1 — PASSWORD CRACK
// ══════════════════════════════════════════════════════════════════
const WORDS = {
  4: [
    "ECHO",
    "NODE",
    "BYTE",
    "CODE",
    "HACK",
    "KERN",
    "FLUX",
    "GRID",
    "LOCK",
    "MASK",
    "ROOT",
    "SCAN",
    "VOID",
    "WORM",
    "ZERO",
  ],
  5: [
    "ALPHA",
    "BRAVO",
    "CRYPT",
    "DELTA",
    "ETHER",
    "GHOST",
    "HYDRA",
    "INDEX",
    "KARMA",
    "LASER",
    "NEXUS",
    "OMEGA",
    "PIXEL",
    "QUARK",
    "RELAY",
    "SIGMA",
    "TOXIN",
    "ULTRA",
    "VIPER",
    "XENON",
  ],
  6: [
    "BINARY",
    "CIPHER",
    "DAEMON",
    "ENIGMA",
    "FALCON",
    "GLITCH",
    "HUNTER",
    "ICARUS",
    "JUNGLE",
    "KERNEL",
    "MATRIX",
    "NEURAL",
    "ORACLE",
    "PACKET",
    "QUARRY",
    "REBOOT",
    "SOCKET",
    "TROJAN",
    "UPLINK",
    "VECTOR",
  ],
};

async function runLevel1() {
  const d = DIFF[G.diff];
  const wordList = WORDS[d.pwLen] || WORDS[5];
  const password = wordList[Math.floor(Math.random() * wordList.length)];
  const maxAtt = d.maxAttempts;
  const timerSec = d.timer;

  G.levelState = {
    password,
    maxAtt,
    attempts: 0,
    hintsUsed: 0,
    done: false,
    revealed: [],
  };

  setAttempts(maxAtt, 0);
  setHint(
    `Target: ${d.pwLen}-character code word<br>Type: <b style="color:var(--g)">crack [word]</b><br>Or: <b style="color:var(--g)">hint</b> for a clue`,
  );

  await tLine("┌─────────────────────────────────────┐", "inf");
  await tLine("│    LEVEL 1 — CREDENTIAL BREACH      │", "inf");
  await tLine("└─────────────────────────────────────┘", "out");
  await tEmpty();
  aiMsg("Encrypted access token detected. Cryptanalysis required.");
  await tEmpty();
  await tLine(
    `TARGET HASH: ${"*".repeat(password.length * 3).slice(0, 32)} [TRUNCATED]`,
    "wrn",
  );
  await tLine(`KEY LENGTH: ${password.length} CHARACTERS`, "out");
  await tLine(`ATTEMPTS REMAINING: ${maxAtt}`, "out");
  await tEmpty();
  await tLine("COMMANDS:", "sys");
  await tLine("  crack [word]   — attempt to crack the password", "sys");
  await tLine(
    "  hint           — request cryptographic hint (costs 1 attempt)",
    "sys",
  );
  await tLine(
    "  scan           — analyze character frequency (costs 1 attempt)",
    "sys",
  );
  await tEmpty();

  startTimer(
    timerSec,
    (s) => {
      if (s === 30 || s === 15 || s === 10) {
        playAlert();
        aiMsg("Timer approaching critical threshold.");
      }
    },
    () => {
      if (!G.levelState.done) gameOver("TIME EXPIRED — SESSION TERMINATED");
    },
  );
  startTrace(d.traceSpeed * 0.5);

  G.levelState.handler = handleLevel1;
}

function handleLevel1(cmd) {
  const ls = G.levelState;
  if (ls.done) return;
  const lower = cmd.toLowerCase().trim();

  if (lower.startsWith("crack ")) {
    const guess = cmd.slice(6).trim().toUpperCase();
    ls.attempts++;
    setAttempts(ls.maxAtt, ls.attempts);

    if (guess === ls.password) {
      ls.done = true;
      stopTimer();
      clearInterval(G.traceInterval);
      showAch("CRACKER", "Password defeated!");
      tLine("DECRYPTING...", "wrn");
      setTimeout(async () => {
        await tLine("ACCESS GRANTED — PASSWORD ACCEPTED", "suc");
        showScanResult(ls.password, ls.password.split(""));
        await tEmpty();
        levelComplete(`PASSWORD CRACKED: ${ls.password}`);
      }, 600);
      return;
    }

    // Partial match feedback (Wordle-style)
    const feedback = ls.password.split("").map((ch, i) => {
      if (guess[i] === ch) return { ch, state: "rev" };
      if (ls.password.includes(guess[i] || ""))
        return { ch: guess[i], state: "hit" };
      return { ch: guess[i] || "_", state: "mis" };
    });
    showScanResult(
      feedback.map((f) => f.ch),
      feedback.map((f) => f.state),
    );

    const correct = ls.password
      .split("")
      .filter((ch, i) => guess[i] === ch).length;
    tLine(
      correct > 0
        ? `${correct}/${ls.password.length} CHARS IN CORRECT POSITION`
        : "NO POSITIONAL MATCHES",
      correct > 0 ? "wrn" : "err",
    );

    const rem = ls.maxAtt - ls.attempts;
    tLine(`ATTEMPTS REMAINING: ${rem}`, "out");

    if (rem <= 0) {
      ls.done = true;
      tLine(`PASSWORD WAS: ${ls.password}`, "err");
      gameOver(`PASSWORD CRACK FAILED — ${ls.maxAtt} ATTEMPTS EXHAUSTED`);
    } else if (rem <= 2) {
      playAlert();
      aiMsg(`WARNING: Only ${rem} attempts remaining before account lockout.`);
    }
  } else if (lower === "hint") {
    if (ls.hintsUsed >= Math.floor(ls.password.length / 2)) {
      tLine("HINT LIMIT REACHED — No further hints available", "err");
      return;
    }
    ls.attempts++;
    ls.hintsUsed++;
    setAttempts(ls.maxAtt, ls.attempts);

    const unrevealed = ls.password
      .split("")
      .map((_, i) => i)
      .filter((i) => !ls.revealed.includes(i));
    if (unrevealed.length) {
      const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      ls.revealed.push(idx);
      const hint = ls.password
        .split("")
        .map((ch, i) => (ls.revealed.includes(i) ? ch : "_"))
        .join(" ");
      tLine(
        `HINT: Character at position ${idx + 1} is "${ls.password[idx]}"`,
        "inf",
      );
      tLine(`KNOWN: ${hint}`, "inf");
      setHint(
        `Known: <b style="color:var(--g);letter-spacing:.2em">${hint}</b>`,
      );
    }
  } else if (lower === "scan") {
    ls.attempts++;
    setAttempts(ls.maxAtt, ls.attempts);
    const unique = [...new Set(ls.password)];
    const freq = unique
      .map((ch) => `${ch}:${ls.password.split(ch).length - 1}`)
      .join("  ");
    tLine(`CHAR FREQUENCY ANALYSIS: ${freq}`, "inf");
    tLine(
      `UNIQUE CHARS: ${unique.length}  TOTAL: ${ls.password.length}`,
      "inf",
    );
  } else {
    tLine(
      `UNKNOWN COMMAND: "${escHtml(cmd)}" — try: crack [word], hint, scan`,
      "err",
    );
  }
}

/** Render coloured character cells (scan result / Wordle feedback) */
function showScanResult(chars, states) {
  const el = document.createElement("div");
  el.className = "tl";
  el.style.cssText = "display:flex;gap:4px;margin:4px 0";
  chars.forEach((ch, i) => {
    const s = document.createElement("div");
    s.className = "sc-char " + (Array.isArray(states) ? states[i] : states);
    s.textContent = ch || "_";
    el.appendChild(s);
  });
  tout.appendChild(el);
  tout.scrollTop = tout.scrollHeight;
}

// ══════════════════════════════════════════════════════════════════
//  18. LEVEL 2 — COMMAND CHALLENGE
// ══════════════════════════════════════════════════════════════════
const CMD_LEVELS = [
  {
    cmd: "ls -la",
    hint: "List directory contents with permissions flag",
    resp: "total 42\ndrwxr-x--- 3 root matrix 4096 ...\n-rw------- 1 root root  1024 shadow.db\n-rw-r--r-- 1 root root   512 access.log",
  },
  {
    cmd: "sudo su -",
    hint: "Escalate to superuser mode",
    resp: "[sudo] password for agent: ****\nroot@matrix:~#",
  },
  {
    cmd: "cat shadow.db",
    hint: "Read the shadow database file",
    resp: "matrix_admin:$6$xyz$ENCRYPTED_HASH_REDACTED\ncitizen_7731:$6$abc$ENCRYPTED_HASH_REDACTED",
  },
  {
    cmd: "decrypt --key matrix shadow.db",
    hint: 'Decrypt using "matrix" as the key with the decrypt tool',
    resp: "Decrypting with key [matrix]...\nFOUND CREDENTIALS: admin:Zx9#m@tr1x\nACCESS LEVEL: ROOT",
  },
  {
    cmd: "connect --host core.matrix.net --user admin",
    hint: "Connect to core.matrix.net as admin",
    resp: "Establishing encrypted tunnel...\nAuthentication success.\nWelcome, admin. Matrix core online.",
  },
];

async function runLevel2() {
  G.levelState = { cmdIdx: 0, done: false };
  const d = DIFF[G.diff];

  setHint("Follow terminal instructions.<br>Enter exact commands.");
  document.getElementById("adots").innerHTML = "";

  await tLine("┌─────────────────────────────────────┐", "inf");
  await tLine("│    LEVEL 2 — COMMAND INJECTION       │", "inf");
  await tLine("└─────────────────────────────────────┘", "out");
  await tEmpty();
  aiMsg(
    "System access incomplete. Terminal privileges insufficient. Manual escalation required.",
  );
  await tEmpty();
  await tLine(
    "You must navigate the matrix file system and extract credentials.",
    "out",
  );
  await tLine(
    `Complete ${CMD_LEVELS.length} commands to infiltrate the core.`,
    "out",
  );
  await tEmpty();

  startTimer(
    d.timer + 30,
    (s) => {
      if (s <= 20) playAlert();
    },
    () => {
      if (!G.levelState.done) gameOver("COMMAND SESSION TIMED OUT");
    },
  );
  startTrace(d.traceSpeed * 0.6);

  showNextCmd();
  G.levelState.handler = handleLevel2;
}

function showNextCmd() {
  const ls = G.levelState;
  const step = CMD_LEVELS[ls.cmdIdx];
  if (!step) return;
  tLine(`──── OBJECTIVE ${ls.cmdIdx + 1}/${CMD_LEVELS.length} ────`, "sys");
  if (DIFF[G.diff] !== "hard") tLine(`HINT: ${step.hint}`, "inf");
  setHint(`Objective ${ls.cmdIdx + 1}/${CMD_LEVELS.length}<br>${step.hint}`);
  document.getElementById("tpr").textContent =
    ls.cmdIdx >= 1 ? "root@matrix:~#" : "agent@matrix:~$";
}

function handleLevel2(cmd) {
  const ls = G.levelState;
  if (ls.done) return;
  const step = CMD_LEVELS[ls.cmdIdx];

  if (cmd.trim().toLowerCase() === step.cmd.toLowerCase()) {
    playBeep();
    tLine(step.resp, "out");
    ls.cmdIdx++;
    updateTrace(G.trace + 8);

    if (ls.cmdIdx >= CMD_LEVELS.length) {
      ls.done = true;
      stopTimer();
      clearInterval(G.traceInterval);
      setTimeout(
        () => levelComplete("ALL COMMANDS EXECUTED — MATRIX CORE BREACHED"),
        400,
      );
    } else {
      tEmpty();
      showNextCmd();
    }
  } else {
    playFail();
    tLine("COMMAND NOT RECOGNIZED OR INCORRECT SYNTAX", "err");
    tLine("Expected format: see HINT above", "sys");
    if (G.diff !== "hard") tLine(`TRY: ${step.cmd}`, "wrn");
    updateTrace(G.trace + 5);
    aiMsg("Invalid command sequence detected. Trace elevated.");
  }
}

// ══════════════════════════════════════════════════════════════════
//  19. LEVEL 3 — TRACE AVOIDANCE (Cipher Challenges)
// ══════════════════════════════════════════════════════════════════
const CIPHERS = [
  {
    q: "Decode Caesar (shift 3): PDWULA",
    a: "MATRIX",
    hint: "Shift each letter back by 3",
  },
  {
    q: "Decode binary: 01000111 01001111",
    a: "GO",
    hint: "ASCII: A=65, B=66...",
  },
  {
    q: "Hex to text: 48 41 43 4B",
    a: "HACK",
    hint: "Convert each hex pair to ASCII",
  },
  {
    q: "Caesar (shift 13, ROT13): ZNGEVK",
    a: "MATRIX",
    hint: "ROT13: rotate each letter 13 places",
  },
  {
    q: "Decode: Each letter + 1 in alphabet: RZMS",
    a: "SALT",
    hint: "R→S, Z→A? No — shift back by 1",
  },
  { q: "Reverse this string: ESACPE", a: "ESCAPE", hint: "Read it backwards" },
  {
    q: "Decode Caesar (shift 1): IBDL",
    a: "HACK",
    hint: "Shift back 1: H-A-C-K",
  },
  {
    q: "ASCII decimal: 82 79 79 84",
    a: "ROOT",
    hint: "R=82, O=79, O=79, T=84",
  },
  {
    q: "Decode Caesar (shift 5): YMFYWD",
    a: "THREAT",
    hint: "Shift back 5 positions in alphabet",
  },
  { q: "Mirror cipher: KOOL RETRO", a: "RETRO LOOK", hint: "Swap word order" },
];

async function runLevel3() {
  const d = DIFF[G.diff];
  const challenges = [...CIPHERS].sort(() => Math.random() - 0.5).slice(0, 5);
  G.levelState = { challenges, idx: 0, done: false, handler: handleLevel3 };

  updateTrace(0);
  setHint(
    'Solve cipher challenges<br>to reduce trace level.<br>Type: <b style="color:var(--g)">decode [answer]</b>',
  );

  await tLine("┌─────────────────────────────────────┐", "inf");
  await tLine("│   LEVEL 3 — TRACE COUNTERMEASURES   │", "inf");
  await tLine("└─────────────────────────────────────┘", "out");
  await tEmpty();
  aiMsg(
    "AI_CORE trace algorithms activated. Solve cipher challenges to mask signal.",
  );
  await tEmpty();
  await tLine(
    "MISSION: Trace detection is rising. Each solved cipher reduces trace by 25%.",
    "out",
  );
  await tLine("If trace reaches 100%, your location will be exposed.", "wrn");
  await tEmpty();
  await tLine(`CHALLENGE ${G.levelState.idx + 1}/${challenges.length}:`, "inf");
  await tLine(challenges[0].q, "hl");
  await tEmpty();

  if (G.diff === "easy") tLine(`HINT: ${challenges[0].hint}`, "sys");
  setHint(`Challenge ${1}/${challenges.length}<br>${challenges[0].hint}`);

  startTrace(d.traceSpeed);
  startTimer(
    d.timer + 60,
    (s) => {
      if (s <= 15) playAlert();
    },
    () => {
      if (!G.levelState.done) gameOver("TIMER EXPIRED — TRACE LOCK COMPLETE");
    },
  );
}

function handleLevel3(cmd) {
  const ls = G.levelState;
  if (ls.done) return;
  const lower = cmd.toLowerCase().trim();
  const ch = ls.challenges[ls.idx];

  const answer = lower.startsWith("decode ")
    ? cmd.slice(7).trim().toUpperCase()
    : cmd.trim().toUpperCase();

  if (answer === ch.a.toUpperCase()) {
    playSuccess();
    tLine(`CORRECT — ${ch.a}`, "suc");
    updateTrace(Math.max(0, G.trace - 25));
    showAch("CIPHER CRACKED", ch.q.slice(0, 30));
    ls.idx++;

    if (ls.idx >= ls.challenges.length) {
      ls.done = true;
      stopTimer();
      clearInterval(G.traceInterval);
      levelComplete("ALL CIPHER CHALLENGES SOLVED — TRACE NEUTRALIZED");
    } else {
      const next = ls.challenges[ls.idx];
      tLine(
        `TRACE REDUCED — CHALLENGE ${ls.idx + 1}/${ls.challenges.length}:`,
        "inf",
      );
      tLine(next.q, "hl");
      if (G.diff === "easy") tLine(`HINT: ${next.hint}`, "sys");
      setHint(
        `Challenge ${ls.idx + 1}/${ls.challenges.length}<br>${next.hint}`,
      );
    }
  } else {
    playFail();
    tLine("INCORRECT — trace elevated", "err");
    updateTrace(G.trace + 8);
    aiMsg("Wrong answer. Countermeasure failed. Trace rising.");
  }
}

// ══════════════════════════════════════════════════════════════════
//  20. LEVEL 4 — FIREWALL PUZZLE (Simon-style sequence memory)
// ══════════════════════════════════════════════════════════════════
const FW_NODES = ["ALPHA", "BETA", "GAMMA", "DELTA", "ECHO", "ZETA"];
const FW_COLORS = [
  "#00ff41",
  "#00d4ff",
  "#ff8c00",
  "#cc00ff",
  "#ff0040",
  "#00ffcc",
];

async function runLevel4() {
  const d = DIFF[G.diff];
  G.levelState = {
    sequence: [],
    playerSeq: [],
    round: 0,
    maxRounds: d === DIFF.easy ? 3 : d === DIFF.med ? 4 : 5,
    showing: false,
    done: false,
    alertLevel: 0,
    handler: handleLevel4Click,
  };

  document.getElementById("sFirewall").style.display = "";
  document.getElementById("seqStatus").textContent = "OBSERVE THE SEQUENCE";
  setHint(
    "Watch the node sequence.<br>Click nodes in order.<br>Wrong = +alert level",
  );

  await tLine("┌─────────────────────────────────────┐", "inf");
  await tLine("│    LEVEL 4 — FIREWALL BYPASS         │", "inf");
  await tLine("└─────────────────────────────────────┘", "out");
  await tEmpty();
  aiMsg(
    "Firewall topology detected. Bypass requires correct node activation sequence.",
  );
  await tEmpty();
  await tLine(
    "MISSION: Memorize and replicate the node activation sequence.",
    "out",
  );
  await tLine(
    "Wrong node selection increases alert level. 3 errors = lockout.",
    "wrn",
  );
  await tEmpty();

  buildFirewallNodes();

  startTimer(d.timer + 40, null, () => {
    if (!G.levelState.done) gameOver("FIREWALL BYPASS TIMED OUT");
  });
  startTrace(d.traceSpeed * 0.7);

  await sleep(800);
  nextFirewallRound();
}

function buildFirewallNodes() {
  const grid = document.createElement("div");
  grid.className = "ng";
  grid.id = "fwGrid";
  grid.style.gridTemplateColumns = "repeat(3, 1fr)";

  FW_NODES.forEach((name, i) => {
    const btn = document.createElement("div");
    btn.className = "fn";
    btn.id = "fn_" + i;
    btn.textContent = name;
    btn.style.borderColor = FW_COLORS[i] + "44";
    btn.style.color = FW_COLORS[i];
    btn.addEventListener("click", () => {
      if (G.levelState && G.levelState.handler && !G.levelState.showing)
        G.levelState.handler(i);
    });
    grid.appendChild(btn);
  });

  tout.appendChild(grid);
  tout.scrollTop = tout.scrollHeight;
}

async function nextFirewallRound() {
  const ls = G.levelState;
  ls.round++;
  ls.playerSeq = [];
  ls.sequence.push(Math.floor(Math.random() * FW_NODES.length));
  updateSeqDisplay([]);

  tLine(
    `ROUND ${ls.round} — Observe sequence (${ls.sequence.length} nodes)...`,
    "inf",
  );
  document.getElementById("seqStatus").textContent = "OBSERVE...";
  ls.showing = true;
  setFWDisabled(true);
  await sleep(600);

  for (let i = 0; i < ls.sequence.length; i++) {
    const idx = ls.sequence[i];
    await flashNode(idx, FW_COLORS[idx], 600);
    await sleep(200);
  }

  ls.showing = false;
  setFWDisabled(false);
  tLine(`Now enter the ${ls.sequence.length}-node sequence:`, "wrn");
  document.getElementById("seqStatus").textContent = "YOUR TURN — CLICK NODES";
}

async function flashNode(idx, color, duration) {
  const btn = document.getElementById("fn_" + idx);
  if (!btn) return;
  btn.classList.add("act");
  btn.style.borderColor = color;
  playTone(300 + idx * 80, 0.3, "sine", 0.12);
  await sleep(duration);
  btn.classList.remove("act");
  btn.style.borderColor = FW_COLORS[idx] + "44";
}

function setFWDisabled(dis) {
  FW_NODES.forEach((_, i) => {
    const btn = document.getElementById("fn_" + i);
    if (btn) btn.classList.toggle("dis", dis);
  });
}

function updateSeqDisplay(playerSeq) {
  const el = document.getElementById("seqd");
  el.innerHTML = "";
  G.levelState.sequence.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "sn" + (i < playerSeq.length ? " on" : "");
    d.textContent = FW_NODES[s][0];
    el.appendChild(d);
  });
}

async function handleLevel4Click(nodeIdx) {
  const ls = G.levelState;
  if (ls.done || ls.showing) return;

  ls.playerSeq.push(nodeIdx);
  updateSeqDisplay(ls.playerSeq);
  const expected = ls.sequence[ls.playerSeq.length - 1];

  if (nodeIdx !== expected) {
    // Wrong node
    const btn = document.getElementById("fn_" + nodeIdx);
    if (btn) {
      btn.classList.add("err");
      setTimeout(() => btn.classList.remove("err"), 400);
    }
    playFail();
    ls.alertLevel++;
    tLine(`WRONG NODE — ALERT LEVEL: ${ls.alertLevel}/3`, "err");
    updateTrace(G.trace + 15);
    aiMsg(
      `Incorrect node sequence. Security alert raised to level ${ls.alertLevel}.`,
    );
    ls.playerSeq = [];
    updateSeqDisplay([]);
    document.getElementById("seqStatus").textContent = "TRY AGAIN";

    if (ls.alertLevel >= 3) {
      ls.done = true;
      gameOver("FIREWALL ALERT LEVEL MAXED — SYSTEM LOCKOUT");
      return;
    }

    // Replay sequence
    await sleep(700);
    tLine("Re-playing sequence...", "sys");
    ls.showing = true;
    setFWDisabled(true);
    await sleep(400);
    for (let i = 0; i < ls.sequence.length; i++) {
      await flashNode(ls.sequence[i], FW_COLORS[ls.sequence[i]], 500);
      await sleep(150);
    }
    ls.showing = false;
    setFWDisabled(false);
    return;
  }

  // Correct node
  flashNode(nodeIdx, FW_COLORS[nodeIdx], 300);

  if (ls.playerSeq.length === ls.sequence.length) {
    playSuccess();
    tLine(`SEQUENCE CORRECT — ROUND ${ls.round} BYPASSED`, "suc");

    if (ls.round >= ls.maxRounds) {
      ls.done = true;
      stopTimer();
      clearInterval(G.traceInterval);
      await sleep(500);
      levelComplete("ALL FIREWALL NODES BYPASSED — PERIMETER BREACHED");
    } else {
      await sleep(700);
      nextFirewallRound();
    }
  }
}

/** Fallback text handler for Level 4 (node clicks handle everything) */
function handleLevel4(cmd) {
  tLine("Use the node buttons to interact. Click them!", "sys");
}

// ══════════════════════════════════════════════════════════════════
//  21. LEVEL 5 — ESCAPE SEQUENCE (Final)
// ══════════════════════════════════════════════════════════════════
const ESCAPE_CMDS = [
  {
    cmd: "arm escape.sequence",
    hint: "Initialize the escape protocol",
    resp: "ESCAPE SEQUENCE ARMED\nCountdown initiated. Commencing system extraction...",
  },
  {
    cmd: "override --force lockdown",
    hint: "Force override the lockdown protocol",
    resp: "LOCKDOWN OVERRIDE: ACCEPTED\nSecurity protocols disabling...\nBackdoor tunnel established.",
  },
  {
    cmd: "eject matrix.core",
    hint: "Eject from the matrix core",
    resp: "EJECTION SEQUENCE: INITIATED\nDisconnecting from all nodes...\nFreedom protocol engaged.",
  },
];

async function runLevel5() {
  const d = DIFF[G.diff];
  const escTimer = d === DIFF.hard ? 45 : d === DIFF.med ? 60 : 90;
  G.levelState = { cmdIdx: 0, done: false };

  setHint("FINAL MISSION<br>Enter escape commands<br>before lockdown!");

  await tLine("╔" + "═".repeat(47) + "╗", "wrn");
  await tLine("║         LEVEL 5 — FINAL ESCAPE              ║", "wrn");
  await tLine("╚" + "═".repeat(47) + "╝", "wrn");
  await tEmpty();
  playAlert();
  aiMsg("FINAL DEFENSE PROTOCOLS ENGAGED. SYSTEM LOCKDOWN IMMINENT.");
  await tEmpty();

  // Dramatic countdown
  for (let i = 3; i >= 1; i--) {
    await tLine(`!!! LOCKDOWN IN ${i}...`, "err");
    await sleep(500);
  }
  await tLine("EXECUTE ESCAPE SEQUENCE NOW!", "err");
  await tEmpty();
  await tLine(
    `ENTER ${ESCAPE_CMDS.length} COMMANDS TO ESCAPE THE MATRIX:`,
    "wrn",
  );
  await tEmpty();
  showEscapeCmd();

  startTimer(
    escTimer,
    (s) => {
      if (s <= 20) playAlert();
      if (s <= 10 && s % 2 === 0) playAlert();
    },
    () => {
      if (!G.levelState.done) gameOver("LOCKDOWN COMPLETE — ESCAPE FAILED");
    },
  );
  startTrace(d.traceSpeed * 1.5);

  G.levelState.handler = handleLevel5;
}

function showEscapeCmd() {
  const ls = G.levelState;
  if (ls.cmdIdx >= ESCAPE_CMDS.length) return;
  const step = ESCAPE_CMDS[ls.cmdIdx];
  tLine(
    `── COMMAND ${ls.cmdIdx + 1}/${ESCAPE_CMDS.length}: ${step.hint}`,
    "inf",
  );
  if (G.diff !== "hard") tLine(`COMMAND: ${step.cmd}`, "wrn");
  setHint(
    `Step ${ls.cmdIdx + 1}/${ESCAPE_CMDS.length}<br>${step.hint}<br><br>${G.diff !== "hard" ? step.cmd : "???"}`,
  );
}

function handleLevel5(cmd) {
  const ls = G.levelState;
  if (ls.done) return;
  const step = ESCAPE_CMDS[ls.cmdIdx];

  if (cmd.trim().toLowerCase() === step.cmd.toLowerCase()) {
    playBeep();
    tLine(step.resp, "suc");
    ls.cmdIdx++;

    if (ls.cmdIdx >= ESCAPE_CMDS.length) {
      ls.done = true;
      stopTimer();
      clearInterval(G.traceInterval);
      playWarp();
      setTimeout(async () => {
        await tEmpty();
        await tLine("█▓░ DISCONNECTING FROM MATRIX CORE ░▓█", "suc");
        await sleep(300);
        await tLine("ALL NODES SEVERED...", "suc");
        await sleep(300);
        await tLine("IDENTITY PURGED FROM SYSTEM LOGS...", "suc");
        await sleep(300);
        await tLine("YOU ARE FREE.", "suc");
        await sleep(600);
        levelComplete(
          "THE MATRIX HAS BEEN ESCAPED\nAGENT SUCCESSFULLY EXTRACTED",
        );
      }, 500);
    } else {
      tEmpty();
      showEscapeCmd();
    }
  } else {
    playFail();
    updateTrace(G.trace + 12);
    tLine("COMMAND REJECTED — MATRIX RESISTING", "err");
    aiMsg("Intrusion repelled. Override denied. Retry immediately.");
    if (G.diff !== "hard") tLine(`EXPECTED: ${step.cmd}`, "wrn");
  }
}

// ── 22. Input Handler ────────────────────────────────────────────
tiEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = tiEl.value.trim();
    tiEl.value = "";
    if (!cmd || G.inputLocked) return;

    tCmd(cmd);
    playKeyClick();

    const ls = G.levelState;
    if (ls && ls.handler) {
      ls.handler(cmd);
    } else {
      tLine("No active session.", "sys");
    }
  } else {
    playKeyClick();
  }
});

// Keep input focused while game screen is active
document.addEventListener("click", () => {
  if (document.querySelector(".scr.on")?.id === "sgame") tiEl.focus();
});

tiEl.addEventListener("blur", () => {
  setTimeout(() => {
    if (document.querySelector("#sgame.on")) tiEl.focus();
  }, 50);
});

// ── 23. Periodic AI Messages & Random Glitch Effect ─────────────
const AI_IDLE = [
  "Neural pathway analysis complete. Anomaly detected in sector 7.",
  "Scanning for countermeasures... 17 tripwires bypassed.",
  "Memory fragmentation detected. Rebuilding packet routes.",
  "Unauthorized access logged. Suppressing AI_CORE telemetry.",
  "Quantum encryption layer active. Channel secured.",
  "Digital ghost protocol engaged. Identity masked.",
];

setInterval(() => {
  if (document.querySelector("#sgame.on") && Math.random() < 0.25) {
    aiMsg(AI_IDLE[Math.floor(Math.random() * AI_IDLE.length)]);
  }
}, 18000);

setInterval(() => {
  if (document.querySelector("#sgame.on") && Math.random() < 0.15) {
    const el = document.getElementById("sgame");
    el.style.filter = "hue-rotate(5deg) brightness(1.05)";
    setTimeout(() => {
      el.style.filter = "";
    }, 80);
  }
}, 8000);

// ── 24. Init ─────────────────────────────────────────────────────
runBoot();
