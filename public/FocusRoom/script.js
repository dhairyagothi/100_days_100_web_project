/**
 * FocusForge — Pomodoro Focus Timer
 * script.js
 *
 * Architecture: IIFE modules with a shared State object.
 *
 * Modules
 * -------
 *  State         – single source of truth for all runtime data
 *  Storage       – LocalStorage persistence (save / load)
 *  AudioEngine   – Web Audio API tones (no external files)
 *  BrowserNotif  – Notification API wrapper
 *  Quotes        – motivational quote bank + random picker
 *  Timer         – countdown logic, mode switching, completion
 *  UI            – DOM updates, animations, theme
 *  Settings      – settings panel open / apply / close
 *  Popup         – completion dialog show / close
 *  App           – bootstrap + global event wiring
 */

'use strict';

/* ============================================================
   STATE — single source of truth
   ============================================================ */
const State = (() => {
  const DEFAULTS = {
    focusDuration : 25,      // minutes
    breakDuration : 5,       // minutes
    currentMode   : 'focus', // 'focus' | 'break'
    sessionCount  : 0,
    theme         : 'dark',  // 'dark' | 'light'
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
  const KEY = 'focusforge_v1';

  /** Persist user-configurable settings + session count. */
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
      };
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (_) { /* storage may be unavailable in private mode */ }
  }

  /** Restore persisted settings into State (with validation). */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;

      const data = JSON.parse(raw);

      // Validate & merge numeric fields
      ['focusDuration', 'breakDuration'].forEach(k => {
        const v = Number(data[k]);
        if (Number.isInteger(v) && v >= 1 && v <= 99) State.set(k, v);
      });

      // Session count
      const sc = Number(data.sessionCount);
      if (Number.isInteger(sc) && sc >= 0) State.set('sessionCount', sc);

      // Theme
      if (data.theme === 'dark' || data.theme === 'light') State.set('theme', data.theme);

      // Boolean flags
      ['autoSwitch', 'soundEnabled', 'browserNotif'].forEach(k => {
        if (typeof data[k] === 'boolean') State.set(k, data[k]);
      });
    } catch (_) { /* corrupt data — silently ignore, use defaults */ }
  }

  return { save, load };
})();

/* ============================================================
   AUDIO ENGINE — Web Audio API (no external audio files)
   ============================================================ */
const AudioEngine = (() => {
  let _ctx = null;

  /** Lazily create / resume AudioContext (handles browser autoplay policy). */
  function _getCtx() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  /**
   * Synthesise a short tone.
   * @param {number} freq       – Hz
   * @param {number} dur        – seconds
   * @param {number} vol        – 0–1
   * @param {OscillatorType} type
   */
  function _tone(freq, dur, vol = 0.4, type = 'sine') {
    if (!State.get('soundEnabled')) return;
    try {
      const ctx  = _getCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      // Exponential fade to silence
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur + 0.02);
    } catch (_) { /* AudioContext unavailable */ }
  }

  /** Three-tone ascending chime — played when a session ends. */
  function playChime() {
    _tone(660,  0.18, 0.38);
    setTimeout(() => _tone(880,  0.18, 0.38), 180);
    setTimeout(() => _tone(1100, 0.28, 0.32), 360);
  }

  /** Soft click — UI feedback. */
  function playClick() {
    _tone(440, 0.06, 0.18, 'square');
  }

  return { playChime, playClick };
})();

/* ============================================================
   BROWSER NOTIFICATIONS — Notification API wrapper
   ============================================================ */
const BrowserNotif = (() => {
  /** Request permission and return true if granted. */
  async function requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  /** Fire a desktop notification if permitted. */
  function send(title, body) {
    if (!State.get('browserNotif')) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try { new Notification(title, { body }); } catch (_) {}
  }

  return { requestPermission, send };
})();

/* ============================================================
   QUOTES — motivational quote bank
   ============================================================ */
