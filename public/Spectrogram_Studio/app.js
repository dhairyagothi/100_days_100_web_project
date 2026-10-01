let imgWidth = 0;
let imgHeight = 0;
let originalPixels = null;
let isDrawing = false;

// Complex Number Frequency Representation Matrix Maps
let MatrixReal = [];
let MatrixImag = [];

// Base UI DOM Cache elements
const canvasIn = document.getElementById('canvasInput');
const canvasSpec = document.getElementById('canvasSpectrum');
const canvasOut = document.getElementById('canvasOutput');
const ctxIn = canvasIn.getContext('2d');
const ctxSpec = canvasSpec.getContext('2d');
const ctxOut = canvasOut.getContext('2d');

const logPrompt = document.getElementById('consoleLog');
const brushRange = document.getElementById('brushSize');
const brushValueDisplay = document.getElementById('brushVal');

// Telemetry Interface elements
const tFwd = document.getElementById('fwdLatency');
const tInv = document.getElementById('invLatency');
const tSnr = document.getElementById('snrEst');

// Update text representation indicators
brushRange.addEventListener('input', (e) => {
    brushValueDisplay.innerText = `${e.target.value}px`;
});

function postLog(message) {
    logPrompt.innerText = message;
}

// Image Loader Event Interface Handler
document.getElementById('imageLoader').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            // DOWN-SAMPLING RULE: To ensure standard mathematical O(N^4) loops 
            // do not freeze the single-threaded UI, force a max size bounding container block.
            if (img.width > 48 || img.height > 48) {
                postLog("⚠️ File auto-scaled to 40x40 grid to protect browser computation thread loops!");
                imgWidth = 40;
                imgHeight = 40;
            } else {
                imgWidth = img.width;
                imgHeight = img.height;
            }

            // Sync visual UI elements
            document.getElementById('inputDim').innerText = `${imgWidth}x${imgHeight}`;
            document.getElementById('spectrumDim').innerText = `${imgWidth}x${imgHeight}`;
            document.getElementById('outputDim').innerText = `${imgWidth}x${imgHeight}`;

            canvasIn.width = imgWidth; canvasIn.height = imgHeight;
            canvasSpec.width = imgWidth; canvasSpec.height = imgHeight;
            canvasOut.width = imgWidth; canvasOut.height = imgHeight;

            // Paint starting input canvas map profile
            ctxIn.drawImage(img, 0, 0, imgWidth, imgHeight);
            const dataBuffer = ctxIn.getImageData(0, 0, imgWidth, imgHeight);

            originalPixels = new Float64Array(imgWidth * imgHeight);
            for (let i = 0; i < dataBuffer.data.length; i += 4) {
                let grayValue = 0.299 * dataBuffer.data[i] + 0.587 * dataBuffer.data[i + 1] + 0.114 * dataBuffer.data[i + 2];
                originalPixels[i / 4] = grayValue;
                dataBuffer.data[i] = grayValue;
                dataBuffer.data[i + 1] = grayValue;
                dataBuffer.data[i + 2] = grayValue;
            }
            ctxIn.putImageData(dataBuffer, 0, 0);

            postLog("Matrix cache updated. Ready to compute Forward 2D-DFT structural mapping matrix components...");

            // Asynchronous scheduling call protection boundary
            setTimeout(executeForwardDFT, 60);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

/**
 * Forward 2D Discrete Fourier Transform Engine
 * Formula: F(u,v) = Sum_x Sum_y [ f(x,y) * cos(Angle) + j * f(x,y) * sin(Angle) ]
 */
