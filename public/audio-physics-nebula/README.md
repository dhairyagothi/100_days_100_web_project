# Audio-Reactive Particle Physics Sandbox

An immersive interactive physics simulation that combines audio synthesis with particle dynamics, creating a mesmerizing nebula visualization driven by real-time audio input and physics-based particle behavior.

## Brief Description

The Audio-Reactive Particle Physics Sandbox creates an interactive experience where audio frequencies drive particle physics simulations. Users can control gravitational coefficients, atmospheric friction, and audio synthesizer properties to create complex particle formations that respond in real-time to sound waves, producing a stunning visual and auditory experience.

## Features

- **Real-time Audio Synthesis** - Oscillator-based synthesizer with multiple waveform types:
  - Sawtooth (synthwave style)
  - Square (8-bit retro sound)
  - Sine (pure tone)
  - Triangle (soft chip-tune sound)
- **Physics-based Particle System** - Advanced physics simulation with:
  - Gravitational coefficient control
  - Atmospheric drag/friction adjustment
  - Real-time particle positioning and velocity
- **Audio-Reactive Visualization** - Particles respond to audio frequencies and amplitudes
- **Interactive Control Panel** - Live adjustment of physics and audio parameters
- **Live Telemetry Display** - Real-time monitoring of system state
- **Canvas-based Rendering** - Smooth, hardware-accelerated animation
- **Nebula Visualization** - Cyberpunk-themed interface with glowing effects
- **System Logging** - Debug information and performance metrics

## Technologies Used

- **HTML5** - Semantic page structure with embedded canvas
- **CSS3** - Advanced styling with:
  - CSS Variables for theming
  - Flexbox and Grid layouts
  - Glowing effects and animations
  - Dark cyberpunk aesthetic
- **JavaScript (ES6+)** - Physics engine and particle system
- **Web Audio API** - Real-time audio synthesis and frequency analysis
- **Canvas API** - Hardware-accelerated particle rendering
- **requestAnimationFrame** - Optimized animation loops

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/audio-physics-nebula
   ```

2. **Open in a web browser:**
   - Open `index.html` in any modern web browser with Web Audio API support
   - No build tools or dependencies required
   - Works on desktop and modern mobile browsers

3. **Alternative - Using local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/audio-physics-nebula
   ```

## Usage Instructions

1. **Launch the Application:**
   - Open `index.html` in your browser
   - The nebula arena initializes with the canvas display

2. **Start Audio Synthesis:**
   - The synthesizer begins generating audio automatically
   - Particles appear and begin responding to the audio

3. **Control Physics Parameters:**
   - **Gravitational Coefficient (G)**: Adjust from 0 to 2
     - Lower values = weak gravity, particles drift
     - Higher values = strong pull toward center
   - **Atmospheric Friction (DRAG)**: Adjust from 0.95 to 1
     - Lower values = more resistance, particles slow down
     - Higher values = less friction, particles move freely

4. **Modify Audio Synthesis:**
   - **Synth Oscillator Waveform**: Select different waveform types
     - SAWTOOTH: Bright, aggressive sound
     - SQUARE: Hollow, retro 8-bit sound
     - SINE: Pure, smooth tone
     - TRIANGLE: Soft, mellower sound
   - Observe how particle behavior changes with each waveform

5. **Explore Interactions:**
   - Adjust gravity while audio plays to see particle formation changes
   - Change friction to modify particle movement smoothness
   - Switch waveforms to hear and see audio reactivity differences
   - Combine multiple parameters for unique effects

6. **Monitor Telemetry:**
   - Check system logs for performance information
   - Observe particle count and rendering frame rates
   - Track audio frequency data as displayed in logs

## Project Structure

```
audio-physics-nebula/
├── index.html          # Main application interface and controls
├── app.js              # Application controller and particle system
├── styles.css          # Styling for cyberpunk aesthetic
└── README.md           # This file
```

## Technical Details

### Physics Simulation

The particle system implements:

- **Gravity Model**: F = G * m1 * m2 / r²
- **Velocity Integration**: Position updates using current velocity
- **Friction Model**: Velocity *= drag coefficient each frame
- **Boundary Conditions**: Particles wrap around canvas edges

### Audio Synthesis

Uses the Web Audio API with:

- **OscillatorNode**: Generates base waveforms
- **GainNode**: Controls volume and amplitude modulation
- **Frequency Analysis**: Real-time frequency data drives particle reactions
- **Synthesis Frequency**: Updates with particle system state

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+
- Requires Web Audio API support

## Notes

- Headphones recommended for best audio experience
- Works best with hardware-accelerated Canvas support
- Particle count may affect performance on lower-end devices
- All processing runs client-side with no external dependencies
- Designed for artistic visualization and educational purposes
