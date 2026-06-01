const specialists = [
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist"
];

const specialistSelect = document.getElementById("specialistType");
const specialistSearch = document.getElementById("specialistSearch");
const requestForm = document.getElementById("requestForm");
const historyList = document.getElementById("historyList");
const recommendationBox = document.getElementById("recommendationBox");
const symptomSelect = document.getElementById("symptomSelect");

// Load specialists into dropdown
function loadSpecialists(list) {
    // Keep standard placeholder for floating label
    specialistSelect.innerHTML = `<option value="" disabled selected hidden></option>`;

    list.forEach((specialist) => {
        const option = document.createElement("option");
        option.value = specialist;
        option.textContent = specialist;
        specialistSelect.appendChild(option);
    });

    // Trigger Lucide update just in case any dynamic icons are needed
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

// Live search filter
specialistSearch.addEventListener("input", () => {
    const searchValue = specialistSearch.value.toLowerCase();
    const filtered = specialists.filter((specialist) =>
        specialist.toLowerCase().includes(searchValue)
    );
    loadSpecialists(filtered);
});

// Toast notification helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Map types to icons
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Consultation form submission
requestForm.addEventListener("submit", (e) => {
    e.preventDefault();


    const doctorName = document.getElementById("doctorName").value;
    const patientCondition = document.getElementById("patientCondition").value;
    const specialist = specialistSelect.value;

    if (!specialist) {
        showToast("Please select a specialist.", "warning");
        return;
    }

    // Clear history placeholder if it is the first item
    if (historyList.children.length === 1 && historyList.children[0].textContent.includes("No previous requests")) {
        historyList.innerHTML = "";
    }

    // Create history item
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div>
                <strong>${doctorName}</strong> requested a <strong>${specialist}</strong> consultation with <strong>${doctorName}</strong>.
                <p style="color: #64748b; margin-top: 4px; font-size: 0.8rem;">"${patientCondition}"</p>
            </div>
            <span class="badge-status badge-available" style="font-size: 0.7rem; padding: 2px 6px;">Submitted</span>
        </div>
    `;

    historyList.prepend(listItem);

    // Modern Success Toast instead of blocking alert
    showToast("Consultation requested successfully!", "success");

    // Reset form
    requestForm.reset();
});

// Medicine recommendations
const recommendations = {
    cold: `
        <h3>Recommended Medicines</h3>
        <ul>
            <li>Paracetamol</li>
            <li>Cetirizine</li>
            <li>Steam Inhalation</li>
        </ul>
    `,
    headache: `
        <h3>Recommended Medicines</h3>
        <ul>
            <li>Ibuprofen</li>
            <li>Hydration</li>
            <li>Proper Rest</li>
        </ul>
    `,
    fever: `
        <h3>Recommended Medicines</h3>
        <ul>
            <li>Paracetamol</li>
            <li>Electrolytes</li>
            <li>Doctor Consultation</li>
        </ul>
    `,
    fatigue: `
        <h3>Recommended Suggestions</h3>
        <ul>
            <li>Vitamin Supplements</li>
            <li>Sleep Improvement</li>
            <li>Balanced Diet</li>
        </ul>
    `
};

// Symptom change listener
symptomSelect.addEventListener("change", () => {
    const selected = symptomSelect.value;
    if (selected) {
        recommendationBox.innerHTML = recommendations[selected] || "";
    } else {
        recommendationBox.innerHTML = `<p style="color: #64748b; font-size: 0.9rem; text-align: center; padding: 10px;">Select a symptom above to view recommendations.</p>`;
    }
});

// Simulated live heart rate with micro pulse animation
const heartRate = document.getElementById("heartRate");
const heartBox = document.getElementById("heartBox");

if (heartRate && heartBox) {
    setInterval(() => {
        const randomRate = Math.floor(Math.random() * 15) + 70;
        heartRate.textContent = `${randomRate} BPM`;

        // Trigger pulse visual micro-animation
        heartBox.classList.add("pulse-active");
        setTimeout(() => {
            heartBox.classList.remove("pulse-active");
        }, 800);
    }, 3000);
}

// Sidebar collapsible toggle functionality
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        localStorage.setItem("medConsultSidebarCollapsed", sidebar.classList.contains("collapsed"));
    });

    // Restore state
    if (localStorage.getItem("medConsultSidebarCollapsed") === "true") {
        sidebar.classList.add("collapsed");
    }
}

// Interactive doctor booking triggers
document.querySelectorAll(".book-doctor-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest(".doctor-card");
        const docName = card.getAttribute("data-doctor-name");
        const docType = card.getAttribute("data-specialist-type");

        const docInput = document.getElementById("doctorName");
        const conditionInput = document.getElementById("patientCondition");
        const bookingCard = document.getElementById("bookingCard");

        if (docInput && conditionInput && bookingCard) {
            docInput.value = docName;

            // Clear specialist search filter so options exist
            if (specialistSearch) {
                specialistSearch.value = "";
                loadSpecialists(specialists);
            }

            // Select specialist
            specialistSelect.value = docType;

            // Scroll to form smoothly
            bookingCard.scrollIntoView({ behavior: "smooth" });

            // Focus on details
            setTimeout(() => {
                conditionInput.focus();
            }, 500);

            showToast(`Selected ${docName} (${docType}). Enter patient details below.`, "info");
        }
    });
});

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
    // Load specialist options
    loadSpecialists(specialists);

    // Render all static Lucide SVG Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});
// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");

    if (!toggleBtn) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Update icon based on current theme
    const updateThemeIcon = () => {
        const isDark = document.body.classList.contains("dark-mode");
        const icon = toggleBtn.querySelector("i");
        if (icon) {
            icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        }
    };

    // Set initial icon
    updateThemeIcon();

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        // Update icon on toggle
        updateThemeIcon();
    });
});

document.querySelector(".btn-danger").addEventListener("click", () => {
    alert("🚑 Emergency support activated!");
});

document.querySelector(".btn-primary").addEventListener("click", () => {
    alert("🏥 Nearby hospitals feature coming soon.");
});

document.querySelector(".btn-success").addEventListener("click", () => {
    document.getElementById("bookingCard")
        .scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".btn-secondary").addEventListener("click", () => {
    document.getElementById("historyList")
        .scrollIntoView({ behavior: "smooth" });
});