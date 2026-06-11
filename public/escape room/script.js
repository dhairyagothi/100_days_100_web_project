// SHADOW VAULT ESCAPE - script.js
let player = {
  name: "",
  role: "",
  level: 1,
  reason: "",
  ability: "",
  puzzlePref: "",
  inventory: [],
  timeLeft: 1800, // 30 minutes in seconds
};

let currentLevel = 1;
let currentRoom = 1;
let maxRooms = [4, 6, 8, 10];
let timerInterval;
let gameLog = [];

// Sample puzzles per level (room index starts at 1)
const puzzles = {
  1: [
    // Level 1 - 4 rooms
    {
      title: "THE ENTRANCE LOCK",
      desc: "The door reads: 'What is the first thing you lose in the Vault?'",
      answer: "hope",
      hint: "It's what keeps people going... until it doesn't.",
      visual: "fa-door-closed",
    },
    {
      title: "DEADLY CODE PANEL",
      desc: "Enter the 4-digit code from the flickering screen. Sum of digits = 10.",
      answer: "2350",
      hint: "2+3+5+0=10",
      visual: "fa-keyboard",
    },
    {
      title: "RIDDLE OF SHADOWS",
      desc: "I speak without a mouth and hear without ears. I have no eyes, yet I move. What am I?",
      answer: "echo",
      hint: "You hear me in caves.",
      visual: "fa-volume-up",
    },
    {
      title: "FINAL VAULT GATE",
      desc: "Type your role backwards to open.",
      answer: "rekcah",
      hint: "Depends on your chosen role (Hacker backwards)",
      visual: "fa-skull",
    },
  ],
  2: [
    // Level 2 - 6 rooms (more complex)
    {
      title: "PRESSURE CHAMBER",
      desc: "Solve: 13 × 8 - 42 = ?",
      answer: "62",
      hint: "Basic arithmetic under pressure.",
      visual: "fa-compress-arrows-alt",
    },
    {
      title: "LASER GRID",
      desc: "Password is the color of fear in the movie Escape Room.",
      answer: "red",
      hint: "The deadly room color.",
      visual: "fa-lightbulb",
    },
    // ... more puzzles added dynamically
  ],
  // Levels 3 and 4 will be generated with increasing difficulty
};

function log(message, type = "success") {
  const time = new Date()
    .toLocaleTimeString("en-US", { hour12: false })
    .slice(0, 8);
  gameLog.unshift(`[${time}] <span class="text-${type}">${message}</span>`);
  if (gameLog.length > 8) gameLog.pop();
  document.getElementById("game-log").innerHTML = gameLog.join("<br>");
}

function updateStatus() {
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("current-level").textContent = currentLevel;
  document.getElementById("current-room").textContent = currentRoom;
  document.getElementById("timer").textContent = formatTime(player.timeLeft);

  const progress = ((currentRoom - 1) / maxRooms[currentLevel - 1]) * 100;
  document.getElementById("level-progress").style.width = `${progress}%`;
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    player.timeLeft--;
    document.getElementById("timer").textContent = formatTime(player.timeLeft);

    if (player.timeLeft <= 300) {
      document.getElementById("timer").classList.add("text-danger", "blink");
    }
    if (player.timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("TIME'S UP. THE VAULT COLLAPSES.");
      location.reload();
    }
  }, 1000);
}

function loadRoom() {
  const levelPuzzles = puzzles[currentLevel] || generatePuzzles(currentLevel);
  const puzzle = levelPuzzles[(currentRoom - 1) % levelPuzzles.length];

  document.getElementById("room-title").textContent = puzzle.title;
  document.getElementById("room-number").textContent = `ROOM ${currentRoom}`;
  document.getElementById("puzzle-description").innerHTML =
    `<strong>${puzzle.desc}</strong>`;

  const icon = document.getElementById("visual-icon");
  icon.className = `fas ${puzzle.visual || "fa-door-closed"} text-danger`;

  // Role-based flavor
  if (player.role === "Hacker" && currentRoom % 3 === 0) {
    log("Hacker bonus: Terminal interface stabilized.", "info");
  }

  updateStatus();
  log(`Entered Room ${currentRoom} - Level ${currentLevel}`, "warning");
}

function generatePuzzles(level) {
  // Dynamic puzzle generation for higher levels
  return Array.from({ length: maxRooms[level - 1] }, (_, i) => ({
    title: `SECTOR ${String.fromCharCode(65 + i)} LOCK`,
    desc: `Level ${level} Puzzle #${i + 1}. What is ${10 + level * 5} + ${i * 3}?`,
    answer: String(10 + level * 5 + i * 3),
    hint: "Simple math under extreme pressure.",
    visual: ["fa-lock", "fa-microchip", "fa-biohazard", "fa-skull-crossbones"][
      i % 4
    ],
  }));
}

