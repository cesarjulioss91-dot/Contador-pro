
(function (w, d) {
  'use strict';
  var core = w.NYXCore;
  if (!core) return;

  var modules = [
    { id: 'hemato', title: 'Diferencial hematológico', category: 'counter', legacyMode: 'hemato', storageKey: 'nyx.counter.hemato' },
    { id: 'myelo', title: 'Mielograma', category: 'counter', legacyMode: 'myelo', storageKey: 'nyx.counter.myelo' },
    { id: 'urine', title: 'Sedimento urinário', category: 'counter', legacyMode: 'urine', storageKey: 'nyx.counter.urine' },
    { id: 'colonies', title: 'Contador de colônias', category: 'counter', legacyMode: 'colonies', storageKey: 'nyx.counter.colonies' },
    { id: 'fluids', title: 'Líquidos biológicos', category: 'counter', legacyMode: 'fluids', storageKey: 'nyx.counter.fluids' },
    { id: 'reticulocytes', title: 'Reticulócitos', category: 'counter', legacyMode: 'reticulocytes', storageKey: 'nyx.counter.reticulocytes' },
    { id: 'baar', title: 'BAAR', category: 'counter', legacyMode: 'baar', storageKey: 'nyx.counter.baar' },
    { id: 'semen', title: 'Espermograma', category: 'counter', legacyMode: 'semen', storageKey: 'nyx.counter.semen' },
    { id: 'timer', title: 'Timer', category: 'tool', legacyMode: 'timer', storageKey: 'nyx.timer' },
    { id: 'calc', title: 'Calculadoras', category: 'tool', legacyMode: 'calc', storageKey: 'nyx.calc' },
    { id: 'training', title: 'Banco autoral', category: 'learning', legacyMode: 'training', storageKey: 'nyx.quiz.autoral.1650' },
    { id: 'atlas', title: 'Atlas sincronizado', category: 'learning', legacyMode: 'atlas', storageKey: 'nyx.atlas' },
    { id: 'manual', title: 'Manual', category: 'help', legacyMode: 'manual', storageKey: 'nyx.manual' }
  ];

  modules.forEach(function (mod) {
    core.registerModule({
      id: mod.id,
      title: mod.title,
      category: mod.category,
      legacyMode: mod.legacyMode,
      storageKey: mod.storageKey,
      mount: function () {
        if (typeof w.selectModule === 'function') {
          w.selectModule(mod.legacyMode);
        } else {
          console.warn('selectModule ainda não está disponível para', mod.id);
        }
      },
      destroy: function () {}
    });
  });

  // Converte cliques da home para o roteador modular sem quebrar o handler legado.
  function wireHomeButtons() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-home-mode]'), function (btn) {
      if (btn.__nyxModularWired) return;
      btn.__nyxModularWired = true;
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-home-mode');
        if (id && core.getModule(id)) core.emit('home:module-click', { id: id });
      }, { passive: true });
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', wireHomeButtons);
  else wireHomeButtons();
  w.addEventListener('load', wireHomeButtons);

  w.NYX_MODULE_MANIFEST = modules;
})(window, document);

