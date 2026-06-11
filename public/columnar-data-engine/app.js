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

    // Append plain-text rows onto the screen layout window
    const summaryRow1 = document.createElement('div');
    summaryRow1.style.padding = '4px 0';
    summaryRow1.textContent = `➔ Total Combined System Pipeline Value: $${totalPipelineValue.toLocaleString()}`;

    const summaryRow2 = document.createElement('div');
    summaryRow2.style.padding = '4px 0';
    summaryRow2.textContent = `➔ Mathematical Average Interview Score: ${averageInterviewScore.toFixed(2)}%`;

    const summaryRow3 = document.createElement('div');
    summaryRow3.style.padding = '4px 0';
    summaryRow3.textContent = `➔ Aggregation Vector Pipeline Latency: ${totalDuration.toFixed(4)}ms`;

    metricsView.appendChild(summaryRow1);
    metricsView.appendChild(summaryRow2);
    metricsView.appendChild(summaryRow3);
});