function submitAnswer() {
  const input = document
    .getElementById("terminal-input")
    .value.trim()
    .toLowerCase();
  if (!input) return;

  document.getElementById("terminal-input").value = "";

  if (input === "hint") {
    const levelPuzzles = puzzles[currentLevel] || generatePuzzles(currentLevel);
    const puzzle = levelPuzzles[(currentRoom - 1) % levelPuzzles.length];
    log(`HINT: ${puzzle.hint}`, "info");
    player.timeLeft = Math.max(60, player.timeLeft - 45);
    return;
  }

  if (input === "inventory") {
    log(
      `Inventory: ${player.inventory.length ? player.inventory.join(", ") : "Empty"}`,
      "success",
    );
    return;
  }

  if (input === "status") {
    log(
      `Level ${currentLevel} | Room ${currentRoom}/${maxRooms[currentLevel - 1]} | Time: ${formatTime(player.timeLeft)}`,
      "info",
    );
    return;
  }

  // Check answer
  const levelPuzzles = puzzles[currentLevel] || generatePuzzles(currentLevel);
  const puzzle = levelPuzzles[(currentRoom - 1) % levelPuzzles.length];

  let isCorrect = input === puzzle.answer.toLowerCase();

  // Role bonus
  if (player.role === "Hacker" && input.includes("hack")) isCorrect = true;

  if (isCorrect) {
    log("ACCESS GRANTED. DOOR UNLOCKED.", "success");
    player.inventory.push(`Key_${currentLevel}-${currentRoom}`);

    if (currentRoom < maxRooms[currentLevel - 1]) {
      currentRoom++;
      setTimeout(() => {
        loadRoom();
      }, 800);
    } else {
      // Level complete
      if (currentLevel < 4) {
        currentLevel++;
        currentRoom = 1;
        log(
          `LEVEL ${currentLevel} UNLOCKED. DEEPER INTO THE VAULT...`,
          "warning",
        );
        setTimeout(loadRoom, 1200);
      } else {
        // Game Win
        winGame();
      }
    }
  } else {
    log("INCORRECT SEQUENCE. VAULT PRESSURE INCREASING.", "danger");
    player.timeLeft = Math.max(60, player.timeLeft - 30);
  }

  updateStatus();
}

function winGame() {
  clearInterval(timerInterval);
  const minutes = Math.floor((1800 - player.timeLeft) / 60);
  document.getElementById("win-message").innerHTML = `
        Congratulations, ${player.name}!<br>
        You escaped the Shadow Vault in ${minutes} minutes.<br>
        Your role as ${player.role} saved you.
    `;
  new bootstrap.Modal(document.getElementById("winModal")).show();
}

function startGame() {
  // Collect profile
  player.name = document.getElementById("q-name").value || "Ghost";
  player.role = document.getElementById("q-role").value;
  player.level = parseInt(document.getElementById("q-level").value);
  player.reason = document.getElementById("q-reason").value;
  player.ability = document.getElementById("q-ability").value;
  player.puzzlePref = document.getElementById("q-puzzle").value;

  currentLevel = player.level;
  currentRoom = 1;

  // Profile display
  document.getElementById("profile-info").innerHTML = `
        <strong>${player.name}</strong><br>
        Role: ${player.role}<br>
        Ability: ${player.ability}<br>
        Motive: ${player.reason}
    `;

  bootstrap.Modal.getInstance(document.getElementById("startModal")).hide();

  log("INITIALIZING SHADOW VAULT PROTOCOL...", "warning");
  log(`Welcome, Operative ${player.name}.`, "success");

  startTimer();
  loadRoom();
}

function toggleTheme() {
  const themes = ["theme-dark", "theme-neon", "theme-crimson"];
  let current = document.body.className;
  let next = themes[(themes.indexOf(current) + 1) % themes.length];
  document.body.className = next;
  log("THEME SHIFTED.", "info");
}

function showHelpModal() {
  new bootstrap.Modal(document.getElementById("helpModal")).show();
}

function showRulesModal() {
  const rulesModal = new bootstrap.Modal(document.createElement("div"));
  // Simple alert for rules
  alert(
    "SHADOW VAULT RULES:\n• Solve puzzles via terminal\n• Use 'hint', 'inventory', 'status'\n• Time is your enemy\n• Survive all rooms to escape.",
  );
}

function restartGame() {
  location.reload();
}

// Initialize on load
window.onload = () => {
  new bootstrap.Modal(document.getElementById("startModal")).show();
  log("CONNECTION ESTABLISHED TO SHADOW VAULT...", "info");
};
