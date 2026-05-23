let selectedImageAnswer = "";
const typeButtons = document.querySelectorAll(".type-btn");
let selectedType = "text";
const captchaContainer = document.getElementById('captchaContainer');
const textInput = document.querySelector(".textcaptcha input");
const refreshButton = document.querySelector(".refresh");
const resultMessage = document.querySelector(".result");
const submitButton = document.querySelector(".button button");

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
      utterance.rate = speed;
      utterance.onend = resolve;
      speechSynthesis.speak(utterance);
  });
};

const generateCaptcha = () => {
    const type = selectedType;
    switch (type) {
        case 'text':
            currentCaptcha = generateTextCaptcha();
            document.querySelector(".textcaptcha").style.display = "block";
            captchaContainer.innerHTML = `<span style="font-size: 24px; letter-spacing: 5px;">${currentCaptcha}</span>`;
            break;
        case 'image':
            const { images, correct } = generateImageCaptcha();
            currentCaptcha = correct.name;
            document.querySelector(".textcaptcha").style.display = "none";
            captchaContainer.innerHTML = `
                <p>Select the ${correct.name}</p>
                <div class="image-grid">
                    ${images.map(img => `<div class="image-option">${img.emoji}</div>`).join('')}
                </div>
            `;
            captchaContainer.querySelectorAll('.image-option').forEach(option => {
                option.addEventListener('click', () => {
                    captchaContainer.querySelectorAll(".image-option")
                    .forEach(img => img.classList.remove("selected"));
                    option.classList.add("selected");
                    selectedImageAnswer = images.find(img => img.emoji === option.textContent).name;
                });
            });
            break;
            case 'audio':
            currentCaptcha = generateTextCaptcha();
            document.querySelector(".textcaptcha").style.display = "block";
            captchaContainer.innerHTML = `
                <p>Click play and enter the spoken characters:</p>
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
        case 'math':
            const { question, answer } = generateMathCaptcha();
            currentCaptcha = answer.toString();
            document.querySelector(".textcaptcha").style.display = "block";
            captchaContainer.innerHTML = `<span style="font-size: 24px;">${question} = ?</span>`;
            break;
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
      resultMessage.textContent = "Correct! CAPTCHA solved.";
      resultMessage.style.color = "green";
      attempts = 0;
      setTimeout(() => {
          textInput.value = "";
          resultMessage.textContent = "";
          generateCaptcha();
      }, 1500);
  } else {
      attempts++;
      if (attempts >= maxAttempts) {
          lockoutUser();
      } else {
          resultMessage.textContent = `Incorrect. Please try again. \n(Attempt ${attempts}/${maxAttempts})`;
          resultMessage.style.color = "#d01100";
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