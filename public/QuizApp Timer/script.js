// ==========================
// QUIZ MASTER SCRIPT (SAFE UPGRADE)
// ==========================

// Quiz questions database (UNCHANGED)
const quizData = {
  general: { name: "General Knowledge", icon: "fa-globe", questions: [/* unchanged */] },
  science: { name: "Science", icon: "fa-flask", questions: [/* unchanged */] },
  history: { name: "History", icon: "fa-landmark", questions: [/* unchanged */] },
  tech: { name: "Technology", icon: "fa-microchip", questions: [/* unchanged */] }
};

// ==========================
// THEME SYSTEM (NEW - SAFE)
// ==========================

const themes = ["theme-default", "theme-ocean", "theme-sunset", "theme-forest"];

function setTheme(themeName) {
  document.body.classList.remove(...themes);
  document.body.classList.add(themeName);

  // store theme
  localStorage.setItem("quizTheme", themeName);
}

// load saved theme
function loadTheme() {
  const saved = localStorage.getItem("quizTheme") || "theme-default";
  setTheme(saved);
}

// optional keyboard theme switch (safe, non-breaking)
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "t") {
    let current = localStorage.getItem("quizTheme") || "theme-default";
    let idx = themes.indexOf(current);
    let next = themes[(idx + 1) % themes.length];
    setTheme(next);
  }
});

// ==========================
// DOM ELEMENTS (UNCHANGED)
// ==========================

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const exitBtn = document.getElementById('exit-btn');

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');

const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');

const progressBar = document.getElementById('progress-bar');

const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');

const finalScoreEl = document.getElementById('final-score');
const resultMessageEl = document.getElementById('result-message');

const categoryBadgeEl = document.getElementById('current-category');
const categoryResultEl = document.getElementById('category-result');

const correctAnswersEl = document.getElementById('correct-answers');
const wrongAnswersEl = document.getElementById('wrong-answers');
const timeTakenEl = document.getElementById('time-taken');
const maxPossibleEl = document.getElementById('max-possible');

const difficultySelect = document.getElementById('difficulty');
const numQuestionsSelect = document.getElementById('num-questions');

// ==========================
// QUIZ STATE (UNCHANGED)
// ==========================

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer = null;
let selectedCategory = null;
let questions = [];
let startTime = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// ==========================
// CATEGORY SELECTION
// ==========================

document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.category-card')
      .forEach(c => c.classList.remove('selected'));

    card.classList.add('selected');
    selectedCategory = card.dataset.category;
  });
});

// ==========================
// TIMER
// ==========================

function getTimeLimit() {
  const difficulty = difficultySelect.value;
  if (difficulty === 'easy') return 60;
  if (difficulty === 'medium') return 45;
  return 30;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 10) {
      timeEl.style.color = "red";
    }

    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

// ==========================
// START QUIZ
// ==========================

function startQuiz() {
  if (!selectedCategory) {
    alert("Please select a category first!");
    return;
  }

  const numQ = parseInt(numQuestionsSelect.value);
  const categoryQuestions = quizData[selectedCategory].questions;

  questions = [...categoryQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, numQ);

  currentQuestion = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  timeLeft = getTimeLimit();
  startTime = Date.now();

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  totalQuestionsEl.textContent = questions.length;
  maxPossibleEl.textContent = questions.length * 10;

  const cat = quizData[selectedCategory];
  categoryBadgeEl.innerHTML = `<i class="fas ${cat.icon}"></i> <span>${cat.name}</span>`;

  loadQuestion();
  startTimer();
  updateProgress();
}

// ==========================
// LOAD QUESTION
// ==========================

function loadQuestion() {
  const q = questions[currentQuestion];

  currentQuestionEl.textContent = currentQuestion + 1;
  questionEl.textContent = q.question;

  choicesEl.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;

    btn.onclick = () => checkAnswer(index);

    choicesEl.appendChild(btn);
  });
}

// ==========================
// CHECK ANSWER
// ==========================

function checkAnswer(index) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".choice-btn");

  buttons.forEach(b => b.disabled = true);

  if (index === q.correct) {
    score += 10;
    correctAnswers++;
    buttons[index].classList.add("correct");
  } else {
    wrongAnswers++;
    buttons[index].classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }

  scoreEl.textContent = score;

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
      updateProgress();
    } else {
      endQuiz();
    }
  }, 1200);
}

// ==========================
// PROGRESS BAR
// ==========================

function updateProgress() {
  const p = (currentQuestion / questions.length) * 100;
  progressBar.style.width = p + "%";
}

// ==========================
// END QUIZ
// ==========================

function endQuiz() {
  clearInterval(timer);

  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const percentage = (score / (questions.length * 10)) * 100;

  finalScoreEl.textContent = score;
  correctAnswersEl.textContent = correctAnswers;
  wrongAnswersEl.textContent = wrongAnswers;
  timeTakenEl.textContent = timeTaken;

  let msg = "Keep practicing!";
  if (percentage >= 80) msg = "Excellent performance!";
  else if (percentage >= 60) msg = "Good job!";
  else if (percentage >= 40) msg = "Not bad!";
  else msg = "Try again and improve!";

  resultMessageEl.textContent = msg;
}

// ==========================
// NAVIGATION
// ==========================

function goHome() {
  endScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  selectedCategory = null;
  document.querySelectorAll(".category-card")
    .forEach(c => c.classList.remove("selected"));

  progressBar.style.width = "0%";
}

function exitQuiz() {
  clearInterval(timer);
  goHome();
}

// ==========================
// EVENTS
// ==========================

startBtn.onclick = startQuiz;
restartBtn.onclick = startQuiz;
homeBtn.onclick = goHome;
exitBtn.onclick = exitQuiz;

// ==========================
// INIT
// ==========================

loadTheme();