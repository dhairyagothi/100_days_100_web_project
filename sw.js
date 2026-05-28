const CACHE_NAME = '100days-pwa-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/manifest.json'
];

// 2. Install Event: Spin up cache and save critical shells
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[PWA] Pre-caching core dashboard and initial projects...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 3. Activate Event: Evict older, outdated versions of the cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[PWA] Clearing deprecated cache version:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 4. Fetch Event: Intercept network calls to serve from cache immediately while updating in background
self.addEventListener('fetch', event => {
  // Only intercept same-origin GET requests (prevents breaking external POST routes/APIs)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchedResponse = fetch(event.request).then(networkResponse => {
          // If network call succeeds, dynamically clone it into the cache storage
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback UI to the root dashboard index if network fails completely offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html'); 
          }
        });

        // Instant speed: Return cached file instantly if it exists, otherwise use network fallback
        return cachedResponse || fetchedResponse;
      });
    })
  );
});