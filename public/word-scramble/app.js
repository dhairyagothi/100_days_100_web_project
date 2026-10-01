// Word database categorized by difficulty
const WORD_BANK = {
    easy: [
        "apple", "grape", "peach", "melon", "lemon", "berry", "mango", "plum", "pear", "kiwi", 
        "lime", "house", "table", "chair", "desk", "lamp", "book", "paper", "mouse", "phone", 
        "clock", "water", "bread", "milk", "sugar", "honey", "pizza", "pasta", "salad", "soup", 
        "rice", "salt", "spice", "ocean", "river", "lake", "pond", "beach", "cloud", "rain", 
        "snow", "wind", "storm", "tree", "grass", "leaf", "root", "seed", "bird", "fish", 
        "frog", "toad", "crab", "snail", "worm", "dog", "cat", "cow", "pig", "goat", 
        "deer", "bear", "lion", "wolf", "fox", "gold", "silver", "iron", "steel", "rock"
    ],
    medium: [
        "diamond", "crystal", "emerald", "ruby", "platinum", "copper", "bronze", "silicon",
        "window", "kitchen", "bedroom", "garden", "balcony", "garage", "ceiling", "blanket", 
        "pillow", "cushion", "curtain", "carpet", "mirror", "drawer", "cabinet", "toaster", 
        "kettle", "blender", "coffee", "teapot", "napkin", "plate", "bottle", "basket", 
        "bucket", "shovel", "hammer", "wrench", "pliers", "pencil", "eraser", "ruler", 
        "marker", "crayon", "canvas", "binder", "folder", "stapler", "scissors", "guitar",
        "violin", "trumpet", "drumkit", "flute", "piano", "keyboard", "monitor", "laptop",
        "camera", "speaker", "charger", "battery", "compass", "lantern", "backpack", "wallet",
        "journey", "explore", "pioneer", "vintage", "classic", "vibrant", "dynamic", "organic"
    ],
    hard: [
        "strawberry", "watermelon", "blackberry", "raspberry", "blueberry", "pineapple", 
        "grapefruit", "pomegranate", "cantaloupe", "apricot", "nectarine", "tangerine", 
        "dragonfruit", "passionfruit", "elderberry", "macadamia", "pistachio", "developer", 
        "helicopter", "spaceship", "butterfly", "adventure", "architecture", "vocabulary", 
        "laboratory", "microphone", "dictionary", "atmosphere", "wilderness", "temperature", 
        "celebration", "connection", "navigation", "exploration", "construction", "championship", 
        "resolution", "background", "aesthetic", "minimalist", "multiplier", "difficulty", 
        "scientific", "earthquake", "avalanche", "satellite", "telescope", "microscope", 
        "instructor", "generation", "mysterious", "technology", "information", "imagination",
        "photography", "destination", "achievement", "contribution", "appreciation", "perspective"
    ]
};

// Game Settings
const TIMER_SETTINGS = {
    easy: 40,
    medium: 30,
    hard: 20
};

const BASE_SCORE = {
    easy: 10,
    medium: 20,
    hard: 40
};

const DIFFICULTY_MULTIPLIERS = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
};

// State Variables
let gameState = {
    score: 0,
    streak: 0,
    maxStreak: 0,
    solvedCount: 0,
    highScore: 0,
    difficulty: "easy",
    currentWord: "",
    scrambledWord: "",
    hintsUsed: 0,
    maxHints: 0,
    timeLeft: 0,
    totalTimeLimit: 40,
    timerInterval: null,
    isSoundEnabled: true,
    revealedHintIndices: [] // Tracks which indices of the current word are revealed via hints
};

