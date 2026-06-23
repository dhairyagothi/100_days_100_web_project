let books = JSON.parse(localStorage.getItem("books")) || [];

const goal = 20;

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function addBook() {

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const status = document.getElementById("status").value;
    const progress = document.getElementById("progress").value;

    if (!title || !author) {
        alert("Please enter title and author.");
        return;
    }

    books.push({
        id: Date.now(),
        title,
        author,
        genre,
        status,
        progress
    });

    saveBooks();
    renderBooks();

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
}

function deleteBook(id) {

    books = books.filter(book => book.id !== id);

    saveBooks();
    renderBooks();
}

function editBook(id) {

    const book = books.find(book => book.id === id);

    const title = prompt("Edit Title", book.title);

    if (!title) return;

    book.title = title;

    saveBooks();
    renderBooks();
}

function renderBooks() {

    const container = document.getElementById("bookList");

    const search =
        document.getElementById("search").value.toLowerCase();

    const statusFilter =
        document.getElementById("filterStatus").value;

    const genreFilter =
        document.getElementById("filterGenre").value.toLowerCase();

    let filtered = books.filter(book => {

        return (
            book.title.toLowerCase().includes(search) &&
            book.genre.toLowerCase().includes(genreFilter) &&
            (statusFilter === "" || book.status === statusFilter)
        );

    });

    container.innerHTML = "";

    filtered.forEach(book => {

        container.innerHTML += `
        <div class="col-md-6">

            <div class="book-card">

                <h4>${book.title}</h4>

                <p><strong>Author:</strong> ${book.author}</p>

                <p><strong>Genre:</strong> ${book.genre}</p>

                <p><strong>Status:</strong> ${book.status}</p>

                <div class="progress mb-3">

                    <div
                        class="progress-bar"
                        style="width:${book.progress}%">
                    </div>

                </div>

                <div class="actions">

                    <button
                        class="btn btn-warning"
                        onclick="editBook(${book.id})">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteBook(${book.id})">
                        Delete
                    </button>

                </div>

            </div>

        </div>
        `;
    });

    updateStats();
}

function updateStats() {

    const total = books.length;

    const completed =
        books.filter(book => book.status === "Completed").length;

    document.getElementById("totalBooks").textContent = total;

    document.getElementById("completedBooks").textContent = completed;

    document.getElementById("goalProgress").textContent =
        Math.round((completed / goal) * 100) + "%";
}

document.getElementById("search")
.addEventListener("input", renderBooks);

document.getElementById("filterStatus")
.addEventListener("change", renderBooks);

document.getElementById("filterGenre")
.addEventListener("input", renderBooks);

renderBooks();