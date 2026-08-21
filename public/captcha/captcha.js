let selectedImageAnswer = "";
let currentCaptcha = null;
let selectedDifficulty = "medium";
let selectedType = 'text';
let attempts = 3;
const maxAttempts = 3;
let lockoutEndTime = 0;
let timerId = null;
let time = 30;

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

const captchaContainer = document.getElementById('captchaContainer');
const textInput = document.getElementById('captchaInput');
const refreshButton = document.querySelector('.refresh');
const submitButton = document.querySelector('.submit');
const captchaTypeSelect = document.getElementById('captchaTypeSelect');
const difficultySelect = document.getElementById('difficulty');
const voiceField = document.getElementById('voiceField');
const voiceSelect = document.getElementById('voiceSelect');
const textCaptchaField = document.querySelector('.textcaptcha');
const attemptsEl = document.getElementById('attempts');
const timerEl = document.getElementById('timer');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    document.body.classList.toggle('light', nextTheme === 'light');
    document.body.classList.toggle('dark', nextTheme === 'dark');
    if (themeIcon) {
        themeIcon.textContent = nextTheme === 'light' ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', nextTheme);
}

function updateAttemptsUI() {
    if (attemptsEl) {
        attemptsEl.textContent = attempts;
    }
}

function updateTimerUI() {
    if (timerEl) {
        timerEl.textContent = time;
    }
}

function resetTimer() {
    clearInterval(timerId);
    time = 30;
    updateTimerUI();
    timerId = setInterval(() => {
        time -= 1;
        updateTimerUI();
        if (time <= 0) {
            clearInterval(timerId);
            showToast('warning', 'Time Up', 'The challenge expired. A fresh one is loading.', 2600);
            setTimeout(() => {
                generateCaptcha();
                resetTimer();
            }, 1200);
        }
    }, 1000);
}

function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] ?? '!'}</div>
        <div class="toast-body">
            <span class="toast-title">${title}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" aria-label="Dismiss notification">×</button>
    `;

    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => dismissToast(toast));
    container.appendChild(toast);

    const timer = setTimeout(() => dismissToast(toast), duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => dismissToast(toast), 800);
    });
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-exit')) return;
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

function generateTextCaptcha() {
    const lengthMap = { easy: 4, medium: 6, hard: 8 };
    const length = lengthMap[selectedDifficulty] || 6;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let index = 0; index < length; index += 1) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function generateImageCaptcha() {
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
    if (!shuffled.find((item) => item.name === images[correctIndex].name)) {
        shuffled[Math.floor(Math.random() * shuffled.length)] = images[correctIndex];
    }
    return { images: shuffled, correct: images[correctIndex] };
}

function generateMathCaptcha() {
    let question = '';
    let answer = 0;
    if (selectedDifficulty === 'easy') {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        question = `${n1} + ${n2}`;
        answer = n1 + n2;
    } else if (selectedDifficulty === 'hard') {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        question = `${a} + ${b} × ${c}`;
        answer = a + b * c;
    } else {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() < 0.5 ? '+' : '-';
        question = `${n1} ${operation} ${n2}`;
        answer = operation === '+' ? n1 + n2 : n1 - n2;
    }
    return { question, answer };
}

function drawDistortedCaptcha(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.fillStyle = '#f8fbff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 70; index += 1) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 180)}, ${Math.floor(Math.random() * 180)}, ${Math.floor(Math.random() * 220)}, 0.45)`;
        ctx.fill();
    }

    const chars = text.split('');
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626'];
    const charWidth = canvas.width / (chars.length + 1);

    chars.forEach((char, idx) => {
        ctx.save();
        const x = charWidth * (idx + 0.8) + charWidth * 0.2;
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
}

function speakCaptcha(text, repeat = 2, speed = 0.5) {
    return new Promise((resolve, reject) => {
        try {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = Array(repeat).fill(text.split('').join(' ')).join('. . . ');
            if (voiceSelect && voiceSelect.value) {
                const voices = speechSynthesis.getVoices();
                const selectedVoice = voices.find((voice) => voice.name === voiceSelect.value);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }
            utterance.rate = speed;
            utterance.onend = resolve;
            utterance.onerror = reject;
            speechSynthesis.speak(utterance);
        } catch (error) {
            reject(error);
        }
    });
}

function populateVoiceList() {
    if (!voiceSelect) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) {
        voiceSelect.innerHTML = '<option value="">No voices available</option>';
        return;
    }
    const previousValue = voiceSelect.value;
    voiceSelect.innerHTML = voices.map((voice) => `<option value="${voice.name}">${voice.name} (${voice.lang})${voice.default ? ' — default' : ''}</option>`).join('');
    if (previousValue) {
        voiceSelect.value = previousValue;
    }
}

