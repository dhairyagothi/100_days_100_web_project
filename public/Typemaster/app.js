'use strict';

// ══════════════════════════════════════════════════════════
//  PROMPT BANKS
//  Organised by mode → difficulty → array of prompt strings
// ══════════════════════════════════════════════════════════
const BANKS = {
  words: {
    easy: [
      'the quick brown fox jumped over the lazy dog and then ran away into the forest',
      'practice makes perfect so keep on typing every single day without stopping',
      'a journey of a thousand miles begins with a single step forward into the unknown',
      'all that glitters is not gold but it shines brightly in the morning sun',
    ],
    medium: [
      'sphinx of black quartz judge my vow and the five boxing wizards jump quickly over',
      'how vexingly quick daft zebras jump over the lazy brown fox near the big river',
      'pack my box with five dozen liquor jugs and send them all to the warehouse today',
      'the early bird catches the worm but the second mouse gets the cheese every time',
    ],
    hard: [
      'exquisitely crafted mechanisms utilize sophisticated algorithms for optimization processes',
      'cryptographically secure pseudorandom number generators withstand adversarial scrutiny',
      'the juxtaposition of contradictory philosophical paradigms elucidates epistemic complexity',
      'extraordinarily ambitious entrepreneurs systematically disrupt entrenched bureaucratic systems',
    ],
  },
  sentences: {
    easy: [
      'She sells sea shells by the sea shore. The shells she sells are surely sea shells.',
      'Peter Piper picked a peck of pickled peppers. How many pickled peppers did Peter Piper pick?',
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood all day long?',
    ],
    medium: [
      'Betty Botter bought some butter but the butter Betty Botter bought was a bit bitter.',
      'The six sick hicks nick six slick bricks with picks and sticks on the thick, slick bricks.',
      'Whether the weather be fine or whether the weather be not, we will weather the weather.',
    ],
    hard: [
      'Six slippery snails slid slowly seaward. She sees cheese. Truly rural, truly rural.',
      'Brisk brave brigadiers brandished broad bright blades, blunderbusses, and bludgeons.',
      'Aluminum, linoleum, molybdenum — how many elements can you type without a single error?',
    ],
  },
  code: {
    easy: [
      'const add = (a, b) => a + b; console.log(add(2, 3));',
      'for (let i = 0; i < 10; i++) { console.log(i * i); }',
      'function greet(name) { return `Hello, ${name}!`; }',
    ],
    medium: [
      'const result = arr.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);',
      'async function fetchData(url) { const res = await fetch(url); return res.json(); }',
      'class Stack { constructor() { this.items = []; } push(x) { this.items.push(x); } }',
    ],
    hard: [
      'const memoize = fn => { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key); }; };',
      'function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length / 2)]; return [...quickSort(arr.filter(x => x < pivot)), ...arr.filter(x => x === pivot), ...quickSort(arr.filter(x => x > pivot))]; }',
    ],
  },
  // Filled at runtime when user enters custom text
  custom: { easy: [], medium: [], hard: [] },
};

