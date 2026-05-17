const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

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

renderHabits();