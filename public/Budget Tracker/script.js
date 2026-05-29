/* ---------- SELECTORS ---------- */
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
  other: document.querySelector('[data-cat="other"]')
};

const budgetInput = document.getElementById("budgetInput");
const budgetText = document.getElementById("budget");
const progressFill = document.querySelector(".progress-fill");

const modeToggle = document.querySelector(".mode");
const resetBtn = document.getElementById("resetBtn");

/* ---------- STATE ---------- */
let transactions = [];
let monthlyBudget = 0;

/* ---------- DARK MODE ---------- */
modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

/* ---------- ADD TRANSACTION ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    amount: Number(amountInput.value),
    description: descInput.value.trim(),
    category: categoryInput.value,
    type: categoryInput.value === "income" ? "income" : "expense",
    date: dateInput.value
  };

  transactions.push(transaction);
  saveAndUpdate();
  form.reset();

  // Re-set date after form reset
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) dateInput.value = today;
});

/* ---------- RENDER ---------- */
function renderTransactions() {
  transactionList.innerHTML = "";

  transactions.forEach(txn => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${txn.date}</td>
      <td>${txn.description}</td>
      <td>${txn.category}</td>
      <td>₹${txn.amount}</td>
      <td><button data-id="${txn.id}">Delete</button></td>
    `;
    transactionList.appendChild(row);
  });
}

/* ---------- DELETE ---------- */
transactionList.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id);
    transactions = transactions.filter(txn => txn.id !== id);
    saveAndUpdate();
  }
});

/* ---------- SUMMARY ---------- */
function updateSummary() {
  let income = 0, expense = 0;

  transactions.forEach(txn => {
    txn.type === "income" ? income += txn.amount : expense += txn.amount;
  });

  balanceEl.textContent = `₹${income - expense}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
}

/* ---------- CATEGORY ---------- */
function updateCategories() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };

  transactions.forEach(txn => {
    if (txn.type === "expense") totals[txn.category] += txn.amount;
  });

  Object.keys(totals).forEach(cat => {
    categoryEls[cat].textContent = `₹${totals[cat]}`;
  });
}

/* ---------- BUDGET ---------- */
budgetInput.addEventListener("input", () => {
  monthlyBudget = Number(budgetInput.value);
  updateBudget();
  localStorage.setItem("budget", monthlyBudget);
});

function updateBudget() {
  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  budgetText.textContent = `₹${expense} / ₹${monthlyBudget}`;
  progressFill.style.width = monthlyBudget ? `${Math.min((expense / monthlyBudget) * 100, 100)}%` : "0%";
}

/* ---------- INSIGHTS ---------- */
function updateInsights() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };
  let totalExpense = 0;
  let totalIncome = 0;

  transactions.forEach(txn => {
    if (txn.type === "expense") {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      } else {
        totals.other += txn.amount;
      }
      totalExpense += txn.amount;
    } else if (txn.type === "income") {
      totalIncome += txn.amount;
    }
  });

  const highestSpendingCatEl = document.getElementById("highest-spending-cat");
  const smartSuggestionEl = document.getElementById("smart-suggestion");
  const financialStatusEl = document.getElementById("financial-status");

  let maxCat = "";
  let maxAmount = 0;
  Object.keys(totals).forEach(cat => {
    if (totals[cat] > maxAmount) {
      maxAmount = totals[cat];
      maxCat = cat;
    }
  });

  if (maxAmount > 0) {
    const formattedCat = maxCat === "other" ? "Others" : maxCat.charAt(0).toUpperCase() + maxCat.slice(1);
    highestSpendingCatEl.textContent = `${formattedCat} (₹${maxAmount})`;
  } else {
    highestSpendingCatEl.textContent = "None";
  }

  let suggestion = "Add transactions to generate suggestions.";
  if (maxAmount > 0) {
    if (maxCat === "food") {
      suggestion = "You spent more on food this month. Consider cooking at home to save money.";
    } else if (maxCat === "travel") {
      suggestion = "You spent more on travel this month. Consider using public transport or carpooling.";
    } else if (maxCat === "shopping") {
      suggestion = "You spent more on shopping this month. Try waiting 48 hours before buying non-essential items.";
    } else if (maxCat === "other") {
      suggestion = "You spent more on other items. Try tracking smaller expenses to see where your money goes.";
    }
  }
  smartSuggestionEl.textContent = suggestion;

  let status = "No data available";
  if (totalExpense > 0 || totalIncome > 0) {
    if (totalExpense > totalIncome && totalIncome > 0) {
      status = "Warning: Expenses exceed income. Review your budget!";
    } else if (monthlyBudget > 0) {
      const budgetPct = (totalExpense / monthlyBudget) * 100;
      if (budgetPct >= 100) {
        status = "Budget Exceeded: Overspending! Restrict further purchases.";
      } else if (budgetPct >= 80) {
        status = "Caution: You have used over 80% of your monthly budget.";
      } else if (budgetPct <= 50) {
        status = "Healthy: Expenses are under 50% of your budget. Good job!";
      } else {
        status = "Moderate: Spending is on track with your budget.";
      }
    } else {
      if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
        if (savingsRate >= 50) {
          status = `Excellent: Saving ${Math.round(savingsRate)}% of your income!`;
        } else if (savingsRate >= 20) {
          status = `Good: Saving ${Math.round(savingsRate)}% of your income.`;
        } else {
          status = `Tight: Saving only ${Math.round(savingsRate)}% of your income.`;
        }
      } else {
        status = "Add income to view detailed saving progress.";
      }
    }
  }
  financialStatusEl.textContent = status;
}

/* ---------- RESET ---------- */
resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all data?")) return;

  transactions = [];
  monthlyBudget = 0;
  localStorage.clear();
  budgetInput.value = "";
  saveAndUpdate();
});

/* ---------- STORAGE ---------- */
function saveAndUpdate() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateSummary();
  updateCategories();
  updateBudget();
  updateInsights();
}

/* ---------- INIT ---------- */
(function init() {
  transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  monthlyBudget = Number(localStorage.getItem("budget")) || 0;
  budgetInput.value = monthlyBudget;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    modeToggle.checked = true;
  }

  // Auto-fill today's date
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) dateInput.value = today;

  saveAndUpdate();
})();
