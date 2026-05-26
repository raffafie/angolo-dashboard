# Deploy Dashboard Analytics Standalone

Versione **statica** della dashboard — nessun backend richiesto.

## Caratteristiche

- ✅ **Modalità statica forzata** via `<meta name="athena-static-only" content="true">`
- ✅ Tutti i dati provengono da `shared/data.js` + `shared/hr_data.js` (snapshot Aprile 2025)
- ✅ Logo Angolo integrato
- ✅ Filtri persistenti via localStorage (CdC/anno/mese)
- ✅ Grafici aggiornati (heatmap, multi-line, grouped)
- ✅ Nessuna chiamata a Cloud Run / Zoho — gira al 100% offline

## Opzioni di deploy

### A) Netlify Drop (5 secondi, URL temporaneo)
1. https://app.netlify.com/drop
2. Trascina la cartella `Dashboard_Analytics_STANDALONE`
3. URL stabile dopo aver creato account gratuito

### B) GitHub Pages
```bash
cd Dashboard_Analytics_STANDALONE
git init && git branch -m main
git add -A
git commit -m "init: dashboard standalone Angolo"
git remote add origin https://github.com/<USER>/angolo-dashboard.git
git push -u origin main
# Poi Settings → Pages → main branch
```

### C) Apri locale (file://)
Doppio clic su `index.html`. Funziona senza server.

## Riabilitare modalità live

Per usare la stessa codebase con backend Athena (es. dev locale):
1. Rimuovi `<meta name="athena-static-only" content="true">` dagli HTML
2. Avvia `app.py` su porta 5000
3. Apri via `http://localhost:7788` o `http://localhost:5000/dashboard-analytics`

## Aggiornamento dati statici

I dati sono in `shared/data.js` (DA.*) e `shared/hr_data.js` (DA.HR_*).
Per aggiornarli:
```bash
# Copia gli ultimi da Dashboard_Analytics (versione live)
cp ../Dashboard_Analytics/shared/{data,hr_data}.js shared/
```

## Snapshot dati attuale

| Metrica | Valore | Periodo |
|---|---|---|
| Fatturato | €7.95M | 2025 |
| Presenze | 530K | 2025 |
| Strutture attive | 85/105 | snapshot Apr 2025 |
| Organico TI fine 2025 | 152 | Storico Rapporto |
| Turnover TI 2025 | 16.61% | calcolo da movimenti |

Per dati live aggiornati, usare la versione locale con backend Athena.
