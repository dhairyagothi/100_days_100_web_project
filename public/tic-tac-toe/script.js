// script.js
// Main Game Controller. Manages UI, Game Loop, Canvas Confetti, Game Replays, 
// Keyboard Accessibility, and Peer Network Simulation.

// Global Game State
let gameState = {
    board: [],
    size: 3,
    mode: 'ai', // 'pvp', 'ai', 'online'
    difficulty: 'hard', // 'easy', 'medium', 'hard'
    playerSymbol: 'X', // Player 1 / Human symbol
    opponentSymbol: 'O',
    currentTurn: 'X', // 'X' or 'O'
    isGameOver: false,
    isPaused: false,
    moveHistory: [], // Array of { index, player, explanation }
    winner: null,
    winningLine: null,
    timeStarted: null,
    timeLimitEnabled: false,
    turnTimeLimit: 10, // seconds
    timeLeft: 10,
    timerInterval: null,
    totalPlayTimeTracker: null
};

// Replay State
let replayState = {
    isActive: false,
    currentStep: -1,
    isPlaying: false,
    playInterval: null
};

// Canvas Confetti System
const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }
    },

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },

    spawn(count = 100) {
        this.particles = [];
        const colors = ['#00f3ff', '#ff007f', '#9d4edd', '#ffb703', '#39ff14'];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 20,
                radius: Math.random() * 4 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: Math.random() * 10 - 5,
                vy: -Math.random() * 15 - 10,
                gravity: 0.3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                opacity: 1
            });
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animate();
    },

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let active = false;

        this.particles.forEach(p => {
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            if (p.vy > 0) {
                p.opacity -= 0.015;
            }

            if (p.opacity > 0 && p.x >= 0 && p.x <= this.canvas.width) {
                active = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                this.ctx.restore();
            }
        });

        if (active) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }
};

// UI Elements & Setup
document.addEventListener('DOMContentLoaded', () => {
    Confetti.init('confetti-canvas');
    initializeUI();
    loadPreferences();
    loadAchievementsUI();
    loadLeaderboardUI();
    loadStatsUI();

    // Check for saved game on load
    const saved = StorageManager.getSavedGame();
    if (saved) {
        showResumePrompt(saved);
    } else {
        startNewGame();
    }

    // Start background play time tracker (every 10 seconds)
    gameState.totalPlayTimeTracker = setInterval(() => {
        if (!gameState.isGameOver && !gameState.isPaused && !replayState.isActive) {
            StorageManager.addPlayTime(10);
            loadStatsUI();
        }
    }, 10000);
});

// Dynamic AI Explanation state controller (prevents layout shifts)
function updateAIExplanation(text, emoji = '🤖') {
    const avatar = document.querySelector('.ai-explanation-panel .ai-avatar');
    const label = document.querySelector('.ai-explanation-panel label');
    const p = document.getElementById('ai-explanation-text');
    if (avatar) avatar.textContent = emoji;
    if (p) p.textContent = text;
    
    // Set color accent based on active state
    if (emoji === '💤' || emoji === '🏁' || emoji === '👥') {
        if (label) label.style.color = '#64748b';
        const panel = document.getElementById('ai-explanation-card');
        if (panel) panel.style.borderLeftColor = '#cbd5e1';
    } else {
        if (label) label.style.color = '#4f46e5';
        const panel = document.getElementById('ai-explanation-card');
        if (panel) panel.style.borderLeftColor = '#6366f1';
    }
}

// Load preferences (themes, sound) from storage
function loadPreferences() {
    const prefs = StorageManager.getPreferences();
    
    // Set theme
    document.body.setAttribute('data-theme', prefs.theme);
    const themeSel = document.getElementById('theme-select');
    if (themeSel) themeSel.value = prefs.theme;

    // Set Sound Status
    SoundEffects.setSoundEnabled(prefs.soundEnabled);
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        if (prefs.soundEnabled) soundBtn.classList.add('active');
        else soundBtn.classList.remove('active');
    }

    // Set Music Status
    SoundEffects.setMusicEnabled(prefs.musicEnabled);
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        if (prefs.musicEnabled) musicBtn.classList.add('active');
        else musicBtn.classList.remove('active');
    }
}

