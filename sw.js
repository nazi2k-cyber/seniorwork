const CACHE_NAME = 'seniorwork-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/theme.css',
  '/css/main.css',
  '/css/components.css',
  '/js/app.js',
  '/js/router.js',
  '/js/store.js',
  '/js/utils.js',
  '/js/modules/auth.js',
  '/js/modules/job.js',
  '/js/modules/profile.js',
  '/js/modules/chat.js',
  '/js/modules/location.js',
  '/js/modules/matching.js',
  '/js/pages/home.js',
  '/js/pages/jobList.js',
  '/js/pages/jobDetail.js',
  '/js/pages/profile.js',
  '/js/pages/chatList.js',
  '/js/pages/chatRoom.js',
  '/js/pages/login.js',
  '/js/pages/register.js',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
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
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/index.html');
        });
      })
  );
});
