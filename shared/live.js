/* ================================================================
   live.js — Hybrid data loader
   Dashboard Analytics — Cooperativa Angolo

   Se il protocollo è http/https → chiama /api/zoho/query (Cloud Run)
   Se è file:// → usa i dati statici di DA.* da data.js
   ================================================================ */

;(function(window) {
  'use strict';

  // STANDALONE BUILD — meta tag <meta name="athena-static-only" content="true">
  // forza la modalità statica e disabilita tutti i fetch backend.
  const STATIC_META = document.querySelector('meta[name="athena-static-only"]');
  const FORCE_STATIC = STATIC_META && STATIC_META.getAttribute('content') === 'true';
  const IS_LIVE = !FORCE_STATIC && window.location.protocol.startsWith('http');

  // Base URL backend — non usato se FORCE_STATIC = true
  const ATHENA_BASE = (function(){
    if (window.ATHENA_BASE !== undefined) return window.ATHENA_BASE;
    const meta = document.querySelector('meta[name="athena-base"]');
    if (meta) return meta.getAttribute('content') || '';
    // Auto-detect: se siamo su porta 7788/8000/3000 (static server), redirigi a 5000
    const sameHost = window.location.hostname;
    const port = window.location.port;
    if (sameHost === 'localhost' && ['7788','8000','3000','5500','5173'].includes(port)) {
      return 'http://localhost:5000';
    }
    return '';
  })();
  function _url(path) { return ATHENA_BASE + path; }

  /* ── Indicatore visivo ──────────────────────────────────── */
  function renderDataBar() {
    const bar = document.getElementById('data-mode-bar');
    if (bar) {
      if (FORCE_STATIC) {
        bar.className = 'data-bar static';
        bar.innerHTML = '<span class="dot"></span>📦 Versione <strong>Standalone</strong> · dati statici Cooperativa Angolo (snapshot Aprile 2025) · nessuna connessione Zoho';
      } else if (IS_LIVE) {
        bar.className = 'data-bar live';
        bar.innerHTML = '<span class="dot"></span>Dati live da Zoho <strong>Analytics</strong> + <strong>Creator</strong> — cache 5 min';
      } else {
        bar.className = 'data-bar static';
        bar.innerHTML = '<span class="dot"></span>Modalità offline — dati statici da data.js (apri via web per dati live)';
      }
    }
    const badge = document.getElementById('data-badge');
    if (badge) {
      if (FORCE_STATIC) {
        badge.className = 'data-badge static';
        badge.textContent = '📦 STANDALONE';
        badge.title = 'Versione standalone · dati statici · senza fetch Zoho';
      } else {
        badge.className = IS_LIVE ? 'data-badge live' : 'data-badge static';
        badge.textContent = IS_LIVE ? '● LIVE' : '◌ OFFLINE';
      }
    }
    // Healthcheck async solo se non FORCE_STATIC
    if (IS_LIVE && !FORCE_STATIC && badge) _refreshSourceHealth(badge, bar);
  }

  /** Healthcheck async delle sorgenti Analytics + Creator → aggiorna badge/bar. */
  async function _refreshSourceHealth(badge, bar) {
    try {
      const snap = await getLiveSnapshot();
      const a = !!(snap.sources && snap.sources.analytics);
      const c = !!(snap.sources && snap.sources.creator);
      const both = a && c, any = a || c;
      if (badge) {
        badge.textContent = both ? '● ANALYTICS + CREATOR' : (any ? `● ${a?'ANALYTICS':'CREATOR'}` : '○ DOWN');
        badge.className = 'data-badge ' + (both || any ? 'live' : 'static');
        badge.title = `Analytics: ${a?'OK':'KO'} · Creator: ${c?'OK':'KO'}`;
      }
      if (bar && both) {
        bar.innerHTML = '<span class="dot"></span>Dati live · <strong>Analytics</strong> ✓ + <strong>Creator</strong> ✓ — cache 5 min';
      } else if (bar && any) {
        bar.innerHTML = `<span class="dot"></span>Dati live · <strong>${a?'Analytics':'Creator'}</strong> ✓ · <strong>${a?'Creator':'Analytics'}</strong> ✗ — fallback statico per la fonte KO`;
      }
    } catch (_) { /* silent */ }
  }

  /* ── Cache in-memory (evita re-fetch per pagina) ─────────── */
  const _cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minuti

  function _cacheGet(key) {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) { _cache.delete(key); return null; }
    return entry.data;
  }
  function _cacheSet(key, data) {
    _cache.set(key, { ts: Date.now(), data });
  }

  /* ── Fetch Zoho via API ──────────────────────────────────── */
  async function _fetchZoho(sql, params) {
    const cacheKey = sql + JSON.stringify(params || {});
    const cached = _cacheGet(cacheKey);
    if (cached) return cached;

    const resp = await fetch(_url('/api/zoho/query'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, ...(params || {}) })
    });
    if (!resp.ok) throw new Error(`Zoho API error: ${resp.status}`);
    const json = await resp.json();
    // L'API restituisce {rows: [...], count: N, sql: "..."}
    const data = json.rows || json.data || [];
    _cacheSet(cacheKey, data);
    return data;
  }

  /* ── Fetch endpoint normalizzato (preferito) ─────────────── */
  async function _fetchPresenze(qs) {
    const cacheKey = 'dp:' + qs;
    const cached = _cacheGet(cacheKey);
    if (cached) return cached;

    const resp = await fetch(_url('/api/dashboard/presenze?') + qs);
    if (!resp.ok) throw new Error(`Dashboard API error: ${resp.status}`);
    const json = await resp.json();
    const rows = json.rows || [];
    _cacheSet(cacheKey, rows);
    return rows;
  }

  /* ── PRESENZE mensili per CdC ────────────────────────────── */
  /**
   * Restituisce array[12] di presenze per un dato CdC e anno.
   * @param {string} cdc  — chiave es. 'PISA', 'MODENA', ...
   * @param {number} year — 2025 o 2026
   */
  async function getPresenzeAnnuali(cdc, year) {
    if (!IS_LIVE) {
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      return (ds && ds[cdc]) || new Array(12).fill(0);
    }
    try {
      const qs = `year=${encodeURIComponent(year)}&cdc=${encodeURIComponent(cdc)}&group=month`;
      const rows = await _fetchPresenze(qs);
      const arr = new Array(12).fill(0);
      rows.forEach(r => {
        const m = Number(r.month);
        if (m >= 1 && m <= 12) arr[m - 1] = Number(r.presenze) || 0;
      });
      return arr;
    } catch (e) {
      console.warn('[live.js] Fallback statico per presenze', cdc, year, e);
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      return (ds && ds[cdc]) || new Array(12).fill(0);
    }
  }

  /**
   * Presenze per tutti i CdC in un dato mese/anno.
   * Ritorna { PISA: N, DROSSO: N, ... }
   */
  async function getPresenzePerCdC(month, year) {
    if (!IS_LIVE) {
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      if (!ds) return {};
      const out = {};
      Object.entries(ds).forEach(([k, arr]) => { out[k] = arr[month - 1] || 0; });
      return out;
    }
    try {
      const qs = `year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}&group=cdc`;
      const rows = await _fetchPresenze(qs);
      const out = {};
      rows.forEach(r => { if (r.cdc) out[r.cdc] = Number(r.presenze) || 0; });
      return out;
    } catch (e) {
      console.warn('[live.js] Fallback statico per presenze per CdC', e);
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      if (!ds) return {};
      const out = {};
      Object.entries(ds).forEach(([k, arr]) => { out[k] = arr[month - 1] || 0; });
      return out;
    }
  }

  /* ── Presenze YTD aggregato ──────────────────────────────── */
  /**
   * Totale presenze YTD per tutti i CdC, dado anno.
   * Se month fornito, limita a mesi 1..month.
   */
  async function getPresenzeYTD(year, upToMonth) {
    if (!IS_LIVE) {
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      if (!ds) return { total: 0, byCdc: {} };
      const byCdc = {};
      let total = 0;
      const limit = upToMonth || 12;
      Object.entries(ds).forEach(([k, arr]) => {
        const v = arr.slice(0, limit).reduce((a, b) => a + b, 0);
        byCdc[k] = v; total += v;
      });
      return { total, byCdc };
    }
    try {
      let qs = `year=${encodeURIComponent(year)}&group=cdc`;
      if (upToMonth) qs += `&up_to_month=${encodeURIComponent(upToMonth)}`;
      const rows = await _fetchPresenze(qs);
      const byCdc = {};
      let total = 0;
      rows.forEach(r => {
        const v = Number(r.presenze) || 0;
        if (r.cdc) byCdc[r.cdc] = v;
        total += v;
      });
      return { total, byCdc };
    } catch (e) {
      console.warn('[live.js] Fallback statico YTD', e);
      const ds = year === 2026 ? (window.DA && DA.PRESENZE_M_2026) : (window.DA && DA.PRESENZE_M);
      if (!ds) return { total: 0, byCdc: {} };
      const byCdc = {};
      let total = 0;
      const limit = upToMonth || 12;
      Object.entries(ds).forEach(([k, arr]) => {
        const v = arr.slice(0, limit).reduce((a, b) => a + b, 0);
        byCdc[k] = v; total += v;
      });
      return { total, byCdc };
    }
  }

  /* ── KPI Economici (redditività, costi) ──────────────────── */
  async function getRedditività(cdc, year) {
    if (!IS_LIVE || !window.DA || !DA.REDD) return null;
    // Solo statico per ora (dati economici non sempre in Zoho real-time)
    const redd = DA.REDD;
    if (cdc === 'ALL') return redd;
    return redd[cdc] || null;
  }

  /* ── Ore erogate vs capitolato ───────────────────────────── */
  async function getOreVsCapitolato(cdc, year) {
    if (!IS_LIVE) {
      const key = cdc === 'ALL' ? null : cdc;
      const ds = window.DA && DA.COSTI_ORE;
      if (!ds) return null;
      return key ? (ds[key] || null) : ds;
    }
    try {
      const cdcFilter = cdc && cdc !== 'ALL' ? `WHERE CdC = '${cdc}'` : '';
      const sql = `
        SELECT CdC, SUM(OreErogate) as erogate, SUM(OreCapitolato) as capitolato
        FROM OreServizi
        ${cdcFilter}
        GROUP BY CdC
      `;
      const rows = await _fetchZoho(sql);
      if (cdc && cdc !== 'ALL') return rows[0] || null;
      const out = {};
      rows.forEach(r => { out[r.CdC] = r; });
      return out;
    } catch (e) {
      console.warn('[live.js] Fallback statico ore', e);
      const ds = window.DA && DA.COSTI_ORE;
      return ds || null;
    }
  }

  /* ── Status giuridico ospiti ─────────────────────────────── */
  async function getStatusOspiti(cdc) {
    if (!IS_LIVE) {
      const ds = window.DA && DA.STATUS_OSPITI;
      if (!ds) return null;
      return cdc && cdc !== 'ALL' ? (ds[cdc] || null) : ds;
    }
    try {
      const cdcFilter = cdc && cdc !== 'ALL' ? `WHERE CdC = '${cdc}'` : '';
      const sql = `
        SELECT CdC, StatusGiuridico, COUNT(*) as n
        FROM AnagraficaOspiti
        ${cdcFilter}
        GROUP BY CdC, StatusGiuridico
      `;
      const rows = await _fetchZoho(sql);
      // raggruppa per CdC
      const out = {};
      rows.forEach(r => {
        if (!out[r.CdC]) out[r.CdC] = {};
        out[r.CdC][r.StatusGiuridico] = Number(r.n) || 0;
      });
      if (cdc && cdc !== 'ALL') return out[cdc] || null;
      return out;
    } catch (e) {
      console.warn('[live.js] Fallback statico status ospiti', e);
      const ds = window.DA && DA.STATUS_OSPITI;
      return ds || null;
    }
  }

  /* ── HR / Assenteismo ────────────────────────────────────── */
  async function getHRData(cdc) {
    // Dati HR tendenzialmente statici o da Zoho People
    const ds = window.DA && DA.HR_CDC;
    if (!ds) return null;
    return cdc && cdc !== 'ALL' ? (ds[cdc] || null) : ds;
  }

  /* ── Zoho query generica (per utilizzi avanzati) ─────────── */
  async function query(sql, fallbackFn) {
    if (!IS_LIVE) {
      if (typeof fallbackFn === 'function') return fallbackFn();
      return null;
    }
    try {
      return await _fetchZoho(sql);
    } catch (e) {
      console.warn('[live.js] query fallback', e);
      if (typeof fallbackFn === 'function') return fallbackFn();
      return null;
    }
  }

  /* ── Helpers numerici ────────────────────────────────────── */
  function fmt(n, decimals) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('it-IT', {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals || 0
    });
  }
  function fmtEur(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }
  function pct(a, b) {
    if (!b) return 0;
    return Math.round((a / b) * 100);
  }
  function deltaClass(v) {
    if (v > 0) return 'up';
    if (v < 0) return 'down';
    return 'flat';
  }
  function deltaIcon(v) {
    if (v > 0) return '▲';
    if (v < 0) return '▼';
    return '—';
  }

  /* ── Mesi labels ─────────────────────────────────────────── */
  const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
                'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  const MESI_FULL = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                     'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

  /* ── CdC metadata ────────────────────────────────────────── */
  const CDC_LIST = [
    { key: 'PISA',    label: 'Pisa',        color: '#2563eb', cls: 'pisa' },
    { key: 'DROSSO',  label: "Drosso",      color: '#059669', cls: 'drosso' },
    { key: 'LORANZE', label: 'Loranzè',     color: '#7c3aed', cls: 'loranze' },
    { key: 'RIETI',   label: 'Rieti',       color: '#d97706', cls: 'rieti' },
    { key: 'VICENZA', label: 'Vicenza',     color: '#0891b2', cls: 'vicenza' },
    { key: 'MODENA',  label: 'Modena',      color: '#db2777', cls: 'modena' },
    { key: 'VICO',    label: 'Vico Eq.',    color: '#ea580c', cls: 'vico' },
    { key: 'CAMBO',   label: 'Campobasso',  color: '#0d9488', cls: 'cambo' },
  ];
  function getCdcMeta(key) {
    return CDC_LIST.find(c => c.key === key) || { key, label: key, color: '#94a3b8', cls: '' };
  }

  /* ── Ore mansioni da Organico Mensile (Zoho Creator) ────── */
  /**
   * Restituisce le ore erogate/richieste per mansione dall'endpoint live.
   * Se non live, fallback a DA.ORE_MANSIONI (dati statici).
   * @param {number} year
   * @param {number|null} month — mese 0-indexed, o null per tutti
   * @param {string|null} cdc   — chiave breve (es. 'PISA'), o null per tutti i centri
   * @returns {Promise<Array>} — stessa struttura rows dell'endpoint
   */
  async function getOreMansioni(year, month = null, cdc = null) {
    if (!IS_LIVE) {
      // Fallback statico: restituisce DA.ORE_MANSIONI per l'anno
      const annoDati = window.DA && DA.ORE_MANSIONI && DA.ORE_MANSIONI[String(year)];
      if (!annoDati) return [];
      return Object.entries(annoDati).map(([m, d]) => ({
        anno: year, mese: parseInt(m), centri: d.centri, mansioni: d.mansioni
      }));
    }
    try {
      const qs = new URLSearchParams({ year: String(year) });
      if (month !== null) qs.set('month', String(month));
      if (cdc) qs.set('cdc', cdc);
      const resp = await fetch(_url('/api/dashboard/ore_mansioni?') + qs);
      if (!resp.ok) throw new Error(`ore_mansioni API error: ${resp.status}`);
      const json = await resp.json();
      return json.rows || [];
    } catch (e) {
      console.warn('[live.js] getOreMansioni fallback statico', e);
      const annoDati = window.DA && DA.ORE_MANSIONI && DA.ORE_MANSIONI[String(year)];
      if (!annoDati) return [];
      return Object.entries(annoDati).map(([m, d]) => ({
        anno: year, mese: parseInt(m), centri: d.centri, mansioni: d.mansioni
      }));
    }
  }

  /* ── Zoho Creator — API client (richiede backend Athena) ────────────── */
  /**
   * Recupera record da un report Zoho Creator via /api/zoho/creator/records.
   * @param {string} appLink   — link_name dell'app Creator (es. 'gestione-personale')
   * @param {string} report    — link_name del report (es. 'All_Costo_Personale')
   * @param {object} opts      — { criteria, max_records, fields, sort_by, bulk }
   * @returns {Promise<Array<object>>}
   */
  async function getCreatorRecords(appLink, report, opts = {}) {
    if (!IS_LIVE) {
      console.warn('[live.js] Zoho Creator non disponibile in modalità offline');
      return [];
    }
    const cacheKey = `creator:${appLink}:${report}:${JSON.stringify(opts)}`;
    const cached = _cacheGet(cacheKey);
    if (cached) return cached;
    try {
      const resp = await fetch(_url('/api/zoho/creator/records'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: appLink, report, ...opts })
      });
      if (!resp.ok) throw new Error(`Creator API error: ${resp.status}`);
      const json = await resp.json();
      const rows = json.rows || [];
      _cacheSet(cacheKey, rows);
      return rows;
    } catch (e) {
      console.warn('[live.js] getCreatorRecords error', appLink, report, e);
      return [];
    }
  }

  /** Lista app Creator disponibili. Promise<Array<{link_name, display_name, ...}>> */
  async function getCreatorApps() {
    if (!IS_LIVE) return [];
    try {
      const resp = await fetch(_url('/api/zoho/creator/apps'));
      if (!resp.ok) throw new Error(`Creator apps API error: ${resp.status}`);
      const json = await resp.json();
      return json.apps || [];
    } catch (e) {
      console.warn('[live.js] getCreatorApps error', e);
      return [];
    }
  }

  /**
   * Snapshot composito Analytics + Creator per la home.
   * Cache 5 min server-side, cache 5 min client-side.
   * @returns {Promise<{sources, creator, analytics, errors, ts}>}
   */
  async function getLiveSnapshot() {
    if (!IS_LIVE) {
      return { sources: { creator: false, analytics: false }, creator: {}, analytics: {}, errors: ['offline'] };
    }
    const cacheKey = 'live_snapshot_v1';
    const cached = _cacheGet(cacheKey);
    if (cached) return cached;
    try {
      const resp = await fetch(_url('/api/dashboard/live-snapshot'));
      if (!resp.ok) throw new Error(`live-snapshot API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) {
      console.warn('[live.js] getLiveSnapshot error', e);
      return { sources: { creator: false, analytics: false }, creator: {}, analytics: {}, errors: [String(e)] };
    }
  }

  /* ═══════════════ DASHBOARD KPI v2 — endpoint nuovi (mag 2026) ═══════════ */

  /** Mappatura mansioni Zoho → categorie Allegato A (con override PSICOLOGO ecc.) */
  async function getMappaturaMansioni() {
    const cacheKey = 'mapping_mansioni';
    const cached = _cacheGet(cacheKey); if (cached) return cached;
    try {
      const resp = await fetch(_url('/api/dashboard/mappatura-mansioni'));
      if (!resp.ok) throw new Error(`mapping API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) { console.warn('[live.js] getMappaturaMansioni error', e); return null; }
  }

  /** Ore richieste Allegato A per (tipo, posti).
   * @param {'CC'|'CAD'} tipo
   * @param {number} posti */
  async function getDotazioneRichiesta(tipo, posti) {
    const cacheKey = `dot:${tipo}:${posti}`;
    const cached = _cacheGet(cacheKey); if (cached) return cached;
    try {
      const resp = await fetch(_url(`/api/dashboard/dotazione-richiesta?tipo=${encodeURIComponent(tipo)}&posti=${posti}`));
      if (!resp.ok) throw new Error(`dotazione API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) { console.warn('[live.js] getDotazioneRichiesta error', e); return null; }
  }

  /** Assunti/cessati TI nel periodo per CdC.
   * @param {string} cdc 'PISA'|'MODENA'|...|'ALL'
   * @param {string} from 'YYYY-MM-DD'
   * @param {string} to   'YYYY-MM-DD'
   * @param {boolean} soloTI default true */
  async function getHrMovements(cdc, from, to, soloTI = true) {
    const cacheKey = `hr:${cdc}:${from}:${to}:${soloTI}`;
    const cached = _cacheGet(cacheKey); if (cached) return cached;
    try {
      const qs = `cdc=${encodeURIComponent(cdc)}&from=${from}&to=${to}&solo_ti=${soloTI?1:0}`;
      const resp = await fetch(_url('/api/dashboard/hr-movements?' + qs));
      if (!resp.ok) throw new Error(`hr-movements API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) { console.warn('[live.js] getHrMovements error', e); return null; }
  }

  /** Turnover annuale TI (Cessazioni / Organico medio × 100).
   * @param {string} cdc 'PISA'|...|'ALL'
   * @param {number} anno es. 2025 */
  async function getTurnover(cdc, anno) {
    const cacheKey = `tov:${cdc}:${anno}`;
    const cached = _cacheGet(cacheKey); if (cached) return cached;
    try {
      const resp = await fetch(_url(`/api/dashboard/turnover?cdc=${encodeURIComponent(cdc)}&anno=${anno}`));
      if (!resp.ok) throw new Error(`turnover API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) { console.warn('[live.js] getTurnover error', e); return null; }
  }

  /** Saturazione = presenze giorno / capacità per CdC. */
  async function getSaturazione(date) {
    const cacheKey = `sat:${date || 'today'}`;
    const cached = _cacheGet(cacheKey); if (cached) return cached;
    try {
      const url = date ? `/api/dashboard/saturazione?date=${date}` : '/api/dashboard/saturazione';
      const resp = await fetch(_url(url));
      if (!resp.ok) throw new Error(`saturazione API error: ${resp.status}`);
      const json = await resp.json();
      _cacheSet(cacheKey, json);
      return json;
    } catch (e) { console.warn('[live.js] getSaturazione error', e); return null; }
  }

  /** Lista report di un'app Creator. Promise<Array<{link_name, display_name, ...}>> */
  async function getCreatorReports(appLink) {
    if (!IS_LIVE) return [];
    try {
      const resp = await fetch(_url('/api/zoho/creator/reports?app=') + encodeURIComponent(appLink));
      if (!resp.ok) throw new Error(`Creator reports API error: ${resp.status}`);
      const json = await resp.json();
      return json.reports || [];
    } catch (e) {
      console.warn('[live.js] getCreatorReports error', appLink, e);
      return [];
    }
  }

  /* ── Esposizione pubblica ────────────────────────────────── */
  window.LIVE = {
    isLive: IS_LIVE,
    renderDataBar,
    getPresenzeAnnuali,
    getPresenzePerCdC,
    getPresenzeYTD,
    getRedditività,
    getOreVsCapitolato,
    getOreMansioni,
    getStatusOspiti,
    getHRData,
    query,
    // Zoho Creator
    creator: {
      getRecords: getCreatorRecords,
      getApps:    getCreatorApps,
      getReports: getCreatorReports,
    },
    // Snapshot composito Analytics + Creator (per widget home)
    getLiveSnapshot,
    // KPI v2 (mag 2026)
    getMappaturaMansioni,
    getDotazioneRichiesta,
    getHrMovements,
    getTurnover,
    getSaturazione,
    fmt, fmtEur, pct, deltaClass, deltaIcon,
    MESI, MESI_FULL, CDC_LIST, getCdcMeta,
  };

  // Render badge dopo che nav.js ha costruito la topbar.
  // Con defer, al primo run readyState è 'interactive' e DOMContentLoaded
  // non è ancora scattato → registrare il listener per eseguire dopo nav.js.
  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', renderDataBar);
  } else {
    renderDataBar();
  }

})(window);
