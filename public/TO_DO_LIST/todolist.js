/* ============================================
   To-Do List — Fixed JavaScript
   Works with original HTML & CSS structure
   Fixes: syntax errors, broken functions,
          jsPDF argument order, null guards
============================================ */

// ── DOM References ──────────────────────────
const notesContainer = document.getElementById("notes-container");
const documentsList = document.querySelector(".documents-list");
const pdfMessage = document.getElementById("pdfMessage");
const taskInput = document.getElementById("task");

// ── Theme State ─────────────────────────────
let currentTheme = "theme1";

// ── Task Type Definitions ───────────────────
const taskTypes = [
  { label: "Select Type", value: "", color: "white" },
  { label: "Work", value: "Work", color: "#FFDE59" },
  { label: "Personal", value: "Personal", color: "#FFC0CB" },
  { label: "Professional", value: "Urgent", color: "#B0BEC5" },
  { label: "Fitness", value: "Fitness", color: "#B1EE99" },
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5" },
];

// ── Enter Key Support ────────────────────────
// Allows user to press Enter instead of clicking button
document.addEventListener("DOMContentLoaded", () => {
  if (taskInput) {
    taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") Add();
    });
  }
});

// ── Add Task ────────────────────────────────
function Add() {
  // Guard: do nothing if input is empty
  if (!taskInput || !taskInput.value.trim()) {
    alert("Please enter a task");
    return;
  }

  // Create note card
  const note = document.createElement("div");
  note.className = "notes";
  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");
  noteWrapper.className = "note-row";

  // Task text (editable)
  const taskText = document.createElement("span");
  taskText.className = "note-text";
  taskText.innerText = taskInput.value.trim();
  taskText.contentEditable = true;

  // Type dropdown
  const dropdown = document.createElement("select");
  dropdown.className = "note-type";

  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  // Change note color when type is selected
  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find(
      (type) => type.value === dropdown.value
    );
    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }
  });

  // Tick/complete button
  const tickIcon = document.createElement("button");
  tickIcon.type = "button";
  tickIcon.className = "note-check";
  tickIcon.innerHTML = "&#10003;"; // ✓ fixed: was missing semicolon

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "note-delete";
  deleteBtn.innerText = "Delete";

  // Toggle strikethrough on tick
  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");
    taskText.style.textDecoration = taskText.classList.contains("completed")
      ? "line-through"
      : "none";
    event.stopPropagation();
  });

  // Remove note on delete
  deleteBtn.addEventListener("click", () => {
    note.remove();
  });

  // Assemble note card
  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);
  noteWrapper.appendChild(deleteBtn);
  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);

  // Clear input after adding
  taskInput.value = "";
  taskInput.focus();
}

// ── Save as PDF ─────────────────────────────
function saveAsPDF() {
  // Guard: check jsPDF library loaded
  if (typeof window.jspdf === "undefined") {
    alert("PDF library not loaded. Please check your internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const notes = document.querySelectorAll(".notes");

  // Guard: no tasks to export
  if (notes.length === 0) {
    alert("No tasks to save!");
    return;
  }

  // Write each task to PDF
  // Fixed: jsPDF v2 uses (text, x, y) not (x, y, text)
  notes.forEach((note, index) => {
    const text = note.querySelector(".note-text");
    const value = text ? text.textContent.trim() : "";
    if (value) {
      doc.text(value, 20, 10 + 10 * index);
    }
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));

  saveDocument(fileName, fileURL);
  showPDFMessage();
}

// ── Save Document Entry ──────────────────────
function saveDocument(fileName, fileURL) {
  // Guard: documentsList must exist
  if (!documentsList) return;

  const docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.innerHTML = `
    <span>${fileName}</span>
    <button onclick="viewPDF('${fileURL}')">View</button>
    <button onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
    <button onclick="deletePDF(this)">Delete</button>
  `;
  documentsList.appendChild(docItem);
}

// ── View PDF ─────────────────────────────────
function viewPDF(fileURL) {
  window.open(fileURL, "_blank");
}

// ── Download PDF ─────────────────────────────
function downloadPDF(fileURL, fileName) {
  const a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.click();
}

// ── Delete PDF Entry ─────────────────────────
function deletePDF(button) {
  button.parentElement.remove();
}

// ── Show PDF Success Message ──────────────────
function showPDFMessage() {
  if (!pdfMessage) return;
  pdfMessage.style.display = "block";
  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 3000);
}

// ── Navigation ───────────────────────────────
function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
}

// ── Theme Functions ───────────────────────────
function c1() {
  document.body.style.background =
    "linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%, rgba(227,230,235,1) 100%)";
  currentTheme = "theme1";
  updateNotesTheme();
}

function c2() {
  document.body.style.background =
    "linear-gradient(90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)";
  currentTheme = "theme2";
  updateNotesTheme();
}

function c3() {
  document.body.style.background =
    "linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)";
  currentTheme = "theme3";
  updateNotesTheme();
}

function c4() {
  document.body.style.background =
    "linear-gradient(90deg, rgb(120,25,105), rgb(197,211,201))";
  currentTheme = "theme4";
  updateNotesTheme();
}

function c5() {
  document.body.style.background =
    "linear-gradient(90deg, #b92b27, #1565c0)";
  currentTheme = "theme5";
  updateNotesTheme();
}

// ── Update Existing Notes Theme ───────────────
function updateNotesTheme() {
  // Map theme name to matching note background color
  const themeColors = {
    theme1: "rgba(232,221,227,1)",
    theme2: "#e4afcb",
    theme3: "#39db8c",
    theme4: "rgb(120,25,105)",
    theme5: "#b92b27",
  };

  const notes = document.querySelectorAll(".notes");
  notes.forEach((note) => {
    // Only update notes that haven't been given a task-type color
    if (note.style.backgroundColor === "white") {
      note.style.backgroundColor = themeColors[currentTheme] || "white";
    }
  });
}