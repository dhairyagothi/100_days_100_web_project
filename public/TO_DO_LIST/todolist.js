let taskInput = document.getElementById("newtask");   
let notesContainer = document.getElementById("notes-container"); 
let submittask = document.getElementById("submittask");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

function Add() {
  const notes = document.querySelectorAll('.notes');

  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];

    if (lastNote.innerText.trim() === 'Click here to add a task...' || lastNote.innerText.trim() === '') {
      alert('Please add a task to the previous note!');
      return; 
    } 
  } else {
      const note = document.createElement('div');
      note.classList.add('notes');
      note.contentEditable = true;
      note.innerText = 'Click here to add a task...';
      notesContainer.appendChild(note);

      note.addEventListener('focus', () => {
        if (note.innerText.trim() === 'Click here to add a task...') {
          note.innerText = '';
        }
      });

      note.addEventListener('blur', () => {
        if (note.innerText.trim() === '') {
          note.innerText = 'Click here to add a task...';
        }
      });
  }
}

function saveAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let tasks = document.querySelectorAll(".container li");
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
}

function c2() {
    let image = 'linear-gradient( 90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)';
    document.body.style.background = image;
}

function c3() {
    let image = 'linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)';
    document.body.style.background = image;
}

function showPDFMessage() {
    pdfMessage.style.display = "block";
    setTimeout(() => {
        pdfMessage.style.display = "none";
    }, 3000);
}