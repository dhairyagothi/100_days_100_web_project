// --- FLUID SOLVER MATRIX CONFIGURATION ---
const SIZE = 64; // Discrete processing grid bounds (64x64 simulation matrix cells)
const iter = 4;  // Mathematical iterations for linear relaxation stability

// 1D Array storage matrices handling multi-variable field distributions
let s = new Float32Array(SIZE * SIZE);
let density = new Float32Array(SIZE * SIZE);

// Color channels for multi-color smoke
let colorR = new Float32Array(SIZE * SIZE);
let colorG = new Float32Array(SIZE * SIZE);
let colorB = new Float32Array(SIZE * SIZE);

let u = new Float32Array(SIZE * SIZE); // Horizontal velocity component
let v = new Float32Array(SIZE * SIZE); // Vertical velocity component

let u_prev = new Float32Array(SIZE * SIZE);
let v_prev = new Float32Array(SIZE * SIZE);
let obstacles = new Uint8Array(SIZE * SIZE); // Solid collision cell registry

// --- DOM BINDINGS & INPUT CAPTURES ---
const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');
const slideViscosity = document.getElementById('slide-viscosity');
const slideDamping = document.getElementById('slide-damping');
const slideStrength = document.getElementById('slide-strength');
const valViscosity = document.getElementById('val-viscosity');
const valDamping = document.getElementById('val-damping');
const valStrength = document.getElementById('val-strength');
const renderModeSelect = document.getElementById('render-mode');
const btnClear = document.getElementById('btn-clear');
const btnRainbow = document.getElementById('btn-rainbow');
const colorPicker = document.getElementById('smoke-color');
const fpsCounter = document.getElementById('fps-counter');

let currentMode = 'smoke'; // Interaction tracker: 'smoke' or 'obstacle'
let isMouseDown = false;
let isRainbowMode = false;
let rainbowHue = 0;
let frameCount = 0;
let lastFpsUpdate = performance.now();

// UI Control sync hooks
document.getElementById('btn-mode-smoke').addEventListener('click', (e) => { toggleMode('smoke', e.target); });
document.getElementById('btn-mode-obstacle').addEventListener('click', (e) => { toggleMode('obstacle', e.target); });
slideViscosity.addEventListener('input', () => valViscosity.textContent = slideViscosity.value);
slideDamping.addEventListener('input', () => valDamping.textContent = slideDamping.value);
slideStrength.addEventListener('input', () => valStrength.textContent = slideStrength.value);

// Color preset buttons
document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', function() {
        const color = this.dataset.color;
        colorPicker.value = color;
        document.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        isRainbowMode = false;
        btnRainbow.textContent = '🌈 Rainbow Mode';
    });
});

// Rainbow mode toggle
btnRainbow.addEventListener('click', function() {
    isRainbowMode = !isRainbowMode;
    this.textContent = isRainbowMode ? '🌈 Rainbow ON' : '🌈 Rainbow Mode';
    if (isRainbowMode) {
        document.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
    }
});

// Set default active color preset
document.querySelector('.color-preset[data-color="#38bdf8"]')?.classList.add('active');

function toggleMode(mode, targetElement) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    targetElement.classList.add('active');
}

// Map 2D spatial coordinates into local 1D typed array indexing
function IX(x, y) {
    x = Math.max(0, Math.min(x, SIZE - 1));
    y = Math.max(0, Math.min(y, SIZE - 1));
    return x + y * SIZE;
}

// Get current smoke color as RGB components
function getSmokeColor() {
    if (isRainbowMode) {
        // Cycle through rainbow colors
        rainbowHue = (rainbowHue + 0.5) % 360;
        const color = hslToRgb(rainbowHue, 100, 70);
        return { r: color[0] * 255, g: color[1] * 255, b: color[2] * 255 };
    }
    
    const hex = colorPicker.value;
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

// Helper: HSL to RGB conversion
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [r, g, b];
}

