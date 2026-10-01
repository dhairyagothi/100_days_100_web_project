/**
 * GSSoC Core Performance Optimization Module (#6120)
 * Handles high-performance event throttling, debouncing, 
 * event delegation, and DOM reference caching.
 */

// 1. HIGH-PERFORMANCE DEBOUNCE (Prevents layout thrashing on rapid inputs)
export function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 2. HIGH-PERFORMANCE THROTTLE (Locks execution to fixed time intervals - perfect for scroll/resize)
export function throttle(func, limit = 100) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 3. AUTOMATIC DOM CACHE MANAGER (Eliminates repeated querySelector performance leaks)
const domCache = new Map();
export function getCachedElement(selector) {
    if (!domCache.has(selector)) {
        const element = document.querySelector(selector);
        if (element) {
            domCache.set(selector, element);
        }
    }
    return domCache.get(selector);
}

// 4. ADVANCED EVENT DELEGATION (Fixes memory leaks by attaching ONE listener instead of thousands)
export function delegateEvent(parentElement, eventType, childSelector, handler) {
    parentElement.addEventListener(eventType, (event) => {
        const targetElement = event.target.closest(childSelector);
        if (targetElement && parentElement.contains(targetElement)) {
            handler.call(targetElement, event);
        }
    });
}

// 5. SMOOTH FRAME RENDERER (Pushes heavy execution tasks out of the main thread to protect 60FPS UI)
export function runOnNextFrame(callback) {
    requestAnimationFrame(() => {
        setTimeout(callback, 0);
    });
}