class GuessingGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.maxAttempts = 10;
        this.guessHistory = [];
        this.bestScore = this.getStoredBestScore();
        this.difficulty = 'medium';
        this.range = { min: 1, max: 100 };
        
        this.initializeElements();
        this.setupEventListeners();
        this.newGame();
        this.updateBestScoreDisplay();
    }
    
    initializeElements() {
        // Fix 3: DOM Safety Checks - Ensure all elements exist before use
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.messageEl = document.getElementById('message');
        this.attemptsEl = document.getElementById('attempts');
        this.bestScoreEl = document.getElementById('bestScore');
        this.hintEl = document.getElementById('hint');
        this.historyListEl = document.getElementById('historyList');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    }
    
    setupEventListeners() {
        // Fix 2: Using modern keydown API instead of deprecated keypress
        if (this.guessBtn) {
            this.guessBtn.addEventListener('click', () => this.makeGuess());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.newGame());
        }
        if (this.guessInput) {
            // Modern keydown event with Enter key detection
            this.guessInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.makeGuess();
                }
            });
        }
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Fix 3: DOM Safety Check - ensure event target has dataset
                if (e.target && e.target.dataset && e.target.dataset.diff) {
                    this.setDifficulty(e.target.dataset.diff);
                }
            });
        });
    }
    
    setDifficulty(level) {
        this.difficulty = level;
        
        switch(level) {
            case 'easy':
                this.range = { min: 1, max: 50 };
                break;
            case 'medium':
                this.range = { min: 1, max: 100 };
                break;
            case 'hard':
                this.range = { min: 1, max: 200 };
                break;
        }
        
        this.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.diff === level) {
                btn.classList.add('active');
            }
        });
        
        this.newGame();
        this.showMessage(`Difficulty changed to ${level.toUpperCase()}! Range: ${this.range.min}-${this.range.max}`, 'info');
    }
    
    newGame() {
        this.secretNumber = Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
        this.attempts = 0;
        this.guessHistory = [];
        this.updateAttemptsDisplay();
        this.updateHistoryDisplay();
        this.showMessage(`🎮 New game started! Guess between ${this.range.min} and ${this.range.max}`, 'success');
        this.updateHint('');
        if (this.guessInput) {
            this.guessInput.value = '';
            this.guessInput.disabled = false;
            this.guessInput.focus();
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = false;
        }
    }
    
    makeGuess() {
        // Fix 3: DOM Safety Check - ensure guessInput exists and has value
        if (!this.guessInput || !this.guessInput.value) {
            this.showMessage('❌ Please enter a valid number!', 'error');
            return;
        }

        // Fix 5: Explicit radix 10 for consistent base-10 parsing
        const guess = parseInt(this.guessInput.value.trim(), 10);
        
        // Ensure valid finite number
        if (isNaN(guess) || !Number.isFinite(guess)) {
            this.showMessage('❌ Please enter a valid number!', 'error');
            return;
        }
        
        if (guess < this.range.min || guess > this.range.max) {
            this.showMessage(`❌ Please guess between ${this.range.min} and ${this.range.max}!`, 'error');
            return;
        }
        
        if (this.guessHistory.includes(guess)) {
            this.showMessage('⚠️ You already guessed that number!', 'warning');
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
            this.handleIncorrectGuess(guess);
        }
        
        if (this.guessInput) {
            this.guessInput.value = '';
            this.guessInput.focus();
        }
    }
    
    handleWin() {
        this.showMessage(`🎉 Congratulations! You guessed it in ${this.attempts} attempts! 🎉`, 'success');
        if (this.guessInput) {
            this.guessInput.disabled = true;
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = true;
        }
        this.updateHint('🎯 Perfect guess!');
        
        if (this.bestScore === null || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            // Fix 1: bestScore Type Consistency - Ensure proper string storage in localStorage
            try {
                localStorage.setItem('bestScore', String(this.bestScore));
            } catch (error) {
                // Fix 4: Console Logging Security - Log error without exposing secret data
                console.error('Error saving best score:', error.message);
            }
            this.updateBestScoreDisplay();
            this.showMessage(`🏆 New record! Best score: ${this.bestScore} attempts!`, 'success');
        }
    }
    
    handleLoss() {
        this.showMessage(`😔 Game Over! The number was ${this.secretNumber}.`, 'error');
        if (this.guessInput) {
            this.guessInput.disabled = true;
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = true;
        }
        this.updateHint(`💡 The number was ${this.secretNumber}`);
    }
    
    handleIncorrectGuess(guess) {
        const difference = Math.abs(this.secretNumber - guess);
        let hint = '';
        let message = '';
        
        if (guess < this.secretNumber) {
            message = `📈 ${guess} is too low!`;
            hint = '📈 Go higher!';
        } else {
            message = `📉 ${guess} is too high!`;
            hint = '📉 Go lower!';
        }
        
        if (difference <= 5) {
            message += ' 🔥 Extremely close!';
            hint += ' 🔥 Burning hot!';
        } else if (difference <= 10) {
            message += ' 🎯 Very close!';
            hint += ' 🎯 Getting warmer!';
        } else if (difference <= 20) {
            message += ' 📍 Getting closer!';
            hint += ' 📍 Warm!';
        } else {
            message += ' ❄️ Too far!';
            hint += ' ❄️ Cold!';
        }
        
        message += ` (${this.maxAttempts - this.attempts} attempts left)`;
        
        this.showMessage(message, 'info');
        this.updateHint(hint);
    }
    
    showMessage(msg, type) {
        if (this.messageEl) {
            this.messageEl.textContent = msg;
            const colors = {
                success: '#48bb78',
                error: '#f56565',
                warning: '#ed8936',
                info: '#4299e1'
            };
            this.messageEl.style.color = colors[type] || '#4a5568';
        }
    }
    
    updateHint(hint) {
        if (this.hintEl) {
            this.hintEl.textContent = hint || '🤔';
        }
    }
    
    updateAttemptsDisplay() {
        if (this.attemptsEl) {
            this.attemptsEl.textContent = `${this.attempts}/${this.maxAttempts}`;
        }
    }
    
    updateBestScoreDisplay() {
        if (this.bestScoreEl) {
            this.bestScoreEl.textContent = this.bestScore !== null ? this.bestScore : '-';
        }
    }
    
    updateHistoryDisplay() {
        if (this.historyListEl) {
            this.historyListEl.innerHTML = '';
            this.guessHistory.forEach(guess => {
                const historyItem = document.createElement('span');
                historyItem.className = 'history-item';
                historyItem.textContent = guess;
                this.historyListEl.appendChild(historyItem);
            });
        }
    }

    getStoredBestScore() {
        // Fix 1: bestScore Type Consistency - safe retrieval from localStorage
        try {
            const storedScore = localStorage.getItem('bestScore');
            if (storedScore === null || storedScore === undefined) return null;

            // Fix 5: Explicit radix handling for numeric conversion
            // Use parseInt with explicit radix to ensure integer conversion
            const parsedScore = parseInt(storedScore, 10);
            // Ensure it's a valid positive integer
            return Number.isInteger(parsedScore) && parsedScore > 0 ? parsedScore : null;
        } catch (error) {
            // Fix 3: DOM Safety - handle potential localStorage access errors
            // Fix 4: Console Logging Security - Log error without exposing secret data
            console.error('Error accessing bestScore from localStorage');
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GuessingGame();
});
