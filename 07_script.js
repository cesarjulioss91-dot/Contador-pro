
(function(){
  var BUILD_419='v4.19-quiz-page-scroll-fix';
  function installStyle419(){
    if(document.getElementById('nyx-v419-style')) return;
    var style=document.createElement('style');
    style.id='nyx-v419-style';
    style.textContent=[
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll{display:block !important;height:100dvh !important;max-height:100dvh !important;min-height:100dvh !important;overflow-y:auto !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;overscroll-behavior-y:contain !important;padding-bottom:max(10px, env(safe-area-inset-bottom)) !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .hud{margin-bottom:8px !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .keys{display:block !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;padding:8px !important;padding-bottom:calc(32px + env(safe-area-inset-bottom)) !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll #grid{display:block !important;width:100% !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;grid-template-columns:none !important;grid-template-rows:none !important;grid-auto-rows:auto !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll #grid.training-screen,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll #grid.quiz-screen-v413,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll #grid.quiz-report-v413{display:block !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;padding:0 0 34px !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-menu-v413,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-layout-v413,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-report-list-v413{display:grid !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;align-content:start !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-layout-v413{grid-template-rows:auto auto auto !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-question-v413,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-report-card-v413{height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;}',
      'body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-menu-v413-wrap .quiz-hero-v413,body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-menu-v413-wrap .quiz-qa-panel-v414{display:none !important;}',
      '@media (max-width:430px){body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-chip-row-v413{overflow-x:auto !important;-webkit-overflow-scrolling:touch;scrollbar-width:none;}body[data-stable-build*="v4.19"] .app.nyx-quiz-page-scroll .quiz-chip-row-v413::-webkit-scrollbar{display:none;}}'
    ].join('');
    document.head.appendChild(style);
  }
  function removeClutter419(grid){
    if(!grid || !window.state || !state.training || state.training.view!=='menu') return;
    if(grid.className.indexOf('quiz-menu-v413-wrap')===-1) grid.className += ' quiz-menu-v413-wrap';
    var kill=grid.querySelectorAll('.quiz-hero-v413,.quiz-qa-panel-v414');
    for(var i=0;i<kill.length;i++) if(kill[i] && kill[i].parentNode) kill[i].parentNode.removeChild(kill[i]);
    var panels=grid.querySelectorAll('.quiz-panel-v413');
    for(var p=0;p<panels.length;p++){
      if(/Auditoria|QA global|Total auditado|Bloqueios críticos|IDS únicos|Conceitos únicos/i.test(panels[p].textContent||'')){
        if(panels[p].parentNode) panels[p].parentNode.removeChild(panels[p]);
      }
    }
  }
  function apply419(){
    try{
      installStyle419();
      document.body.setAttribute('data-stable-build',BUILD_419);
      var app=document.querySelector('.app');
      var grid=document.getElementById('grid');
      var isTraining=!!(window.state && state.mode==='training');
      if(app){
        if(isTraining) app.classList.add('nyx-quiz-page-scroll');
        else app.classList.remove('nyx-quiz-page-scroll');
      }
      if(!isTraining || !grid) return;
      removeClutter419(grid);
      grid.style.height='auto';
      grid.style.minHeight='0';
      grid.style.maxHeight='none';
      grid.style.overflow='visible';
    }catch(e){}
  }
  function wrap419(){
    try{
      if(typeof render==='function' && !render.__nyxV419Wrapped){
        var oldRender=render;
        var newRender=function(){ oldRender(); apply419(); };
        newRender.__nyxV419Wrapped=true;
        render=newRender;
        window.render=newRender;
      }
    }catch(e){}
    try{
      if(typeof renderTrainingModule==='function' && !renderTrainingModule.__nyxV419Wrapped){
        var oldTraining=renderTrainingModule;
        var newTraining=function(){ oldTraining(); apply419(); };
        newTraining.__nyxV419Wrapped=true;
        renderTrainingModule=newTraining;
        window.renderTrainingModule=newTraining;
      }
    }catch(e){}
  }
  wrap419();
  window.addEventListener('load',function(){wrap419();setTimeout(apply419,0);setTimeout(apply419,200);setTimeout(apply419,800);});
  window.addEventListener('resize',function(){setTimeout(apply419,50);});
  setTimeout(function(){wrap419();apply419();},0);
  setTimeout(function(){wrap419();apply419();},500);
})();

