let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");
let task = document.getElementById("task");
let currentTheme = "theme1"; // Default theme
// Task types with updated labels, values, and colors
const taskTypes = [
  { label: "Select Type", value: "", color: "white" },
  { label: "Work", value: "Work", color: "#FFDE59" }, // Bright Yellow
  { label: "Personal", value: "Personal", color: "#FFC0CB" }, // Soft Pastel Pink
  { label: "Professional", value: "Urgent", color: "#B0BEC5" }, // Cool Gray
  { label: "Fitness", value: "Fitness", color: "#B1EE99" }, // Vibrant Green
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5" }, // Vibrant Green
];

function Add() {
  if (!task.value.trim()) {
    alert("Please enter a task");
    return;
  }

  const note = document.createElement("div");
  note.className = "notes";
  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");
  noteWrapper.className = "note-row";

  const taskText = document.createElement("span");
  taskText.className = "note-text";
  taskText.innerText = task.value.trim();
  taskText.contentEditable = true;

  const dropdown = document.createElement("select");
  dropdown.className = "note-type";

  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find((type) => type.value === dropdown.value);
    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }
  });

  const tickIcon = document.createElement("button");
  tickIcon.type = "button";
  tickIcon.className = "note-check";
  tickIcon.innerHTML = "&#10003";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "note-delete";
  deleteBtn.innerText = "Delete";

  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");
    taskText.style.textDecoration = taskText.classList.contains("completed")
      ? "line-through"
      : "none";
    event.stopPropagation();
  });

  deleteBtn.addEventListener("click", () => {
    note.remove();
  });

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);
  noteWrapper.appendChild(deleteBtn);

  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);
  task.value = "";
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let tasks = document.querySelectorAll(".notes");
  tasks.forEach((task, index) => {
    const text = task.querySelector(".note-text");
    const value = text ? text.textContent.trim() : "";
    if (value) {
      doc.text(20, 10 + (10 * index), value);
    }
  });
  let fileName = `ToDoList_${Date.now()}.pdf`;
  let fileURL = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

function saveDocument(fileName, fileURL) {
  let docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.innerHTML = `
        <span>${fileName}</span>
        <button onclick="viewPDF('${fileURL}')">View</button>
        <button onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
        <button onclick="deletePDF(this)">Delete</button>
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

function showPDFMessage() {
  pdfMessage.style.display = "block";
  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 3000);
}

function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
}

// Functions to apply themes
function c1() {
  let image = 'linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%, rgba(227,230,235,1) 100%)';
  document.body.style.background = image;
  currentTheme = "theme1";
  updateNotesTheme();
}

function c2() {
  let image = 'linear-gradient( 90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)';
  document.body.style.background = image;
  currentTheme = "theme2";
  updateNotesTheme();
}

function c3() {
  let image = 'linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)';
  document.body.style.background = image;
  currentTheme = "theme3";
  updateNotesTheme();
}

function c4() {
  let image = 'linear-gradient(90deg,rgb(120, 25, 105),rgb(197, 211, 201))';
  document.body.style.background = image;
  currentTheme = "theme4";
  updateNotesTheme();
}

function c5() {
  let image = 'linear-gradient(90deg, #b92b27, #1565c0)';
  document.body.style.background = image;
  currentTheme = "theme5";
  updateNotesTheme();
}

function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");
  notes.forEach((note) => {
    if (note.style.backgroundColor === "white") {
      note.style.backgroundColor = currentTheme === "theme1"
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