// Re-render UI elements
function loadAchievementsUI() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    list.innerHTML = '';
    
    const achievements = StorageManager.getAchievements();
    Object.keys(achievements).forEach(key => {
        const item = achievements[key];
        const card = document.createElement('div');
        card.className = `badge-item ${item.unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="badge-icon">${item.icon}</div>
            <div class="badge-details">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

function loadLeaderboardUI() {
    const lb = StorageManager.getLeaderboard();
    
    const elements = {
        'leader-win-streak': `${lb.bestWinStreak} Games`,
        'leader-fastest-win': lb.fastestVictory ? `${lb.fastestVictory}s` : 'N/A',
        'leader-player-wins': lb.playerWins,
        'leader-ai-wins': lb.aiWins
    };

    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

function loadStatsUI() {
    const stats = StorageManager.getStats();
    const played = stats.gamesPlayed;
    const won = stats.gamesWon;
    const drawn = stats.gamesDrawn;
    
    // Calculate Win Rate
    const winRate = played > 0 ? Math.round((won / played) * 100) : 0;
    
    // Format total play time
    const mins = Math.floor(stats.totalPlayTime / 60);
    const hrs = Math.floor(mins / 60);
    const playTimeStr = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m ${stats.totalPlayTime % 60}s`;

    const elements = {
        'stat-played': played,
        'stat-won': won,
        'stat-drawn': drawn,
        'stat-lost': stats.gamesLost,
        'stat-winrate': `${winRate}%`,
        'stat-streak': stats.currentStreak,
        'stat-best-streak': stats.longestStreak,
        'stat-time': playTimeStr
    };

    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

// Show a small custom toast message when badge unlocks
function triggerToast(badge) {
    const toast = document.getElementById('toast-badge');
    if (!toast) return;
    
    document.getElementById('toast-icon').textContent = badge.icon;
    document.getElementById('toast-title').textContent = `Unlocked: ${badge.name}`;
    document.getElementById('toast-desc').textContent = badge.desc;

    SoundEffects.playBadgeUnlock();
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4500);
}

// Resume previous session prompt
function showResumePrompt(saved) {
    const resume = confirm("An unfinished game session was found! Would you like to resume it?");
    if (resume) {
        gameState = { ...gameState, ...saved };
        // Trigger board rebuild
        buildBoardGrid();
        renderBoardState();
        updateGameHeaderUI();
        if (gameState.timeLimitEnabled && !gameState.isGameOver && !gameState.isPaused) {
            startTurnTimer();
        }
    } else {
        StorageManager.clearSavedGame();
        startNewGame();
    }
}

// Tab Switching logic
function initializeTabs() {
    const tabHeaders = document.querySelector('.tab-headers');
    if (!tabHeaders) return;
    
    tabHeaders.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        
        tabHeaders.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const targetTab = btn.dataset.tab;
        
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${targetTab}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
}

// Event bindings & Configuration logic
function initializeUI() {
    // Initialize Dashboard Tabs
    initializeTabs();
    // Theme selector check omitted (Light mode default enforced)

    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', () => {
        const btn = document.getElementById('sound-toggle');
        const prefs = StorageManager.getPreferences();
        prefs.soundEnabled = !prefs.soundEnabled;
        StorageManager.savePreferences(prefs);
        SoundEffects.setSoundEnabled(prefs.soundEnabled);
        
        btn.classList.toggle('active', prefs.soundEnabled);
        SoundEffects.playClick();
    });

    // Music toggle
    document.getElementById('music-toggle').addEventListener('click', () => {
        const btn = document.getElementById('music-toggle');
        const prefs = StorageManager.getPreferences();
        prefs.musicEnabled = !prefs.musicEnabled;
        StorageManager.savePreferences(prefs);
        SoundEffects.setMusicEnabled(prefs.musicEnabled);
        
        btn.classList.toggle('active', prefs.musicEnabled);
        SoundEffects.playClick();
    });

    // Configuration selections
    setupOptionGroup('mode-opts', val => {
        gameState.mode = val;
        // Hide difficulty selection if PvP
        const diffForm = document.getElementById('diff-form-group');
        if (diffForm) {
            diffForm.style.display = (val === 'ai') ? 'block' : 'none';
        }
    });

    setupOptionGroup('symbol-opts', val => {
        gameState.playerSymbol = val;
        gameState.opponentSymbol = (val === 'X') ? 'O' : 'X';
    });

    setupOptionGroup('diff-opts', val => {
        gameState.difficulty = val;
    });

    setupOptionGroup('timer-opts', val => {
        gameState.timeLimitEnabled = (val === 'on');
    });

    // Buttons
    document.getElementById('start-game-btn').addEventListener('click', () => {
        SoundEffects.playClick();
        startNewGame();
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        SoundEffects.playClick();
        startNewGame();
    });

    document.getElementById('undo-btn').addEventListener('click', () => {
        SoundEffects.playClick();
        performUndo();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        SoundEffects.playClick();
        togglePause();
    });

    // Replay Controls
    document.getElementById('replay-btn-play').addEventListener('click', () => {
        SoundEffects.playClick();
        toggleReplayPlay();
    });
    document.getElementById('replay-btn-prev').addEventListener('click', () => {
        SoundEffects.playClick();
        stepReplay(-1);
    });
    document.getElementById('replay-btn-next').addEventListener('click', () => {
        SoundEffects.playClick();
        stepReplay(1);
    });
    document.getElementById('replay-btn-close').addEventListener('click', () => {
        SoundEffects.playClick();
        exitReplayMode();
    });

    // Reset Data
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete all games played, statistics, wins, speed records, and badges? This cannot be undone.")) {
                StorageManager.resetAllData();
                loadPreferences();
                loadAchievementsUI();
                loadLeaderboardUI();
                loadStatsUI();
                startNewGame();
            }
        });
    }
}

