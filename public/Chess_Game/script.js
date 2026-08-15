const boardElement   = document.getElementById("board");
const statusElement  = document.getElementById("status");
const turnLabel      = document.getElementById("turnLabel");
const moveList       = document.getElementById("moveList");
const moveCount      = document.getElementById("moveCount");
const whiteCaptures  = document.getElementById("whiteCaptures");
const blackCaptures  = document.getElementById("blackCaptures");

const WHITE = "white";
const BLACK = "black";
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const SYMBOLS = {
    white: { king: "&#9812;", queen: "&#9813;", rook: "&#9814;", bishop: "&#9815;", knight: "&#9816;", pawn: "&#9817;" },
    black: { king: "&#9818;", queen: "&#9819;", rook: "&#9820;", bishop: "&#9821;", knight: "&#9822;", pawn: "&#9823;" }
};
const PIECE_LETTER = { king: "K", queen: "Q", rook: "R", bishop: "B", knight: "N", pawn: "" };

// ─── Piece Values ─────────────────────────────────────────────────────────────
const PIECE_VALUE = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000 };

// Positional bonus tables (from white's perspective, row 0 = black back rank)
const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];
const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];
const BISHOP_TABLE = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];
const ROOK_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];
const QUEEN_TABLE = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];
const KING_MID_TABLE = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
];

const PIECE_TABLES = {
    pawn: PAWN_TABLE, knight: KNIGHT_TABLE, bishop: BISHOP_TABLE,
    rook: ROOK_TABLE, queen: QUEEN_TABLE, king: KING_MID_TABLE
};

// ─── Game State ───────────────────────────────────────────────────────────────
let board = [];
let turn = WHITE;
let selected = null;
let legalTargets = [];
let history = [];
let capturedByWhite = [];
let capturedByBlack = [];
let flipped = false;
let gameOver = false;
let enPassantTarget = null;

// ─── Mode / AI State ──────────────────────────────────────────────────────────
let gameMode = "2player";
let playerColor = WHITE;
let aiDifficulty = "medium";
let aiThinking = false;

// ─── Clock State ──────────────────────────────────────────────────────────────
let clockEnabled = false;
let timeWhite = 0;
let timeBlack = 0;
let clockInterval = null;

// ─── Pending Promotion ────────────────────────────────────────────────────────
let pendingPromotion = null; // { move, color }

// ─── Setup Screen ─────────────────────────────────────────────────────────────
const setupScreen = document.getElementById("setupScreen");
const gameScreen  = document.getElementById("gameScreen");
const btnStart    = document.getElementById("btnStart");

btnStart.addEventListener("click", () => {
    gameMode     = document.querySelector('input[name="mode"]:checked').value;
    playerColor  = document.querySelector('input[name="side"]:checked')?.value ?? WHITE;
    aiDifficulty = document.getElementById("difficulty").value;
    const preset = document.getElementById("clockPreset").value;

    if (preset === "0") {
        clockEnabled = false;
    } else {
        clockEnabled = true;
        timeWhite = parseInt(preset, 10) * 60;
        timeBlack = parseInt(preset, 10) * 60;
    }

    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    newGame();
});

// Show/hide AI options based on mode toggle
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", () => {
        const isAI = radio.value === "vsAI" && radio.checked;
        document.getElementById("aiOptions").classList.toggle("hidden", !isAI);
    });
});

// ─── Clock UI ─────────────────────────────────────────────────────────────────
function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function updateClockDisplay() {
    const wEl = document.getElementById("clockWhite");
    const bEl = document.getElementById("clockBlack");
    if (!wEl || !bEl) return;

    if (clockEnabled) {
        wEl.textContent = formatTime(timeWhite);
        bEl.textContent = formatTime(timeBlack);
        // Pulse red when ≤ 10 s
        wEl.classList.toggle("low-time", timeWhite <= 10);
        bEl.classList.toggle("low-time", timeBlack <= 10);
    } else {
        wEl.textContent = "--:--";
        bEl.textContent = "--:--";
    }
}

function startClock() {
    if (!clockEnabled) return;
    stopClock();
    clockInterval = setInterval(() => {
        if (gameOver) { stopClock(); return; }
        if (turn === WHITE) {
            timeWhite = Math.max(0, timeWhite - 1);
            if (timeWhite === 0) { stopClock(); flagTimeout(WHITE); return; }
        } else {
            timeBlack = Math.max(0, timeBlack - 1);
            if (timeBlack === 0) { stopClock(); flagTimeout(BLACK); return; }
        }
        updateClockDisplay();
    }, 1000);
}