// --- MATHEMATICAL PHYSICS SIMULATION INTERFACES ---
// Handle boundary friction states or reflect velocity vectors on outer margins/obstacles
function set_bnd(b, xArr) {
    for (let i = 1; i < SIZE - 1; i++) {
        xArr[IX(i, 0)] = b === 2 ? -xArr[IX(i, 1)] : xArr[IX(i, 1)];
        xArr[IX(i, SIZE - 1)] = b === 2 ? -xArr[IX(i, SIZE - 2)] : xArr[IX(i, SIZE - 2)];
        xArr[IX(0, i)] = b === 1 ? -xArr[IX(1, i)] : xArr[IX(1, i)];
        xArr[IX(SIZE - 1, i)] = b === 1 ? -xArr[IX(SIZE - 2, i)] : xArr[IX(SIZE - 2, i)];
    }

    // Explicit cell-by-cell internal obstacle masking loop
    for (let y = 1; y < SIZE - 1; y++) {
        for (let x = 1; x < SIZE - 1; x++) {
            if (obstacles[IX(x, y)]) {
                // Deflect fluid vectors depending on matching axis channels
                if (b === 1) xArr[IX(x, y)] = -xArr[IX(x + (u[IX(x, y)] > 0 ? 1 : -1), y)];
                if (b === 2) xArr[IX(x, y)] = -xArr[IX(x, y + (v[IX(x, y)] > 0 ? 1 : -1))];
                if (b === 0) {
                    xArr[IX(x, y)] = 0; // Absorption for density tracking maps
                    // Also clear color for obstacles
                    colorR[IX(x, y)] = 0;
                    colorG[IX(x, y)] = 0;
                    colorB[IX(x, y)] = 0;
                }
            }
        }
    }
}

// Solve for fluid diffusion constraints using Gauss-Seidel iterative relaxation loops
function lin_solve(b, xArr, x0Arr, a, c) {
    const cRecip = 1.0 / c;
    for (let k = 0; k < iter; k++) {
        for (let j = 1; j < SIZE - 1; j++) {
            for (let i = 1; i < SIZE - 1; i++) {
                if (obstacles[IX(i, j)]) continue;
                xArr[IX(i, j)] = (x0Arr[IX(i, j)] + a * (
                    xArr[IX(i + 1, j)] +
                    xArr[IX(i - 1, j)] +
                    xArr[IX(i, j + 1)] +
                    xArr[IX(i, j - 1)]
                )) * cRecip;
            }
        }
        set_bnd(b, xArr);
    }
}

function diffuse(b, xArr, x0Arr, diff, dt) {
    let a = dt * diff * (SIZE - 2) * (SIZE - 2);
    lin_solve(b, xArr, x0Arr, a, 1 + 4 * a);
}

// Compute advection parameters tracking spatial grid interpolation changes
function advect(b, d, d0, velocityU, velocityV, dt) {
    let i0, i1, j0, j1;

    let dtx = dt * (SIZE - 2);
    let dty = dt * (SIZE - 2);

    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;

    let ifloat = parseFloat(SIZE - 2);
    let jfloat = parseFloat(SIZE - 2);

    for (let j = 1; j < SIZE - 1; j++) {
        for (let i = 1; i < SIZE - 1; i++) {
            if (obstacles[IX(i, j)]) continue;

            tmp1 = dtx * velocityU[IX(i, j)];
            tmp2 = dty * velocityV[IX(i, j)];
            x = parseFloat(i) - tmp1;
            y = parseFloat(j) - tmp2;

            if (x < 0.5) x = 0.5;
            if (x > ifloat + 0.5) x = ifloat + 0.5;
            i0 = Math.floor(x);
            i1 = i0 + 1.0;

            if (y < 0.5) y = 0.5;
            if (y > jfloat + 0.5) y = jfloat + 0.5;
            j0 = Math.floor(y);
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            let row1 = IX(i0, j0);
            let row2 = IX(i0, j1);
            let row3 = IX(i1, j0);
            let row4 = IX(i1, j1);

            d[IX(i, j)] =
                s0 * (t0 * d0[row1] + t1 * d0[row2]) +
                s1 * (t0 * d0[row3] + t1 * d0[row4]);
        }
    }
    set_bnd(b, d);
}

