const challenges = {
  easy: [
    "Clean code grows from small habits. Type slowly at first, then let your rhythm build into speed.",
    "Every great project begins with one clear idea, one steady hand, and a little patience.",
    "Practice turns awkward keystrokes into smooth motion and calm confidence."
  ],
  medium: [
    "Responsive interfaces reward careful thinking: size the layout, respect the content, and keep every action easy to reach.",
    "Fast typing is not only about speed. The best racers stay accurate, recover quickly, and keep their focus under pressure.",
    "A useful web app feels alive when feedback arrives instantly and every state makes sense."
  ],
  hard: [
    "When the countdown starts, scan ahead, breathe evenly, and trust the pattern your fingers already know from deliberate practice.",
    "Modern gameplay blends motion, feedback, challenge, and reward into a loop that keeps the player curious for one more round.",
    "Precision matters: every mistyped character costs momentum, lowers accuracy, and gives the clock another chance to win."
  ],
  expert: [
    "Experienced typists balance velocity with restraint; they anticipate punctuation, preserve cadence through complex phrases, and avoid panic when errors appear.",
    "The scoreboard favors efficient consistency: complete the challenge, minimize corrections, maintain composure, and let clean input carry the race.",
    "Under tight time pressure, controlled attention becomes the engine that converts familiar language into rapid, accurate execution."
  ]
};

const settings = {
  easy: { seconds: 75, scoreMultiplier: 1 },
  medium: { seconds: 60, scoreMultiplier: 1.25 },
  hard: { seconds: 45, scoreMultiplier: 1.6 },
  expert: { seconds: 35, scoreMultiplier: 2 }
};

const elements = {
  bestScore: document.getElementById("bestScore"),
  bestMeta: document.getElementById("bestMeta"),
  wpm: document.getElementById("wpm"),
  accuracy: document.getElementById("accuracy"),
  timer: document.getElementById("timer"),
  score: document.getElementById("score"),
  difficulty: document.getElementById("difficulty"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
  challengeLabel: document.getElementById("challengeLabel"),
  progressLabel: document.getElementById("progressLabel"),
  challengeText: document.getElementById("challengeText"),
  typingInput: document.getElementById("typingInput"),
  raceTrack: document.querySelector(".race-track"),
  raceCar: document.getElementById("raceCar"),
  finalWpm: document.getElementById("finalWpm"),
  finalAccuracy: document.getElementById("finalAccuracy"),
  finalScore: document.getElementById("finalScore"),
  resultMessage: document.getElementById("resultMessage")
};

let currentText = "";
let timerId = null;
let startedAt = 0;
let remainingSeconds = settings.medium.seconds;
let running = false;
let best = JSON.parse(localStorage.getItem("typingRaceBest")) || {
  score: 0,
  wpm: 0,
  accuracy: 0,
  difficulty: ""
};

function pickChallenge(level) {
  const pool = challenges[level];
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderChallenge(input = "") {
  elements.challengeText.innerHTML = "";

  [...currentText].forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;

    if (index < input.length) {
      span.className = input[index] === char ? "correct" : "incorrect";
    } else if (index === input.length && running) {
      span.className = "current";
    }

    elements.challengeText.appendChild(span);
  });
}

function calculateStats() {
  const input = elements.typingInput.value;
  const elapsedMinutes = Math.max((Date.now() - startedAt) / 60000, 1 / 60000);
  let correctChars = 0;

  [...input].forEach((char, index) => {
    if (char === currentText[index]) {
      correctChars += 1;
    }
  });

  const accuracy = input.length ? Math.round((correctChars / input.length) * 100) : 100;
  const wpm = Math.round((correctChars / 5) / elapsedMinutes);
  const progress = Math.min(Math.round((input.length / currentText.length) * 100), 100);
  const level = elements.difficulty.value;
  const score = Math.max(0, Math.round((wpm * 8 + correctChars * 2 + remainingSeconds * 3) * (accuracy / 100) * settings[level].scoreMultiplier));

  return { accuracy, wpm, progress, score, correctChars, inputLength: input.length };
}

