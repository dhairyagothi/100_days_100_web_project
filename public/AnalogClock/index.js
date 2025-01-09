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
    let hours = document.getElementById('hours').value || 0;
    let minutes = document.getElementById('minutes').value || 0;
    let seconds = document.getElementById('seconds').value || 0;

    countdownTime = (hours * 3600) + (minutes * 60) + seconds;

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