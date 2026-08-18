const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskMinutes = document.getElementById("taskMinutes");

const taskList = document.getElementById("taskList");

let timer;
let minutes = 0;
let seconds = 0;

let activeTask = null;

let completedSessions = 0;


// ================= LOAD =================

document.addEventListener("DOMContentLoaded", () => {

  loadTasks();

  updateDashboard();

  renderFocusTasks();

});


// ================= ADD TASK =================

function addTask(){

  const text = taskInput.value.trim();

  const date = taskDate.value;

  const focus = taskMinutes.value;

  if(!text || !focus){

    alert("Enter task and focus time");

    return;

  }

  createTask(text,date,focus,false);

  updateStorage();

  updateDashboard();

  renderFocusTasks();

  taskInput.value = "";

  taskDate.value = "";

  taskMinutes.value = "";

}


// ================= CREATE TASK =================

function createTask(text,date,focus,completed){

  const li = document.createElement("li");

  li.classList.add("task-item");

  li.setAttribute("data-focus",focus);

  if(completed){

    li.classList.add("completed");

  }

  li.innerHTML = `

    <div class="task-info">

      <span class="task-text">
        ${text}
      </span>

      <span class="task-date">
        📅 ${date || "No Date"} | ⏳ ${focus} mins
      </span>

    </div>

    <div class="task-buttons">

      <button class="edit-btn">
        ✏️
      </button>

      <button class="complete-btn">
        ✅
      </button>

      <button class="delete-btn">
        ❌
      </button>

    </div>
  `;


  // ================= EDIT =================

  li.querySelector(".edit-btn")
    .addEventListener("click",()=>{

      const newTask = prompt(
        "Edit Task",
        text
      );

      if(newTask){

        li.querySelector(".task-text")
          .textContent = newTask;

        updateStorage();

        updateDashboard();

        renderFocusTasks();

      }

  });


  // ================= COMPLETE =================

  li.querySelector(".complete-btn")
    .addEventListener("click",()=>{

      li.classList.toggle("completed");

      updateStorage();

      updateDashboard();

  });


  // ================= DELETE =================

  li.querySelector(".delete-btn")
    .addEventListener("click",()=>{

      li.remove();

      updateStorage();

      updateDashboard();

      renderFocusTasks();

  });

  taskList.appendChild(li);

}


// ================= STORAGE =================

