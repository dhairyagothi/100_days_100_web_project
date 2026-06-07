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

    // ===== NEW DATA =====
    const ACHIEVEMENTS = [
      { id: "firstTest", icon: "🎯", name: "First Test", desc: "Complete your first reaction test" },
      { id: "fastReflexes", icon: "⚡", name: "Fast Reflexes", desc: "Get a time under 300ms" },
      { id: "lightningReflexes", icon: "⚡", name: "Lightning Reflexes", desc: "Get a time under 250ms" },
      { id: "f1Challenger", icon: "🏎️", name: "F1 Challenger", desc: "Get a time under 200ms" },
      { id: "consistentPlayer", icon: "🔥", name: "Consistent Player", desc: "Complete 10 reaction tests" }
    ];

    // Load all data from localStorage
    let savedData = {
      scores: JSON.parse(localStorage.getItem("reactionScores")) || [], // original scores (top 5)
      stats: JSON.parse(localStorage.getItem("reactionStats")) || {
        totalTests: 0,
        bestTime: Infinity,
        totalTime: 0,
        excellentCount: 0
      },
      achievements: JSON.parse(localStorage.getItem("reactionAchievements")) || {},
      testHistory: JSON.parse(localStorage.getItem("reactionHistory")) || []
    };

    // ===== GAME LOGIC =====
    const actionBtn = document.getElementById("actionBtn");
    const countdownText = document.getElementById("countdownText");
    const redLight = document.getElementById("redLight");
    const orangeLight = document.getElementById("orangeLight");
    const greenLight = document.getElementById("greenLight");
    const leaderboard = document.getElementById("leaderboard");
    const benchmarkModal = document.getElementById("benchmarkModal");
    const benchmarkClose = document.getElementById("benchmarkClose");
    const toastContainer = document.getElementById("toastContainer");
    const statsGrid = document.getElementById("statsGrid");
    const achievementsGrid = document.getElementById("achievementsGrid");
    const historyList = document.getElementById("historyList");

    let gameActive = false;
    let waitingForClick = false;
    let gameStartTime = 0;

    // ===== TOASTS =====
    function showToast(icon, title, message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-text">
          <strong>${title}</strong>
          <span>${message || ''}</span>
        </div>
      `;
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    // ===== BENCHMARK MODAL =====
    function showBenchmarkModal(reactionTime) {
      let rating, ratingClass;
      if (reactionTime > 300) {
        rating = "Beginner";
        ratingClass = "rating-beginner";
      } else if (reactionTime >= 250) {
        rating = "Average";
        ratingClass = "rating-average";
      } else if (reactionTime >= 200) {
        rating = "Fast";
        ratingClass = "rating-fast";
      } else {
        rating = "Elite";
        ratingClass = "rating-elite";
      }

      document.getElementById('benchmarkTime').textContent = `${reactionTime} ms`;
      const ratingEl = document.getElementById('benchmarkRating');
      ratingEl.textContent = rating;
      ratingEl.className = "benchmark-rating " + ratingClass;

      document.getElementById('benchmarkCompare').innerHTML = `
        <div class="benchmark-compare-item"><span class="benchmark-compare-label">👤 Average Human</span><span class="benchmark-compare-value">250ms</span></div>
        <div class="benchmark-compare-item"><span class="benchmark-compare-label">🎮 Professional Gamer</span><span class="benchmark-compare-value">200ms</span></div>
        <div class="benchmark-compare-item"><span class="benchmark-compare-label">🏎️ F1 Driver</span><span class="benchmark-compare-value">180ms</span></div>
      `;

      benchmarkModal.classList.add('active');
    }

    benchmarkClose.addEventListener('click', () => {
      benchmarkModal.classList.remove('active');
      setTimeout(() => {
        actionBtn.disabled = false;
        countdownText.textContent = "Ready?";
      }, 0);
    });

    benchmarkModal.addEventListener('click', (e) => {
      if (e.target === benchmarkModal) {
        benchmarkModal.classList.remove('active');
        setTimeout(() => {
          actionBtn.disabled = false;
          countdownText.textContent = "Ready?";
        }, 0);
      }
    });

    // ===== RENDER STATS =====
    function renderStats() {
      const totalTests = savedData.stats.totalTests;
      const bestTime = savedData.stats.bestTime === Infinity ? "-" : `${savedData.stats.bestTime} ms`;
      const avgTime = totalTests > 0 ? Math.round(savedData.stats.totalTime / totalTests) + " ms" : "-";
      const excellentCount = savedData.stats.excellentCount;

      document.getElementById('totalTests').textContent = totalTests;
      document.getElementById('bestTime').textContent = bestTime;
      document.getElementById('avgTime').textContent = avgTime;
      document.getElementById('excellentCount').textContent = excellentCount;
    }

    // ===== RENDER ACHIEVEMENTS =====
    function renderAchievements() {
      achievementsGrid.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = savedData.achievements[ach.id];
        return `
          <div class="achievement-badge ${unlocked ? 'unlocked' : 'locked'}" data-id="${ach.id}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
          </div>
        `;
      }).join("");

      const unlockedCount = Object.values(savedData.achievements).filter(v => v).length;
      document.getElementById('unlockedAchievements').textContent = unlockedCount;
      const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;
      document.getElementById('achievementProgress').style.width = `${progress}%`;
    }

    // ===== RENDER HISTORY =====
    function renderHistory() {
      if (savedData.testHistory.length === 0) {
        historyList.innerHTML = `<div class="empty-slot">No tests yet!</div>`;
        return;
      }
      historyList.innerHTML = savedData.testHistory.slice(0, 10).map(test => {
        let rating, ratingClass;
        if (test.time > 300) {
          rating = "Beginner";
          ratingClass = "rating-beginner";
        } else if (test.time >= 250) {
          rating = "Average";
          ratingClass = "rating-average";
        } else if (test.time >= 200) {
          rating = "Fast";
          ratingClass = "rating-fast";
        } else {
          rating = "Elite";
          ratingClass = "rating-elite";
        }
        const dateStr = new Date(test.timestamp).toLocaleTimeString();
        return `
          <div class="history-item">
            <div>
              <div class="history-time">${test.time} ms</div>
              <div class="history-timestamp">${dateStr}</div>
            </div>
            <div class="history-rating ${ratingClass}">${rating}</div>
          </div>
        `;
      }).join("");
    }

    // ===== CHECK ACHIEVEMENTS =====
    function checkAchievements(reactionTime) {
      let unlockedAny = false;
      // First test
      if (!savedData.achievements.firstTest && savedData.stats.totalTests >=1) {
        savedData.achievements.firstTest = true;
        showToast('🎯', 'Achievement Unlocked!', 'First Test');
        unlockedAny = true;
      }
      // Fast reflexes <300ms
      if (!savedData.achievements.fastReflexes && reactionTime < 300) {
        savedData.achievements.fastReflexes = true;
        showToast('⚡', 'Achievement Unlocked!', 'Fast Reflexes');
        unlockedAny = true;
      }
      // Lightning <250ms
      if (!savedData.achievements.lightningReflexes && reactionTime < 250) {
        savedData.achievements.lightningReflexes = true;
        showToast('⚡', 'Achievement Unlocked!', 'Lightning Reflexes');
        unlockedAny = true;
      }
      // F1 <200ms
      if (!savedData.achievements.f1Challenger && reactionTime < 200) {
        savedData.achievements.f1Challenger = true;
        showToast('🏎️', 'Achievement Unlocked!', 'F1 Challenger');
        unlockedAny = true;
      }
      // Consistent player (10 tests)
      if (!savedData.achievements.consistentPlayer && savedData.stats.totalTests >= 10) {
        savedData.achievements.consistentPlayer = true;
        showToast('🔥', 'Achievement Unlocked!', 'Consistent Player');
        unlockedAny = true;
      }
      if (unlockedAny) {
        localStorage.setItem('reactionAchievements', JSON.stringify(savedData.achievements));
        renderAchievements();
      }
    }

    // ===== CLEAR LIGHTS =====
    function clearLights() {
      redLight.classList.remove("red");
      orangeLight.classList.remove("orange");
      greenLight.classList.remove("green");
      countdownText.textContent = "Ready?";
    }

    function resetButton() {
      actionBtn.classList.remove("green-mode");
      actionBtn.textContent = "Click to Start";
    }

    function changeToGreenMode() {
      actionBtn.classList.add("green-mode");
      actionBtn.textContent = "Click!";
    }

    // ===== START GAME =====
    function startGame() {
      gameActive = true;
      actionBtn.disabled = true;
      resetButton();
      clearLights();

      let countdown = 3;
      const countdownInterval = setInterval(() => {
        if (countdown > 0) {
          countdownText.textContent = countdown;

          if (countdown ===3) redLight.classList.add("red");
          else if (countdown === 2) {
            redLight.classList.remove("red");
            orangeLight.classList.add("orange");
          } else if (countdown === 1) {
            orangeLight.classList.remove("orange");
          }

          countdown--;
        } else {
          clearInterval(countdownInterval);
          greenLight.classList.add("green");
          countdownText.textContent = "GO!";
          gameStartTime = Date.now();
          waitingForClick = true;
          actionBtn.disabled = false;
          changeToGreenMode();

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

    // ===== HANDLE CLICK =====
    actionBtn.addEventListener("click", () => {
      if (!gameActive) {
        startGame();
      } else if (waitingForClick) {
        recordScore();
      }
    });

    // ===== RECORD SCORE =====
    function recordScore() {
      const reactionTime = Date.now() - gameStartTime;
      waitingForClick = false;
      gameActive = false;

      countdownText.textContent = `⚡ ${reactionTime} ms!`;
      clearLights();
      resetButton();
      actionBtn.disabled = true;

      // Update original leaderboard data
      savedData.scores.push(reactionTime);
      savedData.scores.sort((a, b) => a - b);
      savedData.scores = savedData.scores.slice(0, 5);
      localStorage.setItem("reactionScores", JSON.stringify(savedData.scores));

      // Update stats
      savedData.stats.totalTests +=1;
      if (reactionTime < savedData.stats.bestTime) savedData.stats.bestTime = reactionTime;
      savedData.stats.totalTime += reactionTime;
      if (reactionTime < 200) savedData.stats.excellentCount +=1;
      localStorage.setItem('reactionStats', JSON.stringify(savedData.stats));

      // Add to history
      savedData.testHistory.unshift({
        time: reactionTime,
        timestamp: Date.now()
      });
      savedData.testHistory = savedData.testHistory.slice(0, 10);
      localStorage.setItem('reactionHistory', JSON.stringify(savedData.testHistory));

      // Render everything new!
      renderStats();
      renderHistory();
      checkAchievements(reactionTime);
      updateLeaderboard(reactionTime);

      // Show benchmark modal
      setTimeout(() => showBenchmarkModal(reactionTime), 800);
    }

    function updateLeaderboard(newScore) {
      leaderboard.innerHTML = "";
      if (savedData.scores.length === 0) {
        leaderboard.innerHTML = '<div class="empty-slot">No scores yet. Start playing!</div>';
        return;
      }
      savedData.scores.forEach((score, index) => {
        const item = document.createElement("div");
        item.className = "leaderboard-item";
        if (score === newScore && index === savedData.scores.indexOf(newScore)) item.classList.add("new");
        const rank = document.createElement("div");
        rank.className = "rank";
        rank.textContent = `#${index+1}`;
        const value = document.createElement("div");
        value.className = "score-value";
        value.textContent = `${score} ms`;
        item.appendChild(rank);
        item.appendChild(value);
        leaderboard.appendChild(item);
      });
    }

    // Initialize on load
    updateLeaderboard(null);
    renderStats();
    renderAchievements();
    renderHistory();