// Utility to bind state options to button toggle sets
function setupOptionGroup(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        callback(btn.dataset.val);
    });
}

function setActiveOption(containerId, value) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('button').forEach(b => {
        if (b.dataset.val === value) b.classList.add('active');
        else b.classList.remove('active');
    });
}

// Dynamic Grid Constructor
function buildBoardGrid() {
    const boardEl = document.getElementById('board');
    if (!boardEl) return;
    
    // Clear board classes and layout
    boardEl.className = 'board';
    boardEl.classList.add(`board-${gameState.size}x${gameState.size}`);
    
    boardEl.innerHTML = '';
    
    // Create Cell DOMs with keyboard attributes
    const cellCount = gameState.size * gameState.size;
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', `Cell ${i + 1}`);
        
        cell.addEventListener('click', () => handleCellClick(i));
        cell.addEventListener('keydown', (e) => handleCellKeyboard(e, i));
        
        boardEl.appendChild(cell);
    }
}

// Main New Game initializer
function startNewGame() {
    // Reset configurations
    const gridCount = gameState.size * gameState.size;
    gameState.board = Array(gridCount).fill(null);
    gameState.isGameOver = false;
    gameState.isPaused = false;
    gameState.moveHistory = [];
    gameState.winner = null;
    gameState.winningLine = null;
    gameState.timeStarted = Date.now();
    
    // Reset replay options
    exitReplayMode();

    // Determine starting turn randomly
    gameState.currentTurn = Math.random() < 0.5 ? 'X' : 'O';
    
    buildBoardGrid();
    renderBoardState();
    updateGameHeaderUI();
    
    // Reset indicators without layout shifting
    const initialText = gameState.mode === 'ai' 
        ? (gameState.currentTurn === gameState.playerSymbol ? "Make a move. I will calculate my response." : "AI is thinking...")
        : "Local PvP match active - play when ready!";
    const initialEmoji = gameState.mode === 'ai' 
        ? (gameState.currentTurn === gameState.playerSymbol ? "🤖" : "🧠")
        : "👥";
    updateAIExplanation(initialText, initialEmoji);
    
    const replayCtrl = document.getElementById('replay-controller');
    if (replayCtrl) {
        replayCtrl.classList.remove('active');
        document.getElementById('replay-step-info').textContent = `Step 0 / 0`;
        const repStatus = document.getElementById('replay-status-text');
        if (repStatus) repStatus.textContent = '';
    }
    
    renderMoveHistory();

    // Clear saved session since new game started
    StorageManager.clearSavedGame();

    // Start turn timer if blitz enabled
    if (gameState.timeLimitEnabled) {
        startTurnTimer();
    } else {
        stopTurnTimer();
    }

    // If AI starts
    if (gameState.mode === 'ai' && gameState.currentTurn === gameState.opponentSymbol) {
        setTimeout(triggerAIMove, 400);
    }
}

