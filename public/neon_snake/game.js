/* ============================================================
   NEON RETRO SNAKE CORE ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SETUP CANVAS & SYSTEM VARIABLES
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Core constants
    const GRID_SIZE = 20;
    const TILE_COUNT = canvas.width / GRID_SIZE; // 20x20 Grid
    
    // Game States
    let snake = [];
    let dir = { x: 0, y: 0 };
    let nextDir = { x: 0, y: 0 };
    let food = { x: 0, y: 0, type: 'normal' }; // types: normal, double, decelerator, phase
    let obstacles = [];
    let particles = [];
    
    let score = 0;
    let highScore = localStorage.getItem('neonSnakeHighScore') || 0;
    let gameInterval = null;
    let gameSpeed = 110; // Default update speed in ms
    let baseSpeed = 110;
    
    let isGameOver = false;
    let isGameRunning = false;
    let isPaused = false;
    
    // Mode & Power-up settings
    let currentMode = 'classic';
    let isSoundOn = true;
    let isAmberTheme = false;
    
    // Active power-up timers
    let powerups = {
        double: { active: false, timer: null, duration: 8000 },
        phase: { active: false, timer: null, duration: 10000 }
    };

    // Synthesizer Audio Setup (Web Audio API)
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    // Play synthesized arcade sound
    function playSound(type) {
        if (!isSoundOn) return;
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const now = ctx.currentTime;
            
            if (type === 'eat') {
                // High frequency retro pluck
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(880, now + 0.08); // A5
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } 
            else if (type === 'powerup') {
                // Futuristic sweep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            }
            else if (type === 'gameover') {
                // Descending failure synth tone
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.6);
                gainNode.gain.setValueAtTime(0.25, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
                osc.start(now);
                osc.stop(now + 0.7);
            }
            else if (type === 'phase') {
                // Soft synth pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(220, now + 0.05);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            console.warn('Audio synthesis fail:', e);
        }
    }

    // Update UI high score display
    document.getElementById('highScoreVal').textContent = String(highScore).padStart(4, '0');

    // ============================================================
    // 2. CORE GAME MECHANICS
    // ============================================================
    function initGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            { x: 10, y: 12 }
        ];
        dir = { x: 0, y: -1 };
        nextDir = { x: 0, y: -1 };
        score = 0;
        isGameOver = false;
        isPaused = false;
        
        // Reset power-ups
        Object.keys(powerups).forEach(k => {
            if (powerups[k].timer) clearTimeout(powerups[k].timer);
            powerups[k].active = false;
        });
        document.getElementById('powerupAlert').classList.add('hidden');
        
        gameSpeed = baseSpeed;
        
        document.getElementById('scoreVal').textContent = '0000';
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        // Spawn elements
        spawnObstacles();
        spawnFood();
        
        // Launch main loop
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
        isGameRunning = true;
    }

    // Obstacle Spawner (Avoids center spawn and spawns solid lethal cells)
    function spawnObstacles() {
        obstacles = [];
        if (currentMode !== 'obstacles') return;
        
        const count = 4 + Math.floor(Math.random() * 3); // 4 to 6 structural blocks
        for (let i = 0; i < count; i++) {
            let ox, oy;
            let isValid = false;
            while (!isValid) {
                ox = Math.floor(Math.random() * TILE_COUNT);
                oy = Math.floor(Math.random() * TILE_COUNT);
                
                // Ensure away from center spawn (10, 10) and not overlapping existing
                const distToCenter = Math.abs(ox - 10) + Math.abs(oy - 10);
                const isDupe = obstacles.some(o => o.x === ox && o.y === oy);
                if (distToCenter > 3 && !isDupe) {
                    isValid = true;
                }
            }
            obstacles.push({ x: ox, y: oy });
        }
    }

    // Food & Power-up Spawner
    function spawnFood() {
        let fx, fy;
        let isValid = false;
        
        while (!isValid) {
            fx = Math.floor(Math.random() * TILE_COUNT);
            fy = Math.floor(Math.random() * TILE_COUNT);
            
            const collidesSnake = snake.some(part => part.x === fx && part.y === fy);
            const collidesObstacle = obstacles.some(o => o.x === fx && o.y === fy);
            if (!collidesSnake && !collidesObstacle) {
                isValid = true;
            }
        }

        // Determine food type based on probability
        let type = 'normal';
        const rand = Math.random();
        
        if (rand > 0.88) {
            type = 'double'; // 12% spawn double score
        } else if (rand > 0.78) {
            type = 'decelerator'; // 10% decelerator
        } else if (rand > 0.68) {
            type = 'phase'; // 10% phase core
        }
        
        food = { x: fx, y: fy, type: type };
    }

    // Particle Explosion Effect (Neon glowing sparks)
    function createExplosion(x, y, color) {
        const pCount = 12 + Math.floor(Math.random() * 6);
        const px = x * GRID_SIZE + GRID_SIZE / 2;
        const py = y * GRID_SIZE + GRID_SIZE / 2;
        
        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: px,
                y: py,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 2.5 + 1.5,
                color: color,
                alpha: 1.0,
                decay: Math.random() * 0.05 + 0.02
            });
        }
    }

    // Active power-up display handler
    function showPowerupAlert(text) {
        const el = document.getElementById('powerupAlert');
        const span = document.getElementById('powerupText');
        span.textContent = text;
        el.classList.remove('hidden');
    }

    function hidePowerupAlert() {
        document.getElementById('powerupAlert').classList.add('hidden');
    }

    // Handle game state tick / update
    function update() {
        if (isPaused || isGameOver) return;
        
        // Prevent 180 degree instant self-collision
        dir = nextDir;
        
        // Calculate new head position
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        
        // Wall Collision handling
        if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
            if (powerups.phase.active) {
                // Warp around screen
                head.x = (head.x + TILE_COUNT) % TILE_COUNT;
                head.y = (head.y + TILE_COUNT) % TILE_COUNT;
                playSound('phase');
            } else {
                triggerGameOver();
                return;
            }
        }
        
        // Self Collision Check
        const selfCollision = snake.some(part => part.x === head.x && part.y === head.y);
        if (selfCollision) {
            triggerGameOver();
            return;
        }

        // Obstacles collision check
        const obstacleCollision = obstacles.some(o => o.x === head.x && o.y === head.y);
        if (obstacleCollision) {
            triggerGameOver();
            return;
        }

        // Prepend new head
        snake.unshift(head);
        
        // Food Collision Check
        if (head.x === food.x && head.y === food.y) {
            handleFoodEaten();
            spawnFood();
        } else {
            snake.pop(); // Standard move: discard tail
        }
        
        // Redraw canvas
        draw();
    }

    // Food Eaten logic (scoring + multipliers + power-ups)
    function handleFoodEaten() {
        let points = 10;
        let color = '#39ff14'; // Green default particle
        
        if (food.type === 'normal') {
            points = 10;
            playSound('eat');
        } 
        else if (food.type === 'double') {
            points = 20;
            color = '#ff007f'; // Pink sparks
            playSound('powerup');
            
            // Activate Double Score Mode
            powerups.double.active = true;
            showPowerupAlert("DOUBLE CORE (+2X MULTIPLIER!)");
            if (powerups.double.timer) clearTimeout(powerups.double.timer);
            powerups.double.timer = setTimeout(() => {
                powerups.double.active = false;
                hidePowerupAlert();
            }, powerups.double.duration);
        } 
        else if (food.type === 'decelerator') {
            points = 10;
            color = '#ff9f00'; // Orange sparks
            playSound('powerup');
            
            // Decelerate speed slightly
            gameSpeed = Math.min(baseSpeed + 20, gameSpeed + 25);
            resetInterval();
            showPowerupAlert("DECELERATOR ACTIVATED (SYSTEM SLOWDOWN)");
            setTimeout(hidePowerupAlert, 3000);
        } 
        else if (food.type === 'phase') {
            points = 15;
            color = '#bd00ff'; // Purple sparks
            playSound('powerup');
            
            // Enable Wall Phasing
            powerups.phase.active = true;
            showPowerupAlert("PHASE MODE ON (PASS THROUGH WALLS)");
            if (powerups.phase.timer) clearTimeout(powerups.phase.timer);
            powerups.phase.timer = setTimeout(() => {
                powerups.phase.active = false;
                hidePowerupAlert();
            }, powerups.phase.duration);
        }

        // Double Score multiplier check
        if (powerups.double.active && food.type !== 'double') {
            points *= 2;
        }
        
        score += points;
        document.getElementById('scoreVal').textContent = String(score).padStart(4, '0');
        
        // Spawn particle blast
        createExplosion(food.x, food.y, color);

        // Speed Run mode logic (speed increases steadily)
        if (currentMode === 'speedrun') {
            gameSpeed = Math.max(50, gameSpeed - 3); // accelerate updates
            resetInterval();
        }
    }

    function resetInterval() {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
    }

    // Trigger Game Over
    function triggerGameOver() {
        isGameOver = true;
        isGameRunning = false;
        playSound('gameover');
        if (gameInterval) clearInterval(gameInterval);
        
        document.getElementById('finalScore').textContent = score;
        
        // Update high score if broken
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('neonSnakeHighScore', highScore);
            document.getElementById('highScoreVal').textContent = String(highScore).padStart(4, '0');
            document.getElementById('newHighAlert').classList.remove('hidden');
        } else {
            document.getElementById('newHighAlert').classList.add('hidden');
        }
        
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    // ============================================================
    // 3. CANVAS DRAW ENGINE
    // ============================================================
    function draw() {
        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set dynamic colors based on theme active
        const neonBlue = isAmberTheme ? '#ffb000' : '#00f0ff';
        const neonPink = isAmberTheme ? '#e03000' : '#ff007f';
        const neonGreen = isAmberTheme ? '#ffd000' : '#39ff14';
        
        // Draw Retro Grid Pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= TILE_COUNT; i++) {
            ctx.beginPath();
            ctx.moveTo(i * GRID_SIZE, 0);
            ctx.lineTo(i * GRID_SIZE, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * GRID_SIZE);
            ctx.lineTo(canvas.width, i * GRID_SIZE);
            ctx.stroke();
        }
        
        // Draw Solid Obstacles
        obstacles.forEach(o => {
            ctx.fillStyle = '#1c223c';
            ctx.strokeStyle = neonPink;
            ctx.lineWidth = 2;
            
            ctx.shadowBlur = 8;
            ctx.shadowColor = neonPink;
            
            ctx.fillRect(o.x * GRID_SIZE + 2, o.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
            ctx.strokeRect(o.x * GRID_SIZE + 2, o.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
        });

        // Draw Food
        let foodColor = neonGreen;
        let shadowColor = neonGreen;
        let foodRadius = GRID_SIZE / 2 - 2;
        
        if (food.type === 'double') {
            foodColor = neonPink;
            shadowColor = neonPink;
        } else if (food.type === 'decelerator') {
            foodColor = '#ff9f00';
            shadowColor = '#ff9f00';
        } else if (food.type === 'phase') {
            foodColor = '#bd00ff';
            shadowColor = '#bd00ff';
        }

        ctx.beginPath();
        const fx = food.x * GRID_SIZE + GRID_SIZE / 2;
        const fy = food.y * GRID_SIZE + GRID_SIZE / 2;
        ctx.arc(fx, fy, foodRadius, 0, Math.PI * 2);
        ctx.fillStyle = foodColor;
        ctx.shadowBlur = 12;
        ctx.shadowColor = shadowColor;
        ctx.fill();

        // Pulsing food outer halo
        const pulse = 2 + Math.sin(Date.now() * 0.01) * 2;
        ctx.beginPath();
        ctx.arc(fx, fy, foodRadius + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = foodColor;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Draw Snake
        snake.forEach((part, index) => {
            const isHead = index === 0;
            let fillStyle = isHead ? '#ffffff' : neonBlue;
            let strokeStyle = neonBlue;
            
            if (powerups.phase.active) {
                fillStyle = isHead ? '#ffffff' : '#bd00ff';
                strokeStyle = '#bd00ff';
            }
            
            ctx.shadowBlur = isHead ? 15 : 6;
            ctx.shadowColor = strokeStyle;
            
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 2;
            
            // Rounded grid coordinates
            const x = part.x * GRID_SIZE + 1.5;
            const y = part.y * GRID_SIZE + 1.5;
            const size = GRID_SIZE - 3;
            
            ctx.fillRect(x, y, size, size);
            ctx.strokeRect(x, y, size, size);
        });

        // Draw and Update Particles
        drawParticles();
    }

    // Render Particle blast effects
    function drawParticles() {
        ctx.shadowBlur = 0; // Turn off shadows for simple particle speed
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            
            // Apply physics
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1.0; // Reset canvas transparency
    }

    // ============================================================
    // 4. USER CONTROLS & SIDEBAR HANDLERS
    // ============================================================
    function handleDirectionInput(newX, newY) {
        if (!isGameRunning || isPaused || isGameOver) return;
        
        // Prevent opposite direction movement (cannot instantly go down if moving up)
        if (newX !== 0 && dir.x === -newX) return;
        if (newY !== 0 && dir.y === -newY) return;
        
        nextDir = { x: newX, y: newY };
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        if (key === ' ' || key === 'spacebar') {
            e.preventDefault();
            if (isGameOver) {
                initGame();
            } else if (!isGameRunning) {
                initGame();
            } else {
                // Pause / resume
                isPaused = !isPaused;
                if (isPaused) {
                    document.getElementById('startScreen').classList.remove('hidden');
                    document.getElementById('startScreen').querySelector('h2').textContent = "SYSTEM PAUSED";
                } else {
                    document.getElementById('startScreen').classList.add('hidden');
                    document.getElementById('startScreen').querySelector('h2').textContent = "Insert Coin to Play";
                }
            }
            return;
        }

        if (e.key === 'ArrowUp' || key === 'w') handleDirectionInput(0, -1);
        else if (e.key === 'ArrowDown' || key === 's') handleDirectionInput(0, 1);
        else if (e.key === 'ArrowLeft' || key === 'a') handleDirectionInput(-1, 0);
        else if (e.key === 'ArrowRight' || key === 'd') handleDirectionInput(1, 0);
    });

    // Mobile Virtual controls click bindings
    document.getElementById('btnUp').addEventListener('click', () => handleDirectionInput(0, -1));
    document.getElementById('btnDown').addEventListener('click', () => handleDirectionInput(0, 1));
    document.getElementById('btnLeft').addEventListener('click', () => handleDirectionInput(-1, 0));
    document.getElementById('btnRight').addEventListener('click', () => handleDirectionInput(1, 0));

    // Screen-tap Click to start/restart
    const overlayHandler = () => {
        if (isGameOver) {
            initGame();
        } else if (!isGameRunning) {
            initGame();
        } else if (isPaused) {
            isPaused = false;
            document.getElementById('startScreen').classList.add('hidden');
        }
    };
    
    document.getElementById('startScreen').addEventListener('click', overlayHandler);
    document.getElementById('gameOverScreen').addEventListener('click', overlayHandler);

    // Sidebar: Audio toggle
    const soundBtn = document.getElementById('btnSound');
    soundBtn.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundBtn.classList.toggle('active', isSoundOn);
        soundBtn.innerHTML = isSoundOn ? '<i class="fa-solid fa-volume-high"></i> ON' : '<i class="fa-solid fa-volume-xmark"></i> OFF';
    });

    // Sidebar: Theme toggle
    const themeBtn = document.getElementById('btnTheme');
    themeBtn.addEventListener('click', () => {
        isAmberTheme = !isAmberTheme;
        document.body.classList.toggle('cyber-amber', isAmberTheme);
        themeBtn.innerHTML = isAmberTheme ? '<i class="fa-solid fa-palette"></i> AMBER' : '<i class="fa-solid fa-palette"></i> NEON';
        draw();
    });

    // Sidebar: Mode buttons
    const modeBtns = document.querySelectorAll('.btn-mode');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isGameRunning) return; // Prevent changing mode during active gameplay
            
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentMode = btn.dataset.mode;
        });
    });

    // Initial silent draw to show clean canvas grid
    draw();
});