function stopClock() {
    if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }
}

function flagTimeout(color) {
    gameOver = true;
    setStatus(`⏰ Time's up! ${capitalize(other(color))} wins on time.`);
    render();
}

// ─── Piece factory ────────────────────────────────────────────────────────────
function createPiece(type, color) {
    return { type, color, moved: false };
}

function startPosition() {
    const empty = Array.from({ length: 8 }, () => Array(8).fill(null));
    const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    for (let col = 0; col < 8; col++) {
        empty[0][col] = createPiece(backRank[col], BLACK);
        empty[1][col] = createPiece("pawn", BLACK);
        empty[6][col] = createPiece("pawn", WHITE);
        empty[7][col] = createPiece(backRank[col], WHITE);
    }
    return empty;
}

function cloneBoard(source) {
    return source.map(row => row.map(piece => piece ? { ...piece } : null));
}

function inside(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 8; }
function other(color) { return color === WHITE ? BLACK : WHITE; }
function squareName(row, col) { return `${FILES[col]}${8 - row}`; }

function orderedSquares() {
    const squares = [];
    const rows = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
    const cols = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
    rows.forEach(row => cols.forEach(col => squares.push({ row, col })));
    return squares;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
    boardElement.innerHTML = "";
    const legalKeys   = new Set(legalTargets.map(m => `${m.to.row},${m.to.col}`));
    const captureKeys = new Set(legalTargets.filter(m => m.capture || m.enPassant).map(m => `${m.to.row},${m.to.col}`));
    const checkedKing = findKing(board, turn);
    const turnInCheck = checkedKing && isSquareAttacked(board, checkedKing.row, checkedKing.col, other(turn));

    // Sync board-frame flip class for coordinate labels
    const frame = document.getElementById("boardFrame");
    if (frame) frame.classList.toggle("flipped", flipped);

    orderedSquares().forEach(({ row, col }) => {
        const square = document.createElement("button");
        const piece  = board[row][col];
        square.type = "button";
        square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute("role", "gridcell");
        square.setAttribute("aria-label", squareName(row, col));

        if (selected && selected.row === row && selected.col === col) square.classList.add("selected");
        if (legalKeys.has(`${row},${col}`))   square.classList.add("legal");
        if (captureKeys.has(`${row},${col}`)) square.classList.add("capture");
        if (turnInCheck && checkedKing.row === row && checkedKing.col === col) square.classList.add("check");

        if (piece) {
            const pieceNode = document.createElement("span");
            pieceNode.className = `piece ${piece.color}`;
            pieceNode.innerHTML = SYMBOLS[piece.color][piece.type];
            square.appendChild(pieceNode);
        }

        square.addEventListener("click", () => handleSquareClick(row, col));
        boardElement.appendChild(square);
    });

    updateClockDisplay();
    boardElement.style.opacity = aiThinking ? "0.6" : "1";
    boardElement.style.pointerEvents = aiThinking ? "none" : "";
    updatePanels();
}

function updatePanels() {
    turnLabel.textContent = turn === WHITE ? "White" : "Black";
    whiteCaptures.innerHTML = capturedByWhite.length
        ? capturedByWhite.map(p => SYMBOLS[p.color][p.type]).join(" ")
        : "None";
    blackCaptures.innerHTML = capturedByBlack.length
        ? capturedByBlack.map(p => SYMBOLS[p.color][p.type]).join(" ")
        : "None";
    moveCount.textContent = history.length;
    moveList.innerHTML = history.map((entry, i) => `<li>${i + 1}. ${entry.notation}</li>`).join("");

    const modeLabel = document.getElementById("modeLabel");
    if (modeLabel) {
        if (gameMode === "vsAI") {
            modeLabel.textContent = `vs AI (${capitalize(aiDifficulty)}) — you play ${capitalize(playerColor)}`;
        } else {
            modeLabel.textContent = "2 Player";
        }
    }
}

