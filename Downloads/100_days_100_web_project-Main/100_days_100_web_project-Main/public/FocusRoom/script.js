// ════════════════════════════════════════
// 1. LIVE CLOCK
// ════════════════════════════════════════
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ════════════════════════════════════════
// 2. POMODORO TIMER
// ════════════════════════════════════════
const MODES = {
    focus: { duration: 25 * 60, label: 'Focus Session',  sub: 'stay locked in',    ringColor: '#c4a4e8', glowColor: 'rgba(180,140,230,0.3)'  },
    short: { duration:  5 * 60, label: 'Short Break',    sub: 'breathe & stretch', ringColor: '#7dd4c0', glowColor: 'rgba(125,212,192,0.3)'  },
    long:  { duration: 15 * 60, label: 'Long Break',     sub: 'you earned this',   ringColor: '#f0c070', glowColor: 'rgba(240,192,112,0.3)'  },
};

const CIRCUMFERENCE = 2 * Math.PI * 140; // 879.6

let currentMode = 'focus';
let timeLeft    = MODES.focus.duration;
let totalTime   = MODES.focus.duration;
let timerInterval = null;
let isRunning   = false;
let sessions    = 0;

const timerEl      = document.getElementById('timer');
const ringProgress = document.getElementById('ringProgress');
const ringSvg      = document.getElementById('ringSvg');
const timerSub     = document.getElementById('timerSub');
const startBtn     = document.getElementById('start');
const toastEl      = document.getElementById('timerToast');
const sessionDots  = document.querySelectorAll('.session-dots .dot');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const progress = timeLeft / totalTime;
    ringProgress.style.strokeDashoffset = CIRCUMFERENCE * progress;
    // update page title so user can see timer in browser tab
    document.title = `${timerEl.textContent} · FocusRoom`;
}

function updateSessionDots() {
    sessionDots.forEach((dot, i) => dot.classList.toggle('done', i < sessions));
}

function applyMode(mode) {
    const cfg = MODES[mode];
    ringProgress.style.stroke = cfg.ringColor;
    ringSvg.style.filter = `drop-shadow(0 0 18px ${cfg.glowColor})`;
    timerSub.textContent = cfg.sub;

    document.querySelectorAll('.mode-tab').forEach(t => {
        t.classList.remove('active', 'break-mode');
    });
    const activeTab = document.getElementById('tab-' + mode);
    if (activeTab) {
        activeTab.classList.add('active');
        if (mode !== 'focus') activeTab.classList.add('break-mode');
    }
}

function setRunning(running) {
    isRunning = running;
    startBtn.classList.toggle('running', running);
    startBtn.textContent = running ? '⏸ pause' : (timeLeft < totalTime ? '▶ resume' : '▶ start');
}

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 4000);
}

function startTimer() {
    if (isRunning) return;
    setRunning(true);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            setRunning(false);
            if (currentMode === 'focus') {
                sessions = Math.min(sessions + 1, 4);
                updateSessionDots();
                showToast('🎉 Focus session complete! Time for a break.');
            } else {
                showToast('⏰ Break over! Ready to focus again?');
            }
            if (sessions >= 4) sessions = 0;
            startBtn.textContent = '▶ start';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    setRunning(false);
}

function resetTimer() {
    clearInterval(timerInterval);
    setRunning(false);
    timeLeft = MODES[currentMode].duration;
    updateTimerDisplay();
    startBtn.textContent = '▶ start';
}

function setMode(mode) {
    clearInterval(timerInterval);
    setRunning(false);
    currentMode = mode;
    timeLeft    = MODES[mode].duration;
    totalTime   = MODES[mode].duration;
    applyMode(mode);
    updateTimerDisplay();
    startBtn.textContent = '▶ start';
}

startBtn.addEventListener('click', () => isRunning ? stopTimer() : startTimer());
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

// Init ring
ringProgress.style.strokeDasharray  = CIRCUMFERENCE;
ringProgress.style.strokeDashoffset = 0;
applyMode('focus');
updateTimerDisplay();
updateSessionDots();

// ════════════════════════════════════════
// 3. AMBIENT SOUNDS
// ════════════════════════════════════════
/*
  🔧 HOW TO MAKE SOUNDS WORK:
  Option A — local files: Download MP3s from freesound.org or pixabay.com,
  rename them rain.mp3 / cafe.mp3 / fire.mp3 / forest.mp3,
  drop them in the same folder, and use: new Audio('rain.mp3')

  Option B — CDN (ready to use, may need CORS):
  Try: https://assets.mixkit.co/sfx/preview/mixkit-forest-stream-water-1181.mp3
  Or: https://www.soundjay.com/nature/sounds/rain-01.mp3

  Below are placeholder empty Audio() objects that won't throw errors.
  Replace the src strings with real URLs or local paths.
*/

const AUDIO_SOURCES = {
    rain:   'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
    cafe:   'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3',
    fire:   'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
    forest: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3',
};

