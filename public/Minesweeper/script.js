const columns = ['A', 'B', 'C', 'D', 'E'];
let bomblist = [];
let attemptlist = [];
let gameOver = false;

const boardDiv = document.getElementById('board');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

//web audio setup
let audioCtx=null;

function getAudioContext(){
    if(!audioCtx){
        audioCtx = new(window.AudioContext ||window.webkitAudioContext)();
    }
    if(audioCtx.state==='suspended'){
        audioCtx.resume();
    }
    return audioCtx;
}
//safe tile sound
async function playSafeSound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // Create oscillator for the tick tone
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
 
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
 
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);           // High A note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05); // Quick drop
 
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); // Fast fade-out
 
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12); // Short tick duration
}
//bomb explosion sound
async function playBombSound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // --- Noise source (raw explosion texture) ---
    const bufferSize = ctx.sampleRate * 0.8; // 0.8 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Fill with white noise (-1 to 1)
    }
 
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
 
    // --- Lowpass filter (~400Hz) — makes the noise sound deep and boomy ---
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
 
    // --- Gain envelope — sharp attack, exponential decay (blast fade-out) ---
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1.5, ctx.currentTime);           // Peak volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); // Fade to silence
 
    // --- Wire up: noise → filter → gain → output ---
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
 
    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.8); // Match buffer length
}
//victory sound
async function playVictorySound() {
    const ctx = getAudioContext();
    await ctx.resume(); // Wait until context is truly running before scheduling
 
    // Three notes of an ascending major chord (C5, E5, G5)
    const notes = [523.25, 659.25, 783.99];
 
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
 
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
 
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
 
        // Stagger each note by 0.15s so they play as an arpeggio
        const startTime = ctx.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);  // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); // Slow decay
 
        osc.start(startTime);
        osc.stop(startTime + 0.6);
    });
}

// Generate 4 unique random bomb coordinates
function generateBombs() {
    bomblist = [];
    while (bomblist.length < 4) {
        let randomCol = columns[Math.floor(Math.random() * 5)];
        let randomRow = Math.floor(Math.random() * 5) + 1;
        let bombCoord = `${randomCol} ${randomRow}`;
        
        if (!bomblist.includes(bombCoord)) {
            bomblist.push(bombCoord);
        }
    }
}

// Find neighbors matching Python algorithm logic
function getNeighbours(coord) {
    let parts = coord.split(' ');
    let colIndex = columns.indexOf(parts[0]);
    let rowIndex = parseInt(parts[1]);

    let validCols = [colIndex - 1, colIndex + 1, colIndex].filter(c => c >= 0 && c < 5);
    let validRows = [rowIndex - 1, rowIndex + 1, rowIndex].filter(r => r >= 1 && r <= 5);

    let neighbours = [];
    for (let c of validCols) {
        for (let r of validRows) {
            neighbours.push(`${columns[c]} ${r}`);
        }
    }
    
    let selfIndex = neighbours.indexOf(coord);
    if (selfIndex !== -1) {
        neighbours.splice(selfIndex, 1);
    }
    picked.forEach((index) => {
      state.grid[index].mine = true;
    });
  }

  function calculateNumbers() {
    state.grid.forEach((cell) => {
      if (cell.mine) return;
      cell.adjacent = neighbors(cell).filter((item) => item.mine).length;
    });
  }

  function neighbors(cell) {
    const nearby = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) continue;
        const row = cell.row + rowOffset;
        const col = cell.col + colOffset;
        if (isInside(row, col)) nearby.push(state.grid[indexOf(row, col)]);
      }
    }
    return count;
}

