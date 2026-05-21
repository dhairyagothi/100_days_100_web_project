document.addEventListener('DOMContentLoaded', () => {

    const requestForm = document.getElementById('requestForm');

    const historyList = document.getElementById('historyList');
    
    const specialistTypeSelect = document.getElementById('specialistType');

    const specialistSearch =
        document.getElementById('specialistSearch');

    const specialistTypeSelect =
        document.getElementById('specialistType');

    const specialists = [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Psychiatrist',
        'Pediatrician',
        'Orthopedic Surgeon'
    ];

    const consultationHistory = [];


    function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>
        <button>&times;</button>
    `;

    toast.querySelector('button').onclick = () => {
        toast.remove();
    };

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

    function updateSpecialistOptions() {
        specialistTypeSelect.innerHTML = '';
        const filteredSpecialists = specialists;
        filteredSpecialists.forEach(specialist => {
            const option = document.createElement('option');

            option.value = specialist;

            option.textContent = specialist;

            specialistTypeSelect.appendChild(option);

        });
    }

    specialistSearch.addEventListener('input', e => {
        updateSpecialistOptions(e.target.value);
    });

    updateSpecialistOptions('');

    requestForm.addEventListener('submit', e => {

        e.preventDefault();

        const doctorName =
            document.getElementById('doctorName').value;

        const patientCondition =
            document.getElementById('patientCondition').value;

        const specialistType =
            document.getElementById('specialistType').value;

        const consultation = {
            doctorName,
            patientCondition,
            specialistType,
            date: new Date().toLocaleString()
        };

        consultationHistory.push(consultation);

        renderHistory();

        alert('Consultation Submitted Successfully');

        requestForm.reset();
    });

    function renderHistory() {

        historyList.innerHTML = '';

        consultationHistory.forEach(item => {

            const li = document.createElement('li');

            li.innerHTML = `
                <strong>${item.date}</strong><br>
                Doctor: ${item.doctorName}<br>
                Condition: ${item.patientCondition}<br>
                Specialist: ${item.specialistType}
            `;

            historyList.appendChild(li);
        });
    }



    updateSpecialistOptions();

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
            showToast("Consultation request submitted!", "success");
        }, 2000);
    });

    const box =
        document.getElementById('recommendationBox');

        const historyItem = consultationHistory.find(item => item.date === consultationId);
        if (historyItem) {
            historyItem.status = 'Completed';
            historyItem.notes = suggestion;
            renderHistory();
            showToast("Suggestion submitted successfully!", "info");
        }
        else {
    showToast("Consultation ID not found!", "error");
}

        cold:
            'Stay hydrated, take rest, and consider steam inhalation.',

        headache:
            'Maintain hydration and avoid excessive screen exposure.',

        statusMessage.textContent = `Feedback received: ${feedbackMessage}`;
        feedbackForm.reset();
        showToast("Feedback submitted successfully!", "success");
    });
});
