/* NYX Cell Counter Pro v5.28 — PWA offline cache */
const CACHE_NAME = 'nyx-cell-counter-pro-v5.28-pwa';
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./README_ABRIR.txt",
  "./assets/css/00_style.css",
  "./assets/css/01_style.css",
  "./assets/css/02_style.css",
  "./assets/css/03_style.css",
  "./assets/css/04_style.css",
  "./assets/css/05_style.css",
  "./assets/css/06_style.css",
  "./assets/css/07_style.css",
  "./assets/css/08_style.css",
  "./assets/css/09_lazy_modular.css",
  "./assets/js/00_home_stable_clicks.js",
  "./assets/js/00_lazy_bootstrap.js",
  "./assets/js/00_pwa_register.js",
  "./assets/js/01_modular_core.js",
  "./assets/js/02_script.js",
  "./assets/js/03_service_worker_register.js",
  "./assets/js/04_script.js",
  "./assets/js/05_script.js",
  "./assets/js/06_script.js",
  "./assets/js/07_script.js",
  "./assets/js/08_script.js",
  "./assets/js/09_script.js",
  "./assets/js/10_quiz_bank_v23_data.js",
  "./assets/js/11_script.js",
  "./assets/js/12_quiz_hud.js",
  "./assets/js/13_atlas_quiz_sync.js",
  "./assets/js/14_script.js",
  "./assets/js/15_home_counter_modal.js",
  "./assets/js/16_quiz_clean_auto_report.js",
  "./assets/js/17_script.js",
  "./assets/js/18_script.js",
  "./assets/js/19_consultas_rapidas.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon.svg",
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
