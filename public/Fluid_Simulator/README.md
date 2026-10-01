# Fluid Simulator

A real-time Navier-Stokes based fluid dynamics simulator with interactive smoke injection, obstacle collision, and multiple rendering modes for visualizing fluid behavior.

## Description

AeroFlow is a browser-based Eulerian grid fluid simulator powered by Navier-Stokes equations. Inject colorful smoke into a 64×64 velocity and density grid, watch it advect and dissipate naturally, and draw obstacles to create turbulent flow patterns. Three rendering modes reveal different aspects of the simulation: smoke density fields, velocity magnitude (thermal coloring), and color intensity. Adjustable viscosity and damping parameters let you control fluid behavior from thick honey to thin air. Perfect for learning fluid dynamics, creating visual art, or just having fun with interactive physics.

## Features

- **Real-Time Navier-Stokes Solver**:
  - Eulerian grid approach (64×64 discrete cells)
  - Velocity advection with semi-Lagrangian integration
  - Diffusion step using Gauss-Seidel iterative solver
  - Incompressibility enforcement via pressure projection
  - 4 solver iterations per frame for stability
  
- **Two Interaction Modes**:
  - **Smoke Injection** (💨): Click and drag to inject colored smoke with velocity from mouse movement
  - **Obstacle Drawing** (🪨): Click and drag to paint static collision geometry that blocks fluid flow
  
- **Color System**:
  - Color picker for continuous color selection
  - 8 preset colors: Cyan, Red, Green, Yellow, Purple, Orange, Pink, White
  - Rainbow mode: Auto-cycling through HSL spectrum (0-360° hue per frame)
  - Color channels tracked separately (R, G, B) for realism
  
- **Rendering Modes**:
  - **Smoke Density Fields**: Multi-colored smoke visualization with alpha blending (opacity = density)
  - **Velocity Vectors (Thermal)**: Hue based on fluid speed; blue (slow) → red (fast)
  - **Color Intensity**: Pure color channel visualization, ignoring density
  
- **Simulation Parameters**:
  - **Fluid Viscosity** (0–0.001): Controls diffusion rate; higher = thicker, slower fluid
  - **Damping/Fade** (0.98–1.0): Global decay factor; 0.98 = rapid fade, 1.0 = no decay
  - **Injection Strength** (50–800): Mass added per mouse stroke; higher = denser smoke
  