function generateCaptcha() {
    if (!captchaContainer || !textInput) return;

    textInput.value = '';
    textInput.disabled = false;
    textInput.placeholder = 'Type the characters shown above';
    selectedImageAnswer = '';
    if (textCaptchaField) {
        textCaptchaField.classList.remove('hidden');
    }

    const type = (captchaTypeSelect?.value || 'text').toLowerCase();
    selectedType = type;

    if (voiceField) {
        voiceField.classList.toggle('hidden', type !== 'audio');
    }

    if (type === 'image') {
        textInput.disabled = true;
        textInput.placeholder = 'Select the correct image option';
    }

    switch (type) {
        case 'text': {
            currentCaptcha = generateTextCaptcha();
            const canvas = drawDistortedCaptcha(currentCaptcha);
            captchaContainer.innerHTML = '';
            captchaContainer.appendChild(canvas);
            break;
        }
        case 'image': {
            if (textCaptchaField) {
                textCaptchaField.classList.add('hidden');
            }
            const { images, correct } = generateImageCaptcha();
            currentCaptcha = correct.name;
<<<<<<< HEAD
<<<<<<< Updated upstream
            textInput.disabled = true;
=======
            textInput.disabled=true
>>>>>>> Stashed changes
            textInput.placeholder = `Select the ${correct.name}`;
=======
>>>>>>> upstream/main
            captchaContainer.innerHTML = `
                <div class="image-grid">
                    ${images.map((img) => `<button type="button" class="image-option">${img.emoji}</button>`).join('')}
                </div>
            `;
            captchaContainer.querySelectorAll('.image-option').forEach((option, index) => {
                option.addEventListener('click', () => {
                    captchaContainer.querySelectorAll('.image-option').forEach((button) => button.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedImageAnswer = images[index].name;
                });
            });
            break;
        }
        case 'audio': {
            currentCaptcha = generateTextCaptcha();
            captchaContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.7rem;">
                    <p>Listen to the spoken characters and type them below.</p>
                    <button id="playAudio" type="button">Play Audio</button>
                </div>
            `;
            const playButton = document.getElementById('playAudio');
            playButton?.addEventListener('click', async () => {
                playButton.disabled = true;
                try {
                    await speakCaptcha(currentCaptcha);
                } catch (error) {
                    console.error('Speech synthesis failed:', error);
                    showToast('error', 'Audio Error', 'The browser could not play the audio.', 3000);
                } finally {
                    playButton.disabled = false;
                }
            });
            break;
        }
        case 'math': {
            const { question, answer } = generateMathCaptcha();
            currentCaptcha = answer.toString();
            captchaContainer.innerHTML = `<div style="font-size:1.7rem; font-weight:700; letter-spacing:0.02em;">${question} = ?</div>`;
            break;
        }
        default:
            break;
    }
}

function getStats() {
    return {
        attempts: parseInt(localStorage.getItem('captcha_attempts') || '0', 10),
        successes: parseInt(localStorage.getItem('captcha_success') || '0', 10),
        failures: parseInt(localStorage.getItem('captcha_fail') || '0', 10),
        streak: parseInt(localStorage.getItem('captcha_streak') || '0', 10),
        bestStreak: parseInt(localStorage.getItem('captcha_best') || '0', 10),
        activity: JSON.parse(localStorage.getItem('captcha_activity') || '[]')
    };
}

function saveStats(stats) {
    localStorage.setItem('captcha_attempts', stats.attempts);
    localStorage.setItem('captcha_success', stats.successes);
    localStorage.setItem('captcha_fail', stats.failures);
    localStorage.setItem('captcha_streak', stats.streak);
    localStorage.setItem('captcha_best', stats.bestStreak);
    localStorage.setItem('captcha_activity', JSON.stringify(stats.activity.slice(-12)));
}

function recordAttempt(isCorrect) {
    const stats = getStats();
    stats.attempts += 1;
    if (isCorrect) {
        stats.successes += 1;
        stats.streak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    } else {
        stats.failures += 1;
        stats.streak = 0;
    }
    stats.activity.push({
        result: isCorrect ? 'success' : 'fail',
        type: selectedType,
        time: new Date().toLocaleString()
    });
    saveStats(stats);
}

function renderDashboard() {
    const stats = getStats();
    const attemptsElDashboard = document.getElementById('stat-attempts');
    const successesEl = document.getElementById('stat-successes');
    const failuresEl = document.getElementById('stat-failures');
    const streakEl = document.getElementById('stat-streak');
    const bestStreakEl = document.getElementById('stat-best-streak');
    const rateEl = document.getElementById('stat-rate');
    const progressBarEl = document.getElementById('progress-bar');
    const insightsEl = document.getElementById('insights-text');
    const activityListEl = document.getElementById('activity-list');
    const resetButton = document.getElementById('reset-btn');

    if (attemptsElDashboard) attemptsElDashboard.textContent = stats.attempts;
    if (successesEl) successesEl.textContent = stats.successes;
    if (failuresEl) failuresEl.textContent = stats.failures;
    if (streakEl) streakEl.textContent = stats.streak;
    if (bestStreakEl) bestStreakEl.textContent = stats.bestStreak;

    const rate = stats.attempts > 0 ? Math.round((stats.successes / stats.attempts) * 100) : 0;
    if (rateEl) rateEl.textContent = `${rate}%`;
    if (progressBarEl) progressBarEl.style.width = `${rate}%`;

    if (insightsEl) {
        if (stats.attempts === 0) {
            insightsEl.textContent = 'Start solving CAPTCHAs to get insights!';
        } else if (rate >= 90) {
            insightsEl.textContent = '🔥 Outstanding! You are mastering the challenge.';
        } else if (rate >= 70) {
            insightsEl.textContent = '👍 Great job! You are improving steadily.';
        } else {
            insightsEl.textContent = '📚 Keep practicing to improve your success rate.';
        }
    }

    if (activityListEl) {
        if (!stats.activity.length) {
            activityListEl.innerHTML = '<div class="empty-state">No activity yet</div>';
        } else {
            activityListEl.innerHTML = stats.activity.slice(-6).reverse().map((item) => `
                <div class="activity-item">
                    <strong>${item.result === 'success' ? 'Success' : 'Fail'}</strong> · ${item.type} · ${item.time}
                </div>
            `).join('');
        }
    }

    const unlockBadge = (id, condition) => {
        const card = document.getElementById(id);
        if (!card) return;
        const statusEl = card.querySelector('.achievement-status');
        if (condition) {
            card.classList.add('unlocked');
            if (statusEl) {
                statusEl.className = 'achievement-status unlocked';
                statusEl.innerHTML = '<i class="fas fa-check"></i>';
            }
        }
    };

    unlockBadge('badge-beginner', stats.successes >= 5);
    unlockBadge('badge-intermediate', stats.successes >= 20);
    unlockBadge('badge-expert', stats.successes >= 50);

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('captcha_attempts');
            localStorage.removeItem('captcha_success');
            localStorage.removeItem('captcha_fail');
            localStorage.removeItem('captcha_streak');
            localStorage.removeItem('captcha_best');
            localStorage.removeItem('captcha_activity');
            renderDashboard();
            showToast('warning', 'Stats Reset', 'Your CAPTCHA statistics have been cleared.', 2800);
        });
    }
}

function verifyCaptcha() {
    if (Date.now() < lockoutEndTime) return;

    const inputValue = (captchaTypeSelect?.value || 'text').toLowerCase() === 'image'
        ? selectedImageAnswer
        : textInput.value.trim();

    const isCorrect = inputValue.toLowerCase() === currentCaptcha.toString().toLowerCase();
    recordAttempt(isCorrect);

    if (isCorrect) {
        attempts = 3;
        updateAttemptsUI();
        renderDashboard();
        showToast('success', 'Captcha Passed', 'You are verified. A fresh challenge is loading.', 3200);
        setTimeout(() => {
            generateCaptcha();
            resetTimer();
        }, 1200);
        return;
    }

    attempts -= 1;
    updateAttemptsUI();

    if (attempts <= 0) {
        lockoutEndTime = Date.now() + 60000;
        showToast('warning', 'Too Many Attempts', 'Please wait a minute before trying again.', 4000);
        submitButton.disabled = true;
        setTimeout(() => {
            attempts = 3;
            updateAttemptsUI();
            submitButton.disabled = false;
            generateCaptcha();
            resetTimer();
        }, 60000);
    } else {
        showToast('error', 'Incorrect Answer', `That was not correct. ${attempts} attempt${attempts === 1 ? '' : 's'} left.`, 3000);
    }
}

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'dark');
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
        applyTheme(nextTheme);
    });
}

if (difficultySelect) {
    difficultySelect.addEventListener('change', () => {
        selectedDifficulty = difficultySelect.value;
        generateCaptcha();
        resetTimer();
    });
}

if (captchaTypeSelect) {
    captchaTypeSelect.addEventListener('change', () => {
        generateCaptcha();
        resetTimer();
    });
}

if (refreshButton) {
    refreshButton.addEventListener('click', () => {
        generateCaptcha();
        resetTimer();
    });
}

if (submitButton) {
    submitButton.addEventListener('click', verifyCaptcha);
}

if (textInput) {
    textInput.addEventListener('input', () => {
        if ((captchaTypeSelect?.value || 'text').toLowerCase() === 'math') {
            textInput.value = textInput.value.replace(/[^0-9-]/g, '');
        }
    });
}

speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
populateVoiceList();
updateAttemptsUI();
renderDashboard();
generateCaptcha();
resetTimer();
