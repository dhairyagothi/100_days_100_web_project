// getting all the elements at once to avoid multiple DOM queries and for better performance
const textInput = document.getElementById("text-input");
const convertBtn = document.getElementById("convert-btn");
const speechStopBtn = document.getElementById("speech-stop-btn");
const startBtn = document.getElementById("start-btn");
const recognitionStopBtn = document.getElementById("recognition-stop-btn");
const output = document.getElementById("output");

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let utterance = null;
let recognition = null;
let isRecognizing = false;

// These functions control which buttons should be enabled or disabled while the app is working
function setSpeechButtons(isSpeaking) {
    convertBtn.disabled = isSpeaking;
    speechStopBtn.disabled = !isSpeaking;
}

function setRecognitionButtons(isListening) {
    startBtn.disabled = isListening;
    recognitionStopBtn.disabled = !isListening;
}

// This function converts the text written by the user into speech
function speakText() {
    const text = textInput.value.trim();

    if (!text || !synth) {
        return;
    }
    // Stops any speech that may already be playing
    synth.cancel();

    // Creates a new speech object using the user’s text
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // When the speech finishes or if there’s an error --> re-enable the buttons
    utterance.onend = () => setSpeechButtons(false);
    utterance.onerror = () => setSpeechButtons(false);

    // Starts speaking the text
    synth.speak(utterance);
    setSpeechButtons(true);
}

// This function stops the text to voice speech
function stopSpeech() {
    if (synth) {
        synth.cancel();
    }

    setSpeechButtons(false);
}

// This function starts voice to text recognition
function startRecognition() {
    if (!recognition || isRecognizing) {
        return;
    }

    output.placeholder = "Listening...";
    recognition.start();
}
// This function stops voice to text recognition
function stopRecognition() {
    if (!recognition || !isRecognizing) {
        return;
    }

    recognition.stop();
}

// When the user clicks Convert, speakText() runs
convertBtn.addEventListener("click", speakText);
// When the user clicks Stop, stopSpeech() runs
speechStopBtn.addEventListener("click", stopSpeech);

if (!synth) {
    convertBtn.disabled = true;
    speechStopBtn.disabled = true;
    textInput.placeholder = "Speech synthesis is not supported in this browser.";
}

if (SpeechRecognition) {
    // Creates a new speech recognition object
    recognition = new SpeechRecognition();
    recognition.continuous = true; // continues to listen until the user stops it
    recognition.interimResults = true;
    recognition.lang = "en-US"; // sets the language to English (United States)

    // When the recognition starts, this event runs
    recognition.onstart = () => {
        isRecognizing = true;
        setRecognitionButtons(true);
    };

    // Runs whenever speech is detected and converted into text
    recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
            transcript += event.results[i][0].transcript;
        }
        // Shows the converted speech inside the output textarea
        output.value = transcript.trimStart();
    };

    // If recognition fails, it shows an error message and resets the buttons
    recognition.onerror = () => {
        output.placeholder = "Speech recognition could not start. Please try again.";
        isRecognizing = false;
        setRecognitionButtons(false);
    };

    // When recognition stops, it resets the listening status and button states
    recognition.onend = () => {
        isRecognizing = false;
        output.placeholder = "Your speech will appear here...";
        setRecognitionButtons(false);
    };

    // When the user clicks Speak, voice recognition starts
    startBtn.addEventListener("click", startRecognition);
    // When the user clicks Stop, voice recognition stops
    recognitionStopBtn.addEventListener("click", stopRecognition);
    // Sets the initial state --> Speak enabled,Stop disabled
    setRecognitionButtons(false);
} else {
    // If the browser does not support voice to text, it disables the buttons and shows a message
    startBtn.disabled = true;
    recognitionStopBtn.disabled = true;
    output.placeholder = "Speech recognition is not supported in this browser.";
}
