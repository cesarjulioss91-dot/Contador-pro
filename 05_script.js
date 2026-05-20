
(function(){
  var BUILD_417 = 'v4.17-quiz-menu-declutter-fix';
  function installStyle417(){
    if (document.getElementById('nyx-v417-style')) return;
    var style=document.createElement('style');
    style.id='nyx-v417-style';
    style.textContent=[
      'body[data-stable-build*="v4.17"] .training-screen.quiz-menu-v413-wrap{display:block !important;overflow-y:auto !important;overflow-x:hidden !important;height:100% !important;min-height:0 !important;padding:2px 0 max(18px, env(safe-area-inset-bottom)) !important;-webkit-overflow-scrolling:touch;touch-action:pan-y;align-content:normal !important;}',
      'body[data-stable-build*="v4.17"] .quiz-menu-v413{display:grid !important;gap:10px !important;min-height:auto !important;align-content:start !important;padding-bottom:max(20px, env(safe-area-inset-bottom)) !important;}',
      'body[data-stable-build*="v4.17"] .quiz-hero-v413, body[data-stable-build*="v4.17"] .quiz-qa-panel-v414{display:none !important;}',
      'body[data-stable-build*="v4.17"] .quiz-panel-v413:first-child{margin-top:0 !important;}',
      'body[data-stable-build*="v4.17"] .quiz-area-card-v413{scroll-margin-top:8px;}',
      '@media (max-width:430px){body[data-stable-build*="v4.17"] .quiz-chip-row-v413{-webkit-overflow-scrolling:touch;scrollbar-width:none;} body[data-stable-build*="v4.17"] .quiz-chip-row-v413::-webkit-scrollbar{display:none;}}'
    ].join('');
    document.head.appendChild(style);
  }
  function apply417(){
    try{
      installStyle417();
      document.body.setAttribute('data-stable-build', BUILD_417);
      var grid=document.getElementById('grid');
      if(!grid || !window.state || !state.training) return;
      if(state.training.view==='menu'){
        if(grid.className.indexOf('training-screen')===-1) return;
        if(grid.className.indexOf('quiz-menu-v413-wrap')===-1) grid.className += ' quiz-menu-v413-wrap';
        var removable=grid.querySelectorAll('.quiz-hero-v413, .quiz-qa-panel-v414');
        for(var i=0;i<removable.length;i++) if(removable[i] && removable[i].parentNode) removable[i].parentNode.removeChild(removable[i]);
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
    }catch(e){}
  }
  function wrapRender417(){
    try{
      if(typeof renderTrainingModule !== 'function' || renderTrainingModule.__nyxV417Wrapped) return;
      var previous=renderTrainingModule;
      var wrapped=function(){ previous(); apply417(); };
      wrapped.__nyxV417Wrapped=true;
      renderTrainingModule=wrapped;
      window.renderTrainingModule=wrapped;
    }catch(e){}
  }
  wrapRender417();
  window.addEventListener('load',function(){wrapRender417();setTimeout(apply417,0);setTimeout(apply417,250);});
  setTimeout(function(){wrapRender417();apply417();},0);
  setTimeout(function(){wrapRender417();apply417();},500);
})();

