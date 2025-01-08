let task = document.getElementById("newtask");
let container = document.querySelector(".container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

function Add() {
    document.getElementById("addNoteButton").addEventListener("click", function () {
        const inputField = document.getElementById("taskInput"); // Assuming input has this ID
        const taskText = inputField.value.trim();
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const notesContainer = document.getElementById("notesContainer");
        const note = document.createElement("div");
        note.className = "note";

        note.innerHTML = `
            <input type="checkbox" id="noteCheckbox">
            <label for="noteCheckbox" class="note-label">${taskText}</label>
            <button class="complete-btn">&#10003;</button>
        `;
        notesContainer.appendChild(note);

        inputField.value = "";

        const completeButton = note.querySelector(".complete-btn");
        completeButton.addEventListener("click", function () {
            note.classList.add("completed");
        });
    });
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
