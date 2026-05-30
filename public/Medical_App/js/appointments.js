// Appointment Statistics Dashboard

const historyContainer = document.getElementById("historyList");

function updateAppointmentStats(){

    const totalAppointments =
        document.querySelectorAll("#historyList li").length;

    const statsBox =
        document.getElementById("appointmentStats");

    if(statsBox){

        statsBox.innerHTML = `
            <div class="appointment-stat-card">

                <h3>📅 Total Appointments</h3>

                <p>${totalAppointments}</p>

            </div>
        `;
    }
}


// Run initially
updateAppointmentStats();


// Observe History Changes Automatically

const observer = new MutationObserver(() => {

    updateAppointmentStats();

});

if(historyContainer){

    observer.observe(historyContainer, {

        childList:true
    });

}