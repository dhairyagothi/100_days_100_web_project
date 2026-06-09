/* ============================================================
   NEOTRETIS — engine.js
   The central game loop and state machine.

   Owns:
   - Renderer instance  (DOM painting)
   - InputHandler       (keyboard)
   - ScoreManager       (points / level / lines / combo)
   - Bag                (7-bag randomizer)
   - Board matrix       (game state)
   - Active / ghost / hold piece
   - Gravity timer (timestamp-based, inside rAF)
   - Lock-delay timer
   - Soft-drop flag

   Public API (called by main.js button wiring):
   - start()             — fresh start OR resume from pause
   - togglePause()       — pause  <->  resume
   - restart()           — hard reset to idle
   - onSoftDropRelease() — called by main.js keyup listener
   ============================================================ */

import { Renderer } from './renderer.js';
import { InputHandler, ACTION } from './input.js';
import { ScoreManager } from './scoring.js';
import { Bag, createPiece } from './tetrominoes.js';
import {
  createBoard,
  tryMove,
  tryRotate,
  lockPiece,
  clearLines,
  isBlockOut,
} from './board.js';
import {
  SPAWN_COL, SPAWN_ROW,
  LOCK_DELAY_MS, LOCK_RESETS,
  ROWS, BUFFER_ROWS,
} from './constants.js';
import { ComboManager } from './combo-system.js';
import {
  AchievementManager,
  loadLifetimeCounters,
  incrementLifetime,
} from './achievements.js';
import { ChallengeSystem } from './challenge-system.js';
import { AudioManager } from './audio.js';
import { ParticleManager } from './particles.js';

// ─── Game status enum ─────────────────────────────────────────
const STATUS = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
});

export class Engine {
  /**
   * @param {HTMLElement} boardEl         The #tetris-board div
   * @param {Object}      uiCallbacks     Hooks supplied by main.js:
   *   .onStart()        .onPause()       .onResume()
   *   .onGameOver(score).onRestart()     .showToast(icon, msg)
   */
  constructor(boardEl, uiCallbacks = {}) {
    this._ui = uiCallbacks;
    this._renderer = new Renderer(boardEl);
    this._score = new ScoreManager();
    this._input = new InputHandler(this._buildInputCallbacks());

    // Game state — all null/false until _newGame()
    this._status = STATUS.IDLE;
    this._board = null;
    this._bag = null;
    this._active = null;   // currently falling piece object
    this._held = null;   // held piece type string, or null
    this._holdUsed = false;  // enforces hold-once-per-piece rule

    // rAF loop
    this._rafId = null;
    this._lastTickTime = 0;

    // Gravity (ms per automatic drop step); updated on level change
    this._gravityMs = 800;
    this._softDrop = false;

    // Lock-delay
    this._lockTimer = null;   // setTimeout handle
    this._lockResets = 0;      // resets consumed this piece
    this._onFloor = false;  // whether piece is currently resting on floor/stack

    // ── Premium systems ─────────────────────────────────────────
    // showToast is injected so these modules never import main.js
    const toast = (icon, msg, dur) => this._ui.showToast?.(icon, msg, dur);
    this._audio = new AudioManager();
    window.NeoTetrisAudio = this._audio;
    this._particles = new ParticleManager(boardEl);
    window.NeoTetrisParticles = this._particles;

    this._combo = new ComboManager(toast);
    this._achieve = new AchievementManager(toast);
    this._challenge = new ChallengeSystem(toast);

    // Lifetime counters — persisted across sessions via localStorage
    this._lifetime = loadLifetimeCounters();

    // Per-game session counters — reset on each _newGame()
    this._session = { hardDrops: 0, holdCount: 0, tetrisCount: 0, maxCombo: 0 };
  }

  // ===========================================================
  // PUBLIC API
  // ===========================================================

