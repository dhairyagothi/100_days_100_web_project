// =============================================
// STATE
// =============================================
const CIRCUMFERENCE = 2 * Math.PI * 140; // r=140

let state = {
  mode: 'custom',       // custom | pomodoro | stopwatch
  status: 'idle',       // idle | running | paused | finished
  totalSeconds: 300,    // initial duration
  remaining: 300,       // current remaining
  elapsed: 0,           // for stopwatch
  interval: null,
  pomoCycle: 0,         // 0-indexed pomodoro cycle
  pomoPhase: 'work',    // work | break | longbreak
  pomoCompleted: 0,
  pomoConfig: { work: 25, shortBreak: 5, longBreak: 15, cycles: 4 },
  sessionCount: 1,
  isDark: true,
};

// Session history stored in localStorage
let sessionHistory = JSON.parse(localStorage.getItem('ft_history') || '[]');
let preferences = JSON.parse(localStorage.getItem('ft_prefs') || '{}');

// Apply saved preferences
if (preferences.theme) {
  state.isDark = preferences.theme === 'dark';
  document.documentElement.setAttribute('data-theme', preferences.theme);
  document.getElementById('themeBtn').textContent = state.isDark ? '☀️' : '🌙';
}

// =============================================
// DOM REFS
// =============================================
const $ = id => document.getElementById(id);
const els = {
  app: $('app'),
  display: $('timerDisplay'),
  modeLabel: $('modeLabel'),
  ringProgress: $('ringProgress'),
  ringDot: $('ringDot'),
  progressBarFill: $('progressBarFill'),
  progressPct: $('progressPct'),
  percentLabel: $('percentLabel'),
  sessionLabel: $('sessionLabel'),
  startPauseBtn: $('startPauseBtn'),
  resetBtn: $('resetBtn'),
  skipBtn: $('skipBtn'),
  inputHours: $('inputHours'),
  inputMinutes: $('inputMinutes'),
  inputSeconds: $('inputSeconds'),
  presets: $('presets'),
  timeInputRow: $('timeInputRow'),
  pomodoroInfo: $('pomodoroInfo'),
  pomoCompleted: $('pomoCompleted'),
  statsOverlay: $('statsOverlay'),
  keyboardOverlay: $('keyboardOverlay'),
  completionOverlay: $('completionOverlay'),
  completionTitle: $('completionTitle'),
  completionMsg: $('completionMsg'),
  completionEmoji: $('completionEmoji'),
  toast: $('toast'),
  statsGrid: $('statsGrid'),
  sessionHistoryEl: $('sessionHistory'),
  themeBtn: $('themeBtn'),
};

// =============================================
// AUDIO (Web Audio API — no file needed)
// =============================================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playBeep(freq = 440, duration = 0.3, type = 'sine', vol = 0.4) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playCompletionSound() {
  // Ascending arpeggio
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 0.4, 'triangle', 0.3), i * 150);
  });
}

function playTickSound() {
  playBeep(800, 0.05, 'square', 0.08);
}

// =============================================
// TIMER CORE
// =============================================
function startTimer() {
  if (state.status === 'finished') return;

  // If idle, read inputs (custom/stopwatch)
  if (state.status === 'idle') {
    if (state.mode === 'custom') {
      const h = parseInt(els.inputHours.value) || 0;
      const m = parseInt(els.inputMinutes.value) || 0;
      const s = parseInt(els.inputSeconds.value) || 0;
      const total = h * 3600 + m * 60 + s;
      if (total <= 0) { showToast('⚠️ Set a duration first!'); return; }
      state.totalSeconds = total;
      state.remaining = total;
    } else if (state.mode === 'pomodoro') {
      state.pomoPhase = 'work';
      state.pomoCycle = 0;
      state.totalSeconds = state.pomoConfig.work * 60;
      state.remaining = state.totalSeconds;
      updateModeLabel();
    } else if (state.mode === 'stopwatch') {
      state.elapsed = 0;
    }
  }

  state.status = 'running';
  els.app.classList.add('running');
  els.ringProgress.classList.add('running');
  updateStartPauseBtn();
  lockInputs(true);

  clearInterval(state.interval);
  state.interval = setInterval(tick, 1000);
}

