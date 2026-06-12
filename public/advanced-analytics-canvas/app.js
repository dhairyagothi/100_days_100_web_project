import { AnalyticsCanvasEngine } from './canvasEngine.js';

const canvasElement = document.getElementById('algo-canvas');
const engine = new AnalyticsCanvasEngine(canvasElement);

// Cache DOM dashboard trackers
const triggerBtn = document.getElementById('trigger-sort-btn');
const logTerminal = document.getElementById('terminal-log');
const sizeMetric = document.getElementById('metric-size');
const passesMetric = document.getElementById('metric-passes');
const timeMetric = document.getElementById('metric-time');
const fpsRenderMetric = document.getElementById('metric-fps-time');

const algoSelect =
document.getElementById(
'algorithmSelect'
);


const comparisonMetric =
document.getElementById(
'metric-comparisons'
);

const telemetryHandler =
(data)=>{

passesMetric.textContent =
`${data.passes}`;

comparisonMetric.textContent =
`${data.comparisons}`;

fpsRenderMetric.textContent =
`${data.renderTimeMs.toFixed(2)} ms`;

};



// Core constants parameters setup
const VECTOR_ARRAY_CAPACITY = 100;

// Initialize layout arrays profiles
const allocatedCount = engine.generateArray(VECTOR_ARRAY_CAPACITY);
sizeMetric.textContent = `${allocatedCount} items allocated`;

triggerBtn.addEventListener('click', async () => {
    triggerBtn.disabled = true;
    logTerminal.textContent += `\n[Core Initialized] Re-allocating dynamic layout data bounds...`;

    engine.generateArray(VECTOR_ARRAY_CAPACITY);
    passesMetric.textContent = "0 operations";
    comparisonMetric.textContent = "0";
    timeMetric.textContent = "Running calculation algorithms...";

    logTerminal.textContent += `\n[Processing Hook Engaged] Starting algorithmic optimization sweep...`;

    // High-Precision Computation Timer Capture Bounds
    const startTime = performance.now();

    await engine.executeBubbleSort((telemetryData) => {
        // Continuous updates sent from engine threads loop
        passesMetric.textContent = `${telemetryData.passes.toLocaleString()} structural changes`;
        fpsRenderMetric.textContent = `${telemetryData.renderTimeMs.toFixed(2)} ms`;
    });

    const selected =
algoSelect.value;

if (selected === 'bubble') {

    await engine.executeBubbleSort(
        telemetryHandler
    );

} else if (
    selected === 'selection'
) {

    await engine.executeSelectionSort(
        telemetryHandler
    );

} else if (
    selected === 'insertion'
)
 {

    await engine.executeInsertionSort(
        telemetryHandler
    );
} else if (
    selected === 'quick'
) {

    await engine.executeQuickSort(
        telemetryHandler
    );
}
    const finalDuration = performance.now() - startTime;

    // Display final completed calculation profile analytics
    timeMetric.textContent = `${finalDuration.toFixed(4)} ms`;
    logTerminal.textContent += `\n[Process Finished Successfully] Memory matrix optimized cleanly in ${finalDuration.toFixed(2)}ms. Rendering frame cycles cleared.`;

    triggerBtn.disabled = false;
});