// ===== NAV =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    showPage(page);
  });
});

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  if (name === 'leaderboard') renderLeaderboard();
}

function closePage(name) {
  document.getElementById('page-' + name).classList.remove('active');
  document.getElementById('page-learn').classList.add('active');
  navItems.forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="learn"]').classList.add('active');
}

// ===== QUIZ DATA =====
const questions = [
  {
    q: "El gato bebe leche 🐱",
    options: ["The cat drinks milk", "The dog eats food", "The bird flies high", "The cat sleeps"],
    answer: 0
  },
  {
    q: "Buenos días ☀️",
    options: ["Good night", "Good afternoon", "Good morning", "Goodbye"],
    answer: 2
  },
  {
    q: "Yo tengo un perro 🐶",
    options: ["I have a cat", "I have a dog", "She has a bird", "We have a fish"],
    answer: 1
  },
  {
    q: "La manzana es roja 🍎",
    options: ["The banana is yellow", "The apple is green", "The apple is red", "The orange is sweet"],
    answer: 2
  },
  {
    q: "¿Cómo te llamas? 👋",
    options: ["How are you?", "Where are you from?", "What is your name?", "How old are you?"],
    answer: 2
  }
];

let currentQ = 0;
let selectedOption = null;
let answered = false;
let xp = 120;
let hearts = 5;
let correctCount = 0;

function startLesson(lessonNum) {
  currentQ = 0;
  selectedOption = null;
  answered = false;
  correctCount = 0;
  loadQuestion();
  showPage('quiz');
  navItems.forEach(n => n.classList.remove('active'));
}

function loadQuestion() {
  const q = questions[currentQ];
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('quizProgress').style.width = (currentQ / questions.length * 100) + '%';
  document.getElementById('quizHearts').textContent = hearts;

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  answered = false;
  selectedOption = null;
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('answerFeedback').textContent = '';
  document.getElementById('answerFeedback').className = 'answer-feedback';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectOption(i, btn);
    grid.appendChild(btn);
  });
}

function selectOption(index, btn) {
  if (answered) return;
  selectedOption = index;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
  if (selectedOption === null || answered) return;
  answered = true;
  const q = questions[currentQ];
  const btns = document.querySelectorAll('.option-btn');
  const feedback = document.getElementById('answerFeedback');
  const checkBtn = document.getElementById('checkBtn');

  btns.forEach(b => b.disabled = true);

  if (selectedOption === q.answer) {
    btns[selectedOption].classList.add('correct');
    feedback.textContent = '✅ Correct! Excellent!';
    feedback.className = 'answer-feedback correct';
    correctCount++;
    gainXP(10);
    checkBtn.textContent = 'CONTINUE';
    checkBtn.disabled = false;
    checkBtn.onclick = nextQuestion;
  } else {
    btns[selectedOption].classList.add('wrong');
    btns[q.answer].classList.add('correct');
    feedback.textContent = '❌ Oops! The correct answer is: ' + q.options[q.answer];
    feedback.className = 'answer-feedback wrong';
    loseHeart();
    checkBtn.textContent = 'GOT IT';
    checkBtn.disabled = false;
    checkBtn.onclick = nextQuestion;
  }
}

function nextQuestion() {
  currentQ++;
  const checkBtn = document.getElementById('checkBtn');
  checkBtn.textContent = 'CHECK';
  checkBtn.onclick = checkAnswer;

  if (currentQ >= questions.length) {
    finishLesson();
  } else {
    loadQuestion();
  }
}

function finishLesson() {
  document.getElementById('page-quiz').classList.remove('active');
  const allCorrect = correctCount === questions.length;
  showModal(
    allCorrect ? '🏆' : '🎉',
    allCorrect ? 'Perfect Score!' : 'Lesson Complete!',
    `You got ${correctCount}/${questions.length} correct and earned <strong>+${correctCount * 10} XP</strong>!`
  );
}

function gainXP(amount) {
  xp += amount;
  document.getElementById('xpDisplay').textContent = xp;
  document.getElementById('profileXP').textContent = xp;
  const pct = Math.min(((xp % 300) / 300) * 100, 100);
  document.getElementById('xpFill').style.width = pct + '%';
}

function loseHeart() {
  hearts = Math.max(0, hearts - 1);
  document.getElementById('heartsDisplay').textContent = hearts;
  document.getElementById('quizHearts').textContent = hearts;
}

// ===== MODAL =====
function showModal(icon, title, msg) {
  document.getElementById('modalIcon').textContent = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').innerHTML = msg;
  document.getElementById('resultModal').classList.add('show');
}

function closeModal() {
  document.getElementById('resultModal').classList.remove('show');
  showPage('learn');
  navItems.forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="learn"]').classList.add('active');
}

// ===== LEADERBOARD =====
const players = [
  { name: '🦜 You', xp: 120, me: true },
  { name: '🐉 DragonLearner', xp: 980 },
  { name: '🌟 StarStudent', xp: 870 },
  { name: '🔥 FireFox99', xp: 740 },
  { name: '🎯 AimHigh', xp: 620 },
  { name: '🌈 RainbowPanda', xp: 510 },
  { name: '🚀 SpaceKid', xp: 390 },
  { name: '🌺 FloralWave', xp: 280 },
  { name: '🐬 OceanDiver', xp: 180 },
  { name: '🍀 LuckyClover', xp: 95 },
];

function renderLeaderboard() {
  // insert user with current xp
  players[0].xp = xp;
  const sorted = [...players].sort((a, b) => b.xp - a.xp);
  const list = document.getElementById('leaderboardList');
  list.innerHTML = '';

  sorted.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'lb-item' + (p.me ? ' me' : '');
    const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
    div.innerHTML = `
      <div class="lb-rank ${rankClass}">${rankEmoji}</div>
      <div class="lb-avatar">${p.name.split(' ')[0]}</div>
      <div class="lb-name">${p.name.split(' ').slice(1).join(' ')}${p.me ? ' (You)' : ''}</div>
      <div class="lb-xp">⚡ ${p.xp} XP</div>
    `;
    list.appendChild(div);
  });
}