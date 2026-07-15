// js/budgetManager.js
import { saveData, loadData } from './storage.js';

let budgets = loadData('budgets');

export function addBudget(category, monthlyLimit) {
    // Check if budget already exists for this category
    const existing = budgets.find(b => b.category === category);
    if (existing) {
        existing.monthly_limit = parseFloat(monthlyLimit);
        saveData('budgets', budgets);
        return existing;
    }

    const budget = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        category: category,
        monthly_limit: parseFloat(monthlyLimit)
    };
    budgets.push(budget);
    saveData('budgets', budgets);
    return budget;
}

export function getBudgets() {
    const transactions = loadData('transactions') || [];

    return budgets.map(b => {
        const spent = transactions
            .filter(t => t.type === 'Expense' && t.category === b.category)
            .reduce((sum, t) => sum + t.amount, 0);

        const remaining = b.monthly_limit - spent;
        const percentage = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;

        return {
            id: b.id,
            category: b.category,
            monthly_limit: parseFloat(b.monthly_limit.toFixed(2)),
            spent: parseFloat(spent.toFixed(2)),
            remaining: parseFloat(remaining.toFixed(2)),
            percentage: Math.min(percentage, 100)
        };
    });
}

export function deleteBudget(id) {
    budgets = budgets.filter(b => b.id !== id);
    saveData('budgets', budgets);
}

export function updateBudget(id, newLimit) {
    const budget = budgets.find(b => b.id === id);
    if (budget) {
        budget.monthly_limit = parseFloat(newLimit);
        saveData('budgets', budgets);
        return budget;
    }
    return null;
}

export function clearAllBudgets() {
    budgets = [];
    saveData('budgets', budgets);
}