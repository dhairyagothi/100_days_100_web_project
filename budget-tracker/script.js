const expenseEntryForm = document.getElementById("expense-entry-form");
const expenseTitle = document.getElementById("expense-title");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const ledgerItemList = document.getElementById("ledger-item-list");

const displayLimit = document.getElementById("display-limit");
const displaySpent = document.getElementById("display-spent");
const displayRemaining = document.getElementById("display-remaining");

// Reference segments mapping directly into HTML component layout
const segmentsMap = {
  food: document.getElementById("segment-food"),
  rent: document.getElementById("segment-rent"),
  utilities: document.getElementById("segment-utilities"),
  entertainment: document.getElementById("segment-entertainment"),
};

const fixedTotalBudgetLimit = 2000;
let transactionDatasetCollection = [];

function computeFinancialBalanceMetrics() {
  // 1. Sum up cumulative total expenditures via operational reducer loops
  const cumulativeTotalSpent = transactionDatasetCollection.reduce(
    (runningSum, item) => runningSum + item.amount,
    0,
  );
  const calculatedRemainingBalance =
    fixedTotalBudgetLimit - cumulativeTotalSpent;

  // 2. Refresh basic plain text numbers in dashboard header
  displaySpent.textContent = cumulativeTotalSpent.toFixed(2);
  displayRemaining.textContent = calculatedRemainingBalance.toFixed(2);

  // 3. Reset all segment visual bar charts back down to zero baseline
  Object.values(segmentsMap).forEach(
    (segmentNode) => (segmentNode.style.width = "0%"),
  );

  // 4. Compute and write individual percentages onto categorical bar indicators
  ["food", "rent", "utilities", "entertainment"].forEach((categoryKey) => {
    const structuralCategorySum = transactionDatasetCollection
      .filter((item) => item.category === categoryKey)
      .reduce((runningSum, item) => runningSum + item.amount, 0);

    const computedPercentageRatio =
      (structuralCategorySum / fixedTotalBudgetLimit) * 100;

    if (segmentsMap[categoryKey]) {
      segmentsMap[categoryKey].style.width = `${computedPercentageRatio}%`;
    }
  });
}

function renderLedgerListView() {
  ledgerItemList.innerHTML = "";

  transactionDatasetCollection.forEach((transactionItem) => {
    const itemRowNode = document.createElement("li");
    itemRowNode.className = `ledger-item ${transactionItem.category}`;

    itemRowNode.innerHTML = `
            <div class="item-info">
                <h4>${transactionItem.title}</h4>
                <span>${transactionItem.category}</span>
            </div>
            <div class="item-value-box">
                <span class="item-amount">-$${transactionItem.amount.toFixed(2)}</span>
                <button type="button" class="delete-item-btn" onclick="removeTransactionItem(${transactionItem.id})" title="Delete entry">🗑️</button>
            </div>
        `;

    ledgerItemList.appendChild(itemRowNode);
  });
}

function appendNewExpenseTransaction(submitEvent) {
  submitEvent.preventDefault();

  const parsingNumericalValue = parseFloat(expenseAmount.value);
  if (isNaN(parsingNumericalValue) || parsingNumericalValue <= 0) return;

  // Instantiation contract matching transaction footprint specifications
  const standardizedTransactionObject = {
    id: Date.now(),
    title: expenseTitle.value.trim(),
    amount: parsingNumericalValue,
    category: expenseCategory.value,
  };

  transactionDatasetCollection.push(standardizedTransactionObject);

  // Save modifications down into browser data storage layers
  localStorage.setItem(
    "financeflow_ledger_store",
    JSON.stringify(transactionDatasetCollection),
  );

  // Refresh layout interfaces
  expenseEntryForm.reset();
  renderLedgerListView();
  computeFinancialBalanceMetrics();
}

// Exposed globally via window context hooks to ensure delete click callbacks map cleanly
window.removeTransactionItem = function (targetUniqueId) {
  transactionDatasetCollection = transactionDatasetCollection.filter(
    (item) => item.id !== targetUniqueId,
  );
  localStorage.setItem(
    "financeflow_ledger_store",
    JSON.stringify(transactionDatasetCollection),
  );

  renderLedgerListView();
  computeFinancialBalanceMetrics();
};

function restoreHistoricalLedgerSession() {
  const serializedCachePayload = localStorage.getItem(
    "financeflow_ledger_store",
  );

  if (serializedCachePayload) {
    transactionDatasetCollection = JSON.parse(serializedCachePayload);
  }

  renderLedgerListView();
  computeFinancialBalanceMetrics();
}

// Bind intercept handlers onto form elements
expenseEntryForm.addEventListener("submit", appendNewExpenseTransaction);

// Initialize application state
restoreHistoricalLedgerSession();
