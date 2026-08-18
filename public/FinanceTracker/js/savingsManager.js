// js/savingsManager.js
import { saveData, loadData } from './storage.js';

let savingsGoals = loadData('savingsGoals');

export function addGoal(goal) {
    if (!goal.id) {
        goal.id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    if (!goal.saved) goal.saved = 0;
    if (!goal.createdAt) goal.createdAt = new Date().toISOString();
    savingsGoals.push(goal);
    saveData('savingsGoals', savingsGoals);
    return goal;
}

export function getGoals() {
    return savingsGoals;
}

export function deleteGoal(index) {
    if (index >= 0 && index < savingsGoals.length) {
        savingsGoals.splice(index, 1);
        saveData('savingsGoals', savingsGoals);
        return true;
    }
    return false;
}

export function updateGoalProgress(index, savedAmount) {
    if (index >= 0 && index < savingsGoals.length) {
        savingsGoals[index].saved = savedAmount;
        saveData('savingsGoals', savingsGoals);
        return savingsGoals[index];
    }
    return null;
}

export function getGoalById(id) {
    return savingsGoals.find(g => g.id === id);
}