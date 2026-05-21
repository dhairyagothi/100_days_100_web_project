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

function setGreeting(){

  const hour = new Date().getHours();

  if(hour < 12){
    greeting.innerText = "Good Morning 👋";
  }
  else if(hour < 18){
    greeting.innerText = "Good Afternoon 👋";
  }
  else{
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

  if(
    e.target.id === "openCard" ||
    e.target.closest("#openCard")
  ){
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

  const title =
    document.getElementById("title").value.trim();

  const content =
    document.getElementById("content").value.trim();

  const tag =
    document.getElementById("tag").value;

  if(title === "" || content === ""){
    alert("Please fill all fields");
    return;
  }

  const note = {
    id: Date.now(),
    title,
    content,
    tag,
    favorite:false,
    locked:false,
    trash:false,
    date:new Date().toLocaleDateString()
  };

  notes.push(note);

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );

  renderNotes(currentView);

  modal.classList.remove("active");

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("tag").selectedIndex = 0;

  showToast();

});
/* RENDER */

function renderNotes(type = "all"){

  notesGrid.innerHTML = `
    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>
  `;

  let filtered = notes;

  if(type === "favorites"){
    filtered = notes.filter(note => note.favorite);
  }

  if(type === "locked"){
    filtered = notes.filter(note => note.locked);
  }

  if(type === "trash"){
    filtered = notes.filter(note => note.trash);
  }

  filtered.forEach(note => {

    if(type !== "trash" && note.trash){
      return;
    }

    notesGrid.innerHTML += `

      <div class="card">

        ${
          note.locked
          ?
          `<div class="lock-badge">🔒 Locked</div>`
          :
          ""
        }

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
${
note.locked && currentView !== "locked"
? "🔒 Locked Note"
: note.content
}
</p>

        <div class="badge">${note.tag}</div>

        <div class="date">${note.date}</div>

        ${
          type === "trash"
          ?
          `
          <button
            class="delete-btn"
            onclick="deleteForever(${note.id})"
          >
            Delete
          </button>
          `
          :
          `
          <button
            class="delete-btn"
            onclick="moveToTrash(${note.id})"
          >
            Trash
          </button>
          `
        }

      </div>
    `;
  });

//   noteCount.innerText = `You have ${filtered.length} notes`;
noteCount.innerText =
`You have ${
filtered.filter(n => !n.trash).length
} notes`;

}

/* FAVORITE */

function toggleFavorite(id){

  notes = notes.map(note => {

    if(note.id === id){
      note.favorite = !note.favorite;
    }

    return note;

  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);

}

function toggleLock(id){

  notes = notes.map(note => {

    if(note.id === id){
      note.locked = !note.locked;
    }

    return note;

  });

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );

  renderNotes(currentView);

}

/* TRASH */

function moveToTrash(id){

  notes = notes.map(note => {

    if(note.id === id){
      note.trash = true;
    }

    return note;

  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);

}

/* DELETE */

function deleteForever(id){

  notes = notes.filter(note => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes("trash");

}

/* SEARCH */
searchInput.addEventListener("keyup", () => {

  const value =
    searchInput.value.toLowerCase();

  const filtered = notes.filter(note =>

    !note.trash &&

    (
      note.title.toLowerCase().includes(value)
      ||
      note.content.toLowerCase().includes(value)
      ||
      note.tag.toLowerCase().includes(value)
    )

  );

  notesGrid.innerHTML = `

    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>

  `;

  filtered.forEach(note => {

    notesGrid.innerHTML += `

      <div class="card">

        ${
          note.locked
          ?
          `<div class="lock-badge">🔒 Locked</div>`
          :
          ""
        }

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

function showToast(){

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  },2500);

}

/* DARK MODE */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

  const themeText =
    document.getElementById("themeText");

  if(document.body.classList.contains("light")){
    themeText.innerHTML = "☀️ Light Mode";
  }
  else{
    themeText.innerHTML = "🌙 Dark Mode";
  }

});

/* MENU */

let currentView = "all";

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

  item.addEventListener("click", () => {

    menuItems.forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    currentView = item.dataset.filter;

    renderNotes(currentView);

  });

});

/* START */

renderNotes();