/**
 * Advanced Performance Layer - GSSoC #6446
 * Immediate-Mode High-Frequency HTML5 Canvas Engine
 */
export class AnalyticsCanvasEngine {
    #canvas;
    #ctx;
    #arrayData = [];
    #operationPasses = 0;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');
    }

    // Allocate random numerical item arrays across space coordinates
    generateArray(size = 120) {
        this.#arrayData = [];
        this.#operationPasses = 0;
        for (let i = 0; i < size; i++) {
            this.#arrayData.push(Math.floor(Math.random() * (this.#canvas.height - 20)) + 10);
        }
        this.draw();
        return this.#arrayData.length;
    }

    // Direct immediate-mode rendering wipe-and-redraw routines
    draw(highlightIndices = []) {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        const barWidth = this.#canvas.width / this.#arrayData.length;

        for (let i = 0; i < this.#arrayData.length; i++) {
            const barHeight = this.#arrayData[i];

            // Apply dynamic rendering color codes depending on active states
            if (highlightIndices.includes(i)) {
                this.#ctx.fillStyle = '#ff007f'; // Neon Pink accent highlight tracking point
            } else {
                this.#ctx.fillStyle = '#00ffcc'; // Smooth Neon Cyan default matrix line
            }

            this.#ctx.fillRect(
                i * barWidth,
                this.#canvas.height - barHeight,
                barWidth - 1,
                barHeight
            );
        }
    }

    // Asynchronous Sorting Array Loop: Yields rendering loops on thread execution sleep ticks
    async executeBubbleSort(onOperationTick) {
        let n = this.#arrayData.length;
        let swapped;

        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (this.#arrayData[i] > this.#arrayData[i + 1]) {
                    // Swapping values
                    let temp = this.#arrayData[i];
                    this.#arrayData[i] = this.#arrayData[i + 1];
                    this.#arrayData[i + 1] = temp;

                    swapped = true;
                    this.#operationPasses++;

                    // Capture precision graphics timestamps
                    const tStart = performance.now();
                    this.draw([i, i + 1]);
                    const tRender = performance.now() - tStart;

                    // Stream state parameters up to controller callbacks
                    onOperationTick({
                        passes: this.#operationPasses,
                        renderTimeMs: tRender
                    });

                    // Induce small microsecond delays to allow human vision mapping frames
                    await new Promise(resolve => setTimeout(resolve, 4));
                }
            }
            n--;
        } while (swapped);

        this.draw(); // Final redrawing clear
    }
}