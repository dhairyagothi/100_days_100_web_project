import { VirtualDOMEngine } from './virtualEngine.js';

// 1. Initialize our baseline massive dataset array map matrix
const massiveDataset = [];
const companies = ['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Microsoft', 'VIT Solutions'];
const roles = ['Systems Architect', 'Frontend Lead', 'AI Research Fellow', 'Data Scientist', 'Kernel Dev'];

for (let i = 1; i <= 100000; i++) {
    massiveDataset.push({
        id: i,
        company: companies[i % companies.length],
        role: roles[i % roles.length]
    });
}

// 2. Boot up the core pipeline viewport parameters
const viewportContainer = document.getElementById('virtual-viewport');
const diagnosticReport = document.getElementById('perf-report');

const engine = new VirtualDOMEngine(viewportContainer, massiveDataset, 35);

function updateDiagnosticMetrics() {
    const totalAttachedElements = document.getElementsByTagName('div').length;
    diagnosticReport.textContent = `[Benchmark Diagnostics] Total virtual items managed: ${massiveDataset.length.toLocaleString()} | Active physical DOM elements attached inside page: ${totalAttachedElements}`;
}
updateDiagnosticMetrics();

// 3. Manual Entry Control Logic 
const inputName = document.getElementById('manual-name');
const inputCompany = document.getElementById('manual-company');
const insertBtn = document.getElementById('insert-lead-btn');

insertBtn.addEventListener('click', () => {
    const nameVal = inputName.value.trim();
    const companyVal = inputCompany.value.trim();

    if (nameVal === "" || companyVal === "") {
        alert("Please provide both a Name and a Company Name!");
        return;
    }

    // Generate a fresh structural payload
    const manualLead = {
        id: `Custom_${Date.now()}`,
        company: companyVal,
        role: nameVal // Swapping role text context with the custom name string property safely
    };

    // Unshift puts your new entry at the very top (Index 0) so you see it instantly
    massiveDataset.unshift(manualLead);

    // Push the updated reference array down to the engine's tracking core
    engine.updateDataset(massiveDataset);

    // Clear input fields for subsequent operations
    inputName.value = "";
    inputCompany.value = "";

    // Update the layout status bar counters
    updateDiagnosticMetrics();
});