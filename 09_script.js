
(function(){
  'use strict';
  var BUILD_422 = 'v4.22-quiz-touch-scroll-fix';
  var startY = 0, startX = 0, startTop = 0, scrollEl = null, dragging = false, suppressClickUntil = 0;

  function installStyle422(){
    if (document.getElementById('nyx-v422-style')) return;
    var style = document.createElement('style');
    style.id = 'nyx-v422-style';
    style.textContent = [
      'html.nyx-quiz-touch-scroll-422,body.nyx-quiz-touch-scroll-422{height:100% !important;overflow:hidden !important;touch-action:pan-y !important;overscroll-behavior:none !important;}',
      'body.nyx-quiz-touch-scroll-422 .app{display:grid !important;grid-template-rows:auto minmax(0,1fr) !important;width:100vw !important;height:100dvh !important;min-height:100dvh !important;max-height:100dvh !important;overflow:hidden !important;touch-action:pan-y !important;}',
      'body.nyx-quiz-touch-scroll-422 .hud{position:relative !important;z-index:20 !important;overflow:hidden !important;}',
      'body.nyx-quiz-touch-scroll-422 .keys,body.nyx-quiz-touch-scroll-422 .keys.nyx-quiz-scroll-hard{display:block !important;min-height:0 !important;height:100% !important;max-height:100% !important;overflow-y:auto !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;overscroll-behavior-y:contain !important;padding:8px !important;padding-bottom:calc(44px + env(safe-area-inset-bottom)) !important;}',
      'body.nyx-quiz-touch-scroll-422 #grid,body.nyx-quiz-touch-scroll-422 #grid.training-screen,body.nyx-quiz-touch-scroll-422 #grid.quiz-screen-v413,body.nyx-quiz-touch-scroll-422 #grid.quiz-report-v413,body.nyx-quiz-touch-scroll-422 #grid.quiz-menu-v413-wrap{display:block !important;width:100% !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;grid-template-columns:none !important;grid-template-rows:none !important;grid-auto-rows:auto !important;align-content:start !important;padding:0 0 calc(48px + env(safe-area-inset-bottom)) !important;touch-action:pan-y !important;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-menu-v413,body.nyx-quiz-touch-scroll-422 .quiz-layout-v413,body.nyx-quiz-touch-scroll-422 .quiz-report-list-v413{display:grid !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;align-content:start !important;touch-action:pan-y !important;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-layout-v413{grid-template-rows:auto auto auto !important;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-question-v413,body.nyx-quiz-touch-scroll-422 .quiz-report-card-v413,body.nyx-quiz-touch-scroll-422 .quiz-panel-v413,body.nyx-quiz-touch-scroll-422 .quiz-area-card-v413{height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;touch-action:pan-y !important;}',
      'body.nyx-quiz-touch-scroll-422 #grid button,body.nyx-quiz-touch-scroll-422 #grid .btn,body.nyx-quiz-touch-scroll-422 #grid .quiz-chip-v413,body.nyx-quiz-touch-scroll-422 #grid .quiz-option-v413,body.nyx-quiz-touch-scroll-422 #grid .quiz-area-card-v413{touch-action:pan-y !important;-ms-touch-action:pan-y !important;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-chip-row-v413{overflow-x:auto !important;overflow-y:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-x pan-y !important;scrollbar-width:none;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-chip-row-v413::-webkit-scrollbar{display:none;}',
      'body.nyx-quiz-touch-scroll-422 .quiz-menu-v413-wrap .quiz-hero-v413,body.nyx-quiz-touch-scroll-422 .quiz-menu-v413-wrap .quiz-qa-panel-v414{display:none !important;}',
      'body.nyx-quiz-touch-scroll-422 .nyx-scroll-sentinel-422{height:1px;width:100%;pointer-events:none;}'
    ].join('');
    document.head.appendChild(style);
  }

  function active422(){
    try { return !!(window.state && state.mode === 'training'); } catch(e) { return false; }
  }

  function getGrid422(){ return document.getElementById('grid'); }
  function getKeys422(){ return document.querySelector('.keys'); }

  function maxScroll422(el){
    if (!el) return 0;
    return Math.max(0, (el.scrollHeight || 0) - (el.clientHeight || 0));
  }

  function ensureScrollable422(){
    var keys = getKeys422();
    var grid = getGrid422();
    if (!keys || !grid) return;
    keys.classList.remove('nyx-quiz-scroll-hard');
    var app = document.querySelector('.app');
    if (app) app.classList.remove('nyx-quiz-page-scroll');
    if (grid.className.indexOf('quiz-menu-v413-wrap') === -1 && window.state && state.training && state.training.view === 'menu') {
      grid.className += ' quiz-menu-v413-wrap';
    }
    var hero = grid.querySelector('.quiz-hero-v413');
    if (hero && hero.parentNode) hero.parentNode.removeChild(hero);
    var qa = grid.querySelectorAll('.quiz-qa-panel-v414');
    for (var i=0;i<qa.length;i++) if (qa[i] && qa[i].parentNode) qa[i].parentNode.removeChild(qa[i]);
    if (!grid.querySelector('.nyx-scroll-sentinel-422')) {
      var sentinel = document.createElement('div');
      sentinel.className = 'nyx-scroll-sentinel-422';
      grid.appendChild(sentinel);
    }
  }

  function apply422(){
    try {
      installStyle422();
      var on = active422();
      document.documentElement.classList.toggle('nyx-quiz-touch-scroll-422', on);
      document.body.classList.toggle('nyx-quiz-touch-scroll-422', on);
      if (on) {
        document.body.setAttribute('data-stable-build', BUILD_422);
        ensureScrollable422();
      }
    } catch(e) {}
  }

  function insideQuiz422(target){
    if (!active422()) return false;
    var grid = getGrid422();
    if (!grid || !target) return false;
    return target === grid || (grid.contains && grid.contains(target));
  }

  function installTouchFallback422(){
    if (window.__nyxQuizTouchScroll422) return;
    window.__nyxQuizTouchScroll422 = true;

    document.addEventListener('touchstart', function(ev){
      try {
        if (!insideQuiz422(ev.target) || !ev.touches || ev.touches.length !== 1) return;
        apply422();
        scrollEl = getKeys422();
        if (!scrollEl) return;
        startY = ev.touches[0].clientY;
        startX = ev.touches[0].clientX;
        startTop = scrollEl.scrollTop || 0;
        dragging = false;
      } catch(e) {}
    }, {passive:true, capture:true});

    document.addEventListener('touchmove', function(ev){
      try {
        if (!scrollEl || !insideQuiz422(ev.target) || !ev.touches || ev.touches.length !== 1) return;
        var y = ev.touches[0].clientY, x = ev.touches[0].clientX;
        var dy = y - startY, dx = x - startX;
        if (Math.abs(dy) < 4 || Math.abs(dy) < Math.abs(dx)) return;
        var max = maxScroll422(scrollEl);
        var next = startTop - dy;
        if (next < 0) next = 0;
        if (next > max) next = max;
        scrollEl.scrollTop = next;
        dragging = true;
        suppressClickUntil = Date.now() + 220;
        ev.preventDefault();
        ev.stopPropagation();
      } catch(e) {}
    }, {passive:false, capture:true});

    document.addEventListener('touchend', function(){
      scrollEl = null;
      startY = startX = startTop = 0;
      setTimeout(function(){ dragging = false; }, 120);
    }, {passive:true, capture:true});

    document.addEventListener('click', function(ev){
      try {
        if (insideQuiz422(ev.target) && Date.now() < suppressClickUntil) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      } catch(e) {}
    }, true);
  }

  function wrap422(){
    try {
      if (typeof window.render === 'function' && !window.render.__nyxV422Wrapped) {
        var oldRender = window.render;
        var newRender = function(){
          oldRender();
          apply422();
        };
        newRender.__nyxV422Wrapped = true;
        window.render = newRender;
        try { render = newRender; } catch(e) {}
      }
    } catch(e) {}

    try {
      if (typeof window.renderTrainingModule === 'function' && !window.renderTrainingModule.__nyxV422Wrapped) {
        var oldTraining = window.renderTrainingModule;
        var newTraining = function(){
          oldTraining();
          apply422();
        };
        newTraining.__nyxV422Wrapped = true;
        window.renderTrainingModule = newTraining;
        try { renderTrainingModule = newTraining; } catch(e) {}
      }
    } catch(e) {}
  }

  installStyle422();
  installTouchFallback422();
  wrap422();
  apply422();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ wrap422(); apply422(); });
  } else {
    setTimeout(function(){ wrap422(); apply422(); }, 0);
  }
  window.addEventListener('load', function(){ wrap422(); apply422(); setTimeout(apply422, 200); setTimeout(apply422, 800); });
  window.addEventListener('resize', function(){ setTimeout(apply422, 50); });
})();

