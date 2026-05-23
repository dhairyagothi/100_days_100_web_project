const typewriter = document.querySelector(".text");

const userInput = document.getElementById("userInput");
const addTextButton = document.getElementById("addText");
const deleteTextButton = document.getElementById("deleteText");
const pauseResumeButton = document.getElementById("pauseResume");
const speedSlider = document.getElementById("speedSlider");
const toggleThemeButton = document.getElementById("toggleTheme");
const changeBackgroundButton = document.getElementById("changeBackground");

const defaultPhrases = [
    "Freelancer",
    "Blogger",
    "Developer",
    "Designer",
    "Creator"
];

let phrases = [...defaultPhrases];

let displayedPhrases = [];

let phraseIndex = 0;
let charIndex = 0;

let currentPhrase = "";
let isDeleting = false;

let typingSpeed = 100;

let isPaused = false;

let typingTimeout;

function type() {

    if (isPaused) return;

    currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriter.textContent = currentPhrase.slice(0, charIndex--);
    } else {
        typewriter.textContent = currentPhrase.slice(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentPhrase.length + 1) {

        setTimeout(() => {
            isDeleting = true;
        }, 1500);

    } else if (isDeleting && charIndex < 0) {

        isDeleting = false;

        displayedPhrases.push(currentPhrase);

        if (displayedPhrases.length === phrases.length) {
            displayedPhrases = [];
        }
    }

        phraseIndex = (phraseIndex + 1) % phrases.length;

        while (displayedPhrases.includes(phrases[phraseIndex])) {
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    typingTimeout = setTimeout(
        type,
        isDeleting ? typingSpeed / 2 : typingSpeed
    );
}

addTextButton.addEventListener("click", () => {

    const newText = userInput.value.trim();

    if (!newText) return;

    if (!phrases.includes(newText)) {

        phrases.push(newText);

        userInput.value = "";

        isPaused = false;
        isDeleting = false;

        charIndex = 0;

        phraseIndex = phrases.length - 1;

        clearTimeout(typingTimeout);

        type();

        pauseResumeButton.textContent = "Pause";
    }
}

deleteTextButton.addEventListener("click", () => {

    if (phrases.length > defaultPhrases.length) {

        const lastPhrase = phrases.pop();

        displayedPhrases = displayedPhrases.filter(
            phrase => phrase !== lastPhrase
        );

        if (phraseIndex >= phrases.length) {
            phraseIndex = 0;
        }
    }

pauseResumeButton.addEventListener("click", () => {

    isPaused = !isPaused;

    pauseResumeButton.textContent = isPaused
        ? "Resume"
        : "Pause";

    if (!isPaused) {
        type();
    } else {
        clearTimeout(typingTimeout);
    }

    playKeyClick();
    if (shouldFlash) flashKey(text);
}

function deleteCharFromPaper() {
    if (paperContent.length === 0) return;

    paperContent = paperContent.slice(0, -1);
    renderPaper();
    syncInput();
    playBackspace();
    flashKey("BACKSPACE");
}

function handleButtonPress(char) {
    if (char === "CAPSLOCK") {
        toggleCapsLock();
        return;
    }

    if (char === "BACKSPACE") {
        deleteCharFromPaper();
        userInput.focus();
        return;
    }

    if (char === "ENTER") {
        insertText("\n");
        userInput.focus();
        return;
    }

    if (char === "SPACE") {
        insertText(" ");
        userInput.focus();
        return;
    }

    if (isLetter(char)) {
        insertText(transformLetter(char, false));
        userInput.focus();
        return;
    }

    insertText(char);
    userInput.focus();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
}

document.querySelectorAll(".key").forEach((key) => {
    const trigger = (event) => {
        event.preventDefault();
        handleButtonPress(key.dataset.char);
    };

    key.addEventListener("mousedown", trigger);
    key.addEventListener("touchstart", trigger, { passive: false });
});

userInput.addEventListener("input", () => {
    paperContent = userInput.value;
    renderPaper();
});

toggleThemeButton.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const currentTheme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";

    localStorage.setItem("theme", currentTheme);
});

changeBackgroundButton.addEventListener("click", () => {

    const colors = [
        "#1a1a1a",
        "#2a2a2a",
        "#3a3a3a",
        "#4a4a4a",
        "#5a5a5a"
    ];

    const randomColor =
        colors[Math.floor(Math.random() * colors.length)];

    document.body.style.backgroundColor = randomColor;
});

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    type();
});
