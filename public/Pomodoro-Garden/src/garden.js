/**
 * garden.js — procedural SVG plant generation + garden composition.
 *
 * Each plant is generated from:
 *   - type (8 archetypes)
 *   - seed (deterministic PRNG)
 *   - sessionDuration (drives rarity / size)
 *   - timestamp (drives positional jitter and color drift)
 *
 * Plants are placed with simple Poisson-ish sampling — no two plants land within
 * a minimum radius of each other.
 */

import { emitEvent, on } from './bus.js';
import { storage } from './storage.js';

// ---------- PRNG: mulberry32 ----------
function mulberry32(seed) {
    return function() {
        let t = seed = (seed + 0x6D2B79F5) | 0;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ---------- Plant archetypes ----------
// Each fn returns inner SVG markup. ViewBox is 60x100 (anchored to bottom-center: x=30, y=100).

const PLANTS = {

    sprout(rng) {
        const lean = (rng() - 0.5) * 6;
        return `
            <path class="plant__stroke" d="M 30 100 Q ${30 + lean} 70, ${28 + lean*2} 55"
                  fill="none" stroke="var(--p-stem)" stroke-width="2" stroke-linecap="round"/>
            <path d="M ${28 + lean*2} 65 Q ${10} 60, ${4} 50 Q ${18} 64, ${28 + lean*2} 67 Z"
                  fill="var(--p-leaf-1)"/>
            <path d="M ${28 + lean*2} 58 Q ${48} 52, ${54} 40 Q ${42} 56, ${28 + lean*2} 60 Z"
                  fill="var(--p-leaf-2)"/>
        `;
    },

    herb(rng) {
        const bend = (rng() - 0.5) * 8;
        const leafCount = 4 + Math.floor(rng() * 2);
        let leaves = '';
        for (let i = 0; i < leafCount; i++) {
            const y = 85 - i * 15;
            const side = i % 2 === 0 ? 1 : -1;
            const reach = 14 + rng() * 6;
            const tip = 30 + side * reach;
            const color = i % 2 === 0 ? 'var(--p-leaf-1)' : 'var(--p-leaf-2)';
            leaves += `<path d="M 30 ${y} Q ${tip} ${y - 4}, ${tip + side*4} ${y - 12} Q ${tip - side*2} ${y - 2}, 30 ${y + 2} Z" fill="${color}"/>`;
        }
        return `
            <path class="plant__stroke" d="M 30 100 Q ${30 + bend} 70, ${30} 30"
                  fill="none" stroke="var(--p-stem)" stroke-width="2" stroke-linecap="round"/>
            ${leaves}
        `;
    },

    flower(rng) {
        const stemBend = (rng() - 0.5) * 6;
        const petalCount = 5 + Math.floor(rng() * 3);
        const cy = 22, cx = 30 + stemBend;
        const r = 6;
        let petals = '';
        for (let i = 0; i < petalCount; i++) {
            const a = (i / petalCount) * Math.PI * 2 + rng() * 0.2;
            const px = cx + Math.cos(a) * 8;
            const py = cy + Math.sin(a) * 8;
            petals += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(5 + rng()).toFixed(1)}" fill="var(--p-flower)" opacity="0.92"/>`;
        }
        return `
            <path class="plant__stroke" d="M 30 100 Q ${30 + stemBend} 65, ${cx} ${cy + r}"
                  fill="none" stroke="var(--p-stem)" stroke-width="2" stroke-linecap="round"/>
            <path d="M 30 70 Q 14 64, 8 56 Q 22 68, 30 72 Z" fill="var(--p-leaf-1)"/>
            <path d="M 30 60 Q 46 54, 52 46 Q 38 58, 30 62 Z" fill="var(--p-leaf-2)"/>
            ${petals}
            <circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="var(--p-flower-center)"/>
        `;
    },

    fern(rng) {
        const pairs = 5 + Math.floor(rng() * 2);
        let fronds = '';
        for (let i = 0; i < pairs; i++) {
            const y = 90 - i * 13;
            const reach = 22 - i * 1.8;
            const droop = i < 2 ? 8 : 4;
            fronds += `
                <path d="M 30 ${y} Q ${30 - reach/2} ${y - 2}, ${30 - reach} ${y + droop}"
                      fill="none" stroke="var(--p-leaf-1)" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M 30 ${y} Q ${30 + reach/2} ${y - 2}, ${30 + reach} ${y + droop}"
                      fill="none" stroke="var(--p-leaf-2)" stroke-width="2.4" stroke-linecap="round"/>
            `;
        }
        return `
            <path class="plant__stroke" d="M 30 100 L 30 22"
                  fill="none" stroke="var(--p-stem)" stroke-width="1.6" stroke-linecap="round"/>
            ${fronds}
        `;
    },

    bonsai(rng) {
        const lean = (rng() - 0.5) * 8;
        return `
            <path class="plant__stroke"
                  d="M 30 100 Q 18 80, 26 60 Q 38 48, ${30 + lean} 35"
                  fill="none" stroke="var(--p-stem)" stroke-width="3.2" stroke-linecap="round"/>
            <ellipse cx="${28 + lean}" cy="30" rx="16" ry="9" fill="var(--p-leaf-1)" opacity="0.9"/>
            <ellipse cx="${22 + lean}" cy="38" rx="10" ry="6" fill="var(--p-leaf-2)" opacity="0.85"/>
            <ellipse cx="${36 + lean}" cy="40" rx="9" ry="5.5" fill="var(--p-leaf-1)" opacity="0.85"/>
        `;
    },

    bamboo(rng) {
        const stalks = 3;
        let render = '';
        for (let s = 0; s < stalks; s++) {
            const x = 18 + s * 12 + (rng() - 0.5) * 4;
            const tipY = 10 + rng() * 8;
            const nodes = 5;
            for (let n = 1; n < nodes; n++) {
                const ny = 100 - n * ((100 - tipY) / nodes);
                render += `<line x1="${x - 3}" y1="${ny}" x2="${x + 3}" y2="${ny}" stroke="var(--p-stem)" stroke-width="1.2"/>`;
            }
            const lx = x;
            render += `
                <line x1="${x}" y1="100" x2="${x}" y2="${tipY}" stroke="var(--p-stem)" stroke-width="2.2" stroke-linecap="round" class="plant__stroke"/>
                <path d="M ${lx} ${tipY + 4} Q ${lx - 12} ${tipY - 4}, ${lx - 18} ${tipY - 14}" fill="none" stroke="var(--p-leaf-1)" stroke-width="2" stroke-linecap="round"/>
                <path d="M ${lx} ${tipY + 4} Q ${lx + 10} ${tipY - 6}, ${lx + 16} ${tipY - 18}" fill="none" stroke="var(--p-leaf-2)" stroke-width="2" stroke-linecap="round"/>
            `;
        }
        return render;
    },

    pine(rng) {
        const bands = 5;
        let layers = '';
        for (let i = 0; i < bands; i++) {
            const y = 30 + i * 14;
            const w = 6 + i * 5;
            layers += `<path d="M ${30 - w} ${y + 8} L 30 ${y - 2} L ${30 + w} ${y + 8} Z" fill="var(--p-leaf-1)" opacity="${0.7 + i * 0.05}"/>`;
        }
        return `
            <line x1="30" y1="100" x2="30" y2="92" stroke="var(--p-stem)" stroke-width="3" stroke-linecap="round" class="plant__stroke"/>
            ${layers}
        `;
    },

    maple(rng) {
        const branches = `
            <path class="plant__stroke" d="M 30 100 L 30 50" stroke="var(--p-stem)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <path d="M 30 70 Q 22 64, 16 58" stroke="var(--p-stem)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
            <path d="M 30 60 Q 38 54, 44 48" stroke="var(--p-stem)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        `;
        const cluster = (cx, cy, r, color) =>
            `<g opacity="0.92">
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>
                <circle cx="${cx - r*0.6}" cy="${cy + 2}" r="${r * 0.7}" fill="${color}"/>
                <circle cx="${cx + r*0.6}" cy="${cy - 1}" r="${r * 0.7}" fill="${color}"/>
                <circle cx="${cx}" cy="${cy - r*0.6}" r="${r * 0.7}" fill="${color}"/>
            </g>`;
        return `
            ${branches}
            ${cluster(30, 35, 11, 'var(--p-leaf-1)')}
            ${cluster(18, 56, 7, 'var(--p-leaf-2)')}
            ${cluster(44, 46, 8, 'var(--p-leaf-1)')}
        `;
    },
};

// ---------- Type selection based on session duration ----------
function pickType(durationSec, rng) {
    const mins = durationSec / 60;
    const r = rng();
    if (mins < 15)  return r < 0.7 ? 'sprout' : 'herb';
    if (mins < 25)  return r < 0.5 ? 'herb' : (r < 0.85 ? 'flower' : 'fern');
    if (mins < 45)  return r < 0.4 ? 'fern' : (r < 0.75 ? 'bonsai' : 'flower');
    if (mins < 60)  return r < 0.5 ? 'bonsai' : (r < 0.85 ? 'pine' : 'bamboo');
    return r < 0.4 ? 'bamboo' : (r < 0.8 ? 'pine' : 'maple');
}

// ---------- Color palette per plant ----------
function paletteFor(type, rng) {
    const variant = Math.floor(rng() * 3);
    const flowerHues = ['#C9663D', '#B8893A', '#A66BAA', '#DA784B'];
    const flowerCenter = '#B8893A';
    if (type === 'sprout' || type === 'herb') {
        return {
            '--p-stem': 'var(--sage-deep)',
            '--p-leaf-1': ['var(--sage)', 'var(--sage-light)', 'var(--sage-deep)'][variant],
            '--p-leaf-2': ['var(--sage-light)', 'var(--sage)', 'var(--sage-light)'][variant],
            '--p-flower': flowerHues[0],
            '--p-flower-center': flowerCenter,
        };
    }
    if (type === 'flower') {
        return {
            '--p-stem': 'var(--sage-deep)',
            '--p-leaf-1': 'var(--sage)',
            '--p-leaf-2': 'var(--sage-light)',
            '--p-flower': flowerHues[Math.floor(rng() * flowerHues.length)],
            '--p-flower-center': flowerCenter,
        };
    }
    if (type === 'fern' || type === 'bamboo') {
        return {
            '--p-stem': 'var(--sage-deep)',
            '--p-leaf-1': 'var(--sage)',
            '--p-leaf-2': 'var(--sage-light)',
            '--p-flower': flowerHues[0],
            '--p-flower-center': flowerCenter,
        };
    }
    if (type === 'bonsai') {
        return {
            '--p-stem': '#5C4632',
            '--p-leaf-1': ['var(--sage)', 'var(--sage-deep)', 'var(--sage-light)'][variant],
            '--p-leaf-2': 'var(--sage-light)',
            '--p-flower': flowerHues[0],
            '--p-flower-center': flowerCenter,
        };
    }
    if (type === 'pine') {
        return {
            '--p-stem': '#5C4632',
            '--p-leaf-1': 'var(--sage-deep)',
            '--p-leaf-2': 'var(--sage)',
            '--p-flower': flowerHues[0],
            '--p-flower-center': flowerCenter,
        };
    }
    return {
        '--p-stem': '#5C4632',
        '--p-leaf-1': '#C9663D',
        '--p-leaf-2': '#B8893A',
        '--p-flower': flowerHues[0],
        '--p-flower-center': flowerCenter,
    };
}

// ---------- Placement: Poisson-ish ----------
function findPosition(existing) {
    const MIN_DIST = 8;
    for (let attempt = 0; attempt < 40; attempt++) {
        const x = 8 + Math.random() * 84;
        const y = 30 + Math.random() * 60;
        const tooClose = existing.some(p => {
            const dx = p.x - x, dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < MIN_DIST;
        });
        if (!tooClose) return { x, y };
    }
    return { x: 10 + Math.random() * 80, y: 30 + Math.random() * 60 };
}

// ---------- The Garden controller ----------
export class Garden {
    constructor(container, store) {
        this.container = container;
        this.store = store;
        this.plants = [];
        this.empty = document.getElementById('gardenEmpty');
        this.countEl = document.getElementById('plantCount');

        on('session:complete', (payload) => {
            if (payload.kind === 'focus') {
                this.plantSeed(payload.duration, payload.completedAt);
            }
        });
    }

    async load() {
        const stored = await storage.get('garden');
        this.plants = stored?.plants || [];
        this.render();
    }

    async _persist() {
        await storage.set('garden', { plants: this.plants });
    }

    plantSeed(durationSec, timestamp) {
        const seed = Math.floor(Math.random() * 1e9);
        const rng = mulberry32(seed);
        const type = pickType(durationSec, rng);
        const pos = findPosition(this.plants);
        const baseScale = type === 'bamboo' || type === 'pine' || type === 'maple' ? 1.4 : 1.0;
        const depthScale = 0.7 + (pos.y / 90) * 0.5;
        const scale = baseScale * depthScale * (0.85 + rng() * 0.3);
        const plant = {
            id: `${timestamp}-${seed}`,
            type, seed, x: pos.x, y: pos.y, scale,
            planted: timestamp,
            duration: durationSec,
        };
        this.plants.push(plant);
        this.renderPlant(plant);
        this._updateCount();
        this._persist();
        emitEvent('garden:planted', plant);
    }

    renderPlant(plant) {
        const rng = mulberry32(plant.seed);
        const palette = paletteFor(plant.type, rng);
        const innerSvg = PLANTS[plant.type](rng);

        const el = document.createElement('div');
        el.className = 'plant';
        el.dataset.type = plant.type;
        el.style.left = `${plant.x}%`;
        el.style.top  = `${plant.y}%`;
        el.style.zIndex = Math.round(plant.y);
        Object.entries(palette).forEach(([k, v]) => el.style.setProperty(k, v));

        const size = 100 * plant.scale;
        el.innerHTML = `
            <svg viewBox="0 0 60 100" width="${size * 0.6}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                ${innerSvg}
            </svg>
        `;
        el.title = `${plant.type[0].toUpperCase() + plant.type.slice(1)} · planted ${formatRelative(plant.planted)} · ${Math.round(plant.duration / 60)} min session`;
        this.container.appendChild(el);
    }

    render() {
        this.container.innerHTML = '';
        const sorted = [...this.plants].sort((a, b) => a.y - b.y);
        sorted.forEach(p => this.renderPlant(p));
        this._updateCount();
    }

    _updateCount() {
        if (this.countEl) this.countEl.textContent = this.plants.length;
        if (this.empty) this.empty.hidden = this.plants.length > 0;
    }

    async wipe() {
        this.plants = [];
        this.render();
        await this._persist();
    }
}

function formatRelative(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}