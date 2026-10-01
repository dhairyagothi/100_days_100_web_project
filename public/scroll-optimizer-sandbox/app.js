class AsyncScrollOptimizer {
    constructor() {
        this.container = document.getElementById('scrollContainer');
        this.trackedElements = [];
        this.latestScrollY = 0;
        this.isTicking = false;

        this.initOptimizationPipeline();
    }

    initOptimizationPipeline() {
        const parallaxNodes = document.querySelectorAll('.parallax-element');
        
        // 1. Establish an Intersection Observer to decouple elements outside the view
        const observerOptions = {
            root: this.container,
            threshold: Array.from({ length: 101 }, (_, i) => i / 100) // Multi-point visibility callbacks
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // Cache spatial configuration definitions to avoid layout thrashing reads later
                    el.dataset.isActiveViewport = "true";
                } else {
                    entry.target.dataset.isActiveViewport = "false";
                }
            });
        }, observerOptions);

        parallaxNodes.forEach(node => {
            observer.observe(node);
            this.trackedElements.push({
                domNode: node,
                speedFactor: parseFloat(node.dataset.speed || 0.2)
            });
        });

        // 2. Bind passive event listeners to isolate scroll threads
        this.container.addEventListener('scroll', () => this.onScrollPassiveHandler(), { passive: true });
    }

    onScrollPassiveHandler() {
        this.latestScrollY = this.container.scrollTop;

        // requestAnimationFrame prevents execution cascades if a frame is already processing
        if (!this.isTicking) {
            requestAnimationFrame(() => this.executeFrameCompositingLoop());
            this.isTicking = true;
        }
    }

    executeFrameCompositingLoop() {
        // Loop over and mutate only active visible elements
        this.trackedElements.forEach(item => {
            if (item.domNode.dataset.isActiveViewport === "true") {
                const calculatedOffset = this.latestScrollY * item.speedFactor;
                
                // EXCLUSIVELY use GPU transform matrices to eliminate repaints
                item.domNode.style.transform = `translate3d(0, ${calculatedOffset}px, 0)`;
            }
        });

        // Release lock to handle the next browser layout repaint cycle
        this.isTicking = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AsyncScrollOptimizer();
});