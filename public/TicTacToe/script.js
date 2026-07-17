// =====================================
// DOM REFERENCES
// =====================================

const board = document.getElementById("board");
const statusText = document.getElementById("statusText");
const turnChip = document.getElementById("turnChip");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");
const newRoundBtn = document.getElementById("newRoundBtn");
const resetAllBtn = document.getElementById("resetAllBtn");
const winnerModal = document.getElementById("winnerModal");
const winnerTitle = document.getElementById("winnerTitle");
const winnerSubtitle = document.getElementById("winnerSubtitle");
const winnerNext = document.getElementById("winnerNext");
const winnerClose = document.getElementById("winnerClose");
const modeSelect = document.getElementById("modeSelect");
const themeSelect = document.getElementById("themeSelect");
const hintBtn = document.getElementById("hintBtn");
const undoBtn = document.getElementById("undoBtn");
const historyList = document.getElementById("historyList");
const themeToggleGroup = document.getElementById("themeToggleGroup");
const victorySound = new Audio("/public/TicTacToe/victory.mp3");
const xMoveSound = new Audio("/public/TicTacToe/click-x.mp3");
const oMoveSound = new Audio("/public/TicTacToe/click-o.mp3");
const drawSound = new Audio("/public/TicTacToe/draw.mp3");

// Statistics elements
const statTotal = document.getElementById("statTotal");
const statXWins = document.getElementById("statXWins");
const statOWins = document.getElementById("statOWins");
const statDraws = document.getElementById("statDraws");
const statXRate = document.getElementById("statXRate");
const statORate = document.getElementById("statORate");
const statCurrentStreak = document.getElementById("statCurrentStreak");
const statBestStreak = document.getElementById("statBestStreak");
const progressX = document.getElementById("progressX");
const progressO = document.getElementById("progressO");
const progressD = document.getElementById("progressD");
const progressXVal = document.getElementById("progressXVal");
const progressOVal = document.getElementById("progressOVal");
const progressDVal = document.getElementById("progressDVal");
const resetStatsBtn = document.getElementById("resetStatsBtn");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

// =====================================
// GAME VARIABLES
// =====================================

let gameBoard = Array(9).fill("");

let currentPlayer = "X";

let gameOver = false;
let moveHistory = [];

let scores = {
    X: 0,
    O: 0,
    D: 0
};

// =====================================
// STATISTICS
// =====================================

const STORAGE_KEY = "ticTacToeStatistics";

let statistics = {

    totalGames: 0,

    xWins: 0,

    oWins: 0,

    draws: 0,

    currentStreak: 0,

    bestStreak: 0,

    lastWinner: null

};

function loadStatistics() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

        statistics = JSON.parse(saved);

    }

}

function saveStatistics() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(statistics)
    );

}

function createStatisticsDashboard() {

    if (document.getElementById("statisticsPanel")) return;

    const panel = document.createElement("section");

    panel.className = "statistics-panel";

    panel.id = "statisticsPanel";

    panel.innerHTML = `

<h2>📊 Statistics Dashboard</h2>

<div class="stats-grid">

<div class="stat-card">

<span>Total Games</span>

<strong id="statTotal">0</strong>

</div>

<div class="stat-card">

<span>X Wins</span>

<strong id="statX">0</strong>

</div>

<div class="stat-card">

<span>O Wins</span>

<strong id="statO">0</strong>

</div>

<div class="stat-card">

<span>Draws</span>

<strong id="statDraw">0</strong>

</div>

<div class="stat-card">

<span>Current Streak</span>

<strong id="statCurrent">0</strong>

</div>

<div class="stat-card">

<span>Best Streak</span>

<strong id="statBest">0</strong>

</div>

</div>

<div class="progress-section">

<div class="progress-item">

<div class="progress-label">

<span>Player X Win Rate</span>

<span id="xRate">0%</span>

</div>

<div class="progress-bar">

<div
id="xProgress"
class="progress-fill progress-x">

</div>

</div>

</div>

<div class="progress-item">

<div class="progress-label">

<span>Player O Win Rate</span>

<span id="oRate">0%</span>

</div>

<div class="progress-bar">

<div
id="oProgress"
class="progress-fill progress-o">

</div>

</div>

</div>

</div>

<button
class="btn-ghost"
id="resetStatistics">

Reset Statistics

</button>

`;

    document.querySelector(".panel").appendChild(panel);

}

function updateStatisticsUI() {

    document.getElementById("statTotal").textContent = statistics.totalGames;

    document.getElementById("statX").textContent = statistics.xWins;

    document.getElementById("statO").textContent = statistics.oWins;

    document.getElementById("statDraw").textContent = statistics.draws;

    document.getElementById("statCurrent").textContent = statistics.currentStreak;

    document.getElementById("statBest").textContent = statistics.bestStreak;

    const totalWins =
        statistics.xWins +
        statistics.oWins;

    let xRate = 0;

    let oRate = 0;

    if (totalWins > 0) {

        xRate = Math.round((statistics.xWins / totalWins) * 100);

        oRate = Math.round((statistics.oWins / totalWins) * 100);

    }

    document.getElementById("xRate").textContent = xRate + "%";

    document.getElementById("oRate").textContent = oRate + "%";

    document.getElementById("xProgress").style.width = xRate + "%";

    document.getElementById("oProgress").style.width = oRate + "%";

}

