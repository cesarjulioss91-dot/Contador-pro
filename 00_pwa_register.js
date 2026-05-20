/* v5.28 — PWA service worker registration, loaded immediately. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  var protocolOk = /^https?:$/.test(window.location.protocol);
  var host = window.location.hostname || '';
  var localOk = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (!protocolOk) return;

  function registerSW() {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(function (registration) {
        window.NYXPWA = window.NYXPWA || {};
        window.NYXPWA.registration = registration;
        if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        registration.addEventListener('updatefound', function () {
          var worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', function () {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              console.info('[NYX PWA] Nova versão instalada. Recarregue para aplicar.');
            }
          });
        });
      })
      .catch(function (err) {
        console.warn('[NYX PWA] Service worker não registrado:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerSW, { once: true });
  } else {
    registerSW();
  }
})();
