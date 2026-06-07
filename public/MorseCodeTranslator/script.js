const MORSE_MAP = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  "@": ".--.-.",
};

const REVERSE_MAP = {};
for (const k in MORSE_MAP) {
  REVERSE_MAP[MORSE_MAP[k]] = k;
}

let mode = "encode";
let audioCtx = null;
let isPlaying = false;
let stopFlag = false;
let wpm = 15;

// ── Helpers ───────────────────────────────────────────────────────

const el = (id) => document.getElementById(id);

// ── Mode ──────────────────────────────────────────────────────────

const setMode = (m) => {
  mode = m;
  el("encode-btn").classList.toggle("active", m === "encode");
  el("decode-btn").classList.toggle("active", m === "decode");
  el("input-label").textContent = m === "encode" ? "Text" : "Morse Code";
  el("output-label").textContent = m === "encode" ? "Morse Code" : "Text";
  el("input").placeholder =
    m === "encode"
      ? "Type your message..."
      : "Enter Morse code — space between letters, / between words...";
  el("input").value = "";
  el("output").textContent = "—";
  el("char-count").textContent = "0";
};

// ── Translation ───────────────────────────────────────────────────

const encodeToMorse = (text) => {
  const result = [];
  const upper = text.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    if (ch === " ") result.push("/");
    else if (MORSE_MAP[ch]) result.push(MORSE_MAP[ch]);
    else result.push("?");
  }
  return result.join(" ");
};

const decodeFromMorse = (morse) => {
  const words = morse.trim().split(/\s*\/\s*/);
  const decoded = [];
  for (let i = 0; i < words.length; i++) {
    const codes = words[i].trim().split(/\s+/);
    let word = "";
    for (let j = 0; j < codes.length; j++) {
      const c = codes[j];
      word += REVERSE_MAP[c] || (c ? "?" : "");
    }
    decoded.push(word);
  }
  return decoded.join(" ");
};

const buildOutputSpans = (morseText) => {
  const output = el("output");
  output.innerHTML = "";
  morseText.split(" ").forEach((tok, i, arr) => {
    const span = document.createElement("span");
    span.className = "morse-token";
    span.dataset.idx = i;
    span.textContent = tok;
    output.appendChild(span);
    if (i < arr.length - 1) output.appendChild(document.createTextNode(" "));
  });
};

const translate = () => {
  const input = el("input").value;
  el("char-count").textContent = input.length;
  const output = el("output");
  if (!input.trim()) {
    output.innerHTML = "";
    output.textContent = "—";
    return;
  }
  if (mode === "encode") {
    // render as spans for visual playback highlight
    buildOutputSpans(encodeToMorse(input));
  } else {
    // decode mode — plain text, exactly as original
    output.textContent = decodeFromMorse(input);
  }
};

