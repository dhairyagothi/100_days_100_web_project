const words = {
  programming: ["javascript", "python", "react", "algorithm", "variable"],
  animals: ["elephant", "tiger", "giraffe", "dolphin", "penguin"],
  countries: ["india", "canada", "germany", "brazil", "japan"]
};

let selectedWord = "";
let guessedLetters = [];
let lives = 6;
let score = 0;

const wordDisplay = document.getElementById("wordDisplay");
const livesDisplay = document.getElementById("lives");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("message");
const keyboard = document.getElementById("keyboard");

function startGame() {
  const category = document.getElementById("category").value;

  lives = parseInt(document.getElementById("difficulty").value);

  guessedLetters = [];

  selectedWord =
    words[category][
      Math.floor(Math.random() * words[category].length)
    ];

  livesDisplay.textContent = lives;
  messageDisplay.textContent = "";

  createKeyboard();
  updateWordDisplay();
}

function createKeyboard() {
  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();

    const btn = document.createElement("button");
    btn.textContent = letter.toUpperCase();

    btn.addEventListener("click", () => handleGuess(letter));

    keyboard.appendChild(btn);
  }
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);

  if (!selectedWord.includes(letter)) {
    lives--;
    livesDisplay.textContent = lives;
  }

  updateWordDisplay();

  if (lives <= 0) {
    messageDisplay.textContent =
      `💀 You Lost! Word was "${selectedWord}"`;

    disableKeyboard();
  }

  if (
    selectedWord
      .split("")
      .every(letter => guessedLetters.includes(letter))
  ) {
    score += 10;
    scoreDisplay.textContent = score;

    messageDisplay.textContent =
      "🎉 Congratulations! You Won!";

    disableKeyboard();
  }
}

function updateWordDisplay() {
  wordDisplay.textContent = selectedWord
    .split("")
    .map(letter =>
      guessedLetters.includes(letter)
        ? letter.toUpperCase()
        : "_"
    )
    .join(" ");
}

function disableKeyboard() {
  const buttons = keyboard.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.disabled = true;
  });
}

startGame();