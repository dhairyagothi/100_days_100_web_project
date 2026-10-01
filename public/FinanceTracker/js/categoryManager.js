// js/categoryManager.js — Category CRUD

import { saveData, loadData, nextId, STORAGE_KEYS } from './storage.js';

function getAll() {
  return loadData(STORAGE_KEYS.categories) || [];
}

function saveAll(categories) {
  saveData(STORAGE_KEYS.categories, categories);
}

/*
 Get all categories, sorted by type then name.
 */
export function getCategories() {
  return getAll().sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });
}

/*
 Get categories filtered by type ('Income' or 'Expense').
 */
export function getCategoriesByType(type) {
  return getAll()
    .filter(c => c.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/*
 Add a new category. Returns null if duplicate.
 */
export function addCategory(name, type) {
  const categories = getAll();
  const trimmed = name.trim();

  // Check for duplicate
  if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.type === type)) {
    return null;
  }

  const category = {
    id: nextId('categories'),
    name: trimmed,
    type: type
  };
  categories.push(category);
  saveAll(categories);
  return category;
}
/*
Update (rename) a category by ID.
 Cascades the new name/type to all linked transactions and budgets.
 Returns null if the new name+type is a duplicate of another category.
 */
export function updateCategory(id, newName, newType) {
  const categories = getAll();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;

  const oldName = categories[index].name;
  const oldType = categories[index].type;
  const trimmedName = newName.trim();

  // Check for duplicate (excluding self)
  const isDuplicate = categories.some(
    (c, i) => i !== index &&
    c.name.toLowerCase() === trimmedName.toLowerCase() &&
    c.type === newType
  );
  if (isDuplicate) return null;

  // Update the category itself
  categories[index].name = trimmedName;
  categories[index].type = newType;
  saveAll(categories);

  // Cascade rename → transactions
  const transactions = loadData(STORAGE_KEYS.transactions) || [];
  let txnUpdated = false;
  transactions.forEach(t => {
    if (t.category === oldName && t.type === oldType) {
      t.category = trimmedName;
      t.type = newType;
      txnUpdated = true;
    }
  });
  if (txnUpdated) saveData(STORAGE_KEYS.transactions, transactions);

  // Cascade rename → budgets (name only, budgets have no type)
  if (oldName !== trimmedName) {
    const budgets = loadData(STORAGE_KEYS.budgets) || [];
    let budgetUpdated = false;
    budgets.forEach(b => {
      if (b.category === oldName) {
        b.category = trimmedName;
        budgetUpdated = true;
      }
    });
    if (budgetUpdated) saveData(STORAGE_KEYS.budgets, budgets);
  }

  return categories[index];
}

/*
 Delete a category by ID.
 */
export function deleteCategory(id) {
  const categories = getAll().filter(c => c.id !== id);
  saveAll(categories);
}