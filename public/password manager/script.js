// Premium custom toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconColor = 'emerald';
    let svgPath = '';
    
    if (type === 'delete') {
        iconColor = 'delete';
        // Trash SVG icon
        svgPath = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
    } else if (type === 'copy') {
        iconColor = 'indigo';
        // Clipboard copy SVG icon
        svgPath = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`;
    } else {
        // Success shield check SVG icon
        svgPath = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`;
    }
    
    toast.innerHTML = `
        <span class="toast-icon ${iconColor}">${svgPath}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Automatically fade out and remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Fixed length-based password masking function using clean bullet points
function maskPassword(pass) {
    if (!pass) return '';
    return '•'.repeat(pass.length);
}

// Copy text to clipboard using modern Navigator API
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            showToast("Copied successfully!", "copy");
        },
        () => {
            showToast("Failed to copy to clipboard", "delete");
        }
    );
}

// Delete login entries from storage
const deletePassword = (Website) => {
    let data = localStorage.getItem("passwords");
    if (!data) return;
    
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => e.Website !== Website);
    
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    showToast(`Deleted credentials for ${Website}`, "delete");
    showPasswords();
};

// Toggle saved password entry visibility in the table cell
window.toggleSavedPassword = (index) => {
    const span = document.getElementById(`pass-${index}`);
    const button = span.nextElementSibling;
    const isMasked = span.getAttribute('data-masked') === 'true';
    const realPassword = span.getAttribute('data-password');
    
    if (isMasked) {
        span.textContent = realPassword;
        span.setAttribute('data-masked', 'false');
        // Change eye open SVG to eye-slash SVG
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
        `;
    } else {
        span.textContent = maskPassword(realPassword);
        span.setAttribute('data-masked', 'true');
        // Change back to eye-open SVG
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        `;
    }
};

// Render saved passwords list in the HTML table
const showPasswords = () => {
    let tb = document.querySelector("table tbody");
    let data = localStorage.getItem("passwords");
    
    if (data == null || JSON.parse(data).length === 0) {
        tb.innerHTML = `<tr><td colspan="4" class="no-data">No credentials stored yet. Set one below!</td></tr>`;
    } else {
        let arr = JSON.parse(data);
        let str = "";
        
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            
            str += `<tr>
                <td>
                    <div class="cell-data">
                        <span>${element.Website}</span>
                        <button class="action-icon" onclick="copyText('${element.Website}')" title="Copy Website">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td>
                    <div class="cell-data">
                        <span>${element.username}</span>
                        <button class="action-icon" onclick="copyText('${element.username}')" title="Copy Username">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td>
                    <div class="cell-data">
                        <span class="cell-password" id="pass-${index}" data-password="${element.password}" data-masked="true">${maskPassword(element.password)}</span>
                        
                        <!-- Toggle in-place row visibility -->
                        <button class="action-icon view-btn" onclick="toggleSavedPassword(${index})" title="Toggle Visibility">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        
                        <!-- Copy password button -->
                        <button class="action-icon" onclick="copyText('${element.password}')" title="Copy Password">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td>
                    <button class="btnsm" onclick="deletePassword('${element.Website}')">Delete</button>
                </td>
            </tr>`;
        }
        tb.innerHTML = str;
    }
    
    // Clear inputs safely
    document.getElementById("Website").value = "";
    document.getElementById("username").value = "";
    const passInput = document.getElementById("password");
    passInput.value = "";
    checkPasswordStrength(""); // Reset strength indicator
};

// Real-time password strength checker
function checkPasswordStrength(password) {
    const container = document.getElementById('strengthContainer');
    const text = document.getElementById('strengthText');
    
    if (!password) {
        container.className = 'strength-container';
        text.innerText = 'Strength: Empty';
        return;
    }
    
    let score = 0;
    
    // 1. Length check
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    
    // 2. Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) {
        container.className = 'strength-container strength-weak';
        text.innerText = 'Strength: Weak (Too insecure)';
    } else if (score <= 4) {
        container.className = 'strength-container strength-medium';
        text.innerText = 'Strength: Medium (Good standard)';
    } else {
        container.className = 'strength-container strength-strong';
        text.innerText = 'Strength: Strong (Highly secure!)';
    }
}

// Initial application setup
document.addEventListener("DOMContentLoaded", () => {
    console.log("PassX Ready");
    showPasswords();
    
    const passwordInput = document.getElementById('password');
    const toggleInputBtn = document.getElementById('togglePasswordInput');
    
    // Live strength indicator updates on keyboard input
    passwordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
    
    // Show/hide password input toggle visibility
    toggleInputBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        if (isPassword) {
            // Change to Eye-slash icon
            toggleInputBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
            `;
        } else {
            // Change to Eye icon
            toggleInputBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            `;
        }
    });
    
    // Save password submission listener
    document.getElementById("passwordForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const Website = document.getElementById("Website").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = passwordInput.value;
        
        if (!Website || !username || !password) {
            showToast("Please fill all form fields", "delete");
            return;
        }
        
        let passwords = localStorage.getItem("passwords");
        let json = passwords ? JSON.parse(passwords) : [];
        
        // Prevent duplicate site passwords or overwrite them
        const existingIdx = json.findIndex(e => e.Website === Website && e.username === username);
        if (existingIdx !== -1) {
            json[existingIdx].password = password;
            showToast(`Updated password for ${Website}`, "success");
        } else {
            json.push({ Website, username, password });
            showToast("Password credentials saved securely!", "success");
        }
        
        localStorage.setItem("passwords", JSON.stringify(json));
        showPasswords();
    });
});
