// js/transactionManager.js
import { saveData, loadData } from './storage.js';

let transactions = loadData('transactions');

export function addTransaction(transaction) {
    if (!transaction.id) {
        transaction.id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    transactions.push(transaction);
    saveData('transactions', transactions);
    return transaction;
}

export function getTransactions() {
    return transactions;
}

export function deleteTransaction(index) {
    if (index >= 0 && index < transactions.length) {
        transactions.splice(index, 1);
        saveData('transactions', transactions);
        return true;
    }
    return false;
}

export function clearAllTransactions() {
    transactions = [];
    saveData('transactions', transactions);
}

export function getTransactionById(id) {
    return transactions.find(t => t.id === id);
}