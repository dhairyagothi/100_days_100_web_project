console.log("SCRIPT LOADED");
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const wrap = document.getElementById('wrap');

let W, H;
function resize() {
    const r = wrap.getBoundingClientRect();
    W = canvas.width = r.width;
    H = canvas.height = r.height;
}
resize();
window.addEventListener('resize', resize);


// roundRect polyfill
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;

        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();

        return this;
    };
}

// ── Layout ───────────────────────────────────────────────────────────────────
let ROAD_Y, ROAD_H, GROUND_Y, SKY_H;
let LANE1_Y, LANE2_Y, LANE3_Y; // top=lane1 (rightgoing traffic), mid=bus lane, bot=oncoming

function calcLayout() {
    W = canvas.width; H = canvas.height;
    SKY_H = H * 0.48;
    ROAD_Y = H * 0.48;
    ROAD_H = H * 0.32;
    GROUND_Y = ROAD_Y + ROAD_H;
    LANE1_Y = ROAD_Y + ROAD_H * 0.13;   // traffic going right (top lane)
    LANE2_Y = ROAD_Y + ROAD_H * 0.48;   // BUS lane (middle)
    LANE3_Y = ROAD_Y + ROAD_H * 0.80;   // oncoming traffic (bottom)
}

// ── State ────────────────────────────────────────────────────────────────────
let gameRunning = false, paused = false;
let earnings = 0, delivered = 0, crashes = 0, timeLeft = 90;
let worldX = 0;          // camera scroll
let raf, lastTime = 0;

// Weather
const WEATHERS = ['clear', 'rain', 'heavy_rain'];
let weather = 'clear', weatherTimer = 0, raindrops = [];
let weatherLabel = { clear: '☀️ CLEAR', rain: '🌧️ RAIN', heavy_rain: '⛈️ HEAVY RAIN' };

// Bus
let bus = {};
function resetBus() {
    bus = {
        x: W * 0.25,
        y: LANE2_Y,
        w: 90, h: 38,
        vx: 0, vy: 0,
        speed: 0,
        maxSpeed: 220,
        accel: 140, brake: 260, friction: 80,
        laneTarget: LANE2_Y,
        passengers: 0,
        maxPass: 5,
        crashed: false, crashTimer: 0,
        destStop: null,
    };
}

// Traffic cars
let trafficCars = [];
function spawnTraffic() {
    // rightgoing (top lane)
    trafficCars.push({
        x: worldX + W + 60 + Math.random() * 300,
        lane: 'top',
        speed: 60 + Math.random() * 50,
        w: 55 + Math.random() * 25, h: 24,
        color: ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22'][Math.floor(Math.random() * 6)],
        type: Math.random() < 0.2 ? 'truck' : 'car'
    });
    // oncoming (bottom lane)
    trafficCars.push({
        x: worldX - 60 - Math.random() * 300,
        lane: 'bot',
        speed: -(55 + Math.random() * 45),
        w: 55 + Math.random() * 20, h: 24,
        color: ['#c0392b', '#2980b9', '#d35400', '#8e44ad'][Math.floor(Math.random() * 4)],
        type: Math.random() < 0.15 ? 'truck' : 'car'
    });
}

// Bus stops
let busStops = [];
let stopColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
function genBusStops() {
    busStops = [];
    for (let i = 0; i < 12; i++) {
        busStops.push({
            worldX: 400 + i * 600 + Math.random() * 200,
            id: i,
            name: ['City Hall', 'Market', 'School', 'Hospital', 'Park', 'Mall', 'Station', 'Airport', 'Zoo', 'Temple', 'Beach', 'Garden'][i],
            waiting: Math.floor(Math.random() * 4) + 1,  // passengers waiting
            color: stopColors[i % stopColors.length],
            pickedUp: false,
            delivered: false,
        });
    }
}

// Signal lights (at intersections)
let signals = [];
function genSignals() {
    signals = [];
    for (let i = 0; i < 8; i++) {
        signals.push({
            worldX: 700 + i * 900 + Math.random() * 300,
            state: Math.random() < 0.5 ? 'green' : 'red',
            timer: 3 + Math.random() * 4,
            max: 5,
        });
    }
}

