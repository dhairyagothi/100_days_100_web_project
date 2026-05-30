// Emergency Help Buttons

const emergencyButtons = document.querySelectorAll(".emergency-grid button");

emergencyButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const text = button.textContent;

        if(text.includes("Ambulance")){

            showEmergencyToast(
                "🚑 Calling ambulance support..."
            );

        }

        else if(text.includes("Hospital")){

            showEmergencyToast(
                "🏥 Searching nearby hospitals..."
            );

        }

        else if(text.includes("Doctor")){

            showEmergencyToast(
                "👨‍⚕️ Connecting emergency doctor..."
            );

        }

    });

});


// Emergency Toast Function

function showEmergencyToast(message){

    const toast = document.createElement("div");

    toast.className = "emergency-toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide-toast");

        setTimeout(() => {

            toast.remove();

        }, 500);

    }, 3000);

}