function resetStatistics() {

    if (!confirm("Reset all statistics?")) return;

    statistics = {

        totalGames: 0,

        xWins: 0,

        oWins: 0,

        draws: 0,

        currentStreak: 0,

        bestStreak: 0,

        lastWinner: null

    };

    saveStatistics();

    updateStatisticsUI();

}

loadStatistics();

createStatisticsDashboard();

updateStatisticsUI();
// =====================================
// WIN COMBINATIONS
// =====================================

const WIN_LINES = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];

// =====================================
// BOARD RENDER
// =====================================

function renderBoard() {

    board.innerHTML = "";

    gameBoard.forEach((value, index) => {

        const cell = document.createElement("button");

        cell.className = "cell";

        if (value === "X") {

            cell.classList.add("mark-x");

        }

        if (value === "O") {

            cell.classList.add("mark-o");

        }

        cell.textContent = value;

        cell.addEventListener("click", () => {

            handleMove(index);

        });

        board.appendChild(cell);

    });

}

// =====================================
// STATUS
// =====================================

function updateStatus() {

    statusText.textContent = currentPlayer + "'s Turn";

    turnChip.textContent = "Turn: " + currentPlayer;

}

// =====================================
// SCOREBOARD
// =====================================

function updateScores() {

    scoreX.textContent = scores.X;

    scoreO.textContent = scores.O;

    scoreD.textContent = scores.D;

}

// =====================================
// HISTORY
// =====================================

function updateHistory() {

    historyList.innerHTML = "";

    moveHistory.slice(-10).forEach(move => {

        const li = document.createElement("li");

        li.textContent = `${move.player} → Cell ${move.cell}`;

        historyList.appendChild(li);

    });

}

// =====================================
// WINNER CHECK
// =====================================

function getWinner() {

    for (const line of WIN_LINES) {

        const [a, b, c] = line;

        if (

            gameBoard[a] &&

            gameBoard[a] === gameBoard[b] &&

            gameBoard[a] === gameBoard[c]

        ) {

            return line;

        }

    }

    return null;

}

// =====================================
// HIGHLIGHT WIN
// =====================================

function highlightWin(line) {

    renderBoard();

    line.forEach(index => {

        board.children[index]

            .classList.add("win-cell");

    });

}

// =====================================
// MODALS
// =====================================

function showWinner(player) {

    winnerTitle.textContent = `Player ${player} Wins!`;

    winnerSubtitle.textContent = "Ready for the next round?";

    winnerModal.classList.add("show");

}

function showDraw() {

    winnerTitle.textContent = "Draw!";

    winnerSubtitle.textContent = "Nobody wins this round.";

    winnerModal.classList.add("show");

}

// =====================================
// NEW ROUND
// =====================================

function newRound() {

    gameBoard = Array(9).fill("");

    currentPlayer = "X";

    gameOver = false;

    moveHistory = [];

    updateHistory();

    updateStatus();

    winnerModal.classList.remove("show");

    renderBoard();

}

// =====================================
// RESET SCORES
// =====================================

function resetScores() {

    scores = {

        X: 0,

        O: 0,

        D: 0

    };

    updateScores();

    newRound();

}
// =====================================
// HANDLE PLAYER MOVE
// =====================================

function handleMove(index) {

    if (gameOver) return;

    if (gameBoard[index] !== "") return;

    gameBoard[index] = currentPlayer;

    moveHistory.push({

        player: currentPlayer,

        cell: index + 1

    });

    renderBoard();

    updateHistory();

    const winnerLine = getWinner();

    if (winnerLine) {

        gameOver = true;

        highlightWin(winnerLine);

        scores[currentPlayer]++;

        updateScores();

        // ---------- Statistics ----------

        statistics.totalGames++;

        if (currentPlayer === "X") {

            statistics.xWins++;

        } else {

            statistics.oWins++;

        }

        if (statistics.lastWinner === currentPlayer) {

            statistics.currentStreak++;

        } else {

            statistics.currentStreak = 1;

        }

        statistics.lastWinner = currentPlayer;

        if (statistics.currentStreak > statistics.bestStreak) {

            statistics.bestStreak = statistics.currentStreak;

        }

        saveStatistics();

        updateStatisticsUI();

        setTimeout(() => {

            showWinner(currentPlayer);

        }, 400);

        return;

    }

    // ---------- DRAW ----------

    if (!gameBoard.includes("")) {

        gameOver = true;

        scores.D++;
        updateScores();

        statistics.totalGames++;

        statistics.draws++;

        statistics.currentStreak = 0;

        statistics.lastWinner = null;

        saveStatistics();

        updateStatisticsUI();

        setTimeout(() => {

            showDraw();

        }, 400);

        return;

    }

    // ---------- NEXT TURN ----------

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateStatus();

    // ---------- CPU ----------

    if (

        modeSelect.value !== "pvp" &&

        currentPlayer === "O"

    ) {

        setTimeout(cpuMove, 450);

    }

}
// =====================================
// CPU MOVE
// =====================================

