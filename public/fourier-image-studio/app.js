import { FourierMathKernel } from './dftKernel.js';

const spatialCanvas = document.getElementById('canvas-spatial');
const sCtx = spatialCanvas.getContext('2d');
const freqCanvas = document.getElementById('canvas-freq');
const fCtx = freqCanvas.getContext('2d');

const logTerminal = document.getElementById('log-terminal');
const forwardBtn = document.getElementById('transform-btn');
const inverseBtn = document.getElementById('inverse-btn');
const forwardTimeLbl = document.getElementById('tel-forward-time');
const inverseTimeLbl = document.getElementById('tel-inverse-time');

const N = 128; // Standard computational matrix dimension limits
let spatialMatrix = Array.from({ length: N }, () => new Float64Array(N));
let fourierData = null;
let frequencyMask = Array.from({ length: N }, () => new Uint8Array(N).fill(1)); // 1 = passed, 0 = masked
let isDrawingMask = false;

// Synthesize a synthetic pixel field featuring synthetic artificial scanline noise
function initSyntheticSpatialSignal() {
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            // Base structural shape values
            const baseValue = (Math.sin(x / 10) * Math.cos(y / 10) > 0) ? 180 : 60;
            // High-frequency periodic hum noise vector injection
            const scanlineNoise = Math.sin(y * 1.2) * 45;
            spatialMatrix[x][y] = Math.min(255, Math.max(0, baseValue + scanlineNoise));
        }
    }
    renderSpatialMatrix(spatialMatrix);
}

function renderSpatialMatrix(matrix) {
    const imgData = sCtx.createImageData(N, N);
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            const idx = (x + y * N) * 4;
            const val = matrix[x][y];
            imgData.data[idx] = val;     // R
            imgData.data[idx + 1] = val; // G
            imgData.data[idx + 2] = val; // B
            imgData.data[idx + 3] = 255; // A
        }
    }
    sCtx.putImageData(imgData, 0, 0);
}

// Maps complex values onto logarithmic magnitude scaling coordinates
function renderFrequencySpectrogram() {
    if (!fourierData) return;
    const imgData = fCtx.createImageData(N, N);

    for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
            const idx = (u + v * N) * 4;
            
            if (frequencyMask[u][v] === 0) {
                // Render custom hot pink overlay for masked components
                imgData.data[idx] = 255; imgData.data[idx + 1] = 0; imgData.data[idx + 2] = 127; imgData.data[idx + 3] = 255;
                continue;
            }

            const r = fourierData.real[u][v];
            const i = fourierData.imag[u][v];
            const magnitude = Math.sqrt(r*r + i*i);
            
            // Logarithmic scaling calculation: log(1 + magnitude)
            let logScaledIntensity = Math.log(1 + magnitude) * 12;
            logScaledIntensity = Math.min(255, Math.max(0, logScaledIntensity));

            imgData.data[idx] = logScaledIntensity;
            imgData.data[idx + 1] = logScaledIntensity * 0.7; // Cyan spectral tone shifts
            imgData.data[idx + 2] = logScaledIntensity * 0.9;
            imgData.data[idx + 3] = 255;
        }
    }
    fCtx.putImageData(imgData, 0, 0);
}

// Bind live frequency domain painting masking loops
function applyMaskBrush(e) {
    const rect = freqCanvas.getBoundingClientRect();
    const scaleX = N / rect.width;
    const scaleY = N / rect.height;
    const uCenter = Math.floor((e.clientX - rect.left) * scaleX);
    const vCenter = Math.floor((e.clientY - rect.top) * scaleY);

    const brushRadius = 5;
    for (let u = uCenter - brushRadius; u <= uCenter + brushRadius; u++) {
        for (let v = vCenter - brushRadius; v <= vCenter + brushRadius; v++) {
            if (u >= 0 && u < N && v >= 0 && v < N) {
                frequencyMask[u][v] = 0; // Invalidate frequency node coordinate completely
            }
        }
    }
    renderFrequencySpectrogram();
}

freqCanvas.addEventListener('mousedown', (e) => { if (!fourierData) return; isDrawingMask = true; applyMaskBrush(e); });
freqCanvas.addEventListener('mousemove', (e) => { if (isDrawingMask) applyMaskBrush(e); });
window.addEventListener('mouseup', () => isDrawingMask = false);

forwardBtn.addEventListener('click', () => {
    logTerminal.textContent += `\n[Forward Matrix Triggered] Initializing 2D DFT over signal data...`;
    
    const start = performance.now();
    fourierData = FourierMathKernel.forward2D(spatialMatrix, N);
    const duration = performance.now() - start;

    forwardTimeLbl.textContent = `${duration.toFixed(2)} ms`;
    logTerminal.textContent += `\n[Analysis Complete] 16,384 wave coefficients extracted. Locate and paint over noise spikes in the spectrum card!`;
    renderFrequencySpectrogram();
});

inverseBtn.addEventListener('click', () => {
    if (!fourierData) { alert("Run Forward Fourier analysis first!"); return; }
    logTerminal.textContent += `\n[Inverse Synthesis Triggered] Computing spatial reconstruction matrix...`;

    // Apply the active painted suppression mask array filters to our Fourier data structure arrays
    const filteredReal = fourierData.real.map((row, u) => row.map((val, v) => val * frequencyMask[u][v]));
    const filteredImag = fourierData.imag.map((row, u) => row.map((val, v) => val * frequencyMask[u][v]));

    const start = performance.now();
    const reconstructedMatrix = FourierMathKernel.inverse2D(filteredReal, filteredImag, N);
    const duration = performance.now() - start;

    inverseTimeLbl.textContent = `${duration.toFixed(2)} ms`;
    logTerminal.textContent += `\n[Reconstruction Complete] Clean spatial synthesis frame flushed. Frequency spikes eliminated.`;
    renderSpatialMatrix(reconstructedMatrix);
});

// Initialize workspace configurations
initSyntheticSpatialSignal();