// js/storage.js — localStorage wrapper with ID generation

const STORAGE_KEYS = {
  transactions: 'fintrack_transactions',
  categories: 'fintrack_categories',
  budgets: 'fintrack_budgets',
  settings: 'fintrack_settings',
  nextId: 'fintrack_next_ids'
};

/*
 Save data to localStorage.
 */
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/*
 Load data from localStorage.
 */
export function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/*
  Generate an auto-incrementing ID for a given entity type.
 */
export function nextId(entity) {
  const ids = loadData(STORAGE_KEYS.nextId) || {
    transactions: 1,
    categories: 1,
    budgets: 1
  };

  const id = ids[entity] || 1;
  ids[entity] = id + 1;
  saveData(STORAGE_KEYS.nextId, ids);
  return id;
}

/*
  Initialize default data if first run.
 */
export function initDefaults() {
  // Default categories
  if (!loadData(STORAGE_KEYS.categories)) {
    const defaults = [
      { id: 1,  name: 'Salary',        type: 'Income' },
      { id: 2,  name: 'Freelance',     type: 'Income' },
      { id: 3,  name: 'Investments',   type: 'Income' },
      { id: 4,  name: 'Food',          type: 'Expense' },
      { id: 5,  name: 'Travel',        type: 'Expense' },
      { id: 6,  name: 'Shopping',      type: 'Expense' },
      { id: 7,  name: 'Bills',         type: 'Expense' },
      { id: 8,  name: 'Entertainment', type: 'Expense' },
      { id: 9,  name: 'Healthcare',    type: 'Expense' },
      { id: 10, name: 'Education',     type: 'Expense' },
      { id: 11, name: 'Other',         type: 'Expense' }
    ];
    saveData(STORAGE_KEYS.categories, defaults);

    // Set next category ID past the defaults
    const ids = loadData(STORAGE_KEYS.nextId) || { transactions: 1, categories: 1, budgets: 1 };
    ids.categories = 12;
    saveData(STORAGE_KEYS.nextId, ids);
  }

  // Default settings
  if (!loadData(STORAGE_KEYS.settings)) {
    saveData(STORAGE_KEYS.settings, {
      currency: '$',
      theme: 'dark'
    });
  }

  // Empty arrays if not present
  if (!loadData(STORAGE_KEYS.transactions)) {
    saveData(STORAGE_KEYS.transactions, []);
  }
  if (!loadData(STORAGE_KEYS.budgets)) {
    saveData(STORAGE_KEYS.budgets, []);
  }
}

export { STORAGE_KEYS };