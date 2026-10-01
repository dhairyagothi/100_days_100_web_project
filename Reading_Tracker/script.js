// script.js

// Data storage
let books = [];
let yearlyGoal = 20;
let currentYear = new Date().getFullYear();

// Load data from localStorage
function loadData() {
  const savedBooks = localStorage.getItem("books");
  if (savedBooks) {
    books = JSON.parse(savedBooks);
  }

  const savedGoal = localStorage.getItem("yearlyGoal");
  if (savedGoal) {
    yearlyGoal = parseInt(savedGoal);
  }

  renderAll();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("yearlyGoal", yearlyGoal);
}

// Generate unique ID
function generateId() {
  return "book-" + Date.now();
}

// Render all sections
function renderAll() {
  renderBooks();
  renderDashboard();
  renderGoals();
  renderBorrowedLent();
}

// Show specific section
function showSection(section) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.add("d-none");
  });

  document.getElementById(section + "-section").classList.remove("d-none");

  // Update active nav
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.id === "nav-" + section) {
      link.classList.add("active");
    }
  });

  if (section === "library") renderBooks();
  if (section === "dashboard") renderDashboard();
  if (section === "goals") renderGoals();
  if (section === "borrowed") renderBorrowedLent();
}

// Render books grid
function renderBooks(filteredBooks = books) {
  const container = document.getElementById("booksGrid");
  container.innerHTML = "";

  if (filteredBooks.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-book display-1 text-muted"></i>
                <p class="text-muted mt-3">No books found. Add some to get started!</p>
            </div>`;
    return;
  }

  filteredBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-lg-3";
    card.innerHTML = `
            <div class="card book-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(book.title)}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${escapeHtml(book.author)}</h6>
                    <p class="card-text">
                        <span class="badge bg-${getStatusColor(book.status)}">${book.status}</span><br>
                        <small class="text-muted">${book.genre}</small>
                    </p>
                    ${book.person ? `<p class="mb-1"><small><strong>${book.ownership}:</strong> ${escapeHtml(book.person)}</small></p>` : ""}
                    ${book.notes ? `<p class="card-text small text-muted">${escapeHtml(book.notes.substring(0, 80))}${book.notes.length > 80 ? "..." : ""}</p>` : ""}
                </div>
                <div class="card-footer d-flex justify-content-between bg-transparent border-0">
                    <button class="btn btn-sm btn-outline-primary" onclick="editBook('${book.id}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteBook('${book.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

// Helper to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    ? unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    : "";
}

// Get color for status badge
function getStatusColor(status) {
  if (status === "Completed") return "success";
  if (status === "Currently Reading") return "primary";
  return "secondary";
}

// Filter books
let currentFilter = "all";

function filterByStatus(status) {
  currentFilter = status;
  filterBooks();
}

function filterBooks() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  let filtered = books;

  // Status filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((book) => book.status === currentFilter);
  }

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (book) =>
        (book.title && book.title.toLowerCase().includes(searchTerm)) ||
        (book.author && book.author.toLowerCase().includes(searchTerm)) ||
        (book.genre && book.genre.toLowerCase().includes(searchTerm)),
    );
  }

  renderBooks(filtered);
}

// Save or update book
function saveBook() {
  const id = document.getElementById("bookId").value;
  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const genre = document.getElementById("bookGenre").value;
  const status = document.getElementById("bookStatus").value;
  const ownership = document.getElementById("bookOwnership").value;
  const person = document.getElementById("bookPerson").value.trim();
  const notes = document.getElementById("bookNotes").value.trim();

  if (!title || !author) {
    alert("Title and Author are required!");
    return;
  }

  if (id) {
    // Edit existing book
    const book = books.find((b) => b.id === id);
    if (book) {
      book.title = title;
      book.author = author;
      book.genre = genre;
      book.status = status;
      book.ownership = ownership;
      book.person = person || null;
      book.notes = notes;
    }
  } else {
    // Add new book
    const newBook = {
      id: generateId(),
      title,
      author,
      genre,
      status,
      ownership,
      person: person || null,
      notes,
      dateAdded: new Date().toISOString(),
    };
    books.push(newBook);
  }

  saveData();
  renderAll();

  // Close modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("bookModal"),
  );
  if (modal) modal.hide();
}

// Edit book
function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  document.getElementById("bookId").value = book.id;
  document.getElementById("bookTitle").value = book.title || "";
  document.getElementById("bookAuthor").value = book.author || "";
  document.getElementById("bookGenre").value = book.genre || "Fiction";
  document.getElementById("bookStatus").value = book.status || "To Read";
  document.getElementById("bookOwnership").value = book.ownership || "Owned";
  document.getElementById("bookPerson").value = book.person || "";
  document.getElementById("bookNotes").value = book.notes || "";

  document.getElementById("modalTitle").textContent = "Edit Book";

  const modal = new bootstrap.Modal(document.getElementById("bookModal"));
  modal.show();
}

