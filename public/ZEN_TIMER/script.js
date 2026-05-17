const MODES = {
    work: { time: 25 * 60, colorClass: '' },
    short: { time: 5 * 60, colorClass: 'short' },
    long: { time: 15 * 60, colorClass: 'long' }
};

const BADGES = {
    first: { condition: (s) => s.totalSessions >= 1 },
    ten: { condition: (s) => s.totalSessions >= 10 },
    fifty: { condition: (s) => s.totalSessions >= 50 },
    hundred: { condition: (s) => s.totalSessions >= 100 },
    streak3: { condition: (s) => s.currentStreak >= 3 },
    streak7: { condition: (s) => s.currentStreak >= 7 },
    streak30: { condition: (s) => s.currentStreak >= 30 },
    hour: { condition: (s) => s.totalMinutes >= 60 },
    early: { condition: () => new Date().getHours() < 9 },
    marathon: { condition: (s) => s.totalSessions >= 5 && getConsecutiveDays() >= 3 }
};

const CIRCUMFERENCE = 2 * Math.PI * 90;
let timer = null;
let timeLeft = MODES.work.time;
let isRunning = false;
let currentMode = 'work';
let sessionsToday = 0;
let lastSessionDate = null;

const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const progressCircle = document.getElementById('progressCircle');
const sessionCount = document.getElementById('sessionCount');
const streakCount = document.getElementById('streakCount');
const totalSessionsEl = document.getElementById('totalSessions');
const totalHoursEl = document.getElementById('totalHours');
const avgSessionEl = document.getElementById('avgSession');
const bestStreakEl = document.getElementById('bestStreak');
const exportBtn = document.getElementById('exportBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sessionsSidebar = document.getElementById('sessionsSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sessionList = document.getElementById('sessionList');
const clearSessionsBtn = document.getElementById('clearSessions');
const profileNameInput = document.getElementById('profileName');

function loadStats() {
    const saved = localStorage.getItem('zenTimerStats');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: null,
        badges: [],
        sessionsHistory: []
    };
}

function saveStats(stats) {
    localStorage.setItem('zenTimerStats', JSON.stringify(stats));
}

function getConsecutiveDays() {
    const stats = loadStats();
    if (!stats.lastActiveDate) return 0;
    
    const lastDate = new Date(stats.lastActiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return stats.currentStreak;
    if (diffDays === 1) return stats.currentStreak;
    return 0;
}

function updateStreak() {
    const stats = loadStats();
    const today = new Date().toDateString();
    const lastDate = stats.lastActiveDate;
    
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
            stats.currentStreak += 1;
        } else if (lastDate !== today) {
            stats.currentStreak = 1;
        }
        
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
        
        stats.lastActiveDate = today;
        saveStats(stats);
    }
    
    streakCount.textContent = stats.currentStreak;
}

function updateStatsUI() {
    const stats = loadStats();
    totalSessionsEl.textContent = stats.totalSessions;
    totalHoursEl.textContent = Math.floor(stats.totalMinutes / 60) + 'h';
    avgSessionEl.textContent = stats.totalSessions > 0 
        ? Math.round(stats.totalMinutes / stats.totalSessions) + 'min' 
        : '0min';
    bestStreakEl.textContent = stats.bestStreak;
    updateStreak();
    checkBadges(stats);
}

function checkBadges(stats) {
    Object.keys(BADGES).forEach(badgeId => {
        const badgeEl = document.querySelector(`[data-badge="${badgeId}"]`);
        const isUnlocked = stats.badges.includes(badgeId);
        
        if (isUnlocked) {
            badgeEl.classList.add('unlocked');
            badgeEl.classList.remove('locked');
        } else if (BADGES[badgeId].condition(stats)) {
            if (!stats.badges.includes(badgeId)) {
                stats.badges.push(badgeId);
                saveStats(stats);
                showNotification(`🏆 Unlocked: ${badgeEl.querySelector('.badge-name').textContent}`, 'badge');
                badgeEl.classList.add('unlocked');
                badgeEl.classList.remove('locked');
            }
        }
    });
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
    const total = MODES[currentMode].time;
    const progress = ((total - timeLeft) / total) * CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = CIRCUMFERENCE - progress;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(timeLeft);
    document.title = `${formatTime(timeLeft)} - Zen Timer`;
}

function startTimer() {
    if (isRunning) {
        pauseTimer();
        return;
    }
    
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.style.background = '#e67e22';
    
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateProgress();
        
        if (timeLeft <= 0) {
            completeSession();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
    startBtn.textContent = 'Start';
    startBtn.style.background = '';
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode].time;
    updateDisplay();
    updateProgress();
    startBtn.textContent = 'Start';
}

