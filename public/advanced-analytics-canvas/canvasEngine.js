/**
 * Advanced Performance Layer - GSSoC #6446
 * Immediate-Mode High-Frequency HTML5 Canvas Engine
 */
export class AnalyticsCanvasEngine {
    #canvas;
    #ctx;
    #arrayData = [];
    #originalArrayData = [];
    #operationPasses = 0;
    #comparisonCount = 0;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');
    }

    // Allocate random numerical item arrays across space coordinates
    generateArray(size = 120) {
        this.#arrayData = [];
        this.#operationPasses = 0;
        this.#comparisonCount = 0;
        for (let i = 0; i < size; i++) {
            this.#arrayData.push(Math.floor(Math.random() * (this.#canvas.height - 20)) + 10);
        }
        // Store an immutable copy of the original unsorted dataset
        this.#originalArrayData = [...this.#arrayData];
        this.draw();
        return this.#arrayData.length;
    }

    // Restore the original unsorted dataset and reset metrics
    restoreArray() {
        this.#arrayData = [...this.#originalArrayData];
        this.#operationPasses = 0;
        this.#comparisonCount = 0;
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

    // Asynchronous Sorting Array Loop: Bubble Sort with telemetry
    async executeBubbleSort(onOperationTick) {
        let n = this.#arrayData.length;
        let swapped;

        do {
            swapped = false;

            for (let i = 0; i < n - 1; i++) {

                // Track comparison count
                this.#comparisonCount++;

                let tRender = 0;

                if (this.#arrayData[i] > this.#arrayData[i + 1]) {

                    // Swap values
                    let temp = this.#arrayData[i];
                    this.#arrayData[i] = this.#arrayData[i + 1];
                    this.#arrayData[i + 1] = temp;

                    swapped = true;
                    this.#operationPasses++;

                    // Measure render latency
                    const tStart = performance.now();

                    this.draw([i, i + 1]);

                    tRender = performance.now() - tStart;

                    // Small delay so animation remains visible
                    await new Promise(resolve =>
                        setTimeout(resolve, 4)
                    );
                }

                // Update telemetry after EVERY comparison
                onOperationTick({
                    passes: this.#operationPasses,
                    comparisons: this.#comparisonCount,
                    renderTimeMs: tRender
                });
            }

            n--;

        } while (swapped);

        // Final redraw
        this.draw();
    }

    // Selection Sort with telemetry
    async executeSelectionSort(onOperationTick) {

        let n = this.#arrayData.length;

        for (let i = 0; i < n - 1; i++) {

            let minIndex = i;

            for (let j = i + 1; j < n; j++) {

                this.#comparisonCount++;

                if (
                    this.#arrayData[j] <
                    this.#arrayData[minIndex]
                ) {
                    minIndex = j;
                }
            }

            if (minIndex !== i) {

                [
                    this.#arrayData[i],
                    this.#arrayData[minIndex]
                ] = [
                    this.#arrayData[minIndex],
                    this.#arrayData[i]
                ];

                this.#operationPasses++;

                const start =
                    performance.now();

                this.draw([
                    i,
                    minIndex
                ]);

                const renderTime =
                    performance.now() -
                    start;

                onOperationTick({
                    passes:
                    this.#operationPasses,

                    comparisons:
                    this.#comparisonCount,

                    renderTimeMs:
                    renderTime
                });

                await new Promise(
                    resolve =>
                    setTimeout(resolve, 4)
                );
            }
        }

        this.draw();
    }

    // Insertion Sort with telemetry
    async executeInsertionSort(onOperationTick) {

        let n = this.#arrayData.length;

        for (let i = 1; i < n; i++) {

            let key = this.#arrayData[i];
            let j = i - 1;

            while (j >= 0) {

                this.#comparisonCount++;

                let tRender = 0;

                if (this.#arrayData[j] > key) {

                    this.#arrayData[j + 1] =
                    this.#arrayData[j];

                    this.#operationPasses++;

                    const tStart =
                    performance.now();

                    this.draw([j, j + 1]);

                    tRender =
                    performance.now() - tStart;

                    onOperationTick({
                        passes: this.#operationPasses,
                        comparisons: this.#comparisonCount,
                        renderTimeMs: tRender
                    });

                    await new Promise(resolve =>
                        setTimeout(resolve, 4)
                    );

                    j--;

                } else {
                    break;
                }
            }

            this.#arrayData[j + 1] = key;
        }

        this.draw();
    }

    // Quick Sort – partition helper with full pivot-swap visualization
    async partition(low, high, onOperationTick) {

        const pivot = this.#arrayData[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {

            this.#comparisonCount++;

            if (this.#arrayData[j] < pivot) {

                i++;

                [
                    this.#arrayData[i],
                    this.#arrayData[j]
                ] = [
                    this.#arrayData[j],
                    this.#arrayData[i]
                ];

                this.#operationPasses++;

                const start = performance.now();

                this.draw([i, j]);

                const renderTime =
                performance.now() - start;

                onOperationTick({
                    passes: this.#operationPasses,
                    comparisons: this.#comparisonCount,
                    renderTimeMs: renderTime
                });

                await new Promise(resolve =>
                    setTimeout(resolve, 4)
                );
            }
        }

        // Place pivot in its correct sorted position and visualize it
        [
            this.#arrayData[i + 1],
            this.#arrayData[high]
        ] = [
            this.#arrayData[high],
            this.#arrayData[i + 1]
        ];

        this.#operationPasses++;

        const pivotStart = performance.now();
        this.draw([i + 1, high]);
        const pivotRender = performance.now() - pivotStart;

        onOperationTick({
            passes: this.#operationPasses,
            comparisons: this.#comparisonCount,
            renderTimeMs: pivotRender
        });

        await new Promise(resolve =>
            setTimeout(resolve, 4)
        );

        return i + 1;
    }

    // Quick Sort – recursive helper
    async quickSortHelper(low, high, onOperationTick) {

        if (low < high) {

            const pi =
            await this.partition(
                low,
                high,
                onOperationTick
            );

            await this.quickSortHelper(
                low,
                pi - 1,
                onOperationTick
            );

            await this.quickSortHelper(
                pi + 1,
                high,
                onOperationTick
            );
        }
    }

    // Quick Sort – public entry point
    async executeQuickSort(onOperationTick) {

        await this.quickSortHelper(
            0,
            this.#arrayData.length - 1,
            onOperationTick
        );

        this.draw();
    }

    // Merge Sort – merge two halves in-place with visualization
    async #merge(left, mid, right, onOperationTick) {
        const leftArr = this.#arrayData.slice(left, mid + 1);
        const rightArr = this.#arrayData.slice(mid + 1, right + 1);
        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftArr.length && j < rightArr.length) {
            this.#comparisonCount++;

            let tRender = 0;

            if (leftArr[i] <= rightArr[j]) {
                this.#arrayData[k] = leftArr[i];
                i++;
            } else {
                this.#arrayData[k] = rightArr[j];
                j++;
            }

            this.#operationPasses++;

            const tStart = performance.now();
            this.draw([k]);
            tRender = performance.now() - tStart;

            onOperationTick({
                passes: this.#operationPasses,
                comparisons: this.#comparisonCount,
                renderTimeMs: tRender
            });

            await new Promise(resolve => setTimeout(resolve, 4));

            k++;
        }

        while (i < leftArr.length) {
            this.#arrayData[k] = leftArr[i];
            this.#operationPasses++;

            const tStart = performance.now();
            this.draw([k]);
            const tRender = performance.now() - tStart;

            onOperationTick({
                passes: this.#operationPasses,
                comparisons: this.#comparisonCount,
                renderTimeMs: tRender
            });

            await new Promise(resolve => setTimeout(resolve, 4));

            i++;
            k++;
        }

        while (j < rightArr.length) {
            this.#arrayData[k] = rightArr[j];
            this.#operationPasses++;

            const tStart = performance.now();
            this.draw([k]);
            const tRender = performance.now() - tStart;

            onOperationTick({
                passes: this.#operationPasses,
                comparisons: this.#comparisonCount,
                renderTimeMs: tRender
            });

            await new Promise(resolve => setTimeout(resolve, 4));

            j++;
            k++;
        }
    }

    // Merge Sort – recursive helper
    async #mergeSortHelper(left, right, onOperationTick) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this.#mergeSortHelper(left, mid, onOperationTick);
            await this.#mergeSortHelper(mid + 1, right, onOperationTick);
            await this.#merge(left, mid, right, onOperationTick);
        }
    }

    // Merge Sort – public entry point
    async executeMergeSort(onOperationTick) {
        await this.#mergeSortHelper(
            0,
            this.#arrayData.length - 1,
            onOperationTick
        );
        this.draw();
    }
}