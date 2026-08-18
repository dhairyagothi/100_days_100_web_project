// ai.js
// Decision engine for Tic Tac Toe AI with Easy, Medium, and Hard (Minimax + Alpha-Beta) difficulty levels.
// Supporting 3x3, 4x4, and 5x5 board configurations.
// Includes Move Explanation system.

const AI = {
    // Check if there is a win on a generic board state
    checkWin(board, size) {
        // Rows
        for (let i = 0; i < size; i++) {
            const start = i * size;
            const player = board[start];
            if (player) {
                let win = true;
                for (let j = 1; j < size; j++) {
                    if (board[start + j] !== player) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    const line = [];
                    for (let j = 0; j < size; j++) line.push(start + j);
                    return { winner: player, line };
                }
            }
        }

        // Columns
        for (let j = 0; j < size; j++) {
            const player = board[j];
            if (player) {
                let win = true;
                for (let i = 1; i < size; i++) {
                    if (board[i * size + j] !== player) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    const line = [];
                    for (let i = 0; i < size; i++) line.push(i * size + j);
                    return { winner: player, line };
                }
            }
        }

        // Diagonal (top-left to bottom-right)
        let playerDiag1 = board[0];
        if (playerDiag1) {
            let win = true;
            for (let i = 1; i < size; i++) {
                if (board[i * size + i] !== playerDiag1) {
                    win = false;
                    break;
                }
            }
            if (win) {
                const line = [];
                for (let i = 0; i < size; i++) line.push(i * size + i);
                return { winner: playerDiag1, line };
            }
        }

        // Diagonal (top-right to bottom-left)
        let playerDiag2 = board[size - 1];
        if (playerDiag2) {
            let win = true;
            for (let i = 1; i < size; i++) {
                if (board[i * size + (size - 1 - i)] !== playerDiag2) {
                    win = false;
                    break;
                }
            }
            if (win) {
                const line = [];
                for (let i = 0; i < size; i++) line.push(i * size + (size - 1 - i));
                return { winner: playerDiag2, line };
            }
        }

        return null;
    },

    checkDraw(board) {
        return board.every(cell => cell !== null);
    },

    // Gets all empty indices
    getEmptyIndices(board) {
        const indices = [];
        board.forEach((cell, idx) => {
            if (cell === null) indices.push(idx);
        });
        return indices;
    },

    // Main entry point for AI moves
    // Returns { index, explanation }
    getMove(board, size, difficulty, aiSymbol, opponentSymbol) {
        const emptyIndices = this.getEmptyIndices(board);
        if (emptyIndices.length === 0) return { index: -1, explanation: "No moves available." };

        let index = -1;
        let explanation = "";

        switch (difficulty) {
            case 'easy':
                index = this.getEasyMove(emptyIndices);
                explanation = "AI selected a random cell just to keep the game moving.";
                break;
            case 'medium':
                const mediumResult = this.getMediumMove(board, size, aiSymbol, opponentSymbol);
                index = mediumResult.index;
                explanation = mediumResult.explanation;
                break;
            case 'hard':
                const hardResult = this.getHardMove(board, size, aiSymbol, opponentSymbol);
                index = hardResult.index;
                explanation = hardResult.explanation;
                break;
            default:
                index = this.getEasyMove(emptyIndices);
                explanation = "Standard default action taken.";
        }

        return { index, explanation };
    },

    getEasyMove(emptyIndices) {
        const randomIndex = Math.floor(Math.random() * emptyIndices.length);
        return emptyIndices[randomIndex];
    },

    getMediumMove(board, size, aiSymbol, opponentSymbol) {
        const emptyIndices = this.getEmptyIndices(board);

        // 1. Can AI win in one move?
        for (let idx of emptyIndices) {
            const nextBoard = [...board];
            nextBoard[idx] = aiSymbol;
            if (this.checkWin(nextBoard, size)) {
                return { index: idx, explanation: "AI spotted a winning opportunity and took it!" };
            }
        }

        // 2. Can player win in one move? Block it.
        for (let idx of emptyIndices) {
            const nextBoard = [...board];
            nextBoard[idx] = opponentSymbol;
            if (this.checkWin(nextBoard, size)) {
                return { index: idx, explanation: "AI blocked you from winning on the next turn!" };
            }
        }

        // 3. Take the center if available
        const center = Math.floor((size * size) / 2);
        if (emptyIndices.includes(center)) {
            return { index: center, explanation: "AI selected the center space to gain positional leverage." };
        }

        // 4. Take corners if available
        const corners = this.getCorners(size);
        const availableCorners = corners.filter(c => emptyIndices.includes(c));
        if (availableCorners.length > 0) {
            const idx = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            return { index: idx, explanation: "AI played a corner position to expand its open angles." };
        }

        // 5. Play random
        const idx = this.getEasyMove(emptyIndices);
        return { index: idx, explanation: "AI played a normal tactical positional move." };
    },

    getCorners() {
        return [0, 2, 6, 8]; // 3x3 corners
    },

    getHardMove(board, size, aiSymbol, opponentSymbol) {
        const emptyIndices = this.getEmptyIndices(board);

        // If it's the very first move, take a corner or center immediately for optimal starting positions
        if (emptyIndices.length === size * size) {
            const center = Math.floor((size * size) / 2);
            return { index: center, explanation: "AI claims the exact center quadrant to secure maximum control." };
        }

        // 3x3: Depth 9 (Full search space)
        let maxDepth = 9;

        let bestScore = -Infinity;
        let bestIndex = emptyIndices[0];
        let explanation = "";

        // Check if there is an immediate win or block first for faster explanations
        for (let idx of emptyIndices) {
            const tempBoard = [...board];
            tempBoard[idx] = aiSymbol;
            if (this.checkWin(tempBoard, size)) {
                return { index: idx, explanation: "AI calculated a guaranteed checkmate sequence!" };
            }
        }
        for (let idx of emptyIndices) {
            const tempBoard = [...board];
            tempBoard[idx] = opponentSymbol;
            if (this.checkWin(tempBoard, size)) {
                return { index: idx, explanation: "AI defended an immediate threat from your side." };
            }
        }

        // Run Minimax with Alpha-Beta
        for (let idx of emptyIndices) {
            const nextBoard = [...board];
            nextBoard[idx] = aiSymbol;

            const score = this.minimax(nextBoard, size, 0, false, -Infinity, Infinity, maxDepth, aiSymbol, opponentSymbol);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = idx;
            }
        }

        // Compile explanation based on scores
        if (bestScore > 50) {
            explanation = "AI has analyzed all possible game paths and predicted its victory!";
        } else if (bestScore < -50) {
            explanation = "AI is playing defensively to minimize points and prevent your victory.";
        } else {
            // General descriptions
            const corners = this.getCorners(size);
            if (bestIndex === Math.floor((size * size) / 2)) {
                explanation = "AI takes the center square to maintain maximum branching possibilities.";
            } else if (corners.includes(bestIndex)) {
                explanation = "AI secures a corner square to restrict your directional setup.";
            } else {
                explanation = "AI played an optimized positional move according to minimax calculations.";
            }
        }

        return { index: bestIndex, explanation };
    },

    // Minimax search with Alpha-Beta Pruning
    minimax(board, size, depth, isMaximizing, alpha, beta, maxDepth, aiSymbol, opponentSymbol) {
        // Check game end states
        const winState = this.checkWin(board, size);
        if (winState) {
            return winState.winner === aiSymbol ? 100 - depth : depth - 100;
        }
        if (this.checkDraw(board)) {
            return 0;
        }
        // Depth limit reached - return heuristic score
        if (depth >= maxDepth) {
            return this.evaluateBoard(board, size, aiSymbol, opponentSymbol);
        }

        const emptyIndices = this.getEmptyIndices(board);

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let idx of emptyIndices) {
                board[idx] = aiSymbol;
                const score = this.minimax(board, size, depth + 1, false, alpha, beta, maxDepth, aiSymbol, opponentSymbol);
                board[idx] = null;
                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break; // Beta cut-off
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let idx of emptyIndices) {
                board[idx] = opponentSymbol;
                const score = this.minimax(board, size, depth + 1, true, alpha, beta, maxDepth, aiSymbol, opponentSymbol);
                board[idx] = null;
                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break; // Alpha cut-off
            }
            return minEval;
        }
    },

    // Heuristic Evaluation function for incomplete games
    evaluateBoard(board, size, aiSymbol, opponentSymbol) {
        let score = 0;

        // Evaluate all lines (rows, columns, diagonals)
        const lines = this.getAllLines(size);
        for (let line of lines) {
            let aiCount = 0;
            let opponentCount = 0;

            for (let idx of line) {
                if (board[idx] === aiSymbol) aiCount++;
                else if (board[idx] === opponentSymbol) opponentCount++;
            }

            // Reward lines that contain only AI symbols and no opponent symbols
            if (aiCount > 0 && opponentCount === 0) {
                score += Math.pow(10, aiCount - 1);
            }
            // Penalize lines that contain only opponent symbols and no AI symbols
            else if (opponentCount > 0 && aiCount === 0) {
                score -= Math.pow(10, opponentCount - 1);
            }
        }

        // Positional score: center cell is worth more, corners are worth slightly more than edges
        const center = Math.floor((size * size) / 2);
        if (board[center] === aiSymbol) score += 5;
        else if (board[center] === opponentSymbol) score -= 5;

        const corners = this.getCorners(size);
        for (let corner of corners) {
            if (board[corner] === aiSymbol) score += 2;
            else if (board[corner] === opponentSymbol) score -= 2;
        }

        return score;
    },

    // Generate list of all possible index arrays to check (for heuristic)
    getAllLines(size) {
        const lines = [];

        // Rows
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            lines.push(row);
        }

        // Columns
        for (let j = 0; j < size; j++) {
            const col = [];
            for (let i = 0; i < size; i++) {
                col.push(i * size + j);
            }
            lines.push(col);
        }

        // Diagonal 1
        const diag1 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
        }
        lines.push(diag1);

        // Diagonal 2
        const diag2 = [];
        for (let i = 0; i < size; i++) {
            diag2.push(i * size + (size - 1 - i));
        }
        lines.push(diag2);

        return lines;
    }
};

window.AI = AI;
