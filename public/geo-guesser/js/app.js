/**
 * Main App Entry Point
 * Initializes the application when DOM is ready
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    UI.init();
    
    console.log('🌍 Mini Geo Guesser loaded successfully!');
    console.log('📊 Game Statistics:');
    console.log(`   Games Played: ${Storage.getGamesPlayed()}`);
    console.log(`   High Score: ${Storage.getHighScore()}`);
    console.log(`   Theme: ${Storage.getTheme()}`);
});

// Prevent accidental page refresh during game
window.addEventListener('beforeunload', (e) => {
    const gameState = Game.getState();
    
    // Only show warning if game is in progress
    if (gameState.currentRound > 0 && gameState.currentRound <= gameState.totalRounds) {
        e.preventDefault();
        e.returnValue = 'Game in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Handle window resize for map responsiveness
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (MapManager.map) {
            MapManager.map.invalidateSize();
        }
    }, 250);
});