// Render active cell icons on UI grid
function renderBoardState() {
    const cells = document.querySelectorAll('.board .cell');
    cells.forEach((cell, idx) => {
        const val = gameState.board[idx];
        cell.className = 'cell'; // reset classes
        
        if (val) {
            cell.classList.add('occupied');
            cell.innerHTML = val === 'X' 
                ? `<span class="x-symbol">${gameState.mode === 'emoji' ? '🐱' : 'X'}</span>` 
                : `<span class="o-symbol">${gameState.mode === 'emoji' ? '🐶' : 'O'}</span>`;
        } else {
            cell.innerHTML = '';
        }

        // Highlight winning line cells
        if (gameState.winningLine && gameState.winningLine.includes(idx)) {
            cell.classList.add('win-cell');
        }
    });

    // Update buttons availability
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = gameState.moveHistory.length === 0 || gameState.isGameOver || gameState.isPaused || gameState.mode === 'online';
    }

    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.disabled = gameState.isGameOver;
        pauseBtn.textContent = gameState.isPaused ? '▶ Resume' : '⏸ Pause';
    }

    // Render Move History Chips
    renderMoveHistory();
}

function updateGameHeaderUI() {
    const statusText = document.getElementById('game-status-text');
    const turnDot = document.getElementById('turn-dot');
    const turnName = document.getElementById('turn-player-name');

    if (gameState.isPaused) {
        statusText.textContent = "GAME PAUSED";
        return;
    }

    if (gameState.isGameOver) {
        if (gameState.winner) {
            statusText.textContent = `${gameState.winner} WINS THE GAME!`;
            // Trigger Confetti
            Confetti.spawn(120);
        } else {
            statusText.textContent = "IT'S A DRAW!";
        }
        stopTurnTimer();
        return;
    }

    // Show active turn
    statusText.textContent = "";
    if (turnDot && turnName) {
        turnDot.className = `turn-dot ${gameState.currentTurn === 'O' ? 'player-o' : ''}`;
        
        const isCurrentHuman = (gameState.mode === 'pvp' || gameState.currentTurn === gameState.playerSymbol);
        turnName.textContent = isCurrentHuman ? `Player ${gameState.currentTurn}` : 'AI Thinking...';
    }
}

// Grid clicking action handler
function handleCellClick(index) {
    if (gameState.isGameOver || gameState.isPaused || replayState.isActive) return;
    if (gameState.board[index] !== null) return;

    // If AI is thinking, block user inputs
    if (gameState.mode === 'ai' && gameState.currentTurn === gameState.opponentSymbol) return;

    registerMove(index, gameState.currentTurn, "Player manual cell selection.");

    // Check next state
    if (gameState.isGameOver) return;

    // If local AI mode
    if (gameState.mode === 'ai' && gameState.currentTurn === gameState.opponentSymbol) {
        setTimeout(triggerAIMove, 500);
    }
}

// AI trigger logic
function triggerAIMove() {
    if (gameState.isGameOver || gameState.isPaused) return;

    const result = AI.getMove(
        gameState.board, 
        gameState.size, 
        gameState.difficulty, 
        gameState.opponentSymbol, 
        gameState.playerSymbol
    );

    if (result.index !== -1) {
        registerMove(result.index, gameState.opponentSymbol, result.explanation);
        
        updateAIExplanation(result.explanation, "🤖");
    }
}

