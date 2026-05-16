let notesContainer = document.getElementById("task-list");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

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

function addTask() {

  const notes = document.querySelectorAll(".notes");

  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const lastTaskText = lastNote.querySelector("span");
  
    if (lastTaskText && lastTaskText.innerText.trim() === "") {
      alert("Please complete the previous task first!");
      return;
    }
  }

  // Create a note container
  const note = document.createElement("div");
  note.classList.add("notes");
  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");
  noteWrapper.style.display = "flex";
  noteWrapper.style.alignItems = "center";
  noteWrapper.style.justifyContent = "space-between";
  noteWrapper.style.width = "100%";

  const input = document.getElementById("task-input");
const taskValue = input.value.trim();

if (!taskValue) {
  alert("Please enter a task!");
  return;
}

const taskText = document.createElement("span");
taskText.innerText = taskValue;
taskText.contentEditable = true;
  taskText.style.flex = "1";
  taskText.style.marginRight = "10px";

  // Dropdown menu for task type
  const dropdown = document.createElement("select");
  dropdown.style.marginLeft = "10px";

  // Populate dropdown with task types
  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  // Update task background color based on dropdown selection
  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find((type) => type.value === dropdown.value);
    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }
  });

  const tickIcon = document.createElement("a");
  tickIcon.innerHTML = "&#10003"; // Checkmark symbol
  tickIcon.style.cursor = "pointer";
  tickIcon.style.color = "black";
  tickIcon.style.fontSize = "20px";
  tickIcon.style.marginLeft = "10px";

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);

  note.appendChild(noteWrapper);
  const emptyState = document.getElementById("empty-state");
if (emptyState) {
  emptyState.style.display = "none";
}
  notesContainer.appendChild(note);
  input.value = "";
  

  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");
    taskText.style.textDecoration = taskText.classList.contains("completed")
      ? "line-through"
      : "none";
    event.stopPropagation();
  });
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let tasks = document.querySelectorAll(".notes");
  tasks.forEach((task, index) => {
    doc.text(20, 10 + (10 * index), task.textContent.trim());
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


function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");

  const themeColors = {
    sunset: "#f5c842",
    ocean: "#00d4ff",
    forest: "#7fff00",
    midnight: "#9b59b6",
    aurora: "#ff6b6b"
  };

  notes.forEach((note) => {
    note.style.border = `2px solid ${themeColors[currentTheme]}`;
  });
}
function applyTheme(theme) {
  const gradients = {
    sunset: 'linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%, rgba(227,230,235,1) 100%)',

    ocean: 'linear-gradient(90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)',

    forest: 'linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)',

    midnight: 'linear-gradient(90deg, rgb(120, 25, 105), rgb(197, 211, 201))',

    aurora: 'linear-gradient(90deg, #b92b27, #1565c0)'
  };

  document.body.style.background = gradients[theme];
  currentTheme = theme;

  updateNotesTheme();
}