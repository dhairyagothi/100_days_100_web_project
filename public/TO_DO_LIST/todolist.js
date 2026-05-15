let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");
let task = document.getElementById("task");
let emptyState = document.getElementById("empty-state");
let activeCount = document.getElementById("active-count");
let completedCount = document.getElementById("completed-count");
let documentCount = document.getElementById("document-count");
let progressPercent = document.getElementById("progress-percent");
let progressRing = document.getElementById("progress-ring");
let ringCount = document.getElementById("ring-count");
let pdfPreviewModal = document.getElementById("pdfPreviewModal");
let pdfPreviewFrame = document.getElementById("pdfPreviewFrame");
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
  tickIcon.innerHTML = "Mark done";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "note-delete";
  deleteBtn.innerText = "Delete";

  const noteActions = document.createElement("div");
  noteActions.className = "note-actions";

  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");
    const isCompleted = taskText.classList.contains("completed");
    note.classList.toggle("is-completed", isCompleted);
    tickIcon.innerText = isCompleted ? "Undo" : "Mark done";
    updateStats();
    event.stopPropagation();
  });

  deleteBtn.addEventListener("click", () => {
    note.classList.add("removing");
    setTimeout(() => {
      note.remove();
      updateEmptyState();
      updateStats();
    }, 240);
  });

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteActions.appendChild(tickIcon);
  noteActions.appendChild(deleteBtn);
  noteWrapper.appendChild(noteActions);

  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);
  task.value = "";
  updateEmptyState();
  updateStats();
}

function updateEmptyState() {
  emptyState.classList.toggle("hidden", notesContainer.children.length > 0);
}

function updateStats() {
  const notes = Array.from(document.querySelectorAll(".notes"));
  const completed = notes.filter((note) =>
    note.querySelector(".note-text").classList.contains("completed")
  ).length;
  const total = notes.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  activeCount.innerText = notes.length - completed;
  completedCount.innerText = completed;
  documentCount.innerText = documentsList.children.length;
  progressPercent.innerText = `${percent}%`;
  ringCount.innerText = `${completed}/${total}`;
  progressRing.style.strokeDashoffset = 302 - (302 * percent) / 100;
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let tasks = document.querySelectorAll(".notes");
  if (!tasks.length) {
    doc.setFontSize(16);
    doc.text("No tasks added yet.", 20, 20);
  }
  tasks.forEach((task, index) => {
    const text = task.querySelector(".note-text");
    const type = task.querySelector(".note-type");
    const isCompleted = text.classList.contains("completed");
    const value = text ? text.textContent.trim() : "";
    if (value) {
      const status = isCompleted ? "Done" : "Active";
      const label = type && type.value ? `${type.value} - ${status}` : status;
      doc.text(20, 20 + (14 * index), `${index + 1}. ${value}`);
      doc.setFontSize(10);
      doc.text(24, 26 + (14 * index), label);
      doc.setFontSize(16);
    }
  });
  let fileName = `ToDoList_${Date.now()}.pdf`;
  let fileURL = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage();
  updateStats();
}

function saveDocument(fileName, fileURL) {
  let docItem = document.createElement("div");
  docItem.className = "document-item";
  const docName = document.createElement("span");
  docName.innerText = fileName;
  const viewButton = document.createElement("button");
  viewButton.type = "button";
  viewButton.innerText = "View";
  viewButton.addEventListener("click", () => viewPDF(fileURL));
  const downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.innerText = "Download";
  downloadButton.addEventListener("click", () => downloadPDF(fileURL, fileName));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => deletePDF(deleteButton, fileURL));
  docItem.appendChild(docName);
  docItem.appendChild(viewButton);
  docItem.appendChild(downloadButton);
  docItem.appendChild(deleteButton);
  documentsList.appendChild(docItem);
  updateStats();
}

function viewPDF(fileURL) {
  pdfPreviewFrame.src = fileURL;
  pdfPreviewModal.classList.add("show");
  pdfPreviewModal.setAttribute("aria-hidden", "false");
}

function closePDFPreview() {
  pdfPreviewModal.classList.remove("show");
  pdfPreviewModal.setAttribute("aria-hidden", "true");
  pdfPreviewFrame.src = "";
}

function downloadPDF(fileURL, fileName) {
  let a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.click();
}

function deletePDF(button, fileURL) {
  URL.revokeObjectURL(fileURL);
  button.parentElement.remove();
  updateStats();
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

updateStats();
