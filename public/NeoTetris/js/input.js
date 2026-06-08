/* ============================================================
   NEOTRETIS — input.js
   Keyboard input handler with DAS/ARR for horizontal movement.

   Architecture:
   - InputHandler is instantiated once by the engine.
   - All game actions are pure callbacks injected at construction;
     input.js has zero knowledge of game state or DOM beyond
     listening to window keyboard events.
   - attach() / detach() let the engine enable/disable input
     cleanly across pause / game-over transitions.
   ============================================================ */

import { DAS_MS, ARR_MS } from './constants.js';

// ─── Action constants ─────────────────────────────────────────
// Strings used as keys in the callbacks map. Centralised here so
// the engine can reference them without magic strings.
export const ACTION = Object.freeze({
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  SOFT_DROP: 'SOFT_DROP',
  HARD_DROP: 'HARD_DROP',
  ROTATE_CW: 'ROTATE_CW',
  ROTATE_CCW: 'ROTATE_CCW',
  HOLD: 'HOLD',
  PAUSE: 'PAUSE',
});

// ─── Key → Action mapping ─────────────────────────────────────
const KEY_MAP = {
  'ArrowLeft': ACTION.MOVE_LEFT,
  'ArrowRight': ACTION.MOVE_RIGHT,
  'ArrowDown': ACTION.SOFT_DROP,
  'ArrowUp': ACTION.ROTATE_CW,
  'KeyZ': ACTION.ROTATE_CCW,   // Z = CCW rotate (common Tetris binding)
  ' ': ACTION.HARD_DROP,    // Space
  'KeyC': ACTION.HOLD,
  'Escape': ACTION.PAUSE,
};

// Actions that use DAS/ARR (held-key auto-repeat)
const REPEATING_ACTIONS = new Set([
  ACTION.MOVE_LEFT,
  ACTION.MOVE_RIGHT,
  ACTION.SOFT_DROP,
]);

export class InputHandler {
  /**
   * @param {Object} callbacks  Map of ACTION → function
   *   Every ACTION key should have a corresponding function.
   *   Missing callbacks are silently skipped.
   */
  constructor(callbacks = {}) {
    this._callbacks = callbacks;
    this._attached = false;

    // Per-action DAS/ARR state
    // Only one horizontal action and soft-drop can be "held" at a time.
    this._held = {
      [ACTION.MOVE_LEFT]: false,
      [ACTION.MOVE_RIGHT]: false,
      [ACTION.SOFT_DROP]: false,
    };

    // Timer handles
    this._dasTimer = null;   // setTimeout for DAS charge
    this._arrTimer = null;   // setInterval for ARR repeat
    this._dasAction = null;  // which action is currently in DAS/ARR

    // Bind so we can add/remove the exact same function reference
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  // ─── Public API ─────────────────────────────────────────────

  attach() {
    if (this._attached) return;
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    this._attached = true;
  }

  detach() {
    if (!this._attached) return;
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this._attached = false;
    this._cancelRepeat();
    // Clear all held state
    for (const key of Object.keys(this._held)) {
      this._held[key] = false;
    }
  }

  // ─── Event handlers ─────────────────────────────────────────

  _onKeyDown(e) {
    // Prevent arrow keys / space from scrolling the page
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    // Map physical key to logical action
    // e.code is layout-independent (WASD etc.) for letter keys;
    // e.key is used for arrows/space since those don't have a 'Key' prefix.
    const action = KEY_MAP[e.code] ?? KEY_MAP[e.key];
    if (!action) return;

    // Prevent browser key-repeat from firing our logic twice
    if (e.repeat) return;

    // Fire the action immediately on first press
    this._fire(action);

    // Start DAS/ARR for repeatable actions
    if (REPEATING_ACTIONS.has(action)) {
      this._held[action] = true;
      this._startRepeat(action);
    }
  }

  _onKeyUp(e) {
    const action = KEY_MAP[e.code] ?? KEY_MAP[e.key];
    if (!action) return;

    if (REPEATING_ACTIONS.has(action)) {
      this._held[action] = false;

      // Only cancel timers if the released key was the one driving DAS/ARR
      if (this._dasAction === action) {
        this._cancelRepeat();

        // If the opposite horizontal key is still held, start its DAS immediately
        // but skip the DAS charge (instant ARR) — feels more natural.
        if (action === ACTION.MOVE_LEFT && this._held[ACTION.MOVE_RIGHT]) {
          this._startRepeat(ACTION.MOVE_RIGHT, true);
        } else if (action === ACTION.MOVE_RIGHT && this._held[ACTION.MOVE_LEFT]) {
          this._startRepeat(ACTION.MOVE_LEFT, true);
        } else if (action === ACTION.SOFT_DROP && this._held[ACTION.SOFT_DROP]) {
          // Shouldn't happen but guard anyway
          this._startRepeat(ACTION.SOFT_DROP);
        }
      }
    }
  }

  // ─── DAS / ARR machinery ────────────────────────────────────

  /**
   * Start the DAS charge then ARR repeat for an action.
   * @param {string}  action
   * @param {boolean} skipDAS  Jump straight to ARR (used on key-swap)
   */
  _startRepeat(action, skipDAS = false) {
    this._cancelRepeat();
    this._dasAction = action;

    if (skipDAS) {
      this._arrTimer = setInterval(() => {
        if (this._held[action]) this._fire(action);
        else this._cancelRepeat();
      }, ARR_MS);
    } else {
      this._dasTimer = setTimeout(() => {
        // DAS expired — begin ARR
        this._arrTimer = setInterval(() => {
          if (this._held[action]) this._fire(action);
          else this._cancelRepeat();
        }, ARR_MS);
      }, DAS_MS);
    }
  }

  _cancelRepeat() {
    clearTimeout(this._dasTimer);
    clearInterval(this._arrTimer);
    this._dasTimer = null;
    this._arrTimer = null;
    this._dasAction = null;
  }

  // ─── Callback dispatcher ─────────────────────────────────────

  _fire(action) {
    const cb = this._callbacks[action];
    if (typeof cb === 'function') cb();
  }
}
