    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Check if dark mode was saved
    if (localStorage.getItem("theme") === "light") {
      body.classList.add("light-mode");
      themeToggle.textContent = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      const isLight = body.classList.contains("light-mode");
      themeToggle.textContent = isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });

    // ===== GAME LOGIC =====
    const actionBtn = document.getElementById("actionBtn");
    const countdownText = document.getElementById("countdownText");
    const redLight = document.getElementById("redLight");
    const orangeLight = document.getElementById("orangeLight");
    const greenLight = document.getElementById("greenLight");
    const leaderboard = document.getElementById("leaderboard");

    let scores = JSON.parse(localStorage.getItem("reactionScores")) || [];
    let gameActive = false;
    let waitingForClick = false;
    let gameStartTime = 0;

    // Clear all lights
    function clearLights() {
      redLight.classList.remove("red");
      orangeLight.classList.remove("orange");
      greenLight.classList.remove("green");
      countdownText.textContent = "Ready?";
    }

    // Reset button to start mode
    function resetButton() {
      actionBtn.classList.remove("green-mode");
      actionBtn.textContent = "Click to Start";
    }

    // Change button to green mode
    function changeToGreenMode() {
      actionBtn.classList.add("green-mode");
      actionBtn.textContent = "Click!";
    }

    // Start the game
    function startGame() {
      gameActive = true;
      actionBtn.disabled = true;
      resetButton();
      clearLights();

      // 3... 2... 1... sequence
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        if (countdown > 0) {
          countdownText.textContent = countdown;

          if (countdown === 3) {
            redLight.classList.add("red");
          } else if (countdown === 2) {
            redLight.classList.remove("red");
            orangeLight.classList.add("orange");
          } else if (countdown === 1) {
            orangeLight.classList.remove("orange");
          }

          countdown--;
        } else {
          clearInterval(countdownInterval);
          // GREEN LIGHT APPEARS - TIMER STARTS HERE
          greenLight.classList.add("green");
          countdownText.textContent = "GO!";
          gameStartTime = Date.now(); // ← RECORDING STARTS WHEN GREEN
          waitingForClick = true;
          actionBtn.disabled = false; // Enable button for clicking
          changeToGreenMode(); // ← Change button to green with checkmark

          // Set timeout if user is too slow
          setTimeout(() => {
            if (waitingForClick) {
              waitingForClick = false;
              countdownText.textContent = "Missed!";
              clearLights();
              resetButton();
              gameActive = false;
              actionBtn.disabled = false;
            }
          }, 5000);
        }
      }, 1000);
    }

    // Handle button click
    actionBtn.addEventListener("click", () => {
      if (!gameActive) {
        // Start mode - click to begin
        startGame();
      } else if (waitingForClick) {
        // Green mode - record the score
        recordScore();
      }
    });

    // Record score
    function recordScore() {
      const reactionTime = Date.now() - gameStartTime;
      waitingForClick = false;
      gameActive = false;

      countdownText.textContent = `⚡ ${reactionTime} ms!`;
      clearLights();
      resetButton();
      actionBtn.disabled = true;

      // Add score to list
      scores.push(reactionTime);
      // Sort and keep only top 5 best (lowest) scores
      scores.sort((a, b) => a - b);
      scores = scores.slice(0, 5);

      // Save to localStorage
      localStorage.setItem("reactionScores", JSON.stringify(scores));

      // Update leaderboard
      updateLeaderboard(reactionTime);

      // Re-enable button after delay
      setTimeout(() => {
        actionBtn.disabled = false;
        countdownText.textContent = "Ready?";
      }, 1500);
    }

    // Update leaderboard display
    function updateLeaderboard(newScore) {
      leaderboard.innerHTML = "";

      if (scores.length === 0) {
        leaderboard.innerHTML = '<div class="empty-slot">No scores yet. Start playing!</div>';
        return;
      }

      scores.forEach((score, index) => {
        const item = document.createElement("div");
        item.className = "leaderboard-item";
        
        // Highlight new score
        if (score === newScore && index === scores.indexOf(newScore)) {
          item.classList.add("new");
        }

        const rank = document.createElement("div");
        rank.className = "rank";
        rank.textContent = `#${index + 1}`;

        const value = document.createElement("div");
        value.className = "score-value";
        value.textContent = `${score} ms`;

        item.appendChild(rank);
        item.appendChild(value);
        leaderboard.appendChild(item);
      });
    }

    // Initialize leaderboard on load
    updateLeaderboard(null);