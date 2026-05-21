const boxes = Array.from(document.querySelectorAll(".box"));
const resetRoundBtn = document.querySelector("#resetRound");
const resetAllBtn = document.querySelector("#resetAll");
const statusText = document.querySelector("#statusText");
const turnChip = document.querySelector("#turnChip");
const scoreOEl = document.querySelector("#scoreO");
const scoreXEl = document.querySelector("#scoreX");
const scoreDEl = document.querySelector("#scoreD");
const modeSelect = document.querySelector("#modeSelect");
const themeSelect = document.querySelector("#themeSelect");
const hintBtn = document.querySelector("#hintBtn");
const undoBtn = document.querySelector("#undoBtn");
const soundToggle = document.querySelector("#soundToggle");
const turnTimer = document.querySelector("#turnTimer");
const historyList = document.querySelector("#historyList");
const boardEl = document.querySelector("#board");
const winLine = document.querySelector("#winLine");
const confettiCanvas = document.querySelector("#confetti");
const winnerModal = document.querySelector("#winnerModal");
const winnerTitle = document.querySelector("#winnerTitle");
const winnerSubtitle = document.querySelector("#winnerSubtitle");
const winnerBadge = document.querySelector("#winnerBadge");
const winnerNextBtn = document.querySelector("#winnerNext");
const winnerCloseBtn = document.querySelector("#winnerClose");
const startModal = document.querySelector("#startModal");
const startGameBtn = document.querySelector("#startGameBtn");

let turnO = true;
let boardLocked = false;
let scores = { O: 0, X: 0, D: 0 };
let boardState = Array(9).fill("");
let moveHistory = [];
let mode = "pvp";
let soundEnabled = true;
let currentResult = null;
let confettiAnimId = null;
let audioCtx;
let gameStarted = false;
const setTarget = 3;
let turnTimerId = null;
let turnStart = null;

// All winning triplets on the 3x3 grid.
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const updateStatus = (message) => {
    statusText.textContent = message;
    const turnLabel = turnO ? "O" : "X";
    const cpuLabel = mode === "pvp" ? "" : turnO ? " (You)" : " (CPU)";
    turnChip.textContent = `Turn: ${turnLabel}${cpuLabel}`;
};

const startTurnTimer = () => {
    turnStart = Date.now();
    if (turnTimerId) {
        clearInterval(turnTimerId);
    }
    turnTimerId = setInterval(() => {
        if (!turnStart) {
            return;
        }
        const seconds = Math.floor((Date.now() - turnStart) / 1000);
        if (turnTimer) {
            turnTimer.textContent = `Time: ${seconds}s`;
        }
    }, 500);
};

const stopTurnTimer = () => {
    if (turnTimerId) {
        clearInterval(turnTimerId);
        turnTimerId = null;
    }
    turnStart = null;
    if (turnTimer) {
        turnTimer.textContent = "Time: 0s";
    }
};

const updateScores = () => {
    scoreOEl.textContent = scores.O;
    scoreXEl.textContent = scores.X;
    scoreDEl.textContent = scores.D;
};

const setWinner = (winner, pattern) => {
    boardLocked = true;
    currentResult = { winner, pattern };
    if (pattern.length) {
        pattern.forEach((index) => boxes[index].classList.add("win"));
        showWinLine(pattern);
    }
    statusText.textContent = winner === "D" ? "Round draw" : `${winner} wins the round`;
    if (winner !== "D") {
        scores[winner] += 1;
        launchConfetti();
        playTone(620, 0.15);
    } else {
        scores.D += 1;
        playTone(260, 0.12);
    }
    updateScores();
    if (winner !== "D") {
        const isSetWin = scores[winner] >= setTarget;
        showWinnerModal(winner, isSetWin);
    }
    if (winner !== "D" && scores[winner] >= setTarget) {
        statusText.textContent = `${winner} wins the set. Reset scores to play again.`;
    }
    stopTurnTimer();
};