// ─── Input Handling ───────────────────────────────────────────────────────────
function handleSquareClick(row, col) {
    if (gameOver) return;
    if (aiThinking) return;
    if (pendingPromotion) return;
    if (gameMode === "vsAI" && turn !== playerColor) return;

    const piece = board[row][col];

    if (selected) {
        const chosenMove = legalTargets.find(m => m.to.row === row && m.to.col === col);
        if (chosenMove) {
            // Check if this is a pawn promotion
            const movingPiece = board[chosenMove.from.row][chosenMove.from.col];
            if (movingPiece && movingPiece.type === "pawn" && (chosenMove.to.row === 0 || chosenMove.to.row === 7)) {
                openPromotionModal(chosenMove, movingPiece.color);
            } else {
                makeMove(chosenMove);
            }
            return;
        }
    }

    if (piece && piece.color === turn) {
        selected = { row, col };
        legalTargets = getLegalMoves(board, row, col, turn, enPassantTarget);
        setStatus(`${capitalize(turn)} selected ${piece.type} on ${squareName(row, col)}.`);
    } else {
        selected = null;
        legalTargets = [];
        setStatus(`${capitalize(turn)} to move.`);
    }

    render();
}

// ─── Promotion Modal ──────────────────────────────────────────────────────────
const promotionModal   = document.getElementById("promotionModal");
const promotionOptions = document.getElementById("promotionOptions");

const PROMO_PIECES = ["queen", "rook", "bishop", "knight"];

function openPromotionModal(move, color) {
    pendingPromotion = { move, color };
    promotionOptions.innerHTML = "";
    PROMO_PIECES.forEach(type => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = SYMBOLS[color][type];
        btn.title = capitalize(type);
        btn.addEventListener("click", () => {
            closePromotionModal();
            makeMove(pendingPromotion.move, type);
            pendingPromotion = null;
        });
        promotionOptions.appendChild(btn);
    });
    promotionModal.classList.remove("hidden");
}

function closePromotionModal() {
    promotionModal.classList.add("hidden");
}

// ─── Move Execution ───────────────────────────────────────────────────────────
function makeMove(move, promoteTo = "queen") {
    const previous = {
        board: cloneBoard(board),
        turn,
        capturedByWhite: capturedByWhite.map(p => ({ ...p })),
        capturedByBlack: capturedByBlack.map(p => ({ ...p })),
        enPassantTarget: enPassantTarget ? { ...enPassantTarget } : null,
        notation: buildNotation(move),
        timeWhite,
        timeBlack
    };

    const movingPiece = board[move.from.row][move.from.col];
    const captured = move.enPassant
        ? board[move.from.row][move.to.col]
        : board[move.to.row][move.to.col];

    applyMove(board, move);

    if (captured) {
        (movingPiece.color === WHITE ? capturedByWhite : capturedByBlack).push(captured);
    }

    enPassantTarget = null;
    if (movingPiece.type === "pawn" && Math.abs(move.to.row - move.from.row) === 2) {
        enPassantTarget = {
            row: (move.from.row + move.to.row) / 2,
            col: move.from.col,
            pawnRow: move.to.row,
            pawnCol: move.to.col
        };
    }

    // Promotion
    if (movingPiece.type === "pawn" && (move.to.row === 0 || move.to.row === 7)) {
        board[move.to.row][move.to.col].type = promoteTo;
        previous.notation += `=${promoteTo.charAt(0).toUpperCase()}`;
    }

    turn = other(turn);
    selected = null;
    legalTargets = [];
    previous.notation += stateSuffix();
    history.push(previous);

    startClock();
    updateGameState();
    render();

    if (!gameOver && gameMode === "vsAI" && turn !== playerColor) {
        scheduleAIMove();
    }
}

// ─── AI ───────────────────────────────────────────────────────────────────────
function scheduleAIMove() {
    aiThinking = true;
    render();
    setTimeout(() => {
        const aiMove = getAIMove(board, turn, enPassantTarget, aiDifficulty);
        aiThinking = false;
        if (aiMove) makeMove(aiMove);
        else render();
    }, aiDifficulty === "hard" ? 80 : 30);
}

