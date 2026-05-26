document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle controller
    const themeToggleBtn = document.getElementById('themeToggle');
    
    const sunIconSVG = `
        <svg class="theme-icon sun-icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    const moonIconSVG = `
        <svg class="theme-icon moon-icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = sunIconSVG;
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
            }
        } else {
            document.body.setAttribute('data-theme', 'light');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = moonIconSVG;
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
            }
        }
    }

    // Restore and synchronize UI state based on restored data-theme state
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    updateThemeUI(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('medical-theme', activeTheme);
            updateThemeUI(activeTheme);
        });
    }

    const requestForm = document.getElementById('requestForm');
    const responseForm = document.getElementById('responseForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const statusMessage = document.getElementById('statusMessage');
    const loading = document.getElementById('loading');
    const specialistResponseSection = document.getElementById('specialist-response');
    const historyList = document.getElementById('historyList');
    const specialistSearch = document.getElementById('specialistSearch');
    const specialistTypeSelect = document.getElementById('specialistType');
    const specialists = ['Allergist/Immunologist', 'Anesthesiologist', 'Cardiologist', 'Dermatologist', 'Endocrinologist', 'Gastroenterologist', 'Hematologist', 'Nephrologist', 'Neurologist', 'Oncologist', 'Ophthalmologist', 'Otolaryngologist (ENT)', 'Pediatrician', 'Psychiatrist', 'Pulmonologist', 'Rheumatologist', 'Urologist', 'Cardiothoracic Surgeon', 'General Surgeon', 'Neurosurgeon', 'Orthopedic Surgeon', 'Plastic Surgeon', 'Vascular Surgeon', 'Family Medicine Physician', 'General Practitioner (GP)', 'Internal Medicine Physician (Internist)'];
    const consultationHistory = JSON.parse(localStorage.getItem('consultations')) || [];

    if (consultationHistory.length > 0) renderHistory();

    function updateSpecialistOptions(searchText) {
        specialistTypeSelect.innerHTML = '';
        const filteredSpecialists = specialists.filter(specialist => specialist.toLowerCase().includes(searchText.toLowerCase()));
        filteredSpecialists.forEach(specialist => {
            const option = document.createElement('option');
            option.value = specialist;
            option.textContent = specialist;
            specialistTypeSelect.appendChild(option);
        });
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        consultationHistory.forEach((historyItem) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${historyItem.date}</strong><br>
                Patient: ${historyItem.patientName} <br>
                Doctor: ${historyItem.doctorName} <br>
                Condition: ${historyItem.condition} <br>
                Specialist: ${historyItem.specialist} <br>
                Status: ${historyItem.status} <br>
                <em>${historyItem.notes || ''}</em>
                <br><br>
                <div class="cancel-appointment" style="display:none;">Cancelling Appointment...</div>
                <div id="buttons">
                    <a href="reschedule.html"><button id="reschedule">Reschedule</button></a>
                    <button class="cancel">Cancel</button>
                </div>
            `;
            historyList.appendChild(listItem);
        });

        document.querySelectorAll('.cancel').forEach((button, index) => {
            button.addEventListener('click', () => {
                document.querySelector('.cancel-appointment').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.cancel-appointment').style.display = 'none';
                    requestForm.reset();
                    statusMessage.textContent = '';
                    consultationHistory.splice(index, 1);
                    localStorage.setItem('consultations', JSON.stringify(consultationHistory));
                    renderHistory();
                }, 2000);
            })
        });
    }


    updateSpecialistOptions('');

    requestForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const patientName = document.getElementById('patientName').value;
        const doctorName = document.getElementById('doctorName').value;
        const patientCondition = document.getElementById('patientCondition').value;
        const specialistType = document.getElementById('specialistType').value;

        loading.style.display = 'block';
        statusMessage.textContent = '';

        setTimeout(() => {
            loading.style.display = 'none';
            const currentDate = new Date().toLocaleString();
            const newHistoryItem = {
                date: currentDate,
                patientName: patientName,
                doctorName: doctorName,
                condition: patientCondition,
                specialist: specialistType,
                status: 'Pending',
                notes: ''
            };
            consultationHistory.push(newHistoryItem);
            localStorage.setItem('consultations', JSON.stringify(consultationHistory));
            renderHistory();

            statusMessage.textContent = `Consultation requested for Dr.${doctorName} regarding ${patientCondition}.            
            Specialist type: ${specialistType}.`;
            specialistResponseSection.style.display = 'block';
            buttons.style.display = 'flex';
            requestForm.reset();
        }, 2000);
    });
    
    responseForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const consultationId = document.getElementById('consultationId').value;
        const suggestion = document.getElementById('suggestion').value;

        // Simulating response submission
        loading.style.display = 'block';
        statusMessage.textContent = '';

        setTimeout(() => {
            loading.style.display = 'none';
            const consultation = consultationHistory.find(c => c.date === consultationId);
            if (consultation) {
                consultation.status = 'Completed';
                consultation.notes = suggestion;
                localStorage.setItem('consultations', JSON.stringify(consultationHistory));
                renderHistory();
                statusMessage.textContent = `Response submitted for Consultation ID: ${consultationId}`;
            } else {
                statusMessage.textContent = `Consultation ID: ${consultationId} not found.`;
            }
            responseForm.reset();
        }, 2000);
    });
    
    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const feedbackMessage = document.getElementById('feedbackMessage').value;

        loading.style.display = 'block';
        statusMessage.textContent = '';

        setTimeout(() => {
            loading.style.display = 'none';
            statusMessage.textContent = `Feedback submitted: ${feedbackMessage}`;
            feedbackForm.reset();
        }, 2000);
    });

    // Live search filter inside DOMContentLoaded
    specialistSearch.addEventListener("input", () => {
        const searchValue = specialistSearch.value;
        updateSpecialistOptions(searchValue);
    });
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

const symptomSelect = document.getElementById("symptomSelect");
const recommendationBox = document.getElementById("recommendationBox");

if (symptomSelect && recommendationBox) {
    symptomSelect.addEventListener("change", () => {
        const selected = symptomSelect.value;
        recommendationBox.innerHTML = recommendations[selected] || "";
    });
}


// Simulated live heart rate
const heartRate = document.getElementById("heartRate");

if (heartRate) {
    setInterval(() => {
        const randomRate = Math.floor(Math.random() * 15) + 70;
        heartRate.textContent = `${randomRate} BPM`;
    }, 3000);
}



// Appointment Booking Modal Functionality
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalSuccess = document.getElementById("modalSuccess");
const bookBtns = document.querySelectorAll(".book-btn");

const patientNameInput = document.getElementById("patientName");
const patientPhoneInput = document.getElementById("patientPhone");
const appointmentDateInput = document.getElementById("appointmentDate");
const appointmentTimeInput = document.getElementById("appointmentTime");

const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const dateError = document.getElementById("dateError");
const timeError = document.getElementById("timeError");

let activeTriggerButton = null;
let currentDoctor = "";
let currentSpecialty = "";

// Set min date of date picker to today
function setMinAppointmentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    appointmentDateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Clear all validation errors
function clearErrors() {
    const errorSpans = [nameError, phoneError, dateError, timeError];
    errorSpans.forEach(span => {
        span.textContent = "";
    });

    const inputs = [patientNameInput, patientPhoneInput, appointmentDateInput, appointmentTimeInput];
    inputs.forEach(input => {
        input.classList.remove("invalid-input");
    });
}

// Open modal
function openModal(doctor, specialty, triggerButton) {
    activeTriggerButton = triggerButton;
    currentDoctor = doctor;
    currentSpecialty = specialty;

    modalSubtitle.innerHTML = `with <strong>${doctor}</strong> (${specialty})`;
    
    // Reset form and UI state
    bookingForm.reset();
    clearErrors();
    bookingForm.classList.remove("hidden");
    modalSuccess.classList.add("hidden");
    
    setMinAppointmentDate();
    
    // Show modal and lock background scrolling
    bookingModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    
    // Focus the first form input
    patientNameInput.focus();
}

// Close modal
function closeModal() {
    bookingModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    
    // Reset state
    bookingForm.reset();
    clearErrors();
    bookingForm.classList.remove("hidden");
    modalSuccess.classList.add("hidden");
    
    // Restore focus to triggering button
    if (activeTriggerButton) {
        activeTriggerButton.focus();
    }
}

// Bind open events to booking buttons
bookBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const doctor = btn.getAttribute("data-doctor");
        const specialty = btn.getAttribute("data-specialty");
        openModal(doctor, specialty, btn);
    });
});

// Bind close button actions
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
closeSuccessBtn.addEventListener("click", closeModal);

// Close on backdrop overlay click (only when clicking overlay specifically)
bookingModal.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
        closeModal();
    }
});

// Close on Escape key press
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !bookingModal.classList.contains("hidden")) {
        closeModal();
    }
});

// Real-time input clearing of invalid state
const setupRealTimeClear = (input, errorSpan) => {
    input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
            input.classList.remove("invalid-input");
            errorSpan.textContent = "";
        }
    });
};

setupRealTimeClear(patientNameInput, nameError);
setupRealTimeClear(patientPhoneInput, phoneError);
setupRealTimeClear(appointmentDateInput, dateError);
setupRealTimeClear(appointmentTimeInput, timeError);

// Submit form & validate
bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = patientNameInput.value.trim();
    const phoneVal = patientPhoneInput.value.trim();
    const dateVal = appointmentDateInput.value;
    const timeVal = appointmentTimeInput.value;

    let isValid = true;

    // Validate Name
    if (nameVal === "") {
        nameError.textContent = "Patient name is required.";
        patientNameInput.classList.add("invalid-input");
        isValid = false;
    }

    // Validate Phone (10 digits numeric)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneVal)) {
        phoneError.textContent = "Please enter a valid 10-digit phone number.";
        patientPhoneInput.classList.add("invalid-input");
        isValid = false;
    }

    // Validate Date
    if (!dateVal) {
        dateError.textContent = "Preferred date is required.";
        appointmentDateInput.classList.add("invalid-input");
        isValid = false;
    } else {
        // Enforce today or future date in JS validation as well
        const parts = dateVal.split('-');
        const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
        selectedDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate < today) {
            dateError.textContent = "Date cannot be in the past.";
            appointmentDateInput.classList.add("invalid-input");
            isValid = false;
        }
    }

    // Validate Time Slot
    if (timeVal === "") {
        timeError.textContent = "Please select an available time slot.";
        appointmentTimeInput.classList.add("invalid-input");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Dynamic History Item Addition matching existing format
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <strong>${nameVal}</strong> scheduled appointment with 
        <strong>${currentDoctor}</strong> (${currentSpecialty}) on 
        <strong>${dateVal}</strong> at <strong>${timeVal}</strong>
    `;
    historyList.prepend(listItem);

    // Render persistent success banner
    const successText = modalSuccess.querySelector(".success-text");
    successText.innerHTML = `✅ <strong>Success!</strong> Appointment booked for <strong>${nameVal}</strong> with <strong>${currentDoctor}</strong> on <strong>${dateVal}</strong> at <strong>${timeVal}</strong>.`;
    
    bookingForm.classList.add("hidden");
    modalSuccess.classList.remove("hidden");
    
    // Focus the Success Close button for accessibility
    closeSuccessBtn.focus();
});
