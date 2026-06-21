let selectedImageAnswer = "";

// Removed: resultMessage is replaced by toast notifications
// const resultMessage = document.getElementById("resultMessage");

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

// ==========================
// TOAST NOTIFICATION SYSTEM
// ==========================

/**
 * Shows a toast notification outside the form.
 * @param {'success'|'error'|'warning'} type
 * @param {string} title
 * @param {string} message
 * @param {number} duration  Auto-dismiss delay in ms (default 4000)
 */
function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '✓',
        error:   '✕',
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
        <button class="toast-close" aria-label="Dismiss notification">&times;</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    // Close on button click
    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

    container.appendChild(toast);

    // Auto-dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);

    // Cancel auto-dismiss if user hovers (pause experience)
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () =>
        setTimeout(() => dismissToast(toast), 800)
    );
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-exit')) return;
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

const lockoutUser = () => {
    lockoutEndTime = Date.now() + 60 * 1000;
    updateLockoutUI();
};

const updateLockoutUI = () => {
    const now = Date.now();
    if (now < lockoutEndTime) {
        const remaining = Math.ceil((lockoutEndTime - now) / 1000);
        submitButton.disabled = true;
        showToast(
            'warning',
            'Too Many Attempts',
            `Please wait ${remaining} second${remaining !== 1 ? 's' : ''} before trying again.`,
            Math.min(remaining * 1000, 5000)
        );
        setTimeout(updateLockoutUI, 1000);
    } else {
        submitButton.disabled = false;
        attempts = 0;
        generateCaptcha();
    }
};

// --- Persistent Stats Helpers ---
const getStats = () => ({
    attempts:    parseInt(localStorage.getItem('captcha_attempts')  || '0', 10),
    successes:   parseInt(localStorage.getItem('captcha_success')   || '0', 10),
    failures:    parseInt(localStorage.getItem('captcha_fail')      || '0', 10),
    streak:      parseInt(localStorage.getItem('captcha_streak')    || '0', 10),
    bestStreak:  parseInt(localStorage.getItem('captcha_best')      || '0', 10),
    activity:    JSON.parse(localStorage.getItem('captcha_activity') || '[]'),
});

const saveStats = (stats) => {
    localStorage.setItem('captcha_attempts',  stats.attempts);
    localStorage.setItem('captcha_success',   stats.successes);
    localStorage.setItem('captcha_fail',      stats.failures);
    localStorage.setItem('captcha_streak',    stats.streak);
    localStorage.setItem('captcha_best',      stats.bestStreak);
    localStorage.setItem('captcha_activity',  JSON.stringify(stats.activity.slice(-20))); // keep last 20
};

