

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false }); // Optimized context
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

const hitPhrases = ["BHAINKAAR!", "KHATARNAAK!", "PEL DIYA!", "KHEL KHATAM!", "GHAZAB!", "SWAD AA GAYA!"];
const bossPhrases = ["MAHA-BHASAD AI HAS AWOKEN!", "BAPU AAGAYA!", "SYSTEM HANG!"];

// ==========================================
// 2. PROCEDURAL AUDIO ENGINE
// ==========================================
const Audio = (() => {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    let bgmInterval = null; let noteIndex = 0;
    const sequence = [65.41, 65.41, 0, 77.78, 65.41, 0, 98.00, 87.31, 65.41, 65.41, 0, 130.81, 0, 116.54, 98.00, 0]; 

    return {
        init: () => { if (actx.state === 'suspended') actx.resume(); },
        playSFX: (type) => {
            if (actx.state === 'suspended') return;
            const now = actx.currentTime;
            
            if (type === 'shoot') {
                const osc = actx.createOscillator(), gain = actx.createGain();
                osc.type = 'square'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.connect(gain); gain.connect(actx.destination); osc.start(now); osc.stop(now + 0.1);
            } 
            else if (type === 'hit' || type === 'boom' || type === 'boss_boom') {
                const dur = type === 'boss_boom' ? 1.5 : (type === 'boom' ? 0.6 : 0.15);
                const bufSize = actx.sampleRate * dur; const buffer = actx.createBuffer(1, bufSize, actx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() - 0.5) * 2.0;
                const noise = actx.createBufferSource(); noise.buffer = buffer;
                const gain = actx.createGain(), filter = actx.createBiquadFilter();
                filter.type = 'lowpass'; filter.frequency.value = type.includes('boom') ? 800 : 3000;
                gain.gain.setValueAtTime(type.includes('boom') ? 0.6 : 0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
                noise.connect(filter); filter.connect(gain); gain.connect(actx.destination); noise.start(now);
            } 
            else if (type === 'powerup') {
                const osc = actx.createOscillator(), gain = actx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
                gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.connect(gain); gain.connect(actx.destination); osc.start(now); osc.stop(now + 0.3);
            } 
            else if (type === 'laugh') {
                for (let i = 0; i < 7; i++) {
                    let t = now + i * 0.35, osc1 = actx.createOscillator(), osc2 = actx.createOscillator();
                    let gain = actx.createGain(), filter = actx.createBiquadFilter(), freq = 130 - (i * 12); 
                    osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(freq, t); osc1.frequency.exponentialRampToValueAtTime(freq - 20, t + 0.3);
                    osc2.type = 'square'; osc2.frequency.setValueAtTime(freq / 2, t); 
                    filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, t);
                    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.8, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
                    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(actx.destination);
                    osc1.start(t); osc2.start(t); osc1.stop(t + 0.3); osc2.stop(t + 0.3);
                }
            }
        },
        startBGM: () => {
            if (bgmInterval) return;
            bgmInterval = setInterval(() => {
                let freq = sequence[noteIndex];
                if (freq > 0) {
                    const now = actx.currentTime; const osc = actx.createOscillator(), gain = actx.createGain(), filter = actx.createBiquadFilter();
                    osc.type = 'sawtooth'; osc.frequency.value = freq;
                    filter.type = 'lowpass'; filter.frequency.setValueAtTime(400, now); filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
                    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.connect(filter); filter.connect(gain); gain.connect(actx.destination); osc.start(now); osc.stop(now + 0.15);
                }
                noteIndex = (noteIndex + 1) % sequence.length;
            }, 125); 
        },
        stopBGM: () => { clearInterval(bgmInterval); bgmInterval = null; }
    };
})();

// ==========================================
// 3. INPUT MANAGER
// ==========================================
const Input = {
    keys: {},
    init: () => {
        window.addEventListener('keydown', (e) => Input.keys[e.code] = true);
        window.addEventListener('keyup', (e) => Input.keys[e.code] = false);
    },
    isDown: (code) => Input.keys[code]
};
Input.init();

