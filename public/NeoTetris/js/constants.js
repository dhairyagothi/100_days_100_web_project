/* ============================================================
   NEOTRETIS — constants.js
   Single source of truth for every magic number in the engine.
   Nothing here mutates at runtime.
   ============================================================ */

// ─── Board dimensions ────────────────────────────────────────
export const COLS = 10;
export const ROWS = 20;

// ─── Invisible buffer rows above the visible board ───────────
// Pieces spawn here; the board array is ROWS + BUFFER tall.
// Only the bottom ROWS rows are ever rendered.
export const BUFFER_ROWS = 4;
export const TOTAL_ROWS = ROWS + BUFFER_ROWS;   // 24

// ─── Spawn column offset (left edge of the 4-wide bounding box)
export const SPAWN_COL = 3;
// Spawn row inside the buffer (row 0 = topmost buffer row)
export const SPAWN_ROW = BUFFER_ROWS - 1;      // row 3  → visible row -1

// ─── Gravity: milliseconds per automatic drop per level ──────
// Formula mirrors the original Game Boy Tetris curve.
// Level index is 0-based (level 1 → index 0).
export const GRAVITY_MS = [
  800,   // Level  1
  717,   // Level  2
  633,   // Level  3
  550,   // Level  4
  467,   // Level  5
  383,   // Level  6
  300,   // Level  7
  217,   // Level  8
  133,   // Level  9
  100,   // Level 10
  83,   // Level 11
  83,   // Level 12
  83,   // Level 13
  67,   // Level 14
  67,   // Level 15
  67,   // Level 16
  50,   // Level 17
  50,   // Level 18
  50,   // Level 19
  33,   // Level 20  (cap)
];

// After level 20 gravity stays at the minimum
export const GRAVITY_MIN_MS = 33;

// ─── Soft-drop multiplier (divides the gravity interval) ─────
export const SOFT_DROP_DIVISOR = 20;   // 20× faster than natural gravity

// ─── Points per lines cleared (single/double/triple/tetris) ──
// Values are multiplied by the current level.
export const LINE_POINTS = [
  0,    // 0 lines  (never used but keeps index clean)
  100,    // 1 line   (Single)
  300,    // 2 lines  (Double)
  500,    // 3 lines  (Triple)
  800,    // 4 lines  (Tetris)
];

// ─── Soft-drop bonus (points per cell dropped) ───────────────
export const SOFT_DROP_POINTS = 1;

// ─── Hard-drop bonus (points per cell dropped) ───────────────
export const HARD_DROP_POINTS = 2;

// ─── Combo bonus: extra points for consecutive line clears ───
// combo 1 = first consecutive clear after a gap (combo counter = 1)
// bonus = COMBO_BONUS_BASE * combo * level
export const COMBO_BONUS_BASE = 50;

// ─── Lines needed to advance one level ───────────────────────
export const LINES_PER_LEVEL = 10;

// ─── Maximum level the game tracks for gravity purposes ──────
export const MAX_LEVEL = 20;

// ─── Lock-delay: ms a piece sits on the ground before locking ─
// Resets on each successful move/rotate (max LOCK_RESETS times).
export const LOCK_DELAY_MS = 500;
export const LOCK_RESETS = 15;

// ─── DAS/ARR: keyboard repeat timings ────────────────────────
// DAS = Delayed Auto Shift (ms before key repeat starts)
// ARR = Auto Repeat Rate   (ms between repeated moves)
export const DAS_MS = 150;
export const ARR_MS = 30;

// ─── Piece type names (used as CSS class suffixes) ───────────
export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
