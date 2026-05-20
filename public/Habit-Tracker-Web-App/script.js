const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const themeToggle = document.getElementById("theme-toggle");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

/* SAVE HABITS */

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
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

    li.innerHTML = `
      <span class="${habit.completed ? "completed" : ""}">
        ${habit.name}
      </span>

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
      habits[index].completed = !habits[index].completed;
      saveHabits();
      renderHabits();
    });

    deleteBtn.addEventListener("click", () => {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
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
    completed: false
  });

  saveHabits();
  renderHabits();

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

/* INITIAL RENDER */

renderHabits();