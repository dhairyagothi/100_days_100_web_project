// Elements
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const closeBtn = document.querySelector(".close-btn");

const form = document.querySelector("form");
const titleTag = document.getElementById("title");
const descTag = document.getElementById("desc");
const tagsTag = document.getElementById("tags");
const passwordTag = document.getElementById("password");

const wrapper = document.querySelector(".wrapper");
const searchInput = document.getElementById("search-input");

// State
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isUpdate = false, updateId;

// 📅 Months
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


// 🚀 SHOW NOTES
function showNotes(data = notes) {
  document.querySelectorAll(".note").forEach(n => n.remove());

  data.forEach((note, id) => {

    let desc = note.isUnlocked ? note.description : "🔒 Locked note";
    let blur = note.isUnlocked ? "" : "blur";

    let li = document.createElement("li");
    li.className = "note";

    li.innerHTML = `
      <div class="details ${blur}">
        <p>${note.title}</p>
        <span>${desc}</span>
      </div>

      <div class="tags">${note.tags.join(", ")}</div>

      <div class="bottom-content">
        <span>${note.date}</span>

        <div class="settings">
          <i class="uil uil-ellipsis-h"></i>

          <ul class="menu">
            ${note.password ? `<li class="view">👁 View</li>` : ""}
            <li class="edit">✏️ Edit</li>
            <li class="delete">🗑 Delete</li>
          </ul>
        </div>
      </div>
    `;

    // 👉 EVENTS (clean way instead of inline onclick)

    // Menu toggle
    const settingsIcon = li.querySelector(".settings i");
    settingsIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
      li.querySelector(".settings").classList.toggle("show");
    });

    // View
    li.querySelector(".view")?.addEventListener("click", () => {
      handleView(note, id);
    });

    // Edit
    li.querySelector(".edit").addEventListener("click", () => {
      editNote(id);
    });

    // Delete
    li.querySelector(".delete").addEventListener("click", () => {
      deleteNote(id);
    });

    addBox.insertAdjacentElement("afterend", li);
  });
}


// ❌ Close menus when clicking outside
function closeAllMenus() {
  document.querySelectorAll(".settings").forEach(menu => {
    menu.classList.remove("show");
  });
}

document.addEventListener("click", closeAllMenus);


// 👁 VIEW NOTE (better UX than prompt)
function handleView(note, id) {
  let entered = prompt("Enter password to view note:");

  if (entered === note.password) {
    notes[id].isUnlocked = true;
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  } else {
    alert("Wrong password!");
  }
}


// ✏️ EDIT
function editNote(id) {
  let note = notes[id];

  if (note.password) {
    let entered = prompt("Enter password to edit:");
    if (entered !== note.password) return alert("Wrong password!");
  }

  isUpdate = true;
  updateId = id;

  titleTag.value = note.title;
  descTag.value = note.description.replaceAll("<br/>", "\n");
  tagsTag.value = note.tags.join(", ");
  passwordTag.value = note.password || "";

  popupBox.classList.add("active");
}


// 🗑 DELETE
function deleteNote(id) {
  let note = notes[id];

  if (note.password) {
    let entered = prompt("Enter password to delete:");
    if (entered !== note.password) return alert("Wrong password!");
  }

  notes.splice(id, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}


// ➕ ADD / UPDATE NOTE
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = titleTag.value.trim();
  let description = descTag.value.trim().replaceAll("\n", "<br/>");
  let tags = tagsTag.value.split(",").map(t => t.trim());
  let password = passwordTag.value.trim();

  if (!title && !description) return;

  let date = new Date();
  let noteData = {
    title,
    description,
    tags,
    password,
    isUnlocked: false,
    date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  };

  if (isUpdate) {
    notes[updateId] = noteData;
    isUpdate = false;
  } else {
    notes.push(noteData);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  form.reset();
  popupBox.classList.remove("active");

  showNotes();
});


// 🔍 SEARCH
searchInput.addEventListener("input", (e) => {
  let text = e.target.value.toLowerCase();

  let filtered = notes.filter(note =>
    note.title.toLowerCase().includes(text) ||
    note.description.toLowerCase().includes(text) ||
    note.tags.some(tag => tag.toLowerCase().includes(text))
  );

  showNotes(filtered);
});


// ➕ OPEN / CLOSE POPUP
addBox.addEventListener("click", () => {
  popupBox.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  popupBox.classList.remove("active");
});


// INIT
showNotes();