function getAIMove(position, color, epTarget, difficulty) {
    const allMoves = getAllLegalMoves(position, color, epTarget);
    if (!allMoves.length) return null;

    if (difficulty === "easy") {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    const depth = difficulty === "hard" ? 4 : 2;
    let bestMove = null;
    let bestScore = -Infinity;
    const isMaximising = color === WHITE;

    shuffleArray(allMoves);

    for (const m of allMoves) {
        const copy = cloneBoard(position);
        const ep = computeEP(position, m);
        applyMove(copy, m);
        // AI always promotes to queen
        const movingPiece = position[m.from.row][m.from.col];
        if (movingPiece && movingPiece.type === "pawn" && (m.to.row === 0 || m.to.row === 7)) {
            copy[m.to.row][m.to.col].type = "queen";
        }
        const score = minimax(copy, depth - 1, -Infinity, Infinity, !isMaximising, ep);
        const adjusted = isMaximising ? score : -score;
        if (adjusted > bestScore) { bestScore = adjusted; bestMove = m; }
    }

    return bestMove;
}

function computeEP(position, m) {
    const piece = position[m.from.row][m.from.col];
    if (piece && piece.type === "pawn" && Math.abs(m.to.row - m.from.row) === 2) {
        return { row: (m.from.row + m.to.row) / 2, col: m.from.col, pawnRow: m.to.row, pawnCol: m.to.col };
    }
    return null;
}

function minimax(position, depth, alpha, beta, maximising, epTarget) {
    if (depth === 0) return evaluateBoard(position);

    const color = maximising ? WHITE : BLACK;
    const moves = getAllLegalMoves(position, color, epTarget);

    if (!moves.length) {
        const king = findKing(position, color);
        if (king && isSquareAttacked(position, king.row, king.col, other(color))) {
            return maximising ? -50000 + depth : 50000 - depth;
        }
        return 0; // stalemate
    }

    if (maximising) {
        let best = -Infinity;
        for (const m of moves) {
            const copy = cloneBoard(position);
            const ep = computeEP(position, m);
            applyMove(copy, m);
            const score = minimax(copy, depth - 1, alpha, beta, false, ep);
            best = Math.max(best, score);
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of moves) {
            const copy = cloneBoard(position);
            const ep = computeEP(position, m);
            applyMove(copy, m);
            const score = minimax(copy, depth - 1, alpha, beta, true, ep);
            best = Math.min(best, score);
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }
        return best;
    }
}

function evaluateBoard(position) {
    let score = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = position[row][col];
            if (!piece) continue;
            const val = PIECE_VALUE[piece.type];
            const tableRow = piece.color === WHITE ? row : 7 - row;
            const bonus = PIECE_TABLES[piece.type]?.[tableRow]?.[col] ?? 0;
            if (piece.color === WHITE) score += val + bonus;
            else score -= val + bonus;
        }
    }
    return score;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// ─── Notation ─────────────────────────────────────────────────────────────────
function buildNotation(move) {
    const piece = board[move.from.row][move.from.col];
    if (move.castle) return move.to.col === 6 ? "O-O" : "O-O-O";
    const capture = move.capture || move.enPassant ? "x" : "";
    const prefix  = piece.type === "pawn" && capture ? FILES[move.from.col] : PIECE_LETTER[piece.type];
    return `${prefix}${capture}${squareName(move.to.row, move.to.col)}`;
}

function stateSuffix() {
    const king = findKing(board, turn);
    if (!king || !isSquareAttacked(board, king.row, king.col, other(turn))) return "";
    return getAllLegalMoves(board, turn, enPassantTarget).length ? "+" : "#";
}

// ─── Game State ───────────────────────────────────────────────────────────────
function updateGameState() {
    const king    = findKing(board, turn);
    const inCheck = king && isSquareAttacked(board, king.row, king.col, other(turn));
    const moves   = getAllLegalMoves(board, turn, enPassantTarget);

    if (!moves.length && inCheck) {
        gameOver = true;
        stopClock();
        setStatus(`Checkmate! ${capitalize(other(turn))} wins.`);
        return;
    }
    if (!moves.length) {
        gameOver = true;
        stopClock();
        setStatus("Stalemate — draw.");
        return;
    }
    setStatus(inCheck ? `${capitalize(turn)} is in check!` : `${capitalize(turn)} to move.`);
}

// ─── Move Generation ──────────────────────────────────────────────────────────
function getLegalMoves(position, row, col, color, epTarget) {
    return getPseudoMoves(position, row, col, epTarget).filter(m => {
        const copy = cloneBoard(position);
        applyMove(copy, m);
        const king = findKing(copy, color);
        return king && !isSquareAttacked(copy, king.row, king.col, other(color));
    });
}

