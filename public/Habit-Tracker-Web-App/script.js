const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const themeToggle = document.getElementById("theme-toggle");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Migrate legacy habits data schema
habits.forEach(habit => {
  if (habit.streak === undefined) habit.streak = 0;
  if (habit.maxStreak === undefined) habit.maxStreak = habit.completed ? 1 : 0;
  if (habit.lastCompleted === undefined) {
    habit.lastCompleted = habit.completed ? getTodayString() : "";
  }
});
saveHabits();

/* DATE HELPERS */

function getTodayString() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
  return adjusted.toISOString().split('T')[0];
}

function getYesterdayString() {
  const d = new Date(Date.now() - 86400000);
  const offset = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
  return adjusted.toISOString().split('T')[0];
}

/* SAVE HABITS */

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

/* DAILY RESET / RESET BROKEN STREAKS */

function updateHabitsDailyStatus() {
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  habits.forEach(habit => {
    if (habit.lastCompleted === todayStr) {
      habit.completed = true;
    } else {
      habit.completed = false;
      // If the habit was not completed today, and was not completed yesterday, the streak is broken
      if (habit.lastCompleted !== yesterdayStr) {
        habit.streak = 0;
      }
    }
  });
  saveHabits();
}

/* CHECK AND UPDATE ACHIEVEMENTS VISUALLY */

function checkMilestones() {
  let maxStreakAcrossAll = 0;
  habits.forEach(habit => {
    if (habit.streak && habit.streak > maxStreakAcrossAll) {
      maxStreakAcrossAll = habit.streak;
    }
  });

  const milestones = [
    { id: "badge-3", streak: 3 },
    { id: "badge-7", streak: 7 },
    { id: "badge-30", streak: 30 }
  ];

  milestones.forEach(m => {
    const el = document.getElementById(m.id);
    if (el) {
      if (maxStreakAcrossAll >= m.streak) {
        el.classList.remove("locked");
        el.classList.add("unlocked");
      } else {
        el.classList.remove("unlocked");
        el.classList.add("locked");
      }
    }
  });
}

/* MILESTONE CELEBRATION MODAL */

function checkMilestoneUnlocked(habitName, newStreak) {
  if (newStreak === 3 || newStreak === 7 || newStreak === 30) {
    showMilestoneModal(habitName, newStreak);
  }
}

function showMilestoneModal(habitName, streak) {
  const modal = document.getElementById("milestone-modal");
  const msg = document.getElementById("milestone-message");
  const icon = modal.querySelector(".modal-badge-icon");

  let medal = "🥉";
  if (streak === 7) medal = "🥈";
  if (streak === 30) medal = "🥇";

  icon.textContent = medal;
  msg.textContent = `You achieved a ${streak}-Day streak on "${habitName}"! Keep it up! 🎉`;
  modal.classList.add("show");
}

function hideMilestoneModal() {
  const modal = document.getElementById("milestone-modal");
  if (modal) {
    modal.classList.remove("show");
  }
}

/* TOGGLE COMPLETE LOGIC */

function toggleComplete(index) {
  const habit = habits[index];
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  if (!habit.completed) {
    habit.completed = true;

    if (habit.lastCompleted === yesterdayStr) {
      habit.streak = (habit.streak || 0) + 1;
    } else if (habit.lastCompleted === todayStr) {
      // Already completed today
    } else {
      habit.streak = 1;
    }

    if (habit.streak > (habit.maxStreak || 0)) {
      habit.maxStreak = habit.streak;
      checkMilestoneUnlocked(habit.name, habit.streak);
    }

    habit.lastCompleted = todayStr;
  } else {
    habit.completed = false;

    if (habit.lastCompleted === todayStr) {
      if (habit.streak > 0) {
        habit.streak -= 1;
      }
      habit.lastCompleted = yesterdayStr;
    }
  }
}

/* RENDER HABITS */

function renderHabits() {
  habitList.innerHTML = "";

  let completedCount = 0;

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit-item";

    if (habit.completed) {
      completedCount++;
    }

    const streakHtml = habit.streak && habit.streak > 0 
      ? `<span class="streak-badge">🔥 ${habit.streak} day${habit.streak > 1 ? 's' : ''}</span>` 
      : "";

    li.innerHTML = `
      <div class="habit-details">
        <span class="${habit.completed ? "completed" : ""}">
          ${habit.name}
        </span>
        ${streakHtml}
      </div>

      <div class="actions">
        <button class="complete-btn">
          ${habit.completed ? "Undo" : "Done"}
        </button>

        <button class="delete-btn">
          Delete
        </button>
      </div>
    `;

    const completeBtn = li.querySelector(".complete-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    completeBtn.addEventListener("click", () => {
      toggleComplete(index);
      saveHabits();
      renderHabits();
      checkMilestones();
    });

    deleteBtn.addEventListener("click", () => {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
      checkMilestones();
    });

    habitList.appendChild(li);
  });

  totalHabits.textContent = habits.length;
  completedHabits.textContent = completedCount;
}

/* ADD HABIT */

addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();

  if (habitName === "") {
    alert("Please enter a habit");
    return;
  }

  habits.push({
    name: habitName,
    completed: false,
    streak: 0,
    maxStreak: 0,
    lastCompleted: ""
  });

  saveHabits();
  renderHabits();
  checkMilestones();

  habitInput.value = "";
});

/* THEME HANDLING */

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙 Dark Mode";
  }

  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  setTheme(isDark ? "light" : "dark");
});

/* MILESTONE MODAL EVENT LISTENERS */

const closeModalBtn = document.getElementById("close-modal-btn");
const milestoneBtn = document.getElementById("milestone-btn");

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", hideMilestoneModal);
}
if (milestoneBtn) {
  milestoneBtn.addEventListener("click", hideMilestoneModal);
}

/* INITIAL RENDER & DAILY CHECK */

updateHabitsDailyStatus();
renderHabits();
checkMilestones();