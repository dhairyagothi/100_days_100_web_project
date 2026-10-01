const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: -1000, y: -1000, radius: 200 };
let constellationMode = false;
let trailsEnabled = true;
let fps = 60;
let frameCount = 0;
let lastTime = performance.now();

// Function to strictly set canvas size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Particle Types
const PARTICLE_TYPES = {
    FAST: 'fast',
    SLOW: 'slow',
    LARGE: 'large',
    SMALL: 'small'
};

class Particle {
    constructor(x, y, type = null) {
        // Assign random type if not specified
        this.type = type || this.getRandomType();
        this.init(x, y);
        this.trail = [];
        this.maxTrail = 20;
        
        // Breathing animation properties
        this.breathPhase = Math.random() * Math.PI * 2;
        this.breathSpeed = 0.02 + Math.random() * 0.03;
        this.baseSize = this.size;
    }
    
    getRandomType() {
        const types = Object.values(PARTICLE_TYPES);
        // Weighted random - more common types
        const weights = [0.35, 0.35, 0.15, 0.15]; // FAST, SLOW, LARGE, SMALL
        let rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (rand <= cumulative) {
                return types[i];
            }
        }
        return types[0];
    }
    
    init(x, y) {
        // Position
        if (x !== undefined && y !== undefined) {
            this.x = x;
            this.y = y;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
        
        // Size based on type
        switch(this.type) {
            case PARTICLE_TYPES.LARGE:
                this.size = Math.random() * 2.5 + 2;
                break;
            case PARTICLE_TYPES.SMALL:
                this.size = Math.random() * 0.5 + 0.3;
                break;
            case PARTICLE_TYPES.FAST:
                this.size = Math.random() * 1.5 + 0.5;
                break;
            case PARTICLE_TYPES.SLOW:
                this.size = Math.random() * 1.5 + 0.5;
                break;
            default:
                this.size = Math.random() * 1.5 + 0.5;
        }
        
        this.baseSize = this.size;
        
        // Velocity based on type
        switch(this.type) {
            case PARTICLE_TYPES.FAST:
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                break;
            case PARTICLE_TYPES.SLOW:
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                break;
            default:
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
        }
        
        // Color based on type
        switch(this.type) {
            case PARTICLE_TYPES.FAST:
                this.hue = Math.random() * 30 + 180; // Cyan-blue
                this.brightness = Math.random() * 30 + 70;
                break;
            case PARTICLE_TYPES.SLOW:
                this.hue = Math.random() * 30 + 210; // Blue-purple
                this.brightness = Math.random() * 20 + 60;
                break;
            case PARTICLE_TYPES.LARGE:
                this.hue = Math.random() * 30 + 150; // Green-cyan
                this.brightness = Math.random() * 30 + 70;
                break;
            case PARTICLE_TYPES.SMALL:
                this.hue = Math.random() * 30 + 240; // Purple-blue
                this.brightness = Math.random() * 30 + 80;
                break;
            default:
                this.hue = 190;
                this.brightness = 75;
        }
        
        this.alpha = 0.8 + Math.random() * 0.2;
        this.glowIntensity = 0.3 + Math.random() * 0.7;
    }
    
    update() {
        // Store trail position
        if (trailsEnabled) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
        }
        
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            // Different forces for different particle types
            let forceMultiplier = 0.2;
            switch(this.type) {
                case PARTICLE_TYPES.FAST:
                    forceMultiplier = 0.3;
                    break;
                case PARTICLE_TYPES.SLOW:
                    forceMultiplier = 0.1;
                    break;
                case PARTICLE_TYPES.LARGE:
                    forceMultiplier = 0.15;
                    break;
                case PARTICLE_TYPES.SMALL:
                    forceMultiplier = 0.25;
                    break;
            }
            this.vx += (dx / dist) * force * forceMultiplier;
            this.vy += (dy / dist) * force * forceMultiplier;
        }
        
        // Different friction for different types
        let friction = 0.96;
        switch(this.type) {
            case PARTICLE_TYPES.FAST:
                friction = 0.98;
                break;
            case PARTICLE_TYPES.SLOW:
                friction = 0.94;
                break;
            case PARTICLE_TYPES.LARGE:
                friction = 0.95;
                break;
            case PARTICLE_TYPES.SMALL:
                friction = 0.97;
                break;
        }
        
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        // Breathing animation
        this.breathPhase += this.breathSpeed;
        const breath = Math.sin(this.breathPhase) * 0.2 + 1;
        this.size = this.baseSize * breath;
    }
    
    draw() {
        // Draw trail
        if (trailsEnabled && this.trail.length > 1) {
            for (let i = 0; i < this.trail.length - 1; i++) {
                const alpha = (i / this.trail.length) * 0.5;
                const size = (i / this.trail.length) * this.size * 0.5;
                ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Glow effect
        ctx.shadowBlur = 20 * this.glowIntensity;
        ctx.shadowColor = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha * 0.5})`;
        
        // Draw particle
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Extra glow for large particles
        if (this.type === PARTICLE_TYPES.LARGE) {
            ctx.shadowBlur = 40;
            ctx.shadowColor = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.3)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
}

function drawLines() {
    if (!constellationMode) {
        // Original line drawing
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    // Different line colors based on particle types
                    const avgHue = (particles[i].hue + particles[j].hue) / 2;
                    ctx.strokeStyle = `hsla(${avgHue}, 100%, 70%, ${1 - dist/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    } else {
        // Constellation mode - connect based on velocity similarity
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                // Check velocity similarity
                let dvx = particles[i].vx - particles[j].vx;
                let dvy = particles[i].vy - particles[j].vy;
                let velDist = Math.sqrt(dvx*dvx + dvy*dvy);
                
                // Connect if close AND have similar velocity
                if (dist < 150 && velDist < 1) {
                    const avgHue = (particles[i].hue + particles[j].hue) / 2;
                    const alpha = (1 - dist/150) * (1 - velDist);
                    ctx.strokeStyle = `hsla(${avgHue}, 100%, 70%, ${alpha * 0.6})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}

function init() {
    particles = [];
    let count = Math.min(window.innerWidth / 8, 200);
    for(let i=0; i < count; i++) {
        particles.push(new Particle());
    }
    updateParticleCount();
}

function updateParticleCount() {
    document.getElementById('particleCount').textContent = 
        `PARTICLE COUNT: ${particles.length}`;
}

function spawnParticles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        const types = Object.values(PARTICLE_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        const p = new Particle(
            x + (Math.random() - 0.5) * 50,
            y + (Math.random() - 0.5) * 50,
            type
        );
        // Explosion effect
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        particles.push(p);
    }
    updateParticleCount();
}

function animate() {
    // Fade trail effect
    ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(p => { p.update(); p.draw(); });
    
    // Draw lines
    drawLines();
    
    // Update FPS
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime > 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        document.getElementById('fpsDisplay').textContent = `FPS: ${fps}`;
    }
    
    requestAnimationFrame(animate);
}

// Mouse events
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Click to spawn particles
canvas.addEventListener("click", (e) => {
    spawnParticles(e.clientX, e.clientY, 20);
});

// Touch events
window.addEventListener("touchmove", (e) => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchstart", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    // Spawn particles on touch
    if (e.touches.length === 1) {
        spawnParticles(e.touches[0].clientX, e.touches[0].clientY, 10);
    }
}, { passive: true });

window.addEventListener("touchend", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
    switch(e.key.toLowerCase()) {
        case 'c':
            constellationMode = !constellationMode;
            console.log(`Constellation mode: ${constellationMode ? 'ON' : 'OFF'}`);
            break;
        case 't':
            trailsEnabled = !trailsEnabled;
            console.log(`Trails: ${trailsEnabled ? 'ON' : 'OFF'}`);
            break;
        case 'r':
            init();
            console.log('Reset particles');
            break;
    }
});

// Initialize
init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    resize();
    // Keep particles within new bounds
    particles.forEach(p => {
        p.x = Math.min(p.x, canvas.width);
        p.y = Math.min(p.y, canvas.height);
    });
});

// Log controls
console.log('Controls:');
console.log('[C] - Toggle Constellation Mode');
console.log('[T] - Toggle Trails');
console.log('[R] - Reset Particles');
console.log('Click - Spawn particles at cursor');