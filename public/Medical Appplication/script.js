document.addEventListener('DOMContentLoaded', function() {
    const specialists = [
        { id: 'cardiologist', name: 'Cardiologist' },
        { id: 'neurologist', name: 'Neurologist' },
        { id: 'orthopedic', name: 'Orthopedic' },
        { id: 'pediatrician', name: 'Pediatrician' }
    ];

    const specialistSelect = document.getElementById('specialistType');
    specialists.forEach(specialist => {
        const option = document.createElement('option');
        option.value = specialist.id;
        option.textContent = specialist.name;
        specialistSelect.appendChild(option);
    });

    document.getElementById('requestForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const doctorName = document.getElementById('doctorName').value;
        const patientCondition = document.getElementById('patientCondition').value;
        const specialistType = document.getElementById('specialistType').value;
        const specialistName = specialists.find(s => s.id === specialistType).name;

        // Simulate sending the consultation request and receiving a consultation ID
        const consultationId = 'C12345'; // This would be generated by the backend
        setTimeout(() => {
            document.getElementById('statusMessage').innerHTML = `
                <p><strong>Consultation request sent successfully!</strong></p>
                <p>Consultation ID: ${consultationId}</p>
                <p>Doctor: ${doctorName}</p>
                <p>Condition: ${patientCondition}</p>
                <p>Specialist: ${specialistName}</p>
            `;
            document.getElementById('specialist-response').style.display = 'block'; // Show specialist response section
        }, 1000);
    });

    document.getElementById('responseForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const consultationId = document.getElementById('consultationId').value;
        const suggestion = document.getElementById('suggestion').value;

        // Simulate sending the specialist's suggestion
        setTimeout(() => {
            // Display the specialist's suggestion to the local doctor
            document.getElementById('statusMessage').innerHTML += `
                <p><strong>Specialist's Suggestion for Consultation ID ${consultationId}:</strong></p>
                <p>${suggestion}</p>
            `;
            alert(`Suggestion for Consultation ID ${consultationId} submitted successfully!`);
        }, 1000);
    });
});
