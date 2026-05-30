// js/storage.js

export const getTransactions = () => {

  return JSON.parse(
    localStorage.getItem("transactions")
  ) || [];

};

export const saveTransactions = (
  transactions
) => {

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

};

export const getGoals = () => {

  return JSON.parse(
    localStorage.getItem("goals")
  ) || [];

};

export const saveGoals = (
  goals
) => {

  localStorage.setItem(
    "goals",
    JSON.stringify(goals)
  );

};