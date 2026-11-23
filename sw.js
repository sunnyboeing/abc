// Optional helper for Maths Quest: keeps a copy of the game on the iPad so it opens with no internet.
// Put this file in the same folder as index.html on your web host. Nothing is ever sent anywhere.
const CACHE = 'maths-quest-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network first (so updates arrive), fall back to the saved copy when offline.
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./')).then(r => r || caches.match('./index.html')))
  );
});
