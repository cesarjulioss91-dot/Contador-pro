
(function(){
  'use strict';
  var BUILD_420 = 'v4.20-quiz-structural-scroll-fix';

  function installStyle420() {
    if (document.getElementById('nyx-v420-style')) return;
    var style = document.createElement('style');
    style.id = 'nyx-v420-style';
    style.textContent = [
      /* Reset de classes órfãs de v4.18 e v4.19 quando v4.20 está ativo */
      'body[data-stable-build*="v4.20"] .keys.nyx-quiz-scroll-hard{overflow:initial !important;touch-action:initial !important;}',
      'body[data-stable-build*="v4.20"] .app.nyx-quiz-page-scroll{display:grid !important;overflow:hidden !important;touch-action:manipulation !important;}',

      /* touch-action:pan-y no body — correção da causa raiz no Android/Chrome */
      'body.nyx-quiz-body-420{touch-action:pan-y !important;}',

      /* .app: mantém display:grid para que o HUD NÃO role junto com o conteúdo */
      'body.nyx-quiz-body-420 .app{display:grid !important;overflow:hidden !important;touch-action:pan-y !important;}',

      /* .keys: é o container de scroll correto — ocupa o 1fr restante do grid de .app */
      'body.nyx-quiz-body-420 .keys{display:block !important;height:100% !important;min-height:0 !important;max-height:100% !important;overflow-y:auto !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;overscroll-behavior-y:contain !important;padding:6px !important;padding-bottom:max(24px,env(safe-area-inset-bottom)) !important;scrollbar-width:thin !important;}',

      /* #grid: sem restrições de altura, cresce conforme conteúdo */
      'body.nyx-quiz-body-420 #grid{display:block !important;width:100% !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;grid-template-columns:none !important;grid-template-rows:none !important;padding:0 !important;}',

      /* training-screen e variantes: sem altura fixada */
      'body.nyx-quiz-body-420 #grid.training-screen,body.nyx-quiz-body-420 #grid.quiz-screen-v413,body.nyx-quiz-body-420 #grid.quiz-report-v413,body.nyx-quiz-body-420 #grid.quiz-menu-v413-wrap{display:block !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;padding-bottom:max(16px,env(safe-area-inset-bottom)) !important;}',

      /* Seções internas do quiz: sem overflow que prende conteúdo */
      'body.nyx-quiz-body-420 .quiz-menu-v413,body.nyx-quiz-body-420 .quiz-layout-v413,body.nyx-quiz-body-420 .quiz-report-list-v413{display:grid !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;align-content:start !important;}',
      'body.nyx-quiz-body-420 .quiz-layout-v413{grid-template-rows:auto auto auto !important;padding-bottom:16px !important;}',
      'body.nyx-quiz-body-420 .quiz-question-v413,body.nyx-quiz-body-420 .quiz-report-card-v413{height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;}',

      /* Suprime quiz-hero-v413 e quiz-qa-panel-v414 via CSS puro — elimina o ciclo render→postProcess→removeClutter */
      'body.nyx-quiz-body-420 .quiz-menu-v413-wrap .quiz-hero-v413,body.nyx-quiz-body-420 .quiz-menu-v413-wrap .quiz-qa-panel-v414{display:none !important;}',

      /* Chip row horizontal em telas estreitas */
      '@media (max-width:430px){body.nyx-quiz-body-420 .quiz-chip-row-v413{overflow-x:auto !important;-webkit-overflow-scrolling:touch;scrollbar-width:none;}body.nyx-quiz-body-420 .quiz-chip-row-v413::-webkit-scrollbar{display:none;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function apply420() {
    try {
      installStyle420();
      document.body.setAttribute('data-stable-build', BUILD_420);

      var isTraining = !!(window.state && state.mode === 'training');

      if (isTraining) {
        document.body.classList.add('nyx-quiz-body-420');
      } else {
        document.body.classList.remove('nyx-quiz-body-420');
        return;
      }

      /* Remove classes conflitantes de versões anteriores */
      var keysEl = document.querySelector('.keys');
      if (keysEl) keysEl.classList.remove('nyx-quiz-scroll-hard');

      var appEl = document.querySelector('.app');
      if (appEl) appEl.classList.remove('nyx-quiz-page-scroll');

      /* Garante quiz-menu-v413-wrap no menu */
      var grid = document.getElementById('grid');
      if (grid && window.state && state.training && state.training.view === 'menu') {
        if (grid.className.indexOf('quiz-menu-v413-wrap') === -1) {
          grid.className += ' quiz-menu-v413-wrap';
        }
      }

      /* Reseta scroll do .keys para o topo ao trocar de view */
      if (keysEl && typeof keysEl.scrollTop === 'number') {
        keysEl.scrollTop = 0;
      }

    } catch(e) {}
  }

  /* Envolve renderTrainingModule UMA única vez — sem re-wrap em loop */
  function wrap420() {
    try {
      if (typeof renderTrainingModule !== 'function') return;
      if (renderTrainingModule.__nyxV420Wrapped) return;
      var prev = renderTrainingModule;
      var wrapped = function() { prev(); apply420(); };
      wrapped.__nyxV420Wrapped = true;
      renderTrainingModule = wrapped;
      window.renderTrainingModule = wrapped;
    } catch(e) {}
  }

  installStyle420();
  wrap420();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { wrap420(); apply420(); });
  } else {
    apply420();
  }
  window.addEventListener('load', function() { wrap420(); apply420(); });

})();

