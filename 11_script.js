
(function(){
  'use strict';
  var BUILD = 'v4.25-quiz-v23-native-integrated';
  var NYX_QUIZ_BANK_V23 = window.NYX_QUIZ_BANK_V23 || [];

  function esc(v){return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function txt(v){return String(v == null ? '' : v);}
  function beepSafe(kind){try{ if (typeof beep === 'function') beep(kind || 'short'); }catch(e){}}
  function toastSafe(msg){try{ if (typeof showToast === 'function') showToast(msg); }catch(e){}}
  function renderSafe(){try{ if (typeof render === 'function') render(); }catch(e){ try{renderTrainingModule();}catch(_e){} }}
  function rnd(arr){var a=(arr||[]).slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function uniq(arr){var seen={},out=[];for(var i=0;i<arr.length;i++){var k=String(arr[i]);if(!seen[k]){seen[k]=1;out.push(arr[i]);}}return out;}
  function findById(id){for(var i=0;i<NYX_QUIZ_BANK_V23.length;i++) if(NYX_QUIZ_BANK_V23[i].id===id) return NYX_QUIZ_BANK_V23[i]; return null;}
  var COMP_LABELS={
    all:'Todas', identificacao:'Identificação', criterio_morfologico:'Critério morfológico', diferenciacao:'Diferenciação', interpretacao_resultado:'Interpretação', conduta_tecnica:'Conduta técnica', caso:'Caso clínico/lab', correlacao_laboratorial:'Correlação lab.', controle_qualidade:'Controle de qualidade', armadilha:'Armadilha', armadilha_analitica:'Armadilha analítica', armadilha_pre_analitica:'Pré-analítica', seguranca_laboratorial:'Segurança'
  };
  var LEVEL_LABELS={all:'Todos',basico:'Básico',intermediario:'Intermediário',avancado:'Avançado'};
  var MODE_LABELS={study:'Estudo',exam:'Prova'};
  var SIZES=[5,10,20,50,100,'all'];
  var LEVELS=['all','basico','intermediario','avancado'];
  var MODES=['study','exam'];

  function areaList(){
    var map={},out=[];
    for(var i=0;i<NYX_QUIZ_BANK_V23.length;i++){
      var q=NYX_QUIZ_BANK_V23[i], id=q.area||'geral';
      if(!map[id]){map[id]={id:id,label:q.areaLabel||id,count:0};out.push(map[id]);}
      map[id].count++;
    }
    out.sort(function(a,b){return a.label.localeCompare(b.label,'pt-BR');});
    return out;
  }
  var AREAS=areaList();
  function areaLabel(id){ if(!id||id==='all') return 'Todas as áreas'; for(var i=0;i<AREAS.length;i++) if(AREAS[i].id===id) return AREAS[i].label; return id; }
  function levelLabel(v){return LEVEL_LABELS[v]||v||'Todos';}
  function compLabel(v){return COMP_LABELS[v]||String(v||'Todas').replace(/_/g,' ');}
  function sizeLabel(v){return v==='all'?'Todas':String(v);}

  function ensureTraining(){
    try{ window.state = state; }catch(e){}
    if(!state.training) state.training={};
    var t=state.training;
    if(!t.native425){
      t.native425=true;
      t.view='menu'; t.area=t.area||'all'; t.level=t.level||'all'; t.competency=t.competency||'all'; t.mode=t.mode||'study'; t.sessionSize=t.sessionSize||5;
      t.session=[]; t.sessionIndex=0; t.selected=null; t.answered=false; t.score=0; t.totalAnswered=0; t.history=[]; t.showPlan=false;
    }
    if(!t.view) t.view='menu';
    if(!t.area) t.area='all';
    if(!t.level) t.level='all';
    if(!t.competency) t.competency='all';
    if(!t.mode) t.mode='study';
    if(!t.sessionSize) t.sessionSize=5;
    if(!Array.isArray(t.session)) t.session=[];
    if(!Array.isArray(t.history)) t.history=[];
    return t;
  }

  function normalizeQuestion(q){
    var opts=Array.isArray(q.options)?q.options.slice():[];
    var ans=q.answer;
    if((ans == null || ans === '') && typeof q.answerIndex === 'number') ans=opts[q.answerIndex];
    if(ans == null) ans='';
    var has=false; for(var i=0;i<opts.length;i++) if(opts[i]===ans) has=true;
    if(!has && ans) opts.push(ans);
    opts=uniq(opts).filter(function(x){return String(x).trim()!=='';});
    return {
      id:q.id||('q_'+Math.random()), area:q.area||'geral', areaLabel:q.areaLabel||areaLabel(q.area), level:q.level||'basico', competency:q.competency||'identificacao',
      topic:q.topic||'', prompt:q.prompt||q.stem||'', options:opts, answer:ans, explanation:q.explanation||q.why||'', technicalBasis:q.technicalBasis||'', ref:'', tags:q.tags||[]
    };
  }
  function filteredPool(){
    var t=ensureTraining();
    var arr=[];
    for(var i=0;i<NYX_QUIZ_BANK_V23.length;i++){
      var q=NYX_QUIZ_BANK_V23[i];
      if(t.area && t.area!=='all' && q.area!==t.area) continue;
      if(t.level && t.level!=='all' && q.level!==t.level) continue;
      if(t.competency && t.competency!=='all' && q.competency!==t.competency) continue;
      arr.push(q);
    }
    return arr;
  }
  function fallbackPool(){
    var t=ensureTraining();
    var arr=filteredPool();
    if(arr.length) return arr;
    for(var i=0;i<NYX_QUIZ_BANK_V23.length;i++){
      var q=NYX_QUIZ_BANK_V23[i];
      if(t.area && t.area!=='all' && q.area!==t.area) continue;
      if(t.level && t.level!=='all' && q.level!==t.level) continue;
      arr.push(q);
    }
    if(arr.length) return arr;
    for(var j=0;j<NYX_QUIZ_BANK_V23.length;j++){
      var x=NYX_QUIZ_BANK_V23[j];
      if(t.area && t.area!=='all' && x.area!==t.area) continue;
      arr.push(x);
    }
    return arr.length?arr:NYX_QUIZ_BANK_V23.slice();
  }
  function poolCountFor(area){
    var t=ensureTraining(), n=0;
    for(var i=0;i<NYX_QUIZ_BANK_V23.length;i++){
      var q=NYX_QUIZ_BANK_V23[i];
      if(area && area!=='all' && q.area!==area) continue;
      if(t.level && t.level!=='all' && q.level!==t.level) continue;
      if(t.competency && t.competency!=='all' && q.competency!==t.competency) continue;
      n++;
    }
    return n;
  }
  function makeSessionFrom(raw){
    var t=ensureTraining();
    var size=t.sessionSize==='all'?raw.length:Math.min(Number(t.sessionSize)||5,raw.length);
    var picked=rnd(raw).slice(0,size).map(function(q){var n=normalizeQuestion(q); n.shuffledOptions=rnd(n.options); return n;});
    return picked;
  }
  function startSession(){
    var t=ensureTraining();
    var raw=fallbackPool();
    if(!raw.length){toastSafe('Nenhuma questão encontrada'); return;}
    t.session=makeSessionFrom(raw); t.sessionIndex=0; t.selected=null; t.answered=false; t.score=0; t.totalAnswered=0; t.history=[]; t.view='quiz'; t.showPlan=false;
    beepSafe('short'); renderSafe();
  }
  function makeChips(values, active, attr, labelFn){
    var h='';
    for(var i=0;i<values.length;i++){
      var v=values[i], label=labelFn?labelFn(v):String(v);
      h+='<button class="nyxq-chip '+(String(active)===String(v)?'active':'')+'" type="button" '+attr+'="'+esc(v)+'">'+esc(label)+'</button>';
    }
    return h;
  }
  function renderMenu425(){
    var t=ensureTraining();
    var count=filteredPool().length;
    var h='<section class="nyxq nyxq-menu">';
    h+='<article class="nyxq-card nyxq-head"><div><div class="nyxq-kicker">Treino integrado nativo</div><h2 class="nyxq-title">Banco autoral</h2><p class="nyxq-sub">Banco standalone incorporado ao app principal. Sem iframe, sem borda externa e com rolagem própria do Cell Counter.</p></div><div class="nyxq-badge"><b>'+count+'</b><small>questões</small></div></article>';
    h+='<article class="nyxq-card"><p class="nyxq-section-title">Área</p><div class="nyxq-area-row"><button class="nyxq-chip '+(t.area==='all'?'active':'')+'" type="button" data-nyxq-area="all">Todas · '+NYX_QUIZ_BANK_V23.length+'</button>';
    for(var i=0;i<AREAS.length;i++){var a=AREAS[i]; h+='<button class="nyxq-chip '+(t.area===a.id?'active':'')+'" type="button" data-nyxq-area="'+esc(a.id)+'">'+esc(a.label)+' · '+a.count+'</button>';}
    h+='</div></article>';
    h+='<article class="nyxq-card nyxq-form-grid">';
    h+='<div><p class="nyxq-section-title">Nível</p><div class="nyxq-chip-row">'+makeChips(LEVELS,t.level,'data-nyxq-level',levelLabel)+'</div></div>';
    var comps=['all'].concat(Object.keys(COMP_LABELS).filter(function(k){return k!=='all';}));
    h+='<div><p class="nyxq-section-title">Competência</p><div class="nyxq-chip-row">'+makeChips(comps,t.competency,'data-nyxq-comp',compLabel)+'</div></div>';
    h+='<div><p class="nyxq-section-title">Modo</p><div class="nyxq-chip-row">'+makeChips(MODES,t.mode,'data-nyxq-mode',function(v){return MODE_LABELS[v];})+'</div></div>';
    h+='<div><p class="nyxq-section-title">Sessão</p><div class="nyxq-chip-row">'+makeChips(SIZES,t.sessionSize,'data-nyxq-size',sizeLabel)+'</div></div>';
    h+='</article>';
    h+='<section class="nyxq-actions"><button class="nyxq-btn" type="button" data-nyxq-action="home">Início</button><button class="nyxq-btn warn" type="button" data-nyxq-action="clear">Limpar</button><button class="nyxq-btn good" type="button" data-nyxq-action="start">Iniciar</button><button class="nyxq-btn" type="button" data-nyxq-action="report">Relatório</button></section>';
    h+='</section>';
    grid.className='nyxq-grid'; grid.innerHTML=h; bind425();
  }
  function currentQuestion(){var t=ensureTraining(); return t.session && t.session.length ? t.session[t.sessionIndex] : null;}
  function renderQuiz425(){
    var t=ensureTraining(), q=currentQuestion(); if(!q){t.view='menu'; renderMenu425(); return;}
    var idx=(t.sessionIndex||0)+1, total=t.session.length, pct=Math.round(idx/Math.max(1,total)*100);
    var answered=!!t.answered, selected=t.selected;
    var h='<section class="nyxq nyxq-quiz">';
    h+='<article class="nyxq-card nyxq-progress"><div class="nyxq-progress-top"><span>Questão '+idx+' de '+total+'</span><span>'+pct+'%</span></div><div class="nyxq-bar"><i style="width:'+pct+'%"></i></div></article>';
    h+='<article class="nyxq-card nyxq-question"><div class="nyxq-meta"><span class="nyxq-pill">'+esc(areaLabel(q.area))+'</span><span class="nyxq-pill">'+esc(levelLabel(q.level))+'</span><span class="nyxq-pill">'+esc(compLabel(q.competency))+'</span><span class="nyxq-pill">'+esc(q.topic||'tema geral')+'</span></div>';
    h+='<p class="nyxq-prompt">'+esc(q.prompt)+'</p><div class="nyxq-options">';
    for(var i=0;i<q.shuffledOptions.length;i++){
      var opt=q.shuffledOptions[i]; var cls='';
      if(answered && opt===q.answer) cls=' correct'; else if(answered && opt===selected && selected!==q.answer) cls=' wrong';
      h+='<button class="nyxq-option'+cls+'" type="button" data-nyxq-answer="'+esc(opt)+'" '+(answered?'disabled':'')+'>'+esc(opt)+'</button>';
    }
    h+='</div>';
    if(answered && t.mode!=='exam'){
      h+='<div class="nyxq-explain"><b>Resposta:</b> '+esc(q.answer)+'<br>'+esc(q.explanation||'Sem explicação cadastrada.')+(q.technicalBasis?'<small>Base técnica: '+esc(q.technicalBasis)+'</small>':'')+'</div>';
    }
    h+='</article>';
    h+='<section class="nyxq-nav"><button class="nyxq-btn" type="button" data-nyxq-action="menu">Áreas</button><button class="nyxq-btn" type="button" data-nyxq-action="report">Relatório</button><button class="nyxq-btn warn" type="button" data-nyxq-action="clear">Limpar</button><button class="nyxq-btn good" type="button" data-nyxq-action="next">'+(idx>=total?'Finalizar':'Próxima')+'</button></section>';
    h+='</section>';
    grid.className='nyxq-grid'; grid.innerHTML=h; bind425();
  }
  function answerTraining425(option){
    var t=ensureTraining(); if(t.answered) return; var q=currentQuestion(); if(!q) return;
    var correct=option===q.answer;
    t.selected=option; t.answered=true; t.totalAnswered=(t.totalAnswered||0)+1; if(correct) t.score=(t.score||0)+1;
    t.history.push({id:q.id,area:q.area,areaLabel:q.areaLabel,level:q.level,competency:q.competency,topic:q.topic,prompt:q.prompt,selected:option,answer:q.answer,correct:correct,why:q.explanation,technicalBasis:q.technicalBasis,ref:q.ref});
    beepSafe(correct?'short':'long'); toastSafe(correct?'Correto':'Revise o critério'); renderSafe();
  }
  function nextTraining425(){
    var t=ensureTraining();
    if(t.view==='menu'){startSession(); return;}
    if(t.view==='report'){t.view='menu'; beepSafe('short'); renderSafe(); return;}
    if(t.view!=='quiz'){t.view='menu'; renderSafe(); return;}
    if(!t.answered){toastSafe('Responda antes de avançar'); return;}
    if(t.sessionIndex >= t.session.length-1){t.view='report'; beepSafe('short'); renderSafe(); return;}
    t.sessionIndex++; t.selected=null; t.answered=false; beepSafe('short'); renderSafe();
  }
  function resetTraining425(){
    var t=ensureTraining(); t.view='menu'; t.session=[]; t.sessionIndex=0; t.selected=null; t.answered=false; t.score=0; t.totalAnswered=0; t.history=[]; t.showPlan=false; beepSafe('short'); renderSafe();
  }
  function stats425(){
    var t=ensureTraining(), h=t.history||[], s={total:h.length,score:0,wrong:0,byArea:{},byComp:{},topics:{}};
    for(var i=0;i<h.length;i++){
      var it=h[i]; if(it.correct) s.score++; else s.wrong++;
      var a=it.areaLabel||areaLabel(it.area), c=compLabel(it.competency), top=it.topic||'Tema geral';
      if(!s.byArea[a]) s.byArea[a]={total:0,wrong:0}; if(!s.byComp[c]) s.byComp[c]={total:0,wrong:0}; if(!s.topics[top]) s.topics[top]={total:0,wrong:0};
      s.byArea[a].total++; s.byComp[c].total++; s.topics[top].total++; if(!it.correct){s.byArea[a].wrong++; s.byComp[c].wrong++; s.topics[top].wrong++;}
    }
    s.acc=s.total?Math.round(s.score/s.total*100):0; return s;
  }
  function worstItems(map, limit){
    var out=[]; for(var k in map){ if(map.hasOwnProperty(k) && map[k].wrong>0) out.push({label:k,total:map[k].total,wrong:map[k].wrong,rate:Math.round(map[k].wrong/map[k].total*100)}); }
    out.sort(function(a,b){return (b.wrong-a.wrong)||(b.rate-a.rate);}); return out.slice(0,limit||5);
  }
  function renderStudyPlan425(s){
    var areas=worstItems(s.byArea,4), comps=worstItems(s.byComp,4), topics=worstItems(s.topics,6);
    if(!s.wrong) return '<article class="nyxq-card nyxq-plan"><div class="nyxq-section-title">Plano de estudo</div><p class="nyxq-empty">Sem erros nesta sessão. Próxima etapa: aumentar dificuldade, usar modo prova ou escolher uma área específica.</p></article>';
    var h='<article class="nyxq-card nyxq-plan"><div class="nyxq-section-title">Plano de estudo por erros</div><ul>';
    for(var i=0;i<areas.length;i++) h+='<li>Priorizar <b>'+esc(areas[i].label)+'</b>: '+areas[i].wrong+' erro(s) em '+areas[i].total+' questão(ões).</li>';
    for(var j=0;j<comps.length;j++) h+='<li>Treinar competência <b>'+esc(comps[j].label)+'</b>: rever critério técnico e armadilhas.</li>';
    for(var k=0;k<topics.length;k++) h+='<li>Revisar tópico <b>'+esc(topics[k].label)+'</b>.</li>';
    h+='</ul></article>'; return h;
  }
  function reportText425(){
    var t=ensureTraining(), s=stats425();
    var lines=['NYX Cell Counter Pro v4.26 — Relatório do Banco autoral','Área: '+areaLabel(t.area),'Nível: '+levelLabel(t.level),'Competência: '+compLabel(t.competency),'Resultado: '+s.score+'/'+s.total+' ('+s.acc+'%)',''];
    for(var i=0;i<t.history.length;i++){
      var it=t.history[i]; lines.push((i+1)+'. '+(it.correct?'ACERTO':'ERRO')+' — '+(it.areaLabel||areaLabel(it.area))+' / '+levelLabel(it.level)+' / '+compLabel(it.competency));
      lines.push('Pergunta: '+it.prompt); lines.push('Sua resposta: '+it.selected); lines.push('Resposta correta: '+it.answer); if(it.why) lines.push('Explicação: '+it.why); if(it.ref) lines.push('Referência: '+it.ref); lines.push('');
    }
    return lines.join('\n');
  }
  function copyReport425(){
    var text=reportText425();
    if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toastSafe('Relatório copiado');beepSafe('short');}).catch(function(){fallbackCopy425(text);});}
    else fallbackCopy425(text);
  }
  function fallbackCopy425(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');toastSafe('Relatório copiado');beepSafe('short');}catch(e){toastSafe('Não foi possível copiar');beepSafe('long');}document.body.removeChild(ta);}
  function reviewWrong425(){
    var t=ensureTraining(); var wrong=[];
    for(var i=0;i<t.history.length;i++) if(!t.history[i].correct){var q=findById(t.history[i].id); if(q) wrong.push(q);}
    if(!wrong.length){toastSafe('Nenhum erro para revisar'); return;}
    t.session=makeSessionFrom(wrong); t.sessionIndex=0; t.selected=null; t.answered=false; t.score=0; t.totalAnswered=0; t.history=[]; t.view='quiz'; t.mode='study'; t.showPlan=false; beepSafe('short'); renderSafe();
  }
  function renderReport425(){
    var t=ensureTraining(); if(!t.history.length){t.view='menu'; renderMenu425(); return;}
    var s=stats425();
    var h='<section class="nyxq nyxq-report">';
    h+='<article class="nyxq-card nyxq-head"><div><div class="nyxq-kicker">Relatório</div><h2 class="nyxq-title">Desempenho</h2><p class="nyxq-sub">'+esc(areaLabel(t.area))+' · '+esc(levelLabel(t.level))+' · '+esc(compLabel(t.competency))+'</p></div></article>';
    h+='<article class="nyxq-card nyxq-stats"><div class="nyxq-stat"><small>Acertos</small><b>'+s.score+'</b></div><div class="nyxq-stat"><small>Erros</small><b>'+s.wrong+'</b></div><div class="nyxq-stat"><small>Acurácia</small><b>'+s.acc+'%</b></div></article>';
    h+='<section class="nyxq-nav"><button class="nyxq-btn" type="button" data-nyxq-action="menu">Áreas</button><button class="nyxq-btn" type="button" data-nyxq-action="copy">Copiar</button><button class="nyxq-btn good" type="button" data-nyxq-action="review-wrong">Revisar erros</button><button class="nyxq-btn warn" type="button" data-nyxq-action="plan">Plano</button></section>';
    if(t.showPlan) h+=renderStudyPlan425(s);
    h+='<article class="nyxq-card nyxq-report-list">';
    for(var i=0;i<t.history.length;i++){var it=t.history[i]; h+='<div class="nyxq-report-item"><b class="'+(it.correct?'nyxq-ok':'nyxq-bad')+'">'+(i+1)+'. '+(it.correct?'ACERTO':'ERRO')+' — '+esc(it.topic||'')+'</b><span>'+esc(it.prompt)+'</span><span>Sua resposta: '+esc(it.selected)+'</span><span>Correta: '+esc(it.answer)+'</span>'+(it.why?'<span>'+esc(it.why)+'</span>':'')+'</div>';}
    h+='</article></section>';
    grid.className='nyxq-grid'; grid.innerHTML=h; bind425();
  }
  function bind425(){
    try{
      var nodes=grid.querySelectorAll('[data-nyxq-area]'); for(var i=0;i<nodes.length;i++) nodes[i].onclick=function(){var t=ensureTraining(); t.area=this.getAttribute('data-nyxq-area')||'all'; beepSafe('short'); renderSafe();};
      nodes=grid.querySelectorAll('[data-nyxq-level]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){var t=ensureTraining(); t.level=this.getAttribute('data-nyxq-level')||'all'; beepSafe('short'); renderSafe();};
      nodes=grid.querySelectorAll('[data-nyxq-comp]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){var t=ensureTraining(); t.competency=this.getAttribute('data-nyxq-comp')||'all'; beepSafe('short'); renderSafe();};
      nodes=grid.querySelectorAll('[data-nyxq-mode]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){var t=ensureTraining(); t.mode=this.getAttribute('data-nyxq-mode')||'study'; beepSafe('short'); renderSafe();};
      nodes=grid.querySelectorAll('[data-nyxq-size]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){var t=ensureTraining(); var v=this.getAttribute('data-nyxq-size'); t.sessionSize=(v==='all')?'all':(Number(v)||5); beepSafe('short'); renderSafe();};
      nodes=grid.querySelectorAll('[data-nyxq-answer]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){answerTraining425(this.getAttribute('data-nyxq-answer'));};
      nodes=grid.querySelectorAll('[data-nyxq-action]'); for(i=0;i<nodes.length;i++) nodes[i].onclick=function(){doAction425(this.getAttribute('data-nyxq-action'));};
    }catch(e){}
  }
  function doAction425(a){
    var t=ensureTraining();
    if(a==='home'){try{openHome();}catch(e){} return;}
    if(a==='start'){startSession(); return;}
    if(a==='clear'){resetTraining425(); return;}
    if(a==='menu'){t.view='menu'; beepSafe('short'); renderSafe(); return;}
    if(a==='next'){nextTraining425(); return;}
    if(a==='report'){if(t.history.length){t.view='report'; beepSafe('short'); renderSafe();}else toastSafe('Sem respostas ainda'); return;}
    if(a==='copy'){copyReport425(); return;}
    if(a==='review-wrong'){reviewWrong425(); return;}
    if(a==='plan'){t.showPlan=!t.showPlan; beepSafe('short'); renderSafe(); return;}
  }
  function renderTraining425(){
    ensureTraining();
    try{document.body.setAttribute('data-stable-build',BUILD);document.body.classList.add('nyx-quiz-native-425');}catch(e){}
    var t=ensureTraining();
    if(t.view==='quiz') renderQuiz425(); else if(t.view==='report') renderReport425(); else renderMenu425();
  }

  try{
    var oldSync = (typeof syncVisualState === 'function') ? syncVisualState : null;
    if(oldSync && !oldSync.__nyx425){
      var ns=function(){oldSync(); try{document.body.classList.toggle('nyx-quiz-native-425', state.mode==='training');}catch(e){}};
      ns.__nyx425=true; syncVisualState=ns; window.syncVisualState=ns;
    }
  }catch(e){}

  try{
    var oldHud=(typeof renderHud==='function')?renderHud:null;
    if(oldHud && !oldHud.__nyx425){
      var nh=function(){
        if(!state || state.mode!=='training') return oldHud();
        var t=ensureTraining(), s=stats425(); var inSession=t.view==='quiz' && t.session && t.session.length; var pct=inSession?Math.round(((t.sessionIndex||0)+1)/Math.max(1,t.session.length)*100):s.acc;
        hud.innerHTML='<section class="readout-row clean-hud-readout"><div class="readout"><span class="mode">Treino</span><h1 class="total">'+s.score+'<small>/'+(s.total||0)+'</small></h1></div><div class="progress-wrap"><div class="progress"><i style="width:'+pct+'%"></i></div><div class="status">Banco autoral integrado · '+(inSession?('questão '+((t.sessionIndex||0)+1)+'/'+t.session.length):('banco '+NYX_QUIZ_BANK_V23.length+' questões'))+'</div></div></section><section class="control-row clean-control-row training-actions"><button class="btn" id="homeBtn" type="button">Início</button><button class="btn good" id="trainingNextBtn" type="button">'+(t.view==='menu'?'Iniciar':(t.view==='report'?'Áreas':'Próx.'))+'</button><button class="btn" id="trainingReportBtn425" type="button">Relat.</button><button class="btn danger" id="trainingResetBtn" type="button">Zerar</button></section>';
        var b=document.getElementById('homeBtn'); if(b) b.onclick=function(){try{openHome();}catch(e){}};
        b=document.getElementById('trainingNextBtn'); if(b) b.onclick=nextTraining425;
        b=document.getElementById('trainingResetBtn'); if(b) b.onclick=resetTraining425;
        b=document.getElementById('trainingReportBtn425'); if(b) b.onclick=function(){if(t.history.length){t.view='report';renderSafe();}else toastSafe('Sem respostas ainda');};
      };
      nh.__nyx425=true; renderHud=nh; window.renderHud=nh;
    }
  }catch(e){}

  try{renderTrainingModule=renderTraining425; window.renderTrainingModule=renderTraining425;}catch(e){}
  try{answerTraining=answerTraining425; window.answerTraining=answerTraining425;}catch(e){}
  try{nextTrainingCase=nextTraining425; window.nextTrainingCase=nextTraining425;}catch(e){}
  try{resetTraining=resetTraining425; window.resetTraining=resetTraining425;}catch(e){}
  try{window.NYX_QUIZ_BANK_V23=NYX_QUIZ_BANK_V23; window.state=state;}catch(e){}

  function polishHome425(){
    try{
      var c=document.querySelector('.home-option.training'); if(!c) return;
      var small=c.querySelector('small'), b=c.querySelector('b'), span=c.querySelector('span');
      if(small) small.textContent='Treino'; if(b) b.textContent='Banco autoral'; if(span) span.textContent='1.650 questões autorais integradas ao Cell Counter.';
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',polishHome425); else polishHome425();
  window.addEventListener('load',polishHome425);
})();