// ══════════════════════════════════════════════════════════
//  KEYBOARD LAYOUT DEFINITION
//  Each row is an array of { l (label), k (event.code), c (extra classes), style }
// ══════════════════════════════════════════════════════════
const KB_ROWS = [
  // Function row
  [
    { l: 'Esc', k: 'Escape', c: 'key-esc key-fn-row' },
    {
      l: '',
      k: '',
      c: 'key-fn-row',
      style: 'min-width:20px;background:none;border:none',
    },
    { l: 'F1', k: 'F1', c: 'key-fn-row' },
    { l: 'F2', k: 'F2', c: 'key-fn-row' },
    { l: 'F3', k: 'F3', c: 'key-fn-row' },
    { l: 'F4', k: 'F4', c: 'key-fn-row' },
    {
      l: '',
      k: '',
      c: 'key-fn-row',
      style: 'min-width:12px;background:none;border:none',
    },
    { l: 'F5', k: 'F5', c: 'key-fn-row' },
    { l: 'F6', k: 'F6', c: 'key-fn-row' },
    { l: 'F7', k: 'F7', c: 'key-fn-row' },
    { l: 'F8', k: 'F8', c: 'key-fn-row' },
    {
      l: '',
      k: '',
      c: 'key-fn-row',
      style: 'min-width:12px;background:none;border:none',
    },
    { l: 'F9', k: 'F9', c: 'key-fn-row' },
    { l: 'F10', k: 'F10', c: 'key-fn-row' },
    { l: 'F11', k: 'F11', c: 'key-fn-row' },
    { l: 'F12', k: 'F12', c: 'key-fn-row' },
    { l: 'PrtSc', k: 'PrintScreen', c: 'key-fn-row' },
    { l: 'Scr Lk', k: 'ScrollLock', c: 'key-fn-row' },
    { l: 'Pause', k: 'Pause', c: 'key-fn-row' },
  ],
  // Number row
  [
    { l: '`~', k: 'Backquote' },
    { l: '1!', k: 'Digit1' },
    { l: '2@', k: 'Digit2' },
    { l: '3#', k: 'Digit3' },
    { l: '4$', k: 'Digit4' },
    { l: '5%', k: 'Digit5' },
    { l: '6^', k: 'Digit6' },
    { l: '7&', k: 'Digit7' },
    { l: '8*', k: 'Digit8' },
    { l: '9(', k: 'Digit9' },
    { l: '0)', k: 'Digit0' },
    { l: '-_', k: 'Minus' },
    { l: '=+', k: 'Equal' },
    { l: 'Backspace', k: 'Backspace', c: 'key-bs' },
  ],
  // QWERTY row
  [
    { l: 'Tab', k: 'Tab', c: 'key-tab' },
    { l: 'Q', k: 'KeyQ' },
    { l: 'W', k: 'KeyW' },
    { l: 'E', k: 'KeyE' },
    { l: 'R', k: 'KeyR' },
    { l: 'T', k: 'KeyT' },
    { l: 'Y', k: 'KeyY' },
    { l: 'U', k: 'KeyU' },
    { l: 'I', k: 'KeyI' },
    { l: 'O', k: 'KeyO' },
    { l: 'P', k: 'KeyP' },
    { l: '[{', k: 'BracketLeft' },
    { l: ']}', k: 'BracketRight' },
    { l: '|\\', k: 'Backslash' },
  ],
  // ASDF row
  [
    { l: 'Caps Lock', k: 'CapsLock', c: 'key-caps' },
    { l: 'A', k: 'KeyA' },
    { l: 'S', k: 'KeyS' },
    { l: 'D', k: 'KeyD' },
    { l: 'F', k: 'KeyF' },
    { l: 'G', k: 'KeyG' },
    { l: 'H', k: 'KeyH' },
    { l: 'J', k: 'KeyJ' },
    { l: 'K', k: 'KeyK' },
    { l: 'L', k: 'KeyL' },
    { l: ';:', k: 'Semicolon' },
    { l: '\'"', k: 'Quote' },
    { l: 'Enter', k: 'Enter', c: 'key-enter' },
  ],
  // ZXCV row
  [
    { l: 'Shift', k: 'ShiftLeft', c: 'key-lshift' },
    { l: 'Z', k: 'KeyZ' },
    { l: 'X', k: 'KeyX' },
    { l: 'C', k: 'KeyC' },
    { l: 'V', k: 'KeyV' },
    { l: 'B', k: 'KeyB' },
    { l: 'N', k: 'KeyN' },
    { l: 'M', k: 'KeyM' },
    { l: ',<', k: 'Comma' },
    { l: '.>', k: 'Period' },
    { l: '/?', k: 'Slash' },
    { l: 'Shift', k: 'ShiftRight', c: 'key-rshift' },
  ],
  // Bottom row
  [
    { l: 'Ctrl', k: 'ControlLeft', c: 'key-ctrl' },
    { l: 'Win', k: 'MetaLeft', c: 'key-win' },
    { l: 'Alt', k: 'AltLeft', c: 'key-alt' },
    { l: 'Space', k: 'Space', c: 'key-space' },
    { l: 'Alt', k: 'AltRight', c: 'key-alt' },
    { l: 'Fn', k: 'Fn', c: 'key-alt' },
    { l: 'Menu', k: 'ContextMenu', c: 'key-alt' },
    { l: 'Ctrl', k: 'ControlRight', c: 'key-ctrl' },
  ],
];

