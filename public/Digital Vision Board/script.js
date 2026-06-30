let items = [];
let currentEditId = null;
let currentFilter = null;

// DOM Elements
const visionBoard = document.getElementById("visionBoard");
const emptyState = document.getElementById("emptyState");
const categoryList = document.getElementById("categoryList");
const totalItemsEl = document.getElementById("totalItems");
const lastSavedEl = document.getElementById("lastSaved");

// Load from LocalStorage
function loadBoard() {
  const savedItems = localStorage.getItem("visionBoard");
  if (savedItems) {
    items = JSON.parse(savedItems);
    renderBoard();
  }
  updateStats();
}

// Save to LocalStorage
function saveBoard() {
  localStorage.setItem("visionBoard", JSON.stringify(items));
  lastSavedEl.textContent = new Date().toLocaleTimeString();
  updateStats();
}

// Render all items
function renderBoard(filterCategory = null) {
  visionBoard.innerHTML = "";

  const filteredItems = filterCategory
    ? items.filter((item) => item.category === filterCategory)
    : items;

  filteredItems.forEach((item) => {
    const element = createBoardItem(item);
    visionBoard.appendChild(element);
  });

  emptyState.style.display = items.length === 0 ? "block" : "none";
}

// Create board item element
function createBoardItem(item) {
  const div = document.createElement("div");
  div.className = `board-item ${item.type}-item`;
  div.dataset.id = item.id;
  div.style.left = `${item.x}px`;
  div.style.top = `${item.y}px`;

  let html = "";

  if (item.type === "image" && item.imageData) {
    html = `
            <img src="${item.imageData}" alt="${item.title}">
            <div class="category-tag">${item.category}</div>
        `;
  } else {
    html = `
            <h6>${item.title}</h6>
            <p>${item.content || ""}</p>
            <div class="category-tag">${item.category}</div>
        `;
  }

  html += `<span class="delete-btn" onclick="deleteItem('${item.id}')">×</span>`;
  div.innerHTML = html;

  // Make draggable
  makeDraggable(div);

  // Double-click to edit
  div.addEventListener("dblclick", () => editItem(item.id));

  return div;
}

// Drag & Drop functionality
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (e.target.classList.contains("delete-btn")) return;

    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;

    // Keep item inside board
    const boardRect = visionBoard.getBoundingClientRect();
    newLeft = Math.max(
      20,
      Math.min(newLeft, boardRect.width - element.offsetWidth - 20),
    );
    newTop = Math.max(
      20,
      Math.min(newTop, boardRect.height - element.offsetHeight - 20),
    );

    element.style.top = `${newTop}px`;
    element.style.left = `${newLeft}px`;
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    const id = element.dataset.id;
    const item = items.find((i) => i.id === id);
    if (item) {
      item.x = parseFloat(element.style.left);
      item.y = parseFloat(element.style.top);
      saveBoard();
    }
  }
}

// Save or update item
function saveItem() {
  const type = document.querySelector('input[name="itemType"]:checked').value;
  const title = document.getElementById("itemTitle").value.trim();
  const category = document.getElementById("itemCategory").value;
  const content = document.getElementById("itemContent").value.trim();
  const fileInput = document.getElementById("itemImage");

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  let imageData = null;

  if (type === "image" && fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageData = e.target.result;
      processSave();
    };
    reader.readAsDataURL(fileInput.files[0]);
    return;
  }

  processSave();

  function processSave() {
    if (currentEditId) {
      const item = items.find((i) => i.id === currentEditId);
      if (item) {
        item.title = title;
        item.category = category;
        item.content = content;
        item.type = type;
        if (imageData) item.imageData = imageData;
      }
    } else {
      const newItem = {
        id: "item_" + Date.now(),
        type: type,
        title: title,
        category: category,
        content: content,
        imageData: imageData,
        x: Math.random() * 500 + 80,
        y: Math.random() * 300 + 80,
      };
      items.push(newItem);
    }

    closeModal();
    renderBoard(currentFilter);
    saveBoard();
  }
}

