class ChaoticDoublePendulum {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Physical Parameters Constants Matrix
        this.g = 9.81;
        this.l1 = 140;
        this.l2 = 140;
        this.m1 = 15;
        this.m2 = 15;

        // System State Vectors: [theta, omega] (Angles & Angular Velocities)
        this.st = { t1: Math.PI / 2, t2: Math.PI / 2, w1: 0.0, w2: 0.0 };
        this.trail = [];
        this.maxTrailSize = 250;

        this.initCanvas();
        this.registerParametersControllers();
        this.animate();
    }

    initCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight - 40;
    }

    // Equations of Motion: Calculates angular accelerations (alpha1, alpha2)
    getAccelerations(t1, t2, w1, w2) {
        const delta = t1 - t2;
        const num1 = -this.g * (2 * this.m1 + this.m2) * Math.sin(t1) - this.m2 * this.g * Math.sin(t1 - 2 * t2) - 2 * Math.sin(delta) * this.m2 * (w2 * w2 * this.l2 + w1 * w1 * this.l1 * Math.cos(delta));
        const den1 = this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * t1 - 2 * t2));
        const alpha1 = num1 / den1;

        const num2 = 2 * Math.sin(delta) * (w1 * w1 * this.l1 * (this.m1 + this.m2) + this.g * (this.m1 + this.m2) * Math.cos(t1) + w2 * w2 * this.l2 * this.m2 * Math.cos(delta));
        const den2 = this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * t1 - 2 * t2));
        const alpha2 = num2 / den2;

        return [alpha1, alpha2];
    }

    // High-Precision Runge-Kutta 4th Order Numerical Integrator
    rungeKutta4Step(dt) {
        const getDerivatives = (s) => {
            const [a1, a2] = this.getAccelerations(s.t1, s.t2, s.w1, s.w2);
            return { dt1: s.w1, dt2: s.w2, dw1: a1, dw2: a2 };
        };

        // K1 Vector
        const k1 = getDerivatives(this.st);

        // K2 Vector
        const s2 = {
            t1: this.st.t1 + 0.5 * dt * k1.dt1, t2: this.st.t2 + 0.5 * dt * k1.dt2,
            w1: this.st.w1 + 0.5 * dt * k1.dw1, w2: this.st.w2 + 0.5 * dt * k1.dw2
        };
        const k2 = getDerivatives(s2);

        // K3 Vector
        const s3 = {
            t1: this.st.t1 + 0.5 * dt * k2.dt1, t2: this.st.t2 + 0.5 * dt * k2.dt2,
            w1: this.st.w1 + 0.5 * dt * k2.dw1, w2: this.st.w2 + 0.5 * dt * k2.dw2
        };
        const k3 = getDerivatives(s3);

        // K4 Vector
        const s4 = {
            t1: this.st.t1 + dt * k3.dt1, t2: this.st.t2 + dt * k3.dt2,
            w1: this.st.w1 + dt * k3.dw1, w2: this.st.w2 + dt * k3.dw2
        };
        const k4 = getDerivatives(s4);

        // Weighted Average Update: s = s + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
        this.st.t1 += (dt / 6) * (k1.dt1 + 2 * k2.dt1 + 2 * k3.dt1 + k4.dt1);
        this.st.t2 += (dt / 6) * (k1.dt2 + 2 * k2.dt2 + 2 * k3.dt2 + k4.dt2);
        this.st.w1 += (dt / 6) * (k1.dw1 + 2 * k2.dw1 + 2 * k3.dw1 + k4.dw1);
        this.st.w2 += (dt / 6) * (k1.dw2 + 2 * k2.dw2 + 2 * k3.dw2 + k4.dw2);
    }

    registerParametersControllers() {
        window.addEventListener('resize', () => this.initCanvas());

        document.getElementById('resetSimulationBtn').addEventListener('click', () => {
            this.trail = [];
            this.st = { t1: Math.PI / 2 + (Math.random() * 0.1), t2: Math.PI / 2, w1: 0, w2: 0 };
        });

        const setupSlider = (sliderId, valId, prop) => {
            const el = document.getElementById(sliderId);
            el.addEventListener('input', (e) => {
                this[prop] = parseFloat(e.target.value);
                document.getElementById(valId).innerText = e.target.value;
            });
        };

        setupSlider('gravitySlider', 'gVal', 'g');
        setupSlider('l1Slider', 'l1Val', 'l1');
        setupSlider('l2Slider', 'l2Val', 'l2');
        setupSlider('m1Slider', 'm1Val', 'm1');
        setupSlider('m2Slider', 'm2Val', 'm2');
    }

    animate() {
        // Execute 2 calculation subdivisions per frame step to stabilize math at higher velocities
        const dt = 0.2;
        this.rungeKutta4Step(dt);
        this.rungeKutta4Step(dt);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGridBackground();

        // Pin coordinate calculations
        const originX = this.canvas.width / 2;
        const originY = this.canvas.height * 0.42;

        const x1 = originX + this.l1 * Math.sin(this.st.t1);
        const y1 = originY + this.l1 * Math.cos(this.st.t1);

        const x2 = x1 + this.l2 * Math.sin(this.st.t2);
        const y2 = y1 + this.l2 * Math.cos(this.st.t2);

        // Store the second pendulum tip position inside the trail matrix
        this.trail.push({ x: x2, y: y2 });
        if (this.trail.length > this.maxTrailSize) this.trail.shift();

        this.renderChaoticFractalPath();
        this.renderPendulumStrands(originX, originY, x1, y1, x2, y2);

        requestAnimationFrame(() => this.animate());
    }

    drawGridBackground() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
        this.ctx.lineWidth = 1;
        const gap = 30;
        for (let x = 0; x < this.canvas.width; x += gap) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gap) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }
    }

    renderChaoticFractalPath() {
        if (this.trail.length < 2) return;
        this.ctx.lineWidth = 1.8;

        for (let i = 1; i < this.trail.length; i++) {
            const p1 = this.trail[i - 1];
            const p2 = this.trail[i];
            const alpha = i / this.trail.length;

            // Paint neon glowing color transitions matching chronological points
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }
    }

    renderPendulumStrands(ox, oy, x1, y1, x2, y2) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';

        // Strand 1
        this.ctx.beginPath(); this.ctx.moveTo(ox, oy); this.ctx.lineTo(x1, y1); this.ctx.stroke();
        // Strand 2
        this.ctx.beginPath(); this.ctx.moveTo(x1, y1); this.ctx.lineTo(x2, y2); this.ctx.stroke();

        // Joint Centers Bob 1
        this.ctx.fillStyle = '#ff007f';
        this.ctx.shadowBlur = 10; this.ctx.shadowColor = '#ff007f';
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, Math.sqrt(this.m1) * 2.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Joint Centers Bob 2
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, Math.sqrt(this.m2) * 2.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Reset canvas blur parameters
        this.ctx.shadowBlur = 0;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ChaoticDoublePendulum('pendulumCanvas');
});