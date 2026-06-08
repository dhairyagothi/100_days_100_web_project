class GuessingGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.maxAttempts = 10;
        this.guessHistory = [];
        const storedBestScore = localStorage.getItem('bestScore'); 
        this.bestScore = storedBestScore ? parseInt(storedBestScore, 10) : null;
        this.difficulty = 'medium';
        this.range = { min: 1, max: 100 };
        
        this.initializeElements(); 
        if (!this.guessInput || !this.guessBtn || !this.resetBtn || 
            !this.messageEl || !this.attemptsEl || !this.bestScoreEl 
            || !this.hintEl || !this.historyListEl ) {
                console.error('Required DOM elements are missing.'); 
                return; 
            }
        this.setupEventListeners(); 
        this.newGame(); 
        this.updateBestScoreDisplay();
    }
    
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
    }
    
    setupEventListeners() {
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.resetBtn.addEventListener('click', () => this.newGame());
        this.guessInput.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter') { 
                this.makeGuess(); } });
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(e.target.dataset.diff);
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
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.showMessage(`🎮 New game started! Guess between ${this.range.min} and ${this.range.max}`, 'success');
        this.updateHint('');
        this.guessInput.focus();
        
        if (window.location.hostname === 'localhost') {
            console.log(`Secret number: ${this.secretNumber}`);
        }
    }
    
    makeGuess() {
        const guess = parseInt(this.guessInput.value);
        
        if (isNaN(guess)) {
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
        
        this.guessInput.value = '';
        this.guessInput.focus();
    }
    
    handleWin() {
        this.showMessage(`🎉 Congratulations! You guessed it in ${this.attempts} attempts! 🎉`, 'success');
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;
        this.updateHint('🎯 Perfect guess!');
        
        if (!this.bestScore || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            localStorage.setItem('bestScore', this.bestScore);
            this.updateBestScoreDisplay();
            this.showMessage(`🏆 New record! Best score: ${this.bestScore} attempts!`, 'success');
        }
    }
    
    handleLoss() {
        this.showMessage(`😔 Game Over! The number was ${this.secretNumber}.`, 'error');
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;
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
        this.messageEl.textContent = msg;
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };
        this.messageEl.style.color = colors[type] || '#4a5568';
    }
    
    updateHint(hint) {
        this.hintEl.textContent = hint || '🤔';
    }
    
    updateAttemptsDisplay() {
        this.attemptsEl.textContent = `${this.attempts}/${this.maxAttempts}`;
    }
    
    updateBestScoreDisplay() {
        this.bestScoreEl.textContent = this.bestScore || '-';
    }
    
    updateHistoryDisplay() {
        this.historyListEl.innerHTML = '';
        this.guessHistory.forEach(guess => {
            const historyItem = document.createElement('span');
            historyItem.className = 'history-item';
            historyItem.textContent = guess;
            this.historyListEl.appendChild(historyItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GuessingGame();
});