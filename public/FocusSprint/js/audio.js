/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Audio Manager (AudioManager)
   Synthesises a calm completion chime via Web Audio API.
   No external sound files required.
   ════════════════════════════════════════════════════════════════════ */

class AudioManager {
  static STORAGE_KEY = 'focussprint_sound_enabled';

  /** @private AudioContext instance (lazy-created) */
  static _ctx = null;

  /** @private Guard against overlapping completion sounds */
  static _isPlaying = false;

  /* ── Preference Persistence ──────────────────────────────────── */

  /**
   * Check whether sound effects are currently enabled.
   * Default: true (enabled).
   * @returns {boolean}
   */
  static isSoundEnabled() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw === null) return true; // default enabled
      return raw === 'true';
    } catch {
      return true;
    }
  }

  /**
   * Toggle sound effects on/off and persist the preference.
   * @param {boolean} [forceState] - Optional explicit state; omit to toggle.
   * @returns {boolean} The new enabled state.
   */
  static toggleSound(forceState) {
    const next = typeof forceState === 'boolean'
      ? forceState
      : !this.isSoundEnabled();

    try {
      localStorage.setItem(this.STORAGE_KEY, String(next));
    } catch {
      /* LocalStorage unavailable — preference won't persist */
    }

    return next;
  }

  /* ── Audio Context Bootstrap ─────────────────────────────────── */

  /**
   * Lazily create or resume the AudioContext.
   * Handles browser autoplay restrictions: if the context is suspended
   * it attempts to resume; on failure it returns null so callers can
   * fail silently without breaking the timer.
   * @private
   * @returns {AudioContext|null}
   */
  static _getContext() {
    try {
      if (!this._ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this._ctx = new AC();
      }

      // Resume suspended context (common after page load without interaction)
      if (this._ctx.state === 'suspended') {
        this._ctx.resume().catch(() => {});
      }

      return this._ctx;
    } catch {
      return null;
    }
  }

  /* ── Sound Synthesis ─────────────────────────────────────────── */

  /**
   * Play a pleasant two-tone completion chime.
   *
   * Design: Two harmonically related sine tones (C5 → E5) with a
   * gentle attack and smooth exponential decay, producing a calm
   * bell-like sound suitable for productivity contexts.
   *
   * Guards:
   *  - Respects the user's sound-enabled preference.
   *  - Prevents overlapping playback (_isPlaying flag).
   *  - Fails silently if the AudioContext cannot be created or resumed.
   *
   * @returns {boolean} true if the sound was triggered, false otherwise.
   */
  static playCompletionSound() {
    // 1. Check preference
    if (!this.isSoundEnabled()) return false;

    // 2. Prevent overlapping sounds
    if (this._isPlaying) return false;

    // 3. Obtain audio context
    const ctx = this._getContext();
    if (!ctx || ctx.state === 'suspended') return false;

    try {
      this._isPlaying = true;
      const now = ctx.currentTime;

      // ── Master gain (overall volume envelope) ────────────────
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.35, now + 0.05); // gentle attack
      master.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      master.connect(ctx.destination);

      // ── Tone 1: C5 (523.25 Hz) — primary bell ───────────────
      this._playTone(ctx, master, 523.25, now, 0, 1.8);

      // ── Tone 2: E5 (659.25 Hz) — harmonic shimmer ───────────
      this._playTone(ctx, master, 659.25, now, 0.12, 1.4);

      // ── Tone 3: G5 (783.99 Hz) — soft sparkle ───────────────
      this._playTone(ctx, master, 783.99, now, 0.24, 1.0, 0.15);

      // Release the playing guard after the sound fully decays
      const releaseMs = 2400;
      setTimeout(() => {
        this._isPlaying = false;
      }, releaseMs);

      return true;
    } catch {
      this._isPlaying = false;
      return false;
    }
  }

  /**
   * Create and schedule a single sine tone with an independent gain envelope.
   * @private
   * @param {AudioContext} ctx
   * @param {GainNode} destination - The node to connect to.
   * @param {number} freq - Frequency in Hz.
   * @param {number} ctxNow - The AudioContext currentTime at invocation.
   * @param {number} delaySeconds - Onset delay relative to ctxNow.
   * @param {number} durationSeconds - Duration of the tone.
   * @param {number} [peakGain=0.25] - Peak gain value.
   */
  static _playTone(ctx, destination, freq, ctxNow, delaySeconds, durationSeconds, peakGain = 0.25) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctxNow);

    const onset = ctxNow + delaySeconds;
    gain.gain.setValueAtTime(0, onset);
    gain.gain.linearRampToValueAtTime(peakGain, onset + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, onset + durationSeconds);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(onset);
    osc.stop(onset + durationSeconds + 0.05);
  }

  /* ── Browser Notification ────────────────────────────────────── */

  /**
   * Request notification permission only when the user initiates an
   * action that benefits from it (lazy/just-in-time request).
   * @returns {Promise<boolean>} Whether permission was granted.
   */
  static async requestNotificationPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Show a browser notification for session completion.
   * Only fires if permission is already granted.
   */
  static showCompletionNotification() {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      new Notification('FocusSprint', {
        body: 'Your focus session has completed.\nTake a short break and recharge.',
        icon: '✅',
        tag: 'focussprint-complete', // prevents duplicate notifications
        requireInteraction: false,
      });
    } catch {
      /* Fail silently — notifications are a nice-to-have */
    }
  }
}