// Keys to ignore for game logic (modifiers, navigation, etc.)
const IGNORED_KEYS = new Set([
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
  'CapsLock',
  'Tab',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'PrintScreen',
  'ScrollLock',
  'Pause',
  'Insert',
  'Home',
  'PageUp',
  'Delete',
  'End',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'NumLock',
  'Escape',
  'ContextMenu',
  'Fn',
]);

// ══════════════════════════════════════════════════════════
//  GAME STATE
// ══════════════════════════════════════════════════════════
let promptText = '';
let inputIndex = 0;
let errors = 0;
let totalTyped = 0;
let errorLog = {}; // { eventCode: count }
let wpmMax = 0;
let startTime = null;
let timerInterval = null;
let isRunning = false;
let isFinished = false;
let currentMode = 'words';
let currentDiff = 'easy';
let customText = '';

// ══════════════════════════════════════════════════════════
//  DOM HELPERS
// ══════════════════════════════════════════════════════════
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ══════════════════════════════════════════════════════════
//  BUILD KEYBOARD
//  Dynamically generates the full key layout from KB_ROWS
// ══════════════════════════════════════════════════════════
function buildKeyboard() {
  const kb = $('keyboard');
  kb.innerHTML = '';

  KB_ROWS.forEach((row) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'kb-row';

    row.forEach((k) => {
      if (!k.l && !k.k) return;

      const el = document.createElement('div');
      el.className = 'key ' + (k.c || '');
      if (k.style) el.style.cssText = k.style;
      if (k.k) el.setAttribute('data-key', k.k);
      el.innerHTML = `<span class="key-main">${k.l}</span>`;

      rowDiv.appendChild(el);
    });

    kb.appendChild(rowDiv);
  });
}

// ══════════════════════════════════════════════════════════
//  PROMPT SELECTION
// ══════════════════════════════════════════════════════════
function getPrompt() {
  if (currentMode === 'custom' && customText.trim()) {
    return customText.trim();
  }
  const bank = BANKS[currentMode]?.[currentDiff];
  if (!bank || !bank.length) return BANKS.words.easy[0];
  return bank[Math.floor(Math.random() * bank.length)];
}

// ══════════════════════════════════════════════════════════
//  RENDER PROMPT
//  Splits prompt into individual <span.char> elements
// ══════════════════════════════════════════════════════════
function renderPrompt() {
  const box = $('prompt-box');
  box.innerHTML = '';

  [...promptText].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char pending';
    span.setAttribute('data-i', i);
    span.textContent = ch;
    if (i === 0) span.classList.add('cursor');
    box.appendChild(span);
  });

  $('chars-total').textContent = promptText.length;
  $('chars-done').textContent = '0';
  $('word-progress').textContent =
    `0 / ${promptText.trim().split(/\s+/).length} words`;
  updateProgress();
}

// ══════════════════════════════════════════════════════════
//  INITIALISE / RESET
// ══════════════════════════════════════════════════════════
function init() {
  promptText = getPrompt();
  inputIndex = 0;
  errors = 0;
  totalTyped = 0;
  errorLog = {};
  wpmMax = 0;
  isRunning = false;
  isFinished = false;

  clearInterval(timerInterval);
  startTime = null;

  renderPrompt();
  updateStats(0, null, null);
  updateErrorLogDisplay();
  updateHeatmap();

  $('timer-display').textContent = '00:00';
  $('timer-status').textContent = 'idle';
  $('timer-status').className = 'timer-status idle';
  $('results-panel').style.display = 'none';
  $('progress-bar').style.width = '0%';
  $('prompt-box').focus();
}

