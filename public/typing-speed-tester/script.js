// --- SAMPLE PARAGRAPHS DATABASE ---
const EASY_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", 
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", 
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", 
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", 
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", 
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", 
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", 
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "should", "than", "must", "world", "still", "find", "life", "own", "here", "may"
];

const MEDIUM_PARAGRAPHS = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. In the end, we will remember not the words of our enemies, but the silence of our friends.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you will know when you find it.",
  "Design is not just what it looks like and feels like. Design is how it works. Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.",
  "Simple things are indeed the most complex. To communicate clearly, you must strip away the noise. Only then does the true essence of your message shine through.",
  "It is during our darkest moments that we must focus to see the light. The best and most beautiful things in the world cannot be seen or even touched, they must be felt with the heart.",
  "A journey of a thousand miles begins with a single step. Focus on the process rather than the destination. Small steps taken daily lead to massive transformations over time."
];

const HARD_PARAGRAPHS = [
  "Executing scripts in PowerShell requires correct permissions. Adjusting execution policies like `Set-ExecutionPolicy -Scope Process Bypass` runs arbitrary configurations.",
  "Debugging asynchronous JavaScript, such as `const result = await fetch('/api/v1/data')`, involves handling errors using `try { ... } catch (err) { console.error(err); }` properly.",
  "The Unix epoch is 1970-01-01T00:00:00Z. Systems count time in milliseconds: `Date.now() === 1774392023000`. Double-check timezones and formats like ISO 8601.",
  "Can you write a regex pattern like `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$` to validate standard emails? Escaping characters is key!",
  "A database query like `SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 10;` retrieves active user records from SQL servers.",
  "Algorithm complexity is expressed via Big O notation, for instance, O(N log N) for quicksort. Avoid O(N^2) nested loops when sorting extensive datasets."
];

// --- CUSTOM WEB AUDIO SYNTH ENGINE ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.mode = 'mechanical'; // mechanical, synth, off
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  playKey(isSpace = false) {
    if (this.mode === 'off') return;
    this.init();

    if (this.mode === 'mechanical') {
      this.playMechanicalClick(isSpace);
    } else if (this.mode === 'synth') {
      this.playSynthKey(isSpace);
    }
  }

  playError() {
    if (this.mode === 'off') return;
    this.init();

    if (this.mode === 'mechanical') {
      this.playMechanicalError();
    } else if (this.mode === 'synth') {
      this.playSynthError();
    }
  }

  playFinish() {
    if (this.mode === 'off') return;
    this.init();
    this.playVictoryChime();
  }

  playMechanicalClick(isSpace) {
    const now = this.ctx.currentTime;
    
    // Quick burst of white noise for plastic keycap impact
    const bufferSize = this.ctx.sampleRate * 0.02; // 20ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSpace ? 520 : 850, now);
    filter.Q.setValueAtTime(5, now);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isSpace ? 0.35 : 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.035 : 0.016));
    
    // Low frequency sine bump for key switch bottom out
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isSpace ? 130 : 200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.01);
    
    oscGain.gain.setValueAtTime(isSpace ? 0.18 : 0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    
    noise.start(now);
    osc.start(now);
    
    noise.stop(now + 0.05);
    osc.stop(now + 0.05);
  }

  playMechanicalError() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSynthKey(isSpace) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const pitchRand = Math.random() * 220;
    osc.frequency.setValueAtTime(isSpace ? 261.63 : (523.25 + pitchRand), now); // Middle C vs High C+
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playSynthError() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.12);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playVictoryChime() {
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      
      gain.gain.setValueAtTime(0.0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
  }
}

const soundEngine = new SoundEngine();

// --- STATE MANAGEMENT ---
let activeMode = 'typing'; // typing or tester
let paragraphText = "";
let isTestRunning = false;
let isTestFinished = false;
let timer = 30;
let timerInterval = null;
let startTime = null;

let totalMistakes = 0;
let caretTimeout = null;

