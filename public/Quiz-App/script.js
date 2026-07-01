// --- Quiz Content Array ---
const quizDataBase = [
  { question: "Which language runs natively in a web browser?", options: ["Java", "C", "Python", "JavaScript"], correct: 3 },
  { question: "What does CSS stand for?", options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading System Sheets", "Cars SUVs Sailboats"], correct: 1 },
  { question: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hypertext Markdown Language", "Hyperloop Machine Language", "Helicopter Terminal Motor Language"], correct: 0 },
  { question: "Which HTML5 element is used to embed self-contained executable logic?", options: ["<canvas>", "<code>", "<script>", "<embed>"], correct: 2 },
  { question: "What year was JavaScript launched?", options: ["1996", "1995", "1994", "None of the above"], correct: 1 },
  { question: "Which CSS property controls layout mechanics in two dimensions?", options: ["float", "grid", "position", "display"], correct: 1 },
  { question: "Which attribute provides valid semantic alternatives text descriptions for images?", options: ["title", "alt", "desc", "aria-label"], correct: 1 },
  { question: "Which method appends an element onto the terminal position of an array in JS?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
  { question: "Which HTTP status code signifies a Resource Not Found condition?", options: ["200", "301", "404", "500"], correct: 2 },
  { question: "Which semantic element acts as a container for navigation links?", options: ["<nav>", "<section>", "<aside>", "<header>"], correct: 0 }
];

// --- Engine State Management ---
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval = null;
let streak = 0;
let bestScore = Number(localStorage.getItem('proquiz_best') || 0);
let isPracticeMode = false;

// --- DOM Cache Registry ---
const startBox = document.getElementById('start-box');
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');

const startBtn = document.getElementById('start-btn');
const practiceBtn = document.getElementById('practice-btn');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');

const questionTitle = document.getElementById('question-title');
const optionList = document.getElementById('option-list');
const questionCounter = document.getElementById('question-counter');
const timeDisplay = document.getElementById('time-left');
const progressLabel = document.getElementById('progress-label');

const scorePercentage = document.getElementById('score-percentage');
const resultText = document.getElementById('result-text');
const resultSub = document.getElementById('result-sub');
const resultBadge = document.getElementById('result-badge');
const streakCountEl = document.getElementById('streak-count');
const bestScoreEl = document.getElementById('best-score');

const difficultySelect = document.getElementById('difficulty');
const questionCountRange = document.getElementById('question-count');
const questionCountOutput = document.getElementById('question-count-output');

const themeToggle = document.getElementById('theme-toggle');
const scrollProgress = document.getElementById('scroll-progress');
const scrollUp = document.getElementById('scroll-up');
const scrollDown = document.getElementById('scroll-down');

// --- Utilities ---
const shuffle = arr => arr.slice().sort(() => Math.random() - 0.5);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// --- Initialization Lifecycle ---
document.getElementById('total-questions').innerText = questionCountRange.value;
bestScoreEl.innerText = bestScore ? bestScore + '%' : '—';

// --- Theme Selection Routine ---
function applyTheme(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    localStorage.setItem('proquiz_theme', 'light');
    themeToggle.setAttribute('aria-pressed', 'true');
    icon.className = 'fas fa-sun';
  } else {
    document.documentElement.classList.remove('light');
    localStorage.setItem('proquiz_theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'false');
    icon.className = 'fas fa-moon';
  }
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});

applyTheme(localStorage.getItem('proquiz_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

// --- User Scroll Indicator Mechanics ---
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const totalScroll = doc.scrollHeight - doc.clientHeight;
  const scrolled = totalScroll > 0 ? (window.scrollY || doc.scrollTop) / totalScroll : 0;
  
  scrollProgress.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;

  if (window.scrollY > 80) {
    scrollUp.classList.add('show');
    scrollDown.classList.remove('show');
  } else {
    scrollUp.classList.remove('show');
    scrollDown.classList.add('show');
  }
});

window.dispatchEvent(new Event('scroll'));

scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
scrollDown.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

questionCountRange.addEventListener('input', (e) => {
  questionCountOutput.value = e.target.value;
  document.getElementById('total-questions').innerText = e.target.value;
});

// --- Execution Wireframes ---
startBtn.addEventListener('click', () => {
  isPracticeMode = false;
  startQuiz();
});

practiceBtn.addEventListener('click', () => {
  isPracticeMode = true;
  startQuiz();
});

nextBtn.addEventListener('click', goToNext);
skipBtn.addEventListener('click', handleSkip);
restartBtn.addEventListener('click', resetToStart);
shareBtn.addEventListener('click', () => {
  alert(`🎯 Quiz Metric Record: Finished with score performance of ${score}/${quizData.length}! Can you beat this baseline?`);
});

optionList.addEventListener('keydown', (e) => {
  const focusable = Array.from(optionList.querySelectorAll('.option:not(.disabled)'));
  if (!focusable.length) return;
  const idx = focusable.indexOf(document.activeElement);
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusable[(idx + 1) % focusable.length].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusable[(idx - 1 + focusable.length) % focusable.length].focus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (document.activeElement) document.activeElement.click();
  }
});

// --- Core Core Operations Flow ---
function startQuiz() {
  const count = parseInt(questionCountRange.value, 10);
  const difficulty = isPracticeMode ? 'easy' : difficultySelect.value;
  
  quizData = shuffle(quizDataBase).slice(0, clamp(count, 3, quizDataBase.length));
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  
  updateStreakUI();
  
  startBox.classList.add('hide');
  resultBox.classList.add('hide');
  quizBox.classList.remove('hide');

  timeLeft = difficulty === 'hard' ? 10 : difficulty === 'easy' ? 20 : 15;
  document.getElementById('time-per-q').innerText = timeLeft + 's';

  showQuestion();
}

function showQuestion() {
  resetState();
  const q = quizData[currentQuestionIndex];
  questionTitle.innerText = q.question;
  questionCounter.innerText = `Question ${currentQuestionIndex + 1} / ${quizData.length}`;

  optionList.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const el = document.createElement('button');
    el.className = 'option';
    el.setAttribute('tabindex', '0');
    el.innerHTML = `<span class="label">${opt}</span><span class="meta"><i class="fas fa-chevron-right"></i></span>`;
    el.addEventListener('click', () => selectAnswer(el, idx));
    el.style.animation = `pop .28s cubic-bezier(.2,.9,.2,1) ${idx * 40}ms both`;
    optionList.appendChild(el);
  });

  if (!isPracticeMode) {
    startTimer();
  } else {
    document.querySelector('.timer').classList.add('hide');
  }
  
  updateProgressRing();
}

