/**
 * bus.js — global event bus for inter-module communication.
 */

const handlers = new Map();

export function on(event, fn) {
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event).add(fn);
    return () => handlers.get(event).delete(fn);
}

export function off(event, fn) {
    handlers.get(event)?.delete(fn);
}

export function emitEvent(event, payload) {
    handlers.get(event)?.forEach(fn => {
        try { fn(payload); } catch (err) { console.error(`[${event}] handler error:`, err); }
    });
}