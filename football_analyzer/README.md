# football_analyzer/README.md

# Football Analyzer — Real-Time 2D Tactical Minimap Overlay

This is a demo implementation of a football analyzer with a real-time minimap overlay using OpenCV and Python.

## Features
- Real-time player position projection using Perspective Transformation (Homography)
- Modular structure: Tracker, ViewTransformer, and Utilities
- Draws a top-down minimap of the football field
- High-quality minimap visualization with pitch markings
- Seamless overlay on live video stream or webcam
- Updates every frame in real time

## How to Run
1. Install dependencies:
   ```bash
   pip install opencv-python numpy
   ```
2. Run the analyzer:
   ```bash
   python main.py
   ```
3. Press `q` to quit.

## To Do
- Integrate real YOLO player detection
- Use actual homography for perspective transform
- Connect to real football match video
- Improve minimap visuals

---
This is a minimal demo for advanced minimap overlay logic. Expand as needed for your project!
