const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const openCard = document.getElementById("openCard");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");
const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const greeting = document.getElementById("greeting");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* GREETING */

function setGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.innerText = "Good Morning 👋";
  } else if (hour < 18) {
    greeting.innerText = "Good Afternoon 👋";
  } else {
    greeting.innerText = "Good Evening 👋";
  }
}

setGreeting();

/* OPEN */

openModal.addEventListener("click", () => {
  modal.classList.add("active");
});

// document.addEventListener("click", (e) => {

//   if(e.target.id === "openCard"){
//     modal.classList.add("active");
//   }

// });

document.addEventListener("click", (e) => {
  if (e.target.id === "openCard" || e.target.closest("#openCard")) {
    modal.classList.add("active");
  }
});

/* CLOSE */

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* SAVE */

// saveBtn.addEventListener("click", () => {

//   const title = document.getElementById("title").value;
//   const content = document.getElementById("content").value;
//   const tag = document.getElementById("tag").value;
//   const favorite = document.getElementById("favorite").checked;
//   const locked = document.getElementById("locked").checked;

//   if(title === "" || content === ""){
//     alert("Please fill all fields");
//     return;
//   }

//   const note = {
//     id: Date.now(),
//     title,
//     content,
//     tag,
//     favorite,
//     locked,
//     trash:false,
//     date:new Date().toLocaleDateString()
//   };

//   notes.push(note);

//   localStorage.setItem("notes", JSON.stringify(notes));

//   renderNotes();

//   modal.classList.remove("active");

//   document.getElementById("title").value = "";
//   document.getElementById("content").value = "";
//   document.getElementById("favorite").checked = false;
//   document.getElementById("locked").checked = false;

//   showToast();

// });

// saveBtn.addEventListener("click", () => {

//   const title = document.getElementById("title").value.trim();
//   const content = document.getElementById("content").value.trim();
//   const tag = document.getElementById("tag").value;

//   const favorite =
//     document.getElementById("favorite").checked;

//   const locked =
//     document.getElementById("locked").checked;

//   if(title === "" || content === ""){
//     alert("Please fill all fields");
//     return;
//   }

//   const note = {
//     id: Date.now(),
//     title,
//     content,
//     tag,
//     favorite,
//     locked,
//     trash:false,
//     date:new Date().toLocaleDateString()
//   };

//   notes.push(note);

//   localStorage.setItem(
//     "notes",
//     JSON.stringify(notes)
//   );

//   renderNotes(currentView);

//   modal.classList.remove("active");

//   document.getElementById("title").value = "";
//   document.getElementById("content").value = "";

//   document.getElementById("tag").selectedIndex = 0;

//   document.getElementById("favorite").checked = false;
//   document.getElementById("locked").checked = false;

//   showToast();

// });

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();

  const content = document.getElementById("content").value.trim();

  const tag = document.getElementById("tag").value;

  if (title === "" || content === "") {
    alert("Please fill all fields");
    return;
  }

  const note = {
    id: Date.now(),
    title,
    content,
    tag,
    favorite: false,
    locked: false,
    trash: false,
    date: new Date().toLocaleDateString(),
  };

  notes.push(note);

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);

  modal.classList.remove("active");

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("tag").selectedIndex = 0;

  showToast();
});
/* RENDER */