const Quotes = (() => {
  const BANK = [
    { text: 'The secret of getting ahead is getting started.',                                    author: 'Mark Twain' },
    { text: 'It does not matter how slowly you go as long as you do not stop.',                   author: 'Confucius' },
    { text: 'Success is the sum of small efforts, repeated day in and day out.',                  author: 'Robert Collier' },
    { text: 'Focus on being productive instead of busy.',                                         author: 'Tim Ferriss' },
    { text: "You don't have to be great to start, but you have to start to be great.",            author: 'Zig Ziglar' },
    { text: 'The way to get started is to quit talking and begin doing.',                         author: 'Walt Disney' },
    { text: "Hard work beats talent when talent doesn't work hard.",                              author: 'Tim Notke' },
    { text: "Believe you can and you're halfway there.",                                          author: 'Theodore Roosevelt' },
    { text: 'Action is the foundational key to all success.',                                     author: 'Pablo Picasso' },
    { text: 'An investment in knowledge pays the best interest.',                                 author: 'Benjamin Franklin' },
    { text: 'What you do today can improve all your tomorrows.',                                  author: 'Ralph Marston' },
    { text: 'The future depends on what you do today.',                                           author: 'Mahatma Gandhi' },
    { text: 'Push yourself, because no one else is going to do it for you.',                     author: 'Unknown' },
    { text: 'Great things never come from comfort zones.',                                        author: 'Unknown' },
    { text: "Don't stop when you're tired. Stop when you're done.",                              author: 'Unknown' },
    { text: 'Dream it. Wish it. Do it.',                                                          author: 'Unknown' },
    { text: "Success doesn't just find you. You have to go out and get it.",                     author: 'Unknown' },
    { text: 'The harder you work for something, the greater you\'ll feel when you achieve it.',  author: 'Unknown' },
    { text: 'Little by little, a little becomes a lot.',                                          author: 'Tanzanian Proverb' },
    { text: 'Deep work is the superpower of the 21st century.',                                   author: 'Cal Newport' },
    { text: 'Energy and persistence conquer all things.',                                         author: 'Benjamin Franklin' },
    { text: 'Either you run the day or the day runs you.',                                        author: 'Jim Rohn' },
    { text: 'Productivity is never an accident. It is always the result of a commitment to excellence.', author: 'Paul J. Meyer' },
    { text: "You've got to get up every morning with determination if you're going to go to bed with satisfaction.", author: 'George Lorimer' },
  ];

  let _lastIdx = -1;

  /** Return a random quote, never repeating the previous one. */
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
  // Lazily populated on init()
  let $timerTime, $progressRing, $modeLabel, $modeDot,
      $sessionCount, $startBtn, $playIcon, $pauseIcon,
      $resetBtn, $skipBtn, $focusTab, $breakTab,
      $themeToggle, $themeIcon, $settingsToggle,
      $settingsPanel, $settingsClose, $quoteText,
      $quoteAuthor, $timerCard;

  /** Cache all DOM references once the document is ready. */
  function init() {
    $timerTime      = document.getElementById('timerTime');
    $progressRing   = document.getElementById('progressRing');
    $modeLabel      = document.getElementById('modeLabel');
    $modeDot        = document.getElementById('modeDot');
    $sessionCount   = document.getElementById('sessionCount');
    $startBtn       = document.getElementById('startBtn');
    $playIcon       = $startBtn.querySelector('.play-icon');
    $pauseIcon      = $startBtn.querySelector('.pause-icon');
    $resetBtn       = document.getElementById('resetBtn');
    $skipBtn        = document.getElementById('skipBtn');
    $focusTab       = document.getElementById('focusTab');
    $breakTab       = document.getElementById('breakTab');
    $themeToggle    = document.getElementById('themeToggle');
    $themeIcon      = document.getElementById('themeIcon');
    $settingsToggle = document.getElementById('settingsToggle');
    $settingsPanel  = document.getElementById('settingsPanel');
    $settingsClose  = document.getElementById('settingsClose');
    $quoteText      = document.getElementById('quoteText');
    $quoteAuthor    = document.getElementById('quoteAuthor');
    $timerCard      = document.querySelector('.timer-card');
  }

  /**
   * Format seconds → "MM:SS" or "H:MM:SS" when ≥ 1 hour.
   * Also toggles .hours-mode class on the timer element for font-size adjustment.
   */
  function _fmt(seconds) {
    const s = Math.max(0, seconds);
    if (s >= 3600) {
      const h  = Math.floor(s / 3600);
      const m  = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
      const ss = (s % 60).toString().padStart(2, '0');
      return `${h}:${m}:${ss}`;
    }
    const m  = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  /** Update the visible timer and browser tab title. */
  function updateTimer(seconds) {
    const label = _fmt(Math.max(0, seconds));
    $timerTime.textContent = label;
    // Switch font size class when hours are displayed
    $timerTime.classList.toggle('hours-mode', seconds >= 3600);
    document.title = `${label} — FocusForge`;
  }

  /**
   * Animate the SVG progress ring.
   * @param {number} fraction – 0 (empty) to 1 (full)
   */
  function updateRing(fraction) {
    const CIRC = 2 * Math.PI * 96; // ≈ 603.19
    const offset = CIRC * (1 - Math.max(0, Math.min(1, fraction)));
    $progressRing.style.strokeDashoffset = offset;
  }

  /** Sync all mode-dependent visuals (tabs, dot, label, ring colour). */
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

  /** Toggle Start ↔ Pause icon and aria-label. */
  function setRunning(isRunning) {
    $playIcon.classList.toggle('hidden', isRunning);
    $pauseIcon.classList.toggle('hidden', !isRunning);
    $startBtn.setAttribute('aria-label', isRunning ? 'Pause timer' : 'Start timer');
  }

  /** Refresh session counter and trigger a brief scale-up. */
  function updateSessionCount() {
    $sessionCount.textContent = State.get('sessionCount');
    $sessionCount.classList.remove('bump');
    // reflow so the animation restarts
    void $sessionCount.offsetWidth;
    $sessionCount.classList.add('bump');
    setTimeout(() => $sessionCount.classList.remove('bump'), 300);
  }

  /** Rotate the ambient quote to a new random entry. */
  function updateQuote() {
    const q = Quotes.getRandom();
    $quoteText.textContent   = `"${q.text}"`;
    $quoteAuthor.textContent = `— ${q.author}`;
  }

  /** Flash the card with a glow when a session completes. */
  function flashComplete() {
    $timerCard.classList.remove('flash-complete');
    void $timerCard.offsetWidth;
    $timerCard.classList.add('flash-complete');
    setTimeout(() => $timerCard.classList.remove('flash-complete'), 1400);
  }

  /** Apply dark / light theme to <body> and update icon. */
  function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    $themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  /** Shake an input element to signal invalid value. */
  function shakeEl(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 420);
  }

  /**
   * Parse a user-typed time string into total seconds.
   * Accepts:
   *   "90"       → 90 minutes = 5400s
   *   "25:30"    → 25 min 30 sec = 1530s
   *   "1:30:00"  → 1 h 30 min = 5400s
   * Returns null if the format is unrecognised.
   */
  function parseTimerInput(raw) {
    const str = raw.trim();
    // Plain integer → minutes
    if (/^\d+$/.test(str)) {
      const mins = parseInt(str, 10);
      return isNaN(mins) ? null : mins * 60;
    }
    // H:MM:SS
    const hms = str.match(/^(\d+):([0-5]\d):([0-5]\d)$/);
    if (hms) return +hms[1] * 3600 + +hms[2] * 60 + +hms[3];
    // MM:SS
    const ms = str.match(/^(\d+):([0-5]\d)$/);
    if (ms) return +ms[1] * 60 + +ms[2];
    return null;
  }

  /**
   * Replace the timer display with an inline text input.
   * On Enter / blur the new time is applied via Timer.setTime().
   * If the timer is running it is paused first.
   */
  function openTimerEdit() {
    // Pause if running so the user edits a frozen value
    Timer.pause();

    // Build input
    const $input = document.createElement('input');
    $input.type = 'text';
    $input.className = 'timer-edit-input' + ($timerTime.classList.contains('hours-mode') ? ' hours-mode' : '');
    $input.value = $timerTime.textContent;
    $input.maxLength = 8; // "H:MM:SS" = 7 chars + breathing room
    $input.setAttribute('aria-label', 'Edit timer — type minutes, MM:SS or H:MM:SS, then press Enter');
    $input.setAttribute('spellcheck', 'false');

    // Format hint shown below input
    const $hint = document.createElement('span');
    $hint.className = 'timer-edit-format';
    $hint.textContent = 'min  ·  MM:SS  ·  H:MM:SS';

    // Hide original timer text, inject input + hint
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
      const MIN = 60;        // 1 minute floor
      const MAX = 359_940;   // 99 h 59 m ceiling (edge case safety)

      $input.remove();
      $hint.remove();
      $timerTime.style.display = '';
      document.querySelector('.timer-edit-hint').style.display = '';

      if (secs !== null && secs >= MIN && secs <= MAX) {
        Timer.setTime(secs);
      } else if (secs !== null) {
        shakeEl($timerTime); // out-of-range
      } else {
        shakeEl($timerTime); // unrecognised format
      }
    }

    $input.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); commit(); }
      if (e.key === 'Escape') {
        committed = true; // cancel without applying
        $input.remove();
        $hint.remove();
        $timerTime.style.display = '';
        document.querySelector('.timer-edit-hint').style.display = '';
      }
    });
    $input.addEventListener('blur', commit);
  }

  return {
    init, updateTimer, updateRing, setMode,
    setRunning, updateSessionCount, updateQuote,
    flashComplete, applyTheme, shakeEl, openTimerEdit,
    // Expose refs needed by other modules
    get $settingsPanel() { return $settingsPanel; },
    get $settingsClose()  { return $settingsClose; },
    get $themeToggle()    { return $themeToggle; },
    get $settingsToggle() { return $settingsToggle; },
    get $startBtn()       { return $startBtn; },
    get $resetBtn()       { return $resetBtn; },
    get $skipBtn()        { return $skipBtn; },
    get $focusTab()       { return $focusTab; },
    get $breakTab()       { return $breakTab; },
  };
})();

