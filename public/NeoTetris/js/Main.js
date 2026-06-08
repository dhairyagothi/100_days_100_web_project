/* ============================================================
   NEOTRETIS — main.js  (engine integration)

   Responsibilities:
   1. All UI-only functionality (unchanged from original):
      theme switching, session timer, daily countdown,
      ticker, toasts, overlay helpers, status bar,
      FPS display, piece preview builder,
      score / combo / level DOM helpers.
   2. Engine bootstrap: constructs Engine, wires all buttons.

   Loaded as type="module" — see the <script> tag in index.html.
   All original UI behaviour is preserved exactly.
   Button event listeners delegate entirely to Engine.
   window.NeoTetrisUI is populated before Engine is constructed
   so Renderer's lazy _resolveUI() finds it on the first call.
   ============================================================ */

import { Engine } from './engine.js';
import { ACHIEVEMENT_DEFS } from './achievements.js';

// ─── THEME CONSTANTS ─────────────────────────────────────────
const THEMES = ['neon-cyberpunk', 'classic-retro', 'dark-minimal', 'space-theme'];

const THEME_NAMES = {
    'neon-cyberpunk': 'Neon Cyberpunk',
    'classic-retro': 'Classic Retro',
    'dark-minimal': 'Dark Minimal',
    'space-theme': 'Space Theme',
};

// ─── IDLE SPLASH DEMO PIECES ─────────────────────────────────
// Painted onto the board while no game is running.
const DEMO_PIECES = [
    { cells: [[17, 0], [17, 1], [18, 1], [18, 2]], type: 'S' },
    { cells: [[17, 7], [17, 8], [17, 9], [18, 9]], type: 'J' },
    { cells: [[18, 3], [18, 4], [19, 3], [19, 4]], type: 'O' },
    { cells: [[16, 5], [17, 5], [18, 5], [19, 5]], type: 'I' },
    { cells: [[15, 0], [16, 0], [16, 1], [17, 1]], type: 'Z' },
    { cells: [[15, 7], [15, 8], [16, 8], [16, 9]], type: 'S' },
    { cells: [[14, 3], [14, 4], [14, 5], [15, 5]], type: 'L' },
    { cells: [[13, 0], [14, 0], [14, 1], [14, 2]], type: 'J' },
    { cells: [[13, 6], [13, 7], [13, 8], [13, 9]], type: 'I' },
    { cells: [[12, 4], [12, 5], [13, 4], [13, 5]], type: 'O' },
];

// ─── UI STATE (non-game) ──────────────────────────────────────
const uiState = {
    currentTheme: document.documentElement.getAttribute('data-theme') || 'neon-cyberpunk',
    sessionSeconds: 0,
    sessionInterval: null,
    dailyInterval: null,
    fpsInterval: null,
};

// ─── DOM REFS ────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const dom = {
    board: $('tetris-board'),
    overlay: $('board-overlay'),
    btnStart: $('btn-start'),
    btnPause: $('btn-pause'),
    btnRestart: $('btn-restart'),
    statusDot: $('status-dot'),
    statusText: $('status-text'),
    sessionTimer: $('session-timer'),
    fpsCounter: $('fps-counter'),
    dailyTimer: $('daily-timer'),
    toastContainer: $('toast-container'),
};

// ═══════════════════════════════════════════════════════════
// IDLE BOARD (demo splash)
// ═══════════════════════════════════════════════════════════

function buildBoard() {
    dom.board.innerHTML = '';
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');
            if (row % 2 === 0) cell.classList.add('row-even');
            cell.dataset.row = row;
            cell.dataset.col = col;
            dom.board.appendChild(cell);
        }
    }
    paintDemoPieces();
}

function paintDemoPieces() {
    DEMO_PIECES.forEach(piece => {
        piece.cells.forEach(([row, col]) => {
            const cell = dom.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) cell.classList.add('filled', `piece-${piece.type}`);
        });
    });
}

// ═══════════════════════════════════════════════════════════
// STATUS BAR
// ═══════════════════════════════════════════════════════════

function setStatus(status, label) {
    dom.statusDot.className = `status-dot status-dot--${status}`;
    dom.statusText.textContent = label;
}

// ═══════════════════════════════════════════════════════════
// SESSION TIMER
// ═══════════════════════════════════════════════════════════

function startSessionTimer() {
    uiState.sessionSeconds = 0;
    clearInterval(uiState.sessionInterval);
    uiState.sessionInterval = setInterval(() => {
        uiState.sessionSeconds++;
        const m = String(Math.floor(uiState.sessionSeconds / 60)).padStart(2, '0');
        const s = String(uiState.sessionSeconds % 60).padStart(2, '0');
        dom.sessionTimer.textContent = `${m}:${s}`;
    }, 1000);
}

