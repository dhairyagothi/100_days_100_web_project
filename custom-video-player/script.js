const video = document.querySelector('.video');
const playPauseBtn = document.getElementById('play-pause');
const muteBtn = document.getElementById('mute');
const volumeSlider = document.querySelector('.volume-slider');
const progressBar = document.querySelector('.progress-bar');
const timeDisplay = document.querySelector('.time-display');
const speedSelect = document.querySelector('.speed-select');
const fullscreenBtn = document.getElementById('fullscreen');
const playerContainer = document.querySelector('.player-container');

function togglePlay() {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸';
        playPauseBtn.setAttribute('aria-label', 'Pause');
    } else {
        video.pause();
        playPauseBtn.textContent = '▶';
        playPauseBtn.setAttribute('aria-label', 'Play');
    }
}

playPauseBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

function updateProgress() {
    if (!isNaN(video.duration)) {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.value = progress;

        let currentMin = Math.floor(video.currentTime / 60);
        let currentSec = Math.floor(video.currentTime % 60);
        let durationMin = Math.floor(video.duration / 60);
        let durationSec = Math.floor(video.duration % 60);

        currentMin = currentMin < 10 ? '0' + currentMin : currentMin;
        currentSec = currentSec < 10 ? '0' + currentSec : currentSec;
        durationMin = durationMin < 10 ? '0' + durationMin : durationMin;
        durationSec = durationSec < 10 ? '0' + durationSec : durationSec;

        timeDisplay.textContent = `${currentMin}:${currentSec} / ${durationMin}:${durationSec}`;
    }
}

video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', updateProgress);

function setProgress() {
    const time = (progressBar.value * video.duration) / 100;
    video.currentTime = time;
}

progressBar.addEventListener('input', setProgress);

function handleVolume() {
    video.volume = volumeSlider.value;
    if (video.volume === 0) {
        muteBtn.textContent = '🔇';
    } else if (video.volume < 0.5) {
        muteBtn.textContent = '🔉';
    } else {
        muteBtn.textContent = '🔊';
    }
    video.muted = false;
}

function toggleMute() {
    if (video.muted) {
        video.muted = false;
        volumeSlider.value = video.volume || 1;
        muteBtn.textContent = video.volume < 0.5 ? '🔉' : '🔊';
    } else {
        video.muted = true;
        volumeSlider.value = 0;
        muteBtn.textContent = '🔇';
    }
}

volumeSlider.addEventListener('input', handleVolume);
muteBtn.addEventListener('click', toggleMute);

speedSelect.addEventListener('change', () => {
    video.playbackRate = speedSelect.value;
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

video.addEventListener('ended', () => {
    playPauseBtn.textContent = '▶';
});