/**
 * [M4] Widget condiviso "Triplice confronto €/prodie"
 * Stessa logica in 04_costi, 05_capitolato, 02_redditivita.
 *
 * Uso:
 *   <div id="triplice-host"></div>
 *   <script src="shared/triplice.js?v=..."></script>
 *   <script> renderTripliceConfronto({hostId:'triplice-host', anno:'2025', cdc:'all'}); </script>
 *
 * Fonti: /api/dashboard/costi-confronto via LIVE.getCostiConfronto()
 */
async function renderTripliceConfronto({hostId='triplice-host', anno='2025', cdc='all'} = {}) {
  const host = document.getElementById(hostId);
  if (!host) { console.warn('[triplice] host non trovato:', hostId); return; }

  // Rendering scheletro con badge di caricamento
  host.innerHTML = `
    <div class="chart-card" style="margin-bottom:14px;border:1px solid rgba(59,130,246,.3)">
      <div class="chart-title">
        <span class="dot" style="background:#3b82f6"></span>
        Triplice confronto €/prodie — Reale vs Capitolato vs Media interna gruppo
        <span id="${hostId}-badge" style="margin-left:auto;font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(245,158,11,.2);color:#f59e0b">◌ caricamento…</span>
      </div>
      <div style="font-size:10px;color:var(--text3);margin:-2px 0 10px">
        <strong>Reale</strong> = costi totali Zoho ÷ presenze ·
        <strong>Capitolato</strong> = Allegato A (ore dovute × €/h CCNL) + categorie capitolato × retta ·
        <strong>Media gruppo</strong> = media CdC stesso scaglione fascia/tipo
      </div>
      <div id="${hostId}-table" style="overflow-x:auto"></div>
      <div style="font-size:10px;color:var(--text3);margin-top:6px;font-style:italic">
        <span style="color:#f59e0b">DROSSO &amp; VICO</span>: fuori capitolato (contratto quadro).
        <span style="color:#06b6d4">MODENA</span>: Allegato A da applicare per singolo sotto-centro.
      </div>
    </div>`;

  const badge = document.getElementById(`${hostId}-badge`);
  const tblHost = document.getElementById(`${hostId}-table`);
  if (!window.LIVE || !LIVE.getCostiConfronto) {
    badge.style.background='rgba(239,68,68,.2)'; badge.style.color='#ef4444';
    badge.textContent='✗ live API non disponibile';
    tblHost.innerHTML = '<div style="padding:16px;color:var(--text3)">Backend non raggiungibile.</div>';
    return;
  }

  try {
    const d = await LIVE.getCostiConfronto(anno, cdc === 'all' ? 'ALL' : cdc.toUpperCase());
    if (!d || !d.by_cdc) {
      badge.style.background='rgba(239,68,68,.2)'; badge.style.color='#ef4444';
      badge.textContent='✗ dati nulli';
      tblHost.innerHTML = '<div style="padding:16px;color:var(--text3)">Nessun dato dal backend.</div>';
      return;
    }
    const src = d.sources || {};
    const allLive = src.analytics_presenze && src.analytics_redditivita && src.capitolato;
    badge.style.background = allLive ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.2)';
    badge.style.color = allLive ? '#10b981' : '#f59e0b';
    badge.textContent = allLive ? `● LIVE ${anno}` : `◐ parziale ${anno}`;

    const rows = Object.entries(d.by_cdc).map(([k,v]) => ({k, ...v}));
    rows.sort((a,b) => (a.tipo||'').localeCompare(b.tipo||'') || a.k.localeCompare(b.k));

    const fmtEur = v => (v == null) ? '<span style="color:var(--text3)">n/d</span>' : `€${(+v).toFixed(2)}`;
    const fmtDelta = (real, ref) => {
      if (real == null || ref == null) return '<span style="color:var(--text3)">—</span>';
      const d = real - ref, pct = ref !== 0 ? (d/ref*100) : 0;
      const sign = d >= 0 ? '+' : '';
      const col = Math.abs(pct) <= 5 ? '#10b981' : (Math.abs(pct) <= 15 ? '#f59e0b' : '#ef4444');
      return `<span style="color:${col};font-weight:600">${sign}€${d.toFixed(2)} (${sign}${pct.toFixed(1)}%)</span>`;
    };

    let html = '<table style="width:100%;border-collapse:collapse;font-size:11px">';
    html += '<thead><tr style="color:var(--text2);font-size:10px;text-align:left">';
    html += '<th style="padding:6px 8px">CdC</th>';
    html += '<th style="padding:6px 8px;text-align:center">Tipo</th>';
    html += '<th style="padding:6px 8px;text-align:right">Posti</th>';
    html += '<th style="padding:6px 8px;text-align:center">Fascia A</th>';
    html += '<th style="padding:6px 8px;text-align:right;color:#10b981">€/prodie Reale</th>';
    html += '<th style="padding:6px 8px;text-align:right;color:#3b82f6">€/prodie Capitolato</th>';
    html += '<th style="padding:6px 8px;text-align:right;color:#8b5cf6">€/prodie Media gruppo</th>';
    html += '<th style="padding:6px 8px;text-align:right">Δ vs Capit.</th>';
    html += '<th style="padding:6px 8px;text-align:right">Δ vs Media</th>';
    html += '<th style="padding:6px 8px">Gruppo</th></tr></thead><tbody>';

    rows.forEach(r => {
      const bgRow = (r.k==='DROSSO' || r.k==='VICO') ? 'background:rgba(245,158,11,.05)' : '';
      html += `<tr style="border-top:1px solid var(--border);${bgRow}">`;
      html += `<td style="padding:6px 8px;font-weight:600">${r.label || r.k}</td>`;
      html += `<td style="padding:6px 8px;text-align:center"><span class="badge" style="font-size:9px">${r.tipo}</span></td>`;
      html += `<td style="padding:6px 8px;text-align:right">${r.posti_max||'—'}</td>`;
      html += `<td style="padding:6px 8px;text-align:center;font-size:10px;color:var(--text3)">${r.fascia_allegato_a||'—'}</td>`;
      html += `<td style="padding:6px 8px;text-align:right;color:#10b981;font-weight:600">${fmtEur(r.costo_reale)}</td>`;
      html += `<td style="padding:6px 8px;text-align:right;color:#3b82f6;font-weight:600">${fmtEur(r.costo_capitolato)}</td>`;
      html += `<td style="padding:6px 8px;text-align:right;color:#8b5cf6;font-weight:600">${fmtEur(r.media_interna_gruppo)}</td>`;
      html += `<td style="padding:6px 8px;text-align:right">${fmtDelta(r.costo_reale, r.costo_capitolato)}</td>`;
      html += `<td style="padding:6px 8px;text-align:right">${fmtDelta(r.costo_reale, r.media_interna_gruppo)}</td>`;
      html += `<td style="padding:6px 8px;font-size:10px;color:var(--text3)">${r.gruppo||'—'}</td>`;
      html += '</tr>';
    });
    html += '</tbody></table>';
    tblHost.innerHTML = html;
  } catch (e) {
    console.error('[triplice]', e);
    badge.style.background='rgba(239,68,68,.2)'; badge.style.color='#ef4444';
    badge.textContent = '✗ errore fetch';
    tblHost.innerHTML = `<div style="padding:16px;color:#ef4444">Errore: ${e.message}</div>`;
  }
}

// Espongo per uso da pagine
window.renderTripliceConfronto = renderTripliceConfronto;
