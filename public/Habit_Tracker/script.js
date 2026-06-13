const habits = JSON.parse(localStorage.getItem("habits")) || [];

const quotes = [
  "Small habits create big results.",
  "Progress beats perfection.",
  "Stay consistent.",
  "You become what you repeat.",
  "Success is built daily.",
];

document.getElementById("quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

const habitList = document.getElementById("habitList");

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderStats() {
  document.getElementById("totalHabits").textContent = habits.length;

  let completed = 0;
  let bestStreak = 0;

  habits.forEach((h) => {
    if (h.completedToday) completed++;

    if (h.streak > bestStreak) bestStreak = h.streak;
  });

  document.getElementById("completedToday").textContent = completed;

  document.getElementById("bestStreak").textContent = bestStreak;
}

function renderHabits() {
  habitList.innerHTML = "";

  const search = document.getElementById("searchHabit").value.toLowerCase();

  habits
    .filter((h) => h.name.toLowerCase().includes(search))
    .forEach((habit) => {
      const div = document.createElement("div");

      div.className = "habit-card";
      div.style.borderLeft = `6px solid ${habit.color}`;

      div.innerHTML = `
<div class="habit-top">

<div>
<h3>${habit.name}</h3>
<p>${habit.category}</p>
</div>

<div class="streak">
🔥 ${habit.streak}
</div>

</div>

<div class="notes">
${habit.notes}
</div>

<div class="actions">

<button
class="completeBtn"
data-id="${habit.id}"
>
${habit.completedToday ? "✅ Done" : "Mark Done"}
</button>

<button
class="deleteBtn"
data-id="${habit.id}"
>
Delete
</button>

</div>
`;

      habitList.appendChild(div);
    });

  attachEvents();
  renderStats();
}

function attachEvents() {
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);

      const index = habits.findIndex((h) => h.id === id);

      habits.splice(index, 1);

      saveHabits();
      renderHabits();
    };
  });

  document.querySelectorAll(".completeBtn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);

      const habit = habits.find((h) => h.id === id);

      if (!habit.completedToday) {
        habit.completedToday = true;

        habit.streak += 1;

        saveHabits();

        confetti();

        renderHabits();
      }
    };
  });
}

document.getElementById("addHabitBtn").onclick = () => {
  document.getElementById("habitModal").style.display = "flex";
};

document.getElementById("saveHabitBtn").onclick = () => {
  const name = document.getElementById("habitName").value;

  if (!name) return;

  habits.push({
    id: Date.now(),

    name,

    category: document.getElementById("habitCategory").value,

    color: document.getElementById("habitColor").value,

    notes: document.getElementById("habitNotes").value,

    streak: 0,

    completedToday: false,
  });

  saveHabits();

  renderHabits();

  document.getElementById("habitModal").style.display = "none";
};

document.getElementById("searchHabit").addEventListener("input", renderHabits);

const themeBtn = document.getElementById("themeBtn");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");

  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

function confetti() {
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement("div");

    conf.className = "confetti";

    conf.style.left = Math.random() * 100 + "vw";

    document.body.appendChild(conf);

    setTimeout(() => {
      conf.remove();
    }, 2000);
  }
}

renderHabits();