function getAllLegalMoves(position, color, epTarget) {
    const moves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = position[row][col];
            if (piece && piece.color === color) {
                moves.push(...getLegalMoves(position, row, col, color, epTarget));
            }
        }
    }
    return moves;
}

function getPseudoMoves(position, row, col, epTarget) {
    const piece = position[row][col];
    if (!piece) return [];
    if (piece.type === "pawn")   return pawnMoves(position, row, col, piece, epTarget);
    if (piece.type === "knight") return stepMoves(position, row, col, piece, [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]);
    if (piece.type === "king")   return kingMoves(position, row, col, piece);
    if (piece.type === "bishop") return slideMoves(position, row, col, piece, [[-1,-1],[-1,1],[1,-1],[1,1]]);
    if (piece.type === "rook")   return slideMoves(position, row, col, piece, [[-1,0],[1,0],[0,-1],[0,1]]);
    if (piece.type === "queen")  return slideMoves(position, row, col, piece, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
    return [];
}

function pawnMoves(position, row, col, piece, epTarget) {
    const moves = [];
    const dir   = piece.color === WHITE ? -1 : 1;
    const start = piece.color === WHITE ? 6 : 1;
    const one   = row + dir;
    const two   = row + dir * 2;

    if (inside(one, col) && !position[one][col]) {
        moves.push(move(row, col, one, col));
        if (row === start && !position[two][col]) moves.push(move(row, col, two, col));
    }
    [-1, 1].forEach(offset => {
        const targetCol = col + offset;
        if (!inside(one, targetCol)) return;
        const target = position[one][targetCol];
        if (target && target.color !== piece.color) moves.push(move(row, col, one, targetCol, { capture: true }));
        if (epTarget && epTarget.row === one && epTarget.col === targetCol) {
            moves.push(move(row, col, one, targetCol, { enPassant: true, capture: true }));
        }
    });
    return moves;
}

function stepMoves(position, row, col, piece, offsets) {
    return offsets.reduce((moves, [dr, dc]) => {
        const tr = row + dr, tc = col + dc;
        if (!inside(tr, tc)) return moves;
        const target = position[tr][tc];
        if (!target || target.color !== piece.color) {
            moves.push(move(row, col, tr, tc, { capture: Boolean(target) }));
        }
        return moves;
    }, []);
}

function slideMoves(position, row, col, piece, directions) {
    const moves = [];
    directions.forEach(([dr, dc]) => {
        let tr = row + dr, tc = col + dc;
        while (inside(tr, tc)) {
            const target = position[tr][tc];
            if (!target) {
                moves.push(move(row, col, tr, tc));
            } else {
                if (target.color !== piece.color) moves.push(move(row, col, tr, tc, { capture: true }));
                break;
            }
            tr += dr; tc += dc;
        }
    });
    return moves;
}

function kingMoves(position, row, col, piece) {
    const moves = stepMoves(position, row, col, piece, [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
    if (piece.moved || isSquareAttacked(position, row, col, other(piece.color))) return moves;
    const rank = piece.color === WHITE ? 7 : 0;
    addCastle(position, moves, rank, 4, 7, 6, 5, piece.color);
    addCastle(position, moves, rank, 4, 0, 2, 3, piece.color);
    return moves;
}

function addCastle(position, moves, rank, kingCol, rookCol, targetCol, passCol, color) {
    const rook = position[rank][rookCol];
    const between = rookCol === 7 ? [5, 6] : [1, 2, 3];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.moved) return;
    if (between.some(col => position[rank][col])) return;
    if (isSquareAttacked(position, rank, passCol, other(color)) ||
        isSquareAttacked(position, rank, targetCol, other(color))) return;
    moves.push(move(rank, kingCol, rank, targetCol, { castle: rookCol === 7 ? "king" : "queen" }));
}

function move(fromRow, fromCol, toRow, toCol, extras = {}) {
    return { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol }, ...extras };
}

function applyMove(position, chosenMove) {
    const piece = position[chosenMove.from.row][chosenMove.from.col];
    position[chosenMove.from.row][chosenMove.from.col] = null;

    if (chosenMove.enPassant) {
        position[chosenMove.from.row][chosenMove.to.col] = null;
    }
    if (chosenMove.castle) {
        const rank = chosenMove.from.row;
        if (chosenMove.castle === "king") {
            position[rank][5] = position[rank][7];
            position[rank][7] = null;
            position[rank][5].moved = true;
        } else {
            position[rank][3] = position[rank][0];
            position[rank][0] = null;
            position[rank][3].moved = true;
        }
    }
    position[chosenMove.to.row][chosenMove.to.col] = { ...piece, moved: true };
}

// ─── Board Utils ──────────────────────────────────────────────────────────────
function findKing(position, color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const p = position[row][col];
            if (p && p.type === "king" && p.color === color) return { row, col };
        }
    }
    return null;
}

