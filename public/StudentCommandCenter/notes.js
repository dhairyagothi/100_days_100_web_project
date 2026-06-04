const notesArea = document.getElementById("notesArea");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const notesList = document.getElementById("notesList");

// Load notes safely
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Render notes
function renderNotes() {

    if (!notesList) return; // prevents crash if page doesn't have notes UI

    notesList.innerHTML = "";

    notes.forEach((note, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <li class="note-card">
                ${note}
                <button class="deleteBtn" onclick="deleteNote(${index})">Delete</button>
            </li>
        `;

        notesList.appendChild(li);
    });
}

// Save note
if (saveNotesBtn) {
    saveNotesBtn.addEventListener("click", () => {

        const note = notesArea.value.trim();

        if (!note) {
            alert("Please enter a note");
            return;
        }

        notes.push(note);

        localStorage.setItem("notes", JSON.stringify(notes));

        notesArea.value = "";

        renderNotes();
    });
}

// Delete note
function deleteNote(index) {

    notes.splice(index, 1);

    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes();
}

// Initial render
renderNotes();