// 1. Tracks Information Data
const songs = {
    card1: { title: "Top 50 - Global", artist: "Global Hits", img: "card1img.jpeg", duration: "3:33", durationSec: 213 },
    card2: { title: "Maiye Jitna Sohna", artist: "Darshan Raval", img: "card2img.jpeg", duration: "2:45", durationSec: 165 },
    card3: { title: "Trending India", artist: "Various Artists", img: "card3img.jpeg", duration: "4:12", durationSec: 252 },
    card4: { title: "Global Beats", artist: "International Stars", img: "card4img.jpeg", duration: "3:05", durationSec: 185 },
    card5: { title: "Top 50 - Global", artist: "Charts", img: "card5img.jpeg", duration: "3:50", durationSec: 230 },
    card6: { title: "Top Songs - India", artist: "Bollywood Remix", img: "card6img.jpeg", duration: "3:18", durationSec: 198 }
};

// 2. Selectors
const playBtn = document.getElementById('ctrl-play-btn');
const seekbar = document.getElementById('mainSeekbar');
const currTimeDisplay = document.querySelector('.curr-time');
const totTimeDisplay = document.querySelector('.tot-time');
const songTitle = document.querySelector('.song-title');
const songAuthor = document.querySelector('.song-author');
const coverImage = document.querySelector('.cover-image');

// Auth DOM Selectors (Dhyan se dekhna yeh HTML se match hone chahiye)
const loginAuthBtn = document.getElementById('loginAuthBtn');
const signUpBtn = document.getElementById("signUpBtn");
const loginModal = document.getElementById('loginModal');
const signUpModel = document.getElementById('signUpModel');
const closeModal = document.getElementById('closeModal');
const closeSignUpModal = document.getElementById('closeSignUpModal');
const loginForm = document.getElementById('loginForm');
const authContainer = document.getElementById('auth-container');

// 3. Application State variables
let isPlaying = false;
let currentTime = 0;
let currentSongKey = 'card2'; 
let totalDuration = songs[currentSongKey].durationSec;
let timerInterval = null;

// 4. Music Player Core Engine
function togglePlay() {
    if (!isPlaying) {
        isPlaying = true;
        if(playBtn) playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
        startPlaybackTimer();
    } else {
        isPlaying = false;
        if(playBtn) playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
        clearInterval(timerInterval);
    }
}

if(playBtn) playBtn.addEventListener('click', togglePlay);

function startPlaybackTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (currentTime < totalDuration) {
            currentTime++;
            updatePlayerProgressUI();
        } else {
            handleTrackEnded();
        }
    }, 1000);
}

function updatePlayerProgressUI() {
    if(seekbar) {
        const percentage = (currentTime / totalDuration) * 100;
        seekbar.value = percentage;
    }
    const currentMins = Math.floor(currentTime / 60);
    const currentSecs = currentTime % 60;
    if(currTimeDisplay) currTimeDisplay.innerText = `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs}`;
}

if(seekbar) {
    seekbar.addEventListener('input', () => {
        currentTime = Math.floor((seekbar.value / 100) * totalDuration);
        updatePlayerProgressUI();
    });
}

function handleTrackEnded() {
    isPlaying = false;
    clearInterval(timerInterval);
    currentTime = 0;
    if(playBtn) playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
    updatePlayerProgressUI();
}

// 5. Grid Cards Event binding system
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const selectedId = card.getAttribute('data-song');
        if (songs[selectedId]) {
            currentSongKey = selectedId;
            const currentTrack = songs[selectedId];
            
            if(songTitle) songTitle.innerText = currentTrack.title;
            if(songAuthor) songAuthor.innerText = currentTrack.artist;
            if(coverImage) coverImage.src = currentTrack.img;
            if(totTimeDisplay) totTimeDisplay.innerText = currentTrack.duration;
            
            currentTime = 0;
            totalDuration = currentTrack.durationSec;
            updatePlayerProgressUI();
            
            isPlaying = false; 
            togglePlay();
        }
    });
});

// 6. Login Modal Event Handlers
if (loginAuthBtn) {
    loginAuthBtn.addEventListener('click', () => {
        if (loginModal) loginModal.classList.add('active');
    });
}

// Sign Up Button Event Handler
if(signUpBtn) {
    signUpBtn.addEventListener('click', () => {
        //Redirect to Signup Page
        if (signUpModel) signUpModel.classList.add('active');
    })
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (loginModal) loginModal.classList.remove('active');
    });
}

if(closeSignUpModal) {
    closeSignUpModal.addEventListener('click', ()=> {
        if(signUpModel) signUpModel.classList.remove('active');
    })
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
        
        if (userInputValue.trim() !== "") {
            if (loginModal) loginModal.classList.remove('active');
            executeDynamicUserLoginState(userInputValue);
        }
    });
}

function executeDynamicUserLoginState(username) {
    if (loginAuthBtn) loginAuthBtn.style.display = 'none';
    
    const userProfileTag = document.createElement('span');
    userProfileTag.className = 'user-profile-display';
    userProfileTag.id = 'activeUserDisplay';
    userProfileTag.innerText = `Hi, ${username}`;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'badge logout-btn-style';
    logoutBtn.id = 'dynamicLogoutBtn';
    logoutBtn.innerText = 'Log out';
    
    if (authContainer) {
        authContainer.appendChild(userProfileTag);
        authContainer.appendChild(logoutBtn);
    }
    
    logoutBtn.addEventListener('click', () => {
        executeUserLogoutState();
    });
}

function executeUserLogoutState() {
    const activeUserDisplay = document.getElementById('activeUserDisplay');
    const dynamicLogoutBtn = document.getElementById('dynamicLogoutBtn');
    
    if (activeUserDisplay) activeUserDisplay.remove();
    if (dynamicLogoutBtn) dynamicLogoutBtn.remove();
    
    if (loginAuthBtn) loginAuthBtn.style.display = 'block';
    if (loginForm) loginForm.reset();
}