// ══════════════════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════════════════
function startTimer() {
  startTime = Date.now();
  isRunning = true;

  $('timer-status').textContent = 'active';
  $('timer-status').className = 'timer-status active';

  timerInterval = setInterval(() => {
    if (!isRunning) return;

    const elapsed = (Date.now() - startTime) / 1000;
    const mm = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, '0');
    const ss = Math.floor(elapsed % 60)
      .toString()
      .padStart(2, '0');
    $('timer-display').textContent = `${mm}:${ss}`;

    computeAndDisplayWPM();
  }, 200);
}

// ══════════════════════════════════════════════════════════
//  WPM CALCULATION
//  Formula: (correctChars / 5) / minutesElapsed
// ══════════════════════════════════════════════════════════
function computeAndDisplayWPM() {
  if (!startTime) return 0;

  const elapsedMin = (Date.now() - startTime) / 1000 / 60;
  if (elapsedMin < 0.005) return 0;

  const correctChars = Math.max(0, inputIndex - errors);
  const wpm = Math.round(correctChars / 5 / elapsedMin);

  if (wpm > wpmMax) wpmMax = wpm;

  updateStats(wpm, null, null);
  return wpm;
}

// ══════════════════════════════════════════════════════════
//  UPDATE STATS DISPLAY
// ══════════════════════════════════════════════════════════
function updateStats(wpm) {
  // WPM
  if (wpm !== null) {
    $('wpm-current').textContent = wpm;
    $('wpm-max').textContent = wpmMax;
    $('wpm-c2').textContent = wpm;
    $('wpm-m2').textContent = wpmMax;
  }

  // Accuracy & error rate
  if (totalTyped > 0) {
    const acc = Math.max(0, ((totalTyped - errors) / totalTyped) * 100).toFixed(
      1
    );
    const errR = ((errors / totalTyped) * 100).toFixed(1);

    $('accuracy-val').textContent = acc;
    $('error-rate').textContent = errR;

    const typos = errors;
    $('accuracy-sub').innerHTML =
      typos === 0
        ? '<span class="badge good">perfect</span>'
        : `<span class="badge">${typos} typo${typos > 1 ? 's' : ''}</span>`;
  } else {
    $('accuracy-val').textContent = '—';
    $('error-rate').textContent = '0.0';
    $('accuracy-sub').innerHTML = '<span class="badge good">perfect</span>';
  }
}

// ══════════════════════════════════════════════════════════
//  HEATMAP — update glow on keys based on error frequency
// ══════════════════════════════════════════════════════════
function updateHeatmap() {
  $$('.key').forEach((k) => k.classList.remove('heat-1', 'heat-2', 'heat-3'));

  Object.entries(errorLog).forEach(([code, count]) => {
    const el = document.querySelector(`.key[data-key="${code}"]`);
    if (!el) return;

    if (count >= 5) el.classList.add('heat-3');
    else if (count >= 3) el.classList.add('heat-2');
    else if (count >= 1) el.classList.add('heat-1');
  });
}

// ══════════════════════════════════════════════════════════
//  ERROR LOG DISPLAY
// ══════════════════════════════════════════════════════════
function updateErrorLogDisplay() {
  const list = $('error-log-list');
  const entries = Object.entries(errorLog).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    list.innerHTML =
      '<span class="err-badge none">No errors yet — keep going!</span>';
    return;
  }

  list.innerHTML = entries
    .map(([code, count]) => {
      const label = humaniseKeyCode(code);
      return `<div class="err-badge">
      <span class="wk-key">${label}</span>
      <span class="wk-count">×${count}</span>
    </div>`;
    })
    .join('');
}

