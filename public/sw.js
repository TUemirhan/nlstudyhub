const CACHE_NAME = 'nlstudyhub-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/roadmap',
  '/calculator',
  '/scholarships'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached or fetch new
        return response || fetch(event.request);
      })
  );
});