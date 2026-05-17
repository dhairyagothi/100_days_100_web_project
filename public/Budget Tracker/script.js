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

  saveAndUpdate();
})();
