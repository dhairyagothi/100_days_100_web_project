/**
 * Sudoku Engine
 * Contains solving, generation, and AI Hint logic.
 */
(function(global) {
  'use strict';

  const SudokuEngine = {};

  // Simple seedable pseudo-random number generator (LCG / Mulberry32 hybrid)
  function createRandom(seedStr) {
    let seed = 0;
    if (typeof seedStr === 'number') {
      seed = seedStr;
    } else if (typeof seedStr === 'string') {
      for (let i = 0; i < seedStr.length; i++) {
        seed = (seed << 5) - seed + seedStr.charCodeAt(i);
        seed |= 0;
      }
    } else {
      seed = Math.floor(Math.random() * 2147483647);
    }

    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Helper index conversions
  SudokuEngine.getRow = function(idx) { return Math.floor(idx / 9); };
  SudokuEngine.getCol = function(idx) { return idx % 9; };
  SudokuEngine.getBox = function(idx) {
    return Math.floor(Math.floor(idx / 9) / 3) * 3 + Math.floor((idx % 9) / 3);
  };

  // Get all cells in the same row
  SudokuEngine.getRowCells = function(r) {
    const cells = [];
    const start = r * 9;
    for (let i = 0; i < 9; i++) cells.push(start + i);
    return cells;
  };

  // Get all cells in the same column
  SudokuEngine.getColCells = function(c) {
    const cells = [];
    for (let i = 0; i < 9; i++) cells.push(i * 9 + c);
    return cells;
  };

  // Get all cells in the same 3x3 box
  SudokuEngine.getBoxCells = function(b) {
    const cells = [];
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        cells.push((startRow + r) * 9 + (startCol + c));
      }
    }
    return cells;
  };

  // Get peers (all cells in same row, column, or box, excluding the index itself)
  SudokuEngine.getPeers = function(idx) {
    const r = this.getRow(idx);
    const c = this.getCol(idx);
    const b = this.getBox(idx);
    const peersSet = new Set();

    this.getRowCells(r).forEach(i => peersSet.add(i));
    this.getColCells(c).forEach(i => peersSet.add(i));
    this.getBoxCells(b).forEach(i => peersSet.add(i));
    peersSet.delete(idx);

    return Array.from(peersSet);
  };

  // Check if val can be placed at idx legally
  SudokuEngine.isValidPlace = function(board, idx, val) {
    const peers = this.getPeers(idx);
    for (let i = 0; i < peers.length; i++) {
      if (board[peers[i]] === val) {
        return false;
      }
    }
    return true;
  };

  // Backtracking solver
  // Returns solved board array if solvable, or null
  SudokuEngine.solve = function(board) {
    const copy = [...board];
    if (solveBacktrack(copy)) {
      return copy;
    }
    return null;
  };

  function solveBacktrack(board) {
    const emptyIdx = board.indexOf(0);
    if (emptyIdx === -1) return true; // Solved

    for (let val = 1; val <= 9; val++) {
      if (SudokuEngine.isValidPlace(board, emptyIdx, val)) {
        board[emptyIdx] = val;
        if (solveBacktrack(board)) return true;
        board[emptyIdx] = 0; // Backtrack
      }
    }
    return false;
  }

  // Count solutions up to a limit (useful for uniqueness check)
  SudokuEngine.countSolutions = function(board, limit = 2) {
    let count = 0;
    const copy = [...board];

    function backtrack(idx) {
      if (count >= limit) return;
      
      const emptyIdx = copy.indexOf(0, idx);
      if (emptyIdx === -1) {
        count++;
        return;
      }

      for (let val = 1; val <= 9; val++) {
        if (SudokuEngine.isValidPlace(copy, emptyIdx, val)) {
          copy[emptyIdx] = val;
          backtrack(emptyIdx + 1);
          copy[emptyIdx] = 0;
        }
      }
    }

    backtrack(0);
    return count;
  };

  // Generate a complete solved board randomly
  SudokuEngine.generateSolvedBoard = function(rng) {
    const board = Array(81).fill(0);
    
    function fill(idx) {
      if (idx === 81) return true;
      
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // Shuffle candidates using our rng
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
      }

      for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        if (SudokuEngine.isValidPlace(board, idx, val)) {
          board[idx] = val;
          if (fill(idx + 1)) return true;
          board[idx] = 0;
        }
      }
      return false;
    }

    fill(0);
    return board;
  };

  // Generate puzzle based on difficulty
  // difficulty: 'easy', 'medium', 'hard', 'expert'
  // seed: optional string/number seed
  SudokuEngine.generatePuzzle = function(difficulty, seed) {
    const rng = createRandom(seed);
    const solvedBoard = this.generateSolvedBoard(rng);
    const puzzle = [...solvedBoard];

    // Determine target remaining cells
    let cluesTarget = 40; // Default easy
    if (difficulty === 'medium') cluesTarget = 33;
    else if (difficulty === 'hard') cluesTarget = 27;
    else if (difficulty === 'expert') cluesTarget = 22;

    // Create a list of cell indices and shuffle
    const cellIndices = [];
    for (let i = 0; i < 81; i++) cellIndices.push(i);
    
    for (let i = cellIndices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = cellIndices[i];
      cellIndices[i] = cellIndices[j];
      cellIndices[j] = temp;
    }

    let cluesCount = 81;
    // Remove numbers while keeping unique solution
    for (let i = 0; i < 81; i++) {
      if (cluesCount <= cluesTarget) break;

      const idx = cellIndices[i];
      const val = puzzle[idx];
      puzzle[idx] = 0;

      // Check solutions
      if (this.countSolutions(puzzle, 2) === 1) {
        cluesCount--;
      } else {
        puzzle[idx] = val; // Put it back
      }
    }

    return {
      puzzle: puzzle,
      solution: solvedBoard
    };
  };

  // Get Candidates for a cell
  SudokuEngine.getCandidates = function(board, idx) {
    if (board[idx] !== 0) return [];
    const candidates = [];
    for (let val = 1; val <= 9; val++) {
      if (this.isValidPlace(board, idx, val)) {
        candidates.push(val);
      }
    }
    return candidates;
  };

  // AI Hint Analyzer
  // Scans the current board state and generates a logical hint explaining the next move.
  // Returns: { idx, val, type, explanation }
  SudokuEngine.getAIHint = function(currentBoard, solution) {
    // 1. Double check: is board already full or solved?
    const emptyCells = [];
    for (let i = 0; i < 81; i++) {
      if (currentBoard[i] === 0) emptyCells.push(i);
    }
    if (emptyCells.length === 0) {
      return { type: 'solved', explanation: 'The board is already complete!' };
    }

    // 2. Check for "Naked Single" - Only one candidate can fit in this cell
    for (let i = 0; i < emptyCells.length; i++) {
      const idx = emptyCells[i];
      const candidates = this.getCandidates(currentBoard, idx);
      if (candidates.length === 1) {
        const correctVal = candidates[0];
        const r = this.getRow(idx) + 1;
        const c = this.getCol(idx) + 1;
        const b = this.getBox(idx) + 1;

        // Collect peers that block other numbers
        const peers = this.getPeers(idx);
        const blockingNums = new Set();
        peers.forEach(peerIdx => {
          if (currentBoard[peerIdx] !== 0) {
            blockingNums.add(currentBoard[peerIdx]);
          }
        });
        const blockingStr = Array.from(blockingNums).sort().join(', ');

        return {
          idx: idx,
          val: correctVal,
          type: 'naked-single',
          explanation: `**Naked Single** detected at **Row ${r}, Column ${c} (Box ${b})**.<br><br>Only the number **${correctVal}** can fit here because all other numbers (${blockingStr}) are already used in its row, column, or 3x3 block.`
        };
      }
    }

    // 3. Check for "Hidden Single" in Row, Column, or Box
    // A Hidden Single is when a candidate is possible in multiple cells in a house,
    // but for one of the numbers, there is only ONE cell in that house that can accept it.
    
    // Check Boxes
    for (let b = 0; b < 9; b++) {
      const boxCells = this.getBoxCells(b);
      // For each number 1-9
      for (let val = 1; val <= 9; val++) {
        // Is this val already in the box?
        if (boxCells.some(cIdx => currentBoard[cIdx] === val)) continue;

        // Which cells in this box can legal contain this val?
        const possibleIndices = boxCells.filter(cIdx => currentBoard[cIdx] === 0 && this.isValidPlace(currentBoard, cIdx, val));
        if (possibleIndices.length === 1) {
          const targetIdx = possibleIndices[0];
          const r = this.getRow(targetIdx) + 1;
          const c = this.getCol(targetIdx) + 1;
          return {
            idx: targetIdx,
            val: val,
            type: 'hidden-single-box',
            explanation: `**Hidden Single** in **3x3 Box ${b + 1}**.<br><br>The number **${val}** must go in **Row ${r}, Column ${c}**. Within this 3x3 subgrid, this is the only cell that can legally host **${val}** without conflicting with other columns or rows.`
          };
        }
      }
    }

    // Check Rows
    for (let r = 0; r < 9; r++) {
      const rowCells = this.getRowCells(r);
      for (let val = 1; val <= 9; val++) {
        if (rowCells.some(cIdx => currentBoard[cIdx] === val)) continue;

        const possibleIndices = rowCells.filter(cIdx => currentBoard[cIdx] === 0 && this.isValidPlace(currentBoard, cIdx, val));
        if (possibleIndices.length === 1) {
          const targetIdx = possibleIndices[0];
          const c = this.getCol(targetIdx) + 1;
          const b = this.getBox(targetIdx) + 1;
          return {
            idx: targetIdx,
            val: val,
            type: 'hidden-single-row',
            explanation: `**Hidden Single** in **Row ${r + 1}**.<br><br>The number **${val}** can only fit in **Column ${c} (Box ${b})**. No other cell in Row ${r + 1} is valid for **${val}** because they are blocked by matching numbers in their respective columns or boxes.`
          };
        }
      }
    }

    // Check Columns
    for (let c = 0; c < 9; c++) {
      const colCells = this.getColCells(c);
      for (let val = 1; val <= 9; val++) {
        if (colCells.some(cIdx => currentBoard[cIdx] === val)) continue;

        const possibleIndices = colCells.filter(cIdx => currentBoard[cIdx] === 0 && this.isValidPlace(currentBoard, cIdx, val));
        if (possibleIndices.length === 1) {
          const targetIdx = possibleIndices[0];
          const r = this.getRow(targetIdx) + 1;
          const b = this.getBox(targetIdx) + 1;
          return {
            idx: targetIdx,
            val: val,
            type: 'hidden-single-col',
            explanation: `**Hidden Single** in **Column ${c + 1}**.<br><br>The number **${val}** can only fit in **Row ${r} (Box ${b})**. No other cell in Column ${c + 1} is valid for **${val}** because they are blocked by matching numbers in their respective rows or boxes.`
          };
        }
      }
    }

    // 4. Fallback: If no single is found, check if there's any wrong input
    // If user has input something incorrect on the board, we point that out.
    // Otherwise, we take the first empty cell and offer the solution value.
    const firstEmpty = emptyCells[0];
    const correctVal = solution[firstEmpty];
    const r = this.getRow(firstEmpty) + 1;
    const c = this.getCol(firstEmpty) + 1;
    const b = this.getBox(firstEmpty) + 1;

    return {
      idx: firstEmpty,
      val: correctVal,
      type: 'direct-fill',
      explanation: `**Logical Scan** suggests filling **Row ${r}, Column ${c} (Box ${b})**.<br><br>Scanning the grid constraints, the solution requires putting the number **${correctVal}** in this cell. Let's fill it in to open up more logical moves.`
    };
  };

  // Export
  global.SudokuEngine = SudokuEngine;

})(window);
