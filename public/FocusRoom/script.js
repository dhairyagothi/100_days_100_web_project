/**
 * FocusForge — Pomodoro Focus Timer with Advanced Analytics
 * script.js
 *
 * Architecture: IIFE modules with a shared State object.
 */

'use strict';

/* ============================================================
   STATE — single source of truth
   ============================================================ */
const State = (() => {
  const DEFAULTS = {
    focusDuration : 25,
    breakDuration : 5,
    currentMode   : 'focus',
    sessionCount  : 0,
    theme         : 'dark',
    autoSwitch    : true,
    soundEnabled  : true,
    browserNotif  : false,
  };

  let _state = { ...DEFAULTS };

  return {
    get   : (k)    => _state[k],
    set   : (k, v) => { _state[k] = v; },
    merge : (obj)  => { _state = { ...DEFAULTS, ..._state, ...obj }; },
  };
})();

/* ============================================================
   STORAGE — LocalStorage persistence
   ============================================================ */
const Storage = (() => {
  const KEY = 'focusforge_v2';

  function save() {
    try {
      const payload = {
        focusDuration : State.get('focusDuration'),
        breakDuration : State.get('breakDuration'),
        sessionCount  : State.get('sessionCount'),
        theme         : State.get('theme'),
        autoSwitch    : State.get('autoSwitch'),
        soundEnabled  : State.get('soundEnabled'),
        browserNotif  : State.get('browserNotif'),
        stats         : Stats.getData(),
      };
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;

      const data = JSON.parse(raw);

      ['focusDuration', 'breakDuration'].forEach(k => {
        const v = Number(data[k]);
        if (Number.isInteger(v) && v >= 1 && v <= 99) State.set(k, v);
      });

      const sc = Number(data.sessionCount);
      if (Number.isInteger(sc) && sc >= 0) State.set('sessionCount', sc);

      if (data.theme === 'dark' || data.theme === 'light') State.set('theme', data.theme);

      ['autoSwitch', 'soundEnabled', 'browserNotif'].forEach(k => {
        if (typeof data[k] === 'boolean') State.set(k, data[k]);
      });

      if (data.stats) {
        Stats.importData(data.stats);
      }
    } catch (_) {}
  }

  return { save, load };
})();

/* ============================================================
   STATS — Analytics Module
   ============================================================ */
