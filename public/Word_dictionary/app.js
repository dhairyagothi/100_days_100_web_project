/* ─── Lexicon Dictionary App ─── */

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let startSpeakBtn = document.querySelector('#start-btn');
let stopSpeakBtn = document.querySelector('#stop-btn');
let apiKey = 'put API key Here';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let wordBox = document.querySelector('.words_and_meaning');
let i = 0;
let oldLength = 0;

// DOM refs
const input        = document.getElementById('input');
const searchBtn    = document.getElementById('search');
const startBtn     = document.getElementById('start-btn');
const stopBtn      = document.getElementById('stop-btn');
const clearBtn     = document.getElementById('clear-btn');
const micStatus    = document.getElementById('mic-status');
const loadingEl    = document.getElementById('loading');
const errorEl      = document.getElementById('error-state');
const errorMsg     = document.getElementById('error-msg');
const resultPanel  = document.getElementById('result');

// Result fields
const posBadge     = document.getElementById('pos-badge');
const wordIndexEl  = document.getElementById('word-index');
const wordEl       = document.getElementById('result-word');
const phoneticEl   = document.getElementById('result-phonetic');
const audioBtn     = document.getElementById('audio-btn');
const defEl        = document.getElementById('result-def');
const exampleEl    = document.getElementById('result-example');
const synonymsEl   = document.getElementById('synonyms');
const antonymsEl   = document.getElementById('antonyms');
const synSection   = document.getElementById('syn-section');
const antSection   = document.getElementById('ant-section');
const resultNav    = document.getElementById('result-nav');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');
const navCounter   = document.getElementById('nav-counter');

// State
let allMeanings = [];
let currentIdx  = 0;
let audioUrl    = '';
let audioObj    = null;

/* ─── Utility ─── */
function show(el)  { el.classList.remove('hidden'); }
function hide(el)  { el.classList.add('hidden'); }

function setState(state) {
  hide(loadingEl);
  hide(errorEl);
  hide(resultPanel);
  if (state === 'loading') show(loadingEl);
  if (state === 'error')   show(errorEl);
  if (state === 'result')  show(resultPanel);
}

/* ─── Render ─── */
function renderMeaning(idx) {
  const m = allMeanings[idx];
  if (!m) return;

  // Animate panel refresh
  resultPanel.style.opacity = '0';
  resultPanel.style.transform = 'translateY(8px)';
  requestAnimationFrame(() => {
    resultPanel.style.transition = 'opacity .3s ease, transform .3s ease';
    resultPanel.style.opacity = '1';
    resultPanel.style.transform = 'translateY(0)';
  });

  posBadge.textContent = m.partOfSpeech || 'word';
  wordEl.textContent   = m.word;
  phoneticEl.textContent = m.phonetic || '';

  const def = m.definitions[0]?.definition || 'No definition available.';
  const ex  = m.definitions[0]?.example;
  defEl.textContent = def;
  if (ex) {
    exampleEl.textContent = `"${ex}"`;
    show(exampleEl);
  } else {
    hide(exampleEl);
  }

  // Synonyms & antonyms already fully collected during fetch
  renderChips(synonymsEl, (m.synonyms || []).slice(0, 12), 'chip-syn');
  renderChips(antonymsEl, (m.antonyms || []).slice(0, 12), 'chip-ant');

  // Navigation
  if (allMeanings.length > 1) {
    show(resultNav);
    navCounter.textContent = `${idx + 1} / ${allMeanings.length}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === allMeanings.length - 1;
    wordIndexEl.textContent = `Meaning ${idx + 1}`;
  } else {
    hide(resultNav);
    wordIndexEl.textContent = '';
  }
}

function renderChips(container, words, cls) {
  container.innerHTML = '';
  if (!words.length) {
    const span = document.createElement('span');
    span.className = 'chip chip-empty';
    span.textContent = 'None available';
    container.appendChild(span);
    return;
  }
  words.forEach((w, i) => {
    const chip = document.createElement('span');
    chip.className = `chip ${cls}`;
    chip.textContent = w;
    chip.style.animationDelay = `${i * 40}ms`;
    chip.style.opacity = '0';
    chip.style.animation = 'fadeUp .4s ease forwards';
    chip.style.animationDelay = `${i * 35}ms`;
    chip.addEventListener('click', () => {
      input.value = w;
      clearBtn.classList.add('visible');
      fetchWord(w);
    });
    container.appendChild(chip);
  });
}

/* ─── Fetch ─── */
async function fetchWord(word) {
  if (!word.trim()) return;

  setState('loading');
  audioUrl = '';
  if (audioObj) { audioObj.pause(); audioObj = null; }
  audioBtn.classList.remove('playing');

  try {
    const res = await fetch(`${API_BASE}${encodeURIComponent(word.trim())}`);
    if (!res.ok) throw new Error('not found');
    const data = await res.json();

    // Collect all meanings across all entries
    allMeanings = [];
    data.forEach(entry => {
      // Get audio from first entry with a phonetic
      if (!audioUrl) {
        const phonetics = entry.phonetics || [];
        const withAudio = phonetics.find(p => p.audio);
        if (withAudio) audioUrl = withAudio.audio.startsWith('//') ? 'https:' + withAudio.audio : withAudio.audio;
      }

      const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || '';

      entry.meanings.forEach(m => {
        // Collect syns/ants from BOTH meaning-level AND every definition-level
        const syns = [...new Set([
          ...(m.synonyms || []),
          ...(m.definitions || []).flatMap(d => d.synonyms || [])
        ])];
        const ants = [...new Set([
          ...(m.antonyms || []),
          ...(m.definitions || []).flatMap(d => d.antonyms || [])
        ])];

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

    if (!allMeanings.length) throw new Error('no meanings');

    // Audio button
    if (audioUrl) {
      show(audioBtn);
      audioObj = new Audio(audioUrl);
      audioObj.onended = () => audioBtn.classList.remove('playing');
    } else {
      hide(audioBtn);
    }

    currentIdx = 0;
    setState('result');
    renderMeaning(currentIdx);

  } catch {
    errorMsg.textContent = `No results for "${word}". Check the spelling and try again.`;
    setState('error');
  }
}

/* ─── Events ─── */
searchBtn.addEventListener('click', () => fetchWord(input.value));
input.addEventListener('keydown', e => {
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
  if (currentIdx > 0) { currentIdx--; renderMeaning(currentIdx); }
});
nextBtn.addEventListener('click', () => {
  if (currentIdx < allMeanings.length - 1) { currentIdx++; renderMeaning(currentIdx); }
});

/* ─── Voice ─── */
let recognition = null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = e => {
    const heard = e.results[0][0].transcript.trim();
    input.value = heard;
    clearBtn.classList.add('visible');
    stopListening();
    fetchWord(heard);
  };
  recognition.onerror = () => stopListening();
  recognition.onend   = () => stopListening();
} else {
  startBtn.disabled = true;
  startBtn.title = 'Speech recognition not supported in this browser';
}

function startListening() {
  if (!recognition) return;
  recognition.start();
  show(micStatus);
  hide(startBtn);
  show(stopBtn);
}
function stopListening() {
  if (recognition) try { recognition.stop(); } catch {}
  hide(micStatus);
  show(startBtn);
  hide(stopBtn);
}

startBtn.addEventListener('click', startListening);
stopBtn.addEventListener('click',  stopListening);

/* ─── Keyboard shortcut: / focuses search ─── */
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
    input.select();
  }
});