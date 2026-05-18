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
  /* Sound */

  var muted = false;

  var audioCtx =
  new (
  window.AudioContext ||
  window.webkitAudioContext
  )();

  var muteBtn =
  document.getElementById(
  "mute-btn"
  );

  /* Custom player names */
  var playerNames = {
  X: "Player X",
  O: "Player O"
  };

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
  var winningLine =
  document.getElementById(
  "winning-line"
  );
  
  var saveNamesBtn =
  document.getElementById(
  "save-names"
  );

  var playerXInput =
  document.getElementById(
  "player-x-name"
  );

  var playerOInput =
  document.getElementById(
  "player-o-name"
  );

  var labelX =
  document.getElementById(
  "label-x"
  );

  var labelO =
  document.getElementById(
  "label-o"
  );

  /* ── Save custom names ───────────────── */
  saveNamesBtn.addEventListener("click",function(){
  playerNames.X = playerXInput.value.trim() || playerNames.X;
  playerNames.O = playerOInput.value.trim() || playerNames.O;

  /* Update turn text immediately */
  statusEl.textContent = playerNames[current] + "'s turn!";

  /* Update scoreboard labels */
  labelX.textContent = playerNames.X + " Wins";
  labelO.textContent = playerNames.O + " Wins";
  }
);


  /* ── Play sound ───────────────── */
  function playSound(type){
    if(muted) return;
    var osc =
    audioCtx.createOscillator();
    var gain =
    audioCtx.createGain();
    osc.connect(gain);
    gain.connect(
    audioCtx.destination
  );

  /* Different sounds */
  if(type==="click"){
  osc.frequency.value =350;
  gain.gain.value =0.05;
  }

  if(type==="win"){
  osc.frequency.value =700;
  gain.gain.value =0.08;
  }
  
  if(type==="draw"){
  osc.frequency.value =200;
  gain.gain.value =0.06;
  }

  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
  }

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
    playSound("click");
    buildBoard();

    var win = checkWin();
    if (win) {
      highlightWin(win);
      playSound("win");
      drawWinningLine(win);
      scores[current]++;
      updateScores();
      gameOver = true;

    /* Show winning line briefly */
      setTimeout(function(){
      winningLine.style.display = "none";
      winningLine.style.transform ="none";

    /* Remove green highlighted cells too */
      var cells = boardEl.querySelectorAll(".cell");
      cells.forEach(function(cell){
      cell.classList.remove("win-cell");
    });

    /* NOW show popup */
      showWinOverlay(current);
    },800);

    } else if (board.every(Boolean)) {
      scores.D++;
      playSound("draw");
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

/* ── Draw winning line ───────────────── */
  function drawWinningLine(line){
  winningLine.style.display = "block";

  /* Rows */
  if(line.toString()==="0,1,2"){
  winningLine.style.width="100%";
  winningLine.style.height="6px";
  winningLine.style.top="16%";
  winningLine.style.left="0";
  winningLine.style.transform="none";
  }

  else if(line.toString()==="3,4,5"){
  winningLine.style.width="100%";
  winningLine.style.height="6px";
  winningLine.style.top="50%";
  winningLine.style.left="0";
  winningLine.style.transform="none";
  }

  else if(line.toString()==="6,7,8"){
  winningLine.style.width="100%";
  winningLine.style.height="6px";
  winningLine.style.top="84%";
  winningLine.style.left="0";
  winningLine.style.transform="none";
  }

  /* Columns */
  else if(line.toString()==="0,3,6"){
  winningLine.style.width="6px";
  winningLine.style.height="100%";
  winningLine.style.left="16%";
  winningLine.style.top="0";
  }
  else if(line.toString()==="1,4,7"){
  winningLine.style.width="6px";
  winningLine.style.height="100%";
  winningLine.style.left="50%";
  winningLine.style.top="0";
  }

  else if(line.toString()==="2,5,8"){
  winningLine.style.width="6px";
  winningLine.style.height="100%";
  winningLine.style.left="84%";
  winningLine.style.top="0";
  }

  /* Diagonal */
  else if(line.toString()==="0,4,8"){
  winningLine.style.width="140%";
  winningLine.style.height="6px";
  winningLine.style.left="-20%";
  winningLine.style.top="50%";
  winningLine.style.transform="rotate(45deg)";
  }

  else if(line.toString()==="2,4,6"){
  winningLine.style.width="140%";
  winningLine.style.height="6px";
  winningLine.style.left="-20%";
  winningLine.style.top="50%";
  winningLine.style.transform="rotate(-45deg)";}
  }

  /* Sound toggle */
  muteBtn.addEventListener("click",function(){
  muted = !muted;
  if(muted){
    muteBtn.innerText = "🔇 Sound OFF";
    muteBtn.classList.add("muted");
  }

  else{
    muteBtn.innerText ="🔊 Sound ON";
    muteBtn.classList.remove("muted");
  }
});

  /* ── Update turn UI + background ─────── */
  function setUI(player) {
    pillX.classList.toggle("active", player === "X");
    pillO.classList.toggle("active", player === "O");
    gameEl.className = player === "X" ? "turn-x" : "turn-o";
    statusEl.className = player === "X" ? "sx" : "so";
    statusEl.textContent = playerNames[player] + "'s turn!";
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
    winSub.textContent  = playerNames[player] + " wins the round!";
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
    winningLine.style.display="none";
    winningLine.style.transform="none";
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
  buildBoard();
  setUI("X");

})();
