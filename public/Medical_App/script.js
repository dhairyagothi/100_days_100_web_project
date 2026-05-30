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
    const consultationHistory = [];

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
        historyList.innerHTML = '';
        consultationHistory.forEach((historyItem) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${historyItem.date}</strong><br>
                Doctor: ${historyItem.doctorName} <br>
                Condition: ${historyItem.condition} <br>
                Specialist: ${historyItem.specialist} <br>
                Status: ${historyItem.status} <br>
                <em>${historyItem.notes || ''}</em>
                <br><br>
            `;
            historyList.appendChild(listItem);
        });
    }

    specialistSearch.addEventListener('input', (event) => {
        updateSpecialistOptions(event.target.value);
    });

    updateSpecialistOptions('');

    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();
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
                doctorName: doctorName,
                condition: patientCondition,
                specialist: specialistType,
                status: 'Pending',
                notes: ''
            };
            consultationHistory.push(newHistoryItem);
            renderHistory();

            statusMessage.textContent = `Consultation requested for Dr.${doctorName} regarding ${patientCondition}.            
            Specialist type: ${specialistType}.`;
            specialistResponseSection.style.display = 'block';
            requestForm.reset();
        }, 2000);
    });

    responseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const consultationId = document.getElementById('consultationId').value;
        const suggestion = document.getElementById('suggestion').value;

        const historyItem = consultationHistory.find(item => item.date === consultationId);
        if (historyItem) {
            historyItem.status = 'Completed';
            historyItem.notes = suggestion;
            renderHistory();
        }

        statusMessage.innerHTML = `Suggestion submitted for Consultation ID <strong>${consultationId}</strong>:${suggestion}`;
        responseForm.reset();
    });

    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const feedbackMessage = document.getElementById('feedbackMessage').value;

        statusMessage.textContent = `Feedback received: ${feedbackMessage}`;
        feedbackForm.reset();
    });
});