  /** Fresh start, or resume if currently paused. */
  start() {
    if (this._status === STATUS.RUNNING) return;
    if (this._status === STATUS.PAUSED) { this._resume(); return; }
    // IDLE or GAMEOVER -> new game
    this._newGame();
  }

  /** Pause <-> resume toggle. */
  togglePause() {
    if (this._status === STATUS.RUNNING) this._pause();
    else if (this._status === STATUS.PAUSED) this._resume();
  }

  /** Hard reset back to idle. */
  restart() {
    this._stopLoop();
    this._input.detach();
    this._clearLockTimer();
    this._audio.stopBGM();

    this._status = STATUS.IDLE;
    this._board = null;
    this._active = null;
    this._held = null;
    this._holdUsed = false;
    this._onFloor = false;
    this._softDrop = false;

    this._score.reset();
    this._combo.reset();   // clears combo panel to x0

    // Fire UI callback first — main.js rebuilds the demo board inside onRestart()
    this._ui.onRestart?.();

    // Reset stat panels to zeroed values
    this._renderer.drawScore(0);
    this._renderer.drawHighScore(this._score.highScore);
    this._renderer.drawLevel(1);
    this._renderer.drawLines(0);
    this._renderer.drawCombo(0);
    this._renderer.drawHold(null);
    this._renderer.drawNextQueue([]);
  }

  /** Called by main.js keyup listener when ArrowDown is released. */
  onSoftDropRelease() {
    this._softDrop = false;
  }

  // ===========================================================
  // PRIVATE — LIFECYCLE
  // ===========================================================

  _newGame() {
    this._board = createBoard();
    this._bag = new Bag();
    this._held = null;
    this._holdUsed = false;
    this._softDrop = false;
    this._onFloor = false;
    this._lockResets = 0;

    this._score.reset();
    this._gravityMs = this._score.currentGravityMs();

    // Reset per-game session counters
    this._session = { hardDrops: 0, holdCount: 0, tetrisCount: 0, maxCombo: 0 };

    // Increment lifetime games-played counter, reload fresh totals
    this._lifetime = incrementLifetime({ gamesPlayed: 1 });

    // Notify premium systems of game start
    this._combo.reset();
    this._achieve.onGameStart(this._lifetime);
    this._challenge.onGameStart();

    // Init renderer: wipes board, builds 200 cell nodes
    this._renderer.init();

    // Paint zeroed stats
    this._renderer.drawScore(0);
    this._renderer.drawHighScore(this._score.highScore);
    this._renderer.drawLevel(1);
    this._renderer.drawLines(0);
    this._renderer.drawCombo(0);
    this._renderer.drawHold(null);

    // Spawn first piece (fills next-queue preview too)
    this._spawnPiece();

    this._input.attach();
    this._status = STATUS.RUNNING;
    this._audio.playStartGame();
    this._audio.startBGM();
    this._ui.onStart?.();
    this._startLoop();
  }

  _pause() {
    if (this._status !== STATUS.RUNNING) return;
    this._status = STATUS.PAUSED;
    this._stopLoop();
    this._input.detach();
    this._clearLockTimer();
    this._audio.playPause();
    this._audio.stopBGM();
    this._ui.onPause?.();
  }

  _resume() {
    if (this._status !== STATUS.PAUSED) return;
    this._status = STATUS.RUNNING;
    // Reset tick time so gravity doesn't fire immediately after a long pause
    this._lastTickTime = performance.now();
    this._input.attach();
    this._audio.playResume();
    this._audio.startBGM();
    this._ui.onResume?.();
    this._startLoop();
  }

  _gameOver() {
    this._status = STATUS.GAMEOVER;
    this._stopLoop();
    this._input.detach();
    this._clearLockTimer();
    this._audio.stopBGM();
    // Render the final locked frame without the active piece
    this._renderer.drawFrame(this._board, null, false);
    this._audio.playGameOver();
    this._ui.onGameOver?.(this._score.score);
  }

  // ===========================================================
  // PRIVATE — GAME LOOP
  // ===========================================================

