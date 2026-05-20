/* NYX Cell Counter Pro v5.30 — PWA offline cache */
const CACHE_NAME = 'nyx-cell-counter-pro-v5.30-pwa';
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./README_ABRIR.txt",
  "./00_style.css",
  "./01_style.css",
  "./02_style.css",
  "./03_style.css",
  "./04_style.css",
  "./05_style.css",
  "./06_style.css",
  "./07_style.css",
  "./08_style.css",
  "./09_lazy_modular.css",
  "./00_home_stable_clicks.js",
  "./00_lazy_bootstrap.js",
  "./00_pwa_register.js",
  "./01_modular_core.js",
  "./02_script.js",
  "./03_service_worker_register.js",
  "./04_script.js",
  "./05_script.js",
  "./06_script.js",
  "./07_script.js",
  "./08_script.js",
  "./09_script.js",
  "./10_quiz_bank_v23_data.js",
  "./11_script.js",
  "./12_quiz_hud.js",
  "./13_atlas_quiz_sync.js",
  "./14_script.js",
  "./15_home_counter_modal.js",
  "./16_quiz_clean_auto_report.js",
  "./17_script.js",
  "./18_script.js",
  "./19_consultas_rapidas.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon.svg",
  "./iniciar_servidor_linux_mac.sh",
  "./iniciar_servidor_windows.bat",
  "./manifest.webmanifest"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      return response;
    }).catch(() => cached))
  );
});
