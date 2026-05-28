<<<<<<< HEAD
let mainSalary = 0;
let remainingBudget = 0;
let expenses = [];
let budgetGoals = {};
=======
/* =========================================================
   SELECTORS
========================================================= */

const form = document.querySelector(".add-transaction");

const amountInput = document.getElementById("amt");
const descInput = document.getElementById("desc");
const categoryInput = document.getElementById("cat");
const dateInput = document.getElementById("date");
>>>>>>> main

function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}

<<<<<<< HEAD
function updateBudgetSummary() {
    document.getElementById('main-salary').textContent = formatCurrency(mainSalary);
    document.getElementById('remaining-budget').textContent = formatCurrency(remainingBudget);
}

function addExpenseItem(description, amount, category) {
    const expenseItem = document.createElement('tr');
    expenseItem.innerHTML = `
        <td>${description}</td>
        <td>${formatCurrency(amount)}</td>
        <td>${category}</td>
        <td><button onclick="removeExpenseItem(this)">Remove</button></td>
    `;

    const expenseList = document.getElementById('expense-list');
    expenseList.appendChild(expenseItem);

    expenses.push({ description, amount, category });
    remainingBudget -= amount;
    updateBudgetSummary();
    updateCharts();
    checkBudgetGoals();
}

function removeExpenseItem(button) {
    const row = button.closest('tr');
    const amount = parseFloat(row.children[1].textContent.slice(1));
    const description = row.children[0].textContent;
    const category = row.children[2].textContent;

    // Remove the expense item from the UI
    row.remove();

    // Remove the expense from the expenses array
    expenses = expenses.filter(expense => !(expense.description === description && expense.amount === amount && expense.category === category));
    
    // Update remaining budget and UI
    remainingBudget += amount;
    updateBudgetSummary();
    updateCharts();
    checkBudgetGoals();
}

function updateCharts() {
    // Clear existing charts if they exist
    if (window.categoryChart) {
        categoryChart.destroy();
    }
    if (window.trendChart) {
        trendChart.destroy();
    }

    // Calculate category-wise expenses
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    // Prepare data for category pie chart
    const categoryData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#00a8a8', '#ff9f40']
        }]
    };

    // Create category pie chart
    const categoryChartCtx = document.getElementById('category-chart').getContext('2d');
    window.categoryChart = new Chart(categoryChartCtx, {
        type: 'pie',
        data: categoryData
    });

    // Prepare data for trend bar chart
    const trendData = {
        labels: expenses.map(expense => expense.description),
        datasets: [{
            label: 'Amount (₹)',
            data: expenses.map(expense => expense.amount),
            backgroundColor: '#36a2eb'
        }]
    };

    // Create trend bar chart
    const trendChartCtx = document.getElementById('trend-chart').getContext('2d');
    window.trendChart = new Chart(trendChartCtx, {
        type: 'bar',
        data: trendData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const salary = parseFloat(document.getElementById('input-salary').value);
    const description = document.getElementById('input-description').value.trim();
    const amount = parseFloat(document.getElementById('input-amount').value);
    const categorySelect = document.getElementById('input-category');
    let category = categorySelect.value;

    if (category === 'Custom') {
        category = document.getElementById('custom-category').value.trim();
    }

    if (isNaN(salary) || salary <= 0 || description === '' || isNaN(amount) || amount <= 0 || category === '') {
        alert('Please enter valid salary, description, amount, and category.');
        return;
    }

    if (mainSalary === 0) {
        mainSalary = salary;
        remainingBudget = mainSalary;
        updateBudgetSummary();
    }

    addExpenseItem(description, amount, category);

    document.getElementById('input-description').value = '';
    document.getElementById('input-amount').value = '';
    categorySelect.value = '';
    document.getElementById('custom-category').style.display = 'none';
}

function handleGoalFormSubmit(event) {
    event.preventDefault();

    const category = document.getElementById('goal-category').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);

    if (category === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid category and amount for the goal.');
        return;
    }

    budgetGoals[category] = amount;
    document.getElementById('goal-alert').textContent = `Budget goal set for ${category}: ${formatCurrency(amount)}`;
    document.getElementById('goal-alert').style.display = 'block';
}

function checkBudgetGoals() {
    for (const category in budgetGoals) {
        const goalAmount = budgetGoals[category];
        const spentAmount = expenses.filter(expense => expense.category === category).reduce((total, expense) => total + expense.amount, 0);

        if (spentAmount >= goalAmount) {
            alert(`Alert: You have reached or exceeded your budget goal for ${category}.`);
        }
    }
}

