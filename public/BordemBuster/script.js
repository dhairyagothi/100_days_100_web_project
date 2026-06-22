document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // ELEMENTS
  // -----------------------------
  const fetchBtn = document.getElementById("fetchBtn");
  const againBtn = document.getElementById("againBtn");
  const favBtn = document.getElementById("favBtn");
  const shareBtn = document.getElementById("shareBtn");
  const completeBtn = document.getElementById("completeBtn");

  const resultBox = document.getElementById("resultBox");
  const activityName = document.getElementById("activityName");

  const pillType = document.getElementById("pillType");
  const pillPeeps = document.getElementById("pillPeeps");
  const pillCost = document.getElementById("pillCost");

  const historyList = document.getElementById("historyList");
  const favList = document.getElementById("favList");

  const completedCountEl = document.getElementById("completedCount");
  const badges = document.querySelectorAll(".badge");

  const toast = document.getElementById("toast");
  const themeBtn = document.getElementById("themeBtn");

  const category = document.getElementById("category");
  const participants = document.getElementById("participants");
  const budget = document.getElementById("budget");

  const searchInput = document.getElementById("activitySearch");
  const filterCategory = document.getElementById("filterCategory");
  const filterCost = document.getElementById("filterCost");
  const resultsCount = document.getElementById("resultsCount");

  const extraCard = document.getElementById("extraCard");

  // -----------------------------
  // DATA
  // -----------------------------
  const activities = [
    { activity: "Organize your digital photos", type: "busywork", participants: 1, cost: "free" },
    { activity: "Cook a local dish", type: "cooking", participants: 1, cost: "cheap" },
    { activity: "Board game night", type: "social", participants: 4, cost: "cheap" },
    { activity: "Nature walk", type: "recreational", participants: 1, cost: "free" },
    { activity: "Stargazing", type: "relaxation", participants: 1, cost: "free" },
    { activity: "Learn a language", type: "education", participants: 1, cost: "free" },
    { activity: "DIY project", type: "diy", participants: 1, cost: "cheap" }
  ];

  // -----------------------------
  // STATE
  // -----------------------------
  let currentActivity = null;

  let history = JSON.parse(localStorage.getItem("history")) || [];
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let completed = JSON.parse(localStorage.getItem("completed")) || [];

  // -----------------------------
  // INIT UI
  // -----------------------------
  resultBox.hidden = false;
  activityName.textContent = "Ready! Click 'Find Activity'";

  updateHistory();
  updateFavourites();
  updateProgress();

  // -----------------------------
  // CORE GENERATOR
  // -----------------------------
  function generateActivity() {
    const cat = category.value;
    const ppl = participants.value;
    const cost = budget.value;

    const filtered = activities.filter(a => {
      if (cat && a.type !== cat) return false;
      if (ppl && a.participants !== parseInt(ppl)) return false;
      if (cost && a.cost !== cost) return false;
      return true;
    });

    const list = filtered.length ? filtered : activities;
    const chosen = list[Math.floor(Math.random() * list.length)];

    currentActivity = chosen;

    activityName.textContent = chosen.activity;

    pillType.textContent = `Type: ${chosen.type}`;
    pillPeeps.textContent = `People: ${chosen.participants}`;
    pillCost.textContent = `Cost: ${chosen.cost}`;

    addToHistory(chosen);
    showToast("✨ New activity generated!");
  }

  // -----------------------------
  // HISTORY
  // -----------------------------
  function addToHistory(act) {
    history.unshift(act);
    history = history.slice(0, 20);
    localStorage.setItem("history", JSON.stringify(history));
    updateHistory();
  }

  function updateHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML = "<li>No history yet</li>";
      return;
    }

    history.forEach((h, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${h.activity}</span>
        <small>${h.type}</small>
      `;
      historyList.appendChild(li);
    });
  }

  // -----------------------------
  // FAVORITES
  // -----------------------------
  function updateFavourites() {
    favList.innerHTML = "";

    if (favourites.length === 0) {
      favList.innerHTML = "<li>No favourites yet</li>";
      return;
    }

    favourites.forEach(f => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${f.activity}</span>`;
      favList.appendChild(li);
    });
  }

  function toggleFavourite() {
    if (!currentActivity) return;

    const exists = favourites.find(f => f.activity === currentActivity.activity);

    if (exists) {
      favourites = favourites.filter(f => f.activity !== currentActivity.activity);
      showToast("Removed from favourites");
    } else {
      favourites.push(currentActivity);
      showToast("Added to favourites ❤️");
    }

    localStorage.setItem("favourites", JSON.stringify(favourites));
    updateFavourites();
  }

  // -----------------------------
  // COMPLETION SYSTEM
  // -----------------------------
  function markComplete() {
    if (!currentActivity) return;

    if (!completed.includes(currentActivity.activity)) {
      completed.push(currentActivity.activity);
      localStorage.setItem("completed", JSON.stringify(completed));
      showToast("🎉 Marked completed!");
    } else {
      showToast("Already completed!");
    }

    updateProgress();
  }

  function updateProgress() {
    completedCountEl.textContent = completed.length;

    badges.forEach(b => {
      const target = parseInt(b.dataset.target);

      if (completed.length >= target) {
        b.classList.add("unlocked");
      }
    });
  }

  // -----------------------------
  // COPY
  // -----------------------------
  function copyActivity() {
    if (!currentActivity) return;

    navigator.clipboard.writeText(currentActivity.activity);
    showToast("Copied to clipboard 📋");
  }

  // -----------------------------
  // TOAST
  // -----------------------------
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // -----------------------------
  // EVENTS
  // -----------------------------
  fetchBtn.addEventListener("click", () => {
    fetchBtn.textContent = "Finding...";
    setTimeout(() => {
      generateActivity();
      fetchBtn.textContent = "Find Activity";
    }, 300);
  });

  againBtn.addEventListener("click", generateActivity);
  favBtn.addEventListener("click", toggleFavourite);
  shareBtn.addEventListener("click", copyActivity);
  completeBtn.addEventListener("click", markComplete);

  // -----------------------------
  // THEME
  // -----------------------------
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    themeBtn.textContent = next === "dark" ? "🌙" : "☀️";

    showToast(`Switched to ${next} mode`);
  });

  // -----------------------------
  // FILTER SYSTEM (history/fav search)
  // -----------------------------
  function filterLists() {
    const query = searchInput.value.toLowerCase();
    const cat = filterCategory.value;
    const cost = filterCost.value;

    const activeList =
      document.querySelector(".tab.active").dataset.tab === "favourites"
        ? favList
        : historyList;

    const items = activeList.querySelectorAll("li");

    let visible = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();

      const match =
        (!query || text.includes(query)) &&
        (!cat || text.includes(cat)) &&
        (!cost || text.includes(cost));

      item.style.display = match ? "flex" : "none";
      if (match) visible++;
    });

    resultsCount.textContent = `Showing ${visible} activities`;
  }

  searchInput.addEventListener("input", filterLists);
  filterCategory.addEventListener("change", filterLists);
  filterCost.addEventListener("change", filterLists);

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      setTimeout(filterLists, 100);
    });
  });
});