function renderNotes(type = "all") {
  notesGrid.innerHTML = `
    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>
  `;

  let filtered = notes;

  if (type === "favorites") {
    filtered = notes.filter((note) => note.favorite);
  }

  if (type === "locked") {
    filtered = notes.filter((note) => note.locked);
  }

  if (type === "trash") {
    filtered = notes.filter((note) => note.trash);
  }

  filtered.forEach((note) => {
    if (type !== "trash" && note.trash) {
      return;
    }

    notesGrid.innerHTML += `

      <div class="card">

        ${note.locked ? `<div class="lock-badge">🔒 Locked</div>` : ""}

        <button
          class="favorite-btn"
          onclick="toggleFavorite(${note.id})"
        >
          ${note.favorite ? "⭐" : "☆"}
        </button>


        <button
            class="lock-btn"
            onclick="toggleLock(${note.id})"
         >
        ${note.locked ? "🔒" : "🔓"}
        </button>

        <h2>${note.title}</h2>

        <p>
${note.locked && currentView !== "locked" ? "🔒 Locked Note" : note.content}
</p>

        <div class="badge">${note.tag}</div>

        

       ${
         type === "trash"
           ? `
  <div class="card-footer">

      <div class="date">
          ${note.date}
      </div>

      <div class="trash-actions">

          <button
              class="restore-btn"
              onclick="restoreNote(${note.id})"
          >
              Restore
          </button>

          <button
              class="delete-btn"
              onclick="deleteForever(${note.id})"
          >
              Delete
          </button>

      </div>

  </div>
  `
           : `
  <div class="card-footer">

      <div class="date">
          ${note.date}
      </div>

      <button
          class="delete-btn"
          onclick="moveToTrash(${note.id})"
      >
          Trash
      </button>

  </div>
  `
       }

      </div>
    `;
  });

  //   noteCount.innerText = `You have ${filtered.length} notes`;
  noteCount.innerText = `You have ${
    filtered.filter((n) => !n.trash).length
  } notes`;
}

/* FAVORITE */

function toggleFavorite(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.favorite = !note.favorite;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}

function toggleLock(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.locked = !note.locked;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}

/* TRASH */

function moveToTrash(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.trash = true;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}
function restoreNote(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.trash = false;
    }
    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes("trash");
}

/* DELETE */

function deleteForever(id) {
  notes = notes.filter((note) => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes("trash");
}

/* SEARCH */
searchInput.addEventListener("keyup", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = notes.filter(
    (note) =>
      !note.trash &&
      (note.title.toLowerCase().includes(value) ||
        note.content.toLowerCase().includes(value) ||
        note.tag.toLowerCase().includes(value)),
  );

  notesGrid.innerHTML = `

    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>

  `;

  filtered.forEach((note) => {
    notesGrid.innerHTML += `

      <div class="card">

        ${note.locked ? `<div class="lock-badge">🔒 Locked</div>` : ""}

        <button
          class="favorite-btn"
          onclick="toggleFavorite(${note.id})"
        >
          ${note.favorite ? "⭐" : "☆"}
        </button>

        <h2>${note.title}</h2>

        <p>${note.content}</p>

        <div class="badge">${note.tag}</div>

      </div>

    `;
  });
});
// searchInput.addEventListener("keyup", () => {

//   const value = searchInput.value.toLowerCase();

//   const filtered = notes.filter(note =>

//     !note.trash &&

//     (
//       note.title.toLowerCase().includes(value)
//       ||
//       note.content.toLowerCase().includes(value)
//       ||
//       note.tag.toLowerCase().includes(value)
//     )

//   );

//   notesGrid.innerHTML = "";

//   filtered.forEach(note => {

//     notesGrid.innerHTML += `
//       <div class="card">
//         <h2>${note.title}</h2>
//         <p>${note.content}</p>
//         <div class="badge">${note.tag}</div>
//       </div>
//     `;
//   });

// });

/* TOAST */

function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* DARK MODE */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const themeText = document.getElementById("themeText");

  if (document.body.classList.contains("light")) {
    themeText.innerHTML = "☀️ Light Mode";
  } else {
    themeText.innerHTML = "🌙 Dark Mode";
  }
});

/* MENU */

let currentView = "all";

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    currentView = item.dataset.filter;

    renderNotes(currentView);
  });
});

/* START */

renderNotes();

const exportBtn = document.getElementById("exportBtn");
const exportDropdown = document.getElementById("exportDropdown");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

exportBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  exportDropdown.classList.toggle("open");
});

document.addEventListener("click", () => {
  exportDropdown.classList.remove("open");
});

