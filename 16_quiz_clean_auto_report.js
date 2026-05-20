
/* v5.20 — limpeza do Quiz e relatório automático */
(function(){
  'use strict';
  var BUILD='v5.20-quiz-clean-auto-report';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function sanitizePrompt(s){
    s=String(s==null?'':s);
    s=s.replace(/\s*\(\s*Item\s+[A-Z]{3}-\d{3}\s*,\s*foco:\s*[^)]*\)\.?/gi,'');
    s=s.replace(/\s*\(\s*Item\s+[A-Z]{3}-\d{3}[^)]*\)\.?/gi,'');
    s=s.replace(/\s*\(\s*foco:\s*[^)]*\)\.?/gi,'');
    return s.replace(/\s{2,}/g,' ').trim();
  }
  function training(){
    try{ if(!window.state.training) window.state.training={}; return window.state.training; }catch(e){ return {}; }
  }
  function stats(t){
    t=t||training();
    var responses=t.responses||{};
    var keys=Object.keys(responses);
    var score=0;
    keys.forEach(function(k){ if(responses[k]&&responses[k].correct) score++; });
    var answered=keys.length;
    var acc=answered?Math.round(score/answered*100):0;
    return {score:score, answered:answered, acc:acc};
  }
  function currentCount(t){
    t=t||training();
    var inSession=t.view==='quiz'&&t.session&&t.session.length;
    if(inSession) return {idx:(t.index||0)+1,total:t.session.length,pct:Math.round(((t.index||0)+1)/Math.max(1,t.session.length)*100)};
    if(t.view==='report') return {idx:'Relatório',total:'',pct:100};
    return {idx:'',total:'',pct:0};
  }
  function goHome(){ try{ if(typeof window.openHome==='function') window.openHome(); }catch(e){} }
  function goAreas(){
    var t=training();
    t.step='area'; t.view='menu';
    try{ if(typeof window.renderTrainingModule==='function') window.renderTrainingModule(); else if(typeof window.render==='function') window.render(); }catch(e){}
  }
  function renderCleanHud(){
    try{
      if(!window.state || window.state.mode!=='training') return false;
      var h=document.getElementById('hud'); if(!h) return false;
      var t=training(), st=stats(t), cc=currentCount(t);
      var countText = cc.total ? (cc.idx+'/'+cc.total) : (t.view==='report'?'Relatório':'');
      var sub = t.view==='quiz' ? '1.650 questões para estudo' : (t.view==='report' ? 'Relatório final' : 'Escolha a área e os filtros');
      var hudHtml = '<section class="nyxq520-hud">'
        + '<div class="nyxq520-top"><div class="nyxq520-title"><b>Quiz</b><small>'+esc(sub)+'</small></div><div class="nyxq520-count">'+esc(countText)+'</div></div>'
        + '<div class="nyxq520-bar"><i style="width:'+esc(cc.pct)+'%"></i></div>'
        + '<div class="nyxq520-mid"><div class="nyxq520-stat"><small>Acertos</small><b>'+st.score+'</b></div><div class="nyxq520-stat"><small>Respondidas</small><b>'+st.answered+'</b></div><div class="nyxq520-stat"><small>Acurácia</small><b>'+st.acc+'%</b></div></div>'
        + '<div class="nyxq520-actions"><button class="nyxq520-btn" id="homeBtn" type="button">Início</button><button class="nyxq520-btn good" id="trainingMenuHudBtn" type="button">Áreas</button></div>'
        + '</section>';
      if(h.innerHTML !== hudHtml) h.innerHTML = hudHtml;
      var home=document.getElementById('homeBtn'); if(home) home.onclick=goHome;
      var areas=document.getElementById('trainingMenuHudBtn'); if(areas) areas.onclick=goAreas;
      return true;
    }catch(e){ return false; }
  }
  function polishQuizDom(){
    try{
      document.body.classList.add('nyx-quiz-clean-v520');
      document.body.setAttribute('data-nyx-quiz-clean', BUILD);
      if(window.state && window.state.mode==='training') renderCleanHud();
      var prompts=document.querySelectorAll('.nyxq426-prompt');
      Array.prototype.forEach.call(prompts,function(el){
        var cleaned=sanitizePrompt(el.textContent);
        if(cleaned && cleaned!==el.textContent) el.textContent=cleaned;
      });
      var reportSpans=document.querySelectorAll('.nyxq426-report-item span');
      Array.prototype.forEach.call(reportSpans,function(el){
        var cleaned=sanitizePrompt(el.textContent);
        if(cleaned && cleaned!==el.textContent) el.textContent=cleaned;
      });
    }catch(e){}
  }
  try{
    var prevHud=window.renderHud;
    window.renderHud=function(){
      if(window.state && window.state.mode==='training') { renderCleanHud(); return; }
      if(typeof prevHud==='function') return prevHud.apply(this, arguments);
    };
    try{ renderHud=window.renderHud; }catch(e){}
  }catch(e){}
  function wrap(name){
    try{
      var old=window[name];
      if(typeof old==='function' && !old.__nyx520){
        var wrapped=function(){ var r=old.apply(this, arguments); setTimeout(polishQuizDom,0); return r; };
        wrapped.__nyx520=true;
        window[name]=wrapped;
        try{ if(name==='renderTrainingModule') renderTrainingModule=wrapped; }catch(e){}
        try{ if(name==='nextTrainingCase') nextTrainingCase=wrapped; }catch(e){}
        try{ if(name==='answerTraining') answerTraining=wrapped; }catch(e){}
      }
    }catch(e){}
  }
  function install(){
    try{document.title='NYX Cell Counter Pro v5.22 — Quiz Auditoria Editorial';}catch(e){}
    wrap('renderTrainingModule'); wrap('nextTrainingCase'); wrap('answerTraining');
    polishQuizDom();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', install); else install();
  window.addEventListener('load', function(){ install(); setTimeout(polishQuizDom,80); setTimeout(polishQuizDom,400); });
  try{
    var mo=new MutationObserver(function(){polishQuizDom();});
    if(document.body) mo.observe(document.body,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();
