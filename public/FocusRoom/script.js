/* ============================================================
   FOCUSROOM — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE_KEYS = {
  settings : 'focusroom_settings',
  history  : 'focusroom_history',
  tasks    : 'focusroom_tasks'
};

const MODES = {
  custom    : { label: 'Focus',       minutes: 25 },
  pomodoro  : { label: 'Pomodoro',    minutes: 25 },
  shortbreak: { label: 'Short Break', minutes: 5  },
  longbreak : { label: 'Long Break',  minutes: 15 }
};

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "It's not always that we need to do more but rather that we need to focus on less.", author: "Nathan W. Morris" },
  { text: "Concentrate all your thoughts upon the work in hand.", author: "Alexander Graham Bell" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "One thing at a time. Most important thing first. Start now.", author: "Peter Drucker" },
  { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
];

const CIRCUMFERENCE = 2 * Math.PI * 88; // r=88

// ── State ──────────────────────────────────────────────────────
let settings = {
  theme    : 'dark',
  streak   : 0,
  lastDate : null,
  totalSessions: 0
};
let history = [];
let tasks   = [];

let timerInterval = null;
let totalSeconds  = 25 * 60;
let remainSeconds = 25 * 60;
let isRunning     = false;
let currentMode   = 'custom';
let pomCycles     = 0;
let pomPhase      = 'focus'; // 'focus' | 'shortbreak' | 'longbreak'
let activeSound   = null;
let audioCtx      = null;
let gainNode      = null;
let soundSource   = null;
let volume        = 0.5;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadAll();
  applyTheme();
  renderStats();
  renderHistory();
  renderTasks();
  loadQuote();
  setMode('custom');
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────
function loadAll() {
  try {
    settings = { ...settings, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}') };
    history  = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
    tasks    = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks)   || '[]');
  } catch(e) {}
  $('volumeSlider').value = settings.volume ?? 0.5;
  volume = settings.volume ?? 0.5;
}

function saveSettings() { localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings)); }
function saveHistory()  { localStorage.setItem(STORAGE_KEYS.history,  JSON.stringify(history));  }
function saveTasks()    { localStorage.setItem(STORAGE_KEYS.tasks,     JSON.stringify(tasks));    }

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  const icon = $('themeToggle').querySelector('i');
  icon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('resetAllBtn').addEventListener('click', resetAllData);

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Duration
  $('durMinus').addEventListener('click', () => adjustDuration(-1));
  $('durPlus').addEventListener('click',  () => adjustDuration(1));
  $('durationInput').addEventListener('change', () => {
    const v = Math.max(1, Math.min(180, parseInt($('durationInput').value) || 25));
    $('durationInput').value = v;
    if(!isRunning) resetTimer(v);
  });

  // Timer controls
  $('startBtn').addEventListener('click', toggleTimer);
  $('resetBtn').addEventListener('click', () => { stopTimer(); resetTimer(); });
  $('skipBtn').addEventListener('click',  skipPhase);

  // Sound
  document.querySelectorAll('.sound-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleSound(btn.dataset.sound, btn));
  });
  $('volumeSlider').addEventListener('input', e => {
    volume = parseFloat(e.target.value);
    if(gainNode) gainNode.gain.value = volume;
    settings.volume = volume;
    saveSettings();
  });

  // Quote
  $('refreshQuote').addEventListener('click', loadQuote);

  // Tasks
  $('addTaskBtn').addEventListener('click', addTask);
  $('taskInput').addEventListener('keydown', e => { if(e.key === 'Enter') addTask(); });
  $('clearTasks').addEventListener('click', clearCompletedTasks);

  // History
  $('clearHistory').addEventListener('click', clearHistory);

  // Modal
  $('modalClose').addEventListener('click', () => {
    $('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  });
}

// ── Mode ───────────────────────────────────────────────────────
function setMode(mode) {
  if(isRunning) { stopTimer(); }
  currentMode = mode;

  document.querySelectorAll('.mode-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });

  const customDiv = $('customDuration');
  const pomDiv    = $('pomodoroInfo');

  if(mode === 'custom') {
    customDiv.classList.remove('hidden');
    pomDiv.classList.add('hidden');
    const mins = parseInt($('durationInput').value) || 25;
    resetTimer(mins);
  } else if(mode === 'pomodoro') {
    customDiv.classList.add('hidden');
    pomDiv.classList.remove('hidden');
    pomPhase = 'focus';
    updatePomodoroPhase();
    resetTimer(25);
  } else if(mode === 'shortbreak') {
    customDiv.classList.add('hidden');
    pomDiv.classList.add('hidden');
    resetTimer(5);
  } else if(mode === 'longbreak') {
    customDiv.classList.add('hidden');
    pomDiv.classList.add('hidden');
    resetTimer(15);
  }

  updateRingColor(mode);
}

function updatePomodoroPhase() {
  const phaseEl = $('pomPhase');
  if(pomPhase === 'focus') {
    phaseEl.textContent = '🎯 Focus Session';
    phaseEl.style.borderColor = 'var(--accent)';
    phaseEl.style.color = 'var(--accent2)';
  } else if(pomPhase === 'shortbreak') {
    phaseEl.textContent = '☕ Short Break';
    phaseEl.style.borderColor = 'var(--success)';
    phaseEl.style.color = 'var(--success)';
  } else {
    phaseEl.textContent = '🛋️ Long Break';
    phaseEl.style.borderColor = 'var(--warning)';
    phaseEl.style.color = 'var(--warning)';
  }
  $('pomCycleCount').textContent = pomCycles;
}

function updateRingColor(mode) {
  const ring = $('timerRing');
  if(mode === 'pomodoro' || mode === 'custom') ring.style.stroke = 'var(--accent)';
  else if(mode === 'shortbreak') ring.style.stroke = 'var(--success)';
  else ring.style.stroke = 'var(--warning)';
}

function adjustDuration(delta) {
  if(isRunning) return;
  let val = parseInt($('durationInput').value) || 25;
  val = Math.max(1, Math.min(180, val + delta));
  $('durationInput').value = val;
  resetTimer(val);
}

// ── Timer ──────────────────────────────────────────────────────
function toggleTimer() {
  if(isRunning) pauseTimer();
  else startTimer();
}

function startTimer() {
  isRunning = true;
  const btn = $('startBtn');
  btn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
  $('timerLabel').textContent = getModeLabel();
  $('timerLabel').style.color = 'var(--accent2)';
  $('phaseDot').style.background = 'var(--success)';

  timerInterval = setInterval(() => {
    remainSeconds--;
    updateTimerDisplay();
    updateRing();
    updateTabTitle();
    if(remainSeconds <= 0) onTimerEnd();
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  const btn = $('startBtn');
  btn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
  $('timerLabel').textContent = 'Paused';
  $('timerLabel').style.color = 'var(--warning)';
  $('phaseDot').style.background = 'var(--warning)';
  showToast('Timer paused.', 'info');
}

function stopTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  const btn = $('startBtn');
  btn.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
  $('timerLabel').textContent = 'Ready to Focus';
  $('timerLabel').style.color = 'var(--text2)';
  $('phaseDot').style.background = 'var(--success)';
  document.title = 'FocusRoom | Stay in the Zone';
}

function resetTimer(mins) {
  stopTimer();
  const m = mins || (currentMode === 'custom'
    ? parseInt($('durationInput').value) || 25
    : MODES[currentMode].minutes);
  totalSeconds  = m * 60;
  remainSeconds = m * 60;
  updateTimerDisplay();
  updateRing();
}

function onTimerEnd() {
  stopTimer();
  playAlertSound();
  const mins    = Math.round((totalSeconds) / 60);
  const tag     = $('sessionTag').value.trim() || getModeLabel();
  const isBreak = currentMode === 'shortbreak' || currentMode === 'longbreak' ||
                  (currentMode === 'pomodoro' && pomPhase !== 'focus');

  // Log to history
  if(!isBreak || currentMode !== 'pomodoro') {
    logSession(tag, mins, currentMode);
  }

  // Pomodoro cycle logic
  if(currentMode === 'pomodoro') {
    if(pomPhase === 'focus') {
      pomCycles++;
      pomPhase = pomCycles % 4 === 0 ? 'longbreak' : 'shortbreak';
      const breakMins = pomCycles % 4 === 0 ? 15 : 5;
      updatePomodoroPhase();
      setTimeout(() => { resetTimer(breakMins); startTimer(); }, 1500);
    } else {
      pomPhase = 'focus';
      updatePomodoroPhase();
      setTimeout(() => { resetTimer(25); startTimer(); }, 1500);
    }
    return;
  }

  showCompletionModal(mins, tag);
}

function skipPhase() {
  if(currentMode !== 'pomodoro') { stopTimer(); resetTimer(); return; }
  stopTimer();
  if(pomPhase === 'focus') {
    pomCycles++;
    pomPhase = pomCycles % 4 === 0 ? 'longbreak' : 'shortbreak';
    resetTimer(pomCycles % 4 === 0 ? 15 : 5);
  } else {
    pomPhase = 'focus';
    resetTimer(25);
  }
  updatePomodoroPhase();
  showToast('Phase skipped.', 'info');
}

function getModeLabel() {
  if(currentMode === 'pomodoro') return pomPhase === 'focus' ? 'Pomodoro Focus' : 'Pomodoro Break';
  return MODES[currentMode]?.label || 'Focus';
}

function updateTimerDisplay() {
  const m = Math.floor(remainSeconds / 60).toString().padStart(2,'0');
  const s = (remainSeconds % 60).toString().padStart(2,'0');
  $('timerDisplay').textContent = `${m}:${s}`;
}

function updateRing() {
  const pct    = remainSeconds / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - pct);
  $('timerRing').style.strokeDasharray  = CIRCUMFERENCE;
  $('timerRing').style.strokeDashoffset = offset;
}

function updateTabTitle() {
  const m = Math.floor(remainSeconds / 60).toString().padStart(2,'0');
  const s = (remainSeconds % 60).toString().padStart(2,'0');
  document.title = `${m}:${s} — FocusRoom`;
}

// ── Alert Sound ────────────────────────────────────────────────
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.9);
  } catch(e) {}
}

// ── Ambient Sounds ─────────────────────────────────────────────
function toggleSound(type, btn) {
  if(activeSound === type) {
    stopSound();
    btn.classList.remove('active');
    activeSound = null;
    showToast('Sound stopped.', 'info');
    return;
  }
  stopSound();
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeSound = type;
  startSound(type);
  showToast(`Playing ${type} sounds 🎵`, 'success');
}

function startSound(type) {
  try {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    gainNode  = audioCtx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioCtx.destination);
    generateNoise(type);
  } catch(e) {
    showToast('Audio not supported in this browser.', 'error');
  }
}

function generateNoise(type) {
  const bufferSize = audioCtx.sampleRate * 3;
  const buffer     = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data       = buffer.getChannelData(0);

  for(let i = 0; i < bufferSize; i++) {
    if(type === 'white' || type === 'rain' || type === 'waves') {
      data[i] = (Math.random() * 2 - 1);
    } else if(type === 'forest') {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    } else if(type === 'fire' || type === 'lofi') {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
  }

  // Apply filters per type
  const filter = audioCtx.createBiquadFilter();
  if(type === 'rain')   { filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 0.5; }
  if(type === 'waves')  { filter.type = 'lowpass';  filter.frequency.value = 600;  }
  if(type === 'forest') { filter.type = 'bandpass'; filter.frequency.value = 800;  filter.Q.value = 1;   }
  if(type === 'fire')   { filter.type = 'lowpass';  filter.frequency.value = 400;  }
  if(type === 'white')  { filter.type = 'allpass';  }
  if(type === 'lofi')   { filter.type = 'lowpass';  filter.frequency.value = 2000; }

  soundSource = audioCtx.createBufferSource();
  soundSource.buffer = buffer;
  soundSource.loop   = true;
  soundSource.connect(filter);
  filter.connect(gainNode);
  soundSource.start();
}

function stopSound() {
  try {
    if(soundSource) { soundSource.stop(); soundSource = null; }
    if(audioCtx)    { audioCtx.close();   audioCtx = null;   }
    gainNode = null;
  } catch(e) {}
}

// ── Session Logging ────────────────────────────────────────────
function logSession(name, minutes, mode) {
  const session = {
    id    : '_' + Math.random().toString(36).slice(2,9),
    name  : name || 'Focus Session',
    minutes,
    mode,
    date  : new Date().toISOString()
  };
  history.unshift(session);
  if(history.length > 50) history.pop();
  saveHistory();

  // Update settings
  settings.totalSessions = (settings.totalSessions || 0) + 1;
  updateStreak();
  saveSettings();
  renderStats();
  renderHistory();
}

function updateStreak() {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if(settings.lastDate === today) return;
  if(settings.lastDate === yesterday) settings.streak = (settings.streak || 0) + 1;
  else if(settings.lastDate !== today) settings.streak = 1;
  settings.lastDate = today;
}

// ── Stats ──────────────────────────────────────────────────────
function renderStats() {
  $('streakCount').textContent   = settings.streak || 0;
  $('totalSessions').textContent = settings.totalSessions || 0;

  const today = new Date().toDateString();
  const todayMins = history
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((sum, s) => sum + s.minutes, 0);
  $('todayTime').textContent = todayMins >= 60
    ? `${Math.floor(todayMins/60)}h ${todayMins%60}m`
    : `${todayMins}m`;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekMins = history
    .filter(s => new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.minutes, 0);
  $('weeklyTime').textContent = weekMins >= 60
    ? `${Math.floor(weekMins/60)}h ${weekMins%60}m`
    : `${weekMins}m`;
}

// ── History ────────────────────────────────────────────────────
function renderHistory() {
  const list  = $('historyList');
  const empty = $('historyEmpty');
  list.querySelectorAll('.history-item').forEach(i => i.remove());

  if(history.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  history.slice(0, 20).forEach(s => {
    const el  = document.createElement('div');
    el.className = 'history-item';
    const dotClass = s.mode === 'shortbreak' || s.mode === 'longbreak'
      ? 'dot-break' : s.mode === 'pomodoro' ? 'dot-focus' : 'dot-custom';
    const dateStr = new Date(s.date).toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const timeStr = new Date(s.date).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

    el.innerHTML = `
      <div class="history-dot ${dotClass}"></div>
      <div class="history-info">
        <div class="history-name">${escapeHTML(s.name)}</div>
        <div class="history-meta">${dateStr} · ${timeStr}</div>
      </div>
      <div class="history-dur">${s.minutes} min</div>
    `;
    list.appendChild(el);
  });
}

function clearHistory() {
  if(!confirm('Clear all session history?')) return;
  history = []; saveHistory();
  renderHistory(); renderStats();
  showToast('History cleared.', 'info');
}

// ── Tasks ──────────────────────────────────────────────────────
function addTask() {
  const input = $('taskInput');
  const text  = input.value.trim();
  if(!text) return;

  tasks.unshift({ id: '_' + Date.now(), text, done: false });
  saveTasks(); renderTasks();
  input.value = '';
  showToast('Task added!', 'success');
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if(t) { t.done = !t.done; saveTasks(); renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(t => !t.done);
  saveTasks(); renderTasks();
  showToast('Completed tasks cleared.', 'info');
}

function renderTasks() {
  const list  = $('taskList');
  const empty = $('taskEmpty');
  list.querySelectorAll('.task-item').forEach(i => i.remove());

  const done  = tasks.filter(t => t.done).length;
  $('taskCount').textContent = `${done}/${tasks.length}`;

  if(tasks.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `task-item${t.done ? ' done' : ''}`;
    li.innerHTML = `
      <div class="task-check" data-id="${t.id}"></div>
      <span class="task-text">${escapeHTML(t.text)}</span>
      <button class="task-del" data-id="${t.id}" title="Delete"><i class="fas fa-times"></i></button>
    `;
    li.querySelector('.task-check').addEventListener('click', () => toggleTask(t.id));
    li.querySelector('.task-del').addEventListener('click',   () => deleteTask(t.id));
    list.appendChild(li);
  });
}

// ── Quote ──────────────────────────────────────────────────────
function loadQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  $('quoteText').textContent   = `"${q.text}"`;
  $('quoteAuthor').textContent = `— ${q.author}`;
}

// ── Completion Modal ───────────────────────────────────────────
function showCompletionModal(mins, tag) {
  $('modalSub').textContent    = `Great work! You completed a ${mins} min ${tag} session.`;
  $('modalStreak').textContent = settings.streak || 1;

  const today = new Date().toDateString();
  const todaySessions = history.filter(s => new Date(s.date).toDateString() === today).length;
  $('modalTotal').textContent  = todaySessions;

  $('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Reset All ──────────────────────────────────────────────────
function resetAllData() {
  if(!confirm('Reset all FocusRoom data? This cannot be undone.')) return;
  history  = []; tasks = [];
  settings = { theme: settings.theme, streak: 0, lastDate: null, totalSessions: 0 };
  saveHistory(); saveTasks(); saveSettings();
  stopTimer(); resetTimer(25); stopSound();
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
  activeSound = null;
  renderStats(); renderHistory(); renderTasks();
  showToast('All data reset.', 'error');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle' :
    type === 'error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  const t = $('toast');
  t.className = `toast ${type} show`;
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Helpers ────────────────────────────────────────────────────
function escapeHTML(str) {
  const el = document.createElement('div');
  el.textContent = str || '';
  return el.innerHTML;
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);