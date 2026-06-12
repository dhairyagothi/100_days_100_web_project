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

    // Dashboard UI Elements
    const dashboardToggleBtn = document.getElementById('dashboard-toggle-btn');
    const dashboardCloseBtn = document.getElementById('dashboard-close-btn');
    const dashboardOverlay = document.getElementById('dashboard-overlay');
    const clearStatsBtn = document.getElementById('clear-stats-btn');
    
    const statTotalScratchesEl = document.getElementById('stat-total-scratches');
    const statCoinsCollectedEl = document.getElementById('stat-coins-collected');
    const statAsmrTimeEl = document.getElementById('stat-asmr-time');
    const unlockedCountEl = document.getElementById('unlocked-count');
    const badgesContainer = document.getElementById('badges-container');
    const toastContainer = document.getElementById('achievement-toast-container');

    // --- Dynamic Theme Configurations ---
    const themeConfigs = {
        gold: {
            rewards: ['₹10', '₹50', '₹100', '₹500', '🎁 Free Gift', '❤️ You Did It', '😔 Better Luck'],
            audioFreqOffset: 1100,
            audioQ: 4.0
        },
        silver: {
            rewards: ['🥈 Silver Token', '🥈 50 Coins', '🥈 100 Coins', '🥈 Premium Pass'],
            audioFreqOffset: 1600,
            audioQ: 5.5
        },
        bronze: {
            rewards: ['🥉 Bronze Entry', '🥉 5 Coins', '🥉 10 Coins', '🥉 Try Harder'],
            audioFreqOffset: 800,
            audioQ: 3.0
        },
        diamond: {
            rewards: ['💎 Jackpot!', '💎 Crystal Key', '💎 VIP Status', '💎 10,000 Coins'],
            audioFreqOffset: 2400,
            audioQ: 7.0
        },
        christmas: {
            rewards: ['🎄 Santa Pack', '🦌 Rudolph Gift', '❄️ Winter Bonus', '🍬 Candy Cane'],
            audioFreqOffset: 1400,
            audioQ: 2.5
        },
        halloween: {
            rewards: ['🎃 Spooky Treat', '👻 Ghost Box', '🦇 Bat Upgrade', '🍬 Candy Trick'],
            audioFreqOffset: 650,
            audioQ: 2.0
        },
        newyear: {
            rewards: ['🎆 2026 Booster', '🥂 Party Pass', '✨ Sparkler Pack', '🥳 Lucky Box'],
            audioFreqOffset: 1800,
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

    // --- Gamification Engine State & Config ---
    let asmrTimerInterval = null;
    
    const ACHIEVEMENTS = [
        {
            id: 'first_scratch',
            title: 'First Scratch',
            description: 'Complete your very first scratch card!',
            icon: '🎉',
            condition: (stats) => stats.totalScratches >= 1
        },
        {
            id: 'scratch_master',
            title: 'Scratch Master',
            description: 'Complete 25 scratch cards total.',
            icon: '👑',
            condition: (stats) => stats.totalScratches >= 25
        },
        {
            id: 'coin_collector',
            title: 'Coin Collector',
            description: 'Acquire 500 total virtual currency coins.',
            icon: '🪙',
            condition: (stats) => stats.coinsCollected >= 500
        },
        {
            id: 'asmr_enthusiast',
            title: 'ASMR Enthusiast',
            description: 'Listen to scratch feedback textures for 5+ minutes.',
            icon: '🎧',
            condition: (stats) => stats.asmrTime >= 300 // 300 seconds = 5 mins
        },
        {
            id: 'hundred_club',
            title: '100 Scratches Club',
            description: 'Reach elite milestone status with 100 card resets.',
            icon: '🚀',
            condition: (stats) => stats.totalScratches >= 100
        }
    ];

    const ProgressManager = {
        stats: {
            totalScratches: 0,
            coinsCollected: 0,
            asmrTime: 0
        },
        unlocked: [],

        init() {
            const savedStats = localStorage.getItem('asmr_scratch_userStats');
            const savedUnlocked = localStorage.getItem('asmr_scratch_unlocked');
            
            if (savedStats) this.stats = { ...this.stats, ...JSON.parse(savedStats) };
            if (savedUnlocked) this.unlocked = JSON.parse(savedUnlocked);

            this.updateUI();
            this.renderBadgesGrid();
        },

        incrementStat(key, amount = 1) {
            if (this.stats[key] !== undefined) {
                this.stats[key] += amount;
                this.save();
                this.checkAchievements();
                this.updateUI();
            }
        },

        checkAchievements() {
            ACHIEVEMENTS.forEach(ach => {
                if (!this.unlocked.includes(ach.id) && ach.condition(this.stats)) {
                    this.unlock(ach.id);
                }
            });
        },

        unlock(id) {
            this.unlocked.push(id);
            this.save();
            this.renderBadgesGrid();
            this.showNotification(id);
        },

        save() {
            localStorage.setItem('asmr_scratch_userStats', JSON.stringify(this.stats));
            localStorage.setItem('asmr_scratch_unlocked', JSON.stringify(this.unlocked));
        },

        updateUI() {
            if (statTotalScratchesEl) statTotalScratchesEl.textContent = this.stats.totalScratches;
            if (statCoinsCollectedEl) statCoinsCollectedEl.textContent = this.stats.coinsCollected;
            
            if (statAsmrTimeEl) {
                const mins = Math.floor(this.stats.asmrTime / 60);
                const secs = this.stats.asmrTime % 60;
                statAsmrTimeEl.textContent = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
            }
            if (unlockedCountEl) unlockedCountEl.textContent = this.unlocked.length;
        },

        renderBadgesGrid() {
            if (!badgesContainer) return;
            badgesContainer.innerHTML = '';

            ACHIEVEMENTS.forEach(ach => {
                const isUnlocked = this.unlocked.includes(ach.id);
                const badgeCard = document.createElement('div');
                badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
                
                // Simple condition display logic helper
                let progressText = '';
                if (ach.id === 'first_scratch') progressText = `${Math.min(this.stats.totalScratches, 1)}/1`;
                if (ach.id === 'scratch_master') progressText = `${Math.min(this.stats.totalScratches, 25)}/25`;
                if (ach.id === 'hundred_club') progressText = `${Math.min(this.stats.totalScratches, 100)}/100`;
                if (ach.id === 'coin_collector') progressText = `${Math.min(this.stats.coinsCollected, 500)}/500`;
                if (ach.id === 'asmr_enthusiast') progressText = `${Math.floor(this.stats.asmrTime / 60)}m/${5}m`;

                badgeCard.innerHTML = `
                    <div class="badge-icon">${ach.icon}</div>
                    <div class="badge-info">
                        <h4>${ach.title}</h4>
                        <p>${ach.description}</p>
                        <span class="badge-progress">${progressText}</span>
                    </div>
                `;
                badgesContainer.appendChild(badgeCard);
            });
        },

        showNotification(id) {
            const achievement = ACHIEVEMENTS.find(ach => ach.id === id);
            if (!achievement || !toastContainer) return;

            const toast = document.createElement('div');
            toast.className = 'achievement-toast';
            toast.innerHTML = `
                <div class="toast-icon">${achievement.icon}</div>
                <div class="toast-content">
                    <div class="toast-title">Achievement Unlocked!</div>
                    <div class="toast-name">${achievement.title}</div>
                </div>
            `;
            
            toastContainer.appendChild(toast);

            // Audio verification pop hook if supported
            if (audioContext && isAudioInitialized) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
                osc.frequency.setValueAtTime(880.00, audioContext.currentTime + 0.1); // A5
                gain.gain.setValueAtTime(0, audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(0.05 * masterVolume, audioContext.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start();
                osc.stop(audioContext.currentTime + 0.4);
            }

            setTimeout(() => {
                toast.classList.add('fade-out');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 4000);
        },

        resetData() {
            if (confirm('Are you sure you want to completely clear your stats and badges progress?')) {
                localStorage.removeItem('asmr_scratch_userStats');
                localStorage.removeItem('asmr_scratch_unlocked');
                this.stats = { totalScratches: 0, coinsCollected: 0, asmrTime: 0 };
                this.unlocked = [];
                this.updateUI();
                this.renderBadgesGrid();
            }
        }
    };

    /**
     * Helper to scrape/extract trailing numeric amounts from structural text configuration fields
     */
    function parseCoinsFromRewardString(str) {
        const matches = str.match(/\d[\d,.]*/);
        if (matches) {
            const cleanVal = parseFloat(matches[0].replace(/,/g, ''));
            return isNaN(cleanVal) ? 0 : Math.floor(cleanVal);
        }
        return 0;
    }

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
            const targetGain = (0.01 + (normalizedVelocity * 0.12)) * masterVolume;

            const theme = themeSelect.value;
            const baseFreq = themeConfigs[theme].audioFreqOffset;
            const targetBandpassFreq = baseFreq + (normalizedVelocity * 1400);
            const targetHighpassFreq = (baseFreq * 1.2) + (normalizedVelocity * 1100);

            gainNode.gain.setTargetAtTime(targetGain, now, 0.03);
            bandpassFilter.frequency.setTargetAtTime(targetBandpassFreq, now, 0.04);
            highpassFilter.frequency.setTargetAtTime(targetHighpassFreq, now, 0.04);

            // Active Listening Audio Statistics Tracking Loop Initialization
            if (!asmrTimerInterval) {
                asmrTimerInterval = setInterval(() => {
                    ProgressManager.incrementStat('asmrTime', 1);
                }, 1000);
            }
        } else {
            stopScratchSound();
        }
    }

    function stopScratchSound() {
        if (isAudioInitialized && gainNode) {
            gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
        }
        if (asmrTimerInterval) {
            clearInterval(asmrTimerInterval);
            asmrTimerInterval = null;
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

        const activeTheme = themeSelect.value;
        let particleCount = 4000;
        let particleOpacity = 0.03;

        if (activeTheme === 'diamond') { particleCount = 6000; particleOpacity = 0.06; }
        if (activeTheme === 'halloween') { particleCount = 2500; particleOpacity = 0.05; }

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

                // --- Trigger Milestone Statistics Increment Updates ---
                ProgressManager.incrementStat('totalScratches', 1);
                
                const coinsWon = parseCoinsFromRewardString(rewardText.textContent);
                if (coinsWon > 0) {
                    ProgressManager.incrementStat('coinsCollected', coinsWon);
                }
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
        document.documentElement.setAttribute('data-theme', themeValue);
        localStorage.setItem('selected-coin-theme', themeValue);

        if (isAudioInitialized && bandpassFilter) {
            const now = audioContext.currentTime;
            bandpassFilter.Q.setTargetAtTime(themeConfigs[themeValue].audioQ, now, 0.05);
            bandpassFilter.frequency.setTargetAtTime(themeConfigs[themeValue].audioFreqOffset, now, 0.05);
        }

        setupCanvas(true);
    }

    // --- Dashboard Overlay Toggle Event Listeners ---
    if (dashboardToggleBtn) {
        dashboardToggleBtn.addEventListener('click', () => {
            dashboardOverlay.classList.add('active');
            ProgressManager.renderBadgesGrid(); // Ensure live structural counts align perfectly on open
        });
    }

    if (dashboardCloseBtn) {
        dashboardCloseBtn.addEventListener('click', () => {
            dashboardOverlay.classList.remove('active');
        });
    }

    if (dashboardOverlay) {
        dashboardOverlay.addEventListener('click', (e) => {
            if (e.target === dashboardOverlay) dashboardOverlay.classList.remove('active');
        });
    }

    if (clearStatsBtn) {
        clearStatsBtn.addEventListener('click', () => ProgressManager.resetData());
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
    
    // Initialize Gamification Engine Profile Values
    ProgressManager.init();

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
