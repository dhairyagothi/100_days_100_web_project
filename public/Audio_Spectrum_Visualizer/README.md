# Resonance - Advanced Audio Spectrum Analyzer

A powerful real-time audio spectrum analyzer and visualizer with multiple rendering modes, advanced frequency analysis, and support for both live microphone input and audio file uploads.

## Brief Description

Resonance is a professional-grade web audio analyzer that provides real-time visualization of audio spectrums using various rendering styles including frequency bars, circular pulse patterns, and oscilloscope waveforms. It supports microphone input for live performance analysis and file uploads for pre-recorded audio, making it ideal for musicians, sound engineers, and audio enthusiasts.

## Features

- **Multiple Visualization Modes:**
  - Frequency Waves (Bar display)
  - Circular Pulse (Radial visualization)
  - Oscilloscope (Waveform display)
- **Audio Input Options:**
  - Live microphone input with permission handling
  - Audio file upload (MP3, WAV, FLAC, OGG, etc.)
  - Simultaneous switching between sources
- **Advanced Frequency Analysis:**
  - Adjustable FFT (Fast Fourier Transform) sizes: 128, 256, 512, 1024, 2048, 4096
  - Real-time frequency bin calculation
  - High-resolution spectrum data
- **Interactive Controls:**
  - Visualization style selector
  - FFT resolution adjustment
  - Frequency range controls
  - Amplitude scaling options
- **Visual Dashboard:**
  - High-performance canvas rendering
  - Smooth animations and transitions
  - Color-coded frequency displays
  - Real-time performance metrics
- **Professional Interface:**
  - Modern, intuitive design
  - Grouped control sections
  - Clear status indicators
  - Responsive layout

## Technologies Used

- **HTML5** - Semantic markup with audio controls and file input
- **CSS3** - Advanced styling with:
  - CSS Grid and Flexbox layouts
  - Gradient backgrounds
  - Responsive design patterns
  - Modern UI components
- **JavaScript (ES6+)** - Core audio analysis and visualization
- **Web Audio API** - Audio context, analyser nodes, and frequency data
- **Canvas API** - Real-time spectrum visualization rendering
- **requestAnimationFrame** - Optimized animation loop
- **getUserMedia API** - Microphone access (with permissions)

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/Audio_Spectrum_Visualizer
   ```

2. **Open in a web browser:**
   - Open `index.html` in a modern web browser
   - Browser must support Web Audio API and getUserMedia
   - Works on Chrome, Firefox, Safari, Edge (latest versions)
   - Note: HTTPS required for microphone access (or localhost for development)

3. **Alternative - Using local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/Audio_Spectrum_Visualizer
   ```

## Usage Instructions

1. **Launch the Application:**
   - Open `index.html` in your browser
   - The dashboard displays with input options and controls

2. **Choose Audio Source:**

   **Using Live Microphone:**
   - Click **"Use Live Microphone"** button
   - Grant microphone permissions when prompted
   - Audio visualization begins immediately

   **Using Audio File:**
   - Click **"Upload Audio File"** button
   - Select an audio file from your computer (MP3, WAV, FLAC, OGG, etc.)
   - File loads automatically and begins playing

3. **Select Visualization Style:**
   - **Frequency Waves (Bars)**: Traditional bar graph showing amplitude per frequency
   - **Circular Pulse (Radial)**: Concentric circles representing frequency bands
   - **Oscilloscope (Waveform)**: Time-domain waveform display

4. **Adjust FFT Resolution:**
   - Choose FFT size from dropdown (128 to 4096)
   - **128**: Lowest latency, coarser frequency detail
   - **4096**: Higher latency, finest frequency resolution
   - Higher values provide more detailed frequency information

5. **Additional Controls:**
   - Adjust frequency range filters if available
   - Modify amplitude scaling for different audio levels
   - Switch between visualization modes in real-time
   - Pause/resume audio playback with standard controls

## Project Structure

```
Audio_Spectrum_Visualizer/
├── index.html          # Main application interface
├── app.js              # Application controller and event handlers
├── style.css           # Styling and layout
└── README.md           # This file
```

## Technical Details

### Audio Analysis Pipeline

1. **Audio Context Creation** - Initializes Web Audio API context
2. **Source Selection** - Routes microphone or file audio through audio graph
3. **Analyser Node** - Performs real-time FFT analysis
4. **Data Extraction** - Retrieves frequency bin data from analyser
5. **Visualization Rendering** - Draws spectrum data to canvas

### Supported Audio Formats

- MP3 (MPEG-3)
- WAV (PCM)
- FLAC (Free Lossless Audio Codec)
- OGG (Vorbis)
- M4A (AAC)
- WebM (Opus/Vorbis)

### FFT Sizes and Characteristics

| Size | Frequency Resolution | Latency | Use Case |
|------|----------------------|---------|----------|
| 128  | 344 Hz (at 44.1kHz)  | Lowest  | Real-time response |
| 256  | 172 Hz               | Low     | Balanced analysis |
| 512  | 86 Hz                | Medium  | Detailed spectrum |
| 1024 | 43 Hz                | High    | Very detailed |
| 2048 | 21.5 Hz              | Very High | Fine frequency detail |
| 4096 | 10.75 Hz             | Maximum | Highest resolution |

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+
- **Note**: Microphone access requires HTTPS or localhost

## Performance Considerations

- Canvas rendering is hardware-accelerated
- Frame rate optimized with requestAnimationFrame
- Lower FFT sizes provide better real-time responsiveness
- Higher FFT sizes deliver finer frequency resolution but increased latency

## Notes

- All processing happens client-side with no server requirements
- Microphone access requires explicit user permission
- Audio file uploads are processed entirely in-browser
- No data is sent to external servers
- Perfect for live performance analysis, music production, and audio debugging
- Designed for both professional and casual audio enthusiasts
