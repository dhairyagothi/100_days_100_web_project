# Advanced Algorithmic Canvas & Memory-Profile Analytics

A sophisticated real-time visualization and profiling tool that demonstrates sorting algorithms with detailed performance analytics and memory profiling on an interactive canvas.

## Brief Description

This project provides an advanced algorithmic canvas that visualizes sorting operations (bubble sort) while capturing and displaying critical performance metrics including execution time, memory operations, render frame timing, and system telemetry. It's designed to help understand the performance characteristics of algorithms in a visually engaging and data-rich environment.

## Features

- **Real-time Algorithm Visualization** - Watch sorting algorithms execute with visual feedback on canvas
- **Performance Metrics Dashboard** - Track critical performance indicators:
  - Memory allocations and data size
  - Number of structural changes/operations
  - Render frame timing in milliseconds
  - Total execution duration with high precision (4 decimal places)
- **Memory Profile Analytics** - Monitor memory usage patterns during algorithm execution
- **Interactive Canvas Rendering** - Smooth, responsive visualization of data transformations
- **System Telemetry Logging** - Continuous event logging to track algorithm progression
- **One-Click Execution** - Trigger algorithm execution via interactive button control
- **Dynamic Array Generation** - Configurable array capacity for testing different data sizes

## Technologies Used

- **HTML5** - Page structure and semantic markup
- **CSS3** - Modern styling with CSS Variables, gradients, and responsive layout
- **JavaScript (ES6+)** - Algorithm implementation and DOM manipulation
- **Canvas API** - Hardware-accelerated graphics and animation
- **Performance API** - High-resolution timing measurements
- **Responsive Design** - Mobile and desktop compatible layouts

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/advanced-analytics-canvas
   ```

2. **Open in a web browser:**
   - Simply open `index.html` in any modern web browser
   - No additional dependencies or build tools required
   - Works offline without internet connectivity

3. **Alternative - Local server (recommended for smooth performance):**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Then navigate to: http://localhost:8000
   ```

## Usage Instructions

1. **Initialize the Application:**
   - Open the application in your browser
   - The interface displays the dashboard with metrics and control panel
   - Initial array of 100 items is pre-allocated and displayed

2. **Execute Algorithm:**
   - Click the "Fire Sorting Algorithm" button
   - Observe the canvas visualization updating in real-time
   - Monitor live metrics as the algorithm processes:
     - **Metric Size**: Total allocated items
     - **Metric Passes**: Number of structural changes made
     - **Metric Time**: Render frame timing
     - **Total Time**: Overall execution duration

3. **Analyze Results:**
   - Check the terminal log for detailed event tracking
   - Review performance metrics to understand algorithm behavior
   - Note the relationship between data size and execution time

4. **Repeat Analysis:**
   - Click the button again to run another sorting cycle
   - Compare metrics across different runs
   - Experiment with understanding memory allocation patterns

## Project Structure

```
advanced-analytics-canvas/
├── index.html          # Main application interface
├── app.js              # Application controller and event handlers
├── canvasEngine.js     # Canvas rendering and algorithm implementation
└── README.md           # This file
```

## Notes

- The application allocates a fixed array of 100 items for visualization
- Performance metrics are captured with sub-millisecond precision
- The canvas updates in real-time during algorithm execution
- All calculations run client-side with no server requirements
- Designed for educational purposes to understand algorithmic performance