// Buildings / scenery
let buildings = [];
function genBuildings() {
    buildings = [];
    for (let i = 0; i < 60; i++) {
        const bw = 50 + Math.random() * 120;
        const bh = 60 + Math.random() * 180;
        buildings.push({
            worldX: i * 250 + Math.random() * 120,
            w: bw, h: bh,
            color: `hsl(${200 + Math.random() * 60},${8 + Math.random() * 18}%,${20 + Math.random() * 28}%)`,
            windows: genWins(bw, bh),
        });
    }
}
function genWins(bw, bh) {
    const wins = [];
    const cols = Math.floor(bw / 18), rows = Math.floor(bh / 22);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
        wins.push({ c, r, on: Math.random() > 0.4 });
    return wins;
}

// Trees / lamp posts
let trees = [];
function genTrees() {
    trees = [];
    for (let i = 0; i < 80; i++)
        trees.push({ worldX: i * 180 + Math.random() * 100, type: i % 4 === 0 ? 'lamp' : 'tree' });
}

// Rain
function genRain() {
    raindrops = [];
    const count = weather === 'heavy_rain' ? 200 : 80;
    for (let i = 0; i < count; i++)
        raindrops.push({ x: Math.random() * W, y: Math.random() * H, speed: 400 + Math.random() * 200, len: 8 + Math.random() * 12 });
}

// Keys
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.key] = false; });


function setupTouchControl(buttonId, keyName) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    const press = (e) => {
        e.preventDefault();
        keys[keyName] = true;
    };

    const release = (e) => {
        e.preventDefault();
        keys[keyName] = false;
    };

    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);

    btn.addEventListener("touchstart", press, { passive: false });
    btn.addEventListener("touchend", release, { passive: false });
    btn.addEventListener("touchcancel", release, { passive: false });
}

setupTouchControl("leftBtn", "ArrowLeft");
setupTouchControl("rightBtn", "ArrowRight");
setupTouchControl("upBtn", "ArrowUp");
setupTouchControl("downBtn", "ArrowDown");


// ── Init ──────────────────────────────────────────────────────────────────────
function initGame() {
    calcLayout();
    resetBus();
    trafficCars = [];
    earnings = 0; delivered = 0; crashes = 0; timeLeft = 90;
    worldX = 0;
    weather = 'clear'; weatherTimer = 15 + Math.random() * 20;
    genBusStops(); genSignals(); genBuildings(); genTrees();
    spawnTraffic(); spawnTraffic(); spawnTraffic();
    genRain();
    updateHUD();
    document.getElementById('next-stop').style.display = 'block';
    updateNextStop();
}

// ── Loop ──────────────────────────────────────────────────────────────────────
function loop(ts) {
    if (!gameRunning) return;
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;
    if (!paused) update(dt);
    draw();
    raf = requestAnimationFrame(loop);
}

