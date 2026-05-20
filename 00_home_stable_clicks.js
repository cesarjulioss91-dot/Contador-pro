
/* v5.25 — Home Stable Clicks: fallback direto e seguro para Android/content://. Sem MutationObserver. */
(function(){
  'use strict';
  if (window.NYXHomeV525) return;
  var pending = null;
  var timer = null;
  var tries = 0;

  function homeEl(){ return document.getElementById('homeScreen'); }
  function counterEl(){ return document.getElementById('homeCounterPanel'); }
  function hideHome(){ var h=homeEl(); if(h){ h.classList.add('hidden'); h.setAttribute('aria-hidden','true'); } }
  function showCounters(ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); }
    var c=counterEl();
    if(c){ c.hidden=false; c.setAttribute('aria-hidden','false'); }
    try{ document.body.classList.add('nyx-counter-modal-open'); }catch(e){}
    return false;
  }
  function closeCounters(ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); }
    var c=counterEl();
    if(c){ c.hidden=true; c.setAttribute('aria-hidden','true'); }
    try{ document.body.classList.remove('nyx-counter-modal-open'); }catch(e){}
    return false;
  }
  function canCall(){ return typeof window.selectModule === 'function'; }
  function callMode(mode){
    if(!mode) return false;
    try{
      if(canCall()){
        closeCounters();
        window.selectModule(mode);
        return true;
      }
    }catch(e){
      try{ console.warn('[NYX v5.25] selectModule falhou:', e); }catch(_){}
    }
    return false;
  }
  function open(mode, ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); }
    if(!mode) return false;
    pending = mode;
    tries = 0;
    if(callMode(mode)){ pending=null; return false; }
    if(timer) clearInterval(timer);
    timer = setInterval(function(){
      tries += 1;
      if(!pending || callMode(pending) || tries > 80){
        if(timer) clearInterval(timer);
        timer = null;
        pending = null;
      }
    }, 100);
    return false;
  }
  function bindOnce(){
    try{ document.title='NYX Cell Counter Pro v5.25 — Home Stable Clicks'; }catch(e){}
    var h = homeEl();
    if(!h) return;
    h.querySelectorAll('[data-home-panel="counters"]').forEach(function(btn){
      btn.onclick=function(ev){ return showCounters(ev); };
    });
    h.querySelectorAll('[data-home-main]').forEach(function(btn){
      btn.onclick=function(ev){ return closeCounters(ev); };
    });
    h.querySelectorAll('[data-home-mode]').forEach(function(btn){
      btn.onclick=function(ev){ return open(this.getAttribute('data-home-mode'), ev); };
    });
    var c = counterEl();
    if(c){
      c.addEventListener('click', function(ev){ if(ev.target === c) closeCounters(ev); }, { once:false });
    }
  }
  document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape') closeCounters(ev); }, false);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindOnce, { once:true }); else bindOnce();
  window.addEventListener('load', bindOnce, { once:true });

  window.NYXHomeV525 = { open:open, showCounters:showCounters, closeCounters:closeCounters, bindOnce:bindOnce };
})();
