const darkToggle = document.getElementById("darkToggle");

let data = JSON.parse(
    localStorage.getItem("dashboard")
) || {
    today: [],
    tomorrow: [],
    notes: "",
    streak: 0,
    lastCompletedDate: null
};

function saveData() {
    localStorage.setItem(
        "dashboard",
        JSON.stringify(data)
    );
}

function addTask(type) {

    const input =
        document.getElementById(type + "Input");

    const text = input.value.trim();

    if (!text) return;

    data[type].push({
        text,
        completed: false
    });

    input.value = "";

    saveData();
    render();
}

function toggleTask(type, index) {

    const task = data[type][index];

    task.completed = !task.completed;

    if (task.completed) {

        const today =
            new Date().toDateString();

        if (data.lastCompletedDate !== today) {

            if (data.lastCompletedDate) {

                const last =
                    new Date(data.lastCompletedDate);

                const diff =
                    Math.floor(
                        (new Date(today) - last)
                        /
                        (1000 * 60 * 60 * 24)
                    );

                if (diff === 1) {
                    data.streak++;
                } else if (diff > 1) {
                    data.streak = 1;
                }

            } else {
                data.streak = 1;
            }

            data.lastCompletedDate = today;
        }
    }

    saveData();
    render();
}

function deleteTask(type, index) {

    data[type].splice(index, 1);

    saveData();
    render();
}

function renderList(type) {

    const list =
        document.getElementById(type + "List");

    list.innerHTML = "";

    data[type].forEach((task, index) => {

        const li =
            document.createElement("li");

        li.innerHTML = `
        <div class="task-left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onclick="toggleTask('${type}',${index})">

            <span class="${
                task.completed
                    ? "completed"
                    : ""
            }">
                ${task.text}
            </span>

        </div>

        <button
        class="delete-btn"
        onclick="deleteTask('${type}',${index})">
        ❌
        </button>
        `;

        list.appendChild(li);
    });
}

function updateTracker() {

    const allTasks = [
        ...data.today,
        ...data.tomorrow
    ];

    const total = allTasks.length;

    const done =
        allTasks.filter(
            task => task.completed
        ).length;

    const percentage =
        total
            ? Math.round(
                (done / total) * 100
            )
            : 0;

    document.getElementById("stats")
        .innerHTML =
        `Total: ${total} | Done: ${done} | Progress: ${percentage}%`;

    document.getElementById("progressBar")
        .style.width =
        percentage + "%";

    document.getElementById("streak")
        .innerHTML =
        `🔥 Streak: ${data.streak} Day${data.streak !== 1 ? "s" : ""}`;
}

function saveNotes() {

    data.notes =
        document.getElementById("notes").value;

    saveData();

    alert("Notes Saved!");
}

function loadNotes() {

    document.getElementById("notes")
        .value = data.notes;
}

/* DARK MODE */

function updateDarkButton() {

    if (
        document.body.classList.contains("dark")
    ) {
        darkToggle.textContent =
            "☀️ Light Mode";
    } else {
        darkToggle.textContent =
            "🌙 Dark Mode";
    }
}

darkToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

    updateDarkButton();
});

if (
    localStorage.getItem("darkMode")
    === "true"
) {
    document.body.classList.add("dark");
}

updateDarkButton();

function render() {

    renderList("today");
    renderList("tomorrow");

    updateTracker();
    loadNotes();
}

render();