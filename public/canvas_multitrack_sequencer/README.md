## Multi-Track Timeline Video & Audio Editor

## Description
A high-performance, browser-native media sequencing workspace. It enables parallel multi-track composition of video and audio assets using the HTML5 Canvas API and MediaStream interfaces, featuring real-time timeline scrubbing, clip-level transformation controls, and frame-accurate export workflows—all within a zero-dependency vanilla JavaScript environment.

## Features
- Multi-track timeline sequencing (Video/Audio separation)
- Drag-and-drop asset loading with instant canvas binding
- Interactive clip trimming (start/end edge manipulation) with real-time preview
- Live canvas preview with native frame transformations (rotation, framing)
- Precision playback rate modifiers (0.5x, 1.0x, 1.5x, 2.0x)
- Direct-to-browser video export using the MediaRecorder API

## Technologies Used
- HTML5 (Canvas API, Video/Audio DOM Nodes, MediaStream API)
- CSS3 (Flexbox/Grid Layouts, CSS Variables for Theme Support)
- JavaScript ES6+ (Pointer Events, RequestAnimationFrame Loop, MediaRecorder API)

## How to Run
1. Navigate to the public/canvas_multitrack_sequencer/ directory in your local repository.
2. Open index.html directly in a modern web browser (Chrome, Firefox, or Edge recommended).
3. Click "Load assets" to import media, drag them into the timeline tracks, adjust your sequence, and click "Export Video" to generate your composition.