// ==========================================
// 4. VFX SYSTEM
// ==========================================
class Particle {
    constructor(x, y, color, angle, speed, life, size = 4) {
        this.x = x; this.y = y; this.color = color; this.life = life; this.maxLife = life;
        this.dx = Math.cos(angle) * speed; this.dy = Math.sin(angle) * speed; this.size = size; this.friction = 0.95;
    }
    update() { this.x += this.dx; this.y += this.dy; this.dx *= this.friction; this.dy *= this.friction; this.life--; }
    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife); ctx.fillStyle = this.color; ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.arc(this.x, this.y, (this.life / this.maxLife) * this.size, 0, TWO_PI); ctx.fill();
        ctx.globalAlpha = 1.0; ctx.globalCompositeOperation = 'source-over';
    }
}
class FloatingText {
    constructor(x, y, text, color, isCrit = false) {
        this.x = x; this.y = y; this.text = text; this.color = color; this.life = isCrit ? 90 : 60; this.dy = isCrit ? -3 : -1.5;
        this.font = isCrit ? 'italic bold 36px Impact' : 'bold 22px Arial';
    }
    update() { this.y += this.dy; this.life--; }
    draw(ctx) { ctx.globalAlpha = Math.max(0, this.life / 60); ctx.fillStyle = this.color; ctx.font = this.font; ctx.fillText(this.text, this.x, this.y); ctx.globalAlpha = 1.0; }
}

const VFX = {
    particles: [], texts: [],
    addBurst: (x, y, c, count, speed = 10, sz = 4) => { if(VFX.particles.length > 800) return; for(let i=0; i<count; i++) VFX.particles.push(new Particle(x,y,c,Utils.random(0,TWO_PI),Utils.random(2,speed),Utils.randomInt(30,60),sz)); },
    addText: (x, y, txt, col, crit = false) => VFX.texts.push(new FloatingText(x, y, txt, col, crit)),
    update: () => {
        for(let i=VFX.particles.length-1; i>=0; i--) { VFX.particles[i].update(); if(VFX.particles[i].life<=0) VFX.particles.splice(i,1); }
        for(let i=VFX.texts.length-1; i>=0; i--) { VFX.texts[i].update(); if(VFX.texts[i].life<=0) VFX.texts.splice(i,1); }
    },
    draw: (ctx) => { VFX.particles.forEach(p => p.draw(ctx)); VFX.texts.forEach(t => t.draw(ctx)); }
};