// Settings Defaults
let selectedDifficulty = 'easy';
let selectedTimeLimit = 30;
let selectedSound = 'mechanical';
let personalBestWPM = 0;
let leaderboard = [];

// --- DOM ELEMENTS ---
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const typingContainer = document.getElementById('typing-container');
const liveTimer = document.getElementById('live-timer');
const liveWpm = document.getElementById('live-wpm');
const liveAccuracy = document.getElementById('live-accuracy');

const restartBtn = document.getElementById('restart-btn');
const clearScoresBtn = document.getElementById('clear-scores-btn');
const leaderboardTbody = document.getElementById('leaderboard-tbody');

// Modal Elements
const resultModal = document.getElementById('result-modal');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultMistakes = document.getElementById('result-mistakes');
const resultChars = document.getElementById('result-chars');
const pbBadge = document.getElementById('pb-badge');
const playerNameInput = document.getElementById('player-name-input');
const saveScoreBtn = document.getElementById('save-score-btn');
const submitFeedbackMsg = document.getElementById('submit-feedback-msg');
const modalCloseBtn = document.getElementById('modal-close-btn');
const closeModalX = document.getElementById('close-modal-x');
const modalRetryBtn = document.getElementById('modal-retry-btn');
const scoreSubmitForm = document.getElementById('score-submit-form');

// Mode layouts selectors
const modeTypingBtn = document.getElementById('mode-typing-btn');
const modeTesterBtn = document.getElementById('mode-tester-btn');
const configBarSection = document.getElementById('config-bar-section');
const testerBarSection = document.getElementById('tester-bar-section');
const typingTestUi = document.getElementById('typing-test-ui');
const keyTesterUi = document.getElementById('key-tester-ui');
const leaderboardSection = document.getElementById('leaderboard-section');
const resetTesterBtn = document.getElementById('reset-tester-btn');

// --- DUAL-MODE CONTROLLER ---

function switchMode(newMode) {
  activeMode = newMode;
  
  // Update switcher buttons UI
  if (newMode === 'typing') {
    modeTypingBtn.classList.add('active');
    modeTesterBtn.classList.remove('active');
    
    // Toggle layout panels
    configBarSection.classList.remove('d-none');
    typingTestUi.classList.remove('d-none');
    leaderboardSection.classList.remove('d-none');
    testerBarSection.classList.add('d-none');
    keyTesterUi.classList.add('d-none');
    
    // Initialize Typing Test
    resetTest();
  } else {
    modeTesterBtn.classList.add('active');
    modeTypingBtn.classList.remove('active');
    
    // Toggle layout panels
    configBarSection.classList.add('d-none');
    typingTestUi.classList.add('d-none');
    leaderboardSection.classList.add('d-none');
    testerBarSection.classList.remove('d-none');
    keyTesterUi.classList.remove('d-none');
    
    // Stop any active timer
    clearInterval(timerInterval);
    timerInterval = null;
    isTestRunning = false;
    isTestFinished = false;
    
    // Clear tested colors
    clearVisualKeyboardTested();
  }
}

function clearVisualKeyboardTested() {
  const keys = document.querySelectorAll('.key');
  keys.forEach(k => {
    k.classList.remove('key-tested', 'key-active');
  });
}

// --- CORE TYPING ENGINE ---

function generateEasyText(wordCount) {
  let result = [];
  for (let i = 0; i < wordCount; i++) {
    const randIndex = Math.floor(Math.random() * EASY_WORDS.length);
    result.push(EASY_WORDS[randIndex]);
  }
  return result.join(" ");
}

function getTestText(difficulty, timeLimit) {
  if (difficulty === 'easy') {
    const wordCount = timeLimit === 30 ? 60 : (timeLimit === 60 ? 110 : 220);
    return generateEasyText(wordCount);
  } else if (difficulty === 'medium') {
    const list = [...MEDIUM_PARAGRAPHS];
    list.sort(() => Math.random() - 0.5);
    if (timeLimit > 30) {
      return list[0] + " " + list[1];
    }
    return list[0];
  } else { // hard
    const list = [...HARD_PARAGRAPHS];
    list.sort(() => Math.random() - 0.5);
    if (timeLimit > 30) {
      return list[0] + " " + list[1];
    }
    return list[0];
  }
}

