/**
 * timer.js — Pomodoro state machine.
 *
 * States: idle → focus → focus-complete → short-break|long-break → break-complete → idle
 * Uses requestAnimationFrame + Date.now() for drift-free countdown.
 * Integrates Wake Lock + Page Visibility.
 */

import { emitEvent } from './bus.js';

const STATES = Object.freeze({
    IDLE: 'idle',
    FOCUS: 'focus',
    SHORT_BREAK: 'short-break',
    LONG_BREAK: 'long-break',
    PAUSED: 'paused',
});

export class Timer {
    constructor(store) {
        this.store = store;
        this.state = STATES.IDLE;
        this.endTime = null;       // wall-clock ms when current phase ends
        this.remaining = 0;        // seconds (for paused / display state)
        this.rafHandle = null;
        this.wakeLock = null;
        this._pausedRemaining = 0;
        this.completedThisCycle = 0;  // focus sessions in the current long-break cycle
    }

    get isRunning() { return this.state !== STATES.IDLE && this.state !== STATES.PAUSED; }
    get isFocus()   { return this.state === STATES.FOCUS; }
    get isBreak()   { return this.state === STATES.SHORT_BREAK || this.state === STATES.LONG_BREAK; }
    get isPaused()  { return this.state === STATES.PAUSED; }

    _durationFor(state) {
        const s = this.store.get('settings');
        switch (state) {
            case STATES.FOCUS:       return s.focusDuration;
            case STATES.SHORT_BREAK: return s.shortBreakDuration;
            case STATES.LONG_BREAK:  return s.longBreakDuration;
            default: return 0;
        }
    }

    _setPhase(state) {
        this.state = state;
        if (state === STATES.IDLE || state === STATES.PAUSED) {
            this.endTime = null;
        } else {
            const dur = this._durationFor(state);
            this.endTime = Date.now() + dur * 1000;
            this.remaining = dur;
        }
        emitEvent('timer:phase', { state, remaining: this.remaining });
        this._reflectBodyClass();
    }

    _reflectBodyClass() {
        document.body.classList.toggle('is-focus-active', this.state === STATES.FOCUS);
        document.body.classList.toggle('is-focus', this.isFocus);
        document.body.classList.toggle('is-break', this.isBreak);
    }

    start() {
        if (this.state === STATES.IDLE) {
            this._setPhase(STATES.FOCUS);
        } else if (this.state === STATES.PAUSED) {
            // Resume
            this.endTime = Date.now() + this._pausedRemaining * 1000;
            this.state = this._pausedFrom;
            emitEvent('timer:phase', { state: this.state, remaining: this._pausedRemaining });
            this._reflectBodyClass();
        }
        this._acquireWakeLock();
        this._loop();
        emitEvent('timer:started');
    }

    pause() {
        if (!this.isRunning) return;
        this._pausedRemaining = Math.max(0, (this.endTime - Date.now()) / 1000);
        this._pausedFrom = this.state;
        this.state = STATES.PAUSED;
        this.endTime = null;
        cancelAnimationFrame(this.rafHandle);
        this._releaseWakeLock();
        emitEvent('timer:paused', { remaining: this._pausedRemaining });
        this._reflectBodyClass();
    }

    reset() {
        cancelAnimationFrame(this.rafHandle);
        this._releaseWakeLock();
        this.state = STATES.IDLE;
        this.endTime = null;
        this.remaining = 0;
        this._pausedRemaining = 0;
        emitEvent('timer:reset');
        this._reflectBodyClass();
    }

    skip() {
        if (this.state === STATES.IDLE) return;
        this._completePhase();
    }

    _completePhase() {
        cancelAnimationFrame(this.rafHandle);
        const finishedState = this.state;
        const focusDuration = this._durationFor(STATES.FOCUS);

        if (finishedState === STATES.FOCUS) {
            // Focus session ended — grow a plant
            this.completedThisCycle += 1;
            emitEvent('session:complete', {
                kind: 'focus',
                duration: focusDuration,
                completedAt: Date.now(),
            });

            const s = this.store.get('settings');
            const nextState = (this.completedThisCycle >= s.pomodorosUntilLongBreak)
                ? STATES.LONG_BREAK
                : STATES.SHORT_BREAK;
            if (nextState === STATES.LONG_BREAK) this.completedThisCycle = 0;
            this._setPhase(nextState);
            this._loop();
        } else if (finishedState === STATES.SHORT_BREAK || finishedState === STATES.LONG_BREAK) {
            emitEvent('session:complete', { kind: 'break', completedAt: Date.now() });
            this._setPhase(STATES.IDLE);
            this._releaseWakeLock();
        }
    }

    _loop() {
        const tick = () => {
            if (!this.isRunning || this.endTime == null) return;
            const remaining = Math.max(0, (this.endTime - Date.now()) / 1000);
            this.remaining = remaining;
            emitEvent('timer:tick', {
                remaining,
                total: this._durationFor(this.state),
                state: this.state,
            });
            if (remaining <= 0) {
                this._completePhase();
                return;
            }
            this.rafHandle = requestAnimationFrame(tick);
        };
        tick();
    }

    async _acquireWakeLock() {
        if (!('wakeLock' in navigator)) return;
        try {
            this.wakeLock = await navigator.wakeLock.request('screen');
            this.wakeLock.addEventListener('release', () => { this.wakeLock = null; });
        } catch (err) {
            // user denied / battery saver — just skip
        }
    }

    _releaseWakeLock() {
        if (this.wakeLock) {
            this.wakeLock.release().catch(() => {});
            this.wakeLock = null;
        }
    }

    /** Re-acquire wake lock on visibility return. */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible' && this.isRunning) {
            this._acquireWakeLock();
        }
    }
}

Timer.STATES = STATES;