// ══════════════════════════════════════════════════════════
//  PROGRESS BAR + COUNTERS
// ══════════════════════════════════════════════════════════
function updateProgress() {
  const pct = promptText.length ? (inputIndex / promptText.length) * 100 : 0;
  $('progress-bar').style.width = pct + '%';
  $('chars-done').textContent = inputIndex;

  const typedWords = promptText
    .slice(0, inputIndex)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const totalWords = promptText.trim().split(/\s+/).length;
  $('word-progress').textContent = `${typedWords} / ${totalWords} words`;
}

// ══════════════════════════════════════════════════════════
//  CURSOR MANAGEMENT
// ══════════════════════════════════════════════════════════
function updateCursor() {
  $$('.char').forEach((s) => s.classList.remove('cursor'));
  const next = document.querySelector(`.char[data-i="${inputIndex}"]`);
  if (next) next.classList.add('cursor');
}

// ══════════════════════════════════════════════════════════
//  KEY PRESS FLASH ANIMATION
// ══════════════════════════════════════════════════════════
function flashKey(code, isCorrect) {
  const el = document.querySelector(`.key[data-key="${code}"]`);
  if (!el) return;

  el.classList.remove('flash-correct', 'flash-wrong');
  void el.offsetWidth; // force reflow to restart animation

  el.classList.add(isCorrect ? 'flash-correct' : 'flash-wrong');
  setTimeout(() => el.classList.remove('flash-correct', 'flash-wrong'), 280);
}

// ══════════════════════════════════════════════════════════
//  HUMANISE KEY CODE  (for display in logs / results)
// ══════════════════════════════════════════════════════════
function humaniseKeyCode(code) {
  if (code === 'Space') return '␣';
  if (code === 'Backquote') return '`';
  return code
    .replace('Key', '')
    .replace('Digit', '')
    .replace('BracketLeft', '[')
    .replace('BracketRight', ']')
    .replace('Backslash', '\\')
    .replace('Semicolon', ';')
    .replace('Quote', "'")
    .replace('Comma', ',')
    .replace('Period', '.')
    .replace('Slash', '/')
    .replace('Minus', '-')
    .replace('Equal', '=');
}