// Audio Synthesizer Class
class SoundSynth {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(frequency, type, duration, startTimeOffset = 0) {
        if (!gameState.isSoundEnabled) return;
        this.init();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime + startTimeOffset);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + startTimeOffset);
        // Soft linear decay to prevent popping noise
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTimeOffset + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + startTimeOffset);
        osc.stop(this.ctx.currentTime + startTimeOffset + duration);
    }

    playSuccess() {
        // A pleasant major chord arpeggio
        this.playTone(523.25, 'sine', 0.15, 0.0);    // C5
        this.playTone(659.25, 'sine', 0.15, 0.08);   // E5
        this.playTone(783.99, 'sine', 0.25, 0.16);   // G5
    }

    playFailure() {
        // Short low buzzer sound
        this.playTone(150, 'sawtooth', 0.25);
    }

    playTick() {
        // High-pitched woodblock-style tick
        this.playTone(1200, 'sine', 0.05);
    }

    playHint() {
        // A gentle, high arpeggio
        this.playTone(880, 'sine', 0.1, 0.0);      // A5
        this.playTone(1046.50, 'sine', 0.15, 0.06); // C6
    }

    playSkip() {
        // A soft descending note
        this.playTone(330, 'triangle', 0.15, 0);
        this.playTone(220, 'triangle', 0.15, 0.05);
    }

    playGameOver() {
        // Descending sad progression
        this.playTone(293.66, 'triangle', 0.3, 0);    // D4
        this.playTone(220.00, 'triangle', 0.3, 0.25); // A3
        this.playTone(164.81, 'triangle', 0.5, 0.5);  // E3
    }
}

const synth = new SoundSynth();

// DOM Elements
const scoreDisplay = document.getElementById("score-display");
const streakDisplay = document.getElementById("streak-display");
const highscoreDisplay = document.getElementById("highscore-display");
const difficultySelector = document.getElementById("difficulty-selector");
const gameCard = document.getElementById("game-card");
const timerProgress = document.getElementById("timer-progress");
const scrambledLettersContainer = document.getElementById("scrambled-letters-container");
const guessInput = document.getElementById("guess-input");
const guessForm = document.getElementById("guess-form");
const feedbackMsg = document.getElementById("feedback-msg");
const hintBtn = document.getElementById("hint-btn");
const skipBtn = document.getElementById("skip-btn");
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const soundOnIcon = document.getElementById("sound-on-icon");
const soundOffIcon = document.getElementById("sound-off-icon");
const multiplierVal = document.getElementById("multiplier-val");
const multiplierDetails = document.getElementById("multiplier-details");

// Modal Elements
const gameOverModal = document.getElementById("game-over-modal");
const summaryScore = document.getElementById("summary-score");
const summarySolved = document.getElementById("summary-solved");
const summaryStreak = document.getElementById("summary-streak");
const restartBtn = document.getElementById("restart-btn");

// Initialize Game
function initGame() {
    // Load highscore & sound setting from LocalStorage
    const savedHighScore = localStorage.getItem("scramble_highscore");
    if (savedHighScore !== null) {
        gameState.highScore = parseInt(savedHighScore, 10);
    }
    highscoreDisplay.textContent = gameState.highScore;

    const savedSound = localStorage.getItem("scramble_sound");
    if (savedSound !== null) {
        gameState.isSoundEnabled = savedSound === "true";
        updateSoundIcons();
    }

    // Attach Event Listeners
    setupEventListeners();

    // Start round
    startNewRound();
}

function setupEventListeners() {
    // Difficulty Buttons
    difficultySelector.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".diff-btn");
        if (!targetBtn || targetBtn.classList.contains("active")) return;

        // Visual toggle
        difficultySelector.querySelectorAll(".diff-btn").forEach(btn => btn.classList.remove("active"));
        targetBtn.classList.add("active");

        // Set difficulty and reload
        gameState.difficulty = targetBtn.dataset.difficulty;
        
        // Changing difficulty resets the current streak to prevent easy farming
        gameState.streak = 0;
        streakDisplay.textContent = gameState.streak;
        
        synth.init();
        startNewRound();
    });

    // Guess Form Submit
    guessForm.addEventListener("submit", (e) => {
        e.preventDefault();
        submitGuess();
    });

    // Sound toggle
    soundToggleBtn.addEventListener("click", () => {
        gameState.isSoundEnabled = !gameState.isSoundEnabled;
        localStorage.setItem("scramble_sound", gameState.isSoundEnabled);
        updateSoundIcons();
        synth.init();
    });

    // Hint Button
    hintBtn.addEventListener("click", () => {
        useHint();
    });

    // Skip Button
    skipBtn.addEventListener("click", () => {
        skipWord();
    });

    // Restart Button
    restartBtn.addEventListener("click", () => {
        closeModal();
        resetStats();
        startNewRound();
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        // Don't catch hotkeys if modal is open
        if (!gameOverModal.classList.contains("hidden")) return;

        if (e.key === "Escape") {
            e.preventDefault();
            skipWord();
        }
    });

    // Guess Input visual syncing as the user types
    guessInput.addEventListener("input", () => {
        updateLetterBadgeStates();
    });
}