// Register state changes
function registerMove(index, player, explanation = "") {
    gameState.board[index] = player;
    gameState.moveHistory.push({ index, player, explanation });
    
    SoundEffects.playClick();

    // Check Win/Draw
    const winResult = AI.checkWin(gameState.board, gameState.size);
    if (winResult) {
        gameState.isGameOver = true;
        gameState.winner = winResult.winner;
        gameState.winningLine = winResult.line;
        SoundEffects.playWin();
        finalizeGame('win');
    } else if (AI.checkDraw(gameState.board)) {
        gameState.isGameOver = true;
        SoundEffects.playDraw();
        finalizeGame('draw');
    } else {
        // Toggle turn
        gameState.currentTurn = (gameState.currentTurn === 'X') ? 'O' : 'X';
        
        // Save current game state
        StorageManager.saveGame({
            board: gameState.board,
            size: gameState.size,
            mode: gameState.mode,
            difficulty: gameState.difficulty,
            playerSymbol: gameState.playerSymbol,
            opponentSymbol: gameState.opponentSymbol,
            currentTurn: gameState.currentTurn,
            isGameOver: gameState.isGameOver,
            moveHistory: gameState.moveHistory,
            timeStarted: gameState.timeStarted,
            timeLimitEnabled: gameState.timeLimitEnabled
        });

        if (gameState.timeLimitEnabled) {
            startTurnTimer();
        }
    }

    renderBoardState();
    updateGameHeaderUI();
}

// Finalize Game, update stats and leaderboard
function finalizeGame(outcome) {
    StorageManager.clearSavedGame(); // Game finished, clear saved session
    stopTurnTimer();

    // Determine duration
    const timeTaken = Math.round((Date.now() - gameState.timeStarted) / 1000);

    let result = 'draw';
    if (outcome === 'win') {
        const isHumanWinner = (gameState.mode === 'pvp') || (gameState.winner === gameState.playerSymbol);
        result = isHumanWinner ? 'win' : 'lose';
    }

    // Update Storage statistics
    const update = StorageManager.updateStatsAfterGame(result, timeTaken, gameState.mode, gameState.difficulty);
    
    // Render unlocked achievements
    if (update.unlockedBadges && update.unlockedBadges.length > 0) {
        update.unlockedBadges.forEach(badge => triggerToast(badge));
    }

    // Re-render side panels
    loadStatsUI();
    loadAchievementsUI();
    loadLeaderboardUI();

    // Enable Replay Control display
    const replayCtrl = document.getElementById('replay-controller');
    if (replayCtrl) {
        replayCtrl.classList.add('active');
        document.getElementById('replay-step-info').textContent = `Step ${gameState.moveHistory.length} / ${gameState.moveHistory.length}`;
        const repStatus = document.getElementById('replay-status-text');
        if (repStatus) repStatus.textContent = 'Match finished! Feel free to review the moves.';
    }
    updateAIExplanation("Match finished! Feel free to review the moves.", "🏁");
}

// Pause/Resume game
function togglePause() {
    if (gameState.isGameOver) return;
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        stopTurnTimer();
    } else {
        if (gameState.timeLimitEnabled) startTurnTimer();
    }
    
    renderBoardState();
    updateGameHeaderUI();
}

// Undo move function
function performUndo() {
    if (gameState.isGameOver || gameState.isPaused || gameState.moveHistory.length === 0) return;

    if (gameState.mode === 'ai') {
        // AI game: Undo 2 moves (AI move and human move)
        if (gameState.moveHistory.length >= 2) {
            const m1 = gameState.moveHistory.pop();
            const m2 = gameState.moveHistory.pop();
            gameState.board[m1.index] = null;
            gameState.board[m2.index] = null;
        } else {
            // Only 1 move in history, pop 1
            const m = gameState.moveHistory.pop();
            gameState.board[m.index] = null;
            gameState.currentTurn = m.player; // restore turn
        }
    } else {
        // PvP mode: undo 1 move
        const m = gameState.moveHistory.pop();
        gameState.board[m.index] = null;
        gameState.currentTurn = m.player;
    }

    updateAIExplanation("Move undone. Waiting for your move...", "↩️");

    // Reset Turn timer
    if (gameState.timeLimitEnabled) {
        startTurnTimer();
    }

    renderBoardState();
    updateGameHeaderUI();
}

