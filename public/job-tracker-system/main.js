import { TrackerStore } from './trackerStore.js';

const store = new TrackerStore();

// Cache main terminal and metric views
const totalDisplay = document.getElementById('stat-total');
const rateDisplay = document.getElementById('stat-rate');
const logConsole = document.getElementById('system-log');

// Initialize Drag & Drop Receivers across Kanban Column blocks
const columns = document.querySelectorAll('.kanban-column');
const cards = document.querySelectorAll('.job-card');

function renderMetrics() {
    const stats = store.calculateAnalytics();
    totalDisplay.textContent = stats.total;
    rateDisplay.textContent = stats.conversionRate;
    logConsole.textContent += `\n[System Metrics Updated] Metrics Object: ${JSON.stringify(stats)}`;
}

// Attach Drag Hooks to individual task items
cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
        logConsole.textContent += `\n[Drag Started] Tracking ID: ${card.getAttribute('data-id')}`;
    });
});

// Configure drop zones to safely intercept payloads
columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); // Critical step to allow a drop action to happen
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const jobId = e.dataTransfer.getData('text/plain');
        const targetStage = column.getAttribute('data-stage');

        if (jobId && targetStage) {
            const success = store.updateJobStage(jobId, targetStage);
            if (success) {
                // Move element in DOM tree manually
                const targetCard = document.querySelector(`[data-id="${jobId}"]`);
                column.appendChild(targetCard);

                logConsole.textContent += `\n[State Mutation] Moved card ${jobId} -> ${targetStage}`;
                renderMetrics();
            }
        }
    });
});

// Run metrics calculation at start
renderMetrics();