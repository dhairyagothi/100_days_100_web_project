const words = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", 
    "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", 
    "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", 
    "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", 
    "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", 
    "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", 
    "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", 
    "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", 
    "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", 
    "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", 
    "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", 
    "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", 
    "course", "change", "help", "line", "city"
];

// DOM Elements
const textDisplay = document.getElementById('text-display');
const hiddenInput = document.getElementById('hidden-input');
const timeLeftEl = document.getElementById('time-left');
const liveWpmEl = document.getElementById('live-wpm');
const liveWpmContainer = document.getElementById('live-wpm-container');
const restartBtn = document.getElementById('restart-btn');
const resultsRestartBtn = document.getElementById('results-restart-btn');
const themeToggle = document.getElementById('theme-toggle');
const timeBtns = document.querySelectorAll('.time-btn');

const configBar = document.querySelector('.config-bar');
const typingSection = document.querySelector('.typing-section');
const resultsSection = document.getElementById('results-section');

// State
let maxTime = 30;
let timeLeft = maxTime;
let timer = null;
let isTyping = false;
let isFinished = false;

let currentWordIndex = 0;
let currentCharIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let totalTyped = 0;

// Initialize Test
function initTest() {
    isTyping = false;
    isFinished = false;
    clearInterval(timer);
    timeLeft = maxTime;
    timeLeftEl.innerText = timeLeft;
    
    currentWordIndex = 0;
    currentCharIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalTyped = 0;
    
    liveWpmContainer.classList.add('d-none');
    liveWpmEl.innerText = 0;
    
    configBar.classList.remove('hidden');
    typingSection.classList.remove('d-none');
    resultsSection.classList.add('d-none');
    
    generateText();
    hiddenInput.value = "";
    hiddenInput.focus();
}

function generateText() {
    textDisplay.innerHTML = "";
    // Generate 100 words
    for (let i = 0; i < 100; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const wordEl = document.createElement('div');
        wordEl.classList.add('word');
        
        for (let j = 0; j < randomWord.length; j++) {
            const charEl = document.createElement('span');
            charEl.classList.add('char');
            charEl.innerText = randomWord[j];
            wordEl.appendChild(charEl);
        }
        textDisplay.appendChild(wordEl);
    }
    
    // Set first char as active
    textDisplay.childNodes[0].childNodes[0].classList.add('active');
}

// Timer Logic
function startTimer() {
    if (isTyping) return;
    isTyping = true;
    configBar.classList.add('hidden');
    liveWpmContainer.classList.remove('d-none');
    
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeLeftEl.innerText = timeLeft;
            updateLiveWpm();
        } else {
            clearInterval(timer);
            finishTest();
        }
    }, 1000);
}

function updateLiveWpm() {
    const timeElapsed = (maxTime - timeLeft) / 60; // in minutes
    if (timeElapsed === 0) return;
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    liveWpmEl.innerText = wpm > 0 && wpm !== Infinity ? wpm : 0;
}

// Typing Logic
document.addEventListener('keydown', (e) => {
    if (isFinished) return;
    
    if (e.key === 'Tab' && e.shiftKey === false) {
        // Prevent default tab behavior (losing focus) if we want tab+enter restart
        e.preventDefault();
        return;
    }
    
    if (e.key === 'Enter') {
        initTest();
        return;
    }

    hiddenInput.focus();
});