// Turn Timer (Blitz mode)
function startTurnTimer() {
    stopTurnTimer();
    gameState.timeLeft = gameState.turnTimeLimit;
    
    const timerContainer = document.getElementById('blitz-timer-container');
    const timerText = document.getElementById('timer-seconds');
    if (timerContainer) timerContainer.style.display = 'flex';
    if (timerText) timerText.textContent = `${gameState.timeLeft}s`;

    gameState.timerInterval = setInterval(() => {
        if (gameState.isPaused || gameState.isGameOver) return;

        gameState.timeLeft -= 1;
        if (timerText) timerText.textContent = `${gameState.timeLeft}s`;

        if (gameState.timeLeft <= 0) {
            // Forfeit current turn (make random move)
            stopTurnTimer();
            alert(`Time ran out! Forfeiting Turn ${gameState.currentTurn}.`);
            
            const empty = AI.getEmptyIndices(gameState.board);
            if (empty.length > 0) {
                const randomIdx = empty[Math.floor(Math.random() * empty.length)];
                registerMove(randomIdx, gameState.currentTurn, "Time limit timeout auto-select.");
                
                if (gameState.mode === 'ai' && gameState.currentTurn === gameState.opponentSymbol && !gameState.isGameOver) {
                    setTimeout(triggerAIMove, 500);
                }
            }
        }
    }, 1000);
}

function stopTurnTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    const timerContainer = document.getElementById('blitz-timer-container');
    if (timerContainer) timerContainer.style.display = 'none';
}

// Replay Game feature implementation
function startReplayMode() {
    if (gameState.moveHistory.length === 0) return;

    replayState.isActive = true;
    replayState.currentStep = -1;
    replayState.isPlaying = false;
    
    // Clear active board view
    const gridCount = gameState.size * gameState.size;
    gameState.board = Array(gridCount).fill(null);
    gameState.winningLine = null;

    document.getElementById('replay-status-text').textContent = 'Replay Started';
    document.getElementById('replay-step-info').textContent = `Step 0 / ${gameState.moveHistory.length}`;

    // Disable all standard buttons
    document.getElementById('restart-btn').disabled = true;
    document.getElementById('undo-btn').disabled = true;
    document.getElementById('pause-btn').disabled = true;

    renderBoardState();
}

function exitReplayMode() {
    replayState.isActive = false;
    if (replayState.playInterval) {
        clearInterval(replayState.playInterval);
        replayState.playInterval = null;
    }

    const replayCtrl = document.getElementById('replay-controller');
    if (replayCtrl) {
        replayCtrl.classList.remove('active');
        const repStatus = document.getElementById('replay-status-text');
        if (repStatus) repStatus.textContent = '';
    }
    updateAIExplanation("Replay exited. Ready for next match.", "🏁");
    document.getElementById('restart-btn').disabled = false;
    
    // Restore layout
    renderBoardState();
    updateGameHeaderUI();
}

function stepReplay(direction) {
    if (!replayState.isActive) startReplayMode();

    if (direction === 1) {
        // Step forward
        if (replayState.currentStep < gameState.moveHistory.length - 1) {
            replayState.currentStep += 1;
            const move = gameState.moveHistory[replayState.currentStep];
            gameState.board[move.index] = move.player;
        }
    } else {
        // Step backward
        if (replayState.currentStep >= 0) {
            const move = gameState.moveHistory[replayState.currentStep];
            gameState.board[move.index] = null;
            replayState.currentStep -= 1;
        }
    }

    // Set winning highlights on the final step
    if (replayState.currentStep === gameState.moveHistory.length - 1) {
        // Redo winner check for final arpeggio line
        const win = AI.checkWin(gameState.board, gameState.size);
        if (win) gameState.winningLine = win.line;
    } else {
        gameState.winningLine = null;
    }

    // Update explanation card
    if (replayState.currentStep >= 0) {
        const move = gameState.moveHistory[replayState.currentStep];
        if (move.explanation) {
            updateAIExplanation(move.explanation, move.player === 'X' ? '❌' : '⭕');
        }
        document.getElementById('replay-status-text').textContent = `Move ${replayState.currentStep + 1} by ${move.player}`;
    } else {
        updateAIExplanation("Replay started. Step forward to review moves.", "🔄");
        document.getElementById('replay-status-text').textContent = 'Replay Started';
    }

    document.getElementById('replay-step-info').textContent = `Step ${replayState.currentStep + 1} / ${gameState.moveHistory.length}`;
    
    renderBoardState();
}