function stopSessionTimer() {
    clearInterval(uiState.sessionInterval);
}

function resetSessionTimer() {
    stopSessionTimer();
    uiState.sessionSeconds = 0;
    dom.sessionTimer.textContent = '00:00';
}

// ═══════════════════════════════════════════════════════════
// FPS DISPLAY
// ═══════════════════════════════════════════════════════════

function startFPSDisplay() {
    clearInterval(uiState.fpsInterval);
    uiState.fpsInterval = setInterval(() => {
        dom.fpsCounter.textContent = 58 + Math.floor(Math.random() * 4);
    }, 1200);
}

function stopFPSDisplay() {
    clearInterval(uiState.fpsInterval);
    dom.fpsCounter.textContent = '60';
}

// ═══════════════════════════════════════════════════════════
// DAILY COUNTDOWN
// ═══════════════════════════════════════════════════════════

function startDailyCountdown() {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    function update() {
        const diff = midnight - new Date();
        if (diff <= 0) { dom.dailyTimer.textContent = '00:00:00'; return; }
        const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
        dom.dailyTimer.textContent = `${h}:${m}:${s}`;
        if (diff < 3_600_000) dom.dailyTimer.classList.add('urgent');
    }

    update();
    uiState.dailyInterval = setInterval(update, 1000);
}

// ═══════════════════════════════════════════════════════════
// HEADER TICKER
// ═══════════════════════════════════════════════════════════

function setupTicker() {
    const ticker = document.querySelector('.header-ticker');
    if (!ticker) return;
    const items = Array.from(ticker.querySelectorAll('span'));
    const inner = document.createElement('div');
    inner.className = 'header-ticker-inner';
    items.forEach(item => inner.appendChild(item));
    items.forEach(item => inner.appendChild(item.cloneNode(true)));
    ticker.innerHTML = '';
    ticker.appendChild(inner);
}

// ═══════════════════════════════════════════════════════════
// OVERLAY
// ═══════════════════════════════════════════════════════════

function showOverlay(title, sub, icon) {
    dom.overlay.querySelector('.overlay-title').textContent = title;
    dom.overlay.querySelector('.overlay-sub').textContent = sub;
    dom.overlay.querySelector('.overlay-icon').textContent = icon;
    dom.overlay.classList.remove('hidden');
}

function hideOverlay() {
    dom.overlay.classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════
// BUTTON STATE MACHINE
// ═══════════════════════════════════════════════════════════

function setButtonStates(status) {
    switch (status) {
        case 'idle':
            dom.btnStart.disabled = false;
            dom.btnPause.disabled = true;
            dom.btnRestart.disabled = false;
            dom.btnStart.querySelector('.btn-text').textContent = 'START GAME';
            dom.btnStart.querySelector('.btn-icon').textContent = '▶';
            dom.btnPause.querySelector('.btn-text').textContent = 'PAUSE';
            dom.btnPause.querySelector('.btn-icon').textContent = '⏸';
            break;

        case 'running':
            dom.btnStart.disabled = true;
            dom.btnPause.disabled = false;
            dom.btnRestart.disabled = false;
            dom.btnPause.querySelector('.btn-text').textContent = 'PAUSE';
            dom.btnPause.querySelector('.btn-icon').textContent = '⏸';
            break;

        case 'paused':
            dom.btnStart.disabled = false;
            dom.btnPause.disabled = false;
            dom.btnRestart.disabled = false;
            dom.btnStart.querySelector('.btn-text').textContent = 'RESUME';
            dom.btnStart.querySelector('.btn-icon').textContent = '▶';
            dom.btnPause.querySelector('.btn-text').textContent = 'RESUME';
            dom.btnPause.querySelector('.btn-icon').textContent = '▶';
            break;

        case 'gameover':
            dom.btnStart.disabled = false;
            dom.btnPause.disabled = true;
            dom.btnRestart.disabled = false;
            dom.btnStart.querySelector('.btn-text').textContent = 'PLAY AGAIN';
            dom.btnStart.querySelector('.btn-icon').textContent = '▶';
            dom.btnPause.querySelector('.btn-text').textContent = 'PAUSE';
            dom.btnPause.querySelector('.btn-icon').textContent = '⏸';
            break;
    }
}

// ═══════════════════════════════════════════════════════════
// THEME SWITCHING
// ═══════════════════════════════════════════════════════════

function switchTheme(theme, isStartup = false) {
    if (!THEMES.includes(theme) || (theme === uiState.currentTheme && !isStartup)) return;
    try {
        localStorage.setItem('neotretis_theme', theme);
    } catch (e) { }

    if (isStartup) {
        document.documentElement.setAttribute('data-theme', theme);
        uiState.currentTheme = theme;
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === theme);
        });
    } else {
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', theme);
            uiState.currentTheme = theme;
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.theme === theme);
            });
            document.body.classList.remove('theme-transitioning');
        }, 50);
        showToast('🎨', `Theme: ${THEME_NAMES[theme]}`);
    }
}

