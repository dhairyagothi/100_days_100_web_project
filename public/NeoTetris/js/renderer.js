/* ============================================================
   NEOTRETIS — renderer.js
   All DOM writes live here. Zero game logic.

   Strategy:
   - _cells[]  : flat array of the 200 board-cell DOM nodes,
                 built once at init(). Index = visibleRow * COLS + col.
   - Each frame, drawFrame() composites a display grid:
       1. locked board cells  (type string)
       2. ghost piece cells   (sentinel '__ghost__')
       3. active piece cells  (type string, on top)
     Then diffs each cell's target className against _prevClasses[]
     and only writes to the DOM where something changed.
   - Preview panels delegate to window.NeoTetrisUI.buildPiecePreview
     (already written in main.js) with a self-contained fallback.
   - Score/level/lines/combo update via window.NeoTetrisUI helpers,
     falling back to direct getElementById writes.
   ============================================================ */

import { COLS, ROWS, BUFFER_ROWS, LINES_PER_LEVEL } from './constants.js';
import { getCells } from './tetrominoes.js';
import { getGhost } from './board.js';

// ─── CSS class fragments ──────────────────────────────────────
const BASE = 'board-cell';
const BASE_EVEN = 'board-cell row-even';

/** Build the expected className for a display-grid value. */
function classFor(value, visibleRow) {
  const even = visibleRow % 2 === 0;
  if (value === null) {
    return even ? BASE_EVEN : BASE;
  }
  if (value === '__ghost__') {
    return even ? `${BASE_EVEN} ghost` : `${BASE} ghost`;
  }
  if (typeof value === 'string' && value.startsWith('__ghost__-')) {
    const type = value.substring(10);
    return even ? `${BASE_EVEN} ghost piece-${type}` : `${BASE} ghost piece-${type}`;
  }
  // Locked or active piece cell
  return even
    ? `${BASE_EVEN} filled piece-${value}`
    : `${BASE} filled piece-${value}`;
}

