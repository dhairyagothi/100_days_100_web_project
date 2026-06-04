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

let gameBoard = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

let moveHistory = [];

let scores = {
X: 0,
O: 0,
D: 0
};

const WIN_LINES = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

function renderBoard() {


board.innerHTML = "";

gameBoard.forEach((value,index) => {

    const cell = document.createElement("button");

    cell.className = "cell";

    if(value === "X") {
        cell.classList.add("mark-x");
    }

    if(value === "O") {
        cell.classList.add("mark-o");
    }

    cell.textContent = value;

    cell.addEventListener("click", () => {
        handleMove(index);
    });

    board.appendChild(cell);
});


}

function handleMove(index){


if(gameOver) return;

if(gameBoard[index] !== "") return;

gameBoard[index] = currentPlayer;

moveHistory.push({
    player: currentPlayer,
    cell: index + 1
});

updateHistory();

const winLine = getWinner();

if(winLine){

    highlightWin(winLine);

    scores[currentPlayer]++;

    updateScores();

    gameOver = true;

    showWinner(currentPlayer);

    return;
}

if(gameBoard.every(cell => cell !== "")){

    scores.D++;

    updateScores();

    gameOver = true;

    showDraw();

    return;
}

currentPlayer =
    currentPlayer === "X" ? "O" : "X";

updateStatus();

renderBoard();

const mode = modeSelect.value;

if(
    mode !== "pvp" &&
    currentPlayer === "O" &&
    !gameOver
){
    setTimeout(cpuMove,400);
}


}

function cpuMove() {

    if (gameOver) return;

    const available = [];

    gameBoard.forEach((cell, index) => {
        if (cell === "") {
            available.push(index);
        }
    });

    if (!available.length) return;

    let move;

    const mode = modeSelect.value;

if (mode === "cpu-easy") {

    move = available[
        Math.floor(Math.random() * available.length)
    ];

} else if (mode === "cpu-medium") {

    if (Math.random() < 0.7) {

        move = getBestMove();

    } else {

        move = available[
            Math.floor(Math.random() * available.length)
        ];
    }

} else {

    move = getBestMoveMinimax();

    if (move === undefined) {
        move = getBestMove();
    }
}

gameBoard[move] = "O";

    moveHistory.push({
        player: "O",
        cell: move + 1
    });

    updateHistory();

    const winLine = getWinner();

    if (winLine) {

        highlightWin(winLine);

        scores.O++;

        updateScores();

        gameOver = true;

        showWinner("O");

        return;
    }

    if (gameBoard.every(cell => cell !== "")) {

        scores.D++;

        updateScores();

        gameOver = true;

        showDraw();

        return;
    }

    currentPlayer = "X";

    updateStatus();

    renderBoard();
}

function getBestMove(){


for(const line of WIN_LINES){

    const [a,b,c] = line;

    const cells = [
        gameBoard[a],
        gameBoard[b],
        gameBoard[c]
    ];

    if(
        cells.filter(v => v === "O").length === 2 &&
        cells.includes("")
    ){
        return line[
            cells.indexOf("")
        ];
    }
}

for(const line of WIN_LINES){

    const [a,b,c] = line;

    const cells = [
        gameBoard[a],
        gameBoard[b],
        gameBoard[c]
    ];

    if(
        cells.filter(v => v === "X").length === 2 &&
        cells.includes("")
    ){
        return line[
            cells.indexOf("")
        ];
    }
}

if(gameBoard[4] === ""){
    return 4;
}

const free = [];

gameBoard.forEach((cell,index)=>{
    if(cell === "") {
        free.push(index);
    }
});

return free[
    Math.floor(Math.random()*free.length)
];


}

function getBestMoveMinimax() {

    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {

        if (gameBoard[i] === "") {

            gameBoard[i] = "O";

            let score = minimax(gameBoard, 0, false);

            gameBoard[i] = "";

            if (score > bestScore) {

                bestScore = score;

                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(boardState, depth, isMaximizing) {

    const winner = evaluateBoard(boardState);

    if (winner !== null) {

        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;

        return 0;
    }

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                boardState[i] = "O";

                let score =
                    minimax(boardState, depth + 1, false);

                boardState[i] = "";

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                boardState[i] = "X";

                let score =
                    minimax(boardState, depth + 1, true);

                boardState[i] = "";

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

function evaluateBoard(boardState) {

    for (const line of WIN_LINES) {

        const [a, b, c] = line;

        if (
            boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]
        ) {
            return boardState[a];
        }
    }

    if (boardState.every(cell => cell !== "")) {
        return "draw";
    }

    return null;
}
  /* ── Scan for winner (returns mark or null) ── */
  function scanWinner(b) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var l = WIN_LINES[i];
      if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) {
        return b[l[0]];
      }
    }
    return null;
  }
  /* ── Check win (uses scanWinner) ─────── */
  function checkWin() {
    return scanWinner(board) ? WIN_LINES.find(function (l) {
      return board[l[0]] && board[l[0]] === board[l[1]] && board[l[0]] === board[l[2]];
    }) : null;
  }
  /* ── Highlight winning cells ──────────── */
  function highlightWin(line) {
    var cells = boardEl.querySelectorAll(".cell");
    line.forEach(function (i) { cells[i].classList.add("win-cell"); });
  }
  /* ── Update turn UI + background ─────── */
  function setUI(player) {
    var label = (vsBot && player === botMark) ? "Bot" : "Player " + player;
    turnChip.textContent = "Turn: " + (player ? label : "");
    statusEl.textContent = player ? label + "'s turn!" : "";
  }
  /* ── Update scoreboard ────────────────── */
  function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreD.textContent = scores.D;
  }
  /* ── Win overlay ──────────────────────── */
  function showWinOverlay(player) {
    var label = (vsBot && player === botMark) ? "Bot" : "Player " + player;
    winText.textContent = label + " wins the round!";
    winSub.textContent  = "Great moves. Ready for the next round?";
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    launchConfetti(player);
  }
  /* ── Draw overlay ─────────────────────── */
  function showDrawOverlay() {
    winText.textContent = "It's a draw!";
    winSub.textContent  = "Nobody wins this round.";
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
  }
  /* ── Next round ───────────────────────── */
  function nextRound() {
    board    = Array(9).fill(null);
    current  = "X";
    gameOver = false;
    buildBoard();
    setUI("X");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    stopConfetti();
    if (vsBot && current === botMark) {
      var avail = board.map(function (v, i) { return v ? null : i; }).filter(function (v) { return v !== null; });
      if (avail.length) setTimeout(function () {
        var cells = boardEl.querySelectorAll('.cell');
        if (cells[avail[0]]) cells[avail[0]].click();
      }, 480);
    }
  }
  /* ── Reset all ────────────────────────── */
  function resetAll() {
    scores = { X: 0, O: 0, D: 0 };
    updateScores();
    nextRound();
  }
  /* ── Launch confetti ─────────────────── */
  function launchConfetti(player) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    var color = player === "X" ? "#ff7d7d" : "#40f5d2";
    for (var i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 3,
        d: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? color : "#ffffff",
        tilt: Math.random() * 10 - 5
      });
    }
  }
    }
}

