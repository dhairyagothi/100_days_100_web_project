const modeData = {
    regular: { label: "Regular", icon: "📋" },
    sudden: { label: "Sudden Death", icon: "💀" },
    countdown: { label: "Countdown Mode", icon: "⏳" }
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
const modeBadge = document.getElementById('modeBadge');
const selectorsPanel = document.getElementById('selectorsPanel');
const caret = document.getElementById('caret');
const focusOverlay = document.getElementById('focusOverlay');
const textWrapper = document.getElementById('textWrapper');
const analyticsGraph = document.getElementById('analyticsGraph');

let sentencesRepository = {
    easy: ["The cat sat on the mat.", "Dogs are the best pets ever.", "Birds fly high in the blue sky."],
    medium: ["Every morning brings new opportunities to grow.", "The ocean waves crash gently against the shore."],
    hard: ["The quantum entanglement phenomenon challenges physics.", "Entropy always increases in isolated systems."]
};

const difficultyMeta = {
    easy: { label: "Easy", color: "#4ade80" },
    medium: { label: "Medium", color: "#eab308" },
    hard: { label: "Hard", color: "#ef4444" }
};

let testText = '';
let testStarted = false;
let testFinished = false;
let startTime = null;
let timerInterval = null;
let selectedDifficulty = 'medium';
let selectedMode = 'regular';
let wpmHistory = [];
let timelineSeconds = 0;
let totalErrorsEncountered = 0;
let countdownDuration = 30;

async function loadSentences() {
    try {
        const response = await fetch('sentences.json');
        if (response.ok) {
            sentencesRepository = await response.json();
        }
    } catch (e) {
        
    }
    updateBadges();
}

function selectDifficulty(level) {
    selectedDifficulty = level;
    document.querySelectorAll('[data-diff]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === level);
    });
    updateBadges();
}

function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    updateBadges();
}

function updateBadges() {
    const meta = difficultyMeta[selectedDifficulty];
    difficultyBadge.textContent = meta ? meta.label : selectedDifficulty;
    difficultyBadge.style.color = meta ? meta.color : "#eab308";
    difficultyBadge.style.borderColor = meta ? meta.color + '55' : "#eab30855";
    difficultyBadge.style.backgroundColor = meta ? meta.color + '15' : "#eab30815";

    const m = modeData[selectedMode];
    modeBadge.textContent = `${m.icon} ${m.label}`;
}

function getRandomSentence(difficulty) {
    const pool = sentencesRepository[difficulty] || sentencesRepository['medium'];
    return pool[Math.floor(Math.random() * pool.length)];
}

function parseTextIntoWords(text) {
    textDisplay.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach((word, wIdx) => {
        const wordBox = document.createElement('div');
        wordBox.className = 'word-box';
        
        for (let i = 0; i < word.length; i++) {
            const span = document.createElement('span');
            span.textContent = word[i];
            span.className = 'untyped';
            wordBox.appendChild(span);
        }
        
        if (wIdx < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.className = 'untyped';
            wordBox.appendChild(spaceSpan);
        }
        
        textDisplay.appendChild(wordBox);
    });
}

function getCharElements() {
    return Array.from(textDisplay.querySelectorAll('.word-box span'));
}

function initTest() {
    testText = getRandomSentence(selectedDifficulty);
    parseTextIntoWords(testText);
    
    testStarted = true;
    testFinished = false;
    startTime = Date.now();
    userInput.value = '';
    wpmHistory = [];
    timelineSeconds = 0;
    totalErrorsEncountered = 0;

    resultsDiv.style.display = 'none';
    gameContent.classList.remove('hidden');
    statsDiv.classList.remove('hidden');
    selectorsPanel.classList.add('hidden');
    focusOverlay.classList.remove('active');

    userInput.disabled = false;
    userInput.focus();
    
    caret.classList.remove('blinking');
    updateCaretPosition();

    if (timerInterval) clearInterval(timerInterval);

    document.getElementById('timerLabel').textContent = selectedMode === 'countdown' ? 'Remaining' : 'Time';
    document.getElementById('timerDisplay').textContent = selectedMode === 'countdown' ? '0:30' : '0:00';
    document.getElementById('wpmDisplay').textContent = '0';
    document.getElementById('accuracyDisplay').textContent = '100%';
    document.getElementById('errorDisplay').textContent = '0';

    timerInterval = setInterval(() => {
        if (!testStarted || testFinished) return;
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timelineSeconds = elapsed;
        
        let displayTime = elapsed;
        if (selectedMode === 'countdown') {
            displayTime = countdownDuration - elapsed;
            if (displayTime <= 0) {
                displayTime = 0;
                document.getElementById('timerDisplay').textContent = '0:00';
                finishTest();
                return;
            }
        }

        const minutes = Math.floor(displayTime / 60);
        const secs = displayTime % 60;
        document.getElementById('timerDisplay').textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        
        const currentWpm = calculateLiveWpm();
        wpmHistory.push({ second: timelineSeconds, wpm: currentWpm });
        
        updateLiveStatsDisplay(currentWpm);
    }, 1000);

    updateDisplay();
}