function renderParagraphSpans() {
  textDisplay.innerHTML = "";
  paragraphText = paragraphText.trim().replace(/\s+/g, ' ');

  for (let i = 0; i < paragraphText.length; i++) {
    const span = document.createElement('span');
    span.classList.add('letter');
    span.textContent = paragraphText[i];
    textDisplay.appendChild(span);
  }
  
  const caret = document.createElement('div');
  caret.classList.add('caret');
  caret.id = 'caret';
  textDisplay.appendChild(caret);
  
  setTimeout(updateCaretPosition, 10);
}

function updateCaretPosition(isTyping = false) {
  const caret = document.getElementById('caret');
  const spans = textDisplay.querySelectorAll('.letter');
  const currentLength = typingInput.value.length;
  
  if (!caret) return;
  
  if (isTyping) {
    caret.classList.add('typing');
    clearTimeout(caretTimeout);
    caretTimeout = setTimeout(() => {
      caret.classList.remove('typing');
    }, 500);
  }
  
  if (spans.length === 0) return;
  
  let targetSpan = spans[currentLength];
  
  if (targetSpan) {
    caret.style.left = targetSpan.offsetLeft + 'px';
    caret.style.top = targetSpan.offsetTop + 'px';
    caret.style.height = targetSpan.offsetHeight + 'px';
    
    // Auto-scroll logic inside text area container
    const spanTop = targetSpan.offsetTop;
    const spanHeight = targetSpan.offsetHeight;
    const containerHeight = typingContainer.clientHeight;
    
    if (spanTop + spanHeight > typingContainer.scrollTop + containerHeight - 15) {
      typingContainer.scrollTop = spanTop - containerHeight + spanHeight + 25;
    } else if (spanTop < typingContainer.scrollTop + 15) {
      typingContainer.scrollTop = Math.max(0, spanTop - 25);
    }
  } else {
    // Caret at end
    const lastSpan = spans[spans.length - 1];
    if (lastSpan) {
      caret.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + 'px';
      caret.style.top = lastSpan.offsetTop + 'px';
      caret.style.height = lastSpan.offsetHeight + 'px';
      typingContainer.scrollTop = typingContainer.scrollHeight;
    }
  }
}

function startTestTimer() {
  isTestRunning = true;
  startTime = Date.now();
  
  timerInterval = setInterval(() => {
    timer--;
    liveTimer.textContent = timer + 's';
    
    if (timer <= 5) {
      liveTimer.classList.add('timer-low');
    } else {
      liveTimer.classList.remove('timer-low');
    }
    
    updateLiveStats();
    
    if (timer <= 0) {
      finishTest();
    }
  }, 1000);
}

function updateLiveStats() {
  const currentLength = typingInput.value.length;
  if (currentLength === 0) {
    liveWpm.textContent = '0';
    liveAccuracy.textContent = '100%';
    return;
  }
  
  const spans = textDisplay.querySelectorAll('.letter');
  let correctCount = 0;
  spans.forEach(span => {
    if (span.classList.contains('correct')) correctCount++;
  });
  
  let elapsedMinutes = 0;
  if (startTime) {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    elapsedMinutes = elapsedSeconds / 60;
  } else {
    elapsedMinutes = 0.001;
  }
  
  let wpm = 0;
  if (elapsedMinutes > 0.01) {
    wpm = Math.round((correctCount / 5) / elapsedMinutes);
  }
  
  let accuracy = 100;
  if (currentLength > 0) {
    accuracy = Math.round((correctCount / currentLength) * 100);
  }
  
  liveWpm.textContent = wpm;
  liveAccuracy.textContent = accuracy + '%';
}

