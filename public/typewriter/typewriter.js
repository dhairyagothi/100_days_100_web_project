const typewriter = document.querySelector(".text");
const userInput = document.getElementById("userInput");
const addTextButton = document.getElementById("addText");
const deleteTextButton = document.getElementById("deleteText");
const pauseResumeButton = document.getElementById("pauseResume");
const speedSlider = document.getElementById("speedSlider");
const toggleThemeButton = document.getElementById("toggleTheme");
const changeBackgroundButton = document.getElementById("changeBackground");

const defaultPhrases = ["Freelancer", "Blogger", "Developer", "Designer", "Creator"];
let userPhrases = [];
let phrases = [...defaultPhrases];
let displayedPhrases = [];
let phraseIndex = 0;
let charIndex = 0;
let currentPhrase = '';
let isDeleting = false;
let typingSpeed = 100;
let isPaused = false;
let typingTimeout;

function type() {
    if (!isPaused) {
        currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriter.textContent = currentPhrase.substring(0, charIndex--);
        } else {
            typewriter.textContent = currentPhrase.substring(0, charIndex++);
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            displayedPhrases.push(currentPhrase);
            if (displayedPhrases.length === phrases.length) {
                displayedPhrases = [];
            }
            phraseIndex = (phraseIndex + 1) % phrases.length;
            while (displayedPhrases.includes(phrases[phraseIndex])) {
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        typingTimeout = setTimeout(type, isDeleting ? typingSpeed / 2 : typingSpeed);
    }
}

// FIX: Use addEventListener with preventDefault to stop form submission reload (closes #856)
addTextButton.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent any form submission / page reload

    const newText = userInput.value.trim();
    if (!newText) return; // Do nothing if empty

    phrases.push(newText);
    userInput.value = '';
    isPaused = false;
    isDeleting = false;
    charIndex = 0;
    phraseIndex = phrases.length - 1;
    clearTimeout(typingTimeout);
    type();
    pauseResumeButton.textContent = "Pause";
});

deleteTextButton.addEventListener("click", () => {
    if (phrases.length > defaultPhrases.length) {
        const lastUserPhrase = phrases.pop();
        if (displayedPhrases.includes(lastUserPhrase)) {
            displayedPhrases = displayedPhrases.filter(phrase => phrase !== lastUserPhrase);
        }
    }
});

pauseResumeButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseResumeButton.textContent = isPaused ? "Resume" : "Pause";
    if (!isPaused) {
        type();
    } else {
        clearTimeout(typingTimeout);
    }
});

speedSlider.addEventListener("input", (e) => {
    typingSpeed = parseInt(e.target.value);
});

toggleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle('light-theme');
});

changeBackgroundButton.addEventListener("click", () => {
    const colors = ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a'];
    const images = [
        'url("https://via.placeholder.com/800x600")',
        'url("https://via.placeholder.com/800x600/ff7f7f")',
        'url("https://via.placeholder.com/800x600/7f7fff")'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const isImage = Math.random() > 0.5;

    if (isImage) {
        document.body.style.backgroundImage = randomImage;
        document.body.style.backgroundColor = '';
    } else {
        document.body.style.backgroundColor = randomColor;
        document.body.style.backgroundImage = '';
    }
});

type();
