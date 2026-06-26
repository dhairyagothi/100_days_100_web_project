// script.js - Chrome Dino Game with Power-ups System
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const coinCountElement = document.getElementById("coinCount");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const finalCoinsEl = document.getElementById("finalCoins");
const highScoreEl = document.getElementById("highScore");
const powerupLegend = document.getElementById("powerupLegend");

let gameRunning = false;
let gameOver = false;
let score = 0;
let coinCount = 0;
let highScore = localStorage.getItem("dinoHighScore") || 0;
let frame = 0;
let speed = 6;
const GRAVITY = 0.6;
const JUMP = -15;

// Power-ups System
const powerups = {
  active: [],
  types: {
    shield: {
      name: "Shield",
      color: "#00BFFF",
      duration: 5000, // 5 seconds
      icon: "🛡️",
      active: false,
      timer: 0
    },
    magnet: {
      name: "Magnet",
      color: "#FFD700",
      duration: 7000,
      icon: "🧲",
      active: false,
      timer: 0
    },
    doubleJump: {
      name: "Double Jump",
      color: "#FF6B6B",
      duration: 6000,
      icon: "⬆️⬆️",
      active: false,
      timer: 0,
      jumpsLeft: 0
    },
    slowMotion: {
      name: "Slow Motion",
      color: "#9B59B6",
      duration: 4000,
      icon: "🐢",
      active: false,
      timer: 0,
      originalSpeed: 6
    },
    starPower: {
      name: "Star Power",
      color: "#FFD700",
      duration: 3000,
      icon: "⭐",
      active: false,
      timer: 0
    }
  },
  spawnTimer: 0,
  spawnInterval: 8000 // Spawn a power-up every 8 seconds
};

// Dino
const dino = {
  x: 80,
  y: 200,
  width: 44,
  height: 50,
  dy: 0,
  isJumping: false,
  isDucking: false,
  legFrame: 0,
  hasShield: false,
  isInvincible: false
};

// Arrays
let obstacles = [];
let clouds = [];
let coins = [];
let powerupItems = [];
let groundY = 250;

// Game variables
let lastObstacle = 0;
let lastCoin = 0;

// Keyboard
const keys = {};

// Generate initial clouds
function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: Math.random() * canvas.width * 1.5,
      y: 40 + Math.random() * 80,
      size: 0.8 + Math.random() * 0.6,
    });
  }
}

