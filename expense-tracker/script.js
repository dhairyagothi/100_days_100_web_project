const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const clearBtn = document.getElementById('clear-btn');

const STORAGE_KEY = 'expenseTrackerTransactions';
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function formatCurrency(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function updateSummary() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((sum, value) => sum + value, 0);
  const income = amounts.filter((value) => value > 0).reduce((sum, value) => sum + value, 0);
  const expense = amounts.filter((value) => value < 0).reduce((sum, value) => sum + value, 0);

  balanceEl.textContent = formatCurrency(total);
  moneyPlusEl.textContent = `+${income.toFixed(2)}`;
  moneyMinusEl.textContent = `-${Math.abs(expense).toFixed(2)}`;
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions();
  refreshUI();
}

function createTransactionElement(transaction) {
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  const sign = transaction.amount < 0 ? '-' : '+';
  item.innerHTML = `
    <div class="transaction-item">
      <div class="transaction-meta">
        <span class="transaction-text">${transaction.text}</span>
        <span class="transaction-amount">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
      </div>
      <p class="label">${new Date(transaction.date).toLocaleDateString()}</p>
    </div>
    <button class="delete-btn" aria-label="Delete transaction" data-id="${transaction.id}">×</button>
  `;

  const deleteBtn = item.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => removeTransaction(transaction.id));

  return item;
}

function refreshUI() {
  listEl.innerHTML = '';
  if (transactions.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'transaction-empty';
    emptyMessage.textContent = 'No transactions yet. Add one to start tracking your money.';
    listEl.appendChild(emptyMessage);
  } else {
    transactions.slice().reverse().forEach((transaction) => {
      listEl.appendChild(createTransactionElement(transaction));
    });
  }

  updateSummary();
}

function showAlert(message) {
  alert(message);
}

function addTransaction(event) {
  event.preventDefault();

  const text = textInput.value.trim();
  const amount = Number(amountInput.value.trim());

  if (text === '' || isNaN(amount) || amount === 0) {
    showAlert('Please enter a valid description and amount. Amount cannot be zero.');
    return;
  }

  const transaction = {
    id: Date.now(),
    text,
    amount,
    date: new Date().toISOString(),
  };

  transactions.push(transaction);
  saveTransactions();
  refreshUI();
  form.reset();
  textInput.focus();
}

function clearTransactions() {
  if (!transactions.length) return;
  const confirmed = confirm('Clear all transactions? This cannot be undone.');
  if (confirmed) {
    transactions = [];
    saveTransactions();
    refreshUI();
  }
}

form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearTransactions);

refreshUI();