function updateSoundIcons() {
    if (gameState.isSoundEnabled) {
        soundOnIcon.classList.remove("hidden");
        soundOffIcon.classList.add("hidden");
    } else {
        soundOnIcon.classList.add("hidden");
        soundOffIcon.classList.remove("hidden");
    }
}

// Scramble logic
function scrambleWord(word) {
    const arr = word.split("");
    let scrambled = "";
    let attempts = 0;
    
    // Ensure we don't return the exact original word if possible
    do {
        // Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        scrambled = arr.join("");
        attempts++;
    } while (scrambled === word && attempts < 25 && word.length > 1);

    return scrambled;
}

// Start a round
function startNewRound() {
    // 1. Get a random word based on difficulty
    const wordList = WORD_BANK[gameState.difficulty];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    gameState.currentWord = wordList[randomIndex].toLowerCase();
    
    // 2. Scramble it
    gameState.scrambledWord = scrambleWord(gameState.currentWord);

    // 3. Reset Round Stats
    gameState.hintsUsed = 0;
    gameState.maxHints = Math.floor(gameState.currentWord.length / 2);
    gameState.revealedHintIndices = [];
    
    // 4. Timer setup
    gameState.totalTimeLimit = TIMER_SETTINGS[gameState.difficulty];
    gameState.timeLeft = gameState.totalTimeLimit;
    
    // Reset timer styling
    timerProgress.style.width = "100%";
    timerProgress.classList.remove("warning", "danger");
    
    // Restart Interval
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(tick, 1000);

    // 5. Render letters
    renderLetterBadges();
    
    // 6. Clear input & focus
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.placeholder = "Type your answer here...";
    guessInput.focus();

    // 7. Reset feedback message
    hideFeedback();

    // 8. Update Multiplier Display
    updateMultiplier();

    // Enable Buttons
    hintBtn.disabled = false;
    skipBtn.disabled = false;
}

// Render scrambled letter badges
function renderLetterBadges() {
    scrambledLettersContainer.innerHTML = "";
    const letters = gameState.scrambledWord.split("");
    
    letters.forEach((char, index) => {
        const badge = document.createElement("span");
        badge.className = "letter-badge";
        badge.textContent = char.toUpperCase();
        badge.dataset.index = index;
        badge.dataset.char = char.toLowerCase();
        scrambledLettersContainer.appendChild(badge);
    });
}

// Update highlighting on badges based on what the user typed
function updateLetterBadgeStates() {
    const inputVal = guessInput.value.toLowerCase();
    const badges = Array.from(scrambledLettersContainer.querySelectorAll(".letter-badge"));
    
    // Clear all "used" states
    badges.forEach(b => b.classList.remove("used"));

    // Track matching letters
    // Build an array of characters typed that we need to consume from the scrambled set
    const typedChars = inputVal.split("");

    // For each typed character, try to find an available scrambled badge
    typedChars.forEach(char => {
        const match = badges.find(b => !b.classList.contains("used") && b.dataset.char === char);
        if (match) {
            match.classList.add("used");
        }
    });
}

// Timer tick
function tick() {
    gameState.timeLeft--;
    
    // Update visual percentage
    const percentage = (gameState.timeLeft / gameState.totalTimeLimit) * 100;
    timerProgress.style.width = `${percentage}%`;

    // Visual indicators
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 5) {
        timerProgress.classList.add("warning");
    } else if (gameState.timeLeft <= 5) {
        timerProgress.classList.remove("warning");
        timerProgress.classList.add("danger");
        // Play click sound
        synth.playTick();
    }

    if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timerInterval);
        handleTimeOut();
    }
}

