const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
modalTitle = document.getElementById("modalTitleText"),
closePopup = document.getElementById("closePopup"),
titleInput = document.getElementById("titleInput"),
descInput = document.getElementById("descInput"),
passInput = document.getElementById("passInput"),
submitBtn = document.getElementById("submitBtn"),
deleteBtn = document.getElementById("deleteBtn"),
editToggleBtn = document.getElementById("editToggleBtn"),
searchInput = document.getElementById("search-input");

let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    isUpdate = false;
    modalTitle.innerText = "New Idea";
    submitBtn.innerText = "Save Note";
    submitBtn.style.display = "block";
    deleteBtn.style.display = "none";
    editToggleBtn.style.display = "none";
    
    document.querySelector(".form-container").classList.remove("read-only");
    titleInput.readOnly = descInput.readOnly = passInput.readOnly = false;
    
    titleInput.value = descInput.value = passInput.value = "";
    popupBox.classList.add("show");
});

closePopup.addEventListener("click", () => {
    popupBox.classList.remove("show");
});

function showNotes(filtered = notes) {
    document.querySelectorAll(".note").forEach(li => li.remove());
    filtered.forEach((note, id) => {
        let isLocked = note.password ? "locked-blur" : "";
        let liTag = `<li class="note" onclick="openNote(${id})">
                        <div class="details ${isLocked}">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                            ${note.password ? '<div class="lock-icon">🔒</div>' : ''}
                        </div>
                        <div style="margin-top:10px; font-size:11px; color:#6b7c93;">${note.date}</div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function openNote(id) {
    let note = notes[id];
    if(note.password) {
        let p = prompt("Enter Security Pin:");
        if(p !== note.password) return alert("Wrong Pin!");
    }
    
    isUpdate = true;
    updateId = id;
    modalTitle.innerText = "Digital Memory";
    submitBtn.innerText = "Update Note";
    
    submitBtn.style.display = "none";
    deleteBtn.style.display = "block";
    editToggleBtn.style.display = "block";
    
    titleInput.value = note.title;
    descInput.value = note.description;
    passInput.value = note.password;
    
    document.querySelector(".form-container").classList.add("read-only");
    titleInput.readOnly = descInput.readOnly = passInput.readOnly = true;
    
    popupBox.classList.add("show");
}

editToggleBtn.addEventListener("click", () => {
    document.querySelector(".form-container").classList.remove("read-only");
    titleInput.readOnly = descInput.readOnly = passInput.readOnly = false;
    submitBtn.style.display = "block";
    editToggleBtn.style.display = "none";
});

deleteBtn.addEventListener("click", () => {
    if(confirm("Discard this memory permanently?")) {
        notes.splice(updateId, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closePopup.click();
    }
});

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let title = titleInput.value.trim(), desc = descInput.value.trim();
    if(title || desc) {
        let d = new Date(), date = `${d.getDate()} ${d.toLocaleString('default', {month:'short'})}, ${d.getFullYear()}`;
        let info = {title, description: desc, password: passInput.value, date};
        if(!isUpdate) notes.push(info); else notes[updateId] = info;
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closePopup.click();
    }
});

searchInput.addEventListener("keyup", e => {
    let val = e.target.value.toLowerCase();
    showNotes(notes.filter(n => n.title.toLowerCase().includes(val) || n.description.toLowerCase().includes(val)));
});
