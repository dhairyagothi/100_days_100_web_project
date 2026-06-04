/* ─── Lexicon Dictionary App ─── */

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// DOM references
const input = document.getElementById('input');
const searchBtn = document.getElementById('search');
const startBtn = document.getElementById('start-btn');
const clearBtn = document.getElementById('clear-btn');
const micStatus = document.getElementById('mic-status');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-state');
const errorMsg = document.getElementById('error-msg');
const resultPanel = document.getElementById('result');
const historyContainer = document.getElementById('search-history');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const HISTORY_KEY = 'dictionary_search_history';
const HISTORY_LIMIT = 15;
const historyCount = document.getElementById('history-count');

// Result fields
const posBadge = document.getElementById('pos-badge');
const wordIndexEl = document.getElementById('word-index');
const wordEl = document.getElementById('result-word');
const phoneticEl = document.getElementById('result-phonetic');
const audioBtn = document.getElementById('audio-btn');
const defEl = document.getElementById('result-def');
const exampleEl = document.getElementById('result-example');
const synonymsEl = document.getElementById('synonyms');
const antonymsEl = document.getElementById('antonyms');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const navCounter = document.getElementById('nav-counter');
const resultNav = document.getElementById('result-nav');

// Core App State Tracking Matrices
let allMeanings = [];
let currentIdx = 0;
let audioUrl = '';
let audioObj = null;
let isListening = false;

/* ─── Layout Display Status Actions ─── */
function show(el) {
  if (el) el.classList.remove('hidden');
}
function hide(el) {
  if (el) el.classList.add('hidden');
}

function setState(state) {
  hide(loadingEl);
  hide(errorEl);
  hide(resultPanel);
  if (state === 'loading') show(loadingEl);
  if (state === 'error') show(errorEl);
  if (state === 'result') show(resultPanel);
}

/* ─── Meaning Node Parser Render Logic ─── */
function renderMeaning(idx) {
  const m = allMeanings[idx];
  if (!m) return;

  // Fluid transition framework settings
  resultPanel.style.opacity = '0';
  resultPanel.style.transform = 'translateY(6px)';
  requestAnimationFrame(() => {
    resultPanel.style.transition = 'opacity .3s ease, transform .3s ease';
    resultPanel.style.opacity = '1';
    resultPanel.style.transform = 'translateY(0)';
  });

  posBadge.textContent = m.partOfSpeech || 'word';
  wordEl.textContent = m.word;
  phoneticEl.textContent = m.phonetic || '';

  const def =
    m.definitions[0]?.definition ||
    'No explicit content definitions available.';
  const ex = m.definitions[0]?.example;
  defEl.textContent = def;

  if (ex) {
    exampleEl.textContent = `"${ex}"`;
    show(exampleEl);
  } else {
    hide(exampleEl);
  }

  // Inject High Contrast Dynamic Element Chips
  renderChips(synonymsEl, (m.synonyms || []).slice(0, 12), 'chip-syn');
  renderChips(antonymsEl, (m.antonyms || []).slice(0, 12), 'chip-ant');

  // Dynamic Multi-Meaning Pagination Core Configs
  if (allMeanings.length > 1) {
    show(resultNav);
    navCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(allMeanings.length).padStart(2, '0')}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === allMeanings.length - 1;
    wordIndexEl.textContent = `Meaning ${idx + 1}`;
  } else {
    hide(resultNav);
    wordIndexEl.textContent = '';
  }
}

function renderChips(container, words, cls) {
  if (!container) return;
  container.innerHTML = '';

  if (!words.length) {
    const span = document.createElement('span');
    span.className = 'chip chip-empty';
    span.textContent =
      cls === 'chip-syn' ? 'No synonyms categorized' : 'None available';
    container.appendChild(span);
    return;
  }

  words.forEach((w, i) => {
    const chip = document.createElement('span');
    chip.className = `chip ${cls}`;
    chip.textContent = w;
    chip.style.opacity = '0';
    chip.style.animation = 'fadeUp .4s ease forwards';
    chip.style.animationDelay = `${i * 35}ms`;

    chip.addEventListener('click', () => {
      input.value = w;
      if (clearBtn) clearBtn.classList.add('visible');
      fetchWord(w);
    });
    container.appendChild(chip);
  });
}

