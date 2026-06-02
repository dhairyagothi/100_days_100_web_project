const habitInput = document.getElementById("habitInput");
const habitTags = document.getElementById("habitTags");
const habitNotes = document.getElementById("habitNotes");
const habitGoal = document.getElementById("habitGoal");
const habitReminder = document.getElementById("habitReminder");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const scheduledToday = document.getElementById("scheduledToday");
const weeklyRate = document.getElementById("weeklyRate");
const progressList = document.getElementById("progressList");
const themeToggle = document.getElementById("theme-toggle");

const deleteModal = document.getElementById("delete-modal");
const deleteMessage = document.getElementById("delete-message");
const deleteConfirmBtn = document.getElementById("delete-confirm-btn");
const deleteCancelBtn = document.getElementById("delete-cancel-btn");
const deleteCloseBtn = document.getElementById("delete-close-btn");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let pendingDeleteIndex = null;

  hnew.completed = hnew.history.includes(todayStr);
  return hnew;
});

function getTodayString() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
  return adjusted.toISOString().split("T")[0];
}

function getYesterdayString() {
  const d = new Date(Date.now() - 86400000);
  const offset = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
  return adjusted.toISOString().split("T")[0];
}

function getDateMs(dateString) {
  return new Date(`${dateString}T00:00:00`).getTime();
}

function getLast7Dates() {
  const dates = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86400000);
    const offset = d.getTimezoneOffset();
    const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
    dates.push(adjusted.toISOString().split("T")[0]);
  }
  return dates;
}

/* DATA HELPERS */

function parseTags(value) {
  if (!value) return [];
  return value
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}

function getSelectedSchedule() {
  const selected = Array.from(document.querySelectorAll(".schedule-day:checked"))
    .map(input => Number(input.value));
  return selected.length ? selected : [0, 1, 2, 3, 4, 5, 6];
}

function isScheduledForDay(habit, dayIndex) {
  if (!habit.schedule || habit.schedule.length === 0) return true;
  return habit.schedule.includes(dayIndex);
}

function getLatestCompletionDate(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return "";
  return habit.completionDates
    .slice()
    .sort()
    .pop();
}

function normalizeCompletionDates(habit) {
  const uniqueDates = Array.from(new Set(habit.completionDates || []));
  habit.completionDates = uniqueDates.sort();
}

