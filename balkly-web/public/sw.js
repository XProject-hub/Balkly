// Balkly Platform - Service Worker
// Enables offline support and PWA functionality

const CACHE_NAME = 'balkly-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch with cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return cached
        }

        return fetch(event.request)
          .then((networkResponse) => {
            const shouldCache = networkResponse && 
              networkResponse.status === 200 && 
              networkResponse.type !== 'error' &&
              event.request.method === 'GET' && 
              !event.request.url.includes('/api/');

            if (shouldCache) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }

            return networkResponse; // Return fresh
          })
          .catch(() => {
            return caches.match('/offline').then((offline) => {
              return offline || new Response('Offline', { status: 503 }); // Return offline or error
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Sync any pending messages when back online
  console.log('Syncing messages...');
}

