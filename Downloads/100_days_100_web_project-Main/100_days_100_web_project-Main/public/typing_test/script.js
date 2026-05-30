// Typing test sentences - diverse and randomized
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "In the heart of the city, life moves at its own rhythm.",
    "Every morning brings new opportunities to grow and learn.",
    "The ocean waves crash gently against the sandy shore.",
    "Music has the power to heal the human soul.",
    "Patience and persistence are keys to achieving success.",
    "The starry night sky reminds us how small we are.",
    "Kindness costs nothing but means everything to others.",
    "Technology evolves faster than we can adapt to it.",
    "Coffee and books are the perfect combination for peace.",
    "The forest whispers secrets only the wind understands.",
    "Time is the most precious resource we possess.",
    "Dreams come true when we dare to chase them.",
    "Every sunset brings the promise of a new dawn.",
    "Writing is thinking with the fingers on the keyboard."
];

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const userInput = document.getElementById('userInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');
const themeToggle = document.getElementById('themeToggle');
const resultsDiv = document.getElementById('results');
const statsDiv = document.getElementById('stats');
const gameContent = document.getElementById('gameContent');

// State
let currentText = '';
let testStarted = false;
let testFinished = false;
let startTime = null;
let testText = '';
let timerInterval = null;

function getRandomSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}

function initTest() {
    testText = getRandomSentence();
    currentText = '';
    testStarted = true;
    testFinished = false;
    startTime = Date.now();
    userInput.value = '';
    
    // Switch views smoothly
    resultsDiv.style.display = 'none';
    gameContent.classList.remove('hidden');
    statsDiv.classList.remove('hidden');
    
    userInput.disabled = false;
    userInput.focus();
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!testStarted || testFinished) return;
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timerDisplay').textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    }, 100);
    
    updateDisplay();
}

function updateDisplay() {
    const chars = testText.split('');
    const inputChars = userInput.value.split('');

    textDisplay.innerHTML = chars.map((char, index) => {
        let className = 'untyped';
        if (index < inputChars.length) {
            className = inputChars[index] === char ? 'correct' : 'wrong';
        } else if (index === inputChars.length) {
            className = 'current';
        }
        return `<span class="${className}">${char}</span>`;
    }).join('');

    updateStats();
}

function updateStats() {
    const inputLength = userInput.value.length;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wpm = Math.round((inputLength / 5) / (timeElapsed || 1 / 60));
    
    let correctChars = 0;
    userInput.value.split('').forEach((char, index) => {
        if (char === testText[index]) correctChars++;
    });
    const accuracy = inputLength > 0 ? Math.round((correctChars / inputLength) * 100) : 0;

    document.getElementById('wpmDisplay').textContent = wpm;
    document.getElementById('accuracyDisplay').textContent = accuracy + '%';
    document.getElementById('typedDisplay').textContent = inputLength;
}

function finishTest() {
    testFinished = true;
    testStarted = false;
    if (timerInterval) clearInterval(timerInterval);
    
    const timeElapsed = (Date.now() - startTime) / 1000;
    const inputLength = userInput.value.length;
    const wpm = Math.round((inputLength / 5) / (timeElapsed / 60 || 1 / 60));
    
    let correctChars = 0;
    userInput.value.split('').forEach((char, index) => {
        if (char === testText[index]) correctChars++;
    });
    const accuracy = inputLength > 0 ? Math.round((correctChars / inputLength) * 100) : 0;
    const errors = inputLength - correctChars;

    // Set metrics text
    document.getElementById('finalWpm').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalTime').textContent = Math.round(timeElapsed) + 's';
    document.getElementById('finalErrors').textContent = errors;

    // Toggle layouts cleanly inside the card box boundary
    gameContent.classList.add('hidden');
    resultsDiv.style.display = 'block';
    userInput.disabled = true;
}

// Event listeners
startBtn.addEventListener('click', initTest);

resetBtn.addEventListener('click', () => {
    testStarted = false;
    testFinished = false;
    if (timerInterval) clearInterval(timerInterval);
    userInput.value = '';
    userInput.disabled = false;
    resultsDiv.style.display = 'none';
    gameContent.classList.remove('hidden');
    statsDiv.classList.add('hidden');
    textDisplay.innerHTML = '<span class="untyped">Click "Start Test" to begin...</span>';
});

retryBtn.addEventListener('click', initTest);

userInput.addEventListener('input', () => {
    if (!testStarted || testFinished) return;

    updateDisplay();

    if (userInput.value === testText) {
        finishTest();
    }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

textDisplay.innerHTML = '<span class="untyped">Click "Start Test" to begin...</span>';