class GuessingGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.maxAttempts = 10;
        this.guessHistory = [];

        this.bestScore = parseInt(localStorage.getItem('bestScore')) || null;

        this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
        this.gamesWon = parseInt(localStorage.getItem('gamesWon')) || 0;

        this.theme = localStorage.getItem('theme') || 'dark';

        this.difficulty = 'medium';
        this.range = { min: 1, max: 100 };

        this.initializeElements();
        this.setupEventListeners();

        this.initTheme();
        this.newGame();
        this.updateBestScoreDisplay();
        this.updateAnalytics();
    }

    // ================= DOM =================
    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.messageEl = document.getElementById('message');
        this.attemptsEl = document.getElementById('attempts');
        this.bestScoreEl = document.getElementById('bestScore');
        this.hintEl = document.getElementById('hint');
        this.historyListEl = document.getElementById('historyList');

        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');

        this.gamesPlayedEl = document.getElementById('gamesPlayed');
        this.gamesWonEl = document.getElementById('gamesWon');
        this.winRateEl = document.getElementById('winRate');

        this.themeToggle = document.getElementById('themeToggle');
    }

    setupEventListeners() {
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.resetBtn.addEventListener('click', () => this.newGame());

        this.guessInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(e.target.dataset.diff);
            });
        });

        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    // ================= CONFETTI =================
    launchConfetti() {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#00ff9d', '#4da3ff', '#ffcc00', '#ff4d4d', '#ffffff'];

        const pieces = Array.from({ length: 120 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 120,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10
        }));

        let angle = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            angle += 0.01;

            pieces.forEach(p => {
                p.y += Math.cos(angle + p.d) + 2;
                p.x += Math.sin(angle) * 2;

                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            if (pieces.every(p => p.y > canvas.height)) {
                document.body.removeChild(canvas);
                return;
            }

            requestAnimationFrame(draw);
        };

        draw();

        // auto cleanup fallback
        setTimeout(() => {
            canvas.remove();
        }, 4000);
    }

    // ================= THEME =================
    initTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light');
        }
        this.updateThemeButton();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.classList.toggle('light');
        localStorage.setItem('theme', this.theme);
        this.updateThemeButton();
    }

    updateThemeButton() {
        if (this.themeToggle) {
            this.themeToggle.textContent =
                this.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
        }
    }

    // ================= GAME =================
    setDifficulty(level) {
        this.difficulty = level;

        switch (level) {
            case 'easy': this.range = { min: 1, max: 50 }; break;
            case 'medium': this.range = { min: 1, max: 100 }; break;
            case 'hard': this.range = { min: 1, max: 200 }; break;
        }

        this.difficultyBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.diff === level);
        });

        this.newGame();
    }

    newGame() {
        this.secretNumber =
            Math.floor(Math.random() *
            (this.range.max - this.range.min + 1)) +
            this.range.min;

        this.attempts = 0;
        this.guessHistory = [];

        this.updateAttemptsDisplay();
        this.updateHistoryDisplay();

        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.guessInput.value = '';

        this.showMessage(
            `Guess between ${this.range.min}-${this.range.max}`,
            'info'
        );

        this.updateHint('🤔');
    }

    makeGuess() {
        const guess = parseInt(this.guessInput.value);

        if (isNaN(guess)) {
            this.showMessage('Enter valid number', 'error');
            return;
        }

        if (this.guessHistory.includes(guess)) {
            this.showMessage('Already guessed', 'warning');
            return;
        }

        this.attempts++;
        this.guessHistory.push(guess);

        this.updateAttemptsDisplay();
        this.updateHistoryDisplay();

        if (guess === this.secretNumber) {
            this.handleWin();
        } else if (this.attempts >= this.maxAttempts) {
            this.handleLoss();
        } else {
            this.handleHint(guess);
        }

        this.guessInput.value = '';
    }

    // ================= WIN =================
    handleWin() {
        this.showMessage(`🎉 You Won in ${this.attempts} attempts!`, 'success');

        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        this.updateHint('🏆 Correct!');

        // 🎉 CONFETTI TRIGGER
        this.launchConfetti();

        if (!this.bestScore || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            localStorage.setItem('bestScore', this.bestScore);
            this.updateBestScoreDisplay();
        }

        this.gamesPlayed++;
        this.gamesWon++;

        this.saveAnalytics();
        this.updateAnalytics();
    }

    handleLoss() {
        this.showMessage(`💀 Game Over! Number was ${this.secretNumber}`, 'error');

        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        this.updateHint(`Answer: ${this.secretNumber}`);

        this.gamesPlayed++;
        this.saveAnalytics();
        this.updateAnalytics();
    }

    handleHint(guess) {
        const diff = Math.abs(this.secretNumber - guess);

        let msg = guess < this.secretNumber ? "📈 Too low" : "📉 Too high";

        if (diff < 10) msg += " 🔥 Hot";
        else if (diff < 20) msg += " 🌡️ Warm";
        else msg += " ❄️ Cold";

        this.showMessage(msg, 'info');
    }

    // ================= UI =================
    showMessage(msg, type) {
        this.messageEl.textContent = msg;

        const colors = {
            success: '#00ff9d',
            error: '#ff4d4d',
            warning: '#ffb84d',
            info: '#4da3ff'
        };

        this.messageEl.style.color = colors[type];
    }

    updateHint(h) {
        this.hintEl.textContent = h;
    }

    updateAttemptsDisplay() {
        this.attemptsEl.textContent =
            `${this.attempts}/${this.maxAttempts}`;
    }

    updateBestScoreDisplay() {
        this.bestScoreEl.textContent = this.bestScore || '-';
    }

    updateHistoryDisplay() {
        this.historyListEl.innerHTML = '';
        this.guessHistory.forEach(n => {
            const el = document.createElement('span');
            el.className = 'history-item';
            el.textContent = n;
            this.historyListEl.appendChild(el);
        });
    }

    // ================= ANALYTICS =================
    saveAnalytics() {
        localStorage.setItem('gamesPlayed', this.gamesPlayed);
        localStorage.setItem('gamesWon', this.gamesWon);
    }

    updateAnalytics() {
        if (!this.gamesPlayedEl) return;

        this.gamesPlayedEl.textContent = this.gamesPlayed;
        this.gamesWonEl.textContent = this.gamesWon;

        const rate = this.gamesPlayed
            ? Math.round((this.gamesWon / this.gamesPlayed) * 100)
            : 0;

        this.winRateEl.textContent = rate + '%';
    }
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    new GuessingGame();
});