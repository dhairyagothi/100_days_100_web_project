/**
 * Critical Architecture Performance Optimization Matrix (#6120 / #6158 Level Critical)
 * High-Throughput Sliding-Window Virtual Scrolling Engine
 */
export class VirtualDOMEngine {
    #container;
    #scroller;
    #dataset;
    #rowHeight;
    #visibleCount;
    #poolSize;
    #domPool = [];

    constructor(containerNode, datasetArray, rowHeightInPixels = 40) {
        this.#container = containerNode;
        this.#dataset = datasetArray;
        this.#rowHeight = rowHeightInPixels;

        // Calculate dimensions and allocate a small safety structural buffer
        this.#visibleCount = Math.ceil(this.#container.clientHeight / this.#rowHeight);
        this.#poolSize = this.#visibleCount + 5;

        this.#setupVirtualTrack();
        this.#allocateDOMPool();
        this.render();

        // Bind critical execution handler wrapped in high-frequency anim frames
        this.#container.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.render());
        });
    }

    #setupVirtualTrack() {
        this.#container.style.position = 'relative';
        this.#container.style.overflowY = 'auto';

        // Fake invisible structural element that stretches to the true height of 100,000 entries
        this.#scroller = document.createElement('div');
        this.#scroller.style.height = `${this.#dataset.length * this.#rowHeight}px`;
        this.#scroller.style.width = '1px';
        this.#scroller.style.position = 'absolute';
        this.#scroller.style.top = '0';
        this.#scroller.style.left = '0';

        this.#container.appendChild(this.#scroller);
    }

    #allocateDOMPool() {
        // Create only a tiny subset of nodes to reuse infinitely
        for (let i = 0; i < this.#poolSize; i++) {
            const row = document.createElement('div');
            row.style.position = 'absolute';
            row.style.left = '0';
            row.style.width = '100%';
            row.style.height = `${this.#rowHeight}px`;

            this.#container.appendChild(row);
            this.#domPool.push(row);
        }
    }
    // Public API method to dynamically update the internal dataset and resize boundaries
    updateDataset(newDatasetArray) {
        this.#dataset = newDatasetArray;

        // Recalculate the fake invisible scroll track height instantly in memory
        this.#scroller.style.height = `${this.#dataset.length * this.#rowHeight}px`;

        // Force a structural redraw on the active frame view window
        this.render();
    }
    render() {
        const scrollTop = this.#container.scrollTop;

        // Mathematically calculate starting and stopping matrix indices
        let startIndex = Math.floor(scrollTop / this.#rowHeight);
        startIndex = Math.max(0, Math.min(startIndex, this.#dataset.length - this.#poolSize));

        // Recycle the active nodes and translate their virtual coordinate bounds
        for (let i = 0; i < this.#poolSize; i++) {
            const dataIndex = startIndex + i;
            const domNode = this.#domPool[i];

            if (dataIndex < this.#dataset.length) {
                const dataItem = this.#dataset[dataIndex];

                // Swap row data properties dynamically inside memory without rebuilding nodes
                domNode.textContent = `[Virtual ID: ${dataItem.id}] | Lead: ${dataItem.company} - ${dataItem.role}`;

                // Translate position instantly down the virtual canvas space coordinate map
                const topY = dataIndex * this.#rowHeight;
                domNode.style.transform = `translateY(${topY}px)`;
                domNode.style.display = 'block';
            } else {
                domNode.style.display = 'none';
            }
        }
    }
}