function tick() {
  if (state.mode === 'stopwatch') {
    state.elapsed += 1000;
    updateStopwatchDisplay();
    return;
  }

  state.remaining--;

  // Tick sound in last 10 seconds
  if (state.remaining <= 10 && state.remaining > 0) playTickSound();

  updateDisplay();
  updateRing();
  updateProgressBar();
  updateWarningState();

  if (state.remaining <= 0) {
    handleTimerComplete();
  }
}

function pauseTimer() {
  clearInterval(state.interval);
  state.status = 'paused';
  els.app.classList.remove('running');
  els.ringProgress.classList.remove('running');
  updateStartPauseBtn();
  showToast('⏸ Paused');
}

function resetTimer() {
  clearInterval(state.interval);
  state.status = 'idle';
  state.elapsed = 0;
  els.app.classList.remove('running');
  els.ringProgress.classList.remove('running');
  els.display.classList.remove('warning', 'danger');

  if (state.mode === 'custom') {
    const h = parseInt(els.inputHours.value) || 0;
    const m = parseInt(els.inputMinutes.value) || 0;
    const s = parseInt(els.inputSeconds.value) || 0;
    state.totalSeconds = h * 3600 + m * 60 + s || 300;
    state.remaining = state.totalSeconds;
  } else if (state.mode === 'pomodoro') {
    state.pomoPhase = 'work';
    state.pomoCycle = 0;
    state.totalSeconds = state.pomoConfig.work * 60;
    state.remaining = state.totalSeconds;
    updateModeLabel();
  } else {
    state.remaining = state.totalSeconds;
  }

  updateDisplay();
  updateRing();
  updateProgressBar();
  lockInputs(false);
  updateStartPauseBtn();
}

function skipTime() {
  if (state.mode === 'stopwatch') {
    state.elapsed += 15000;
    updateStopwatchDisplay();
    return;
  }
  if (state.status !== 'running') return;
  state.remaining = Math.max(0, state.remaining - 15);
  updateDisplay();
  updateRing();
  updateProgressBar();
  showToast('⏩ Skipped 15s');
}

