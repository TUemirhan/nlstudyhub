const CACHE_NAME = 'nlstudyhub-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

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

// Network-first strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Skip ALL auth, Firebase, Google, and external API requests
  const skipDomains = [
    'firebase',
    'googleapis.com',
    'google.com',
    'gstatic.com',
    'pexels.com',
    'accounts.google',
    'apis.google',
    'identitytoolkit',
    'securetoken',
    'firestore',
  ];

  if (skipDomains.some((domain) => url.includes(domain))) {
    return; // Let the browser handle these normally
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});