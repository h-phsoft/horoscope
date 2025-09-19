const CACHE_NAME = 'horoscope-v1';
const FILES_TO_CACHE = [
  '/horoscope/',
  '/horoscope/index.html',
  '/horoscope/manifest.json',
  '/horoscope/icon-192.png',
  '/horoscope/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(caches.match('/horoscope/index.html'));
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});