function updateStats() {
  const stats = calculateStats();
  elements.wpm.textContent = stats.wpm;
  elements.accuracy.textContent = `${stats.accuracy}%`;
  elements.score.textContent = stats.score;
  elements.progressLabel.textContent = `${stats.progress}%`;
  const maxTravel = Math.max(elements.raceTrack.clientWidth - elements.raceCar.clientWidth - 58, 0);
  elements.raceCar.style.transform = `translateX(${Math.round(maxTravel * (stats.progress / 100))}px)`;

  return stats;
}

function tickTimer() {
  remainingSeconds -= 1;
  elements.timer.textContent = `${remainingSeconds}s`;

  if (remainingSeconds <= 0) {
    finishRace("Time is up. You still earned points for every clean keystroke.");
  }
}

function startRace() {
  const level = elements.difficulty.value;
  currentText = pickChallenge(level);
  remainingSeconds = settings[level].seconds;
  startedAt = Date.now();
  running = true;

  clearInterval(timerId);
  elements.typingInput.disabled = false;
  elements.typingInput.value = "";
  elements.typingInput.focus();
  elements.timer.textContent = `${remainingSeconds}s`;
  elements.challengeLabel.textContent = `${level} challenge`;
  elements.startBtn.textContent = "New Challenge";
  elements.resultMessage.textContent = "Race in progress. Keep your accuracy clean.";

  renderChallenge();
  updateStats();
  timerId = setInterval(tickTimer, 1000);
}

function finishRace(message) {
  if (!running) {
    return;
  }

  running = false;
  clearInterval(timerId);
  elements.typingInput.disabled = true;

  const stats = updateStats();
  elements.finalWpm.textContent = stats.wpm;
  elements.finalAccuracy.textContent = `${stats.accuracy}%`;
  elements.finalScore.textContent = stats.score;
  elements.resultMessage.textContent = message;

  if (stats.score > best.score) {
    best = {
      score: stats.score,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      difficulty: elements.difficulty.value
    };
    localStorage.setItem("typingRaceBest", JSON.stringify(best));
    updateBestScore();
    elements.resultMessage.textContent = `${message} New best score.`;
  }
}

function resetRace() {
  clearInterval(timerId);
  running = false;
  currentText = "Select a difficulty and start the race when you are ready.";
  remainingSeconds = settings[elements.difficulty.value].seconds;

  elements.typingInput.value = "";
  elements.typingInput.disabled = true;
  elements.timer.textContent = `${remainingSeconds}s`;
  elements.wpm.textContent = "0";
  elements.accuracy.textContent = "100%";
  elements.score.textContent = "0";
  elements.progressLabel.textContent = "0%";
  elements.challengeLabel.textContent = "Ready challenge";
  elements.startBtn.textContent = "Start Race";
  elements.raceCar.style.transform = "translateX(0)";
  elements.finalWpm.textContent = "0";
  elements.finalAccuracy.textContent = "0%";
  elements.finalScore.textContent = "0";
  elements.resultMessage.textContent = "Start a race to set your first score.";

  renderChallenge();
}

function updateBestScore() {
  elements.bestScore.textContent = best.score;
  elements.bestMeta.textContent = best.score
    ? `${best.wpm} WPM, ${best.accuracy}% accuracy on ${best.difficulty}`
    : "No races yet";
}

elements.startBtn.addEventListener("click", startRace);
elements.resetBtn.addEventListener("click", resetRace);

elements.difficulty.addEventListener("change", () => {
  if (!running) {
    remainingSeconds = settings[elements.difficulty.value].seconds;
    elements.timer.textContent = `${remainingSeconds}s`;
  }
});

elements.typingInput.addEventListener("input", () => {
  if (!running) {
    return;
  }

  const input = elements.typingInput.value;
  renderChallenge(input);
  updateStats();

  if (input.length >= currentText.length && input === currentText) {
    finishRace("Finished. That was a clean run to the line.");
  }
});

updateBestScore();
resetRace();
