// js/budgetManager.js — Budget CRUD with spending calculations

import { saveData, loadData, nextId, STORAGE_KEYS } from './storage.js';

function getAll() {
  return loadData(STORAGE_KEYS.budgets) || [];
}

function saveAll(budgets) {
  saveData(STORAGE_KEYS.budgets, budgets);
}

/**

   Get the current month's date range [firstDay, lastDay].
  */
function currentMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().split('T')[0];
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().split('T')[0];
  return [first, last];
}

/*
   Get all budgets with total spending calculated across ALL transactions.
(No month restriction — reflects every expense ever recorded for that category.)
   Returns: { id, category, monthly_limit, spent, remaining, percentage }
 */
export function getBudgets() {
  const budgets = getAll();
  const transactions = loadData(STORAGE_KEYS.transactions) || [];

  return budgets
    .sort((a, b) => a.category.localeCompare(b.category))
    .map(b => {
      const spent = transactions
        .filter(t =>
          t.type === 'Expense' &&
          t.category === b.category
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = b.monthly_limit - spent;
      const percentage = b.monthly_limit > 0
        ? Math.round((spent / b.monthly_limit) * 100)
        : 0;

      return {
        id: b.id,
        category: b.category,
        monthly_limit: b.monthly_limit,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage: Math.min(percentage, 100)
      };
    });
}


/**
Add a new budget, or UPDATE the limit if one already exists for that category.
Ported from Python's upsert behaviour in routes/budgets.py.
 Returns the budget object. Adds `updated: true` flag when a limit was changed.
 */
export function addBudget(category, monthlyLimit) {
  const budgets = getAll();

  // Upsert: if a budget for this category already exists, update its limit
  const existingIndex = budgets.findIndex(b => b.category === category);
  if (existingIndex !== -1) {
    budgets[existingIndex].monthly_limit = parseFloat(monthlyLimit);
    saveAll(budgets);
    return { ...budgets[existingIndex], updated: true };
  }

  const budget = {
    id: nextId('budgets'),
    category: category,
    monthly_limit: parseFloat(monthlyLimit)
  };
  budgets.push(budget);
  saveAll(budgets);
  return budget;
}

/*
 Update a budget by ID.
 */
export function updateBudget(id, data) {
  const budgets = getAll();
  const index = budgets.findIndex(b => b.id === id);
  if (index === -1) return null;

  if (data.monthly_limit !== undefined) {
    budgets[index].monthly_limit = parseFloat(data.monthly_limit);
  }

  saveAll(budgets);
  return budgets[index];
}

/*
 Delete a budget by ID.
 */
export function deleteBudget(id) {
  const budgets = getAll().filter(b => b.id !== id);
  saveAll(budgets);
}