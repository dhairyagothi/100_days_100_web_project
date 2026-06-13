const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const resetBtn = document.getElementById("reset-btn");

const paragraphs = [
  "The quick brown fox jumps over the lazy dog sequence serves as a classic testing string for typographic layouts and input latency calibrations.",
  "Asynchronous loop structures in JavaScript execute non-blocking operations via the event loop system making modern applications performant.",
  "Cascading style sheets define structural design layouts for document elements using flexbox distributions and grid alignment spaces safely.",
  "Persistent data layers local to browser contexts maintain memory states across browser restarts without server infrastructure dependencies.",
];

let timeLeft = 60;
let timer = null;
let isFirstKey = true;
let totalCharactersTyped = 0;
let mistakes = 0;

// Initialize random quote text split into isolated character elements safely
function loadNewQuote() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  quoteDisplay.innerHTML = ""; // Structural clearing container

  paragraphs[randomIndex].split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.textContent = char;
    quoteDisplay.appendChild(charSpan);
  });

  if (quoteDisplay.firstChild) {
    quoteDisplay.firstChild.classList.add("active");
  }
}

function processTyping() {
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  const arrayValue = quoteInput.value.split("");

  if (isFirstKey && arrayValue.length > 0) {
    startTimer();
    isFirstKey = false;
  }

  mistakes = 0;
  totalCharactersTyped = arrayValue.length;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    characterSpan.classList.remove("active");

    if (character == null) {
      characterSpan.classList.remove("correct", "incorrect");
      if (index === arrayValue.length) {
        characterSpan.classList.add("active");
      }
    } else if (character === characterSpan.textContent) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      mistakes++;
    }
  });

  // Calculations for accuracy profile
  if (totalCharactersTyped > 0) {
    const correctChars = totalCharactersTyped - mistakes;
    const accuracyPercentage = Math.max(
      0,
      Math.round((correctChars / totalCharactersTyped) * 100),
    );
    accuracyDisplay.textContent = `${accuracyPercentage}%`;
  } else {
    accuracyDisplay.textContent = "100%";
  }

  // Dynamic running word calculation estimate (assuming avg 5 characters per word block)
  const activeTimeElapsed = 60 - timeLeft;
  if (activeTimeElapsed > 0) {
    const calculatedWpm = Math.round(
      (totalCharactersTyped - mistakes) / 5 / (activeTimeElapsed / 60),
    );
    wpmDisplay.textContent = Math.max(0, calculatedWpm);
  }
}

function startTimer() {
  timeLeft = 60;
  timerDisplay.textContent = `${timeLeft}s`;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;

      const activeTimeElapsed = 60 - timeLeft;
      const calculatedWpm = Math.round(
        (totalCharactersTyped - mistakes) / 5 / (activeTimeElapsed / 60),
      );
      wpmDisplay.textContent = Math.max(0, calculatedWpm);
    } else {
      clearInterval(timer);
      quoteInput.disabled = true;
    }
  }, 1000);
}

function resetTest() {
  clearInterval(timer);
  timeLeft = 60;
  timerDisplay.textContent = `${timeLeft}s`;
  quoteInput.disabled = false;
  quoteInput.value = "";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  isFirstKey = true;
  totalCharactersTyped = 0;
  mistakes = 0;
  loadNewQuote();
  quoteInput.focus();
}

quoteInput.addEventListener("input", processTyping);
resetBtn.addEventListener("click", resetTest);

// Load app context initial setup
loadNewQuote();
