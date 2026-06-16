/**
 * LocalStorage query persistence
 */

const STORAGE_KEY = 'sqlviz-saved-query';

export function saveQuery(sql) {
  localStorage.setItem(STORAGE_KEY, sql);
  return true;
}

export function loadQuery() {
  return localStorage.getItem(STORAGE_KEY);
}

export function hasSavedQuery() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
