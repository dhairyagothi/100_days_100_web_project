# SoundWave Lab 🎹🔊

An advanced, browser-native interactive **Web Audio Synthesizer** and **Real-time Canvas Audio Visualizer** with high-fidelity sound processing and premium modern aesthetics.

## ✨ Features
- **Monophonic & Polyphonic Web Audio Synthesis**: Features real-time pitch calculation across dynamically modifiable octaves (Octaves 1 to 8).
- **Multiple Oscillator Shapes**: Supports Sine, Triangle, Sawtooth, and Square oscillator wave types.
- **Custom ADSR Envelope**: Intuitive controls for Attack, Decay, Sustain, and Release envelope variables.
- **Lowpass Filter**: Custom Biquad frequency cutoff & Q-resonance filtering node.
- **FX Echo Delay Line**: Creates a customized, feedback-supported audio delay loop.
- **WaveShaper Distortion Node**: Programmatic distortion (boost/drive curves) to add gritty analog-style warmth or heavy fuzz.
- **4-Pad Drum Synthesizer**: Programmatic synthesis of **Kick** (oscillator frequency pitch sweeps), **Snare** (lowpassed noise combined with a triangle transient note), **Hi-Hat** (highpassed white noise triggers), and **Clap** (multi-burst envelope triggers).
- **Interactive 2D Canvas Visualizers**: 
  - *Frequency Neon Bars*: Vibrant linear-gradients mapped to FFT data bins.
  - *Oscilloscope Waveform*: Smooth glowing time-domain canvas plot representing audio wave shape.
  - *Circular Particle Ring*: Radial spectrum circle that expands, contracts, and displays frequency peaks.
- **Built-in Demo Loop**: Triggers an automated baseline chord progression & drum beat sequence to instantly preview and test visualizer loops.
- **Computer Keyboard Support**: Map your normal keyboard keys to trigger synth notes & drum pads!

---

## ⌨️ Computer Keyboard Mappings

### Piano Keys
| Note | Keyboard Trigger | Note | Keyboard Trigger |
|------|------------------|------|------------------|
| **C**  | `A`              | **G#** | `Y`              |
| **C#** | `W`              | **A**  | `H`              |
| **D**  | `S`              | **A#** | `U`              |
| **D#** | `E`              | **B**  | `J`              |
| **E**  | `D`              | **C2** | `K`              |
| **F**  | `F`              |        |                  |
| **F#** | `T`              |        |                  |
| **G**  | `G`              |        |                  |

### Synth Drum Pads
* **Kick Drum**: `[1]`
* **Snare Drum**: `[2]`
* **Hi-Hat**: `[3]`
* **Clap**: `[4]`

---

## 🛠️ Web Audio API Routing Architecture
```
[Oscillators / Noise Sources] ---> [WaveShaper Distortion] ---> [Biquad Lowpass Filter] ---> [Delay FX loop]
                                                                        |                      |
                                                                        +-------> [Gain] <-----+
                                                                                    |
                                                                                    v
                                                                             [AnalyserNode]
                                                                                    |
                                                                                    v
                                                                            [Audio Output]
```

## 🚀 Quick Start
1. Open the project folder `public/SoundWave_Lab`.
2. Open `index.html` in your web browser (or use VS Code Live Server / standard static server).
3. Click the **Start Audio Engine** button.
4. Press piano keys, trigger drum pads, or hit the **Play Demo Beat** button to see and hear it in action!
