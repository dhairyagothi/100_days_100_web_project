let selectedImageAnswer = "";

// Select DOM Elements
const captchaTypeSelect = document.getElementById('captchaTypeSelect');
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
let selectedDifficulty = "medium";

// Add difficulty selector UI dynamic attachment
const addDifficultySelector = () => {
    const existing = document.getElementById('difficulty-selector');
    if (existing) return;

    const selector = document.createElement('div');
    selector.id = 'difficulty-selector';
    selector.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 10px 0;
    `;
    selector.innerHTML = `
        <button class="diff-btn active" data-diff="easy" style="padding: 5px 15px; border-radius: 20px; border: 2px solid #ccc; cursor: pointer; background: #4CAF50; color: white;">Easy</button>
        <button class="diff-btn active" data-diff="medium" style="padding: 5px 15px; border-radius: 20px; border: 2px solid #ccc; cursor: pointer; background: #2196F3; color: white;">Medium</button>
        <button class="diff-btn" data-diff="hard" style="padding: 5px 15px; border-radius: 20px; border: 2px solid #ccc; cursor: pointer; background: #f44336; color: white;">Hard</button>
    `;

    const buttonSection = document.querySelector('.button') || captchaContainer.parentNode;
    buttonSection.parentNode.insertBefore(selector, buttonSection);

    selector.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selector.querySelectorAll('.diff-btn').forEach(b => b.style.opacity = '0.5');
            btn.style.opacity = '1';
            selectedDifficulty = btn.dataset.diff;
            generateCaptcha();
        });
    });
};

const generateTextCaptcha = () => {
    switch (selectedDifficulty) {
        case 'easy':
            return Math.random().toString(36).substring(2, 6).toUpperCase();
        case 'medium':
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        case 'hard':
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
            let result = '';
            for (let i = 0; i < 10; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        default:
            return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
};

const generateImageCaptcha = () => {
    const images = [
        { emoji: '<i class="fas fa-dog fa-2x" style="color: #8b5a2b;"></i>', name: 'dog' },
        { emoji: '<i class="fas fa-cat fa-2x" style="color: #f59e0b;"></i>', name: 'cat' },
        { emoji: '<i class="fas fa-dove fa-2x" style="color: #60a5fa;"></i>', name: 'bird' },
        { emoji: '<i class="fas fa-spider fa-2x" style="color: #111827;"></i>', name: 'spider' },
        { emoji: '<i class="fas fa-frog fa-2x" style="color: #10b981;"></i>', name: 'frog' },
        { emoji: '<i class="fas fa-horse fa-2x" style="color: #b45309;"></i>', name: 'horse' },
        { emoji: '<i class="fas fa-fish fa-2x" style="color: #06b6d4;"></i>', name: 'fish' },
        { emoji: '<i class="fas fa-dragon fa-2x" style="color: #ef4444;"></i>', name: 'dragon' },
        { emoji: '<i class="fas fa-car fa-2x" style="color: #6b7280;"></i>', name: 'train' }
    ];
    const correctIndex = Math.floor(Math.random() * images.length);
    const shuffled = images.sort(() => 0.5 - Math.random()).slice(0, 6);
    if (!shuffled.includes(images[correctIndex])) {
        shuffled[Math.floor(Math.random() * 6)] = images[correctIndex];
    }
    return { images: shuffled, correct: images[correctIndex] };
};

const generateMathCaptcha = () => {
    let question, answer;
    switch (selectedDifficulty) {
        case 'easy':
            const n1 = Math.floor(Math.random() * 10) + 1;
            const n2 = Math.floor(Math.random() * 10) + 1;
            question = `${n1} + ${n2}`;
            answer = n1 + n2;
            break;
        case 'medium':
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const operation = Math.random() < 0.5 ? '+' : '-';
            question = `${num1} ${operation} ${num2}`;
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;
        case 'hard':
            const a = Math.floor(Math.random() * 20) + 5;
            const b = Math.floor(Math.random() * 10) + 2;
            const c = Math.floor(Math.random() * 10) + 1;
            question = `${a} + ${b} × ${c}`;
            answer = a + b * c;
            break;
        default:
            const d1 = Math.floor(Math.random() * 10) + 1;
            const d2 = Math.floor(Math.random() * 10) + 1;
            question = `${d1} + ${d2}`;
            answer = d1 + d2;
    }
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

    // Normalize type string case to prevent logic matching bugs
    const type = selectedType.toLowerCase();

    if (type === 'audio') {
        voiceField.classList.remove('hidden');
    } else {
        voiceField.classList.add('hidden');
    }

    // Toggle interaction layout configurations explicitly based on state modes
    if (type === 'image') {
        textInput.disabled = true;
        textInput.placeholder = 'Click an image option above';
    } else {
        textInput.disabled = false;
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
            captchaContainer.innerHTML = `
                <p style="margin-bottom: 10px; font-weight: 600;">Select the <strong>${correct.name}</strong></p>
                <div class="image-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                    ${images.map(img => `<button type="button" class="image-option" style="padding: 10px; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; background: white;">${img.emoji}</button>`).join('')}
                </div>
            `;
            
            captchaContainer.querySelectorAll('.image-option').forEach(option => {
                option.addEventListener('click', () => {
                    captchaContainer.querySelectorAll(".image-option")
                        .forEach(img => {
                            img.style.borderColor = "#ccc";
                            img.style.background = "white";
                        });
                    
                    option.style.borderColor = "#2196F3";
                    option.style.background = "#e3f2fd";
                    
                    selectedImageAnswer = images.find(img => option.innerHTML.includes(img.emoji)).name;
                });
            });
            break;
        }
        case 'audio': {
            currentCaptcha = generateTextCaptcha();
            textInput.placeholder = 'Enter the spoken characters';
            captchaContainer.innerHTML = `
                <p style="margin-bottom: 10px;">Click play and enter the audio.</p>
                <button id="playAudio" type="button" style="padding: 6px 12px; margin-bottom: 10px;">Play Audio</button>
            `;
            const playButton = document.getElementById('playAudio');
            playButton.addEventListener('click', async () => {
                playButton.disabled = true;
                try {
                    await speakCaptcha(currentCaptcha);
                } catch (error) {
                    console.error('Speech synthesis failed:', error);
                    alert('Audio playback failed.');
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
            captchaContainer.innerHTML = `<span style="font-size: 24px; font-weight: bold;">${question} = ?</span>`;
            break;
        }
    }
};

// Math captcha numeric regex input validation
textInput.addEventListener("input", () => {
    if (selectedType.toLowerCase() === "math") {
        textInput.value = textInput.value.replace(/[^0-9-]/g, "");
    }
});

const lockoutUser = () => {
    const lockoutDuration = 60;
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
  selectedType.toLowerCase() === "image"
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

// Event Listener for the dropdown menu selection state updates
if (captchaTypeSelect) {
    captchaTypeSelect.addEventListener("change", (event) => {
        selectedType = event.target.value.toLowerCase(); 
        textInput.value = "";
        selectedImageAnswer = "";
        generateCaptcha(); 
    });
}

refreshButton.addEventListener("click", () => {
    if (Date.now() >= lockoutEndTime) {
        generateCaptcha();
    }
});

submitButton.addEventListener("click", verifyCaptcha);

// Initialize application processes on initial window load
addDifficultySelector();
if (captchaTypeSelect) {
    selectedType = captchaTypeSelect.value.toLowerCase(); 
}
generateCaptcha();