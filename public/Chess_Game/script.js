const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const turnLabel = document.getElementById("turnLabel");
const moveList = document.getElementById("moveList");
const moveCount = document.getElementById("moveCount");
const whiteCaptures = document.getElementById("whiteCaptures");
const blackCaptures = document.getElementById("blackCaptures");

const WHITE = "white";
const BLACK = "black";
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const SYMBOLS = {
    white: { king: "&#9812;", queen: "&#9813;", rook: "&#9814;", bishop: "&#9815;", knight: "&#9816;", pawn: "&#9817;" },
    black: { king: "&#9818;", queen: "&#9819;", rook: "&#9820;", bishop: "&#9821;", knight: "&#9822;", pawn: "&#9823;" }
};
const PIECE_LETTER = { king: "K", queen: "Q", rook: "R", bishop: "B", knight: "N", pawn: "" };

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

function inside(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function other(color) {
    return color === WHITE ? BLACK : WHITE;
}

function squareName(row, col) {
    return `${FILES[col]}${8 - row}`;
}

function orderedSquares() {
    const squares = [];
    const rows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const cols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    rows.forEach(row => cols.forEach(col => squares.push({ row, col })));
    return squares;
}

function render() {
    boardElement.innerHTML = "";
    const legalKeys = new Set(legalTargets.map(move => `${move.to.row},${move.to.col}`));
    const captureKeys = new Set(legalTargets.filter(move => move.capture || move.enPassant).map(move => `${move.to.row},${move.to.col}`));
    const checkedKing = findKing(board, turn);
    const turnInCheck = checkedKing && isSquareAttacked(board, checkedKing.row, checkedKing.col, other(turn));

    orderedSquares().forEach(({ row, col }) => {
        const square = document.createElement("button");
        const piece = board[row][col];
        square.type = "button";
        square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute("role", "gridcell");
        square.setAttribute("aria-label", squareName(row, col));

        if (selected && selected.row === row && selected.col === col) square.classList.add("selected");
        if (legalKeys.has(`${row},${col}`)) square.classList.add("legal");
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

    updatePanels();
}

function updatePanels() {
    turnLabel.textContent = turn === WHITE ? "White" : "Black";
    whiteCaptures.innerHTML = capturedByWhite.length ? capturedByWhite.map(piece => SYMBOLS[piece.color][piece.type]).join(" ") : "None";
    blackCaptures.innerHTML = capturedByBlack.length ? capturedByBlack.map(piece => SYMBOLS[piece.color][piece.type]).join(" ") : "None";
    moveCount.textContent = history.length;
    moveList.innerHTML = history.map((entry, index) => `<li>${index + 1}. ${entry.notation}</li>`).join("");
}

function handleSquareClick(row, col) {
    if (gameOver) return;
    const piece = board[row][col];

    if (selected) {
        const chosenMove = legalTargets.find(move => move.to.row === row && move.to.col === col);
        if (chosenMove) {
            makeMove(chosenMove);
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

function makeMove(move) {
    const previous = {
        board: cloneBoard(board),
        turn,
        capturedByWhite: capturedByWhite.map(piece => ({ ...piece })),
        capturedByBlack: capturedByBlack.map(piece => ({ ...piece })),
        enPassantTarget: enPassantTarget ? { ...enPassantTarget } : null,
        notation: buildNotation(move)
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

    if (movingPiece.type === "pawn" && (move.to.row === 0 || move.to.row === 7)) {
        board[move.to.row][move.to.col].type = "queen";
        previous.notation += "=Q";
    }

    turn = other(turn);
    selected = null;
    legalTargets = [];
    previous.notation += stateSuffix();
    history.push(previous);
    updateGameState();
    render();
}

function buildNotation(move) {
    const piece = board[move.from.row][move.from.col];
    if (move.castle) return move.to.col === 6 ? "O-O" : "O-O-O";

    const capture = move.capture || move.enPassant ? "x" : "";
    const prefix = piece.type === "pawn" && capture ? FILES[move.from.col] : PIECE_LETTER[piece.type];
    return `${prefix}${capture}${squareName(move.to.row, move.to.col)}`;
}

function stateSuffix() {
    const king = findKing(board, turn);
    if (!king || !isSquareAttacked(board, king.row, king.col, other(turn))) return "";
    return getAllLegalMoves(board, turn, enPassantTarget).length ? "+" : "#";
}

function updateGameState() {
    const king = findKing(board, turn);
    const inCheck = king && isSquareAttacked(board, king.row, king.col, other(turn));
    const moves = getAllLegalMoves(board, turn, enPassantTarget);

    if (!moves.length && inCheck) {
        gameOver = true;
        setStatus(`Checkmate. ${capitalize(other(turn))} wins.`);
        return;
    }

    if (!moves.length) {
        gameOver = true;
        setStatus("Stalemate. The game is drawn.");
        return;
    }

    setStatus(inCheck ? `${capitalize(turn)} is in check.` : `${capitalize(turn)} to move.`);
}

function getLegalMoves(position, row, col, color, epTarget) {
    return getPseudoMoves(position, row, col, epTarget).filter(move => {
        const copy = cloneBoard(position);
        applyMove(copy, move);
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

    if (piece.type === "pawn") return pawnMoves(position, row, col, piece, epTarget);
    if (piece.type === "knight") return stepMoves(position, row, col, piece, [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]);
    if (piece.type === "king") return kingMoves(position, row, col, piece);
    if (piece.type === "bishop") return slideMoves(position, row, col, piece, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    if (piece.type === "rook") return slideMoves(position, row, col, piece, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    if (piece.type === "queen") return slideMoves(position, row, col, piece, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    return [];
}

function pawnMoves(position, row, col, piece, epTarget) {
    const moves = [];
    const dir = piece.color === WHITE ? -1 : 1;
    const start = piece.color === WHITE ? 6 : 1;
    const one = row + dir;
    const two = row + dir * 2;

    if (inside(one, col) && !position[one][col]) {
        moves.push(move(row, col, one, col));
        if (row === start && !position[two][col]) moves.push(move(row, col, two, col));
    }

    [-1, 1].forEach(offset => {
        const targetCol = col + offset;
        if (!inside(one, targetCol)) return;

        const target = position[one][targetCol];
        if (target && target.color !== piece.color) {
            moves.push(move(row, col, one, targetCol, { capture: true }));
        }

        if (epTarget && epTarget.row === one && epTarget.col === targetCol) {
            moves.push(move(row, col, one, targetCol, { enPassant: true, capture: true }));
        }
    });

    return moves;
}

function stepMoves(position, row, col, piece, offsets) {
    return offsets.reduce((moves, [dr, dc]) => {
        const targetRow = row + dr;
        const targetCol = col + dc;
        if (!inside(targetRow, targetCol)) return moves;

        const target = position[targetRow][targetCol];
        if (!target || target.color !== piece.color) {
            moves.push(move(row, col, targetRow, targetCol, { capture: Boolean(target) }));
        }
        return moves;
    }, []);
}

function slideMoves(position, row, col, piece, directions) {
    const moves = [];
    directions.forEach(([dr, dc]) => {
        let targetRow = row + dr;
        let targetCol = col + dc;

        while (inside(targetRow, targetCol)) {
            const target = position[targetRow][targetCol];
            if (!target) {
                moves.push(move(row, col, targetRow, targetCol));
            } else {
                if (target.color !== piece.color) moves.push(move(row, col, targetRow, targetCol, { capture: true }));
                break;
            }
            targetRow += dr;
            targetCol += dc;
        }
    });
    return moves;
}

function kingMoves(position, row, col, piece) {
    const moves = stepMoves(position, row, col, piece, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
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
    if (isSquareAttacked(position, rank, passCol, other(color)) || isSquareAttacked(position, rank, targetCol, other(color))) return;
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

function findKing(position, color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = position[row][col];
            if (piece && piece.type === "king" && piece.color === color) return { row, col };
        }
    }
    return null;
}

function isSquareAttacked(position, row, col, byColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = position[r][c];
            if (!piece || piece.color !== byColor) continue;
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

    if (piece.type === "knight") {
        return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }

    if (piece.type === "king") {
        return Math.max(Math.abs(dr), Math.abs(dc)) === 1;
    }

    const diagonal = Math.abs(dr) === Math.abs(dc);
    const straight = dr === 0 || dc === 0;
    if (piece.type === "bishop" && !diagonal) return false;
    if (piece.type === "rook" && !straight) return false;
    if (piece.type === "queen" && !diagonal && !straight) return false;

    const stepRow = Math.sign(dr);
    const stepCol = Math.sign(dc);
    let row = fromRow + stepRow;
    let col = fromCol + stepCol;
    while (row !== targetRow || col !== targetCol) {
        if (position[row][col]) return false;
        row += stepRow;
        col += stepCol;
    }
    return true;
}

function undoMove() {
    const previous = history.pop();
    if (!previous) {
        setStatus("No moves to undo.");
        return;
    }

    board = cloneBoard(previous.board);
    turn = previous.turn;
    capturedByWhite = previous.capturedByWhite.map(piece => ({ ...piece }));
    capturedByBlack = previous.capturedByBlack.map(piece => ({ ...piece }));
    enPassantTarget = previous.enPassantTarget ? { ...previous.enPassantTarget } : null;
    selected = null;
    legalTargets = [];
    gameOver = false;
    setStatus(`${capitalize(turn)} to move.`);
    render();
}

function setStatus(text) {
    statusElement.textContent = text;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function newGame() {
    board = startPosition();
    turn = WHITE;
    selected = null;
    legalTargets = [];
    history = [];
    capturedByWhite = [];
    capturedByBlack = [];
    enPassantTarget = null;
    gameOver = false;
    setStatus("White to move.");
    render();
}

document.getElementById("newGame").addEventListener("click", newGame);
document.getElementById("undoMove").addEventListener("click", undoMove);
document.getElementById("flipBoard").addEventListener("click", () => {
    flipped = !flipped;
    render();
});

newGame();
