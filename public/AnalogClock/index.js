document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Clock Elements Mapping
    // ----------------------------------------------------
    const clocks = [
        {
            id: 'local',
            timeZone: null, // Local time
            hourHand: document.getElementById('local-hour'),
            minuteHand: document.getElementById('local-minute'),
            secondHand: document.getElementById('local-second'),
            digital: document.getElementById('local-digital'),
            date: document.getElementById('local-date')
        },
        {
            id: 'ny',
            timeZone: 'America/New_York',
            hourHand: document.getElementById('ny-hour'),
            minuteHand: document.getElementById('ny-minute'),
            secondHand: document.getElementById('ny-second'),
            digital: document.getElementById('ny-digital'),
            date: document.getElementById('ny-date')
        },
        {
            id: 'london',
            timeZone: 'Europe/London',
            hourHand: document.getElementById('london-hour'),
            minuteHand: document.getElementById('london-minute'),
            secondHand: document.getElementById('london-second'),
            digital: document.getElementById('london-digital'),
            date: document.getElementById('london-date')
        },
        {
            id: 'tokyo',
            timeZone: 'Asia/Tokyo',
            hourHand: document.getElementById('tokyo-hour'),
            minuteHand: document.getElementById('tokyo-minute'),
            secondHand: document.getElementById('tokyo-second'),
            digital: document.getElementById('tokyo-digital'),
            date: document.getElementById('tokyo-date')
        }
    ];

    // ----------------------------------------------------
    // 2. Programmatic Clock Ticks Generator
    // ----------------------------------------------------
    function generateTicks() {
        const clockFaces = document.querySelectorAll('.clock-face');
        clockFaces.forEach(face => {
            // Remove existing ticks to prevent duplication on multiple initializations
            const existingTicks = face.querySelectorAll('.tick');
            existingTicks.forEach(tick => tick.remove());

            // 12 Ticks around the clock face
            for (let i = 0; i < 12; i++) {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                if (i % 3 === 0) {
                    tick.classList.add('major');
                }
                tick.style.transform = `rotate(${i * 30}deg)`;
                face.appendChild(tick);
            }
        });
    }

    generateTicks();

    // ----------------------------------------------------
    // 3. Dynamic Timezone Offsets Engine
    // Calculates offset (ms) relative to local browser time
    // ----------------------------------------------------
    const offsets = {
        ny: 0,
        london: 0,
        tokyo: 0
    };

    function calculateTimezoneOffset(timeZone) {
        const now = new Date();
        try {
            // Format current instant to string in target timezone and browser local timezone
            const tzString = now.toLocaleString("en-US", { timeZone, hour12: false });
            const localString = now.toLocaleString("en-US", { hour12: false });
            
            const tzDate = new Date(tzString);
            const localDate = new Date(localString);
            
            return tzDate.getTime() - localDate.getTime();
        } catch (error) {
            console.error(`Error computing offset for ${timeZone}:`, error);
            return 0;
        }
    }

    function refreshOffsets() {
        offsets.ny = calculateTimezoneOffset('America/New_York');
        offsets.london = calculateTimezoneOffset('Europe/London');
        offsets.tokyo = calculateTimezoneOffset('Asia/Tokyo');
    }

    // Refresh timezone offsets on startup and every 60 seconds (captures DST transitions gracefully)
    refreshOffsets();
    setInterval(refreshOffsets, 60000);

    // ----------------------------------------------------
    // 4. High-Performance 60 FPS Sweep Animation Loop
    // Calculates exact angle rotation down to the millisecond
    // ----------------------------------------------------
    function animateClocks() {
        const now = new Date();
        const localMs = now.getMilliseconds();
        const localSec = now.getSeconds() + localMs / 1000;
        const localMin = now.getMinutes() + localSec / 60;
        const localHr = (now.getHours() % 12) + localMin / 60;

        clocks.forEach(clock => {
            let hr, min, sec;
            let displayHr, displayMin, displaySec;
            let dateText;

            if (clock.id === 'local') {
                hr = localHr;
                min = localMin;
                sec = localSec;
                displayHr = now.getHours();
                displayMin = now.getMinutes();
                displaySec = now.getSeconds();
                dateText = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            } else {
                // Apply the pre-calculated offset for ultra-fast arithmetic
                const offset = offsets[clock.id] || 0;
                const targetTime = new Date(now.getTime() + offset);
                const ms = targetTime.getMilliseconds();

                sec = targetTime.getSeconds() + ms / 1000;
                min = targetTime.getMinutes() + sec / 60;
                hr = (targetTime.getHours() % 12) + min / 60;
                
                displayHr = targetTime.getHours();
                displayMin = targetTime.getMinutes();
                displaySec = targetTime.getSeconds();
                dateText = targetTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
            }

            // Calculate exact rotation angles
            const hRotation = hr * 30;      // 360deg / 12hr = 30deg/hr
            const mRotation = min * 6;      // 360deg / 60min = 6deg/min
            const sRotation = sec * 6;      // 360deg / 60sec = 6deg/sec

            // Update DOM Styles instantly without transitions (guarantees buttery continuous sweep)
            if (clock.hourHand) clock.hourHand.style.transform = `rotate(${hRotation}deg)`;
            if (clock.minuteHand) clock.minuteHand.style.transform = `rotate(${mRotation}deg)`;
            if (clock.secondHand) clock.secondHand.style.transform = `rotate(${sRotation}deg)`;

            // Format digital string safely (prevents layout shifts on variable character widths)
            if (clock.digital) {
                const padH = String(displayHr).padStart(2, '0');
                const padM = String(displayMin).padStart(2, '0');
                const padS = String(displaySec).padStart(2, '0');
                clock.digital.textContent = `${padH}:${padM}:${padS}`;
            }

            // Update Date only on change to avoid DOM repaint overhead
            if (clock.date && clock.date.textContent !== dateText) {
                clock.date.textContent = dateText;
            }
        });

        // Request next frame at 60 FPS
        requestAnimationFrame(animateClocks);
    }

    // Launch the continuous clock animation loop
    requestAnimationFrame(animateClocks);

    // ----------------------------------------------------
    // 5. Light/Dark Neumorphic Theme Toggle System
    // Supports LocalStorage state and System prefers-color-scheme
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    function updateThemeUI(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = (savedTheme === 'dark') || (!savedTheme && systemPrefersDark);
        updateThemeUI(isDark);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const willBeDark = !document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
            updateThemeUI(willBeDark);
        });
    }

    initTheme();

    // ----------------------------------------------------
    // 6. Refactored Countdown Timer Engine
    // Clean state transitions with neat UI interactions
    // ----------------------------------------------------
    let countdownInterval = null;
    let countdownTime = 0; // remaining time in seconds
    let isPaused = false;

    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const timerUpMsg = document.getElementById('timerUpMsg');
    const timerSound = document.getElementById('timerSound');
    const pausebtn = document.getElementById('pausebtn');

    window.startCountdown = function() {
        // Stop any running timer
        clearInterval(countdownInterval);
        timerUpMsg.style.display = 'none';
        
        // Load inputs
        let h = parseInt(hoursInput.value) || 0;
        let m = parseInt(minutesInput.value) || 0;
        let s = parseInt(secondsInput.value) || 0;

        // Validation bounds
        h = Math.max(0, Math.min(23, h));
        m = Math.max(0, Math.min(59, m));
        s = Math.max(0, Math.min(59, s));

        // Sync bounded values back to input fields
        hoursInput.value = h > 0 ? h : '';
        minutesInput.value = m > 0 ? m : '';
        secondsInput.value = s > 0 ? s : '';

        countdownTime = (h * 3600) + (m * 60) + s;

        if (countdownTime <= 0) {
            alert('Please specify a duration greater than 0 seconds.');
            return;
        }

        isPaused = false;
        pausebtn.innerText = 'Pause';
        
        updateTimerDisplay();
        tickCountdown();
    };

    function tickCountdown() {
    updateTimerDisplay();

    countdownInterval = setInterval(() => {
        if (countdownTime <= 0) {
            triggerTimerFinished();
        } else {
            countdownTime--;
            updateTimerDisplay();
        }
    }, 1000);
}
    

    function updateTimerDisplay() {
        const leftH = Math.floor(countdownTime / 3600);
        const leftM = Math.floor((countdownTime % 3600) / 60);
        const leftS = countdownTime % 60;

        const padH = String(leftH).padStart(2, '0');
        const padM = String(leftM).padStart(2, '0');
        const padS = String(leftS).padStart(2, '0');
        countdownDisplay.textContent = `${padH}:${padM}:${padS}`;
    }

    function triggerTimerFinished() {
        clearInterval(countdownInterval);
        timerUpMsg.style.display = 'flex';
        
        // Play audio alarm safely
        if (timerSound) {
            timerSound.currentTime = 0;
            timerSound.play().catch(e => console.log('Audio playback prevented by browser auto-play policy.', e));
        }

        countdownDisplay.textContent = '00:00:00';
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
        pausebtn.innerText = 'Pause';
        isPaused = false;
    }


    window.pauseCountdown = function() {
        if (countdownTime <= 0) return;

        if (!isPaused) {
            clearInterval(countdownInterval);
            pausebtn.innerText = 'Resume';
            isPaused = true;
        } else {
            pausebtn.innerText = 'Pause';
            isPaused = false;
            tickCountdown();
        }
    };

    window.restartCountdown = function() {
        clearInterval(countdownInterval);
        countdownTime = 0;
        countdownDisplay.textContent = '00:00:00';

        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';

        pausebtn.innerText = 'Pause';
        isPaused = false;
        timerUpMsg.style.display = 'none';

        if (timerSound) {
            timerSound.pause();
            timerSound.currentTime = 0;
        }
    };

});