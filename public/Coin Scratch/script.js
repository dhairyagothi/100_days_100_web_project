document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('scratch-layer');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const coinWrapper = document.getElementById('coin-wrapper');
    const rewardContent = document.getElementById('reward');
    const instructionText = document.getElementById('scratch-instruction');
    const resetButton = document.getElementById('reset-btn');
    const customCursor = document.getElementById('custom-cursor');
    const recommendationCard = document.querySelector('.recommendation-card');

    let isDrawing = false;
    let hasScratched = false;
    let rewardState = 0; // 0: hidden, 1: heart visible, 2: full reward
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    // --- Procedural Audio Engine Variables ---
    let audioContext = null;
    let noiseSource = null;
    let bandpassFilter = null;
    let highpassFilter = null;
    let gainNode = null;
    let isAudioInitialized = false;

    /**
     * Lazy-initializes a single, shared Web Audio API context and node tree.
     */
    function initAudio() {
        if (isAudioInitialized) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContextClass();

            // 1. Generate procedural White Noise buffer (replaces deprecated ScriptProcessor)
            const bufferSize = 2 * audioContext.sampleRate; // 2 seconds of distinct noise
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const outputChannel = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                outputChannel[i] = Math.random() * 2 - 1;
            }

            // 2. Instantiate and loop the noise source node
            noiseSource = audioContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;

            // 3. Setup Bandpass Filter (handles core texture)
            bandpassFilter = audioContext.createBiquadFilter();
            bandpassFilter.type = 'bandpass';
            bandpassFilter.Q.value = 4.0; // High resonance for micro-metallic texture
            bandpassFilter.frequency.value = 1000;

            // 4. Setup Highpass Filter (eliminates muddy low end)
            highpassFilter = audioContext.createBiquadFilter();
            highpassFilter.type = 'highpass';
            highpassFilter.frequency.value = 1500;

            // 5. Setup Master Gain Control Node
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);

            // Connect nodes: Source -> Bandpass -> Highpass -> Master Gain -> Output
            noiseSource.connect(bandpassFilter);
            bandpassFilter.connect(highpassFilter);
            highpassFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Start playing the source immediately in complete silence
            noiseSource.start(0);
            isAudioInitialized = true;
        } catch (error) {
            console.error("Web Audio API not supported or initialization failed:", error);
        }
    }

    /**
     * Smoothly updates filters and gain levels based on physical scratch velocity
     */
    function modulateProceduralAudio(velocity) {
        if (!isAudioInitialized) return;

        // Clamp normal velocity bounds for mapping calculations
        const maxVelocity = 2.5; 
        const normalizedVelocity = Math.min(velocity / maxVelocity, 1.0);

        const now = audioContext.currentTime;

        if (normalizedVelocity > 0.02) {
            // Volume Modulation (Friction scale)
            const targetGain = 0.01 + (normalizedVelocity * 0.12);
            
            // Frequency Modulation (Texture profile adjustments)
            const targetBandpassFreq = 1100 + (normalizedVelocity * 1400); 
            const targetHighpassFreq = 1400 + (normalizedVelocity * 1100);

            // Apply parameter changes smoothly across time matrix to bypass audio pops
            gainNode.gain.setTargetAtTime(targetGain, now, 0.03);
            bandpassFilter.frequency.setTargetAtTime(targetBandpassFreq, now, 0.04);
            highpassFilter.frequency.setTargetAtTime(targetHighpassFreq, now, 0.04);
        } else {
            stopScratchSound();
        }
    }

    /**
     * Forces immediate clean, soft decay transition down to complete silence
     */
    function stopScratchSound() {
        if (isAudioInitialized && gainNode) {
            gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
        }
    }

    // --- Core UI & Canvas Logic ---
    function getStylePropertyValue(prop) {
        return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }

    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = coinWrapper.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        drawCoating(rect.width, rect.height);

        // Reset states
        hasScratched = false;
        rewardState = 0;
        instructionText.classList.remove('fade-out');
        rewardContent.style.opacity = '0';
        rewardContent.classList.remove('stage-1', 'stage-2');
        canvas.style.opacity = '1';
        canvas.style.pointerEvents = 'auto';
        stopScratchSound();
    }

    function drawCoating(width, height) {
        ctx.globalCompositeOperation = 'source-over';
        
        const coatingStart = getStylePropertyValue('--coating-start') || '#70291D';
        const coatingEnd = getStylePropertyValue('--coating-end') || '#3B1A14';

        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
        gradient.addColorStop(0, coatingStart);
        gradient.addColorStop(1, coatingEnd);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add subtle noise for texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 1.5;
            ctx.fillRect(x, y, size, size);
        }
    }

    function getEventCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    function startScratch(e) {
        // Initialize audio on the first user interaction
        if (!isAudioInitialized) {
            initAudio();
        }
        // Resume AudioContext if it was suspended (mobile Safari fix)
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        isDrawing = true;
        if (!hasScratched) {
            instructionText.classList.add('fade-out');
            hasScratched = true;
            // --- STAGE 1 REVEAL ---
            if (rewardState === 0) {
                rewardState = 1;
                rewardContent.style.opacity = '1';
                rewardContent.classList.add('stage-1');
            }
        }
        const coords = getEventCoordinates(e);
        [lastX, lastY] = [coords.x, coords.y];
        lastTime = performance.now();
    }

    function stopScratch() {
        isDrawing = false;
        stopScratchSound();
    }

    function scratch(e) {
        if (!isDrawing) return;

        const { x, y } = getEventCoordinates(e);
        const currentTime = performance.now();
        
        const dx = x - lastX;
        const dy = y - lastY;
        const deltaTime = Math.max(1, currentTime - lastTime); // Prevent divide by zero

        // Calculate velocity
        const distance = Math.hypot(dx, dy);
        if (distance < 0.5) return; // Ignore micro-movements

        const velocity = distance / deltaTime;

        // Modulate procedural audio dynamically based on velocity
        modulateProceduralAudio(velocity);

        // UI Drawing execution
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 6; // Slightly increased from 2
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
        lastTime = currentTime;

        checkScratchPercentage();
    }

    let checkTimeout;
    function checkScratchPercentage() {
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(() => {
            if (rewardState === 2) return; // Already fully revealed

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let transparentPixels = 0;

            for (let i = 3; i < data.length; i += 4) {
                if (data[i] < 128) { // Count partially and fully transparent pixels
                    transparentPixels++;
                }
            }

            const totalPixels = data.length / 4;
            const percentage = (transparentPixels / totalPixels) * 100;

            // --- STAGE 2 REVEAL ---
            if (percentage > 65 && rewardState === 1) {
                rewardState = 2;
                rewardContent.classList.add('stage-2');
                
                // Fade out the canvas completely
                canvas.style.opacity = '0';
                canvas.style.pointerEvents = 'none'; // Disable further scratching
                stopScratchSound();
            }
        }, 150);
    }

    function updateCursor(e) {
        const touch = e.touches ? e.touches[0] : e;
        customCursor.style.left = `${touch.clientX}px`;
        customCursor.style.top = `${touch.clientY}px`;
    }

    // Event Listeners
    window.addEventListener('resize', setupCanvas);
    resetButton.addEventListener('click', setupCanvas);

    // Mouse events
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopScratch);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startScratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); }, { passive: false });
    window.addEventListener('touchend', stopScratch);

    // Custom cursor events
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('touchmove', updateCursor);
    coinWrapper.addEventListener('mouseenter', () => customCursor.style.display = 'block');
    coinWrapper.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
        stopScratch(); // Ensure sound stops if mouse leaves while scratching
    });

    // Initial setup
    setupCanvas();

    // Handle recommendation card auto-dismiss on mobile/tablet
    if (window.matchMedia("(max-width: 768px)").matches && recommendationCard) {
        setTimeout(() => {
            recommendationCard.classList.add('fade-out');
            // After the transition, hide it completely to prevent interaction
            recommendationCard.addEventListener('transitionend', () => {
                recommendationCard.classList.add('hidden');
            }, { once: true });
        }, 3500);
    }
});