// ─── Preview matrices (mirrors main.js PIECE_PREVIEWS) ────────
const PREVIEW_MATRICES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  T: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  S: [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  Z: [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  J: [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  L: [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
};

export class Renderer {
  /**
   * @param {HTMLElement} boardEl  The #tetris-board div
   */
  constructor(boardEl) {
    this._boardEl = boardEl;
    this._cells = [];   // 200 DOM nodes, row-major, visible rows only
    this._prevClasses = [];   // last written className per cell
    this._ui = null; // window.NeoTetrisUI, resolved lazily
  }

  // ─── Init ────────────────────────────────────────────────────

  /**
   * Populate #tetris-board with exactly ROWS × COLS cell divs.
   * Wipes whatever was rendered by main.js (demo pieces etc.).
   * Call once before the first frame.
   */
  init() {
    this._boardEl.innerHTML = '';
    this._cells = [];
    this._prevClasses = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const div = document.createElement('div');
        const baseClass = r % 2 === 0 ? BASE_EVEN : BASE;
        div.className = baseClass;
        div.dataset.row = r;
        div.dataset.col = c;
        this._boardEl.appendChild(div);
        this._cells.push(div);
        this._prevClasses.push(baseClass);
      }
    }

    this._resolveUI();
  }

  // ─── Frame render ────────────────────────────────────────────

  /**
   * Compose and diff-paint one display frame.
   *
   * @param {Array[][]}   board       Full TOTAL_ROWS × COLS board matrix
   * @param {Object|null} activePiece Currently falling piece (null between pieces)
   * @param {boolean}     showGhost   Whether to paint the ghost projection
   */
  drawFrame(board, activePiece, showGhost = true) {
    // Step 1 — flatten the visible portion of the board into a display array
    const display = new Array(ROWS * COLS).fill(null);

    for (let r = 0; r < ROWS; r++) {
      const boardRow = board[BUFFER_ROWS + r];
      for (let c = 0; c < COLS; c++) {
        display[r * COLS + c] = boardRow[c]; // null or type string
      }
    }

    // Step 2 — overlay ghost (only on empty cells so it never occludes locked pieces)
    if (activePiece && showGhost) {
      const ghost = getGhost(board, activePiece);
      for (const [br, bc] of getCells(ghost)) {
        const vr = br - BUFFER_ROWS;
        if (vr >= 0 && vr < ROWS && bc >= 0 && bc < COLS) {
          if (display[vr * COLS + bc] === null) {
            display[vr * COLS + bc] = `__ghost__-${activePiece.type}`;
          }
        }
      }
    }

    // Step 3 — overlay active piece (always on top)
    if (activePiece) {
      for (const [br, bc] of getCells(activePiece)) {
        const vr = br - BUFFER_ROWS;
        if (vr >= 0 && vr < ROWS && bc >= 0 && bc < COLS) {
          display[vr * COLS + bc] = activePiece.type;
        }
      }
    }

    // Step 4 — diff paint: only touch DOM nodes whose class changed
    for (let i = 0; i < this._cells.length; i++) {
      const vr = Math.floor(i / COLS);
      const target = classFor(display[i], vr);
      if (target !== this._prevClasses[i]) {
        this._cells[i].className = target;
        this._prevClasses[i] = target;
      }
    }
  }

  // ─── Board helpers ───────────────────────────────────────────

  /** Reset every visible cell to its base empty class. */
  clearDisplay() {
    for (let i = 0; i < this._cells.length; i++) {
      const vr = Math.floor(i / COLS);
      const base = vr % 2 === 0 ? BASE_EVEN : BASE;
      if (this._prevClasses[i] !== base) {
        this._cells[i].className = base;
        this._prevClasses[i] = base;
      }
    }
  }

  // ─── Preview panels ──────────────────────────────────────────

  /**
   * Render the three "NEXT UP" preview slots.
   * @param {string[]} types  Up to 3 piece-type strings from Bag.peek()
   */
  drawNextQueue(types) {
    this._resolveUI();
    const slots = [
      { id: 'next-1', small: false },
      { id: 'next-2', small: true },
      { id: 'next-3', small: true },
    ];
    slots.forEach(({ id, small }, i) => {
      const type = types[i] ?? null;
      if (type) {
        this._renderPreview(id, type, small);
      } else {
        this._clearPreview(id, small);
      }
    });
  }

  /**
   * Render the hold-piece preview.
   * @param {string|null} type  Piece type, or null for empty slot
   */
  drawHold(type) {
    this._resolveUI();
    if (type) {
      this._renderPreview('hold-area', type, false);
    } else {
      this._clearPreview('hold-area', false);
    }
  }

  // ─── Stat panels ─────────────────────────────────────────────

  /** @param {number} score */
  drawScore(score) {
    this._resolveUI();
    if (this._ui?.updateScore) {
      this._ui.updateScore(score);
      return;
    }
    const el = document.getElementById('score-val');
    if (el) el.textContent = String(score).padStart(6, '0');
    const bar = document.getElementById('score-bar');
    if (bar) bar.style.width = `${Math.min(100, (score / 100000) * 100)}%`;
  }

  /** @param {number} highScore */
  drawHighScore(highScore) {
    const el = document.getElementById('high-score-val');
    if (el) el.textContent = String(highScore).padStart(6, '0');
  }

  /**
   * @param {number} level   1-based current level
   * @param {number} lines   Total lines cleared (used to compute pip position)
   */
  drawLevel(level) {
    const el = document.getElementById('level-val');
    if (el) el.textContent = String(level).padStart(2, '0');

    // Pips cycle 1-5 within each group of 5 levels
    const pipActive = level % 5 === 0 ? 5 : level % 5;
    this._resolveUI();
    if (this._ui?.updateLevelPips) {
      this._ui.updateLevelPips(pipActive);
    } else {
      const pips = document.querySelectorAll('.level-pips .pip');
      pips.forEach((pip, i) => pip.classList.toggle('active', i < pipActive));
    }
  }

  /** @param {number} lines  Total lines cleared */
  drawLines(lines) {
    const el = document.getElementById('lines-val');
    if (el) el.textContent = String(lines).padStart(3, '0');

    // "NEXT LVL" countdown
    const remainder = lines % LINES_PER_LEVEL;
    const toNext = remainder === 0 ? 0 : LINES_PER_LEVEL - remainder;
    const needed = document.querySelector('.lines-needed');
    if (needed) needed.textContent = String(toNext);
  }

  /** @param {number} combo  Current consecutive-clear streak (0 = no streak) */
  drawCombo(combo) {
    this._resolveUI();
    if (this._ui?.updateComboDisplay) {
      this._ui.updateComboDisplay(combo);
      return;
    }
    // Fallback
    const el = document.getElementById('combo-val');
    if (el) el.textContent = `x${combo}`;
    const flame = document.getElementById('combo-flame');
    if (flame) flame.classList.toggle('active', combo > 0);
  }

  // ─── Private helpers ─────────────────────────────────────────

  _resolveUI() {
    if (!this._ui && window.NeoTetrisUI) {
      this._ui = window.NeoTetrisUI;
    }
  }

  /**
   * Render a piece into a preview container.
   * Prefers window.NeoTetrisUI.buildPiecePreview; falls back to inline build.
   */
  _renderPreview(containerId, type, small) {
    if (this._ui?.buildPiecePreview) {
      this._ui.buildPiecePreview(containerId, type, small);
      return;
    }
    // Self-contained fallback (identical output to main.js version)
    const container = document.getElementById(containerId);
    if (!container) return;
    const matrix = PREVIEW_MATRICES[type];
    if (!matrix) return;
    const cellSize = small ? 10 : 14;
    const grid = document.createElement('div');
    grid.style.cssText = [
      'display:grid',
      `grid-template-columns:repeat(4,${cellSize}px)`,
      `grid-template-rows:repeat(4,${cellSize}px)`,
      'gap:1px',
    ].join(';');
    matrix.forEach(row => {
      row.forEach(filled => {
        const div = document.createElement('div');
        div.style.cssText = `width:${cellSize}px;height:${cellSize}px;border-radius:2px;`;
        if (filled) {
          div.style.background = `var(--piece-${type})`;
          div.style.boxShadow = `0 0 4px var(--piece-${type})`;
          div.style.opacity = '0.9';
        }
        grid.appendChild(div);
      });
    });
    container.innerHTML = '';
    container.appendChild(grid);
  }

  /** Reset a preview slot to its HTML empty-state placeholder. */
  _clearPreview(containerId, small) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (small) {
      container.innerHTML =
        `<div class="empty-piece-hint sm"><span class="piece-ghost-text">—</span></div>`;
    } else {
      container.innerHTML =
        `<div class="empty-piece-hint">` +
        `<div class="piece-placeholder">` +
        `<span class="piece-ghost-text">EMPTY</span>` +
        `</div></div>`;
    }
  }

  /**
   * Applies line-clear visual flash to the row.
   * @param {number} vr  Visible row index (0-19)
   */
  flashRow(vr) {
    const startIdx = vr * COLS;
    for (let c = 0; c < COLS; c++) {
      const cell = this._cells[startIdx + c];
      if (cell) {
        cell.classList.add('line-clear-flash');
      }
    }
  }
}
