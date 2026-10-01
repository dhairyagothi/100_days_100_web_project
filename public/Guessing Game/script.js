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

        // Timer variables
        this.startTime = null;
        this.timerInterval = null;
        this.currentTime = 0;

        // Sound system
        this.audioCtx = null;

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
        this.timerEl = document.getElementById('timer');

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

    // ================= SOUND SYSTEM =================
    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSound(type) {
        try {
            this.initAudio();
            
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            
            gainNode.gain.value = 0.15;

            switch(type) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(523, this.audioCtx.currentTime);
                    oscillator.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(784, this.audioCtx.currentTime + 0.2);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
                    oscillator.start(this.audioCtx.currentTime);
                    oscillator.stop(this.audioCtx.currentTime + 0.4);
                    break;
                    
                case 'wrong':
                    oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime);
                    oscillator.frequency.setValueAtTime(300, this.audioCtx.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(200, this.audioCtx.currentTime + 0.2);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
                    oscillator.start(this.audioCtx.currentTime);
                    oscillator.stop(this.audioCtx.currentTime + 0.3);
                    break;
                    
                case 'win':
                    const notes = [523, 659, 784, 1047];
                    notes.forEach((freq, i) => {
                        const osc = this.audioCtx.createOscillator();
                        const gain = this.audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(this.audioCtx.destination);
                        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.1);
                        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime + i * 0.1);
                        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + i * 0.1 + 0.2);
                        osc.start(this.audioCtx.currentTime + i * 0.1);
                        osc.stop(this.audioCtx.currentTime + i * 0.1 + 0.2);
                    });
                    break;
                    
                case 'gameover':
                    oscillator.frequency.setValueAtTime(500, this.audioCtx.currentTime);
                    oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime + 0.2);
                    oscillator.frequency.setValueAtTime(300, this.audioCtx.currentTime + 0.4);
                    oscillator.frequency.setValueAtTime(200, this.audioCtx.currentTime + 0.6);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);
                    oscillator.start(this.audioCtx.currentTime);
                    oscillator.stop(this.audioCtx.currentTime + 0.8);
                    break;

                case 'hint':
                    oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
                    oscillator.start(this.audioCtx.currentTime);
                    oscillator.stop(this.audioCtx.currentTime + 0.1);
                    break;
                    
                default:
                    oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
                    oscillator.start(this.audioCtx.currentTime);
                    oscillator.stop(this.audioCtx.currentTime + 0.05);
            }
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }

    // ================= TIMER SYSTEM =================
    startTimer() {
        // Reset and start fresh
        this.startTime = Date.now();
        this.currentTime = 0;
        
        // Clear any existing interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Update timer immediately
        this.timerEl.textContent = '0s';
        
        // Start new interval
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.currentTime = elapsed;
                this.timerEl.textContent = this.formatTime(elapsed);
            }
        }, 200);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetTimer() {
        this.stopTimer();
        this.startTime = null;
        this.currentTime = 0;
        if (this.timerEl) {
            this.timerEl.textContent = '0s';
        }
    }

    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}m ${secs}s`;
        }
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

        const colors = ['#00ff9d', '#4da3ff', '#ffcc00', '#ff4d4d', '#ffffff', '#ff6b6b', '#ffd93d', '#6bcb77'];

        const pieces = Array.from({ length: 150 }).map(() => ({
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

        setTimeout(() => {
            if (canvas.parentNode) {
                document.body.removeChild(canvas);
            }
        }, 5000);
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
        
        // Reset and start timer
        this.resetTimer();
        this.startTimer();
        
        // Play hint sound
        this.playSound('hint');
    }

    makeGuess() {
        const guess = parseInt(this.guessInput.value);

        if (isNaN(guess)) {
            this.showMessage('Enter valid number', 'error');
            this.playSound('wrong');
            return;
        }

        if (guess < this.range.min || guess > this.range.max) {
            this.showMessage(`Enter between ${this.range.min}-${this.range.max}`, 'error');
            this.playSound('wrong');
            return;
        }

        if (this.guessHistory.includes(guess)) {
            this.showMessage('Already guessed', 'warning');
            this.playSound('wrong');
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
        this.guessInput.focus();
    }

    // ================= WIN =================
    handleWin() {
        this.stopTimer();
        
        const timeTaken = this.currentTime;
        this.showMessage(`🎉 You Won in ${this.attempts} attempts and ${this.formatTime(timeTaken)}!`, 'success');

        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        this.updateHint('🏆 Correct!');

        this.playSound('win');
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
        this.stopTimer();
        
        const timeTaken = this.currentTime;
        this.showMessage(`💀 Game Over! Number was ${this.secretNumber}`, 'error');

        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        this.updateHint(`Answer: ${this.secretNumber}`);

        this.playSound('gameover');

        this.gamesPlayed++;
        this.saveAnalytics();
        this.updateAnalytics();
    }

    handleHint(guess) {
        const diff = Math.abs(this.secretNumber - guess);

        let msg = guess < this.secretNumber ? "📈 Too low" : "📉 Too high";

        if (diff < 5) msg += " 🔥🔥🔥 Super Hot!";
        else if (diff < 10) msg += " 🔥 Hot";
        else if (diff < 20) msg += " 🌡️ Warm";
        else if (diff < 40) msg += " ❄️ Cold";
        else msg += " 🥶 Freezing";

        this.showMessage(msg, 'info');
        this.playSound('hint');
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

        this.messageEl.style.color = colors[type] || '#ffffff';
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