- **Visual Feedback**:
  - Real-time FPS counter (green text, bottom-right)
  - Grid resolution indicator (64×64 GRID status)
  - Obstacles rendered as dark gray blocks (#475569)
  - Smooth color transitions from picker and presets
  - Rainbow mode toggle with state indicator
  
- **Advanced Features**:
  - Obstacle collision detection with velocity deflection
  - Bilinear interpolation for smooth advection
  - Separate color channel advection
  - Boundary condition handling (edge and obstacle masking)
  - Responsive canvas auto-resizing
  
- **Performance**:
  - Optimized Float32Array for fast numerical computation
  - Uint8Array for efficient obstacle tracking
  - GPU-accelerated Canvas rendering
  - Stable 60 FPS target with frame rate monitoring
  
- **Accessibility**: Labeled controls, clear mode buttons, semantic HTML, keyboard support

## Tech Stack

- **HTML5** — semantic structure, form inputs (range sliders, color picker, select), canvas element
- **CSS3** — CSS variables for theming, Flexbox/Grid layout, backdrop-filter (glass-morphism), smooth transitions, scrollbar styling
- **Vanilla JavaScript (ES6)** — Navier-Stokes solver, Eulerian grid simulation, event handling, canvas rendering, typed arrays (Float32Array, Uint8Array), HSL-to-RGB conversion

## Folder Structure

```text
Fluid_Simulator/
│
├── index.html       # UI structure — control panel, canvas viewport, status tags
├── app.js           # Navier-Stokes solver, physics simulation, rendering, interactions
├── style.css        # Glass-morphism design, responsive layout, dark theme
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Pure browser-based physics engine.

### Option 1: Open Directly
1. Navigate to the `Fluid_Simulator` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Starting the Simulator

1. **Open the Project**: Load index.html in browser
2. **Choose Interaction Mode**: 
   - Click 💨 **Inject Smoke** to draw smoke (default)
   - Click 🪨 **Draw Obstacles** to paint barriers
3. **Select Smoke Color**:
   - Use color picker for custom colors
   - Click preset color buttons for quick selection
   - Toggle 🌈 **Rainbow Mode** for auto-cycling colors

### Smoke Injection

**Basic Workflow**:
1. Ensure **Inject Smoke** mode is active
2. Click and drag on canvas to inject smoke
3. Smoke advects with velocity field and diffuses
4. Smoke fades over time (controlled by Damping)

**Physics**:
- **Starting Position**: Click location
- **Initial Velocity**: Derived from mouse movement speed (movementX, movementY)
- **Diffusion**: Spreads to neighbors based on viscosity (higher viscosity = more spread)
- **Advection**: Smoke follows velocity field and moves naturally
- **Decay**: Gradually fades each frame (damping factor)

**Color Behavior**:
- Color injected with smoke at full intensity
- Fades along with density using damping factor
- Each color channel (R, G, B) advects independently

### Obstacle Drawing

**Basic Workflow**:
1. Click 🪨 **Draw Obstacles** to switch modes
2. Click and drag on canvas to paint obstacles
3. Obstacles are solid gray blocks (#475569)
4. Smoke cannot enter obstacle cells
5. Velocity deflects around obstacles (boundary condition: velocity reversal)

**Obstacle Properties**:
- Static (don't move or dissipate)
- Opaque (block smoke and color)
- Velocity-deflecting (fluid bounces off)
- Persistent until reset (use 🔄 Reset button)

### Adjusting Simulation Parameters

**Fluid Viscosity** (0–0.001):
- **0 (left)**: No diffusion, smoke spreads sharply
- **0.0001 (default)**: Balanced spread
- **0.001 (right)**: Very thick, honey-like, spreads widely
- Higher viscosity = thicker fluid = slower flow = more spread

**Damping/Fade** (0.98–1.0):
- **0.98**: Rapid fading (~13% loss per frame, ~1.5s decay time)
- **0.995 (default)**: Moderate fading (~0.5% loss per frame, ~9s decay time)
- **1.0**: No decay, smoke stays forever (fills screen)
- Controls global dissipation for all density and color channels

**Injection Strength** (50–800):
- **50**: Minimal smoke added per stroke
- **350 (default)**: Moderate smoke
- **800**: Dense, thick smoke clouds
- Affects mass added to density field per mouse event

### Rendering Modes

Switch rendering via **Render Mode** dropdown:

1. **Smoke Density Fields** (default):
   - Shows multi-colored smoke trails
   - Color blends based on overlapping smoke
   - Alpha opacity driven by density (transparent → opaque)
   - Best for observing overall flow patterns

2. **Velocity Vectors (Thermal)**:
   - Color indicates flow speed (magnitude of velocity)
   - Blue: Slow/still fluid
   - Cyan/Green: Moderate flow
   - Red: Fast flow
   - Darker = less smoke (density), so slow areas appear less visible
   - Best for understanding velocity field behavior

3. **Color Intensity**:
   - Raw color channel values visualized
   - Ignores density, purely color-based
   - Useful for tracing color spread patterns
   - Shows color mixing and diffusion independently

### Control Panel Features

**Mode Toggles** (top):
- 💨 **Inject Smoke**: Add colored smoke to simulation
- 🪨 **Draw Obstacles**: Paint collision geometry
- Active mode highlighted with cyan glow

**Color Controls**:
- Color picker input: Select any RGB color
- 8 preset buttons: Quick access (Cyan, Red, Green, Yellow, Purple, Orange, Pink, White)
- Active preset shows white border and glow
- 🌈 **Rainbow Mode**: Toggle for auto-cycling spectrum

**Simulation Core Metrics**:
- Viscosity slider with real-time value display
- Damping slider with real-time value display
- Injection Strength slider with real-time value display
- All update simulation instantly

**Rendering Architecture**:
- Dropdown to switch between 3 visualization modes
- Changes apply immediately on next frame

**Action Buttons**:
- 🔄 **Reset Vector Fields**: Clears all smoke, velocity, color, and obstacles
- 🌈 **Rainbow Mode**: Toggles color auto-cycling (cycles hue 0-360° over time)

### Real-Time Monitoring

**Bottom-Right Corner**:
- **SOLVER ACTIVE: 64x64 GRID**: Shows grid resolution
- **FPS: XX**: Current frames per second (updated every second)
  - 60 = solid performance
  - Lower = performance issues or slow system

### Tips & Tricks

**Create Flowing Patterns**:
1. Set viscosity to 0.0001–0.0003
2. Use damping 0.99–0.995
3. Drag slowly to create laminar (smooth) flow
4. Drag quickly to create turbulent (chaotic) flow

**Paint with Obstacles**:
1. Switch to obstacle mode
2. Draw shapes: walls, circles, spirals
3. Inject smoke to see flow patterns around geometry
4. Reset and try new patterns

**Rainbow Waterfall Effect**:
1. Enable Rainbow Mode
2. Draw a horizontal wall near top
3. Draw vertical path below it
4. Inject smoke above wall
5. Smoke flows down in rainbow colors

**High-Viscosity Blob**:
1. Set viscosity to 0.0008
2. Set damping to 1.0 (no decay)
3. Inject smoke slowly
4. Creates coherent blobs that move together

## How It Works

### Eulerian Grid Simulation

```javascript
const SIZE = 64;  // 64×64 grid
let density = new Float32Array(SIZE * SIZE);   // Smoke mass per cell
let u = new Float32Array(SIZE * SIZE);         // Horizontal velocity
let v = new Float32Array(SIZE * SIZE);         // Vertical velocity
let obstacles = new Uint8Array(SIZE * SIZE);   // Solid collision map
```

**Why Eulerian?**: Fixed grid approach (not particle-based). Each cell stores velocity and density values. Fluid moves through the grid via advection.

### Core Simulation Loop

```javascript
function stepSimulation() {
  // 1. DIFFUSION: Spread velocity and density to neighbors
  diffuse(1, u_prev, u, viscosity, dt);
  diffuse(2, v_prev, v, viscosity, dt);
  
  // 2. PROJECTION: Enforce incompressibility (mass conservation)
  project(u_prev, v_prev, u, v);
  
  // 3. ADVECTION: Move velocity along its own field
  advect(1, u, u_prev, u_prev, v_prev, dt);
  advect(2, v, v_prev, u_prev, v_prev, dt);
  
  // 4. PROJECTION: Enforce incompressibility again
  project(u, v, u_prev, v_prev);
  
  // 5. ADVECT DENSITY: Move smoke along velocity field
  advect(0, density, s, u, v, dt);
  
  // 6. ADVECT COLOR: Move color channels separately
  advectColor(colorR, colorR, u, v, dt);
  advectColor(colorG, colorG, u, v, dt);
  advectColor(colorB, colorB, u, v, dt);
  
  // 7. DECAY: Apply global damping
  for (let i = 0; i < density.length; i++) {
    density[i] *= damping;
    colorR[i] *= damping;
    colorG[i] *= damping;
    colorB[i] *= damping;
  }
}
```

### Diffusion via Gauss-Seidel Iteration

```javascript
function lin_solve(b, xArr, x0Arr, a, c) {
  const cRecip = 1.0 / c;
  for (let k = 0; k < iter; k++) {  // iter = 4 iterations
    for (let j = 1; j < SIZE - 1; j++) {
      for (let i = 1; i < SIZE - 1; i++) {
        if (obstacles[IX(i, j)]) continue;
        
        // Laplacian stencil: average with 4 neighbors
        xArr[IX(i, j)] = (x0Arr[IX(i, j)] + a * (
            xArr[IX(i + 1, j)] +
            xArr[IX(i - 1, j)] +
            xArr[IX(i, j + 1)] +
            xArr[IX(i, j - 1)]
        )) * cRecip;
      }
    }
    set_bnd(b, xArr);  // Handle boundaries
  }
}
```

**How it works**: Each cell's new value = weighted average of itself and its 4 neighbors. Repeated 4 times until convergence. This simulates viscosity (spreading).

### Semi-Lagrangian Advection

```javascript
function advect(b, d, d0, velocityU, velocityV, dt) {
  for (let j = 1; j < SIZE - 1; j++) {
    for (let i = 1; i < SIZE - 1; i++) {
      // Backtrack: where did this cell's fluid come from?
      let x = i - dt * velocityU[IX(i, j)] * (SIZE - 2);
      let y = j - dt * velocityV[IX(i, j)] * (SIZE - 2);
      
      // Clamp to bounds
      if (x < 0.5) x = 0.5;
      if (x > SIZE - 1.5) x = SIZE - 1.5;
      if (y < 0.5) y = 0.5;
      if (y > SIZE - 1.5) y = SIZE - 1.5;
      
      // Bilinear interpolation: sample from 4 neighbors
      let i0 = Math.floor(x), i1 = i0 + 1;
      let j0 = Math.floor(y), j1 = j0 + 1;
      
      let s1 = x - i0, s0 = 1 - s1;
      let t1 = y - j0, t0 = 1 - t1;
      
      d[IX(i, j)] = 
          s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
          s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
    }
  }
}
```

**How it works**: For each cell, trace backwards along velocity field to find where fluid came from. Sample and interpolate that value. Stable and unconditionally convergent.

### Pressure Projection (Incompressibility)

```javascript
function project(velocityU, velocityV, p, div) {
  // Calculate divergence (how much fluid is "bunching up")
  for (let j = 1; j < SIZE - 1; j++) {
    for (let i = 1; i < SIZE - 1; i++) {
      div[IX(i, j)] = -0.5 * (
          velocityU[IX(i + 1, j)] - velocityU[IX(i - 1, j)] +
          velocityV[IX(i, j + 1)] - velocityV[IX(i, j - 1)]
      ) / SIZE;
      p[IX(i, j)] = 0;
    }
  }
  
  // Solve pressure using Gauss-Seidel (lin_solve)
  lin_solve(0, p, div, 1, 4);
  
  // Subtract pressure gradient from velocity (removes divergence)
  for (let j = 1; j < SIZE - 1; j++) {
    for (let i = 1; i < SIZE - 1; i++) {
      velocityU[IX(i, j)] -= 0.5 * SIZE * (p[IX(i + 1, j)] - p[IX(i - 1, j)]);
      velocityV[IX(i, j)] -= 0.5 * SIZE * (p[IX(i, j + 1)] - p[IX(i, j - 1)]);
    }
  }
}
```

**Why it matters**: Makes fluid incompressible (mass-conserving). Without it, fluid bunches up unrealistically. Done twice per step for accuracy.

### Boundary Conditions & Obstacles

```javascript
function set_bnd(b, xArr) {
  // Handle domain edges
  for (let i = 1; i < SIZE - 1; i++) {
    xArr[IX(i, 0)] = b === 2 ? -xArr[IX(i, 1)] : xArr[IX(i, 1)];  // Top
    xArr[IX(i, SIZE - 1)] = b === 2 ? -xArr[IX(i, SIZE - 2)] : xArr[IX(i, SIZE - 2)];  // Bottom
    xArr[IX(0, i)] = b === 1 ? -xArr[IX(1, i)] : xArr[IX(1, i)];  // Left
    xArr[IX(SIZE - 1, i)] = b === 1 ? -xArr[IX(SIZE - 2, i)] : xArr[IX(SIZE - 2, i)];  // Right
  }
  
  // Handle obstacles
  for (let y = 1; y < SIZE - 1; y++) {
    for (let x = 1; x < SIZE - 1; x++) {
      if (obstacles[IX(x, y)]) {
        if (b === 1) {
          // Velocity X: deflect based on neighboring cell velocity direction
          xArr[IX(x, y)] = -xArr[IX(x + (u[IX(x, y)] > 0 ? 1 : -1), y)];
        }
        if (b === 2) {
          // Velocity Y: deflect based on neighboring cell velocity direction
          xArr[IX(x, y)] = -xArr[IX(x, y + (v[IX(x, y)] > 0 ? 1 : -1))];
        }
        if (b === 0) {
          // Density/Color: clear (no smoke in obstacles)
          xArr[IX(x, y)] = 0;
          colorR[IX(x, y)] = 0;
          colorG[IX(x, y)] = 0;
          colorB[IX(x, y)] = 0;
        }
      }
    }
  }
}
```

**Edge Handling**: 
- `b = 0`: Density (absorbs at boundaries)
- `b = 1`: Horizontal velocity (reflects)
- `b = 2`: Vertical velocity (reflects)

**Obstacle Handling**:
- Velocity deflects (reverses direction)
- Density/color cleared (can't enter solid)

### Rendering Modes

```javascript
if (renderMode === 'density') {
  // Multi-color smoke visualization
  const r = Math.min(colorR[idx] / 100, 1.0);
  const g = Math.min(colorG[idx] / 100, 1.0);
  const b = Math.min(colorB[idx] / 100, 1.0);
  const alpha = Math.min(density[idx] / 150, 1.0);  // Density → opacity
  ctx.fillStyle = `rgba(${r*255|0}, ${g*255|0}, ${b*255|0}, ${alpha})`;
} else if (renderMode === 'velocity') {
  // Thermal (speed-based hue)
  let speed = Math.sqrt(u[idx] * u[idx] + v[idx] * v[idx]);
  let hue = Math.min(speed * 4, 240);
  ctx.fillStyle = `hsla(${240 - hue}, 100%, 50%, ${Math.min(density[idx] / 50, 1.0)})`;
}
```

### Color Cycling (Rainbow Mode)

```javascript
function getSmokeColor() {
  if (isRainbowMode) {
    rainbowHue = (rainbowHue + 0.5) % 360;  // Cycle 0-360° each frame
    const [r, g, b] = hslToRgb(rainbowHue, 100, 70);  // HSL → RGB
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  // Return color from picker
}
```

## Implementation Notes

- **Grid Indexing**: `IX(x, y) = x + y * SIZE` converts 2D to 1D array index for cache efficiency
- **Timestep**: Fixed `dt = 0.1` per frame for stability
- **Solver Iterations**: `iter = 4` iterations per diffusion step balances accuracy vs. speed
- **Damping Application**: Applied to all fields (density, velocity optional, color) each frame
- **Boundary Type Parameter**: `b` value (0, 1, 2) determines how boundaries reflect/absorb
- **Color Scaling**: Color values normalized by `/100` or `/50` for rendering; raw values stored in arrays
- **Density Threshold**: Cells with `density < 0.01` not rendered (performance optimization)
- **Mouse Handling**: `handleMouseInteraction()` is called on `mousedown` and `mousemove` events
- **Canvas Resize**: Auto-resizes on window resize to fill viewport

## Educational Value

This project demonstrates:

- **Navier-Stokes Equations**: Semi-implicit incompressible fluid simulation
- **Numerical Methods**: Gauss-Seidel iteration, bilinear interpolation, pressure projection
- **Grid-Based Physics**: Eulerian approach vs. particle-based (Lagrangian)
- **Advection Algorithms**: Semi-Lagrangian (unconditionally stable)
- **Diffusion**: Iterative Laplacian solver for viscous spreading
- **Incompressibility**: Pressure projection to enforce mass conservation
- **Boundary Conditions**: Handling domain edges and obstacle collisions
- **Color Space Conversion**: HSL ↔ RGB for rainbow effects
- **Performance Optimization**: Typed arrays, spatial indexing, avoiding allocations
- **Real-Time Rendering**: Canvas 2D API, pixel-by-pixel visualization
- **Event-Driven Interaction**: Mouse tracking, mode switching
- **Glass-Morphism Design**: CSS backdrop-filter, dark theme UI

## Common Scenarios

**Learning Fluid Dynamics**:
1. Start with default settings
2. Slowly drag to see laminar (smooth) flow
3. Quickly drag to see turbulence (chaos)
4. Adjust viscosity to see diffusion effects
5. Adjust damping to see decay rates

**Creating Art**:
1. Enable Rainbow Mode
2. Reduce damping to 0.98 for longer trails
3. Increase injection strength for density
4. Draw obstacles for composition
5. Experiment with different render modes

**Simulating Real-World Fluids**:
1. Honey: High viscosity (0.0008), low damping (1.0), thick injection
2. Water: Medium viscosity (0.0003), medium damping (0.995)
3. Smoke: Low viscosity (0.0001), high damping (0.99), light injection
4. Air: Minimal viscosity (0.0001), high damping (0.98), light injection

**Performance Testing**:
1. Watch FPS counter
2. Try larger viscosity for smooth, expensive computation
3. Try smaller viscosity for faster, more chaotic flow
4. Monitor FPS to understand solver cost

## Future Enhancements

Potential improvements:

- **Multi-Resolution Grids**: Variable 32×32, 128×128, 256×256 for speed vs. detail tradeoff
- **FLIP/PIC Hybrid**: Combine Eulerian (this project) with particle tracking
- **Temperature Field**: Heat-driven buoyancy for realistic smoke behavior
- **Pressure Visualization**: Render pressure field separately
- **Vorticity Confinement**: Enhance small-scale swirling motion
- **Custom Geometry**: Upload obstacle patterns from image
- **Particle Emitters**: Fixed spray sources instead of mouse control
- **Velocity Display**: Vector arrows showing flow direction
- **Audio Reactivity**: Sound input drives simulation intensity
- **Export Video**: Record and download simulation as MP4/GIF
- **Presets**: Save/load favorite viscosity/damping configs
- **3D Visualization**: WebGL renderer for 3D fluid (more complex)
- **GPU Acceleration**: WebGL shaders for real-time larger grids (256×256+)
- **Simulation Speed Control**: Pause, slow-motion, frame-step
- **Analytics**: Plot viscosity vs. spread rate, measure coherence

## Browser Compatibility

Works on all modern browsers supporting:
- Canvas 2D API
- TypedArrays (Float32Array, Uint8Array)
- ES6 JavaScript (arrow functions, const/let)
- CSS Grid and Flexbox
- CSS backdrop-filter (blur effect)

**Tested on**: Chrome, Firefox, Safari, Edge

**Not supported**: IE11 (lacks typed arrays, backdrop-filter)

## Accessibility

- **Semantic HTML**: `<button>`, `<input>`, `<select>` elements
- **Labeled Controls**: All sliders and inputs have descriptive labels
- **Mode Buttons**: Clear visual distinction (active = cyan glow + text)
- **Color Presets**: Visual buttons matching color swatches
- **Keyboard Support**: Focus navigation via Tab key
- **Real-Time Feedback**: Value displays update as sliders move
- **High Contrast**: Dark background with bright text and glow effects
- **Monospace Status Tags**: GRID and FPS info clear and legible

## Performance Notes

- **Lightweight**: 64×64 grid is manageable on all systems (maintains 60 FPS)
- **Typed Arrays**: Float32Array ~4MB, Uint8Array ~4KB for obstacle map
- **No Allocations**: Reuse arrays instead of creating new ones each frame
- **Canvas Drawing**: Pixel-by-pixel rendering via `fillRect()` (optimized by browser)
- **No Shader Compilation**: Pure CPU-based solver (not GPU, but portable)
- **Frame Rate Monitoring**: FPS counter shows actual performance

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
