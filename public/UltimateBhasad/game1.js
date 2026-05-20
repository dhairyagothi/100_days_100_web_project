

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const TWO_PI = Math.PI * 2;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==========================================
// 1. UTILITIES & MATH
// ==========================================
const Utils = {
    random: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Utils.random(min, max)),
    dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)
};

const hitPhrases = ["BHAINKAAR!", "KHATARNAAK!", "PEL DIYA!", "KHEL KHATAM!", "GHAZAB!", "SWAD AA GAYA!", "MAMLA GARAM!"];
const bossPhrases = ["MAHA-BHASAD AI HAS AWOKEN!", "BAPU AAGAYA!", "SYSTEM HANG!"];

// ==========================================
// 2. PROCEDURAL AUDIO & MUSIC ENGINE
// ==========================================
const Audio = (() => {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    let bgmInterval = null;
    let noteIndex = 0;
    const sequence = [65.41, 65.41, 0, 77.78, 65.41, 0, 98.00, 87.31, 65.41, 65.41, 0, 130.81, 0, 116.54, 98.00, 0]; 

    return {
        init: () => { if (actx.state === 'suspended') actx.resume(); },
        playSFX: (type) => {
            if (actx.state === 'suspended') return;
            const now = actx.currentTime;
            
            if (type === 'shoot') {
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.connect(gain); gain.connect(actx.destination);
                osc.start(now); osc.stop(now + 0.1);
            } 
            else if (type === 'hit' || type === 'boom' || type === 'boss_boom') {
                const dur = type === 'boss_boom' ? 1.5 : (type === 'boom' ? 0.6 : 0.15);
                const bufSize = actx.sampleRate * dur;
                const buffer = actx.createBuffer(1, bufSize, actx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() - 0.5) * 2.0;
                
                const noise = actx.createBufferSource(); noise.buffer = buffer;
                const gain = actx.createGain(); const filter = actx.createBiquadFilter();
                
                filter.type = 'lowpass'; 
                filter.frequency.value = type.includes('boom') ? 800 : 3000;
                gain.gain.setValueAtTime(type.includes('boom') ? 0.6 : 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
                
                noise.connect(filter); filter.connect(gain); gain.connect(actx.destination);
                noise.start(now);
            } 
            else if (type === 'powerup') {
                const osc = actx.createOscillator(); const gain = actx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
                gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.connect(gain); gain.connect(actx.destination);
                osc.start(now); osc.stop(now + 0.3);
            } 
            else if (type === 'laugh') {
                for (let i = 0; i < 7; i++) {
                    let t = now + i * 0.35;
                    let osc1 = actx.createOscillator(), osc2 = actx.createOscillator();
                    let gain = actx.createGain(), filter = actx.createBiquadFilter();
                    let freq = 130 - (i * 12); 
                    
                    osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(freq, t); osc1.frequency.exponentialRampToValueAtTime(freq - 20, t + 0.3);
                    osc2.type = 'square'; osc2.frequency.setValueAtTime(freq / 2, t); 
                    filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, t);
                    
                    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.8, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
                    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(actx.destination);
                    osc1.start(t); osc2.start(t); osc1.stop(t + 0.3); osc2.stop(t + 0.3);
                }
            }
            else if (type === 'boss_spawn') {
                const osc = actx.createOscillator(); const gain = actx.createGain();
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(50, now);
                osc.frequency.linearRampToValueAtTime(200, now + 2);
                gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
                osc.connect(gain); gain.connect(actx.destination);
                osc.start(now); osc.stop(now + 2);
            }
        },
        startBGM: () => {
            if (bgmInterval) return;
            bgmInterval = setInterval(() => {
                let freq = sequence[noteIndex];
                if (freq > 0) {
                    const now = actx.currentTime;
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    const filter = actx.createBiquadFilter();
                    
                    osc.type = 'sawtooth'; osc.frequency.value = freq;
                    filter.type = 'lowpass'; filter.frequency.setValueAtTime(400, now); filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
                    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    
                    osc.connect(filter); filter.connect(gain); gain.connect(actx.destination);
                    osc.start(now); osc.stop(now + 0.15);
                }
                noteIndex = (noteIndex + 1) % sequence.length;
            }, 125); 
        },
        stopBGM: () => { clearInterval(bgmInterval); bgmInterval = null; }
    };
})();

