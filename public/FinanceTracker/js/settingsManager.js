// js/settingsManager.js — Settings persistence

import { saveData, loadData, STORAGE_KEYS } from './storage.js';

/*
  Get all settings.
 */
export function getSettings() {
  return loadData(STORAGE_KEYS.settings) || { currency: '$', theme: 'dark' };
}

/*
 Update a single setting.
 */
export function updateSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  saveData(STORAGE_KEYS.settings, settings);
  return settings;
}

/*
  Get the current currency symbol.
 */
export function getCurrencySymbol() {
  return getSettings().currency || '$';
}

/*
 Get the current theme.
 */
export function getTheme() {
  return getSettings().theme || 'dark';
}