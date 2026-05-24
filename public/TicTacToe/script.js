(function () {
  "use strict";

  var WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  var board     = Array(9).fill(null);
  var current   = "X";
  var gameOver  = false;
  var scores    = { X: 0, O: 0, D: 0 };
  var particles = [];
  var animFrame = null;

  /* ── Bot state ──────────────────────────*/
  var vsBot   = false;
  var botMark = "O";

  var boardEl  = document.getElementById("board");
  var gameEl   = document.getElementById("game");
  var statusEl = document.getElementById("status-bar");
  var pillX    = document.getElementById("pill-x");
  var pillO    = document.getElementById("pill-o");
  var scoreX   = document.getElementById("score-x");
  var scoreO   = document.getElementById("score-o");
  var scoreD   = document.getElementById("score-d");
  var overlay  = document.getElementById("win-overlay");
  var winText  = document.getElementById("win-text");
  var winSub   = document.getElementById("win-sub");
  var winBtn   = document.getElementById("win-btn");
  var canvas   = document.getElementById("confetti-canvas");
  var ctx      = canvas.getContext("2d");
  var startScreen = document.getElementById("start-screen");
  var startBtn   = document.getElementById("start-btn");

  // ── Mode screen (injected) ─────────────
  var modeScreen = document.createElement("div");
  modeScreen.id = "mode-screen";
  modeScreen.innerHTML = `
    <h2 class="mode-title">Choose Mode</h2>
    <p class="mode-sub">How do you want to play?</p>
    <div class="mode-btns">
      <button class="mode-btn" id="btn-2p">
        <span class="mode-icon">👥</span>
        <span class="mode-label">2 Players</span>
        <span class="mode-desc">Play with a friend</span>
      </button>
      <button class="mode-btn" id="btn-bot">
        <span class="mode-icon">🤖</span>
        <span class="mode-label">vs Bot</span>
        <span class="mode-desc">Challenge the AI</span>
      </button>
    </div>
  `;
  document.body.appendChild(modeScreen);

  /* ── Build board ──────────────────────── */
  function buildBoard() {
    boardEl.innerHTML = "";
    board.forEach(function (val, i) {
      var cell = document.createElement("div");
      cell.className = "cell";
      if (val) {
        cell.classList.add("taken", val === "X" ? "x-mark" : "o-mark");
        cell.textContent = val === "X" ? "\u2715" : "\u25CB";
      }
      cell.addEventListener("click", function () { handleClick(i); });
      boardEl.appendChild(cell);
    });
  }

  /* ── Handle cell click ────────────────── */
  function handleClick(i) {
    if (gameOver || board[i]) return;
    if (vsBot && current === botMark) return;   // block clicks on bot's turn

    board[i] = current;
    buildBoard();

    var win = checkWin();
    if (win) {
      highlightWin(win);
      scores[current]++;
      updateScores();
      setTimeout(function () { showWinOverlay(current); }, 320);
      gameOver = true;
    } else if (board.every(Boolean)) {
      scores.D++;
      updateScores();
      setTimeout(showDrawOverlay, 200);
      gameOver = true;
    } else {
      current = current === "X" ? "O" : "X";
      setUI(current);
      if (vsBot && current === botMark) setTimeout(doBotMove, 480);
    }
  }

  /* ── Bot move ─────────────────────────── */
  function doBotMove() {
    if (gameOver) return;
    var move = getBotMove();
    if (move === -1) return;
    board[move] = botMark;
    buildBoard();

    var win = checkWin();
    if (win) {
      highlightWin(win);
      scores[botMark]++;
      updateScores();
      setTimeout(function () { showWinOverlay(botMark); }, 320);
      gameOver = true;
    } else if (board.every(Boolean)) {
      scores.D++;
      updateScores();
      setTimeout(showDrawOverlay, 200);
      gameOver = true;
    } else {
      current = current === "X" ? "O" : "X";
      setUI(current);
    }
  }

  /* ── Pick best move (minimax) ─────────── */
  function getBotMove() {
    var bestScore = -Infinity;
    var bestMove  = -1;
    for (var i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = botMark;
        var score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) { bestScore = score; bestMove = i; }
      }
    }
    return bestMove;
  }

  /* ── Minimax ──────────────────────────── */
  function minimax(b, depth, isMax) {
    var human  = botMark === "O" ? "X" : "O";
    var winner = scanWinner(b);
    if (winner === botMark) return 10 - depth;
    if (winner === human)   return depth - 10;
    if (b.every(Boolean))   return 0;

    var best = isMax ? -Infinity : Infinity;
    for (var i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = isMax ? botMark : human;
        var score = minimax(b, depth + 1, !isMax);
        b[i] = null;
        best = isMax ? Math.max(best, score) : Math.min(best, score);
      }
    }
    return best;
  }

  /* ── Scan board for a winner ──────────── */
  function scanWinner(b) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var l = WIN_LINES[i];
      if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return b[l[0]];
    }
    return null;
  }

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
    return null;
  }

  /* ── Highlight winning cells ──────────── */
  function highlightWin(line) {
    var cells = boardEl.querySelectorAll(".cell");
    line.forEach(function (i) { cells[i].classList.add("win-cell"); });
  }

  /* ── Update turn UI + background ─────── */
  function setUI(player) {
    pillX.classList.toggle("active", player === "X");
    pillO.classList.toggle("active", player === "O");
    gameEl.className = player === "X" ? "turn-x" : "turn-o";
    statusEl.className = player === "X" ? "sx" : "so";
    var label = (vsBot && player === botMark) ? "Bot" : player;
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
    winText.className   = player === "X" ? "col-x" : "col-o";
    winText.textContent = "CONGRATULATIONS!";
    var label = (vsBot && player === botMark) ? "Bot" : "Player " + player;
    winSub.textContent  = label + " wins the round!";
    winBtn.className    = player === "X" ? "btn-x" : "btn-o";
    overlay.className   = "show " + (player === "X" ? "ov-x" : "ov-o");
    launchConfetti(player);
  }

  /* ── Draw overlay ─────────────────────── */
  function showDrawOverlay() {
    winText.className   = "col-d";
    winText.textContent = "IT'S A DRAW!";
    winSub.textContent  = "Nobody wins this round.";
    winBtn.className    = "btn-d";
    overlay.className   = "show ov-d";
  }

  /* ── Next round ───────────────────────── */
  function nextRound() {
    board    = Array(9).fill(null);
    current  = "X";
    gameOver = false;
    buildBoard();
    setUI("X");
    overlay.className = "";
    stopConfetti();
    if (vsBot && current === botMark) setTimeout(doBotMove, 480);
  }

  /* ── Reset all ────────────────────────── */
  function resetAll() {
    scores = { X: 0, O: 0, D: 0 };
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
    animFrame = requestAnimationFrame(animateConfetti);
  }

  function stopConfetti() {
    particles = [];
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ── Button wiring ────────────────────── */
  document.getElementById("btn-reset").addEventListener("click", resetAll);
  document.getElementById("btn-restart").addEventListener("click", nextRound);
  document.getElementById("win-btn").addEventListener("click", nextRound);

  /* ── Start → mode screen ──────────────── */
  startBtn.addEventListener("click", function () {
    startScreen.classList.add("hide-screen");
    setTimeout(function () {
      startScreen.style.display = "none";
      modeScreen.classList.add("show");
    }, 600);
  });

  document.getElementById("btn-2p").addEventListener("click", function () {
    vsBot = false;
    launchGame();
  });

  document.getElementById("btn-bot").addEventListener("click", function () {
    vsBot = true;
    launchGame();
  });

  /* ── Mode screen → game ───────────────── */
  function launchGame() {
    modeScreen.classList.remove("show");
    modeScreen.classList.add("hide");
    setTimeout(function () {
      modeScreen.style.display = "none";
      gameEl.classList.remove("hidden");
      gameEl.classList.add("show-game");
    }, 400);
  }

  /* ── Init ─────────────────────────────── */
  buildBoard();
  setUI("X");

})();
