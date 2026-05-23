// 1. Tracks Information Data
const songs = {
    card1: { title: "Top 50 - Global",    artist: "Global Hits",        img: "card1img.jpeg", duration: "3:33", durationSec: 213 },
    card2: { title: "Maiye Jitna Sohna",  artist: "Darshan Raval",      img: "card2img.jpeg", duration: "2:45", durationSec: 165 },
    card3: { title: "Trending India",     artist: "Various Artists",     img: "card3img.jpeg", duration: "4:12", durationSec: 252 },
    card4: { title: "Global Beats",       artist: "International Stars", img: "card4img.jpeg", duration: "3:05", durationSec: 185 },
    card5: { title: "Top 50 - Global",    artist: "Charts",              img: "card5img.jpeg", duration: "3:50", durationSec: 230 },
    card6: { title: "Top Songs - India",  artist: "Bollywood Remix",     img: "card6img.jpeg", duration: "3:18", durationSec: 198 }
};

// 2. Selectors
const playBtn         = document.getElementById('ctrl-play-btn');
const seekbar         = document.getElementById('mainSeekbar');
const currTimeDisplay = document.querySelector('.curr-time');
const totTimeDisplay  = document.querySelector('.tot-time');
const songTitle       = document.querySelector('.song-title');
const songAuthor      = document.querySelector('.song-author');
const coverImage      = document.querySelector('.cover-image');

const loginAuthBtn  = document.getElementById('loginAuthBtn');
const loginModal    = document.getElementById('loginModal');
const closeModal    = document.getElementById('closeModal');
const loginForm     = document.getElementById('loginForm');
const authContainer = document.getElementById('auth-container');

// 3. Application State
let isPlaying      = false;
let currentTime    = 0;
let currentSongKey = 'card2';
let totalDuration  = songs[currentSongKey].durationSec;
let timerInterval  = null;
let tickStart      = null; // FIX 5: drift correction ke liye

// 4. Core Engine

function setPlayIcon()  { if (playBtn) playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');  }
function setPauseIcon() { if (playBtn) playBtn.classList.replace('fa-circle-play',  'fa-circle-pause'); }

function togglePlay() {
    if (!isPlaying) {
        isPlaying = true;
        setPauseIcon();
        startPlaybackTimer();
    } else {
        isPlaying = false;
        setPlayIcon();
        clearInterval(timerInterval);
    }
}

if (playBtn) playBtn.addEventListener('click', togglePlay);

function startPlaybackTimer() {
    clearInterval(timerInterval);
    tickStart = Date.now() - currentTime * 1000; // FIX 5: actual start time track karo

    timerInterval = setInterval(() => {
        // FIX 5: interval drift correction — Date.now() se calculate karo
        currentTime = Math.floor((Date.now() - tickStart) / 1000);

        if (currentTime < totalDuration) {
            updatePlayerProgressUI();
        } else {
            handleTrackEnded();
        }
    }, 500); // 500ms pe check — zyada accurate
}

function updatePlayerProgressUI() {
    if (seekbar) {
        seekbar.value = (currentTime / totalDuration) * 100;
    }
    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;
    // FIX 3: textContent use karo — innerText se faster aur safer
    if (currTimeDisplay) currTimeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// FIX 1: Seekbar drag pe timer restart karo nahi toh purani position se chalta rehta
if (seekbar) {
    seekbar.addEventListener('input', () => {
        currentTime = Math.floor((seekbar.value / 100) * totalDuration);
        updatePlayerProgressUI();

        // Agar play chal raha hai toh timer reset karo nai position se
        if (isPlaying) {
            startPlaybackTimer();
        }
    });
}

function handleTrackEnded() {
    isPlaying = false;
    clearInterval(timerInterval);
    currentTime = 0;
    setPlayIcon();
    updatePlayerProgressUI();
}

// 5. Card Click — FIX 2: pehle state reset karo, phir directly play karo
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const selectedId = card.getAttribute('data-song');
        if (!songs[selectedId]) return;

        currentSongKey = selectedId;
        const track = songs[selectedId];

        // FIX 3: textContent
        if (songTitle)    songTitle.textContent  = track.title;
        if (songAuthor)   songAuthor.textContent = track.artist;
        if (coverImage)   coverImage.src         = track.img;
        if (totTimeDisplay) totTimeDisplay.textContent = track.duration;

        // FIX 2: State seedha playing pe set karo
        // togglePlay() call karne pe agar pehle se play tha toh pause ho jaata
        clearInterval(timerInterval);
        currentTime   = 0;
        totalDuration = track.durationSec;
        isPlaying     = false; // reset

        updatePlayerProgressUI();
        togglePlay(); // ab seedha play hoga, pause nahi
    });
});

// 6. Login Modal

// FIX 4: logged in state track karo
let isLoggedIn = false;

if (loginAuthBtn) {
    loginAuthBtn.addEventListener('click', () => {
        // FIX 4: already logged in hai toh modal mat kholo
        if (isLoggedIn) return;
        if (loginModal) loginModal.classList.add('active');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (loginModal) loginModal.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInputValue = document.getElementById('username').value;

        if (userInputValue.trim() !== '') {
            if (loginModal) loginModal.classList.remove('active');
            executeDynamicUserLoginState(userInputValue);
        }
    });
}

function executeDynamicUserLoginState(username) {
    isLoggedIn = true; // FIX 4

    if (loginAuthBtn) loginAuthBtn.style.display = 'none';

    const userProfileTag = document.createElement('span');
    userProfileTag.className = 'user-profile-display';
    userProfileTag.id        = 'activeUserDisplay';
    // FIX 3: textContent
    userProfileTag.textContent = `Hi, ${username}`;

    const logoutBtn = document.createElement('button');
    logoutBtn.className  = 'badge logout-btn-style';
    logoutBtn.id         = 'dynamicLogoutBtn';
    logoutBtn.textContent = 'Log out'; // FIX 3

    if (authContainer) {
        authContainer.appendChild(userProfileTag);
        authContainer.appendChild(logoutBtn);
    }

    logoutBtn.addEventListener('click', executeUserLogoutState);
}

function executeUserLogoutState() {
    isLoggedIn = false; // FIX 4

    const activeUserDisplay = document.getElementById('activeUserDisplay');
    const dynamicLogoutBtn  = document.getElementById('dynamicLogoutBtn');

    if (activeUserDisplay) activeUserDisplay.remove();
    if (dynamicLogoutBtn)  dynamicLogoutBtn.remove();

    if (loginAuthBtn) loginAuthBtn.style.display = 'block';
    if (loginForm)    loginForm.reset();
}