// js/analyticsEngine.js — Analytics computations (replaces routes/analytics.py)

import { loadData, STORAGE_KEYS } from './storage.js';

function getAllTransactions() {
  return loadData(STORAGE_KEYS.transactions) || [];
}

/**
 * Get financial summary: totals, top category, transaction count.
 */
export function getSummary() {
  const transactions = getAllTransactions();

  if (transactions.length === 0) {
    return {
      total_income: 0,
      total_expense: 0,
      total_savings: 0,
      transaction_count: 0,
      top_category: null
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCategory = {};

  transactions.forEach(t => {
    if (t.type === 'Income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    }
  });

  // Find top spending category
  let topCategory = null;
  let maxAmount = 0;
  for (const [name, amount] of Object.entries(expenseByCategory)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = { name, amount: Math.round(amount * 100) / 100 };
    }
  }

  return {
    total_income: Math.round(totalIncome * 100) / 100,
    total_expense: Math.round(totalExpense * 100) / 100,
    total_savings: Math.round((totalIncome - totalExpense) * 100) / 100,
    transaction_count: transactions.length,
    top_category: topCategory
  };
}

/**
 * Get expense breakdown by category.
 * Returns: [{ category, amount, percentage }]
 */
export function getCategoryBreakdown() {
  const transactions = getAllTransactions().filter(t => t.type === 'Expense');
  const grouped = {};
  let total = 0;

  transactions.forEach(t => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    total += t.amount;
  });

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get monthly income vs expense data.
 * Returns: [{ month, income, expense, savings }]
 */
export function getMonthlyTrend() {
  const transactions = getAllTransactions();
  const monthly = {};

  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // 'YYYY-MM'
    if (!monthly[month]) {
      monthly[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'Income') {
      monthly[month].income += t.amount;
    } else {
      monthly[month].expense += t.amount;
    }
  });

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
      savings: Math.round((data.income - data.expense) * 100) / 100
    }));
}

/**
 * Get daily spending for the current month.
 * Returns: [{ date, amount }]
 */
export function getDailySpending() {
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const transactions = getAllTransactions()
    .filter(t => t.type === 'Expense' && t.date.startsWith(monthPrefix));

  const daily = {};

  transactions.forEach(t => {
    daily[t.date] = (daily[t.date] || 0) + t.amount;
  });

  return Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100
    }));
}

/**
 * Get income grouped by category (source).
 * Returns: [{ category, amount }]
 */
export function getIncomeSources() {
  const transactions = getAllTransactions().filter(t => t.type === 'Income');
  const grouped = {};

  transactions.forEach(t => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get top N expense categories by total spending.
 * Ported from Python's analytics_top_categories() endpoint.
 * Returns: [{ category, amount, percentage }]
 */
export function getTopCategories(n = 5) {
  return getCategoryBreakdown().slice(0, n);
}