/* ============================================================
   TIMER — countdown logic & mode transitions
   ============================================================ */
const Timer = (() => {
  const CIRC = 2 * Math.PI * 96; // SVG ring circumference

  let _intervalId     = null;
  let _totalSeconds   = 0;
  let _remaining      = 0;
  let _isRunning      = false;

  /** Convert stored minutes to seconds for the given mode. */
  function _secondsFor(mode) {
    return (mode === 'focus' ? State.get('focusDuration') : State.get('breakDuration')) * 60;
  }

  /** Stop the interval cleanly. */
  function _stop() {
    clearInterval(_intervalId);
    _intervalId = null;
    _isRunning  = false;
  }

  /** Called every second while running. */
  function _tick() {
    _remaining = Math.max(0, _remaining - 1);
    UI.updateTimer(_remaining);
    UI.updateRing(_remaining / _totalSeconds);

    if (_remaining === 0) {
      _stop();
      _onComplete();
    }
  }

  /** Handle session completion — sound, notify, popup, switch mode. */
  function _onComplete() {
    const finishedMode = State.get('currentMode');

    // Increment counter only for completed focus sessions
    if (finishedMode === 'focus') {
      State.set('sessionCount', State.get('sessionCount') + 1);
      Storage.save();
      UI.updateSessionCount();
    }

    UI.flashComplete();
    AudioEngine.playChime();

    BrowserNotif.send(
      finishedMode === 'focus' ? '⚡ Focus session done!' : '☕ Break complete!',
      finishedMode === 'focus' ? 'Time for a well-earned break.'  : 'Ready to focus again?'
    );

    // Show popup; when user dismisses it, switch mode (and auto-start if enabled)
    Popup.show(finishedMode, () => {
      const nextMode = finishedMode === 'focus' ? 'break' : 'focus';
      switchMode(nextMode);
      if (State.get('autoSwitch')) {
        setTimeout(() => start(), 320);
      }
    });
  }

  /** Reset timer to beginning of current mode (does NOT auto-start). */
  function reset() {
    _stop();
    const mode      = State.get('currentMode');
    _totalSeconds   = _secondsFor(mode);
    _remaining      = _totalSeconds;
    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
  }

  /** Start (or resume) the countdown. */
  function start() {
    if (_isRunning) return;
    AudioEngine.playClick();
    _isRunning  = true;
    _intervalId = setInterval(_tick, 1000);
    UI.setRunning(true);
  }

  /** Pause the countdown. */
  function pause() {
    if (!_isRunning) return;
    _stop();
    UI.setRunning(false);
  }

  /** Toggle start / pause. */
  function toggle() {
    _isRunning ? pause() : start();
  }

  /**
   * Switch to a different mode without counting the current session.
   * @param {string} mode – 'focus' | 'break'
   */
  function switchMode(mode) {
    _stop();
    State.set('currentMode', mode);
    _totalSeconds = _secondsFor(mode);
    _remaining    = _totalSeconds;
    UI.setMode(mode);
    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
  }

  /** Skip to the next mode (user-initiated, no session credit). */
  function skip() {
    AudioEngine.playClick();
    const next = State.get('currentMode') === 'focus' ? 'break' : 'focus';
    switchMode(next);
  }

  /**
   * Directly set the timer to a specific number of seconds.
   * Called by the inline edit UI; pauses the timer first.
   * Updates the stored duration so Reset restores the new value.
   * @param {number} seconds – total seconds for the new duration
   */
  function setTime(seconds) {
    _stop();
    _totalSeconds = seconds;
    _remaining    = seconds;

    const durationKey = State.get('currentMode') === 'focus' ? 'focusDuration' : 'breakDuration';
    State.set(durationKey, Math.round(seconds / 60));
    Storage.save();

    UI.updateTimer(_remaining);
    UI.updateRing(1);
    UI.setRunning(false);
    AudioEngine.playClick();
  }

  /**
   * Add or subtract minutes from the current timer (works while paused or running).
   * Clamps remaining time between 1 minute and 99 minutes.
   * Also updates the stored duration setting so Reset restores the adjusted value.
   * @param {number} deltaMinutes – positive or negative integer (e.g. +5 or -5)
   */
  function adjustTime(deltaMinutes) {
    const delta     = deltaMinutes * 60;
    const MIN_SECS  = 60;           // 1 minute floor
    const MAX_SECS  = 359_940;      // 99 h 59 m ceiling (H:MM:SS display safety)

    _remaining    = Math.min(MAX_SECS, Math.max(MIN_SECS, _remaining + delta));
    _totalSeconds = Math.min(MAX_SECS, Math.max(MIN_SECS, _totalSeconds + delta));

    // Keep remaining ≤ total (e.g. after decrement)
    if (_remaining > _totalSeconds) _remaining = _totalSeconds;

    // Persist the updated duration so Reset uses the new value
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
   POPUP — session completion dialog
   ============================================================ */
const Popup = (() => {
  let _onCloseCb = null;

  /**
   * Display the completion popup.
   * @param {string}   completedMode – 'focus' | 'break'
   * @param {Function} onClose       – called when user dismisses
   */
  function show(completedMode, onClose) {
    _onCloseCb = onClose;

    const $overlay  = document.getElementById('popupOverlay');
    const $icon     = document.getElementById('popupIcon');
    const $title    = document.getElementById('popupTitle');
    const $message  = document.getElementById('popupMessage');
    const $quote    = document.getElementById('popupQuote');

    const isFocus = completedMode === 'focus';

    $icon.textContent    = isFocus ? '🎉' : '⚡';
    $title.textContent   = isFocus ? 'Session Complete!' : 'Break Over!';
    $message.textContent = isFocus
      ? "Amazing work! You've earned a break. Keep the momentum going!"
      : 'Rest complete! Ready to dive back in?';

    if (isFocus) {
      const q = Quotes.getRandom();
      $quote.textContent  = `“${q.text}” — ${q.author}`;
      $quote.style.display = '';
      UI.updateQuote(); // also refresh background quote
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
   SETTINGS — panel open / close / apply
   ============================================================ */
const Settings = (() => {
  /** Open settings panel and sync inputs to current State. */
  function open() {
    const $p = document.getElementById('settingsPanel');
    document.getElementById('focusDuration').value  = State.get('focusDuration');
    document.getElementById('breakDuration').value  = State.get('breakDuration');
    document.getElementById('autoSwitch').checked   = State.get('autoSwitch');
    document.getElementById('soundEnabled').checked = State.get('soundEnabled');
    document.getElementById('browserNotif').checked = State.get('browserNotif');
    $p.removeAttribute('hidden');
  }

  function close() {
    document.getElementById('settingsPanel').setAttribute('hidden', '');
  }

  /** Validate, commit to State, persist, reset timer if durations changed. */
  function apply() {
    const $focus = document.getElementById('focusDuration');
    const $break = document.getElementById('breakDuration');

    const focusVal = parseInt($focus.value, 10);
    const breakVal = parseInt($break.value, 10);

    let valid = true;
    if (!Number.isInteger(focusVal) || focusVal < 1 || focusVal > 99) {
      UI.shakeEl($focus); valid = false;
    }
    if (!Number.isInteger(breakVal) || breakVal < 1 || breakVal > 99) {
      UI.shakeEl($break); valid = false;
    }
    if (!valid) return;

    State.set('focusDuration', focusVal);
    State.set('breakDuration', breakVal);
    State.set('autoSwitch',    document.getElementById('autoSwitch').checked);
    State.set('soundEnabled',  document.getElementById('soundEnabled').checked);

    // Browser notifications require explicit permission
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
    Timer.reset();  // Apply new durations immediately
    AudioEngine.playClick();
    close();
  }

  /** Increment / decrement a number input via the +/− buttons. */
  function step(targetId, action) {
    const $el = document.getElementById(targetId);
    let val   = parseInt($el.value, 10) || 1;
    if (action === 'inc') val = Math.min(99, val + 1);
    if (action === 'dec') val = Math.max(1,  val - 1);
    $el.value = val;
  }

  return { open, close, apply, step };
})();

/* ============================================================
   APP — bootstrap & global event wiring
   ============================================================ */
function App() {
  // 1. Restore persisted settings
  Storage.load();

  // 2. Initialise UI refs
  UI.init();

  // 3. Apply persisted theme
  UI.applyTheme(State.get('theme'));

  // 4. Render initial timer state
  Timer.reset();
  UI.setMode(State.get('currentMode'));
  UI.updateSessionCount();
  UI.updateQuote();

  /* ── Timer Controls ── */
  UI.$startBtn.addEventListener('click', () => Timer.toggle());
  UI.$resetBtn.addEventListener('click', () => { AudioEngine.playClick(); Timer.reset(); });
  UI.$skipBtn.addEventListener('click',  () => Timer.skip());

  /* ── Quick Time Adjust (+5 / −5 min) ── */
  document.getElementById('decreaseTime').addEventListener('click', () => Timer.adjustTime(-5));
  document.getElementById('increaseTime').addEventListener('click', () => Timer.adjustTime(+5));

  /* ── Click / Enter on timer display → inline edit ── */
  document.getElementById('timerTime').addEventListener('click', () => UI.openTimerEdit());
  document.getElementById('timerTime').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); UI.openTimerEdit(); }
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

  /* ── Theme Toggle ── */
  UI.$themeToggle.addEventListener('click', () => {
    const next = State.get('theme') === 'dark' ? 'light' : 'dark';
    State.set('theme', next);
    UI.applyTheme(next);
    Storage.save();
    AudioEngine.playClick();
  });

  /* ── Settings ── */
  UI.$settingsToggle.addEventListener('click', () => Settings.open());
  UI.$settingsClose.addEventListener('click',  () => Settings.close());
  document.getElementById('applySettings').addEventListener('click', () => Settings.apply());

  // +/− stepper buttons
  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => Settings.step(btn.dataset.target, btn.dataset.action));
  });

  // Reset session counter
  document.getElementById('resetSessions').addEventListener('click', () => {
    State.set('sessionCount', 0);
    Storage.save();
    UI.updateSessionCount();
    AudioEngine.playClick();
  });

  /* ── Popup close ── */
  document.getElementById('popupClose').addEventListener('click', () => Popup.close());

  // Close popup on backdrop click
  document.getElementById('popupOverlay').addEventListener('click', e => {
    if (e.target.id === 'popupOverlay') Popup.close();
  });

  /* ── Keyboard Shortcuts ── */
  document.addEventListener('keydown', e => {
    // Skip shortcuts when focus is inside a form control
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
        break;
    }
  });

  /* ── Clamp numeric inputs on manual entry ── */
  ['focusDuration', 'breakDuration'].forEach(id => {
    const $el = document.getElementById(id);
    if (!$el) return;
    $el.addEventListener('change', () => {
      const v = parseInt($el.value, 10);
      if (isNaN(v) || v < 1) $el.value = 1;
      else if (v > 99)       $el.value = 99;
    });
  });
}

/* ── Entry point ── */
document.addEventListener('DOMContentLoaded', App);
