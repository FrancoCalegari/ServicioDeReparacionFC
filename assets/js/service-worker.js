const CACHE_NAME = 'test';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/script.js',
  './assets/img/logo.png',
  './assets/img/Logo.ico',
  // Agrega aquí más archivos que necesites para que funcionen sin conexión
];

// Instalar el service worker y cachear los recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar solicitudes de red y responder con archivos en cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activar el nuevo service worker y limpiar cache antigua
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