function toggleReplayPlay() {
    const playBtn = document.getElementById('replay-btn-play');
    
    if (replayState.isPlaying) {
        replayState.isPlaying = false;
        playBtn.textContent = '▶';
        if (replayState.playInterval) {
            clearInterval(replayState.playInterval);
            replayState.playInterval = null;
        }
    } else {
        if (!replayState.isActive) startReplayMode();
        replayState.isPlaying = true;
        playBtn.textContent = '⏸';
        
        replayState.playInterval = setInterval(() => {
            if (replayState.currentStep < gameState.moveHistory.length - 1) {
                stepReplay(1);
            } else {
                // Done playing, stop
                toggleReplayPlay();
            }
        }, 1100);
    }
}

// Move History chip render in control area
function renderMoveHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;

    if (gameState.moveHistory.length === 0) {
        list.innerHTML = '<div class="history-chip" style="opacity: 0.5; pointer-events: none; border-style: dashed;">No moves recorded yet</div>';
        return;
    }

    list.innerHTML = '';

    gameState.moveHistory.forEach((move, idx) => {
        const chip = document.createElement('div');
        chip.className = `history-chip ${replayState.currentStep === idx ? 'active' : ''}`;
        // Coordinates format
        const row = Math.floor(move.index / gameState.size) + 1;
        const col = (move.index % gameState.size) + 1;
        chip.textContent = `${move.player}: R${row}C${col}`;
        
        chip.addEventListener('click', () => {
            if (!replayState.isActive) startReplayMode();
            // Jump to that step
            jumpToReplayStep(idx);
        });

        list.appendChild(chip);
    });
}

function jumpToReplayStep(stepIndex) {
    // Reset board
    const gridCount = gameState.size * gameState.size;
    gameState.board = Array(gridCount).fill(null);
    
    // Fast forward to step
    for (let i = 0; i <= stepIndex; i++) {
        const move = gameState.moveHistory[i];
        gameState.board[move.index] = move.player;
    }

    replayState.currentStep = stepIndex;

    // Check final step highlights
    if (stepIndex === gameState.moveHistory.length - 1) {
        const win = AI.checkWin(gameState.board, gameState.size);
        if (win) gameState.winningLine = win.line;
    } else {
        gameState.winningLine = null;
    }

    const move = gameState.moveHistory[stepIndex];
    document.getElementById('replay-status-text').textContent = `Move ${stepIndex + 1} by ${move.player}`;
    document.getElementById('replay-step-info').textContent = `Step ${stepIndex + 1} / ${gameState.moveHistory.length}`;

    // Update explanation card
    if (move.explanation) {
        updateAIExplanation(move.explanation, move.player === 'X' ? '❌' : '⭕');
    }

    renderBoardState();
}

// Keyboard Accessibility & Navigation
function handleCellKeyboard(event, index) {
    const size = gameState.size;
    let targetIndex = -1;

    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            targetIndex = (index + 1) % (size * size);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            targetIndex = (index - 1 + size * size) % (size * size);
            break;
        case 'ArrowDown':
            event.preventDefault();
            targetIndex = (index + size) % (size * size);
            break;
        case 'ArrowUp':
            event.preventDefault();
            targetIndex = (index - size + size * size) % (size * size);
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            handleCellClick(index);
            break;
        default:
            return; // let other keys bubble
    }

    if (targetIndex !== -1) {
        const cells = document.querySelectorAll('.board .cell');
        if (cells[targetIndex]) {
            cells[targetIndex].focus();
        }
    }
}