// ==========================================
// 3. INPUT MANAGER (WITH MOUSE TRACKING)
// ==========================================
const Input = {
    keys: {},
    mouseX: canvas.width / 2,
    mouseY: canvas.height / 2,
    isMouseDown: false,
    init: () => {
        window.addEventListener('keydown', (e) => Input.keys[e.code] = true);
        window.addEventListener('keyup', (e) => Input.keys[e.code] = false);
        
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            Input.mouseX = e.clientX;
            Input.mouseY = e.clientY;
        });
        
        // Track mouse clicks for shooting
        window.addEventListener('mousedown', (e) => { if (e.button === 0) Input.isMouseDown = true; });
        window.addEventListener('mouseup', (e) => { if (e.button === 0) Input.isMouseDown = false; });
    },
    isDown: (codes) => Array.isArray(codes) ? codes.some(c => Input.keys[c]) : Input.keys[codes]
};
Input.init();

// ==========================================
// 4. VFX & PARTICLE SYSTEM
// ==========================================
class Particle {
    constructor(x, y, color, angle, speed, life, size = 4) {
        this.x = x; this.y = y; this.color = color;
        this.life = life; this.maxLife = life;
        this.dx = Math.cos(angle) * speed; this.dy = Math.sin(angle) * speed;
        this.size = size; this.friction = 0.95;
    }
    update() {
        this.x += this.dx; this.y += this.dy;
        this.dx *= this.friction; this.dy *= this.friction;
        this.life--;
    }
    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color; ctx.globalCompositeOperation = 'lighter';
        let s = (this.life / this.maxLife) * this.size;
        ctx.beginPath(); ctx.arc(this.x, this.y, s, 0, TWO_PI); ctx.fill();
        ctx.globalAlpha = 1.0; ctx.globalCompositeOperation = 'source-over';
    }
}

class Shockwave {
    constructor(x, y, color, maxRadius) {
        this.x = x; this.y = y; this.color = color;
        this.radius = 1; this.maxRadius = maxRadius; this.thickness = 10;
    }
    update() { this.radius += 8; this.thickness *= 0.9; }
    draw(ctx) {
        if (this.radius >= this.maxRadius) return;
        ctx.globalAlpha = Math.max(0, 1 - (this.radius / this.maxRadius));
        ctx.strokeStyle = this.color; ctx.lineWidth = this.thickness;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, TWO_PI); ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

class FloatingText {
    constructor(x, y, text, color, isCrit = false) {
        this.x = x; this.y = y; this.text = text; this.color = color;
        this.life = isCrit ? 90 : 60; this.dy = isCrit ? -3 : -1.5;
        this.font = isCrit ? 'italic bold 36px Impact' : 'bold 22px Arial';
    }
    update() { this.y += this.dy; this.life--; }
    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life / 60);
        ctx.fillStyle = this.color; ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y); ctx.globalAlpha = 1.0;
    }
}

const VFX = {
    particles: [], shockwaves: [], texts: [],
    addBurst: (x, y, color, count, speedMax = 10, size = 4) => {
        if (VFX.particles.length > 1000) return;
        for (let i = 0; i < count; i++) VFX.particles.push(new Particle(x, y, color, Utils.random(0, TWO_PI), Utils.random(2, speedMax), Utils.randomInt(30, 60), size));
    },
    addShockwave: (x, y, color, size) => VFX.shockwaves.push(new Shockwave(x, y, color, size)),
    addText: (x, y, txt, col, crit = false) => VFX.texts.push(new FloatingText(x, y, txt, col, crit)),
    update: () => {
        for (let i = VFX.particles.length - 1; i >= 0; i--) { VFX.particles[i].update(); if (VFX.particles[i].life <= 0) VFX.particles.splice(i, 1); }
        for (let i = VFX.shockwaves.length - 1; i >= 0; i--) { VFX.shockwaves[i].update(); if (VFX.shockwaves[i].radius >= VFX.shockwaves[i].maxRadius) VFX.shockwaves.splice(i, 1); }
        for (let i = VFX.texts.length - 1; i >= 0; i--) { VFX.texts[i].update(); if (VFX.texts[i].life <= 0) VFX.texts.splice(i, 1); }
    },
    draw: (ctx) => {
        VFX.particles.forEach(p => p.draw(ctx)); VFX.shockwaves.forEach(s => s.draw(ctx)); VFX.texts.forEach(t => t.draw(ctx));
    }
};

