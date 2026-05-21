const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoal');
const goalList = document.getElementById('goalList');

const progressBar = document.getElementById('progress');
const scoreText = document.getElementById('scoreText');
const streakCount = document.getElementById('streakCount');

const themeToggle = document.getElementById('themeToggle');

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');

let goals = JSON.parse(localStorage.getItem('focusflow-goals')) || [];

let streak = Number(localStorage.getItem('focusflow-streak')) || 0;

let darkMode = localStorage.getItem('focusflow-theme') === 'dark';

let timer;
let totalSeconds = 1500;
let timerRunning = false;

// ---------------- THEME ----------------

function applyTheme() {

  if (darkMode) {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }

}

themeToggle.addEventListener('click', () => {

  darkMode = !darkMode;

  localStorage.setItem(
    'focusflow-theme',
    darkMode ? 'dark' : 'light'
  );

  applyTheme();

});

// ---------------- GOALS ----------------

function saveGoals() {

  localStorage.setItem(
    'focusflow-goals',
    JSON.stringify(goals)
  );

}

function renderGoals() {

  goalList.innerHTML = '';

  goals.forEach(goal => {

    const li = document.createElement('li');

    li.className =
      goal.completed
        ? 'goal-item completed'
        : 'goal-item';

    li.innerHTML = `
      <span>${goal.text}</span>

      <div class="goal-actions">

        <button class="complete-btn">
          ✓
        </button>

        <button class="delete-btn">
          🗑
        </button>

      </div>
    `;

    const completeBtn =
      li.querySelector('.complete-btn');

    const deleteBtn =
      li.querySelector('.delete-btn');

    completeBtn.addEventListener('click', () => {

      goal.completed = !goal.completed;

      calculateProgress();

      saveGoals();

      renderGoals();

    });

    deleteBtn.addEventListener('click', () => {

      goals = goals.filter(g => g.id !== goal.id);

      calculateProgress();

      saveGoals();

      renderGoals();

    });

    goalList.appendChild(li);

  });

}

addGoalBtn.addEventListener('click', () => {

  const text = goalInput.value.trim();

  if (!text) return;

  goals.push({
    id: Date.now(),
    text,
    completed: false
  });

  goalInput.value = '';

  calculateProgress();

  saveGoals();

  renderGoals();

});

// ENTER KEY SUPPORT

goalInput.addEventListener('keypress', (e) => {

  if (e.key === 'Enter') {
    addGoalBtn.click();
  }

});

// ---------------- PROGRESS ----------------

function calculateProgress() {

  if (goals.length === 0) {

    progressBar.style.width = '0%';

    scoreText.textContent =
      '0% completed';

    streakCount.textContent =
      `${streak} Days`;

    return;

  }

  const completedGoals =
    goals.filter(g => g.completed).length;

  const percentage =
    Math.round(
      (completedGoals / goals.length) * 100
    );

  progressBar.style.width =
    `${percentage}%`;

  scoreText.textContent =
    `${percentage}% completed`;

  // streak system

  if (percentage === 100) {
    streak = 1;
  } else if (percentage >= 50) {
    streak += 1;
  }

  localStorage.setItem(
    'focusflow-streak',
    streak
  );

  streakCount.textContent =
    `${streak} Days`;

}

// ---------------- TIMER ----------------

function updateTimerDisplay() {

  const minutes =
    Math.floor(totalSeconds / 60);

  const seconds =
    totalSeconds % 60;

  minutesEl.textContent =
    String(minutes).padStart(2, '0');

  secondsEl.textContent =
    String(seconds).padStart(2, '0');

}

startTimerBtn.addEventListener('click', () => {

  if (timerRunning) return;

  timerRunning = true;

  timer = setInterval(() => {

    totalSeconds--;

    updateTimerDisplay();

    if (totalSeconds <= 0) {

      clearInterval(timer);

      timerRunning = false;

      alert('Pomodoro session complete! 🎉');

    }

  }, 1000);

});

resetTimerBtn.addEventListener('click', () => {

  clearInterval(timer);

  timerRunning = false;

  totalSeconds = 1500;

  updateTimerDisplay();

});

// ---------------- INIT ----------------

applyTheme();

renderGoals();

calculateProgress();

updateTimerDisplay();