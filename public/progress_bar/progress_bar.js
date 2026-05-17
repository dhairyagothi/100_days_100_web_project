
let value = document.querySelector('#num');
let progress = document.querySelector('.block2');
let button = document.querySelector('#btn');
let stopBtn = document.querySelector('#stopBtn');
let resetBtn = document.querySelector('#resetBtn');

let currentProgress = 0;
let targetProgress = 90;
let speed = 80; // Milliseconds between increments for smoother animation
let timer = null;
let isAnimating = false;

// Easing function for smooth animation (cubic-bezier equivalent)
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Update the progress bar with smooth animation
 */
function updateProgress() {
    if (currentProgress < targetProgress) {
        currentProgress += 1;
        updateCircle();
        
        // Continue animation
        timer = setTimeout(updateProgress, speed);
    } else if (currentProgress === targetProgress) {
        // Animation complete
        isAnimating = false;
        button.disabled = false;
        button.textContent = 'Complete!';
        updateStopButtonState();
        
        // Add completion visual feedback
        progress.classList.add('completed');
        value.classList.add('completing');
        
        // Reset button text after a short delay
        setTimeout(() => {
            button.textContent = 'Start Progress';
            button.disabled = false;
        }, 1500);
    }
}

/**
 * Update the circle visualization
 */
function updateCircle() {
    const degrees = currentProgress * 3.6;
    progress.style.background = `conic-gradient(#52c234 ${degrees}deg, white 0deg)`;
    value.textContent = `${currentProgress}%`;
}

/**
 * Stop the animation and pause progress
 */
function stopProgress() {
    if (isAnimating) {
        clearTimeout(timer);
        isAnimating = false;
        button.disabled = false;
        button.textContent = 'Resume';
        progress.classList.remove('animating');
    }
}

/**
 * Reset progress to zero
 */
function resetProgress() {
    // Stop any ongoing animation
    clearTimeout(timer);
    isAnimating = false;
    
    // Reset values
    currentProgress = 0;
    value.textContent = '0%';
    
    // Reset visual states
    progress.style.background = `conic-gradient(#52c234 0deg, white 0deg)`;
    progress.classList.remove('completed', 'animating');
    value.classList.remove('completing');
    
    // Reset button state
    button.disabled = false;
    button.textContent = 'Start Progress';
}

/**
 * Start the progress animation
 */
function startProgress() {
    if (!isAnimating) {
        isAnimating = true;
        button.disabled = true;
        button.textContent = 'In Progress...';
        progress.classList.add('animating');
        updateStopButtonState();
        
        // Start the animation
        timer = setTimeout(updateProgress, speed);
    }
}

// Event listeners
button.addEventListener('click', startProgress);

stopBtn.addEventListener('click', stopProgress);
stopBtn.disabled = true; // Disable stop button initially
stopBtn.style.opacity = '0.7';
stopBtn.style.cursor = 'not-allowed';

resetBtn.addEventListener('click', resetProgress);

// Update stop button state
function updateStopButtonState() {
    if (isAnimating) {
        stopBtn.disabled = false;
        stopBtn.style.opacity = '1';
        stopBtn.style.cursor = 'pointer';
    } else {
        stopBtn.disabled = true;
        stopBtn.style.opacity = '0.7';
        stopBtn.style.cursor = 'not-allowed';
    }
}

// Prevent button clicks during animation with visual feedback
button.addEventListener('click', function (e) {
    if (isAnimating) {
        e.preventDefault();
    }
});

// Initialize display
updateCircle();


