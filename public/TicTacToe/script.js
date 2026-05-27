(function () {
  "use strict";

  var WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  var board = Array(9).fill("");
  var currentPlayer = "X";
  var gameOver = false;
  var scores = { X: 0, O: 0, D: 0 };
  var moveHistory = [];
  var turnSeconds = 0;
  var timerId = null;

  var boardEl = document.getElementById("board");
  var statusText = document.getElementById("statusText");
  var turnChip = document.getElementById("turnChip");
  var turnTimer = document.getElementById("turnTimer");
  var modeSelect = document.getElementById("modeSelect");
  var themeSelect = document.getElementById("themeSelect");
  var hintBtn = document.getElementById("hintBtn");
  var undoBtn = document.getElementById("undoBtn");
  var newRoundBtn = document.getElementById("newRoundBtn");
  var resetAllBtn = document.getElementById("resetAllBtn");
  var historyList = document.getElementById("historyList");
  var scoreX = document.getElementById("scoreX");
  var scoreO = document.getElementById("scoreO");
  var scoreD = document.getElementById("scoreD");
  var startModal = document.getElementById("startModal");
  var startGameBtn = document.getElementById("startGameBtn");
  var winnerModal = document.getElementById("winnerModal");
  var winnerBadge = document.getElementById("winnerBadge");
  var winnerTitle = document.getElementById("winnerTitle");
  var winnerSubtitle = document.getElementById("winnerSubtitle");
  var winnerNext = document.getElementById("winnerNext");
  var winnerClose = document.getElementById("winnerClose");
  var confetti = document.getElementById("confetti");
  var confettiCtx = confetti ? confetti.getContext("2d") : null;
  var confettiFrame = null;
  var particles = [];

  function renderBoard() {
    boardEl.innerHTML = "";

    board.forEach(function (mark, index) {
      var cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.setAttribute("aria-label", "Cell " + (index + 1));

      if (mark) {
        cell.textContent = mark;
        cell.classList.add("taken", mark === "X" ? "mark-x" : "mark-o");
      }

      cell.disabled = Boolean(mark) || gameOver || isCpuTurn();
      cell.addEventListener("click", function () {
        playMove(index);
      });

      boardEl.appendChild(cell);
    });
  }

  function playMove(index) {
    if (gameOver || board[index] || isCpuTurn()) {
      return;
    }

    placeMove(index, currentPlayer);
  }

  function placeMove(index, mark) {
    board[index] = mark;
    moveHistory.push({ index: index, mark: mark });
    clearHints();

    var winningLine = getWinningLine();

    if (winningLine) {
      gameOver = true;
      scores[mark] += 1;
      updateScores();
      renderBoard();
      highlightWinningCells(winningLine);
      stopTimer();
      showWinner(mark);
      launchConfetti(mark);
      return;
    }

    if (board.every(Boolean)) {
      gameOver = true;
      scores.D += 1;
      updateScores();
      renderBoard();
      stopTimer();
      showDraw();
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
    updateHistory();
    renderBoard();

    if (isCpuTurn()) {
      boardEl.classList.add("thinking");
      window.setTimeout(function () {
        boardEl.classList.remove("thinking");
        placeMove(getCpuMove(), "O");
      }, 450);
    }
  }

  function isCpuTurn() {
    return modeSelect.value !== "pvp" && currentPlayer === "O" && !gameOver;
  }

  function getCpuMove() {
    var available = getAvailableMoves();
    var mode = modeSelect.value;

    if (mode === "cpu-easy") {
      return randomMove(available);
    }

    if (mode === "cpu-medium" && Math.random() < 0.4) {
      return randomMove(available);
    }

    return getBestMove("O") ?? randomMove(available);
  }

  function getBestMove(mark) {
    var opponent = mark === "X" ? "O" : "X";
    var available = getAvailableMoves();

    for (var i = 0; i < available.length; i += 1) {
      if (wouldWin(available[i], mark)) {
        return available[i];
      }
    }

    for (var j = 0; j < available.length; j += 1) {
      if (wouldWin(available[j], opponent)) {
        return available[j];
      }
    }

    if (!board[4]) {
      return 4;
    }

    var corners = [0, 2, 6, 8].filter(function (index) {
      return !board[index];
    });

    return corners.length ? randomMove(corners) : randomMove(available);
  }

  function wouldWin(index, mark) {
    board[index] = mark;
    var result = Boolean(getWinningLine());
    board[index] = "";
    return result;
  }

  function randomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function getAvailableMoves() {
    return board
      .map(function (mark, index) {
        return mark ? null : index;
      })
      .filter(function (index) {
        return index !== null;
      });
  }

  function getWinningLine() {
    return WIN_LINES.find(function (line) {
      return board[line[0]]
        && board[line[0]] === board[line[1]]
        && board[line[1]] === board[line[2]];
    });
  }

  function highlightWinningCells(line) {
    var cells = boardEl.querySelectorAll(".cell");

    line.forEach(function (index) {
      cells[index].classList.add("win-cell");
    });
  }

  function showWinner(mark) {
    winnerBadge.textContent = "Winner";
    winnerTitle.textContent = "Player " + mark + " wins!";
    winnerSubtitle.textContent = "Great moves. Ready for the next round?";
    winnerModal.classList.add("show");
    winnerModal.setAttribute("aria-hidden", "false");
  }

  function showDraw() {
    winnerBadge.textContent = "Draw";
    winnerTitle.textContent = "It's a draw!";
    winnerSubtitle.textContent = "Nobody wins this round. Try again?";
    winnerModal.classList.add("show");
    winnerModal.setAttribute("aria-hidden", "false");
  }

  function closeWinnerModal() {
    winnerModal.classList.remove("show");
    winnerModal.setAttribute("aria-hidden", "true");
    stopConfetti();
  }

  function startRound() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameOver = false;
    moveHistory = [];
    closeWinnerModal();
    clearHints();
    updateStatus();
    updateHistory();
    renderBoard();
    restartTimer();
  }

  function resetScores() {
    scores = { X: 0, O: 0, D: 0 };
    updateScores();
    startRound();
  }

  function updateStatus() {
    var playerLabel = modeSelect.value !== "pvp" && currentPlayer === "O"
      ? "CPU"
      : "Player " + currentPlayer;

    statusText.textContent = playerLabel + "'s turn";
    turnChip.textContent = "Turn: " + currentPlayer;
    turnChip.classList.toggle("turn-x", currentPlayer === "X");
    turnChip.classList.toggle("turn-o", currentPlayer === "O");
  }

  function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreD.textContent = scores.D;
  }

  function updateHistory() {
    historyList.innerHTML = "";

    var visibleMoves = moveHistory.slice(-10);

    for (var i = 0; i < 10; i += 1) {
      var move = visibleMoves[i];
      var item = document.createElement("li");

      if (move) {
        item.textContent = move.mark + " played cell " + (move.index + 1);
      } else {
        item.className = "history-empty";
        item.textContent = "Waiting for move";
      }

      historyList.appendChild(item);
    }
  }

  function restartTimer() {
    stopTimer();
    turnSeconds = 0;
    updateTimer();
    timerId = window.setInterval(function () {
      turnSeconds += 1;
      updateTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimer() {
    turnTimer.textContent = "Time: " + turnSeconds + "s";
  }

  function showHint() {
    if (gameOver || isCpuTurn()) {
      return;
    }

    clearHints();

    var hint = getBestMove(currentPlayer);
    if (hint === undefined || hint === null) {
      return;
    }

    var cells = boardEl.querySelectorAll(".cell");
    cells[hint].classList.add("hint-cell");
  }

  function clearHints() {
    boardEl.querySelectorAll(".hint-cell").forEach(function (cell) {
      cell.classList.remove("hint-cell");
    });
  }

  function undoMove() {
    if (gameOver || isCpuTurn() || !moveHistory.length) {
      return;
    }

    var undoCount = modeSelect.value === "pvp" ? 1 : Math.min(2, moveHistory.length);

    for (var i = 0; i < undoCount; i += 1) {
      var move = moveHistory.pop();
      board[move.index] = "";
    }

    currentPlayer = moveHistory.length % 2 === 0 ? "X" : "O";
    updateStatus();
    updateHistory();
    renderBoard();
  }

  function applyTheme() {
    document.body.dataset.theme = themeSelect.value;
  }

  function launchConfetti(mark) {
    if (!confettiCtx) {
      return;
    }

    confetti.width = window.innerWidth;
    confetti.height = window.innerHeight;
    particles = Array.from({ length: 90 }, function () {
      return {
        x: Math.random() * confetti.width,
        y: Math.random() * -confetti.height,
        size: Math.random() * 6 + 4,
        speed: Math.random() * 3 + 2,
        color: mark === "X" ? "#ff7d7d" : "#40f5d2"
      };
    });

    animateConfetti();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confetti.width, confetti.height);

    particles.forEach(function (particle) {
      confettiCtx.fillStyle = particle.color;
      confettiCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      particle.y += particle.speed;

      if (particle.y > confetti.height) {
        particle.y = -particle.size;
        particle.x = Math.random() * confetti.width;
      }
    });

    confettiFrame = window.requestAnimationFrame(animateConfetti);
  }

  function stopConfetti() {
    if (confettiFrame) {
      window.cancelAnimationFrame(confettiFrame);
      confettiFrame = null;
    }

    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, confetti.width, confetti.height);
    }
  }

  startGameBtn.addEventListener("click", function () {
    startModal.classList.remove("show");
    startModal.setAttribute("aria-hidden", "true");
    startRound();
  });

  winnerNext.addEventListener("click", startRound);
  winnerClose.addEventListener("click", closeWinnerModal);
  newRoundBtn.addEventListener("click", startRound);
  resetAllBtn.addEventListener("click", resetScores);
  hintBtn.addEventListener("click", showHint);
  undoBtn.addEventListener("click", undoMove);
  modeSelect.addEventListener("change", startRound);
  themeSelect.addEventListener("change", applyTheme);

  applyTheme();
  updateScores();
  updateStatus();
  renderBoard();
  updateHistory();
})();
