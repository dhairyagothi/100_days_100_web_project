const typewriter = document.querySelector(".text");
const userInput = document.getElementById("userInput");
const addTextButton = document.getElementById("addText");
const deleteTextButton = document.getElementById("deleteText");
const pauseResumeButton = document.getElementById("pauseResume");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const toggleThemeButton = document.getElementById("toggleTheme");

const defaultPhrases = ["Freelancer", "Blogger", "Developer", "Designer", "Creator"];
let phrases = [...defaultPhrases];
let displayedPhrases = [];
let phraseIndex = 0;
let charIndex = 0;
let currentPhrase = '';
let isDeleting = false;
let typingSpeed = 100;
let isPaused = false;
let typingTimeout;

function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
}

function resetTyping(index = phraseIndex) {
    phraseIndex = index % phrases.length;
    charIndex = 0;
    isDeleting = false;
    clearTimeout(typingTimeout);
}

function setPauseButtonText() {
    if (pauseResumeButton) {
        pauseResumeButton.textContent = isPaused ? "Resume" : "Pause";
    }
}

function updateDeleteButtonState() {
    if (deleteTextButton) {
        deleteTextButton.disabled = phrases.length === defaultPhrases.length;
    }
}

function updateSpeedValue() {
    if (speedValue) {
        const wordsPerMinute = Math.round(60000 / (typingSpeed * 5));
        speedValue.textContent = `${wordsPerMinute} WPM`;
    }
}

function type() {
    if (!typewriter || phrases.length === 0) {
        return;
    }

    if (isPaused) {
        return;
    }

    phraseIndex %= phrases.length;
    currentPhrase = phrases[phraseIndex] || "";
    typewriter.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex < currentPhrase.length) {
        charIndex++;
        typingTimeout = setTimeout(type, typingSpeed);
        return;
    }

    if (!isDeleting) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 1200);
        return;
    }

    if (charIndex > 0) {
        charIndex--;
        typingTimeout = setTimeout(type, typingSpeed / 2);
        return;
    }

    isDeleting = false;
    displayedPhrases.push(currentPhrase);
    if (displayedPhrases.length >= phrases.length) {
        displayedPhrases = [];
    }

    phraseIndex = (phraseIndex + 1) % phrases.length;
    while (displayedPhrases.includes(phrases[phraseIndex]) && displayedPhrases.length < phrases.length) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    typingTimeout = setTimeout(type, typingSpeed);
}

function addCustomText() {
    if (!userInput) {
        return;
    }

    const newText = normalizeText(userInput.value);
    if (newText) {
        phrases.push(newText);
        userInput.value = "";
        isPaused = false;
        resetTyping(phrases.length - 1);
        setPauseButtonText();
        updateDeleteButtonState();
        type();
    }
}

function deleteLatestText() {
    if (phrases.length === defaultPhrases.length) {
        return;
    }

    const deletedPhrase = phrases.pop();
    displayedPhrases = displayedPhrases.filter((phrase) => phrase !== deletedPhrase);
    displayedPhrases = [];

    const nextIndex = phrases.length > defaultPhrases.length ? phrases.length - 1 : 0;
    resetTyping(nextIndex);
    updateDeleteButtonState();

    if (typewriter) {
        typewriter.textContent = "";
    }

    if (!isPaused) {
        type();
    }
}

addTextButton?.addEventListener("click", addCustomText);

userInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        addCustomText();
deleteTextButton.addEventListener("click", () => {
    if (phrases.length > defaultPhrases.length) {
        const lastUserPhrase = phrases.pop();
        
        if (displayedPhrases.includes(lastUserPhrase)) {
            displayedPhrases = displayedPhrases.filter(phrase => phrase !== lastUserPhrase);
        }
        if (phraseIndex >= phrases.length) {
            clearTimeout(typingTimeout);
            phraseIndex = 0;
            charIndex = 0;
            isDeleting = false;
            if (!isPaused) {
                type();
            }
        }
    }
});

deleteTextButton?.addEventListener("click", deleteLatestText);

pauseResumeButton?.addEventListener("click", () => {
    isPaused = !isPaused;
    setPauseButtonText();
    if (!isPaused) {
        type();
    } else {
        clearTimeout(typingTimeout);
    }
});

speedSlider?.addEventListener("input", (e) => {
    typingSpeed = parseInt(e.target.value, 10);
    updateSpeedValue();
});

toggleThemeButton?.addEventListener("click", () => {
    document.body.classList.toggle('light-theme');
});

updateDeleteButtonState();
updateSpeedValue();
type();
