// TEXT TO SPEECH

const textInput = document.getElementById("text-input");
const convertBtn = document.getElementById("convert-btn");
const stopBtnText = document.getElementById("stop-btn-text");
const ttsLanguage = document.getElementById("tts-language");

const speechSynthesisObj = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

convertBtn.addEventListener("click", () => {
    const text = textInput.value.trim();

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    utterance.text = text;
    utterance.lang = ttsLanguage.value;

    speechSynthesisObj.speak(utterance);

    convertBtn.disabled = true;
    stopBtnText.disabled = false;
});

utterance.onend = () => {
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
};

stopBtnText.addEventListener("click", () => {
    speechSynthesisObj.cancel();

    convertBtn.disabled = false;
    stopBtnText.disabled = true;
});


// VOICE TO TEXT

const startBtn = document.getElementById("start-btn");
const stopBtnVoice = document.getElementById("stop-btn-voice");
const output = document.getElementById("output");
const sttLanguage = document.getElementById("stt-language");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        output.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    startBtn.addEventListener("click", () => {

        recognition.lang = sttLanguage.value;

        recognition.start();

        startBtn.disabled = true;
        stopBtnVoice.disabled = false;
    });

    stopBtnVoice.addEventListener("click", () => {

        recognition.stop();

        startBtn.disabled = false;
        stopBtnVoice.disabled = true;
    });
}