function updateDisplay() {
    const spans = getCharElements();
    const inputVal = userInput.value;
    const inputChars = inputVal.split('');
    let suddenDeathTriggered = false;

    spans.forEach((span, index) => {
        if (index < inputChars.length) {
            const expected = span.textContent === '\u00A0' ? ' ' : span.textContent;
            if (inputChars[index] === expected) {
                span.className = 'correct';
            } else {
                if (span.className !== 'wrong') {
                    totalErrorsEncountered++;
                }
                span.className = 'wrong';
                if (selectedMode === 'sudden') {
                    suddenDeathTriggered = true;
                }
            }
        } else {
            span.className = 'untyped';
        }
    });

    updateCaretPosition();

    if (suddenDeathTriggered) {
        finishTest();
        return;
    }

    const currentWpm = calculateLiveWpm();
    updateLiveStatsDisplay(currentWpm);

    if (inputVal.length >= testText.length && !testFinished) {
        finishTest();
    }
}

function updateCaretPosition() {
    const spans = getCharElements();
    const index = userInput.value.length;
    const wrapperRect = textWrapper.getBoundingClientRect();

    if (index < spans.length) {
        const targetSpan = spans[index];
        const spanRect = targetSpan.getBoundingClientRect();
        caret.style.left = `${spanRect.left - wrapperRect.left}px`;
        caret.style.top = `${spanRect.top - wrapperRect.top}px`;
        caret.style.height = `${spanRect.height}px`;
    } else if (spans.length > 0) {
        const lastSpan = spans[spans.length - 1];
        const spanRect = lastSpan.getBoundingClientRect();
        caret.style.left = `${spanRect.right - wrapperRect.left}px`;
        caret.style.top = `${spanRect.top - wrapperRect.top}px`;
        caret.style.height = `${spanRect.height}px`;
    }
}

function calculateLiveWpm() {
    const inputLength = userInput.value.length;
    const timeElapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    return Math.round((inputLength / 5) / (timeElapsedMinutes || 1 / 60));
}

function updateLiveStatsDisplay(currentWpm) {
    const spans = getCharElements();
    const inputLength = userInput.value.length;
    
    let correctCount = 0;
    let wrongCount = 0;
    
    spans.forEach((span, idx) => {
        if (idx < inputLength) {
            if (span.className === 'correct') correctCount++;
            if (span.className === 'wrong') wrongCount++;
        }
    });

    const accuracy = inputLength > 0 ? Math.round((correctCount / inputLength) * 100) : 100;

    document.getElementById('wpmDisplay').textContent = currentWpm;
    document.getElementById('accuracyDisplay').textContent = accuracy + '%';
    document.getElementById('errorDisplay').textContent = wrongCount;
}

