/**
 * Utils Module - Helper functions for calculations and utilities
 */

const Utils = {
    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {Object} coord1 - First coordinate {lat, lng}
     * @param {Object} coord2 - Second coordinate {lat, lng}
     * @returns {number} Distance in kilometers
     */
    calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers
        
        const lat1 = this.toRadians(coord1.lat);
        const lat2 = this.toRadians(coord2.lat);
        const deltaLat = this.toRadians(coord2.lat - coord1.lat);
        const deltaLng = this.toRadians(coord2.lng - coord1.lng);
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return Math.round(distance);
    },
    
    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number} Radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    /**
     * Format number with commas
     * @param {number} num
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Get performance message based on score
     * @param {number} score
     * @param {number} maxScore
     * @returns {string} Performance message
     */
    getPerformanceMessage(score, maxScore) {
        const percentage = (score / maxScore) * 100;
        
        if (percentage >= 90) return "🌟 Outstanding! You're a geography master!";
        if (percentage >= 75) return "🎯 Excellent work! Very impressive!";
        if (percentage >= 60) return "👍 Great job! Keep it up!";
        if (percentage >= 40) return "💪 Good effort! Room for improvement!";
        return "📚 Keep practicing! Geography is fun!";
    },
    
    /**
     * Get result icon based on distance
     * @param {number} distance
     * @returns {string} Emoji icon
     */
    getResultIcon(distance) {
        if (distance <= 50) return "🎯";
        if (distance <= 250) return "🌟";
        if (distance <= 750) return "⭐";
        if (distance <= 1500) return "👍";
        if (distance <= 3000) return "👌";
        return "📍";
    },
    
    /**
     * Get result title based on distance
     * @param {number} distance
     * @returns {string} Result title
     */
    getResultTitle(distance) {
        if (distance <= 50) return "Perfect! 🎯";
        if (distance <= 250) return "Excellent! 🌟";
        if (distance <= 750) return "Great Guess! ⭐";
        if (distance <= 1500) return "Good Job! 👍";
        if (distance <= 3000) return "Not Bad! 👌";
        return "Keep Trying! 📍";
    },
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func
     * @param {number} wait
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
