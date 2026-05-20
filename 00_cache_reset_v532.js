/* NYX v5.32 — remove service workers/caches antigos para evitar tela presa em módulos. */
(function(){
  'use strict';
  function log(){ try{ console.info.apply(console, arguments); }catch(e){} }
  try { window.NYX_VERSION='v5.32-flat-direct-no-lazy'; } catch(e) {}
  if ('caches' in window) {
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if (/nyx|cell-counter|pwa/i.test(k)) return caches.delete(k);
        return false;
      }));
    }).then(function(){ log('[NYX v5.32] caches antigos limpos'); }).catch(function(e){ log('[NYX v5.32] cache cleanup falhou', e); });
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs){
      return Promise.all(regs.map(function(reg){ return reg.unregister(); }));
    }).then(function(){
      log('[NYX v5.32] service workers desativados para esta versão');
      try { document.documentElement.setAttribute('data-nyx-sw','disabled-v532'); } catch(e) {}
    }).catch(function(e){ log('[NYX v5.32] unregister SW falhou', e); });
  }
})();

(function(){try{document.body&&document.body.classList.remove('nyx-runtime-loading');}catch(e){} setTimeout(function(){try{document.body&&document.body.classList.remove('nyx-runtime-loading');}catch(e){}},500);})();