// Advect color channels separately
function advectColor(d, d0, velocityU, velocityV, dt) {
    let i0, i1, j0, j1;
    let dtx = dt * (SIZE - 2);
    let dty = dt * (SIZE - 2);
    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;
    let ifloat = parseFloat(SIZE - 2);
    let jfloat = parseFloat(SIZE - 2);

    for (let j = 1; j < SIZE - 1; j++) {
        for (let i = 1; i < SIZE - 1; i++) {
            if (obstacles[IX(i, j)]) continue;

            tmp1 = dtx * velocityU[IX(i, j)];
            tmp2 = dty * velocityV[IX(i, j)];
            x = parseFloat(i) - tmp1;
            y = parseFloat(j) - tmp2;

            if (x < 0.5) x = 0.5;
            if (x > ifloat + 0.5) x = ifloat + 0.5;
            i0 = Math.floor(x);
            i1 = i0 + 1.0;

            if (y < 0.5) y = 0.5;
            if (y > jfloat + 0.5) y = jfloat + 0.5;
            j0 = Math.floor(y);
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            let row1 = IX(i0, j0);
            let row2 = IX(i0, j1);
            let row3 = IX(i1, j0);
            let row4 = IX(i1, j1);

            // Advect each color channel
            d[IX(i, j)] =
                s0 * (t0 * d0[row1] + t1 * d0[row2]) +
                s1 * (t0 * d0[row3] + t1 * d0[row4]);
        }
    }
    set_bnd(0, d);
}

// Project step to enforce incompressibility (Mass Conservation alignment)
function project(velocityU, velocityV, p, div) {
    for (let j = 1; j < SIZE - 1; j++) {
        for (let i = 1; i < SIZE - 1; i++) {
            div[IX(i, j)] = -0.5 * (
                velocityU[IX(i + 1, j)] - velocityU[IX(i - 1, j)] +
                velocityV[IX(i, j + 1)] - velocityV[IX(i, j - 1)]
            ) / SIZE;
            p[IX(i, j)] = 0;
        }
    }

    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 4);

    for (let j = 1; j < SIZE - 1; j++) {
        for (let i = 1; i < SIZE - 1; i++) {
            velocityU[IX(i, j)] -= 0.5 * SIZE * (p[IX(i + 1, j)] - p[IX(i - 1, j)]);
            velocityV[IX(i, j)] -= 0.5 * SIZE * (p[IX(i, j + 1)] - p[IX(i, j - 1)]);
        }
    }

    set_bnd(1, velocityU);
    set_bnd(2, velocityV);
}

// Consolidate calculations step loops
function stepSimulation() {
    let viscosity = parseFloat(slideViscosity.value);
    let damping = parseFloat(slideDamping.value);
    let dt = 0.1;

    // Process Velocity components
    diffuse(1, u_prev, u, viscosity, dt);
    diffuse(2, v_prev, v, viscosity, dt);

    project(u_prev, v_prev, u, v);

    advect(1, u, u_prev, u_prev, v_prev, dt);
    advect(2, v, v_prev, u_prev, v_prev, dt);

    project(u, v, u_prev, v_prev);

    // Process Density fields
    diffuse(0, s, density, 0, dt);
    advect(0, density, s, u, v, dt);

    // Advect color channels
    advectColor(colorR, colorR, u, v, dt);
    advectColor(colorG, colorG, u, v, dt);
    advectColor(colorB, colorB, u, v, dt);

    // Apply global linear fade decay parameters to prevent overflow saturation
    for (let i = 0; i < density.length; i++) {
        density[i] *= damping;
        // Fade color with density
        colorR[i] *= damping;
        colorG[i] *= damping;
        colorB[i] *= damping;
    }
}

