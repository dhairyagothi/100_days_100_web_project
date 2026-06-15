import { AnalyticsCanvasEngine } from './canvasEngine.js';

const canvasElement = document.getElementById('algo-canvas');
const engine = new AnalyticsCanvasEngine(canvasElement);

// Cache DOM dashboard trackers
const triggerBtn = document.getElementById('trigger-sort-btn');
const generateBtn = document.getElementById('generate-dataset-btn');
const logTerminal = document.getElementById('terminal-log');
const sizeMetric = document.getElementById('metric-size');
const passesMetric = document.getElementById('metric-passes');
const timeMetric = document.getElementById('metric-time');
const fpsRenderMetric = document.getElementById('metric-fps-time');
const algoSelect = document.getElementById('algorithmSelect');
const comparisonMetric = document.getElementById('metric-comparisons');

const telemetryHandler = (data) => {
    passesMetric.textContent = `${data.passes}`;
    comparisonMetric.textContent = `${data.comparisons}`;
    fpsRenderMetric.textContent = `${data.renderTimeMs.toFixed(2)} ms`;
};

// Core constants parameters setup
const VECTOR_ARRAY_CAPACITY = 100;

// Initialize layout arrays profiles
const allocatedCount = engine.generateArray(VECTOR_ARRAY_CAPACITY);
sizeMetric.textContent = `${allocatedCount} items allocated`;

// Helper to reset telemetry display
function resetMetrics() {
    passesMetric.textContent = '0 operations';
    comparisonMetric.textContent = '0';
    timeMetric.textContent = '0.0000 ms';
    fpsRenderMetric.textContent = '0.00 ms';
}

// Helper to set interactive controls enabled/disabled
function setControlsEnabled(enabled) {
    triggerBtn.disabled = !enabled;
    generateBtn.disabled = !enabled;
    algoSelect.disabled = !enabled;
}

// When the user switches algorithms, restore the original unsorted dataset
algoSelect.addEventListener('change', () => {
    engine.restoreArray();
    resetMetrics();
    logTerminal.textContent += `\n[Algorithm Changed] Dataset restored to original state. Ready for ${algoSelect.options[algoSelect.selectedIndex].text.trim()}.`;
});

// Generate a fresh randomized dataset
generateBtn.addEventListener('click', () => {
    const count = engine.generateArray(VECTOR_ARRAY_CAPACITY);
    sizeMetric.textContent = `${count} items allocated`;
    resetMetrics();
    logTerminal.textContent += `\n[New Dataset] Generated ${count} new randomized data entries.`;
});

// Sort button: restore original dataset, then sort with the selected algorithm
triggerBtn.addEventListener('click', async () => {
    setControlsEnabled(false);

    // Restore original dataset so every algorithm starts from the same input
    engine.restoreArray();
    resetMetrics();
    timeMetric.textContent = 'Running calculation algorithms...';

    const selected = algoSelect.value;
    const algoName = algoSelect.options[algoSelect.selectedIndex].text.trim();

    logTerminal.textContent += `\n[Core Initialized] Re-allocating dynamic layout data bounds...`;
    logTerminal.textContent += `\n[Processing Hook Engaged] Starting ${algoName} sweep...`;

    // High-Precision Computation Timer Capture Bounds
    const startTime = performance.now();

    if (selected === 'bubble') {
        await engine.executeBubbleSort(telemetryHandler);
    } else if (selected === 'selection') {
        await engine.executeSelectionSort(telemetryHandler);
    } else if (selected === 'insertion') {
        await engine.executeInsertionSort(telemetryHandler);
    } else if (selected === 'quick') {
        await engine.executeQuickSort(telemetryHandler);
    } else if (selected === 'merge') {
        await engine.executeMergeSort(telemetryHandler);
    }

    const finalDuration = performance.now() - startTime;

    // Display final completed calculation profile analytics
    timeMetric.textContent = `${finalDuration.toFixed(4)} ms`;
    logTerminal.textContent += `\n[Process Finished Successfully] ${algoName} completed in ${finalDuration.toFixed(2)}ms. Rendering frame cycles cleared.`;

    setControlsEnabled(true);
});