function completeSession() {
    pauseTimer();
    
    if (currentMode === 'work') {
        const stats = loadStats();
        const durationMin = Math.round(MODES.work.time / 60);
        stats.totalSessions += 1;
        stats.totalMinutes += durationMin;
        stats.sessionsHistory.push({
            date: new Date().toISOString(),
            duration: durationMin
        });
        
        sessionsToday++;
        saveStats(stats);
        
        showNotification('🎉 Focus session complete! Take a break.', 'success');
        updateStatsUI();
        
        if (sessionsToday % 4 === 0) {
            setMode('long');
        } else {
            setMode('short');
        }
    } else {
        showNotification('☕ Break over! Ready to focus?', 'success');
        setMode('work');
    }
}

function setMode(mode) {
    currentMode = mode;
    timeLeft = MODES[mode].time;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    progressCircle.className = 'progress-ring-progress ' + MODES[mode].colorClass;
    resetTimer();
    sessionCount.textContent = sessionsToday + 1;
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isRunning) {
            setMode(btn.dataset.mode);
        }
    });
});

exportBtn.addEventListener('click', () => {
    const stats = loadStats();
    generateShareImage(stats);
});

// Sidebar behaviour
sidebarToggle.addEventListener('click', () => {
    sessionsSidebar.classList.add('open');
    renderSessionsSidebar();
});
closeSidebar.addEventListener('click', () => sessionsSidebar.classList.remove('open'));
clearSessionsBtn.addEventListener('click', () => {
    if (confirm('Clear all saved sessions and stats?')) {
        localStorage.removeItem('zenTimerStats');
        renderSessionsSidebar();
        updateStatsUI();
        showNotification('🧹 Sessions cleared', 'success');
    }
});

// Load/save profile name
function loadProfileName() {
    const n = localStorage.getItem('zenTimerProfileName') || '';
    profileNameInput.value = n;
    return n;
}

profileNameInput.addEventListener('change', () => {
    localStorage.setItem('zenTimerProfileName', profileNameInput.value.trim());
});

function renderSessionsSidebar() {
    const stats = loadStats();
    sessionList.innerHTML = '';
    loadProfileName();

    if (!stats.sessionsHistory || stats.sessionsHistory.length === 0) {
        const li = document.createElement('li');
        li.className = 'session-item';
        li.textContent = 'No sessions yet.';
        sessionList.appendChild(li);
        return;
    }

    stats.sessionsHistory.slice().reverse().forEach(s => {
        const li = document.createElement('li');
        li.className = 'session-item';
        const date = new Date(s.date);
        const left = document.createElement('div');
        left.textContent = date.toLocaleString();
        const right = document.createElement('div');
        right.textContent = (s.duration || 0) + ' min';
        li.appendChild(left);
        li.appendChild(right);
        sessionList.appendChild(li);
    });
}

// Generate PNG share image with best time, name, and badges
function generateShareImage(stats) {
    const name = localStorage.getItem('zenTimerProfileName') || prompt('Enter your name for the export:', 'You') || 'You';
    localStorage.setItem('zenTimerProfileName', name);

    const canvas = document.createElement('canvas');
    const W = 1000, H = 600;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#2a221c';
    ctx.fillRect(0,0,W,H);

    // Header
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim() || '#FAF7F2';
    ctx.font = '28px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Zen Timer — Session Snapshot', 40, 60);

    // Name
    ctx.font = 'bold 34px Poppins, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#FF8C42';
    ctx.fillText(name, 40, 120);

    // Best time
    let best = 0;
    if (stats.sessionsHistory && stats.sessionsHistory.length) {
        best = Math.max(...stats.sessionsHistory.map(s => s.duration || 0));
    }
    ctx.font = '24px Poppins, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim() || '#FAF7F2';
    ctx.fillText('Best session: ' + (best ? (best + ' min') : '—'), 40, 170);

    // Badges (emoji)
    const unlockedEls = Array.from(document.querySelectorAll('.badge.unlocked .badge-icon'));
    const emojis = unlockedEls.map(el => el.textContent.trim()).slice(0,6);
    ctx.font = '48px serif';
    let startX = 40;
    let y = 250;
    emojis.forEach((e, i) => {
        ctx.fillText(e, startX + i * 72, y);
    });

    // Summary box
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(40, 300, W - 80, 200);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-dim').trim() || '#c9bfb6';
    ctx.font = '18px Poppins, sans-serif';
    ctx.fillText('Total sessions: ' + stats.totalSessions, 60, 340);
    ctx.fillText('Total focus: ' + (stats.totalMinutes || 0) + ' min', 60, 370);
    ctx.fillText('Best streak: ' + (stats.bestStreak || 0), 60, 400);

    // Export
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zen-share-${(name||'you').replace(/\s+/g,'_')}-${new Date().toISOString().slice(0,10)}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('🖼️ Image exported!', 'success');
    }, 'image/png');
}

progressCircle.style.strokeDasharray = CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
updateStatsUI();
updateDisplay();