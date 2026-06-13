const questions = [
  {
    question:
      "Which keyword is used to declare a block-scoped variable in JavaScript?",
    options: ["var", "let", "define", "assign"],
    answer: 1,
  },
  {
    question: "What does DOM stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Monitor",
      "Distributed Order Management",
      "Document Observer Matrix",
    ],
    answer: 0,
  },
  {
    question:
      "Which array method adds one or more elements to the end of an array?",
    options: ["pop()", "shift()", "push()", "unshift()"],
    answer: 2,
  },
  {
    question: "How do you stop an execution interval started by setInterval()?",
    options: [
      "stopInterval()",
      "clearInterval()",
      "endInterval()",
      "breakInterval()",
    ],
    answer: 1,
  },
  {
    question:
      "Which HTML5 element is used to display standalone video content?",
    options: ["<media>", "<movie>", "<source>", "<video>"],
    answer: 3,
  },
];

let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 15;

const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const questionElement = document.getElementById("question-element");
const optionsElement = document.getElementById("options-element");
const counterElement = document.getElementById("counter-element");
const timeLeftDisplay = document.getElementById("time-left");
const progressIndicator = document.getElementById("progress-indicator");
const nextBtn = document.getElementById("next-btn");
const finalScoreDisplay = document.getElementById("final-score");
const totalQuestionsDisplay = document.getElementById("total-questions");
const restartBtn = document.getElementById("restart-btn");

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultBox.classList.add("hide");
  quizBox.classList.remove("hide");
  showQuestion();
}

function showQuestion() {
  nextBtn.classList.add("hide");
  optionsElement.innerHTML = ""; // Clear prior elements safely
  timeLeft = 15;
  timeLeftDisplay.textContent = timeLeft;

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  counterElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  // Manage dynamic navigation bar tracking widths
  progressIndicator.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () => selectOption(index));
    optionsElement.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer); // Clean background leaks before starting
  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoRevealAnswer();
    }
  }, 1000);
}

function selectOption(selectedIndex) {
  clearInterval(timer);
  const currentQuestion = questions[currentQuestionIndex];
  const optionButtons = optionsElement.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, idx) => {
    btn.disabled = true; // Turn off interaction loops
    if (idx === currentQuestion.answer) {
      btn.classList.add("correct");
    }
  });

  if (selectedIndex === currentQuestion.answer) {
    score++;
  } else {
    optionButtons[selectedIndex].classList.add("wrong");
  }

  nextBtn.classList.remove("hide");
}

function autoRevealAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  const optionButtons = optionsElement.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.answer) {
      btn.classList.add("correct");
    }
  });

  nextBtn.classList.remove("hide");
}

function handleNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  clearInterval(timer);
  quizBox.classList.add("hide");
  resultBox.classList.remove("hide");
  finalScoreDisplay.textContent = score;
  totalQuestionsDisplay.textContent = questions.length;
}

nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", startQuiz);

// Run component loading pipeline initialization
startQuiz();