function handleTimerComplete() {
  clearInterval(state.interval);
  state.status = 'finished';
  els.app.classList.remove('running');
  els.ringProgress.classList.remove('running');
  playCompletionSound();

  // Save session
  const session = {
    type: state.mode === 'pomodoro' ? `Pomodoro ${state.pomoPhase}` : 'Custom',
    duration: formatSeconds(state.totalSeconds),
    completedAt: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  sessionHistory.unshift(session);
  state.sessionCount++;
  els.sessionLabel.textContent = `Session ${state.sessionCount}`;
  if (sessionHistory.length > 50) sessionHistory.pop();
  localStorage.setItem('ft_history', JSON.stringify(sessionHistory));

  // Pomodoro auto-advance
  if (state.mode === 'pomodoro') {
    handlePomoAdvance();
    return;
  }

  showCompletion('🎉', "Time's Up!", 'Great work! Session complete.');
  updateRing(0);
  els.display.classList.remove('warning', 'danger');
}

// =============================================
// POMODORO LOGIC
// =============================================
function handlePomoAdvance() {
  if (state.pomoPhase === 'work') {
    state.pomoCompleted++;
    $('pomoCompleted').textContent = state.pomoCompleted;
    state.pomoCycle++;

    if (state.pomoCycle >= state.pomoConfig.cycles) {
      // Long break
      state.pomoPhase = 'longbreak';
      state.totalSeconds = state.pomoConfig.longBreak * 60;
      showCompletion('☕', 'Long Break!', `${state.pomoConfig.cycles} cycles done! Take a ${state.pomoConfig.longBreak} min break.`);
    } else {
      state.pomoPhase = 'break';
      state.totalSeconds = state.pomoConfig.shortBreak * 60;
      showCompletion('😌', 'Short Break!', `Cycle ${state.pomoCycle}/${state.pomoConfig.cycles} done! Rest for ${state.pomoConfig.shortBreak} min.`);
    }
  } else if (state.pomoPhase === 'break') {
    state.pomoPhase = 'work';
    state.totalSeconds = state.pomoConfig.work * 60;
    showCompletion('💪', 'Back to Work!', 'Break over. Stay focused!');
  } else {
    // Long break done — full reset
    state.pomoCycle = 0;
    state.pomoPhase = 'work';
    state.pomoCompleted = 0;
    state.totalSeconds = state.pomoConfig.work * 60;
    $('pomoCompleted').textContent = 0;
    showCompletion('🏆', 'Session Complete!', `All ${state.pomoConfig.cycles} pomodoro cycles finished!`);
  }

  state.remaining = state.totalSeconds;
  updateModeLabel();
  updateDisplay();
  updateRing(0);
}

// =============================================
// DISPLAY UPDATES
// =============================================
function updateDisplay() {
  els.display.textContent = formatSeconds(state.remaining);
}

function updateStopwatchDisplay() {
  const ms = state.elapsed;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  els.display.textContent = h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

function updateRing(overridePct) {
  const pct = overridePct !== undefined
    ? overridePct
    : state.totalSeconds > 0
      ? (state.totalSeconds - state.remaining) / state.totalSeconds
      : 0;

  const offset = CIRCUMFERENCE * (1 - pct);
  els.ringProgress.style.strokeDashoffset = offset;

  // Move dot along ring
  const angle = pct * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const cx = 160 + 140 * Math.cos(rad);
  const cy = 160 + 140 * Math.sin(rad);
  els.ringDot.setAttribute('cx', cx);
  els.ringDot.setAttribute('cy', cy);
}

function updateProgressBar() {
  const pct = state.totalSeconds > 0
    ? Math.round(((state.totalSeconds - state.remaining) / state.totalSeconds) * 100)
    : 0;
  els.progressBarFill.style.width = pct + '%';
  els.progressPct.textContent = pct + '%';
  els.percentLabel.textContent = pct + '%';
}

function updateWarningState() {
  const pct = state.remaining / state.totalSeconds;
  els.display.classList.remove('warning', 'danger');
  if (pct <= 0.1) els.display.classList.add('danger');
  else if (pct <= 0.25) els.display.classList.add('warning');
}

function updateModeLabel() {
  const labels = {
    work: 'FOCUS',
    break: 'SHORT BREAK',
    longbreak: 'LONG BREAK',
    custom: 'COUNTDOWN',
    stopwatch: 'STOPWATCH'
  };
  if (state.mode === 'pomodoro') {
    els.modeLabel.textContent = labels[state.pomoPhase] || 'FOCUS';
  } else {
    els.modeLabel.textContent = labels[state.mode] || 'FOCUS';
  }
}

function updateStartPauseBtn() {
  if (state.status === 'running') {
    els.startPauseBtn.textContent = '⏸ Pause';
    els.startPauseBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  } else {
    els.startPauseBtn.textContent = '▶ Start';
    els.startPauseBtn.style.background = '';
  }
}

function lockInputs(lock) {
  els.inputHours.disabled = lock;
  els.inputMinutes.disabled = lock;
  els.inputSeconds.disabled = lock;
  document.querySelectorAll('.preset-btn').forEach(b => b.disabled = lock);
}

// =============================================
// MODE SWITCHING
// =============================================
function switchMode(mode) {
  if (state.status === 'running') pauseTimer();

  state.mode = mode;
  state.status = 'idle';
  state.elapsed = 0;
  clearInterval(state.interval);
  els.display.classList.remove('warning', 'danger');

  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

  // Show/hide UI sections
  els.timeInputRow.style.display = (mode === 'stopwatch') ? 'none' : '';
  els.presets.style.display = (mode === 'stopwatch') ? 'none' : '';
  els.skipBtn.textContent = mode === 'stopwatch' ? '+15s' : '+15s';
  els.pomodoroInfo.classList.toggle('hidden', mode !== 'pomodoro');

  if (mode === 'pomodoro') {
    state.pomoPhase = 'work';
    state.pomoCycle = 0;
    state.pomoCompleted = 0;
    state.totalSeconds = state.pomoConfig.work * 60;
    state.remaining = state.totalSeconds;
    $('pomoCompleted').textContent = 0;
  } else if (mode === 'stopwatch') {
    state.totalSeconds = 0;
    state.remaining = 0;
    els.display.textContent = '00:00';
  } else {
    const h = parseInt(els.inputHours.value) || 0;
    const m = parseInt(els.inputMinutes.value) || 0;
    const s = parseInt(els.inputSeconds.value) || 0;
    state.totalSeconds = h * 3600 + m * 60 + s || 300;
    state.remaining = state.totalSeconds;
  }

  updateModeLabel();
  updateDisplay();
  updateRing(0);
  updateProgressBar();
  lockInputs(false);
  updateStartPauseBtn();
}

// =============================================
// PRESETS
// =============================================
document.querySelectorAll('.preset-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (state.status === 'running') return;
    const secs = parseInt(btn.dataset.seconds);
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    els.inputHours.value = h;
    els.inputMinutes.value = m;
    els.inputSeconds.value = s;
    state.totalSeconds = secs;
    state.remaining = secs;
    updateDisplay();
    updateRing(0);
    updateProgressBar();
    playBeep(600, 0.1, 'sine', 0.2);
  });
});

