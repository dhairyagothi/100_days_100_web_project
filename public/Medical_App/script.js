document.addEventListener('DOMContentLoaded', () => {

    const requestForm = document.getElementById('requestForm');

    const historyList = document.getElementById('historyList');

    const specialistSearch =
        document.getElementById('specialistSearch');

    const specialistTypeSelect =
        document.getElementById('specialistType');

    // Target DOM nodes for the Safe Medicine module
    const symptomSelect =
        document.getElementById('symptomSelect');
    const recommendationBox =
        document.getElementById('recommendationBox');    

    const specialists = [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Psychiatrist',
        'Pediatrician',
        'Orthopedic Surgeon'
    ];

    const consultationHistory = [];

    // Immutable Data Mapping Engine for Symptoms and Safe Recommendations
    const MEDICINE_CATALOG = Object.freeze({
        cold: {
            medicines: ["Antihistamines", "Saline Nasal Spray"],
            guidelines: "Stay hydrated, prioritize deep rest, and leverage steam inhalation protocols.",
            contraindications: "Severe hypertension"
        },
        headache: {
            medicines: ["Ibuprofen", "Acetaminophen"],
            guidelines: "Maintain aggressive liquid hydration and avoid excessive screen emission exposure.",
            contraindications: "Active stomach ulcers"
        },
        fever: {
            medicines: ["Paracetamol (Acetaminophen)"],
            guidelines: "Track thermal core temperature variations carefully. Avoid exceeding 4,000mg per 24 hours.",
            contraindications: "Advanced liver impairment"
        },
        fatigue: {
            medicines: ["Multivitamin Supplements", "Electrolyte Replacements"],
            guidelines: "Ensure consistent REM sleep cycles, hydration balance, and balanced caloric nutrition intake.",
            contraindications: "Chronic underlying metabolic conditions"
        }
    });

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

//Modern Real-time Data-Driven State Event Architecture
function handleSymptomRenderPipeline(){
    const selectedValue = symptomSelect.value;

    if(!selectedValue || !MEDICINE_CATALOG[selectedValue]){
        recommendationBox.innerHTML = `
            <p class="text-slate-400 italic" style="color: #64748b; font-style: italic;">
                Please select a documented symptom category from the dropdown menu to generate therapeutic recommendations.
            </p>
        `;
        return;
    }

    const data = MEDICINE_CATALOG[selectedValue];

    recommendationBox.innerHTML = `
       <div class="recommendation-card" style="border-left: 4px solid #3b82f6; padding: 1rem; margin-top: 1rem; background-color: #f8fafc; border-radius: 0 4px 4px 0;">
                <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1rem; font-weight: 700;">💊 Suggested Alternatives:</h4>
                <p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.9rem;">${data.medicines.join(", ")}</p>
                
                <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1rem; font-weight: 700;">📋 Functional Guidelines:</h4>
                <p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.9rem;">${data.guidelines}</p>
                
                <div style="padding: 0.5rem; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 4px; margin-top: 0.5rem;">
                    <span style="color: #dc2626; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 0.25rem;">⚠️ Critical Contraindications:</span>
                    <span style="color: #991b1b; font-size: 0.75rem;">${data.contraindications}</span>
                </div>
            </div> 
    `;
}

// Attach modern, scalable change listener to the selection dropdown block
symptomSelect.addEventListener('change', handleSymptomRenderPipeline);

// Initialize standard fallback layout on page startup
handleSymptomRenderPipeline();
});
