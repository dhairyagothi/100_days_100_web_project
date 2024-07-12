
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input[type='text']"),
  descTag = popupBox.querySelector("textarea"),
  tagsTag = popupBox.querySelector(".tags input"),
  passwordTag = popupBox.querySelector(".password input"),
  addBtn = popupBox.querySelector("button"),
  searchInput = document.getElementById("search-input");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = tagsTag.value = passwordTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showNotes(filteredNotes = notes) {
  if(!filteredNotes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  filteredNotes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let lockedClass = note.password ? ' locked' : '';
    let blurStyle = note.password && !note.isUnlocked ? ' style="filter: blur(5px);" ' : '';
    let lockSymbol = note.password && !note.isUnlocked ? '<span class="lock-symbol">🔒</span>' : '';
    
    let viewBtnText = note.password && note.isUnlocked ? '<i class="uil uil-eye-slash"></i>Hide' : '<i class="uil uil-eye"></i>View';
    let viewAction = note.password && note.isUnlocked ? `hideNote(${id})` : `viewNotePrompt(${id})`;

    let liTag = `<li class="note${lockedClass}">
                  <div class="details"${blurStyle}>
                    <p>${note.title}</p>
                    <span>${filterDesc}</span>
                    ${lockSymbol}
                  </div>
                  <div class="tags">${note.tags.join(", ")}</div>
                  <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="menu">
                        ${note.password ? `<li onclick="${viewAction}">${viewBtnText}</li>` : ''}
                        ${note.password ? `<li onclick="editOrDelete(${id}, 'edit')"><i class="uil uil-pen"></i>Edit</li>` : `<li onclick="editOrDelete(${id}, 'edit')">Edit</li>`}
                        ${note.password ? `<li onclick="editOrDelete(${id}, 'delete')"><i class="uil uil-trash"></i>Delete</li>` : `<li onclick="editOrDelete(${id}, 'delete')">Delete</li>`}
                      </ul>
                    </div>
                  </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if(e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function viewNotePrompt(noteId) {
  let note = notes[noteId];
  let enteredPassword = prompt("Please enter the password to view this note:");
  if(enteredPassword === note.password) {
    note.isUnlocked = true;
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  } else {
    alert("Incorrect password! Note content cannot be viewed.");
  }
}

function hideNote(noteId) {
  let note = notes[noteId];
  note.isUnlocked = false;
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function editOrDelete(noteId, actionType) {
  let note = notes[noteId];
  if(note.password) {
    let enteredPassword = prompt("Please enter the password to proceed:");
    if(enteredPassword === note.password) {
      if(actionType === 'edit') {
        editNoteContent(noteId);
      } else if(actionType === 'delete') {
        deleteNoteById(noteId);
      } else {
        alert("Invalid action. Note cannot be edited or deleted.");
      }
    } else {
      alert("Incorrect password! Note cannot be edited or deleted.");
    }
  } else {
    // Proceed with editing or deleting the note
    if(actionType === 'edit') {
      editNoteContent(noteId);
    } else if(actionType === 'delete') {
      deleteNoteById(noteId);
    }
  }
}

function editNoteContent(noteId) {
  let note = notes[noteId];
  popupTitle.innerText = "Edit Note";
  addBtn.innerText = "Update Note";
  titleTag.value = note.title;
  descTag.value = note.description.replaceAll('<br/>', '\n');
  tagsTag.value = note.tags.join(", ");
  passwordTag.value = note.password || "";

  isUpdate = true;
  updateId = noteId;

  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if(window.innerWidth > 660) titleTag.focus();
}

function deleteNoteById(noteId) {
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim().replaceAll('\n', '<br/>'),
    tags = tagsTag.value.trim().split(",").map(tag => tag.trim()),
    password = passwordTag.value.trim();

  if(title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = {
      title,
      description,
      tags,
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
    closeIcon.click();
  }
});

searchInput.addEventListener("input", e => {
  const searchText = e.target.value.toLowerCase();
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText) || 
    note.description.toLowerCase().includes(searchText) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchText))
  );
  showNotes(filteredNotes);
});
