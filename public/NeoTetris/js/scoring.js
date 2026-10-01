/* ============================================================
   NEOTRETIS — scoring.js
   Pure scoring model. No DOM, no timers, no side effects.

   The engine calls methods on a ScoreManager instance after each
   game event. The renderer reads the public properties to paint
   the stat panels.

   Public read properties (all numbers):
     .score      Current score
     .highScore  All-time high score (persisted in localStorage)
     .level      Current level (1-based)
     .lines      Total lines cleared this game
     .combo      Current consecutive-clear streak (0 = no streak)

   Public methods called by the engine:
     .reset()                   — Start a new game
     .addLineClear(n)           — n lines cleared in one lock (1–4)
     .addSoftDrop(cells)        — cells soft-dropped (called each step)
     .addHardDrop(cells)        — cells hard-dropped at once
     .breakCombo()              — A piece locked without clearing a line
     .currentGravityMs()        — Gravity interval for the current level
   ============================================================ */

import {
  LINE_POINTS,
  SOFT_DROP_POINTS,
  HARD_DROP_POINTS,
  COMBO_BONUS_BASE,
  LINES_PER_LEVEL,
  MAX_LEVEL,
  GRAVITY_MS,
  GRAVITY_MIN_MS,
} from './constants.js';

// localStorage key for persisting the high score
const HS_KEY = 'neotretris_highscore';

export class ScoreManager {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;   // consecutive line-clear streak
    this.highScore = this._loadHighScore();
    this._preGameHighScore = this.highScore;
    this._highScoreCelebrated = false;
  }

  // ─── Lifecycle ────────────────────────────────────────────────

  /** Reset all per-game state. High score is preserved. */
  reset() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this._preGameHighScore = this.highScore;
    this._highScoreCelebrated = false;
  }

  // ─── Scoring events ───────────────────────────────────────────

  /**
   * Called when n lines are cleared simultaneously.
   * Applies line clear points, combo bonus, updates level.
   *
   * @param  {number} n  Lines cleared (1–4)
   * @returns {object}   { points, comboBonus, levelUp, newLevel }
   *                     so the engine can trigger animations/toasts.
   */
  addLineClear(n) {
    if (n < 1 || n > 4) return { points: 0, comboBonus: 0, levelUp: false, newLevel: this.level };

    // Advance combo before calculating bonus (first clear = combo 1)
    this.combo += 1;

    // Base line-clear points
    const basePoints = LINE_POINTS[n] * this.level;

    // Combo bonus: 50 × combo_count × level
    const comboBonus = COMBO_BONUS_BASE * this.combo * this.level;

    const totalPoints = basePoints + comboBonus;
    this.score += totalPoints;
    this.lines += n;

    // Level progression
    const prevLevel = this.level;
    this.level = Math.min(MAX_LEVEL, Math.floor(this.lines / LINES_PER_LEVEL) + 1);
    const levelUp = this.level > prevLevel;

    // Persist high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._saveHighScore();
    }

    this._checkHighScoreCelebration();

    return {
      points: totalPoints,
      comboBonus,
      levelUp,
      newLevel: this.level,
    };
  }

  /**
   * Called each time the active piece descends one cell via soft drop.
   * @param {number} cells  Number of cells dropped (almost always 1)
   */
  addSoftDrop(cells = 1) {
    const points = SOFT_DROP_POINTS * cells;
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._saveHighScore();
    }
    this._checkHighScoreCelebration();
    return points;
  }

  /**
   * Called once when the player hard-drops a piece.
   * @param {number} cells  Number of cells the piece fell
   */
  addHardDrop(cells) {
    const points = HARD_DROP_POINTS * cells;
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._saveHighScore();
    }
    this._checkHighScoreCelebration();
    return points;
  }

  _checkHighScoreCelebration() {
    if (this._preGameHighScore > 0) {
      if (this.score > this._preGameHighScore && !this._highScoreCelebrated) {
        this._highScoreCelebrated = true;
        window.NeoTetrisParticles?.addConfetti();
        window.NeoTetrisAudio?.playNewHighScore();
        window.NeoTetrisUI?.showToast('🏆', `NEW HIGH SCORE: ${this.score.toLocaleString()}!`, 5000);
      }
    } else {
      if (this.score >= 5000 && !this._highScoreCelebrated) {
        this._highScoreCelebrated = true;
        window.NeoTetrisParticles?.addConfetti();
        window.NeoTetrisAudio?.playNewHighScore();
        window.NeoTetrisUI?.showToast('🏆', `NEW HIGH SCORE: ${this.score.toLocaleString()}!`, 5000);
      }
    }
  }

  /**
   * Called when a piece locks without clearing any lines.
   * Resets the combo streak.
   */
  breakCombo() {
    this.combo = 0;
  }

  // ─── Gravity ──────────────────────────────────────────────────

  /**
   * Returns the gravity interval (ms per drop) for the current level.
   * Uses the pre-computed GRAVITY_MS table; clamps at GRAVITY_MIN_MS.
   */
  currentGravityMs() {
    const idx = Math.min(this.level - 1, GRAVITY_MS.length - 1);
    return GRAVITY_MS[idx] ?? GRAVITY_MIN_MS;
  }

  // ─── High-score persistence ───────────────────────────────────

  _loadHighScore() {
    try {
      const stored = localStorage.getItem(HS_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0; // localStorage unavailable (private browsing, etc.)
    }
  }

  _saveHighScore() {
    try {
      localStorage.setItem(HS_KEY, String(this.highScore));
    } catch {
      // Silently ignore storage failures
    }
  }
}
