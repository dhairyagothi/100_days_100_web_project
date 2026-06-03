document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const semesterFilter = document.getElementById("semester-filter");
    const booksGrid = document.querySelector(".books-grid");
    const addBookForm = document.getElementById("add-book-form");

    // --- 1. LIVE SEARCH & FILTER FUNCTIONALITY ---
    function filterBooks() {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedSemester = semesterFilter.value;
        const bookCards = document.querySelectorAll(".book-card");

        bookCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const author = card.querySelector(".author").textContent.toLowerCase();
            const subject = card.querySelector(".subject").textContent.toLowerCase();
            const cardSemester = card.getAttribute("data-semester");

            // Check if search text matches title, author, or subject
            const matchesSearch = title.includes(searchText) || 
                                  author.includes(searchText) || 
                                  subject.includes(searchText);

            // Check if semester matches dropdown
            const matchesSemester = (selectedSemester === "all") || (cardSemester === selectedSemester);

            // Show card only if both conditions match
            if (matchesSearch && matchesSemester) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Listen to input and dropdown changes
    searchInput.addEventListener("input", filterBooks);
    semesterFilter.addEventListener("change", filterBooks);


    // --- 2. DYNAMIC FORM SUBMISSION (ADD NEW BOOK) ---
    addBookForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        // Grab form values
        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const subject = document.getElementById("book-subject").value;
        const semester = document.getElementById("book-semester").value;
        const owner = document.getElementById("owner-name").value;
        const email = document.getElementById("owner-email").value;

        // Format semester text for display badge
        const semesterText = semester === "sem1" ? "Semester 1" : 
                             semester === "sem2" ? "Semester 2" : 
                             semester === "sem3" ? "Semester 3" : "Semester 4";

        // Create a new card element dynamically
        const newCard = document.createElement("div");
        newCard.classList.add("book-card");
        newCard.setAttribute("data-semester", semester);

        newCard.innerHTML = `
            <div class="book-badge">${semesterText}</div>
            <div class="book-info">
                <h3>${title}</h3>
                <p class="author">By ${author}</p>
                <p class="subject">Subject: ${subject}</p>
                <hr>
                <p class="owner"><i class="fa-solid fa-user"></i> Owner: ${owner}</p>
                <p class="contact"><i class="fa-solid fa-envelope"></i> ${email}</p>
            </div>
        `;

        // Append the new card at the top of the grid
        booksGrid.insertBefore(newCard, booksGrid.firstChild);

        // Reset the form and alert the user
        addBookForm.reset();
        alert("🎉 Book listed successfully in the marketplace!");
        
        // Scroll smoothly to the marketplace to see the new card
        document.getElementById("marketplace").scrollIntoView({ behavior: 'smooth' });
    });
});