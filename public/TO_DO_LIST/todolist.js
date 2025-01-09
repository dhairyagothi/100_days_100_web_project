let task = document.getElementById("newtask");   
let notesContainer = document.getElementById("notes-container"); 
let submittask = document.getElementById("submittask");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

let currentTheme = "theme1"; // Default theme

function Add() {
  const notes = document.querySelectorAll(".notes");

  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const taskText = lastNote.querySelector("span");

    if (taskText && (taskText.innerText.trim() === "Click here to add a task..." || taskText.innerText.trim() === "")) {
      alert("Please add a task to the previous note before creating a new one!");
      return;
    }
  }

  const note = document.createElement("div");
  note.classList.add("notes");
  note.contentEditable = true;
  note.innerText = "Click here to add a task...";

  note.classList.add(currentTheme);
  
  notesContainer.appendChild(note);

  const noteWrapper = document.createElement("div");
  noteWrapper.style.display = "flex";
  noteWrapper.style.alignItems = "top-right";
  noteWrapper.style.justifyContent = "space-between";
  noteWrapper.style.width = "100%";

  const taskText = document.createElement("span");
  taskText.innerText = note.innerText;
  taskText.contentEditable = true;
  taskText.style.flex = "1"; 
  taskText.style.marginRight = "10px";

  const tickIcon = document.createElement("a");
  tickIcon.innerHTML = "&#10003"; 
  tickIcon.style.cursor = "pointer";
  tickIcon.style.color = "black";
  tickIcon.style.fontSize = "20px";
  tickIcon.style.alignSelf = "right"; 
  tickIcon.style.marginLeft = "10px"; 

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(tickIcon);

  note.innerHTML = "";
  note.appendChild(noteWrapper);

  taskText.addEventListener("focus", () => {
    if (taskText.innerText.trim() === "Click here to add a task...") {
      taskText.innerText = "";
    }
  });

  taskText.addEventListener("blur", () => {
    if (taskText.innerText.trim() === "") {
      taskText.innerText = "Click here to add a task...";
    }
  });

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

function showHome() {
    document.getElementById("home-tab").style.display = "block";
    document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
    document.getElementById("home-tab").style.display = "none";
    document.getElementById("documents-tab").style.display = "block";
}

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

function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");
  notes.forEach(note => {
    note.classList.remove("theme1", "theme2", "theme3"); 
    note.classList.add(currentTheme);
  });
}

function showPDFMessage() {
    pdfMessage.style.display = "block";
    setTimeout(() => {
        pdfMessage.style.display = "none";
    }, 3000);
}