function calculateCurrentStreak(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return 0;
  const set = new Set(habit.completionDates);
  let streak = 0;
  const today = getTodayString();
  for (let i = 0; i < 365; i += 1) {
    const date = new Date(getDateMs(today) - i * 86400000);
    const dateStr = date.toISOString().split("T")[0];
    if (set.has(dateStr)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function calculateMaxStreak(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return 0;
  const dates = habit.completionDates.slice().sort();
  let max = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const prev = getDateMs(dates[i - 1]);
    const curr = getDateMs(dates[i]);
    if (curr - prev === 86400000) {
      current += 1;
    } else {
      current = 1;
    }
    if (current > max) max = current;
  }
  return max;
}

/* STREAK HELPERS */
function getHabitStreak(history) {
  if (!history || history.length === 0) return 0;

/* MIGRATION */

habits.forEach(habit => {
  if (habit.tags === undefined) habit.tags = [];
  if (habit.notes === undefined) habit.notes = "";
  if (habit.goalText === undefined) habit.goalText = "";
  if (habit.reminderTime === undefined) habit.reminderTime = "";
  if (habit.schedule === undefined) habit.schedule = [0, 1, 2, 3, 4, 5, 6];
  if (habit.completionDates === undefined) habit.completionDates = [];
  if (habit.streak === undefined) habit.streak = 0;
  if (habit.maxStreak === undefined) habit.maxStreak = habit.completed ? 1 : 0;
  if (habit.lastCompleted === undefined) habit.lastCompleted = "";
  if (habit.createdAt === undefined) habit.createdAt = getTodayString();

  if (habit.lastCompleted && !habit.completionDates.includes(habit.lastCompleted)) {
    habit.completionDates.push(habit.lastCompleted);
  }

  normalizeCompletionDates(habit);
  habit.lastCompleted = getLatestCompletionDate(habit);
});
saveHabits();

/* DAILY RESET / RESET BROKEN STREAKS */

  if (sorted.includes(currentStr)) {
    streak++;
    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
  } else {
    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    let yesterdayStr = currentCheckDate.toISOString().split("T")[0];

  habits.forEach(habit => {
    habit.completed = habit.completionDates.includes(todayStr);

    if (!habit.completed && habit.lastCompleted !== yesterdayStr) {
      habit.streak = 0;
    }
  }

  return streak;
}

function generateHistoryDots(history) {
  let html = '<div class="history-tracker">';
  const today = new Date();

  for (let i = 4; i >= 0; i--) {
    let d = new Date(today);
    d.setDate(d.getDate() - i);
    let dStr = d.toISOString().split("T")[0];
    let isDone = history.includes(dStr);
    html += `<span class="history-dot ${isDone ? "done" : ""}" title="${dStr}"></span>`;
  }

  habits.forEach(habit => {
    if (habit.maxStreak && habit.maxStreak > maxStreakAcrossAll) {
      maxStreakAcrossAll = habit.maxStreak;
    }
  });

/* NEW: CALENDAR VIEW */
function renderCalendar() {
  if (!calendarGrid || !calendarMonth) return;

  calendarGrid.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  calendarMonth.textContent = currentCalendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Real dates
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);

    // FIXED DATE FORMAT
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    const dateStr = localDate.toISOString().split("T")[0];

    const completedCount = habits.filter(h =>
      h.history.includes(dateStr)
    ).length;

    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    if (completedCount > 0) {
      dayCell.classList.add("completed-day");
    }

    // TODAY HIGHLIGHT
    if (dateStr === getTodayStr()) {
      dayCell.classList.add("today");
    }

    dayCell.innerHTML = `
      <div class="calendar-date">${day}</div>
      ${
        completedCount > 0
          ? `<div class="calendar-count">${completedCount}</div>`
          : ""
      }
    `;

    dayCell.title = `${completedCount} habits completed on ${dateStr}`;

    calendarGrid.appendChild(dayCell);
  }
}

/* DELETE MODAL */

function openDeleteModal(index) {
  const habit = habits[index];
  pendingDeleteIndex = index;
  deleteMessage.textContent = `Delete "${habit.name}"? This action cannot be undone.`;
  deleteModal.classList.add("show");
}

function closeDeleteModal() {
  pendingDeleteIndex = null;
  deleteModal.classList.remove("show");
}

/* TOGGLE COMPLETE LOGIC */

function toggleComplete(index) {
  const habit = habits[index];
  const todayStr = getTodayString();

  if (!habit.completed) {
    habit.completed = true;
    habit.completionDates.push(todayStr);
  } else {
    habit.completed = false;
    habit.completionDates = habit.completionDates.filter(date => date !== todayStr);
  }

  normalizeCompletionDates(habit);
  habit.lastCompleted = getLatestCompletionDate(habit);
  habit.streak = calculateCurrentStreak(habit);
  habit.maxStreak = Math.max(habit.maxStreak || 0, calculateMaxStreak(habit));

  if (habit.streak > 0) {
    checkMilestoneUnlocked(habit.name, habit.streak);
  }
}

/* PROGRESS */

function getWeeklyProgress(habit) {
  const weekDates = getLast7Dates();
  let scheduledCount = 0;
  let completedCount = 0;

  weekDates.forEach(dateStr => {
    const dayIndex = new Date(`${dateStr}T00:00:00`).getDay();
    if (isScheduledForDay(habit, dayIndex)) {
      scheduledCount += 1;
    }
    if (habit.completionDates.includes(dateStr)) {
      completedCount += 1;
    }
  });

  const percent = scheduledCount === 0
    ? 0
    : Math.round((completedCount / scheduledCount) * 100);

  return { scheduledCount, completedCount, percent };
}

  filteredHabits.forEach(habitItem => {
    const index = habitItem.originalIndex;
    const habit = habits[index];
    const streak = getHabitStreak(habit.history);

    const li = document.createElement("li");
    li.className = `habit-card fade-in ${index === selectedHabitIndex ? "active-card" : ""}`;

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit-item";

    const streakHtml = habit.streak && habit.streak > 0
      ? `<span class="streak-badge">🔥 ${habit.streak} day${habit.streak > 1 ? "s" : ""}</span>`
      : "";

    const tagsHtml = habit.tags
      .map(tag => `<span class="tag">${tag}</span>`)
      .join("");

    const scheduleLabel = habit.schedule
      .map(day => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day])
      .join(" ");

    const weekly = getWeeklyProgress(habit);

    li.innerHTML = `
      <div class="habit-main">
        <div class="habit-details">
          <span class="habit-title ${habit.completed ? "completed" : ""}">
            ${habit.name}
          </span>
          <div class="habit-meta">
            ${tagsHtml}
            <span>Schedule: ${scheduleLabel || "Daily"}</span>
            ${habit.goalText ? `<span>Goal: ${habit.goalText}</span>` : ""}
            ${habit.reminderTime ? `<span>Reminder: ${habit.reminderTime}</span>` : ""}
            <span>Weekly: ${weekly.completedCount}/${weekly.scheduledCount}</span>
          </div>
          ${habit.notes ? `<p class="habit-note">${habit.notes}</p>` : ""}
          ${streakHtml}
        </div>
        <div class="actions">
          <button class="complete-btn">${habit.completed ? "Undo" : "Done"}</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
      <div class="progress-bar">
        <span style="width: ${weekly.percent}%"></span>
      </div>
    `;

    li.addEventListener("click", e => {
      if (e.target.closest(".checkbox-btn") || e.target.closest(".habit-actions")) return;
      selectHabit(index);
    });

    const checkboxBtn = li.querySelector(".checkbox-btn");
    checkboxBtn.addEventListener("click", e => {
      e.stopPropagation();
      habit.completed = !habit.completed;

    completeBtn.addEventListener("click", () => {
      toggleComplete(index);
      saveHabits();
      renderAll();
    });

    deleteBtn.addEventListener("click", () => {
      openDeleteModal(index);
    });

    habitList.appendChild(li);
  });
}

function renderProgressCharts() {
  progressList.innerHTML = "";

  habits.forEach(habit => {
    const weekly = getWeeklyProgress(habit);
    const card = document.createElement("div");
    card.className = "progress-card";
    card.innerHTML = `
      <div class="habit-title">${habit.name}</div>
      <div class="habit-meta">Weekly completion: ${weekly.percent}%</div>
      <div class="progress-bar"><span style="width: ${weekly.percent}%"></span></div>
    `;
    progressList.appendChild(card);
  });
}

function updateStats() {
  const todayStr = getTodayString();
  const todayDay = new Date(`${todayStr}T00:00:00`).getDay();

  let completedCount = 0;
  let scheduledCount = 0;
  let totalScheduledWeek = 0;
  let totalCompletedWeek = 0;

  habits.forEach(habit => {
    if (habit.completed) completedCount += 1;
    if (isScheduledForDay(habit, todayDay)) scheduledCount += 1;

    const weekly = getWeeklyProgress(habit);
    totalScheduledWeek += weekly.scheduledCount;
    totalCompletedWeek += weekly.completedCount;
  });

  const overallWeeklyRate = totalScheduledWeek === 0
    ? 0
    : Math.round((totalCompletedWeek / totalScheduledWeek) * 100);

  totalHabits.textContent = habits.length;
  completedHabits.textContent = completedCount;
  scheduledToday.textContent = scheduledCount;
  weeklyRate.textContent = `${overallWeeklyRate}%`;
}

function renderAll() {
  renderHabits();
  renderProgressCharts();
  updateStats();
  checkMilestones();
}

/* ADD HABIT */
function openAddModal() {
  addModal.classList.remove("hidden");
}

fabAdd?.addEventListener("click", openAddModal);

document.getElementById("cancelAddBtn")?.addEventListener("click", () => {
  addModal.classList.add("hidden");
  addHabitInput.value = "";
});

// Enter key support in add modal
addHabitInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("confirmAddBtn")?.click();
});

document.getElementById("confirmAddBtn")?.addEventListener("click", () => {
  const name = addHabitInput.value.trim();

  if (!name) {
    alert("Please enter a habit name");
    return;
  }

  const newHabit = {
    name: habitName,
    tags: parseTags(habitTags.value),
    notes: habitNotes.value.trim(),
    goalText: habitGoal.value.trim(),
    reminderTime: habitReminder.value,
    schedule: getSelectedSchedule(),
    completionDates: [],
    completed: false,
    streak: 0,
    maxStreak: 0,
    lastCompleted: "",
    createdAt: getTodayString()
  };

  habits.push(newHabit);

  // ── FIX: Request notification permission when user sets a reminder ──
  if (newHabit.reminderTime && Notification.permission === "default") {
    Notification.requestPermission();
  }
  // ──────────────────────────────────────────────────────────────────

  saveHabits();
  renderAll();

  habitInput.value = "";
  habitTags.value = "";
  habitNotes.value = "";
  habitGoal.value = "";
  habitReminder.value = "";
  document.querySelectorAll(".schedule-day").forEach(input => {
    input.checked = true;
  });
});

/* EDIT */
function openEditDrawer(index) {
  editingIndex = index;
  const habit = habits[index];

  editHabitInput.value        = habit.name;
  editHabitCategory.value     = habit.category;
  editHabitTimeLabel.value    = habit.timeLabel;
  editHabitPriority.checked   = habit.priority;

  editDrawer.classList.remove("hidden");
  editDrawerOverlay.classList.remove("hidden");

  setTimeout(() => editDrawer.classList.add("open"), 10);
}

function closeEditDrawer() {
  editingIndex = null;
  editDrawer.classList.remove("open");

  setTimeout(() => {
    editDrawer.classList.add("hidden");
    editDrawerOverlay.classList.add("hidden");
  }, 300);
}

document.getElementById("closeDrawerBtn")?.addEventListener("click", closeEditDrawer);
editDrawerOverlay?.addEventListener("click", closeEditDrawer);

document.getElementById("saveEditBtn")?.addEventListener("click", () => {
  if (editingIndex === null) return;

  const newName = editHabitInput.value.trim();
  if (!newName) {
    alert("Habit name cannot be empty");
    return;
  }

  habits[editingIndex].name      = newName;
  habits[editingIndex].category  = editHabitCategory.value;
  habits[editingIndex].timeLabel = editHabitTimeLabel.value;
  habits[editingIndex].priority  = editHabitPriority.checked;

  saveData();
  renderDashboard();
  closeEditDrawer();
});

/* DELETE */
const drawerFooter = document.querySelector(".drawer-footer");
const deleteBtn = document.createElement("button");

deleteBtn.className = "btn-danger";
deleteBtn.textContent = "Delete";

deleteBtn.addEventListener("click", () => {
  habitToDeleteIndex = editingIndex;
  deleteModal.classList.remove("hidden");
});

drawerFooter?.insertBefore(deleteBtn, document.getElementById("saveEditBtn"));

document.getElementById("cancelDeleteBtn")?.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  habitToDeleteIndex = null;
});

