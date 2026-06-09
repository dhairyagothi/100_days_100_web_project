const difficultyData = {
    easy: {
        label: "Easy",
        icon: "🟢",
        color: "#4ade80",
        sentences: [
            "The cat sat on the mat.",
            "I like to eat cake and pie.",
            "Dogs are the best pets ever.",
            "The sun is hot and bright today.",
            "She went to the store to buy milk.",
            "He runs fast in the morning.",
            "Birds fly high in the blue sky.",
            "The red ball is in the yard.",
            "My dog likes to play fetch.",
            "We went to the park today.",
            "The baby smiled at the nurse.",
            "Fish swim in the deep blue sea.",
            "I love to read books at night.",
            "The flower bloomed in the spring.",
            "She baked a fresh loaf of bread."
        ]
    },
    medium: {
        label: "Medium",
        icon: "🟡",
        color: "#facc15",
        sentences: [
            "Every morning brings new opportunities to grow and learn.",
            "The ocean waves crash gently against the sandy shore.",
            "Music has the power to heal the human soul.",
            "Patience and persistence are keys to achieving success.",
            "Technology evolves faster than we can adapt to it.",
            "Coffee and books are the perfect combination for peace.",
            "The forest whispers secrets only the wind understands.",
            "Time is the most precious resource we possess.",
            "Dreams come true when we dare to chase them.",
            "Writing is thinking with the fingers on the keyboard.",
            "In the heart of the city, life moves at its own rhythm.",
            "Kindness costs nothing but means everything to others.",
            "The starry night sky reminds us how small we really are.",
            "Every sunset brings the promise of a new and fresh dawn.",
            "Traveling broadens the mind and enriches the human spirit."
        ]
    },
    hard: {
        label: "Hard",
        icon: "🔴",
        color: "#ef4444",
        sentences: [
            "The quantum entanglement phenomenon challenges our classical understanding of physics; particles separated by vast distances instantaneously affect one another.",
            "In 1847, the mathematician George Boole published 'The Mathematical Analysis of Logic,' laying the groundwork for modern digital computing & binary systems.",
            "Photosynthesis converts CO2 + H2O into glucose (C6H12O6) using sunlight; this process powers nearly all life on Earth at ~450-700nm wavelengths.",
            "The Byzantine Empire's intricate bureaucratic system, complete with 18 distinct administrative tiers, functioned continuously for over 1,000 years (330–1453 AD).",
            "Fibonacci's sequence (0, 1, 1, 2, 3, 5, 8, 13...) appears throughout nature: in pinecone spirals, nautilus shells, and galaxy arm formations alike.",
            "Cryptographic algorithms like RSA-2048 rely on the computational difficulty of factoring large semi-prime numbers; breaking one key requires ~300 trillion years.",
            "The philosopher Friedrich Nietzsche wrote: 'That which does not kill us makes us stronger' — yet resilience, paradoxically, often emerges from surviving near-collapse.",
            "HTTP/3 uses QUIC protocol over UDP instead of TCP; this eliminates head-of-line blocking & reduces latency by 12–15% for high-packet-loss environments.",
            "Dr. Jane Goodall's 60-year longitudinal study of chimpanzees (Pan troglodytes) in Tanzania revealed tool use, warfare, and complex social hierarchies in primates.",
            "The legal doctrine of 'res ipsa loquitur' ('the thing speaks for itself') allows negligence inference without direct evidence, dating to Byrne v. Boadle (1863).",
            "Machine learning models trained on >500GB datasets can exhibit emergent behavior — capabilities not explicitly programmed — once parameter counts exceed ~10^11.",
            "In thermodynamics, entropy (S) always increases in isolated systems; Boltzmann's equation S = k·ln(Ω) links macroscopic disorder to microscopic particle states.",
            "The Treaty of Westphalia (1648) established the modern concept of state sovereignty, ending the Thirty Years' War & reshaping European geopolitics permanently.",
            "CRISPR-Cas9 gene editing targets specific DNA sequences via guide RNA; off-target edits occur at 0.1–2% frequency, raising significant bioethical considerations.",
            "The Turing Test, proposed in 1950, posited that if a machine's responses are indistinguishable from a human's in a 5-minute conversation, it can 'think'."
        ]
    }
};

const textDisplay = document.getElementById('textDisplay');
const userInput = document.getElementById('userInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');
const themeToggle = document.getElementById('themeToggle');
const resultsDiv = document.getElementById('results');
const statsDiv = document.getElementById('stats');
const gameContent = document.getElementById('gameContent');
const difficultyBadge = document.getElementById('difficultyBadge');
const difficultySelector = document.getElementById('difficultySelector');

let currentText = '';
let testStarted = false;
let testFinished = false;
let startTime = null;
let testText = '';
let timerInterval = null;
let selectedDifficulty = 'medium';

function selectDifficulty(level) {
    selectedDifficulty = level;
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === level);
    });
    updateDifficultyBadge();
}

function updateDifficultyBadge() {
    const d = difficultyData[selectedDifficulty];
    difficultyBadge.textContent = `${d.icon} ${d.label}`;
    difficultyBadge.style.color = d.color;
    difficultyBadge.style.borderColor = d.color + '55';
    difficultyBadge.style.backgroundColor = d.color + '15';
}

function getRandomSentence(difficulty) {
    const pool = difficultyData[difficulty].sentences;
    return pool[Math.floor(Math.random() * pool.length)];
}

function initTest() {
    testText = getRandomSentence(selectedDifficulty);
    currentText = '';
    testStarted = true;
    testFinished = false;
    startTime = Date.now();
    userInput.value = '';

    resultsDiv.style.display = 'none';
    gameContent.classList.remove('hidden');
    statsDiv.classList.remove('hidden');
    difficultySelector.classList.add('hidden');

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
        const display = char === ' ' ? '&nbsp;' : char;
        return `<span class="${className}">${display}</span>`;
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

    document.getElementById('finalWpm').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalTime').textContent = Math.round(timeElapsed) + 's';
    document.getElementById('finalErrors').textContent = errors;

    const d = difficultyData[selectedDifficulty];
    document.getElementById('finalDifficulty').textContent = `${d.icon} ${d.label}`;
    document.getElementById('finalDifficulty').style.color = d.color;

    gameContent.classList.add('hidden');
    resultsDiv.style.display = 'block';
    userInput.disabled = true;
}

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
    difficultySelector.classList.remove('hidden');
    textDisplay.innerHTML = '<span class="untyped">Select a difficulty and click "Start Test"...</span>';
});

retryBtn.addEventListener('click', initTest);

userInput.addEventListener('input', () => {
    if (!testStarted || testFinished) return;
    updateDisplay();
    if (userInput.value === testText) {
        finishTest();
    }
});

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

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => selectDifficulty(btn.dataset.diff));
});

selectDifficulty('medium');
textDisplay.innerHTML = '<span class="untyped">Select a difficulty and click "Start Test"...</span>';