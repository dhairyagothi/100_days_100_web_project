// js/transactionManager.js — Transaction CRUD + search/filter/sort

import { saveData, loadData, nextId, STORAGE_KEYS } from './storage.js';

function getAll() {
  return loadData(STORAGE_KEYS.transactions) || [];
}

function saveAll(transactions) {
  saveData(STORAGE_KEYS.transactions, transactions);
}

/*
 Add a new transaction.
 */
export function normalizeDate(dateStr) {
  function getLocal(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (!dateStr) return getLocal(new Date());
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  // Try to parse and convert
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return getLocal(new Date());
  return getLocal(d);
}

export function addTransaction(data) {
  const transactions = getAll();
  const transaction = {
    id: nextId('transactions'),
    date: normalizeDate(data.date),
    description: data.description,
    amount: parseFloat(data.amount),
    type: data.type,
    category: data.category
  };
  transactions.push(transaction);
  saveAll(transactions);
  return transaction;
}

/*
 Update an existing transaction by ID.
 */
export function updateTransaction(id, data) {
  const transactions = getAll();
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) return null;

  transactions[index] = {
    ...transactions[index],
    date: normalizeDate(data.date),
    description: data.description !== undefined ? data.description : transactions[index].description,
    amount: data.amount !== undefined && data.amount !== '' ? parseFloat(data.amount) : transactions[index].amount,
    type: data.type || transactions[index].type,
    category: data.category || transactions[index].category
  };

  saveAll(transactions);
  return transactions[index];
}

/*
 Delete a transaction by ID.
 */
export function deleteTransaction(id) {
  const transactions = getAll().filter(t => t.id !== id);
  saveAll(transactions);
}

/*
 Get all transactions with optional search, filter, and sort.
 */
export function getTransactions({ search = '', category = '', type = '', sort = 'date', order = 'desc' } = {}) {
  let results = getAll();

  // Search
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(t =>
      t.description.toLowerCase().includes(s)
    );
  }

  // Filter by category
  if (category) {
    results = results.filter(t => t.category === category);
  }

  // Filter by type
  if (type) {
    results = results.filter(t => t.type === type);
  }

  // Sort
  results.sort((a, b) => {
    let valA, valB;
    if (sort === 'date') {
      valA = a.date;
      valB = b.date;
    } else if (sort === 'amount') {
      valA = a.amount;
      valB = b.amount;
    } else {
      valA = a.description.toLowerCase();
      valB = b.description.toLowerCase();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return results;
}

/**
 Get a single transaction by ID.
 */
export function getTransactionById(id) {
  return getAll().find(t => t.id === id) || null;
}

/*
 Bulk add transactions (for CSV import).
 */
export function bulkAddTransactions(dataArray) {
  const transactions = getAll();
  const added = dataArray.map(data => ({
    id: nextId('transactions'),
    date: normalizeDate(data.date),
    description: data.description || '',
    amount: parseFloat(data.amount) || 0,
    type: data.type || 'Expense',
    category: data.category || 'Other'
  }));
  transactions.push(...added);
  saveAll(transactions);
  return added.length;
}