  _startLoop() {
    this._lastTickTime = performance.now();
    const tick = (now) => {
      if (this._status !== STATUS.RUNNING) return;
      this._update(now);
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  _stopLoop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /**
   * Called every rAF frame (~16ms).
   * Only gravity is time-driven here; all other actions are input-driven.
   */
  _update(now) {
    if (!this._active) return;

    // Effective gravity interval: soft-drop divides by 20, floor at 16ms (1 frame)
    const interval = this._softDrop
      ? Math.max(16, this._gravityMs / 20)
      : this._gravityMs;

    if (now - this._lastTickTime >= interval) {
      this._lastTickTime = now;
      this._gravityStep();
    }

    // Paint every frame — diff renderer makes this cheap
    this._renderer.drawFrame(this._board, this._active, true);
  }

  // ===========================================================
  // PRIVATE — GRAVITY & LOCK
  // ===========================================================

  _gravityStep() {
    const { piece, moved } = tryMove(this._board, this._active, 1, 0);

    if (moved) {
      this._active = piece;
      this._onFloor = false;
      if (this._softDrop) {
        this._score.addSoftDrop(1);
        this._renderer.drawScore(this._score.score);
        this._audio.playSoftDrop();
      }
    } else {
      // Cannot drop further — start lock delay if not already running
      if (!this._onFloor) {
        this._onFloor = true;
        this._scheduleLock();
      }
    }
  }

  _scheduleLock() {
    this._clearLockTimer();
    this._lockTimer = setTimeout(() => {
      if (!this._active) return;
      // Confirm piece still can't move down (player may have shifted it off the floor)
      const { moved } = tryMove(this._board, this._active, 1, 0);
      if (!moved) {
        this._lockActivePiece();
      } else {
        this._onFloor = false;
      }
    }, LOCK_DELAY_MS);
  }

  _clearLockTimer() {
    if (this._lockTimer !== null) {
      clearTimeout(this._lockTimer);
      this._lockTimer = null;
    }
  }

  /**
   * Resets the lock-delay timer when the player moves or rotates while
   * the piece is on the floor. Capped at LOCK_RESETS to prevent stalling.
   */
  _tryResetLock() {
    if (!this._onFloor) return;
    if (this._lockResets >= LOCK_RESETS) return;
    this._lockResets++;
    this._scheduleLock();
  }

  // ===========================================================
  // PRIVATE — LOCKING & LINE CLEAR
  // ===========================================================

  _lockActivePiece() {
    if (!this._active) return;

    lockPiece(this._board, this._active);
    const lockedPiece = this._active;   // keep ref for potential future use
    this._active = null;
    this._onFloor = false;
    this._clearLockTimer();

    // Render the final locked frame immediately without the active piece
    this._renderer.drawFrame(this._board, null, false);

    // Clear completed lines
    const { board: clearedBoard, linesCleared, clearedRows } = clearLines(this._board);

    if (linesCleared > 0) {
      // Trigger flash animations and explosions on the grid cells
      const cellColor = `var(--piece-${lockedPiece.type})`;
      clearedRows.forEach(r => {
        const vr = r - BUFFER_ROWS;
        if (vr >= 0 && vr < ROWS) {
          this._renderer.flashRow(vr);
          this._particles.addLineExplosion(vr, cellColor);
        }
      });

      // Play audio & particles
      if (linesCleared === 4) {
        this._audio.playTetris();
        this._particles.addConfetti();
      } else if (linesCleared === 3) {
        this._audio.playTripleLineClear();
      } else if (linesCleared === 2) {
        this._audio.playDoubleLineClear();
      } else {
        this._audio.playLineClear();
      }

      // Defer state update, scoring, and spawning the next piece
      setTimeout(() => {
        this._board = clearedBoard;

        const result = this._score.addLineClear(linesCleared);

        this._renderer.drawScore(this._score.score);
        this._renderer.drawHighScore(this._score.highScore);
        this._renderer.drawLines(this._score.lines);
        this._renderer.drawCombo(this._score.combo);
        this._renderer.drawLevel(this._score.level);

        if (result.levelUp) {
          this._gravityMs = this._score.currentGravityMs();
          this._audio.playLevelUp();
          this._ui.showToast?.('⚡', `LEVEL ${this._score.level}!`);
        }

        // Track Tetris clears for achievements and session stats
        if (linesCleared === 4) {
          this._session.tetrisCount += 1;
          this._lifetime = incrementLifetime({ totalTetris: 1 });
        }

        // Update max combo high-water mark for this session
        if (this._score.combo > this._session.maxCombo) {
          this._session.maxCombo = this._score.combo;
        }

        // Persist lifetime line total
        this._lifetime = incrementLifetime({ totalLines: linesCleared });

        // Notify combo system (renders panel, fires milestone toasts)
        this._combo.onLineClear(linesCleared, this._score.combo, result.comboBonus);

        // Notify achievements and daily challenges with full snapshot
        this._notifySystems();

        this._announceClear(linesCleared, result);

        // Spawn next piece
        this._spawnPiece();
      }, 250);

    } else {
      this._audio.playPieceLock();
      this._score.breakCombo();
      this._renderer.drawCombo(0);
      // Combo broken — reset combo panel
      this._combo.onBreak();

      // Spawn next piece immediately
      this._spawnPiece();
    }
  }

  _announceClear(n, result) {
    const labels = { 1: 'SINGLE', 2: 'DOUBLE', 3: 'TRIPLE', 4: 'TETRIS! 🎉' };
    const icons = { 1: '✓', 2: '✓✓', 3: '✓✓✓', 4: '🔷' };
    const label = labels[n] ?? '';
    const icon = icons[n] ?? '✓';
    const suffix = result.comboBonus > 0
      ? `  +${result.points}  (×${this._score.combo} COMBO!)`
      : `  +${result.points}`;
    this._ui.showToast?.(icon, `${label}${suffix}`);
  }

  // ===========================================================
  // PRIVATE — PIECE SPAWNING
  // ===========================================================

  _spawnPiece() {
    const type = this._bag.next();
    const piece = createPiece(type, SPAWN_ROW, SPAWN_COL);

    // Block-out: new piece overlaps locked cells → game over
    if (isBlockOut(this._board, piece)) {
      this._active = piece;
      this._renderer.drawFrame(this._board, this._active, false);
      this._gameOver();
      return;
    }

    this._active = piece;
    this._holdUsed = false;
    this._onFloor = false;
    this._lockResets = 0;
    this._clearLockTimer();

    // Update next-queue and hold previews
    this._renderer.drawNextQueue(this._bag.peek(3));
    this._renderer.drawHold(this._held);
  }

  // ===========================================================
  // PRIVATE — INPUT CALLBACKS
  // ===========================================================

  _buildInputCallbacks() {
    return {
      [ACTION.MOVE_LEFT]: () => this._handleMove(0, -1),
      [ACTION.MOVE_RIGHT]: () => this._handleMove(0, 1),
      [ACTION.SOFT_DROP]: () => this._handleSoftDrop(),
      [ACTION.HARD_DROP]: () => this._handleHardDrop(),
      [ACTION.ROTATE_CW]: () => this._handleRotate(1),
      [ACTION.ROTATE_CCW]: () => this._handleRotate(-1),
      [ACTION.HOLD]: () => this._handleHold(),
      [ACTION.PAUSE]: () => this.togglePause(),
    };
  }

  _handleMove(dr, dc) {
    if (this._status !== STATUS.RUNNING || !this._active) return;
    const { piece, moved } = tryMove(this._board, this._active, dr, dc);
    if (moved) {
      this._active = piece;
      this._tryResetLock();
      if (dc < 0) {
        this._audio.playMoveLeft();
      } else {
        this._audio.playMoveRight();
      }
    }
  }

  _handleSoftDrop() {
    if (this._status !== STATUS.RUNNING) return;
    this._softDrop = true;
    // Force an immediate gravity tick on the next frame
    this._lastTickTime = 0;
  }

  _handleHardDrop() {
    if (this._status !== STATUS.RUNNING || !this._active) return;

    // Drop piece to its lowest position
    let dropped = 0;
    let res = tryMove(this._board, this._active, 1, 0);
    while (res.moved) {
      this._active = res.piece;
      dropped++;
      res = tryMove(this._board, this._active, 1, 0);
    }

    if (dropped > 0) {
      this._score.addHardDrop(dropped);
      this._renderer.drawScore(this._score.score);

      // Track hard drops for achievements and daily challenges
      this._session.hardDrops += 1;
      this._lifetime = incrementLifetime({ totalHardDrops: 1 });
      this._notifySystems();

      // Trigger sparks at landing coordinates
      const cells = getCells(this._active);
      const color = `var(--piece-${this._active.type})`;
      cells.forEach(([r, c]) => {
        const vr = r - BUFFER_ROWS;
        if (vr >= 0 && vr < ROWS) {
          this._particles.addSparks(vr, c, color);
        }
      });
      this._audio.playHardDrop();
    }

    // Bypass lock delay — lock immediately
    this._clearLockTimer();
    this._lockActivePiece();
  }

  _handleRotate(dir) {
    if (this._status !== STATUS.RUNNING || !this._active) return;
    const { piece, rotated } = tryRotate(this._board, this._active, dir);
    if (rotated) {
      this._active = piece;
      this._tryResetLock();
      this._audio.playRotate();
    }
  }

  _handleHold() {
    if (this._status !== STATUS.RUNNING || !this._active) return;
    if (this._holdUsed) return;   // once-per-piece rule

    this._holdUsed = true;
    this._clearLockTimer();
    this._onFloor = false;

    // Track hold usage for achievements and daily challenges
    this._session.holdCount += 1;
    this._lifetime = incrementLifetime({ totalHolds: 1 });
    this._notifySystems();
    this._audio.playHold();

    const currentType = this._active.type;

    if (this._held === null) {
      // Nothing held yet: hold current piece, spawn next from bag
      this._held = currentType;
      this._active = null;
      this._spawnPiece();
    } else {
      // Swap held with active
      const returnType = this._held;
      this._held = currentType;
      this._active = createPiece(returnType, SPAWN_ROW, SPAWN_COL);
      this._lockResets = 0;
      // Refresh previews immediately
      this._renderer.drawHold(this._held);
      this._renderer.drawNextQueue(this._bag.peek(3));
    }
  }

  // ===========================================================
  // PRIVATE — PREMIUM SYSTEM HELPERS
  // ===========================================================

  /**
   * Compose the unified snapshot object passed to AchievementManager
   * and ChallengeSystem. Merges per-game session stats with lifetime
   * counters so both systems get everything they need in one call.
   */
  _buildSnapshot() {
    return {
      // Live game stats (from ScoreManager)
      score: this._score.score,
      lines: this._score.lines,
      level: this._score.level,
      // Per-game session counters
      tetrisCount: this._session.tetrisCount,
      hardDrops: this._session.hardDrops,
      holdCount: this._session.holdCount,
      maxCombo: this._session.maxCombo,
      // Lifetime counters (from localStorage via incrementLifetime)
      totalLines: this._lifetime.totalLines,
      totalHardDrops: this._lifetime.totalHardDrops,
      totalHolds: this._lifetime.totalHolds,
      totalTetris: this._lifetime.totalTetris,
      gamesPlayed: this._lifetime.gamesPlayed,
    };
  }

  /**
   * Push the current snapshot to AchievementManager and ChallengeSystem.
   * Call after any game event that could advance progress.
   */
  _notifySystems() {
    const snap = this._buildSnapshot();
    this._achieve.notify(snap);
    this._challenge.notify(snap);
  }
}