// ==========================================
// 5. BACKGROUND
// ==========================================
class Background {
    constructor() {
        this.stars = Array.from({length: 300}, () => ({
            x: Utils.random(0, canvas.width), y: Utils.random(0, canvas.height),
            z: Utils.random(0.2, 2.5), color: `hsl(${Utils.randomInt(200, 300)}, 80%, 70%)`
        }));
        this.offset = 0;
    }
    draw(ctx, speedMult) {
        this.offset += 1 * speedMult;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)'; ctx.lineWidth = 2; ctx.beginPath();
        const gridSize = 100;
        for(let x = (this.offset % gridSize) - gridSize; x < canvas.width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
        for(let y = (this.offset % gridSize) - gridSize; y < canvas.height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
        ctx.stroke();

        this.stars.forEach(s => {
            s.x -= s.z * speedMult;
            if (s.x < 0) { s.x = canvas.width; s.y = Utils.random(0, canvas.height); }
            ctx.fillStyle = s.color; ctx.globalAlpha = s.z / 2.5;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.z, 0, TWO_PI); ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    }
}

// ==========================================
// 6. GAME ENTITIES & BUFFS
// ==========================================
const BuffInfo = {
    HEALTH: { c: '#32FF64', t: 'REPAIR +30', dur: 0 }, RAPID: { c: '#FF9600', t: 'OVERDRIVE', dur: 5000 },
    SHIELD: { c: '#00FFFF', t: 'AEGIS SHIELD', dur: 6000 }, SPEED: { c: '#FFFF00', t: 'NITRO BOOST', dur: 5000 },
    GHOST: { c: '#B4B4FF', t: 'PHANTOM CLOAK', dur: 5000 }, FREEZE: { c: '#0064FF', t: 'CRYOGENIC STASIS', dur: 4000 },
    EMP: { c: '#FFFFFF', t: 'EMP BLAST', dur: 0 }, VAMP: { c: '#FF0032', t: 'VAMPIRE PROTOCOL', dur: 6000 },
    SCATTER: { c: '#FF00FF', t: 'SCATTER SHOT', dur: 5000 }, PIERCE: { c: '#64FF64', t: 'RAILGUN AMMO', dur: 5000 },
    REVERSE: { c: '#FF6464', t: 'NEURO-HACK', dur: 4000 }, TELEPORT: { c: '#C800FF', t: 'QUANTUM SHIFT', dur: 0 },
    SHRINK: { c: '#64FFC8', t: 'MICRO-TECH', dur: 6000 }, NUKE: { c: '#FF3200', t: 'ORBITAL STRIKE', dur: 0 },
    GIANT: { c: '#C86432', t: 'JUGGERNAUT', dur: 6000 }, LASER: { c: '#00FF64', t: 'PLASMA BEAM', dur: 4000 }
};

class Entity {
    constructor(x, y, radius, color) {
        this.x = x; this.y = y; this.radius = radius; this.color = color;
        this.dx = 0; this.dy = 0; this.active = true;
    }
    update() { this.x += this.dx; this.y += this.dy; }
    dist(other) { return Utils.dist(this.x, this.y, other.x, other.y); }
    collide(other) { return this.dist(other) < this.radius + other.radius; }
}

class Player extends Entity {
    constructor(x, y, color, controls) {
        super(x, y, 30, color);
        this.baseRadius = 30; this.controls = controls;
        this.health = 100; this.maxHealth = 100; this.score = 0; this.combo = 0;
        this.buffs = {}; this.lastShot = 0; this.hitFlash = 0;
        this.baseSpeed = 6.0;
        this.angle = 0; // Tracks mouse aiming angle
    }
    hasBuff(k) { return this.buffs[k] && Date.now() < this.buffs[k]; }
    applyDamage(amt, isCrit = false) {
        if (this.hasBuff('SHIELD')) { VFX.addText(this.x, this.y - 40, "ABSORBED!", '#00FFFF'); return; }
        if (this.hasBuff('GHOST')) { VFX.addText(this.x, this.y - 40, "EVADED!", '#B4B4FF'); return; }
        this.health -= amt; this.hitFlash = 15;
        Game.shake(isCrit ? 8 : 3, isCrit ? 5 : 2);
        VFX.addBurst(this.x, this.y, this.color, 15);
        VFX.addText(this.x, this.y - 50, `-${amt}`, '#FF0000', isCrit);
        Audio.playSFX('hit');
    }
    update(now) {
        if (this.health <= 0) return;
        if (this.hitFlash > 0) this.hitFlash--;
        this.radius = this.hasBuff('SHRINK') ? 15 : this.hasBuff('GIANT') ? 45 : this.baseRadius;
        
        // Dynamic aiming angle to mouse cursor
        this.angle = Utils.angle(this.x, this.y, Input.mouseX, Input.mouseY);

        let spd = this.baseSpeed * (this.hasBuff('SPEED') ? 1.8 : 1) * (this.hasBuff('FREEZE') ? 0.3 : 1) * (this.hasBuff('GIANT') ? 0.6 : 1);
        let rev = this.hasBuff('REVERSE');
        let up = Input.isDown(rev ? this.controls.d : this.controls.u);
        let dn = Input.isDown(rev ? this.controls.u : this.controls.d);
        let lf = Input.isDown(rev ? this.controls.r : this.controls.l);
        let rt = Input.isDown(rev ? this.controls.l : this.controls.r);
        
        if (up) this.y -= spd; if (dn) this.y += spd; if (lf) this.x -= spd; if (rt) this.x += spd;
        
        this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius));

        if ((up || dn || lf || rt) && Math.random() > 0.3) {
            // Engine thrust particle effect drops off opposite to moving direction
            let moveAng = Utils.angle(0, 0, (rt?1:0)-(lf?1:0), (dn?1:0)-(up?1:0));
            VFX.particles.push(new Particle(this.x, this.y, this.color, moveAng + Math.PI, 5, 20, 3));
        }

        let cd = this.hasBuff('LASER') ? 40 : this.hasBuff('RAPID') ? 80 : 200;
        
        // Shoot with Left Click OR Keyboard Space
        if ((Input.isMouseDown || Input.isDown(this.controls.s)) && now - this.lastShot >= cd) {
            let bSpd = this.hasBuff('LASER') ? 40 : 25;
            let bCol = this.hasBuff('VAMP') ? '#FF0032' : this.color;
            let bSz = this.hasBuff('GIANT') ? 16 : 8;
            let prc = this.hasBuff('PIERCE');

            if (this.hasBuff('SCATTER')) {
                // Shoot a shotgun spread towards the mouse
                Game.bullets.push(new Bullet(this, this.x, this.y, Math.cos(this.angle)*bSpd, Math.sin(this.angle)*bSpd, bCol, prc, bSz));
                Game.bullets.push(new Bullet(this, this.x, this.y, Math.cos(this.angle - 0.2)*bSpd, Math.sin(this.angle - 0.2)*bSpd, bCol, prc, bSz));
                Game.bullets.push(new Bullet(this, this.x, this.y, Math.cos(this.angle + 0.2)*bSpd, Math.sin(this.angle + 0.2)*bSpd, bCol, prc, bSz));
            } else {
                // Shoot straight towards mouse
                Game.bullets.push(new Bullet(this, this.x, this.y, Math.cos(this.angle)*bSpd, Math.sin(this.angle)*bSpd, bCol, prc, bSz));
            }
            Audio.playSFX('shoot'); this.lastShot = now;
        }
    }
    draw(ctx) {
        if (this.health <= 0) return;
        ctx.save(); ctx.translate(this.x, this.y);
        
        // Ship rotates to point directly at mouse cursor
        ctx.rotate(this.angle);
        
        let sc = this.radius / this.baseRadius; ctx.scale(sc, sc);

        if (this.hasBuff('SHIELD')) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, TWO_PI); ctx.fill();
            ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.stroke();
        }
        if (this.hasBuff('FREEZE')) { ctx.fillStyle = 'rgba(0, 100, 255, 0.4)'; ctx.fillRect(-35, -35, 70, 70); }

        // The ship's nose is drawn at the (30, 0) point
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-15, 25); ctx.lineTo(-5, 0); ctx.lineTo(-15, -25); ctx.closePath();
        ctx.fillStyle = this.hitFlash > 0 ? '#FFFFFF' : this.color;
        
        if (this.hasBuff('GHOST')) ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 20; ctx.shadowColor = this.color; ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = this.hasBuff('VAMP') ? '#FF0000' : '#FFFFFF'; ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
    }
}

