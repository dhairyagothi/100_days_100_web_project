/* ============================================================
   SERVICE WORKER - CACHE CONFIGURATION & VERSIONING
   ============================================================ */

const CACHE_VERSION = 'v1';
const CACHE_PREFIX = '100-days-web-projects';
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${CACHE_VERSION}`;
const API_CACHE = `${CACHE_PREFIX}-api-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/index.html';

// Core assets to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/index.js',
  '/manifest.json',
  '/fav.ico'
];

// Common library CDNs (cache these for offline availability)
const EXTERNAL_CDN_URLS = [
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/',
  'https://cdn.jsdelivr.net/',
  'https://esm.sh/'
];

/* ============================================================
   INSTALL EVENT - Cache core assets
   ============================================================ */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching core assets:', CORE_ASSETS);
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skipping waiting - activate immediately');
        return self.skipWaiting();
      })
  );
});

/* ============================================================
   ACTIVATE EVENT - Clean up old caches
   ============================================================ */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove caches that don't match current version
            if (cacheName.startsWith(CACHE_PREFIX) && !cacheName.includes(CACHE_VERSION)) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

/* ============================================================
   FETCH EVENT - Intelligent caching strategies
   ============================================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and internal schemes
  if (request.method !== 'GET') {
    return;
  }
  
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Strategy selection based on request type
  if (isExternalCDN(url)) {
    event.respondWith(networkFirstStrategy(request, EXTERNAL_CDN_URLS));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, ASSET_CACHE));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request));
  } else {
    event.respondWith(cacheFirstStrategy(request, ASSET_CACHE));
  }
});

/* ============================================================
   CACHING STRATEGIES
   ============================================================ */

/**
 * Cache First Strategy - Serve from cache, fallback to network
 * Best for: Static assets, CSS, JS files
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          
          // Clone and cache successful responses
          const responseToCache = response.clone();
          caches.open(cacheName)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
          
          return response;
        });
    })
    .catch(() => {
      // Offline fallback for navigation requests
      if (isNavigationRequest(request)) {
        return caches.match(OFFLINE_PAGE);
      }
      
      // Return blank response for other requests
      return new Response('Offline - Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    });
}

/**
 * Network First Strategy - Fetch from network, fallback to cache
 * Best for: API calls, dynamic content, CDN libraries
 */
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }
      
      // Cache successful responses
      const responseToCache = response.clone();
      caches.open(cacheName)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
      
      return response;
    })
    .catch(() => {
      // Fallback to cache on network error
      return caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          // Return offline page for navigation requests
          if (isNavigationRequest(request)) {
            return caches.match(OFFLINE_PAGE);
          }
          
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
    });
}

/**
 * Navigation Strategy - Handle page navigation
 * Uses stale-while-revalidate pattern for better UX
 */
function navigationStrategy(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        // Cache successful page loads
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, response.clone());
          });
        return response;
      }
      return response;
    })
    .catch(() => {
      // Return cached version or offline page
      return caches.match(request)
        .then((response) => {
          return response || caches.match(OFFLINE_PAGE);
        });
    });
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function isImageRequest(request) {
  return request.headers.get('accept')?.includes('image');
}

function isAPIRequest(url) {
  return url.pathname.includes('/api/') || 
         url.pathname.includes('/public/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         request.headers.get('accept')?.includes('text/html');
}

function isExternalCDN(url) {
  return EXTERNAL_CDN_URLS.some(cdn => url.href.startsWith(cdn));
}

/* ============================================================
   MESSAGE HANDLING - Receive commands from client
   ============================================================ */

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[ServiceWorker] Clearing all caches');
    caches.keys().then((names) => {
      names.forEach(name => {
        if (name.startsWith(CACHE_PREFIX)) {
          caches.delete(name);
        }
      });
    });
  }
});

console.log('[ServiceWorker] Loaded and ready');