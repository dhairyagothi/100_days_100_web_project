// js/analyticsEngine.js

export const calculateAnalytics = (
  transactions
) => {

  const income =
    transactions
      .filter(
        (t) => t.type === "income"
      )
      .reduce(
        (sum, t) => sum + t.amount,
        0
      );

  const expense =
    transactions
      .filter(
        (t) => t.type === "expense"
      )
      .reduce(
        (sum, t) => sum + t.amount,
        0
      );

  const balance =
    income - expense;

  const highestExpense =
    Math.max(
      ...transactions
        .filter(
          (t) => t.type === "expense"
        )
        .map((t) => t.amount),
      0
    );

  const highestIncome =
    Math.max(
      ...transactions
        .filter(
          (t) => t.type === "income"
        )
        .map((t) => t.amount),
      0
    );

  const savingsRate =
    income > 0
      ? (
          (
            (income - expense)
            / income
          ) * 100
        ).toFixed(1)
      : 0;

  return {

    income,
    expense,
    balance,

    highestExpense,
    highestIncome,

    savingsRate,

    transactionCount:
      transactions.length,
  };
};