class Bullet extends Entity {
    constructor(owner, x, y, dx, dy, color, pierce, size) {
        super(x, y, size, color);
        this.owner = owner; this.dx = dx; this.dy = dy; this.pierce = pierce;
    }
    draw(ctx) {
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.ellipse(this.x, this.y, this.radius * 2, this.radius, 0, 0, TWO_PI); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius / 2, 0, TWO_PI); ctx.fill();
    }
}

class Drone extends Entity {
    constructor(x, y) {
        super(x, y, 20, '#FF0064');
        this.hp = 2; this.rotation = Utils.random(0, TWO_PI);
        this.dx = Utils.random(-4, 4); this.dy = Utils.random(-4, 4);
        this.shape = Utils.randomInt(0, 3);
        this.oscOffset = Utils.random(0, TWO_PI);
    }
    update(now) {
        super.update(); this.rotation += 0.05;
        this.radius = 20 + Math.sin(now * 0.005 + this.oscOffset) * 5;
        if (this.x < 30 || this.x > canvas.width - 30) this.dx *= -1;
        if (this.y < 30 || this.y > canvas.height - 30) this.dy *= -1;
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        let s = this.radius / 20; ctx.scale(s, s);
        ctx.fillStyle = 'rgba(255, 0, 100, 0.8)'; ctx.strokeStyle = '#FFFF00'; ctx.lineWidth = 3;
        ctx.beginPath();
        if (this.shape === 0) { ctx.moveTo(0, -20); ctx.lineTo(20, 0); ctx.lineTo(0, 20); ctx.lineTo(-20, 0); }
        else if (this.shape === 1) { ctx.moveTo(0, -22); ctx.lineTo(20, 15); ctx.lineTo(-20, 15); }
        else { for (let i = 0; i < 6; i++) { let a = (Math.PI/3)*i; i===0 ? ctx.moveTo(20*Math.cos(a), 20*Math.sin(a)) : ctx.lineTo(20*Math.cos(a), 20*Math.sin(a)); } }
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
}

class Asteroid extends Entity {
    constructor() {
        super(Utils.random(100, canvas.width-100), -50, Utils.random(30, 70), '#777777');
        this.dx = Utils.random(-2, 2); this.dy = Utils.random(1, 4);
        this.rotation = 0; this.rotSpd = Utils.random(-0.02, 0.02);
        this.verts = [];
        let points = Utils.randomInt(5, 9);
        for(let i=0; i<points; i++) {
            let a = (TWO_PI / points) * i;
            let r = this.radius * Utils.random(0.7, 1.1);
            this.verts.push({x: r*Math.cos(a), y: r*Math.sin(a)});
        }
    }
    update() { super.update(); this.rotation += this.rotSpd; if(this.y > canvas.height + 100) this.active = false; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        ctx.fillStyle = '#222222'; ctx.strokeStyle = this.color; ctx.lineWidth = 4;
        ctx.beginPath(); this.verts.forEach((v, i) => i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y));
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
}

class Boss extends Entity {
    constructor() {
        super(canvas.width/2, -100, 80, '#FF0000');
        this.hp = 300; this.maxHp = 300; this.phase = 0;
        this.targetY = canvas.height / 4;
        this.lastAttack = Date.now();
        this.theta = 0;
        Audio.playSFX('boss_spawn');
        VFX.addText(canvas.width/2, canvas.height/2, bossPhrases[Utils.randomInt(0, bossPhrases.length)], '#FF0000', true);
    }
    update(now) {
        if (this.y < this.targetY) this.y += 2;
        this.x = canvas.width/2 + Math.sin(this.theta) * 300;
        this.theta += 0.01;

        if (now - this.lastAttack > 2500) { 
            this.attack();
            this.lastAttack = now;
        }
    }
    attack() {
        Audio.playSFX('shoot');
        for (let i = 0; i < 12; i++) {
            let angle = (TWO_PI / 12) * i;
            Game.bullets.push(new Bullet({isBoss:true}, this.x, this.y, Math.cos(angle)*6, Math.sin(angle)*6, '#FF00FF', false, 12));
        }
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.shadowBlur = 30; ctx.shadowColor = '#FF0000';
        ctx.fillStyle = '#220000'; ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 5;
        
        ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(60, 0); ctx.lineTo(0, 60); ctx.lineTo(-60, 0); ctx.closePath(); 
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath(); ctx.arc(0, 0, 20 + Math.sin(this.theta*10)*5, 0, TWO_PI); ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(canvas.width/2 - 250, 40, 500, 30);
        ctx.fillStyle = '#FF0000'; ctx.fillRect(canvas.width/2 - 250, 40, (this.hp/this.maxHp)*500, 30);
        ctx.strokeStyle = '#FFF'; ctx.strokeRect(canvas.width/2 - 250, 40, 500, 30);
        ctx.fillStyle = '#FFF'; ctx.font = '24px Impact'; ctx.textAlign = 'center';
        ctx.fillText(`MAHA-BHASAD AI : ${this.hp} HP`, canvas.width/2, 65);
    }
}

class PowerUp extends Entity {
    constructor(x, y, typeKey) {
        super(x, y, 20, BuffInfo[typeKey].c);
        this.type = typeKey; this.life = 600; this.anim = 0;
    }
    update() { this.anim += 0.1; this.life--; if(this.life <= 0) this.active = false; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);
        let sc = 1.0 + Math.sin(this.anim) * 0.2; ctx.scale(sc, sc);
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(18, 0); ctx.lineTo(0, 18); ctx.lineTo(-18, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.life/100)})`; ctx.beginPath(); ctx.arc(0,0,6,0,TWO_PI); ctx.fill();
        ctx.restore();
    }
}

// ==========================================
// 7. CORE GAME ENGINE
// ==========================================
const Game = {
    state: 'MENU', winnerText: '',
    p1: null, boss: null,
    bullets: [], drones: [], powerups: [], asteroids: [],
    bg: new Background(),
    shakeTime: 0, shakeMag: 0,
    droneTimer: 0, asteroidTimer: 0, startTime: 0,

    init: () => {
        Game.p1 = new Player(canvas.width/2, canvas.height/2 + 200, '#00FFFF', {u:['KeyW', 'ArrowUp'], d:['KeyS', 'ArrowDown'], l:['KeyA', 'ArrowLeft'], r:['KeyD', 'ArrowRight'], s:['Space']});
        
        Game.bullets = []; Game.drones = []; Game.powerups = []; Game.asteroids = []; Game.boss = null;
        VFX.particles = []; VFX.shockwaves = []; VFX.texts = [];
        Game.startTime = Date.now();
        Game.state = 'PLAY';
        Audio.startBGM();
    },

    shake: (time, mag) => { Game.shakeTime = time; Game.shakeMag = mag; },

    applyBuffLogic: (buffKey) => {
        let bInfo = BuffInfo[buffKey]; let now = Date.now();

        if (buffKey === 'HEALTH') Game.p1.health = Math.min(Game.p1.maxHealth, Game.p1.health + 30);
        else if (buffKey === 'EMP') { 
            Game.bullets = Game.bullets.filter(b => b.owner === Game.p1); 
            Game.shake(10, 8); VFX.addShockwave(Game.p1.x, Game.p1.y, '#FFFFFF', canvas.width); Audio.playSFX('boom');
        }
        else if (buffKey === 'NUKE') {
            Game.drones.forEach(d => { VFX.addBurst(d.x, d.y, '#FF5500', 30); Game.p1.score += 50; });
            Game.drones = []; 
            if(Game.boss) Game.boss.hp -= 50; 
            Game.shake(20, 15);
            VFX.addShockwave(canvas.width/2, canvas.height/2, '#FF3200', canvas.width); Audio.playSFX('boom');
        }
        else Game.p1.buffs[buffKey] = now + bInfo.dur; 
        
        VFX.addBurst(Game.p1.x, Game.p1.y, bInfo.c, 40);
        VFX.addText(Game.p1.x, Game.p1.y - 60, bInfo.t, bInfo.c);
        Audio.playSFX('powerup');
    },

    updateCollisions: () => {
        for (let i = Game.bullets.length - 1; i >= 0; i--) {
            let b = Game.bullets[i]; let hit = false;
            
            if (!hit && Game.boss && b.owner === Game.p1 && b.collide(Game.boss)) {
                Game.boss.hp -= b.radius > 8 ? 10 : 4; VFX.addBurst(b.x, b.y, '#FFFF00', 10); hit = true;
                if(Game.boss.hp <= 0) {
                    VFX.addShockwave(Game.boss.x, Game.boss.y, '#FF0000', 1000);
                    Audio.playSFX('boss_boom'); Game.shake(30, 20); Game.boss = null; Game.p1.score += 1000;
                }
            }
            if (!hit && b.owner.isBoss && Game.p1.health > 0 && b.collide(Game.p1)) { Game.p1.applyDamage(15); hit = true; }

            if (!hit && b.owner === Game.p1) {
                for (let j = Game.drones.length - 1; j >= 0; j--) {
                    if (b.collide(Game.drones[j])) {
                        Game.drones[j].hp--;
                        if (Game.drones[j].hp <= 0) {
                            VFX.addBurst(Game.drones[j].x, Game.drones[j].y, '#FFA500', 30); Audio.playSFX('boom');
                            let keys = Object.keys(BuffInfo);
                            Game.powerups.push(new PowerUp(Game.drones[j].x, Game.drones[j].y, keys[Utils.randomInt(0, keys.length)]));
                            Game.drones.splice(j, 1); Game.p1.score += 10; Game.p1.combo++;
                        }
                        hit = true; break;
                    }
                }
            }
            
            if (!hit) { for (let a of Game.asteroids) { if (b.collide(a)) { VFX.addBurst(b.x, b.y, '#777', 10); hit = true; break; } } }
            if (hit && !b.pierce) b.active = false;
        }

        for (let i = Game.drones.length - 1; i >= 0; i--) {
            if (Game.p1.health > 0 && Game.drones[i].collide(Game.p1)) {
                Game.p1.applyDamage(15, true); VFX.addBurst(Game.drones[i].x, Game.drones[i].y, '#F50', 40);
                Audio.playSFX('boom'); Game.drones[i].active = false;
            }
        }

        for (let i = Game.powerups.length - 1; i >= 0; i--) {
            if (Game.p1.health > 0 && Game.powerups[i].collide(Game.p1)) { 
                Game.applyBuffLogic(Game.powerups[i].type); Game.powerups[i].active = false; 
            }
        }

        Game.asteroids.forEach(a => {
            if(Game.p1.health > 0 && a.collide(Game.p1)) {
                Game.p1.applyDamage(20, true); VFX.addBurst(Game.p1.x, Game.p1.y, '#777', 30);
                let ang = Utils.angle(a.x, a.y, Game.p1.x, Game.p1.y);
                Game.p1.x += Math.cos(ang) * 50; Game.p1.y += Math.sin(ang) * 50;
            }
        });
    },

    update: () => {
        const now = Date.now();
        if (Game.shakeTime > 0) Game.shakeTime--;

        Game.p1.update(now); 
        if (Game.boss) Game.boss.update(now);

        Game.droneTimer++;
        if (Game.droneTimer > 150 && Game.drones.length < 5) {
            Game.drones.push(new Drone(Utils.random(50, canvas.width-50), Utils.random(50, canvas.height/2)));
            Game.droneTimer = 0;
        }
        Game.asteroidTimer++;
        if (Game.asteroidTimer > 350) { Game.asteroids.push(new Asteroid()); Game.asteroidTimer = 0; }
        
        if (!Game.boss && now - Game.startTime > 30000 && Math.random() < 0.001) { Game.boss = new Boss(); Game.startTime = now; }

        Game.bullets.forEach(b => b.update()); Game.bullets = Game.bullets.filter(b => b.active && b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height);
        Game.drones.forEach(d => d.update(now)); Game.drones = Game.drones.filter(d => d.active);
        Game.powerups.forEach(p => p.update()); Game.powerups = Game.powerups.filter(p => p.active);
        Game.asteroids.forEach(a => a.update()); Game.asteroids = Game.asteroids.filter(a => a.active);

        Game.updateCollisions(); VFX.update();

        if (Game.p1.health <= 0) {
            Game.state = 'GAMEOVER'; Audio.stopBGM();
            Game.winnerText = "KHEL KHATAM!";
            Audio.playSFX('boom'); Audio.playSFX('laugh'); Game.shake(30, 15);
            VFX.addBurst(Game.p1.x, Game.p1.y, '#FFF', 200, 20, 8);
        }
    },

    drawUI: (ctx) => {
        ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(canvas.width/2 - 250, 20, 500, 40);
        ctx.fillStyle = Game.p1.color; ctx.fillRect(canvas.width/2 - 250, 20, Math.max(0, Game.p1.health * 5), 40);
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.strokeRect(canvas.width/2 - 250, 20, 500, 40);
        ctx.fillStyle = '#FFF'; ctx.font = '28px Impact'; ctx.fillText(`ARMOR: ${Math.floor(Game.p1.health)}%  |  SCORE: ${Game.p1.score}`, canvas.width/2, 50);
        
        let y = 80; ctx.font = 'bold 16px Arial';
        for (let k in BuffInfo) { if(Game.p1.hasBuff(k) && BuffInfo[k].dur > 0) { ctx.fillStyle = BuffInfo[k].c; ctx.fillText(BuffInfo[k].t, canvas.width/2, y); y+=22; } }
    },

    draw: () => {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.35)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        if (Game.shakeTime > 0) ctx.translate(Utils.random(-Game.shakeMag, Game.shakeMag), Utils.random(-Game.shakeMag, Game.shakeMag));

        Game.bg.draw(ctx, Game.state === 'PLAY' ? 2 : 0.5);

        if (Game.state === 'MENU') {
            ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
            ctx.font = 'bold 120px Impact'; ctx.shadowBlur = 20; ctx.shadowColor = '#0FF';
            ctx.fillText('ULTIMATE BHASAD', canvas.width/2, canvas.height/3); ctx.shadowBlur = 0;
            
            ctx.font = '32px Impact'; 
            ctx.fillStyle = '#00FFFF'; ctx.fillText('CONTROLS: WASD to Move | Left Click to Aim & Fire', canvas.width/2, canvas.height/2);
            
            ctx.fillStyle = '#FFA500'; ctx.font = 'bold 22px Arial'; 
            ctx.fillText("SINGLE PLAYER LONE WOLF EDITION | SURVIVE THE BOSS", canvas.width/2, canvas.height/2 + 100);
            
            if (Math.floor(Date.now() / 400) % 2 === 0) { 
                ctx.fillStyle = '#FFFF00'; ctx.font = '45px Impact'; 
                ctx.fillText('>> PRESS ENTER TO MACHA BAWAAL <<', canvas.width/2, canvas.height/2 + 200); 
            }
            if (Input.isDown('Enter') || Input.isMouseDown) { Audio.init(); Game.init(); }
        } 
        else {
            Game.asteroids.forEach(a => a.draw(ctx)); Game.powerups.forEach(p => p.draw(ctx)); Game.drones.forEach(d => d.draw(ctx));
            if (Game.boss) Game.boss.draw(ctx);
            VFX.draw(ctx); Game.bullets.forEach(b => b.draw(ctx)); Game.p1.draw(ctx);

            ctx.restore(); 
            Game.drawUI(ctx);

            if (Game.state === 'GAMEOVER') {
                ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.textAlign = 'center'; ctx.fillStyle = '#FFFF00'; ctx.font = 'bold 80px Impact'; 
                ctx.shadowBlur = 30; ctx.shadowColor = '#F00'; ctx.fillText(Game.winnerText, canvas.width/2, canvas.height/2 - 50); ctx.shadowBlur = 0;
                
                ctx.fillStyle = '#FFF'; ctx.font = '40px Impact'; ctx.fillText(`FINAL SCORE: ${Game.p1.score}`, canvas.width/2, canvas.height/2 + 40);
                
                if (Math.floor(Date.now() / 400) % 2 === 0) { 
                    ctx.fillStyle = '#0FF'; ctx.font = '35px Arial'; 
                    ctx.fillText("PRESS 'R' OR LEFT CLICK FOR EK AUR BAAZI", canvas.width/2, canvas.height/2 + 120);
                }
                if (Input.isDown('KeyR') || Input.isMouseDown) { 
                    Input.isMouseDown = false; // Prevent accidental instant start
                    setTimeout(() => Game.init(), 100); 
                }
            }
        }
        if(Game.state === 'MENU' || Game.state === 'GAMEOVER') ctx.restore(); 
    }
};

// ==========================================
// 8. MAIN LOOP
// ==========================================
function gameLoop() {
    if (Game.state === 'PLAY') Game.update();
    Game.draw(); requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);