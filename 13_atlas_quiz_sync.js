
(function(){
  'use strict';
  var BUILD='v4.27-atlas-synced-with-quiz-v23';
  var AREA_META={
    all:{label:'Todas as áreas',kicker:'geral',desc:'Todas as fichas do Atlas e todos os conceitos avaliados no Banco autoral.'},
    hematology:{label:'Hematologia',kicker:'hemato',desc:'Hemograma, morfologia, hemostasia, reticulócitos e armadilhas.'},
    urinalysis:{label:'Urinálise',kicker:'urina',desc:'Físico, químico, sedimento, cilindros, cristais e interferentes.'},
    parasitology:{label:'Parasitologia',kicker:'parasito',desc:'Protozoários, helmintos, técnicas, ovos, cistos e diferenciais.'},
    biochemistry:{label:'Bioquímica',kicker:'bioq',desc:'Analitos, interferentes, painéis, função renal/hepática e qualidade.'},
    microbiology:{label:'Microbiologia',kicker:'micro',desc:'Gram, cultura, antibiograma, micologia, BAAR, colônias e CQ.'},
    fluids:{label:'Líquidos',kicker:'fluidos',desc:'Líquor, pleural, ascítico, sinovial, pericárdico e diferenciais.'},
    semen:{label:'Espermograma',kicker:'sêmen',desc:'Coleta, motilidade, vitalidade, morfologia, concentração e células redondas.'},
    myelogram:{label:'Mielograma',kicker:'medula',desc:'Celularidade, linhagens, blastos, displasia, ferro e interpretação medular.'},
    coagulation:{label:'Coagulação',kicker:'coag',desc:'TP, TTPA, INR, fibrinogênio, D-dímero, hemostasia e interferentes.'},
    immunology:{label:'Imunologia/Sorologia',kicker:'imuno',desc:'Sorologias, imunoensaios, autoimunidade, janelas diagnósticas e interferentes.'},
    quality:{label:'Qualidade Laboratorial',kicker:'qualidade',desc:'CQ, Westgard, calibração, delta check, rastreabilidade e segurança analítica.'},
    preanalytical:{label:'Pré-analítico',kicker:'pré',desc:'Coleta, transporte, estabilidade, interferentes, rejeição e segurança.'},
    bloodgas:{label:'Gasometria/Eletrólitos',kicker:'gaso',desc:'pH, gases, bicarbonato, lactato, ânion gap e eletrólitos críticos.'},
    bloodbank:{label:'Imuno-hematologia',kicker:'banco',desc:'ABO/Rh, Coombs, PAI, prova cruzada, compatibilidade e transfusão.'},
    cytology:{label:'Citologia',kicker:'cito',desc:'Papanicolau, Bethesda, adequabilidade, agentes, atipias e colorações.'}
  };
  var AREA_ORDER=['all','hematology','urinalysis','parasitology','biochemistry','microbiology','fluids','semen','myelogram','coagulation','immunology','quality','preanalytical','bloodgas','bloodbank','cytology'];
  var LEVEL_LABELS={all:'Todos',basico:'Básico',intermediario:'Intermediário',avancado:'Avançado'};
  var COMP_LABELS={all:'Todas',identificacao:'Identificação',criterio_morfologico:'Critério morfológico',diferenciacao:'Diferenciação',interpretacao_resultado:'Interpretação',conduta_tecnica:'Conduta técnica',caso:'Caso clínico/lab',correlacao_laboratorial:'Correlação lab.',controle_qualidade:'Controle de qualidade',armadilha:'Armadilha',armadilha_analitica:'Armadilha analítica',armadilha_pre_analitica:'Pré-analítica',seguranca_laboratorial:'Segurança'};
  var FILTERS=[
    {id:'all',label:'Todas'},
    {id:'identificacao',label:'Identificação'},
    {id:'criterio_morfologico',label:'Morfologia'},
    {id:'diferenciacao',label:'Diferenciação'},
    {id:'interpretacao_resultado',label:'Interpretação'},
    {id:'correlacao_laboratorial',label:'Correlação'},
    {id:'conduta_tecnica',label:'Conduta'},
    {id:'caso',label:'Casos'},
    {id:'armadilha_pre_analitica',label:'Pré-analítica'},
    {id:'armadilha_analitica',label:'Analítica'},
    {id:'controle_qualidade',label:'CQ'},
    {id:'seguranca_laboratorial',label:'Segurança'},
    {id:'atlas_base',label:'Atlas base'}
  ];
  var cacheKey='', cacheCards=null;
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function text(v){return String(v==null?'':v).replace(/^\s+|\s+$/g,'');}
  function bank(){try{return Array.isArray(window.NYX_QUIZ_BANK_V23)?window.NYX_QUIZ_BANK_V23:[];}catch(e){return [];}}
  function atlasBase(){try{return Array.isArray(ATLAS_CELLS)?ATLAS_CELLS:[];}catch(e){return [];}}
  function areaMeta(id,label){id=id||'all';var m=AREA_META[id]||{label:label||id,kicker:id,desc:'Conceitos e questões sincronizados a partir do Banco autoral.'};return {id:id,label:label||m.label,kicker:m.kicker||id,desc:m.desc||''};}
  function areaLabel(id,label){return areaMeta(id,label).label;}
  function levelLabel(id){return LEVEL_LABELS[id]||id||'';}
  function compLabel(id){return COMP_LABELS[id]||String(id||'').replace(/_/g,' ');}
  function compact(s,n){s=text(s);n=n||210;return s.length>n?s.slice(0,n-1)+'…':s;}
  function incorrectOptions(q){var ans=text(q.answer);if(!ans && typeof q.answerIndex==='number' && q.options) ans=q.options[q.answerIndex];var arr=[];if(Array.isArray(q.options)){for(var i=0;i<q.options.length;i++){var opt=text(q.options[i]);if(opt && opt!==ans)arr.push(opt);}}return arr;}
  function questionAnswer(q){if(q.answer!=null && q.answer!=='')return q.answer;if(typeof q.answerIndex==='number' && Array.isArray(q.options))return q.options[q.answerIndex]||'';return '';}
  function quizCard(q,i){
    var id='quiz_'+String(q.conceptId||q.id||('q_'+i)).replace(/[^a-zA-Z0-9_\-]+/g,'_');
    var area=q.area||'all';
    var topic=text(q.topic)||text(q.answer)||text(q.stemOriginal_v15)||text(q.id)||'Conceito do quiz';
    var prompt=text(q.prompt||q.stem||q.stemOriginal_v15);
    var answer=text(questionAnswer(q));
    var explanation=text(q.explanation||q.why||q.explanationOriginal_v15||q.technicalBasis);
    var tech=text(q.technicalBasis)||explanation;
    var wrong=incorrectOptions(q);
    var tags=Array.isArray(q.tags)?q.tags.join(', '):'';
    var level=levelLabel(q.level);
    var comp=compLabel(q.competency);
    return {
      id:id,
      source:'quiz_v23',
      area:area,
      group:q.competency||'quiz',
      tag:comp+' · '+level,
      name:topic,
      stage:prompt,
      size:'Área: '+areaLabel(area,q.areaLabel)+' · Nível: '+level+' · Competência: '+comp+'.',
      nucleus:prompt,
      chromatin:answer,
      cytoplasm:compact(tech,520),
      diff:wrong.length?wrong.map(function(x){return '• '+x;}).join('\n'):'Sem alternativas distratoras registradas neste item.',
      clues:(tags?'Tags: '+tags+'. ':'')+'ID: '+(q.id||'—')+' · Conceito: '+(q.conceptId||'—')+'.',
      alerts:'Ficha gerada automaticamente a partir do banco do Banco autoral. Use como revisão educacional; confirme critérios em referências e POP local antes de aplicar em validação real.',
      ref:'',
      question:q,
      fields:{
        schema:'quiz',
        prompt:prompt,
        answer:answer,
        explanation:explanation,
        technicalBasis:tech,
        wrongOptions:wrong,
        topic:topic,
        level:q.level||'',
        competency:q.competency||'',
        tags:tags,
        conceptId:q.conceptId||'',
        sourceId:q.id||''
      }
    };
  }
  function normalizeBase(c,i){
    if(!c)return null;
    var clone={};for(var k in c)if(Object.prototype.hasOwnProperty.call(c,k))clone[k]=c[k];
    clone.id=clone.id||('atlas_base_'+i);
    clone.source=clone.source||'atlas_base';
    clone.area=clone.area||'hematology';
    clone.group=clone.group||'atlas_base';
    clone.tag=clone.tag||'Atlas base';
    clone.name=clone.name||'Ficha do Atlas';
    clone.stage=clone.stage||'';
    return clone;
  }
  function allCards(){
    var b=bank(), a=atlasBase(), key=b.length+'|'+a.length;
    if(cacheCards&&cacheKey===key)return cacheCards;
    var out=[], seen={};
    for(var i=0;i<a.length;i++){var item=normalizeBase(a[i],i);if(!item)continue;var bid='base_'+item.id;if(seen[bid])continue;seen[bid]=1;out.push(item);}
    for(var j=0;j<b.length;j++){var qc=quizCard(b[j],j);if(seen[qc.id])continue;seen[qc.id]=1;out.push(qc);}
    cacheKey=key;cacheCards=out;return out;
  }
  function areaCatalog(){
    var b=bank(), a=atlasBase(), seen={}, counts={}, labels={};
    function add(id,label){id=id||'all';if(!seen[id]){seen[id]=1;counts[id]=0;labels[id]=label||areaLabel(id);} }
    add('all','Todas as áreas');
    for(var i=0;i<a.length;i++){var aa=(a[i]&&a[i].area)||'hematology';add(aa,areaLabel(aa));counts[aa]=(counts[aa]||0)+1;counts.all++;}
    for(var j=0;j<b.length;j++){var q=b[j]||{}, ar=q.area||'all';add(ar,q.areaLabel||areaLabel(ar));counts[ar]=(counts[ar]||0)+1;counts.all++;}
    var out=[];
    for(var o=0;o<AREA_ORDER.length;o++){var id=AREA_ORDER[o];if(seen[id]){var m=areaMeta(id,labels[id]);m.count=counts[id]||0;out.push(m);delete seen[id];}}
    for(var id2 in seen)if(Object.prototype.hasOwnProperty.call(seen,id2)){var m2=areaMeta(id2,labels[id2]);m2.count=counts[id2]||0;out.push(m2);}
    return out;
  }
  function hay(c){var f=c.fields||{};var parts=[c.name,c.tag,c.stage,c.size,c.nucleus,c.chromatin,c.cytoplasm,c.diff,c.clues,c.alerts,c.ref,c.area,c.group,f.prompt,f.answer,f.explanation,f.technicalBasis,f.tags,f.conceptId,f.sourceId];return parts.join(' ').toLowerCase();}
  function filteredCards(){
    if(!state.atlas)state.atlas={};
    var area=state.atlas.area||'all';
    var filter=state.atlas.filter||'all';
    var q=text(state.atlas.query).toLowerCase();
    var cards=allCards(), out=[];
    for(var i=0;i<cards.length;i++){
      var c=cards[i];
      var areaOk=area==='all'||c.area===area;
      var filterOk=filter==='all'||c.group===filter||(filter==='atlas_base'&&c.source==='atlas_base');
      var queryOk=!q||hay(c).indexOf(q)>=0;
      if(areaOk&&filterOk&&queryOk)out.push(c);
    }
    return out;
  }
  function cardById(id){var cards=allCards();for(var i=0;i<cards.length;i++)if(cards[i].id===id)return cards[i];return cards[0]||null;}
  function fichaLabel(n){n=Number(n)||0;return n===1?'1 ficha':n+' fichas';}
  function filterLabel(id){for(var i=0;i<FILTERS.length;i++)if(FILTERS[i].id===id)return FILTERS[i].label;return 'Todas';}
  function renderHome(){
    var areas=areaCatalog(), quizCount=bank().length, total=allCards().length;
    var html='<section class="atlas-home-panel"><div class="atlas-home-head"><h2>Atlas sincronizado</h2><p>Biblioteca atualizada automaticamente com todos os conceitos e questões do Banco autoral.</p><span class="atlas-sync-sub">'+esc(quizCount)+' questões do quiz · '+esc(total)+' fichas totais</span></div><div class="atlas-home-grid">';
    for(var i=0;i<areas.length;i++){var a=areas[i];html+='<button class="atlas-area-card" data-atlas-area="'+esc(a.id)+'" type="button"><small>'+esc(a.kicker)+' · '+esc(fichaLabel(a.count))+'</small><b>'+esc(a.label)+'</b><span>'+esc(a.desc)+'</span><span class="atlas-card-action" aria-hidden="true">abrir área</span></button>';}
    return html+'</div></section>';
  }
  function schemaCards(c){
    if(!c)return '<div class="atlas-modal-info"><b>Ficha</b>Item indisponível.</div>';
    if(c.source==='quiz_v23'){
      var f=c.fields||{}, wrong=f.wrongOptions||[], html='';
      html+='<div class="atlas-modal-info"><b>Área / competência</b>'+esc(areaLabel(c.area))+' · '+esc(levelLabel(f.level))+' · '+esc(compLabel(f.competency))+'</div>';
      html+='<div class="atlas-modal-info"><b>Resposta-chave</b>'+esc(f.answer||c.chromatin||'')+'</div>';
      html+='<div class="atlas-modal-info wide"><b>Pergunta-base</b>'+esc(f.prompt||c.stage||'')+'</div>';
      html+='<div class="atlas-modal-info wide"><b>Fundamento técnico</b>'+esc(f.technicalBasis||f.explanation||c.cytoplasm||'')+'</div>';
      if(wrong.length){html+='<div class="atlas-modal-info wide"><b>Distratores / armadilhas</b><ul>';for(var i=0;i<wrong.length;i++)html+='<li>'+esc(wrong[i])+'</li>';html+='</ul></div>';}
      html+='<div class="atlas-modal-info wide"><b>Rastreamento</b>'+esc('ID: '+(f.sourceId||'—')+' · Conceito: '+(f.conceptId||'—')+(f.tags?' · Tags: '+f.tags:''))+'</div>';
      return html;
    }
    var items=[['Tamanho / aspecto',c.size],['Núcleo / estrutura',c.nucleus],['Cromatina / matriz',c.chromatin],['Citoplasma / aparência',c.cytoplasm],['Diferencial',c.diff],['Na bancada',c.clues]];
    var out='';for(var j=0;j<items.length;j++)if(items[j][1])out+='<div class="atlas-modal-info"><b>'+esc(items[j][0])+'</b>'+esc(items[j][1])+'</div>';
    return out||'<div class="atlas-modal-info"><b>Ficha</b>Conteúdo técnico não preenchido para este item.</div>';
  }
  function modal(c){
    if(!state.atlas||!state.atlas.modalOpen||!c)return '';
    var a=areaMeta(c.area||'all'), derived=c.source==='quiz_v23';
    return '<aside class="atlas-modal" data-atlas-modal-backdrop><article class="atlas-modal-card '+(derived?'quiz-derived':'')+'" role="dialog" aria-modal="true" aria-label="Ficha do Atlas"><header class="atlas-modal-head"><div><div class="atlas-modal-kicker"><span>'+esc(a.label)+'</span><span>'+esc(c.tag||'')+'</span></div><h2>'+esc(c.name||'Ficha')+'</h2><p>'+esc(c.stage||'')+'</p></div><button class="atlas-modal-close" data-atlas-modal-close type="button" aria-label="Fechar ficha">×</button></header><div class="atlas-modal-grid area-schema">'+schemaCards(c)+'</div>'+(c.alerts?'<div class="atlas-modal-warning"><b>Cuidado:</b> '+esc(c.alerts)+'</div>':'')+(c.ref?'<div class="atlas-modal-ref"><b>Referência/base:</b> '+esc(c.ref)+'</div>':'')+'<div class="atlas-modal-actions"><button class="btn good" data-atlas-train-area="'+esc(c.area||'all')+'" type="button">Treinar esta área</button><button class="btn" data-atlas-modal-close type="button">Fechar</button></div></article></aside>';
  }
  function renderList(){
    var area=state.atlas.area||'all', meta=areaMeta(area), list=filteredCards(), selected=cardById(state.atlas.selected), found=false;
    for(var i=0;i<list.length;i++)if(selected&&list[i].id===selected.id){found=true;break;}
    if(!found){selected=list[0]||cardById('base_blast')||allCards()[0]||null;if(selected)state.atlas.selected=selected.id;}
    var html='<section class="atlas-library-panel"><div class="atlas-library-top"><button class="atlas-library-back" data-atlas-home type="button">Áreas</button><div class="atlas-library-title"><h2>'+esc(meta.label)+'</h2><p>'+esc(fichaLabel(list.length))+' · sincronizado com Banco autoral</p></div></div><div class="atlas-sync-note"><b>Atlas atualizado:</b> inclui fichas originais do app e uma ficha para cada item/conceito do Banco autoral. Use a busca para localizar tema, resposta, tag.</div><input class="atlas-library-search" id="atlasSearchInput" value="'+esc(state.atlas.query||'')+'" placeholder="Buscar neste atlas..." autocomplete="off" />';
    html+='<div class="atlas-library-filterbar '+(state.atlas.filtersOpen?'':'is-closed')+'"><button class="atlas-library-filter-toggle" data-atlas-toggle-filters type="button">Filtros: '+esc(filterLabel(state.atlas.filter||'all'))+'</button><div class="atlas-library-filtergrid">';
    for(var f=0;f<FILTERS.length;f++){var fil=FILTERS[f];html+='<button class="atlas-chip '+((state.atlas.filter||'all')===fil.id?'active':'')+'" data-atlas-filter="'+esc(fil.id)+'" type="button">'+esc(fil.label)+'</button>';}
    html+='</div></div><div class="atlas-library-list">';
    for(var k=0;k<list.length;k++){var c=list[k], cm=areaMeta(c.area), derived=c.source==='quiz_v23';html+='<button class="atlas-lib-item '+(derived?'quiz-derived ':'')+(selected&&selected.id===c.id?'active':'')+'" data-atlas-cell="'+esc(c.id)+'" type="button"><small>'+esc(cm.label)+' · '+esc(c.tag||'')+'</small><b>'+esc(c.name||'')+'</b><span class="atlas-lib-chevron" aria-hidden="true">›</span><span class="atlas-lib-stage">'+esc(c.stage||'')+'</span></button>';}
    if(!list.length)html+='<div class="atlas-library-empty">Nenhuma ficha encontrada. Ajuste a busca ou o filtro.</div>';
    return html+'</div></section>'+modal(selected);
  }
  function bind(){
    var g=window.grid||document.getElementById('grid');if(!g)return;
    Array.prototype.forEach.call(g.querySelectorAll('[data-atlas-area]'),function(btn){btn.addEventListener('click',function(){window.setAtlasArea(this.getAttribute('data-atlas-area'));});});
    var home=g.querySelector('[data-atlas-home]');if(home)home.addEventListener('click',window.openAtlasHome);
    var tog=g.querySelector('[data-atlas-toggle-filters]');if(tog)tog.addEventListener('click',window.toggleAtlasFilters);
    Array.prototype.forEach.call(g.querySelectorAll('[data-atlas-filter]'),function(btn){btn.addEventListener('click',function(){window.setAtlasFilter(this.getAttribute('data-atlas-filter'));});});
    Array.prototype.forEach.call(g.querySelectorAll('[data-atlas-cell]'),function(btn){btn.addEventListener('click',function(){window.selectAtlasCell427(this.getAttribute('data-atlas-cell'));});});
    var s=g.querySelector('#atlasSearchInput');if(s){s.addEventListener('input',function(){state.atlas.query=this.value||'';var l=filteredCards();if(l.length)state.atlas.selected=l[0].id;state.atlas.modalOpen=false;try{renderKeys();}catch(e){renderAtlasModule();}});}
    Array.prototype.forEach.call(g.querySelectorAll('[data-atlas-modal-close]'),function(btn){btn.addEventListener('click',window.closeAtlasModal);});
    var back=g.querySelector('[data-atlas-modal-backdrop]');if(back)back.addEventListener('click',function(ev){if(ev.target===back)window.closeAtlasModal();});
    var train=g.querySelector('[data-atlas-train-area]');if(train)train.addEventListener('click',function(){window.startTrainingFromAtlas(this.getAttribute('data-atlas-train-area')||'all');});
  }
  window.openAtlasHome=function(){if(!state.atlas)state.atlas={};state.atlas.view='home';state.atlas.modalOpen=false;state.atlas.query='';state.atlas.filtersOpen=false;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  window.setAtlasArea=function(area){if(!state.atlas)state.atlas={};state.atlas.area=area||'all';state.atlas.view='list';state.atlas.modalOpen=false;state.atlas.query='';state.atlas.filtersOpen=false;state.atlas.filter='all';var l=filteredCards();if(l.length)state.atlas.selected=l[0].id;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  window.setAtlasFilter=function(filter){if(!state.atlas)state.atlas={};state.atlas.filter=filter||'all';state.atlas.filtersOpen=false;state.atlas.modalOpen=false;var l=filteredCards();if(l.length)state.atlas.selected=l[0].id;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  window.toggleAtlasFilters=function(){if(!state.atlas)state.atlas={};state.atlas.filtersOpen=!state.atlas.filtersOpen;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  window.closeAtlasModal=function(){if(state.atlas)state.atlas.modalOpen=false;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  window.selectAtlasCell427=function(id){if(!state.atlas)state.atlas={};state.atlas.selected=id;state.atlas.modalOpen=true;try{beep('short');}catch(e){}try{renderKeys();}catch(e){renderAtlasModule();}};
  try{selectAtlasCell=function(id){window.selectAtlasCell427(id);};window.selectAtlasCell=selectAtlasCell;}catch(e){}
  renderAtlasModule=function(){if(!state.atlas)state.atlas={};if(!state.atlas.view)state.atlas.view='home';try{document.body.setAttribute('data-stable-build',BUILD);}catch(e){}var g=window.grid||document.getElementById('grid');if(!g)return;g.className='atlas-screen';g.innerHTML=state.atlas.view==='list'?renderList():renderHome();bind();};
  window.renderAtlasModule=renderAtlasModule;
  window.startTrainingFromAtlas=function(area){
    var ar=area||'all';
    try{if(typeof selectModule==='function')selectModule('training');else{state.mode='training';if(typeof closeHome==='function')closeHome();}}catch(e){state.mode='training';}
    try{if(!state.training)state.training={};state.training.area=ar;state.training.step='filters';state.training.view='menu';state.training.level='all';state.training.competency='all';state.training.mode='study';state.training.size=state.training.size||'10';state.training.session=[];state.training.index=0;state.training.responses={};state.training.history=[];}catch(e){}
    try{render();}catch(e2){try{renderTrainingModule();}catch(_e){}}
  };
  function polish(){try{var c=document.querySelector('.home-option.atlas');if(!c)return;var small=c.querySelector('small'),b=c.querySelector('b'),span=c.querySelector('span');if(small)small.textContent='Atlas';if(b)b.textContent='Atlas v23';if(span)span.textContent='Sincronizado com todo o banco do quiz.';}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish);else polish();window.addEventListener('load',polish);
  try{window.NYX_ATLAS_QUIZ_SYNC_427={build:BUILD,quizQuestions:bank().length,totalCards:allCards().length,areas:areaCatalog().length};}catch(e){}
})();