class Background {
    constructor() {
        this.stars = Array.from({length: 200}, () => ({ x: Utils.random(0, canvas.width), y: Utils.random(0, canvas.height), z: Utils.random(0.2, 2.5), color: `hsl(${Utils.randomInt(200, 300)}, 80%, 70%)` }));
        this.offset = 0;
    }
    draw(ctx, speedMult) {
        this.offset += 1 * speedMult;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)'; ctx.lineWidth = 2; ctx.beginPath();
        for(let x = (this.offset % 100) - 100; x < canvas.width; x += 100) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
        for(let y = (this.offset % 100) - 100; y < canvas.height; y += 100) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
        ctx.stroke();
        this.stars.forEach(s => {
            s.x -= s.z * speedMult; if (s.x < 0) { s.x = canvas.width; s.y = Utils.random(0, canvas.height); }
            ctx.fillStyle = s.color; ctx.globalAlpha = s.z / 2.5; ctx.beginPath(); ctx.arc(s.x, s.y, s.z, 0, TWO_PI); ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    }
}

// ==========================================
// 5. ENTITIES
// ==========================================
const BuffInfo = { HEALTH: { c: '#32FF64', t: 'REPAIR +30', dur: 0 }, RAPID: { c: '#FF9600', t: 'OVERDRIVE', dur: 5000 }, SHIELD: { c: '#00FFFF', t: 'AEGIS SHIELD', dur: 6000 }, SPEED: { c: '#FFFF00', t: 'NITRO BOOST', dur: 5000 }, GHOST: { c: '#B4B4FF', t: 'PHANTOM CLOAK', dur: 5000 }, FREEZE: { c: '#0064FF', t: 'STASIS', dur: 4000 }, EMP: { c: '#FFFFFF', t: 'EMP BLAST', dur: 0 }, VAMP: { c: '#FF0032', t: 'VAMPIRE', dur: 6000 }, SCATTER: { c: '#FF00FF', t: 'SCATTER', dur: 5000 }, PIERCE: { c: '#64FF64', t: 'RAILGUN', dur: 5000 }, REVERSE: { c: '#FF6464', t: 'NEURO-HACK', dur: 4000 }, TELEPORT: { c: '#C800FF', t: 'QUANTUM SHIFT', dur: 0 }, SHRINK: { c: '#64FFC8', t: 'MICRO-TECH', dur: 6000 }, NUKE: { c: '#FF3200', t: 'ORBITAL STRIKE', dur: 0 }, GIANT: { c: '#C86432', t: 'JUGGERNAUT', dur: 6000 }, LASER: { c: '#00FF64', t: 'PLASMA BEAM', dur: 4000 } };

class Entity {
    constructor(x, y, r, c) { this.x = x; this.y = y; this.radius = r; this.color = c; this.dx = 0; this.dy = 0; this.active = true; }
    update() { this.x += this.dx; this.y += this.dy; }
    collide(other) { return Math.hypot(other.x - this.x, other.y - this.y) < this.radius + other.radius; }
}

class Player extends Entity {
    constructor(num, x, y, c, controls) {
        super(x, y, 30, c);
        this.num = num; this.baseRadius = 30; this.controls = controls; this.health = 100; this.maxHealth = 100; this.score = 0;
        this.buffs = {}; this.lastShot = 0; this.hitFlash = 0; this.baseSpeed = 6.0;
    }
    hasBuff(k) { return this.buffs[k] && Date.now() < this.buffs[k]; }
    applyDamage(amt, isCrit = false) {
        if (this.hasBuff('SHIELD') || this.hasBuff('GHOST')) return;
        this.health -= amt; this.hitFlash = 15;
        Game.shake(isCrit ? 8 : 4, isCrit ? 5 : 2); // Wobble fixed
        VFX.addBurst(this.x, this.y, this.color, 15); VFX.addText(this.x, this.y - 50, `-${amt}`, '#FF0000', isCrit); Audio.playSFX('hit');
    }
    update(now) {
        if (this.health <= 0) return;
        if (this.hitFlash > 0) this.hitFlash--;
        this.radius = this.hasBuff('SHRINK') ? 15 : this.hasBuff('GIANT') ? 45 : this.baseRadius;
        
        let spd = this.baseSpeed * (this.hasBuff('SPEED')?1.8:1) * (this.hasBuff('FREEZE')?0.3:1) * (this.hasBuff('GIANT')?0.6:1);
        let rev = this.hasBuff('REVERSE');
        let up = Input.isDown(rev ? this.controls.d : this.controls.u), dn = Input.isDown(rev ? this.controls.u : this.controls.d);
        let lf = Input.isDown(rev ? this.controls.r : this.controls.l), rt = Input.isDown(rev ? this.controls.l : this.controls.r);
        
        if (up) this.y -= spd; if (dn) this.y += spd; if (lf) this.x -= spd; if (rt) this.x += spd;
        this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius)); this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius));

        if ((up || dn || lf || rt) && Math.random() > 0.4) VFX.particles.push(new Particle(this.x - (this.num===1?20:-20), this.y + Utils.random(-10, 10), this.color, (this.num===1?Math.PI:0), 5, 15, 3));

        if (Input.isDown(this.controls.s) && now - this.lastShot >= (this.hasBuff('LASER')?40:this.hasBuff('RAPID')?80:200)) {
            let bSpd = this.hasBuff('LASER')?40:25, dir = this.num===1?1:-1, c = this.hasBuff('VAMP')?'#FF0032':this.color, sz = this.hasBuff('GIANT')?16:8, prc = this.hasBuff('PIERCE');
            if (this.hasBuff('SCATTER')) {
                Game.bullets.push(new Bullet(this, this.x, this.y, bSpd*dir, bSpd*0.3, c, prc, sz)); Game.bullets.push(new Bullet(this, this.x, this.y, bSpd*dir, -bSpd*0.3, c, prc, sz));
            }
            Game.bullets.push(new Bullet(this, this.x, this.y, bSpd*dir, 0, c, prc, sz));
            Audio.playSFX('shoot'); this.lastShot = now;
        }
    }
    draw(ctx) {
        if (this.health <= 0) return;
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.rotate((Input.isDown(this.controls.u) ? -0.2 : Input.isDown(this.controls.d) ? 0.2 : 0) * (this.num===1?1:-1));
        ctx.scale(this.radius/this.baseRadius, this.radius/this.baseRadius);
        if (this.hasBuff('SHIELD')) { ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, TWO_PI); ctx.fill(); ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.stroke(); }
        if (this.hasBuff('FREEZE')) { ctx.fillStyle = 'rgba(0, 100, 255, 0.4)'; ctx.fillRect(-35, -35, 70, 70); }
        ctx.beginPath(); ctx.moveTo(30 * (this.num===1?1:-1), 0); ctx.lineTo(-15 * (this.num===1?1:-1), 25); ctx.lineTo(-5 * (this.num===1?1:-1), 0); ctx.lineTo(-15 * (this.num===1?1:-1), -25); ctx.closePath();
        ctx.fillStyle = this.hitFlash > 0 ? '#FFFFFF' : this.color; if (this.hasBuff('GHOST')) ctx.globalAlpha = 0.3;
        ctx.fill(); ctx.strokeStyle = this.hasBuff('VAMP') ? '#FF0000' : '#FFFFFF'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    }
}

