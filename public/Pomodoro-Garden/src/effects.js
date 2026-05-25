/**
 * effects.js — time-of-day rendering + canvas particle system.
 */

const TODS = [
    { name: 'night',     start: 0,  end: 5  },
    { name: 'dawn',      start: 5,  end: 7  },
    { name: 'morning',   start: 7,  end: 11 },
    { name: 'day',       start: 11, end: 15 },
    { name: 'afternoon', start: 15, end: 17 },
    { name: 'dusk',      start: 17, end: 19 },
    { name: 'night',     start: 19, end: 24 },
];

export function currentTOD(date = new Date()) {
    const h = date.getHours();
    return TODS.find(t => h >= t.start && h < t.end)?.name || 'day';
}

export function startTimeOfDayWatcher() {
    const update = () => {
        const tod = currentTOD();
        document.body.dataset.tod = tod;
        const clockEl = document.getElementById('todClock');
        if (clockEl) {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            clockEl.textContent = `${time} · ${tod}`;
        }
    };
    update();
    setInterval(update, 60_000);
}

/* ----------- Particle field ----------- */

export class Particles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.targetCount = 14;
        this.resize();
        this.spawn();
        addEventListener('resize', () => this.resize());
        this._loop();
    }

    resize() {
        const dpr = devicePixelRatio || 1;
        const { innerWidth: w, innerHeight: h } = window;
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.scale(dpr, dpr);
        this.w = w; this.h = h;
    }

    spawn() {
        this.particles = [];
        for (let i = 0; i < this.targetCount; i++) {
            this.particles.push(this._makeParticle(true));
        }
    }

    _makeParticle(spreadVertically = false) {
        const tod = document.body.dataset.tod || 'day';
        if (tod === 'night') {
            return {
                kind: 'firefly',
                x: Math.random() * this.w,
                y: spreadVertically ? Math.random() * this.h : this.h - Math.random() * this.h * 0.6,
                r: 1.2 + Math.random() * 1.2,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: 0.02 + Math.random() * 0.02,
            };
        }
        if (tod === 'dusk' || tod === 'dawn') {
            return {
                kind: 'mote',
                x: Math.random() * this.w,
                y: spreadVertically ? Math.random() * this.h : -10,
                r: 0.8 + Math.random() * 1,
                vx: (Math.random() - 0.5) * 0.15,
                vy: 0.1 + Math.random() * 0.15,
            };
        }
        return {
            kind: 'petal',
            x: Math.random() * this.w,
            y: spreadVertically ? Math.random() * this.h : -10,
            r: 2 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.4,
            vy: 0.2 + Math.random() * 0.3,
            spin: (Math.random() - 0.5) * 0.04,
            rotation: Math.random() * Math.PI,
        };
    }

    _loop() {
        const draw = () => {
            this.ctx.clearRect(0, 0, this.w, this.h);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                this._step(p);
                this._draw(p);
                if (p.y > this.h + 20 || p.x < -20 || p.x > this.w + 20) {
                    this.particles[i] = this._makeParticle(false);
                }
            }
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    _step(p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.kind === 'firefly') {
            p.phase += p.phaseSpeed;
            if (Math.random() < 0.02) {
                p.vx += (Math.random() - 0.5) * 0.1;
                p.vy += (Math.random() - 0.5) * 0.1;
                p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
                p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
            }
        } else if (p.kind === 'petal') {
            p.rotation += p.spin;
        }
    }

    _draw(p) {
        const ctx = this.ctx;
        ctx.save();
        if (p.kind === 'firefly') {
            const flicker = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(p.phase));
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
            grad.addColorStop(0, `rgba(232, 217, 122, ${0.9 * flicker})`);
            grad.addColorStop(0.4, `rgba(232, 217, 122, ${0.25 * flicker})`);
            grad.addColorStop(1, 'rgba(232, 217, 122, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.kind === 'mote') {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#D9B061';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.globalAlpha = 0.55;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = '#E8A98F';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r * 1.4, p.r * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}