let selectedImageAnswer = "";

const resultMessage = document.getElementById("resultMessage");

const captchaContainer = document.getElementById("captchaContainer");
const textInput = document.getElementById("captchaInput");

const refreshButton = document.querySelector(".refresh");
const submitButton = document.querySelector(".submit");

const dashboardAttempts = document.getElementById("stat-attempts");

// Select DOM Elements
const captchaTypeSelect = document.getElementById('captchaTypeSelect');
let selectedType = "text";
const voiceField = document.getElementById('voiceField');
const voiceSelect = document.getElementById('voiceSelect');
const textCaptchaField = document.querySelector('.textcaptcha');

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
    selector.innerHTML = `
        <button class="diff-btn" data-diff="easy">Easy</button>
        <button class="diff-btn" data-diff="medium">Medium</button>
        <button class="diff-btn" data-diff="hard">Hard</button>
    `;

    captchaContainer.parentNode.insertBefore(selector, captchaContainer);

    selector.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selector.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');;
            selectedDifficulty = btn.dataset.diff;
            generateCaptcha();
        });
    });
    
    // Set initial selected
    const initialBtn = selector.querySelector('.diff-btn[data-diff="medium"]');
    if (initialBtn) {
        initialBtn.classList.add('active');
    }
};

// --- CAPTCHA Generation ---
const generateTextCaptcha = () => {
    switch (selectedDifficulty) {
        case 'easy':
            return Math.random().toString(36).substring(2, 6).toUpperCase();
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
    const shuffled = [...images].sort(() => 0.5 - Math.random()).slice(0, 6);
    if (!shuffled.find(i => i.name === images[correctIndex].name)) {
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
        case 'hard':
            const a = Math.floor(Math.random() * 20) + 5;
            const b = Math.floor(Math.random() * 10) + 2;
            const c = Math.floor(Math.random() * 10) + 1;
            question = `${a} + ${b} × ${c}`;
            answer = a + b * c;
            break;
        default:
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const operation = Math.random() < 0.5 ? '+' : '-';
            question = `${num1} ${operation} ${num2}`;
            answer = operation === '+' ? num1 + num2 : num1 - num2;
    }
    return { question, answer };
};

const speakCaptcha = (text, repeat = 2, speed = 0.5) => {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance();

      // Repeat characters with spacing
      utterance.text = Array(repeat)
        .fill(text.split('').join(' '))
        .join('. . . ');

      // Safely check if voiceSelect exists
      if (typeof voiceSelect !== "undefined" && voiceSelect && voiceSelect.value) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voiceSelect.value);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.rate = speed;
      utterance.onend = resolve;
      utterance.onerror = (err) => reject(err);

      speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};


const populateVoiceList = () => {
     if (!voiceSelect) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) {
        voiceSelect.innerHTML = '<option value="">No voices available</option>';
        return;
    }
    const previousValue = voiceSelect.value;
    voiceSelect.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})${voice.default ? ' — default' : ''}</option>`)
        .join('');
    if (previousValue) voiceSelect.value = previousValue;
};

speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
populateVoiceList();

const drawDistortedCaptcha = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 80;
    canvas.style.borderRadius = '12px';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f0f7ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise dots
    for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 2.5, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(${Math.floor(Math.random()*180)},${Math.floor(Math.random()*180)},${Math.floor(Math.random()*220)},0.45)`;
        ctx.fill();
    }

    // Noise lines
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = `rgba(${Math.floor(Math.random()*150)},${Math.floor(Math.random()*150)},${Math.floor(Math.random()*220)},0.35)`;
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.stroke();
    }

    // Draw each character with distortion
    const chars = text.split('');
    const colors = ['#2563eb','#7c3aed','#db2777','#059669','#d97706','#dc2626'];
    const charWidth = canvas.width / (chars.length + 1);

    chars.forEach((char, i) => {
        ctx.save();
        const x = charWidth * (i + 0.8) + charWidth * 0.2;
        const y = canvas.height / 2 + (Math.random() * 14 - 7);
        const angle = (Math.random() * 30 - 15) * (Math.PI / 180);
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.font = `bold ${Math.floor(Math.random() * 10 + 26)}px Inter, Arial`;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(char, 0, 0);
        ctx.restore();
    });

    return canvas;
};

const generateCaptcha = () => {
    textInput.value = '';
    textInput.disabled = false;

    textCaptchaField.classList.remove('hidden');

    resultMessage.textContent = '';
    resultMessage.className = 'result';
    selectedImageAnswer = '';

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
            const canvas = drawDistortedCaptcha(currentCaptcha);
            captchaContainer.innerHTML = '';
            captchaContainer.style.padding = '16px';
            captchaContainer.appendChild(canvas);
            break;
        }
        case 'image': {
            textCaptchaField.classList.add('hidden');
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

const lockoutUser = () => {
    lockoutEndTime = Date.now() + 60 * 1000;
    updateLockoutUI();
};

const updateLockoutUI = () => {
    const now = Date.now();
    if (now < lockoutEndTime) {
        const remaining = Math.ceil((lockoutEndTime - now) / 1000);
        submitButton.disabled = true;
        resultMessage.textContent = `Too many attempts. Wait ${remaining} seconds.`;
        resultMessage.style.color = 'red';
        setTimeout(updateLockoutUI, 1000);
    } else {
        submitButton.disabled = false;
        resultMessage.textContent = '';
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


// Initialize application processes on initial window load
// ==========================
// CAPTCHA PAGE INIT
// ==========================

if (
    captchaTypeSelect &&
    captchaContainer &&
    textInput
) {

    addDifficultySelector();

    selectedType =
        captchaTypeSelect.value.toLowerCase();

    generateCaptcha();

    captchaTypeSelect.addEventListener("change", (e) => {
        selectedType = e.target.value.toLowerCase();
        selectedImageAnswer = "";
        generateCaptcha();
    });

    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            if (Date.now() >= lockoutEndTime) {
                generateCaptcha();
            }
        });
    }

    if (submitButton) {
        submitButton.addEventListener(
            "click",
            verifyCaptcha
        );
    }

    textInput.addEventListener("input", () => {
        if (selectedType === "math") {
            textInput.value =
                textInput.value.replace(/[^0-9-]/g, "");
        }
    });
}

if (dashboardAttempts) {

    const attempts =
        localStorage.getItem("attempts") || 0;

    const successes =
        localStorage.getItem("success") || 0;

    const failures =
        localStorage.getItem("fail") || 0;

    document.getElementById("stat-attempts").textContent =
        attempts;

    document.getElementById("stat-successes").textContent =
        successes;

    document.getElementById("stat-failures").textContent =
        failures;
}

// ==========================
// Theme Toggle (Global)
// ==========================

// Select all toggle buttons (use a common class)
const themeToggles = document.querySelectorAll(".theme");
const themeIcon = document.getElementById("themeIcon");

// Default = DARK MODE
let isLightMode = JSON.parse(localStorage.getItem("lightMode")) || false;

// Apply theme on load
function updateTheme() {
  if (isLightMode) {
    document.body.classList.add("light-theme");
    themeIcon.textContent = "🌙"; // show moon when light mode active
  } else {
    document.body.classList.remove("light-theme");
    themeIcon.textContent = "☀️"; // show sun when dark mode active
  }
}

// Toggle theme on any button click
themeToggles.forEach(btn => {
  btn.addEventListener("click", () => {
    isLightMode = !isLightMode;
    localStorage.setItem("lightMode", JSON.stringify(isLightMode));
    updateTheme();
  });
});

// Initialize on page load
updateTheme();
