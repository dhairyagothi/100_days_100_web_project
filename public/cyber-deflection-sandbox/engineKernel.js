/**
 * Advanced Algorithmic Geometry Layer - GSSoC Tier Critical
 * Vector Intersection Tracking & Ray Reflection Kernel
 */
class ThreatPacket {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() * 2 - 1) * 1.2;
        this.vy = Math.random() * 1.5 + 1.5; // Constant downward trajectory vector
        this.radius = 4;
        this.isActive = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

export class DeflectionPhysicsEngine {
    #canvas;
    #ctx;
    threats = [];
    deflectors = []; // Stores user-drawn barrier lines: [{x1, y1, x2, y2}]
    score = 0;
    integrity = 100;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');
    }

    spawnPacket() {
        if (this.threats.length < 40) {
            this.threats.push(new ThreatPacket(Math.random() * this.#canvas.width, 0));
        }
    }

    // Advanced Matrix Intersection and Dot Product Reflection Math Logic
    processFrameVectors() {
        for (let i = this.threats.length - 1; i >= 0; i--) {
            const p = this.threats[i];
            const oldX = p.x;
            const oldY = p.y;
            p.update();

            // 1. Boundary Trigger: Check if packet breaches the base core data node zone
            if (p.y >= this.#canvas.height) {
                this.integrity = Math.max(0, this.integrity - 10);
                this.threats.splice(i, 1);
                continue;
            }

            // 2. Continuous Ray-Tracing Check across player barrier lines
            for (let j = 0; j < this.deflectors.length; j++) {
                const line = this.deflectors[j];

                if (this.#checkLineIntersection(oldX, oldY, p.x, p.y, line.x1, line.y1, line.x2, line.y2)) {
                    // Collision Located! Compute line normal vector parameters
                    const dx = line.x2 - line.x1;
                    const dy = line.y2 - line.y1;

                    // Normal vector coordinates (perpendicular to shield segment)
                    let nx = -dy;
                    let ny = dx;
                    const normalLength = Math.hypot(nx, ny);
                    nx /= normalLength;
                    ny /= normalLength;

                    // Vector Dot Product Formula: dot = (velocity_vector . normal_vector)
                    const dotProduct = p.vx * nx + p.vy * ny;

                    // Apply Vector Reflection Equation: R = I - 2 * (I . N) * N
                    p.vx = p.vx - 2 * dotProduct * nx;
                    p.vy = p.vy - 2 * dotProduct * ny;

                    // Boost projectile values outward slightly to clear the barrier threshold boundary
                    p.x += p.vx * 2;
                    p.y += p.vy * 2;

                    this.score++;
                    break;
                }
            }

            // 3. Clear sideways deflected packets safely
            if (p.x < 0 || p.x > this.#canvas.width) {
                this.threats.splice(i, 1);
            }
        }
    }

    // Mathematical Cross Product Line Segment Intersection Determinant Helper
    #checkLineIntersection(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
        const det = (a2x - a1x) * (b2y - b1y) - (b2x - b1x) * (a2y - a1y);
        if (det === 0) return false; // Segments are completely parallel

        const lambda = ((b2y - b1y) * (b2x - a1x) + (b1x - b2x) * (b2y - a1y)) / det;
        const gamma = ((a1y - a2y) * (b2x - a1x) + (a2x - a1x) * (b2y - a1y)) / det;

        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }

    renderGrid(activeDragLine = null) {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // Draw core data zone line (the perimeter requiring defense)
        this.#ctx.beginPath();
        this.#ctx.moveTo(0, this.#canvas.height - 4);
        this.#ctx.lineTo(this.#canvas.width, this.#canvas.height - 4);
        this.#ctx.strokeStyle = '#ff0055';
        this.#ctx.lineWidth = 2;
        this.#ctx.stroke();

        // Draw active defensive barrier shields
        this.#ctx.lineWidth = 4;
        this.#ctx.strokeStyle = '#00d9ff';
        this.deflectors.forEach(line => {
            this.#ctx.beginPath();
            this.#ctx.moveTo(line.x1, line.y1);
            this.#ctx.lineTo(line.x2, line.y2);
            this.#ctx.stroke();
        });

        // Draw active building drag lines
        if (activeDragLine) {
            this.#ctx.lineWidth = 2;
            this.#ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)';
            this.#ctx.setLineDash([4, 4]);
            this.#ctx.beginPath();
            this.#ctx.moveTo(activeDragLine.x1, activeDragLine.y1);
            this.#ctx.lineTo(activeDragLine.x2, activeDragLine.y2);
            this.#ctx.stroke();
            this.#ctx.setLineDash([]); // Reset immediately
        }

        // Draw descending threat packet objects
        this.#ctx.fillStyle = '#ff0055';
        this.threats.forEach(p => {
            this.#ctx.beginPath();
            this.#ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.#ctx.fill();
        });
    }
}