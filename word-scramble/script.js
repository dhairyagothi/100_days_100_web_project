const scrambledWordBox = document.getElementById("scrambled-word-box");
const hintDisplay = document.getElementById("hint-display");
const timeDisplay = document.getElementById("time-display");
const scoreDisplay = document.getElementById("score-display");
const guessForm = document.getElementById("guess-form");
const userGuessInput = document.getElementById("user-guess-input");
const refreshBtn = document.getElementById("refresh-btn");
const submitBtn = document.getElementById("submit-btn");
const masterStartBtn = document.getElementById("master-start-btn");

// Structured puzzle dictionary collection array
const scramblePuzzlesDataset = [
  {
    targetWord: "javascript",
    itemHint:
      "The dynamic programming scripting engine of the modern web platform.",
  },
  {
    targetWord: "document",
    itemHint:
      "The global object representing your loaded web page markup model.",
  },
  {
    targetWord: "function",
    itemHint:
      "A reusable blocks structure engineered to run isolated code sequences.",
  },
  {
    targetWord: "callback",
    itemHint:
      "An execution block strategy where functions accept arguments to run later.",
  },
  {
    targetWord: "variable",
    itemHint:
      "A named storage pointer referenced across memory layout profiles.",
  },
  {
    targetWord: "compiler",
    itemHint:
      "Translates high-level source instructions down into executable target code.",
  },
  {
    targetWord: "frontend",
    itemHint:
      "The visual client interface stack running inside a user viewport browser.",
  },
];

let activePuzzleObject = null;
let currentScoreValue = 0;
let remainingSessionSeconds = 30;
let gameCountdownTimerTracker = null;
let isSessionActive = false;

function generateScrambledString(inputString) {
  const charactersArray = inputString.split("");

  // Applying structural Fisher-Yates array shuffling steps
  for (
    let currentPtr = charactersArray.length - 1;
    currentPtr > 0;
    currentPtr--
  ) {
    const structuralRandomTargetIndex = Math.floor(
      Math.random() * (currentPtr + 1),
    );
    const temporalSwapValueHolder = charactersArray[currentPtr];
    charactersArray[currentPtr] = charactersArray[structuralRandomTargetIndex];
    charactersArray[structuralRandomTargetIndex] = temporalSwapValueHolder;
  }

  const scrambledProduct = charactersArray.join("");

  // Safety recursion check to make sure the scrambled string doesn't equal the answer
  if (scrambledProduct === inputString) {
    return generateScrambledString(inputString);
  }
  return scrambledProduct;
}

function deployFreshGamePuzzle() {
  userGuessInput.value = "";
  userGuessInput.focus();

  const randomSelectionIndex = Math.floor(
    Math.random() * scramblePuzzlesDataset.length,
  );
  activePuzzleObject = scramblePuzzlesDataset[randomSelectionIndex];

  scrambledWordBox.textContent = generateScrambledString(
    activePuzzleObject.targetWord,
  );
  hintDisplay.textContent = activePuzzleObject.itemHint;
}

function triggerSessionClockDecrement() {
  remainingSessionSeconds--;
  timeDisplay.textContent = remainingSessionSeconds;

  if (remainingSessionSeconds <= 0) {
    concludeScrambleSession();
  }
}

function startWordScrambleGame() {
  if (isSessionActive) return;

  isSessionActive = true;
  currentScoreValue = 0;
  remainingSessionSeconds = 30;

  scoreDisplay.textContent = currentScoreValue;
  timeDisplay.textContent = remainingSessionSeconds;

  // Toggle interaction controls
  userGuessInput.disabled = false;
  refreshBtn.disabled = false;
  submitBtn.disabled = false;
  masterStartBtn.style.display = "none";

  deployFreshGamePuzzle();
  gameCountdownTimerTracker = setInterval(triggerSessionClockDecrement, 1000);
}

function evaluateUserGuessSubmission(submissionEvent) {
  submissionEvent.preventDefault();
  if (!isSessionActive) return;

  const refinedUserTokenInput = userGuessInput.value.trim().toLowerCase();

  if (refinedUserTokenInput === activePuzzleObject.targetWord) {
    currentScoreValue += 10;
    scoreDisplay.textContent = currentScoreValue;
    alert("Correct match! 🎉 +10 points awarded.");
    deployFreshGamePuzzle();
  } else {
    alert("Incorrect guess! ❌ Review the character sequences and try again.");
  }
}

function concludeScrambleSession() {
  clearInterval(gameCountdownTimerTracker);
  isSessionActive = false;

  userGuessInput.disabled = true;
  refreshBtn.disabled = true;
  submitBtn.disabled = true;

  masterStartBtn.style.display = "block";
  masterStartBtn.textContent = "Play Session Again 🔄";

  scrambledWordBox.textContent = "------";
  hintDisplay.textContent = "Session complete!";

  alert(
    `Game Over! Final vocabulary match processing score: ${currentScoreValue}`,
  );
}

// Map workflow event hooks
masterStartBtn.addEventListener("click", startWordScrambleGame);
refreshBtn.addEventListener("click", () => {
  if (isSessionActive) deployFreshGamePuzzle();
});
guessForm.addEventListener("submit", evaluateUserGuessSubmission);