function executeForwardDFT() {
    let startTime = performance.now();

    MatrixReal = Array.from({ length: imgHeight }, () => new Float64Array(imgWidth));
    MatrixImag = Array.from({ length: imgHeight }, () => new Float64Array(imgWidth));

    for (let v = 0; v < imgHeight; v++) {
        for (let u = 0; u < imgWidth; u++) {
            let realSum = 0;
            let imagSum = 0;

            for (let y = 0; y < imgHeight; y++) {
                for (let x = 0; x < imgWidth; x++) {
                    let pixelVal = originalPixels[y * imgWidth + x];
                    let angle = -2 * Math.PI * ((u * x) / imgWidth + (v * y) / imgHeight);

                    realSum += pixelVal * Math.cos(angle);
                    imagSum += pixelVal * Math.sin(angle);
                }
            }
            MatrixReal[v][u] = realSum;
            MatrixImag[v][u] = imagSum;
        }
    }

    let elapsed = performance.now() - startTime;
    tFwd.innerText = `${elapsed.toFixed(2)} ms`;
    postLog("Forward transform computation success. Mapping 2D Log-compressed center shifted spectrum views.");
    renderSpectrogram();
}

/**
 * Computes magnitudes, shifts zero-frequency components (DC) to center, 
 * compresses dynamic spectrum ranges logarithmically, and outputs view values.
 */
function renderSpectrogram() {
    let imgData = ctxSpec.createImageData(imgWidth, imgHeight);
    let magnitudeBuffer = new Float64Array(imgWidth * imgHeight);
    let maxLogVal = 0;

    let halfW = Math.floor(imgWidth / 2);
    let halfH = Math.floor(imgHeight / 2);

    for (let v = 0; v < imgHeight; v++) {
        for (let u = 0; u < imgWidth; u++) {
            let r = MatrixReal[v][u];
            let i = MatrixImag[v][u];
            let mag = Math.sqrt(r * r + i * i);

            // Center FFT Quadrant Shift indexing re-mapping 
            let shiftedU = (u + halfW) % imgWidth;
            let shiftedV = (v + halfH) % imgHeight;
            magnitudeBuffer[shiftedV * imgWidth + shiftedU] = mag;
        }
    }

    // Dynamic Compression Mapping Engine
    for (let k = 0; k < magnitudeBuffer.length; k++) {
        magnitudeBuffer[k] = Math.log(1 + magnitudeBuffer[k]);
        if (magnitudeBuffer[k] > maxLogVal) maxLogVal = magnitudeBuffer[k];
    }

    // Paint to the canvas display target
    for (let k = 0; k < magnitudeBuffer.length; k++) {
        let brightness = maxLogVal > 0 ? (magnitudeBuffer[k] / maxLogVal) * 255 : 0;
        let pxIndex = k * 4;
        imgData.data[pxIndex] = brightness;
        imgData.data[pxIndex + 1] = brightness;
        imgData.data[pxIndex + 2] = brightness;
        imgData.data[pxIndex + 3] = 255;
    }
    ctxSpec.putImageData(imgData, 0, 0);
}

// Interactive Real-Time Immediate-Mode Mask Event Listeners
canvasSpec.addEventListener('mousedown', (e) => { isDrawing = true; paintFrequencyMask(e); });
canvasSpec.addEventListener('mousemove', paintFrequencyMask);
window.addEventListener('mouseup', () => isDrawing = false);

function paintFrequencyMask(e) {
    if (!isDrawing) return;

    const boundRect = canvasSpec.getBoundingClientRect();
    const scaleFactorX = imgWidth / boundRect.width;
    const scaleFactorY = imgHeight / boundRect.height;

    const mouseX = (e.clientX - boundRect.left) * scaleFactorX;
    const mouseY = (e.clientY - boundRect.top) * scaleFactorY;
    const currentRadius = parseInt(brushRange.value) / 2;

    // Standard canvas visualization masking modification tracking step
    ctxSpec.fillStyle = "#000000";
    ctxSpec.beginPath();
    ctxSpec.arc(mouseX, mouseY, currentRadius, 0, Math.PI * 2);
    ctxSpec.fill();

    // Directly neutralize matching matrix cell pairs inside numerical structure coordinates
    let halfW = Math.floor(imgWidth / 2);
    let halfH = Math.floor(imgHeight / 2);
    let alteredCount = 0;

    for (let v = 0; v < imgHeight; v++) {
        for (let u = 0; u < imgWidth; u++) {
            let shiftedU = (u + halfW) % imgWidth;
            let shiftedV = (v + halfH) % imgHeight;

            let distance = Math.sqrt((shiftedU - mouseX) ** 2 + (shiftedV - mouseY) ** 2);
            if (distance <= currentRadius) {
                if (MatrixReal[v][u] !== 0 || MatrixImag[v][u] !== 0) {
                    MatrixReal[v][u] = 0;
                    MatrixImag[v][u] = 0;
                    alteredCount++;
                }
            }
        }
    }
    if (alteredCount > 0) {
        postLog(`Frequency suppression active. Eliminated ${alteredCount} coordinate coefficient spikes.`);
    }
}