function finishTest() {
    if (testFinished) return;

    testFinished = true;
    testStarted = false;
    clearInterval(timerInterval);
    timerInterval = null;

    userInput.disabled = true;
    caret.classList.add('blinking');
    focusOverlay.classList.remove('active');

    const timeElapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const finalWpm = calculateLiveWpm();
    
    const spans = getCharElements();
    const inputLength = userInput.value.length;
    let correctCount = 0;
    spans.forEach((span, idx) => {
        if (idx < inputLength && span.className === 'correct') correctCount++;
    });
    const finalAccuracy = inputLength > 0 ? Math.round((correctCount / inputLength) * 100) : 0;

    document.getElementById('finalWpm').textContent = finalWpm;
    document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
    document.getElementById('finalTime').textContent = timeElapsedSeconds + 's';
    document.getElementById('finalErrors').textContent = totalErrorsEncountered;

    gameContent.classList.add('hidden');
    resultsDiv.style.display = 'block';

    if (wpmHistory.length === 0) {
        wpmHistory.push({ second: timeElapsedSeconds, wpm: finalWpm });
    }

    renderPerformanceGraph();
}

function renderPerformanceGraph() {
    analyticsGraph.innerHTML = '';
    const width = analyticsGraph.clientWidth || 600;
    const height = analyticsGraph.clientHeight || 200;
    const padding = 40;

    const maxSec = Math.max(...wpmHistory.map(d => d.second), 1);
    const maxWpm = Math.max(...wpmHistory.map(d => d.wpm), 40);

    const mapX = (sec) => padding + (sec / maxSec) * (width - 2 * padding);
    const mapY = (wpm) => height - padding - (wpm / maxWpm) * (height - 2 * padding);

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height - padding);
    xAxis.setAttribute("x2", width - padding);
    xAxis.setAttribute("y2", height - padding);
    xAxis.setAttribute("class", "graph-axis");
    analyticsGraph.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", height - padding);
    yAxis.setAttribute("class", "graph-axis");
    analyticsGraph.appendChild(yAxis);

    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute("x", width / 2);
    xLabel.setAttribute("y", height - 8);
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("class", "graph-text");
    xLabel.textContent = "Time (seconds)";
    analyticsGraph.appendChild(xLabel);

    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute("x", -height / 2);
    yLabel.setAttribute("y", 14);
    yLabel.setAttribute("transform", "rotate(-90)");
    yLabel.setAttribute("text-anchor", "middle");
    yLabel.setAttribute("class", "graph-text");
    yLabel.textContent = "WPM";
    analyticsGraph.appendChild(yLabel);

    let pathPoints = "";
    wpmHistory.forEach((pt, idx) => {
        const x = mapX(pt.second);
        const y = mapY(pt.wpm);
        pathPoints += `${idx === 0 ? 'M' : 'L'} ${x} ${y} `;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "var(--accent)");
        analyticsGraph.appendChild(circle);
    });

    if (pathPoints) {
        const graphLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        graphLine.setAttribute("d", pathPoints.trim());
        graphLine.setAttribute("class", "graph-line");
        analyticsGraph.appendChild(graphLine);
    }
}

userInput.addEventListener('input', () => {
    if (!testStarted || testFinished) return;
    updateDisplay();
});

window.addEventListener('resize', () => {
    if (testStarted && !testFinished) {
        updateCaretPosition();
    }
    if (resultsDiv.style.display === 'block') {
        renderPerformanceGraph();
    }
});

document.addEventListener('keydown', (e) => {
    if (testStarted && !testFinished) {
        if (document.activeElement !== userInput) {
            userInput.focus();
        }
    }
});

userInput.addEventListener('blur', () => {
    if (testStarted && !testFinished) {
        focusOverlay.classList.add('active');
    }
});

focusOverlay.addEventListener('click', () => {
    focusOverlay.classList.remove('active');
    userInput.focus();
    updateCaretPosition();
});

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
    selectorsPanel.classList.remove('hidden');
    focusOverlay.classList.remove('active');
    caret.classList.add('blinking');
    caret.style.left = '0px';
    caret.style.top = '0px';
    textDisplay.innerHTML = '<span class="untyped">Select configurations and click "Start Test"...</span>';
});

retryBtn.addEventListener('click', initTest);

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setTimeout(() => {
        if (resultsDiv.style.display === 'block') renderPerformanceGraph();
    }, 50);
});

document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.addEventListener('click', () => selectDifficulty(btn.dataset.diff));
});

document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => selectMode(btn.dataset.mode));
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

selectDifficulty('medium');
selectMode('regular');
loadSentences();
textDisplay.innerHTML = '<span class="untyped">Select configurations and click "Start Test"...</span>';