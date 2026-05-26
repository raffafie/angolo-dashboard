/* ================================================================
   filters.js — State manager condiviso per filtri dashboard
   ================================================================

   Sincronizza i select #f-cdc, #f-anno, #f-mese tra tutte le pagine
   usando localStorage. Quando l'utente cambia un filtro in una pagina,
   il valore persiste e viene applicato nella pagina successiva.

   USO automatico: basta includere questo script in <head> dopo data.js
   e prima di nav.js. I select esistenti vengono auto-collegati.

   API esposta: window.DashboardFilters.{get,set,subscribe}
   ================================================================ */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'dashboard_filters_v1';
  const FILTER_IDS  = ['f-cdc', 'f-anno', 'f-mese', 'f-tipo'];

  // Default state
  const DEFAULTS = {
    'f-cdc':  'all',
    'f-anno': '2025',
    'f-mese': 'all',
    'f-tipo': 'all',
  };

  // ── State store ─────────────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    } catch (e) { return { ...DEFAULTS }; }
  }

  function save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* localStorage quota? ignore */ }
  }

  const subscribers = [];
  function notify(key, value, state) {
    subscribers.forEach(fn => { try { fn(key, value, state); } catch (e) {} });
  }

  // ── Public API ──────────────────────────────────────────────────
  const state = load();

  const Filters = {
    get(key) { return state[key]; },
    getAll() { return { ...state }; },
    set(key, value) {
      if (state[key] === value) return;
      state[key] = value;
      save(state);
      notify(key, value, state);
      // Aggiorna il select corrispondente se presente nella pagina
      const el = document.getElementById(key);
      if (el && el.value !== value) {
        el.value = value;
        // Trigger change event per consentire al codice esistente di reagire
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    subscribe(fn) { subscribers.push(fn); return () => {
      const i = subscribers.indexOf(fn); if (i >= 0) subscribers.splice(i, 1);
    }; },
    reset() {
      Object.keys(DEFAULTS).forEach(k => { state[k] = DEFAULTS[k]; });
      save(state);
      FILTER_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = state[id]; el.dispatchEvent(new Event('change', { bubbles: true })); }
      });
    },
  };

  // ── Auto-wire dei select esistenti ──────────────────────────────
  function autoWire() {
    FILTER_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      // Applica state iniziale (se il valore è valido per questo select)
      const stored = state[id];
      const validValues = [...el.options].map(o => o.value);
      if (stored && validValues.includes(stored)) {
        if (el.value !== stored) {
          el.value = stored;
          // Trigger un re-render della pagina
          setTimeout(() => el.dispatchEvent(new Event('change', { bubbles: true })), 50);
        }
      } else {
        // Salva il valore corrente del select come state
        state[id] = el.value;
        save(state);
      }
      // Salva ogni modifica utente
      el.addEventListener('change', (e) => {
        const v = e.target.value;
        if (state[id] !== v) {
          state[id] = v;
          save(state);
          notify(id, v, state);
        }
      });
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(autoWire, 0);
  } else {
    document.addEventListener('DOMContentLoaded', autoWire);
  }

  window.DashboardFilters = Filters;

})(window);