// Edit existing item
function editItem(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;

  currentEditId = id;
  document.getElementById("modalTitle").textContent = "Edit Item";

  document.querySelector(
    `input[name="itemType"][value="${item.type}"]`,
  ).checked = true;
  document.getElementById("itemTitle").value = item.title;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemContent").value = item.content || "";

  const modal = new bootstrap.Modal(document.getElementById("addItemModal"));
  modal.show();
}

// Delete item
function deleteItem(id) {
  if (confirm("Delete this item?")) {
    items = items.filter((item) => item.id !== id);
    renderBoard(currentFilter);
    saveBoard();
  }
}

// Close modal and reset
function closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addItemModal"),
  );
  if (modal) modal.hide();

  document.getElementById("itemForm").reset();
  document.getElementById("imagePreview").classList.add("d-none");
  currentEditId = null;
  document.getElementById("modalTitle").textContent = "Add New Item";
}

// Update category sidebar
function updateCategoryList() {
  const categories = {};
  items.forEach((item) => {
    categories[item.category] = (categories[item.category] || 0) + 1;
  });

  let html = `<div class="category-item active" onclick="filterCategory(null)">All Items <span class="badge">${items.length}</span></div>`;

  Object.keys(categories)
    .sort()
    .forEach((cat) => {
      html += `
            <div class="category-item" onclick="filterCategory('${cat}')">
                ${cat} <span class="badge">${categories[cat]}</span>
            </div>
        `;
    });

  categoryList.innerHTML = html;
}

// Filter items by category
function filterCategory(category) {
  currentFilter = category;
  renderBoard(category);

  document.querySelectorAll(".category-item").forEach((el) => {
    const isActive =
      (category === null && el.textContent.includes("All Items")) ||
      (category && el.textContent.includes(category));
    el.classList.toggle("active", isActive);
  });
}

// Update stats
function updateStats() {
  totalItemsEl.textContent = items.length;
  updateCategoryList();
}

// Clear entire board
function clearBoard() {
  if (confirm("Clear the entire vision board? This action cannot be undone.")) {
    items = [];
    localStorage.removeItem("visionBoard");
    renderBoard();
    saveBoard();
  }
}

// Export board as JSON
function exportBoard() {
  if (items.length === 0) {
    alert("Board is empty!");
    return;
  }

  const dataStr = JSON.stringify(items, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const fileName = `vision-board-${new Date().toISOString().slice(0, 10)}.json`;

  const link = document.createElement("a");
  link.href = dataUri;
  link.download = fileName;
  link.click();
}

// Randomize item positions
function randomizeLayout() {
  if (items.length === 0) return;

  items.forEach((item) => {
    const maxX = visionBoard.offsetWidth - 280;
    const maxY = visionBoard.offsetHeight - 220;
    item.x = Math.max(30, Math.random() * maxX);
    item.y = Math.max(30, Math.random() * maxY);
  });

  renderBoard(currentFilter);
  saveBoard();
}

// Image preview handler
document.getElementById("itemImage").addEventListener("change", function (e) {
  const previewContainer = document.getElementById("imagePreview");
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      previewContainer.querySelector("img").src = event.target.result;
      previewContainer.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadBoard();

  const modalEl = document.getElementById("addItemModal");
  modalEl.addEventListener("hidden.bs.modal", closeModal);

  // Keyboard shortcut: Press N to add new item
  document.addEventListener("keydown", (e) => {
    if (
      e.key.toLowerCase() === "n" &&
      document.activeElement.tagName !== "TEXTAREA" &&
      document.activeElement.tagName !== "INPUT"
    ) {
      const modal = new bootstrap.Modal(
        document.getElementById("addItemModal"),
      );
      modal.show();
    }
  });
});