class Bullet extends Entity {
    constructor(own, x, y, dx, dy, c, prc, sz) { super(x, y, sz, c); this.owner = own; this.dx = dx; this.dy = dy; this.pierce = prc; }
    draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.ellipse(this.x, this.y, this.radius*2, this.radius, 0, 0, TWO_PI); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius/2, 0, TWO_PI); ctx.fill(); }
}

class Drone extends Entity {
    constructor(x, y) { super(x, y, 20, '#FF0064'); this.hp = 2; this.rot = Utils.random(0, TWO_PI); this.dx = Utils.random(-3, 3); this.dy = Utils.random(-3, 3); }
    update(now) { super.update(); this.rot += 0.05; if (this.x < 30 || this.x > canvas.width - 30) this.dx *= -1; if (this.y < 30 || this.y > canvas.height - 30) this.dy *= -1; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.fillStyle = 'rgba(255, 0, 100, 0.8)'; ctx.strokeStyle = '#FF0'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(20, 0); ctx.lineTo(0, 20); ctx.lineTo(-20, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
}

class Boss extends Entity {
    constructor() { super(canvas.width/2, -100, 80, '#F00'); this.hp = 500; this.maxHp = 500; this.lastAtk = Date.now(); this.theta = 0; Audio.playSFX('boss_spawn'); VFX.addText(canvas.width/2, canvas.height/2, "MAHA-BHASAD AWOKEN!", '#F00', true); }
    update(now) {
        if (this.y < canvas.height / 4) this.y += 2; this.x = canvas.width/2 + Math.sin(this.theta) * 300; this.theta += 0.01;
        if (now - this.lastAtk > 2000) { Audio.playSFX('shoot'); for (let i = 0; i < 12; i++) { let a = (TWO_PI / 12) * i; Game.bullets.push(new Bullet({isBoss:true}, this.x, this.y, Math.cos(a)*7, Math.sin(a)*7, '#F0F', false, 12)); } this.lastAtk = now; }
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#200'; ctx.strokeStyle = '#F00'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(60, 0); ctx.lineTo(0, 60); ctx.lineTo(-60, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FF0'; ctx.beginPath(); ctx.arc(0, 0, 20 + Math.sin(this.theta*10)*5, 0, TWO_PI); ctx.fill(); ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(canvas.width/2 - 200, 40, 400, 25); ctx.fillStyle = '#F00'; ctx.fillRect(canvas.width/2 - 200, 40, (this.hp/this.maxHp)*400, 25); ctx.strokeStyle = '#FFF'; ctx.strokeRect(canvas.width/2 - 200, 40, 400, 25);
    }
}

class PowerUp extends Entity {
    constructor(x, y, t) { super(x, y, 20, BuffInfo[t].c); this.type = t; this.life = 600; this.anim = 0; }
    update() { this.anim += 0.1; this.life--; if(this.life<=0) this.active = false; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.scale(1+Math.sin(this.anim)*0.2, 1+Math.sin(this.anim)*0.2);
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(18, 0); ctx.lineTo(0, 18); ctx.lineTo(-18, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    }
}

// ==========================================
// 6. CORE GAME
// ==========================================
const Game = {
    state: 'MENU', winner: '', p1: null, p2: null, boss: null, bullets: [], drones: [], powerups: [], bg: new Background(), shakeTime: 0, shakeMag: 0, droneTimer: 0, startT: 0,
    init: () => {
        Game.p1 = new Player(1, canvas.width/4, canvas.height/2, '#0FF', {u:'KeyW', d:'KeyS', l:'KeyA', r:'KeyD', s:'ShiftLeft'});
        Game.p2 = new Player(2, canvas.width*0.75, canvas.height/2, '#F09', {u:'ArrowUp', d:'ArrowDown', l:'ArrowLeft', r:'ArrowRight', s:'ShiftRight'});
        Game.bullets=[]; Game.drones=[]; Game.powerups=[]; Game.boss=null; VFX.particles=[]; VFX.texts=[];
        Game.startT = Date.now(); Game.state = 'PLAY'; Audio.startBGM();
    },
    shake: (t, m) => { Game.shakeTime = t; Game.shakeMag = m; },
    applyBuff: (p, b) => {
        let opp = p === Game.p1 ? Game.p2 : Game.p1, i = BuffInfo[b], now = Date.now();
        if (b === 'HEALTH') p.health = Math.min(p.maxHealth, p.health + 30);
        else if (b === 'EMP') { Game.bullets = Game.bullets.filter(bul => bul.owner === p); Game.shake(10, 8); Audio.playSFX('boom'); }
        else if (b === 'TELEPORT') { opp.x = Utils.random(100, canvas.width-100); opp.y = Utils.random(100, canvas.height-100); Audio.playSFX('boom'); }
        else if (b === 'NUKE') { Game.drones.forEach(d => VFX.addBurst(d.x, d.y, '#F50', 20)); Game.drones = []; opp.applyDamage(25, true); if(Game.boss) Game.boss.hp-=50; Game.shake(20, 15); Audio.playSFX('boom'); }
        else if (b === 'FREEZE' || b === 'REVERSE') opp.buffs[b] = now + i.dur; else p.buffs[b] = now + i.dur;
        VFX.addBurst(p.x, p.y, i.c, 40); VFX.addText(p.x, p.y - 60, i.t, i.c); Audio.playSFX('powerup');
    },
    update: () => {
        const now = Date.now(); if (Game.shakeTime > 0) Game.shakeTime--;
        Game.p1.update(now); Game.p2.update(now); if (Game.boss) Game.boss.update(now);
        
        Game.droneTimer++; if (Game.droneTimer > 120 && Game.drones.length < 8) { Game.drones.push(new Drone(Utils.random(50, canvas.width-50), Utils.random(50, canvas.height-50))); Game.droneTimer = 0; }
        if (!Game.boss && now - Game.startT > 30000 && Math.random() < 0.005) { Game.boss = new Boss(); Game.startT = now; }

        Game.bullets.forEach(b => b.update()); Game.bullets = Game.bullets.filter(b => b.active && b.x>0 && b.x<canvas.width && b.y>0 && b.y<canvas.height);
        Game.drones.forEach(d => d.update(now)); Game.drones = Game.drones.filter(d => d.active);
        Game.powerups.forEach(p => p.update()); Game.powerups = Game.powerups.filter(p => p.active);

        // Player Knockback
        if (Game.p1.health > 0 && Game.p2.health > 0 && Game.p1.collide(Game.p2)) {
            if (Game.p1.hitFlash===0) Game.p1.applyDamage(10); if (Game.p2.hitFlash===0) Game.p2.applyDamage(10);
            let a = Utils.angle(Game.p1.x, Game.p1.y, Game.p2.x, Game.p2.y);
            Game.p1.x -= Math.cos(a)*40; Game.p1.y -= Math.sin(a)*40; Game.p2.x += Math.cos(a)*40; Game.p2.y += Math.sin(a)*40;
            VFX.addText(Game.p1.x+(Game.p2.x-Game.p1.x)/2, Game.p1.y-30, "TAKAAAR!", '#F00', true);
        }

        // Bullets logic
        for (let i = Game.bullets.length - 1; i >= 0; i--) {
            let b = Game.bullets[i], hit = false;
            let opp = b.owner === Game.p1 ? Game.p2 : (b.owner === Game.p2 ? Game.p1 : null);
            if (opp && opp.health > 0 && b.collide(opp)) { opp.applyDamage(b.radius>8?15:8, Math.random()>0.8); if(b.owner.hasBuff('VAMP')) b.owner.health = Math.min(100, b.owner.health+5); hit=true; }
            if (!hit && Game.boss && !b.owner.isBoss && b.collide(Game.boss)) { Game.boss.hp -= b.radius>8?10:4; VFX.addBurst(b.x, b.y, '#FF0', 10); hit=true; if(Game.boss.hp<=0) { Audio.playSFX('boss_boom'); Game.shake(30, 20); Game.boss=null; } }
            if (!hit && b.owner.isBoss) { if (Game.p1.health>0 && b.collide(Game.p1)) { Game.p1.applyDamage(15); hit=true; } else if (Game.p2.health>0 && b.collide(Game.p2)) { Game.p2.applyDamage(15); hit=true; } }
            if (!hit) {
                for (let j = Game.drones.length - 1; j >= 0; j--) {
                    if (b.collide(Game.drones[j])) {
                        Game.drones[j].hp--; if (Game.drones[j].hp <= 0) { VFX.addBurst(Game.drones[j].x, Game.drones[j].y, '#F50', 30); Audio.playSFX('boom'); let k = Object.keys(BuffInfo); Game.powerups.push(new PowerUp(Game.drones[j].x, Game.drones[j].y, k[Utils.randomInt(0, k.length)])); Game.drones.splice(j, 1); } hit=true; break;
                    }
                }
            }
            if (hit && !b.pierce) b.active = false;
        }

        for (let i = Game.drones.length - 1; i >= 0; i--) { [Game.p1, Game.p2].forEach(p => { if (p.health>0 && Game.drones[i] && Game.drones[i].collide(p)) { p.applyDamage(15, true); VFX.addBurst(Game.drones[i].x, Game.drones[i].y, '#F50', 40); Audio.playSFX('boom'); Game.drones[i].active = false; } }); }
        for (let i = Game.powerups.length - 1; i >= 0; i--) { [Game.p1, Game.p2].forEach(p => { if (p.health>0 && Game.powerups[i] && Game.powerups[i].collide(p)) { Game.applyBuff(p, Game.powerups[i].type); Game.powerups[i].active = false; } }); }
        
        VFX.update();
        if (Game.p1.health <= 0 || Game.p2.health <= 0) {
            Game.state = 'GAMEOVER'; Audio.stopBGM();
            Game.winner = (Game.p1.health<=0 && Game.p2.health<=0) ? "DONO GAYE KAAM SE!" : (Game.p1.health<=0 ? "PLAYER 2 KA BHAUKAAL!" : "PLAYER 1 KA BHAUKAAL!");
            Audio.playSFX('boom'); Audio.playSFX('laugh'); Game.shake(40, 20); VFX.addBurst(canvas.width/2, canvas.height/2, '#FFF', 150, 15, 6);
        }
    },
    drawUI: (ctx) => {
        // UI Fix: Hard anchored to left and right so they never overlap
        ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(20, 20, 320, 35); ctx.fillStyle = Game.p1.color; ctx.fillRect(20, 20, Math.max(0, Game.p1.health * 3.2), 35); ctx.strokeStyle = '#FFF'; ctx.strokeRect(20, 20, 320, 35); ctx.fillStyle = '#FFF'; ctx.font = '24px Impact'; ctx.fillText(`P1: ${Math.floor(Game.p1.health)}%`, 30, 45);
        let y=70; ctx.font = 'bold 14px Arial'; for (let k in BuffInfo) { if(Game.p1.hasBuff(k) && BuffInfo[k].dur > 0) { ctx.fillStyle = BuffInfo[k].c; ctx.fillText(BuffInfo[k].t, 25, y); y+=20; } }
        
        ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(canvas.width - 340, 20, 320, 35); ctx.fillStyle = Game.p2.color; ctx.fillRect(canvas.width - 340 + (320 - Math.max(0, Game.p2.health * 3.2)), 20, Math.max(0, Game.p2.health * 3.2), 35); ctx.strokeStyle = '#FFF'; ctx.strokeRect(canvas.width - 340, 20, 320, 35); ctx.fillStyle = '#FFF'; ctx.font = '24px Impact'; ctx.fillText(`${Math.floor(Game.p2.health)}% :P2`, canvas.width - 30, 45);
        y=70; ctx.font = 'bold 14px Arial'; for (let k in BuffInfo) { if(Game.p2.hasBuff(k) && BuffInfo[k].dur > 0) { ctx.fillStyle = BuffInfo[k].c; ctx.fillText(BuffInfo[k].t, canvas.width - 25, y); y+=20; } }
    },
    draw: () => {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.35)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.save();
        if (Game.shakeTime > 0) ctx.translate(Utils.random(-Game.shakeMag, Game.shakeMag), Utils.random(-Game.shakeMag, Game.shakeMag));
        Game.bg.draw(ctx, Game.state === 'PLAY' ? 2 : 0.5);

        if (Game.state === 'MENU') {
            ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.font = 'bold 100px Impact'; ctx.fillText('ULTIMATE BHASAD', canvas.width/2, canvas.height/3);
            
            // UI Overlap Fix: Vertically Stacked Instructions
            ctx.font = '30px Impact'; 
            ctx.fillStyle = '#0FF'; ctx.fillText('PLAYER 1: WASD to Move | L-SHIFT to Fire', canvas.width/2, canvas.height/2 - 20);
            ctx.fillStyle = '#F09'; ctx.fillText('PLAYER 2: ARROWS to Move | R-SHIFT to Fire', canvas.width/2, canvas.height/2 + 30);
            
            ctx.fillStyle = '#FA0'; ctx.font = 'bold 20px Arial'; ctx.fillText("2 PLAYER ARENA | BOSS FIGHTS | PROCEDURAL AUDIO", canvas.width/2, canvas.height/2 + 100);
            if (Math.floor(Date.now() / 400) % 2 === 0) { ctx.fillStyle = '#FF0'; ctx.font = '40px Impact'; ctx.fillText('>> PRESS ENTER TO DOMINATE <<', canvas.width/2, canvas.height/2 + 180); }
            if (Input.isDown('Enter')) { Audio.init(); Game.init(); }
        } else {
            Game.powerups.forEach(p => p.draw(ctx)); Game.drones.forEach(d => d.draw(ctx)); if (Game.boss) Game.boss.draw(ctx);
            VFX.draw(ctx); Game.bullets.forEach(b => b.draw(ctx)); Game.p1.draw(ctx); Game.p2.draw(ctx);
            ctx.restore(); Game.drawUI(ctx);
            if (Game.state === 'GAMEOVER') {
                ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.textAlign = 'center'; ctx.fillStyle = '#FF0'; ctx.font = 'bold 70px Impact'; ctx.fillText(Game.winner, canvas.width/2, canvas.height/2 - 40);
                if (Math.floor(Date.now() / 400) % 2 === 0) { ctx.fillStyle = '#0FF'; ctx.font = '35px Arial'; ctx.fillText("PRESS 'R' FOR EK AUR BAAZI", canvas.width/2, canvas.height/2 + 60); }
                if (Input.isDown('KeyR')) Game.init();
            }
        }
        if(Game.state === 'MENU' || Game.state === 'GAMEOVER') ctx.restore(); 
    }
};

function gameLoop() { if (Game.state === 'PLAY') Game.update(); Game.draw(); requestAnimationFrame(gameLoop); }
requestAnimationFrame(gameLoop);