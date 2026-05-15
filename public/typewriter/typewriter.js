const typewriter = document.querySelector(".text");

const userInput = document.getElementById("userInput");
const addTextButton = document.getElementById("addText");
const deleteTextButton = document.getElementById("deleteText");
const pauseResumeButton = document.getElementById("pauseResume");
const speedSlider = document.getElementById("speedSlider");
const toggleThemeButton = document.getElementById("toggleTheme");
const changeBackgroundButton =
    document.getElementById("changeBackground");

const speedValue = document.getElementById("speedValue");

const defaultPhrases = [
    "Freelancer",
    "Blogger",
    "Developer",
    "Designer",
    "Creator"
];

const savedPhrases =
    JSON.parse(localStorage.getItem("phrases"));

let phrases = savedPhrases || [...defaultPhrases];

if (
    localStorage.getItem("theme") === "light"
) {
    document.body.classList.add("light-theme");
}

let displayedPhrases = [];

let phraseIndex = 0;
let charIndex = 0;

let currentPhrase = "";

let isDeleting = false;

let typingSpeed =
    parseInt(localStorage.getItem("typingSpeed"))
    || 100;

let isPaused = false;

let typingTimeout;

speedSlider.value = typingSpeed;

if (speedValue) {
    speedValue.textContent =
        `${typingSpeed}ms`;
}

function type() {

    if (isPaused) return;

    currentPhrase = phrases[phraseIndex];

    if (isDeleting) {

        typewriter.textContent =
            currentPhrase.substring(0, charIndex--);

    } else {

        typewriter.textContent =
            currentPhrase.substring(0, charIndex++);

    }

    if (
        !isDeleting &&
        charIndex === currentPhrase.length
    ) {

        setTimeout(() => {

            isDeleting = true;

        }, 2000);

    }

    else if (
        isDeleting &&
        charIndex === 0
    ) {

        isDeleting = false;

        displayedPhrases.push(currentPhrase);

        if (
            displayedPhrases.length === phrases.length
        ) {

            displayedPhrases = [];

        }

        phraseIndex =
            (phraseIndex + 1) % phrases.length;

        while (
            displayedPhrases.includes(
                phrases[phraseIndex]
            )
        ) {

            phraseIndex =
                (phraseIndex + 1) % phrases.length;

        }

    }

    typingTimeout = setTimeout(
        type,
        isDeleting
            ? typingSpeed / 2
            : typingSpeed
    );

}

addTextButton.addEventListener("click", () => {

    const newText =
        userInput.value.trim();

    if (
        newText &&
        !phrases.includes(newText)
    ) {

        phrases.push(newText);

        localStorage.setItem(
            "phrases",
            JSON.stringify(phrases)
        );

        userInput.value = "";

    }

});

userInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        addTextButton.click();

    }

});

deleteTextButton.addEventListener("click", () => {

    if (
        phrases.length >
        defaultPhrases.length
    ) {

        const lastUserPhrase =
            phrases.pop();

        if (
            displayedPhrases.includes(
                lastUserPhrase
            )
        ) {

            displayedPhrases =
                displayedPhrases.filter(
                    phrase =>
                        phrase !== lastUserPhrase
                );

        }

        localStorage.setItem(
            "phrases",
            JSON.stringify(phrases)
        );

    }

});

pauseResumeButton.addEventListener("click", () => {

    isPaused = !isPaused;

    pauseResumeButton.textContent =
        isPaused
            ? "Resume"
            : "Pause";

    if (!isPaused) {

        type();

    } else {

        clearTimeout(typingTimeout);

    }

});

speedSlider.addEventListener("input", (e) => {

    typingSpeed =
        parseInt(e.target.value);

    localStorage.setItem(
        "typingSpeed",
        typingSpeed
    );

    if (speedValue) {

        speedValue.textContent =
            `${typingSpeed}ms`;

    }

});

toggleThemeButton.addEventListener("click", () => {

    const isLight =
        document.body.classList.toggle(
            "light-theme"
        );

    localStorage.setItem(
        "theme",
        isLight
            ? "light"
            : "dark"
    );

});

if (changeBackgroundButton) {

    changeBackgroundButton.addEventListener(
        "click",
        () => {

            const colors = [
                "#1a1a1a",
                "#2a2a2a",
                "#3a3a3a",
                "#4a4a4a",
                "#5a5a5a"
            ];

            const images = [
                'url("https://via.placeholder.com/800x600")',

                'url("https://via.placeholder.com/800x600/ff7f7f")',

                'url("https://via.placeholder.com/800x600/7f7fff")'
            ];

            const randomColor =
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ];

            const randomImage =
                images[
                    Math.floor(
                        Math.random() *
                        images.length
                    )
                ];

            const isImage =
                Math.random() > 0.5;

            if (isImage) {

                document.body.style.backgroundImage =
                    randomImage;

                document.body.style.backgroundColor =
                    "";

            } else {

                document.body.style.backgroundColor =
                    randomColor;

                document.body.style.backgroundImage =
                    "";

            }

        }
    );

}

type();