// ============================================================================
// 1. ADVANCED VECTOR COORDINATE MATHEMATICS
// ============================================================================
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    div(n) { if (n !== 0) { this.x /= n; this.y /= n; } return this; }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() { let m = this.mag(); if (m !== 0) this.div(m); return this; }
    copy() { return new Vector2D(this.x, this.y); }

    // Dot Product utility
    dot(v) { return this.x * v.x + this.y * v.y; }

    static sub(v1, v2) { return new Vector2D(v1.x - v2.x, v1.y - v2.y); }
}

// ============================================================================
// 2. VECTOR ATTACK THREAT ENTITY (OBJECT POOL COMPLIANT)
// ============================================================================
class ThreatVector {
    constructor() {
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.active = false;
        this.size = 4;
        this.trail = [];
        this.maxTrail = 12;
    }

    spawn(x, y, vx, vy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = vx;
        this.velocity.y = vy;
        this.active = true;
        this.trail = [];
    }

    update(speedMultiplier) {
        if (!this.active) return;

        this.trail.push(this.position.copy());
        if (this.trail.length > this.maxTrail) this.trail.shift();

        // Step velocity forward scaled by slider parameters
        this.position.x += this.velocity.x * speedMultiplier;
        this.position.y += this.velocity.y * speedMultiplier;
    }
}

// ============================================================================
// 3. MAIN SIMULATOR & RAY DEFLECTION ENGINE
// ============================================================================
class SecOpsSandbox {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.config = {
            maxThreats: 150,
            speedScale: 2.0,
            spawnRate: 0.02, // Probability per frame cycle
        };

        this.gameState = {
            integrity: 100,
            mitigated: 0,
        };

        this.threatPool = Array.from({ length: this.config.maxThreats }, () => new ThreatVector());
        this.shields = []; // Player barrier line definitions
        this.honeypots = []; // Targeted safe landing targets

        this.interaction = { drawing: false, start: new Vector2D(), current: new Vector2D() };

