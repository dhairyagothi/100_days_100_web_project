// js/app.js

import {
  getTransactions,
  saveTransactions,
  getGoals,
  saveGoals,
} from "./storage.js";

import {
  calculateAnalytics,
} from "./analyticsEngine.js";

import {
  calculateFinancialScore,
} from "./financialScore.js";

import {
  generateInsights,
} from "./aiInsights.js";

import {
  renderInsights,
} from "./financialInsights.js";

import {
  renderChart,
} from "./chartManager.js";

import {
  renderTransactions,
  addTransaction,
  filterTransactions,
} from "./transactionManager.js";

import {
  renderGoals,
  addGoal,
} from "./savingsManager.js";

import {
  autoCategorize,
} from "./smartCategorizer.js";

import {
  showNotification,
} from "./notificationManager.js";


let transactions =
  getTransactions();

let goals =
  getGoals();


// DASHBOARD UPDATE

const updateDashboard = () => {

  const analytics =
    calculateAnalytics(
      transactions
    );

  document.getElementById(
    "balance"
  ).innerText =
    `$${analytics.balance.toFixed(2)}`;

  document.getElementById(
    "income"
  ).innerText =
    `$${analytics.income.toFixed(2)}`;

  document.getElementById(
    "expense"
  ).innerText =
    `$${analytics.expense.toFixed(2)}`;

  document.getElementById(
    "count"
  ).innerText =
    analytics.transactionCount;

  document.getElementById(
    "highestExpense"
  ).innerText =
    `$${analytics.highestExpense}`;

  document.getElementById(
    "highestIncome"
  ).innerText =
    `$${analytics.highestIncome}`;

  document.getElementById(
    "savingRate"
  ).innerText =
    `${analytics.savingsRate}%`;

  // FINANCIAL SCORE

  const score =
    calculateFinancialScore(
      analytics
    );

  document.getElementById(
    "financialScore"
  ).innerText = score;

  // AI INSIGHTS

  generateInsights(
  transactions,
  analytics
).then((insights) => {

  renderInsights(
    insights
  );

});

  // CHART

  renderChart(transactions);
};


// INITIAL RENDER

renderTransactions(
  transactions
);

renderGoals(goals);

updateDashboard();


// TRANSACTION FORM

const transactionForm =
  document.getElementById(
    "transactionForm"
  );

transactionForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const description =
      document.getElementById(
        "desc"
      ).value;

    const amount =
      Number(
        document.getElementById(
          "amount"
        ).value
      );

    const type =
      document.getElementById(
        "type"
      ).value;

    let category =
      document.getElementById(
        "category"
      ).value;

    // SMART AUTO CATEGORY

    if (
      !category ||
      category === "auto"
    ) {

      category =
        autoCategorize(
          description
        );
    }

    const transaction = {

      description,

      amount,

      type,

      category,

      date:
        new Date()
          .toLocaleDateString(),
    };

    transactions =
      addTransaction(
        transactions,
        transaction
      );

    saveTransactions(
      transactions
    );

    renderTransactions(
      transactions
    );

    updateDashboard();

    transactionForm.reset();
  }
);


// SEARCH

const searchInput =
  document.getElementById(
    "search"
  );

searchInput.addEventListener(
  "input",
  (event) => {

    const filtered =
      filterTransactions(
        transactions,
        event.target.value
      );

    renderTransactions(
      filtered
    );
  }
);


// GOALS

window.addGoal = () => {

  const name =
    document.getElementById(
      "goalName"
    ).value;

  const target =
    Number(
      document.getElementById(
        "goalAmount"
      ).value
    );

  if (
    !name ||
    !target
  ) {

    showNotification(
      "Please enter valid goal details"
    );

    return;
  }

  const goal = {

    name,

    target,

    saved: 0,
  };

  goals =
    addGoal(
      goals,
      goal
    );

  saveGoals(goals);

  renderGoals(goals);

  showNotification(
    "Savings Goal Added"
  );

  document.getElementById(
    "goalName"
  ).value = "";

  document.getElementById(
    "goalAmount"
  ).value = "";
};


// THEME TOGGLE

const themeToggle =
  document.getElementById(
    "theme-toggle"
  );

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-mode"
    );
  }
);