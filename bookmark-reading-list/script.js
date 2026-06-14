// LocalStorage Persistence Mapping Pipeline Key
const STORAGE_KEY = "keyguard_reading_list_dataset";

let bookItemsList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let activeFilterState = "all";

const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const linkInput = document.getElementById("book-link");

const readingListElement = document.getElementById("reading-list-element");
const emptyState = document.getElementById("empty-state");

const countAll = document.getElementById("count-all");
const countReading = document.getElementById("count-reading");
const countCompleted = document.getElementById("count-completed");

function saveAndRenderPipeline() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookItemsList));
  updateMetricsCounters();
  renderListViewport();
}

function updateMetricsCounters() {
  const total = bookItemsList.length;
  const reading = bookItemsList.filter((b) => b.status === "reading").length;
  const completed = bookItemsList.filter(
    (b) => b.status === "completed",
  ).length;

  countAll.textContent = total;
  countReading.textContent = reading;
  countCompleted.textContent = completed;
}

function renderListViewport() {
  readingListElement.innerHTML = "";

  // Filter down array records according to active tab select state flags
  const filteredCollection = bookItemsList.filter((book) => {
    if (activeFilterState === "reading") return book.status === "reading";
    if (activeFilterState === "completed") return book.status === "completed";
    return true;
  });

  if (filteredCollection.length === 0) {
    emptyState.classList.remove("hide");
    return;
  }
  emptyState.classList.add("hide");

  filteredCollection.forEach((book) => {
    const cardLi = document.createElement("li");
    cardLi.className = `book-card ${book.status}`;

    // Form link tag conditionally depending on field completion parameters
    const titleTagMarkup = book.url
      ? `<a href="${book.url}" target="_blank" class="book-title-text has-url">${book.title}</a>`
      : `<span class="book-title-text">${book.title}</span>`;

    const actionBtnLabel =
      book.status === "completed" ? "✓ Completed" : "Mark Read";

    cardLi.innerHTML = `
            <div class="book-info-block">
                ${titleTagMarkup}
                <span class="book-author-text">by ${book.author}</span>
            </div>
            <div class="card-actions-row">
                <button class="status-btn" onclick="toggleBookStatus(${book.id})">${actionBtnLabel}</button>
                <button class="delete-btn" onclick="deleteBookItem(${book.id})" title="Remove item">🗑️</button>
            </div>
        `;
    readingListElement.appendChild(cardLi);
  });
}

// CREATE Operations Handler
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newBookRecord = {
    id: Date.now(), // Unique structural execution timestamp ID mapping
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    url: linkInput.value.trim() || null,
    status: "reading", // Base active operational starting state parameter
  };

  bookItemsList.unshift(newBookRecord); // Insert newest records directly at top position
  bookForm.reset();
  saveAndRenderPipeline();
});

// UPDATE Operations Handler
window.toggleBookStatus = function (bookId) {
  bookItemsList = bookItemsList.map((book) => {
    if (book.id === bookId) {
      return {
        ...book,
        status: book.status === "reading" ? "completed" : "reading",
      };
    }
    return book;
  });
  saveAndRenderPipeline();
};

// DELETE Operations Handler
window.deleteBookItem = function (bookId) {
  bookItemsList = bookItemsList.filter((book) => book.id !== bookId);
  saveAndRenderPipeline();
};

// Tab Switching Interaction Setup Loop
document.querySelectorAll(".filter-tab").forEach((tabButton) => {
  tabButton.addEventListener("click", (e) => {
    document.querySelector(".filter-tab.active").classList.remove("active");

    // Safely extract event pointer layer details
    const selectedTab = e.currentTarget;
    selectedTab.classList.add("active");
    activeFilterState = selectedTab.getAttribute("data-filter");

    renderListViewport();
  });
});

// Run immediate data model assembly parsing loops on initial boot
saveAndRenderPipeline();
