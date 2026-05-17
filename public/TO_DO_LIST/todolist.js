let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");
let task = document.getElementById("task");
let currentTheme = "theme1";

// Local Storage Key
const STORAGE_KEY = "todo_tasks";

// Task types
const taskTypes = [
  { label: "Select Type", value: "", color: "white" },
  { label: "Work", value: "Work", color: "#FFDE59" },
  { label: "Personal", value: "Personal", color: "#FFC0CB" },
  { label: "Professional", value: "Urgent", color: "#B0BEC5" },
  { label: "Fitness", value: "Fitness", color: "#B1EE99" },
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5" },
];

// SAVE TASKS
function saveTasksToLocalStorage() {
  const tasks = [];

  document.querySelectorAll(".notes").forEach((note) => {
    const text = note.querySelector(".note-text").textContent.trim();

    const category = note.querySelector(".note-type").value;

    const completed = note
      .querySelector(".note-text")
      .classList.contains("completed");

    tasks.push({
      text,
      category,
      completed,
      createdAt: new Date().toLocaleString(),
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// LOAD TASKS
function loadTasksFromLocalStorage() {
  const savedTasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  savedTasks.forEach((taskData) => {
    createTask(
      taskData.text,
      taskData.category,
      taskData.completed
    );
  });
}

// DOCUMENTS DASHBOARD
function renderDocuments() {
  documentsList.innerHTML = "";

  const savedTasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (savedTasks.length === 0) {
    documentsList.innerHTML = `
      <div class="document-item">
        <span>No saved task history found.</span>
      </div>
    `;
    return;
  }

  savedTasks.forEach((task) => {
    const status = task.completed
      ? "✅ Completed"
      : "⏳ Pending";

    const documentCard = document.createElement("div");

    documentCard.className = "document-item";

    documentCard.innerHTML = `
      <div>
        <h3>${task.text}</h3>
        <p><strong>Category:</strong> ${
          task.category || "Not Selected"
        }</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Saved:</strong> ${task.createdAt}</p>
      </div>
    `;

    documentsList.appendChild(documentCard);
  });
}

// CREATE TASK
function createTask(
  taskValue,
  selectedCategory = "",
  isCompleted = false
) {
  const note = document.createElement("div");

  note.className = "notes";

  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");

  noteWrapper.className = "note-row";

  const taskText = document.createElement("span");

  taskText.className = "note-text";

  taskText.innerText = taskValue;

  taskText.contentEditable = true;

  if (isCompleted) {
    taskText.classList.add("completed");

    taskText.style.textDecoration = "line-through";
  }

  const dropdown = document.createElement("select");

  dropdown.className = "note-type";

  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");

    option.value = taskType.value;

    option.innerText = taskType.label;

    if (taskType.value === selectedCategory) {
      option.selected = true;

      note.style.backgroundColor = taskType.color;
    }

    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find(
      (type) => type.value === dropdown.value
    );

    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }

    saveTasksToLocalStorage();

    renderDocuments();
  });

  const tickIcon = document.createElement("button");

  tickIcon.type = "button";

  tickIcon.className = "note-check";

  tickIcon.innerHTML = "&#10003";

  const deleteBtn = document.createElement("button");

  deleteBtn.type = "button";

  deleteBtn.className = "note-delete";

  deleteBtn.innerText = "Delete";

  // COMPLETE TASK
  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");

    taskText.style.textDecoration =
      taskText.classList.contains("completed")
        ? "line-through"
        : "none";

    saveTasksToLocalStorage();

    renderDocuments();

    event.stopPropagation();
  });

  // DELETE TASK
  deleteBtn.addEventListener("click", () => {
    note.remove();

    saveTasksToLocalStorage();

    renderDocuments();
  });

  // EDIT TASK
  taskText.addEventListener("input", () => {
    saveTasksToLocalStorage();

    renderDocuments();
  });

  noteWrapper.appendChild(taskText);

  noteWrapper.appendChild(dropdown);

  noteWrapper.appendChild(tickIcon);

  noteWrapper.appendChild(deleteBtn);

  note.appendChild(noteWrapper);

  notesContainer.appendChild(note);

  saveTasksToLocalStorage();

  renderDocuments();
}

// ADD TASK
function Add() {
  if (!task.value.trim()) {
    alert("Please enter a task");

    return;
  }

  createTask(task.value.trim());

  task.value = "";
}

// SAVE PDF
function saveAsPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let tasks = document.querySelectorAll(".notes");

  tasks.forEach((task, index) => {
    const text = task.querySelector(".note-text");

    const value = text ? text.textContent.trim() : "";

    if (value) {
      doc.text(20, 10 + 10 * index, value);
    }
  });

  let fileName = `ToDoList_${Date.now()}.pdf`;

  let fileURL = URL.createObjectURL(doc.output("blob"));

  saveDocument(fileName, fileURL);

  showPDFMessage();
}

// SAVE DOCUMENT
function saveDocument(fileName, fileURL) {
  let docItem = document.createElement("div");

  docItem.className = "document-item";

  docItem.innerHTML = `
        <span>${fileName}</span>

        <button onclick="viewPDF('${fileURL}')">
          View
        </button>

        <button onclick="downloadPDF('${fileURL}', '${fileName}')">
          Download
        </button>

        <button onclick="deletePDF(this)">
          Delete
        </button>
    `;

  documentsList.appendChild(docItem);
}

function viewPDF(fileURL) {
  window.open(fileURL, "_blank");
}

function downloadPDF(fileURL, fileName) {
  let a = document.createElement("a");

  a.href = fileURL;

  a.download = fileName;

  a.click();
}

function deletePDF(button) {
  button.parentElement.remove();
}

// PDF MESSAGE
function showPDFMessage() {
  pdfMessage.style.display = "block";

  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 3000);
}

// NAVIGATION
function showHome() {
  document.getElementById("home-tab").style.display = "block";

  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";

  document.getElementById("documents-tab").style.display = "block";
}

// THEMES
function c1() {
  let image =
    "linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%, rgba(227,230,235,1) 100%)";

  document.body.style.background = image;

  currentTheme = "theme1";

  updateNotesTheme();
}

function c2() {
  let image =
    "linear-gradient(90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)";

  document.body.style.background = image;

  currentTheme = "theme2";

  updateNotesTheme();
}

function c3() {
  let image =
    "linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)";

  document.body.style.background = image;

  currentTheme = "theme3";

  updateNotesTheme();
}

function c4() {
  let image =
    "linear-gradient(90deg,rgb(120, 25, 105),rgb(197, 211, 201))";

  document.body.style.background = image;

  currentTheme = "theme4";

  updateNotesTheme();
}

function c5() {
  let image =
    "linear-gradient(90deg, #b92b27, #1565c0)";

  document.body.style.background = image;

  currentTheme = "theme5";

  updateNotesTheme();
}

// UPDATE NOTES THEME
function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");

  notes.forEach((note) => {
    if (note.style.backgroundColor === "white") {
      note.style.backgroundColor =
        currentTheme === "theme1"
          ? "rgba(232,221,227,1)"
          : currentTheme === "theme2"
          ? "#e4afcb"
          : currentTheme === "theme3"
          ? "#39db8c"
          : currentTheme === "theme4"
          ? "rgb(120, 25, 105)"
          : "#b92b27";
    }
  });
}

// LOAD TASKS ON STARTUP
window.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();

  renderDocuments();
});