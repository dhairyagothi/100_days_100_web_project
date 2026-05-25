document.addEventListener('DOMContentLoaded', () => {
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

    list.forEach((specialist) => {

        const option = document.createElement("option");

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const feedbackMessage = document.getElementById('feedbackMessage').value;

        specialistSelect.appendChild(option);
    });
}

loadSpecialists(specialists);


// Live search filter
specialistSearch.addEventListener("input", () => {

    const searchValue =
        specialistSearch.value.toLowerCase();

    const filtered = specialists.filter((specialist) =>
        specialist.toLowerCase().includes(searchValue)
    );

    loadSpecialists(filtered);
});


// Consultation form submission
requestForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const doctorName =
        document.getElementById("doctorName").value;

    const patientCondition =
        document.getElementById("patientCondition").value;

    const specialist =
        specialistSelect.value;

    if (!specialist) {
        alert("Please select a specialist.");
        return;
    }

    // Create history item
    const listItem = document.createElement("li");

    listItem.innerHTML = `
        <strong>${doctorName}</strong> requested
        <strong>${specialist}</strong> consultation
        for "${patientCondition}"
    `;

    historyList.prepend(listItem);

    // Success message
    alert("✅ Consultation submitted successfully!");

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


// Symptom change
symptomSelect.addEventListener("change", () => {

    const selected =
        symptomSelect.value;

    recommendationBox.innerHTML =
        recommendations[selected] || "";
});


// Simulated live heart rate
const heartRate =
    document.getElementById("heartRate");

setInterval(() => {

    const randomRate =
        Math.floor(Math.random() * 15) + 70;

    heartRate.textContent =
        `${randomRate} BPM`;

}, 3000);
