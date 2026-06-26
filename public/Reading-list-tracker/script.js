let books = JSON.parse(localStorage.getItem("books")) || [];

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function addBook() {

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const status = document.getElementById("status").value;
    const progress = document.getElementById("progress").value;

    if (!title || !author) return;

    books.push({
        title,
        author,
        genre,
        status,
        progress
    });

    saveBooks();
    displayBooks();
}

function deleteBook(index) {
    books.splice(index, 1);
    saveBooks();
    displayBooks();
}

function editBook(index) {

    document.getElementById("title").value =
        books[index].title;

    document.getElementById("author").value =
        books[index].author;

    document.getElementById("genre").value =
        books[index].genre;

    document.getElementById("status").value =
        books[index].status;

    document.getElementById("progress").value =
        books[index].progress;

    books.splice(index, 1);

    saveBooks();
    displayBooks();
}

function updateStats() {

    document.getElementById("total").innerText =
        books.length;

    document.getElementById("reading").innerText =
        books.filter(book => book.status === "Reading").length;

    document.getElementById("completed").innerText =
        books.filter(book => book.status === "Completed").length;
}

function updateGenres() {

    const filter = document.getElementById("filter");

    filter.innerHTML =
        '<option value="all">All Genres</option>';

    [...new Set(books.map(book => book.genre))]
        .forEach(g => {
            filter.innerHTML +=
                `<option value="${g}">${g}</option>`;
        });
}

function displayBooks() {

    const list = document.getElementById("bookList");

    const search =
        document.getElementById("search").value.toLowerCase();

    const genre =
        document.getElementById("filter").value;

    let filtered = books.filter(book =>
        book.title.toLowerCase().includes(search)
    );

    if (genre !== "all") {
        filtered = filtered.filter(
            book => book.genre === genre
        );
    }

    list.innerHTML = "";

    if (filtered.length === 0) {
        list.innerHTML =
            `<div class="empty">
                No books found.
             </div>`;
    }

    filtered.forEach((book, index) => {

        list.innerHTML += `
        <div class="col-md-4">

            <div class="card p-3 book-card">

                <h4>${book.title}</h4>

                <p><strong>Author:</strong>
                ${book.author}</p>

                <p><strong>Genre:</strong>
                ${book.genre}</p>

                <span class="badge bg-primary">
                ${book.status}
                </span>

                <div class="progress mt-3">
                    <div class="progress-bar"
                        style="width:${book.progress}%">
                        ${book.progress}%
                    </div>
                </div>

                <button class="btn btn-warning mt-3"
                    onclick="editBook(${index})">
                    Edit
                </button>

                <button class="btn btn-danger mt-2"
                    onclick="deleteBook(${index})">
                    Delete
                </button>

            </div>

        </div>`;
    });

    updateStats();
    updateGenres();
}

document.getElementById("search")
.addEventListener("input", displayBooks);

document.getElementById("filter")
.addEventListener("change", displayBooks);

document.getElementById("themeBtn")
.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

displayBooks();