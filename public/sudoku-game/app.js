/**
 * Sudoku Main Controller - Clean Minimalist Version
 * Handles UI interactions, state, sounds, and logical hints for 9x9 Sudoku.
 */
(function() {
  'use strict';

  // Game state (9x9 Grid = 81 cells)
  const state = {
    difficulty: 'easy',
    isPlaying: false,
    isPaused: false,
    board: Array(81).fill(0),
    startBoard: Array(81).fill(0),
    solution: Array(81).fill(0),
    notes: Array.from({ length: 81 }, () => []),
    history: [], // Stack of { board, notes, mistakes }
    historyIndex: -1,
    mistakes: 0,
    maxMistakes: 3,
    mistakeChecking: true,
    activeCellIdx: -1,
    isPencilMode: false,
    elapsedTime: 0,
    timerInterval: null,
  };

  // Web Audio Context setup for synthesizers
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Settings
  const settings = {
    soundEnabled: true,
    animationsEnabled: true,
  };

  // Sound Synthesizers using Web Audio API
  const SoundFX = {
    playTone(freq, type, duration, volume = 0.08) {
      if (!settings.soundEnabled) return;
      initAudio();
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn("Audio failed to play", e);
      }
    },

    playNoise(duration, volume = 0.03, frequency = 1000, Q = 2.0) {
      if (!settings.soundEnabled) return;
      initAudio();
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        filter.Q.setValueAtTime(Q, audioCtx.currentTime);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noiseNode.start();
        noiseNode.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn("Audio noise failed to play", e);
      }
    },

    playClick() {
      this.playTone(600, 'sine', 0.05, 0.05);
    },

    playPencil() {
      this.playNoise(0.08, 0.04, 1200, 3.0);
    },

    playErase() {
      this.playNoise(0.15, 0.05, 500, 1.0);
    },

    playPageFlip() {
      this.playNoise(0.25, 0.03, 300, 0.5);
    },

    playError() {
      this.playTone(180, 'sawtooth', 0.2, 0.08);
      setTimeout(() => this.playTone(150, 'sawtooth', 0.25, 0.08), 80);
    },

    playWinChime() {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.6, 0.06);
        }, idx * 100);
      });
    }
  };

  // DOM Elements
  let el = {};

  function cacheElements() {
    el = {
      grid: document.getElementById('sudoku-grid'),
      timer: document.getElementById('game-timer'),
      bestTime: document.getElementById('best-time'),
      mistakes: document.getElementById('mistakes-count'),
      maxMistakes: document.getElementById('max-mistakes'),
      difficultySelect: document.getElementById('difficulty-select'),
      difficultyDisplay: document.getElementById('difficulty-display'),
      pencilBtn: document.getElementById('pencil-btn'),
      eraserBtn: document.getElementById('eraser-btn'),
      hintBtn: document.getElementById('hint-btn'),
      checkBtn: document.getElementById('check-btn'),
      undoBtn: document.getElementById('undo-btn'),
      redoBtn: document.getElementById('redo-btn'),
      pauseBtn: document.getElementById('pause-btn'),
      restartBtn: document.getElementById('restart-btn'),
      newGameBtn: document.getElementById('new-game-btn'),
      mistakeToggle: document.getElementById('mistake-checking-toggle'),
      soundToggle: document.getElementById('sound-toggle'),
      animToggle: document.getElementById('anim-toggle'),
      keypad: document.getElementById('keypad'),
      
      modalOverlay: document.getElementById('modal-overlay'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close'),
      
      celebrationOverlay: document.getElementById('celebration-overlay'),
      celebrationMessage: document.getElementById('celebration-message'),
      celebrationClose: document.getElementById('celebration-close'),
      celebrationCanvas: document.getElementById('celebration-canvas'),
    };
  }

  // Load / Initialize Settings & State
  function loadSettings() {
    const saved = localStorage.getItem('sudoku_settings_v2');
    if (saved) {
      try {
        Object.assign(settings, JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load settings", e);
      }
    }
    if (el.soundToggle) el.soundToggle.checked = settings.soundEnabled;
    if (el.animToggle) el.animToggle.checked = settings.animationsEnabled;
  }

  function saveSettings() {
    localStorage.setItem('sudoku_settings_v2', JSON.stringify(settings));
  }

  // Initialize page bindings
  window.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadSettings();
    initGrid();
    setupEventHandlers();
    checkAutosave();
  });

  // Render blank Grid cells for 9x9
  function initGrid() {
    el.grid.innerHTML = '';
    for (let i = 0; i < 81; i++) {
      const cell = document.createElement('div');
      cell.classList.add('sudoku-cell');
      cell.dataset.index = i;

      // Draw subgrid boundaries for 9x9 (3x3 subgrids)
      const r = Math.floor(i / 9);
      const c = i % 9;
      if (r === 2 || r === 5) cell.classList.add('border-bottom-thick');
      if (c === 2 || c === 5) cell.classList.add('border-right-thick');

      // Notes subgrid structure (9 slots)
      const notesGrid = document.createElement('div');
      notesGrid.classList.add('notes-grid');
      notesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      notesGrid.style.gridTemplateRows = 'repeat(3, 1fr)';
      
      for (let n = 1; n <= 9; n++) {
        const noteVal = document.createElement('span');
        noteVal.classList.add('note-value');
        noteVal.dataset.note = n;
        notesGrid.appendChild(noteVal);
      }
      
      const valueSpan = document.createElement('span');
      valueSpan.classList.add('cell-value');

      cell.appendChild(notesGrid);
      cell.appendChild(valueSpan);
      el.grid.appendChild(cell);
    }
  }

  // Event handler setups
  function setupEventHandlers() {
    // Grid cell clicks
    el.grid.addEventListener('click', (e) => {
      const cell = e.target.closest('.sudoku-cell');
      if (!cell || !state.isPlaying || state.isPaused) return;

      SoundFX.playClick();
      selectCell(parseInt(cell.dataset.index));
    });

    // Keypad numbers
    el.keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.keypad-btn');
      if (!btn || !state.isPlaying || state.isPaused) return;

      const action = btn.dataset.action;
      const num = parseInt(btn.dataset.number);

      if (num && num <= 9) {
        handleNumberInput(num);
      } else if (action === 'erase') {
        eraseActiveCell();
      } else if (action === 'pencil') {
        togglePencilMode();
      } else if (action === 'hint') {
        triggerAIHint();
      }
    });

    // Game Control Buttons
    el.newGameBtn.addEventListener('click', () => { SoundFX.playPageFlip(); startNewGame(); });
    el.restartBtn.addEventListener('click', () => { SoundFX.playPageFlip(); restartPuzzle(); });
    el.pauseBtn.addEventListener('click', togglePause);
    el.undoBtn.addEventListener('click', undoMove);
    el.redoBtn.addEventListener('click', redoMove);
    el.hintBtn.addEventListener('click', triggerAIHint);
    el.eraserBtn.addEventListener('click', eraseActiveCell);
    el.pencilBtn.addEventListener('click', togglePencilMode);
    el.checkBtn.addEventListener('click', checkCurrentSolution);

    // Difficulty dropdown
    el.difficultySelect.addEventListener('change', (e) => {
      state.difficulty = e.target.value;
      SoundFX.playPageFlip();
      startNewGame();
    });
    
    // Settings adjustments
    el.soundToggle.addEventListener('change', (e) => {
      settings.soundEnabled = e.target.checked;
      saveSettings();
    });

    el.animToggle.addEventListener('change', (e) => {
      settings.animationsEnabled = e.target.checked;
      saveSettings();
    });

    el.mistakeToggle.addEventListener('change', (e) => {
      state.mistakeChecking = e.target.checked;
      saveAutosave();
      renderBoard();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Modals
    el.modalClose.addEventListener('click', closeModal);
    el.modalOverlay.addEventListener('click', (e) => {
      if (e.target === el.modalOverlay) closeModal();
    });

    // Celebration close
    el.celebrationClose.addEventListener('click', () => {
      el.celebrationOverlay.classList.remove('active');
    });
  }

  // Check and Load autosave silently on load
  function checkAutosave() {
    const saved = localStorage.getItem('sudoku_autosave_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        state.difficulty = data.difficulty || 'easy';
        state.board = data.board;
        state.startBoard = data.startBoard;
        state.solution = data.solution;
        state.notes = data.notes;
        state.mistakes = data.mistakes || 0;
        state.elapsedTime = data.elapsedTime || 0;
        state.history = data.history || [];
        state.historyIndex = data.historyIndex || -1;
        state.isPlaying = true;
        state.isPaused = false;
        
        el.difficultyDisplay.textContent = state.difficulty.toUpperCase();
        el.difficultySelect.value = state.difficulty;
        
        startTimer();
        renderBoard();
        updateBestTimeDisplay();
        return;
      } catch (e) {
        console.warn("Failed to load autosave", e);
      }
    }
    startNewGame();
  }

  // Start new puzzle game
  function startNewGame() {
    stopTimer();
    const diff = state.difficulty;
    const seed = Date.now().toString();
    const puzzleData = window.SudokuEngine.generatePuzzle(diff, seed);
    
    state.board = [...puzzleData.puzzle];
    state.startBoard = [...puzzleData.puzzle];
    state.solution = [...puzzleData.solution];
    state.notes = Array.from({ length: 81 }, () => []);
    state.activeCellIdx = -1;
    state.mistakes = 0;
    state.elapsedTime = 0;
    
    state.history = [];
    state.historyIndex = -1;
    pushHistory();
    
    state.isPlaying = true;
    state.isPaused = false;
    
    el.difficultyDisplay.textContent = diff.toUpperCase();
    
    startTimer();
    renderBoard();
    updateBestTimeDisplay();
    saveAutosave();
  }

  // Restart current puzzle
  function restartPuzzle() {
    stopTimer();
    state.board = [...state.startBoard];
    state.notes = Array.from({ length: 81 }, () => []);
    state.activeCellIdx = -1;
    state.mistakes = 0;
    state.elapsedTime = 0;
    state.history = [];
    state.historyIndex = -1;
    pushHistory();
    
    state.isPlaying = true;
    state.isPaused = false;
    
    startTimer();
    renderBoard();
    saveAutosave();
  }

  // Cell Selection
  function selectCell(idx) {
    if (state.activeCellIdx === idx) {
      state.activeCellIdx = -1; // Toggle deselection
    } else {
      state.activeCellIdx = idx;
    }
    renderBoard();
  }

  // Handle number input (1-9)
  function handleNumberInput(num) {
    if (state.activeCellIdx === -1) return;
    if (state.startBoard[state.activeCellIdx] !== 0) return;

    if (state.isPencilMode) {
      SoundFX.playPencil();
      const cellNotes = state.notes[state.activeCellIdx];
      const idx = cellNotes.indexOf(num);
      if (idx === -1) {
        cellNotes.push(num);
      } else {
        cellNotes.splice(idx, 1);
      }
      state.board[state.activeCellIdx] = 0; // Clear cell value if making a note
    } else {
      SoundFX.playClick();
      state.board[state.activeCellIdx] = num;
      state.notes[state.activeCellIdx] = []; // Clear notes on entering value
      
      // Auto-clear corresponding notes in same row, column, and box
      clearNotesForCell(state.activeCellIdx, num);

      // Check mistake instantly
      if (num !== state.solution[state.activeCellIdx]) {
        state.mistakes++;
        SoundFX.playError();
        if (state.mistakes >= state.maxMistakes) {
          triggerGameOver();
          return;
        }
      }
    }

    pushHistory();
    saveAutosave();
    renderBoard();
    checkGameFinished();
  }

  // Clear pencil notes in same row/col/box when number is placed
  function clearNotesForCell(idx, val) {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const box = window.SudokuEngine.getBox(idx);
    
    for (let i = 0; i < 81; i++) {
      const cellR = Math.floor(i / 9);
      const cellC = i % 9;
      const cellBox = window.SudokuEngine.getBox(i);
      
      if (cellR === r || cellC === c || cellBox === box) {
        const noteIdx = state.notes[i].indexOf(val);
        if (noteIdx !== -1) {
          state.notes[i].splice(noteIdx, 1);
        }
      }
    }
  }

  // Erase active cell
  function eraseActiveCell() {
    if (state.activeCellIdx === -1) return;
    if (state.startBoard[state.activeCellIdx] !== 0) return;

    SoundFX.playErase();
    state.board[state.activeCellIdx] = 0;
    state.notes[state.activeCellIdx] = [];
    
    pushHistory();
    saveAutosave();
    renderBoard();
  }

  // Toggle Pencil/Notes mode
  function togglePencilMode() {
    state.isPencilMode = !state.isPencilMode;
    el.pencilBtn.classList.toggle('active', state.isPencilMode);
  }

  // Undo / Redo Move Stack
  function pushHistory() {
    const snap = {
      board: [...state.board],
      notes: state.notes.map(arr => [...arr]),
      mistakes: state.mistakes
    };

    // Trim elements after index if we had undone moves
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snap);
    state.historyIndex++;
  }

  function undoMove() {
    if (state.historyIndex <= 0) return;
    SoundFX.playClick();
    state.historyIndex--;
    
    const snap = state.history[state.historyIndex];
    state.board = [...snap.board];
    state.notes = snap.notes.map(arr => [...arr]);
    state.mistakes = snap.mistakes;

    saveAutosave();
    renderBoard();
  }

  function redoMove() {
    if (state.historyIndex >= state.history.length - 1) return;
    SoundFX.playClick();
    state.historyIndex++;

    const snap = state.history[state.historyIndex];
    state.board = [...snap.board];
    state.notes = snap.notes.map(arr => [...arr]);
    state.mistakes = snap.mistakes;

    saveAutosave();
    renderBoard();
  }

  // Render the cells & keypad UI updates
  function renderBoard() {
    const numberCounts = Array(10).fill(0);
    const activeVal = state.activeCellIdx !== -1 ? state.board[state.activeCellIdx] : 0;
    const activeRow = state.activeCellIdx !== -1 ? Math.floor(state.activeCellIdx / 9) : -1;
    const activeCol = state.activeCellIdx !== -1 ? state.activeCellIdx % 9 : -1;
    const activeBox = state.activeCellIdx !== -1 ? window.SudokuEngine.getBox(state.activeCellIdx) : -1;

    for (let i = 0; i < 81; i++) {
      const cell = el.grid.children[i];
      if (!cell) continue;

      const val = state.board[i];
      const notesGrid = cell.querySelector('.notes-grid');
      const valSpan = cell.querySelector('.cell-value');

      cell.className = 'sudoku-cell';
      const r = Math.floor(i / 9);
      const c = i % 9;
      if (r === 2 || r === 5) cell.classList.add('border-bottom-thick');
      if (c === 2 || c === 5) cell.classList.add('border-right-thick');

      if (i === state.activeCellIdx) {
        cell.classList.add('selected');
      } else if (activeRow !== -1) {
        const cellBox = window.SudokuEngine.getBox(i);
        if (r === activeRow || c === activeCol || cellBox === activeBox) {
          cell.classList.add('highlight-peer');
        }
      }

      if (state.startBoard[i] !== 0) {
        cell.classList.add('prefilled');
        valSpan.textContent = val;
        notesGrid.style.display = 'none';
        numberCounts[val]++;
      } else if (val !== 0) {
        valSpan.textContent = val;
        notesGrid.style.display = 'none';
        numberCounts[val]++;

        if (state.mistakeChecking && val !== state.solution[i]) {
          cell.classList.add('incorrect');
        } else {
          cell.classList.add('correct');
        }
      } else {
        valSpan.textContent = '';
        notesGrid.style.display = 'grid';
        
        const noteSpans = notesGrid.querySelectorAll('.note-value');
        noteSpans.forEach(ns => {
          const noteVal = parseInt(ns.dataset.note);
          if (state.notes[i].includes(noteVal)) {
            ns.textContent = noteVal;
          } else {
            ns.textContent = '';
          }
        });
      }

      if (activeVal !== 0 && val === activeVal && i !== state.activeCellIdx) {
        cell.classList.add('highlight-match');
      }
    }

    el.mistakes.textContent = state.mistakes;
    el.maxMistakes.textContent = state.maxMistakes;

    updateNumberKeypadUI(numberCounts);

    el.undoBtn.disabled = state.historyIndex <= 0;
    el.redoBtn.disabled = state.historyIndex >= state.history.length - 1;
  }

  function updateNumberKeypadUI(counts) {
    for (let num = 1; num <= 9; num++) {
      const btn = document.querySelector(`.keypad-btn[data-number="${num}"]`);
      if (!btn) continue;

      const count = counts[num];
      if (count >= 9) {
        btn.classList.add('completed');
      } else {
        btn.classList.remove('completed');
      }
    }
  }

  // AI Hint System
  function triggerAIHint() {
    const hint = window.SudokuEngine.getAIHint(state.board, state.solution);
    if (!hint || hint.type === 'solved') {
      alert("No cells need hints!");
      return;
    }

    el.modalTitle.textContent = "Logic Hint";
    el.modalBody.innerHTML = `
      <div class="hint-detail" style="font-size: 1rem; line-height: 1.6;">
        <p style="margin-bottom: 15px;">${hint.explanation}</p>
        <div style="text-align: center; margin-top: 20px;">
          <button id="modal-fill-hint-btn" class="paper-btn active-btn" style="padding: 10px 20px;">✍️ Write Correct Value (${hint.val})</button>
        </div>
      </div>
    `;
    openModal("Logic Hint", el.modalBody.innerHTML);

    const modalFillBtn = document.getElementById('modal-fill-hint-btn');
    if (modalFillBtn) {
      modalFillBtn.addEventListener('click', () => {
        closeModal();
        state.activeCellIdx = hint.idx;
        handleNumberInput(hint.val);
      });
    }
  }

  // Timer controls
  function startTimer() {
    stopTimer();
    state.timerInterval = setInterval(() => {
      if (!state.isPaused) {
        state.elapsedTime++;
        updateTimerDisplay();
        saveAutosave();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }
  }

  function updateTimerDisplay() {
    const m = Math.floor(state.elapsedTime / 60);
    const s = state.elapsedTime % 60;
    el.timer.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function togglePause() {
    if (!state.isPlaying) return;
    state.isPaused = !state.isPaused;
    
    if (state.isPaused) {
      el.pauseBtn.innerHTML = '<span class="icon">▶</span> Resume';
      el.grid.classList.add('paused');
    } else {
      el.pauseBtn.innerHTML = '<span class="icon">⏸</span> Pause';
      el.grid.classList.remove('paused');
    }
    SoundFX.playPageFlip();
  }

  // Manual Check Board Option
  function checkCurrentSolution() {
    let mistakesFound = 0;
    let complete = true;
    for (let i = 0; i < 81; i++) {
      if (state.board[i] === 0) {
        complete = false;
      } else if (state.board[i] !== state.solution[i]) {
        mistakesFound++;
      }
    }
    
    if (mistakesFound > 0) {
      alert(`Check complete: Found ${mistakesFound} incorrect values.`);
    } else if (complete) {
      checkGameFinished();
    } else {
      alert("Check complete: All placed values are correct so far! Keep going.");
    }
  }

  // Check Game Over & Victory
  function checkGameFinished() {
    const finished = state.board.every((val, i) => val === state.solution[i]);
    if (finished) {
      stopTimer();
      state.isPlaying = false;
      saveBestTime();
      clearAutosave();
      SoundFX.playWinChime();
      showCelebration();
    }
  }

  function showCelebration() {
    setTimeout(startSketchConfetti, 300);

    const mins = Math.floor(state.elapsedTime / 60);
    const secs = state.elapsedTime % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    el.celebrationMessage.innerHTML = `
      <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 12px; color: #111827;">Puzzle Complete! 🎉</h2>
      <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; color: #4b5563;">Congratulations! You solved the Sudoku in <strong>${timeStr}</strong> on <strong>${state.difficulty}</strong> difficulty!</p>
      <p style="font-size: 0.95rem; color: #6b7280;">Mistakes made: <strong>${state.mistakes} / ${state.maxMistakes}</strong></p>
    `;
    el.celebrationOverlay.classList.add('active');
  }

  function triggerGameOver() {
    state.isPlaying = false;
    stopTimer();
    clearAutosave();
    SoundFX.playError();

    el.celebrationMessage.innerHTML = `
      <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 12px; color: var(--incorrect-color);">Game Over! 😢</h2>
      <p style="font-size: 1.05rem; line-height: 1.6; color: #4b5563;">You've reached the limit of <strong>${state.maxMistakes}</strong> mistakes.</p>
      <p style="font-size: 0.95rem; color: #6b7280; margin-top: 10px;">Try again to sharpen your skills!</p>
    `;
    el.celebrationOverlay.classList.add('active');
  }

  // Local Storage Autosave handlers
  function saveAutosave() {
    if (!state.isPlaying) return;
    const data = {
      difficulty: state.difficulty,
      board: state.board,
      startBoard: state.startBoard,
      solution: state.solution,
      notes: state.notes,
      mistakes: state.mistakes,
      elapsedTime: state.elapsedTime,
      history: state.history,
      historyIndex: state.historyIndex
    };
    localStorage.setItem('sudoku_autosave_v2', JSON.stringify(data));
  }

  function clearAutosave() {
    localStorage.removeItem('sudoku_autosave_v2');
  }

  // Best Time records handlers
  function getBestTimeKey() {
    return `sudoku_best_${state.difficulty}`;
  }

  function loadBestTime() {
    return localStorage.getItem(getBestTimeKey());
  }

  function saveBestTime() {
    const key = getBestTimeKey();
    const currentBest = loadBestTime();
    if (!currentBest || state.elapsedTime < parseInt(currentBest)) {
      localStorage.setItem(key, state.elapsedTime.toString());
      updateBestTimeDisplay();
    }
  }

  function updateBestTimeDisplay() {
    const bestSecs = loadBestTime();
    if (bestSecs) {
      const s = parseInt(bestSecs);
      const m = Math.floor(s / 60);
      const secStr = (s % 60).toString().padStart(2, '0');
      el.bestTime.textContent = `${m}:${secStr}`;
    } else {
      el.bestTime.textContent = '--:--';
    }
  }

  // Keyboard Shortcuts Handler
  function handleKeyboardShortcuts(e) {
    if (!state.isPlaying || state.isPaused) return;

    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoMove();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redoMove();
      return;
    }

    const key = e.key;

    // Value input (1-9)
    if (key >= '1' && key <= '9') {
      e.preventDefault();
      handleNumberInput(parseInt(key));
    }
    // Erase active cell
    else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      e.preventDefault();
      eraseActiveCell();
    }
    // Pencil / Note mode
    else if (key.toLowerCase() === 'n') {
      e.preventDefault();
      togglePencilMode();
    }
    // AI Hint
    else if (key.toLowerCase() === 'h') {
      e.preventDefault();
      triggerAIHint();
    }
    // Deselect cell
    else if (key === 'Escape') {
      e.preventDefault();
      state.activeCellIdx = -1;
      renderBoard();
    }
    // Pause / Resume
    else if (key === ' ') {
      e.preventDefault();
      togglePause();
    }
    // Navigation arrows
    else if (key.startsWith('Arrow')) {
      e.preventDefault();
      if (state.activeCellIdx === -1) {
        state.activeCellIdx = 0;
      } else {
        let r = Math.floor(state.activeCellIdx / 9);
        let c = state.activeCellIdx % 9;

        if (key === 'ArrowUp') r = (r - 1 + 9) % 9;
        else if (key === 'ArrowDown') r = (r + 1) % 9;
        else if (key === 'ArrowLeft') c = (c - 1 + 9) % 9;
        else if (key === 'ArrowRight') c = (c + 1) % 9;

        state.activeCellIdx = r * 9 + c;
      }
      SoundFX.playClick();
      renderBoard();
    }
  }

  // Modals view controllers
  function openModal(title, contentHTML) {
    el.modalTitle.textContent = title;
    el.modalBody.innerHTML = contentHTML;
    el.modalOverlay.style.display = 'flex';
    SoundFX.playPageFlip();
  }

  function closeModal() {
    el.modalOverlay.style.display = 'none';
    SoundFX.playPageFlip();
  }

  // Canvas celebration confetti
  let confettiInterval = null;
  function startSketchConfetti() {
    const canvas = el.celebrationCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = 90;

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -100 - 10,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        type: ['line', 'circle', 'spiral', 'square'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.1 - 0.05
      };
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    clearInterval(confettiInterval);
    confettiInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const inkColor = getComputedStyle(document.body).getPropertyValue('--ink-color').trim() || '#111';
      ctx.strokeStyle = inkColor;
      ctx.fillStyle = inkColor;
      ctx.lineWidth = 1.5;

      let finished = true;
      particles.forEach(p => {
        if (p.y < canvas.height + 20) {
          finished = false;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        if (p.type === 'line') {
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.stroke();
        } else if (p.type === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'square') {
          ctx.strokeRect(-p.size/2, -p.size/2, p.size, p.size);
        } else if (p.type === 'spiral') {
          ctx.moveTo(0, 0);
          for (let angle = 0; angle < Math.PI * 3; angle += 0.5) {
            const r = (angle / (Math.PI * 3)) * p.size;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.stroke();
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 15 && el.celebrationOverlay.classList.contains('active')) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 3 + 2;
        }
      });

      if (finished && !el.celebrationOverlay.classList.contains('active')) {
        clearInterval(confettiInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 1000 / 60);
  }

})();
