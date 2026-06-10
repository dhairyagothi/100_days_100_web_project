// Initial State
let count = 0;
const MAX_CAPACITY = 10; // Change this value to test the alarm

// DOM Elements
const countDisplay = document.getElementById('count');
const alarmMsg = document.getElementById('alarm-msg');
const displayBox = document.querySelector('.display-box');
const enterBtn = document.getElementById('enter-btn');
const exitBtn = document.getElementById('exit-btn');

// Function to update the UI based on the state
function updateUI() {
    countDisplay.innerText = count;

    // Check Capacity Alarm Logic
    if (count >= MAX_CAPACITY) {
        alarmMsg.classList.remove('hidden');
        displayBox.classList.add('alarm-active');
        enterBtn.disabled = true; // Stop more people from entering
    } else {
        alarmMsg.classList.add('hidden');
        displayBox.classList.remove('alarm-active');
        enterBtn.disabled = false;
    }

    // Prevent negative visitors
    if (count <= 0) {
        exitBtn.disabled = true;
    } else {
        exitBtn.disabled = false;
    }
}

// Event Listeners for Buttons
enterBtn.addEventListener('click', () => {
    if (count < MAX_CAPACITY) {
        count++;
        updateUI();
    }
});

exitBtn.addEventListener('click', () => {
    if (count > 0) {
        count--;
        updateUI();
    }
});

// Initialize UI on load
updateUI();