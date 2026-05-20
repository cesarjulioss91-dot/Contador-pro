
/* v5.27 — Modular Lazy Bootstrap. Carrega o runtime pesado apenas no primeiro clique real. */
(function(){
  'use strict';
  if (window.NYXHomeV525) return;
  var pending = null;
  var runtimePromise = null;
  var runtimeLoaded = false;
  var runtimeFiles = ['01_modular_core.js', '02_script.js', '03_service_worker_register.js', '04_script.js', '05_script.js', '06_script.js', '07_script.js', '08_script.js', '09_script.js', '10_quiz_bank_v23_data.js', '11_script.js', '12_quiz_hud.js', '13_atlas_quiz_sync.js', '14_script.js', '15_home_counter_modal.js', '16_quiz_clean_auto_report.js', '17_script.js', '18_script.js', '19_consultas_rapidas.js'];

  function homeEl(){ return document.getElementById('homeScreen'); }
  function counterEl(){ return document.getElementById('homeCounterPanel'); }
  function toast(msg){
    try{
      var t=document.getElementById('toast');
      if(!t) return;
      t.textContent=msg;
      t.classList.add('show');
      setTimeout(function(){t.classList.remove('show');}, 2200);
    }catch(e){}
  }
  function setBusy(on){
    try{
      document.body.classList.toggle('nyx-runtime-loading', !!on);
      var h=homeEl();
      if(h) h.setAttribute('aria-busy', on?'true':'false');
    }catch(e){}
  }
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
  function loadScript(src){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');
      s.src='assets/js/'+src;
      s.async=false;
      s.onload=function(){ resolve(src); };
      s.onerror=function(){ reject(new Error('Falha ao carregar '+src)); };
      document.body.appendChild(s);
    });
  }
  function loadRuntime(){
    if(runtimeLoaded) return Promise.resolve();
    if(runtimePromise) return runtimePromise;
    setBusy(true);
    toast('Carregando módulos do app...');
    runtimePromise = runtimeFiles.reduce(function(p, file){
      return p.then(function(){ return loadScript(file); });
    }, Promise.resolve()).then(function(){
      runtimeLoaded=true;
      setBusy(false);
      try{ if(window.NYXHomeV525 && typeof window.NYXHomeV525.bindOnce==='function') window.NYXHomeV525.bindOnce(); }catch(e){}
      return true;
    }).catch(function(err){
      setBusy(false);
      console.error('[NYX v5.27] Runtime não carregou:', err);
      toast('Erro ao carregar módulos. Abra por servidor HTTP ou hospedagem.');
      throw err;
    });
    return runtimePromise;
  }
  function waitSelectModule(mode, attempts){
    attempts = attempts || 0;
    return new Promise(function(resolve,reject){
      if(typeof window.selectModule === 'function'){
        try{
          closeCounters();
          window.selectModule(mode);
          resolve(true);
        }catch(e){ reject(e); }
        return;
      }
      if(attempts>80){ reject(new Error('selectModule indisponível após carregar runtime')); return; }
      setTimeout(function(){ waitSelectModule(mode, attempts+1).then(resolve).catch(reject); }, 50);
    });
  }
  function open(mode, ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); }
    if(!mode) return false;
    pending=mode;
    loadRuntime().then(function(){ return waitSelectModule(mode); }).then(function(){ pending=null; }).catch(function(e){
      console.error('[NYX v5.27] Falha ao abrir modo '+mode, e);
      toast('Falha ao abrir módulo. Tente hospedar/servidor local.');
      pending=null;
    });
    return false;
  }
  function bindOnce(){
    try{ document.title='NYX Cell Counter Pro v5.27 — Modular Lazy'; }catch(e){}
    var h=homeEl();
    if(!h) return;
    h.querySelectorAll('[data-home-panel="counters"]').forEach(function(btn){ btn.onclick=function(ev){ return showCounters(ev); }; });
    h.querySelectorAll('[data-home-main]').forEach(function(btn){ btn.onclick=function(ev){ return closeCounters(ev); }; });
    h.querySelectorAll('[data-home-mode]').forEach(function(btn){ btn.onclick=function(ev){ return open(this.getAttribute('data-home-mode'), ev); }; });
    var c=counterEl();
    if(c && !c.__nyxModalBound){
      c.__nyxModalBound=true;
      c.addEventListener('click', function(ev){ if(ev.target===c) closeCounters(ev); }, false);
    }
  }
  document.addEventListener('keydown', function(ev){ if(ev.key==='Escape') closeCounters(ev); }, false);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindOnce, {once:true}); else bindOnce();
  window.addEventListener('load', bindOnce, {once:true});
  window.NYXHomeV525={open:open, showCounters:showCounters, closeCounters:closeCounters, bindOnce:bindOnce, loadRuntime:loadRuntime};
})();
