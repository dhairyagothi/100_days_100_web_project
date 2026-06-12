const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Fetch items from LocalStorage safely
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions"),
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

// Generate unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list safely without innerHTML security issues
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Create description wrapper safely
  const textSpan = document.createElement("span");
  textSpan.textContent = transaction.text;

  // Create amount text layout
  const amountSpan = document.createElement("span");
  amountSpan.textContent = `${sign}₹${Math.abs(transaction.amount).toFixed(2)}`;

  // Create deletion control securely
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "x";
  deleteBtn.setAttribute("aria-label", `Delete ${transaction.text}`);
  deleteBtn.addEventListener("click", () => removeTransaction(transaction.id));

  item.appendChild(deleteBtn);
  item.appendChild(textSpan);
  item.appendChild(amountSpan);
  list.appendChild(item);
}

// Update the balance, income and expense totals
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  money_plus.textContent = `+₹${income}`;
  money_minus.textContent = `-₹${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = ""; // Safe to clear structural content container
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener("submit", addTransaction);
