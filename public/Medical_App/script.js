document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('requestForm');
    const responseForm = document.getElementById('responseForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const statusMessage = document.getElementById('statusMessage');
    const loading = document.getElementById('loading');
    const historyList = document.getElementById('historyList');
    const specialistSearch = document.getElementById('specialistSearch');
    const specialistTypeSelect = document.getElementById('specialistType');
    const statusFilter = document.getElementById('statusFilter');
    const formError = document.getElementById('formError');
    const responseError = document.getElementById('responseError');

    const specialists = [
        'Allergist/Immunologist',
        'Anesthesiologist',
        'Cardiologist',
        'Dermatologist',
        'Endocrinologist',
        'Gastroenterologist',
        'Hematologist',
        'Nephrologist',
        'Neurologist',
        'Oncologist',
        'Ophthalmologist',
        'Otolaryngologist (ENT)',
        'Pediatrician',
        'Psychiatrist',
        'Pulmonologist',
        'Rheumatologist',
        'Urologist',
        'Cardiothoracic Surgeon',
        'General Surgeon',
        'Neurosurgeon',
        'Orthopedic Surgeon',
        'Plastic Surgeon',
        'Vascular Surgeon',
        'Family Medicine Physician',
        'General Practitioner (GP)',
        'Internal Medicine Physician (Internist)'
    ];

    let consultationHistory = JSON.parse(localStorage.getItem('consultationHistory')) || [];

    function saveHistory() {
        localStorage.setItem('consultationHistory', JSON.stringify(consultationHistory));
    }

    function createConsultationId() {
        return `CONS-${Date.now()}`;
    }

    function updateSpecialistOptions(searchText) {
        specialistTypeSelect.innerHTML = '';

        const filteredSpecialists = specialists.filter((specialist) =>
            specialist.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filteredSpecialists.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No specialist found';
            specialistTypeSelect.appendChild(option);
            return;
        }

        filteredSpecialists.forEach((specialist) => {
            const option = document.createElement('option');
            option.value = specialist;
            option.textContent = specialist;
            specialistTypeSelect.appendChild(option);
        });
    }

    function renderHistory() {
        const selectedStatus = statusFilter.value;
        const filteredHistory = consultationHistory.filter((item) =>
            selectedStatus === 'All' || item.status === selectedStatus
        );

        historyList.innerHTML = '';

        if (filteredHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-state';
            emptyItem.textContent = 'No consultations found.';
            historyList.appendChild(emptyItem);
            return;
        }

        filteredHistory.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.className = `history-card ${item.status.toLowerCase()}`;

            const title = document.createElement('strong');
            title.textContent = `${item.id} - ${item.status}`;

            const details = document.createElement('p');
            details.textContent = `Date: ${item.date}`;

            const doctor = document.createElement('p');
            doctor.textContent = `Doctor: ${item.doctorName}`;

            const condition = document.createElement('p');
            condition.textContent = `Condition: ${item.condition}`;

            const specialist = document.createElement('p');
            specialist.textContent = `Specialist: ${item.specialist}`;

            const notes = document.createElement('p');
            notes.textContent = item.notes ? `Suggestion: ${item.notes}` : 'Suggestion: Not provided yet';

            listItem.append(title, details, doctor, condition, specialist, notes);
            historyList.appendChild(listItem);
        });
    }

    function validateConsultationForm(doctorName, patientCondition, specialistType) {
        const namePattern = /^[A-Za-z .'-]{3,}$/;

        if (!namePattern.test(doctorName)) {
            return 'Please enter a valid doctor name with at least 3 letters.';
        }

        if (patientCondition.length < 10) {
            return 'Please describe the patient condition in at least 10 characters.';
        }

        if (!specialistType) {
            return 'Please select a valid specialist.';
        }

        return '';
    }

    specialistSearch.addEventListener('input', (event) => {
        updateSpecialistOptions(event.target.value);
    });

    statusFilter.addEventListener('change', renderHistory);

    requestForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const doctorName = document.getElementById('doctorName').value.trim();
        const patientCondition = document.getElementById('patientCondition').value.trim();
        const specialistType = specialistTypeSelect.value;

        const validationMessage = validateConsultationForm(doctorName, patientCondition, specialistType);

        if (validationMessage) {
            formError.textContent = validationMessage;
            return;
        }

        formError.textContent = '';
        loading.hidden = false;
        statusMessage.textContent = '';

        setTimeout(() => {
            const newHistoryItem = {
                id: createConsultationId(),
                date: new Date().toLocaleString(),
                doctorName,
                condition: patientCondition,
                specialist: specialistType,
                status: 'Pending',
                notes: ''
            };

            consultationHistory.unshift(newHistoryItem);
            saveHistory();
            renderHistory();

            loading.hidden = true;
            statusMessage.textContent =
                `Consultation requested successfully.\nConsultation ID: ${newHistoryItem.id}\nSpecialist type: ${specialistType}`;

            requestForm.reset();
            updateSpecialistOptions('');
        }, 800);
    });

    responseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const consultationId = document.getElementById('consultationId').value.trim();
        const suggestion = document.getElementById('suggestion').value.trim();
        const urgencyLevel = document.getElementById('urgencyLevel').value;
        const recommendedTests = document.getElementById('recommendedTests').value.trim();
        const followUpDate = document.getElementById('followUpDate').value;

        if (suggestion.length < 10) {
            responseError.textContent = 'Please enter a suggestion with at least 10 characters.';
            return;
        }

        const historyItem = consultationHistory.find((item) => item.id === consultationId);

        if (!historyItem) {
            responseError.textContent = 'No consultation found with this ID.';
            return;
        }

        responseError.textContent = '';
        historyItem.status = 'Completed';
         historyItem.notes = suggestion;
       historyItem.urgencyLevel = urgencyLevel;
     historyItem.recommendedTests = recommendedTests || 'Not specified';
      historyItem.followUpDate = followUpDate || 'Not specified';

        saveHistory();
        renderHistory();

        statusMessage.textContent = `Suggestion submitted for Consultation ID ${consultationId}.`;
        responseForm.reset();
    });

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const feedbackMessage = document.getElementById('feedbackMessage').value.trim();
        const rating = document.getElementById('rating').value;

        const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];

        feedbackList.unshift({
            message: feedbackMessage,
            rating,
            date: new Date().toLocaleString()
        });

        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        statusMessage.textContent = `Thank you for your feedback. Rating received: ${rating}/5.`;
        feedbackForm.reset();
    });

    updateSpecialistOptions('');
    renderHistory();
});