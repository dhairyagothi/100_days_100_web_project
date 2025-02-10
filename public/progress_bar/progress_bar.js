let value = document.querySelector('#num');
let progress = document.querySelector('.progress-circle');
let button = document.querySelector('#btn');
let scrollValue = document.querySelector('#scroll-value');
let meterBar = document.querySelector('#meter-bar');

let start = 0; // Initial progress value
let end = 100; // Target progress value
let speed = 50; // Speed of progress updates (ms per increment)
let timer = null;
let isRunning = false;

// Function to update circular progress
function updateProgress() {
    if (start >= end) {
        clearInterval(timer);
        isRunning = false;
        value.textContent = "Done!";
        button.textContent = "Restart Progress";
        return;
    }
    // Update progress circle and text
    progress.style.background = `conic-gradient(#52c234 ${start * 3.6}deg, #dcdcdc ${start * 3.6}deg)`;
    value.textContent = `${start}%`;

    // Update scrollable meter with the same progress
    updateScrollMeter(start);

    start++;
}

// Function to update scrollable meter dynamically
function updateScrollMeter(progressValue = 0) {
    const scrollPercent = progressValue || Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100);

    // Update the meter height and scroll percentage text
    meterBar.style.height = `${scrollPercent}%`;
    scrollValue.textContent = `${Math.round(scrollPercent)}%`;
}

// Add event listener for button
button.addEventListener('click', function () {
    if (!isRunning) {
        if (start >= end) {
            // Reset progress if it's already completed
            start = 0;
            value.textContent = "0%";
            progress.style.background = `conic-gradient(#dcdcdc 0deg, #dcdcdc 360deg)`;
        }
        timer = setInterval(updateProgress, speed);
        isRunning = true;
        button.textContent = "Pause Progress";
    } else {
        clearInterval(timer);
        isRunning = false;
        button.textContent = "Resume Progress";
    }
});

// Add event listener for scroll
window.addEventListener('scroll', () => updateScrollMeter());





