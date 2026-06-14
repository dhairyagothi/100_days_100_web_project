const holesList = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("game-score");
const timerDisplay = document.getElementById("game-timer");
const startBtn = document.getElementById("start-game-btn");

let currentScore = 0;
let timeRemaining = 30;
let lastSelectedHole = null;
let isGameOverFlag = true;
let molePopupInterval = null;
let gameCountdownInterval = null;

function fetchRandomHole(holes) {
  const randomIndex = Math.floor(Math.random() * holes.length);
  const selectedHole = holes[randomIndex];

  if (selectedHole === lastSelectedHole) {
    return fetchRandomHole(holes);
  }
  lastSelectedHole = selectedHole;
  return selectedHole;
}

function displayMoleSequence() {
  // Generate variable timer window offsets to enforce true game randomness
  const variablePopupSpeed = Math.floor(Math.random() * 450) + 550; // 550ms - 1000ms
  const targetedHole = fetchRandomHole(holesList);

  targetedHole.classList.add("up");

  setTimeout(() => {
    targetedHole.classList.remove("up");
    if (!isGameOverFlag) displayMoleSequence();
  }, variablePopupSpeed);
}

function startWhackAMoleGame() {
  if (!isGameOverFlag) return; // Prevent interval duplicates if clicked repeatedly

  // Initialize system state parameters cleanly
  currentScore = 0;
  timeRemaining = 30;
  isGameOverFlag = false;

  scoreDisplay.textContent = currentScore;
  timerDisplay.textContent = timeRemaining;
  startBtn.disabled = true;
  startBtn.textContent = "Playing...";

  displayMoleSequence();

  gameCountdownInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      terminateGameSession();
    }
  }, 1000);
}

function terminateGameSession() {
  isGameOverFlag = true;
  clearInterval(gameCountdownInterval);
  startBtn.disabled = false;
  startBtn.textContent = "Start Game 🕹️";
  alert(`Game Over! Final Score: ${currentScore}`);
}

function handleMoleWhack(event) {
  // Authenticate interaction event to avoid programmatic simulated point cheating
  if (!event.isTrusted) return;

  currentScore++;
  scoreDisplay.textContent = currentScore;

  // Smoothly force immediate reset down into the hole upon registration
  this.parentNode.classList.remove("up");
}

// Attach score listeners to individual mole targets
document.querySelectorAll(".mole").forEach((moleNode) => {
  moleNode.addEventListener("mousedown", handleMoleWhack);
});

startBtn.addEventListener("click", startWhackAMoleGame);
