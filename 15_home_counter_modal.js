
/* v5.19 — home limpa com seletor de contadores em modal fixo */
(function(){
  function $(sel){return document.querySelector(sel);}
  function $all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}
  function setCard(selector, smallText, titleText, subText){
    var c=$(selector); if(!c) return;
    var small=c.querySelector('small'), b=c.querySelector('b'), span=c.querySelector('span');
    if(small) small.textContent=smallText;
    if(b) b.textContent=titleText;
    if(span) span.textContent=subText;
  }
  function showPrimary(){
    var primary=$('#homePrimaryPanel'), counters=$('#homeCounterPanel');
    if(primary) primary.hidden=false;
    if(counters){ counters.hidden=true; counters.setAttribute('aria-hidden','true'); }
    try{ document.body.classList.remove('nyx-counter-modal-open'); }catch(e){}
  }
  function showCounters(){
    var primary=$('#homePrimaryPanel'), counters=$('#homeCounterPanel');
    if(primary) primary.hidden=false;
    if(counters){ counters.hidden=false; counters.setAttribute('aria-hidden','false'); }
    try{ document.body.classList.add('nyx-counter-modal-open'); }catch(e){}
    try{ if(typeof beep==='function') beep('short'); }catch(e){}
  }
  function select(mode){
    if(typeof window.selectModule==='function') window.selectModule(mode);
  }
  function bindCleanHome(){
    var home=$('#homeScreen'); if(!home) return;
    setCard('.home-option.clean-main.counters','Bancada','Contadores','Diferencial, reticulócitos, BAAR, urina, líquidos e colônias.');
    setCard('.home-option.training','Estudo','Quiz','1.650 questões para estudo.');
    setCard('.home-option.atlas','Consulta','Consultas rápidas','Fichas, achados e correlações úteis.');
    setCard('.home-option.calc','Ferramentas','Calculadoras','Cálculos laboratoriais e científicos.');
    setCard('.home-option.timer','Tempo','Timer','Cronômetro ou regressivo para bancada.');
    $all('[data-home-panel="counters"]').forEach(function(btn){
      if(btn.__nyxHomeCleanCounter) return;
      btn.__nyxHomeCleanCounter=true;
      btn.addEventListener('click', function(ev){ev.preventDefault(); ev.stopPropagation(); showCounters();});
    });
    $all('[data-home-main]').forEach(function(btn){
      if(btn.__nyxHomeCleanMain) return;
      btn.__nyxHomeCleanMain=true;
      btn.addEventListener('click', function(ev){ev.preventDefault(); ev.stopPropagation(); showPrimary();});
    });
    var counterPanel=$('#homeCounterPanel');
    if(counterPanel && !counterPanel.__nyxCounterModalBackdrop){
      counterPanel.__nyxCounterModalBackdrop=true;
      counterPanel.addEventListener('click', function(ev){ if(ev.target===counterPanel) showPrimary(); });
    }
    document.addEventListener('keydown', function(ev){ if(ev.key==='Escape'){ var cp=$('#homeCounterPanel'); if(cp && !cp.hidden) showPrimary(); } });
    $all('#homeCounterPanel .home-option[data-home-mode], #homePrimaryPanel .home-option[data-home-mode], .home-manual-top[data-home-mode]').forEach(function(btn){
      if(btn.__nyxHomeCleanSelect) return;
      btn.__nyxHomeCleanSelect=true;
      btn.addEventListener('click', function(){ select(this.getAttribute('data-home-mode')); });
    });
  }
  function patchLabels(){
    try{ document.title='NYX Cell Counter Pro v5.19 — Home Clean + Counter Modal FIX'; }catch(e){}
    try{ document.body.classList.add('nyx-home-clean-v519'); document.body.setAttribute('data-nyx-home','v5.19-counter-modal-fixed'); }catch(e){}
    bindCleanHome();
    try{
      var oldOpen=window.openHome;
      if(typeof oldOpen==='function' && !oldOpen.__nyxHomeCleanWrapped){
        var wrapped=function(){ var r=oldOpen.apply(this, arguments); setTimeout(showPrimary,0); setTimeout(bindCleanHome,0); return r; };
        wrapped.__nyxHomeCleanWrapped=true;
        window.openHome=wrapped;
      }
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', patchLabels);
  else patchLabels();
  window.addEventListener('load', function(){patchLabels(); setTimeout(patchLabels,80);});
})();
