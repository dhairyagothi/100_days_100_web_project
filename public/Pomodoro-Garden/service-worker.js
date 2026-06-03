/**
 * service-worker.js — minimal app-shell cache.
 *
 * Strategy:
 * - Cache-first for same-origin app shell resources
 * - Network-first for cross-origin resources
 * - Offline fallback for navigation requests
 */

const CACHE_VERSION = 'pg-v2';

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
        (async () => {
            const cache = await caches.open(CACHE_VERSION);

            for (const asset of APP_SHELL) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.error(`Failed to cache: ${asset}`, err);
                }
            }

            await self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_VERSION)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
            .catch((err) => console.error('Activation failed:', err))
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Same-origin resources: cache-first
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then(async (cached) => {
                if (cached) {
                    return cached;
                }

                try {
                    const response = await fetch(request);

                    if (response && response.ok) {
                        const cache = await caches.open(CACHE_VERSION);
                        cache.put(request, response.clone());
                    }

                    return response;
                } catch (error) {
                    console.error('Fetch failed:', error);

                    if (request.mode === 'navigate') {
                        return (
                            (await caches.match('index.html')) ||
                            new Response('Offline', {
                                status: 503,
                                statusText: 'Service Unavailable',
                            })
                        );
                    }

                    return (
                        cached ||
                        new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                        })
                    );
                }
            }).catch((error) => {
                console.error('Cache match failed:', error);
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                });
            })
        );

        return;
    }

    // Cross-origin resources: network-first
    event.respondWith(
        fetch(request)
            .then(async (response) => {
                if (response && response.ok) {
                    const cache = await caches.open(CACHE_VERSION);
                    cache.put(request, response.clone());
                }

                return response;
            })
            .catch(async (error) => {
                console.error('Network request failed:', error);

                const cached = await caches.match(request);

                if (cached) {
                    return cached;
                }

                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                });
            })
    );
});