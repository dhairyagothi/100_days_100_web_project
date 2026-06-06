const passwordForm = document.getElementById("passwordForm");

const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const searchPassword = document.getElementById("searchPassword");
const generatePasswordBtn = document.getElementById("generatePassword");
const passwordStrength = document.getElementById("passwordStrength");
const lengthReq = document.getElementById("lengthReq");
const upperReq = document.getElementById("upperReq");
const numberReq = document.getElementById("numberReq");
const specialReq = document.getElementById("specialReq");

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

passwordInput.addEventListener("input", () => {

    const password =
        passwordInput.value;

    if (passwordInput.value.length > 0) {

        document.getElementById(
            "passwordRequirements"
        ).style.display = "block";

    } else {

        document.getElementById(
            "passwordRequirements"
        ).style.display = "none";
    }

    checkPasswordStrength(password);

});

generatePasswordBtn.addEventListener(
    "click",
     generateStrongPassword
);

searchPassword.addEventListener(
    "input",
    renderPasswords
);

function checkPasswordStrength(password) {

     if (password.length === 0) {

    passwordStrength.textContent = "";

    lengthReq.textContent =
        "❌ At least 8 characters";

    upperReq.textContent =
        "❌ One uppercase letter";

    numberReq.textContent =
        "❌ One number";

    specialReq.textContent =
        "❌ One special character";

    return;
}
    
    let score = 0;

    if (password.length >= 8)
        score++;

    if (/[A-Z]/.test(password))
        score++;

    if (/[0-9]/.test(password))
        score++;

    if (/[^A-Za-z0-9]/.test(password))
        score++;

    if (password.length >= 8) {

    lengthReq.textContent =
        "✅ At least 8 characters";
}

if (/[A-Z]/.test(password)) {

    upperReq.textContent =
        "✅ One uppercase letter";
}

if (/[0-9]/.test(password)) {

    numberReq.textContent =
        "✅ One number";
}

if (/[^A-Za-z0-9]/.test(password)) {

    specialReq.textContent =
        "✅ One special character";
}
    if (score <= 1) {

        passwordStrength.textContent =
            "(Weak password)";

    } else if (score <= 3) {

        passwordStrength.textContent =
            "(Medium passsword)";

    } else {

        passwordStrength.textContent =
            "(Strong Password)";
    }
}

function generateStrongPassword() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for (let i = 0; i < 12; i++) {

        password += chars.charAt(
            Math.floor(
                Math.random() * chars.length
            )
        );

    }

    passwordInput.value = password;

    checkPasswordStrength(password);

}

function renderPasswords() {

    let passwords = getPasswords();
    const searchTerm =
    searchPassword.value
        .toLowerCase()
        .trim();

if (searchTerm) {

    passwords =
        passwords.filter(item =>

            item.website
                .toLowerCase()
                .includes(searchTerm)

            ||

            item.username
                .toLowerCase()
                .includes(searchTerm)

        );
}

    passwordTable.innerHTML = "";

    /* Empty State */

    if (passwords.length === 0) {

    passwordTable.innerHTML = `
        <tr>
            <td colspan="4">
                No matching passwords found.
            </td>
        </tr>
    `;

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