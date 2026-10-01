class QuantumGridSandbox {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // 2D Matrix Grid Spatial Configurations
    this.spacing = 25;
    this.cols = 0;
    this.rows = 0;
    this.grid = []; // Stores complex coordinate data objects

    this.metrics = {
      coherence: 100,
      entropy: 0.01,
      collapses: 0,
    };

    this.init();
    this.registerEvents();
    this.animate(0);
  }

  init() {
    this.resizeCanvas();
  }

  resizeCanvas() {
    // Preserve the previous simulation state
    const previousGrid = this.grid;
    const previousCols = this.cols;
    const previousRows = this.rows;

    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight - 40;

    this.cols = Math.floor(this.canvas.width / this.spacing);
    this.rows = Math.floor(this.canvas.height / this.spacing);

    const newGrid = [];

    for (let x = 0; x < this.cols; x++) {
      newGrid[x] = [];

      for (let y = 0; y < this.rows; y++) {
        let oldNode = null;

        if (x < previousCols && y < previousRows && previousGrid[x]) {
          oldNode = previousGrid[x][y];
        }

        newGrid[x][y] = {
          baseX: x * this.spacing + this.spacing / 2,
          baseY: y * this.spacing + this.spacing / 2,
          amplitude: oldNode ? oldNode.amplitude : 0,
          phase: oldNode ? oldNode.phase : Math.random() * Math.PI * 2,
          collapsed: oldNode ? oldNode.collapsed : false,
          collapseTimer: oldNode ? oldNode.collapseTimer : 0,
        };
      }
    }

    this.grid = newGrid;
  }
  registerEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.triggerStateCollapse(clickX, clickY);
    });
  }

  triggerStateCollapse(targetX, targetY) {
    let nodeHit = false;

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const node = this.grid[x][y];
        const dx = targetX - node.baseX;
        const dy = targetY - node.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Intercept clicks within localized radius bands
        if (distance < 45) {
          node.collapsed = true;
          node.collapseTimer = 1.0; // Max scalar intensity peak
          nodeHit = true;
        }
      }
    }

    if (nodeHit) {
      this.metrics.collapses++;
      this.metrics.coherence = Math.max(12.5, this.metrics.coherence - 4.5);
      document.getElementById('collapsedMetric').innerText =
        this.metrics.collapses;
    }
  }

  animate(timestamp) {
    const startPerformance = performance.now();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackgroundGrid();

    const timeScalar = timestamp * 0.002;
    let cumulativeEntropy = 0;

    // Process grid coordinate modifications
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const node = this.grid[x][y];

        if (node.collapsed) {
          // Decay collapse status metrics over time to simulate dynamic recovery
          node.collapseTimer -= 0.008;
          node.amplitude = 0;
          if (node.collapseTimer <= 0) {
            node.collapsed = false;
          }
        } else {
          // Compute mock spatial wave mechanics equations
          const spatialFactor = x * 0.15 + y * 0.1;
          node.amplitude =
            Math.sin(timeScalar + spatialFactor + node.phase) * 8;
          cumulativeEntropy += Math.abs(node.amplitude);
        }

        this.renderNode(node);
      }
    }

    // Auto-recover Coherence states gradually
    this.metrics.coherence = Math.min(100, this.metrics.coherence + 0.02);
    this.metrics.entropy = (
      cumulativeEntropy /
      (this.cols * this.rows)
    ).toFixed(3);

    document.getElementById('coherenceMetric').innerText =
      `${this.metrics.coherence.toFixed(2)}%`;
    document.getElementById('entropyMetric').innerText =
      `${this.metrics.entropy} Hz`;

    const loopLatency = performance.now() - startPerformance;
    document.getElementById('latencyMetric').innerText =
      `${loopLatency.toFixed(2)} ms`;

    requestAnimationFrame((t) => this.animate(t));
  }

  drawBackgroundGrid() {
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    this.ctx.lineWidth = 1;

    // Draw structural vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    // Draw structural horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  renderNode(node) {
    this.ctx.save();
    this.ctx.translate(node.baseX, node.baseY);

    if (node.collapsed) {
      // Draw localized shockwave rings expanding outwards
      const radius = (1 - node.collapseTimer) * 35;
      this.ctx.strokeStyle = `rgba(255, 0, 127, ${node.collapseTimer})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Render static dead matrix point indicator
      this.ctx.fillStyle = '#ff007f';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      // Map quantum wave weights into real-time visual coordinate shifts
      const offset = node.amplitude;
      const alpha = Math.min(1, Math.abs(offset) / 8 + 0.2);

      // Shifting cyan/green color gradients mapped to array amplitudes
      this.ctx.fillStyle = `rgba(0, 255, 204, ${alpha})`;
      this.ctx.shadowBlur = Math.abs(offset) * 1.5;
      this.ctx.shadowColor = '#00f0ff';

      this.ctx.beginPath();
      this.ctx.arc(offset, -offset, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw a subtle coordinate guide tail linking to matrix base vector anchors
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.15})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(offset, -offset);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }
}

// Instantiate visualizer once document is parsed
window.addEventListener('DOMContentLoaded', () => {
  new QuantumGridSandbox('quantumCanvas');
});
