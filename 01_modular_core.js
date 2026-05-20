
(function (w, d) {
  'use strict';
  var VERSION = 'v5.00-modular-core';
  var registry = Object.create(null);
  var listeners = Object.create(null);
  var current = null;

  function emit(type, payload) {
    (listeners[type] || []).slice().forEach(function (fn) {
      try { fn(payload || {}); } catch (e) { console.warn('NYXCore listener failed:', type, e); }
    });
  }

  function on(type, fn) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
    return function off() {
      listeners[type] = (listeners[type] || []).filter(function (x) { return x !== fn; });
    };
  }

  function registerModule(def) {
    if (!def || !def.id) throw new Error('NYXCore.registerModule requer um id.');
    registry[def.id] = Object.assign({ version: VERSION, category: 'misc', legacyMode: def.id }, def);
    emit('module:registered', registry[def.id]);
    return registry[def.id];
  }

  function listModules() {
    return Object.keys(registry).map(function (k) { return registry[k]; });
  }

  function getModule(id) { return registry[id] || null; }

  function storage(ns) {
    var prefix = 'nyx.' + (ns || 'core') + '.';
    return {
      get: function (key, fallback) {
        try {
          var raw = w.localStorage.getItem(prefix + key);
          return raw == null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
      },
      set: function (key, value) {
        try { w.localStorage.setItem(prefix + key, JSON.stringify(value)); } catch (e) {}
      },
      remove: function (key) {
        try { w.localStorage.removeItem(prefix + key); } catch (e) {}
      }
    };
  }

  function openModule(id, options) {
    var mod = getModule(id);
    if (!mod) {
      console.warn('NYXCore.openModule: módulo não registrado:', id);
      return false;
    }
    emit('module:before-open', { id: id, module: mod, previous: current });
    if (current && current !== id) {
      var prev = getModule(current);
      if (prev && typeof prev.destroy === 'function') {
        try { prev.destroy(); } catch (e) { console.warn('NYXCore destroy failed:', current, e); }
      }
    }
    current = id;
    if (typeof mod.mount === 'function') {
      try { mod.mount(options || {}); } catch (e) { console.error('NYXCore mount failed:', id, e); return false; }
    } else if (mod.legacyMode && typeof w.selectModule === 'function') {
      w.selectModule(mod.legacyMode);
    }
    emit('module:opened', { id: id, module: mod });
    return true;
  }

  w.NYXCore = w.NYXCore || {
    version: VERSION,
    registerModule: registerModule,
    openModule: openModule,
    getModule: getModule,
    listModules: listModules,
    storage: storage,
    on: on,
    emit: emit,
    data: {}
  };
  w.NYX = w.NYXCore;
  try { d.documentElement.setAttribute('data-nyx-core', VERSION); } catch (e) {}
})(window, document);

