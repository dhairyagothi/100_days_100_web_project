let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

let currentTheme = "theme1";

// Task types
const taskTypes = [
  { label: "Select Type", value: "", color: "white" },
  { label: "Work", value: "Work", color: "#FFDE59" },
  { label: "Personal", value: "Personal", color: "#FFC0CB" },
  { label: "Professional", value: "Professional", color: "#B0BEC5" },
  { label: "Fitness", value: "Fitness", color: "#B1EE99" },
  {
    label: "Miscellaneous",
    value: "Miscellaneous",
    color: "#CAB9F5",
  },
];

// Add task function
function Add() {
  const notes = document.querySelectorAll(".notes");

  // Prevent creating empty task
  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const taskText = lastNote.querySelector("span");

    if (
      taskText &&
      (taskText.innerText.trim() ===
        "Click here to add a task..." ||
        taskText.innerText.trim() === "")
    ) {
      alert(
        "Please add a task to the previous note before creating a new one!"
      );
      return;
    }
  }

  // Create note
  const note = document.createElement("div");
  note.classList.add("notes");
  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");
  noteWrapper.style.display = "flex";
  noteWrapper.style.alignItems = "center";
  noteWrapper.style.justifyContent = "space-between";
  noteWrapper.style.width = "100%";

  // Task text
  const taskText = document.createElement("span");
  taskText.innerText = "Click here to add a task...";
  taskText.contentEditable = true;
  taskText.style.flex = "1";
  taskText.style.marginRight = "10px";

  // Dropdown
  const dropdown = document.createElement("select");
  dropdown.style.marginLeft = "10px";

  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  // Change note color
  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find(
      (type) => type.value === dropdown.value
    );

    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }
  });

  // Tick button
  const tickIcon = document.createElement("span");
  tickIcon.innerHTML = "✔";
  tickIcon.style.cursor = "pointer";
  tickIcon.style.fontSize = "20px";
  tickIcon.style.marginLeft = "10px";

  // Delete button
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.marginLeft = "10px";

  // Complete task
  tickIcon.addEventListener("click", () => {
    taskText.classList.toggle("completed");

    taskText.style.textDecoration =
      taskText.classList.contains("completed")
        ? "line-through"
        : "none";
  });

  // Delete task
  deleteBtn.addEventListener("click", () => {
    note.remove();
  });

  // Placeholder logic
  taskText.addEventListener("focus", () => {
    if (
      taskText.innerText.trim() ===
      "Click here to add a task..."
    ) {
      taskText.innerText = "";
    }
  });

  taskText.addEventListener("blur", () => {
    if (taskText.innerText.trim() === "") {
      taskText.innerText =
        "Click here to add a task...";
    }
  });

  // Append everything
  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);
  noteWrapper.appendChild(deleteBtn);

  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);
}

// Save PDF
function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tasks = document.querySelectorAll(".notes");

  let y = 20;

  tasks.forEach((task, index) => {
    doc.text(
      `${index + 1}. ${task.textContent.trim()}`,
      20,
      y
    );
    y += 10;
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;

  doc.save(fileName);

  showPDFMessage();
}

// Success message
function showPDFMessage() {
  pdfMessage.style.display = "block";

  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 3000);
}

// Navigation
function showHome() {
  document.getElementById("home-tab").style.display =
    "block";
  document.getElementById(
    "documents-tab"
  ).style.display = "none";
}

function showDocuments() {
  document.getElementById("home-tab").style.display =
    "none";
  document.getElementById(
    "documents-tab"
  ).style.display = "block";
}

// Themes
function c1() {
  document.body.style.background =
    "linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%)";
  currentTheme = "theme1";
}

function c2() {
  document.body.style.background =
    "linear-gradient(90deg, #e4afcb 0%, #e2c58b 30%, #7edbdc 100%)";
  currentTheme = "theme2";
}

function c3() {
  document.body.style.background =
    "linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)";
  currentTheme = "theme3";
}

function c4() {
  document.body.style.background =
    "linear-gradient(90deg,rgb(120,25,105),rgb(197,211,201))";
  currentTheme = "theme4";
}

function c5() {
  document.body.style.background =
    "linear-gradient(90deg, #b92b27, #1565c0)";
  currentTheme = "theme5";
}