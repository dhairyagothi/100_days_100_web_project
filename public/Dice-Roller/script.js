// Pip positions for each face value
const PIP_LAYOUTS = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 25],
    [72, 25],
    [28, 50],
    [72, 50],
    [28, 75],
    [72, 75],
  ],
};

function buildDiceSVG(value, color) {
  const isDark = document.documentElement.dataset.theme === "dark";
  // Always show the chosen pastel color as the face — dark or light
  const face = value ? color || "#ffffff" : isDark ? "#2a2a2a" : "#f0f0f0";
  const stroke = isDark ? "#555" : "#bbbbbb";
  // Pips: always dark so they show on the pastel background
  const pip = "#222222";
  const pips = value
    ? (PIP_LAYOUTS[value] || [])
        .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="7" fill="${pip}"/>`)
        .join("")
    : `<text x="50" y="56" text-anchor="middle" font-size="30" fill="${
        isDark ? "#555" : "#ccc"
      }" font-family="sans-serif">?</text>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="94" height="94" rx="16" ry="16"
                    fill="${face}" stroke="${stroke}" stroke-width="3"/>
                ${pips}
            </svg>`;
}

// ── State ──
const state = {
  diceCount: 1,
  diceColor: "#FFB3BA",
  isRolling: false,
  soundEnabled: true,
  rolls: [],
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

const soundSingle = document.getElementById("soundSingle");
const soundMulti = document.getElementById("soundMulti");

function playDiceSound(count) {
  if (!state.soundEnabled) return;
  // 1 die → single roll sound; 2-10 dice → multi-dice sound
  const audio = count === 1 ? soundSingle : soundMulti;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ── Theme toggle ──
document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  document.getElementById("themeToggle").textContent = isDark ? "🌙" : "☀️";
  renderDice();
});

// ── Dice count ──
document.getElementById("diceCount").addEventListener("change", (e) => {
  const error = document.getElementById("diceError");
  const value = parseInt(e.target.value, 10);

  if (value > 10) {
    error.textContent = "Maximum dice count is 10.";
    e.target.value = state.diceCount;
    return;
  }
  if (value < 1) {
    error.textContent = "Please enter a value between 1 and 10.";
    e.target.value = state.diceCount;
    return;
  }

  error.textContent = "";
  state.diceCount = value;
  state.rolls = [];
  renderDice();
});

// ── Colour picker ──
document.querySelectorAll(".color-option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document
      .querySelectorAll(".color-option")
      .forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    state.diceColor = opt.dataset.color;
    renderDice();
  });
});

// ── Sound toggle ──
document.getElementById("soundToggle").addEventListener("click", () => {
  state.soundEnabled = !state.soundEnabled;
  document.getElementById("soundToggle").textContent = state.soundEnabled
    ? "🔊"
    : "🔇";
});

// ── Reset ──
document.getElementById("resetBtn").addEventListener("click", () => {
  state.rolls = [];
  state.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  updateStats();
  renderDice();
  const rm = document.getElementById("resultMessage");
  rm.classList.remove("show");
  rm.textContent = "";
});

// ── Roll ──
document.getElementById("rollBtn").addEventListener("click", rollDice);

function renderDice() {
  const display = document.getElementById("diceDisplay");
  display.innerHTML = "";
  for (let i = 0; i < state.diceCount; i++) {
    const wrap = document.createElement("div");
    wrap.className = "dice-wrap";
    wrap.id = `dice-${i}`;
    wrap.innerHTML = buildDiceSVG(state.rolls[i] || null, state.diceColor);
    display.appendChild(wrap);
  }
}

function rollDice() {
  if (state.isRolling) return;
  state.isRolling = true;
  document.getElementById("rollBtn").disabled = true;

  const rm = document.getElementById("resultMessage");
  rm.classList.remove("show");

  renderDice();

  const wraps = document.querySelectorAll(".dice-wrap");
  wraps.forEach((w) => {
    w.classList.remove("rolling");
    void w.offsetWidth;
    w.classList.add("rolling");
  });

  playDiceSound(state.diceCount);

  setTimeout(() => {
    const newRolls = [];
    let total = 0;
    wraps.forEach((wrap) => {
      const r = Math.floor(Math.random() * 6) + 1;
      newRolls.push(r);
      total += r;
      state.distribution[r]++;
      wrap.innerHTML = buildDiceSVG(r, state.diceColor);
    });
    state.rolls = newRolls;
    updateStats();

    rm.textContent =
      newRolls.length === 1
        ? `You rolled a ${newRolls[0]}!`
        : `Rolled: ${newRolls.join(", ")}  —  Total: ${total}`;
    void rm.offsetWidth;
    rm.classList.add("show");

    state.isRolling = false;
    document.getElementById("rollBtn").disabled = false;
  }, 650);
}

// ── Tally mark SVG builder ──────────────────────────────────────────────────
// Renders count % 10 as classic tally marks (groups of 5 with diagonal cross).
// Returns an SVG string sized to fit the marks.
function buildTallySVG(count) {
  const n = count % 10;
  if (n === 0) return '<span class="dist-zero">—</span>';

  const lines = [];
  const y1 = 3,
    y2 = 25; // top / bottom of each vertical stroke
  const sp = 8; // spacing between strokes
  let x = 6;

  const fives = Math.floor(n / 5);
  const remainder = n % 5;

  // Draw complete groups of 5
  for (let g = 0; g < fives; g++) {
    const gx = x;
    for (let i = 0; i < 4; i++) {
      lines.push(
        `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke-width="2" stroke-linecap="round"/>`
      );
      x += sp;
    }
    // diagonal cross-stroke
    lines.push(
      `<line x1="${gx - 3}" y1="${y2 + 3}" x2="${x + 1}" y2="${y1 - 3}" stroke-width="2" stroke-linecap="round"/>`
    );
    x += 10; // gap after the group
  }

  // Draw leftover individual marks
  for (let i = 0; i < remainder; i++) {
    lines.push(
      `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke-width="2" stroke-linecap="round"/>`
    );
    x += sp;
  }

  const w = x + 4;
  return `<svg viewBox="0 0 ${w} 30" width="${w}" height="28" style="overflow:visible">${lines.join(
    ""
  )}</svg>`;
}

function updateStats() {
  const n = state.rolls.length;
  const sum = state.rolls.reduce((a, b) => a + b, 0);
  document.getElementById("totalRolls").textContent = n;
  document.getElementById("avgRoll").textContent = n
    ? (sum / n).toFixed(2)
    : "0";
  document.getElementById("minRoll").textContent = n
    ? Math.min(...state.rolls)
    : "—";
  document.getElementById("maxRoll").textContent = n
    ? Math.max(...state.rolls)
    : "—";

  const dist = document.getElementById("distribution");
  dist.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    dist.innerHTML += `<div class="dist-item">
                    <div class="dist-number">${i}</div>
                    <div class="dist-tally">${buildTallySVG(
                      state.distribution[i]
                    )}</div>
                </div>`;
  }
}

renderDice();
updateStats();
