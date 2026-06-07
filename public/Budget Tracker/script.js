/* =========================================================
   SELECTORS
========================================================= */

const form = document.querySelector(".add-transaction");

const amountInput = document.getElementById("amt");
const descInput = document.getElementById("desc");
const categoryInput = document.getElementById("cat");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transaction-list");

const balanceEl = document.getElementById("curramt");

const incomeEl = document.getElementById("income");

const expenseEl = document.getElementById("expense");

const categoryEls = {
  food: document.querySelector('[data-cat="food"]'),
  travel: document.querySelector('[data-cat="travel"]'),
  shopping: document.querySelector('[data-cat="shopping"]'),
  other: document.querySelector('[data-cat="other"]'),
};

const budgetInput = document.getElementById("budgetInput");

const budgetText = document.getElementById("budget");

const progressFill = document.querySelector(".progress-fill");

const modeToggle = document.querySelector(".mode");

const resetBtn = document.getElementById("resetBtn");

const emptyState = document.querySelector(".empty-state");

const toast = document.getElementById("toast");

const loader = document.querySelector(".loader");

const successSound = document.getElementById("successSound");

/* =========================================================
   STATE
========================================================= */

let transactions = [];
let monthlyBudget = 0;

/* =========================================================
   INJECT SHAKE KEYFRAME
========================================================= */

(function injectShakeKeyframe() {
  if (document.getElementById("shake-style")) return;

  const style = document.createElement("style");
  style.id = "shake-style";
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0);    }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX( 6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX( 4px); }
    }
  `;

  document.head.appendChild(style);
})();

/* =========================================================
   LOADER
========================================================= */

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 700);
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================================
   DARK MODE
========================================================= */

modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );

  showToast(
    document.body.classList.contains("dark")
      ? "Dark Mode Enabled 🌙"
      : "Light Mode Enabled ☀️",
  );
});

/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);
updateClock();

/* =========================================================
   ADD TRANSACTION
========================================================= */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // ── Input validation (fix for issue #6152) ──────────────────────────
  // Guards: empty, non-numeric, non-finite, zero/negative, too large
  const rawValue = amountInput.value.trim();
  const amount   = Number(rawValue);
  const errorEl  = document.getElementById("amt-error");

  if (rawValue === "" || isNaN(amount) || !isFinite(amount)) {
    if (errorEl) errorEl.textContent = "Please enter a valid number ⚠️";
    amountInput.focus();
    return;
  }

  if (amount <= 0) {
    if (errorEl) errorEl.textContent = "Amount must be greater than zero ⚠️";
    amountInput.focus();
    return;
  }

  if (amount > 1_000_000) {
    if (errorEl) errorEl.textContent = "Amount cannot exceed ₹10,00,000 ⚠️";
    amountInput.focus();
    return;
  }

  // Clear previous error on successful validation
  if (errorEl) errorEl.textContent = "";
  // ─────────────────────────────────────────────────────────────────────

  showLoader();

  const transaction = {
    id: Date.now(),
    amount: amount,
    description: descInput.value.trim(),
    category: categoryInput.value,
    type: categoryInput.value === "income" ? "income" : "expense",
    date: dateInput.value,
  };

  transactions.unshift(transaction);

  saveAndUpdate();

  successSound.play().catch(() => {});

  showToast("Transaction Added Successfully 🚀");

  form.reset();

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  hideLoader();
});

/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }

  transactions.forEach((txn) => {
    const row = document.createElement("tr");
    row.style.animation = "slideIn 0.5s ease";

    row.innerHTML = `
      <td>${formatDate(txn.date)}</td>
      <td>${txn.description}</td>
      <td>
        <span class="category-badge ${txn.category}">
          ${capitalize(txn.category)}
        </span>
      </td>
      <td class="${txn.type === "income" ? "income-text" : "expense-text"}">
        ${txn.type === "income" ? "+" : "-"}₹${txn.amount}
      </td>
      <td>
        <button class="delete-btn" data-id="${txn.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    transactionList.appendChild(row);
  });
}

/* =========================================================
   DELETE TRANSACTION
========================================================= */

transactionList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");

  if (!deleteBtn) return;

  const id = Number(deleteBtn.dataset.id);
  transactions = transactions.filter((txn) => txn.id !== id);

  saveAndUpdate();

  showToast("Transaction Deleted 🗑️");
});

/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((txn) => {
    if (txn.type === "income") {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });

  const balance = income - expense;

  animateNumber(balanceEl, balance);
  animateNumber(incomeEl, income);
  animateNumber(expenseEl, expense);

  // fix #6152: negative balance shown in red, positive in green
  balanceEl.style.color = balance < 0 ? "#ff4d4d" : "#00c853";
}

/* =========================================================
   UPDATE CATEGORIES
========================================================= */

function updateCategories() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };

  transactions.forEach((txn) => {
    if (txn.type === "expense") {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      }
    }
  });

  Object.keys(totals).forEach((cat) => {
    categoryEls[cat].textContent = `₹${totals[cat]}`;
  });
}

/* =========================================================
   BUDGET
========================================================= */

budgetInput.addEventListener("change", () => {
  monthlyBudget = Number(budgetInput.value);
  updateBudget();
  localStorage.setItem("budget", monthlyBudget);
  showToast("Budget Updated 💸");
});