// Show feedback message
function showFeedback(text, type) {
    feedbackMsg.textContent = text;
    feedbackMsg.className = `feedback-msg show ${type}`;
}

function hideFeedback() {
    feedbackMsg.classList.remove("show");
}

// Calculate the multiplier and update pill UI
function calculateMultiplier() {
    const diffMult = DIFFICULTY_MULTIPLIERS[gameState.difficulty];
    
    // Streak multiplier: +0.5 for every 3 consecutive answers (capped at +2.0x, i.e., max streak factor is 3.0x at 12 streak)
    const streakFactor = 1.0 + Math.min(Math.floor(gameState.streak / 3) * 0.5, 2.0);
    
    // Speed factor: 1.0 to 2.0 based on how fast the word is solved
    // But since speed depends on when they answer, we only calculate actual points with speed at the moment of submission.
    // This displays the current static multiplier (Difficulty * Streak)
    return {
        display: (diffMult * streakFactor).toFixed(1),
        diffMult: diffMult,
        streakFactor: streakFactor
    };
}

function updateMultiplier() {
    const mult = calculateMultiplier();
    multiplierVal.textContent = `x${mult.display}`;

    // Update details description
    const diffName = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    const streakBonus = mult.streakFactor > 1.0 ? ` + Streak (x${mult.streakFactor.toFixed(1)})` : " • No Streak";
    multiplierDetails.textContent = `${diffName} Base (${mult.diffMult.toFixed(1)}x)${streakBonus}`;
}

// Submit a guess
function submitGuess() {
    const guess = guessInput.value.trim().toLowerCase();
    
    if (!guess) {
        showFeedback("Please type a word first!", "info");
        return;
    }

    if (guess === gameState.currentWord) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

// Correct Answer handler
function handleCorrectAnswer() {
    clearInterval(gameState.timerInterval);
    
    // Play sound
    synth.playSuccess();

    // Calculate score
    const base = BASE_SCORE[gameState.difficulty];
    const mult = calculateMultiplier();
    
    // Speed multiplier: remaining time percentage (1.0x to 2.0x)
    const speedFactor = 1.0 + (gameState.timeLeft / gameState.totalTimeLimit);
    
    // Apply Hint penalty: each hint cuts points for this word by 30% (max reduction 90%)
    const hintPenaltyFactor = Math.max(0.1, 1.0 - (gameState.hintsUsed * 0.3));

    const pointsEarned = Math.round(base * mult.diffMult * mult.streakFactor * speedFactor * hintPenaltyFactor);

    // Update State
    gameState.score += pointsEarned;
    gameState.streak++;
    gameState.solvedCount++;
    if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
    }
    
    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem("scramble_highscore", gameState.highScore);
        highscoreDisplay.textContent = gameState.highScore;
        // Bounce highscore element
        highscoreDisplay.classList.add("badge-bounce");
        setTimeout(() => highscoreDisplay.classList.remove("badge-bounce"), 300);
    }

    // Update UI Displays
    scoreDisplay.textContent = gameState.score;
    streakDisplay.textContent = gameState.streak;
    
    // Bounce score element
    scoreDisplay.classList.add("badge-bounce");
    setTimeout(() => scoreDisplay.classList.remove("badge-bounce"), 300);

    // Fade used badges
    Array.from(scrambledLettersContainer.querySelectorAll(".letter-badge")).forEach(b => b.classList.add("used"));

    // Success styling
    guessInput.disabled = true;
    showFeedback(`Correct! +${pointsEarned} points!`, "correct");
    
    // Pulse animation on card
    gameCard.style.borderColor = "var(--success-color)";
    gameCard.style.boxShadow = "0 0 12px rgba(22, 163, 74, 0.15)";
    
    // Load next round after a delay
    setTimeout(() => {
        gameCard.style.borderColor = "var(--border-color)";
        gameCard.style.boxShadow = "var(--shadow-md)";
        startNewRound();
    }, 1200);
}