function finishTest() {
  clearInterval(timerInterval);
  isTestRunning = false;
  isTestFinished = true;
  
  typingInput.disabled = true;
  liveTimer.textContent = "0s";
  liveTimer.classList.remove('timer-low');
  
  soundEngine.playFinish();
  
  // Calculate final stats
  const spans = textDisplay.querySelectorAll('.letter');
  let correctCount = 0;
  spans.forEach(span => {
    if (span.classList.contains('correct')) correctCount++;
  });
  
  const totalTyped = typingInput.value.length;
  const totalDurationMin = selectedTimeLimit / 60;
  const finalWpm = Math.round((correctCount / 5) / totalDurationMin);
  const finalAccuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  
  resultWpm.textContent = finalWpm;
  resultAccuracy.textContent = finalAccuracy + "%";
  resultMistakes.textContent = totalMistakes;
  resultChars.textContent = `${correctCount} / ${totalTyped}`;
  
  if (finalWpm > personalBestWPM) {
    personalBestWPM = finalWpm;
    localStorage.setItem('typepulse_best_wpm', personalBestWPM);
    document.getElementById('best-wpm-val').textContent = personalBestWPM;
    pbBadge.style.display = 'inline-block';
  } else {
    pbBadge.style.display = 'none';
  }
  
  playerNameInput.value = "";
  playerNameInput.disabled = false;
  saveScoreBtn.disabled = false;
  submitFeedbackMsg.textContent = "";
  submitFeedbackMsg.className = "form-feedback";
  
  resultModal.classList.add('open');
}

function resetTest() {
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  
  isTestRunning = false;
  isTestFinished = false;
  timer = selectedTimeLimit;
  totalMistakes = 0;
  
  typingInput.disabled = false;
  typingInput.value = "";
  
  liveTimer.textContent = timer + 's';
  liveTimer.classList.remove('timer-low');
  liveWpm.textContent = '0';
  liveAccuracy.textContent = '100%';
  
  paragraphText = getTestText(selectedDifficulty, selectedTimeLimit);
  renderParagraphSpans();
  
  typingContainer.scrollTop = 0;
  resultModal.classList.remove('open');
  
  // Autofocus the typing textbox
  setTimeout(() => {
    if (activeMode === 'typing') typingInput.focus();
  }, 10);
}

// --- GLOBAL KEYBOARDS EVENT LISTENERS ---

// Highlight QWERTY laptop keys on keypress
function toggleVisualKey(code, isActive) {
  const keyId = "key-" + code;
  const keyEl = document.getElementById(keyId);
  if (keyEl) {
    if (isActive) {
      keyEl.classList.add('key-active');
    } else {
      keyEl.classList.remove('key-active');
    }
  }
}

// Capture keys globally to support tester mode scroll-lock
document.addEventListener('keydown', (e) => {
  if (resultModal.classList.contains('open')) return;

  // ESC to reset typing speed tester
  if (e.key === 'Escape' && activeMode === 'typing') {
    e.preventDefault();
    resetTest();
    return;
  }

  // --- KEY HARDWARE TESTER MODE ---
  if (activeMode === 'tester') {
    // Intercept scroll triggers, tabs, search, and navigation keys
    const preventCodes = [
      'Tab', 'Space', 'Backspace', 'Enter', 'Escape',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'
    ];
    
    if (preventCodes.includes(e.code) || e.code.startsWith('F')) {
      e.preventDefault();
    }
    
    const keyId = "key-" + e.code;
    const keyEl = document.getElementById(keyId);
    if (keyEl) {
      keyEl.classList.add('key-tested');
      keyEl.classList.add('key-active');
      
      // Play mechanical sound on press
      if (selectedSound !== 'off') {
        soundEngine.playKey(e.code === 'Space');
      }
    }
    return;
  }
});

document.addEventListener('keyup', (e) => {
  if (activeMode === 'tester') {
    const keyId = "key-" + e.code;
    const keyEl = document.getElementById(keyId);
    if (keyEl) {
      keyEl.classList.remove('key-active');
    }
  }
});

// --- LOCAL TEXTAREA EVENT HANDLERS ---