// Delete book
let bookToDelete = null;

function deleteBook(id) {
  bookToDelete = id;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

// Confirm delete listener
document.getElementById("confirmDelete").addEventListener("click", () => {
  if (bookToDelete) {
    books = books.filter((b) => b.id !== bookToDelete);
    saveData();
    renderAll();
    bookToDelete = null;
  }
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("deleteModal"),
  );
  if (modal) modal.hide();
});

// Reset form for new book
function resetBookForm() {
  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  document.getElementById("modalTitle").textContent = "Add New Book";
}

// Dashboard rendering
function renderDashboard() {
  const completed = books.filter((b) => b.status === "Completed").length;
  const reading = books.filter((b) => b.status === "Currently Reading").length;
  const total = books.length;

  document.getElementById("booksReadCount").textContent = completed;
  document.getElementById("currentReadingCount").textContent = reading;
  document.getElementById("totalBooksCount").textContent = total;

  // Goal progress
  const progress =
    yearlyGoal > 0
      ? Math.min(Math.round((completed / yearlyGoal) * 100), 100)
      : 0;
  const progressBar = document.getElementById("goalProgressBar");
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${progress}%`;
  document.getElementById("goalProgressText").textContent =
    `${completed} / ${yearlyGoal} books`;
  document.getElementById("goalYear").textContent = currentYear;

  // Recent activity (last 5)
  const recent = [...books]
    .sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0))
    .slice(0, 5);

  const activityContainer = document.getElementById("recentActivity");
  activityContainer.innerHTML = "";

  if (recent.length === 0) {
    activityContainer.innerHTML =
      '<p class="text-muted">No activity yet. Add some books!</p>';
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "list-group list-group-flush";

  recent.forEach((book) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
            <div>
                <strong>${escapeHtml(book.title)}</strong><br>
                <small class="text-muted">${escapeHtml(book.author)} • ${book.status}</small>
            </div>
            <span class="badge bg-${getStatusColor(book.status)}">${book.status}</span>
        `;
    ul.appendChild(li);
  });

  activityContainer.appendChild(ul);
}

// Goals section
function renderGoals() {
  const completed = books.filter((b) => b.status === "Completed").length;
  const progress =
    yearlyGoal > 0
      ? Math.min(Math.round((completed / yearlyGoal) * 100), 100)
      : 0;

  const container = document.getElementById("goalsStats");
  container.innerHTML = `
        <div class="alert alert-info">
            <h5>Current Progress: ${completed} of ${yearlyGoal} books</h5>
            <div class="progress mb-3" style="height: 30px;">
                <div class="progress-bar bg-success" style="width: ${progress}%">${progress}%</div>
            </div>
        </div>
    `;
}

function setYearlyGoal() {
  const input = document.getElementById("yearlyGoalInput");
  const newGoal = parseInt(input.value);
  if (newGoal && newGoal > 0) {
    yearlyGoal = newGoal;
    saveData();
    renderDashboard();
    renderGoals();
    alert("Yearly goal updated successfully!");
  } else {
    alert("Please enter a valid number greater than 0.");
  }
}

// Borrowed / Lent section
function renderBorrowedLent() {
  const borrowedContainer = document.getElementById("borrowedList");
  const lentContainer = document.getElementById("lentList");

  borrowedContainer.innerHTML = "";
  lentContainer.innerHTML = "";

  const borrowed = books.filter((b) => b.ownership === "Borrowed");
  const lent = books.filter((b) => b.ownership === "Lent");

  if (borrowed.length === 0) {
    borrowedContainer.innerHTML =
      '<div class="list-group-item text-muted">No borrowed books yet.</div>';
  } else {
    borrowed.forEach((book) => {
      borrowedContainer.appendChild(createBorrowItem(book));
    });
  }

  if (lent.length === 0) {
    lentContainer.innerHTML =
      '<div class="list-group-item text-muted">No lent books yet.</div>';
  } else {
    lent.forEach((book) => {
      lentContainer.appendChild(createBorrowItem(book));
    });
  }
}

function createBorrowItem(book) {
  const div = document.createElement("div");
  div.className = "list-group-item";
  div.innerHTML = `
        <div class="d-flex w-100 justify-content-between align-items-center">
            <div>
                <h6 class="mb-1">${escapeHtml(book.title)}</h6>
                <p class="mb-1 text-muted">${escapeHtml(book.author)}</p>
                ${book.person ? `<small><strong>With:</strong> ${escapeHtml(book.person)}</small>` : ""}
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="editBook('${book.id}')">Edit</button>
        </div>
    `;
  return div;
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  showSection("library");

  // Handle delete modal cleanup
  const deleteModalEl = document.getElementById("deleteModal");
  deleteModalEl.addEventListener("hidden.bs.modal", () => {
    bookToDelete = null;
  });
});
