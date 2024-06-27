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
