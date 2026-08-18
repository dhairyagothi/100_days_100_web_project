import { ColumnarDataMatrix } from './columnarKernel.js';

// Define the schema boundaries
const matrix = new ColumnarDataMatrix(['id', 'leadValue', 'interviewScore']);

const logTerminal = document.getElementById('matrix-log');
const runBtn = document.getElementById('run-btn');
const metricsView = document.getElementById('matrix-results');

logTerminal.textContent = "[System Context] Generating 100,000 mock application tracking records...";

// Generate baseline mock rows
const rawRows = [];
for (let i = 1; i <= 100000; i++) {
    rawRows.push({
        id: i,
        leadValue: Math.floor(Math.random() * 5000) + 500, // Simulated financial value ($500 - $5500)
        interviewScore: Math.floor(Math.random() * 60) + 40 // Simulated test tracking matrix scores (40 - 100)
    });
}

// Transpose the row objects into columnar vectors
matrix.loadRows(rawRows);
logTerminal.textContent += `\n[Matrix Locked] 100,000 items split into distinct column vector tracks.`;

runBtn.addEventListener('click', () => {
    metricsView.innerHTML = '';
    logTerminal.textContent += `\n[Execution Started] Firing targeted vector reductions over 100,000 records...`;

    // Benchmark the calculation speed of the isolated vector sweeps
    const startTime = performance.now();

    const totalPipelineValue = matrix.aggregateSum('leadValue');
    const averageInterviewScore = matrix.aggregateAverage('interviewScore');

    const totalDuration = performance.now() - startTime;

    logTerminal.textContent += `\n[Metrics Calculated] Reductions finished in ${totalDuration.toFixed(4)}ms!`;

    // Render premium, responsive metric cards
    metricsView.innerHTML = `
        <div class="metric-card value-card animate-fade-in">
            <div class="metric-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div class="metric-content">
                <span class="metric-label">Total System Pipeline Value</span>
                <span class="metric-value">$${totalPipelineValue.toLocaleString()}</span>
            </div>
        </div>
        <div class="metric-card score-card animate-fade-in" style="animation-delay: 0.1s;">
            <div class="metric-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div class="metric-content">
                <span class="metric-label">Average Interview Score</span>
                <span class="metric-value">${averageInterviewScore.toFixed(2)}%</span>
            </div>
        </div>
        <div class="metric-card latency-card animate-fade-in" style="animation-delay: 0.2s;">
            <div class="metric-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="metric-content">
                <span class="metric-label">Vector Pipeline Latency</span>
                <span class="metric-value">${totalDuration.toFixed(4)} <span class="unit">ms</span></span>
            </div>
        </div>
    `;
});