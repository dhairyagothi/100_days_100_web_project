/**
 * UI Module - User interface management and DOM manipulation
 */

const UI = {
    // Screen elements
    screens: {
        welcome: null,
        game: null,
        result: null,
        final: null
    },
    
    /**
     * Initialize UI and attach event listeners
     */
    init() {
        // Cache screen elements
        this.screens.welcome = document.getElementById('welcomeScreen');
        this.screens.game = document.getElementById('gameScreen');
        this.screens.result = document.getElementById('resultScreen');
        this.screens.final = document.getElementById('finalScreen');

        // Pin mode state
        this.pinMode = false;
        
        // Set initial theme
        const savedTheme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update stats on welcome screen
        this.updateWelcomeStats();
        
        // Attach event listeners
        this.attachEventListeners();
    },
    
    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Difficulty selection
        document.querySelectorAll('.btn-difficulty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(e.currentTarget);
            });
        });
        
        // Start game
        document.getElementById('startGameBtn').addEventListener('click', () => {
            const difficulty = document.querySelector('.btn-difficulty.active').dataset.difficulty;
            this.startGame(difficulty);
        });
        
        // More hints button
        document.getElementById('showMoreHints').addEventListener('click', () => {
            Game.showMoreHints();
        });
        
        // Confirm guess button
        document.getElementById('confirmGuessBtn').addEventListener('click', () => {
            Game.confirmGuess();
        });
        
        // Next round button
        document.getElementById('nextRoundBtn').addEventListener('click', () => {
            Game.nextRound();
        });
        
        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            const difficulty = Game.getState().difficulty;
            this.startGame(difficulty);
        });
        
        // Back to menu button
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showWelcomeScreen();
            this.updateWelcomeStats();
        });
    },
    
    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.setTheme(newTheme);
    },
    
    /**
     * Select difficulty level
     * @param {HTMLElement} button
     */
    selectDifficulty(button) {
        document.querySelectorAll('.btn-difficulty').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    },
    
    /**
     * Start a new game
     * @param {string} difficulty
     */
    startGame(difficulty) {
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            alert('Map library is not loaded. Please refresh the page.');
            return;
        }
        
        // Show game screen first
        this.showGameScreen();
        
        // Initialize map first if not already done
        if (!MapManager.map) {
            setTimeout(() => {
                const mapInitialized = MapManager.init('map');
                if (mapInitialized !== null) {
                    // Set up map click handler (always active, only once)
                    if (!MapManager._clickHandlerAttached) {
                        MapManager.onMapClick((coords) => {
                            Game.makeGuess(coords);
                        });
                        MapManager._clickHandlerAttached = true;
                    }
                    Game.init(difficulty);
                } else {
                    console.error('Failed to initialize map');
                }
            }, 150);
        } else {
            Game.init(difficulty);
        }
    },

    /**
     * Enable pin mode (user can click map to place guess)
     */
    enablePinMode() {
        this.pinMode = true;
        const pinStatus = document.getElementById('pinModeStatus');
        if (pinStatus) pinStatus.style.display = '';
    },

    /**
     * Disable pin mode (after pin is placed)
     */
    disablePinMode() {
        this.pinMode = false;
        const pinBtn = document.getElementById('pinLocationBtn');
        const pinStatus = document.getElementById('pinModeStatus');
        if (pinBtn) pinBtn.disabled = false;
        if (pinStatus) pinStatus.style.display = 'none';
    },
    
    /**
     * Show welcome screen
     */
    showWelcomeScreen() {
        this.hideAllScreens();
        this.screens.welcome.classList.remove('hidden');
        document.getElementById('totalScore').textContent = '0';
    },
    
    /**
     * Show game screen
     */
    showGameScreen() {
        this.hideAllScreens();
        this.screens.game.classList.remove('hidden');

        // Invalidate map size after screen is shown
        if (MapManager.map) {
            setTimeout(() => {
                MapManager.map.invalidateSize();
            }, 100);
        }
    },
    
    /**
     * Show result screen
     * @param {Object} data - Result data
     */
    showResultScreen(data) {
        this.hideAllScreens();
        this.screens.result.classList.remove('hidden');
        
        // Update result display
        document.getElementById('resultIcon').textContent = Utils.getResultIcon(data.distance);
        document.getElementById('resultTitle').textContent = Utils.getResultTitle(data.distance);
        document.getElementById('distanceValue').textContent = Utils.formatNumber(data.distance) + ' km';
        document.getElementById('roundScore').textContent = Utils.formatNumber(data.score);
        document.getElementById('resultTotalScore').textContent = Utils.formatNumber(data.totalScore);
        document.getElementById('actualLocationName').textContent = data.locationName;
        
        // Update header score
        document.getElementById('totalScore').textContent = Utils.formatNumber(data.totalScore);
    },
    
    /**
     * Show inline result on game screen (instead of switching screens)
     * @param {Object} data - Result data
     */
    showInlineResult(data) {
        // Hide hint actions buttons
        document.getElementById('showMoreHints').style.display = 'none';
        document.getElementById('confirmGuessBtn').style.display = 'none';
        
        // Show next round button
        document.getElementById('nextRoundBtn').style.display = '';
        
        // Hide map instructions
        const mapInstructions = document.getElementById('mapInstructions');
        if (mapInstructions) mapInstructions.style.display = 'none';
        
        // Show result info
        const resultInfo = document.getElementById('resultInfo');
        if (resultInfo) {
            resultInfo.style.display = '';
            
            // Show reaction based on distance
            document.getElementById('inlineResultIcon').textContent = Utils.getResultIcon(data.distance);
            document.getElementById('inlineResultTitle').textContent = Utils.getResultTitle(data.distance);
            
            document.getElementById('inlineLocationName').textContent = data.locationName;
            document.getElementById('inlineDistance').textContent = Utils.formatNumber(data.distance) + ' km';
            document.getElementById('inlineScore').textContent = Utils.formatNumber(data.score);
        }
        
        // Update header score
        document.getElementById('totalScore').textContent = Utils.formatNumber(data.totalScore);
    },
    
    /**
     * Show final screen
     * @param {Object} data - Final game data
     */
    showFinalScreen(data) {
        this.hideAllScreens();
        this.screens.final.classList.remove('hidden');
        
        // Trophy animation based on performance
        const trophy = data.isNewHighScore ? '🏆' : '🎖️';
        document.getElementById('trophyIcon').textContent = trophy;
        
        // Update final score
        document.getElementById('finalScoreValue').textContent = Utils.formatNumber(data.finalScore);
        
        // Performance message
        const maxPossible = GameData.config.scoring.perfect.points * GameData.config.totalRounds;
        document.getElementById('performanceMessage').textContent = 
            Utils.getPerformanceMessage(data.finalScore, maxPossible);
        
        // Update stats
        document.getElementById('avgDistance').textContent = Utils.formatNumber(data.avgDistance) + ' km';
        document.getElementById('bestRound').textContent = Utils.formatNumber(data.bestRound);
        document.getElementById('finalHighScore').textContent = Utils.formatNumber(data.highScore);
        
        // Show "NEW HIGH SCORE!" message if applicable
        if (data.isNewHighScore) {
            const message = document.getElementById('performanceMessage');
            message.innerHTML = '🎉 NEW HIGH SCORE! 🎉<br>' + message.textContent;
        }
    },
    
    /**
     * Hide all screens
     */
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
    },
    
    /**
     * Update round information
     * @param {number} current
     * @param {number} total
     */
    updateRoundInfo(current, total) {
        document.getElementById('currentRound').textContent = current;
        document.getElementById('totalRounds').textContent = total;
    },
    
    /**
     * Display hints for current location
     * @param {Object} location
     * @param {number} count - Number of hints to show
     */
    displayHints(location, count) {
        // Update image with error handling
        const img = document.getElementById('hintImage');
        if (!img) {
            console.error('Hint image element not found');
            return;
        }
        
        // Reset image display and parent background
        img.style.display = '';
        img.parentElement.style.background = '';
        
        img.onerror = function() {
            // Fallback to a colored placeholder if image fails to load
            console.warn('Failed to load image:', location.image);
            this.style.display = 'none';
            const placeholder = this.parentElement.querySelector('.image-placeholder') || document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = 'color: white; font-size: 3rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;';
            placeholder.textContent = '🌍';
            if (!this.parentElement.querySelector('.image-placeholder')) {
                this.parentElement.appendChild(placeholder);
            }
            this.parentElement.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        };
        
        // Remove any existing placeholder
        const existingPlaceholder = img.parentElement.querySelector('.image-placeholder');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        
        img.src = location.image;
        img.alt = location.name;
        
        // Update title
        document.getElementById('hintTitle').textContent = 'Mystery Location';
        
        // Display hints
        const hintsList = document.getElementById('hintsList');
        hintsList.innerHTML = '';
        
        for (let i = 0; i < Math.min(count, location.hints.length); i++) {
            const hintDiv = document.createElement('div');
            hintDiv.className = 'hint-item';
            hintDiv.textContent = location.hints[i];
            hintsList.appendChild(hintDiv);
        }
        
        // Update more hints button
        const moreHintsBtn = document.getElementById('showMoreHints');
        if (count >= location.hints.length || count >= GameData.config.maxHints) {
            moreHintsBtn.disabled = true;
            moreHintsBtn.innerHTML = '<span>💡</span> All Hints Shown';
        } else {
            moreHintsBtn.disabled = false;
            moreHintsBtn.innerHTML = `<span>💡</span> More Hints (-${GameData.config.hintPenalty} pts)`;
        }
        
        // Only disable confirm button if no guess has been made yet
        if (!Game.state.guessCoords) {
            this.disableConfirmButton();
        }
    },
    
    /**
     * Enable confirm guess button
     */
    enableConfirmButton() {
        const btn = document.getElementById('confirmGuessBtn');
        btn.disabled = false;
        
        // Hide map instructions
        const instructions = document.getElementById('mapInstructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    },
    
    /**
     * Reset game UI for new round
     */
    resetGameUI() {
        // Show hint action buttons
        document.getElementById('showMoreHints').style.display = '';
        document.getElementById('confirmGuessBtn').style.display = '';
        
        // Hide next round button
        document.getElementById('nextRoundBtn').style.display = 'none';
        
        // Hide result info
        const resultInfo = document.getElementById('resultInfo');
        if (resultInfo) resultInfo.style.display = 'none';
        
        // Show map instructions
        const mapInstructions = document.getElementById('mapInstructions');
        if (mapInstructions) mapInstructions.style.display = '';
    },
    
    /**
     * Disable confirm guess button
     */
    disableConfirmButton() {
        const btn = document.getElementById('confirmGuessBtn');
        btn.disabled = true;
        
        // Show map instructions
        const instructions = document.getElementById('mapInstructions');
        if (instructions) {
            instructions.style.display = 'block';
        }
    },
    
    /**
     * Disable more hints button
     */
    disableMoreHintsButton() {
        const btn = document.getElementById('showMoreHints');
        btn.disabled = true;
        btn.innerHTML = '<span>💡</span> All Hints Shown';
    },
    
    /**
     * Update welcome screen statistics
     */
    updateWelcomeStats() {
        document.getElementById('gamesPlayed').textContent = Storage.getGamesPlayed();
        document.getElementById('highScore').textContent = Utils.formatNumber(Storage.getHighScore());
    }
};
