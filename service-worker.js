const CACHE_NAME = '100-days-web-projects-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/index.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Delete any caches whose name does not match the current CACHE_NAME.
// Without this handler, old caches accumulate across deployments and
// returning users continue to receive stale assets indefinitely.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
