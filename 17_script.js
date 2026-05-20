
/* v5.21 — polimento final: nomes da HOME, manual e banco revisado */
(function(){
  'use strict';
  function qs(s,ctx){return (ctx||document).querySelector(s);}
  function qsa(s,ctx){return Array.prototype.slice.call((ctx||document).querySelectorAll(s));}
  function polishLabels(){
    try{ document.title='NYX Cell Counter Pro v5.22 — Quiz Auditoria Editorial'; }catch(e){}
    try{ document.body.setAttribute('data-nyx-v521','quiz-revisado-manual-consulta'); }catch(e){}
    try{
      qsa('[data-home-mode="atlas"]').forEach(function(card){
        var small=qs('small',card), b=qs('b',card), span=qs('span',card);
        if(small) small.textContent='Consulta';
        if(b) b.textContent='Consultas rápidas';
        if(span) span.textContent='Fichas técnicas e apoio de bancada.';
      });
      qsa('[data-home-mode="training"]').forEach(function(card){
        var small=qs('small',card), b=qs('b',card), span=qs('span',card);
        if(small) small.textContent='Quiz';
        if(b) b.textContent='Quiz';
        if(span) span.textContent='1.650 questões para estudo.';
      });
      qsa('[data-manual-section="atlas"]').forEach(function(btn){btn.textContent='Consultas rápidas';});
      qsa('[data-manual-section="treino"]').forEach(function(btn){btn.textContent='Quiz';});
    }catch(e){}
  }
  function patchBankRuntime(){
    try{
      var bank=window.NYX_QUIZ_BANK_V23;
      if(!Array.isArray(bank)||bank.__nyx521)return;
      bank.__nyx521=true;
      window.NYX_QUIZ_REVIEW_INFO={build:'v5.21',questions:bank.length,status:'banco autoral revisado: limpeza de redundância, gabarito único, justificativa sem letras fixas e base técnica por área'};
    }catch(e){}
  }
  function install(){polishLabels();patchBankRuntime();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install); else install();
  window.addEventListener('load',function(){install();setTimeout(install,80);setTimeout(install,400);});
  try{var mo=new MutationObserver(function(){polishLabels();}); if(document.body) mo.observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
