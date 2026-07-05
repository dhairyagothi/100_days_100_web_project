class CrisprAlignmentSandbox {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Sequencing Configurations
        this.baseSpacing = 40;
        this.targetDNA = [];
        this.guideRNA = [];
        this.gRnaX = 200; // Track user interactive X position

        this.bases = ['A', 'T', 'C', 'G'];
        this.complementMap = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        this.baseColors = { 'A': '#ff4d4d', 'T': '#ffeb3b', 'C': '#3399ff', 'G': '#4caf50' };

        this.scrollSpeed = 1.2;
        this.metrics = { homology: 0, accuracy: 0 };

        this.init();
        this.registerEvents();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.generateTargetDNA();
        this.generateGuideRNA();
        document.getElementById('nucleotideMetric').innerText = this.targetDNA.length + this.guideRNA.length;
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight - 40;
    }

    generateTargetDNA() {
        const totalBases = Math.ceil((this.canvas.width + 400) / this.baseSpacing);
        for (let i = 0; i < totalBases; i++) {
            this.targetDNA.push({
                x: i * this.baseSpacing,
                base: this.bases[Math.floor(Math.random() * this.bases.length)]
            });
        }
    }

    generateGuideRNA() {
        // Construct a static 12-base guide RNA sequence strand targeting a pattern match
        const sequence = ['T', 'A', 'G', 'C', 'A', 'T', 'G', 'C', 'A', 'T', 'T', 'A'];
        for (let i = 0; i < sequence.length; i++) {
            this.guideRNA.push({
                offsetIdx: i,
                base: sequence[i]
            });
        }
    }

    registerEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.gRnaX = e.clientX - rect.left;
        });
    }

    calculateAlignmentHomology() {
        let activeMatches = 0;
        let totalOverlaps = 0;

        this.guideRNA.forEach((rnaNode) => {
            const rnaAbsoluteX = this.gRnaX + (rnaNode.offsetIdx * this.baseSpacing);

            // Scan through scrolling DNA base coordinates to evaluate immediate node alignment proximity
            this.targetDNA.forEach((dnaNode) => {
                const distanceX = Math.abs(rnaAbsoluteX - dnaNode.x);
                if (distanceX < this.baseSpacing / 2) {
                    totalOverlaps++;
                    // Check base compatibility (CRISPR target validation)
                    if (this.complementMap[rnaNode.base] === dnaNode.base) {
                        activeMatches++;
                    }
                }
            });
        });

        // Compute local sequence alignment matches using inverse distance matrices
        if (totalOverlaps > 0) {
            this.metrics.homology = (activeMatches / this.guideRNA.length) * 100;
            this.metrics.accuracy = (activeMatches / totalOverlaps) * 100;
        } else {
            this.metrics.homology = 0;
            this.metrics.accuracy = 0;
        }
    }

    animate() {
        const startPerformance = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update coordinates and shift target sequences
        this.targetDNA.forEach((node) => {
            node.x -= this.scrollSpeed;
        });

        // Recycled out-of-bounds node sequences to form an endless array stream
        if (this.targetDNA[0].x < -this.baseSpacing) {
            const popped = this.targetDNA.shift();
            popped.x = this.targetDNA[this.targetDNA.length - 1].x + this.baseSpacing;
            popped.base = this.bases[Math.floor(Math.random() * this.bases.length)];
            this.targetDNA.push(popped);
        }

        this.calculateAlignmentHomology();

        // Render Base Elements
        this.drawTargetDNAStrand();
        this.drawGuideRNAStrand();
        this.drawHydrogenBondLinkages();

        // Push calculated data fields directly out to DOM containers
        document.getElementById('homologyMetric').innerText = `${this.metrics.homology.toFixed(1)}%`;
        document.getElementById('accuracyMetric').innerText = `${this.metrics.accuracy.toFixed(1)}%`;

        const loopLatency = performance.now() - startPerformance;
        document.getElementById('latencyMetric').innerText = `${loopLatency.toFixed(2)} ms`;

        requestAnimationFrame(() => this.animate());
    }

    drawTargetDNAStrand() {
        const centerY = this.canvas.height * 0.35;

        // Draw structural backbone vector rail
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.stroke();

        // Draw individual Target Nucleotide Nodes
        this.targetDNA.forEach((node) => {
            if (node.x >= 0 && node.x <= this.canvas.width) {
                this.ctx.fillStyle = this.baseColors[node.base] || '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(node.x, centerY, 7, 0, Math.PI * 2);
                this.ctx.fill();

                // Text base indicator labels
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.font = '10px monospace';
                this.ctx.fillText(node.base, node.x - 3, centerY - 15);
            }
        });
    }

    drawGuideRNAStrand() {
        const centerY = this.canvas.height * 0.65;

        // Draw user guide strand rail
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.gRnaX, centerY);
        this.ctx.lineTo(this.gRnaX + ((this.guideRNA.length - 1) * this.baseSpacing), centerY);
        this.ctx.stroke();

        // Draw gRNA Node elements
        this.guideRNA.forEach((node) => {
            const absoluteX = this.gRnaX + (node.offsetIdx * this.baseSpacing);
            if (absoluteX >= 0 && absoluteX <= this.canvas.width) {
                this.ctx.fillStyle = '#00f0ff'; // Unified gRNA structural tracking index
                this.ctx.beginPath();
                this.ctx.arc(absoluteX, centerY, 5, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
                this.ctx.font = '10px monospace';
                this.ctx.fillText(node.base, absoluteX - 3, centerY + 18);
            }
        });
    }

    drawHydrogenBondLinkages() {
        const dnaY = this.canvas.height * 0.35;
        const rnaY = this.canvas.height * 0.65;

        this.guideRNA.forEach((rnaNode) => {
            const rnaX = this.gRnaX + (rnaNode.offsetIdx * this.baseSpacing);

            this.targetDNA.forEach((dnaNode) => {
                const distanceX = Math.abs(rnaX - dnaNode.x);

                // If nodes are visually hovering over the threshold alignment axis, bridge them
                if (distanceX < this.baseSpacing / 2) {
                    const isComplementary = (this.complementMap[rnaNode.base] === dnaNode.base);

                    this.ctx.beginPath();
                    this.ctx.moveTo(rnaX, rnaY - 5);
                    this.ctx.lineTo(dnaNode.x, dnaY + 7);

                    if (isComplementary) {
                        // High matching sequence feedback trace
                        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.6)'; // Bio-Green link
                        this.ctx.lineWidth = 2;
                        this.ctx.setLineDash([]);
                    } else {
                        // Mismatched structural pairing trail
                        this.ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)'; // Pink dash error track
                        this.ctx.lineWidth = 1;
                        this.ctx.setLineDash([4, 4]);
                    }
                    this.ctx.stroke();
                }
            });
        });
        this.ctx.setLineDash([]); // Reset line styles for clean rendering passes
    }
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Sequencing Configurations
    this.baseSpacing = 40;
    this.targetDNA = [];
    this.guideRNA = [];
    this.gRnaX = 200; // Track user interactive X position

    this.bases = ['A', 'T', 'C', 'G'];
    this.complementMap = { A: 'T', T: 'A', C: 'G', G: 'C' };
    this.baseColors = {
      A: '#ff4d4d',
      T: '#ffeb3b',
      C: '#3399ff',
      G: '#4caf50',
    };

    this.scrollSpeed = 1.2;
    this.metrics = { homology: 0, accuracy: 0 };

    this.init();
    this.registerEvents();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.generateTargetDNA();
    this.generateGuideRNA();
    document.getElementById('nucleotideMetric').innerText =
      this.targetDNA.length + this.guideRNA.length;
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const computedStyle = window.getComputedStyle(parent);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

    const header = parent.querySelector('.viewport-header');
    let headerHeight = 0;
    if (header) {
      const headerStyle = window.getComputedStyle(header);
      headerHeight = header.offsetHeight + parseFloat(headerStyle.marginTop || 0) + parseFloat(headerStyle.marginBottom || 0);
    }

    this.canvas.width = parent.clientWidth - paddingLeft - paddingRight;
    this.canvas.height = parent.clientHeight - paddingTop - paddingBottom - headerHeight;
  }

  generateTargetDNA() {
    const totalBases = Math.ceil((this.canvas.width + 400) / this.baseSpacing);
    for (let i = 0; i < totalBases; i++) {
      this.targetDNA.push({
        x: i * this.baseSpacing,
        base: this.bases[Math.floor(Math.random() * this.bases.length)],
      });
    }
  }

  generateGuideRNA() {
    // Construct a static 12-base guide RNA sequence strand targeting a pattern match
    const sequence = [
      'T',
      'A',
      'G',
      'C',
      'A',
      'T',
      'G',
      'C',
      'A',
      'T',
      'T',
      'A',
    ];
    for (let i = 0; i < sequence.length; i++) {
      this.guideRNA.push({
        offsetIdx: i,
        base: sequence[i],
      });
    }
  }

  registerEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.gRnaX = e.clientX - rect.left;
    });

    const handleTouch = (e) => {
      if (e.touches && e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.gRnaX = e.touches[0].clientX - rect.left;
        e.preventDefault();
      }
    };
    this.canvas.addEventListener('touchstart', handleTouch, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouch, { passive: false });
  }

  calculateAlignmentHomology() {
    let activeMatches = 0;
    let alignedGuideBases = 0;

    this.guideRNA.forEach((rnaNode) => {
      const rnaAbsoluteX = this.gRnaX + rnaNode.offsetIdx * this.baseSpacing;

      let closestMatch = null;
      let closestDistance = Infinity;

      // Find only the closest DNA nucleotide
      this.targetDNA.forEach((dnaNode) => {
        const distanceX = Math.abs(rnaAbsoluteX - dnaNode.x);

        if (distanceX < this.baseSpacing / 2 && distanceX < closestDistance) {
          closestDistance = distanceX;
          closestMatch = dnaNode;
        }
      });

      // Count at most one overlap per gRNA base
      if (closestMatch) {
        alignedGuideBases++;

        if (this.complementMap[rnaNode.base] === closestMatch.base) {
          activeMatches++;
        }
      }
    });

    this.metrics.homology = (activeMatches / this.guideRNA.length) * 100;

    this.metrics.accuracy =
      alignedGuideBases > 0 ? (activeMatches / alignedGuideBases) * 100 : 0;
  }

  animate() {
    const startPerformance = performance.now();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update coordinates and shift target sequences
    this.targetDNA.forEach((node) => {
      node.x -= this.scrollSpeed;
    });

    // Recycled out-of-bounds node sequences to form an endless array stream
    if (this.targetDNA[0].x < -this.baseSpacing) {
      const popped = this.targetDNA.shift();
      popped.x = this.targetDNA[this.targetDNA.length - 1].x + this.baseSpacing;
      popped.base = this.bases[Math.floor(Math.random() * this.bases.length)];
      this.targetDNA.push(popped);
    }

    this.calculateAlignmentHomology();

    // Render Base Elements
    this.drawTargetDNAStrand();
    this.drawGuideRNAStrand();
    this.drawHydrogenBondLinkages();

    // Push calculated data fields directly out to DOM containers
    document.getElementById('homologyMetric').innerText =
      `${this.metrics.homology.toFixed(1)}%`;
    document.getElementById('accuracyMetric').innerText =
      `${this.metrics.accuracy.toFixed(1)}%`;

    const loopLatency = performance.now() - startPerformance;
    document.getElementById('latencyMetric').innerText =
      `${loopLatency.toFixed(2)} ms`;

    requestAnimationFrame(() => this.animate());
  }

  drawTargetDNAStrand() {
    const centerY = this.canvas.height * 0.35;

    // Draw structural backbone vector rail
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(this.canvas.width, centerY);
    this.ctx.stroke();

    // Draw individual Target Nucleotide Nodes
    this.targetDNA.forEach((node) => {
      if (node.x >= 0 && node.x <= this.canvas.width) {
        this.ctx.fillStyle = this.baseColors[node.base] || '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(node.x, centerY, 7, 0, Math.PI * 2);
        this.ctx.fill();

        // Text base indicator labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(node.base, node.x - 3, centerY - 15);
      }
    });
  }

  drawGuideRNAStrand() {
    const centerY = this.canvas.height * 0.65;

    // Draw user guide strand rail
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.gRnaX, centerY);
    this.ctx.lineTo(
      this.gRnaX + (this.guideRNA.length - 1) * this.baseSpacing,
      centerY
    );
    this.ctx.stroke();

    // Draw gRNA Node elements
    this.guideRNA.forEach((node) => {
      const absoluteX = this.gRnaX + node.offsetIdx * this.baseSpacing;
      if (absoluteX >= 0 && absoluteX <= this.canvas.width) {
        this.ctx.fillStyle = '#00f0ff'; // Unified gRNA structural tracking index
        this.ctx.beginPath();
        this.ctx.arc(absoluteX, centerY, 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(node.base, absoluteX - 3, centerY + 18);
      }
    });
  }

  drawHydrogenBondLinkages() {
    const dnaY = this.canvas.height * 0.35;
    const rnaY = this.canvas.height * 0.65;

    this.guideRNA.forEach((rnaNode) => {
      const rnaX = this.gRnaX + rnaNode.offsetIdx * this.baseSpacing;

      this.targetDNA.forEach((dnaNode) => {
        const distanceX = Math.abs(rnaX - dnaNode.x);

        // If nodes are visually hovering over the threshold alignment axis, bridge them
        if (distanceX < this.baseSpacing / 2) {
          const isComplementary =
            this.complementMap[rnaNode.base] === dnaNode.base;

          this.ctx.beginPath();
          this.ctx.moveTo(rnaX, rnaY - 5);
          this.ctx.lineTo(dnaNode.x, dnaY + 7);

          if (isComplementary) {
            // High matching sequence feedback trace
            this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.6)'; // Bio-Green link
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([]);
          } else {
            // Mismatched structural pairing trail
            this.ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)'; // Pink dash error track
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 4]);
          }
          this.ctx.stroke();
        }
      });
    });
    this.ctx.setLineDash([]); // Reset line styles for clean rendering passes
  }
}

// Ingest visualizer environment once layout parser signals load ready
window.addEventListener('DOMContentLoaded', () => {
    new CrisprAlignmentSandbox('crisprCanvas');
});
});
  new CrisprAlignmentSandbox('crisprCanvas');
});
