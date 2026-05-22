document.addEventListener('DOMContentLoaded', () => {

    const requestForm = document.getElementById('requestForm');

    const historyList = document.getElementById('historyList');

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

    function updateSpecialistOptions(searchText) {

        specialistTypeSelect.innerHTML = '';

        const filtered = specialists.filter(item =>
            item.toLowerCase().includes(searchText.toLowerCase())
        );

        filtered.forEach(specialist => {

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

});

function showRecommendation() {

    const symptom =
        document.getElementById('symptomSelect').value;

    const box =
        document.getElementById('recommendationBox');

    const recommendations = {

        cold:
            'Stay hydrated, take rest, and consider steam inhalation.',

        headache:
            'Maintain hydration and avoid excessive screen exposure.',

        fever:
            'Monitor temperature and consult a doctor if persistent.',

        fatigue:
            'Ensure proper sleep, hydration, and balanced nutrition.'
    };

    if (!symptom) {

        box.innerHTML =
            'Please select a symptom first.';

        return;
    }

    box.innerHTML =
        recommendations[symptom];
}
