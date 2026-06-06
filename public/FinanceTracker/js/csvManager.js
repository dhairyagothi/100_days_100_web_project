// js/csvManager.js — CSV import/export (replaces routes/csv_routes.py)

import { bulkAddTransactions, getTransactions } from './transactionManager.js';
import { getCategories, addCategory } from './categoryManager.js';

/*
 Parse a CSV string into an array of objects.
 Expects columns: Date, Description, Amount, Type, Category
 */
export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { error: 'CSV file is empty or has no data rows.' };

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const required = ['Date', 'Description', 'Amount', 'Type', 'Category'];

  // Normalize headers to title case
  const normalizedHeaders = headers.map(h =>
    h.charAt(0).toUpperCase() + h.slice(1).toLowerCase()
  );

  // Check for missing columns
  const missing = required.filter(r => !normalizedHeaders.includes(r));
  if (missing.length > 0) {
    return { error: `Missing columns: ${missing.join(', ')}` };
  }

  // Find column indices
  const indices = {};
  required.forEach(col => {
    indices[col] = normalizedHeaders.indexOf(col);
  });

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);

    const row = {
      date: (values[indices.Date] || '').trim(),
      description: (values[indices.Description] || '').trim(),
      amount: parseFloat(values[indices.Amount]) || 0,
      type: (values[indices.Type] || 'Expense').trim(),
      category: (values[indices.Category] || 'Other').trim()
    };

    // Validate type
    if (row.type !== 'Income' && row.type !== 'Expense') {
      row.type = 'Expense';
    }

    if (row.description && row.amount > 0) {
      rows.push(row);
    }
  }

  return { data: rows };
}

/**
 * Parse a single CSV line, handling quoted values with commas.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/*
 Import parsed CSV data into transactions.
 Auto-creates any categories that don't already exist.
 Ported from Python's csv_routes.py auto-category creation logic.
Returns the number of imported transactions.
 */
export function importCSVData(dataArray) {
  // Auto-create any missing categories before importing
  const existing = getCategories();
  dataArray.forEach(row => {
    const alreadyExists = existing.some(
      c => c.name === row.category && c.type === row.type
    );
    if (!alreadyExists && row.category) {
      const created = addCategory(row.category, row.type || 'Expense');
      if (created) existing.push(created); // keep local cache in sync
    }
  });
  return bulkAddTransactions(dataArray);
}

/*
 Export all transactions as a CSV file download.
 */
export function exportCSV() {
  const transactions = getTransactions({ sort: 'date', order: 'desc' });

  if (transactions.length === 0) {
    return false;
  }

  // Build CSV string
  const header = 'Date,Description,Amount,Type,Category';
  const rows = transactions.map(t => {
    const desc = t.description.includes(',')
      ? `"${t.description}"`
      : t.description;
    return `${t.date},${desc},${t.amount},${t.type},${t.category}`;
  });

  const csv = [header, ...rows].join('\n');

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  return true;
}