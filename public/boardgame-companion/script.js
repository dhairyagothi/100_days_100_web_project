// Game State
let scores = { player1: 0, player2: 0 };
let activePlayer = 1;
let currentCorrectAnswer = "";

// DOM Elements
const dice = document.getElementById("dice");
const rollBtn = document.getElementById("roll-btn");
const triviaBox = document.getElementById("trivia-box");
const categoryBadge = document.getElementById("category-badge");
const questionText = document.getElementById("question-text");
const revealBtn = document.getElementById("reveal-btn");
const answerBlock = document.getElementById("answer-block");
const answerText = document.getElementById("answer-text");
const correctBtn = document.getElementById("correct-btn");
const wrongBtn = document.getElementById("wrong-btn");

// OpenTDB Category Map matching numbers 1 to 6
const categoryMap = {
  1: { id: 9, name: "General Knowledge" },
  2: { id: 17, name: "Science & Nature" },
  3: { id: 22, name: "Geography" },
  4: { id: 23, name: "History" },
  5: { id: 11, name: "Film / Pop Culture" },
  6: { id: 21, name: "Sports" },
};

// Target transform Rotations per side value to align 3D perspective smoothly
const rotations = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateY(-180deg)",
  3: "rotateY(-90deg)",
  4: "rotateY(90deg)",
  5: "rotateX(-90deg)",
  6: "rotateX(90deg)",
};

// Helper to decode HTML entities returned by the Trivia API
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// 1. Roll Dice Mechanics
rollBtn.addEventListener("click", () => {
  rollBtn.disabled = true;
  triviaBox.classList.add("hidden");
  answerBlock.classList.add("hidden");

  const targetValue = Math.floor(Math.random() * 6) + 1;

  // Trigger visual CSS spin animation loop
  dice.classList.add("rolling");

  setTimeout(() => {
    dice.classList.remove("rolling");
    // Instantly land cleanly on selected face rotation matrix
    dice.style.transform = rotations[targetValue];

    // Fetch matching Trivia Category
    fetchTrivia(categoryMap[targetValue]);
  }, 1000);
});

// 2. Fetch OpenTDB API Question
async function fetchTrivia(category) {
  categoryBadge.textContent = `Category: ${category.name}`;
  questionText.textContent = "Loading question...";
  triviaBox.classList.remove("hidden");
  revealBtn.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=1&category=${category.id}&type=multiple`,
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const questionData = data.results[0];
      questionText.textContent = decodeHTML(questionData.question);
      currentCorrectAnswer = decodeHTML(questionData.correct_answer);
      answerText.textContent = `Answer: ${currentCorrectAnswer}`;
    } else {
      questionText.textContent = "Failed to load question. Please roll again!";
      rollBtn.disabled = false;
    }
  } catch (error) {
    questionText.textContent =
      "Network error loading question. Please try again.";
    rollBtn.disabled = false;
  }
}

// 3. UI Reveal Answer Handler
revealBtn.addEventListener("click", () => {
  revealBtn.classList.add("hidden");
  answerBlock.classList.remove("hidden");
});

// 4. Update Turn & Scores Local State State Loops
function switchTurn() {
  activePlayer = activePlayer === 1 ? 2 : 1;
  document
    .getElementById("player1-card")
    .classList.toggle("active", activePlayer === 1);
  document
    .getElementById("player2-card")
    .classList.toggle("active", activePlayer === 2);

  // Re-enable main trigger
  rollBtn.disabled = false;
  triviaBox.classList.add("hidden");
}

correctBtn.addEventListener("click", () => {
  if (activePlayer === 1) {
    scores.player1 += 1;
    document.getElementById("p1-score").textContent = scores.player1;
  } else {
    scores.player2 += 1;
    document.getElementById("p2-score").textContent = scores.player2;
  }
  switchTurn();
});

wrongBtn.addEventListener("click", () => {
  switchTurn();
});