// --- INTERACTIVE VIEWPORT RENDERING MATRIX ---
function render() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / SIZE;
    const cellHeight = canvas.height / SIZE;
    const activeViewMode = renderModeSelect.value;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const idx = IX(x, y);

            if (obstacles[idx]) {
                ctx.fillStyle = '#475569'; // Highlight physical obstacle elements
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
                continue;
            }

            let dValue = density[idx];
            if (dValue < 0.01) continue;

            if (activeViewMode === 'density') {
                // Multi-color smoke trail rendering
                const r = Math.min(colorR[idx] / 100, 1.0);
                const g = Math.min(colorG[idx] / 100, 1.0);
                const b = Math.min(colorB[idx] / 100, 1.0);
                const alpha = Math.min(dValue / 150, 1.0);
                
                ctx.fillStyle = `rgba(${r * 255 | 0}, ${g * 255 | 0}, ${b * 255 | 0}, ${alpha})`;
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
            } else if (activeViewMode === 'color') {
                // Pure color intensity view
                const r = Math.min(colorR[idx] / 50, 1.0);
                const g = Math.min(colorG[idx] / 50, 1.0);
                const b = Math.min(colorB[idx] / 50, 1.0);
                const intensity = (r + g + b) / 3;
                
                if (intensity > 0.05) {
                    ctx.fillStyle = `rgba(${r * 255 | 0}, ${g * 255 | 0}, ${b * 255 | 0}, ${Math.min(intensity * 1.5, 1.0)})`;
                    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
                }
            } else {
                // Velocity magnitude vectors rendering (Thermal spectrum format)
                let speed = Math.sqrt(u[idx] * u[idx] + v[idx] * v[idx]);
                let hue = Math.min(speed * 4, 240);
                ctx.fillStyle = `hsla(${240 - hue}, 100%, 50%, ${Math.min(dValue / 50, 1.0)})`;
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
            }
        }
    }

    // Update FPS counter
    frameCount++;
    const now = performance.now();
    if (now - lastFpsUpdate >= 1000) {
        fpsCounter.textContent = `FPS: ${frameCount}`;
        frameCount = 0;
        lastFpsUpdate = now;
    }
}

// --- CAPTURE USER EVENT CONTROLS ---
function handleMouseInteraction(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseGridX = Math.floor(((e.clientX - rect.left) * scaleX) / (canvas.width / SIZE));
    const mouseGridY = Math.floor(((e.clientY - rect.top) * scaleY) / (canvas.height / SIZE));

    if (mouseGridX < 1 || mouseGridX > SIZE - 2 || mouseGridY < 1 || mouseGridY > SIZE - 2) return;

    const idx = IX(mouseGridX, mouseGridY);

    if (currentMode === 'obstacle') {
        obstacles[idx] = 1;
        density[idx] = 0;
        colorR[idx] = 0;
        colorG[idx] = 0;
        colorB[idx] = 0;
        u[idx] = 0;
        v[idx] = 0;
    } else {
        // Inject fluid mass with color
        const strength = parseFloat(slideStrength.value);
        const color = getSmokeColor();
        
        density[idx] += strength;
        colorR[idx] += color.r * 1.5;
        colorG[idx] += color.g * 1.5;
        colorB[idx] += color.b * 1.5;
        
        u[idx] += (e.movementX || 0) * 8;
        v[idx] += (e.movementY || 0) * 8;
    }
}

canvas.addEventListener('mousedown', (e) => { isMouseDown = true; handleMouseInteraction(e); });
canvas.addEventListener('mousemove', (e) => { if (isMouseDown) handleMouseInteraction(e); });
window.addEventListener('mouseup', () => isMouseDown = false);

btnClear.addEventListener('click', () => {
    density.fill(0); 
    u.fill(0); 
    v.fill(0); 
    u_prev.fill(0); 
    v_prev.fill(0); 
    s.fill(0);
    obstacles.fill(0);
    colorR.fill(0);
    colorG.fill(0);
    colorB.fill(0);
});

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- PROCESS TIMING ENGINE ---
function updateLoop() {
    stepSimulation();
    render();
    requestAnimationFrame(updateLoop);
}
requestAnimationFrame(updateLoop);