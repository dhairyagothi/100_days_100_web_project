const passwordForm = document.getElementById("passwordForm");

const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const passwordTable = document.getElementById("passwordTable");

const emptyState = document.getElementById("emptyState");

const togglePassword = document.getElementById("togglePassword");

const toast = document.getElementById("toast");

// hamburger menu toggle nav links on mobile
const hamburger = document.getElementById("hamburgerIcon");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("fa-bars");
    hamburger.classList.toggle("fa-xmark");
});

/* -------------------- */
/* Toast Notification */
/* -------------------- */

function showToast(message, type = "success") {

    toast.textContent = message;

    if (type === "success") {
        toast.style.background = "#22c55e";
    } else {
        toast.style.background = "#ef4444";
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* -------------------- */
/* Get Passwords */
/* -------------------- */

function getPasswords() {

    return JSON.parse(localStorage.getItem("passwords")) || [];
}

/* -------------------- */
/* Save Passwords */
/* -------------------- */

function savePasswords(passwords) {

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );
}

/* -------------------- */
/* Mask Password */
/* -------------------- */

function maskPassword(password) {

    return "*".repeat(password.length);
}

/* -------------------- */
/* Render Passwords */
/* -------------------- */

function renderPasswords() {

    const passwords = getPasswords();

    passwordTable.innerHTML = "";

    /* Empty State */

    if (passwords.length === 0) {

        emptyState.style.display = "block";

        return;
    }

    emptyState.style.display = "none";

    passwords.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${item.website}
            </td>

            <td>
                ${item.username}
            </td>

            <td id="password-${index}">
                ${maskPassword(item.password)}
            </td>

            <td>

                <!-- View -->

                <button
                    class="action-btn view-btn"
                    onclick="toggleViewPassword(${index})"
                >

                    <i class="fa-solid fa-eye"></i>

                </button>

                <!-- Copy -->

                <button
                    class="action-btn copy-btn"
                    onclick="copyPassword(${index})"
                >

                    <i class="fa-solid fa-copy"></i>

                </button>

                <!-- Delete -->

                <button
                    class="action-btn delete-btn"
                    onclick="deletePassword(${index})"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>
        `;

        passwordTable.appendChild(row);
    });
}

/* -------------------- */
/* Add Password */
/* -------------------- */

passwordForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const website = websiteInput.value.trim();

    const username = usernameInput.value.trim();

    const password = passwordInput.value.trim();

    /* Validation */

    if (!website || !username || !password) {

        showToast(
            "Please fill all fields",
            "error"
        );

        return;
    }

    const passwords = getPasswords();

    passwords.push({
        website,
        username,
        password
    });

    savePasswords(passwords);

    renderPasswords();

    passwordForm.reset();

    showToast(
        "Password saved successfully"
    );
});

/* -------------------- */
/* Delete Password */
/* -------------------- */

function deletePassword(index) {

    const confirmDelete = confirm(
        "Delete this password?"
    );

    if (!confirmDelete) return;

    const passwords = getPasswords();

    passwords.splice(index, 1);

    savePasswords(passwords);

    renderPasswords();

    showToast(
        "Password deleted successfully"
    );
}

/* -------------------- */
/* Copy Password */
/* -------------------- */

function copyPassword(index) {

    const passwords = getPasswords();

    navigator.clipboard.writeText(
        passwords[index].password
    );

    showToast(
        "Password copied"
    );
}

/* -------------------- */
/* Toggle View Password */
/* -------------------- */

function toggleViewPassword(index) {

    const passwords = getPasswords();

    const passwordCell =
        document.getElementById(`password-${index}`);

    const currentText =
        passwordCell.textContent;

    if (currentText.includes("*")) {

        passwordCell.textContent =
            passwords[index].password;

    } else {

        passwordCell.textContent =
            maskPassword(
                passwords[index].password
            );
    }
}

/* -------------------- */
/* Toggle Input Password */
/* -------------------- */

togglePassword.addEventListener("click", () => {

    const icon =
        togglePassword.querySelector("i");

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");
    }
});

/* -------------------- */
/* Initial Render */
/* -------------------- */

renderPasswords();