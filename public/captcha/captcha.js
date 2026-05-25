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
let selectedDifficulty = "medium";

// Add difficulty selector UI
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
            const fontSize = selectedDifficulty === 'hard' ? '18px' : '24px';
            const filter = selectedDifficulty === 'hard' ? 'blur(0.5px)' : 'none';
            captchaContainer.innerHTML = `
                <span style="font-size: ${fontSize}; letter-spacing: 5px; filter: ${filter}; font-style: italic;">
                    ${currentCaptcha}
                </span>
                <p style="font-size:12px; color:#888;">Difficulty: ${selectedDifficulty}</p>
            `;
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
            captchaContainer.innerHTML = `
                <span style="font-size: 24px;">${question} = ?</span>
                <p style="font-size:12px; color:#888;">Difficulty: ${selectedDifficulty}</p>
            `;
            break;
    }
};

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

typeButtons.forEach(button => {
    button.addEventListener("click", () => {
        typeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedType = button.dataset.type;
        textInput.value = "";
        selectedImageAnswer = "";
        generateCaptcha();
    });
});

refreshButton.addEventListener("click", () => {
    if (Date.now() >= lockoutEndTime) {
        generateCaptcha();
    }
});

submitButton.addEventListener("click", verifyCaptcha);

addDifficultySelector();
generateCaptcha();
