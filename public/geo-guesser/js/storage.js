/**
 * Storage Module - LocalStorage management for game state and statistics
 */

const Storage = {
    keys: {
        THEME: 'geoGuesser_theme',
        HIGH_SCORE: 'geoGuesser_highScore',
        GAMES_PLAYED: 'geoGuesser_gamesPlayed',
        TOTAL_SCORE: 'geoGuesser_totalScore',
        SETTINGS: 'geoGuesser_settings'
    },
    
    /**
     * Get theme preference
     * @returns {string} Theme ('light' or 'dark')
     */
    getTheme() {
        return localStorage.getItem(this.keys.THEME) || 'light';
    },
    
    /**
     * Save theme preference
     * @param {string} theme
     */
    setTheme(theme) {
        localStorage.setItem(this.keys.THEME, theme);
    },
    
    /**
     * Get high score
     * @returns {number}
     */
    getHighScore() {
        return parseInt(localStorage.getItem(this.keys.HIGH_SCORE)) || 0;
    },
    
    /**
     * Update high score if new score is higher
     * @param {number} score
     * @returns {boolean} True if high score was updated
     */
    updateHighScore(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem(this.keys.HIGH_SCORE, score.toString());
            return true;
        }
        return false;
    },
    
    /**
     * Get total games played
     * @returns {number}
     */
    getGamesPlayed() {
        return parseInt(localStorage.getItem(this.keys.GAMES_PLAYED)) || 0;
    },
    
    /**
     * Increment games played counter
     */
    incrementGamesPlayed() {
        const current = this.getGamesPlayed();
        localStorage.setItem(this.keys.GAMES_PLAYED, (current + 1).toString());
    },
    
    /**
     * Get total cumulative score
     * @returns {number}
     */
    getTotalScore() {
        return parseInt(localStorage.getItem(this.keys.TOTAL_SCORE)) || 0;
    },
    
    /**
     * Add to total cumulative score
     * @param {number} score
     */
    addToTotalScore(score) {
        const current = this.getTotalScore();
        localStorage.setItem(this.keys.TOTAL_SCORE, (current + score).toString());
    },
    
    /**
     * Get game settings
     * @returns {Object}
     */
    getSettings() {
        const settings = localStorage.getItem(this.keys.SETTINGS);
        return settings ? JSON.parse(settings) : {
            difficulty: 'medium',
            soundEnabled: true
        };
    },
    
    /**
     * Save game settings
     * @param {Object} settings
     */
    setSettings(settings) {
        localStorage.setItem(this.keys.SETTINGS, JSON.stringify(settings));
    },
    
    /**
     * Clear all game data (reset)
     */
    clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};
