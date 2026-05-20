/* NYX v5.31 — Service Worker desativado. Limpa caches antigos e não intercepta requisições. */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => /nyx|cell-counter|pwa/i.test(k) ? caches.delete(k) : Promise.resolve(false)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => /nyx|cell-counter|pwa/i.test(k) ? caches.delete(k) : Promise.resolve(false)));
    await self.clients.claim();
    try { await self.registration.unregister(); } catch(e) {}
  })());
});
self.addEventListener('fetch', event => { return; });
