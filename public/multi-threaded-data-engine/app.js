// Spawn a completely new background thread execution workspace instance
const dataWorker = new Worker('worker.js');

// Cache core element nodes
const searchInput = document.getElementById('thread-search');
const threadDiagnostics = document.getElementById('thread-report');
const resultsView = document.getElementById('results-view');

// Generate 100,000 deep structural mock records inside local memory
const mockDataset = [];
const companies = ['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Microsoft', 'VIT Solutions'];
const roles = ['Systems Architect', 'Frontend Lead', 'AI Research Fellow', 'Data Scientist', 'Kernel Dev'];

for (let i = 1; i <= 100000; i++) {
    mockDataset.push({
        id: i,
        company: companies[i % companies.length],
        role: roles[i % roles.length] + ` (Lead Account #${i})`
    });
}

// Stream the dataset array map to the background thread pool instantly
dataWorker.postMessage({ command: 'INITIALIZE_DATASET', payload: mockDataset });
threadDiagnostics.textContent = "[Main Thread] Transporting 100,000 structured objects to background worker memory...";

// Intercept incoming computational blocks back from the Web Worker thread
dataWorker.onmessage = function (e) {
    const { status, count, results } = e.data;

    if (status === 'READY') {
        threadDiagnostics.textContent = `[Background Thread Connected] Concurrent memory matrix locked. Total elements managed: ${count.toLocaleString()}`;
    }

    if (status === 'QUERY_COMPLETE') {
        // Clear previous visual items
        resultsView.innerHTML = '';
        
        if (results.length === 0) {
            resultsView.textContent = "No concurrent match vectors located in background memory structures.";
            threadDiagnostics.textContent = `[Search Evaluation Finished] 0 records matched. UI remains fully operational.`;
            return;
        }

        // Splice and draw the top 10 dynamic records safely as plain text elements
        const displayLimit = results.slice(0, 10);
        displayLimit.forEach(item => {
            const rowElement = document.createElement('div');
            rowElement.style.padding = '4px 0';
            rowElement.textContent = `[Match Found] ${item.company} ➔ ${item.role}`;
            resultsView.appendChild(rowElement);
        });

        threadDiagnostics.textContent = `[Asynchronous Action Finished] Found ${results.length.toLocaleString()} matching rows in background memory. UI Thread stayed completely responsive!`;
    }
};

// Dispatch text inputs to worker background threads 
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    threadDiagnostics.textContent = "[Main Thread] Forwarding evaluation query block to background worker context...";
    
    // Command the worker to crunch calculations asynchronously
    dataWorker.postMessage({ command: 'EXECUTE_QUERY', payload: { searchTerm: query } });
});