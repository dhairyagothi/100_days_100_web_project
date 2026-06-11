# AeroFlow

AeroFlow is a real-time Navier-Stokes fluid dynamics simulator that lets you inject smoke, draw obstacles, and watch the flow evolve across a 2D grid.

## Features

- Smoke injection and obstacle drawing modes
- Adjustable viscosity and damping controls
- Density and velocity render modes
- Reset controls for clearing the simulation
- Canvas-based real-time rendering

## How to Use

1. Choose an interaction mode.
2. Adjust the simulation controls if needed.
3. Paint smoke or obstacles into the canvas.
4. Switch render modes to inspect density or velocity behavior.

## Files

- `index.html` - UI layout and controls
- `style.css` - Visual styling
- `app.js` - Fluid solver and rendering logic

## Notes

- The simulator uses a 64x64 processing grid.
- All interaction happens directly in the browser canvas.
