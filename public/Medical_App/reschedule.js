const form = document.getElementById('rescheduleForm');

let consultationHistory= JSON.parse(localStorage.getItem('consultations'))|| [];

form.addEventListener('submit', (event) => {
        event.preventDefault();
        let patient = document.getElementById('patientName').value;
        let doctor = document.getElementById('doctorName').value;
        let appointmentdate = document.getElementById('appointmentDate').value;
        let found = false;
        const today = new Date().toISOString().split('T')[0];
        consultationHistory.forEach((item) => {
            if (item.patientName === patient && item.doctorName === doctor) {
                if (appointmentdate >= today) {
                    item.date = appointmentdate;
                    found = true;
                    console.log("found");
                }
            }
        });
        localStorage.setItem('consultations', JSON.stringify(consultationHistory));
        if (appointmentdate < today) alert("Appointments cant be made in past");
        else if (found) alert("Appointment is rescheduled.");
        else alert("Appointment not found.");
    });
