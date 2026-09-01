// Service worker: кеширует билд, приложение работает офлайн после первого открытия
const CACHE = 'trend-hunter-v1'
const ASSETS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then(
      (cached) =>
        cached ||
        fetch(e.request)
          .then((resp) => {
            // Кешируем только успешные ответы своего origin
            if (resp.ok && e.request.url.startsWith(self.location.origin)) {
              const clone = resp.clone()
              caches.open(CACHE).then((c) => c.put(e.request, clone))
            }
            return resp
          })
          .catch(() => caches.match('./index.html')),
    ),
  )
})