function updateBudget() {
  const expense = transactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + txn.amount, 0);

  budgetText.textContent = `₹${expense} / ₹${monthlyBudget}`;

  const percentage = monthlyBudget > 0 ? (expense / monthlyBudget) * 100 : 0;

  progressFill.style.width = `${Math.min(percentage, 100)}%`;

  const smartSuggestionEl = document.getElementById("smart-suggestion");
  const financialStatusEl = document.getElementById("financial-status");

  if (monthlyBudget <= 0) {
    progressFill.style.background = "#6366f1";
    budgetText.style.color = "";
    return;
  }

  if (percentage < 50) {
    progressFill.style.background = "#00c853";
    budgetText.style.color = "#00c853";
    smartSuggestionEl.textContent = "Great job! Your spending is well under control ✅";
    financialStatusEl.textContent = "Healthy financial condition 💰";
  } else if (percentage >= 50 && percentage < 80) {
    progressFill.style.background = "#ffb300";
    budgetText.style.color = "#ff9800";
    smartSuggestionEl.textContent = "Caution: Budget usage is increasing ⚠️";
    financialStatusEl.textContent = "Monitor expenses carefully 👀";
  } else if (percentage >= 80 && percentage < 100) {
    progressFill.style.background = "#ff6d00";
    budgetText.style.color = "#ff6d00";
    smartSuggestionEl.textContent = "Warning: You are close to exceeding your budget 🚨";
    financialStatusEl.textContent = "Critical spending level ⚠️";
  } else {
    progressFill.style.background = "#ff1744";
    budgetText.style.color = "#ff1744";
    smartSuggestionEl.textContent = "Budget exceeded! Reduce unnecessary expenses immediately ❌";
    financialStatusEl.textContent = "Over budget 🚫";
    showToast("Monthly Budget Exceeded 🚨");

    const budgetWidget = document.querySelector(".monthly-budget");
    budgetWidget.style.animation = "none";
    void budgetWidget.offsetHeight;
    budgetWidget.style.animation = "shake 0.5s ease";
  }
}

/* =========================================================
   INSIGHTS
========================================================= */

function updateInsights() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };

  let totalExpense = 0;
  let totalIncome = 0;

  transactions.forEach((txn) => {
    if (txn.type === "expense") {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      } else {
        totals.other += txn.amount;
      }
      totalExpense += txn.amount;
    } else {
      totalIncome += txn.amount;
    }
  });

  const highestSpendingCatEl = document.getElementById("highest-spending-cat");
  const smartSuggestionEl = document.getElementById("smart-suggestion");
  const financialStatusEl = document.getElementById("financial-status");

  let maxCat = "";
  let maxAmount = 0;

  Object.keys(totals).forEach((cat) => {
    if (totals[cat] > maxAmount) {
      maxAmount = totals[cat];
      maxCat = cat;
    }
  });

  highestSpendingCatEl.textContent =
    maxAmount > 0 ? `${capitalize(maxCat)} (₹${maxAmount})` : "None";

  let suggestion = "Add more transactions to generate insights.";
  if (maxCat === "food") suggestion = "Food expenses are high 🍔";
  else if (maxCat === "travel") suggestion = "Travel spending increased ✈️";
  else if (maxCat === "shopping") suggestion = "Shopping expenses are high 🛍️";
  else if (maxCat === "other") suggestion = "Track miscellaneous expenses 📦";

  let status = "No financial data available.";

  if (totalIncome > 0) {
    const savings = totalIncome - totalExpense;
    const savingsRate = ((savings / totalIncome) * 100).toFixed(0);

    if (savingsRate >= 50) {
      status = `Excellent! Saving ${savingsRate}% 🎉`;
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } else if (savingsRate >= 20) {
      status = `Good savings rate ${savingsRate}%`;
    } else {
      status = `Low savings rate ${savingsRate}%`;
    }
  }

  if (monthlyBudget <= 0) {
    smartSuggestionEl.textContent = suggestion;
    financialStatusEl.textContent = status;
  }
}

/* =========================================================
   RESET
========================================================= */

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm("Reset all transactions?");
  if (!confirmReset) return;

  transactions = [];
  monthlyBudget = 0;
  localStorage.clear();
  budgetInput.value = "";

  saveAndUpdate();

  showToast("All Data Reset 🔄");
});

/* =========================================================
   STORAGE
========================================================= */

function saveAndUpdate() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderAll();
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {
  renderTransactions();
  updateSummary();
  updateCategories();
  updateBudget();
  updateInsights();
}

/* =========================================================
   ANIMATE NUMBER
========================================================= */

function animateNumber(element, target) {
  if (target === 0) {
    element.textContent = "₹0";
    return;
  }

  let start = 0;
  const duration = 1000;
  const increment = target / (duration / 16);

  const counter = setInterval(() => {
    start += increment;
    const reached = target > 0 ? start >= target : start <= target;

    if (reached) {
      start = target;
      clearInterval(counter);
    }

    element.textContent = `₹${Math.round(start)}`;
  }, 16);
}

/* =========================================================
   HELPERS
========================================================= */

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(date) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-IN", options);
}

/* =========================================================
   MAGNETIC BUTTON EFFECT
========================================================= */

const buttons = document.querySelectorAll(".submit-btn, #resetBtn");

buttons.forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

/* =========================================================
   INIT
========================================================= */

(function init() {
  transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  monthlyBudget = Number(localStorage.getItem("budget")) || 0;
  budgetInput.value = monthlyBudget || "";

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    modeToggle.checked = true;
  }

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  renderAll();
})();
