
(function(){
  try {
    var style = document.createElement('style');
    style.textContent = [
      'body[data-stable-build*="v4.16"] .training-screen.quiz-menu-v413-wrap{display:block !important;overflow-y:auto !important;overflow-x:hidden !important;height:100% !important;min-height:0 !important;padding:2px 0 12px !important;-webkit-overflow-scrolling:touch;touch-action:pan-y;align-content:normal !important;}',
      'body[data-stable-build*="v4.16"] .quiz-menu-v413{display:grid;gap:10px;min-height:auto !important;align-content:start;padding-bottom:max(18px, env(safe-area-inset-bottom));}',
      'body[data-stable-build*="v4.16"] .quiz-panel-v413, body[data-stable-build*="v4.16"] .quiz-area-card-v413, body[data-stable-build*="v4.16"] .quiz-report-card-v413{scroll-margin-top:8px;}',
      'body[data-stable-build*="v4.16"] .quiz-qa-panel-v414{margin-top:0;}',
      '@media (max-width:430px){body[data-stable-build*="v4.16"] .quiz-chip-row-v413{-webkit-overflow-scrolling:touch;scrollbar-width:none;} body[data-stable-build*="v4.16"] .quiz-chip-row-v413::-webkit-scrollbar{display:none;}}'
    ].join('');
    document.head.appendChild(style);

    function apply416MenuFix(){
      try {
        document.body.setAttribute('data-stable-build', 'v4.16-quiz-menu-scroll-fix');
        var grid = document.getElementById('grid');
        if (!grid || !window.state || !state.training) return;
        if (state.training.view === 'menu') {
          if (grid.className.indexOf('training-screen') === -1) return;
          if (grid.className.indexOf('quiz-menu-v413-wrap') === -1) grid.className += ' quiz-menu-v413-wrap';
          var hero = grid.querySelector('.quiz-hero-v413');
          if (hero && hero.parentNode) hero.parentNode.removeChild(hero);
          var panel = grid.querySelector('.quiz-panel-v413');
          if (panel) {
            var p = panel.querySelector('p b');
            if (p && /Filtros/i.test(p.textContent)) {
              var host = panel.querySelector('p');
              if (host) host.innerHTML = '<b>Filtros do quiz</b>';
            }
          }
        }
      } catch(e) {}
    }

    var prevRenderTraining416 = window.renderTrainingModule;
    if (typeof prevRenderTraining416 === 'function') {
      window.renderTrainingModule = function(){
        prevRenderTraining416();
        apply416MenuFix();
      };
    }
    window.addEventListener('load', function(){ setTimeout(apply416MenuFix, 0); });
    setTimeout(apply416MenuFix, 0);
  } catch(e) {}
})();

