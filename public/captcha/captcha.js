let selectedImageAnswer = "";
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

const addDifficultySelector = () => {
    const existing = document.getElementById('difficulty-selector');
    if (existing) return;

    const selector = document.createElement('div');
    selector.id = 'difficulty-selector';
    selector.style.cssText = 'display:flex;justify-content:center;gap:10px;margin:10px 0;';
    selector.innerHTML = `
        <button class="diff-btn" data-diff="easy" style="padding:5px 15px;border-radius:20px;border:2px solid #ccc;cursor:pointer;background:#4CAF50;color:white;">Easy</button>
        <button class="diff-btn" data-diff="medium" style="padding:5px 15px;border-radius:20px;border:2px solid #ccc;cursor:pointer;background:#2196F3;color:white;">Medium</button>
        <button class="diff-btn" data-diff="hard" style="padding:5px 15px;border-radius:20px;border:2px solid #ccc;cursor:pointer;background:#f44336;color:white;">Hard</button>
    `;

    captchaContainer.parentNode.insertBefore(selector, captchaContainer);

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
        { emoji: '<i class="fas fa-dog fa-2x" style="color:#8b5a2b;"></i>', name: 'dog' },
        { emoji: '<i class="fas fa-cat fa-2x" style="color:#f59e0b;"></i>', name: 'cat' },
        { emoji: '<i class="fas fa-dove fa-2x" style="color:#60a5fa;"></i>', name: 'bird' },
        { emoji: '<i class="fas fa-spider fa-2x" style="color:#111827;"></i>', name: 'spider' },
        { emoji: '<i class="fas fa-frog fa-2x" style="color:#10b981;"></i>', name: 'frog' },
        { emoji: '<i class="fas fa-horse fa-2x" style="color:#b45309;"></i>', name: 'horse' },
        { emoji: '<i class="fas fa-fish fa-2x" style="color:#06b6d4;"></i>', name: 'fish' },
        { emoji: '<i class="fas fa-dragon fa-2x" style="color:#ef4444;"></i>', name: 'dragon' },
        { emoji: '<i class="fas fa-locomotive fa-2x" style="color:#6b7280;"></i>', name: 'train' }
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
    if (previousValue) voiceSelect.value = previousValue;
};

speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
populateVoiceList();

const drawDistortedCaptcha = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 80;
    canvas.style.cssText = 'border-radius:12px; display:block; margin:0 auto;';
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
    resultMessage.textContent = '';
    resultMessage.className = 'result';
    selectedImageAnswer = '';

    const type = selectedType;

    if (type === 'audio') {
        voiceField.classList.remove('hidden');
    } else {
        voiceField.classList.add('hidden');
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
            const { images, correct } = generateImageCaptcha();
            currentCaptcha = correct.name;
            textInput.disabled = true;
            textInput.placeholder = `Select the ${correct.name}`;
            captchaContainer.innerHTML = `
                <p>Select the ${correct.name}</p>
                <div class="image-grid">
                    ${images.map(img => `<button type="button" class="image-option">${img.emoji}</button>`).join('')}
                </div>
            `;
            captchaContainer.querySelectorAll('.image-option').forEach(option => {
                option.addEventListener('click', () => {
                    captchaContainer.querySelectorAll('.image-option').forEach(img => img.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedImageAnswer = images.find(img => option.innerHTML.includes(img.emoji)).name;
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
                    alert('Audio playback failed. Please try again.');
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
            captchaContainer.innerHTML = `<span style="font-size:24px;">${question} = ?</span>`;
            break;
        }
    }
};

textInput.addEventListener('input', () => {
    if (selectedType === 'math') {
        textInput.value = textInput.value.replace(/[^0-9-]/g, '');
    }
});

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
    if (Date.now() < lockoutEndTime) return;

    if (selectedType === 'image' && !selectedImageAnswer) {
        resultMessage.textContent = 'Please select an image before submitting.';
        resultMessage.classList.add('error');
        resultMessage.classList.remove('success');
        return;
    }

    const userInput = selectedType === 'image'
        ? selectedImageAnswer.toLowerCase()
        : textInput.value.trim().toLowerCase();

    const isCorrect = userInput === currentCaptcha.toString().toLowerCase();

    if (isCorrect) {
        resultMessage.textContent = 'Very Good! You passed the Test.';
        resultMessage.classList.add('success');
        resultMessage.classList.remove('error');
        attempts = 0;
        setTimeout(() => {
            textInput.value = '';
            resultMessage.textContent = '';
            resultMessage.className = 'result';
            generateCaptcha();
        }, 1500);
    } else {
        attempts++;
        if (attempts >= maxAttempts) {
            lockoutUser();
        } else {
            resultMessage.textContent = `Incorrect. Try again. (Attempt ${attempts}/${maxAttempts})`;
            resultMessage.classList.add('error');
            resultMessage.classList.remove('success');
        }
    }
};

if (captchaTypeSelect) {
    captchaTypeSelect.addEventListener('change', (event) => {
        selectedType = event.target.value;
        textInput.value = '';
        selectedImageAnswer = '';
        generateCaptcha();
    });
}

refreshButton.addEventListener('click', () => {
    if (Date.now() >= lockoutEndTime) generateCaptcha();
});

submitButton.addEventListener('click', verifyCaptcha);

addDifficultySelector();
if (captchaTypeSelect) selectedType = captchaTypeSelect.value;
generateCaptcha();