typingInput.addEventListener('input', () => {
  if (activeMode !== 'typing' || isTestFinished) return;
  
  const currentInput = typingInput.value;
  const typedLength = currentInput.length;
  
  if (typedLength === 1 && !isTestRunning) {
    startTestTimer();
  }
  
  const spans = textDisplay.querySelectorAll('.letter');
  
  spans.forEach((span, index) => {
    if (index < typedLength) {
      if (currentInput[index] === paragraphText[index]) {
        span.classList.add('correct');
        span.classList.remove('incorrect');
      } else {
        span.classList.add('incorrect');
        span.classList.remove('correct');
      }
    } else {
      span.classList.remove('correct', 'incorrect');
    }
  });

  updateLiveStats();
  updateCaretPosition(true);

  // Extend words dynamically if completed early
  if (typedLength >= paragraphText.length && isTestRunning) {
    const currentInputVal = typingInput.value;
    const additionalText = getTestText(selectedDifficulty, selectedTimeLimit);
    paragraphText += " " + additionalText;
    renderParagraphSpans();
    typingInput.value = currentInputVal;
    updateCaretPosition(true);
  }
});

typingInput.addEventListener('keydown', (e) => {
  if (activeMode !== 'typing' || isTestFinished) return;
  if (e.repeat) return;

  // Toggle key pressed lighting
  toggleVisualKey(e.code, true);

  if (selectedSound === 'off') return;

  if (e.code === 'Backspace') {
    soundEngine.playKey(false);
    return;
  }
  
  if (e.code === 'Space') {
    soundEngine.playKey(true);
    return;
  }

  // Verify correctness to trigger click vs mistake sound
  if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const currentIndex = typingInput.value.length;
    if (currentIndex < paragraphText.length) {
      const expectedChar = paragraphText[currentIndex];
      if (e.key === expectedChar) {
        soundEngine.playKey(false);
      } else {
        soundEngine.playError();
        totalMistakes++;
      }
    }
  }
});

typingInput.addEventListener('keyup', (e) => {
  if (activeMode !== 'typing') return;
  toggleVisualKey(e.code, false);
});

// Autofocus typing field on body clicks
document.addEventListener('click', (e) => {
  if (resultModal.classList.contains('open')) return;
  
  if (activeMode === 'typing') {
    // Avoid hijacking focus when buttons or text inputs are clicked
    if (!e.target.closest('.config-bar') && 
        !e.target.closest('.mode-switcher-pill') && 
        !e.target.closest('.action-btn') && 
        !e.target.closest('.icon-btn') && 
        !e.target.closest('input')) {
      typingInput.focus();
    }
  }
});

typingInput.addEventListener('focus', () => {
  typingContainer.classList.add('focused');
});

typingInput.addEventListener('blur', () => {
  typingContainer.classList.remove('focused');
});

// --- CONFIGURATION BAR CONTROLS ---

