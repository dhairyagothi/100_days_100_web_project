document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const player = document.getElementById('player');
    const highway = document.getElementById('highway');
    
    // 2. UI & Screens
    const scoreVal = document.getElementById('score-val');
    const distanceVal = document.getElementById('distance-val');
    const speedVal = document.getElementById('speed-val');
    const speedHand = document.getElementById('speed-hand');
    const pauseBtn = document.getElementById('pause-btn');
    const pauseScreen = document.getElementById('pause-screen');
    const startScreen = document.getElementById('start-screen');
    const crashScreen = document.getElementById('crash-screen');
    const finalScore = document.getElementById('final-score');
    const finalDistance = document.getElementById('final-distance');
    
    // 3. Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const pauseRestartBtn = document.getElementById('pause-restart-btn'); 
    const pauseMenuBtn = document.getElementById('pause-menu-btn'); 
    const grassLeft = document.getElementById('grass-left');
    const grassRight = document.getElementById('grass-right');

    // 4. Game State
    let isPaused = false;
    let gameActive = false;
    let score = 0;
    let distance = 0; 
    let playerLeft = 0; 
    let baseEnemySpeed = 6;
    const MAX_SPEED = 20;
    let enemySpawnInterval, gameLoopInterval;

    const initPositions = () => {
        const roadWidth = highway.clientWidth;
        playerLeft = (roadWidth - 50) / 2;
        player.style.left = `${playerLeft}px`;
    };

    const startRace = () => {
        gameActive = true; 
        isPaused = false; 
        score = 0; 
        distance = 0; 
        baseEnemySpeed = 6;
        highway.dataset.bgPos = 0; 
        
        scoreVal.textContent = "0"; 
        distanceVal.textContent = "0";
        
        // Show the game arena first
        startScreen.style.display = 'none';
        crashScreen.style.display = 'none';
        pauseScreen.style.display = 'none';
        pauseBtn.style.display = 'flex';
        
        // --- THIS IS THE FIX ---
        // We reset the position here to guarantee it's centered every single time
        initPositions(); 
        
        document.querySelectorAll('.enemy').forEach(el => el.remove());
        
        clearInterval(gameLoopInterval);
        clearInterval(enemySpawnInterval);
        
        gameLoopInterval = setInterval(updateGame, 1000 / 60); 
        enemySpawnInterval = setInterval(spawnEnemy, 1200); 
    };

    const roadMargin = 25; 

    const moveLeft = () => { 
        if(gameActive && !isPaused) { 
            // Only move if we are past the margin
            playerLeft = Math.max(roadMargin, playerLeft - 25); 
            player.style.left = `${playerLeft}px`; 
        }
    };

    const moveRight = () => { 
        if(gameActive && !isPaused) { 
            // Only move if we are before the right margin
            playerLeft = Math.min(highway.clientWidth - 75, playerLeft + 25); 
            player.style.left = `${playerLeft}px`; 
        }
    };

    const spawnEnemy = () => {
        if (!gameActive || isPaused) return;
        const enemy = document.createElement('div');
        enemy.className = 'enemy';

        // FIX #1: Added 'bus' to the types array — it was defined in CSS but never spawned
        const types = ['car', 'truck', 'bike', 'stone', 'bus'];
        const type = types[Math.floor(Math.random() * types.length)];
        enemy.classList.add(`type-${type}`);

        // Width of the car/enemy
        const myWidth = (type === 'stone') ? 35 : 50;

        // FIX #2: Added correct height per type — bus and truck have taller sprites
        const myHeight = (type === 'truck') ? 140
                       : (type === 'bus')   ? 150
                       : (type === 'stone') ? 35
                       : 100;

        // FIX #3: Apply height dynamically so collision box matches sprite size
        enemy.style.height = `${myHeight}px`;

        const curbPadding = 20; 
        const minX = curbPadding;
        const maxX = highway.clientWidth - myWidth - curbPadding;
        const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

        let enemySpeed = Math.max(1, baseEnemySpeed - 2); 
        
        enemy.dataset.speed = enemySpeed;
        enemy.dataset.top = -150;
        enemy.style.left = `${randomX}px`;
        enemy.style.transform = `translateY(-150px)`;
        highway.appendChild(enemy);
    };

   function updateGame() {
    if (isPaused) return;

    // 1. SYNC ROAD
    let bgPos = parseFloat(highway.dataset.bgPos || 0) + baseEnemySpeed;
    highway.dataset.bgPos = bgPos;
    highway.style.backgroundPosition = `0px ${bgPos}px, 100% ${bgPos}px, 50% ${bgPos}px`;
    
    // 2. MOVE GRASS (Use the same bgPos, but multiply by 0.7 for parallax)
    let grassPos = bgPos * 0.7; 
    grassLeft.style.backgroundPositionY = `${grassPos}px`;
    grassRight.style.backgroundPositionY = `${grassPos}px`;

    const playerRect = player.getBoundingClientRect();
    
    // 3. MOVE ENEMIES DOWNWARD
    document.querySelectorAll('.enemy').forEach(enemy => {
        let top = parseFloat(enemy.dataset.top) + parseFloat(enemy.dataset.speed);
        enemy.dataset.top = top;
        enemy.style.transform = `translateY(${Math.round(top)}px)`;

        const enemyRect = enemy.getBoundingClientRect();

        // Collision Check
        if (!(playerRect.right - 20 < enemyRect.left || 
              playerRect.left + 20 > enemyRect.right || 
              playerRect.bottom - 20 < enemyRect.top || 
              playerRect.top + 20 > enemyRect.bottom)) {
            gameOver();
        }

        // Cleanup and Scoring
        if (top > highway.offsetHeight) {
            enemy.remove();
            score += 10;
            scoreVal.textContent = score;
            if (score % 100 === 0 && baseEnemySpeed < 20) baseEnemySpeed += 0.5;
        }
    });

    // 4. DASHBOARD UPDATES
    distance += (baseEnemySpeed * baseEnemySpeed) / 120;
    distanceVal.textContent = Math.floor(distance);
    
    let realtimeSpeed = Math.round(baseEnemySpeed * 2.5);
    speedVal.textContent = realtimeSpeed;
    
    if (speedHand) {
        // Map 0-50 km/h to 0-180 degrees
        let rotation = (realtimeSpeed / 50) * 180; 
        speedHand.style.transform = `rotate(${rotation}deg)`;
    }
}

    const gameOver = () => {
        gameActive = false;
        clearInterval(gameLoopInterval);
        clearInterval(enemySpawnInterval);
        finalScore.textContent = score;
        finalDistance.textContent = Math.floor(distance);
        crashScreen.style.display = 'flex';
        pauseBtn.style.display = 'none';
    };

    const togglePause = () => {
        if (!gameActive) return;
        isPaused = !isPaused;
        pauseScreen.style.display = isPaused ? 'flex' : 'none';
        pauseBtn.style.display = isPaused ? 'none' : 'flex';
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') togglePause();
        if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
        if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
        if (e.key === 'Enter' && startScreen.style.display !== 'none') startRace();
    });

    // Listeners
    startBtn.addEventListener('click', startRace);
    restartBtn.addEventListener('click', startRace);
    pauseBtn.addEventListener('click', togglePause);
    resumeBtn.addEventListener('click', togglePause);
    pauseRestartBtn.addEventListener('click', () => { isPaused = false; startRace(); });

    pauseMenuBtn.addEventListener('click', () => {
        gameActive = false;           // 1. Stop the game logic
        isPaused = false;             // 2. Unpause the state
        clearInterval(gameLoopInterval);   // 3. KILL the game clock!
        clearInterval(enemySpawnInterval); // 4. KILL the enemy spawner!
        document.querySelectorAll('.enemy').forEach(el => el.remove()); // 5. Clean up board
        
        pauseScreen.style.display = 'none';
        crashScreen.style.display = 'none'; // Ensure the crash screen doesn't show
        startScreen.style.display = 'flex'; // Go back to start
    });

    menuBtn.addEventListener('click', () => { crashScreen.style.display = 'none'; startScreen.style.display = 'flex'; });
    leftBtn.addEventListener('click', moveLeft);
    rightBtn.addEventListener('click', moveRight);

    initPositions();
});