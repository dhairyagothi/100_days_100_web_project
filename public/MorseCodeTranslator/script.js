const MORSE_MAP = {
  'A':'.-',   'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.',
  'F':'..-.', 'G':'--.',  'H':'....', 'I':'..',  'J':'.---',
  'K':'-.-',  'L':'.-..', 'M':'--',   'N':'-.',  'O':'---',
  'P':'.--.', 'Q':'--.-', 'R':'.-.',  'S':'...', 'T':'-',
  'U':'..-',  'V':'...-', 'W':'.--',  'X':'-..-','Y':'-.--',
  'Z':'--..',
  '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-',
  '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', '!':'-.-.--',
  '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...',
  ':':'---...', ';':'-.-.-.', '=':'-...-', '+':'.-.-.',
  '-':'-....-', '_':'..--.-', '@':'.--.-.'
};

const REVERSE_MAP = {};
for (const k in MORSE_MAP) {
  REVERSE_MAP[MORSE_MAP[k]] = k;
}

let mode      = 'encode';
let audioCtx  = null;
let isPlaying = false;
let stopFlag  = false;
let wpm       = 15;

// ── Helpers ───────────────────────────────────────────────────────

const el = (id) => document.getElementById(id);

// ── Mode ──────────────────────────────────────────────────────────

const setMode = (m) => {
  mode = m;
  el('encode-btn').classList.toggle('active', m === 'encode');
  el('decode-btn').classList.toggle('active', m === 'decode');
  el('input-label').textContent  = m === 'encode' ? 'Text' : 'Morse Code';
  el('output-label').textContent = m === 'encode' ? 'Morse Code' : 'Text';
  el('input').placeholder = m === 'encode'
    ? 'Type your message...'
    : 'Enter Morse code — space between letters, / between words...';
  el('input').value            = '';
  el('output').textContent     = '—';
  el('char-count').textContent = '0';
};

// ── Translation ───────────────────────────────────────────────────

const encodeToMorse = (text) => {
  const result = [];
  const upper  = text.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    if (ch === ' ')       result.push('/');
    else if (MORSE_MAP[ch]) result.push(MORSE_MAP[ch]);
    else                  result.push('?');
  }
  return result.join(' ');
};

const decodeFromMorse = (morse) => {
  const words   = morse.trim().split(/\s*\/\s*/);
  const decoded = [];
  for (let i = 0; i < words.length; i++) {
    const codes = words[i].trim().split(/\s+/);
    let word = '';
    for (let j = 0; j < codes.length; j++) {
      const c = codes[j];
      word += REVERSE_MAP[c] || (c ? '?' : '');
    }
    decoded.push(word);
  }
  return decoded.join(' ');
};

const translate = () => {
  const input = el('input').value;
  el('char-count').textContent = input.length;
  const output = el('output');
  if (!input.trim()) { output.textContent = '—'; return; }
  output.textContent = mode === 'encode' ? encodeToMorse(input) : decodeFromMorse(input);
};

const clearInput = () => {
  el('input').value            = '';
  el('output').textContent     = '—';
  el('char-count').textContent = '0';
};

// ── Copy ──────────────────────────────────────────────────────────

const copyOutput = () => {
  const text = el('output').textContent;
  if (text === '—' || text === '-') return;

  const btn  = el('copy-btn');
  const prev = btn.textContent;

  const markCopied = () => {
    btn.textContent = '✓';
    btn.style.color = 'var(--accent)';
    setTimeout(() => { btn.textContent = prev; btn.style.color = ''; }, 1600);
    showToast('Copied to clipboard');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(markCopied).catch(() => {
      fallbackCopy(text);
      markCopied();
    });
  } else {
    fallbackCopy(text);
    markCopied();
  }
};

const fallbackCopy = (text) => {
  const ta = document.createElement('textarea');
  ta.value          = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* silent */ }
  document.body.removeChild(ta);
};

