const line = ["The Fearsome Lion: A mighty lion ruled the forest, terrifying all animals. Every day, he hunted mercilessly, making the creatures live in fear.",
    "The Scared Animals: The animals were terrified of the lion and desperately searched for a way to stop his constant hunting.",
    "The Lion’s Daily Kill: With no one to challenge him, the lion continued to hunt and kill animals every day, causing panic in the jungle.",
    "Choosing the Rabbit: To prevent random killings, the animals decided that one of them would be sent as a sacrifice each day. When it was the rabbit’s turn, he was chosen reluctantly because of his small size.",
    "The Rabbit’s Plan: Instead of going directly to the lion, the clever rabbit thought of a way to trick him. He delayed his arrival and came up with a story to deceive the lion.",
    "The Deception: The rabbit told the lion that another, stronger lion had claimed the jungle and had stopped him on the way. Enraged, the lion demanded to see his so-called rival.",
    "The Well Trick: The rabbit led the lion to a deep well and pointed inside, saying the rival lion was inside. The lion looked in and saw his own reflection in the water.",
    "The Fatal Leap: The lion, thinking his reflection was a real enemy, roared angrily. He jumped into the well to attack, only to drown in the deep water.",
    "The Animals’ Celebration: The rabbit returned to the other animals and announced the lion’s demise. Overjoyed, the animals cheered and finally lived in peace, free from fear. THE END"
];

const images = ["images/lion.webp", "images/second.webp", "images/lion+kill.jpg", "images/rabbit.png", "images/rabbit+thinking.avif", "images/well.jpg", "images/poster.jpeg", "images/lion+look.jpeg", "images/animal+happy.avif"];
const sceneLabels = [
    "The Fearsome Lion",
    "The Scared Animals",
    "The Lion’s Daily Kill",
    "Choosing the Rabbit",
    "The Rabbit’s Plan",
    "The Deception",
    "The Well Trick",
    "The Fatal Leap",
    "The Animals’ Celebration"
];

const textElement = document.getElementById("text");
const imageElement = document.getElementById("image");
const sceneLabelElement = document.getElementById("scene-label");

let i = 0;
let speech = null;
let isPaused = false;
textElement.textContent = line[i];

function renderScene() {
    textElement.textContent = line[i];
    imageElement.src = images[i];
    imageElement.alt = sceneLabels[i];
    sceneLabelElement.textContent = `${sceneLabels[i]} • Scene ${i + 1} of ${line.length}`;
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
    speech.voice = voices.find((voice) => voice.name === "Google US English") || voices.find((voice) => voice.lang.startsWith("en")) || null;

    isPaused = false;
    speechSynthesis.speak(speech);
}

document.getElementById("next").addEventListener("click", function () {
    i = (i + 1) % line.length;
    renderScene();
});


document.getElementById("pause").addEventListener("click", function () {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPaused = true;
    }
});


document.getElementById("play").addEventListener("click", function () {
    const text1 = textElement.textContent;
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
    } else {
        speak(text1);
    }
});

document.getElementById("stop").addEventListener("click", function () {
    speechSynthesis.cancel();
    isPaused = false;
});

window.speechSynthesis.onvoiceschanged = function () {
    const voices = speechSynthesis.getVoices();
    console.log(voices);
};

renderScene();
