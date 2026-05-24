const specialists = [
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist"
];

const specialistSelect = document.getElementById("specialistType");
const specialistSearch = document.getElementById("specialistSearch");
const requestForm = document.getElementById("requestForm");
const historyList = document.getElementById("historyList");
const recommendationBox = document.getElementById("recommendationBox");
const symptomSelect = document.getElementById("symptomSelect");


// Load specialists into dropdown
function loadSpecialists(list) {

    specialistSelect.innerHTML =
        `<option value="">Select Specialist</option>`;

    list.forEach((specialist) => {

        const option = document.createElement("option");

        option.value = specialist;
        option.textContent = specialist;

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
