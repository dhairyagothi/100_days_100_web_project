
/**
 * NATIVE PERFORMANCE PROFILER & MEMORY MONITOR
 * Built from scratch using native browser Web APIs.
 * Toggle visibility using: Ctrl + Shift + P
 */
(function () {
    // Prevent duplicate instances if the script is loaded multiple times
    if (document.getElementById('native-perf-hud')) return;

    // ==========================================
    // 1. STATE MANAGEMENT
    // ==========================================
    let isDashboardVisible = true;
    let frameCount = 0;
    let lastTimestamp = performance.now();

    // ==========================================
    // 2. COMPONENT A: CREATING THE FLOATING UI HUD
    // ==========================================
    const hudContainer = document.createElement('div');
    hudContainer.id = 'native-perf-hud';

    // Style the overlay panel to float elegantly in the top-right corner
    Object.assign(hudContainer.style, {
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: '9999999', // Ensure it stays on top of all games/canvases
        backgroundColor: 'rgba(15, 20, 28, 0.92)', // Dark premium background
        color: '#00ffaa', // Matrix green text
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '12px 16px',
        borderRadius: '6px',
        border: '1px solid #1e293b',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        width: '220px',
        lineHeight: '1.6',
        pointerEvents: 'none', // Prevents mouse clicks from interfering with game controls
        transition: 'opacity 0.2s ease'
    });

    // Inject structural placeholders for live data indicators
    hudContainer.innerHTML = `
    <div style="border-bottom: 1px solid #1e293b; margin-bottom: 8px; padding-bottom: 4px; color: #64748b; font-size: 9px; letter-spacing: 1px; text-transform: uppercase;">
      Workspace Analytics
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>FPS (Rendering):</span> 
      <span id="hud-fps-val" style="color: #ffffff;">--</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>DOM Size:</span> 
      <span id="hud-dom-val" style="color: #ffffff;">--</span>
    </div>
    <div id="hud-mem-section" style="display: none; justify-content: space-between;">
      <span>JS Heap Used:</span> 
      <span id="hud-heap-val" style="color: #ffffff;">--</span>
    </div>
    <div style="font-size: 8px; color: #475569; font-weight: normal; margin-top: 8px; text-align: center; border-top: 1px dashed #1e293b; padding-top: 4px;">
      [Ctrl + Shift + P] Toggle Dashboard
    </div>
  `;

    document.body.appendChild(hudContainer);

    // Cache specific element nodes in memory so we don't query the DOM every single second
    const fpsElement = document.getElementById('hud-fps-val');
    const domElement = document.getElementById('hud-dom-val');
    const memorySection = document.getElementById('hud-mem-section');
    const heapElement = document.getElementById('hud-heap-val');

    // ==========================================
    // 3. ENGINE LOOP (COMPONENTS B, C, & D)
    // ==========================================
    function runProfilerLoop() {
        frameCount++; // Increment frame tracker on every single browser repaint redraw
        const currentTimestamp = performance.now();

        // Check if exactly 1000 milliseconds (1 second) have elapsed
        if (currentTimestamp >= lastTimestamp + 1000) {

            // COMPONENT B: Calculate Frames Per Second
            const calculatedFps = Math.round((frameCount * 1000) / (currentTimestamp - lastTimestamp));

            // COMPONENT D: Query total live elements in the layout tree
            const calculatedDomCount = document.getElementsByTagName('*').length;

            // Update UI panels with fresh tracking data if the overlay dashboard is visible
            if (isDashboardVisible) {

                // 1. Render FPS & dynamically apply warning colors based on performance drops
                fpsElement.textContent = `${calculatedFps} FPS`;
                if (calculatedFps < 45) {
                    fpsElement.style.color = '#ef4444'; // Red alert for severe animation jank/stutter
                } else if (calculatedFps < 55) {
                    fpsElement.style.color = '#f59e0b'; // Amber warning for minor drops
                } else {
                    fpsElement.style.color = '#10b981'; // Healthy green execution stability
                }

                // 2. Render DOM Node Accumulation Counter
                domElement.textContent = calculatedDomCount;
                if (calculatedDomCount > 3000) {
                    domElement.style.color = '#f59e0b'; // Warning: heavy DOM overhead can drag low-end mobile engines
                } else {
                    domElement.style.color = '#10b981';
                }

                // 3. COMPONENT C: Read Native Chromium JavaScript Garbage Collection Engine Memory
                if (performance.memory) {
                    memorySection.style.display = 'flex'; // Expose the panel metric row
                    const allocatedHeapMb = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);

                    heapElement.textContent = `${allocatedHeapMb} MB`;
                    // If a mini-game retains memory expanding over 180MB at idle, flag potential leak activity
                    if (parseFloat(allocatedHeapMb) > 180) {
                        heapElement.style.color = '#ef4444';
                    } else {
                        heapElement.style.color = '#10b981';
                    }
                }
            }

            // Reset intervals back to baseline to capture the upcoming one-second tracking cycle
            frameCount = 0;
            lastTimestamp = currentTimestamp;
        }

        // Keep recursively chaining calculations smoothly inside native animation frame loops
        requestAnimationFrame(runProfilerLoop);
    }

    // Fire up the tracking loop engine immediately
    requestAnimationFrame(runProfilerLoop);

    // ==========================================
    // 4. KEYBOARD INTERACTION TRIGGER
    // ==========================================
    window.addEventListener('keydown', (event) => {
        // Detect key sequence matches for [Ctrl + Shift + P]
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
            event.preventDefault(); // Halt any default browser shortcut overrides

            isDashboardVisible = !isDashboardVisible;
            hudContainer.style.display = isDashboardVisible ? 'block' : 'none';
        }
    });
})();