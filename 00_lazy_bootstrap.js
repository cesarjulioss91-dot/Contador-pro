/* NYX v5.32: lazy bootstrap disabled. This file is intentionally harmless for stale cached indexes. */
(function(){
  'use strict';
  try{ document.body && document.body.classList.remove('nyx-runtime-loading'); }catch(e){}
  try{ window.NYXLoadRuntime = function(){ try{document.body.classList.remove('nyx-runtime-loading');}catch(e){} return Promise.resolve(true); }; }catch(e){}
})();
