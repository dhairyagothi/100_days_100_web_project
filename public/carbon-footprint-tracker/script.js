const STORAGE_KEY_THEME = 'carbon-theme';
const STORAGE_KEY_HISTORY = 'carbon-history';

const themeToggleBtn = document.getElementById('theme-toggle');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const travelInput = document.getElementById('travel');
const electricityInput = document.getElementById('electricity');
const wasteInput = document.getElementById('waste');
const co2Value = document.getElementById('co2-value');
const carbonLevel = document.getElementById('carbon-level');
const levelMessage = document.getElementById('level-message');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const historyList = document.getElementById('history-list');

function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem(STORAGE_KEY_THEME, isLight ? 'light' : 'dark');
}

function animateCounter(element, target, duration = 1500) {
    const start = parseFloat(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target.toFixed(2);
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(2);
        }
    }, 16);
}

function getCarbonLevel(total) {
    if (total <= 5) {
        return {
            level: 'Low',
            class: '',
            message: 'Excellent! Your carbon footprint is very low. Keep up the great work!',
            color: '#10b981',
            percent: 25
        };
    } else if (total <= 15) {
        return {
            level: 'Medium',
            class: 'level-medium',
            message: 'Good job! Your footprint is moderate. Consider small changes to reduce further.',
            color: '#f59e0b',
            percent: 60
        };
    } else {
        return {
            level: 'High',
            class: 'level-high',
            message: 'Your carbon footprint is high. Let\'s take action to reduce it!',
            color: '#ef4444',
            percent: 95
        };
    }
}

function calculateFootprint() {
    const travel = parseFloat(travelInput.value) || 0;
    const electricity = parseFloat(electricityInput.value) || 0;
    const waste = parseFloat(wasteInput.value) || 0;

    const total = (travel * 0.21) + (electricity * 0.85) + (waste * 0.45);
    const levelData = getCarbonLevel(total);

    animateCounter(co2Value, total);
    
    carbonLevel.className = 'result-level ' + levelData.class;
    const levelBadge = carbonLevel.querySelector('.level-badge');
    levelBadge.textContent = levelData.level;
    levelMessage.textContent = levelData.message;

    progressPercent.textContent = levelData.percent + '%';
    progressFill.style.width = levelData.percent + '%';
    progressFill.style.background = `linear-gradient(90deg, ${levelData.color} 0%, ${levelData.color}aa 100%)`;

    saveToHistory(total, levelData.level);
}

function saveToHistory(total, level) {
    const history = getHistory();
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        total: total.toFixed(2),
        level: level
    };
    
    history.unshift(newEntry);
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    renderHistory();
}

function getHistory() {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : [];
}

function renderHistory() {
    const history = getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <span class="empty-icon">📊</span>
                <p>No calculations yet. Start tracking your footprint!</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map(entry => {
        let levelColor = '';
        if (entry.level === 'Low') levelColor = '#10b981';
        if (entry.level === 'Medium') levelColor = '#f59e0b';
        if (entry.level === 'High') levelColor = '#ef4444';
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-date">${entry.date}</span>
                    <span class="history-value">${entry.total} kg CO₂</span>
                </div>
                <span class="history-level" style="background: ${levelColor}20; color: ${levelColor};">${entry.level}</span>
            </div>
        `;
    }).join('');
}

function resetAll() {
    travelInput.value = '';
    electricityInput.value = '';
    wasteInput.value = '';
    co2Value.textContent = '0.00';
    carbonLevel.className = 'result-level';
    const levelBadge = carbonLevel.querySelector('.level-badge');
    levelBadge.textContent = 'Low';
    levelMessage.textContent = 'Great job! Your carbon footprint is very low.';
    progressPercent.textContent = '0%';
    progressFill.style.width = '0%';
}

themeToggleBtn.addEventListener('click', toggleTheme);
calculateBtn.addEventListener('click', calculateFootprint);
resetBtn.addEventListener('click', resetAll);

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderHistory();
});
