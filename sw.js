// Offline support: cache the game shell, serve from cache, refresh in the background.
// Bump VERSION whenever files change so installed copies pick up the update.
const VERSION = 'marble-works-v1';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'fonts/fonts.css',
  'fonts/figtree-_Xms-HUzqDCFdgfMm4S9DQ.woff2',
  'fonts/figtree-_Xms-HUzqDCFdgfMm4q9DbZs.woff2',
  'fonts/outfit-QGYvz_MVcBeNP4NJtEtq.woff2',
  'fonts/outfit-QGYvz_MVcBeNP4NJuktqQ4E.woff2',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(e.request, { ignoreSearch: true }).then((hit) => {
        const net = fetch(e.request)
          .then((res) => { if (res.ok && new URL(e.request.url).origin === location.origin) cache.put(e.request, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      })
    )
  );
});