function cpuMove() {

    if (gameOver) return;

    const empty = [];

    gameBoard.forEach((cell, index) => {

        if (cell === "") {

            empty.push(index);

        }

    });

    if (empty.length === 0) return;

    let move;

    switch (modeSelect.value) {

        case "cpu-hard":

            move = findBestMove();
            break;

        case "cpu-medium":

            move = Math.random() < 0.7
                ? findBestMove()
                : empty[Math.floor(Math.random() * empty.length)];

            break;

        default:

            move = empty[Math.floor(Math.random() * empty.length)];

    }

    handleMove(move);

}

// =====================================
// MINIMAX
// =====================================

function findBestMove() {

    let bestScore = -Infinity;

    let move;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === "") {
            gameBoard[i] = "O";

            let score = minimax(gameBoard, false);

            gameBoard[i] = "";

            if (score > bestScore) {

                bestScore = score;

                move = i;

            }

        }

    }

    return move;

}

function minimax(boardState, isMax) {

    const result = evaluateBoard(boardState);

    if (result !== null) {

        return result;

    }

    if (isMax) {

        let best = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "O";

                best = Math.max(best, minimax(boardState, false));

                boardState[i] = "";

            }

        }

        return best;

    }

    let best = Infinity;

    for (let i = 0; i < 9; i++) {

        if (boardState[i] === "") {

            boardState[i] = "X";

            best = Math.min(best, minimax(boardState, true));

            boardState[i] = "";

        }

    }

    return best;

}

function evaluateBoard(boardState) {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;

        if (

            boardState[a] &&

            boardState[a] === boardState[b] &&

            boardState[b] === boardState[c]

        ) {

            return boardState[a] === "O"

                ? 10

                : -10;

        }

    }

    if (!boardState.includes("")) {

        return 0;

    }

    return null;

}

// =====================================
// HINT
// =====================================

hintBtn.addEventListener("click", () => {

    const move = findBestMove();

    if (move === undefined) return;

    board.children[move].classList.add("hint-cell");

    setTimeout(() => {

        board.children[move].classList.remove("hint-cell");

    }, 1500);

});

// =====================================
// UNDO
// =====================================

undoBtn.addEventListener("click", () => {

    if (moveHistory.length === 0 || gameOver) return;

    const last = moveHistory.pop();

    gameBoard[last.cell - 1] = "";

    currentPlayer = last.player;

    renderBoard();

    updateHistory();

    updateStatus();

});

// =====================================
// THEME
// =====================================

themeSelect.addEventListener("change", () => {

    document.body.dataset.theme = themeSelect.value;

});

// =====================================
// BUTTONS
// =====================================

newRoundBtn.addEventListener("click", newRound);

winnerNext.addEventListener("click", newRound);

winnerClose.addEventListener("click", () => {

    winnerModal.classList.remove("show");

});

resetAllBtn.addEventListener("click", () => {

    if (confirm("Reset scores and statistics?")) {

        resetScores();

        resetStatistics();

    }

});

// =====================================
// START GAME
// =====================================

loadStatistics();

updateStatisticsUI();

updateScores();

updateStatus();

renderBoard();

updateHistory();

// =====================================
// STATISTICS FUNCTIONS
// =====================================

function saveStatistics() {

    localStorage.setItem(
        "ticTacToeStatistics",
        JSON.stringify(statistics)
    );

    drawSound.pause();
    drawSound.currentTime = 0;
    updateScores();
    newRound();
}

function loadStatistics() {

    const data = localStorage.getItem("ticTacToeStatistics");

    if (data) {

        statistics = JSON.parse(data);

    }

}

function resetStatistics() {

    statistics = {

        totalGames: 0,
        xWins: 0,
        oWins: 0,
        draws: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastWinner: null

    };

    saveStatistics();

    updateStatisticsUI();

}

function updateStatisticsUI() {

    statGames.textContent = statistics.totalGames;

    statXWins.textContent = statistics.xWins;

    statOWins.textContent = statistics.oWins;

    statDraws.textContent = statistics.draws;

    statCurrent.textContent = statistics.currentStreak;

    statBest.textContent = statistics.bestStreak;

    const total = statistics.totalGames || 1;

    const xRate = Math.round((statistics.xWins / total) * 100);

    const oRate = Math.round((statistics.oWins / total) * 100);

    xRateText.textContent = `${xRate}%`;
    oRateText.textContent = `${oRate}%`;

    xRateBar.style.width = `${xRate}%`;
    oRateBar.style.width = `${oRate}%`;

}