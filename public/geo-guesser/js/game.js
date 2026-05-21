/**
 * Game Module - Core game logic and state management
 */

const Game = {
    // Game state
    state: {
        difficulty: 'medium',
        currentRound: 0,
        totalRounds: 5,
        locations: [],
        currentLocation: null,
        guessCoords: null,
        shownHints: 1,
        scores: [],
        totalScore: 0,
        distances: []
    },
    
    /**
     * Initialize a new game
     * @param {string} difficulty - easy, medium, or hard
     */
    init(difficulty = 'medium') {
        // Reset state
        this.state = {
            difficulty,
            currentRound: 0,
            totalRounds: GameData.config.totalRounds,
            locations: GameData.getRandomLocations(difficulty, GameData.config.totalRounds),
            currentLocation: null,
            guessCoords: null,
            shownHints: 1,
            scores: [],
            totalScore: 0,
            distances: []
        };
        
        // Start first round
        this.nextRound();
    },
    
    /**
     * Start the next round
     */
    nextRound() {
        this.state.currentRound++;
        
        if (this.state.currentRound > this.state.totalRounds) {
            this.endGame();
            return;
        }
        
        // Get location for this round
        this.state.currentLocation = this.state.locations[this.state.currentRound - 1];
        this.state.guessCoords = null;
        this.state.shownHints = 1;
        
        // Update UI
        UI.showGameScreen();
        UI.resetGameUI(); // Reset buttons and result display
        UI.updateRoundInfo(this.state.currentRound, this.state.totalRounds);
        UI.displayHints(this.state.currentLocation, this.state.shownHints);
        
        // Reset map
        MapManager.resetView();
        MapManager.enableInteraction();
        
        // Re-attach map click handler for new round
        if (MapManager.map) {
            MapManager.map.off('click'); // Remove old handler
            MapManager.onMapClick((coords) => {
                Game.makeGuess(coords);
            });
        }
    },
    
    /**
     * Handle user's guess
     * @param {Object} coords - {lat, lng}
     */
    makeGuess(coords) {
        this.state.guessCoords = coords;
        UI.enableConfirmButton();
    },
    
    /**
     * Show more hints (with penalty)
     */
    showMoreHints() {
        if (this.state.shownHints < GameData.config.maxHints) {
            this.state.shownHints++;
            UI.displayHints(this.state.currentLocation, this.state.shownHints);
            
            // Apply penalty to potential score
            if (this.state.shownHints === GameData.config.maxHints) {
                UI.disableMoreHintsButton();
            }
        }
    },
    
    /**
     * Confirm the guess and calculate score
     */
    confirmGuess() {
        if (!this.state.guessCoords) return;
        
        const actualCoords = this.state.currentLocation.coordinates;
        
        // Calculate distance
        const distance = Utils.calculateDistance(this.state.guessCoords, actualCoords);
        this.state.distances.push(distance);
        
        // Calculate base score
        let score = GameData.calculateScore(distance);
        
        // Apply hint penalty
        const hintPenalty = (this.state.shownHints - 1) * GameData.config.hintPenalty;
        score = Math.max(0, score - hintPenalty);
        
        this.state.scores.push(score);
        this.state.totalScore += score;
        
        // Show result on the same screen
        MapManager.disableInteraction();
        MapManager.revealLocation(
            actualCoords,
            this.state.guessCoords,
            this.state.currentLocation.name
        );
        
        // Update UI to show results without switching screens
        UI.showInlineResult({
            distance,
            score,
            totalScore: this.state.totalScore,
            locationName: this.state.currentLocation.name
        });
    },
    
    /**
     * End the game and show final results
     */
    endGame() {
        // Calculate statistics
        const avgDistance = Math.round(
            this.state.distances.reduce((a, b) => a + b, 0) / this.state.distances.length
        );
        const bestRound = Math.max(...this.state.scores);
        
        // Update storage
        const isNewHighScore = Storage.updateHighScore(this.state.totalScore);
        Storage.incrementGamesPlayed();
        Storage.addToTotalScore(this.state.totalScore);
        
        // Show final screen
        UI.showFinalScreen({
            finalScore: this.state.totalScore,
            avgDistance,
            bestRound,
            highScore: Storage.getHighScore(),
            isNewHighScore
        });
    },
    
    /**
     * Get current game state
     * @returns {Object}
     */
    getState() {
        return { ...this.state };
    }
};