const checkWinner = () => {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const pos1 = boardState[a];
        const pos2 = boardState[b];
        const pos3 = boardState[c];
        if (pos1 && pos1 === pos2 && pos2 === pos3) {
            setWinner(pos1, pattern);
            return true;
        }
    }

    if (boardState.every((cell) => cell)) {
        setWinner("D", []);
        return true;
    }
    return false;
};

// Handle a player click on a board cell.
const handleTurn = (box) => {
    if (!gameStarted || boardLocked || box.textContent) {
        return;
    }
    if (mode !== "pvp" && !turnO) {
        return;
    }
    const index = Number(box.dataset.index);
    placeMark(index, turnO ? "O" : "X");
};

// Place a mark and advance game flow (win check, CPU turn).
const placeMark = (index, mark, isAuto = false) => {
    const box = boxes[index];
    if (!box || boardState[index]) {
        return;
    }
    boardState[index] = mark;
    box.textContent = mark;
    box.classList.add(mark === "O" ? "mark-o" : "mark-x");
    box.disabled = true;
    clearHints();
    moveHistory.push({ index, mark });
    updateHistory();
    if (!isAuto) {
        playTone(mark === "O" ? 420 : 320, 0.08);
    }
    if (!checkWinner()) {
        turnO = !turnO;
        updateStatus("Make your move");
        startTurnTimer();
        triggerCpuMove();
    }
};

const resetRound = () => {
    if (scores.O >= setTarget || scores.X >= setTarget) {
        updateStatus("Set is over. Reset scores to play again.");
        return;
    }
    hideWinnerModal();
    boardLocked = false;
    currentResult = null;
    boardState = Array(9).fill("");
    moveHistory = [];
    turnO = true;
    boxes.forEach((box) => {
        box.textContent = "";
        box.disabled = false;
        box.classList.remove("win", "mark-o", "mark-x", "hint");
    });
    hideWinLine();
    updateHistory();
    updateStatus("New round started");
    if (gameStarted) {
        startTurnTimer();
    }
    if (mode !== "pvp" && !turnO) {
        triggerCpuMove();
    }
};

const resetAll = () => {
    scores = { O: 0, X: 0, D: 0 };
    updateScores();
    turnO = true;
    resetRound();
    updateStatus("Scores reset. Ready to play");
};

const setModalState = (modal, isOpen) => {
    if (!modal) {
        return;
    }
    modal.classList.toggle("show", isOpen);
    modal.setAttribute("aria-hidden", String(!isOpen));
};

const showWinnerModal = (winner, isSetWin) => {
    const winnerLabel = `Player ${winner}`;
    winnerBadge.textContent = "Winner";
    winnerTitle.textContent = isSetWin ? `${winnerLabel} wins the set!` : `${winnerLabel} wins the round!`;
    winnerSubtitle.textContent = isSetWin
        ? "Champion vibes. Reset scores to play a new set."
        : "Great moves. Ready for the next round?";
    setModalState(winnerModal, true);
};

const hideWinnerModal = () => {
    setModalState(winnerModal, false);
};

const showStartModal = () => {
    gameStarted = false;
    setModalState(startModal, true);
    boardLocked = true;
    stopTurnTimer();
};

const hideStartModal = () => {
    setModalState(startModal, false);
};

const updateHistory = () => {
    historyList.innerHTML = "";
    const recent = moveHistory.slice(-10);
    recent.forEach((move, index) => {
        const item = document.createElement("li");
        const moveNumber = moveHistory.length - recent.length + index + 1;
        item.textContent = `#${moveNumber} ${move.mark} to cell ${move.index + 1}`;
        historyList.appendChild(item);
    });
};

const clearHints = () => {
    boxes.forEach((box) => box.classList.remove("hint"));
};

const syncTurnFromBoard = () => {
    const countO = boardState.filter((cell) => cell === "O").length;
    const countX = boardState.filter((cell) => cell === "X").length;
    turnO = countO === countX;
};