function isSquareAttacked(position, row, col, byColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = position[r][c];
            if (!p || p.color !== byColor) continue;
            if (attacksSquare(position, r, c, row, col)) return true;
        }
    }
    return false;
}

function attacksSquare(position, fromRow, fromCol, targetRow, targetCol) {
    const piece = position[fromRow][fromCol];
    const dr = targetRow - fromRow;
    const dc = targetCol - fromCol;

    if (piece.type === "pawn") {
        const dir = piece.color === WHITE ? -1 : 1;
        return dr === dir && Math.abs(dc) === 1;
    }
    if (piece.type === "knight") return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    if (piece.type === "king")   return Math.max(Math.abs(dr), Math.abs(dc)) === 1;

    const diagonal = Math.abs(dr) === Math.abs(dc);
    const straight = dr === 0 || dc === 0;
    if (piece.type === "bishop" && !diagonal) return false;
    if (piece.type === "rook"   && !straight) return false;
    if (piece.type === "queen"  && !diagonal && !straight) return false;

    const stepRow = Math.sign(dr);
    const stepCol = Math.sign(dc);
    let row = fromRow + stepRow;
    let col = fromCol + stepCol;
    while (row !== targetRow || col !== targetCol) {
        if (position[row][col]) return false;
        row += stepRow; col += stepCol;
    }
    return true;
}

// ─── Undo ─────────────────────────────────────────────────────────────────────
function undoMove() {
    if (gameMode === "vsAI") {
        if (history.length < 2 && turn !== playerColor) {
            undoOnce();
        } else {
            undoOnce();
            undoOnce();
        }
        return;
    }
    undoOnce();
}

function undoOnce() {
    const previous = history.pop();
    if (!previous) { setStatus("No moves to undo."); return; }
    board           = cloneBoard(previous.board);
    turn            = previous.turn;
    capturedByWhite = previous.capturedByWhite.map(p => ({ ...p }));
    capturedByBlack = previous.capturedByBlack.map(p => ({ ...p }));
    enPassantTarget = previous.enPassantTarget ? { ...previous.enPassantTarget } : null;
    if (clockEnabled) { timeWhite = previous.timeWhite; timeBlack = previous.timeBlack; }
    selected     = null;
    legalTargets = [];
    gameOver     = false;
    setStatus(`${capitalize(turn)} to move.`);
    render();
}

// ─── Status / Helpers ─────────────────────────────────────────────────────────
function setStatus(text) { statusElement.textContent = text; }
function capitalize(text) { return text.charAt(0).toUpperCase() + text.slice(1); }

// ─── New Game ─────────────────────────────────────────────────────────────────
function newGame() {
    board           = startPosition();
    turn            = WHITE;
    selected        = null;
    legalTargets    = [];
    history         = [];
    capturedByWhite = [];
    capturedByBlack = [];
    enPassantTarget = null;
    gameOver        = false;
    aiThinking      = false;
    pendingPromotion = null;
    closePromotionModal();

    stopClock();
    if (clockEnabled) {
        const preset = document.getElementById("clockPreset").value;
        timeWhite = parseInt(preset, 10) * 60;
        timeBlack = parseInt(preset, 10) * 60;
        startClock();
    }

    flipped = (gameMode === "vsAI" && playerColor === BLACK);
    setStatus("White to move.");
    render();

    if (gameMode === "vsAI" && playerColor === BLACK) {
        scheduleAIMove();
    }
}

// ─── Button Wiring ────────────────────────────────────────────────────────────
document.getElementById("newGame").addEventListener("click", newGame);
document.getElementById("undoMove").addEventListener("click", undoMove);
document.getElementById("flipBoard").addEventListener("click", () => { flipped = !flipped; render(); });
document.getElementById("backHome").addEventListener("click", () => { window.location.href = "/"; });
document.getElementById("backToSetup").addEventListener("click", () => {
    stopClock();
    gameScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
});