document.getElementById("confirmDeleteBtn")?.addEventListener("click", () => {
  if (habitToDeleteIndex === null) return;

  habits.splice(habitToDeleteIndex, 1);

  if (selectedHabitIndex === habitToDeleteIndex) showOverview();

  saveData();
  renderDashboard();
  closeEditDrawer();
  deleteModal.classList.add("hidden");
});

/* THEME */
function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  document.getElementById("theme-text").textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", theme);
}

/* DELETE MODAL EVENT LISTENERS */

if (deleteCloseBtn) {
  deleteCloseBtn.addEventListener("click", closeDeleteModal);
}

if (deleteCancelBtn) {
  deleteCancelBtn.addEventListener("click", closeDeleteModal);
}

if (deleteConfirmBtn) {
  deleteConfirmBtn.addEventListener("click", () => {
    if (pendingDeleteIndex !== null) {
      habits.splice(pendingDeleteIndex, 1);
      saveHabits();
      renderAll();
    }
    closeDeleteModal();
  });
}

if (deleteModal) {
  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
}

/* =========================================================
   REMINDERS — FIX: check every 60s, fire Notification API
   Added to resolve: reminder time saved but never fired
========================================================= */

function checkReminders() {
  const currentTime = new Date().toTimeString().slice(0, 5); // "HH:MM"

  habits.forEach(habit => {
    if (!habit.reminderTime || habit.reminderTime !== currentTime) return;

    if (Notification.permission === "granted") {
      new Notification("Habit Tracker", {
        body: `Time for your habit: "${habit.name}"`,
        icon: "/favicon.ico"
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Habit Tracker", {
            body: `Time for your habit: "${habit.name}"`,
            icon: "/favicon.ico"
          });
        }
      });
    }
  });
}

/* INITIAL RENDER & DAILY CHECK */

updateHabitsDailyStatus();
renderAll();

// Start reminder polling after initial render
checkReminders();
setInterval(checkReminders, 60000);