const undoMove = () => {
    if (!moveHistory.length) {
        return;
    }

    if (currentResult) {
        if (currentResult.winner && currentResult.winner !== "D") {
            scores[currentResult.winner] = Math.max(0, scores[currentResult.winner] - 1);
        }
        if (currentResult.winner === "D") {
            scores.D = Math.max(0, scores.D - 1);
        }
        currentResult = null;
        updateScores();
    }

    const steps = mode === "pvp" ? 1 : 2;
    for (let i = 0; i < steps; i += 1) {
        const last = moveHistory.pop();
        if (!last) {
            break;
        }
        const box = boxes[last.index];
        boardState[last.index] = "";
        box.textContent = "";
        box.disabled = false;
        box.classList.remove("win", "mark-o", "mark-x");
    }

    boardLocked = false;
    boxes.forEach((box) => box.classList.remove("win"));
    hideWinLine();
    clearHints();
    syncTurnFromBoard();
    updateHistory();
    updateStatus("Undo applied");
    triggerCpuMove();
};

// Run the CPU move with a short delay for pacing.
const triggerCpuMove = () => {
    if (mode === "pvp" || boardLocked || turnO) {
        return;
    }
    const available = getAvailableMoves(boardState);
    if (!available.length) {
        return;
    }
    updateStatus("CPU is thinking...");
    boardLocked = true;
    boardEl.classList.add("thinking");
    setTimeout(() => {
        let bestMove = null;
        if (mode === "cpu-easy") {
            bestMove = randomMove(available);
        } else if (mode === "cpu-medium") {
            bestMove = Math.random() < 0.6 ? bestMoveFor(boardState, "X") : randomMove(available);
        } else {
            bestMove = bestMoveFor(boardState, "X");
        }
        boardLocked = false;
        boardEl.classList.remove("thinking");
        placeMark(bestMove, "X", true);
    }, 450);
};

const getAvailableMoves = (state) => state
    .map((cell, index) => (cell ? null : index))
    .filter((value) => value !== null);

const randomMove = (moves) => moves[Math.floor(Math.random() * moves.length)];

const bestMoveFor = (state, player) => {
    let bestScore = -Infinity;
    let move = null;
    const opponent = player === "O" ? "X" : "O";
    getAvailableMoves(state).forEach((index) => {
        const next = [...state];
        next[index] = player;
        const score = minimax(next, false, player, opponent, 0);
        if (score > bestScore) {
            bestScore = score;
            move = index;
        }
    });
    if (move === null) {
        const available = getAvailableMoves(state);
        return available.length ? randomMove(available) : null;
    }
    return move;
};

// Minimax scoring for the hard CPU decision.
const minimax = (state, isMax, player, opponent, depth) => {
    const winner = evaluateWinner(state);
    if (winner === player) {
        return 10 - depth;
    }
    if (winner === opponent) {
        return depth - 10;
    }
    if (state.every((cell) => cell)) {
        return 0;
    }

    const moves = getAvailableMoves(state);
    if (isMax) {
        let best = -Infinity;
        moves.forEach((index) => {
            const next = [...state];
            next[index] = player;
            best = Math.max(best, minimax(next, false, player, opponent, depth + 1));
        });
        return best;
    }
    let best = Infinity;
    moves.forEach((index) => {
        const next = [...state];
        next[index] = opponent;
        best = Math.min(best, minimax(next, true, player, opponent, depth + 1));
    });
    return best;
};

const evaluateWinner = (state) => {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];
        }
    }
    return null;
};

const handleHint = () => {
    if (boardLocked) {
        return;
    }
    if (mode !== "pvp" && !turnO) {
        updateStatus("CPU is thinking...");
        return;
    }
    clearHints();
    const player = turnO ? "O" : "X";
    const index = bestMoveFor(boardState, player);
    if (index !== null && boxes[index]) {
        boxes[index].classList.add("hint");
    }
};

const setTheme = (value) => {
    document.body.dataset.theme = value;
};