const sounds = {};
Object.entries(AUDIO_SOURCES).forEach(([key, src]) => {
    const audio = new Audio();
    audio.src   = src;
    audio.loop  = true;
    audio.volume = 0.4;
    sounds[key] = audio;
});

let activeSound = null;

document.querySelectorAll('.sound-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.sound;
        document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));

        if (activeSound === key) {
            sounds[key].pause();
            sounds[key].currentTime = 0;
            activeSound = null;
        } else {
            if (activeSound) {
                sounds[activeSound].pause();
                sounds[activeSound].currentTime = 0;
            }
            sounds[key].play().catch(err => console.warn('Audio play failed — check audio source URL:', err));
            activeSound = key;
            btn.classList.add('active');
        }
    });
});

// Volume slider
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    const vol = e.target.value / 100;
    Object.values(sounds).forEach(s => s.volume = vol);
});

// ════════════════════════════════════════
// 4. SPOTIFY PLAYLIST SWITCHER
// ════════════════════════════════════════
const PLAYLISTS = {
    lofi:      'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    jazz:      'https://open.spotify.com/embed/playlist/37i9dQZF1DWV7EzJpy3oDS?utm_source=generator&theme=0',
    classical: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source=generator&theme=0',
};

function switchPlaylist(key) {
    document.getElementById('spotifyFrame').src = PLAYLISTS[key];
    document.querySelectorAll('.vibe-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.list === key);
    });
}

// Set data-list attributes for active detection
document.querySelectorAll('.vibe-btn').forEach(btn => {
    const match = btn.getAttribute('onclick').match(/'(\w+)'/);
    if (match) btn.dataset.list = match[1];
});

// ════════════════════════════════════════
// 5. MOTIVATIONAL QUOTES SLIDESHOW
// ════════════════════════════════════════
let slideIndex = 0;
const slides = document.querySelectorAll('.mySlides');
const dotContainer = document.getElementById('dotContainer');

// Auto-generate dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot';
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    dot.addEventListener('click', () => { slideIndex = i; showSlide(); });
    dotContainer.appendChild(dot);
});

function showSlide() {
    slides.forEach((s, i) => {
        s.style.display = i === slideIndex ? 'block' : 'none';
        s.classList.toggle('active-slide', i === slideIndex);
    });
    document.querySelectorAll('.quote-dot').forEach((d, i) => {
        d.classList.toggle('active', i === slideIndex);
    });
}

function plusSlides(n) {
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    showSlide();
}

// Expose for HTML onclick attributes
window.plusSlides  = plusSlides;
window.currentSlide = (n) => { slideIndex = n - 1; showSlide(); };

showSlide();
setInterval(() => plusSlides(1), 7000);

// ════════════════════════════════════════
// 6. DRAGGABLE STICKY NOTE
// ════════════════════════════════════════
const sticky     = document.getElementById('stickyNote');
const stickyHead = document.getElementById('stickyHeader');
const stickyToggle = document.getElementById('stickyToggle');
const stickyText = document.getElementById('stickyText');

// Restore saved content
const savedNote = localStorage.getItem('focusroom-note');
if (savedNote) stickyText.value = savedNote;

stickyText.addEventListener('input', () => {
    localStorage.setItem('focusroom-note', stickyText.value);
});

// Minimize toggle
stickyToggle.addEventListener('click', () => {
    sticky.classList.toggle('minimized');
    stickyToggle.textContent = sticky.classList.contains('minimized') ? '+' : '−';
});

// Drag logic
let isDragging = false, dragOffX = 0, dragOffY = 0;

stickyHead.addEventListener('mousedown', (e) => {
    if (e.target === stickyToggle) return;
    isDragging = true;
    const rect = sticky.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    sticky.style.transition = 'none';
    sticky.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = Math.max(0, Math.min(window.innerWidth - sticky.offsetWidth, e.clientX - dragOffX));
    const y = Math.max(0, Math.min(window.innerHeight - sticky.offsetHeight, e.clientY - dragOffY));
    sticky.style.left   = x + 'px';
    sticky.style.top    = y + 'px';
    sticky.style.right  = 'auto';
    sticky.style.bottom = 'auto';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    sticky.style.transition = '';
    sticky.style.cursor = '';
});

// Touch support for sticky note drag
stickyHead.addEventListener('touchstart', (e) => {
    if (e.target === stickyToggle) return;
    const touch = e.touches[0];
    isDragging = true;
    const rect = sticky.getBoundingClientRect();
    dragOffX = touch.clientX - rect.left;
    dragOffY = touch.clientY - rect.top;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(window.innerWidth - sticky.offsetWidth, touch.clientX - dragOffX));
    const y = Math.max(0, Math.min(window.innerHeight - sticky.offsetHeight, touch.clientY - dragOffY));
    sticky.style.left = x + 'px';
    sticky.style.top  = y + 'px';
    sticky.style.right = 'auto';
    sticky.style.bottom = 'auto';
}, { passive: true });

document.addEventListener('touchend', () => { isDragging = false; });