hiddenInput.addEventListener('input', (e) => {
    if (isFinished) return;
    startTimer();
    
    textDisplay.classList.add('typing');
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
        textDisplay.classList.remove('typing');
    }, 500);

    const inputVal = hiddenInput.value;
    const wordsEl = textDisplay.childNodes;
    const currentWordEl = wordsEl[currentWordIndex];
    let charsEl = currentWordEl.childNodes;
    
    const lastCharTyped = inputVal.slice(-1);
    
    // Handle Space (next word)
    if (lastCharTyped === ' ') {
        if (currentCharIndex === 0 && inputVal.length === 1) {
            // Space pressed at start of word, ignore
            hiddenInput.value = "";
            return;
        }
        
        // Mark missing characters in current word as incorrect visually if skipped
        if (currentCharIndex < charsEl.length) {
            currentWordEl.classList.add('error-underline');
        }
        
        // Remove active class from current char
        if (currentCharIndex < charsEl.length) {
            charsEl[currentCharIndex].classList.remove('active', 'right-caret');
        } else {
            charsEl[charsEl.length - 1].classList.remove('active', 'right-caret');
        }
        
        currentWordIndex++;
        currentCharIndex = 0;
        
        // Scroll if needed
        const nextWordEl = wordsEl[currentWordIndex];
        if (nextWordEl.offsetTop > currentWordEl.offsetTop + 40) {
            // We moved to a new line, scroll up
            textDisplay.scrollTop += nextWordEl.offsetTop - currentWordEl.offsetTop;
        }
        
        nextWordEl.childNodes[0].classList.add('active');
        hiddenInput.value = "";
        return;
    }
    
    // Handle typing a character
    if (e.inputType !== "deleteContentBackward") {
        if (currentCharIndex < charsEl.length) {
            const expectedChar = charsEl[currentCharIndex].innerText;
            if (lastCharTyped === expectedChar) {
                charsEl[currentCharIndex].classList.add('correct');
                correctChars++;
            } else {
                charsEl[currentCharIndex].classList.add('incorrect');
                incorrectChars++;
            }
            charsEl[currentCharIndex].classList.remove('active');
            currentCharIndex++;
            totalTyped++;
            
            if (currentCharIndex < charsEl.length) {
                charsEl[currentCharIndex].classList.add('active');
            } else {
                // End of word, place right caret on last char
                charsEl[charsEl.length - 1].classList.add('active', 'right-caret');
            }
        } else {
            // Typing extra characters
            const extraChar = document.createElement('span');
            extraChar.classList.add('char', 'extra', 'incorrect');
            extraChar.innerText = lastCharTyped;
            currentWordEl.appendChild(extraChar);
            
            charsEl = currentWordEl.childNodes; // update nodelist
            
            charsEl[currentCharIndex - 1].classList.remove('active', 'right-caret');
            charsEl[currentCharIndex].classList.add('active', 'right-caret');
            currentCharIndex++;
            incorrectChars++;
            totalTyped++;
        }
    } else {
        // Handle Backspace
        if (currentCharIndex > 0) {
            if (currentCharIndex < charsEl.length) {
                charsEl[currentCharIndex].classList.remove('active');
            } else {
                charsEl[charsEl.length - 1].classList.remove('active', 'right-caret');
            }
            
            currentCharIndex--;
            const charToUndo = charsEl[currentCharIndex];
            
            if (charToUndo.classList.contains('extra')) {
                charToUndo.remove();
                incorrectChars--;
                totalTyped--;
            } else {
                if (charToUndo.classList.contains('correct')) {
                    correctChars--;
                } else if (charToUndo.classList.contains('incorrect')) {
                    incorrectChars--;
                }
                charToUndo.classList.remove('correct', 'incorrect');
                totalTyped--;
            }
            
            charsEl = currentWordEl.childNodes;
            if (currentCharIndex < charsEl.length) {
                charsEl[currentCharIndex].classList.add('active');
                charsEl[currentCharIndex].classList.remove('right-caret');
            }
        } else if (currentWordIndex > 0) {
            // Move back to previous word if we hit backspace at start of word
            currentWordIndex--;
            const prevWordEl = wordsEl[currentWordIndex];
            charsEl = prevWordEl.childNodes;
            currentCharIndex = charsEl.length;
            
            hiddenInput.value = Array.from(charsEl).map(c => c.innerText).join("");
            
            wordsEl[currentWordIndex + 1].childNodes[0].classList.remove('active');
            charsEl[charsEl.length - 1].classList.add('active', 'right-caret');
            prevWordEl.classList.remove('error-underline');
        }
    }
});

// Click text area to focus
textDisplay.addEventListener('click', () => {
    hiddenInput.focus();
});

// Finish Test
function finishTest() {
    isFinished = true;
    hiddenInput.blur();
    
    typingSection.classList.add('d-none');
    resultsSection.classList.remove('d-none');
    
    const timeInMinutes = maxTime / 60;
    const finalWpm = Math.round((correctChars / 5) / timeInMinutes);
    const accuracy = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);
    const cpm = Math.round(correctChars / timeInMinutes);
    
    document.getElementById('final-wpm').innerText = finalWpm > 0 ? finalWpm : 0;
    document.getElementById('final-acc').innerText = `${accuracy}%`;
    document.getElementById('final-cpm').innerText = cpm;
    document.getElementById('final-correct-chars').innerText = correctChars;
    document.getElementById('final-incorrect-chars').innerText = incorrectChars;
}

// Controls
restartBtn.addEventListener('click', initTest);
resultsRestartBtn.addEventListener('click', initTest);

timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        maxTime = parseInt(btn.dataset.time);
        initTest();
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = document.getElementById('theme-icon');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Init on load
initTest();
