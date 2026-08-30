/**
 * Procedural Terrain Generator
 */

// --- Settings Management (Biome Colors) ---
const DEFAULT_COLORS = {
    deep_ocean: '#1E3A8A',
    ocean: '#2563EB',
    shallow: '#60A5FA',
    sand: '#FCD34D',
    grass: '#34D399',
    forest: '#059669',
    rock: '#78716C',
    snow: '#F8FAFC'
};

function getSetting(key) {
    const val = localStorage.getItem('ptg_' + key);
    return val ? val : DEFAULT_COLORS[key];
}

function setSetting(key, value) {
    localStorage.setItem('ptg_' + key, value);
}

// Map setting ID to keys
const colorMap = {
    'color-deep-ocean': 'deep_ocean',
    'color-ocean': 'ocean',
    'color-shallow': 'shallow',
    'color-sand': 'sand',
    'color-grass': 'grass',
    'color-forest': 'forest',
    'color-rock': 'rock',
    'color-snow': 'snow'
};

// --- Settings Page Logic ---
if (window.location.pathname.includes('settings.html')) {
    
    // Initialize inputs
    for (const [id, key] of Object.entries(colorMap)) {
        const input = document.getElementById(id);
        if (input) {
            input.value = getSetting(key);
            input.addEventListener('change', (e) => {
                setSetting(key, e.target.value);
            });
        }
    }

    const btnReset = document.getElementById('btn-reset-colors');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            for (const [id, key] of Object.entries(colorMap)) {
                setSetting(key, DEFAULT_COLORS[key]);
                document.getElementById(id).value = DEFAULT_COLORS[key];
            }
        });
    }
}


