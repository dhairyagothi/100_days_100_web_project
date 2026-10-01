/* ============================================================
   NEOTRETIS — audio.js
   Central sound synthesizer using browser Web Audio API.
   No external assets needed.
   ============================================================ */

const MASTER_VOL_KEY = 'neotretis_volume_master';
const MUSIC_VOL_KEY = 'neotretis_volume_music';
const SFX_VOL_KEY = 'neotretis_volume_sfx';
const MUTE_KEY = 'neotretis_mute';

export class AudioManager {
  constructor() {
    this._ctx = null;
    this._volumeMaster = this._loadSetting(MASTER_VOL_KEY, 0.5);
    this._volumeMusic = this._loadSetting(MUSIC_VOL_KEY, 0.5);
    this._volumeSFX = this._loadSetting(SFX_VOL_KEY, 0.5);
    this._muted = this._loadMutedSetting();

    this._masterGain = null;
    this._sfxGain = null;
    this._musicGain = null;

    this._hasUserGesture = false;

    // Background Music scheduling state
    this._bgmInterval = null;
    this._bgmStep = 0;
    this._nextNoteTime = 0.0;

    // Single shared array of gesture listeners to avoid duplicates
    const unlock = () => {
      this._hasUserGesture = true;
      this._initContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  _initContext() {
    if (!this._ctx && this._hasUserGesture) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this._ctx = new AudioCtx();

        // Routing Gain Nodes
        this._masterGain = this._ctx.createGain();
        this._sfxGain = this._ctx.createGain();
        this._musicGain = this._ctx.createGain();

        // sfxGain and musicGain feed into masterGain
        this._sfxGain.connect(this._masterGain);
        this._musicGain.connect(this._masterGain);
        this._masterGain.connect(this._ctx.destination);

        this._updateGains();
      }
    }
    if (this._ctx && this._ctx.state === 'suspended' && this._hasUserGesture) {
      this._ctx.resume();
    }
    return this._ctx;
  }