// ══════════════════════════════════════════════════════════
//  SESSION FINISH
// ══════════════════════════════════════════════════════════
function finish() {
  isRunning = false;
  isFinished = true;
  clearInterval(timerInterval);

  $('timer-status').textContent = 'done';
  $('timer-status').className = 'timer-status done';

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const mm = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(elapsed % 60)
    .toString()
    .padStart(2, '0');
  const finalWPM = computeAndDisplayWPM();
  const acc =
    totalTyped > 0
      ? (((totalTyped - errors) / totalTyped) * 100).toFixed(1)
      : '100.0';

  // Populate results panel
  $('r-wpm').textContent = finalWPM;
  $('r-peak').textContent = wpmMax;
  $('r-acc').textContent = acc + '%';
  $('r-errs').textContent = errors;
  $('r-time').textContent = `${mm}:${ss}`;

  // Motivational comment
  let comment;
  if (finalWPM >= 100)
    comment = '🔥 Blazing fast! You are a true keyboard warrior.';
  else if (finalWPM >= 70)
    comment = '⚡ Excellent speed! Most typists would envy you.';
  else if (finalWPM >= 50)
    comment = '✅ Solid performance! Keep practising to level up.';
  else comment = '🌱 Good effort! Consistency beats speed — keep at it!';
  $('result-comment').textContent = comment;

  // Worst keys list
  const worst = Object.entries(errorLog)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const wkl = $('worst-keys-list');

  if (!worst.length) {
    wkl.innerHTML =
      '<span class="err-badge none" style="background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.2);color:var(--green)">No errors! Perfect run 🎉</span>';
  } else {
    wkl.innerHTML = worst
      .map(([code, count]) => {
        const label = humaniseKeyCode(code);
        return `<div class="worst-key-badge">
        <span class="wk-key">${label}</span>
        <span class="wk-count">${count} error${count > 1 ? 's' : ''}</span>
      </div>`;
      })
      .join('');
  }

  $('results-panel').style.display = 'block';
  $('results-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ══════════════════════════════════════════════════════════
//  KEYBOARD EVENT — KEYDOWN
// ══════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (isFinished) return;

  // Visual key press highlight
  const keyEl = document.querySelector(`.key[data-key="${e.code}"]`);
  if (keyEl) keyEl.classList.add('active');

  // Escape = instant reset
  if (e.code === 'Escape') {
    restart();
    return;
  }

  // Ignore non-typeable keys
  if (IGNORED_KEYS.has(e.code)) return;

  e.preventDefault();

  // ── Backspace: step back one character ──
  if (e.code === 'Backspace') {
    if (inputIndex === 0) return;
    inputIndex--;

    const span = document.querySelector(`.char[data-i="${inputIndex}"]`);
    if (span) {
      span.classList.remove('correct', 'wrong');
      span.classList.add('pending');
    }

    updateCursor();
    updateProgress();
    return;
  }

  // ── Start timer on first real keystroke ──
  if (!isRunning) startTimer();

  // ── Character comparison ──
  const typed = e.code === 'Space' ? ' ' : e.key;
  const expected = promptText[inputIndex];
  const correct = typed === expected;

  totalTyped++;

  const span = document.querySelector(`.char[data-i="${inputIndex}"]`);
  if (span) {
    span.classList.remove('pending', 'correct', 'wrong', 'cursor');
    span.classList.add(correct ? 'correct' : 'wrong');
  }

  if (!correct) {
    errors++;
    errorLog[e.code] = (errorLog[e.code] || 0) + 1;
    updateHeatmap();
    updateErrorLogDisplay();
  }

  flashKey(e.code, correct);

  inputIndex++;
  updateCursor();
  updateProgress();
  updateStats(null);

  // ── Check for completion ──
  if (inputIndex >= promptText.length) finish();
});

// ══════════════════════════════════════════════════════════
//  KEYBOARD EVENT — KEYUP  (remove active highlight)
// ══════════════════════════════════════════════════════════
document.addEventListener('keyup', (e) => {
  const keyEl = document.querySelector(`.key[data-key="${e.code}"]`);
  if (keyEl) keyEl.classList.remove('active');
});

// Keep focus on the prompt box when clicked
$('prompt-box').addEventListener('click', () => $('prompt-box').focus());

// ══════════════════════════════════════════════════════════
//  CONTROL BUTTONS
// ══════════════════════════════════════════════════════════
$('btn-reset').addEventListener('click', restart);
$('btn-new').addEventListener('click', newText);

/** Restart with the same prompt */
function restart() {
  init();
}

/** Load a fresh random prompt */
function newText() {
  init();
}

// ══════════════════════════════════════════════════════════
//  MODE SELECTOR BUTTONS
// ══════════════════════════════════════════════════════════
$$('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.mode === 'custom') {
      const t = prompt('Enter your custom text (min 10 characters):');
      if (!t || t.trim().length < 10) return;
      customText = t.trim();
    }

    $$('.mode-btn').forEach((b) => b.classList.remove('sel'));
    btn.classList.add('sel');
    currentMode = btn.dataset.mode;
    init();
  });
});

// ══════════════════════════════════════════════════════════
//  DIFFICULTY SELECTOR BUTTONS
// ══════════════════════════════════════════════════════════
$$('.difficulty-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.difficulty-btn').forEach((b) =>
      b.classList.remove('sel-easy', 'sel-medium', 'sel-hard')
    );
    btn.classList.add(`sel-${btn.dataset.diff}`);
    currentDiff = btn.dataset.diff;
    init();
  });
});

// ══════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════
buildKeyboard();
init();
