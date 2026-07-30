const CACHE_NAME = 'nlstudyhub-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Firebase API calls
  if (event.request.url.includes('firebase')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached or fetch new
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache new requests (optional)
        if (fetchResponse.status === 200) {
          const clone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Fallback for offline
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});