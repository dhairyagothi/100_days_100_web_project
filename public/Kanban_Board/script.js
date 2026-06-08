const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function createTaskElement(task) {
    const taskDiv = document.createElement("div");

    taskDiv.classList.add("task");
    taskDiv.draggable = true;
    taskDiv.dataset.id = task.id;

    taskDiv.innerHTML = `
        <p>${task.text}</p>
        <button class="delete-btn">✕</button>
    `;

    taskDiv.addEventListener("dragstart", () => {
        taskDiv.classList.add("dragging");
    });

    taskDiv.addEventListener("dragend", () => {
        taskDiv.classList.remove("dragging");
    });

    taskDiv.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
    });

    return taskDiv;
}

function renderTasks() {
    document.querySelectorAll(".task-container").forEach(container => {
        container.innerHTML = "";
    });

    tasks.forEach(task => {
        const column = document.getElementById(task.status);

        if (column) {
            column.appendChild(createTaskElement(task));
        }
    });
}

document.querySelectorAll(".add-column-task").forEach(button => {
    button.addEventListener("click", () => {
        const taskText = prompt("Enter task name:");

        if (!taskText || !taskText.trim()) return;

        const task = {
            id: Date.now(),
            text: taskText.trim(),
            status: button.dataset.status
        };

        tasks.push(task);

        saveTasks();
        renderTasks();
    });
});

document.querySelectorAll(".task-container").forEach(container => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    container.addEventListener("drop", () => {
        const draggedTask = document.querySelector(".dragging");

        if (!draggedTask) return;

        const taskId = Number(draggedTask.dataset.id);

        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.status = container.id;
            saveTasks();
            renderTasks();
        }
    });
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkModeEnabled = document.body.classList.contains("dark");

    if (darkModeEnabled) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});

renderTasks();