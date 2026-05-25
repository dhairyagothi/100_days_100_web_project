/**
 * store.js — Proxy-based reactive store with path subscriptions.
 *
 *   const store = createStore({ count: 0, user: { name: 'Mallika' } });
 *   store.subscribe('count', val => console.log(val));
 *   store.subscribe('user.name', val => console.log('hi', val));
 *   store.state.count = 1;             // fires 'count' subscribers
 *   store.state.user.name = 'M.';      // fires 'user.name' subscribers
 *   store.set({ count: 10, user: { name: 'X' } });  // batch update + notify all
 */

const SUB = Symbol('subscribers');

function emit(subs, key, value, root) {
    if (!subs[key]) return;
    for (const fn of subs[key]) {
        try { fn(value, root); } catch (err) { console.error('Subscriber error:', err); }
    }
}

function makeReactive(obj, path, subs) {
    return new Proxy(obj, {
        get(target, key) {
            const value = target[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return makeReactive(value, path ? `${path}.${key}` : key, subs);
            }
            return value;
        },
        set(target, key, value) {
            const fullPath = path ? `${path}.${key}` : key;
            target[key] = value;
            emit(subs, fullPath, value, target);
            // Bubble up to parent paths
            let p = fullPath;
            while (p.includes('.')) {
                p = p.slice(0, p.lastIndexOf('.'));
                emit(subs, p, getByPath(rootRef.value, p), target);
            }
            emit(subs, '*', { path: fullPath, value }, target);
            return true;
        },
    });
}

function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setByPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const parent = keys.reduce((o, k) => (o[k] ??= {}), obj);
    parent[last] = value;
}

const rootRef = { value: null };

export function createStore(initial) {
    const subs = {};
    rootRef.value = initial;
    const state = makeReactive(initial, '', subs);

    return {
        state,
        subscribe(path, fn) {
            (subs[path] ||= new Set()).add(fn);
            return () => subs[path].delete(fn);
        },
        set(patch) {
            for (const [path, value] of Object.entries(patch)) {
                setByPath(initial, path, value);
                emit(subs, path, value, initial);
            }
        },
        get(path) { return getByPath(initial, path); },
        snapshot() { return JSON.parse(JSON.stringify(initial)); },
        replace(next) {
            Object.keys(initial).forEach(k => delete initial[k]);
            Object.assign(initial, next);
            for (const path in subs) emit(subs, path, getByPath(initial, path), initial);
        },
    };
}