function updateStorage(){

  const tasks = [];

  document.querySelectorAll(".task-item")
    .forEach(task=>{

      tasks.push({

        text:
          task.querySelector(".task-text")
          .textContent,

        info:
          task.querySelector(".task-date")
          .textContent,

        focus:
          task.getAttribute("data-focus"),

        completed:
          task.classList.contains("completed")

      });

  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}


function loadTasks(){

  const tasks =
    JSON.parse(
      localStorage.getItem("tasks")
    ) || [];

  tasks.forEach(task=>{

    const info = task.info;

    const date =
      info.split("|")[0]
      .replace("📅 ","")
      .trim();

    createTask(
      task.text,
      date,
      task.focus,
      task.completed
    );

  });

}


// ================= DASHBOARD =================

function updateDashboard(){

  const tasks =
    document.querySelectorAll(".task-item");

  const completed =
    document.querySelectorAll(".completed");



  // ================= TOTAL TASKS =================

  document.getElementById("analyticsTasks")
    .textContent = tasks.length;



  // ================= COMPLETED =================

  document.getElementById("completedTasks")
    .textContent = completed.length;

  document.getElementById("completedDashboard")
    .textContent =
    `${completed.length} Tasks`;



  // ================= STREAK =================

  const streak = completed.length;

  document.getElementById("streakCount")
    .innerHTML =
    `
      <div style="
        text-align:center;
        font-size:42px;
        font-weight:bold;
      ">
        ${streak}
      </div>
    `;



  // ================= TASK GOALS =================

  let goalText = "";

  tasks.forEach((task,index)=>{

    const name =
      task.querySelector(".task-text")
      .textContent;

    if(index < 5){

      goalText += `• ${name}<br>`;

    }

  });

  document.getElementById("todayGoal")
    .innerHTML =
    goalText || "No Task Added";



  // ================= FOCUS TIME =================

  let totalMinutes = 0;

  tasks.forEach(task=>{

    totalMinutes += parseInt(
      task.getAttribute("data-focus")
    );

  });

  document.getElementById("focusHours")
    .textContent =
    `${totalMinutes} Minutes`;



  // ================= FOCUS SESSIONS =================

  document.getElementById("totalFocusSessions")
    .textContent =
    completedSessions;



  // ================= PRODUCTIVITY SCORE =================

  let productivity = 0;

  if(tasks.length > 0){

    productivity =
      Math.round(
        (completed.length / tasks.length) * 100
      );

  }

  let scoreElement =
    document.getElementById("productivityScore");

  if(!scoreElement){

    const analyticsBox =
      document.querySelector(".analytics-box");

    const div =
      document.createElement("div");

    div.classList.add("history-item");

    div.id = "productivityScore";

    analyticsBox.prepend(div);

    scoreElement = div;

  }

  scoreElement.innerHTML = `
    <h3>📈 Productivity Score</h3>
    <p>${productivity}%</p>
  `;

}


// ================= FOCUS TASKS =================

function renderFocusTasks(){

  let container =
    document.getElementById(
      "focusTaskContainer"
    );

  if(!container){

    container =
      document.createElement("div");

    container.id =
      "focusTaskContainer";

    document.querySelector(".focus-box")
      .appendChild(container);

  }

  container.innerHTML = "";

  document.querySelectorAll(".task-item")
    .forEach(task=>{

      const name =
        task.querySelector(".task-text")
        .textContent;

      const focus =
        task.getAttribute("data-focus");

      const card =
        document.createElement("div");

      card.classList.add("history-item");

      card.innerHTML = `

        <h3>${name}</h3>

        <p>
          ⏳ ${focus} Minutes
        </p>

        <button class="focus-start-btn">
          ▶ Start Focus
        </button>

      `;

      card.querySelector(".focus-start-btn")
        .addEventListener("click",()=>{

          activeTask = name;

          minutes = parseInt(focus);

          seconds = 0;

          updateTimerDisplay();

          document.getElementById(
            "currentTaskName"
          ).textContent =
          `🎯 ${name}`;

      });

      container.appendChild(card);

  });

}


// ================= TIMER =================

function updateTimerDisplay(){

  document.getElementById("timer")
    .textContent =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}


function startTimer(){

  if(!activeTask){

    alert("Select a task first!");

    return;

  }

  clearInterval(timer);

  timer = setInterval(()=>{

    if(seconds === 0){

      if(minutes === 0){

        clearInterval(timer);

        completedSessions++;

        updateDashboard();

        addHistory();

        alert(
          `🎉 ${activeTask} Focus Session Completed!`
        );

        return;

      }

      minutes--;

      seconds = 59;

    } else {

      seconds--;

    }

    updateTimerDisplay();

  },1000);

}


function pauseTimer(){

  clearInterval(timer);

}


function resetTimer(){

  clearInterval(timer);

  minutes = 0;

  seconds = 0;

  updateTimerDisplay();

}


// ================= HISTORY =================

function addHistory(){

  const history =
    document.createElement("div");

  history.classList.add("history-item");

  const now = new Date();

  history.innerHTML = `

    <h4>
      ${activeTask}
    </h4>

    <p>
      📅 ${now.toLocaleDateString()}
    </p>

    <p>
      ⏰ ${now.toLocaleTimeString()}
    </p>

    <p>
      ✅ Focus Session Completed
    </p>

  `;

  document.getElementById("historyList")
    .prepend(history);

}


// ================= SIDEBAR =================

const navLinks =
  document.querySelectorAll(".nav-link");

const sections =
  document.querySelectorAll(".content-section");

navLinks.forEach(link=>{

  link.addEventListener("click",()=>{

    navLinks.forEach(item=>
      item.classList.remove("active")
    );

    sections.forEach(section=>
      section.classList.remove("active-section")
    );

    link.classList.add("active");

    const target =
      link.getAttribute("data-section");

    document.getElementById(target)
      .classList.add("active-section");

  });

});


// ================= THEME =================

document.querySelector(".theme-btn")
  .addEventListener("click",()=>{

    document.body.classList.toggle(
      "light-mode"
    );

});


// ================= CLEAR =================

function clearAllTasks(){

  localStorage.removeItem("tasks");

  taskList.innerHTML = "";

  renderFocusTasks();

  updateDashboard();

}


updateTimerDisplay();