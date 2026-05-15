let value = document.querySelector('#num');
let progress = document.querySelector('.block2');

let startBtn = document.querySelector('#startBtn');
let pauseBtn = document.querySelector('#pauseBtn');
let stopBtn = document.querySelector('#stopBtn');

let durationInput = document.querySelector('#duration');

let popup = document.querySelector('#popup');
let closeBtn = document.querySelector('.close-btn');
let popupCloseBtn = document.querySelector('#popupCloseBtn');

let statusDiv = document.querySelector('#status');

let currentProgress = 0;
let end = 100;

let timer = null;
let isRunning = false;
let speed = 1000;

let targetMilestones = [25, 50, 75, 100];
let completedMilestones = new Set();


// Show Popup
function showPopup(percentage){

    let message = '';
    let subtext = '';

    switch(percentage){

        case 25:
            message = '🎯 25% Complete!';
            subtext = 'Great Start!';
            break;

        case 50:
            message = '⭐ 50% Complete!';
            subtext = 'Halfway There!';
            break;

        case 75:
            message = '🚀 75% Complete!';
            subtext = 'Almost Done!';
            break;

        case 100:
            message = '🏆 100% Complete!';
            subtext = 'Congratulations!';
            break;

        default:
            message = `${percentage}% Completed`;
            subtext = 'Keep Going!';
    }

    document.querySelector('#popupMessage').innerHTML = message;
    document.querySelector('#popupSubtext').innerHTML = subtext;

    popup.classList.remove('hidden');

    setTimeout(() => {

        if(!popup.classList.contains('hidden')){
            popup.classList.add('hidden');
        }

    },3000);
}


// Update Progress
function updateProgress(){

    if(currentProgress >= end){

// Function to update progress
function updateProgress() {
    progress.style.background = `conic-gradient(#52c234 ${start * 3.6}deg, white 0deg)`;
    value.textContent = `${start}%`;
    
    if (start >= end) { 
        clearInterval(timer); 
        isRunning = false; 
        start = 0; 
        return; 
    }
    
    start++;
}


// Calculate Speed

function calculateSpeed(duration){
    return (duration * 1000) / end;
}


// Start Button

startBtn.addEventListener('click', function(){

    let duration = parseInt(durationInput.value);

    if(isNaN(duration) || duration <= 0){

        alert('Please enter valid duration');

        return;
    }

    if(duration > 300){

        alert('Maximum duration is 300 seconds');

        return;
    }

    // Reset everything

    clearInterval(timer);

    currentProgress = 0;

    completedMilestones.clear();

    progress.style.background =
        `conic-gradient(#52c234 0deg,#061700 0deg)`;

    value.innerHTML = '0%';

    speed = calculateSpeed(duration);

    isRunning = true;

    pauseBtn.innerHTML = '⏸ Pause';

    timer = setInterval(updateProgress, speed);

    statusDiv.innerHTML =
        `▶ Started! Target ${duration} seconds`;

    statusDiv.style.background = '#d4edda';
    statusDiv.style.color = '#155724';
});


// Pause / Resume Button

pauseBtn.addEventListener('click', function(){

    // Pause

    if(isRunning){

        clearInterval(timer);

        timer = null;

        isRunning = false;

        pauseBtn.innerHTML = '▶ Resume';

        statusDiv.innerHTML =
            `⏸ Paused at ${currentProgress}%`;

        statusDiv.style.background = '#fff3cd';
        statusDiv.style.color = '#856404';
    }

    // Resume

    else{

        // Prevent resume before start

        if(currentProgress === 0){

            statusDiv.innerHTML =
                '⚠ Please click Start first';

            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';

            return;
        }

        // Prevent resume after complete

        if(currentProgress >= end){

            statusDiv.innerHTML =
                '✅ Already Completed';

            return;
        }

        isRunning = true;

        pauseBtn.innerHTML = '⏸ Pause';

        timer = setInterval(updateProgress, speed);

        statusDiv.innerHTML =
            `▶ Resumed from ${currentProgress}%`;

        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
    }
});


// Stop Button

// Stop Button

stopBtn.addEventListener('click', function () {

    // If nothing started
    if(currentProgress === 0 && !isRunning){

        statusDiv.innerHTML =
            '⚠ Progress already stopped';

        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';

        return;
    }

    // Store stopped percentage
    let stoppedAt = currentProgress;

    // Stop timer
    clearInterval(timer);

    timer = null;

    isRunning = false;

    // Show popup BEFORE reset
    document.querySelector('#popupMessage').innerHTML =
        '⏹ Progress Stopped';

    document.querySelector('#popupSubtext').innerHTML =
        `You stopped at ${stoppedAt}%`;

    popup.classList.remove('hidden');

    // Reset values
    currentProgress = 0;

    completedMilestones.clear();

    progress.style.background =
        `conic-gradient(#52c234 0deg,#061700 0deg)`;

    value.innerHTML = '0%';

    pauseBtn.innerHTML = '⏸ Pause';

    // Status message
    statusDiv.innerHTML =
        `⏹ Reset Successfully`;

    statusDiv.style.background = '#f8d7da';
    statusDiv.style.color = '#721c24';
});




// Close Popup

closeBtn.addEventListener('click', function(){

    popup.classList.add('hidden');
});

popupCloseBtn.addEventListener('click', function(){

    popup.classList.add('hidden');
});

popup.addEventListener('click', function(e){

    if(e.target === popup){

        popup.classList.add('hidden');
    }
});


// Input Validation

durationInput.addEventListener('change', function(){

    let val = parseInt(this.value);

    if(isNaN(val) || val < 1){
        this.value = 60;
    }

    if(val > 300){
        this.value = 300;
    }
});


// Keyboard Shortcuts

document.addEventListener('keydown', function(e){

    // Space = Pause / Resume

    if(e.code === 'Space'){

        e.preventDefault();

        pauseBtn.click();
    }

    // Escape = Close Popup

    if(e.code === 'Escape'){

        popup.classList.add('hidden');
    }
});

console.log('🚀 Smart Progress Bar Loaded');