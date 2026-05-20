
(function(){
  var BUILD_418='v4.18-quiz-scroll-hard-fix';
  function installStyle418(){
    if(document.getElementById('nyx-v418-style')) return;
    var style=document.createElement('style');
    style.id='nyx-v418-style';
    style.textContent=[
      'body[data-stable-build*="v4.18"] .keys.nyx-quiz-scroll-hard{overflow-y:auto !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;overscroll-behavior:contain;padding-bottom:max(18px, env(safe-area-inset-bottom)) !important;}',
      'body[data-stable-build*="v4.18"] .keys.nyx-quiz-scroll-hard>#grid{display:block !important;height:auto !important;min-height:100% !important;max-height:none !important;overflow:visible !important;grid-template-columns:none !important;grid-auto-rows:auto !important;}',
      'body[data-stable-build*="v4.18"] #grid.training-screen{display:block !important;height:auto !important;min-height:100% !important;max-height:none !important;overflow:visible !important;padding:2px 0 24px !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;}',
      'body[data-stable-build*="v4.18"] .quiz-menu-v413,body[data-stable-build*="v4.18"] .quiz-layout-v413,body[data-stable-build*="v4.18"] .quiz-report-list-v413{height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;align-content:start !important;}',
      'body[data-stable-build*="v4.18"] .quiz-layout-v413{grid-template-rows:auto auto auto !important;padding-bottom:18px !important;}',
      'body[data-stable-build*="v4.18"] .quiz-report-v413 .quiz-menu-v413{display:grid !important;gap:10px !important;padding-bottom:max(26px, env(safe-area-inset-bottom)) !important;}',
      'body[data-stable-build*="v4.18"] .quiz-screen-v413 .quiz-question-v413,body[data-stable-build*="v4.18"] .quiz-report-card-v413{overflow:visible !important;}',
      'body[data-stable-build*="v4.18"] .quiz-menu-v413-wrap .quiz-hero-v413,body[data-stable-build*="v4.18"] .quiz-menu-v413-wrap .quiz-qa-panel-v414{display:none !important;}',
      'body[data-stable-build*="v4.18"] .quiz-menu-v413-wrap .quiz-panel-v413:first-child{margin-top:0 !important;}',
      '@media (max-width:430px){body[data-stable-build*="v4.18"] .quiz-chip-row-v413{-webkit-overflow-scrolling:touch;scrollbar-width:none;overflow-x:auto;}body[data-stable-build*="v4.18"] .quiz-chip-row-v413::-webkit-scrollbar{display:none;}}'
    ].join('');
    document.head.appendChild(style);
  }
  function keysNode418(){
    var grid=document.getElementById('grid');
    return grid && grid.parentNode && grid.parentNode.classList ? grid.parentNode : null;
  }
  function removeMenuClutter418(grid){
    if(!grid || !window.state || !state.training || state.training.view!=='menu') return;
    if(grid.className.indexOf('quiz-menu-v413-wrap')===-1) grid.className += ' quiz-menu-v413-wrap';
    var removable=grid.querySelectorAll('.quiz-hero-v413,.quiz-qa-panel-v414');
    for(var i=0;i<removable.length;i++){
      if(removable[i] && removable[i].parentNode) removable[i].parentNode.removeChild(removable[i]);
    }
    var menu=grid.querySelector('.quiz-menu-v413');
    if(menu){
      var panels=menu.querySelectorAll('.quiz-panel-v413');
      for(var p=0;p<panels.length;p++){
        if(/Auditoria|QA global|Total auditado|Bloqueios críticos/i.test(panels[p].textContent||'')){
          if(panels[p].parentNode) panels[p].parentNode.removeChild(panels[p]);
        }
      }
      var firstPanel=menu.querySelector('.quiz-panel-v413');
      if(firstPanel){
        var title=firstPanel.querySelector('p');
        if(title && /Filtros/i.test(title.textContent||'')) title.innerHTML='<b>Filtros do quiz</b>';
      }
    }
  }
  function apply418(){
    try{
      installStyle418();
      document.body.setAttribute('data-stable-build',BUILD_418);
      var grid=document.getElementById('grid');
      var keys=keysNode418();
      if(keys){
        if(window.state && state.mode==='training') keys.classList.add('nyx-quiz-scroll-hard');
        else keys.classList.remove('nyx-quiz-scroll-hard');
      }
      if(!grid || !window.state || state.mode!=='training') return;
      removeMenuClutter418(grid);
      if(state.training && (state.training.view==='quiz' || state.training.view==='report' || state.training.view==='menu')){
        grid.style.height='auto';
        grid.style.minHeight='100%';
        grid.style.maxHeight='none';
        grid.style.overflow='visible';
      }
    }catch(e){}
  }
  function wrapRender418(){
    try{
      if(typeof render !== 'function' || render.__nyxV418Wrapped) return;
      var previousRender=render;
      var wrappedRender=function(){ previousRender(); apply418(); };
      wrappedRender.__nyxV418Wrapped=true;
      render=wrappedRender;
      window.render=wrappedRender;
    }catch(e){}
    try{
      if(typeof renderTrainingModule !== 'function' || renderTrainingModule.__nyxV418Wrapped) return;
      var previousTraining=renderTrainingModule;
      var wrappedTraining=function(){ previousTraining(); apply418(); };
      wrappedTraining.__nyxV418Wrapped=true;
      renderTrainingModule=wrappedTraining;
      window.renderTrainingModule=wrappedTraining;
    }catch(e){}
  }
  wrapRender418();
  window.addEventListener('load',function(){wrapRender418();setTimeout(apply418,0);setTimeout(apply418,250);setTimeout(apply418,800);});
  setTimeout(function(){wrapRender418();apply418();},0);
  setTimeout(function(){wrapRender418();apply418();},500);
})();

