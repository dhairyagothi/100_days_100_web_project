let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

let currentTheme = "theme1"; // Default theme

const taskTypes = [
  { label: "Uncategorized", value: "", color: "rgba(255, 255, 255, 0.05)" },
  { label: "Work", value: "Work", color: "rgba(6, 182, 212, 0.15)" }, 
  { label: "Personal", value: "Personal", color: "rgba(236, 72, 153, 0.15)" }, 
  { label: "Urgent", value: "Urgent", color: "rgba(239, 68, 68, 0.15)" }, 
  { label: "Fitness", value: "Fitness", color: "rgba(34, 197, 94, 0.15)" }, 
  { label: "Misc", value: "Misc", color: "rgba(168, 85, 247, 0.15)" }, 
];

function Add() {
  // Remove empty state if present
  const emptyState = document.querySelector(".empty-state");
  if (emptyState) emptyState.remove();

  const notes = document.querySelectorAll(".notes");
  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const taskText = lastNote.querySelector("span");
    if (taskText && (taskText.innerText.trim() === "Click here to add a task..." || taskText.innerText.trim() === "")) {
      alert("Please focus on your current task before adding another one! ✨");
      return;
    }
  }

  const note = document.createElement("div");
  note.classList.add("notes");
  
  const taskText = document.createElement("span");
  taskText.innerText = "Click here to add a task...";
  taskText.contentEditable = true;

  const dropdown = document.createElement("select");
  taskTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.value;
    option.innerText = type.label;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find((t) => t.value === dropdown.value);
    if (selectedType) {
      note.style.background = selectedType.color;
      note.style.borderColor = selectedType.color.replace("0.15", "0.3");
    }
  });

  const footer = document.createElement("div");
  footer.classList.add("notes-footer");

  const controls = document.createElement("div");
  controls.classList.add("note-controls");

  const tickBtn = document.createElement("a");
  tickBtn.classList.add("tick-btn");
  tickBtn.innerHTML = '<i class="fas fa-check"></i>';
  tickBtn.title = "Mark as Done";

  const deleteBtn = document.createElement("a");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.title = "Delete Task";

  controls.appendChild(tickBtn);
  controls.appendChild(deleteBtn);
  
  footer.appendChild(dropdown);
  footer.appendChild(controls);

  note.appendChild(taskText);
  note.appendChild(footer);
  notesContainer.appendChild(note);

  // Focus interactions
  taskText.addEventListener("focus", () => {
    if (taskText.innerText.trim() === "Click here to add a task...") {
      taskText.innerText = "";
    }
    note.style.borderColor = "var(--accent-cyan)";
    note.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.2)";
  });

  taskText.addEventListener("blur", () => {
    if (taskText.innerText.trim() === "") {
      taskText.innerText = "Click here to add a task...";
    }
    note.style.borderColor = "var(--glass-border)";
    note.style.boxShadow = "var(--card-shadow)";
  });

  tickBtn.addEventListener("click", () => {
    taskText.classList.toggle("completed");
    note.classList.toggle("note-completed");
  });

  deleteBtn.addEventListener("click", () => {
    note.style.transform = "scale(0.8)";
    note.style.opacity = "0";
    setTimeout(() => {
      note.remove();
      if (document.querySelectorAll(".notes").length === 0) {
        showEmptyState();
      }
    }, 300);
  });
}

function showEmptyState() {
  notesContainer.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-clipboard-list"></i>
      <p>No tasks yet. Click 'Add a task!' to begin your journey.</p>
    </div>
  `;
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let tasks = document.querySelectorAll(".notes");
  let yPos = 20;

  doc.setFontSize(24);
  doc.setTextColor(6, 182, 212);
  doc.text(20, yPos, "TASKFLOW ARCHIVE");
  yPos += 15;
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(20, yPos, `Generated on ${new Date().toLocaleString()}`);
  yPos += 15;

  let hasTasks = false;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);

  tasks.forEach((task) => {
    let text = task.querySelector("span").innerText.trim();
    if (text !== "Click here to add a task..." && text !== "") {
      const type = task.querySelector("select").value;
      const displayType = type ? `[${type}] ` : "[Task] ";
      const status = task.querySelector("span").classList.contains("completed") ? " (COMPLETED)" : "";
      
      doc.text(20, yPos, `${displayType}${text}${status}`);
      yPos += 10;
      hasTasks = true;
    }
  });

  if (!hasTasks) {
    alert("Your task list is empty! Add some tasks before exporting. 📥");
    return;
  }

  let fileName = `TaskFlow_${Date.now()}.pdf`;
  let fileURL = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

function saveDocument(fileName, fileURL) {
  let docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.innerHTML = `
        <span><i class="far fa-file-pdf"></i> ${fileName}</span>
        <div class="doc-btns">
          <button onclick="viewPDF('${fileURL}')">View</button>
          <button onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
          <button onclick="deletePDF(this)" style="color: #ef4444;">Delete</button>
        </div>
    `;
  documentsList.appendChild(docItem);
}

function viewPDF(fileURL) { window.open(fileURL, "_blank"); }
function downloadPDF(fileURL, fileName) {
  let a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.click();
}
function deletePDF(button) { button.closest(".document-item").remove(); }

function showPDFMessage() {
  pdfMessage.style.display = "flex";
  pdfMessage.style.alignItems = "center";
  pdfMessage.style.gap = "10px";
  setTimeout(() => { pdfMessage.style.display = "none"; }, 3000);
}

function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
}

// Themes
function applyTheme(gradient, name) {
  document.body.style.backgroundImage = gradient;
  currentTheme = name;
}

function c1() { applyTheme("radial-gradient(at 0% 0%, rgba(244, 63, 94, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(244, 63, 94, 0.1) 0px, transparent 50%)", "rose"); }
function c2() { applyTheme("radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.1) 0px, transparent 50%)", "sky"); }
function c3() { applyTheme("radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.1) 0px, transparent 50%)", "amber"); }
function c4() { applyTheme("radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)", "emerald"); }
function c5() { applyTheme("radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%)", "purple"); }