// Inverse Transform Controller Processing Interface Hook
document.getElementById('btnInverse').addEventListener('click', () => {
    postLog("Re-calculating Inverse 2D-DFT Matrix array components. Processing values...");
    setTimeout(executeInverseDFT, 50);
});

/**
 * Inverse 2D Discrete Fourier Transform Engine
 * Formula: f(x,y) = (1/(W*H)) * Sum_u Sum_v [ F(u,v) * e^(j * 2 * pi * (ux/W + vy/H)) ]
 */
function executeInverseDFT() {
    let startTime = performance.now();
    let reconstructedData = new Uint8ClampedArray(imgWidth * imgHeight);
    let totalCells = imgWidth * imgHeight;

    let noisePowerSum = 0;
    let signalPowerSum = 0;

    for (let x = 0; x < imgWidth; x++) {
        for (let y = 0; y < imgHeight; y++) {
            let realAccumulator = 0;

            for (let u = 0; u < imgWidth; u++) {
                for (let v = 0; v < imgHeight; v++) {
                    let realVal = MatrixReal[v][u];
                    let imagVal = MatrixImag[v][u];
                    let angle = 2 * Math.PI * ((u * x) / imgWidth + (v * y) / imgHeight);

                    // Multiplicative Expansion sequence tracking parameters
                    realAccumulator += realVal * Math.cos(angle) - imagVal * Math.sin(angle);
                }
            }

            let amplitudeResult = realAccumulator / totalCells;
            let arrayLocation = y * imgWidth + x;

            // Track noise suppression variance telemetry metrics
            let rawDiff = originalPixels[arrayLocation] - amplitudeResult;
            noisePowerSum += rawDiff * rawDiff;
            signalPowerSum += amplitudeResult * amplitudeResult;

            // Bound checks normalization assignment
            reconstructedData[arrayLocation] = Math.min(255, Math.max(0, amplitudeResult));
        }
    }

    // Formulate basic Signal-To-Noise Estimate Improvements metrics
    let snrValue = noisePowerSum > 0 ? 10 * Math.log10(signalPowerSum / noisePowerSum) : 45.0;
    tSnr.innerText = `${snrValue.toFixed(2)} dB`;

    // Render spatial visualization image onto Output Canvas context
    let outImgBuffer = ctxOut.createImageData(imgWidth, imgHeight);
    for (let k = 0; k < reconstructedData.length; k++) {
        let pxIndex = k * 4;
        let v = reconstructedData[k];
        outImgBuffer.data[pxIndex] = v;
        outImgBuffer.data[pxIndex + 1] = v;
        outImgBuffer.data[pxIndex + 2] = v;
        outImgBuffer.data[pxIndex + 3] = 255;
    }
    ctxOut.putImageData(outImgBuffer, 0, 0);

    let elapsed = performance.now() - startTime;
    tInv.innerText = `${elapsed.toFixed(2)} ms`;
    postLog("IDFT spatial transformation structural reconstruction completed successfully.");
}

// Reset Clear Handler Interface Hook
document.getElementById('btnClearMask').addEventListener('click', () => {
    if (!originalPixels) return;
    postLog("Re-mapping raw initial array data arrays...");
    executeForwardDFT();
});