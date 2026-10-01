// ---------- State ----------
let habits = JSON.parse(localStorage.getItem("habits")) || [];

const quotes = [
  "Small habits create big results.",
  "Progress beats perfection.",
  "Stay consistent.",
  "You become what you repeat.",
  "Success is built daily."
];

// ---------- Elements ----------
const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const habitModal = document.getElementById("habitModal");
const addHabitBtn = document.getElementById("addHabitBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveHabitBtn = document.getElementById("saveHabitBtn");
const habitNameInput = document.getElementById("habitName");
const habitCategoryInput = document.getElementById("habitCategory");
const habitColorInput = document.getElementById("habitColor");
const habitNotesInput = document.getElementById("habitNotes");
const formError = document.getElementById("formError");
const searchInput = document.getElementById("searchHabit");
const themeBtn = document.getElementById("themeBtn");

document.getElementById("quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

// ---------- Daily reset ----------
// If a habit wasn't completed "today" (based on stored date), reset its
// completedToday flag. If more than one day was missed entirely, the streak
// resets to 0 instead of growing forever or staying stuck as "done".
function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function applyDailyReset() {
  const today = todayKey();

  habits.forEach(habit => {
    if (habit.lastCompletedDate === today) {
      // already handled today, keep as is
      return;
    }

    if (habit.completedToday) {
      // was completed on a previous day, day has rolled over
      habit.completedToday = false;
    }

    if (habit.lastCompletedDate) {
      const last = new Date(habit.lastCompletedDate);
      const diffDays = Math.round(
        (new Date(today) - last) / (1000 * 60 * 60 * 24)
      );
      // more than 1 day gap since last completion breaks the streak
      if (diffDays > 1) {
        habit.streak = 0;
      }
    }
  });

  saveHabits();
}

// ---------- Persistence ----------
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// ---------- Rendering ----------
function renderStats() {
  document.getElementById("totalHabits").textContent = habits.length;

  let completed = 0;
  let bestStreak = 0;

  habits.forEach(h => {
    if (h.completedToday) completed++;
    if (h.streak > bestStreak) bestStreak = h.streak;
  });

  document.getElementById("completedToday").textContent = completed;
  document.getElementById("bestStreak").textContent = bestStreak;
}

function renderHabits() {
  habitList.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filtered = habits.filter(h =>
    h.name.toLowerCase().includes(search)
  );

  emptyState.hidden = habits.length !== 0;

  if (habits.length !== 0 && filtered.length === 0) {
    habitList.innerHTML = `<p class="empty-state">No habits match "${escapeHtml(search)}".</p>`;
  }

  filtered.forEach(habit => {
    const div = document.createElement("div");
    div.className = "habit-card";
    div.style.setProperty("--habit-color", habit.color || "#22c55e");

    div.innerHTML = `
      <div class="habit-top">
        <div>
          <h3>${escapeHtml(habit.name)}</h3>
          <span class="badge">${escapeHtml(habit.category)}</span>
        </div>
        <div class="streak">🔥 ${habit.streak}</div>
      </div>

      ${habit.notes ? `<div class="notes">${escapeHtml(habit.notes)}</div>` : ""}

      <div class="actions">
        <button class="completeBtn" data-id="${habit.id}" ${habit.completedToday ? "disabled" : ""}>
          ${habit.completedToday ? "✅ Done" : "Mark Done"}
        </button>
        <button class="deleteBtn" data-id="${habit.id}">
          Delete
        </button>
      </div>
    `;

    habitList.appendChild(div);
  });

  attachEvents();
  renderStats();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function attachEvents() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const index = habits.findIndex(h => h.id === id);
      if (index === -1) return;

      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    };
  });

  document.querySelectorAll(".completeBtn").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const habit = habits.find(h => h.id === id);
      if (!habit || habit.completedToday) return;

      habit.completedToday = true;
      habit.streak += 1;
      habit.lastCompletedDate = todayKey();

      saveHabits();
      confetti();
      renderHabits();
    };
  });
}

// ---------- Modal ----------
function openModal() {
  habitModal.classList.add("open");
  habitModal.style.display = "flex";
  formError.hidden = true;
  habitNameInput.focus();
}

function closeModal() {
  habitModal.classList.remove("open");
  habitModal.style.display = "none";
  resetForm();
}

function resetForm() {
  habitNameInput.value = "";
  habitCategoryInput.value = "Health";
  habitColorInput.value = "#22c55e";
  habitNotesInput.value = "";
  formError.hidden = true;
}

addHabitBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

// close when clicking the dark overlay (outside the modal box)
habitModal.addEventListener("click", (e) => {
  if (e.target === habitModal) closeModal();
});

// close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && habitModal.classList.contains("open")) {
    closeModal();
  }
});

saveHabitBtn.addEventListener("click", () => {
  const name = habitNameInput.value.trim();

  if (!name) {
    formError.hidden = false;
    habitNameInput.focus();
    return;
  }

  habits.push({
    id: Date.now(),
    name,
    category: habitCategoryInput.value,
    color: habitColorInput.value,
    notes: habitNotesInput.value.trim(),
    streak: 0,
    completedToday: false,
    lastCompletedDate: null
  });

  saveHabits();
  renderHabits();
  closeModal();
});

searchInput.addEventListener("input", renderHabits);

// ---------- Theme ----------
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark ? "☀️" : "🌙";
}

themeBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem("theme", isDark ? "true" : "false");
});

applyTheme(localStorage.getItem("theme") === "true");

// ---------- Confetti ----------
const confettiColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#ec4899"];

function confetti() {
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    conf.style.animationDuration = (1.5 + Math.random()) + "s";
    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 2500);
  }
}

// ---------- Init ----------
applyDailyReset();
renderHabits();