function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveToHistory(word) {
  let history = getHistory();

  history = history.filter((item) => item.toLowerCase() !== word.toLowerCase());

  history.unshift(word);

  if (history.length > HISTORY_LIMIT) {
    history = history.slice(0, HISTORY_LIMIT);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  historyCount.textContent = history.length;
  historyContainer.innerHTML = '';

  if (!history.length) {
    historyContainer.innerHTML =
      '<span class="empty-history">No recent searches</span>';
    return;
  }

  history.forEach((word, index) => {
    const chip = document.createElement('button');

    chip.className = 'history-chip';
    chip.textContent = word;
    chip.style.opacity = '0';
    chip.style.animation = 'fadeUp .35s ease forwards';
    chip.style.animationDelay = `${index * 40}ms`;
    chip.addEventListener('click', () => {
      input.value = word;
      fetchWord(word);
    });

    historyContainer.appendChild(chip);
  });
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

/* ─── API Async Core Engine Integration ─── */
async function fetchWord(word) {
  if (!word.trim()) return;

  setState('loading');
  audioUrl = '';
  if (audioObj) {
    audioObj.pause();
    audioObj = null;
  }
  audioBtn.classList.remove('playing');

  try {
    const res = await fetch(`${API_BASE}${encodeURIComponent(word.trim())}`);
    if (!res.ok) throw new Error('Query unresolvable.');
    const data = await res.json();

    allMeanings = [];
    data.forEach((entry) => {
      if (!audioUrl) {
        const phonetics = entry.phonetics || [];
        const withAudio = phonetics.find((p) => p.audio);
        if (withAudio)
          audioUrl = withAudio.audio.startsWith('//')
            ? 'https:' + withAudio.audio
            : withAudio.audio;
      }

      const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || '';

      entry.meanings.forEach((m) => {
        const syns = [
          ...new Set([
            ...(m.synonyms || []),
            ...(m.definitions || []).flatMap((d) => d.synonyms || []),
          ]),
        ];
        const ants = [
          ...new Set([
            ...(m.antonyms || []),
            ...(m.definitions || []).flatMap((d) => d.antonyms || []),
          ]),
        ];

        allMeanings.push({
          word: entry.word,
          phonetic,
          partOfSpeech: m.partOfSpeech,
          definitions: m.definitions,
          synonyms: syns,
          antonyms: ants,
        });
      });
    });

    if (!allMeanings.length) throw new Error('Data set unresolvable.');

    // Audio Playback Track Asset Mapping Handler
    if (audioUrl) {
      show(audioBtn);
      audioObj = new Audio(audioUrl);
      audioObj.onended = () => audioBtn.classList.remove('playing');
    } else {
      hide(audioBtn);
    }

    saveToHistory(word.trim());

    currentIdx = 0;
    setState('result');
    renderMeaning(currentIdx);
  } catch (error) {
    errorMsg.textContent = `No matches found for "${word}". Try another word.`;
    setState('error');
  }
}

/* ─── DOM Event Registration Listeners ─── */
searchBtn.addEventListener('click', () => fetchWord(input.value));

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchWord(input.value);
});

input.addEventListener('input', () => {
  clearBtn.classList.toggle('visible', input.value.length > 0);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  clearBtn.classList.remove('visible');
  setState('');
  input.focus();
});

audioBtn.addEventListener('click', () => {
  if (!audioObj) return;
  audioObj.currentTime = 0;
  audioObj.play();
  audioBtn.classList.add('playing');
});

prevBtn.addEventListener('click', () => {
  if (currentIdx > 0) {
    currentIdx--;
    renderMeaning(currentIdx);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIdx < allMeanings.length - 1) {
    currentIdx++;
    renderMeaning(currentIdx);
  }
});

/* ─── Native Integrated Single Voice Node Control ─── */
let recognition = null;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const heard = e.results[0][0].transcript.trim();
    input.value = heard;
    clearBtn.classList.add('visible');
    toggleListening(true); // Complete listener cycle safely
    fetchWord(heard);
  };
  recognition.onerror = () => toggleListening(true);
  recognition.onend = () => {
    if (isListening) toggleListening(true);
  };
} else {
  startBtn.disabled = true;
  startBtn.title = 'Speech engine not supported on this platform browser.';
}

function toggleListening(forceStop = false) {
  if (!recognition) return;

  if (isListening || forceStop) {
    try {
      recognition.stop();
    } catch (e) {}
    isListening = false;
    hide(micStatus);
    startBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> Voice Input`;
    startBtn.classList.remove('btn-voice-active');
  } else {
    try {
      recognition.start();
    } catch (e) {}
    isListening = true;
    show(micStatus);
    startBtn.innerHTML = `✕ Cancel Voice`;
    startBtn.classList.add('btn-voice-active');
  }
}

startBtn.addEventListener('click', () => toggleListening());
micStatus.addEventListener('click', () => toggleListening(true));

/* ─── Global Search Keyhook Hotkey ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
    input.select();
  }
});

clearHistoryBtn.addEventListener('click', clearHistory);

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
