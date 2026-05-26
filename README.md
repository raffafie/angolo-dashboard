# Dashboard Analytics — Cooperativa Angolo (Standalone)

Versione **standalone** delle dashboard analytics. Funziona senza backend.

## 🚀 Uso

### Locale (offline)
Doppio click su `index.html` → si apre nel browser. Modalità "offline" con dati statici da `shared/data.js`.

### Hosting web (gratis)

**GitHub Pages**:
1. Push questo folder su un repo GitHub
2. Repo Settings → Pages → Source: `main` branch → Save
3. URL pubblico: `https://<user>.github.io/<repo>/`

**Netlify Drop**:
1. https://app.netlify.com/drop
2. Trascina l'intero folder → URL temporaneo immediato

**Cloudflare Pages**:
1. https://pages.cloudflare.com/
2. Connect GitHub → deploy automatico ad ogni push

## 📁 Struttura
```
index.html                  Hub principale
01_presenze.html            Presenze ospiti
02_redditivita.html         Redditività & fatturato
03_ore.html                 Ore & Conformità
04_costi.html               Composizione costi
05_capitolato.html          Capitolato vs reale
06_personale.html           Personale & HR
07_immobili.html            Immobili & ticket
08_ospiti.html              Ospiti & giuridico
09_hr_assenteismo.html      HR & assenteismo
10_ingressi_nuclei.html     Ingressi & nuclei
11_hr_analytics.html        HR Analytics
12_costi_personale.html     Costi personale
13_ore_assenteismo.html     Ore & assenteismo
shared/
  ├── data.js               Dati statici (CdC, presenze, redditività, capitolato)
  ├── hr_data.js            Dati HR (ore CdC, computeCdlPct)
  ├── live.js               Loader ibrido (auto-detect static vs live)
  ├── nav.js                Navigazione topbar
  └── style.css             Stile cooperativa
```

## 🔄 Aggiornamento dati

I dati sono cristallizzati in `shared/data.js`. Per aggiornarli:
1. Rigenera `data.js` con i dati live da Zoho (versione cloud)
2. Push del nuovo file
3. GitHub Pages aggiorna in 1 min

Per dati realmente live: usa la versione Cloud Run (richiede backend).
