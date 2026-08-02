/**
 * Interactive Physics Particle Simulator
 * Engine Code
 */

const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const gravitySlider = document.getElementById('gravity');
const gravityVal = document.getElementById('gravity-val');
const frictionSlider = document.getElementById('friction');
const frictionVal = document.getElementById('friction-val');
const restitutionSlider = document.getElementById('restitution');
const restitutionVal = document.getElementById('restitution-val');
const particleSizeSlider = document.getElementById('particle-size');
const particleSizeVal = document.getElementById('particle-size-val');
const collisionsCheckbox = document.getElementById('collisions');
const particleCountSpan = document.getElementById('particle-count');
const clearBtn = document.getElementById('clear-btn');

// Engine Settings
let settings = {
    gravity: parseFloat(gravitySlider.value),
    friction: parseFloat(frictionSlider.value),
    restitution: parseFloat(restitutionSlider.value), // Bounciness
    spawnSize: parseInt(particleSizeSlider.value),
    collisionsEnabled: collisionsCheckbox.checked,
    mouseRadius: 100 // Radius for mouse interaction
};

// State
let particles = [];
let mouse = {
    x: -1000,
    y: -1000,
    isDown: false
};

// --- Vector Math Utility ---
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    
    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }
    
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const m = this.mag();
        if (m !== 0) {
            return this.mult(1 / m);
        }
        return new Vector(0, 0);
    }
    
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}

// --- Particle Class ---
class Particle {
    constructor(x, y, radius) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(Math.random() * 4 - 2, Math.random() * -5 - 2); // Initial random burst
        this.acc = new Vector(0, 0);
        this.radius = radius;
        this.mass = radius; // Mass is proportional to size
        
        // Pick a random vibrant color
        const colors = ['#38bdf8', '#818cf8', '#a78bfa', '#e879f9', '#f472b6', '#fb7185', '#34d399', '#fcd34d'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    applyForce(force) {
        let f = force.mult(1 / this.mass);
        this.acc = this.acc.add(f);
    }
    
    update() {
        // Apply Gravity
        this.vel.y += settings.gravity;
        
        // Apply Friction (Air resistance)
        this.vel = this.vel.mult(settings.friction);
        
        // Update Position
        this.pos = this.pos.add(this.vel);
        
        // Reset acceleration
        this.acc = new Vector(0, 0);
        
        this.checkEdges();
    }
    
    checkEdges() {
        // Floor
        if (this.pos.y > canvas.height - this.radius) {
            this.pos.y = canvas.height - this.radius;
            this.vel.y *= -settings.restitution;
        }
        // Ceiling
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -settings.restitution;
        }
        // Right Wall
        if (this.pos.x > canvas.width - this.radius) {
            this.pos.x = canvas.width - this.radius;
            this.vel.x *= -settings.restitution;
        }
        // Left Wall
        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -settings.restitution;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        
        // Add a nice glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
    }
}

// --- Engine Functions ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function resolveCollision(p1, p2) {
    const xVelocityDiff = p1.vel.x - p2.vel.x;
    const yVelocityDiff = p1.vel.y - p2.vel.y;

    const xDist = p2.pos.x - p1.pos.x;
    const yDist = p2.pos.y - p1.pos.y;

    // Prevent accidental overlap from sticking
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        
        // Angle between the two particles
        const angle = -Math.atan2(p2.pos.y - p1.pos.y, p2.pos.x - p1.pos.x);

        // Masses
        const m1 = p1.mass;
        const m2 = p2.mass;

        // Velocity vectors rotated to 1D collision
        const u1 = rotate(p1.vel, angle);
        const u2 = rotate(p2.vel, angle);

        // 1D Elastic collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        // Final velocity rotated back
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Apply restitution (bounciness) and swap velocities
        p1.vel.x = vFinal1.x * settings.restitution;
        p1.vel.y = vFinal1.y * settings.restitution;
        p2.vel.x = vFinal2.x * settings.restitution;
        p2.vel.y = vFinal2.y * settings.restitution;
    }
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkParticleCollisions() {
    if (!settings.collisionsEnabled) return;
    
    // O(N^2) collision check - spatial hashing could optimize this for large numbers
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = distance(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
            
            if (dist - (p1.radius + p2.radius) < 0) {
                resolveCollision(p1, p2);
                
                // Separate them slightly to prevent sticking
                const overlap = (p1.radius + p2.radius) - dist;
                const angle = Math.atan2(p2.pos.y - p1.pos.y, p2.pos.x - p1.pos.x);
                
                // Move them apart evenly based on mass
                const moveDist = overlap / 2;
                p1.pos.x -= Math.cos(angle) * moveDist;
                p1.pos.y -= Math.sin(angle) * moveDist;
                p2.pos.x += Math.cos(angle) * moveDist;
                p2.pos.y += Math.sin(angle) * moveDist;
            }
        }
    }
}

function spawnParticle(x, y) {
    // Add random variance to spawn size
    const sizeVariance = Math.random() * 10 - 5; 
    let finalSize = settings.spawnSize + sizeVariance;
    if (finalSize < 3) finalSize = 3;
    
    particles.push(new Particle(x, y, finalSize));
    particleCountSpan.innerText = particles.length;
}

// --- Main Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    // Clear canvas with a slight trail effect (alpha < 1)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mouse Interaction (repel particles)
    if (mouse.isDown) {
        spawnParticle(mouse.x, mouse.y);
    }
    
    checkParticleCollisions();
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
    }
}

// --- Event Listeners ---
window.addEventListener('resize', resize);

canvas.addEventListener('mousedown', (e) => {
    mouse.isDown = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    spawnParticle(mouse.x, mouse.y);
});

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('mouseup', () => {
    mouse.isDown = false;
});

canvas.addEventListener('touchstart', (e) => {
    mouse.isDown = true;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    spawnParticle(mouse.x, mouse.y);
});

canvas.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
    mouse.isDown = false;
});

// UI Listeners
gravitySlider.addEventListener('input', (e) => {
    settings.gravity = parseFloat(e.target.value);
    gravityVal.innerText = settings.gravity.toFixed(1);
});

frictionSlider.addEventListener('input', (e) => {
    settings.friction = parseFloat(e.target.value);
    frictionVal.innerText = settings.friction.toFixed(2);
});

restitutionSlider.addEventListener('input', (e) => {
    settings.restitution = parseFloat(e.target.value);
    restitutionVal.innerText = settings.restitution.toFixed(2);
});

particleSizeSlider.addEventListener('input', (e) => {
    settings.spawnSize = parseInt(e.target.value);
    particleSizeVal.innerText = settings.spawnSize;
});

collisionsCheckbox.addEventListener('change', (e) => {
    settings.collisionsEnabled = e.target.checked;
});

clearBtn.addEventListener('click', () => {
    particles = [];
    particleCountSpan.innerText = '0';
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// --- Initialization ---
resize();
animate();

// Spawn some initial particles to show the simulation working
for (let i = 0; i < 20; i++) {
    spawnParticle(window.innerWidth / 2 + (Math.random() * 200 - 100), window.innerHeight / 4 + (Math.random() * 100 - 50));
}
