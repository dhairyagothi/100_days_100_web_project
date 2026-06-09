document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('scratch-layer');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const coinWrapper = document.getElementById('coin-wrapper');
    const rewardContent = document.getElementById('reward');
    const instructionText = document.getElementById('scratch-instruction');
    const resetButton = document.getElementById('reset-btn');
    const customCursor = document.getElementById('custom-cursor');
    const recommendationCard = document.querySelector('.recommendation-card');
    const brushSizeSlider = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    const rewardText = rewardContent.querySelector('.reward-text');
    const scratchProgressValue = document.getElementById('scratch-progress-value');
    
    // Theme Switcher Elements
    const themeSelect = document.getElementById('theme-select');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');

    // --- Dynamic Theme Configurations ---
    const themeConfigs = {
        gold: {
            rewards: ['₹10', '₹50', '₹100', '₹500', '🎁 Free Gift', '❤️ You Did It', '😔 Better Luck'],
            audioFreqOffset: 1100, // Standard metallic friction profile
            audioQ: 4.0
        },
        silver: {
            rewards: ['🥈 Silver Token', '🥈 50 Coins', '🥈 100 Coins', '🥈 Premium Pass'],
            audioFreqOffset: 1600, // Higher-pitched metallic resonance
            audioQ: 5.5
        },
        bronze: {
            rewards: ['🥉 Bronze Entry', '🥉 5 Coins', '🥉 10 Coins', '🥉 Try Harder'],
            audioFreqOffset: 800,  // Deeper, rougher metal rasp
            audioQ: 3.0
        },
        diamond: {
            rewards: ['💎 Jackpot!', '💎 Crystal Key', '💎 VIP Status', '💎 10,000 Coins'],
            audioFreqOffset: 2400, // Pristine, crystalline glass-like scraping
            audioQ: 7.0
        },
        christmas: {
            rewards: ['🎄 Santa Pack', '🦌 Rudolph Gift', '❄️ Winter Bonus', '🍬 Candy Cane'],
            audioFreqOffset: 1400, // Crunchy, packed-snow micro-texture
            audioQ: 2.5
        },
        halloween: {
            rewards: ['🎃 Spooky Treat', '👻 Ghost Box', '🦇 Bat Upgrade', '🍬 Candy Trick'],
            audioFreqOffset: 650,  // Dry leaf/coarse sand paper texture
            audioQ: 2.0
        },
        newyear: {
            rewards: ['🎆 2026 Booster', '🥂 Party Pass', '✨ Sparkler Pack', '🥳 Lucky Box'],
            audioFreqOffset: 1800, // Sizzling fuse / crackling sparkler texture
            audioQ: 6.0
        }
    };

    const revealThreshold = 70;
    let brushSize = 6;
    let masterVolume = 0.7;

    let isDrawing = false;
    let hasScratched = false;
    let rewardState = 0; // 0: hidden, 1: heart visible, 2: full reward
    let scratchProgress = 0;
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

            const bufferSize = 2 * audioContext.sampleRate;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const outputChannel = noiseBuffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                outputChannel[i] = Math.random() * 2 - 1;
            }

            noiseSource = audioContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;

            bandpassFilter = audioContext.createBiquadFilter();
            bandpassFilter.type = 'bandpass';
            
            // Apply current theme settings immediately
            const currentTheme = themeSelect.value;
            bandpassFilter.Q.value = themeConfigs[currentTheme].audioQ;
            bandpassFilter.frequency.value = themeConfigs[currentTheme].audioFreqOffset;

            highpassFilter = audioContext.createBiquadFilter();
            highpassFilter.type = 'highpass';
            highpassFilter.frequency.value = 1500;

            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);

            noiseSource.connect(bandpassFilter);
            bandpassFilter.connect(highpassFilter);
            highpassFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            noiseSource.start(0);
            isAudioInitialized = true;
        } catch (error) {
            console.error("Web Audio API not supported or initialization failed:", error);
        }
    }

    /**
     * Smoothly updates filters and gain levels based on physical scratch velocity and active theme
     */
    function modulateProceduralAudio(velocity) {
        if (!isAudioInitialized) return;

        const maxVelocity = 2.5;
        const normalizedVelocity = Math.min(velocity / maxVelocity, 1.0);
        const now = audioContext.currentTime;

        if (normalizedVelocity > 0.02) {
            // Apply Master Volume modifier to base calculations
            const targetGain = (0.01 + (normalizedVelocity * 0.12)) * masterVolume;

            // Extract real-time adjustments based on theme signatures
            const theme = themeSelect.value;
            const baseFreq = themeConfigs[theme].audioFreqOffset;
            const targetBandpassFreq = baseFreq + (normalizedVelocity * 1400);
            const targetHighpassFreq = (baseFreq * 1.2) + (normalizedVelocity * 1100);

            gainNode.gain.setTargetAtTime(targetGain, now, 0.03);
            bandpassFilter.frequency.setTargetAtTime(targetBandpassFreq, now, 0.04);
            highpassFilter.frequency.setTargetAtTime(targetHighpassFreq, now, 0.04);
        } else {
            stopScratchSound();
        }
    }

    function stopScratchSound() {
        if (isAudioInitialized && gainNode) {
            gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
        }
    }

    // --- Core UI & Canvas Logic ---
    function getStylePropertyValue(prop) {
        return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }

    function selectRandomReward() {
        const currentTheme = themeSelect.value;
        const rewardList = themeConfigs[currentTheme].rewards;
        rewardText.textContent = rewardList[Math.floor(Math.random() * rewardList.length)];
    }

    function updateScratchProgress(percentage) {
        scratchProgress = Math.min(100, Math.max(0, percentage));
        scratchProgressValue.textContent = `${Math.round(scratchProgress)}%`;
    }

    function setupCanvas(shouldSelectReward = false) {
        clearTimeout(checkTimeout);

        if (shouldSelectReward) {
            selectRandomReward();
        }

        const dpr = window.devicePixelRatio || 1;
        const rect = coinWrapper.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        drawCoating(rect.width, rect.height);

        // Reset states
        hasScratched = false;
        rewardState = 0;
        updateScratchProgress(0);
        instructionText.classList.remove('fade-out');
        rewardContent.style.opacity = '0';
        rewardContent.classList.remove('stage-1', 'stage-2');
        canvas.style.opacity = '1';
        canvas.style.pointerEvents = 'auto';
        stopScratchSound();
    }

    function drawCoating(width, height) {
        ctx.globalCompositeOperation = 'source-over';

        // Grabs custom root vars loaded by active HTML theme attribute tags
        const coatingStart = getStylePropertyValue('--coating-start') || '#70291D';
        const coatingEnd = getStylePropertyValue('--coating-end') || '#3B1A14';

        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
        gradient.addColorStop(0, coatingStart);
        gradient.addColorStop(1, coatingEnd);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Unique noise density modifiers per theme to enhance tactile variation
        const activeTheme = themeSelect.value;
        let particleCount = 4000;
        let particleOpacity = 0.03;

        if (activeTheme === 'diamond') { particleCount = 6000; particleOpacity = 0.06; } // Extra shiny glitter look
        if (activeTheme === 'halloween') { particleCount = 2500; particleOpacity = 0.05; } // Coarse grit

        ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`;
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * (activeTheme === 'halloween' ? 2.5 : 1.5);
            ctx.fillRect(x, y, size, size);
        }
    }

    function getEventCoordinates(e) {
        if (e.touches) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }
        return { x: e.offsetX, y: e.offsetY };
    }

    function startScratch(e) {
        if (!isAudioInitialized) {
            initAudio();
        }
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        isDrawing = true;
        if (!hasScratched) {
            instructionText.classList.add('fade-out');
            hasScratched = true;
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
        const deltaTime = Math.max(1, currentTime - lastTime);

        const distance = Math.hypot(dx, dy);
        if (distance < 0.5) return;

        const velocity = distance / deltaTime;
        modulateProceduralAudio(velocity);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize;
        ctx.shadowBlur = brushSize / 2; 
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
            if (rewardState === 2) return;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let transparentPixels = 0;

            for (let i = 3; i < data.length; i += 4) {
                if (data[i] < 128) {
                    transparentPixels++;
                }
            }

            const totalPixels = data.length / 4;
            const percentage = (transparentPixels / totalPixels) * 100;
            updateScratchProgress(percentage);

            if (percentage >= revealThreshold && rewardState === 1) {
                rewardState = 2;
                rewardContent.classList.add('stage-2');
                updateScratchProgress(100);

                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();

                canvas.style.opacity = '0';
                canvas.style.pointerEvents = 'none';
                stopScratchSound();
            }
        }, 150);
    }

    function updateCursor(e) {
        const touch = e.touches ? e.touches[0] : e;
        customCursor.style.left = `${touch.clientX}px`;
        customCursor.style.top = `${touch.clientY}px`;
    }

    // --- Core Theme Switcher System Logic ---
    function applyTheme(themeValue) {
        // 1. Persist selection to root dataset element for CSS variables mapping
        document.documentElement.setAttribute('data-theme', themeValue);
        localStorage.setItem('selected-coin-theme', themeValue);

        // 2. Adjust live Audio nodes if context is operational
        if (isAudioInitialized && bandpassFilter) {
            const now = audioContext.currentTime;
            bandpassFilter.Q.setTargetAtTime(themeConfigs[themeValue].audioQ, now, 0.05);
            bandpassFilter.frequency.setTargetAtTime(themeConfigs[themeValue].audioFreqOffset, now, 0.05);
        }

        // 3. Re-render texture bounds context and cycle current card rewards array
        setupCanvas(true);
    }

    // Event Listeners for Theme Switcher Controls
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    volumeSlider.addEventListener('input', (e) => {
        masterVolume = parseFloat(e.target.value);
        volumeValue.textContent = `${Math.round(masterVolume * 100)}%`;
    });

    // Event Listeners
    window.addEventListener('resize', setupCanvas);
    resetButton.addEventListener('click', () => setupCanvas(true));

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
        stopScratch();
    });

    brushSizeSlider.addEventListener('input', () => {
        brushSize = Number(brushSizeSlider.value);
        brushSizeValue.textContent = brushSize;
        customCursor.style.width = `${brushSize}px`;
        customCursor.style.height = `${brushSize}px`;
    });

    // --- On-Load Persistent Initializations ---
    const savedTheme = localStorage.getItem('selected-coin-theme') || 'gold';
    themeSelect.value = savedTheme;
    
    // Run core initialization matching the theme selection bounds configuration
    applyTheme(savedTheme);

    // Handle recommendation card auto-dismiss on mobile/tablet
    if (window.matchMedia("(max-width: 768px)").matches && recommendationCard) {
        setTimeout(() => {
            recommendationCard.classList.add('fade-out');
            recommendationCard.addEventListener('transitionend', () => {
                recommendationCard.classList.add('hidden');
            }, { once: true });
        }, 3500);
    }
});