/* ============================================================
   NEOTRETIS — board.js
   Pure data layer. No DOM, no timers, no side effects.
   All functions are deterministic given the same inputs.
   ============================================================ */

import { COLS, ROWS, BUFFER_ROWS, TOTAL_ROWS } from './constants.js';
import { WALL_KICKS, getMatrix, getCells } from './tetrominoes.js';

// ─── Board creation ───────────────────────────────────────────
/**
 * Creates a fresh empty board.
 * board[row][col] = null  → empty
 * board[row][col] = 'X'   → locked cell of piece type X
 * Row 0 is the topmost buffer row; row BUFFER_ROWS is the visible top.
 */
export function createBoard() {
  return Array.from({ length: TOTAL_ROWS }, () => new Array(COLS).fill(null));
}

// ─── Collision detection ──────────────────────────────────────
/**
 * Returns true if the piece at its current position collides with
 * the board walls or any locked cell.
 */
export function collides(board, piece) {
  const cells = getCells(piece);
  for (const [r, c] of cells) {
    // Out of horizontal bounds
    if (c < 0 || c >= COLS) return true;
    // Below the bottom of the board
    if (r >= TOTAL_ROWS) return true;
    // Above the top buffer — allow it (piece is still spawning)
    if (r < 0) continue;
    // Locked cell occupied
    if (board[r][c] !== null) return true;
  }
  return false;
}

// ─── Movement helpers ─────────────────────────────────────────
/**
 * Returns a new piece shifted by (dr, dc). Does NOT mutate.
 */
export function shifted(piece, dr, dc) {
  return { ...piece, row: piece.row + dr, col: piece.col + dc };
}

/**
 * Attempt to move piece by (dr, dc).
 * Returns { piece, moved } — if collision, returns original piece + moved=false.
 */
export function tryMove(board, piece, dr, dc) {
  const next = shifted(piece, dr, dc);
  if (collides(board, next)) return { piece, moved: false };
  return { piece: next, moved: true };
}

// ─── Rotation (SRS) ──────────────────────────────────────────
/**
 * Attempt to rotate piece by +1 (clockwise) or -1 (counter-clockwise).
 * Tests the SRS wall-kick offsets in order.
 * Returns { piece, rotated } — rotated=false if all offsets fail.
 */
export function tryRotate(board, piece, dir = 1) {
  const numRotations = 4;
  const fromRot = piece.rotation;
  const toRot = ((fromRot + dir) % numRotations + numRotations) % numRotations;

  const rotated = { ...piece, rotation: toRot };
  const kickKey = `${fromRot}>${toRot}`;
  const kicks = WALL_KICKS[piece.type][kickKey] ?? [[0, 0]];

  for (const [dx, dy] of kicks) {
    // SRS convention: dx = column offset, dy = row offset (positive = down)
    const candidate = { ...rotated, col: rotated.col + dx, row: rotated.row + dy };
    if (!collides(board, candidate)) {
      return { piece: candidate, rotated: true };
    }
  }

  return { piece, rotated: false };
}

// ─── Ghost piece ──────────────────────────────────────────────
/**
 * Projects the piece straight down until it would collide.
 * Returns the ghost piece (same type/rotation, lower row).
 */
export function getGhost(board, piece) {
  let ghost = { ...piece };
  while (!collides(board, { ...ghost, row: ghost.row + 1 })) {
    ghost = { ...ghost, row: ghost.row + 1 };
  }
  return ghost;
}

// ─── Hard drop ────────────────────────────────────────────────
/**
 * Drops the piece to the lowest valid position.
 * Returns { piece: landedPiece, cellsDropped }.
 */
export function hardDrop(board, piece) {
  let current = { ...piece };
  let dropped = 0;
  while (!collides(board, { ...current, row: current.row + 1 })) {
    current = { ...current, row: current.row + 1 };
    dropped++;
  }
  return { piece: current, cellsDropped: dropped };
}

// ─── Locking ─────────────────────────────────────────────────
/**
 * Burns the piece's cells into the board. Mutates board in place.
 * Returns the mutated board (same reference).
 */
export function lockPiece(board, piece) {
  const cells = getCells(piece);
  for (const [r, c] of cells) {
    if (r >= 0 && r < TOTAL_ROWS && c >= 0 && c < COLS) {
      board[r][c] = piece.type;
    }
  }
  return board;
}

// ─── Line clearing ────────────────────────────────────────────
/**
 * Scans the board for full rows, removes them, and inserts empty
 * rows at the top of the visible area.
 *
 * Returns { board, linesCleared, clearedRows }
 *   linesCleared  — number of rows removed (0–4)
 *   clearedRows   — row indices (in TOTAL_ROWS space) that were cleared
 */
export function clearLines(board) {
  const clearedRows = [];

  // Scan all rows (top to bottom in array order)
  for (let r = 0; r < TOTAL_ROWS; r++) {
    if (board[r].every(cell => cell !== null)) {
      clearedRows.push(r);
    }
  }

  if (clearedRows.length === 0) {
    return { board, linesCleared: 0, clearedRows: [] };
  }

  // Build a new board without the cleared rows, then prepend empty rows
  const remaining = board.filter((_, r) => !clearedRows.includes(r));
  const emptyRows = Array.from(
    { length: clearedRows.length },
    () => new Array(COLS).fill(null)
  );
  const newBoard = [...emptyRows, ...remaining];

  return {
    board: newBoard,
    linesCleared: clearedRows.length,
    clearedRows,
  };
}

// ─── Game-over detection ──────────────────────────────────────
/**
 * Returns true if any cell in the visible top row (row BUFFER_ROWS)
 * is occupied — the board has topped out.
 */
export function isTopOut(board) {
  return board[BUFFER_ROWS].some(cell => cell !== null);
}

/**
 * Returns true if a freshly spawned piece immediately collides.
 * This is the definitive game-over condition used after spawn.
 */
export function isBlockOut(board, piece) {
  return collides(board, piece);
}

// ─── Read helpers ─────────────────────────────────────────────
/**
 * Returns the cell value (null or type string) at board coordinates.
 * Safe: returns null for out-of-bounds.
 */
export function getCell(board, row, col) {
  if (row < 0 || row >= TOTAL_ROWS || col < 0 || col >= COLS) return null;
  return board[row][col];
}

/**
 * Snapshot: returns a deep copy of the board (for undo / display diff).
 */
export function cloneBoard(board) {
  return board.map(row => [...row]);
}