// Incorrect Answer handler
function handleIncorrectAnswer() {
    synth.playFailure();
    showFeedback("Incorrect. Try again!", "incorrect");
    
    // Shake card animation
    gameCard.classList.add("shake");
    guessInput.classList.add("shake");
    
    setTimeout(() => {
        gameCard.classList.remove("shake");
        guessInput.classList.remove("shake");
    }, 400);

    // Select input content to allow quick retyping
    guessInput.select();
}

// Hint Handler
function useHint() {
    if (gameState.hintsUsed >= gameState.maxHints) {
        showFeedback("No more hints available for this word!", "info");
        return;
    }

    // Select the next unrevealed letter index in currentWord
    let nextIndexToReveal = -1;
    for (let i = 0; i < gameState.currentWord.length; i++) {
        if (!gameState.revealedHintIndices.includes(i)) {
            nextIndexToReveal = i;
            break;
        }
    }

    if (nextIndexToReveal === -1) return;

    // Play Sound
    synth.playHint();

    gameState.hintsUsed++;
    gameState.revealedHintIndices.push(nextIndexToReveal);

    // Construct the partial hint string
    let hintStr = "";
    for (let i = 0; i < gameState.currentWord.length; i++) {
        if (gameState.revealedHintIndices.includes(i)) {
            hintStr += gameState.currentWord[i].toUpperCase();
        } else {
            hintStr += "_";
        }
    }

    // Set input value to the hint to assist the user
    // e.g., if target is "apple" and 1st letter is revealed: "A _ _ _ _"
    // Let's just autofill the beginning correctly or show it as placeholder / value
    const partiallyFilledWord = Array.from(gameState.currentWord).map((char, i) => {
        return gameState.revealedHintIndices.includes(i) ? char : "";
    }).join("");
    
    guessInput.value = partiallyFilledWord.toUpperCase();
    guessInput.focus();
    
    updateLetterBadgeStates();

    // Reduce streak to prevent farming high score using hints
    // Using hints reduces the active streak back to 0
    if (gameState.streak > 0) {
        gameState.streak = 0;
        streakDisplay.textContent = gameState.streak;
        updateMultiplier();
    }

    const hintsLeft = gameState.maxHints - gameState.hintsUsed;
    showFeedback(`Hint: Starts with "${hintStr}". (${hintsLeft} left, streak reset)`, "info");
    
    if (gameState.hintsUsed >= gameState.maxHints) {
        hintBtn.disabled = true;
    }
}

// Skip Word handler
function skipWord() {
    synth.playSkip();
    
    // Show answer briefly
    showFeedback(`Skipped. Word was: ${gameState.currentWord.toUpperCase()}`, "info");
    
    // Reset streak
    gameState.streak = 0;
    streakDisplay.textContent = gameState.streak;
    updateMultiplier();

    // Disable skip and hint during transition
    skipBtn.disabled = true;
    hintBtn.disabled = true;
    guessInput.disabled = true;

    clearInterval(gameState.timerInterval);

    setTimeout(() => {
        startNewRound();
    }, 1200);
}

// Handle Time Out (Game Over)
function handleTimeOut() {
    synth.playGameOver();
    
    guessInput.disabled = true;
    hintBtn.disabled = true;
    skipBtn.disabled = true;

    showFeedback(`Time's up! Word was: ${gameState.currentWord.toUpperCase()}`, "incorrect");

    // Open Modal after a short delay so the user sees the correct answer
    setTimeout(() => {
        openGameOverModal();
    }, 1500);
}

// Modal management
function openGameOverModal() {
    summaryScore.textContent = gameState.score;
    summarySolved.textContent = gameState.solvedCount;
    summaryStreak.textContent = gameState.maxStreak;
    
    gameOverModal.classList.remove("hidden");
}

function closeModal() {
    gameOverModal.classList.add("hidden");
}

// Reset Game Stats (on Game Over restart)
function resetStats() {
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.solvedCount = 0;
    
    scoreDisplay.textContent = 0;
    streakDisplay.textContent = 0;
}

// Run initialisation
document.addEventListener("DOMContentLoaded", initGame);
window.gameState = gameState;
