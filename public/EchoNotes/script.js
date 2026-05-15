const changeSizeBtn = document.getElementById("changeSizeBtn");
const noteContent = document.getElementById("noteContent");

// Create dropdown dynamically
const dropdown = document.createElement("div");
dropdown.className = "size-dropdown";
dropdown.innerHTML = `
  <button data-size="14px">14</button>
  <button data-size="16px">16</button>
  <button data-size="22px">22</button>
  <button data-size="26px">26</button>
`;
document.body.appendChild(dropdown);

// Show/hide dropdown near the button
changeSizeBtn.addEventListener("click", (e) => {
  const rect = changeSizeBtn.getBoundingClientRect();
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.bottom + 5}px`;
  dropdown.classList.toggle("visible");
});

// When user selects a size
dropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const size = e.target.dataset.size;
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  if (!noteContent.contains(range.commonAncestorContainer)) {
    alert("You can only change the text size within the note body!");
    dropdown.classList.remove("visible");
    return;
  }

  const selectedText = selection.toString();

  if (!selectedText) {
    alert("Please select some text first!");
    return;
  }

  const span = document.createElement("span");
  span.style.fontSize = size;
  span.textContent = selectedText;

  range.deleteContents();
  range.insertNode(span);

  dropdown.classList.remove("visible"); // hide dropdown
});

const changeColorBtn = document.getElementById("changeColorBtn");

// Create color dropdown dynamically
const colorDropdown = document.createElement("div");
colorDropdown.className = "color-dropdown";
colorDropdown.innerHTML = `
  <button data-color="black" style="color:black;">●</button>
  <button data-color="red" style="color:red;">●</button>
  <button data-color="purple" style="color:purple;">●</button>
  <button data-color="green" style="color:green;">●</button>
  <button data-color="blue" style="color:blue;">●</button>
  <button data-color="brown" style="color:brown;">●</button>
`;
document.body.appendChild(colorDropdown);

// Toggle color dropdown position
changeColorBtn.addEventListener("click", (e) => {
  const rect = changeColorBtn.getBoundingClientRect();
  colorDropdown.style.left = `${rect.left}px`;
  colorDropdown.style.top = `${rect.bottom + 5}px`;
  colorDropdown.classList.toggle("visible");
});

// Apply selected color
colorDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const color = e.target.dataset.color;
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  if (!noteContent.contains(range.commonAncestorContainer)) {
    alert("You can only change the color of the note body text!");
    colorDropdown.classList.remove("visible");
    return;
  }

  const selectedText = selection.toString();

  if (!selectedText) {
    alert("Please select some text first!");
    return;
  }

  const span = document.createElement("span");
  span.style.color = color;
  span.textContent = selectedText;

  range.deleteContents();
  range.insertNode(span);

  colorDropdown.classList.remove("visible");
});

const saveNoteBtn = document.getElementById("saveNoteBtn");

saveNoteBtn.addEventListener("click", async () => {
  const noteSection = document.querySelector(".note-section");

  // use html2canvas to capture the note area
  const canvas = await html2canvas(noteSection, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // initialize jsPDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // calculate scaling to fit nicely in A4
  const imgWidth = pageWidth - 40; // margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
  pdf.save("MyNote.pdf");
});

const clearNoteBtn = document.getElementById("clearNoteBtn");
clearNoteBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your note?")) {
    noteTitle.value = "";
    noteContent.innerHTML = "";
    localStorage.removeItem("myNote");
  }
});

// ---------------------------
// 🔹 SAVE & LOAD NOTES
// ---------------------------

// Get references
const noteTitle = document.getElementById("noteTitle");
const noteContent_ = document.getElementById("noteContent");

// Save note to localStorage (runs automatically whenever you type)
function saveNoteToLocal() {
  const noteData = {
    title: noteTitle.value,
    content: noteContent_.innerHTML, // include styles and formatting
  };
  localStorage.setItem("myNote", JSON.stringify(noteData));
  console.log("Note saved locally!");
}

// Load saved note (if exists)
function loadNoteFromLocal() {
  const saved = localStorage.getItem("myNote");
  if (saved) {
    const noteData = JSON.parse(saved);
    noteTitle.value = noteData.title;
    noteContent_.innerHTML = noteData.content;
    console.log("Note loaded from local storage!");
  }
}

// Listen for typing changes
noteTitle.addEventListener("input", saveNoteToLocal);
noteContent_.addEventListener("input", saveNoteToLocal);

// Load when page opens
window.addEventListener("load", loadNoteFromLocal);
