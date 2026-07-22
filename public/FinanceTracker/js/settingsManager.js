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
  
  // Broadcast changes with a short debounce to coordinate across tabs
  clearTimeout(window.financeSyncDebounceTimer);
  window.financeSyncDebounceTimer = setTimeout(() => {
    if (window.BroadcastChannel) {
      new BroadcastChannel('finance_tracker_sync').postMessage({ 
        type: 'SETTINGS_UPDATED', 
        timestamp: Date.now() 
      });
    }
  }, 300);
  
  return settings;
}

/* ── Cross-tab Sync Listener ──────────────────────────────────── */
if (window.BroadcastChannel) {
  const syncChannel = new BroadcastChannel('finance_tracker_sync');
  syncChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'SETTINGS_UPDATED') {
      // Dispatch a custom event so the UI can update if necessary
      window.dispatchEvent(new Event('financetracker-settings-synced'));
    }
  };
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