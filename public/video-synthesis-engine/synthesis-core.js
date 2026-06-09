/**
 * Procedural Video Synthesis Core Engine
 * Computes time-variable equations straight into raw pixel buffer matrices.
 */
(function () {
    const canvas = document.getElementById('synthesisCanvas');
    const ctx = canvas.getContext('2d');

    // Element caching
    const latencyMetric = document.getElementById('metric-latency');
    const frameMetric = document.getElementById('metric-frame');
    const interpolationMode = document.getElementById('interpolationMode');
    const motionFrequency = document.getElementById('motionFrequency');
    const noiseDensity = document.getElementById('noiseDensity');
    const timelineScrub = document.getElementById('timelineScrub');

    const width = canvas.width;
    const height = canvas.height;

    // Create a blank data pixel buffer matching the dimension bounds
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    let frameIndex = 0;
    let isScrubbing = false;

    // ==========================================
    // TIMELINE INTERPOLATION MATHEMATICS
    // ==========================================
    const Interpolator = {
        lerp: (start, end, t) => start * (1 - t) + end * t,
        step: (start, end, t) => t < 0.5 ? start : end,
        sine: (start, end, t) => {
            const transform = (1 - Math.cos(t * Math.PI)) / 2;
            return start * (1 - transform) + end * transform;
        }
    };

    // ==========================================
    // CORE MATRIX SYNTHESIS RUNTIME LOOP
    // ==========================================
    function synthesizeVideoFrame() {
        const startTime = performance.now();

        // Read live metric control states
        const mode = interpolationMode.value;
        const frequency = parseFloat(motionFrequency.value) / 10;
        const noiseFactor = parseFloat(noiseDensity.value) / 100;

        // Normalize our time tracking variable based on manual timeline scrubs or ticks
        let t = parseFloat(timelineScrub.value) / 1000;
        if (!isScrubbing) {
            t = (Date.now() % 5000) / 5000; // Loop tracking over 5-second intervals smoothly
            timelineScrub.value = Math.round(t * 1000);
        }

        // Map temporal boundary parameters using the selected mathematical interpolator
        const colorScale = Interpolator[mode](50, 255, t);
        const waveOffset = Interpolator[mode](0, Math.PI * 2, t);

        // Loop through every single pixel in the byte buffer matrix array
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate standard index address maps inside the flat Uint8ClampedArray
                const index = (x + y * width) * 4;

                // Apply time-variable trigonometric vector equations
                const waveR = Math.sin(x * 0.02 * frequency + waveOffset) * colorScale;
                const waveG = Math.cos(y * 0.02 * frequency + waveOffset) * (colorScale * 0.7);
                const waveB = Math.sin((x + y) * 0.01 * frequency + waveOffset) * 128 + 128;

                // Compute noise algorithm maps dynamically on the fly
                const randomNoise = (Math.random() - 0.5) * (noiseFactor * 255);

                // Inject synthesized channels directly into the ImageData buffer block memory
                data[index] = Math.min(255, Math.max(0, waveR + randomNoise));     // Red
                data[index + 1] = Math.min(255, Math.max(0, waveG + randomNoise));     // Green
                data[index + 2] = Math.min(255, Math.max(0, waveB + randomNoise));     // Blue
                data[index + 3] = 255;                                                 // Alpha (Opacity)
            }
        }

        // Paint the calculated mathematical pixel matrix block directly onto the canvas view
        ctx.putImageData(imgData, 0, 0);

        // Track frame execution profiling performance markers down to fractions of a millisecond
        const endTime = performance.now();
        latencyMetric.textContent = (endTime - startTime).toFixed(2);
        frameMetric.textContent = frameIndex++;

        // Continuously schedule the next engine loop tick frame natively
        if (!isScrubbing) {
            requestAnimationFrame(synthesizeVideoFrame);
        }
    }

    // ==========================================
    // EVENT TRIGGER INTERACTIVE TRACKERS
    // ==========================================
    timelineScrub.addEventListener('input', () => {
        isScrubbing = true;
        synthesizeVideoFrame();
    });

    timelineScrub.addEventListener('change', () => {
        isScrubbing = false;
        requestAnimationFrame(synthesizeVideoFrame);
    });

    // Launch compilation synthesizer engine loops
    requestAnimationFrame(synthesizeVideoFrame);
})();