const showToast = (msg) => {
  let toast = el('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
};

// ── Speed ─────────────────────────────────────────────────────────

const updateSpeed = () => {
  wpm = parseInt(el('speed').value, 10);
  el('speed-val').textContent = `${wpm} WPM`;
};

// ── Audio ─────────────────────────────────────────────────────────

const getCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx || audioCtx.state === 'closed') audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const playTone = (ctx, durationMs, freq = 620) => new Promise((resolve) => {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;

  const t    = ctx.currentTime;
  const d    = durationMs / 1000;
  const ramp = Math.min(0.008, d * 0.1);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.38, t + ramp);
  gain.gain.setValueAtTime(0.38, t + d - ramp);
  gain.gain.linearRampToValueAtTime(0, t + d);

  osc.start(t);
  osc.stop(t + d);
  osc.onended = resolve;
});

const setPlayState = (playing) => {
  isPlaying = playing;
  const btn   = el('play-btn');
  const icon  = el('play-icon');
  const label = el('play-label');
  if (playing) {
    btn.classList.add('playing');
    icon.textContent  = '■';
    label.textContent = 'Stop';
  } else {
    btn.classList.remove('playing');
    icon.textContent  = '▶';
    label.textContent = 'Play Audio';
  }
};

const togglePlay = async () => {
  if (isPlaying) { stopFlag = true; return; }

  // encode mode: output panel holds morse; decode mode: input panel holds morse
  const morseText = mode === 'encode'
    ? el('output').textContent
    : el('input').value;

  if (!morseText || morseText === '—' || !morseText.trim()) return;

  const dot       = 1200 / wpm;
  const dash      = dot * 3;
  const elemGap   = dot;
  const letterGap = dot * 3;
  const wordGap   = dot * 7;

  const ctx = getCtx();
  stopFlag = false;
  setPlayState(true);

  const tokens = morseText.split(' ');

  for (let i = 0; i < tokens.length; i++) {
    if (stopFlag) break;
    const tok = tokens[i];

    if (tok === '/') {
      await sleep(wordGap - letterGap);
    } else {
      for (let j = 0; j < tok.length; j++) {
        if (stopFlag) break;
        if (tok[j] === '.')      await playTone(ctx, dot);
        else if (tok[j] === '-') await playTone(ctx, dash);
        if (!stopFlag && j < tok.length - 1) await sleep(elemGap);
      }
      if (!stopFlag && i < tokens.length - 1 && tokens[i + 1] !== '/') {
        await sleep(letterGap);
      }
    }
  }

  stopFlag = false;
  setPlayState(false);
};

// ── Reference table ───────────────────────────────────────────────

const buildRefTable = () => {
  const table = el('ref-table');
  for (const char in MORSE_MAP) {
    const item = document.createElement('div');
    item.className = 'ref-item';

    const charEl = document.createElement('span');
    charEl.className   = 'ref-char';
    charEl.textContent = char;

    const codeEl = document.createElement('span');
    codeEl.className   = 'ref-code';
    codeEl.textContent = MORSE_MAP[char];

    item.appendChild(charEl);
    item.appendChild(codeEl);
    table.appendChild(item);
  }
};

const toggleRef = () => {
  const table = el('ref-table');
  const btn   = el('ref-toggle-btn');
  const arrow = el('ref-arrow');
  const open  = table.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  arrow.textContent = open ? '▴' : '▾';
};

// ── Init ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  el('input').addEventListener('input', translate);
  el('clear-btn').addEventListener('click', clearInput);
  el('copy-btn').addEventListener('click', copyOutput);
  el('play-btn').addEventListener('click', togglePlay);
  el('speed').addEventListener('input', updateSpeed);
  el('ref-toggle-btn').addEventListener('click', toggleRef);
  el('encode-btn').addEventListener('click', () => setMode('encode'));
  el('decode-btn').addEventListener('click', () => setMode('decode'));

  buildRefTable();
});