// Spawn power-up
function spawnPowerup() {
  const now = Date.now();
  if (now - powerups.spawnTimer < powerups.spawnInterval) return;
  
  // Only spawn if no active power-up items on screen
  if (powerupItems.length >= 2) return;
  
  const types = ['shield', 'magnet', 'doubleJump', 'slowMotion', 'starPower'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  powerupItems.push({
    x: canvas.width + 50,
    y: groundY - 100 - Math.random() * 100,
    width: 30,
    height: 30,
    type: type,
    collected: false
  });
  
  powerups.spawnTimer = now;
}

// Spawn obstacle
function spawnObstacle() {
  const now = Date.now();
  if (now - lastObstacle < 800 + Math.random() * 800) return;

  const types = ["cactus1", "cactus2", "cactus3", "bird"];
  let type = types[Math.floor(Math.random() * (score > 800 ? 4 : 3))];

  let obstacle = {
    x: canvas.width + 50,
    width: 30,
    height: 50,
    type: type,
    passed: false,
  };

  if (type === "bird") {
    obstacle.y = groundY - 80 - Math.random() * 60;
    obstacle.height = 35;
    obstacle.width = 50;
  } else {
    obstacle.y = groundY - obstacle.height;
    if (type === "cactus2") obstacle.width = 50;
    if (type === "cactus3") obstacle.width = 70;
  }

  obstacles.push(obstacle);
  lastObstacle = now;
}

// Spawn coin
function spawnCoin() {
  const now = Date.now();
  if (now - lastCoin < 1500 + Math.random() * 2000) return;
  
  coins.push({
    x: canvas.width + 50,
    y: groundY - 40 - Math.random() * 80,
    width: 15,
    height: 15,
    collected: false,
    bobOffset: Math.random() * Math.PI * 2
  });
  
  lastCoin = now;
}

// Activate power-up
function activatePowerup(type) {
  const powerup = powerups.types[type];
  
  switch(type) {
    case 'shield':
      powerup.active = true;
      powerup.timer = powerup.duration;
      dino.hasShield = true;
      break;
      
    case 'doubleJump':
      powerup.active = true;
      powerup.timer = powerup.duration;
      powerup.jumpsLeft = 2;
      break;
      
    case 'slowMotion':
      powerup.active = true;
      powerup.timer = powerup.duration;
      powerup.originalSpeed = speed;
      speed = speed * 0.5;
      break;
      
    case 'starPower':
      powerup.active = true;
      powerup.timer = powerup.duration;
      dino.isInvincible = true;
      break;
      
    case 'magnet':
      powerup.active = true;
      powerup.timer = powerup.duration;
      break;
  }
}

// Update power-ups
function updatePowerups() {
  const now = Date.now();
  
  // Update active power-ups
  for (let key in powerups.types) {
    const powerup = powerups.types[key];
    if (powerup.active) {
      powerup.timer -= 16; // Decrease by frame time
      
      // Visual feedback: blink when almost expired
      if (powerup.timer < 1000 && Math.floor(now / 200) % 2 === 0) {
        // Blink effect
      }
      
      if (powerup.timer <= 0) {
        deactivatePowerup(key);
      }
    }
  }
}

// Deactivate power-up
function deactivatePowerup(type) {
  const powerup = powerups.types[type];
  powerup.active = false;
  powerup.timer = 0;
  
  switch(type) {
    case 'shield':
      dino.hasShield = false;
      break;
    case 'slowMotion':
      speed = powerup.originalSpeed;
      break;
    case 'starPower':
      dino.isInvincible = false;
      break;
    case 'doubleJump':
      powerup.jumpsLeft = 0;
      break;
  }
}

// Update game
function update() {
  if (!gameRunning || gameOver) return;

  frame++;
  score += 0.2;
  
  // Apply slow motion effect on score
  const speedMultiplier = powerups.types.slowMotion.active ? 0.5 : 1;
  const effectiveSpeed = speed * speedMultiplier;

  // Magnet effect - attract coins
  if (powerups.types.magnet.active) {
    const magnetRange = 150;
    coins.forEach(coin => {
      const dx = dino.x - coin.x;
      const dy = (dino.y + dino.height/2) - (coin.y + coin.height/2);
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < magnetRange && distance > 0) {
        const pullStrength = 10;
        coin.x += (dx / distance) * pullStrength;
        coin.y += (dy / distance) * pullStrength;
      }
    });
  }

  scoreElement.textContent = Math.floor(score).toString().padStart(5, "0");
  coinCountElement.textContent = coinCount;

  // Dino physics
  if (dino.isJumping) {
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    if (dino.y >= groundY - dino.height) {
      dino.y = groundY - dino.height;
      dino.isJumping = false;
      dino.dy = 0;
      
      // Reset double jumps
      if (powerups.types.doubleJump.active) {
        powerups.types.doubleJump.jumpsLeft = 2;
      }
    }
  }

  // Spawn objects
  spawnObstacle();
  spawnCoin();
  spawnPowerup();
  updatePowerups();

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= effectiveSpeed;

    if (!obs.passed && obs.x + obs.width < dino.x) {
      obs.passed = true;
    }

    if (obs.x < -100) {
      obstacles.splice(i, 1);
    }
  }

  // Update coins
  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];
    coin.x -= effectiveSpeed;
    coin.bobOffset += 0.05;
    coin.y += Math.sin(coin.bobOffset) * 0.2;

    // Check collection
    if (!coin.collected) {
      const dx = (dino.x + dino.width/2) - (coin.x + coin.width/2);
      const dy = (dino.y + dino.height/2) - (coin.y + coin.height/2);
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < 30) {
        coin.collected = true;
        coinCount++;
        score += 5;
        // Visual feedback - could add particle effect here
      }
    }

    if (coin.x < -100) {
      coins.splice(i, 1);
    }
  }

  // Update power-up items
  for (let i = powerupItems.length - 1; i >= 0; i--) {
    let item = powerupItems[i];
    item.x -= effectiveSpeed;
    
    // Bounce animation
    item.y += Math.sin(frame * 0.05 + i) * 0.2;

    // Check collection
    if (!item.collected) {
      const dx = (dino.x + dino.width/2) - (item.x + item.width/2);
      const dy = (dino.y + dino.height/2) - (item.y + item.height/2);
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < 40) {
        item.collected = true;
        activatePowerup(item.type);
        score += 10; // Bonus points for collecting power-up
        // Visual feedback
      }
    }

    if (item.x < -100) {
      powerupItems.splice(i, 1);
    }
  }

  // Update clouds
  clouds.forEach((cloud) => {
    cloud.x -= effectiveSpeed * 0.3;
    if (cloud.x < -200) cloud.x = canvas.width + Math.random() * 400;
  });

  // Collision detection
  checkCollisions();

  // Increase difficulty
  if (frame % 1200 === 0) speed += 0.2;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky background
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw clouds
  ctx.fillStyle = "#535353";
  clouds.forEach((cloud) => {
    ctx.globalAlpha = 0.6;
    ctx.fillRect(cloud.x, cloud.y, 60 * cloud.size, 25 * cloud.size);
    ctx.fillRect(
      cloud.x + 20 * cloud.size,
      cloud.y - 10 * cloud.size,
      45 * cloud.size,
      25 * cloud.size,
    );
    ctx.globalAlpha = 1;
  });

  // Draw coins
  coins.forEach((coin) => {
    if (!coin.collected) {
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#DAA520";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner circle
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/4, 0, Math.PI * 2);
      ctx.fill();
      
      // Sparkle effect
      ctx.fillStyle = "#FFF8DC";
      ctx.globalAlpha = 0.5 + Math.sin(frame * 0.1 + coin.bobOffset) * 0.3;
      ctx.beginPath();
      ctx.arc(coin.x + coin.width/2 - 3, coin.y + coin.height/2 - 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  });

  // Draw power-up items
  powerupItems.forEach((item) => {
    const powerup = powerups.types[item.type];
    ctx.fillStyle = powerup.color;
    ctx.globalAlpha = 0.8 + Math.sin(frame * 0.05) * 0.2;
    
    // Glow effect
    const gradient = ctx.createRadialGradient(
      item.x + item.width/2, item.y + item.height/2, 5,
      item.x + item.width/2, item.y + item.height/2, 30
    );
    gradient.addColorStop(0, powerup.color + '80');
    gradient.addColorStop(1, powerup.color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(item.x - 20, item.y - 20, item.width + 40, item.height + 40);
    
    // Power-up background
    ctx.fillStyle = powerup.color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(item.x, item.y, item.width, item.height);
    
    // Icon
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(powerup.icon, item.x + item.width/2, item.y + item.height/2);
    
    ctx.globalAlpha = 1;
  });

  // Draw ground
  ctx.fillStyle = "#535353";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Ground lines
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  for (let x = (frame * -speed) % 60; x < canvas.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, groundY + 10);
    ctx.lineTo(x + 30, groundY + 10);
    ctx.stroke();
  }

  // Draw Dino
  const dHeight = dino.isDucking ? 35 : dino.height;
  const dY = dino.isDucking ? groundY - dHeight : dino.y;

  // Shield effect
  if (dino.hasShield) {
    ctx.strokeStyle = "#00BFFF";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.6 + Math.sin(frame * 0.1) * 0.2;
    ctx.beginPath();
    ctx.arc(dino.x + dino.width/2, dY + dHeight/2, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Star Power effect
  if (dino.isInvincible) {
    ctx.globalAlpha = 0.3 + Math.sin(frame * 0.2) * 0.2;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(dino.x + dino.width/2, dY + dHeight/2, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Dino body
  ctx.fillStyle = dino.isInvincible ? "#FFD700" : "#333";
  
  // Body
  ctx.fillRect(dino.x + 10, dY + 10, 30, 25);
  // Head
  ctx.fillRect(dino.x + 30, dY + 8, 18, 20);
  // Tail
  ctx.fillRect(dino.x + 5, dY + 20, 12, 12);
  // Leg
  if (!dino.isJumping) {
    const leg = Math.floor(frame / 6) % 2 === 0 ? 8 : 18;
    ctx.fillRect(dino.x + 15, dY + 30, 8, leg);
    ctx.fillRect(dino.x + 28, dY + 30, 8, leg === 8 ? 18 : 8);
  }

  // Eye
  ctx.fillStyle = "#fff";
  ctx.fillRect(dino.x + 40, dY + 13, 6, 6);
  ctx.fillStyle = "#000";
  ctx.fillRect(dino.x + 42, dY + 15, 3, 3);

  // Draw obstacles
  ctx.fillStyle = "#333";
  obstacles.forEach((obs) => {
    if (obs.type.includes("cactus")) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.fillRect(obs.x + 8, obs.y - 12, 8, 15);
    } else if (obs.type === "bird") {
      ctx.fillRect(obs.x, obs.y, obs.width, 20);
      ctx.fillRect(obs.x + 10, obs.y - 8, 25, 12);
    }
  });

  // Draw active power-ups status
  let yPos = 10;
  for (let key in powerups.types) {
    const powerup = powerups.types[key];
    if (powerup.active) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(10, yPos, 150, 25);
      ctx.fillStyle = powerup.color;
      ctx.font = "14px Courier New";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const remaining = Math.ceil(powerup.timer / 1000);
      ctx.fillText(`${powerup.icon} ${powerup.name}: ${remaining}s`, 15, yPos + 12);
      yPos += 30;
    }
  }
}

// Collision
function checkCollisions() {
  const dinoBox = {
    x: dino.x + 10,
    y: dino.isDucking ? groundY - 35 : dino.y + 10,
    width: dino.width - 15,
    height: dino.isDucking ? 30 : dino.height - 15,
  };

  for (let obs of obstacles) {
    const obsBox = {
      x: obs.x + 5,
      y: obs.y + 5,
      width: obs.width - 10,
      height: obs.height - 10,
    };

    if (
      dinoBox.x < obsBox.x + obsBox.width &&
      dinoBox.x + dinoBox.width > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.height &&
      dinoBox.y + dinoBox.height > obsBox.y
    ) {
      // Check if we have protection
      if (dino.hasShield) {
        // Shield protects from one hit
        deactivatePowerup('shield');
        // Remove the obstacle
        const index = obstacles.indexOf(obs);
        if (index > -1) {
          obstacles.splice(index, 1);
        }
        continue;
      }
      
      if (dino.isInvincible) {
        // Invincible - just remove obstacle
        const index = obstacles.indexOf(obs);
        if (index > -1) {
          obstacles.splice(index, 1);
        }
        continue;
      }
      
      endGame();
      return;
    }
  }
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  if (score > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem("dinoHighScore", highScore);
  }
  finalScoreEl.textContent = Math.floor(score);
  finalCoinsEl.textContent = coinCount;
  highScoreEl.textContent = highScore;
  gameOverScreen.style.display = "flex";
}

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
function jump() {
  if (!gameRunning) return;
  
  const doubleJumpPowerup = powerups.types.doubleJump;
  
  if (!dino.isJumping) {
    // First jump
    dino.isJumping = true;
    dino.dy = JUMP;
    if (doubleJumpPowerup.active) {
      doubleJumpPowerup.jumpsLeft = 1;
    }
  } else if (doubleJumpPowerup.active && doubleJumpPowerup.jumpsLeft > 0) {
    // Double jump
    dino.dy = JUMP * 0.8;
    doubleJumpPowerup.jumpsLeft--;
  }
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameOver = false;
  score = 0;
  coinCount = 0;
  speed = 6;
  obstacles = [];
  coins = [];
  powerupItems = [];
  dino.y = groundY - dino.height;
  dino.isJumping = false;
  dino.isDucking = false;
  dino.hasShield = false;
  dino.isInvincible = false;
  
  // Reset power-ups
  for (let key in powerups.types) {
    const powerup = powerups.types[key];
    powerup.active = false;
    powerup.timer = 0;
    if (key === 'doubleJump') {
      powerup.jumpsLeft = 0;
    }
    if (key === 'slowMotion') {
      powerup.originalSpeed = 6;
    }
  }
  
  // Update displays
  coinCountElement.textContent = "0";
  
  // Hide start screen and legend
  startScreen.style.display = "none";
  powerupLegend.style.display = "none";
  gameOverScreen.style.display = "none";
}

// Restart
window.restartGame = function () {
  startGame();
};

// Keyboard
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if ((e.key === " " || e.key === "ArrowUp") && !gameRunning && !gameOver) {
    startGame();
  } else if ((e.key === " " || e.key === "ArrowUp") && gameRunning) {
    jump();
  }

  if (e.key === "ArrowDown") {
    dino.isDucking = true;
  }

  if ((e.key === " " || e.key === "Enter") && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    dino.isDucking = false;
  }
});

// Touch support
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (!gameRunning && !gameOver) {
    startGame();
  } else if (gameRunning) {
    jump();
  } else if (gameOver) {
    restartGame();
  }
});

canvas.addEventListener("mousedown", () => {
  if (gameRunning) jump();
});

// Initialize
function init() {
  initClouds();
  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";
  powerupLegend.style.display = "block";
  highScoreEl.textContent = highScore;
  coinCountElement.textContent = "0";
  gameLoop();
}

window.onload = init;