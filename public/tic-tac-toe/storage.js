// storage.js
// Handles localStorage persistent data for stats, achievements, leaderboard, and saved games.

const STORAGE_KEYS = {
    STATS: 'ttt_stats',
    ACHIEVEMENTS: 'ttt_achievements',
    LEADERBOARD: 'ttt_leaderboard',
    SAVED_GAME: 'ttt_saved_game',
    PREFERENCES: 'ttt_preferences'
};

const DEFAULT_STATS = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPlayTime: 0 // in seconds
};

const DEFAULT_ACHIEVEMENTS = {
    first_win: { unlocked: false, name: 'First Win', desc: 'Won your first match', icon: '🏆' },
    win_streak_5: { unlocked: false, name: '5-Game Win Streak', desc: 'Achieved 5 consecutive wins', icon: '🔥' },
    beat_hard_ai: { unlocked: false, name: 'Beat Hard AI', desc: 'Defeated the unbeatable AI', icon: '⚡' },
    played_100: { unlocked: false, name: '100 Games Played', desc: 'Played 100 matches', icon: '🎯' },
    master: { unlocked: false, name: 'Tic Tac Toe Master', desc: 'Won 10 matches on Hard AI', icon: '👑' }
};

const DEFAULT_LEADERBOARD = {
    bestWinStreak: 0,
    fastestVictory: null, // in seconds
    aiWins: 0,
    playerWins: 0
};

const DEFAULT_PREFERENCES = {
    theme: 'light-glass',
    soundEnabled: true,
    musicEnabled: false
};

const StorageManager = {
    getStats() {
        const raw = localStorage.getItem(STORAGE_KEYS.STATS);
        return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
    },

    saveStats(stats) {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    },

    getAchievements() {
        const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        const data = raw ? JSON.parse(raw) : {};
        // Merge with defaults to preserve icons and descriptions
        const achievements = { ...DEFAULT_ACHIEVEMENTS };
        for (const key in achievements) {
            if (data[key]) {
                achievements[key].unlocked = data[key].unlocked;
                achievements[key].unlockedAt = data[key].unlockedAt;
            }
        }
        return achievements;
    },

    unlockAchievement(id) {
        const achievements = this.getAchievements();
        if (achievements[id] && !achievements[id].unlocked) {
            achievements[id].unlocked = true;
            achievements[id].unlockedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
            return achievements[id]; // Return details if newly unlocked
        }
        return null;
    },

    getLeaderboard() {
        const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
        return raw ? { ...DEFAULT_LEADERBOARD, ...JSON.parse(raw) } : { ...DEFAULT_LEADERBOARD };
    },

    saveLeaderboard(data) {
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(data));
    },

    getSavedGame() {
        const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
        return raw ? JSON.parse(raw) : null;
    },

    saveGame(gameState) {
        if (!gameState) {
            localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
        } else {
            localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(gameState));
        }
    },

    clearSavedGame() {
        localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
    },

    getPreferences() {
        const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : { ...DEFAULT_PREFERENCES };
    },

    savePreferences(prefs) {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    },

    updateStatsAfterGame(result, timeTaken, mode, difficulty) {
        const stats = this.getStats();
        const leaderboard = this.getLeaderboard();
        let unlockedBadges = [];

        stats.gamesPlayed += 1;

        if (result === 'win') {
            stats.gamesWon += 1;
            stats.currentStreak += 1;
            if (stats.currentStreak > stats.longestStreak) {
                stats.longestStreak = stats.currentStreak;
            }
            if (stats.currentStreak > leaderboard.bestWinStreak) {
                leaderboard.bestWinStreak = stats.currentStreak;
            }

            leaderboard.playerWins += 1;

            // Check fastest victory
            if (timeTaken > 0) {
                if (leaderboard.fastestVictory === null || timeTaken < leaderboard.fastestVictory) {
                    leaderboard.fastestVictory = timeTaken;
                }
            }

            // Check win achievements
            const a1 = this.unlockAchievement('first_win');
            if (a1) unlockedBadges.push(a1);

            if (stats.currentStreak >= 5) {
                const a2 = this.unlockAchievement('win_streak_5');
                if (a2) unlockedBadges.push(a2);
            }

            if (mode === 'ai' && difficulty === 'hard') {
                const a3 = this.unlockAchievement('beat_hard_ai');
                if (a3) unlockedBadges.push(a3);

                const hardWins = (parseInt(localStorage.getItem('ttt_hard_wins') || '0')) + 1;
                localStorage.setItem('ttt_hard_wins', hardWins.toString());
                if (hardWins >= 10) {
                    const a5 = this.unlockAchievement('master');
                    if (a5) unlockedBadges.push(a5);
                }
            }
        } else if (result === 'lose') {
            stats.gamesLost += 1;
            stats.currentStreak = 0;
            if (mode === 'ai') {
                leaderboard.aiWins += 1;
            }
        } else {
            stats.gamesDrawn += 1;
            stats.currentStreak = 0;
        }

        // Played 100 games achievement
        if (stats.gamesPlayed >= 100) {
            const a4 = this.unlockAchievement('played_100');
            if (a4) unlockedBadges.push(a4);
        }

        this.saveStats(stats);
        this.saveLeaderboard(leaderboard);

        return { stats, leaderboard, unlockedBadges };
    },

    addPlayTime(seconds) {
        if (seconds <= 0) return;
        const stats = this.getStats();
        stats.totalPlayTime += seconds;
        this.saveStats(stats);
    },

    resetAllData() {
        localStorage.removeItem(STORAGE_KEYS.STATS);
        localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
        localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
        localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
        localStorage.setItem('ttt_hard_wins', '0');
    }
};

window.StorageManager = StorageManager;