document.querySelectorAll(".export-option").forEach((opt) => {
  opt.addEventListener("click", (e) => {
    e.stopPropagation();
    const fmt = opt.dataset.format;
    if (fmt === "txt") exportTXT();
    if (fmt === "csv") exportCSV();
    if (fmt === "db") exportDB();
    exportDropdown.classList.remove("open");
  });
});

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target.result;
    if (ext === "txt") importTXT(raw);
    else if (ext === "csv") importCSV(raw);
    else if (ext === "db") importDB(raw);
    importFile.value = "";
  };
  reader.readAsText(file);
});

function exportTXT() {
  let out = "";
  notes.forEach((n, i) => {
    out += `Note ${i + 1}\n`;
    out += `Title: ${n.title}\n`;
    out += `Tag: ${n.tag}\n`;
    out += `Date: ${n.date}\n`;
    out += `Favorite: ${n.favorite}\n`;
    out += `Locked: ${n.locked}\n`;
    out += `Trash: ${n.trash}\n`;
    out += `Content:\n${n.content}\n`;
    out += `---\n`;
  });
  download("notes.txt", out, "text/plain");
}

function importTXT(raw) {
  const blocks = raw.split("---\n").filter((b) => b.trim());
  const imported = [];
  blocks.forEach((block) => {
    const lines = block.split("\n");
    const get = (key) => {
      const line = lines.find((l) => l.startsWith(key + ":"));
      return line ? line.slice(key.length + 1).trim() : "";
    };
    const contentStart = lines.findIndex((l) => l === "Content:") + 1;
    const content = lines.slice(contentStart).join("\n").trim();
    if (!get("Title")) return;
    imported.push({
      id: Date.now() + Math.random(),
      title: get("Title"),
      tag: get("Tag") || "Personal",
      date: get("Date") || new Date().toLocaleDateString(),
      favorite: get("Favorite") === "true",
      locked: get("Locked") === "true",
      trash: get("Trash") === "true",
      content,
    });
  });
  mergeImported(imported);
}

function exportCSV() {
  const headers = ["id","title","content","tag","date","favorite","locked","trash"];
  const rows = notes.map((n) =>
    headers.map((h) => `"${String(n[h]).replace(/"/g, '""')}"`).join(",")
  );
  download("notes.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
}

function importCSV(raw) {
  const lines = raw.trim().split("\n");
  if (lines.length < 2) return;
  const headers = lines[0].split(",");
  const imported = lines.slice(1).map((line) => {
    const vals = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) { vals.push(cur); cur = ""; }
      else cur += ch;
    }
    vals.push(cur);
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = (vals[i] || "").trim()));
    return {
      id: parseFloat(obj.id) || Date.now() + Math.random(),
      title: obj.title || "",
      content: obj.content || "",
      tag: obj.tag || "Personal",
      date: obj.date || new Date().toLocaleDateString(),
      favorite: obj.favorite === "true",
      locked: obj.locked === "true",
      trash: obj.trash === "true",
    };
  }).filter((n) => n.title);
  mergeImported(imported);
}

function exportDB() {
  const payload = JSON.stringify({ version: 1, exported: new Date().toISOString(), notes });
  download("notes.db", payload, "application/octet-stream");
}

function importDB(raw) {
  try {
    const parsed = JSON.parse(raw);
    const list = parsed.notes || (Array.isArray(parsed) ? parsed : []);
    mergeImported(list.filter((n) => n.title));
  } catch {
    alert("Invalid .db file");
  }
}

function mergeImported(incoming) {
  const existingIds = new Set(notes.map((n) => String(n.id)));
  let added = 0;
  incoming.forEach((n) => {
    if (!existingIds.has(String(n.id))) {
      notes.push(n);
      added++;
    }
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(currentView);
  toast.innerText = `✔ Imported ${added} note${added !== 1 ? "s" : ""}`;
  showToast();
  setTimeout(() => { toast.innerText = "✔ Note added successfully!"; }, 3000);
}

function download(name, content, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
