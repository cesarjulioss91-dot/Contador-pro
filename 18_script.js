
/* v5.22 — labels, auditoria e manual detalhado */
(function(){
  'use strict';
  function qs(s,ctx){return (ctx||document).querySelector(s);}
  function qsa(s,ctx){return Array.prototype.slice.call((ctx||document).querySelectorAll(s));}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function polish522(){
    try{document.title='NYX Cell Counter Pro v5.22 — Quiz Auditoria Editorial';}catch(e){}
    try{document.body.setAttribute('data-nyx-v522','quiz-auditoria-editorial-intercalada');}catch(e){}
    qsa('[data-home-mode="training"]').forEach(function(card){
      var small=qs('small',card), b=qs('b',card), span=qs('span',card);
      if(small) small.textContent='Quiz';
      if(b) b.textContent='Quiz';
      if(span) span.textContent='1.650 questões para estudo.';
    });
    qsa('[data-home-mode="atlas"]').forEach(function(card){
      var small=qs('small',card), b=qs('b',card), span=qs('span',card);
      if(small) small.textContent='Consulta';
      if(b) b.textContent='Consultas rápidas';
      if(span) span.textContent='Fichas técnicas e apoio de bancada.';
    });
  }
  function buildAuditInfo(){
    var bank = window.NYX_QUIZ_BANK_V23 || [];
    var groups = {}, areas = {};
    for(var i=0;i<bank.length;i++){
      var q=bank[i]||{};
      groups[q.variantGroup || q.topic || q.conceptId || i]=true;
      areas[q.areaLabel || q.area || 'Área não definida']=(areas[q.areaLabel || q.area || 'Área não definida']||0)+1;
    }
    window.NYX_QUIZ_AUDIT_522={build:'v5.22',questions:bank.length,variantGroups:Object.keys(groups).length,areas:areas,policy:'Sessões intercaladas por tema para reduzir repetição percebida sem reduzir o banco de 1.650 questões.'};
  }
  function patchManualContent(){
    if(window.__nyxManual522Patched) return;
    var old = window.renderManualSection;
    if(typeof old !== 'function') return;
    window.renderManualSection = function(sectionId){
      var html = old.apply(this, arguments);
      if(sectionId === 'treino'){
        html += '<div class="nyx-v522-audit-note"><b>Auditoria editorial v5.22:</b> o banco possui 1.650 questões organizadas em 165 grupos temáticos, com variantes por tema. O app agora intercala essas variantes para evitar que questões muito parecidas apareçam agrupadas na mesma sessão. Isso preserva volume de treino e melhora fluidez.</div>' +
          '<h3>Como interpretar as 1.650 questões</h3>' +
          '<p>O número total representa volume de treino, não 1.650 conceitos totalmente independentes. Em cada área, há grupos temáticos com variações de enunciado, cenário, nível e competência. A melhor forma de usar é por sessões curtas, alternando área e nível.</p>' +
          '<h3>Uso recomendado</h3>' +
          '<ul><li><b>Revisão rápida:</b> 5 a 10 questões por área.</li><li><b>Fixação:</b> 20 a 30 questões com relatório final.</li><li><b>Simulado:</b> modo prova, sem ver justificativa até finalizar.</li><li><b>Correção:</b> revise erros pelo relatório e consulte o tema em Consultas rápidas.</li></ul>' +
          '<h3>Limite técnico</h3>' +
          '<p>O banco passou por validação estrutural e curadoria conceitual geral. Para uso institucional formal, ainda é recomendável uma revisão humana item a item, com bibliografia específica vinculada a cada questão.</p>';
      }
      if(sectionId === 'atlas'){
        html += '<div class="nyx-v522-audit-note"><b>Integração com o Quiz:</b> use Consultas rápidas como apoio pós-erro. Quando um tema falhar no relatório, procure a ficha correspondente aqui antes de iniciar nova sessão.</div>' +
          '<h3>Fluxo sugerido de estudo</h3><ol class="manual-steps"><li>Faça uma sessão curta no Quiz.</li><li>Abra o relatório automático.</li><li>Identifique área, tema e justificativa dos erros.</li><li>Entre em Consultas rápidas e revise o conceito.</li><li>Repita o Quiz com outra sessão.</li></ol>';
      }
      return html;
    };
    window.__nyxManual522Patched = true;
  }
  function install(){polish522();buildAuditInfo();patchManualContent();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install); else install();
  window.addEventListener('load',function(){install();setTimeout(install,120);setTimeout(install,500);});
  try{var mo=new MutationObserver(function(){polish522();patchManualContent();}); if(document.body) mo.observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