const handleKeyShortcuts = (event) => {
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON") {
        return;
    }
    if (event.key >= "1" && event.key <= "9") {
        const index = Number(event.key) - 1;
        if (boxes[index]) {
            handleTurn(boxes[index]);
        }
        return;
    }
    if (event.key === "r" || event.key === "R") {
        resetRound();
    }
    if (event.key === "u" || event.key === "U") {
        undoMove();
    }
    if (event.key === "h" || event.key === "H") {
        handleHint();
    }
    if (event.key === "s" || event.key === "S") {
        toggleSound();
    }
};

const toggleSound = () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
};

// Simple Web Audio beep for click feedback.
const playTone = (freq, duration) => {
    if (!soundEnabled) {
        return;
    }
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

const showWinLine = (pattern) => {
    const [start, , end] = pattern;
    const startBox = boxes[start];
    const endBox = boxes[end];
    if (!startBox || !endBox) {
        return;
    }
    const boardRect = boardEl.getBoundingClientRect();
    const startRect = startBox.getBoundingClientRect();
    const endRect = endBox.getBoundingClientRect();
    const x1 = startRect.left + startRect.width / 2 - boardRect.left;
    const y1 = startRect.top + startRect.height / 2 - boardRect.top;
    const x2 = endRect.left + endRect.width / 2 - boardRect.left;
    const y2 = endRect.top + endRect.height / 2 - boardRect.top;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    winLine.style.left = `${x1}px`;
    winLine.style.top = `${y1}px`;
    winLine.style.width = `${length}px`;
    winLine.style.transform = `rotate(${angle}deg)`;
    winLine.classList.add("show");
};

const hideWinLine = () => {
    winLine.classList.remove("show");
    winLine.style.width = "0px";
};

const resizeConfetti = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
};

const launchConfetti = () => {
    if (!confettiCanvas) {
        return;
    }
    resizeConfetti();
    const ctx = confettiCanvas.getContext("2d");
    const pieces = Array.from({ length: 80 }, () => ({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 10,
        vx: -1 + Math.random() * 2,
        vy: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? "#40f5d2" : "#ff7d7d"
    }));
    const start = performance.now();
    const draw = (now) => {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        pieces.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.w, p.h);
        });
        if (now - start < 1200) {
            confettiAnimId = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            cancelAnimationFrame(confettiAnimId);
        }
    };
    cancelAnimationFrame(confettiAnimId);
    confettiAnimId = requestAnimationFrame(draw);
};

boxes.forEach((box) => {
    box.addEventListener("click", () => handleTurn(box));
});

resetRoundBtn.addEventListener("click", resetRound);
resetAllBtn.addEventListener("click", resetAll);
hintBtn.addEventListener("click", handleHint);
undoBtn.addEventListener("click", undoMove);
soundToggle.addEventListener("click", toggleSound);
winnerNextBtn.addEventListener("click", () => {
    hideWinnerModal();
    resetRound();
});
winnerCloseBtn.addEventListener("click", hideWinnerModal);
winnerModal.addEventListener("click", (event) => {
    if (event.target === winnerModal) {
        hideWinnerModal();
    }
});
startGameBtn.addEventListener("click", () => {
    gameStarted = true;
    hideStartModal();
    resetRound();
    updateStatus("Make your move");
    startTurnTimer();
});
modeSelect.addEventListener("change", (event) => {
    mode = event.target.value;
    resetRound();
    updateStatus("Mode updated. New round started");
});
themeSelect.addEventListener("change", (event) => {
    setTheme(event.target.value);
});
document.addEventListener("keydown", handleKeyShortcuts);
window.addEventListener("resize", () => {
    if (winLine.classList.contains("show") && currentResult?.pattern?.length) {
        showWinLine(currentResult.pattern);
    }
    resizeConfetti();
});

updateScores();
updateStatus("Ready to play");
setTheme("neon");
resizeConfetti();
updateHistory();
if (!gameStarted) {
    showStartModal();
}