function update(dt) {
    calcLayout();

    // Timer
    timeLeft -= dt;
    if (timeLeft <= 0) { timeLeft = 0; endGame(); return; }

    // Weather cycle
    weatherTimer -= dt;
    if (weatherTimer <= 0) {
        const idx = Math.floor(Math.random() * WEATHERS.length);
        weather = WEATHERS[idx];
        weatherTimer = 12 + Math.random() * 25;
        genRain();
        document.getElementById('weather-badge').textContent = weatherLabel[weather];
    }

    // Bus physics
    if (!bus.crashed) {
        const acc = keys['ArrowUp'] || keys['w'] || keys['W'];
        const brk = keys['ArrowDown'] || keys['s'] || keys['S'];
        const lt = keys['ArrowLeft'] || keys['a'] || keys['A'];
        const rt = keys['ArrowRight'] || keys['d'] || keys['D'];

        // Speed in rain slightly reduced
        const rainPenalty = weather === 'heavy_rain' ? 0.7 : weather === 'rain' ? 0.85 : 1;
        const topSpd = bus.maxSpeed * rainPenalty;

        if (acc) bus.speed = Math.min(topSpd, bus.speed + bus.accel * dt);
        else if (brk) bus.speed = Math.max(0, bus.speed - bus.brake * dt);
        else bus.speed = Math.max(0, bus.speed - bus.friction * dt);

        // Vertical lane movement
        if (lt) bus.laneTarget = Math.max(ROAD_Y + bus.h / 2 + 5, bus.laneTarget - 90 * dt);
        if (rt) bus.laneTarget = Math.min(ROAD_Y + ROAD_H - bus.h / 2 - 5, bus.laneTarget + 90 * dt);
        bus.y += (bus.laneTarget - bus.y) * 8 * dt;

        // Camera follows bus
        worldX += bus.speed * dt;
    } else {
        bus.crashTimer -= dt;
        bus.speed = Math.max(0, bus.speed - 300 * dt);
        if (bus.crashTimer <= 0) { bus.crashed = false; }
    }

    // Traffic cars
    trafficCars.forEach(c => {
        c.x += c.speed * dt;
        if (c.speed > 0 && c.x > worldX + W + 200) c.x = worldX - 200;
        if (c.speed < 0 && c.x < worldX - 200) c.x = worldX + W + 200;
    });

    // Signals
    signals.forEach(s => {
        s.timer -= dt;
        if (s.timer <= 0) { s.state = s.state === 'red' ? 'green' : 'red'; s.timer = s.max; }
    });

    // Bus stop pickup
    if (!bus.crashed) {
        busStops.forEach(stop => {
            if (stop.pickedUp) return;
            // BUG 1 FIX: Skip pickup at active destination stop — drop off first
            if (bus.destStop && bus.destStop.id === stop.id) return;
            const sx = stop.worldX - worldX + W * 0.25;
            const sy = ROAD_Y + ROAD_H + 2; // stop is below road
            const bx = bus.x, by = bus.y;
            const dist = Math.hypot(bx - sx, by - (ROAD_Y + ROAD_H * 0.48));
            if (dist < 80 && bus.speed < 30 && bus.passengers < bus.maxPass) {
                const boarding = Math.min(stop.waiting, bus.maxPass - bus.passengers);
                if (boarding > 0) {
                    bus.passengers += boarding;
                    stop.pickedUp = true;
                    earnings += boarding * 20;
                    showPopup(`+₹${boarding * 20} BOARDED!`, '#00E676');
                    updatePassIcons();
                    // assign destination stop
                    if (!bus.destStop) {
                        const future = busStops.filter(s2 => s2.worldX > stop.worldX + 200 && !s2.delivered);
                        bus.destStop = future[0] || null;
                        updateNextStop();
                    }
                }
            }
        });

        // Bus stop drop-off
        if (bus.destStop && bus.passengers > 0) {
            const dx = bus.destStop.worldX - worldX + W * 0.25;
            const dist = Math.abs(bus.x - dx);
            if (dist < 80 && bus.speed < 30) {
                earnings += bus.passengers * 50;
                delivered += bus.passengers;
                showPopup(`+₹${bus.passengers * 50} DELIVERED! 🎉`, '#FFD600');
                bus.destStop.delivered = true;
                bus.passengers = 0;
                bus.destStop = null;
                updatePassIcons();
                updateNextStop();
            }
        }
    }

    // Collision with traffic
    if (!bus.crashed) {
        trafficCars.forEach(c => {
            const cx = c.x - worldX + W * 0.25;
            const cy = c.lane === 'top' ? LANE1_Y : LANE3_Y;
            const bx = bus.x, by = bus.y;
            if (Math.abs(bx - cx) < (bus.w / 2 + c.w / 2 - 8) &&
                Math.abs(by - cy) < (bus.h / 2 + c.h / 2 - 6)) {
                bus.crashed = true;
                bus.crashTimer = 1.5;
                crashes++;
                earnings = Math.max(0, earnings - 10);
                flashScreen('rgba(255,50,0,0.45)');
                updateHUD();
                updateMiniMap();
            }
        });
    }

    // BUG 2 FIX: Red light penalty only once per crossing
    if (!bus.crashed && bus.speed > 40) {
        signals.forEach(s => {
            if (s.state !== 'red') { s.penalized = false; return; }
            const sx = s.worldX - worldX + W * 0.25;
            const inZone = Math.abs(bus.x - sx) < 40 && Math.abs(bus.y - LANE2_Y) < 40;
            if (inZone && !s.penalized) {
                s.penalized = true;
                earnings = Math.max(0, earnings - 10);
                flashScreen('rgba(255,0,0,0.25)');
                showPopup('-₹10 RED LIGHT!', '#FF3333');
            }
            if (!inZone) s.penalized = false;
        });
    }

    // Rain drops
    if (weather !== 'clear') {
        raindrops.forEach(r => {
            r.y += r.speed * dt;
            r.x -= 80 * dt;
            if (r.y > H) { r.y = -20; r.x = Math.random() * W; }
        });
    }

    updateHUD();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
    calcLayout();
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawBuildings();
    drawRoad();
    drawTrees();
    drawSignals();
    drawBusStops();
    drawNavigationArrow();
    drawTrafficCars();
    drawBus();
    drawGround();
    drawRain();
    if (weather !== 'clear') drawRainOverlay();
}