const recordAttempt = (isCorrect) => {
    const stats = getStats();
    stats.attempts++;
    if (isCorrect) {
        stats.successes++;
        stats.streak++;
        if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
    } else {
        stats.failures++;
        stats.streak = 0;
    }
    stats.activity.push({
        result: isCorrect ? 'success' : 'fail',
        type: selectedType,
        time: new Date().toISOString(),
    });
    saveStats(stats);
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

  // Persist the outcome immediately
  recordAttempt(isCorrect);
  
  if (isCorrect) {
      showToast(
          'success',
          'Captcha Passed!',
          'Well done! You verified you are human. A new challenge is loading…',
          3500
      );
      attempts = 0;
      setTimeout(() => {
          textInput.value = "";
          generateCaptcha();
      }, 1500);
  } else {
      attempts++;
      if (attempts >= maxAttempts) {
          lockoutUser();
      } else {
          showToast(
              'error',
              'Incorrect Answer',
              `That's not right. Attempt ${attempts} of ${maxAttempts} — give it another go!`,
              4000
          );
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
    const renderDashboard = () => {
        const stats = getStats();

        // --- Core stat cards ---
        document.getElementById('stat-attempts').textContent   = stats.attempts;
        document.getElementById('stat-successes').textContent  = stats.successes;
        document.getElementById('stat-failures').textContent   = stats.failures;
        document.getElementById('stat-streak').textContent     = stats.streak;
        document.getElementById('stat-best-streak').textContent = stats.bestStreak;

        // --- Success Rate ---
        const rate = stats.attempts > 0
            ? Math.round((stats.successes / stats.attempts) * 100)
            : 0;
        document.getElementById('stat-rate').textContent = `${rate}%`;
        document.getElementById('progress-bar').style.width = `${rate}%`;

        // --- Achievement Badges ---
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
        unlockBadge('badge-beginner',     stats.successes >= 5);
        unlockBadge('badge-intermediate', stats.successes >= 20);
        unlockBadge('badge-expert',       stats.successes >= 50);

        // --- Performance Insights ---
        const insightsEl = document.getElementById('insights-text');
        if (insightsEl) {
            if (stats.attempts === 0) {
                insightsEl.textContent = 'Start solving CAPTCHAs to get insights!';
            } else if (rate >= 90) {
                insightsEl.textContent = `🔥 Outstanding! You're passing ${rate}% of challenges. You're a CAPTCHA master!`;
            } else if (rate >= 70) {
                insightsEl.textContent = `👍 Great job! ${rate}% success rate. Keep it up to unlock more badges!`;
            } else if (rate >= 50) {
                insightsEl.textContent = `💪 You're halfway there with a ${rate}% success rate. Practice makes perfect!`;
            } else {
                insightsEl.textContent = `📚 ${rate}% success rate so far. Try easier difficulty to build your confidence!`;
            }
        }

        // --- Recent Activity List ---
        const listEl = document.getElementById('activity-list');
        if (listEl) {
            if (stats.activity.length === 0) {
                listEl.innerHTML = '<div class="empty-state">No activity yet</div>';
            } else {
                // Show most-recent first, up to 10 entries
                listEl.innerHTML = [...stats.activity].reverse().slice(0, 10).map(entry => {
                    const date = new Date(entry.time);
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    const icon   = entry.result === 'success'
                        ? '<i class="fas fa-check-circle" style="color:#10b981"></i>'
                        : '<i class="fas fa-times-circle" style="color:#ef4444"></i>';
                    const typeName = (entry.type || 'text').charAt(0).toUpperCase() + (entry.type || 'text').slice(1);
                    return `
                        <div class="activity-item">
                            <span class="activity-icon">${icon}</span>
                            <span class="activity-type">${typeName} CAPTCHA</span>
                            <span class="activity-result" style="color:${entry.result === 'success' ? '#10b981' : '#ef4444'};font-weight:600">
                                ${entry.result === 'success' ? 'Passed' : 'Failed'}
                            </span>
                            <span class="activity-time">${dateStr}, ${timeStr}</span>
                        </div>`;
                }).join('');
            }
        }
    };

    renderDashboard();

    // --- Reset Button ---
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!confirm('Reset all statistics? This cannot be undone.')) return;
            ['captcha_attempts','captcha_success','captcha_fail',
             'captcha_streak','captcha_best','captcha_activity'].forEach(k => localStorage.removeItem(k));
            renderDashboard();
        });
    }
}

// ==========================
// THEME TOGGLE - COMPLETE FIX
// ==========================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // If button doesn't exist, exit
    if (!toggleBtn) return;
    
    // Get stored preference (default: true = dark mode)
    let isDarkMode = localStorage.getItem('darkMode');
    if (isDarkMode === null) {
        isDarkMode = true;
    } else {
        isDarkMode = isDarkMode === 'true';
    }
    
    // Apply theme function
    function applyTheme(darkMode) {
        if (darkMode) {
            // Dark mode - remove light theme class
            document.body.classList.remove('light-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            // Light mode - add light theme class
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }
    
    // Apply initial theme
    applyTheme(isDarkMode);
    
    // Toggle on click
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', String(isDarkMode));
        applyTheme(isDarkMode);
    });
});