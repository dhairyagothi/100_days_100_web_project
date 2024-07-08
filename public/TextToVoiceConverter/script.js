const textInput = document.getElementById('text-input');
const convertBtn = document.getElementById('convert-btn');
const stopBtn = document.getElementById('stop-btn');

let speechSynthesis = window.speechSynthesis;
let speechSynthesisUtterance = new SpeechSynthesisUtterance();

convertBtn.addEventListener('click', () => {
    let text = textInput.value.trim();
    if (text !== '') {
        speechSynthesisUtterance.text = text;
        speechSynthesis.speak(speechSynthesisUtterance);
        convertBtn.disabled = true;
        stopBtn.disabled = false;
    }
});

stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    convertBtn.disabled = false;
    stopBtn.disabled = true;
});

// speech to text
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const output = document.getElementById('output');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
        recognition.start();
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
});
