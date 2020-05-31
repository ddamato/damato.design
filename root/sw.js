const cacheName = 'v1';

self.addEventListener('install', () => {
  console.info('Service Worker Installed');
  return self.skipWaiting();
});

self.addEventListener('activate', (ev) => {
  console.info('Service Worker Activated');
  ev.waitUntil(
    self.clients.claim(),
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cache) => cache !== cacheName && caches.delete(cache)))
    })
  )
});

self.addEventListener('fetch', (ev) => ev.respondWith(fetchResource(ev.request)));

function fetchResource(request) {
  return webFetch.catch(async () => await caches.match(request) || new Response());
}

function webFetch(request) {
  return fetch(request).then((res) => {
    if (request.url.startsWith('http')) {
      const clone = res.clone();
      caches.open(cacheName).then((cache) => cache.put(request, clone)).catch(() => {});
    }
    return res;
  })
}

