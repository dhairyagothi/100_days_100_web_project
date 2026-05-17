setInterval(() => {
    d = new Date();
    htime = d.getHours();
    mtime = d.getMinutes();
    stime = d.getSeconds();
    hrotation = 30 * htime + mtime / 2;
    mrotation = 6 * mtime;
    srotation = 6 * stime;

    hour.style.transform = `rotate(${hrotation}deg)`;
    minute.style.transform = `rotate(${mrotation}deg)`;
    second.style.transform = `rotate(${srotation}deg)`;
}, 1000);

// Countdown Timer
let countdownInterval;
let countdownTime;

function startCountdown() {
    let hours = parseInt(document.getElementById('hours').value) || 0;
let minutes = parseInt(document.getElementById('minutes').value) || 0;
let seconds = parseInt(document.getElementById('seconds').value) || 0;


    countdownTime = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);

    clearInterval(countdownInterval); // Clear any previous countdowns

    countdownInterval = setInterval(() => {
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);

            //show pop up msg

            document.getElementById('timerUpMsg').style.display = 'block';


            // Play alarm sound
            const timerSound = document.getElementById('timerSound');
            timerSound.play();


        } else {
            countdownTime--;
            let hoursLeft = Math.floor(countdownTime / 3600);
            let minutesLeft = Math.floor((countdownTime % 3600) / 60);
            let secondsLeft = countdownTime % 60;
            document.getElementById('countdownDisplay').textContent =
                `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }
    }, 1000);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
}

function resumeCountdown() {
    if (countdownTime > 0) {
        countdownInterval = setInterval(() => {
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('timerUpMsg').style.display = 'block';
                document.getElementById('timerSound').play();
            } else {
                countdownTime--;
                let hoursLeft = Math.floor(countdownTime / 3600);
                let minutesLeft = Math.floor((countdownTime % 3600) / 60);
                let secondsLeft = countdownTime % 60;
                document.getElementById('countdownDisplay').textContent =
                    `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
            }
        }, 1000);
    }
}

function restartCountdown() {
    clearInterval(countdownInterval);
    document.getElementById('countdownDisplay').textContent = '00:00:00';
    document.getElementById('timerUpMsg').style.display = 'none';
    countdownTime = 0;
}