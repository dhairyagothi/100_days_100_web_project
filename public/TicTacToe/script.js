 (function () {
    "use strict";

    var WIN_LINES = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    var CELL_LABELS = [
      "top-left", "top-middle", "top-right",
      "middle-left", "center", "middle-right",
      "bottom-left", "bottom-middle", "bottom-right"
    ];

    var board = Array(9).fill(null);
    var currentPlayer = "X";
    var gameOver = false;
    var sessionStarted = false;
    var scores = { X: 0, O: 0, D: 0 };
    var moveLog = [];
    var stateStack = [];
    var roundStartedAt = null;
    var elapsedTimer = null;
    var botTimer = null;
    var lastMovePlayer = null;

    var boardEl = document.getElementById("board");
    var gameEl = document.getElementById("game");
    var statusEl = document.getElementById("statusText");
    var turnChip = document.getElementById("turnChip");
    var timerChip = document.getElementById("turnTimer");
    var scoreX = document.getElementById("scoreX");
    var scoreO = document.getElementById("scoreO");
    var scoreD = document.getElementById("scoreD");
    var historyList = document.getElementById("historyList");
    var overlay = document.getElementById("winnerModal");
    var winText = document.getElementById("winnerTitle");
    var winSub = document.getElementById("winnerSubtitle");
    var startModal = document.getElementById("startModal");
    var startBtn = document.getElementById("startGameBtn");
    var modeSelect = document.getElementById("modeSelect");
    var themeSelect = document.getElementById("themeSelect");
    var hintBtn = document.getElementById("hintBtn");
    var undoBtn = document.getElementById("undoBtn");
    var newRoundBtn = document.getElementById("newRoundBtn");
    var resetAllBtn = document.getElementById("resetAllBtn");
    var nextRoundBtn = document.getElementById("winnerNext");
    var closeBtn = document.getElementById("winnerClose");

    var gameMode = modeSelect.value;
    var botMark = "O";
    var humanMark = "X";

    function cloneBoard(value) {
      return value.slice();
    }

    function cloneLog(value) {
      return value.map(function (entry) {
        return { player: entry.player, index: entry.index };
      });
    }

    function saveState() {
      stateStack.push({
        board: cloneBoard(board),
        currentPlayer: currentPlayer,
        gameOver: gameOver,
        moveLog: cloneLog(moveLog),
        lastMovePlayer: lastMovePlayer,
        sessionStarted: sessionStarted
      });
    }

    function clearPendingBotMove() {
      if (botTimer) {
        clearTimeout(botTimer);
        botTimer = null;
      }
      boardEl.classList.remove("thinking");
    }

    function startTimer() {
      roundStartedAt = Date.now();
      updateTimer();
      if (elapsedTimer) clearInterval(elapsedTimer);
      elapsedTimer = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
      if (elapsedTimer) {
        clearInterval(elapsedTimer);
        elapsedTimer = null;
      }
    }

    function updateTimer() {
      var elapsed = roundStartedAt ? Math.floor((Date.now() - roundStartedAt) / 1000) : 0;
      timerChip.textContent = "Time: " + elapsed + "s";
    }

    function applyTheme() {
      document.body.setAttribute("data-theme", themeSelect.value);
    }

    function setMode() {
      gameMode = modeSelect.value;
      botMark = "O";
      humanMark = "X";
    }

    function isBotTurn() {
      return gameMode !== "pvp" && currentPlayer === botMark;
    }

    function winnerLabel(mark) {
      return gameMode !== "pvp" && mark === botMark ? "Bot" : "Player " + mark;
    }

    function updateScores() {
      scoreX.textContent = scores.X;
      scoreO.textContent = scores.O;
      scoreD.textContent = scores.D;
    }

    function updateStatus() {
      if (!sessionStarted) {
        statusEl.textContent = "Ready to play";
        turnChip.textContent = "Turn: X";
        return;
      }

      if (gameOver) {
        statusEl.textContent = "Round complete";
        return;
      }

      if (isBotTurn()) {
        statusEl.textContent = "Bot is thinking";
        turnChip.textContent = "Turn: Bot";
      } else {
        statusEl.textContent = "Player " + currentPlayer + "'s turn";
        turnChip.textContent = "Turn: " + currentPlayer;
      }
    }

    function updateHistory() {
      historyList.innerHTML = "";
      moveLog.slice(-10).forEach(function (entry, index) {
        var item = document.createElement("li");
        item.textContent = (moveLog.length - Math.min(10, moveLog.length) + index + 1) + ". " + entry.player + " on " + CELL_LABELS[entry.index];
        historyList.appendChild(item);
      });
    }

    function renderBoard() {
      boardEl.innerHTML = "";

      board.forEach(function (value, index) {
        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";

        if (value) {
          cell.classList.add("taken", value === "X" ? "x-mark" : "o-mark");
          cell.textContent = value;
          cell.disabled = true;
        } else {
          cell.setAttribute("aria-label", "Empty cell, " + CELL_LABELS[index]);
        }

        cell.addEventListener("click", function () {
          handleCellClick(index);
        });

        boardEl.appendChild(cell);
      });
    }

    function checkWinner(valueBoard) {
      var lines = WIN_LINES;
      var selectedBoard = valueBoard || board;

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var a = selectedBoard[line[0]];
        var b = selectedBoard[line[1]];
        var c = selectedBoard[line[2]];

        if (a && a === b && a === c) {
          return { mark: a, line: line };
        }
      }

      return null;
    }

    function highlightWin(line) {
      var cells = boardEl.querySelectorAll(".cell");
      line.forEach(function (index) {
        if (cells[index]) {
          cells[index].classList.add("win-cell");
        }
      });
    }

    function showResult(mark) {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
      winText.textContent = winnerLabel(mark) + " wins!";
      winSub.textContent = "Great moves. Ready for the next round?";
    }

    function showDrawResult() {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
      winText.textContent = "It's a draw!";
      winSub.textContent = "Nobody wins this round.";
    }

    function hideResultModal() {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
    }

    function endRound(result) {
      gameOver = true;
      stopTimer();
      clearPendingBotMove();
      renderBoard();

      if (result.mark) {
        scores[result.mark] += 1;
        updateScores();
        highlightWin(result.line);
        setTimeout(function () {
          showResult(result.mark);
        }, 200);
      } else {
        scores.D += 1;
        updateScores();
        setTimeout(function () {
          showDrawResult();
        }, 200);
      }

      updateStatus();
    }

    function pushMove(player, index) {
      saveState();
      board[index] = player;
      moveLog.push({ player: player, index: index });
      lastMovePlayer = player;
      renderBoard();
      updateHistory();

      var result = checkWinner(board);
      if (result) {
        endRound(result);
        return;
      }

      if (board.every(function (cell) { return cell !== null; })) {
        endRound({ mark: null, line: null });
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();

      if (isBotTurn()) {
        scheduleBotMove();
      }
    }

    function handleCellClick(index) {
      if (!sessionStarted || gameOver || board[index]) return;
      if (isBotTurn()) return;
      pushMove(currentPlayer, index);
    }

    function availableMoves(valueBoard) {
      var selectedBoard = valueBoard || board;
      var moves = [];

      selectedBoard.forEach(function (cell, index) {
        if (!cell) moves.push(index);
      });

      return moves;
    }

    function bestMoveFor(mark, valueBoard) {
      var selectedBoard = valueBoard ? cloneBoard(valueBoard) : cloneBoard(board);
      var opponent = mark === "X" ? "O" : "X";
      var bestScore = mark === "O" ? -Infinity : Infinity;
      var move = -1;

      availableMoves(selectedBoard).forEach(function (index) {
        selectedBoard[index] = mark;
        var score = minimax(selectedBoard, 0, false, mark, opponent);
        selectedBoard[index] = null;

// sourcery skip: merge-else-if
        if (mark === "O") {
          if (score > bestScore) {
            bestScore = score;
            move = index;
          }
        } else {
          if (score < bestScore) {
            bestScore = score;
            move = index;
          }
        }
      });

      return move;
    }

    function minimax(valueBoard, depth, isBotMaximizing, botPlayer, humanPlayer) {
      var result = checkWinner(valueBoard);
      if (result) {
        if (result.mark === botPlayer) return 10 - depth;
        if (result.mark === humanPlayer) return depth - 10;
      }

      if (valueBoard.every(function (cell) { return cell !== null; })) {
        return 0;
      }

      if (isBotMaximizing) {
        var best = -Infinity;
        availableMoves(valueBoard).forEach(function (index) {
          valueBoard[index] = botPlayer;
          best = Math.max(best, minimax(valueBoard, depth + 1, false, botPlayer, humanPlayer));
          valueBoard[index] = null;
        });
        return best;
      }

      var worst = Infinity;
      availableMoves(valueBoard).forEach(function (index) {
        valueBoard[index] = humanPlayer;
        worst = Math.min(worst, minimax(valueBoard, depth + 1, true, botPlayer, humanPlayer));
        valueBoard[index] = null;
      });
      return worst;
    }

    function openMovesFor(mark) {
      var moves = availableMoves();
      if (!moves.length) return -1;

      var winningMove = -1;
      for (var i = 0; i < moves.length; i++) {
        var index = moves[i];
        board[index] = mark;
        if (checkWinner(board)) {
          winningMove = index;
          board[index] = null;
          break;
        }
        board[index] = null;
      }
      return winningMove;
    }

    function chooseBotMove() {
      var empty = availableMoves();
      if (!empty.length) return -1;

      var mode = gameMode;
      var move;

      if (mode === "cpu-easy") {
        move = empty[Math.floor(Math.random() * empty.length)];
      } else if (mode === "cpu-medium") {
        move = openMovesFor(botMark);
        if (move === -1) {
          move = openMovesFor(humanMark);
        }
        if (move === -1 || Math.random() < 0.35) {
          move = empty[Math.floor(Math.random() * empty.length)];
        }
      } else {
        move = openMovesFor(botMark);
        if (move === -1) {
          move = openMovesFor(humanMark);
        }
        if (move === -1) {
          move = bestMoveFor(botMark);
        }
      }

      return move;
    }

    function scheduleBotMove() {
      clearPendingBotMove();
      if (!sessionStarted || gameOver || !isBotTurn()) return;

      boardEl.classList.add("thinking");
      botTimer = setTimeout(function () {
        boardEl.classList.remove("thinking");
        botTimer = null;
        if (!gameOver && isBotTurn()) {
          var move = chooseBotMove();
          if (move !== -1) {
            pushMove(botMark, move);
          }
        }
      }, 420);
    }

    function beginRound() {
      clearPendingBotMove();
      board = Array(9).fill(null);
      currentPlayer = "X";
      gameOver = false;
      moveLog = [];
      stateStack = [];
      lastMovePlayer = null;
      roundStartedAt = Date.now();
      sessionStarted = true;

      hideResultModal();
      renderBoard();
      updateHistory();
      updateStatus();
      startTimer();

      if (isBotTurn()) {
        scheduleBotMove();
      }
    }

    function undoMove() {
      clearPendingBotMove();

      var steps = gameMode !== "pvp" && lastMovePlayer === botMark && stateStack.length >= 2 ? 2 : 1;
      if (!stateStack.length) return;

      while (steps > 0 && stateStack.length) {
        var snapshot = stateStack.pop();
        board = cloneBoard(snapshot.board);
        currentPlayer = snapshot.currentPlayer;
        gameOver = snapshot.gameOver;
        moveLog = cloneLog(snapshot.moveLog);
        lastMovePlayer = snapshot.lastMovePlayer;
        sessionStarted = snapshot.sessionStarted;
        steps -= 1;
      }

      hideResultModal();
      renderBoard();
      updateHistory();
      updateStatus();

      if (!gameOver) {
        startTimer();
        if (isBotTurn()) {
          scheduleBotMove();
        }
      }
    }

    function resetScores() {
      scores = { X: 0, O: 0, D: 0 };
      updateScores();
      beginRound();
    }

    function showHint() {
      if (!sessionStarted || gameOver) return;

      var cells = boardEl.querySelectorAll(".cell");
      cells.forEach(function (cell) {
        cell.classList.remove("hint-cell");
      });

      var hintIndex = gameMode === "pvp" ? bestMoveFor(currentPlayer) : chooseBotMove();
      if (hintIndex < 0) return;

      cells[hintIndex].classList.add("hint-cell");
      window.setTimeout(function () {
        if (cells[hintIndex]) {
          cells[hintIndex].classList.remove("hint-cell");
        }
      }, 1200);
    }

    function bindEvents() {
      startBtn.addEventListener("click", function () {
        startModal.classList.remove("show");
        startModal.setAttribute("aria-hidden", "true");
        beginRound();
      });

      modeSelect.addEventListener("change", function () {
        setMode();
        if (sessionStarted && !gameOver) {
          updateStatus();
          if (isBotTurn()) {
            scheduleBotMove();
          } else {
            clearPendingBotMove();
            boardEl.classList.remove("thinking");
          }
        }
      });

      themeSelect.addEventListener("change", applyTheme);

      hintBtn.addEventListener("click", showHint);
      undoBtn.addEventListener("click", undoMove);
      newRoundBtn.addEventListener("click", beginRound);
      resetAllBtn.addEventListener("click", resetScores);
      nextRoundBtn.addEventListener("click", function () {
        hideResultModal();
        beginRound();
      });
      closeBtn.addEventListener("click", function () {
        hideResultModal();
      });

      window.addEventListener("resize", function () {
        updateTimer();
      });
    }

    function init() {
      applyTheme();
      setMode();
      updateScores();
      renderBoard();
      updateHistory();
      updateStatus();
      updateTimer();
      bindEvents();
    }

    init();
  }());