const Stats = (() => {
  let _data = {
    sessions: [],
    dailyFocus: 0,
    totalFocus: 0,
  };

  function getData() { return _data; }

  function importData(data) {
    if (data.sessions) _data.sessions = data.sessions;
    if (data.dailyFocus) _data.dailyFocus = data.dailyFocus;
    if (data.totalFocus) _data.totalFocus = data.totalFocus;
  }

  function recordSession(duration) {
    const now = new Date();
    const session = {
      date: now.toISOString().split('T')[0],
      timestamp: now.toISOString(),
      duration: duration,
      hour: now.getHours(),
      day: now.getDay(),
    };

    _data.sessions.push(session);

    const today = session.date;
    const todaySessions = _data.sessions.filter(s => s.date === today);
    _data.dailyFocus = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    _data.totalFocus = _data.sessions.reduce((sum, s) => sum + s.duration, 0);

    Storage.save();
    updateStatsDisplay();
    updateChart();
    updateHeatmap();
    updateProductiveHours();
  }

  function getStreak() {
    if (_data.sessions.length === 0) return 0;

    const dates = _data.sessions.map(s => s.date);
    const uniqueDates = [...new Set(dates)].sort();

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if today has sessions
    const todayStr = currentDate.toISOString().split('T')[0];
    const hasToday = uniqueDates.includes(todayStr);

    if (!hasToday) {
      // Check yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  function getFocusScore() {
    if (_data.sessions.length === 0) return 0;

    const streak = getStreak();
    const totalSessions = _data.sessions.length;
    const avgDuration = _data.totalFocus / totalSessions / 60;

    // Score components
    const streakScore = Math.min(streak * 10, 40);
    const consistencyScore = Math.min(totalSessions * 2, 30);
    const durationScore = Math.min(avgDuration / 25 * 30, 30);

    return Math.round(Math.min(streakScore + consistencyScore + durationScore, 100));
  }

  function getCompareData() {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekSessions = _data.sessions.filter(s => {
      const date = new Date(s.date);
      return date >= thisWeekStart && date < today;
    });

    const lastWeekSessions = _data.sessions.filter(s => {
      const date = new Date(s.date);
      return date >= lastWeekStart && date < thisWeekStart;
    });

    const thisWeekMinutes = Math.round(thisWeekSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
    const lastWeekMinutes = Math.round(lastWeekSessions.reduce((sum, s) => sum + s.duration, 0) / 60);

    const change = lastWeekMinutes > 0
      ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
      : thisWeekMinutes > 0 ? 100 : 0;

    return {
      thisWeek: thisWeekMinutes,
      lastWeek: lastWeekMinutes,
      change: change,
    };
  }

  function exportCSV() {
    if (_data.sessions.length === 0) {
      alert('No data to export! Complete some focus sessions first.');
      return;
    }

    const headers = ['Date', 'Time', 'Duration (min)', 'Hour'];
    const rows = _data.sessions.map(s => [
      s.date,
      new Date(s.timestamp).toLocaleTimeString(),
      Math.round(s.duration / 60),
      s.hour + ':00',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusforge_stats_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    getData,
    importData,
    recordSession,
    getStreak,
    getFocusScore,
    getCompareData,
    exportCSV,
  };
})();

/* ============================================================
   AUDIO ENGINE — Web Audio API
   ============================================================ */
const AudioEngine = (() => {
  let _ctx = null;

  function _getCtx() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  function _tone(freq, dur, vol = 0.4, type = 'sine') {
    if (!State.get('soundEnabled')) return;
    try {
      const ctx = _getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur + 0.02);
    } catch (_) {}
  }

  function playChime() {
    _tone(660, 0.18, 0.38);
    setTimeout(() => _tone(880, 0.18, 0.38), 180);
    setTimeout(() => _tone(1100, 0.28, 0.32), 360);
  }

  function playClick() {
    _tone(440, 0.06, 0.18, 'square');
  }

  return { playChime, playClick };
})();

/* ============================================================
   BROWSER NOTIFICATIONS
   ============================================================ */
const BrowserNotif = (() => {
  async function requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  function send(title, body) {
    if (!State.get('browserNotif')) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try { new Notification(title, { body }); } catch (_) {}
  }

  return { requestPermission, send };
})();

/* ============================================================
   QUOTES
   ============================================================ */
const Quotes = (() => {
  const BANK = [
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
    { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
    { text: "You don't have to be great to start, but you have to start to be great.", author: 'Zig Ziglar' },
    { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
    { text: "Hard work beats talent when talent doesn't work hard.", author: 'Tim Notke' },
    { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
    { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
    { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
    { text: 'What you do today can improve all your tomorrows.', author: 'Ralph Marston' },
    { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
    { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
    { text: 'Great things never come from comfort zones.', author: 'Unknown' },
    { text: "Don't stop when you're tired. Stop when you're done.", author: 'Unknown' },
    { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
    { text: "Success doesn't just find you. You have to go out and get it.", author: 'Unknown' },
    { text: 'The harder you work for something, the greater you\'ll feel when you achieve it.', author: 'Unknown' },
    { text: 'Little by little, a little becomes a lot.', author: 'Tanzanian Proverb' },
    { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
    { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
    { text: 'Either you run the day or the day runs you.', author: 'Jim Rohn' },
    { text: 'Productivity is never an accident. It is always the result of a commitment to excellence.', author: 'Paul J. Meyer' },
    { text: "You've got to get up every morning with determination if you're going to go to bed with satisfaction.", author: 'George Lorimer' },
  ];

  let _lastIdx = -1;

  function getRandom() {
    let idx;
    do { idx = Math.floor(Math.random() * BANK.length); } while (idx === _lastIdx);
    _lastIdx = idx;
    return BANK[idx];
  }

  return { getRandom };
})();

/* ============================================================
   UI — DOM references & update helpers
   ============================================================ */
const UI = (() => {
  let $timerTime, $progressRing, $modeLabel, $modeDot,
      $sessionCount, $startBtn, $playIcon, $pauseIcon,
      $resetBtn, $skipBtn, $focusTab, $breakTab,
      $themeToggle, $themeIcon, $settingsToggle,
      $settingsPanel, $settingsClose, $quoteText,
      $quoteAuthor, $timerCard, $statsPanel, $statsClose,
      $statsToggle, $exportStats;

  function init() {
    $timerTime = document.getElementById('timerTime');
    $progressRing = document.getElementById('progressRing');
    $modeLabel = document.getElementById('modeLabel');
    $modeDot = document.getElementById('modeDot');
    $sessionCount = document.getElementById('sessionCount');
    $startBtn = document.getElementById('startBtn');
    $playIcon = $startBtn.querySelector('.play-icon');
    $pauseIcon = $startBtn.querySelector('.pause-icon');
    $resetBtn = document.getElementById('resetBtn');
    $skipBtn = document.getElementById('skipBtn');
    $focusTab = document.getElementById('focusTab');
    $breakTab = document.getElementById('breakTab');
    $themeToggle = document.getElementById('themeToggle');
    $themeIcon = document.getElementById('themeIcon');
    $settingsToggle = document.getElementById('settingsToggle');
    $settingsPanel = document.getElementById('settingsPanel');
    $settingsClose = document.getElementById('settingsClose');
    $quoteText = document.getElementById('quoteText');
    $quoteAuthor = document.getElementById('quoteAuthor');
    $timerCard = document.querySelector('.timer-card');
    $statsPanel = document.getElementById('statsPanel');
    $statsClose = document.getElementById('statsClose');
    $statsToggle = document.getElementById('statsToggle');
    $exportStats = document.getElementById('exportStats');
  }

  function _fmt(seconds) {
    const s = Math.max(0, seconds);
    if (s >= 3600) {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
      const ss = (s % 60).toString().padStart(2, '0');
      return `${h}:${m}:${ss}`;
    }
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  function updateTimer(seconds) {
    const label = _fmt(Math.max(0, seconds));
    $timerTime.textContent = label;
    $timerTime.classList.toggle('hours-mode', seconds >= 3600);
    document.title = `${label} — FocusForge`;
  }

  function updateRing(fraction) {
    const CIRC = 2 * Math.PI * 96;
    const offset = CIRC * (1 - Math.max(0, Math.min(1, fraction)));
    $progressRing.style.strokeDashoffset = offset;
  }

  function setMode(mode) {
    const isFocus = mode === 'focus';
    $modeLabel.textContent = isFocus ? 'Focus Time' : 'Break Time';
    $modeDot.classList.toggle('break-mode', !isFocus);
    $progressRing.classList.toggle('break-mode', !isFocus);
    $focusTab.classList.toggle('active', isFocus);
    $focusTab.setAttribute('aria-selected', String(isFocus));
    $breakTab.classList.toggle('active', !isFocus);
    $breakTab.setAttribute('aria-selected', String(!isFocus));
  }

  function setRunning(isRunning) {
    $playIcon.classList.toggle('hidden', isRunning);
    $pauseIcon.classList.toggle('hidden', !isRunning);
    $startBtn.setAttribute('aria-label', isRunning ? 'Pause timer' : 'Start timer');
  }

  function updateSessionCount() {
    $sessionCount.textContent = State.get('sessionCount');
    $sessionCount.classList.remove('bump');
    void $sessionCount.offsetWidth;
    $sessionCount.classList.add('bump');
    setTimeout(() => $sessionCount.classList.remove('bump'), 300);
  }

  function updateQuote() {
    const q = Quotes.getRandom();
    $quoteText.textContent = `"${q.text}"`;
    $quoteAuthor.textContent = `— ${q.author}`;
  }

  function flashComplete() {
    $timerCard.classList.remove('flash-complete');
    void $timerCard.offsetWidth;
    $timerCard.classList.add('flash-complete');
    setTimeout(() => $timerCard.classList.remove('flash-complete'), 1400);
  }

  function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    $themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  function shakeEl(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 420);
  }

  function parseTimerInput(raw) {
    const str = raw.trim();
    if (/^\d+$/.test(str)) {
      const mins = parseInt(str, 10);
      return isNaN(mins) ? null : mins * 60;
    }
    const hms = str.match(/^(\d+):([0-5]\d):([0-5]\d)$/);
    if (hms) return +hms[1] * 3600 + +hms[2] * 60 + +hms[3];
    const ms = str.match(/^(\d+):([0-5]\d)$/);
    if (ms) return +ms[1] * 60 + +ms[2];
    return null;
  }

  function openTimerEdit() {
    Timer.pause();

    const $input = document.createElement('input');
    $input.type = 'text';
    $input.className = 'timer-edit-input' + ($timerTime.classList.contains('hours-mode') ? ' hours-mode' : '');
    $input.value = $timerTime.textContent;
    $input.maxLength = 8;
    $input.setAttribute('aria-label', 'Edit timer — type minutes, MM:SS or H:MM:SS, then press Enter');
    $input.setAttribute('spellcheck', 'false');

    const $hint = document.createElement('span');
    $hint.className = 'timer-edit-format';
    $hint.textContent = 'min  ·  MM:SS  ·  H:MM:SS';

    $timerTime.style.display = 'none';
    document.querySelector('.timer-edit-hint').style.display = 'none';
    $timerTime.parentNode.appendChild($input);
    $timerTime.parentNode.appendChild($hint);

    $input.focus();
    $input.select();

    let committed = false;

    function commit() {
      if (committed) return;
      committed = true;

      const secs = parseTimerInput($input.value);
      const MIN = 60;
      const MAX = 359940;

      $input.remove();
      $hint.remove();
      $timerTime.style.display = '';
      document.querySelector('.timer-edit-hint').style.display = '';

      if (secs !== null && secs >= MIN && secs <= MAX) {
        Timer.setTime(secs);
      } else {
        shakeEl($timerTime);
      }
    }

    $input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      if (e.key === 'Escape') {
        committed = true;
        $input.remove();
        $hint.remove();
        $timerTime.style.display = '';
        document.querySelector('.timer-edit-hint').style.display = '';
      }
    });
    $input.addEventListener('blur', commit);
  }

  return {
    init,
    updateTimer,
    updateRing,
    setMode,
    setRunning,
    updateSessionCount,
    updateQuote,
    flashComplete,
    applyTheme,
    shakeEl,
    openTimerEdit,
    get $settingsPanel() { return $settingsPanel; },
    get $settingsClose() { return $settingsClose; },
    get $themeToggle() { return $themeToggle; },
    get $settingsToggle() { return $settingsToggle; },
    get $startBtn() { return $startBtn; },
    get $resetBtn() { return $resetBtn; },
    get $skipBtn() { return $skipBtn; },
    get $focusTab() { return $focusTab; },
    get $breakTab() { return $breakTab; },
    get $statsToggle() { return $statsToggle; },
    get $statsPanel() { return $statsPanel; },
    get $statsClose() { return $statsClose; },
    get $exportStats() { return $exportStats; },
  };
})();

/* ============================================================
   STATS DISPLAY — Update all stats UI elements
   ============================================================ */
function updateStatsDisplay() {
  const sessions = Stats.getData().sessions;
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const todayMinutes = Math.round(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  // Today's focus
  document.getElementById('todayFocus').textContent = todayMinutes + ' min';

  // Total focus
  const totalMinutes = Math.round(Stats.getData().totalFocus / 60);
  document.getElementById('totalFocus').textContent = totalMinutes > 60 ?
    (totalMinutes / 60).toFixed(1) + ' hrs' :
    totalMinutes + ' min';

  // Average session
  const avg = sessions.length > 0 ?
    Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60) :
    0;
  document.getElementById('avgSession').textContent = avg + ' min';

  // Best day
  const dayMap = {};
  sessions.forEach(s => {
    dayMap[s.date] = (dayMap[s.date] || 0) + s.duration;
  });
  let best = 0;
  for (const day in dayMap) {
    if (dayMap[day] > best) best = dayMap[day];
  }
  document.getElementById('bestDay').textContent = Math.round(best / 60) + ' min';

  // This week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekSessions = sessions.filter(s => s.date >= weekStartStr);
  const weekMinutes = Math.round(weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  document.getElementById('weekFocus').textContent = weekMinutes > 60 ?
    (weekMinutes / 60).toFixed(1) + ' hrs' :
    weekMinutes + ' min';

  // Total sessions
  document.getElementById('totalSessions').textContent = sessions.length;

  // Streak
  const streak = Stats.getStreak();
  document.getElementById('streakCount').textContent = streak + ' day' + (streak !== 1 ? 's' : '');

  // Focus Score
  const score = Stats.getFocusScore();
  document.getElementById('focusScore').textContent = score + '/100';
  document.getElementById('scoreFill').style.width = score + '%';

  // Compare data
  const compare = Stats.getCompareData();
  document.getElementById('thisWeek').textContent = compare.thisWeek + ' hrs';
  document.getElementById('lastWeek').textContent = compare.lastWeek + ' hrs';

  const changeEl = document.getElementById('weekChange');
  const changeText = (compare.change >= 0 ? '+' : '') + compare.change + '%';
  changeEl.textContent = changeText;
  changeEl.className = 'compare-value' + (compare.change > 0 ? ' positive' : compare.change < 0 ? ' negative' : '');

  // Update session badge
  document.getElementById('sessionCount').textContent = sessions.length;
}

/* ============================================================
   CHART — Canvas-based bar chart
   ============================================================ */
let currentChartPeriod = 'week';

function updateChart(period = currentChartPeriod) {
  currentChartPeriod = period;
  const canvas = document.getElementById('statsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = canvas.parentElement.clientWidth || 600;
  canvas.height = 250;

  const sessions = Stats.getData().sessions;

  let days;
  if (period === 'week') {
    days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
  } else if (period === 'month') {
    days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
  } else {
    // Year
    days = [];
    for (let i = 51; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      days.push(d.toISOString().split('T')[0]);
    }
  }

  const data = days.map(day => {
    return sessions
      .filter(s => s.date === day)
      .reduce((sum, s) => sum + s.duration, 0) / 60;
  });

  const maxVal = Math.max(...data, 1);
  const padding = { top: 20, bottom: 30, left: 40, right: 20 };
  const chartWidth = canvas.width - padding.left - padding.right;
  const chartHeight = canvas.height - padding.top - padding.bottom;
  const barWidth = Math.min(chartWidth / data.length * 0.6, 30);
  const gap = Math.max((chartWidth / data.length) - barWidth, 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isLight = document.body.classList.contains('light');
  const textColor = isLight ? '#1a1a2e' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(canvas.width - padding.right, y);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / 4) * maxVal) + 'm', padding.left - 6, y + 3);
  }

  // Bars
  data.forEach((value, index) => {
    const x = padding.left + index * (barWidth + gap);
    const height = (value / maxVal) * chartHeight;
    const y = padding.top + chartHeight - height;

    const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
    gradient.addColorStop(0, '#7c5cfc');
    gradient.addColorStop(1, '#fc5c7d');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    const radius = 4;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, padding.top + chartHeight);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();

    if (value > 0) {
      ctx.fillStyle = textColor;
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(value) + 'm', x + barWidth/2, y - 4);
    }

    const label = period === 'year' ?
      days[index].split('-').slice(1).join('/') :
      days[index].split('-').slice(1).join('/');
    ctx.fillStyle = textColor;
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barWidth/2, canvas.height - 4);
  });
}

/* ============================================================
   HEATMAP — Productivity heat map
   ============================================================ */
function updateHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;

  const sessions = Stats.getData().sessions;
  const today = new Date();

  // Get last 30 days
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Calculate max focus for scaling
  const dayMap = {};
  sessions.forEach(s => {
    dayMap[s.date] = (dayMap[s.date] || 0) + s.duration;
  });

  const values = days.map(d => {
    const key = d.toISOString().split('T')[0];
    return dayMap[key] || 0;
  });

  const maxVal = Math.max(...values, 1);

  let html = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add day labels
  for (let i = 0; i < 7; i++) {
    html += `<div class="heatmap-label">${dayNames[i]}</div>`;
  }

  // Add cells
  days.forEach((d, index) => {
    const value = values[index];
    const level = Math.min(Math.floor((value / maxVal) * 5), 5);
    const dateStr = d.toISOString().split('T')[0];
    const minutes = Math.round(value / 60);

    html += `
      <div class="heatmap-cell level-${level}">
        ${minutes > 0 ? minutes : ''}
        <div class="tooltip">${dateStr}: ${minutes} min</div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ============================================================
   PRODUCTIVE HOURS — Most productive hours chart
   ============================================================ */
function updateProductiveHours() {
  const grid = document.getElementById('hoursGrid');
  if (!grid) return;

  const sessions = Stats.getData().sessions;
  const hourCounts = Array(24).fill(0);
  sessions.forEach(s => {
    hourCounts[s.hour] += s.duration;
  });

  const maxCount = Math.max(...hourCounts, 1);

  // Show top 6 hours
  const activeHours = hourCounts.map((count, i) => ({ hour: i, count }))
    .filter(h => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (activeHours.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); font-size:0.8rem; padding:10px;">Complete sessions to see your productive hours</div>';
    return;
  }

  const labels = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
                  '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

  let html = '';
  activeHours.forEach(h => {
    const percent = (h.count / maxCount) * 100;
    const minutes = Math.round(h.count / 60);
    html += `
      <div class="hour-bar">
        <div class="hour-bar-fill" title="${labels[h.hour]}: ${minutes} min">
          <div class="fill" style="height: ${percent}%"></div>
        </div>
        <span class="hour-bar-label">${labels[h.hour]}</span>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ============================================================
   TIMER — countdown logic & mode transitions
   ============================================================ */
const Timer = (() => {
  let _intervalId = null;
  let _totalSeconds = 0;
  let _remaining = 0;
  let _isRunning = false;

  function _secondsFor(mode) {
    return (mode === 'focus' ? State.get('focusDuration') : State.get('breakDuration')) * 60;
  }

  function _stop() {
    clearInterval(_intervalId);
    _intervalId = null;
    _isRunning = false;
  }

  function _tick() {
    _remaining = Math.max(0, _remaining - 1);
    UI.updateTimer(_remaining);
    UI.updateRing(_remaining / _totalSeconds);

    if (_remaining === 0) {
      _stop();
      _onComplete();
    }
  }

  function _onComplete() {
    const finishedMode = State.get('currentMode');

    if (finishedMode === 'focus') {
      State.set('sessionCount', State.get('sessionCount') + 1);
      Stats.recordSession(_totalSeconds);
      Storage.save();
      UI.updateSessionCount();
    }

    UI.flashComplete();
    AudioEngine.playChime();

    BrowserNotif.send(
      finishedMode === 'focus' ? '⚡ Focus session done!' : '☕ Break complete!',
      finishedMode === 'focus' ? 'Time for a well-earned break.' : 'Ready to focus again?'
    );

    Popup.show(finishedMode, () => {
      const nextMode = finishedMode === 'focus' ? 'break' : 'focus';
      switchMode(nextMode);
      if (State.get('autoSwitch')) {
        setTimeout(() => start(), 320);
      }
    });
  }

  function reset() {
    _stop();
    const mode = State.get('currentMode');
    _totalSeconds = _secondsFor(mode);
    _remaining = _totalSeconds;
    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
  }

  function start() {
    if (_isRunning) return;
    AudioEngine.playClick();
    _isRunning = true;
    _intervalId = setInterval(_tick, 1000);
    UI.setRunning(true);
  }

  function pause() {
    if (!_isRunning) return;
    _stop();
    UI.setRunning(false);
  }

  function toggle() {
    _isRunning ? pause() : start();
  }

  function switchMode(mode) {
    _stop();
    State.set('currentMode', mode);
    _totalSeconds = _secondsFor(mode);
    _remaining = _totalSeconds;
    UI.setMode(mode);
    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
  }

  function skip() {
    AudioEngine.playClick();
    const next = State.get('currentMode') === 'focus' ? 'break' : 'focus';
    switchMode(next);
  }

  function setTime(seconds) {
    _stop();
    _totalSeconds = seconds;
    _remaining = seconds;

    const durationKey = State.get('currentMode') === 'focus' ? 'focusDuration' : 'breakDuration';
    State.set(durationKey, Math.round(seconds / 60));
    Storage.save();

    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
    AudioEngine.playClick();
  }

  function adjustTime(deltaMinutes) {
    const delta = deltaMinutes * 60;
    const MIN_SECS = 60;
    const MAX_SECS = 359940;

    _remaining = Math.min(MAX_SECS, Math.max(MIN_SECS, _remaining + delta));
    _totalSeconds = Math.min(MAX_SECS, Math.max(MIN_SECS, _totalSeconds + delta));

    if (_remaining > _totalSeconds) _remaining = _totalSeconds;

    const durationKey = State.get('currentMode') === 'focus' ? 'focusDuration' : 'breakDuration';
    State.set(durationKey, Math.round(_totalSeconds / 60));
    Storage.save();

    UI.updateTimer(_remaining);
    UI.updateRing(_remaining / _totalSeconds);
    AudioEngine.playClick();
  }

  return { reset, start, pause, toggle, skip, switchMode, adjustTime, setTime };
})();

/* ============================================================
   POPUP
   ============================================================ */
const Popup = (() => {
  let _onCloseCb = null;

  function show(completedMode, onClose) {
    _onCloseCb = onClose;

    const $overlay = document.getElementById('popupOverlay');
    const $icon = document.getElementById('popupIcon');
    const $title = document.getElementById('popupTitle');
    const $message = document.getElementById('popupMessage');
    const $quote = document.getElementById('popupQuote');

    const isFocus = completedMode === 'focus';

    $icon.textContent = isFocus ? '🎉' : '⚡';
    $title.textContent = isFocus ? 'Session Complete!' : 'Break Over!';
    $message.textContent = isFocus
      ? "Amazing work! You've earned a break. Keep the momentum going!"
      : 'Rest complete! Ready to dive back in?';

    if (isFocus) {
      const q = Quotes.getRandom();
      $quote.textContent = `“${q.text}” — ${q.author}`;
      $quote.style.display = '';
      UI.updateQuote();
    } else {
      $quote.style.display = 'none';
    }

    $overlay.removeAttribute('hidden');
    document.getElementById('popupClose').focus();
  }

  function close() {
    document.getElementById('popupOverlay').setAttribute('hidden', '');
    if (typeof _onCloseCb === 'function') {
      const cb = _onCloseCb;
      _onCloseCb = null;
      cb();
    }
  }

  return { show, close };
})();

/* ============================================================
   SETTINGS
   ============================================================ */
const Settings = (() => {
  function open() {
    document.getElementById('focusDuration').value = State.get('focusDuration');
    document.getElementById('breakDuration').value = State.get('breakDuration');
    document.getElementById('autoSwitch').checked = State.get('autoSwitch');
    document.getElementById('soundEnabled').checked = State.get('soundEnabled');
    document.getElementById('browserNotif').checked = State.get('browserNotif');
    document.getElementById('settingsPanel').removeAttribute('hidden');
  }

  function close() {
    document.getElementById('settingsPanel').setAttribute('hidden', '');
  }

  function apply() {
    const $focus = document.getElementById('focusDuration');
    const $break = document.getElementById('breakDuration');

    const focusVal = parseInt($focus.value, 10);
    const breakVal = parseInt($break.value, 10);

    let valid = true;
    if (!Number.isInteger(focusVal) || focusVal < 1 || focusVal > 99) {
      UI.shakeEl($focus);
      valid = false;
    }
    if (!Number.isInteger(breakVal) || breakVal < 1 || breakVal > 99) {
      UI.shakeEl($break);
      valid = false;
    }
    if (!valid) return;

    State.set('focusDuration', focusVal);
    State.set('breakDuration', breakVal);
    State.set('autoSwitch', document.getElementById('autoSwitch').checked);
    State.set('soundEnabled', document.getElementById('soundEnabled').checked);

    const wantNotif = document.getElementById('browserNotif').checked;
    if (wantNotif && Notification.permission !== 'granted') {
      BrowserNotif.requestPermission().then(granted => {
        State.set('browserNotif', granted);
        document.getElementById('browserNotif').checked = granted;
        Storage.save();
      });
    } else {
      State.set('browserNotif', wantNotif);
    }

    Storage.save();
    Timer.reset();
    AudioEngine.playClick();
    close();
  }

  function step(targetId, action) {
    const $el = document.getElementById(targetId);
    let val = parseInt($el.value, 10) || 1;
    if (action === 'inc') val = Math.min(99, val + 1);
    if (action === 'dec') val = Math.max(1, val - 1);
    $el.value = val;
  }

  return { open, close, apply, step };
})();

/* ============================================================
   APP — bootstrap & global event wiring
   ============================================================ */
function App() {
  Storage.load();

  UI.init();
  UI.applyTheme(State.get('theme'));

  Timer.reset();
  UI.setMode(State.get('currentMode'));
  UI.updateSessionCount();
  UI.updateQuote();

  // Stats
  updateStatsDisplay();
  updateChart('week');
  updateHeatmap();
  updateProductiveHours();

  /* ── Timer Controls ── */
  UI.$startBtn.addEventListener('click', () => Timer.toggle());
  UI.$resetBtn.addEventListener('click', () => { AudioEngine.playClick();
    Timer.reset(); });
  UI.$skipBtn.addEventListener('click', () => Timer.skip());

  document.getElementById('decreaseTime').addEventListener('click', () => Timer.adjustTime(-5));
  document.getElementById('increaseTime').addEventListener('click', () => Timer.adjustTime(+5));

  document.getElementById('timerTime').addEventListener('click', () => UI.openTimerEdit());
  document.getElementById('timerTime').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();
      UI.openTimerEdit(); }
  });

  /* ── Mode Tabs ── */
  UI.$focusTab.addEventListener('click', () => {
    if (State.get('currentMode') !== 'focus') {
      AudioEngine.playClick();
      Timer.switchMode('focus');
    }
  });
  UI.$breakTab.addEventListener('click', () => {
    if (State.get('currentMode') !== 'break') {
      AudioEngine.playClick();
      Timer.switchMode('break');
    }
  });

  /* ── Theme ── */
  UI.$themeToggle.addEventListener('click', () => {
    const next = State.get('theme') === 'dark' ? 'light' : 'dark';
    State.set('theme', next);
    UI.applyTheme(next);
    Storage.save();
    AudioEngine.playClick();
    // Refresh charts with new colors
    updateChart(currentChartPeriod);
  });

  /* ── Stats ── */
  UI.$statsToggle.addEventListener('click', () => {
    UI.$statsPanel.removeAttribute('hidden');
    updateStatsDisplay();
    updateChart(currentChartPeriod);
    updateHeatmap();
    updateProductiveHours();
  });

  UI.$statsClose.addEventListener('click', () => {
    UI.$statsPanel.setAttribute('hidden', '');
  });

  UI.$exportStats.addEventListener('click', () => {
    Stats.exportCSV();
  });

  // Close stats on backdrop click
  UI.$statsPanel.addEventListener('click', e => {
    if (e.target === UI.$statsPanel) {
      UI.$statsPanel.setAttribute('hidden', '');
    }
  });

  /* ── Chart Controls ── */
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateChart(btn.dataset.period);
    });
  });

  /* ── Settings ── */
  UI.$settingsToggle.addEventListener('click', () => Settings.open());
  UI.$settingsClose.addEventListener('click', () => Settings.close());
  document.getElementById('applySettings').addEventListener('click', () => Settings.apply());

  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => Settings.step(btn.dataset.target, btn.dataset.action));
  });

  document.getElementById('resetSessions').addEventListener('click', () => {
    if (confirm('This will delete ALL your stats data. Are you sure?')) {
      State.set('sessionCount', 0);
      Stats.importData({ sessions: [], dailyFocus: 0, totalFocus: 0 });
      Storage.save();
      UI.updateSessionCount();
      updateStatsDisplay();
      updateChart(currentChartPeriod);
      updateHeatmap();
      updateProductiveHours();
      AudioEngine.playClick();
    }
  });

  /* ── Popup ── */
  document.getElementById('popupClose').addEventListener('click', () => Popup.close());
  document.getElementById('popupOverlay').addEventListener('click', e => {
    if (e.target.id === 'popupOverlay') Popup.close();
  });

  /* ── Keyboard Shortcuts ── */
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        Timer.toggle();
        break;
      case 'r':
      case 'R':
        AudioEngine.playClick();
        Timer.reset();
        break;
      case 's':
      case 'S':
        Timer.skip();
        break;
      case 'Escape':
        Settings.close();
        Popup.close();
        UI.$statsPanel.setAttribute('hidden', '');
        break;
    }
  });

  /* ── Input clamping ── */
  ['focusDuration', 'breakDuration'].forEach(id => {
    const $el = document.getElementById(id);
    if (!$el) return;
    $el.addEventListener('change', () => {
      const v = parseInt($el.value, 10);
      if (isNaN(v) || v < 1) $el.value = 1;
      else if (v > 99) $el.value = 99;
    });
  });
}

document.addEventListener('DOMContentLoaded', App);