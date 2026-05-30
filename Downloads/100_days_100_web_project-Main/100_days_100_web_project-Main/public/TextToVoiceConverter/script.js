const textInput = document.getElementById('text-input');
const convertBtn = document.getElementById('convert-btn');
const stopBtnText = document.getElementById('stop-btn-text');
const stopBtnVoice = document.getElementById('stop-btn-voice');
const langSelect = document.getElementById("language");

let speechSynthesis = window.speechSynthesis;
let speechSynthesisUtterance = new SpeechSynthesisUtterance();
speechSynthesisUtterance.onend = () => {
    convertBtn.disabled = false;
    stopBtnText.disabled = false;
};

convertBtn.addEventListener('click', () => {
    let text = textInput.value.trim();
    if (text !== '') {
        speechSynthesisUtterance.text = text;
        speechSynthesisUtterance.lang = langSelect.value;

        speechSynthesis.speak(speechSynthesisUtterance);
        convertBtn.disabled = true;
        stopBtnText.disabled = false;
    }
});
stopBtnText.addEventListener('click', () => {
    speechSynthesis.cancel();
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
});


// speech to text
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn-voice');
    const output = document.getElementById('output');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langSelect.value;

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        output.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };

    startBtn.addEventListener('click', () => {
    recognition.lang = langSelect.value; // dynamic language
    recognition.start();
    startBtn.disabled = true;     
    stopBtnVoice.disabled = false; 
    });

    stopBtnVoice.addEventListener('click', () => {
    recognition.stop();
    startBtn.disabled = false;     
    stopBtnVoice.disabled = true;
    });
});