// Keyboard shortcut: keys 1-7 for presets
// handled in keydown below

// =============================================
// MODE TABS
// =============================================
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

// =============================================
// CONTROLS
// =============================================
els.startPauseBtn.addEventListener('click', () => {
  if (state.status === 'running') pauseTimer();
  else startTimer();
});

els.resetBtn.addEventListener('click', resetTimer);
els.skipBtn.addEventListener('click', skipTime);

// Input change → update state
[els.inputHours, els.inputMinutes, els.inputSeconds].forEach(inp => {
  inp.addEventListener('change', () => {
    if (state.status !== 'idle') return;
    const h = parseInt(els.inputHours.value) || 0;
    const m = parseInt(els.inputMinutes.value) || 0;
    const s = parseInt(els.inputSeconds.value) || 0;
    state.totalSeconds = h * 3600 + m * 60 + s;
    state.remaining = state.totalSeconds;
    updateDisplay();
    updateRing(0);
    updateProgressBar();
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  });
});

// =============================================
// HEADER BUTTONS
// =============================================
els.themeBtn.addEventListener('click', () => {
  state.isDark = !state.isDark;
  const theme = state.isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  els.themeBtn.textContent = state.isDark ? '☀️' : '🌙';
  preferences.theme = theme;
  localStorage.setItem('ft_prefs', JSON.stringify(preferences));
  showToast(state.isDark ? '🌙 Dark mode' : '☀️ Light mode');
});

$('fullscreenBtn').addEventListener('click', toggleFullscreen);
$('statsBtn').addEventListener('click', openStats);
$('keyboardBtn').addEventListener('click', () => {
  $('keyboardOverlay').classList.remove('hidden');
});

// =============================================
// FULLSCREEN
// =============================================
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.body.classList.add('fullscreen-mode');
    $('fullscreenBtn').textContent = '⛶';
  } else {
    document.exitFullscreen();
    document.body.classList.remove('fullscreen-mode');
  }
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove('fullscreen-mode');
  }
});

