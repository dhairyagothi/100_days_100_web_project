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
  var statusEl = document.getElementById("statusText");
  var turnChip = document.getElementById("turnChip");
  var scoreX   = document.getElementById("scoreX");
  var scoreO   = document.getElementById("scoreO");
  var scoreD   = document.getElementById("scoreD");
  var overlay  = document.getElementById("winnerModal");
  var winText  = document.getElementById("winnerTitle");
  var winSub   = document.getElementById("winnerSubtitle");
  var winBtn   = document.getElementById("winnerNext");
  var canvas   = document.getElementById("confetti");
  var ctx      = canvas.getContext("2d");
  var startScreen = document.getElementById("startModal");
  var startBtn   = document.getElementById("startGameBtn");

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
    if (vsBot && current === botMark) setTimeout(doBotMove, 480);
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
    animFrame = requestAnimationFrame(animateConfetti);
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.4, p.tilt, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.d + 1;
      p.tilt += 0.05;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
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
  document.getElementById("resetAll").addEventListener("click", resetAll);
  document.getElementById("resetRound").addEventListener("click", nextRound);
  document.getElementById("winnerNext").addEventListener("click", nextRound);
  document.getElementById("winnerClose").addEventListener("click", nextRound);

  /* ── Start → mode screen ──────────────── */
  startBtn.addEventListener("click", function () {
    startScreen.classList.remove("show");
    startScreen.setAttribute("aria-hidden", "true");
    modeScreen.classList.add("show");
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
    }, 400);
  }

  /* ── Init ─────────────────────────────── */
  buildBoard();
  setUI("X");

})();