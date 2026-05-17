let editIndex = null;

/* =========================
   MASK PASSWORD
========================= */

function maskPassword(pass) {

    return "*".repeat(pass.length);
}

/* =========================
   TOAST NOTIFICATION
========================= */

function showToast(message, color = "#16a34a") {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.padding = "14px 20px";
    toast.style.background = color;
    toast.style.color = "white";
    toast.style.borderRadius = "12px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}

/* =========================
   COPY TEXT
========================= */

async function copyText(txt) {

    try {

        await navigator.clipboard.writeText(txt);

        const alertBox =
            document.getElementById("alert");

        alertBox.style.display = "inline";

        setTimeout(() => {
            alertBox.style.display = "none";
        }, 2000);

        showToast("Copied Successfully ✅");

    } catch (err) {

        showToast("Copy Failed ❌", "#dc2626");
    }
}

/* =========================
   DELETE PASSWORD
========================= */

function deletePassword(Website) {

    let passwords =
        JSON.parse(localStorage.getItem("passwords")) || [];

    let updatedPasswords =
        passwords.filter((item) => {
            return item.Website !== Website;
        });

    localStorage.setItem(
        "passwords",
        JSON.stringify(updatedPasswords)
    );

    showToast("Password Deleted 🗑️");

    showPasswords();
}

/* =========================
   TOGGLE PASSWORD
========================= */

function togglePassword(index, actualPassword) {

    const passField =
        document.getElementById(`pass-${index}`);

    const button =
        document.getElementById(`toggle-${index}`);

    if (passField.dataset.visible === "true") {

        passField.innerText =
            maskPassword(actualPassword);

        passField.dataset.visible = "false";

        button.innerText = "👁 Show";

    } else {

        passField.innerText = actualPassword;

        passField.dataset.visible = "true";

        button.innerText = "🙈 Hide";
    }
}

/* =========================
   EDIT PASSWORD
========================= */

function editPassword(index) {

    let passwords =
        JSON.parse(localStorage.getItem("passwords")) || [];

    const selected = passwords[index];

    Website.value = selected.Website;
    username.value = selected.username;
    password.value = selected.password;

    editIndex = index;

    document.getElementById("saveBtn").innerText =
        "Update Password";

    document.getElementById("cancelEdit").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showToast("Editing Password ✏️", "#2563eb");
}

/* =========================
   CANCEL EDIT
========================= */

document
.getElementById("cancelEdit")
.addEventListener("click", () => {

    editIndex = null;

    document.getElementById("passwordForm").reset();

    document.getElementById("saveBtn").innerText =
        "Save Password";

    document.getElementById("cancelEdit").style.display =
        "none";

    showToast("Edit Cancelled");
});

/* =========================
   SHOW PASSWORDS
========================= */

function showPasswords() {

    const tb =
        document.getElementById("passwordTable");

    const emptyState =
        document.getElementById("emptyState");

    let passwords =
        JSON.parse(localStorage.getItem("passwords")) || [];

    tb.innerHTML = `
    <tr>

        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Actions</th>

    </tr>`;

    if (passwords.length === 0) {

        emptyState.style.display = "block";

        return;
    }

    emptyState.style.display = "none";

    passwords.forEach((element, index) => {

        tb.innerHTML += `

        <tr>

            <td>

                ${element.Website}

                <img
                class="copy-icon"
                onclick="copyText('${element.Website}')"
                src="copy.svg"
                alt="Copy">

            </td>

            <td>

                ${element.username}

                <img
                class="copy-icon"
                onclick="copyText('${element.username}')"
                src="copy.svg"
                alt="Copy">

            </td>

            <td>

                <div class="password-actions">

                    <span
                    id="pass-${index}"
                    data-visible="false">

                    ${maskPassword(element.password)}

                    </span>

                    <button
                    class="show-btn"
                    id="toggle-${index}"
                    onclick="togglePassword(${index},
                    '${element.password}')">

                    👁 Show

                    </button>

                    <img
                    class="copy-icon"
                    onclick="copyText('${element.password}')"
                    src="copy.svg"
                    alt="Copy">

                </div>

            </td>

            <td>

                <div class="password-actions">

                    <button
                    class="btn"
                    onclick="editPassword(${index})">

                    ✏️ Edit

                    </button>

                    <button
                    class="btnsm"
                    onclick="deletePassword('${element.Website}')">

                    🗑 Delete

                    </button>

                </div>

            </td>

        </tr>`;
    });

    Website.value = "";
    username.value = "";
    password.value = "";
}

/* =========================
   SAVE / UPDATE PASSWORD
========================= */

document
.getElementById("passwordForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    if (
        Website.value.trim() === "" ||
        username.value.trim() === "" ||
        password.value.trim() === ""
    ) {

        showToast(
            "Please Fill All Fields ⚠️",
            "#dc2626"
        );

        return;
    }

    let passwords =
        JSON.parse(localStorage.getItem("passwords")) || [];

    const newPassword = {

        Website: Website.value,
        username: username.value,
        password: password.value
    };

    if (editIndex === null) {

        passwords.push(newPassword);

        showToast("Password Saved ✅");

    } else {

        passwords[editIndex] = newPassword;

        showToast("Password Updated ✨");

        editIndex = null;

        document.getElementById("saveBtn").innerText =
            "Save Password";

        document.getElementById("cancelEdit").style.display =
            "none";
    }

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );

    showPasswords();

    document.getElementById("passwordForm").reset();
});

/* =========================
   SEARCH FUNCTIONALITY
========================= */

document
.getElementById("searchInput")
.addEventListener("input", (e) => {

    const value =
        e.target.value.toLowerCase();

    const rows =
        document.querySelectorAll("table tr");

    rows.forEach((row, index) => {

        if (index === 0) return;

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(value)
            ? ""
            : "none";
    });
});

/* =========================
   MAIN PASSWORD TOGGLE
========================= */

document
.getElementById("toggleMainPassword")
.addEventListener("click", () => {

    const passwordInput =
        document.getElementById("password");

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";
    }
});

/* =========================
   DARK MODE
========================= */

const themeToggle =
    document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.innerText = "☀️";
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

        themeToggle.innerText = "☀️";

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.innerText = "🌙";
    }
});

/* =========================
   MOBILE NAVBAR
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {

        menuToggle.innerHTML = "✖";

    } else {

        menuToggle.innerHTML = "☰";
    }
});

/* =========================
   INITIAL LOAD
========================= */

showPasswords();

console.log("PassX Running Successfully 🚀");