// Handle square click interaction
function handleCellClick(coord) {
    if (gameOver || attemptlist.includes(coord)) return;

    let cellElement = document.getElementById(coord);
    cellElement.classList.add('revealed');

    if (bomblist.includes(coord)) {
        gameOver = true;
        playBombSound();
        messageDiv.innerText = 'YOU LOST :(';
        messageDiv.style.color = '#ff4d4d';
        revealAllBombs();
        restartBtn.style.display = 'inline-block';
    } else {
        attemptlist.push(coord);
        let count = getBombCount(coord);
        cellElement.innerText = count === 0 ? '' : count;
        
        if (attemptlist.length === 21) {
            gameOver = true;
            playVictorySound();
            messageDiv.innerText = 'YOU WIN!!!!';
            messageDiv.style.color = '#28a745';
            revealAllBombs();
            restartBtn.style.display = 'inline-block';
        }else {
            playSafeSound(); 
        }
    }

    floodReveal(cell);
    if (checkWin()) return;
    renderBoard();
    updateStatus();
  }

  // Breadth-first reveal opens connected empty cells and their numbered edge.
  function floodReveal(startCell) {
    const queue = [startCell];
    const seen = new Set();

    while (queue.length) {
      const cell = queue.shift();
      if (seen.has(cell.index) || cell.flagged || cell.revealed || cell.mine) continue;
      seen.add(cell.index);
      cell.revealed = true;
      cell.justRevealed = true;
      state.revealed += 1;

      if (cell.adjacent === 0) {
        neighbors(cell).forEach((neighbor) => {
          if (!neighbor.revealed && !neighbor.mine) queue.push(neighbor);
        });
      }
    }
  }

  function toggleFlag(index) {
    const cell = state.grid[index];
    if (!cell || state.gameOver || cell.revealed) return;
    startTimer();
    cell.flagged = !cell.flagged;
    state.flags += cell.flagged ? 1 : -1;
    renderBoard();
    updateStatus();
  }

  function loseGame() {
    state.gameOver = true;
    clearInterval(state.timerId);
    setControlsDisabled(true);
    state.grid.forEach((cell) => {
      if (cell.mine) cell.revealed = true;
    });
    renderBoard();
    updateStatus();
    gameCard.classList.add("game-lost");
    boardEl.classList.add("board-locked");
    messageEl.textContent = "Mine triggered. Study the field before the next sweep.";
    playTone(120, 0.12);
    setTimeout(() => playTone(90, 0.12), 120);

    state.lossModalTimer = setTimeout(() => {
      openModal("Game Over", "A mine was triggered. Reset the grid and make a cleaner sweep.", "lose", getLossStats());
      state.lossModalTimer = null;
    }, 2400);
  }

  function checkWin() {
    const safeCells = state.rows * state.cols - state.mines;
    if (state.revealed !== safeCells) return false;

    state.gameOver = true;
    clearInterval(state.timerId);
    state.grid.forEach((cell) => {
      if (cell.mine && !cell.flagged) {
        cell.flagged = true;
        state.flags += 1;
      }
    });
    saveBestScore();
    renderBoard();
    updateStatus();
    updateBestScore();
    messageEl.textContent = "Board cleared. Nicely done.";
    gameCard.classList.add("won");
    openModal("You Win", `Board cleared in ${formatTimer(state.seconds)}. Best time saved for ${state.difficulty} mode.`, "win");
    playTone(620, 0.1);
    setTimeout(() => playTone(880, 0.12), 100);
    return true;
  }

  function updateStatus() {
    mineCountEl.textContent = formatMineCount(state.mines - state.flags);
    timerEl.textContent = formatTimer(state.seconds);
  }

  function bestScoreKey() {
    return `minesweeper-best-${state.difficulty}`;
  }

  function updateBestScore() {
    const score = localStorage.getItem(bestScoreKey());
    bestScoreEl.textContent = score ? formatTimer(Number(score)) : "--";
  }

  function saveBestScore() {
    const key = bestScoreKey();
    const currentBest = Number(localStorage.getItem(key));
    if (!currentBest || state.seconds < currentBest) {
      localStorage.setItem(key, String(state.seconds));
    }
  }

  function playTone(frequency, duration) {
    if (!state.soundEnabled) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  }

  function getLossStats() {
    const correctFlags = state.grid.filter((cell) => cell.mine && cell.flagged).length;
    const safeCells = state.rows * state.cols - state.mines;
    return [
      ["Final time", formatTimer(state.seconds)],
      ["Mines cleared", `${correctFlags}/${state.mines}`],
      ["Safe tiles opened", `${state.revealed}/${safeCells}`],
    ];
  }

  function openModal(title, message, type, stats = []) {
    setControlsDisabled(false);
    modalTitleEl.textContent = title;
    modalMessageEl.innerHTML = buildModalMessage(message, stats);
    modalIconEl.innerHTML = type === "win" ? icon.win : icon.mine;
    modalEl.hidden = false;
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  function buildModalMessage(message, stats) {
    const statMarkup = stats.map(([label, value]) => (
      `<span class="modal-stat"><span>${label}</span><strong>${value}</strong></span>`
    )).join("");
    return `${message}${statMarkup ? `<span class="modal-stats">${statMarkup}</span>` : ""}`;
  }

  function setControlsDisabled(disabled) {
    restartButton.disabled = disabled;
    difficultyButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function restartWithAnimation() {
    gameCard.classList.add("restarting");
    setTimeout(() => gameCard.classList.remove("restarting"), 460);
    newGame();
  }

  function updateChromeIcons() {
    themeIconEl.innerHTML = document.body.classList.contains("light-mode") ? icon.sun : icon.moon;
    soundIconEl.innerHTML = state.soundEnabled ? icon.soundOn : icon.soundOff;
    document.querySelector(".restart-icon").innerHTML = icon.restart;
    document.querySelector("[data-guide-flag]").innerHTML = icon.flag;
    document.querySelector("[data-guide-mine]").innerHTML = icon.mine;
    document.querySelector("[data-guide-explosion]").innerHTML = icon.mine;
  }

  boardEl.addEventListener("click", (event) => {
    if (state.skipNextClick) {
      state.skipNextClick = false;
      return;
    }
    const cellEl = event.target.closest(".cell");
    if (!cellEl) return;
    revealCell(Number(cellEl.dataset.index));
  });

  boardEl.addEventListener("contextmenu", (event) => {
    const cellEl = event.target.closest(".cell");
    if (!cellEl) return;
    event.preventDefault();
    toggleFlag(Number(cellEl.dataset.index));
  });

  boardEl.addEventListener("pointerdown", (event) => {
    const cellEl = event.target.closest(".cell");
    if (!cellEl || event.pointerType === "mouse") return;
    state.longPressTimer = setTimeout(() => {
      toggleFlag(Number(cellEl.dataset.index));
      state.skipNextClick = true;
      state.longPressTimer = null;
    }, 480);
  });

  boardEl.addEventListener("pointerup", () => clearTimeout(state.longPressTimer));
  boardEl.addEventListener("pointerleave", () => clearTimeout(state.longPressTimer));

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      difficultyButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      newGame(button.dataset.difficulty);
    });
  });

  restartButton.addEventListener("click", restartWithAnimation);
  modalRestartButton.addEventListener("click", restartWithAnimation);
  modalEl.addEventListener("click", (event) => {
    if (event.target === modalEl) closeModal();
  });

  soundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem("minesweeper-sound", state.soundEnabled ? "on" : "off");
    updateChromeIcons();
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("minesweeper-theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateChromeIcons();
  });

  if (localStorage.getItem("minesweeper-theme") === "light") {
    document.body.classList.add("light-mode");
  }

  updateChromeIcons();
  newGame();
})();
