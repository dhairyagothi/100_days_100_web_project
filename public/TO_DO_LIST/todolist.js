const taskInput = document.getElementById("task-input");
const taskType = document.getElementById("task-type");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const documentsList = document.getElementById("documents-list");

function addTask(){

  const text = taskInput.value.trim();

  if(!text) return;

  const category = taskType.value;

  const task = document.createElement("div");

  task.className = "task-card";

  task.innerHTML = `
    <input type="checkbox" class="task-check">

    <span class="task-text">${text}</span>

    ${category ? `<span class="task-tag">${category}</span>` : ""}

    <button class="task-delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  const checkbox = task.querySelector(".task-check");

  checkbox.addEventListener("change", () => {

    task.classList.toggle("done");

    updateStats();

    saveTasks();

  });

  task.querySelector(".task-delete")
    .addEventListener("click", () => {

      task.remove();

      updateStats();

      checkEmpty();

      saveTasks();

    });

  taskList.appendChild(task);

  taskInput.value = "";
  taskType.value = "";

  updateStats();

  checkEmpty();

  saveTasks();
}

function updateStats(){

  const tasks =
    document.querySelectorAll(".task-card");

  const done =
    document.querySelectorAll(".task-card.done");

  document.getElementById("total-tasks")
    .textContent = tasks.length;

  document.getElementById("done-tasks")
    .textContent = done.length;

  document.getElementById("pending-tasks")
    .textContent = tasks.length - done.length;
}

function checkEmpty(){

  const tasks =
    document.querySelectorAll(".task-card");

  emptyState.style.display =
    tasks.length ? "none" : "block";
}

function filterTasks(filter, btn){

  document.querySelectorAll(".filter-btn")
    .forEach(button => {
      button.classList.remove("active");
    });

  btn.classList.add("active");

  const tasks =
    document.querySelectorAll(".task-card");

  tasks.forEach(task => {

    const done =
      task.classList.contains("done");

    if(filter === "all"){
      task.style.display = "flex";
    }

    else if(filter === "done"){
      task.style.display =
        done ? "flex" : "none";
    }

    else if(filter === "pending"){
      task.style.display =
        !done ? "flex" : "none";
    }

  });

}

function applyTheme(theme){

  document.body.className = "";

  if(theme !== "default"){
    document.body.classList.add(`theme-${theme}`);
  }

  localStorage.setItem("theme", theme);
}

function saveTasks(){

  const tasks = [];

  document.querySelectorAll(".task-card")
    .forEach(task => {

      tasks.push({
        text: task.querySelector(".task-text")
          .textContent,

        category:
          task.querySelector(".task-tag")
          ?.textContent || "",

        done:
          task.classList.contains("done")
      });

    });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function loadTasks(){

  const saved =
    JSON.parse(localStorage.getItem("tasks")) || [];

  saved.forEach(item => {

    taskInput.value = item.text;
    taskType.value = item.category;

    addTask();

    const tasks =
      document.querySelectorAll(".task-card");

    const task =
      tasks[tasks.length - 1];

    if(item.done){

      task.classList.add("done");

      task.querySelector(".task-check")
        .checked = true;
    }

  });

}

function saveAsPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("TaskFlow Tasks", 20, 20);

  let y = 40;

  document.querySelectorAll(".task-card")
    .forEach((task, index) => {

      const text =
        task.querySelector(".task-text")
        .textContent;

      doc.text(
        `${index + 1}. ${text}`,
        20,
        y
      );

      y += 10;
    });

  const fileName =
    `TaskFlow_${Date.now()}.pdf`;

  doc.save(fileName);

  addDocument(fileName);
}

function addDocument(fileName){

  const item =
    document.createElement("div");

  item.className = "doc-item";

  item.innerHTML = `
    <span>${fileName}</span>
    <button class="btn-add">Saved</button>
  `;

  documentsList.appendChild(item);
}

function showHome(){

  document.getElementById("home-tab")
    .style.display = "block";

  document.getElementById("documents-tab")
    .style.display = "none";

  document.getElementById("home-btn")
    .classList.add("active");

  document.getElementById("docs-btn")
    .classList.remove("active");
}

function showDocuments(){

  document.getElementById("home-tab")
    .style.display = "none";

  document.getElementById("documents-tab")
    .style.display = "block";

  document.getElementById("docs-btn")
    .classList.add("active");

  document.getElementById("home-btn")
    .classList.remove("active");
}

taskInput.addEventListener("keydown", e => {

  if(e.key === "Enter"){
    addTask();
  }

});

loadTasks();

checkEmpty();

const savedTheme =
  localStorage.getItem("theme");

if(savedTheme){
  applyTheme(savedTheme);
}