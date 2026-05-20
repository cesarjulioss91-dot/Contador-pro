/* NYX v5.32 — emergency service worker killer. Clears old PWA caches and unregisters itself. */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => /nyx|cell-counter|pwa|v5/i.test(k) ? caches.delete(k) : Promise.resolve(false)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => /nyx|cell-counter|pwa|v5/i.test(k) ? caches.delete(k) : Promise.resolve(false)));
    const clientsList = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    for (const client of clientsList) client.postMessage({type:'NYX_CACHE_CLEARED', version:'v5.32'});
    try { await self.registration.unregister(); } catch(e) {}
  })());
});
self.addEventListener('fetch', event => { return; });
