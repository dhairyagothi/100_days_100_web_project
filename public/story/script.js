import { stories } from './storiesData.js';

const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story') || 'rabbit-lion';
const currentStory = stories.find(s => s.id === storyId) || stories[0];

const line = currentStory.scenes.map(scene => scene.text);
const images = currentStory.scenes.map(scene => scene.image);
const sceneLabels = currentStory.scenes.map(scene => scene.label);

const mainTitleEl = document.getElementById("story-main-title");
const chapterBadgeEl = document.getElementById("chapter-badge");
const sceneLabelEl = document.getElementById("scene-label");
const textElement = document.getElementById("text");
const imageElement = document.getElementById("image");
const progressTextEl = document.getElementById("progress-text");
const dotsContainer = document.getElementById("dots-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const autoProgressCheck = document.getElementById("auto-progress");

let i = 0;
let speech = null;
let isPaused = false;

mainTitleEl.textContent = currentStory.title;

function buildNavigationDots() {
    dotsContainer.innerHTML = "";
    for (let d = 0; d < line.length; d++) {
        const dotElement = document.createElement("span");
        dotElement.className = d === 0 ? "dot active" : "dot";
        dotsContainer.appendChild(dotElement);
    }
}

function renderScene() {
    textElement.textContent = line[i];
    imageElement.src = images[i];
    imageElement.alt = sceneLabels[i];
    
    chapterBadgeEl.textContent = `Scene ${i + 1} of ${line.length}`;
    sceneLabelEl.textContent = `${sceneLabels[i]} • Scene ${i + 1} of ${line.length}`;
    progressTextEl.textContent = `${i + 1} / ${line.length}`;

    const percentage = Math.round(((i + 1) / line.length) * 100);
    document.documentElement.style.setProperty('--progress', `${percentage}%`);

    const allDots = dotsContainer.querySelectorAll(".dot");
    allDots.forEach((dot, index) => {
        if (index === i) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        isPaused = false;
    }

    speak(line[i]);
}

function speak(text) {
    if (speechSynthesis.speaking && isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        return;
    }
    if (speech) {
        speechSynthesis.cancel();
    }

    speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    const voices = speechSynthesis.getVoices();
    speech.voice = voices.find((v) => v.name === "Google US English") || voices.find((v) => v.lang.startsWith("en")) || null;

    speech.onend = () => {
        if (autoProgressCheck.checked && i < line.length - 1) {
            setTimeout(() => {
                nextBtn.click();
            }, 800);
        }
    };

    isPaused = false;
    speechSynthesis.speak(speech);
}

nextBtn.addEventListener("click", function () {
    if (i < line.length - 1) {
        i++;
        renderScene();
    } else {
        speechSynthesis.cancel();
        window.location.href = "main.html";
    }
});

prevBtn.addEventListener("click", function () {
    if (i > 0) {
        i--;
        renderScene();
    }
});

document.getElementById("pause").addEventListener("click", function () {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPaused = true;
    }
});

document.getElementById("play").addEventListener("click", function () {
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
    } else {
        speak(textElement.textContent);
    }
});

document.getElementById("stop").addEventListener("click", function () {
    speechSynthesis.cancel();
    isPaused = false;
});

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        prevBtn.click();
    } else if (event.key === "ArrowRight") {
        nextBtn.click();
    } else if (event.key === " ") {
        event.preventDefault();
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            isPaused = false;
        } else if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            isPaused = true;
        } else {
            speak(textElement.textContent);
        }
    }
});

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        if (speech === null && !speechSynthesis.speaking) {
            speak(line[i]);
        }
    };
}

buildNavigationDots();
renderScene();