  _loadSetting(key, defVal) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? parseFloat(v) : defVal;
    } catch {
      return defVal;
    }
  }

  _loadMutedSetting() {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  _saveSettings() {
    try {
      localStorage.setItem(MASTER_VOL_KEY, String(this._volumeMaster));
      localStorage.setItem(MUSIC_VOL_KEY, String(this._volumeMusic));
      localStorage.setItem(SFX_VOL_KEY, String(this._volumeSFX));
      localStorage.setItem(MUTE_KEY, String(this._muted));
    } catch { /* ignore */ }
  }

  _updateGains() {
    if (!this._masterGain || !this._musicGain || !this._sfxGain || !this._ctx) return;
    const now = this._ctx.currentTime;
    const targetMaster = this._muted ? 0 : this._volumeMaster;
    this._masterGain.gain.setValueAtTime(targetMaster, now);
    this._musicGain.gain.setValueAtTime(this._volumeMusic, now);
    this._sfxGain.gain.setValueAtTime(this._volumeSFX, now);
  }

  get volumeMaster() { return this._volumeMaster; }
  set volumeMaster(val) {
    this._volumeMaster = Math.max(0, Math.min(1, val));
    this._saveSettings();
    this._updateGains();
  }

  get volumeMusic() { return this._volumeMusic; }
  set volumeMusic(val) {
    this._volumeMusic = Math.max(0, Math.min(1, val));
    this._saveSettings();
    this._updateGains();
  }

  get volumeSFX() { return this._volumeSFX; }
  set volumeSFX(val) {
    this._volumeSFX = Math.max(0, Math.min(1, val));
    this._saveSettings();
    this._updateGains();
  }

  get muted() { return this._muted; }

  toggleMute() {
    this._muted = !this._muted;
    this._saveSettings();
    this._updateGains();
    return this._muted;
  }

  /** Helper to create local source chain connected to sfxGain */
  _createSFXChain() {
    const ctx = this._initContext();
    if (!ctx || this._muted || this._volumeMaster === 0 || this._volumeSFX === 0) return null;

    const localGain = ctx.createGain();
    localGain.connect(this._sfxGain);

    return { ctx, gainNode: localGain };
  }

  // ===========================================================
  // GAMEPLAY SOUND SYNTHESIZERS (SFX)
  // ===========================================================

  playMoveLeft() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  playMoveRight() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  playRotate() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playHold() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440.00, now); // A4
    osc1.frequency.setValueAtTime(880.00, now + 0.06); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220.00, now); // A3
    osc2.frequency.setValueAtTime(440.00, now + 0.06); // A4

    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    osc1.start();
    osc2.start();

    osc1.stop(now + 0.18);
    osc2.stop(now + 0.18);
  }

  playSoftDrop() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  playHardDrop() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.28);

    // Friction rumble using noise
    const bufferSize = ctx.sampleRate * 0.12;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    osc.connect(gainNode);

    gainNode.gain.setValueAtTime(0.65, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start();
    noiseNode.start();

    osc.stop(now + 0.3);
    noiseNode.stop(now + 0.3);
  }

  playPieceLock() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.08);

    gainNode.gain.setValueAtTime(0.45, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gainNode);
    osc.start();
    osc.stop(now + 0.08);
  }

  playLineClear() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.35, now + idx * 0.05);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.2);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  playDoubleLineClear() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [523.25, 783.99, 1046.50]; // C5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.38, now + idx * 0.06);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.25);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playTripleLineClear() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.4, now + idx * 0.06);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.3);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  playTetris() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [523.25, 783.99, 1046.50, 1318.51]; // C5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.45, now + idx * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.35);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  playLevelUp() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.25, now + idx * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4);

      osc.connect(filter);
      filter.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  playComboMilestone() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [659.25, 880.00]; // E5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.3, now + idx * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  playNewHighScore() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.28, now + idx * 0.06);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.3);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  playAchievement() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.3, now + idx * 0.05);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.35);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  }

  playChallengeComplete() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [783.99, 1046.50, 1318.51, 1567.98]; // G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.35, now + idx * 0.06);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.4);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.4);
    });
  }

  playGameOver() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [261.63, 196.00, 155.56, 130.81]; // C4, G3, Eb3, C3
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.22);
      osc.frequency.linearRampToValueAtTime(freq - 10, now + idx * 0.22 + 0.55);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.5, now + idx * 0.22);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.22 + 0.6);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.22);
      osc.stop(now + idx * 0.22 + 0.6);
    });
  }

  playStartGame() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [261.63, 523.25, 783.99]; // C4, C5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.35, now + idx * 0.06);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.25);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playPause() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [400, 200];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.3, now + idx * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.12);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.12);
    });
  }

  playResume() {
    const chain = this._createSFXChain();
    if (!chain) return;
    const { ctx, gainNode } = chain;
    const now = ctx.currentTime;

    const notes = [200, 400];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.3, now + idx * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.12);

      osc.connect(localGain);
      localGain.connect(gainNode);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.12);
    });
  }

  // ===========================================================
  // BACKGROUND MUSIC (BGM)
  // ===========================================================

  startBGM() {
    if (this._bgmInterval) return; // Idempotency check!

    this._bgmStep = 0;

    // Set first note play time slightly ahead of now
    const ctx = this._initContext();
    this._nextNoteTime = ctx ? ctx.currentTime + 0.05 : 0;

    this._bgmInterval = setInterval(() => {
      const activeCtx = this._initContext();
      if (!activeCtx || activeCtx.state === 'suspended' || this._muted || this._volumeMaster === 0 || this._volumeMusic === 0) return;

      const scheduleAheadTime = 0.3; // schedule 300ms in advance
      while (this._nextNoteTime < activeCtx.currentTime + scheduleAheadTime) {
        this._scheduleNextNote(this._bgmStep, this._nextNoteTime);
        this._advanceNote();
      }
    }, 100);
  }

  stopBGM() {
    if (this._bgmInterval) {
      clearInterval(this._bgmInterval);
      this._bgmInterval = null;
    }
  }

  _advanceNote() {
    const theme = document.documentElement.getAttribute('data-theme') || 'neon-cyberpunk';
    let stepDuration = 0.25;

    if (theme === 'neon-cyberpunk') {
      stepDuration = 0.25; // 120 BPM eighth notes
    } else if (theme === 'classic-retro') {
      stepDuration = 0.23; // 130 BPM eighth notes
    } else if (theme === 'dark-minimal') {
      stepDuration = 0.67; // 90 BPM quarter notes
    } else if (theme === 'space-theme') {
      stepDuration = 1.5;  // Very slow atmospheric steps
    }

    this._nextNoteTime += stepDuration;
    this._bgmStep++;
  }

  _scheduleNextNote(step, time) {
    const theme = document.documentElement.getAttribute('data-theme') || 'neon-cyberpunk';

    if (theme === 'neon-cyberpunk') {
      this._scheduleNeonCyberpunk(step, time);
    } else if (theme === 'classic-retro') {
      this._scheduleClassicRetro(step, time);
    } else if (theme === 'dark-minimal') {
      this._scheduleDarkMinimal(step, time);
    } else if (theme === 'space-theme') {
      this._scheduleSpaceTheme(step, time);
    }
  }

  // ─── Theme-Specific Music Schedules ────────────────────────────

  _scheduleNeonCyberpunk(step, time) {
    // Synthwave bass progression (16 steps = A1, C2, G1, F1)
    const bassProgressions = [
      55.00, 55.00, 55.00, 55.00, // Am: A1 (55Hz)
      65.41, 65.41, 65.41, 65.41, // C: C2 (65.4Hz)
      49.00, 49.00, 49.00, 49.00, // G: G1 (49Hz)
      43.65, 43.65, 43.65, 43.65  // F: F1 (43.6Hz)
    ];
    const bassFreq = bassProgressions[step % 16];

    // Play bass pulse
    const bassOsc = this._ctx.createOscillator();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(bassFreq, time);

    const bassFilter = this._ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(130, time);

    const bassGain = this._ctx.createGain();
    bassGain.gain.setValueAtTime(0.35, time);
    bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this._musicGain);

    bassOsc.start(time);
    bassOsc.stop(time + 0.24);

    // Soft high arpeggiator notes in A-minor
    const arpNotes = [
      440.00, 523.25, 659.25, 880.00,
      392.00, 493.88, 587.33, 783.99,
      349.23, 440.00, 523.25, 698.46,
      329.63, 415.30, 493.88, 659.25
    ];
    const arpFreq = arpNotes[step % arpNotes.length];

    const arpOsc = this._ctx.createOscillator();
    arpOsc.type = 'triangle';
    arpOsc.frequency.setValueAtTime(arpFreq, time);

    const arpGain = this._ctx.createGain();
    arpGain.gain.setValueAtTime(0.08, time);
    arpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    arpOsc.connect(arpGain);
    arpGain.connect(this._musicGain);

    arpOsc.start(time);
    arpOsc.stop(time + 0.2);
  }

  _scheduleClassicRetro(step, time) {
    // 8-bit chiptune melody: Tetris Type-A Theme arpeggiator/melody (32-step cycle)
    const melody = [
      659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 440.00,
      523.25, 659.25, 587.33, 523.25, 493.88, 493.88, 523.25, 587.33,
      659.25, 523.25, 440.00, 440.00, 440.00, 0, 587.33, 698.46,
      880.00, 783.99, 698.46, 659.25, 523.25, 659.25, 587.33, 523.25
    ];
    const melodyFreq = melody[step % 32];

    if (melodyFreq > 0) {
      const melOsc = this._ctx.createOscillator();
      melOsc.type = 'square';
      melOsc.frequency.setValueAtTime(melodyFreq, time);

      const melGain = this._ctx.createGain();
      melGain.gain.setValueAtTime(0.06, time);
      melGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      melOsc.connect(melGain);
      melGain.connect(this._musicGain);

      melOsc.start(time);
      melOsc.stop(time + 0.22);
    }

    // Square bassline
    const bass = [
      220.00, 110.00, 220.00, 110.00,
      196.00, 98.00, 196.00, 98.00,
      174.61, 87.31, 174.61, 87.31,
      164.81, 82.41, 164.81, 82.41
    ];
    const bassFreq = bass[step % 16];

    const bassOsc = this._ctx.createOscillator();
    bassOsc.type = 'square';
    bassOsc.frequency.setValueAtTime(bassFreq, time);

    const bassGain = this._ctx.createGain();
    bassGain.gain.setValueAtTime(0.05, time);
    bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    bassOsc.connect(bassGain);
    gainNode = null; // unused, clean up
    bassGain.connect(this._musicGain);

    bassOsc.start(time);
    bassOsc.stop(time + 0.18);
  }

  _scheduleDarkMinimal(step, time) {
    const roots = [55.00, 65.41, 49.00, 43.65]; // A1, C2, G1, F1
    const root = roots[Math.floor(step / 8) % 4];

    // Very subtle low sine drone triggered every 8 steps (5.36s)
    if (step % 8 === 0) {
      const droneOsc = this._ctx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(root, time);

      const fifthOsc = this._ctx.createOscillator();
      fifthOsc.type = 'sine';
      fifthOsc.frequency.setValueAtTime(root * 1.5, time);

      const droneGain = this._ctx.createGain();
      droneGain.gain.setValueAtTime(0, time);
      droneGain.gain.linearRampToValueAtTime(0.12, time + 1.5);
      droneGain.gain.exponentialRampToValueAtTime(0.001, time + 5.2);

      droneOsc.connect(droneGain);
      fifthOsc.connect(droneGain);
      droneGain.connect(this._musicGain);

      droneOsc.start(time);
      fifthOsc.start(time);

      droneOsc.stop(time + 5.3);
      fifthOsc.stop(time + 5.3);
    }

    // Tiny clicks
    if (step % 2 === 0) {
      const clickOsc = this._ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1000, time);

      const clickGain = this._ctx.createGain();
      clickGain.gain.setValueAtTime(0.005, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

      clickOsc.connect(clickGain);
      clickGain.connect(this._musicGain);

      clickOsc.start(time);
      clickOsc.stop(time + 0.03);
    }
  }

  _scheduleSpaceTheme(step, time) {
    // Evolving atmospheric pads (new chord every 4 steps = 6.0s)
    const chords = [
      [110.00, 164.81, 220.00, 261.63], // Am
      [130.81, 196.00, 261.63, 329.63], // C
      [98.00, 146.83, 196.00, 246.94],  // G
      [87.31, 130.81, 174.61, 220.00]   // F
    ];

    if (step % 4 === 0) {
      const chordNotes = chords[Math.floor(step / 4) % 4];

      chordNotes.forEach((freq) => {
        const osc1 = this._ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, time);

        const osc2 = this._ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq + 3.0, time); // detuned by +3Hz

        const padGain = this._ctx.createGain();
        padGain.gain.setValueAtTime(0, time);
        padGain.gain.linearRampToValueAtTime(0.08, time + 2.0);
        padGain.gain.exponentialRampToValueAtTime(0.001, time + 5.9);

        const padFilter = this._ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(300, time);
        padFilter.frequency.linearRampToValueAtTime(800, time + 3.0);
        padFilter.frequency.linearRampToValueAtTime(300, time + 5.9);

        osc1.connect(padFilter);
        osc2.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(this._musicGain);

        osc1.start(time);
        osc2.start(time);

        osc1.stop(time + 6.0);
        osc2.stop(time + 6.0);
      });
    }
  }
}
