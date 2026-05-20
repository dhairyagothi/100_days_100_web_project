const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const themeToggle = document.getElementById("theme-toggle");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");


const totalStreak = document.getElementById("totalStreak");

const themeToggle = document.getElementById("theme-toggle");

let habits = [];


/* Quotes */

const quotes = [
  "Small daily improvements lead to success.",
  "Consistency is more important than perfection.",
  "Your future is built by your habits.",
  "Discipline creates freedom.",
  "Stay focused and never give up."
];

document.getElementById("dailyQuote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];


/* Add Habit */

addHabitBtn.addEventListener("click", () => {

  const habitText = habitInput.value.trim();

  if (habitText === "") {
    alert("Please enter a habit");
    return;
  }

  habits.push({
    name: habitText,
    completed: false,
    streak: 0
  });

  habitInput.value = "";

  renderHabits();
});


/* Enter Key */

habitInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    addHabitBtn.click();
  }
});


/* Render Habits */

/* SAVE HABITS */

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}


/* RENDER HABITS */

function renderHabits() {

  habitList.innerHTML = "";

  habits.forEach((habit, index) => {

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="habit-left">

        <input type="checkbox"
          ${habit.completed ? "checked" : ""}
        >

        <div>

          <span class="${
            habit.completed ? "completed" : ""
          }">
            ${habit.name}
          </span>

          <p class="streak">
            🔥 Streak: ${habit.streak} days
          </p>

        </div>

      </div>

      <div class="habit-actions">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");


    /* Complete Habit */

    checkbox.addEventListener("change", () => {

      habits[index].completed = checkbox.checked;

      if (checkbox.checked) {
        habits[index].streak++;
      }

      renderHabits();
    });


    /* Delete Habit */

    deleteBtn.addEventListener("click", () => {

      habits.splice(index, 1);

      renderHabits();
    });


    /* Edit Habit */

    editBtn.addEventListener("click", () => {

      const newHabit = prompt(
        "Edit your habit:",
        habit.name
      );

      if (
        newHabit !== null &&
        newHabit.trim() !== ""
      ) {
        habits[index].name = newHabit;

        renderHabits();
      }
    });

    habitList.appendChild(li);
  });

  updateStats();
}


/* ADD HABIT */

addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();


/* Update Stats */

function updateStats() {

  totalHabits.innerText = habits.length;

  const completed =
    habits.filter(habit => habit.completed).length;


  completedHabits.innerText = completed;


  /* Progress */

  const progress =
    habits.length === 0
      ? 0
      : (completed / habits.length) * 100;

  progressFill.style.width =
    `${progress}%`;

  progressText.innerText =
    `${Math.round(progress)}%`;


  /* Total Streak */

  const streakTotal = habits.reduce(
    (total, habit) => total + habit.streak,
    0
  );

  totalStreak.innerText = streakTotal;
}


/* Theme Toggle */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

  if (
    document.body.classList.contains("light")
  ) {
    themeToggle.innerHTML = "☀️";
  } else {
    themeToggle.innerHTML = "🌙";
  }
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

/* INITIAL RENDER */

renderHabits();

