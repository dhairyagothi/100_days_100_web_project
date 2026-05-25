/**
 * main.js — entry point, wires everything together.
 */

import { createStore } from './store.js';
import { storage } from './storage.js';
import { Timer } from './timer.js';
import { Garden } from './garden.js';
import { AudioEngine } from './audio.js';
import { Analytics } from './analytics.js';
import { Achievements } from './achievements.js';
import { Particles, startTimeOfDayWatcher } from './effects.js';
import { on } from './bus.js';

/* ========== Initial state ========== */
const DEFAULTS = {
    settings: {
        focusDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        pomodorosUntilLongBreak: 4,
        soundscape: 'silence',
        volume: 0.4,
        theme: 'auto',
        notifications: false,
    },
};

/* ========== Bootstrap ========== */
(async function bootstrap() {
    // Load settings
    const storedSettings = await storage.get('settings');
    const settings = { ...DEFAULTS.settings, ...(storedSettings || {}) };
    const store = createStore({ settings });

    /* ---- Theme ---- */
    const applyTheme = () => {
        const theme = store.state.settings.theme;
        document.documentElement.dataset.theme = theme;
        if (theme === 'auto') {
            document.documentElement.dataset.prefers = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    };
    applyTheme();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

    /* ---- Time-of-day + particles ---- */
    startTimeOfDayWatcher();
    new Particles(document.getElementById('fxCanvas'));

    /* ---- Subsystems ---- */
    const timer = new Timer(store);
    const garden = new Garden(document.getElementById('garden'), store);
    const audio = new AudioEngine();
    const analytics = new Analytics();
    const achievements = new Achievements(analytics);

    audio.setVolume(settings.volume);
    await garden.load();
    await analytics.load();
    await achievements.load();

    /* ---- DOM refs ---- */
    const $ = (id) => document.getElementById(id);
    const startBtn   = $('startBtn');
    const resetBtn   = $('resetBtn');
    const skipBtn    = $('skipBtn');
    const ambientBtn = $('ambientBtn');
    const ambientLabel = $('ambientLabel');
    const ambientInd = ambientBtn.querySelector('.ambient-toggle__indicator');
    const timerTime  = $('timerTime');
    const timerMode  = $('timerMode');
    const timerCycle = $('timerCycle');
    const ringFill   = $('ringFill');
    const themeBtn   = $('themeBtn');
    const settingsBtn= $('settingsBtn');
    const settingsModal = $('settingsModal');
    const setFocus   = $('setFocus');
    const setFocusOut= $('setFocusOut');
    const setShort   = $('setShort');
    const setShortOut= $('setShortOut');
    const setLong    = $('setLong');
    const setLongOut = $('setLongOut');
    const setCycle   = $('setCycle');
    const setCycleOut= $('setCycleOut');
    const setSound   = $('setSound');
    const setNotif   = $('setNotif');
    const wipeBtn    = $('wipeBtn');

    /* ---- Initial DOM sync ---- */
    const RING_CIRC = 2 * Math.PI * 92;
    ringFill.style.strokeDasharray = RING_CIRC.toFixed(2);
    ringFill.style.strokeDashoffset = 0;

    const fmtTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const refreshTimerDisplay = (remaining, total, state) => {
        timerTime.textContent = fmtTime(remaining);
        const progress = total > 0 ? remaining / total : 0;
        ringFill.style.strokeDashoffset = (RING_CIRC * (1 - progress)).toFixed(2);
        const labels = {
            'idle':        'ready',
            'focus':       'focus',
            'short-break': 'short break',
            'long-break':  'long break',
            'paused':      'paused',
        };
        timerMode.textContent = labels[state] || 'focus';
        const cycle = store.state.settings.pomodorosUntilLongBreak;
        const done = timer.completedThisCycle;
        timerCycle.textContent = Array.from({ length: cycle })
            .map((_, i) => (i < done ? '●' : '○')).join('  ');
    };

    refreshTimerDisplay(settings.focusDuration, settings.focusDuration, 'idle');

    /* ---- Wire timer events ---- */
    on('timer:tick', ({ remaining, total, state }) => {
        refreshTimerDisplay(remaining, total, state);
    });
    on('timer:phase', ({ state, remaining }) => {
        const total = state === 'focus' ? store.state.settings.focusDuration
                   : state === 'short-break' ? store.state.settings.shortBreakDuration
                   : state === 'long-break'  ? store.state.settings.longBreakDuration
                   : 0;
        refreshTimerDisplay(remaining || total, total, state);
        updateStartBtn();
    });
    on('timer:started', updateStartBtn);
    on('timer:paused',  updateStartBtn);
    on('timer:reset',   () => {
        const total = store.state.settings.focusDuration;
        refreshTimerDisplay(total, total, 'idle');
        updateStartBtn();
    });

    function updateStartBtn() {
        if (timer.isRunning) {
            startBtn.textContent = 'Pause';
        } else if (timer.isPaused) {
            startBtn.textContent = 'Resume';
        } else {
            startBtn.textContent = 'Begin';
        }
    }

    /* ---- Session boundary side effects ---- */
    on('session:complete', (payload) => {
        if (payload.kind === 'focus') {
            audio.chime('complete');
            notifyUser('Focus complete', 'Time to breathe. A plant has grown in your garden.');
        } else {
            audio.chime('break-end');
            notifyUser('Break complete', 'Ready when you are.');
        }
    });

    /* ---- Buttons ---- */
    startBtn.addEventListener('click', async () => {
        await audio.resume();
        if (timer.isRunning) timer.pause();
        else                 timer.start();
    });
    resetBtn.addEventListener('click', () => timer.reset());
    skipBtn .addEventListener('click', () => timer.skip());

    /* ---- Theme toggle ---- */
    themeBtn.addEventListener('click', () => {
        const order = ['auto', 'light', 'dark'];
        const cur = store.state.settings.theme;
        const next = order[(order.indexOf(cur) + 1) % order.length];
        store.state.settings.theme = next;
        persistSettings();
        applyTheme();
    });

    /* ---- Ambient toggle ---- */
    const updateAmbientUI = () => {
        const cur = store.state.settings.soundscape;
        ambientLabel.textContent = cur.charAt(0).toUpperCase() + cur.slice(1);
        ambientInd.dataset.state = cur === 'silence' ? 'off' : 'on';
    };
    ambientBtn.addEventListener('click', async () => {
        await audio.resume();
        const order = ['silence', 'forest', 'rain', 'bowls'];
        const cur = store.state.settings.soundscape;
        const next = order[(order.indexOf(cur) + 1) % order.length];
        store.state.settings.soundscape = next;
        audio.play(next);
        updateAmbientUI();
        persistSettings();
    });
    updateAmbientUI();

    /* ---- Settings modal ---- */
    const syncSettingsForm = () => {
        const s = store.state.settings;
        setFocus.value = s.focusDuration / 60;
        setShort.value = s.shortBreakDuration / 60;
        setLong.value  = s.longBreakDuration / 60;
        setCycle.value = s.pomodorosUntilLongBreak;
        setFocusOut.value = `${s.focusDuration / 60} min`;
        setShortOut.value = `${s.shortBreakDuration / 60} min`;
        setLongOut.value  = `${s.longBreakDuration / 60} min`;
        setCycleOut.value = `${s.pomodorosUntilLongBreak} sessions`;
        setSound.value    = s.soundscape;
        setNotif.checked  = s.notifications;
    };

    settingsBtn.addEventListener('click', () => {
        syncSettingsForm();
        settingsModal.showModal();
    });

    setFocus.addEventListener('input', e => setFocusOut.value = `${e.target.value} min`);
    setShort.addEventListener('input', e => setShortOut.value = `${e.target.value} min`);
    setLong .addEventListener('input', e => setLongOut.value  = `${e.target.value} min`);
    setCycle.addEventListener('input', e => setCycleOut.value = `${e.target.value} sessions`);

    settingsModal.addEventListener('close', async () => {
        if (settingsModal.returnValue !== 'confirm') return;
        store.state.settings.focusDuration = +setFocus.value * 60;
        store.state.settings.shortBreakDuration = +setShort.value * 60;
        store.state.settings.longBreakDuration  = +setLong.value * 60;
        store.state.settings.pomodorosUntilLongBreak = +setCycle.value;
        store.state.settings.soundscape = setSound.value;
        store.state.settings.notifications = setNotif.checked;
        await persistSettings();

        if (setNotif.checked && Notification?.permission !== 'granted') {
            try { await Notification.requestPermission(); } catch {}
        }
        if (store.state.settings.soundscape !== audio.currentType) {
            audio.play(store.state.settings.soundscape);
            updateAmbientUI();
        }
        if (!timer.isRunning && !timer.isPaused) {
            const total = store.state.settings.focusDuration;
            refreshTimerDisplay(total, total, 'idle');
        }
    });

    /* ---- Reset everything ---- */
    wipeBtn.addEventListener('click', async () => {
        if (!confirm('Erase your entire garden, stats, and achievements? This cannot be undone.')) return;
        await garden.wipe();
        await analytics.wipe();
        await achievements.wipe();
        settingsModal.close('cancel');
    });

    async function persistSettings() {
        await storage.set('settings', store.snapshot().settings);
    }

    function notifyUser(title, body) {
        if (!store.state.settings.notifications) return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        if (document.visibilityState === 'visible') return;
        try {
            new Notification(title, {
                body,
                icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Ctext y=\'52\' font-size=\'52\'%3E🌱%3C/text%3E%3C/svg%3E',
                silent: true,
            });
        } catch {}
    }

    document.addEventListener('visibilitychange', () => timer.handleVisibilityChange());

    /* ---- Keyboard shortcuts ---- */
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.code === 'Space')      { e.preventDefault(); startBtn.click(); }
        else if (e.key === 'r')      { resetBtn.click(); }
        else if (e.key === 's')      { skipBtn.click(); }
        else if (e.key === 'c')      { settingsBtn.click(); }
        else if (e.key === 't')      { themeBtn.click(); }
    });

    /* ---- Konami easter egg: rare marathon plant ---- */
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let kIdx = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konami[kIdx]) {
            kIdx++;
            if (kIdx === konami.length) {
                kIdx = 0;
                garden.plantSeed(60 * 60, Date.now());
                achievements.showToast({ label: 'Hidden Bonsai', hint: 'You found a secret seed.' });
            }
        } else { kIdx = 0; }
    });

    /* ---- Service worker (PWA) ---- */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
})();