const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const status = document.querySelector('.status-text');
const wave =document.querySelector('.wave-container');
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    status.textContent = "Speech Recognition not supported";
} else {
    const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    btn.classList.add('active');
    wave.classList.add('active');
    content.textContent = "Listening...";
    status.textContent ="Jarvis is listening";
    recognition.start();
});
}

recognition.onend = () => {
    btn.classList.remove('active');
    wave.classList.remove('active');
    content.textContent ="Click here to speak";
    status.textContent ="Idle";
};

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

particlesJS("particles-js", {

    particles: {
        number: {value: 45,density: {enable: true,value_area: 800}},
        color: {value: "#00bcd4"},
        shape: {type: "circle"},
        opacity: {value: 0.25},
        size: { value: 2},
        line_linked: {
            enable: true,
            distance: 140,
            color: "#00bcd4",
            opacity: 0.08,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.4
        }
    },

    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {enable: false},
            resize: true
        }
    },
    retina_detect: true
});