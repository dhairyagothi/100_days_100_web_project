const progressValue = document.querySelector("#progress-value");
const progressRing = document.querySelector(".progress-ring");
const startButton = document.querySelector("#btn");
const stopButton = document.querySelector("#stopBtn");
const resetButton = document.querySelector("#resetBtn");
const PROGRESS_TARGET = 100;
const ANIMATION_SPEED = 80;
let currentProgress = 0;
let animationTimer = null;
let isAnimating = false;
/**
 * Updates the circular progress UI
 */
function updateProgressRing() {
    const progressDegrees = currentProgress * 3.6;
    progressRing.style.background = `
    conic-gradient(
        #52c234 ${progressDegrees}deg,
        #ffffff 0deg
    )
`;
    progressValue.textContent = `${currentProgress}%`;
    progressRing.setAttribute(
        "aria-valuenow",
        currentProgress
    );
}

/**
 * Handles progress animation loop
 */
function animateProgress() {
    if (currentProgress < PROGRESS_TARGET) {
        currentProgress += 1;
        updateProgressRing();
        animationTimer = setTimeout(
            animateProgress,
            ANIMATION_SPEED
        );
        return;
    }
    handleProgressComplete();
}

/**
 * Handles completion state
 */
function handleProgressComplete() {
    isAnimating = false;
    progressRing.classList.remove("animating");
    progressRing.classList.add("completed");
    progressValue.classList.add("completing");
    startButton.disabled = false;
    startButton.textContent = "Restart Progress";
    startButton.classList.add("restart-state");
    updateStopButtonState();
}
/**
 * Starts the progress animation
 */
function startProgress() {
    if (isAnimating) {
        return;
    }
    /**
     * Restart flow
     */
    if (currentProgress >= PROGRESS_TARGET) {
        currentProgress = 0;
        progressRing.classList.remove("completed");
        progressValue.classList.remove("completing");
        updateProgressRing();
    }
    isAnimating = true;
    startButton.disabled = true;
    startButton.textContent = "In Progress...";
    startButton.classList.remove("restart-state");
    progressRing.classList.add("animating");
    updateStopButtonState();
    animationTimer = setTimeout(
        animateProgress,
        ANIMATION_SPEED
    );
}
/**
 * Stops the animation
 */
function stopProgress() {
    if (!isAnimating) {
        return;
    }
    clearTimeout(animationTimer);
    isAnimating = false;
    startButton.disabled = false;
    startButton.textContent = "Resume";
    progressRing.classList.remove("animating");
    updateStopButtonState();
}
/**
 * Resets the progress state
 */
function resetProgress() {
    clearTimeout(animationTimer);
    isAnimating = false;
    currentProgress = 0;
    progressValue.textContent = "0%";
    progressRing.classList.remove(
        "animating",
        "completed"
    );
    progressValue.classList.remove("completing");
    startButton.disabled = false;
    startButton.textContent = "Start Progress";
    updateProgressRing();
    updateStopButtonState();
}
/**
 * Updates stop button state
 */
function updateStopButtonState() {
    stopButton.disabled = !isAnimating;
}
/**
 * Event Listeners
 */
startButton.addEventListener(
    "click",
    startProgress
);
stopButton.addEventListener(
    "click",
    stopProgress
);
resetButton.addEventListener(
    "click",
    resetProgress
);
/**
 * Initial UI setup
 */
updateProgressRing();
updateStopButtonState();