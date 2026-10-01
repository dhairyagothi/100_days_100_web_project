/* ============================================================
   NEOTRETIS — tetrominoes.js
   Piece shape matrices (all 4 rotations), SRS wall-kick tables,
   and the 7-bag randomizer.
   ============================================================ */

import { PIECE_TYPES } from './constants.js';

// ─── Shape matrices ──────────────────────────────────────────
// Each piece stores 4 rotation states (0°, 90°, 180°, 270°).
// A matrix is an array of rows; 1 = filled cell, 0 = empty.
// All bounding boxes are normalised:
//   I, O → 4×4   T, S, Z, J, L → 3×3
// Rotation index 0 = spawn orientation.

export const TETROMINOES = {

  I: {
    type: 'I',
    rotations: [
      [[0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],

      [[0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]],

      [[0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]],

      [[0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]],
    ],
  },

  O: {
    type: 'O',
    rotations: [
      [[0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],

      [[0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],

      [[0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],

      [[0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    ],
  },

  T: {
    type: 'T',
    rotations: [
      [[0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]],

      [[0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]],

      [[0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]],

      [[0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]],
    ],
  },

  S: {
    type: 'S',
    rotations: [
      [[0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]],

      [[0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]],

      [[0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]],

      [[1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]],
    ],
  },

  Z: {
    type: 'Z',
    rotations: [
      [[1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]],

      [[0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]],

      [[0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]],

      [[0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]],
    ],
  },

  J: {
    type: 'J',
    rotations: [
      [[1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]],

      [[0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]],

      [[0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]],

      [[0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]],
    ],
  },

  L: {
    type: 'L',
    rotations: [
      [[0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]],

      [[0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]],

      [[0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]],

      [[1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]],
    ],
  },

};

// ─── SRS Wall-Kick Tables ─────────────────────────────────────
// Source: Tetris wiki SRS specification.
// Format: KICKS[fromRotation][toRotation] = [[dx,dy], ...]
// Positive x = right, positive y = down (board coordinates).
// The engine tests each offset in order; uses the first that fits.

// J, L, S, T, Z share one kick table
const KICKS_JLSTZ = {
  '0>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1>0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1>2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3>2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3>0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '0>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

// I has its own kick table
const KICKS_I = {
  '0>1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1>0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1>2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2>1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2>3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3>2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3>0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0>3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

// O does not kick (all rotations identical, engine skips kicks for O)
const KICKS_O = {};

export const WALL_KICKS = {
  I: KICKS_I,
  O: KICKS_O,
  T: KICKS_JLSTZ,
  S: KICKS_JLSTZ,
  Z: KICKS_JLSTZ,
  J: KICKS_JLSTZ,
  L: KICKS_JLSTZ,
};

// ─── 7-Bag Randomizer ─────────────────────────────────────────
// Guarantees each of the 7 pieces appears exactly once per bag.
// Call nextPiece() to always get a fresh piece object.

export class Bag {
  constructor() {
    this._bag = [];
    this._refill();
  }

  _refill() {
    // Fisher-Yates shuffle of a fresh set of all 7 types
    const pool = [...PIECE_TYPES];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this._bag.push(...pool);
  }

  /** Returns the type string of the next piece, refilling if needed. */
  next() {
    if (this._bag.length === 0) this._refill();
    return this._bag.shift();
  }

  /** Peek at the next N types without consuming them. */
  peek(n = 3) {
    // Ensure there are enough items to peek
    while (this._bag.length < n) this._refill();
    return this._bag.slice(0, n);
  }
}

// ─── Piece factory ────────────────────────────────────────────
// Returns a plain object representing a live falling piece.
// row/col are the top-left corner of the bounding box in board space.

export function createPiece(type, row, col) {
  return {
    type,
    rotation: 0,
    row,
    col,
    // Convenience getter — current matrix (not stored, computed from type+rotation)
  };
}

/** Return the current rotation matrix for a piece. */
export function getMatrix(piece) {
  return TETROMINOES[piece.type].rotations[piece.rotation];
}

/** Return all filled [row, col] cells of a piece in board coordinates. */
export function getCells(piece) {
  const matrix = getMatrix(piece);
  const cells = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        cells.push([piece.row + r, piece.col + c]);
      }
    }
  }
  return cells;
}
