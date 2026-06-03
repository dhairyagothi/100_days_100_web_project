// DATE
const dateElement = document.getElementById("date");

const today = new Date();

dateElement.innerText = today.toDateString();

// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

// TASK SYSTEM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = [];

function updateTaskCount() {
    taskCount.innerText = tasks.length;
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${task}
            <button class="deleteBtn" onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}

addTaskBtn.addEventListener("click", () => {

    const task = taskInput.value.trim();

    if(task === "") {
        alert("Enter a task");
        return;
    }

    tasks.push(task);

    taskInput.value = "";

    renderTasks();

    localStorage.setItem("tasks", JSON.stringify(tasks));
});

function deleteTask(index) {

    tasks.splice(index, 1);

    renderTasks();

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOAD TASKS
const savedTasks = JSON.parse(localStorage.getItem("tasks"));

if(savedTasks) {
    tasks = savedTasks;
    renderTasks();
}

// NOTES
const notesArea = document.getElementById("notesArea");
const saveNotesBtn = document.getElementById("saveNotesBtn");

notesArea.value = localStorage.getItem("notes") || "";

saveNotesBtn.addEventListener("click", () => {

    localStorage.setItem("notes", notesArea.value);

    alert("Notes saved successfully");
});

// POMODORO TIMER
let minutes = 25;
let seconds = 0;
let timer;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

function updateTimerDisplay() {

    minutesDisplay.innerText = String(minutes).padStart(2, '0');
    secondsDisplay.innerText = String(seconds).padStart(2, '0');
}

function startTimer() {

    timer = setInterval(() => {

        if(seconds === 0) {

            if(minutes === 0) {
                clearInterval(timer);
                alert("Focus Session Complete!");
                return;
            }

            minutes--;
            seconds = 59;
        }
        else {
            seconds--;
        }

        updateTimerDisplay();

    }, 1000);
}

function resetTimer() {

    clearInterval(timer);

    minutes = 25;
    seconds = 0;

    updateTimerDisplay();
}

updateTimerDisplay();

// BUTTONS
const startBtn = document.getElementById("startTimer");
const resetBtn = document.getElementById("resetTimer");
const pauseBtn = document.getElementById("pauseTimer");

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
let isPaused = false;

pauseBtn.addEventListener("click", () => {
    if (!isPaused) {
        clearInterval(timer);
        pauseBtn.textContent = "Resume";
        isPaused = true;
    } else {
        startTimer();
        pauseBtn.textContent = "Pause";
        isPaused = false;
    }
});