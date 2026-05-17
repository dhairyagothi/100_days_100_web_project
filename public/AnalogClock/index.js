// Analog Clock

setInterval(() => {

    let d = new Date();

    let htime = d.getHours();
    let mtime = d.getMinutes();
    let stime = d.getSeconds();

    let hrotation = 30 * htime + mtime / 2;
    let mrotation = 6 * mtime;
    let srotation = 6 * stime;

    hour.style.transform = `rotate(${hrotation}deg)`;
    minute.style.transform = `rotate(${mrotation}deg)`;
    second.style.transform = `rotate(${srotation}deg)`;


    // Digital Clock

    document.getElementById("digitalClock").innerText =

        `${String(htime).padStart(2, '0')}:` +

        `${String(mtime).padStart(2, '0')}:` +

        `${String(stime).padStart(2, '0')}`;

}, 1000);


// Countdown Timer

let countdownInterval;

let countdownTime = 0;

let isPaused = false;


// Start Timer

function startCountdown() {

    let hours = parseInt(document.getElementById('hours').value) || 0;

    let minutes = parseInt(document.getElementById('minutes').value) || 0;

    let seconds = parseInt(document.getElementById('seconds').value) || 0;


    countdownTime = (hours * 3600) + (minutes * 60) + seconds;


    clearInterval(countdownInterval);

    isPaused = false;

    document.getElementById('timerUpMsg').style.display = 'none';


    updateDisplay();


    countdownInterval = setInterval(() => {

        if (!isPaused && countdownTime > 0) {

            countdownTime--;

            updateDisplay();
        }

        if (countdownTime <= 0) {

            clearInterval(countdownInterval);

            document.getElementById('timerUpMsg').style.display = 'block';

            document.getElementById('timerSound').play();
        }

    }, 1000);
}


// Pause

function pauseCountdown() {
    isPaused = true;
}


// Resume

function resumeCountdown() {
    isPaused = false;
}


// Restart

function restartCountdown() {

    clearInterval(countdownInterval);

    countdownTime = 0;

    isPaused = false;

    document.getElementById('countdownDisplay').innerText = "00:00:00";

    document.getElementById('timerUpMsg').style.display = 'none';

    document.getElementById('hours').value = "";

    document.getElementById('minutes').value = "";

    document.getElementById('seconds').value = "";
}


// Stop

function stopCountdown() {

    clearInterval(countdownInterval);

    isPaused = false;
}


// Display Update

function updateDisplay() {

    let hrs = Math.floor(countdownTime / 3600);

    let mins = Math.floor((countdownTime % 3600) / 60);

    let secs = countdownTime % 60;


    document.getElementById('countdownDisplay').innerText =

        `${String(hrs).padStart(2, '0')}:` +

        `${String(mins).padStart(2, '0')}:` +

        `${String(secs).padStart(2, '0')}`;
}


// Preset Buttons

function setPreset(minutes) {

    document.getElementById('hours').value = 0;

    document.getElementById('minutes').value = minutes;

    document.getElementById('seconds').value = 0;
}


// Theme Toggle

function toggleTheme() {

    document.body.classList.toggle("dark-mode");
}