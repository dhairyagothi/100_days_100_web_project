/**
 * Advanced Physics & Vector Layer - GSSoC Tier Critical
 * Vector Kinematics & Newtonian Gravity Integration Core
 */
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() * 2 - 1) * 0.8;
        this.vy = (Math.random() * 2 - 1) * 0.8;
        this.radius = Math.random() * 1.5 + 1;
    }

    // Standard vector accumulation updates
    update(frictionFactor) {
        this.x += this.vx;
        this.y += this.vy;

        // Apply dampening constraints
        this.vx *= frictionFactor;
        this.vy *= frictionFactor;
    }
}

export class PhysicsNebulaEngine {
    #canvas;
    #ctx;
    particles = [];
    singularity = { x: null, y: null, active: false };
    gravityG = 0.15;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');
    }

    populateCloud(count) {
        this.particles = Array.from({ length: count }, () =>
            new Particle(Math.random() * this.#canvas.width, Math.random() * this.#canvas.height)
        );
    }

    // Core Newtonian Gravity Math Logic: Acceleration = G * Mass / Distance^2
    processPhysicsStep() {
        let cumulativeVelocitySum = 0;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            if (this.singularity.active && this.singularity.x !== null) {
                const dx = this.singularity.x - p.x;
                const dy = this.singularity.y - p.y;
                const distance = Math.hypot(dx, dy) + 25; // Apply software boundary padding to avoid zero division errors

                // Vector acceleration pull math
                const force = (this.gravityG * 40) / (distance * distance);
                p.vx += (dx / distance) * force;
                p.vy += (dy / distance) * force;
            }

            p.update(0.99); // Friction coefficient constant
            cumulativeVelocitySum += Math.hypot(p.vx, p.vy);
        }

        return cumulativeVelocitySum; // Returns kinetic index for audio triggers
    }

    // High-frequency viewport rendering routine
    renderField() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // Draw active gravitational center point vector
        if (this.singularity.active && this.singularity.x !== null) {
            this.#ctx.beginPath();
            this.#ctx.arc(this.singularity.x, this.singularity.y, 8, 0, Math.PI * 2);
            this.#ctx.fillStyle = '#ff00bb';
            this.#ctx.shadowBlur = 15;
            this.#ctx.shadowColor = '#ff00bb';
            this.#ctx.fill();
            this.#ctx.shadowBlur = 0; // Clear immediately
        }

        // Draw standard star particle streams
        this.#ctx.fillStyle = '#00f3ff';
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.#ctx.fillRect(p.x, p.y, p.radius, p.radius);
        }
    }
}