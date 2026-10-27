self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open('bena-v1').then(c =>
      fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; })
        .catch(() => c.match(e.request))
    )
  );
});