document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => switchTheme(opt.dataset.theme));
});

// ═══════════════════════════════════════════════════════════
// TOASTS
// ═══════════════════════════════════════════════════════════

function showToast(icon, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('out');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
}

// ═══════════════════════════════════════════════════════════
// PIECE PREVIEW BUILDER
// ═══════════════════════════════════════════════════════════

const PIECE_PREVIEWS = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    T: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    S: [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    Z: [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    L: [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
};

function buildPiecePreview(containerId, pieceType, small = false) {
    const container = $(containerId);
    if (!container) return;
    const matrix = PIECE_PREVIEWS[pieceType];
    if (!matrix) return;
    const cellSize = small ? 10 : 14;
    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(4,${cellSize}px);grid-template-rows:repeat(4,${cellSize}px);gap:1px;`;
    matrix.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement('div');
            div.style.cssText = `width:${cellSize}px;height:${cellSize}px;border-radius:2px;`;
            if (cell) {
                div.classList.add(`piece-${pieceType}`);
                div.style.background = `var(--piece-${pieceType})`;
                div.style.boxShadow = `0 0 4px var(--piece-${pieceType})`;
                div.style.opacity = '0.9';
            }
            grid.appendChild(div);
        });
    });
    container.innerHTML = '';
    container.appendChild(grid);
}

// ═══════════════════════════════════════════════════════════
// LEVEL PIPS
// ═══════════════════════════════════════════════════════════

function updateLevelPips(active) {
    document.querySelectorAll('.level-pips .pip').forEach((pip, i) => {
        pip.classList.toggle('active', i < active);
    });
}

// ═══════════════════════════════════════════════════════════
// COMBO DISPLAY
// ═══════════════════════════════════════════════════════════

function updateComboDisplay(combo) {
    const valEl = $('combo-val');
    const flame = $('combo-flame');
    const dots = document.querySelectorAll('.combo-hist-dot');
    if (valEl) {
        valEl.textContent = `x${combo}`;
        if (combo > 0) {
            valEl.classList.add('combo-bounce');
            setTimeout(() => valEl.classList.remove('combo-bounce'), 500);
        }
    }
    if (flame) flame.classList.toggle('active', combo > 0);
    dots.forEach((dot, i) => dot.classList.toggle('active', i < combo));
}

// ═══════════════════════════════════════════════════════════
// SCORE DISPLAY
// ═══════════════════════════════════════════════════════════

function updateScore(score, max = 100000) {
    const el = $('score-val');
    const bar = $('score-bar');
    if (el) {
        el.textContent = String(score).padStart(6, '0');
        el.classList.add('score-pop');
        setTimeout(() => el.classList.remove('score-pop'), 500);
    }
    if (bar) bar.style.width = `${Math.min(100, (score / max) * 100)}%`;
}

// ═══════════════════════════════════════════════════════════
// NeoTetrisUI BRIDGE
// Populated before Engine construction so Renderer finds it
// immediately on first _resolveUI() call.
// ═══════════════════════════════════════════════════════════

window.NeoTetrisUI = {
    updateScore,
    updateComboDisplay,
    updateLevelPips,
    buildPiecePreview,
    switchTheme,
    showToast,
    setStatus,
};

// ═══════════════════════════════════════════════════════════
// ENGINE UI CALLBACKS
// Injected into Engine so it can drive UI without importing main.js
// (avoids circular dependency: main -> engine -> main).
// ═══════════════════════════════════════════════════════════

const engineUICallbacks = {
    onStart() {
        const existing = document.querySelector('.gameover-modal-overlay');
        if (existing) existing.remove();

        hideOverlay();
        setStatus('active', 'RUNNING');
        setButtonStates('running');
        startSessionTimer();
        startFPSDisplay();
        showToast('🚀', 'Game started! Good luck!');
    },

    onPause() {
        showOverlay('PAUSED', 'Press RESUME to continue', '⏸');
        setStatus('paused', 'PAUSED');
        setButtonStates('paused');
        stopSessionTimer();
        stopFPSDisplay();
        showToast('⏸', 'Game paused');
    },

    onResume() {
        hideOverlay();
        setStatus('active', 'RUNNING');
        setButtonStates('running');
        startSessionTimer();
        startFPSDisplay();
        showToast('▶', 'Game resumed');
    },

    onGameOver(score) {
        setStatus('idle', 'GAME OVER');
        setButtonStates('gameover');
        stopSessionTimer();
        stopFPSDisplay();

        const existing = document.querySelector('.gameover-modal-overlay');
        if (existing) existing.remove();

        const boardFrame = document.querySelector('.board-frame');
        if (boardFrame && engine) {
            const lines = engine._score.lines;
            const level = engine._score.level;
            const bestCombo = engine._session.maxCombo;

            // Get unlocked achievements
            const unlockedDefs = ACHIEVEMENT_DEFS.filter(d => engine._achieve._state[d.id]?.unlocked);
            const achvIcons = unlockedDefs.length > 0
                ? unlockedDefs.map(d => `<span class="gameover-achv-tag" title="${d.name}">${d.icon}</span>`).join('')
                : '<span style="font-size:9px;color:var(--clr-text-dim);">None this game</span>';

            const modal = document.createElement('div');
            modal.className = 'gameover-modal-overlay animate-modal-overlay';
            modal.innerHTML = `
                <div class="gameover-modal-body animate-modal-body">
                    <h2 class="gameover-title">GAME OVER</h2>
                    <p class="gameover-subtitle">Premium Session Ended</p>
                    <div class="gameover-stats-grid">
                        <div class="gameover-stat-row">
                            <span class="gameover-stat-label">FINAL SCORE</span>
                            <span class="gameover-stat-val highlight">${score.toLocaleString()}</span>
                        </div>
                        <div class="gameover-stat-row">
                            <span class="gameover-stat-label">LINES CLEARED</span>
                            <span class="gameover-stat-val">${lines}</span>
                        </div>
                        <div class="gameover-stat-row">
                            <span class="gameover-stat-label">LEVEL REACHED</span>
                            <span class="gameover-stat-val">${level}</span>
                        </div>
                        <div class="gameover-stat-row">
                            <span class="gameover-stat-label">BEST STREAK</span>
                            <span class="gameover-stat-val">${bestCombo}x</span>
                        </div>
                        <div class="gameover-stat-row" style="flex-direction:column; align-items:flex-start; gap:4px;">
                            <span class="gameover-stat-label">ACHIEVEMENTS EARNED</span>
                            <div class="gameover-achv-summary">${achvIcons}</div>
                        </div>
                    </div>
                    <button class="btn btn-start btn-gameover-restart" id="btn-gameover-restart">
                        <span class="btn-icon">↺</span>
                        <span class="btn-text">PLAY AGAIN</span>
                    </button>
                </div>
            `;
            boardFrame.appendChild(modal);

            const modalRestart = modal.querySelector('#btn-gameover-restart');
            modalRestart.addEventListener('click', () => {
                modal.remove();
                engine?.start();
            });
        } else {
            showOverlay(
                'GAME OVER',
                `Final Score: ${String(score).padStart(6, '0')}`,
                '💀'
            );
        }

        showToast('💀', `Game over! Score: ${score.toLocaleString()}`, 5000);
    },

    onRestart() {
        const existing = document.querySelector('.gameover-modal-overlay');
        if (existing) existing.remove();

        buildBoard();
        showOverlay('READY TO PLAY', 'Press START to begin your session', '▶');
        setStatus('idle', 'IDLE');
        setButtonStates('idle');
        resetSessionTimer();
        stopFPSDisplay();
        showToast('↺', 'Game reset');
    },

    showToast,
};

// ═══════════════════════════════════════════════════════════
// ENGINE INSTANCE
// ═══════════════════════════════════════════════════════════

let engine = null;

// ═══════════════════════════════════════════════════════════
// BUTTON WIRING
// ═══════════════════════════════════════════════════════════

dom.btnStart.addEventListener('click', () => engine?.start());
dom.btnPause.addEventListener('click', () => engine?.togglePause());
dom.btnRestart.addEventListener('click', () => engine?.restart());

// ═══════════════════════════════════════════════════════════
// SOFT-DROP RELEASE
// ArrowDown keyup must reach the engine even when input.js
// DAS/ARR is handling the keydown repeat, so it lives here.
// ═══════════════════════════════════════════════════════════

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
        engine?.onSoftDropRelease();
    }
});

// ═══════════════════════════════════════════════════════════
// GLOBAL KEYBOARD SHORTCUTS
// Enter = start/resume. R = restart.
// Escape is handled inside InputHandler during active gameplay;
// this handles the case when input is detached (idle/gameover).
// ═══════════════════════════════════════════════════════════

window.addEventListener('keydown', e => {
    if (!engine) return;
    if (e.key === 'Enter') {
        engine.start();
    }
    if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        engine.restart();
    }
});

// ═══════════════════════════════════════════════════════════
// ACHIEVEMENT CURSOR (cosmetic, unchanged)
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.achievement-item').forEach(item => {
    item.style.cursor = 'pointer';
});

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

function init() {
    // 1. Idle board demo splash
    buildBoard();

    // 2. UI chrome
    setupTicker();
    setButtonStates('idle');
    startDailyCountdown();
    updateLevelPips(1);

    // 3. Idle overlay
    showOverlay('READY TO PLAY', 'Press START to begin your session', '▶');

    // 3.5 Restore saved theme settings from localStorage
    try {
        const savedTheme = localStorage.getItem('neotretis_theme');
        if (savedTheme) {
            switchTheme(savedTheme, true);
        }
    } catch (e) { }

    // 4. NeoTetrisUI already populated above module scope — re-assert here
    //    in case any lazy module resolved before reaching this point.
    window.NeoTetrisUI = {
        updateScore,
        updateComboDisplay,
        updateLevelPips,
        buildPiecePreview,
        switchTheme,
        showToast,
        setStatus,
    };

    // 5. Construct engine (Renderer.init() is called inside engine.start(),
    //    NOT here — so the demo board stays visible until the player clicks Start)
    engine = new Engine(dom.board, engineUICallbacks);

    // 5.5 Inject and wire up the audio settings panel dynamically below the theme-card
    const themeCard = document.querySelector('.theme-card');
    if (themeCard) {
        const audioCard = document.createElement('div');
        audioCard.className = 'card audio-card';
        audioCard.innerHTML = `
            <div class="card-header">
                <span class="card-icon">🔊</span>
                <h3 class="card-title">AUDIO SETTINGS</h3>
            </div>
            <div class="audio-controls-wrap-vertical">
                <div class="audio-row">
                    <button class="btn-audio-toggle" id="btn-audio-toggle">🔊</button>
                    <span class="audio-label">MUTE ALL</span>
                </div>
                <div class="slider-row">
                    <span class="audio-label">MASTER</span>
                    <input type="range" class="volume-slider" id="volume-master" min="0" max="1" step="0.05" value="0.5">
                </div>
                <div class="slider-row">
                    <span class="audio-label">MUSIC</span>
                    <input type="range" class="volume-slider" id="volume-music" min="0" max="1" step="0.05" value="0.5">
                </div>
                <div class="slider-row">
                    <span class="audio-label">SFX</span>
                    <input type="range" class="volume-slider" id="volume-sfx" min="0" max="1" step="0.05" value="0.5">
                </div>
            </div>
        `;
        themeCard.parentNode.insertBefore(audioCard, themeCard.nextSibling);

        const audioToggle = document.getElementById('btn-audio-toggle');
        const volMaster = document.getElementById('volume-master');
        const volMusic = document.getElementById('volume-music');
        const volSFX = document.getElementById('volume-sfx');
        const audio = window.NeoTetrisAudio;

        if (audio && audioToggle && volMaster && volMusic && volSFX) {
            volMaster.value = audio.volumeMaster;
            volMusic.value = audio.volumeMusic;
            volSFX.value = audio.volumeSFX;
            audioToggle.textContent = audio.muted ? '🔇' : '🔊';

            audioToggle.addEventListener('click', () => {
                const isMuted = audio.toggleMute();
                audioToggle.textContent = isMuted ? '🔇' : '🔊';
            });

            const updateMuteIcon = () => {
                audioToggle.textContent = audio.muted ? '🔇' : '🔊';
            };

            volMaster.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                audio.volumeMaster = vol;
                if (vol > 0 && audio.muted) {
                    audio.toggleMute();
                    updateMuteIcon();
                } else if (vol === 0 && !audio.muted) {
                    audio.toggleMute();
                    updateMuteIcon();
                }
            });

            volMusic.addEventListener('input', (e) => {
                audio.volumeMusic = parseFloat(e.target.value);
            });

            volSFX.addEventListener('input', (e) => {
                audio.volumeSFX = parseFloat(e.target.value);
            });
        }
    }

    // 6. Welcome toast
    setTimeout(() => {
        showToast('🎮', 'Welcome to NeoTetris Premium!', 4000);
        window.NeoTetrisAudio?.playAchievement();
    }, 800);

    console.log(
        '%c NeoTetris Engine Ready ',
        'background:#00f5ff;color:#000;font-weight:bold;padding:4px 8px;border-radius:4px;'
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}