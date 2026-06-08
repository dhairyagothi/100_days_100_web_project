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

// Analytics Data
const STORAGE_KEY = "captcha-analytics-v1";
let analytics = {
    totalAttempts: 0,
    successful: 0,
    failed: 0,
    currentStreak: 0,
    bestStreak: 0,
    recentActivity: [], // Array of {timestamp, difficulty, result}
    achievements: {
        beginner: false, // 5
        intermediate: false, // 20
        expert: false //50
    }
};

// DOM elements for analytics
const statAttempts = document.getElementById('stat-attempts');
const statSuccesses = document.getElementById('stat-successes');
const statFailures = document.getElementById('stat-failures');
const statStreak = document.getElementById('stat-streak');
const statBestStreak = document.getElementById('stat-best-streak');
const statRate = document.getElementById('stat-rate');
const progressBar = document.getElementById('progress-bar');
const insightsText = document.getElementById('insights-text');
const activityList = document.getElementById('activity-list');
const resetBtn = document.getElementById('reset-btn');
const resetModal = document.getElementById('reset-modal');
const cancelReset = document.getElementById('cancel-reset');
const confirmReset = document.getElementById('confirm-reset');

// --- Analytics Functions ---
function loadAnalytics() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            analytics = JSON.parse(stored);
        } catch (e) {
            console.error("Error parsing analytics", e);
        }
    }
    updateAnalyticsUI();
}

function saveAnalytics() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
}

function animateCounter(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * (target - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

function updateAnalyticsUI() {
    animateCounter(statAttempts, analytics.totalAttempts);
    animateCounter(statSuccesses, analytics.successful);
    animateCounter(statFailures, analytics.failed);
    animateCounter(statStreak, analytics.currentStreak);
    animateCounter(statBestStreak, analytics.bestStreak);
    
    // Success rate
    let rate = 0;
    if (analytics.totalAttempts > 0) {
        rate = Math.round((analytics.successful / analytics.totalAttempts) * 100);
    }
    statRate.textContent = rate + "%";
    progressBar.style.width = rate + "%";
    
    // Achievements
    checkAchievements();
    
    // Insights
    updateInsights();
    
    // Recent Activity
    renderRecentActivity();
}

function updateInsights() {
    let text = "Start solving CAPTCHAs to get insights!";
    if (analytics.totalAttempts > 0) {
        const rate = analytics.successful / analytics.totalAttempts;
        if (rate >= 0.9) {
            text = "Excellent! Your success rate is above 90%";
        } else if (rate >= 0.7) {
            text = "Great job! Keep improving your accuracy";
        } else {
            text = "Keep practicing to improve your accuracy";
        }
        
        if (analytics.currentStreak >= 5) {
            text += ` You're on a ${analytics.currentStreak} CAPTCHA streak!`;
        }
    }
    insightsText.textContent = text;
}

function renderRecentActivity() {
    if (analytics.recentActivity.length === 0) {
        activityList.innerHTML = '<div class="empty-state">No activity yet</div>';
        return;
    }
    
    activityList.innerHTML = analytics.recentActivity.map(activity => {
        const date = new Date(activity.timestamp);
        const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const icon = activity.result === 'success' 
            ? '<i class="fas fa-check"></i>' 
            : '<i class="fas fa-times"></i>';
        
        return `
            <div class="activity-item ${activity.result}">
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-type">
                        ${activity.result === 'success' ? 'Successful' : 'Failed'} (${activity.difficulty})
                    </div>
                    <div class="activity-time">${timeStr}</div>
                </div>
            </div>
        `;
    }).join('');
}

function checkAchievements() {
    const badgeBeginner = document.getElementById('badge-beginner');
    const badgeIntermediate = document.getElementById('badge-intermediate');
    const badgeExpert = document.getElementById('badge-expert');
    
    if (analytics.successful >= 5 && !analytics.achievements.beginner) {
        analytics.achievements.beginner = true;
    }
    
    if (analytics.successful >= 20 && !analytics.achievements.intermediate) {
        analytics.achievements.intermediate = true;
    }
    
    if (analytics.successful >= 50 && !analytics.achievements.expert) {
        analytics.achievements.expert = true;
    }
    
    [
        {el: badgeBeginner, unlocked: analytics.achievements.beginner},
        {el: badgeIntermediate, unlocked: analytics.achievements.intermediate},
        {el: badgeExpert, unlocked: analytics.achievements.expert}
    ].forEach(({el, unlocked}) => {
        if (unlocked) {
            el.classList.add('unlocked');
            el.querySelector('.achievement-status').innerHTML = '<i class="fas fa-check"></i>';
            el.querySelector('.achievement-status').classList.remove('locked');
            el.querySelector('.achievement-status').classList.add('unlocked');
        }
    });
}

// --- Difficulty Selector ---
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
            selector.querySelectorAll('.diff-btn').forEach(b => b.style.opacity = '0.5');
            btn.style.opacity = '1';
            selectedDifficulty = btn.dataset.diff;
            generateCaptcha();
        });
    });
    
    // Set initial selected
    const initialBtn = selector.querySelector('.diff-btn[data-diff="medium"]');
    if (initialBtn) {
        initialBtn.style.opacity = '1';
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
    
    // Update analytics
    analytics.totalAttempts++;
    
    if (isCorrect) {
        analytics.successful++;
        analytics.currentStreak++;
        if (analytics.currentStreak > analytics.bestStreak) {
            analytics.bestStreak = analytics.currentStreak;
        }
        
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
        analytics.failed++;
        analytics.currentStreak = 0;
        
        attempts++;
        if (attempts >= maxAttempts) {
            lockoutUser();
        } else {
            resultMessage.textContent = `Incorrect. Try again. (Attempt ${attempts}/${maxAttempts})`;
            resultMessage.classList.add('error');
            resultMessage.classList.remove('success');
        }
    }
    
    // Add to recent activity
    analytics.recentActivity.unshift({
        timestamp: Date.now(),
        difficulty: selectedDifficulty,
        result: isCorrect ? 'success' : 'fail'
    });
    
    // Keep only last 5
    if (analytics.recentActivity.length > 5) {
        analytics.recentActivity = analytics.recentActivity.slice(0,5);
    }
    
    saveAnalytics();
    updateAnalyticsUI();
};

// --- Reset Button ---
resetBtn.addEventListener('click', () => {
    resetModal.classList.add('active');
});

cancelReset.addEventListener('click', () => {
    resetModal.classList.remove('active');
});

confirmReset.addEventListener('click', () => {
    analytics = {
        totalAttempts: 0,
        successful: 0,
        failed: 0,
        currentStreak: 0,
        bestStreak: 0,
        recentActivity: [],
        achievements: {
            beginner: false,
            intermediate: false,
            expert: false
        }
    };
    saveAnalytics();
    updateAnalyticsUI();
    resetModal.classList.remove('active');
});

// Close modal on outside click
resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) {
        resetModal.classList.remove('active');
    }
});

// --- Event Listeners ---
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

// --- Initialize ---
addDifficultySelector();
if (captchaTypeSelect) selectedType = captchaTypeSelect.value;
generateCaptcha();
loadAnalytics();
