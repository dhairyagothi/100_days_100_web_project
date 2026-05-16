/* ============================================
   ELEMENTS
   ============================================ */

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const savedIndicator = document.getElementById("savedIndicator");
const toast = document.getElementById("toast");

// Dropdown Elements
const colorDropdown = document.getElementById("colorDropdown");
const highlightDropdown = document.getElementById("highlightDropdown");
const sizeDropdown = document.getElementById("sizeDropdown");
const shapesDropdown = document.getElementById("shapesDropdown");
const shapeColorDropdown = document.getElementById("shapeColorDropdown");

// Button Elements
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const changeColorBtn = document.getElementById("changeColorBtn");
const highlightBtn = document.getElementById("highlightBtn");
const changeSizeBtn = document.getElementById("changeSizeBtn");
const shapesBtn = document.getElementById("shapesBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const clearNoteBtn = document.getElementById("clearNoteBtn");

/* ============================================
   UNDO/REDO SYSTEM
   ============================================ */

class UndoRedoManager {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
  }

  save(content) {
    this.historyIndex++;
    if (this.historyIndex < this.history.length) {
      this.history = this.history.slice(0, this.historyIndex);
    }
    this.history.push(content);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }
    updateHistoryButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return null;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    return null;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }
}

const undoRedoManager = new UndoRedoManager();

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function updateCharAndWordCount() {
  const text = noteContent.innerText || "";
  charCount.textContent = text.length;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  wordCount.textContent = words || 0;
}

function updateHistoryButtons() {
  undoBtn.style.opacity = undoRedoManager.canUndo() ? "1" : "0.5";
  redoBtn.style.opacity = undoRedoManager.canRedo() ? "1" : "0.5";
}

function updateUndoRedoHistory() {
  undoRedoManager.save(noteContent.innerHTML);
  updateHistoryButtons();
  updateCharAndWordCount();
  saveNoteToLocal();
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function markAsUnsaved() {
  savedIndicator.textContent = "● Unsaved changes";
  savedIndicator.classList.add("unsaved");
}

function markAsSaved() {
  savedIndicator.textContent = "✓ Saved";
  savedIndicator.classList.remove("unsaved");
}

function getCaretCoordinates() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return { x: 0, y: 0 };

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  range.insertNode(span);
  const { top, left } = span.getBoundingClientRect();
  span.parentNode.removeChild(span);

  return { x: left, y: top };
}

function positionDropdown(dropdown, trigger) {
  const rect = trigger.getBoundingClientRect();
  dropdown.style.left = rect.left + "px";
  dropdown.style.top = rect.bottom + 10 + "px";
}

function hideAllDropdowns() {
  colorDropdown.classList.remove("visible");
  highlightDropdown.classList.remove("visible");
  sizeDropdown.classList.remove("visible");
  shapesDropdown.classList.remove("visible");
  shapeColorDropdown.classList.remove("visible");
}

/* ============================================
   FORMATTING FUNCTIONS
   ============================================ */

function applyFormat(command, value = null) {
  document.execCommand(command, false, value);
  noteContent.focus();
  updateUndoRedoHistory();
}

function formatSelectedText(tag, styles = {}) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    showToast("Select text first!", "warning");
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();

  if (!selectedText) {
    showToast("Please select text to format", "warning");
    return;
  }

  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  element.textContent = selectedText;

  range.deleteContents();
  range.insertNode(element);
  range.selectNode(element);
  selection.removeAllRanges();
  selection.addRange(range);

  updateUndoRedoHistory();
}

/* ============================================
   BOLD, ITALIC, UNDERLINE
   ============================================ */

boldBtn.addEventListener("click", () => {
  applyFormat("bold");
  boldBtn.style.background = "rgba(255, 255, 255, 0.4)";
  setTimeout(() => {
    boldBtn.style.background = "rgba(255, 255, 255, 0.2)";
  }, 200);
});

italicBtn.addEventListener("click", () => {
  applyFormat("italic");
  italicBtn.style.background = "rgba(255, 255, 255, 0.4)";
  setTimeout(() => {
    italicBtn.style.background = "rgba(255, 255, 255, 0.2)";
  }, 200);
});

underlineBtn.addEventListener("click", () => {
  applyFormat("underline");
  underlineBtn.style.background = "rgba(255, 255, 255, 0.4)";
  setTimeout(() => {
    underlineBtn.style.background = "rgba(255, 255, 255, 0.2)";
  }, 200);
});

/* ============================================
   SHAPES
   ============================================ */

let currentShapeColor = "black";
let selectedShape = null;

shapesBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideAllDropdowns();
  positionDropdown(shapesDropdown, shapesBtn);
  shapesDropdown.classList.toggle("visible");
});

shapesDropdown.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button || !button.dataset.shape) {
    return;
  }

  const shapeType = button.dataset.shape;

  // Create dropdown menu immediately with shape selection
  hideAllDropdowns();
  
  // Position and show color picker
  positionDropdown(shapeColorDropdown, e.target);
  shapeColorDropdown.classList.add("visible");
  
  // Store shape type for when color is selected
  shapeColorDropdown.dataset.pendingShape = shapeType;
});

shapeColorDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  currentShapeColor = e.target.dataset.color;
  const shapeType = shapeColorDropdown.dataset.pendingShape;

  if (shapeType) {
    createShape(shapeType, currentShapeColor);
    showToast(`${shapeType} added!`);
  }

  hideAllDropdowns();
});

function createShape(shapeType, color) {
  const shapeDiv = document.createElement("div");
  shapeDiv.className = "note-shape";
  shapeDiv.draggable = true;
  shapeDiv.style.width = "50px";
  shapeDiv.style.height = "50px";

  // Create shape element
  let shapeElement;

  if (shapeType === "star") {
    shapeElement = document.createElement("div");
    shapeElement.className = `shape-${shapeType}`;
    shapeElement.innerHTML = "★";
    shapeElement.style.color = color;
    shapeElement.style.fontSize = "2.5rem";
  } else if (shapeType === "heart") {
    shapeElement = document.createElement("div");
    shapeElement.className = `shape-${shapeType}`;
    shapeElement.style.background = color;
    shapeElement.style.position = "relative";
    shapeElement.style.width = "50px";
    shapeElement.style.height = "50px";
    // Add a child div for the bottom point
    const point = document.createElement("div");
    point.style.position = "absolute";
    point.style.bottom = "-10px";
    point.style.left = "50%";
    point.style.transform = "translateX(-50%)";
    point.style.width = "0";
    point.style.height = "0";
    point.style.borderLeft = "15px solid transparent";
    point.style.borderRight = "15px solid transparent";
    point.style.borderTop = `15px solid ${color}`;
    shapeElement.appendChild(point);
  } else {
    shapeElement = document.createElement("div");
    shapeElement.className = `shape-${shapeType}`;
    shapeElement.style.background = color;
    shapeElement.style.width = "100%";
    shapeElement.style.height = "100%";
  }

  shapeDiv.appendChild(shapeElement);

  // Store color on the shape for resizing
  shapeDiv.dataset.shapeColor = color;
  shapeDiv.dataset.shapeType = shapeType;

  // Add drag functionality
  let isDragging = false;
  let offsetX, offsetY;

  shapeDiv.addEventListener("dragstart", (e) => {
    isDragging = true;
    offsetX = e.clientX - shapeDiv.getBoundingClientRect().left;
    offsetY = e.clientY - shapeDiv.getBoundingClientRect().top;
    e.dataTransfer.effectAllowed = "move";
    shapeDiv.style.opacity = "0.7";
  });

  shapeDiv.addEventListener("dragend", () => {
    isDragging = false;
    shapeDiv.style.opacity = "1";
  });

  // Click to select
  shapeDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".note-shape").forEach(s => s.classList.remove("selected"));
    shapeDiv.classList.add("selected");
    selectedShape = shapeDiv;
  });

  // Right-click to delete
  shapeDiv.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (confirm("Delete this shape?")) {
      shapeDiv.remove();
      selectedShape = null;
      updateUndoRedoHistory();
      showToast("Shape deleted");
    }
  });

  // Add double-click to resize
  shapeDiv.addEventListener("dblclick", () => {
    const sizes = ["30px", "50px", "70px", "90px", "120px"];
    const currentSize = shapeDiv.style.width;
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];

    shapeDiv.style.width = newSize;
    shapeDiv.style.height = newSize;
    updateUndoRedoHistory();
    showToast(`Size: ${newSize}`);
  });

  // Insert into note
  noteContent.appendChild(shapeDiv);
  updateUndoRedoHistory();
}

// Delete selected shape with Delete key
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && selectedShape) {
    if (confirm("Delete this shape?")) {
      selectedShape.remove();
      selectedShape = null;
      updateUndoRedoHistory();
      showToast("Shape deleted");
    }
  }
});

/* ============================================
   TEXT COLOR
   ============================================ */

changeColorBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideAllDropdowns();
  positionDropdown(colorDropdown, changeColorBtn);
  colorDropdown.classList.toggle("visible");
});

colorDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const color = e.target.dataset.color;
  formatSelectedText("span", { color: color });
  hideAllDropdowns();
  showToast(`Color applied: ${color}`);
});

/* ============================================
   HIGHLIGHT
   ============================================ */

highlightBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideAllDropdowns();
  positionDropdown(highlightDropdown, highlightBtn);
  highlightDropdown.classList.toggle("visible");
});

highlightDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const highlight = e.target.dataset.highlight;
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    showToast("Select text first!", "warning");
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();

  if (!selectedText) {
    showToast("Please select text to highlight", "warning");
    return;
  }

  if (highlight === "none") {
    const span = document.createElement("span");
    span.textContent = selectedText;
    range.deleteContents();
    range.insertNode(span);
  } else {
    const mark = document.createElement("mark");
    mark.style.backgroundColor = e.target.style.backgroundColor;
    mark.textContent = selectedText;
    range.deleteContents();
    range.insertNode(mark);
  }

  updateUndoRedoHistory();
  hideAllDropdowns();
  showToast("Highlight applied");
});

