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
  var startBtn = document.getElementById("start-btn");

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
    }
  }

  /* ── Check winner ─────────────────────── */
  function checkWin() {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var l = WIN_LINES[i];
      if (board[l[0]] && board[l[0]] === board[l[1]] && board[l[0]] === board[l[2]]) {
        return l;
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
    statusEl.textContent = player ? player + "'s turn!" : "";
  }

  /* ── Update scoreboard ────────────────── */
  function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreD.textContent = scores.D;
  }

  /* ── Win overlay ──────────────────────── */
  function showWinOverlay(player) {
    winText.className  = player === "X" ? "col-x" : "col-o";
    winText.textContent = "CONGRATULATIONS!";
    winSub.textContent  = "Player " + player + " wins the round!";
    winBtn.className   = player === "X" ? "btn-x" : "btn-o";
    overlay.className  = "show " + (player === "X" ? "ov-x" : "ov-o");
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
  }

  /* ── Reset all ────────────────────────── */
  function resetAll() {
    scores = { X: 0, O: 0, D: 0 };
    updateScores();
    nextRound();
  }

  /* ── Confetti: player-colored ─────────── */
  function launchConfetti(player) {
    var g = document.getElementById("game");
    canvas.width  = g.offsetWidth;
    canvas.height = g.offsetHeight;
    particles = [];

    var xCols = ["#e05c00","#ff8833","#ffcc99","#ffffff","#ffaa55","#cc4400","#ff6600"];
    var oCols = ["#0077cc","#55aaff","#99ccff","#ffffff","#003d7a","#33aaee","#0055aa"];
    var cols  = player === "X" ? xCols : oCols;

    for (var i = 0; i < 120; i++) {
      particles.push({
        x:     canvas.width  * (0.15 + Math.random() * 0.7),
        y:     canvas.height * (0.05 + Math.random() * 0.35),
        vx:    (Math.random() - 0.5) * 5.5,
        vy:    (Math.random() - 0.5) * 5.5,
        r:     Math.random() * 5 + 2,
        color: cols[Math.floor(Math.random() * cols.length)],
        life:  1,
        decay: Math.random() * 0.013 + 0.007
      });
    }

    if (animFrame) cancelAnimationFrame(animFrame);
    animateConfetti();
  }

  function animateConfetti() {
    if (!particles.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(function (p) { return p.life > 0; });
    particles.forEach(function (p) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.07;
      p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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

  /* ── Init ─────────────────────────────── */
  startBtn.addEventListener("click", function () {
    startScreen.classList.add("hide-screen");

    setTimeout(function () {
       startScreen.style.display = "none";
       gameEl.classList.remove("hidden");
      gameEl.classList.add("show-game");
    }, 600);
  });
  buildBoard();
  setUI("X");

})();
