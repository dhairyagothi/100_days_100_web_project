/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Focus Timer Class
   Pure logic (no DOM). Emits events: tick, complete, stateChange.
   Supports: start, pause, resume, reset, complete.
   ════════════════════════════════════════════════════════════════════ */

class FocusTimer {
  constructor() {
    /** @type {Object} Timer state */
    this.state = {
      sessionName: '',
      durationMinutes: 25,
      totalSeconds: 1500,
      remainingSeconds: 1500,
      isRunning: false,
      isPaused: false,
      startedAt: null,
    };

    /** @private Interval reference (only one allowed) */
    this._intervalId = null;

    /** @private Accumulated elapsed seconds from previous paused segments */
    this._accumulatedElapsedSeconds = 0;

    /** @private Start time of the current active run segment */
    this._startedAt = null;

    /** @private Guards against duplicate completion emissions */
    this._completionEmitted = false;

    /** @private Event callback registry */
    this._callbacks = {
      tick: [],
      complete: [],
      stateChange: [],
    };
  }

  /* ── Event System ──────────────────────────────────────────────── */

  /**
   * Register a callback for a timer event.
   * @param {'tick'|'complete'|'stateChange'} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (this._callbacks[event] && typeof callback === 'function' && !this._callbacks[event].includes(callback)) {
      this._callbacks[event].push(callback);
    }
  }

  /**
   * Remove a previously registered callback.
   * @param {'tick'|'complete'|'stateChange'} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!this._callbacks[event]) return;
    this._callbacks[event] = this._callbacks[event].filter((cb) => cb !== callback);
  }

  /** @private Emit an event to all registered listeners */
  _emit(event, data) {
    (this._callbacks[event] || []).forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[Timer] ${event} listener failed.`, err);
      }
    });
  }

  /* ── Configuration ─────────────────────────────────────────────── */

  /**
   * Configure the timer before starting.
   * @param {string} name    - Session name (defaults to "Untitled Session")
   * @param {number} minutes - Duration in minutes (must be > 0)
   */
  configure(name, minutes) {
    // Prevent invalid duration
    const numericMinutes = Number(minutes);
    const safeMins = Math.min(240, Math.max(1, Math.floor(numericMinutes) || 25));

    this.state.sessionName = (name || '').trim() || 'Untitled Session';
    this.state.durationMinutes = safeMins;
    this.state.totalSeconds = safeMins * 60;
    this.state.remainingSeconds = safeMins * 60;

    // Reset timing accumulators
    this._accumulatedElapsedSeconds = 0;
    this._startedAt = null;
    this._completionEmitted = false;
  }

  /* ── Controls ──────────────────────────────────────────────────── */

  /** Start the countdown. Prevents double-start. */
  start() {
    if (this.state.isRunning) return;
    if (this.state.totalSeconds <= 0) return;

    this._accumulatedElapsedSeconds = 0;
    this._startedAt = Date.now();

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.startedAt = this._startedAt;
    this._completionEmitted = false;

    this._emit('stateChange', { ...this.state });
    this._startInterval();
  }

  /** Pause the countdown. Remaining time is preserved. */
  pause() {
    if (!this.state.isRunning || this.state.isPaused) return;

    // Accumulate elapsed seconds for this run segment before pausing
    const elapsed = (Date.now() - this._startedAt) / 1000;
    this._accumulatedElapsedSeconds += elapsed;

    this.state.isPaused = true;
    this._clearInterval();
    this._emit('stateChange', { ...this.state });
  }

  /** Resume from the exact second where it was paused. */
  resume() {
    if (!this.state.isPaused) return;

    // Mark the start of a new active segment
    this._startedAt = Date.now();
    this.state.isPaused = false;
    this._emit('stateChange', { ...this.state });
    this._startInterval();
  }

  /** Reset to initial configured duration. Clears all running state. */
  reset() {
    this._clearInterval();
    this._accumulatedElapsedSeconds = 0;
    this._startedAt = null;

    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.remainingSeconds = this.state.totalSeconds;
    this.state.startedAt = null;
    this._emit('stateChange', { ...this.state });
  }

  /**
   * Mark the session as complete.
   * Called automatically when remainingSeconds reaches 0,
   * or can be called manually.
   */
  complete() {
    if (this._completionEmitted) return;
    this._completionEmitted = true;

    this._clearInterval();
    this._accumulatedElapsedSeconds = 0;
    this._startedAt = null;

    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.remainingSeconds = 0;

    this._emit('complete', {
      name: this.state.sessionName,
      duration: this.state.durationMinutes,
    });
    this._emit('stateChange', { ...this.state });
  }

  /* ── Helpers ───────────────────────────────────────────────────── */

  /**
   * Format remainingSeconds as MM:SS string.
   * @returns {string} e.g. "25:00"
   */
  getFormattedTime() {
    const mins = Math.floor(this.state.remainingSeconds / 60);
    const secs = this.state.remainingSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /** @returns {number} Progress from 0 to 100 */
  getProgress() {
    if (this.state.totalSeconds === 0) return 0;
    const elapsed = this.state.totalSeconds - this.state.remainingSeconds;
    return Math.round((elapsed / this.state.totalSeconds) * 100);
  }

  /* ── Internals ─────────────────────────────────────────────────── */

  /** @private Start the tick interval. Checks frequently to react instantly to focus. */
  _startInterval() {
    this._clearInterval();

    this._intervalId = setInterval(() => {
      if (!this._startedAt) return;

      const elapsed = (Date.now() - this._startedAt) / 1000;
      const totalElapsed = this._accumulatedElapsedSeconds + elapsed;
      const nextRemaining = Math.max(0, this.state.totalSeconds - Math.floor(totalElapsed));

      // Only trigger tick callbacks when the visible remainingSeconds integer decrements
      if (nextRemaining !== this.state.remainingSeconds) {
        this.state.remainingSeconds = nextRemaining;
        this._emit('tick', this.state.remainingSeconds);

        if (this.state.remainingSeconds <= 0) {
          this.complete();
        }
      }
    }, 200); // 200ms tick resolution for snappy correction in throttled tabs
  }

  /** @private Clear the interval without changing state. */
  _clearInterval() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
}
