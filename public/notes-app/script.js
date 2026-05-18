const overlay = document.getElementById("overlay");
const addBtn = document.querySelector(".add-box");
const closeBtn = document.querySelector(".popup-header span");
const saveBtn = document.querySelector(".popup button");

const titleInput = document.querySelector(".popup input[type='text']");
const descInput = document.querySelector("textarea");
const tagInput = document.querySelectorAll(".popup input")[1];

const container = document.querySelector(".container");
const searchInput = document.querySelector(".search-bar input");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ---------- POPUP ---------- */
function openPopup() {
  overlay.style.display = "flex";
}

function closePopup() {
  overlay.style.display = "none";
}

addBtn.addEventListener("click", openPopup);
closeBtn.addEventListener("click", closePopup);

/* ---------- SAVE NOTE ---------- */
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const tags = tagInput.value.split(",").map(t => t.trim());

  if (!title || !desc) {
    alert("Please fill all fields");
    return;
  }

  const note = {
    id: Date.now(),
    title,
    desc,
    tags
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes();
  clearInputs();
  closePopup();
});

/* ---------- CLEAR INPUT ---------- */
function clearInputs() {
  titleInput.value = "";
  descInput.value = "";
  tagInput.value = "";
}

/* ---------- DELETE NOTE ---------- */
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

/* ---------- RENDER NOTES ---------- */
function renderNotes(filteredNotes = notes) {
  document.querySelectorAll(".note").forEach(el => el.remove());

  filteredNotes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.desc}</p>
      <div class="tags">
        ${note.tags.map(tag => `<span>#${tag}</span>`).join("")}
      </div>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    container.appendChild(div);
  });
}

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(value) ||
    note.desc.toLowerCase().includes(value) ||
    note.tags.join(" ").toLowerCase().includes(value)
  );

  renderNotes(filtered);
});

/* ---------- INIT ---------- */
renderNotes();