function drawNavigationArrow() {
    let target = bus.destStop;

    if (!target) {
        target = busStops.find(s => !s.pickedUp);
    }

    if (!target) return;

    const targetX = target.worldX - worldX + W * 0.25;

    if (targetX < 0 || targetX > W) {
        const arrowX = targetX < 0 ? 40 : W - 40;

        ctx.save();

        ctx.fillStyle = '#FFD600';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';

        ctx.fillText(
            targetX < 0 ? '⬅' : '➡',
            arrowX,
            100
        );

        ctx.font = '14px Arial';
        ctx.fillText(target.name, arrowX, 130);

        ctx.restore();
    }
}

function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, SKY_H);
    if (weather === 'clear') {
        g.addColorStop(0, '#1a6fa0'); g.addColorStop(1, '#87CEEB');
    } else if (weather === 'rain') {
        g.addColorStop(0, '#3a3a5c'); g.addColorStop(1, '#6a7a8a');
    } else {
        g.addColorStop(0, '#1a1a2e'); g.addColorStop(1, '#3a3a4e');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, SKY_H);

    // Sun or storm clouds
    if (weather === 'clear') {
        ctx.beginPath();
        ctx.arc(W * 0.82, SKY_H * 0.22, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#ffe87c';
        ctx.shadowColor = '#ffcc00'; ctx.shadowBlur = 50;
        ctx.fill(); ctx.shadowBlur = 0;
        // Clouds
        for (let i = 0; i < 4; i++) {
            const cx = ((i * 350 + (worldX * 0.05)) % W + 200) - 200;
            drawCloudShape(cx, 40 + i * 25, 100 + i * 30);
        }
    } else {
        // Storm clouds
        ctx.fillStyle = weather === 'heavy_rain' ? 'rgba(30,30,50,0.8)' : 'rgba(70,70,90,0.6)';
        for (let i = 0; i < 6; i++) {
            const cx = ((i * 220 + (worldX * 0.08)) % (W + 300)) - 150;
            ctx.beginPath();
            ctx.ellipse(cx, 30 + i * 15, 120, 40, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawCloudShape(x, y, w) {
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + 10, w * 0.22, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.55, y, w * 0.28, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.75, y + 8, w * 0.2, 12, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawBuildings() {
    buildings.forEach(b => {
        const sx = b.worldX - worldX + W * 0.25;
        if (sx < -200 || sx > W + 200) return;
        const bx = sx, by = SKY_H - b.h;
        ctx.fillStyle = b.color;
        ctx.fillRect(bx, by, b.w, b.h);
        b.windows.forEach(win => {
            const wx = bx + 5 + win.c * 18, wy = by + 8 + win.r * 22;
            if (wx + 12 > bx + b.w - 3) return;
            ctx.fillStyle = win.on ? 'rgba(255,240,150,0.75)' : 'rgba(30,40,60,0.6)';
            ctx.fillRect(wx, wy, 11, 13);
        });
        // Roof edge
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(bx, by, b.w, 4);
    });
}

function drawRoad() {
    // Road base
    const rg = ctx.createLinearGradient(0, ROAD_Y, 0, ROAD_Y + ROAD_H);
    rg.addColorStop(0, '#4a4a4a'); rg.addColorStop(0.5, '#555'); rg.addColorStop(1, '#3a3a3a');
    ctx.fillStyle = rg;
    ctx.fillRect(0, ROAD_Y, W, ROAD_H);

    // Road edges (curb)
    ctx.fillStyle = '#f0f0e0';
    ctx.fillRect(0, ROAD_Y - 3, W, 5);
    ctx.fillRect(0, ROAD_Y + ROAD_H - 2, W, 4);

    // Yellow center line
    ctx.strokeStyle = '#FFD600';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, ROAD_Y + ROAD_H * 0.5);
    ctx.lineTo(W, ROAD_Y + ROAD_H * 0.5);
    ctx.stroke();

    // Lane dashes (top)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([24, 18]);
    ctx.lineDashOffset = -(worldX * 0.5) % 42;
    ctx.beginPath();
    ctx.moveTo(0, ROAD_Y + ROAD_H * 0.28);
    ctx.lineTo(W, ROAD_Y + ROAD_H * 0.28);
    ctx.stroke();

    // Lane dashes (bot)
    ctx.lineDashOffset = (worldX * 0.5) % 42;
    ctx.beginPath();
    ctx.moveTo(0, ROAD_Y + ROAD_H * 0.72);
    ctx.lineTo(W, ROAD_Y + ROAD_H * 0.72);
    ctx.stroke();

    ctx.setLineDash([]); ctx.lineDashOffset = 0;

    // Bus lane highlight
    ctx.fillStyle = 'rgba(255,214,0,0.06)';
    ctx.fillRect(0, LANE2_Y - 18, W, 36);

    // BUS LANE label (repeating)
    ctx.fillStyle = 'rgba(255,214,0,0.22)';
    ctx.font = 'bold 11px Nunito';
    ctx.textAlign = 'center';
    for (let lx = 100; lx < W; lx += 280) {
        ctx.fillText('🚌 BUS LANE', lx, LANE2_Y + 5);
    }

    // Direction arrows on each lane
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '16px serif';
    // Top lane arrows (going right →)
    for (let ax = 80; ax < W; ax += 200) {
        ctx.fillText('→', ax, LANE1_Y + 5);
    }
    // Bus lane arrows (going right →)
    for (let ax = 150; ax < W; ax += 200) {
        ctx.fillStyle = 'rgba(255,214,0,0.25)';
        ctx.fillText('→', ax, LANE2_Y + 5);
    }
    // Bottom lane arrows (going left ←)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let ax = 80; ax < W; ax += 200) {
        ctx.fillText('←', ax, LANE3_Y + 5);
    }
    if (weather !== 'clear') {
        ctx.fillStyle = 'rgba(100,150,200,0.12)';
        ctx.fillRect(0, ROAD_Y, W, ROAD_H);
        // Puddle reflections
        for (let p = 0; p < 5; p++) {
            const px = ((p * 350 + worldX * 0.2) % W + 100) - 50;
            const py = ROAD_Y + ROAD_H * 0.4 + Math.sin(p) * 30;
            ctx.fillStyle = 'rgba(100,160,220,0.18)';
            ctx.beginPath();
            ctx.ellipse(px, py, 40 + p * 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawGround() {
    const gg = ctx.createLinearGradient(0, GROUND_Y, 0, H);
    if (weather === 'clear') {
        gg.addColorStop(0, '#5a8a4a'); gg.addColorStop(1, '#3a6a2a');
    } else {
        gg.addColorStop(0, '#3a5a32'); gg.addColorStop(1, '#2a4a22');
    }
    ctx.fillStyle = gg;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

    // Sidewalk
    ctx.fillStyle = weather === 'clear' ? '#c8b89a' : '#9a8a7a';
    ctx.fillRect(0, GROUND_Y, W, 18);
}

function drawTrees() {
    trees.forEach(t => {
        const sx = t.worldX - worldX + W * 0.25;
        if (sx < -60 || sx > W + 60) return;
        if (t.type === 'lamp') {
            // Lamp post
            ctx.fillStyle = '#666';
            ctx.fillRect(sx - 3, GROUND_Y + 18, 6, 55);
            ctx.fillStyle = '#fffde7';
            ctx.shadowColor = '#ffe'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.ellipse(sx, GROUND_Y + 18, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Tree
            ctx.fillStyle = '#5a3e1b';
            ctx.fillRect(sx - 5, GROUND_Y + 14, 10, 35);
            ctx.fillStyle = weather === 'clear' ? '#2d7a2d' : '#1d5a1d';
            ctx.beginPath(); ctx.arc(sx, GROUND_Y + 10, 22, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = weather === 'clear' ? '#3a9a3a' : '#2a7a2a';
            ctx.beginPath(); ctx.arc(sx - 8, GROUND_Y + 17, 15, 0, Math.PI * 2); ctx.fill();
        }
    });
}

function drawSignals() {
    signals.forEach(s => {
        const sx = s.worldX - worldX + W * 0.25;
        if (sx < -60 || sx > W + 100) return;
        // Pole
        ctx.fillStyle = '#666';
        ctx.fillRect(sx - 3, ROAD_Y - 70, 6, 70);
        // Box
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.roundRect(sx - 12, ROAD_Y - 72, 24, 42, 4); ctx.fill();
        // Lights
        const lc = { red: '#ff2222', yellow: '#ffcc00', green: '#00ff55' };
        ['red', 'yellow', 'green'].forEach((col, i) => {
            ctx.beginPath(); ctx.arc(sx, ROAD_Y - 66 + i * 13, 5.5, 0, Math.PI * 2);
            if ((s.state === 'red' && col === 'red') || (s.state === 'green' && col === 'green')) {
                ctx.fillStyle = lc[col]; ctx.shadowColor = lc[col]; ctx.shadowBlur = 12;
            } else { ctx.fillStyle = '#1a1a1a'; ctx.shadowBlur = 0; }
            ctx.fill(); ctx.shadowBlur = 0;
        });
    });
}

function drawBusStops() {
    busStops.forEach(stop => {
        const sx = stop.worldX - worldX + W * 0.25;
        if (sx < -80 || sx > W + 80) return;
        const sy = GROUND_Y;

        // Shelter
        ctx.fillStyle = stop.pickedUp ? 'rgba(100,100,100,0.5)' : stop.color;
        ctx.fillRect(sx - 18, sy + 4, 36, 28);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(sx - 18, sy + 4, 36, 5);

        // Sign post
        ctx.fillStyle = '#888';
        ctx.fillRect(sx - 2, sy + 18, 4, 30);

        // Stop name
        ctx.fillStyle = stop.pickedUp ? '#777' : '#fff';
        ctx.font = 'bold 9px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText(stop.name.slice(0, 7), sx, sy + 16);

        // Waiting passengers
        if (!stop.pickedUp) {

            ctx.font = '32px serif';

            ctx.fillText(
                '🧍',
                sx,
                sy - 15
            );
        }

        // Destination marker
        if (bus.destStop && bus.destStop.id === stop.id) {
            // Glowing circle
            ctx.fillStyle = 'rgba(0,230,118,0.18)';
            ctx.beginPath(); ctx.arc(sx, sy + 14, 32, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#00E676'; ctx.lineWidth = 3;
            ctx.shadowColor = '#00E676'; ctx.shadowBlur = 18;
            ctx.stroke(); ctx.shadowBlur = 0;

            // Big bouncing arrow above stop
            const bounce = Math.sin(Date.now() * 0.005) * 6;
            ctx.font = '28px serif';
            ctx.textAlign = 'center';
            ctx.fillText('⬇️', sx, sy - 10 + bounce);

            // DROP HERE text
            ctx.fillStyle = '#00E676';
            ctx.font = 'bold 11px Nunito';
            ctx.shadowColor = '#00E676'; ctx.shadowBlur = 10;
            ctx.fillText('DROP HERE', sx, sy - 42 + bounce);
            ctx.shadowBlur = 0;

            // Distance
            const dist = Math.abs(bus.x - sx);
            if (dist > 80) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px Nunito';
                ctx.fillText(Math.floor(dist) + 'm', sx, sy - 56 + bounce);
            }
        }
    });
}

function drawTrafficCars() {
    trafficCars.forEach(c => {
        const cx = c.x - worldX + W * 0.25;
        if (cx < -120 || cx > W + 120) return;
        const cy = c.lane === 'top' ? LANE1_Y : LANE3_Y;
        const flip = c.lane === 'bot';
        drawCarShape(cx, cy, c.w, c.h, c.color, flip, c.type);
    });
}

function drawBus() {
    const bx = bus.x, by = bus.y;

    if (bus.crashed) {
        ctx.save();
        ctx.translate(bx + (Math.random() - 0.5) * 6, by + (Math.random() - 0.5) * 4);
        drawBusShape(bx, by, true);
        // sparks
        for (let s = 0; s < 8; s++) {
            const a = (s / 8) * Math.PI * 2 + Date.now() * 0.012;
            const r = 20 + Math.sin(Date.now() * 0.04 + s) * 8;
            ctx.beginPath(); ctx.arc(bx + Math.cos(a) * r, by + Math.sin(a) * r, 3, 0, Math.PI * 2);
            ctx.fillStyle = s % 2 === 0 ? '#ff8800' : '#ffcc00';
            ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 10;
            ctx.fill(); ctx.shadowBlur = 0;
        }
        ctx.restore();
    } else {
        drawBusShape(bx, by, false);
        // exhaust puffs
        if (bus.speed > 30) {
            for (let e = 0; e < 2; e++) {
                ctx.beginPath();
                ctx.arc(bx - bus.w / 2 - 4 - e * 8, by + bus.h * 0.15, 4 + e * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,180,180,${0.25 - e * 0.08})`;
                ctx.fill();
            }
        }
        // Pickup glow when near stop
        busStops.forEach(stop => {
            if (stop.pickedUp) return;
            const sx = stop.worldX - worldX + W * 0.25;
            const dist = Math.hypot(bx - sx, by - LANE2_Y);
            if (dist < 90 && bus.speed < 30) {
                ctx.strokeStyle = 'rgba(0,230,118,0.4)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(bx, by, bus.w * 0.65, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }
}

function drawBusShape(bx, by, crashed) {
    const w = bus.w, h = bus.h;
    const x = bx - w / 2, y = by - h / 2;

    // Shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(bx + 5, by + h * 0.5 + 2, w * 0.45, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = crashed ? '#cc4400' : '#FFD600';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fill();

    // Bus stripe
    ctx.fillStyle = '#e65100';
    ctx.fillRect(x, y + h * 0.35, w, h * 0.12);

    // Windows
    ctx.fillStyle = 'rgba(180,230,255,0.65)';
    for (let wi = 0; wi < 4; wi++) ctx.fillRect(x + 8 + wi * 19, y + 4, 14, h * 0.28);

    // Windshield
    ctx.fillStyle = 'rgba(150,210,255,0.7)';
    ctx.fillRect(x + w - 14, y + 4, 10, h * 0.4);

    // Front bumper
    ctx.fillStyle = '#333';
    ctx.fillRect(x + w - 5, y + h * 0.6, 6, h * 0.25);

    // Wheels
    [[w * 0.18, h], [w * 0.75, h]].forEach(([wx, wy]) => {
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.ellipse(x + wx, y + wy - 4, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.ellipse(x + wx, y + wy - 4, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Headlights
    ctx.fillStyle = '#fffde7'; ctx.shadowColor = '#ffe'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.ellipse(x + w + 2, y + h * 0.65, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Tail lights
    ctx.fillStyle = '#ff2222'; ctx.shadowColor = '#f00'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.ellipse(x + 2, y + h * 0.65, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // BUS text
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.font = 'bold 9px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('BUS', bx - 10, by + 3);

    // Passenger count on bus
    if (bus.passengers > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.beginPath(); ctx.roundRect(bx - 14, y - 16, 28, 14, 4); ctx.fill();
        ctx.fillStyle = '#FFD600';
        ctx.font = 'bold 9px Nunito';
        ctx.fillText(`👤 x${bus.passengers}`, bx, y - 5);
    }
}

function drawCarShape(cx, cy, w, h, color, flip, type) {
    const x = cx - w / 2, y = cy - h / 2;
    ctx.save();
    if (flip) { ctx.translate(cx, cy); ctx.scale(-1, 1); ctx.translate(-cx, -cy); }

    // Shadow
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(cx + 4, cy + h * 0.5 + 1, w * 0.42, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(x, y + h * 0.2, w, h * 0.8, 4); ctx.fill();

    // Roof
    ctx.fillStyle = shadecol(color, -25);
    if (type === 'truck') {
        ctx.beginPath(); ctx.roundRect(x + 2, y + 3, w - 4, h * 0.3, 3); ctx.fill();
    } else {
        ctx.beginPath(); ctx.roundRect(x + w * 0.15, y + 4, w * 0.65, h * 0.28, 3); ctx.fill();
    }

    // Windshield
    ctx.fillStyle = 'rgba(150,210,255,0.55)';
    ctx.beginPath(); ctx.roundRect(x + w * 0.18, y + 6, w * 0.56, h * 0.2, 2); ctx.fill();

    // Wheels
    [[w * 0.18, h], [w * 0.78, h]].forEach(([wx, wy]) => {
        ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.ellipse(x + wx, y + wy - 3, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#555'; ctx.beginPath(); ctx.ellipse(x + wx, y + wy - 3, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Headlight
    ctx.fillStyle = '#fffde7'; ctx.shadowColor = '#ffe'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.ellipse(x + w + 1, y + h * 0.68, 4, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    ctx.restore();
}

function shadecol(hex, amt) {
    try {
        let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        r = Math.max(0, Math.min(255, r + amt)); g = Math.max(0, Math.min(255, g + amt)); b = Math.max(0, Math.min(255, b + amt));
        return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    } catch (e) { return hex; }
}

function drawRain() {
    if (weather === 'clear') return;
    ctx.strokeStyle = weather === 'heavy_rain' ? 'rgba(160,210,255,0.55)' : 'rgba(150,200,255,0.35)';
    ctx.lineWidth = 1;
    raindrops.forEach(r => {
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 5, r.y + r.len);
        ctx.stroke();
    });
}

function drawRainOverlay() {
    ctx.fillStyle = weather === 'heavy_rain' ? 'rgba(50,80,120,0.12)' : 'rgba(60,90,130,0.06)';
    ctx.fillRect(0, 0, W, H);
}

// ── HUD helpers ───────────────────────────────────────────────────────────────
function updateHUD() {
    document.getElementById('h-earn').textContent = '₹' + earnings;
    const ts = document.getElementById('h-time');
    ts.textContent = Math.ceil(timeLeft);
    ts.className = 'hud-val' + (timeLeft < 20 ? ' red' : timeLeft < 40 ? ' yellow' : '');
    document.getElementById('h-del').textContent = delivered;
    document.getElementById('h-crash').textContent = crashes;
}

function updatePassIcons() {
    for (let i = 0; i < 5; i++) {
        const el = document.getElementById('p' + i);
        el.className = 'pass-icon' + (i < bus.passengers ? ' on' : '');
    }
}

function updateNextStop() {
    const el = document.getElementById('next-stop');
    if (bus.destStop) {
        el.textContent = '📍 DROP AT: ' + bus.destStop.name;
        el.style.borderColor = '#FFD600';
        el.style.color = '#FFD600';
    } else {
        const next = busStops.find(s => !s.pickedUp && s.worldX > worldX);
        if (next) {
            el.textContent = '🚏 PICKUP AT: ' + next.name;
            el.style.borderColor = '#00E676';
            el.style.color = '#00E676';
        } else {
            el.textContent = '✅ ALL STOPS DONE!';
        }
    }

}

let popupTimeout;
function showPopup(text, color) {
    const el = document.getElementById('popup');
    el.textContent = text;
    el.style.color = color;
    el.style.borderColor = color;
    el.style.background = color.replace(')', ',0.15)').replace('rgb', 'rgba');
    el.style.opacity = '1';
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => el.style.opacity = '0', 1600);
}

function flashScreen(col) {
    const el = document.getElementById('flash');
    el.style.background = col; el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; el.style.background = 'transparent'; }, 300);
}

// ── Start / End ───────────────────────────────────────────────────────────────
function startGame() {
    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('restart-btn').style.display = 'block';
    document.getElementById('resume-btn').style.display = 'none';
    document.getElementById('play-btn').style.display = 'block';
    document.getElementById('overlay').style.display = 'none';
    gameRunning = true; paused = false;
    initGame();
    lastTime = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
}

function endGame() {
    gameRunning = false;
    cancelAnimationFrame(raf);
    const rating = earnings > 800 ? '⭐⭐⭐' : earnings > 400 ? '⭐⭐' : '⭐';
    document.getElementById('ov-earn').textContent = '₹' + earnings;
    document.getElementById('ov-del').textContent = delivered;
    document.getElementById('ov-crash').textContent = crashes;
    document.getElementById('ov-rating').textContent = rating;
    document.getElementById('ov-stats').style.display = 'flex';
    document.querySelector('#overlay h1').textContent = '⏱️ TIME UP!';
    document.getElementById('play-btn').textContent = 'DRIVE AGAIN!';
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('resume-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('next-stop').style.display = 'none';
}

// Idle preview draw
(function idleLoop() {
    if (!gameRunning) {
        calcLayout();
        ctx.clearRect(0, 0, W, H);
        // simple gradient preview
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#1a6fa0'); g.addColorStop(0.5, '#87CEEB');
        g.addColorStop(0.5, '#555'); g.addColorStop(0.75, '#555');
        g.addColorStop(0.75, '#5a8a4a'); g.addColorStop(1, '#3a6a2a');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        requestAnimationFrame(idleLoop);
    }
})();

function updateMiniMap() {

    const routeLength = 8000;

    document.getElementById("busMarker").style.left =
        Math.min(100, worldX / routeLength * 100) + "%";

    let target = bus.destStop ||
        busStops.find(s => !s.pickedUp);

    if (target) {
        document.getElementById("targetMarker").style.left =
            Math.min(100, target.worldX / routeLength * 100) + "%";
    }
}


function pauseGame() {
    if (!gameRunning) return;

    paused = true;

    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('resume-btn').style.display = 'block';

    document.getElementById('overlay').style.display = 'flex';
    document.querySelector('#overlay h1').textContent = '⏸ GAME PAUSED';
    document.getElementById('play-btn').style.display = 'none';
}

function resumeGame() {
    paused = false;

    document.getElementById('overlay').style.display = 'none';

    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('resume-btn').style.display = 'none';

    lastTime = performance.now();
}

function restartGame() {

    cancelAnimationFrame(raf);

    paused = false;
    gameRunning = true;

    document.getElementById('overlay').style.display = 'none';

    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('resume-btn').style.display = 'none';

    initGame();

    lastTime = performance.now();
    raf = requestAnimationFrame(loop);
}
// Make startGame available to HTML button
window.startGame = startGame;