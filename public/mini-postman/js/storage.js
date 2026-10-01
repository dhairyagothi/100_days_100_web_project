/* storage.js — LocalStorage wrapper with namespaced keys */

const KEYS = {
  HISTORY:      'minipostman_history',
  COLLECTIONS:  'minipostman_collections',
  ENVIRONMENTS: 'minipostman_environments',
  ACTIVE_ENV:   'minipostman_active_env',
  THEME:        'minipostman_theme',
  TABS:         'minipostman_tabs',
  URL_HISTORY:  'minipostman_url_history',
};

const Storage = {
  /* ---- Generic ---- */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  },

  remove(key) { localStorage.removeItem(key); },

  /* ---- History ---- */
  getHistory()           { return this.get(KEYS.HISTORY, []); },
  saveHistory(list)      { this.set(KEYS.HISTORY, list); },

  addHistory(entry) {
    const list = this.getHistory();
    // Avoid duplicate consecutive entries
    if (list.length && list[0].url === entry.url && list[0].method === entry.method) return;
    list.unshift({ ...entry, id: Date.now() + Math.random().toString(36).slice(2) });
    if (list.length > 100) list.length = 100;
    this.saveHistory(list);
  },

  deleteHistory(id) {
    const list = this.getHistory().filter(h => h.id !== id);
    this.saveHistory(list);
  },

  clearHistory() { this.remove(KEYS.HISTORY); },

  /* ---- Collections ---- */
  getCollections()         { return this.get(KEYS.COLLECTIONS, []); },
  saveCollections(list)    { this.set(KEYS.COLLECTIONS, list); },

  addCollection(name) {
    const list = this.getCollections();
    const col = { id: 'col_' + Date.now(), name, requests: [] };
    list.push(col);
    this.saveCollections(list);
    return col;
  },

  deleteCollection(id) {
    const list = this.getCollections().filter(c => c.id !== id);
    this.saveCollections(list);
  },

  addRequestToCollection(collectionId, req) {
    const list = this.getCollections();
    const col = list.find(c => c.id === collectionId);
    if (!col) return;
    const reqEntry = { ...req, id: 'req_' + Date.now() };
    col.requests.push(reqEntry);
    this.saveCollections(list);
    return reqEntry;
  },

  deleteRequestFromCollection(collectionId, requestId) {
    const list = this.getCollections();
    const col = list.find(c => c.id === collectionId);
    if (!col) return;
    col.requests = col.requests.filter(r => r.id !== requestId);
    this.saveCollections(list);
  },

  /* ---- Environments ---- */
  getEnvironments()        { return this.get(KEYS.ENVIRONMENTS, []); },
  saveEnvironments(list)   { this.set(KEYS.ENVIRONMENTS, list); },

  addEnvironment(name) {
    const list = this.getEnvironments();
    const env = { id: 'env_' + Date.now(), name, vars: {} };
    list.push(env);
    this.saveEnvironments(list);
    return env;
  },

  deleteEnvironment(id) {
    const list = this.getEnvironments().filter(e => e.id !== id);
    this.saveEnvironments(list);
  },

  updateEnvironment(id, vars) {
    const list = this.getEnvironments();
    const env = list.find(e => e.id === id);
    if (env) { env.vars = vars; this.saveEnvironments(list); }
  },

  getActiveEnv()           { return this.get(KEYS.ACTIVE_ENV, null); },
  setActiveEnv(id)         { this.set(KEYS.ACTIVE_ENV, id); },

  /* ---- Theme ---- */
  getTheme()               { return this.get(KEYS.THEME, 'dark'); },
  saveTheme(t)             { this.set(KEYS.THEME, t); },

  /* ---- URL autocomplete history ---- */
  getUrlHistory()          { return this.get(KEYS.URL_HISTORY, []); },
  addUrl(url) {
    if (!url) return;
    const list = this.getUrlHistory();
    if (!list.includes(url)) {
      list.unshift(url);
      if (list.length > 50) list.length = 50;
      this.set(KEYS.URL_HISTORY, list);
    }
  },
};
