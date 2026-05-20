/* ---------- SELECTORS ---------- */
const form = document.querySelector(".add-transaction");
const amountInput = document.getElementById("amt");
const descInput = document.getElementById("desc");
const categoryInput = document.getElementById("cat");
const dateInput = document.getElementById("date");
const submitButton = form.querySelector('input[type="submit"]');
const cancelEditBtn = document.getElementById("cancelEditBtn");

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
let editingId = null;

/* ---------- DARK MODE ---------- */
modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

/* ---------- ADD / UPDATE TRANSACTION ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();

  const transaction = {
    id: editingId ?? Date.now(),
    amount: Number(amountInput.value),
    description: descInput.value.trim(),
    category: categoryInput.value,
    type: categoryInput.value === "income" ? "income" : "expense",
    date: dateInput.value
  };

  if (editingId) {
    transactions = transactions.map(txn => txn.id === editingId ? transaction : txn);
  } else {
    transactions.push(transaction);
  }

  saveAndUpdate();
  resetFormState();
});

/* ---------- RENDER ---------- */
function renderTransactions() {
  transactionList.innerHTML = "";

  transactions.forEach(txn => {
    const row = document.createElement("tr");
    const actionCell = createCell("Action", "");
    const actions = document.createElement("div");

    actions.className = "transaction-actions";
    actions.append(
      createActionButton("Edit", txn.id, "edit"),
      createActionButton("Delete", txn.id, "delete")
    );
    actionCell.appendChild(actions);

    row.append(
      createCell("Date", txn.date),
      createCell("Description", txn.description),
      createCell("Category", formatCategory(txn.category)),
      createCell("Amount", `Rs.${txn.amount}`),
      actionCell
    );

    transactionList.appendChild(row);
  });
}

function createCell(label, text) {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  cell.textContent = text;
  return cell;
}

function createActionButton(label, id, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-btn ${action}-btn`;
  button.dataset.id = id;
  button.dataset.action = action;
  button.textContent = label;
  return button;
}

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/* ---------- EDIT / DELETE ---------- */
transactionList.addEventListener("click", e => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    startEditing(id);
  }

  if (action === "delete") {
    transactions = transactions.filter(txn => txn.id !== id);
    if (editingId === id) resetFormState();
    saveAndUpdate();
  }
});

function startEditing(id) {
  const transaction = transactions.find(txn => txn.id === id);
  if (!transaction) return;

  editingId = id;
  amountInput.value = transaction.amount;
  descInput.value = transaction.description;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;
  submitButton.value = "Update Transaction";
  cancelEditBtn.hidden = false;
  amountInput.focus();
}

cancelEditBtn.addEventListener("click", resetFormState);

function resetFormState() {
  editingId = null;
  form.reset();
  submitButton.value = "Add Transaction";
  cancelEditBtn.hidden = true;
}

/* ---------- SUMMARY ---------- */
function updateSummary() {
  let income = 0, expense = 0;

  transactions.forEach(txn => {
    txn.type === "income" ? income += txn.amount : expense += txn.amount;
  });

  balanceEl.textContent = `Rs.${income - expense}`;
  incomeEl.textContent = `Rs.${income}`;
  expenseEl.textContent = `Rs.${expense}`;
}

/* ---------- CATEGORY ---------- */
function updateCategories() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };

  transactions.forEach(txn => {
    if (txn.type === "expense" && totals[txn.category] !== undefined) {
      totals[txn.category] += txn.amount;
    }
  });

  Object.keys(totals).forEach(cat => {
    categoryEls[cat].textContent = `Rs.${totals[cat]}`;
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

  budgetText.textContent = `Rs.${expense} / Rs.${monthlyBudget}`;
  progressFill.style.width = monthlyBudget ? `${Math.min((expense / monthlyBudget) * 100, 100)}%` : "0%";
}

/* ---------- RESET ---------- */
resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all data?")) return;

  transactions = [];
  monthlyBudget = 0;
  localStorage.clear();
  budgetInput.value = "";
  resetFormState();
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
