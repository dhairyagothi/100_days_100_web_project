const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector(".title input"),
  descTag = popupBox.querySelector("textarea"),
  tagsTag = popupBox.querySelector(".tags input"),
  fontTag = popupBox.querySelector(".font select"),
  passwordTag = popupBox.querySelector(".password input"),
  addBtn = popupBox.querySelector("button"),
  clearNotesBtn = document.querySelector(".clear-notes"),
  searchInput = document.getElementById("search-input");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

function openNoteForm(title, buttonText) {
  popupTitle.innerText = title;
  addBtn.innerText = buttonText;
  popupBox.classList.add("show");
  document.body.style.overflow = "hidden";
  if(window.innerWidth > 660) titleTag.focus();
}

function resetForm() {
  isUpdate = false;
  titleTag.value = descTag.value = tagsTag.value = passwordTag.value = "";
  fontTag.value = "Poppins";
  popupBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

function escapeHTML(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDescription(description = "") {
  return escapeHTML(description)
    .replaceAll("&lt;br/&gt;", "<br/>")
    .replaceAll("\n", "<br/>");
}

function getVisibleNotes() {
  const searchText = searchInput.value.trim().toLowerCase();

  return notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => {
      const tags = Array.isArray(note.tags) ? note.tags : [];

      return !searchText ||
        note.title.toLowerCase().includes(searchText) ||
        note.description.toLowerCase().includes(searchText) ||
        tags.some(tag => tag.toLowerCase().includes(searchText));
    });
}

function showNotes(filteredNotes = getVisibleNotes()) {
  document.querySelectorAll(".note").forEach(li => li.remove());
  clearNotesBtn.disabled = notes.length === 0;

  filteredNotes.forEach(({ note, index }) => {
    const isLocked = note.password && !note.isUnlocked;
    const noteFont = note.font || "Poppins";
    const tags = Array.isArray(note.tags) ? note.tags : [];
    const tagsMarkup = tags
      .filter(Boolean)
      .map(tag => `<span>${escapeHTML(tag)}</span>`)
      .join("");
    const viewBtnText = note.password && note.isUnlocked
      ? '<i class="uil uil-eye-slash"></i>Hide'
      : '<i class="uil uil-eye"></i>View';
    const viewAction = note.password && note.isUnlocked
      ? `hideNote(${index})`
      : `viewNotePrompt(${index})`;

    const liTag = `<li class="note${note.password ? " locked" : ""}" style="font-family: '${escapeHTML(noteFont)}', sans-serif;">
                    <div class="details${isLocked ? " locked" : ""}">
                      <p>${escapeHTML(note.title)}</p>
                      <span>${formatDescription(note.description)}</span>
                    </div>
                    ${isLocked ? '<span class="lock-symbol"><i class="uil uil-lock"></i></span>' : ""}
                    <div class="tags">${tagsMarkup}</div>
                    <div class="bottom-content">
                      <span>${escapeHTML(note.date)}</span>
                      <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                          ${note.password ? `<li onclick="${viewAction}">${viewBtnText}</li>` : ""}
                          <li onclick="editOrDelete(${index}, 'edit')"><i class="uil uil-pen"></i>Edit</li>
                          <li onclick="editOrDelete(${index}, 'delete')"><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                      </div>
                    </div>
                  </li>`;

    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

addBox.addEventListener("click", () => openNoteForm("Add a new note", "Add Note"));
closeIcon.addEventListener("click", resetForm);
searchInput.addEventListener("input", () => showNotes());
clearNotesBtn.addEventListener("click", () => {
  if(notes.length === 0) return;

  const shouldClear = confirm("Delete all saved notes? This cannot be undone.");

  if(shouldClear) {
    notes = [];
    localStorage.removeItem("notes");
    searchInput.value = "";
    showNotes();
  }
});

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if(e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function viewNotePrompt(noteId) {
  const note = notes[noteId];
  const enteredPassword = prompt("Please enter the password to view this note:");

  if(enteredPassword === note.password) {
    note.isUnlocked = true;
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  } else {
    alert("Incorrect password! Note content cannot be viewed.");
  }
}

function hideNote(noteId) {
  notes[noteId].isUnlocked = false;
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function editOrDelete(noteId, actionType) {
  const note = notes[noteId];

  if(note.password) {
    const enteredPassword = prompt("Please enter the password to proceed:");

    if(enteredPassword !== note.password) {
      alert("Incorrect password! Note cannot be edited or deleted.");
      return;
    }
  }

  if(actionType === "edit") editNoteContent(noteId);
  if(actionType === "delete") deleteNoteById(noteId);
}

function editNoteContent(noteId) {
  const note = notes[noteId];

  titleTag.value = note.title;
  descTag.value = note.description.replaceAll("<br/>", "\n");
  tagsTag.value = Array.isArray(note.tags) ? note.tags.join(", ") : "";
  fontTag.value = note.font || "Poppins";
  passwordTag.value = note.password || "";
  isUpdate = true;
  updateId = noteId;

  openNoteForm("Edit note", "Update Note");
}

function deleteNoteById(noteId) {
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

addBtn.addEventListener("click", e => {
  e.preventDefault();

  const title = titleTag.value.trim(),
    description = descTag.value.trim(),
    tags = tagsTag.value.trim().split(",").map(tag => tag.trim()).filter(Boolean),
    font = fontTag.value,
    password = passwordTag.value.trim();

  if(title || description) {
    const currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    const noteInfo = {
      title,
      description,
      tags,
      font,
      password,
      isUnlocked: false,
      date: `${month} ${day}, ${year}`
    };

    if(!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    resetForm();
  }
});

showNotes();
