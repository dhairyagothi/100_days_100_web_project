document.addEventListener('DOMContentLoaded', function() {

// setting main cat idle gif
const imgElement = document.getElementById("cat");
imgElement.src = 'assets/idle.gif'; // Replace with your cat GIF path


// setting timer functionality + meow sound
const meowSound = new Audio('assets/meow.mp3');
const timerDisplay = document.querySelector(".timer");
const workBtn = document.querySelectorAll(".image-button")[0];
const breakBtn = document.querySelectorAll(".image-button")[1];
const startBtn = document.getElementById("start-btn");

let timerInterval;  // to clear previous interval
let remainingTime = 0;
let isTimerReady = false;
let currentMode = "";  // "work" or "break"


// Format seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`; //padding to maintain 00:00 format
}


// Start Timer
function startTimer() {
  if (!isTimerReady || remainingTime <= 0) return;

  clearInterval(timerInterval); // Clear any existing timer
  timerDisplay.textContent = formatTime(remainingTime);
  
  // Set gif based on mode
  if (currentMode === "work") {
    imgElement.src = 'assets/working.gif';
  } else if (currentMode === "break") {
    imgElement.src = 'assets/resting.gif';
  }

  timerInterval = setInterval(() => {
    remainingTime--;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00";

      // Play meow sound
      meowSound.currentTime = 0;   // rewind to start
      meowSound.play();

      // Show final image on timer end
      if (currentMode === "work") {
        imgElement.src = 'assets/workdone.gif';
      } else if (currentMode === "break") {
        imgElement.src = 'assets/restdone.png';
      }

      isTimerReady = false;
      return;
    }

    timerDisplay.textContent = formatTime(remainingTime);
  }, 1000);
}

workBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  remainingTime = 25 * 60;                    // Set new time
  timerDisplay.textContent = formatTime(remainingTime);
  isTimerReady = true;
  currentMode = "work";
  imgElement.src = 'assets/idle.gif';  // Reset to idle
  startEncouragement(workMessages);
});

breakBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  remainingTime = 5 *60;
  timerDisplay.textContent = formatTime(remainingTime);
  isTimerReady = true;
  currentMode = "break";
  imgElement.src = 'assets/idle.gif';  // Reset to idle
  startEncouragement(breakMessages);
});

startBtn.addEventListener("click", () => {
  startTimer();
});


// encouragemnt function
const encouragementText = document.getElementById("encouragement-text");
const workMessages = [
  "Stay focused! 💪",
  "You’re doing great! 🌟",
  "Keep going! 🔥",
  "One step at a time 🐾",
  "Bunny believes in you! 🐰"
];
const breakMessages = [
  "Time to relax! ☕",
  "Take a deep breath 🌿",
  "Lets rest for a while 💤",
  "Stretch your legs 🧘‍♀️",
  "Rest your eyes 🌟"
];
let encouragementInterval;

function startEncouragement(messagesArray) {
  let index = 0;
  clearInterval(encouragementInterval);
  encouragementText.textContent = messagesArray[index];
  encouragementInterval = setInterval(() => {
    index = (index + 1) % messagesArray.length;
    encouragementText.textContent = messagesArray[index];
  }, 120000); // every 2 minutes
}

function stopEncouragement() {
  clearInterval(encouragementInterval);
}

});