// js/transactionManager.js

import {
  saveTransactions,
} from "./storage.js";

import {
  showNotification,
} from "./notificationManager.js";

export const renderTransactions = (
  transactions
) => {

  const tbody =
    document.getElementById(
      "tbody"
    );

  tbody.innerHTML = "";

  transactions
    .slice()
    .reverse()
    .forEach((transaction) => {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>${transaction.description}</td>
        <td>$${transaction.amount}</td>
        <td>${transaction.type}</td>
        <td>${transaction.category}</td>
        <td>${transaction.date}</td>
      `;

      tbody.appendChild(row);
    });
};

export const addTransaction = (
  transactions,
  transaction
) => {

  transactions.push(transaction);

  saveTransactions(
    transactions
  );

  showNotification(
    "Transaction Added Successfully"
  );

  return transactions;
};

export const filterTransactions = (
  transactions,
  keyword
) => {

  return transactions.filter(
    (transaction) =>

      transaction.description
        .toLowerCase()
        .includes(
          keyword.toLowerCase()
        )
  );
};