/* ============================================
   TEXT SIZE
   ============================================ */

changeSizeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideAllDropdowns();
  positionDropdown(sizeDropdown, changeSizeBtn);
  sizeDropdown.classList.toggle("visible");
});

sizeDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const size = e.target.dataset.size;
  formatSelectedText("span", { fontSize: size });
  hideAllDropdowns();
  showToast(`Size: ${size}`);
});

/* ============================================
   UNDO/REDO
   ============================================ */

undoBtn.addEventListener("click", () => {
  const previousContent = undoRedoManager.undo();
  if (previousContent !== null) {
    noteContent.innerHTML = previousContent;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Undo");
  }
});

redoBtn.addEventListener("click", () => {
  const nextContent = undoRedoManager.redo();
  if (nextContent !== null) {
    noteContent.innerHTML = nextContent;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Redo");
  }
});

/* ============================================
   SAVE AS PDF
   ============================================ */

saveNoteBtn.addEventListener("click", async () => {
  if (!noteTitle.value && !noteContent.innerText) {
    showToast("No content to save!", "error");
    return;
  }

  try {
    saveNoteBtn.style.opacity = "0.5";
    const noteSection = document.querySelector(".note-paper");
    const canvas = await html2canvas(noteSection, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);

    const fileName = noteTitle.value
      ? `${noteTitle.value}.pdf`
      : "MyNote.pdf";
    pdf.save(fileName);

    showToast("PDF saved successfully!");
  } catch (error) {
    showToast("Failed to save PDF", "error");
    console.error(error);
  } finally {
    saveNoteBtn.style.opacity = "1";
  }
});

/* ============================================
   CLEAR NOTE
   ============================================ */

clearNoteBtn.addEventListener("click", () => {
  if (confirm("🤔 Are you sure? This action cannot be undone.")) {
    noteTitle.value = "";
    noteContent.innerHTML = "";
    localStorage.removeItem("myNote");
    undoRedoManager.history = [];
    undoRedoManager.historyIndex = -1;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Note cleared");
  }
});

/* ============================================
   LOCAL STORAGE
   ============================================ */

let autoSaveTimeout;

function saveNoteToLocal() {
  markAsUnsaved();
  clearTimeout(autoSaveTimeout);

  autoSaveTimeout = setTimeout(() => {
    const noteData = {
      title: noteTitle.value,
      content: noteContent.innerHTML,
    };
    localStorage.setItem("myNote", JSON.stringify(noteData));
    markAsSaved();
  }, 1000);
}

function loadNoteFromLocal() {
  const saved = localStorage.getItem("myNote");
  if (saved) {
    try {
      const noteData = JSON.parse(saved);
      noteTitle.value = noteData.title || "";
      noteContent.innerHTML = noteData.content || "";
      undoRedoManager.save(noteContent.innerHTML);
      updateCharAndWordCount();
      markAsSaved();
    } catch (error) {
      console.error("Error loading note:", error);
    }
  }
}

function updateUndoRedoHistory() {
  undoRedoManager.save(noteContent.innerHTML);
  updateHistoryButtons();
  updateCharAndWordCount();
  saveNoteToLocal();
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

noteTitle.addEventListener("input", saveNoteToLocal);
noteContent.addEventListener("input", () => {
  updateCharAndWordCount();
  updateUndoRedoHistory();
});

noteContent.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undoBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "y") {
    e.preventDefault();
    redoBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "b") {
    e.preventDefault();
    boldBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "i") {
    e.preventDefault();
    italicBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "u") {
    e.preventDefault();
    underlineBtn.click();
  }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".main-nav")) {
    hideAllDropdowns();
  }
});

// Deselect shapes when clicking on note area
noteContent.addEventListener("click", (e) => {
  if (!e.target.closest(".note-shape")) {
    document.querySelectorAll(".note-shape").forEach(s => s.classList.remove("selected"));
    selectedShape = null;
  }
});

/* ============================================
   INITIALIZATION
   ============================================ */

window.addEventListener("load", () => {
  loadNoteFromLocal();
  updateCharAndWordCount();
  updateHistoryButtons();
});

// Keyboard shortcuts hint
console.log(
  "%c✨ Echo Notes - Keyboard Shortcuts",
  "color: #667eea; font-size: 16px; font-weight: bold"
);
console.log("%cCtrl+Z / Cmd+Z → Undo", "color: #667eea");
console.log("%cCtrl+Y / Cmd+Y → Redo", "color: #667eea");
console.log("%cCtrl+B / Cmd+B → Bold", "color: #667eea");
console.log("%cCtrl+I / Cmd+I → Italic", "color: #667eea");
console.log("%cCtrl+U / Cmd+U → Underline", "color: #667eea");
console.log(
  "%c\n🎨 Shapes Features:",
  "color: #667eea; font-size: 14px; font-weight: bold"
);
console.log(
  "%cDouble-click shape → Resize\nRight-click → Delete\nDelete key → Remove selected shape\nDrag → Move shape",
  "color: #667eea"
);