const clearInput = () => {
  el("input").value = "";
  el("output").textContent = "—";
  el("char-count").textContent = "0";
};
// ── Download output as .txt file ──────────────────────────────────
const downloadOutput = () => {
  const text = el("output").textContent;
  if (text === "—" || !text.trim()) return;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `morse-${mode}-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Downloaded!");
};
const copyOutput = () => {
  const text = el("output").textContent;
  if (text === "—" || text === "-") return;

  const btn = el("copy-btn");
  const prev = btn.textContent;

  const markCopied = () => {
    btn.textContent = "✓";
    btn.style.color = "var(--accent)";
    setTimeout(() => {
      btn.textContent = prev;
      btn.style.color = "";
    }, 1600);
    showToast("Copied to clipboard");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(markCopied)
      .catch(() => {
        fallbackCopy(text);
        markCopied();
      });
  } else {
    fallbackCopy(text);
    markCopied();
  }
};

const fallbackCopy = (text) => {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch (e) {
    /* silent */
  }
  document.body.removeChild(ta);
};

const showToast = (msg) => {
  let toast = el("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
};

// ── Speed ─────────────────────────────────────────────────────────

const updateSpeed = () => {
  wpm = parseInt(el("speed").value, 10);
  el("speed-val").textContent = `${wpm} WPM`;
};

// ── Audio ─────────────────────────────────────────────────────────

const getCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx || audioCtx.state === "closed") audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const playTone = (ctx, durationMs, freq = 620) =>
  new Promise((resolve) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;

    const t = ctx.currentTime;
    const d = durationMs / 1000;
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
  const btn = el("play-btn");
  const icon = el("play-icon");
  const label = el("play-label");
  if (playing) {
    btn.classList.add("playing");
    icon.textContent = "■";
    label.textContent = "Stop";
  } else {
    btn.classList.remove("playing");
    icon.textContent = "▶";
    label.textContent = "Play Audio";
  }
};

// ──  highlight/clear helpers for visual playback ──────────────
const highlightToken = (idx) => {
  document.querySelectorAll(".morse-token").forEach((s, i) => {
    s.classList.toggle("active-token", i === idx);
  });
};

const clearHighlight = () => {
  document
    .querySelectorAll(".morse-token")
    .forEach((s) => s.classList.remove("active-token"));
};

const togglePlay = async () => {
  if (isPlaying) {
    stopFlag = true;
    return;
  }

  const morseText =
    mode === "encode" ? el("output").textContent : el("input").value;

  if (!morseText || morseText === "—" || !morseText.trim()) return;

  const dot = 1200 / wpm;
  const dash = dot * 3;
  const elemGap = dot;
  const letterGap = dot * 3;
  const wordGap = dot * 7;

  const ctx = getCtx();
  stopFlag = false;
  setPlayState(true);

  const tokens = morseText.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    if (stopFlag) break;
    const tok = tokens[i];

    highlightToken(i);

    if (tok === "/") {
      await sleep(wordGap - letterGap);
    } else {
      for (let j = 0; j < tok.length; j++) {
        if (stopFlag) break;
        if (tok[j] === ".") await playTone(ctx, dot);
        else if (tok[j] === "-") await playTone(ctx, dash);
        if (!stopFlag && j < tok.length - 1) await sleep(elemGap);
      }
      if (!stopFlag && i < tokens.length - 1 && tokens[i + 1] !== "/") {
        await sleep(letterGap);
      }
    }
  }

  clearHighlight();
  stopFlag = false;
  setPlayState(false);
};

// ── Reference table ───────────────────────────────────────────────
// Each ref-item is now clickable — inserts char into input.
// Only addEventListener added.

const buildRefTable = () => {
  const table = el("ref-table");
  for (const char in MORSE_MAP) {
    const item = document.createElement("div");
    item.className = "ref-item";
    item.title = `Click to insert "${char}"`;

    const charEl = document.createElement("span");
    charEl.className = "ref-char";
    charEl.textContent = char;

    const codeEl = document.createElement("span");
    codeEl.className = "ref-code";
    codeEl.textContent = MORSE_MAP[char];

    item.appendChild(charEl);
    item.appendChild(codeEl);

    // NEW: click inserts character (encode mode) or morse (decode mode)
    item.addEventListener("click", () => {
      const inputEl = el("input");
      if (mode === "encode") {
        inputEl.value += char;
      } else {
        const current = inputEl.value;
        inputEl.value = current
          ? current.trimEnd() + " " + MORSE_MAP[char]
          : MORSE_MAP[char];
      }
      inputEl.dispatchEvent(new Event("input"));
      inputEl.focus();
      showToast(`Inserted "${char}"`);
    });

    table.appendChild(item);
  }
};

const toggleRef = () => {
  const table = el("ref-table");
  const btn = el("ref-toggle-btn");
  const arrow = el("ref-arrow");
  const open = table.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
  arrow.textContent = open ? "▴" : "▾";
};

// ──  Swap panels ──────────────────────────────────────────────
// Moves output → input and flips mode.
const swapPanels = () => {
  const outputText = el("output").textContent;
  if (!outputText || outputText === "—") return;

  const newMode = mode === "encode" ? "decode" : "encode";
  mode = newMode;

  el("encode-btn").classList.toggle("active", mode === "encode");
  el("decode-btn").classList.toggle("active", mode === "decode");
  el("input-label").textContent = mode === "encode" ? "Text" : "Morse Code";
  el("output-label").textContent = mode === "encode" ? "Morse Code" : "Text";
  el("input").placeholder =
    mode === "encode"
      ? "Type your message..."
      : "Enter Morse code — space between letters, / between words...";

  el("input").value = outputText;
  el("char-count").textContent = outputText.length;
  el("input").dispatchEvent(new Event("input"));
  showToast("Panels swapped!");
};

// ── Init ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  el("input").addEventListener("input", translate);
  el("clear-btn").addEventListener("click", clearInput);
  el("copy-btn").addEventListener("click", copyOutput);
  el("play-btn").addEventListener("click", togglePlay);
  el("download-btn").addEventListener("click", downloadOutput);
  el("speed").addEventListener("input", updateSpeed);
  el("ref-toggle-btn").addEventListener("click", toggleRef);
  el("encode-btn").addEventListener("click", () => setMode("encode"));
  el("decode-btn").addEventListener("click", () => setMode("decode"));
  el("swap-btn").addEventListener("click", swapPanels);

  // ── Keyboard shortcuts ──────────────────────────────────────────
  // When inside textarea: only Escape (clear) and Ctrl+Enter (play)
  // Outside textarea: Ctrl+Shift+C (copy)
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      if (e.key === "Escape") {
        clearInput();
        return;
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        togglePlay();
        return;
      }
      return;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      e.preventDefault();
      copyOutput();
    }
  });

  buildRefTable();
});
