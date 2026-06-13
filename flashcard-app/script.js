const flashcard = document.getElementById("flashcard");
const categorySelect = document.getElementById("category-select");
const scoreCounter = document.getElementById("score-counter");
const questionDisplay = document.getElementById("question");
const answerDisplay = document.getElementById("card-answer");
const catDisplay = document.getElementById("card-cat-display");

const correctBtn = document.getElementById("correct-btn");
const wrongBtn = document.getElementById("wrong-btn");
const nextBtn = document.getElementById("next-btn");

// Structured flashcard master database array
const flashcardDataset = [
  {
    id: 1,
    category: "frontend",
    question: "What does semantic HTML mean?",
    answer:
      "Using HTML elements that clearly describe their meaning to both the browser and developer (e.g., <main>, <article> instead of generic <div> tags).",
  },
  {
    id: 2,
    category: "frontend",
    question: "What is the difference between Flexbox and CSS Grid?",
    answer:
      "Flexbox is designed for one-dimensional layouts (either a row OR a column), whereas CSS Grid is intended for two-dimensional layouts (both rows AND columns simultaneously).",
  },
  {
    id: 3,
    category: "javascript",
    question: "What is a closure in JavaScript?",
    answer:
      "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment), allowing an inner function to access outer scope variables.",
  },
  {
    id: 4,
    category: "javascript",
    question: "What is the event loop?",
    answer:
      "The event loop is a runtime mechanism that handles asynchronous execution by shifting completed callbacks from the task queue into the call stack once it becomes completely empty.",
  },
  {
    id: 5,
    category: "git",
    question: "What is the difference between git fetch and git pull?",
    answer:
      "Git fetch downloads remote tracking logs/branches without merging them into your working files. Git pull runs git fetch followed immediately by a git merge automatically.",
  },
];

let activePool = [...flashcardDataset];
let currentCardIndex = 0;
let score = 0;

function populateCard() {
  // Drop card active flip state before altering content pointers
  flashcard.classList.remove("flipped");

  if (activePool.length === 0) {
    questionDisplay.textContent = "All caught up! Excellent job.";
    answerDisplay.textContent = "Change category or click below to restart.";
    catDisplay.textContent = "Done";
    return;
  }

  const currentCard = activePool[currentCardIndex];
  // Populate text fields safely via clean property tokens
  questionDisplay.textContent = currentCard.question;
  answerDisplay.textContent = currentCard.answer;
  catDisplay.textContent = currentCard.category;
}

function handleFilter() {
  const selected = categorySelect.value;
  if (selected === "all") {
    activePool = [...flashcardDataset];
  } else {
    activePool = flashcardDataset.filter((card) => card.category === selected);
  }
  currentCardIndex = 0;
  populateCard();
}

function advanceNext() {
  if (activePool.length === 0) {
    handleFilter();
    return;
  }
  currentCardIndex = (currentCardIndex + 1) % activePool.length;
  populateCard();
}

// Flip toggle event layout wrapper
flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

correctBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Stop parent click events from causing misfired back-flips
  score++;
  scoreCounter.textContent = score;
  advanceNext();
});

wrongBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  advanceNext();
});

nextBtn.addEventListener("click", advanceNext);
categorySelect.addEventListener("change", handleFilter);

// Load initialization parameters
populateCard();
