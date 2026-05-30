// js/financialScore.js

export const calculateFinancialScore = (
  analytics
) => {

  let score = 100;

  if (analytics.savingsRate < 20) {
    score -= 25;
  }

  if (
    analytics.expense >
    analytics.income
  ) {
    score -= 40;
  }

  if (
    analytics.highestExpense >
    analytics.income * 0.5
  ) {
    score -= 15;
  }

  if (
    analytics.transactionCount > 40
  ) {
    score -= 10;
  }

  if (score < 0) {
    score = 0;
  }

  return score;
};