document.getElementById('budget-form').addEventListener('submit', handleFormSubmit);
document.getElementById('input-category').addEventListener('change', function() {
    const customCategoryInput = document.getElementById('custom-category');
    if (this.value === 'Custom') {
        customCategoryInput.style.display = 'block';
    } else {
        customCategoryInput.style.display = 'none';
    }
});

// Initial function call to set up the charts when the page loads
updateCharts();
=======
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

  const amount = Number(amountInput.value);

  if (amount <= 0) {
    showToast("Enter valid amount ⚠️");

    return;
  }

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

  successSound.play();

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

        <button
          class="delete-btn"
          data-id="${txn.id}"
        >

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

  if (balance < 0) {
    balanceEl.style.color = "#ff4d4d";
  } else {
    balanceEl.style.color = "#00c853";
  }
}

/* =========================================================
   UPDATE CATEGORY
========================================================= */

function updateCategories() {
  const totals = {
    food: 0,

    travel: 0,

    shopping: 0,

    other: 0,
  };

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

budgetInput.addEventListener("input", () => {
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

  const percentage = monthlyBudget
    ? Math.min((expense / monthlyBudget) * 100, 100)
    : 0;

  progressFill.style.width = `${percentage}%`;

  if (percentage < 50) {
    progressFill.style.background = "#00c853";
  } else if (percentage < 80) {
    progressFill.style.background = "#ffb300";
  } else {
    progressFill.style.background = "#ff3d00";
  }
}

/* =========================================================
   INSIGHTS
========================================================= */

function updateInsights() {
  const totals = {
    food: 0,

    travel: 0,

    shopping: 0,

    other: 0,
  };

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

  if (maxAmount > 0) {
    highestSpendingCatEl.textContent = `${capitalize(maxCat)}
       (₹${maxAmount})`;
  } else {
    highestSpendingCatEl.textContent = "None";
  }

  let suggestion = "Add more transactions to generate insights.";

  if (maxCat === "food") {
    suggestion = "Food expenses are high 🍔";
  } else if (maxCat === "travel") {
    suggestion = "Travel spending increased ✈️";
  } else if (maxCat === "shopping") {
    suggestion = "Shopping expenses are high 🛍️";
  } else if (maxCat === "other") {
    suggestion = "Track miscellaneous expenses 📦";
  }

  smartSuggestionEl.textContent = suggestion;

  let status = "No financial data available.";

  if (totalIncome > 0) {
    const savings = totalIncome - totalExpense;

    const savingsRate = ((savings / totalIncome) * 100).toFixed(0);

    if (savingsRate >= 50) {
      status = `Excellent! Saving ${savingsRate}% 🎉`;

      confetti({
        particleCount: 150,

        spread: 90,

        origin: { y: 0.6 },
      });
    } else if (savingsRate >= 20) {
      status = `Good savings rate ${savingsRate}%`;
    } else {
      status = `Low savings rate ${savingsRate}%`;
    }
  }

  financialStatusEl.textContent = status;
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
  localStorage.setItem(
    "transactions",

    JSON.stringify(transactions),
  );

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
  let start = 0;

  const duration = 1000;

  const increment = target / (duration / 16);

  const counter = setInterval(() => {
    start += increment;

    if (start >= target) {
      start = target;

      clearInterval(counter);
    }

    element.textContent = `₹${Math.floor(start)}`;
  }, 16);
}

/* =========================================================
   HELPERS
========================================================= */

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(date) {
  const options = {
    day: "numeric",

    month: "short",

    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-IN", options);
}

/* =========================================================
   MAGNETIC BUTTON EFFECT
========================================================= */

const buttons = document.querySelectorAll(".submit-btn,#resetBtn");

buttons.forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;

    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(
          ${x * 0.15}px,
          ${y * 0.15}px
        )`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0,0)";
  });
});

/* =========================================================
   INIT
========================================================= */

(function init() {
  transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  monthlyBudget = Number(localStorage.getItem("budget")) || 0;

  budgetInput.value = monthlyBudget;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");

    modeToggle.checked = true;
  }

  const today = new Date()

    .toISOString()

    .split("T")[0];

  dateInput.value = today;

  saveAndUpdate();
})();
>>>>>>> main