// --- Generator Logic ---
if (window.location.pathname.includes('generator.html')) {
    
    // --- Simplex Noise Implementation in Vanilla JS ---
    // A fast 2D simplex noise algorithm based on Stefan Gustavson's implementation.
    class SimplexNoise {
        constructor(seed = 1) {
            this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                          [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                          [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
            
            // Seeded PRNG (Mulberry32)
            let a = typeof seed === 'string' ? this.hashString(seed) : seed;
            
            const random = () => {
                let t = a += 0x6D2B79F5;
                t = Math.imul(t ^ t >>> 15, t | 1);
                t ^= t + Math.imul(t ^ t >>> 7, t | 61);
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };

            this.p = new Uint8Array(256);
            for (let i = 0; i < 256; i++) {
                this.p[i] = i;
            }
            
            // Shuffle
            for (let i = 0; i < 255; i++) {
                const r = i + ~~(random() * (256 - i));
                const aux = this.p[i];
                this.p[i] = this.p[r];
                this.p[r] = aux;
            }

            this.perm = new Uint8Array(512);
            this.permMod12 = new Uint8Array(512);
            for (let i = 0; i < 512; i++) {
                this.perm[i] = this.p[i & 255];
                this.permMod12[i] = (this.perm[i] % 12);
            }
        }

        hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            return hash;
        }

        noise2D(xin, yin) {
            const permMod12 = this.permMod12;
            const perm = this.perm;
            const grad3 = this.grad3;
            let n0=0, n1=0, n2=0;

            const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
            const s = (xin + yin) * F2;
            const i = Math.floor(xin + s);
            const j = Math.floor(yin + s);

            const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
            const t = (i + j) * G2;
            const X0 = i - t;
            const Y0 = j - t;
            const x0 = xin - X0;
            const y0 = yin - Y0;

            let i1, j1;
            if (x0 > y0) { i1 = 1; j1 = 0; }
            else { i1 = 0; j1 = 1; }

            const x1 = x0 - i1 + G2;
            const y1 = y0 - j1 + G2;
            const x2 = x0 - 1.0 + 2.0 * G2;
            const y2 = y0 - 1.0 + 2.0 * G2;

            const ii = i & 255;
            const jj = j & 255;
            const gi0 = permMod12[ii + perm[jj]];
            const gi1 = permMod12[ii + i1 + perm[jj + j1]];
            const gi2 = permMod12[ii + 1 + perm[jj + 1]];

            let t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) n0 = 0.0;
            else {
                t0 *= t0;
                n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
            }

            let t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) n1 = 0.0;
            else {
                t1 *= t1;
                n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
            }

            let t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) n2 = 0.0;
            else {
                t2 *= t2;
                n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
            }

            // Return value between -1 and 1
            return 70.0 * (n0 + n1 + n2);
        }
    }


    // --- DOM Elements ---
    const canvas = document.getElementById('terrain-canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas Size
    const WIDTH = 600;
    const HEIGHT = 600;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Controls
    const inputSeed = document.getElementById('input-seed');
    const btnRandomSeed = document.getElementById('btn-random-seed');
    
    const sliderScale = document.getElementById('slider-scale');
    const valScale = document.getElementById('val-scale');
    
    const sliderOctaves = document.getElementById('slider-octaves');
    const valOctaves = document.getElementById('val-octaves');
    
    const sliderPersistence = document.getElementById('slider-persistence');
    const valPersistence = document.getElementById('val-persistence');
    
    const sliderLacunarity = document.getElementById('slider-lacunarity');
    const valLacunarity = document.getElementById('val-lacunarity');
    
    const sliderSeaLevel = document.getElementById('slider-sealevel');
    const valSeaLevel = document.getElementById('val-sealevel');

    const toggleFalloff = document.getElementById('toggle-falloff');
    
    const btnGenerate = document.getElementById('btn-generate');
    const btnDownload = document.getElementById('btn-download');

    // --- State & Config ---
    let biomes = {};
    
    // Parse hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r:0, g:0, b:0};
    }

    function loadBiomes() {
        biomes = {
            deep_ocean: hexToRgb(getSetting('deep_ocean')),
            ocean: hexToRgb(getSetting('ocean')),
            shallow: hexToRgb(getSetting('shallow')),
            sand: hexToRgb(getSetting('sand')),
            grass: hexToRgb(getSetting('grass')),
            forest: hexToRgb(getSetting('forest')),
            rock: hexToRgb(getSetting('rock')),
            snow: hexToRgb(getSetting('snow'))
        };
    }

    // --- Terrain Logic ---
    function generateTerrain() {
        loadBiomes();
        
        const seed = inputSeed.value;
        const scale = parseFloat(sliderScale.value);
        const octaves = parseInt(sliderOctaves.value);
        const persistence = parseFloat(sliderPersistence.value);
        const lacunarity = parseFloat(sliderLacunarity.value);
        const seaLevelMod = parseFloat(sliderSeaLevel.value);
        const applyFalloff = toggleFalloff.checked;

        const simplex = new SimplexNoise(seed);
        
        const imgData = ctx.createImageData(WIDTH, HEIGHT);
        const data = imgData.data;

        // Optimization: track min/max for normalization
        let minNoise = Infinity;
        let maxNoise = -Infinity;

        // Calculate noise map
        const noiseMap = new Float32Array(WIDTH * HEIGHT);

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                
                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;

                // Fractal Brownian Motion
                for (let i = 0; i < octaves; i++) {
                    const sampleX = x / scale * frequency;
                    const sampleY = y / scale * frequency;
                    
                    // simplex.noise2D returns roughly -1 to 1
                    const simplexValue = simplex.noise2D(sampleX, sampleY);
                    noiseHeight += simplexValue * amplitude;

                    amplitude *= persistence;
                    frequency *= lacunarity;
                }

                if (noiseHeight > maxNoise) maxNoise = noiseHeight;
                if (noiseHeight < minNoise) minNoise = noiseHeight;
                
                noiseMap[y * WIDTH + x] = noiseHeight;
            }
        }

        // Render pass
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                let idx = (y * WIDTH + x) * 4;
                let noiseHeight = noiseMap[y * WIDTH + x];

                // Normalize 0 to 1
                let normalizedHeight = (noiseHeight - minNoise) / (maxNoise - minNoise);

                // Island Falloff map
                if (applyFalloff) {
                    // Normalize coords to -1 .. 1
                    const nx = 2 * x / WIDTH - 1;
                    const ny = 2 * y / HEIGHT - 1;
                    
                    // Circular falloff
                    const distance = Math.sqrt(nx * nx + ny * ny);
                    
                    // Function to map distance to falloff value (e.g., strong near edges)
                    const falloffValue = Math.max(0, distance - 0.2) * 1.5; 
                    
                    normalizedHeight = normalizedHeight - falloffValue;
                    normalizedHeight = Math.max(0, Math.min(1, normalizedHeight));
                }

                // Apply sea level modifier
                normalizedHeight += seaLevelMod;
                normalizedHeight = Math.max(0, Math.min(1, normalizedHeight));

                // Determine Biome
                let color;
                if (normalizedHeight < 0.1) color = biomes.deep_ocean;
                else if (normalizedHeight < 0.25) color = biomes.ocean;
                else if (normalizedHeight < 0.35) color = biomes.shallow;
                else if (normalizedHeight < 0.40) color = biomes.sand;
                else if (normalizedHeight < 0.60) color = biomes.grass;
                else if (normalizedHeight < 0.75) color = biomes.forest;
                else if (normalizedHeight < 0.90) color = biomes.rock;
                else color = biomes.snow;

                data[idx] = color.r;
                data[idx + 1] = color.g;
                data[idx + 2] = color.b;
                data[idx + 3] = 255;
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }


    // --- Event Listeners ---
    function updateDisplay(slider, valSpan) {
        slider.addEventListener('input', () => {
            valSpan.textContent = slider.value;
            // For real-time generation on slider move (can be laggy, so we do it on change)
        });
        slider.addEventListener('change', generateTerrain);
    }

    updateDisplay(sliderScale, valScale);
    updateDisplay(sliderOctaves, valOctaves);
    updateDisplay(sliderPersistence, valPersistence);
    updateDisplay(sliderLacunarity, valLacunarity);
    updateDisplay(sliderSeaLevel, valSeaLevel);
    toggleFalloff.addEventListener('change', generateTerrain);

    btnRandomSeed.addEventListener('click', () => {
        // Generate random string
        inputSeed.value = Math.random().toString(36).substring(2, 8).toUpperCase();
        generateTerrain();
    });

    btnGenerate.addEventListener('click', generateTerrain);
    inputSeed.addEventListener('change', generateTerrain);

    btnDownload.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `terrain_${inputSeed.value}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    // Boot
    generateTerrain();
}
