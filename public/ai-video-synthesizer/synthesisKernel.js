/**
 * Advanced Multimedia Layer - GSSoC Tier Critical
 * Procedural Pixel-Buffer Synthesizer & Temporal Interpolator
 */
export class FrameSynthesisEngine {
    #canvas;
    #ctx;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');
    }

    /**
     * Synthesizes a video frame pixel buffer from scratch using time vector variables
     * @param {number} timeNormalized Value from 0.0 to 1.0 tracking timeline completion
     * @param {string} interpMode Mathematical transformation style
     * @param {number} frequency Frequency scaler for the math waves
     */
    synthesizeFrame(timeNormalized, interpMode, frequency) {
        const width = this.#canvas.width;
        const height = this.#canvas.height;

        // Allocate a flat, writeable pixel matrix buffer
        const imgData = this.#ctx.createImageData(width, height);
        const data = imgData.data;

        // Apply distinct interpolation modifiers based on user configuration
        let timeFactor = timeNormalized;
        if (interpMode === 'sine') {
            timeFactor = Math.sin(timeNormalized * Math.PI);
        } else if (interpMode === 'step') {
            timeFactor = Math.floor(timeNormalized * 5) / 5; // Quantize time into discrete chunks
        }

        const timeCycle = timeFactor * Math.PI * 2 * frequency;

        // Nested spatial loop tracking pixel coordinates across columns and rows
        for (let y = 0; y < height; y++) {
            const normalizedY = y / height;
            for (let x = 0; x < width; x++) {
                const normalizedX = x / width;

                // Index formula mapping 2D coordinate blocks down onto flat 1D data arrays
                const pixelIndex = (x + y * width) * 4;

                // Core Procedural Math Waveforms Formula
                const redChannel = Math.floor((Math.sin(normalizedX * timeCycle) + 1) * 127.5);
                const greenChannel = Math.floor((Math.cos(normalizedY * timeCycle + Math.PI / 2) + 1) * 127.5);
                const blueChannel = Math.floor(((Math.sin(timeCycle) + Math.cos(normalizedX * 4)) + 2) * 63.75);

                // Commit values into raw hardware image slots
                data[pixelIndex] = redChannel;         // Red
                data[pixelIndex + 1] = greenChannel;   // Green
                data[pixelIndex + 2] = blueChannel;    // Blue
                data[pixelIndex + 3] = 255;            // Alpha opacity constant
            }
        }

        // Draw the freshly generated color buffer cleanly onto the viewport monitor
        this.#ctx.putImageData(imgData, 0, 0);
    }
}   