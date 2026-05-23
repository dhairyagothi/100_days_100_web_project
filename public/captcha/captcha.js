let selectedImageAnswer = "";
const typeButtons = document.querySelectorAll(".type-btn");
let selectedType = "text";
const captchaContainer = document.getElementById('captchaContainer');
const textInput = document.getElementById('captchaInput');
const refreshButton = document.querySelector('.refresh');
const resultMessage = document.querySelector('.result');
const submitButton = document.querySelector('.submit');
const voiceField = document.getElementById('voiceField');
const voiceSelect = document.getElementById('voiceSelect');

let currentCaptcha = null;
let attempts = 0;
const maxAttempts = 3;
let lockoutEndTime = 0;

const generateTextCaptcha = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateImageCaptcha = () => {
    const images = [
        { emoji: '🐶', name: 'dog' },
        { emoji: '🐱', name: 'cat' },
        { emoji: '🐭', name: 'mouse' },
        { emoji: '🐹', name: 'hamster' },
        { emoji: '🐰', name: 'rabbit' },
        { emoji: '🦊', name: 'fox' },
        { emoji: '🐻', name: 'bear' },
        { emoji: '🐼', name: 'panda' },
        { emoji: '🐨', name: 'koala' }
    ];
    const correctIndex = Math.floor(Math.random() * images.length);
    const shuffled = images.sort(() => 0.5 - Math.random()).slice(0, 6);
    if (!shuffled.includes(images[correctIndex])) {
        shuffled[Math.floor(Math.random() * 6)] = images[correctIndex];
    }
    return { images: shuffled, correct: images[correctIndex] };
};

const generateMathCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    const question = `${num1} ${operation} ${num2}`;
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    return { question, answer };
};

const speakCaptcha = (text, repeat = 2, speed = 0.5) => {
  return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = Array(repeat).fill(text.split('').join(' ')).join('. . . ');
      const selectedVoice = voiceSelect.value;
      if (selectedVoice) {
          const voice = speechSynthesis.getVoices().find(v => v.name === selectedVoice);
          if (voice) utterance.voice = voice;
      }
      utterance.rate = speed;
      utterance.onend = resolve;
      speechSynthesis.speak(utterance);
  });
};

const populateVoiceList = () => {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) {
      voiceSelect.innerHTML = '<option value="">No voices available</option>';
      return;
  }
  const previousValue = voiceSelect.value;
  voiceSelect.innerHTML = voices
      .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})${voice.default ? ' — default' : ''}</option>`)
      .join('');
  if (previousValue) {
      voiceSelect.value = previousValue;
  }
};

speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
populateVoiceList();

const generateCaptcha = () => {
    textInput.value = '';
    resultMessage.textContent = '';
    resultMessage.className = 'result';

    const type = captchaTypeSelect.value;
    if (type === 'audio') {
        voiceField.classList.remove('hidden');
    } else {
        voiceField.classList.add('hidden');
    }

    switch (type) {
        case 'text': {
            currentCaptcha = generateTextCaptcha();
            textInput.placeholder = 'Type the text above';
            captchaContainer.innerHTML = `<span style="font-size: 24px; letter-spacing: 5px;">${currentCaptcha}</span>`;
            break;
        }
        case 'image': {
            const { images, correct } = generateImageCaptcha();
            currentCaptcha = correct.name;
            textInput.placeholder = `Select the ${correct.name}`;
            captchaContainer.innerHTML = `
                <p>Select the ${correct.name}</p>
                <div class="image-grid">
                    ${images.map(img => `<button type="button" class="image-option">${img.emoji}</button>`).join('')}
                </div>
            `;
            captchaContainer.querySelectorAll('.image-option').forEach(option => {
                option.addEventListener('click', () => {
                    const selected = images.find(img => img.emoji === option.textContent).name;
                    textInput.value = selected;
                    option.classList.add('selected');
                    setTimeout(() => option.classList.remove('selected'), 200);
                });
            });
            break;
        }
        case 'audio': {
            currentCaptcha = generateTextCaptcha();
            textInput.placeholder = 'Enter the spoken characters';
            captchaContainer.innerHTML = `
                <p>Click play and enter the audio.</p>
                <button id="playAudio">Play Audio</button>
            `;
            const playButton = document.getElementById('playAudio');
            playButton.addEventListener('click', async () => {
                playButton.disabled = true;
                try {
                    await speakCaptcha(currentCaptcha);
                } catch (error) {
                    console.error('Speech synthesis failed:', error);
                    alert('Audio playback failed. Please try again or use a different CAPTCHA type.');
                } finally {
                    playButton.disabled = false;
                }
            });
            break;
        }
        case 'math': {
            const { question, answer } = generateMathCaptcha();
            currentCaptcha = answer.toString();
            textInput.placeholder = 'Enter the numeric answer';
            captchaContainer.innerHTML = `<span style="font-size: 24px;">${question} = ?</span>`;
            break;
        }
    }
};

const lockoutUser = () => {
  const lockoutDuration = 60; // 60 seconds lockout
  lockoutEndTime = Date.now() + lockoutDuration * 1000;
  updateLockoutUI();
};

const updateLockoutUI = () => {
  const now = Date.now();
  if (now < lockoutEndTime) {
      const remainingTime = Math.ceil((lockoutEndTime - now) / 1000);
      submitButton.disabled = true;
      resultMessage.textContent = `Too many unsuccessful attempts. Please wait ${remainingTime} seconds.`;
      resultMessage.style.color = "red";
      setTimeout(updateLockoutUI, 1000);
  } else {
      submitButton.disabled = false;
      resultMessage.textContent = "";
      attempts = 0;
      generateCaptcha();
  }
};

const verifyCaptcha = () => {
  if (Date.now() < lockoutEndTime) {
      return;
  }

  const userInput = 
  selectedType == "image"
  ? selectedImageAnswer.toLowerCase()
  : textInput.value.trim().toLowerCase();
  const isCorrect = userInput === currentCaptcha.toString().toLowerCase();
  
  if (isCorrect) {
      resultMessage.textContent = "Very Good! You passed the Test.";
      resultMessage.classList.add('success');
      resultMessage.classList.remove('error');
      attempts = 0;
      setTimeout(() => {
          textInput.value = "";
          resultMessage.textContent = "";
          resultMessage.className = 'result';
          generateCaptcha();
      }, 1500);
  } else {
      attempts++;
      if (attempts >= maxAttempts) {
          lockoutUser();
      } else {
          resultMessage.textContent = `Sorry, your input is incorrect. Please try again. (Attempt ${attempts}/${maxAttempts})`;
          resultMessage.classList.add('error');
          resultMessage.classList.remove('success');
      }
  }
};

typeButtons.forEach(button =>{
    button.addEventListener ("click", () =>{
        typeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedType = button.dataset.type;
        textInput.value = "";       //clears the text input field
        selectedImageAnswer = "";   // resets the stored image answer too
        generateCaptcha();
    });
});
refreshButton.addEventListener("click", () => {
  if (Date.now() >= lockoutEndTime) {
      generateCaptcha();
  }
});
submitButton.addEventListener("click", verifyCaptcha);

generateCaptcha();