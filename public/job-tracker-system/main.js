import { TrackerStore } from './trackerStore.js';

const store = new TrackerStore();

// Cache main terminal and metric views
const totalDisplay = document.getElementById('stat-total');
const rateDisplay = document.getElementById('stat-rate');
const logConsole = document.getElementById('system-log');
const toast = document.getElementById('toast');

// Cache column count displays
const countDisplays = {
    Applied: document.getElementById('count-applied'),
    Interviewing: document.getElementById('count-interviewing'),
    Offered: document.getElementById('count-offered'),
    Rejected: document.getElementById('count-rejected')
};

// Cache stat displays
const statDisplays = {
    Applied: document.getElementById('stat-applied'),
    Interviewing: document.getElementById('stat-interviewing'),
    Offered: document.getElementById('stat-offered'),
    Rejected: document.getElementById('stat-rejected')
};

// Initialize Drag & Drop Receivers across Kanban Column blocks
const columns = document.querySelectorAll('.kanban-column');

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') {
        toast.classList.add('error');
    }
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function renderMetrics() {
    const stats = store.calculateAnalytics();
    totalDisplay.textContent = stats.total;
    rateDisplay.textContent = stats.conversionRate;
    
    // Update individual stat displays
    statDisplays.Applied.textContent = stats.Applied || 0;
    statDisplays.Interviewing.textContent = stats.Interviewing || 0;
    statDisplays.Offered.textContent = stats.Offered || 0;
    statDisplays.Rejected.textContent = stats.Rejected || 0;
    
    // Update column counts
    countDisplays.Applied.textContent = stats.Applied || 0;
    countDisplays.Interviewing.textContent = stats.Interviewing || 0;
    countDisplays.Offered.textContent = stats.Offered || 0;
    countDisplays.Rejected.textContent = stats.Rejected || 0;
    
    logConsole.textContent += `\n[System Metrics Updated] Metrics Object: ${JSON.stringify(stats)}`;
    logConsole.scrollTop = logConsole.scrollHeight;
}

function renderJobCard(job) {
    const column = document.querySelector(`.kanban-column[data-stage="${job.stage}"]`);
    if (!column) return;
    
    // Remove empty class if present
    column.classList.remove('empty');
    
    const card = document.createElement('div');
    card.className = 'job-card';
    card.draggable = true;
    card.setAttribute('data-id', job.id);
    card.innerHTML = `
        <div class="role">${job.role}</div>
        <div class="company">${job.company}</div>
        <button class="delete-btn" data-id="${job.id}">✕</button>
    `;
    
    // Add drag listener
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
        logConsole.textContent += `\n[Drag Started] Tracking ID: ${card.getAttribute('data-id')}`;
        logConsole.scrollTop = logConsole.scrollHeight;
    });
    
    // Add delete listener
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteJob(job.id);
    });
    
    column.appendChild(card);
}

function loadAllJobs() {
    // Clear existing cards
    columns.forEach(column => {
        const cards = column.querySelectorAll('.job-card');
        cards.forEach(card => card.remove());
        column.classList.add('empty');
    });
    
    // Render all jobs
    const jobs = store.allJobs;
    if (jobs.length === 0) {
        columns.forEach(column => column.classList.add('empty'));
    } else {
        jobs.forEach(job => renderJobCard(job));
    }
    
    renderMetrics();
}

function deleteJob(jobId) {
    const job = store.allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Remove from store
    const index = store.allJobs.indexOf(job);
    if (index > -1) {
        store.allJobs.splice(index, 1);
        store.saveToStorage();
    }
    
    // Remove from DOM
    const card = document.querySelector(`[data-id="${jobId}"]`);
    if (card) {
        card.remove();
    }
    
    logConsole.textContent += `\n[Job Deleted] Removed job: ${job.company} - ${job.role}`;
    logConsole.scrollTop = logConsole.scrollHeight;
    
    // Check if column is empty
    const column = document.querySelector(`.kanban-column[data-stage="${job.stage}"]`);
    if (column && column.querySelectorAll('.job-card').length === 0) {
        column.classList.add('empty');
    }
    
    renderMetrics();
    showToast(`Deleted ${job.company} - ${job.role}`);
}

// Configure drop zones
columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');
        
        const jobId = e.dataTransfer.getData('text/plain');
        const targetStage = column.getAttribute('data-stage');

        if (jobId && targetStage) {
            const success = store.updateJobStage(jobId, targetStage);
            if (success) {
                // Move element in DOM tree manually
                const targetCard = document.querySelector(`[data-id="${jobId}"]`);
                if (targetCard) {
                    // Remove from old column
                    const oldColumn = targetCard.closest('.kanban-column');
                    if (oldColumn) {
                        // Check if old column becomes empty
                        const remainingCards = oldColumn.querySelectorAll('.job-card');
                        if (remainingCards.length === 1 && remainingCards[0] === targetCard) {
                            oldColumn.classList.add('empty');
                        }
                    }
                    
                    // Remove empty class from new column
                    column.classList.remove('empty');
                    
                    // Append to new column
                    column.appendChild(targetCard);
                    
                    const job = store.allJobs.find(j => j.id === jobId);
                    logConsole.textContent += `\n[State Mutation] Moved card ${jobId} (${job?.company}) -> ${targetStage}`;
                    logConsole.scrollTop = logConsole.scrollHeight;
                    renderMetrics();
                    showToast(`Moved to ${targetStage}`);
                }
            }
        }
    });
});

// Add job functionality
document.getElementById('add-job-btn').addEventListener('click', () => {
    const company = document.getElementById('company-input').value.trim();
    const role = document.getElementById('role-input').value.trim();
    const stage = document.getElementById('stage-select').value;
    
    if (!company || !role) {
        showToast('Please enter both company and role', 'error');
        return;
    }
    
    const newJob = store.addJob(company, role, stage);
    renderJobCard(newJob);
    renderMetrics();
    
    // Clear inputs
    document.getElementById('company-input').value = '';
    document.getElementById('role-input').value = '';
    
    logConsole.textContent += `\n[Job Added] ${company} - ${role} (${stage})`;
    logConsole.scrollTop = logConsole.scrollHeight;
    showToast(`Added ${company} - ${role}`);
});

// Enter key support for form inputs
document.getElementById('company-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('role-input').focus();
    }
});

document.getElementById('role-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('add-job-btn').click();
    }
});

// Clear all jobs
document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (store.allJobs.length === 0) {
        showToast('No jobs to clear', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear all jobs?')) {
        store.allJobs = [];
        store.saveToStorage();
        loadAllJobs();
        logConsole.textContent += '\n[System] All jobs cleared';
        logConsole.scrollTop = logConsole.scrollHeight;
        showToast('All jobs cleared');
    }
});

// Clear log
document.getElementById('clear-log-btn').addEventListener('click', () => {
    logConsole.textContent = 'Log cleared...';
    logConsole.scrollTop = 0;
});

// Load initial data and render
loadAllJobs();

// Add initial sample data if empty
if (store.allJobs.length === 0) {
    const samples = [
        { company: 'Google', role: 'Frontend Engineer', stage: 'Applied' },
        { company: 'Microsoft', role: 'Backend Developer', stage: 'Interviewing' },
        { company: 'Amazon', role: 'Full Stack Developer', stage: 'Applied' },
        { company: 'Meta', role: 'Product Manager', stage: 'Offered' }
    ];
    
    samples.forEach(sample => {
        const job = store.addJob(sample.company, sample.role, sample.stage);
        renderJobCard(job);
    });
    renderMetrics();
    logConsole.textContent += '\n[System] Sample data loaded';
}