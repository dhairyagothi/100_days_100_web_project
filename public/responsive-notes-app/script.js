const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Display Notes
function displayNotes(filteredNotes = notes) {
  notesContainer.innerHTML = "";

  filteredNotes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    noteDiv.innerHTML = `
      <p>${note}</p>

      <div class="note-buttons">
        <button class="edit-btn" onclick="editNote(${index})">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteNote(${index})">
          Delete
        </button>
      </div>
    `;

    notesContainer.appendChild(noteDiv);
  });
}

// Add Note
addBtn.addEventListener("click", () => {
  const noteText = noteInput.value.trim();

  if (noteText === "") {
    alert("Please write something!");
    return;
  }

  notes.push(noteText);

  localStorage.setItem("notes", JSON.stringify(notes));

  noteInput.value = "";

  displayNotes();
});

// Delete Note
function deleteNote(index) {
  notes.splice(index, 1);

  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

// Edit Note
function editNote(index) {
  const updatedNote = prompt("Edit your note:", notes[index]);

  if (updatedNote !== null) {
    notes[index] = updatedNote;

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
  }
}

// Search Notes
searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredNotes = notes.filter(note =>
    note.toLowerCase().includes(searchValue)
  );

  displayNotes(filteredNotes);
});

// Initial Display
displayNotes();