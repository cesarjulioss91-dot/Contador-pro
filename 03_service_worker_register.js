
(function () {
      if (!('serviceWorker' in navigator)) return;
      if (!/^https?:$/.test(window.location.protocol)) return;

      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then(function (registration) {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            registration.addEventListener('updatefound', function () {
              var worker = registration.installing;
              if (!worker) return;
              worker.addEventListener('statechange', function () {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.info('NYX update installed; reload recommended.');
                }
              });
            });
          })
          .catch(function (err) {
            console.warn('NYX service worker registration failed:', err);
          });
      });
    })();

