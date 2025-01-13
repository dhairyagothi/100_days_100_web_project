let task = document.getElementById("newtask");
let container = document.querySelector(".container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

function Add() {
    if (task.value == "") {
        alert("Please enter a task");
    } else {
        let newelement = document.createElement("li");
        newelement.innerHTML = newtask.value + '<i class="fa-solid fa-trash"></i>' + '<a>&#10003</a>';
        container.appendChild(newelement);
        task.value = "";
        newelement.querySelector("i").addEventListener("click", remove);
        function remove() {
            newelement.remove();
        }
        newelement.querySelector("a").addEventListener("click", strike);
        function strike() {
           if(newelement.style.textDecoration === "line-through")
           {
            newelement.style.textDecoration="none";
           }
           else{
            newelement.style.textDecoration="line-through";
           }
        }
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
