/**
 * storage.js — minimal IndexedDB KV wrapper with localStorage fallback.
 *
 *   await storage.set('garden', { plants: [...] });
 *   const data = await storage.get('garden');
 *   await storage.del('garden');
 *   const keys = await storage.keys();
 */

const DB_NAME = 'pomodoro-garden';
const STORE_NAME = 'kv';
const VERSION = 1;

let dbPromise = null;

function openDB() {
    if (dbPromise) return dbPromise;
    if (typeof indexedDB === 'undefined') {
        dbPromise = Promise.reject(new Error('No IndexedDB'));
        return dbPromise;
    }
    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, VERSION);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE_NAME);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
    return dbPromise;
}

function tx(mode) {
    return openDB().then(db => db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
}

function req2promise(req) {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

const lsKey = (k) => `pg:${k}`;

export const storage = {
    async get(key) {
        try {
            const store = await tx('readonly');
            return await req2promise(store.get(key));
        } catch {
            const raw = localStorage.getItem(lsKey(key));
            return raw ? JSON.parse(raw) : undefined;
        }
    },
    async set(key, value) {
        try {
            const store = await tx('readwrite');
            await req2promise(store.put(value, key));
        } catch {
            localStorage.setItem(lsKey(key), JSON.stringify(value));
        }
    },
    async del(key) {
        try {
            const store = await tx('readwrite');
            await req2promise(store.delete(key));
        } catch {
            localStorage.removeItem(lsKey(key));
        }
    },
    async keys() {
        try {
            const store = await tx('readonly');
            return await req2promise(store.getAllKeys());
        } catch {
            return Object.keys(localStorage)
                .filter(k => k.startsWith('pg:'))
                .map(k => k.slice(3));
        }
    },
    async clear() {
        try {
            const store = await tx('readwrite');
            await req2promise(store.clear());
        } catch {}
        Object.keys(localStorage)
            .filter(k => k.startsWith('pg:'))
            .forEach(k => localStorage.removeItem(k));
    },
};