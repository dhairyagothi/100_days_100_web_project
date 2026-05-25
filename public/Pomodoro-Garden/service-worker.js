/**
 * service-worker.js — minimal app-shell cache.
 *
 * Strategy: cache-first for own-origin app shell, network-first for everything else.
 * Bump CACHE_VERSION on each release to invalidate old caches.
 */

const CACHE_VERSION = 'pg-v1';
const APP_SHELL = [
    './',
    'index.html',
    'style.css',
    'manifest.webmanifest',
    'src/main.js',
    'src/store.js',
    'src/bus.js',
    'src/storage.js',
    'src/timer.js',
    'src/garden.js',
    'src/audio.js',
    'src/analytics.js',
    'src/achievements.js',
    'src/effects.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Same-origin app shell: cache-first
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(res => {
                    if (res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_VERSION).then(c => c.put(request, clone));
                    }
                    return res;
                }).catch(() => cached);
            })
        );
        return;
    }

    // Cross-origin (Google Fonts): network-first with cache fallback
    event.respondWith(
        fetch(request).then(res => {
            if (res.ok) {
                const clone = res.clone();
                caches.open(CACHE_VERSION).then(c => c.put(request, clone));
            }
            return res;
        }).catch(() => caches.match(request))
    );
});