document.getElementById('difficulty-options').addEventListener('click', (e) => {
  if (isTestRunning) return;
  if (e.target.classList.contains('config-btn')) {
    document.querySelectorAll('#difficulty-options .config-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    selectedDifficulty = e.target.getAttribute('data-difficulty');
    resetTest();
  }
});

document.getElementById('time-options').addEventListener('click', (e) => {
  if (isTestRunning) return;
  if (e.target.classList.contains('config-btn')) {
    document.querySelectorAll('#time-options .config-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    selectedTimeLimit = parseInt(e.target.getAttribute('data-time'));
    resetTest();
  }
});

document.getElementById('sound-options').addEventListener('click', (e) => {
  if (e.target.classList.contains('config-btn')) {
    document.querySelectorAll('#sound-options .config-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    selectedSound = e.target.getAttribute('data-sound');
    soundEngine.setMode(selectedSound);
    typingInput.focus();
  }
});

// --- MODE CONTROLLER EVENT LISTENERS ---

modeTypingBtn.addEventListener('click', () => {
  if (activeMode !== 'typing') switchMode('typing');
});

modeTesterBtn.addEventListener('click', () => {
  if (activeMode !== 'tester') switchMode('tester');
});

resetTesterBtn.addEventListener('click', () => {
  clearVisualKeyboardTested();
});

// --- LEADERBOARD & LOCAL STORAGE ---

function loadSavedData() {
  // Load PB Speed
  personalBestWPM = parseInt(localStorage.getItem('typepulse_best_wpm')) || 0;
  document.getElementById('best-wpm-val').textContent = personalBestWPM;

  // Load Leaderboard list
  const savedScores = localStorage.getItem('typepulse_leaderboard');
  if (savedScores) {
    leaderboard = JSON.parse(savedScores);
  } else {
    leaderboard = [];
  }
  renderLeaderboardTable();
}

function renderLeaderboardTable() {
  leaderboardTbody.innerHTML = "";
  
  if (leaderboard.length === 0) {
    leaderboardTbody.innerHTML = `
      <tr>
        <td colspan="6" class="no-data-msg">No runs logged yet. Complete a test to list!</td>
      </tr>
    `;
    return;
  }
  
  leaderboard.forEach((record, index) => {
    const tr = document.createElement('tr');
    
    let rankHtml = `${index + 1}`;
    if (index === 0) rankHtml = `<span class="rank-badge rank-1">1</span>`;
    else if (index === 1) rankHtml = `<span class="rank-badge rank-2">2</span>`;
    else if (index === 2) rankHtml = `<span class="rank-badge rank-3">3</span>`;
    
    tr.innerHTML = `
      <td>${rankHtml}</td>
      <td><strong>${escapeHTML(record.name)}</strong></td>
      <td style="font-weight:700; color:var(--accent-color);">${record.wpm}</td>
      <td>${record.accuracy}%</td>
      <td style="text-transform: capitalize;">${record.difficulty}</td>
      <td>${record.time}</td>
    `;
    leaderboardTbody.appendChild(tr);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- RESULT SUBMISSIONS ---

saveScoreBtn.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  
  if (!name) {
    submitFeedbackMsg.textContent = "Please enter a valid name!";
    submitFeedbackMsg.className = "form-feedback error";
    return;
  }
  
  const finalWpm = parseInt(resultWpm.textContent);
  const finalAccuracy = parseInt(resultAccuracy.textContent);
  
  const scoreRecord = {
    name: name,
    wpm: finalWpm,
    accuracy: finalAccuracy,
    difficulty: selectedDifficulty,
    time: selectedTimeLimit + 's',
    date: new Date().toLocaleDateString()
  };
  
  leaderboard.push(scoreRecord);
  leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
  leaderboard = leaderboard.slice(0, 10);
  
  localStorage.setItem('typepulse_leaderboard', JSON.stringify(leaderboard));
  renderLeaderboardTable();
  
  playerNameInput.disabled = true;
  saveScoreBtn.disabled = true;
  submitFeedbackMsg.textContent = "Score successfully logged!";
  submitFeedbackMsg.className = "form-feedback success";
});

clearScoresBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the leaderboard and reset all personal best metrics? This cannot be undone.")) {
    localStorage.removeItem('typepulse_leaderboard');
    localStorage.removeItem('typepulse_best_wpm');
    
    leaderboard = [];
    personalBestWPM = 0;
    
    document.getElementById('best-wpm-val').textContent = "0";
    renderLeaderboardTable();
  }
});

// --- ACTION BUTTONS EVENTS ---

restartBtn.addEventListener('click', () => {
  resetTest();
});

modalRetryBtn.addEventListener('click', () => {
  resetTest();
});

const closeModal = () => {
  resultModal.classList.remove('open');
  setTimeout(() => {
    if (activeMode === 'typing') typingInput.focus();
  }, 10);
};

modalCloseBtn.addEventListener('click', closeModal);
closeModalX.addEventListener('click', closeModal);

window.addEventListener('resize', () => {
  updateCaretPosition(false);
});

// --- INITIALIZE APPLICATION ---
window.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  soundEngine.setMode(selectedSound);
  resetTest();
});