// =============================================
// STATS
// =============================================
function openStats() {
  const total = sessionHistory.length;
  const totalFocusMs = sessionHistory
    .filter(s => s.type.includes('Focus') || s.type === 'Custom')
    .reduce((sum, s) => {
      const parts = s.duration.split(':').map(Number);
      const secs = parts.length === 3
        ? parts[0]*3600 + parts[1]*60 + parts[2]
        : parts[0]*60 + parts[1];
      return sum + secs;
    }, 0);

  const pomoSessions = sessionHistory.filter(s => s.type.includes('Pomodoro')).length;

  els.statsGrid.innerHTML = [
    ['📅', 'Total Sessions', total],
    ['⏱', 'Focus Time', formatSeconds(totalFocusMs)],
    ['🍅', 'Pomodoros', pomoSessions],
    ['🔥', 'Today', sessionHistory.filter(s => {
      const d = new Date(s.timestamp);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length],
  ].map(([icon, lbl, val]) => `
    <div class="stat-card">
      <span style="font-size:1.5rem;">${icon}</span>
      <span class="stat-val">${val}</span>
      <span class="stat-lbl">${lbl}</span>
    </div>
  `).join('');

  els.sessionHistoryEl.innerHTML = sessionHistory.length === 0
    ? '<p style="color:var(--text-2);font-size:0.85rem;text-align:center;padding:20px;">No sessions yet.</p>'
    : sessionHistory.slice(0, 10).map(s => `
      <div class="session-item">
        <div>
          <span class="si-type">${s.type}</span>
          <div style="font-size:0.8rem;color:var(--text);margin-top:2px;">${s.duration}</div>
        </div>
        <span class="si-time">${s.completedAt}</span>
      </div>
    `).join('');

  els.statsOverlay.classList.remove('hidden');
}

function exportHistory() {
  const csv = ['Type,Duration,Completed At']
    .concat(sessionHistory.map(s => `${s.type},${s.duration},${s.completedAt}`))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'focus-sessions.csv';
  a.click();
  showToast('⬇️ Exported!');
}

function clearHistory() {
  sessionHistory = [];
  localStorage.removeItem('ft_history');
  openStats();
  showToast('🗑️ History cleared');
}

// =============================================
// COMPLETION
// =============================================
function showCompletion(emoji, title, msg) {
  els.completionEmoji.textContent = emoji;
  els.completionTitle.textContent = title;
  els.completionMsg.textContent = msg;
  els.completionOverlay.classList.remove('hidden');
}

function closeCompletion() {
  els.completionOverlay.classList.add('hidden');
  state.status = 'idle';
  updateStartPauseBtn();
}

function restartTimer() {
  closeCompletion();
  resetTimer();
  startTimer();
}

// =============================================
// PANEL CLOSE
// =============================================
function closePanel(id) {
  $(id).classList.add('hidden');
}

// Click outside panel to close
['statsOverlay','keyboardOverlay'].forEach(id => {
  $(id).addEventListener('click', e => {
    if (e.target === $(id)) closePanel(id);
  });
});

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', e => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  switch(e.key) {
    case ' ':
    case 'Space':
      e.preventDefault();
      if (state.status === 'running') pauseTimer();
      else startTimer();
      break;
    case 'r': case 'R': resetTimer(); break;
    case 'f': case 'F': toggleFullscreen(); break;
    case 't': case 'T': els.themeBtn.click(); break;
    case 's': case 'S': skipTime(); break;
    case 'Escape':
      closePanel('statsOverlay');
      closePanel('keyboardOverlay');
      closeCompletion();
      break;
    case '1': case '2': case '3': case '4': case '5': case '6': case '7':
      const idx = parseInt(e.key) - 1;
      const presetBtns = document.querySelectorAll('.preset-btn');
      if (presetBtns[idx]) presetBtns[idx].click();
      break;
  }
});

// =============================================
// TOAST
// =============================================
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.remove('hidden');
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
    setTimeout(() => els.toast.classList.add('hidden'), 300);
  }, 2000);
}

// =============================================
// HELPERS
// =============================================
function formatSeconds(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}

function pad(n) { return String(n).padStart(2, '0'); }

// =============================================
// INIT
// =============================================
function init() {
  // Set ring circumference
  els.ringProgress.style.strokeDasharray = CIRCUMFERENCE;
  els.ringProgress.style.strokeDashoffset = CIRCUMFERENCE;

  // Load saved preferences
  if (preferences.lastMode) switchMode(preferences.lastMode);
  if (preferences.lastDuration) {
    const d = preferences.lastDuration;
    els.inputHours.value = Math.floor(d / 3600);
    els.inputMinutes.value = Math.floor((d % 3600) / 60);
    els.inputSeconds.value = d % 60;
    state.totalSeconds = d;
    state.remaining = d;
  }

  updateDisplay();
  updateRing(0);
  updateProgressBar();
  updateModeLabel();

  // Save mode/duration preference on change
  document.querySelectorAll('.mode-tab').forEach(t => {
    t.addEventListener('click', () => {
      preferences.lastMode = t.dataset.mode;
      localStorage.setItem('ft_prefs', JSON.stringify(preferences));
    });
  });

  [els.inputHours, els.inputMinutes, els.inputSeconds].forEach(inp => {
    inp.addEventListener('change', () => {
      const h = parseInt(els.inputHours.value)||0;
      const m = parseInt(els.inputMinutes.value)||0;
      const s = parseInt(els.inputSeconds.value)||0;
      preferences.lastDuration = h*3600+m*60+s;
      localStorage.setItem('ft_prefs', JSON.stringify(preferences));
    });
  });

  // Session counter update
  setInterval(() => {
    if (state.status === 'running' && state.mode !== 'pomodoro') {
      els.sessionLabel.textContent = `Session ${state.sessionCount}`;
    }
  }, 1000);
}

init();