        this.initEvents();
        this.resize();
        this.setupHoneypots();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.setupHoneypots(); // Re-anchor honey zones safely on window alterations
    }

    setupHoneypots() {
        // Position isolated secure zones along the floor bounds layout
        this.honeypots = [
            { position: new Vector2D(this.canvas.width * 0.25, this.canvas.height - 30), radius: 35 },
            { position: new Vector2D(this.canvas.width * 0.75, this.canvas.height - 30), radius: 35 }
        ];
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());

        // Tracking click matrices for barrier injection
        this.canvas.addEventListener('mousedown', (e) => {
            this.interaction.drawing = true;
            this.interaction.start.x = e.offsetX;
            this.interaction.start.y = e.offsetY;
            this.interaction.current.x = e.offsetX;
            this.interaction.current.y = e.offsetY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.interaction.drawing) return;
            this.interaction.current.x = e.offsetX;
            this.interaction.current.y = e.offsetY;
        });

        this.canvas.addEventListener('mouseup', () => {
            if (!this.interaction.drawing) return;
            this.interaction.drawing = false;

            // Enforce minimum barrier line sizing parameters
            let dx = this.interaction.current.x - this.interaction.start.x;
            let dy = this.interaction.current.y - this.interaction.start.y;
            if (Math.sqrt(dx * dx + dy * dy) > 15) {
                this.shields.push({
                    p1: this.interaction.start.copy(),
                    p2: this.interaction.current.copy()
                });
                this.logTerminal(">> DEFENSE BARRIER CONSTRUCTED ROUTE MAP INTEGRATED.", "info");

                // Keep max total concurrent wall barriers capped to prevent canvas bloat
                if (this.shields.length > 5) this.shields.shift();
            }
        });
    }

    logTerminal(message, type = "info") {
        const logsContainer = document.getElementById('terminalLogs');
        const row = document.createElement('div');
        row.className = `log-row ${type}`;
        row.innerText = message;
        logsContainer.appendChild(row);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // ============================================================================
    // 4. LINE INTERSECTION AND DOT PRODUCT REFLECTION CALCULUS
    // ============================================================================
    processVectorCollisions(threat) {
        let nextPos = threat.position.copy().add(threat.velocity.copy().mult(this.config.speedScale));

        for (let shield of this.shields) {
            if (this.checkLineIntersection(threat.position, nextPos, shield.p1, shield.p2)) {

                // 1. Calculate base normal segment vector paths
                let wallVec = Vector2D.sub(shield.p2, shield.p1);
                let normal = new Vector2D(-wallVec.y, wallVec.x).normalize();

                // 2. Ensure normal alignment faces incoming ray vector fields
                if (normal.dot(threat.velocity) > 0) {
                    normal.mult(-1);
                }

                // 3. Compute ray reflection formula: R = V - 2 * (V · N) * N
                let dotProd = threat.velocity.dot(normal);
                let reflection = threat.velocity.copy().sub(normal.mult(2 * dotProd));

                // Apply updated kinematics reflection matrix to particle payload
                threat.velocity = reflection;
                threat.position.add(threat.velocity); // Shift cleanly away from boundaries

                this.logTerminal(">> WARPING ATTACK PACKET DETECTED. REFLECTION VECTOR ENGAGED.", "alert");
                return;
            }
        }
    }

    checkLineIntersection(a1, a2, b1, b2) {
        // Standard Determinant Based Line Segment Intersection Algorithm
        let det = (a2.x - a1.x) * (b2.y - b1.y) - (b2.x - b1.x) * (a2.y - a1.y);
        if (det === 0) return false; // Segments are completely parallel

        let lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
        let gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;

        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }

    update() {
        // Stream threat vectors onto grid layout
        if (Math.random() < this.config.spawnRate) {
            let inactiveThreat = this.threatPool.find(t => !t.active);
            if (inactiveThreat) {
                let startX = Math.random() * this.canvas.width;
                let targetX = Math.random() * this.canvas.width;
                let angleVec = new Vector2D(targetX - startX, this.canvas.height).normalize();
                inactiveThreat.spawn(startX, 0, angleVec.x * 2.5, angleVec.y * 2.5);
            }
        }

        this.threatPool.forEach(t => {
            if (!t.active) return;

            this.processVectorCollisions(t);
            t.update(this.config.speedScale);

            // Check if threat managed to successfully penetrate boundaries into isolation targets
            this.honeypots.forEach((hp, idx) => {
                let dist = Vector2D.sub(hp.position, t.position).mag();
                if (dist < hp.radius) {
                    t.active = false;
                    this.gameState.mitigated++;
                    document.getElementById('mitigatedMetric').innerText = this.gameState.mitigated;
                    this.logTerminal(`>> MITIGATED: THREAT ISOLATED IN HONEYPOT_0${idx + 1}.`, "success");
                }
            });

            // Impact damage logic if bounds missed honey pools entirely
            if (t.position.y > this.canvas.height) {
                t.active = false;
                this.gameState.integrity = Math.max(0, this.gameState.integrity - 5);
                const integrityText = document.getElementById('integrityMetric');
                integrityText.innerText = `${this.gameState.integrity}%`;

                if (this.gameState.integrity <= 35) integrityText.className = "value alert";
                this.logTerminal(">> SECURITY BREACH DETECTED: SYSTEM INTEGRITY PENETRATED.", "alert");
            }
        });
    }

    render() {
        // High frequency frame clearing with trace overlay profiles
        this.ctx.fillStyle = 'rgba(5, 5, 10, 0.25)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw structural radar tracking grid backdrop lines
        this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath(); this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.canvas.height); this.ctx.stroke();
        }

        // Draw Isolation Honeypots Target Regions
        this.honeypots.forEach((hp, index) => {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00e5ff';
            this.ctx.strokeStyle = '#00e5ff';
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
            this.ctx.beginPath();
            this.ctx.arc(hp.position.x, hp.position.y, hp.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#00e5ff';
            this.ctx.font = '9px monospace';
            this.ctx.fillText(`HONEYPOT_0${index + 1}`, hp.position.x - 30, hp.position.y - 5);
        });

        // Draw Player Custom Deflection Barrier Line Arrays
        this.shields.forEach(shield => {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#39ff14';
            this.ctx.strokeStyle = '#39ff14';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(shield.p1.x, shield.p1.y);
            this.ctx.lineTo(shield.p2.x, shield.p2.y);
            this.ctx.stroke();
        });

        // Draw Current Interactive Blueprint String Trace Line
        if (this.interaction.drawing) {
            this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.interaction.start.x, this.interaction.start.y);
            this.ctx.lineTo(this.interaction.current.x, this.interaction.current.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]); // Reset
        }

        // Render Threat Vector Tracking Profiles
        this.threatPool.forEach(t => {
            if (!t.active) return;

            // Render vector tails
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = 'rgba(255, 7, 58, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let i = 0; i < t.trail.length; i++) {
                let pt = t.trail[i];
                if (i === 0) this.ctx.moveTo(pt.x, pt.y);
                else this.ctx.lineTo(pt.x, pt.y);
            }
            this.ctx.stroke();

            // Core threat header point
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ff073a';
            this.ctx.fillStyle = '#ff073a';
            this.ctx.beginPath();
            this.ctx.arc(t.position.x, t.position.y, t.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.shadowBlur = 0;
    }

    loop(timestamp) {
        let startTime = performance.now();

        this.update();
        this.render();

        let endTime = performance.now();
        let frameTime = endTime - startTime;
        document.getElementById('latencyCounter').innerText = `RENDER_LATENCY: ${frameTime.toFixed(2)}ms`;

        requestAnimationFrame((t) => this.loop(t));
    }
}

// ============================================================================
// 5. DOM INITIALIZATION INVOCATION
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
    const sandbox = new SecOpsSandbox('defenseCanvas');
    sandbox.loop(0);

    const speedSlider = document.getElementById('threatSpeedSlider');
    const speedVal = document.getElementById('speedVal');
    speedSlider.addEventListener('input', (e) => {
        let v = parseFloat(e.target.value);
        sandbox.config.speedScale = v;
        speedVal.innerText = `${v.toFixed(1)}x`;
    });
});