function resetState() {
  clearInterval(timerInterval);
  nextBtn.classList.add('hide');
  nextBtn.setAttribute('aria-hidden', 'true');
  skipBtn.classList.remove('hide');
  timeDisplay.parentElement.style.transform = 'scale(1)';
  document.querySelector('.timer').classList.remove('hide');
}

function startTimer() {
  let t = timeLeft;
  timeDisplay.innerText = t;
  timerInterval = setInterval(() => {
    t--;
    timeDisplay.innerText = t;
    if (t <= 5) {
      timeDisplay.parentElement.style.transform = 'scale(1.08)';
    }
    if (t <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function selectAnswer(buttonEl, index) {
  clearInterval(timerInterval);
  const correctIndex = quizData[currentQuestionIndex].correct;
  skipBtn.classList.add('hide');

  Array.from(optionList.children).forEach((c, i) => {
    c.classList.add('disabled');
    if (i === correctIndex) {
      c.classList.add('correct');
      appendIcon(c, 'check');
    }
  });

  if (index === correctIndex) {
    buttonEl.classList.add('correct');
    score++;
    streak++;
  } else {
    buttonEl.classList.add('incorrect');
    appendIcon(buttonEl, 'times');
    streak = 0;
  }

  updateStreakUI();
  nextBtn.classList.remove('hide');
  nextBtn.setAttribute('aria-hidden', 'false');
  nextBtn.focus();
}

function handleTimeout() {
  const correctIndex = quizData[currentQuestionIndex].correct;
  skipBtn.classList.add('hide');
  
  Array.from(optionList.children).forEach((c, i) => {
    c.classList.add('disabled');
    if (i === correctIndex) {
      c.classList.add('correct');
      appendIcon(c, 'check');
    }
  });
  
  streak = 0;
  updateStreakUI();
  nextBtn.classList.remove('hide');
  nextBtn.setAttribute('aria-hidden', 'false');
}

function appendIcon(el, type) {
  const meta = el.querySelector('.meta');
  if (meta) {
    meta.innerHTML = type === 'check' 
      ? '<i class="fas fa-check-circle" style="color:#10b981;"></i>' 
      : '<i class="fas fa-times-circle" style="color:#ef4444;"></i>';
  }
}

function goToNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function handleSkip() {
  streak = 0;
  updateStreakUI();
  goToNext();
}

function showResults() {
  clearInterval(timerInterval);
  quizBox.classList.add('hide');
  resultBox.classList.remove('hide');

  const percentage = Math.round((score / quizData.length) * 100);
  scorePercentage.innerText = `${percentage}%`;
  resultText.innerText = `You scored ${score} out of ${quizData.length}`;
  
  if (percentage >= 80) {
    resultBadge.innerText = "Elite Expert";
    resultSub.innerText = "Excellent performance metrics tracking out optimally!";
    launchConfetti(45);
  } else if (percentage >= 50) {
    resultBadge.innerText = "Solid Run";
    resultSub.innerText = "Sufficient base framework evaluation. Continuous attempts suggested.";
    launchConfetti(20);
  } else {
    resultBadge.innerText = "Apprentice";
    resultSub.innerText = "Review targeted subject terminology to bolster baseline capabilities.";
  }

  if (percentage > bestScore) {
    bestScore = percentage;
    localStorage.setItem('proquiz_best', bestScore);
    bestScoreEl.innerText = bestScore + '%';
  }
}

function resetToStart() {
  resultBox.classList.add('hide');
  startBox.classList.remove('hide');
}

function updateProgressRing() {
  const progress = Math.round((currentQuestionIndex / quizData.length) * 100);
  const meter = document.querySelector('.circular-progress .meter');
  if (meter) {
    meter.style.strokeDashoffset = 100 - progress;
  }
  progressLabel.innerText = `${progress}%`;
}

function updateStreakUI() {
  streakCountEl.innerText = streak;
  const streakEl = document.getElementById('streak');
  if (streak >= 3) {
    streakEl.style.transform = 'scale(1.1)';
    streakEl.style.background = 'rgba(249, 115, 22, 0.2)';
    streakEl.style.color = '#ff9f43';
  } else {
    streakEl.style.transform = 'scale(1)';
    streakEl.style.background = 'rgba(255,214,165,0.1)';
    streakEl.style.color = '#ffd6a5';
  }
}

function launchConfetti(amount = 20) {
  const colors = ['#7c3aed', '#06b6d4', '#f97316', '#10b981', '#ef4444'];
  for (let i = 0; i < amount; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.animationDelay = `${Math.random() * 300}ms`;
    el.style.animationDuration = `${1000 + Math.random() * 1000}ms`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}