return null;


}

function highlightWin(line){


renderBoard();

line.forEach(index => {

    board.children[index]
        .classList.add("win-cell");
});


}

function updateStatus(){


statusText.textContent =
    currentPlayer + "'s Turn";

turnChip.textContent =
    "Turn: " + currentPlayer;


}

function updateScores(){

scoreX.textContent = scores.X;
scoreO.textContent = scores.O;
scoreD.textContent = scores.D;

}

function updateHistory(){


historyList.innerHTML = "";

moveHistory.slice(-10).forEach(move => {

    const li =
        document.createElement("li");

    li.textContent =
        move.player +
        " → Cell " +
        move.cell;

    historyList.appendChild(li);
});


}

function showWinner(player){


winnerTitle.textContent =
    "Player " + player + " Wins!";

winnerSubtitle.textContent =
    "Ready for the next round?";

winnerModal.classList.add("show");


}

function showDraw(){


winnerTitle.textContent =
    "Draw!";

winnerSubtitle.textContent =
    "Nobody wins this round.";

winnerModal.classList.add("show");


}

function newRound(){


gameBoard = Array(9).fill("");

currentPlayer = "X";

gameOver = false;

moveHistory = [];

updateHistory();

updateStatus();

winnerModal.classList.remove("show");

renderBoard();


}

function resetScores(){


scores = {
    X:0,
    O:0,
    D:0
};

updateScores();

newRound();


}

function undoMove(){

    if(!moveHistory.length) return;

    const mode = modeSelect.value;

    if(mode !== "pvp" && moveHistory.length >= 2){

        const cpuMove = moveHistory.pop();
        gameBoard[cpuMove.cell - 1] = "";

        const playerMove = moveHistory.pop();
        gameBoard[playerMove.cell - 1] = "";

        currentPlayer = "X";

    } else {

        const last = moveHistory.pop();

        gameBoard[last.cell - 1] = "";

        currentPlayer = last.player;
    }

    gameOver = false;

    updateHistory();

    updateStatus();

    renderBoard();
}

function showHint(){


const move = getBestMoveMinimax();

renderBoard();

if(board.children[move]){

    board.children[move]
        .classList.add("hint-cell");
}


}

themeSelect.addEventListener(
"change",
function(){


    document.body.setAttribute(
        "data-theme",
        this.value
    );
}


);

newRoundBtn.addEventListener(
"click",
newRound
);

resetAllBtn.addEventListener(
"click",
resetScores
);

undoBtn.addEventListener(
"click",
undoMove
);

hintBtn.addEventListener(
"click",
showHint
);

winnerNext.addEventListener(
"click",
newRound
);

winnerClose.addEventListener(
"click",
()=>{
winnerModal.classList.remove("show");
}
);

updateStatus();
updateScores();
renderBoard();


// ============================================================
// ACCESSIBILITY INTERFACE: KEYBOARD NAVIGATION & ARIA INJECTION (#6033)
// ============================================================

/**
 * Automates focus indicators and screen reader attributes over dynamic cells
 */
function applyGridAccessibility() {
    const board = document.getElementById('board');
    if (!board) return;

    // Monitor structural mutations inside the board wrapper
    const observer = new MutationObserver(() => {
        const cells = board.querySelectorAll('.cell, [data-cell], .box');
        
        cells.forEach((cell, index) => {
            // Assign sequential keyboard tracking context benchmarks
            if (!cell.hasAttribute('tabindex')) {
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', `Grid square ${index + 1}, empty`);
            }

            // Keyboard navigation execution payload mapping
            if (!cell.dataset.keyboardBound) {
                cell.dataset.keyboardBound = "true";
                cell.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); // Capture baseline shift constraints
                        cell.click();       // Fallback directly onto runtime click mechanics
                        
                        // Update dynamic announcements for state changes
                        const currentTurn = document.getElementById('statusText')?.textContent || '';
                        cell.setAttribute('aria-label', `Grid square ${index + 1}, marked ${cell.textContent || 'occupied'}`);
                    }
                });
            }
        });
    });

    observer.observe(board, { childList: true, subtree: true });
}

// Fire runtime validation layers safely on context evaluation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGridAccessibility);
} else {
    applyGridAccessibility();
}