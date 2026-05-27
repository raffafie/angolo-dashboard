/* ========================================================
   DASHBOARD ANALYTICS — Cooperativa Angolo
   Shared Data Module — Dati reali da Zoho Analytics
   Fonte: zoho_export / Redditività Centri / Composizione Costi
   Aggiornato: Aprile 2025
   ======================================================== */

const DA = {};

// ── FUNZIONI UTILITY (definite prima di tutto) ────────────
DA.fmt  = n => new Intl.NumberFormat('it-IT',{maximumFractionDigits:0}).format(n);
DA.fmtK = n => (n>=1000000)? (n/1000000).toFixed(2)+'M' : (n>=1000)? (n/1000).toFixed(0)+'K' : DA.fmt(n);
DA.fmtE = n => '€'+DA.fmtK(Math.abs(n))+(n<0?' ↓':'');
DA.fmtP = n => (n>=0?'+':'')+n.toFixed(1)+'%';
DA.sum  = arr => arr.reduce((a,b)=>(a||0)+(b||0),0);
DA.avg  = arr => { const v=arr.filter(x=>x!=null); return v.length?DA.sum(v)/v.length:0; };

// ── MESI ──────────────────────────────────────────────────
DA.MESI_LABEL = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
DA.MESI_FULL  = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                 'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

// ── CENTRI DI COSTO ───────────────────────────────────────
// tipo: CC = Centro Collettivo | SUA = Struttura Unità Abitative | CAD = Centro Accoglienza Diffuso
// posti_max: capacità massima autorizzata (conf. Raffaele 29/04/2026)
DA.CDC = {
  // retta = tariffa Prefettura €/prodie (Fonte: Convenzione Zoho Creator — Apr 2026)
  // posti_max = totale capacità autorizzata (Fonte: Zoho Creator Anagrafica Strutture, Mag 2026)
  PISA:    { label:'CAS PISA',              codice:'ANGOLO12', tipo:'CC',  posti_max:240, color:'#3b82f6', pill:'pill-pisa',    retta:24.00 }, // 1 CC (CC10 240p); MSNA chiuso
  RIETI:   { label:'CAD RIETI',             codice:'ANGOLO10', tipo:'CAD', posti_max: 97, color:'#10b981', pill:'pill-rieti',   retta:24.00 }, // 2 CAD (RETE1 48+RETE2 49)
  DROSSO:  { label:'DROSSO',                codice:'ANGOLO3',  tipo:'CC',  posti_max:290, color:'#8b5cf6', pill:'pill-drosso',  retta:57.00 }, // 1 CC Fragili 120 + 2 CD Diffusa 170; contratto quadro
  LORANZE: { label:'LORANZÈ',               codice:'ANGOLO4',  tipo:'CC',  posti_max: 90, color:'#f59e0b', pill:'pill-loranze', retta:32.00 }, // 1 CC (CC9 90p)
  VICENZA: { label:'VICENZA',               codice:'ANGOLO7',  tipo:'SUA', posti_max:117, color:'#ec4899', pill:'pill-vicenza', retta:45.00 }, // 4 CD (CAS1 34+CAS2 33+CAS3 40+CAS MSNA 10)
  MODENA:  { label:'MODENA IMMIGRAZIONE',   codice:'ANGOLO6',  tipo:'CC',  posti_max:740, color:'#06b6d4', pill:'pill-modena',  retta:36.00 }, // capacità reale 740 = 657 attive + 83 disponibili (escl. HYMA pulizie 50 + CC4 chiuso 54 + dismesse)
  VICO:    { label:'VICO-VALCHIUSA',        codice:'ANGOLO8',  tipo:'SUA', posti_max: 18, color:'#ef4444', pill:'pill-vico',    retta:57.00 }, // 1 CC Fragili (VC2 13) + 1 CD Diffusa (VC3 5); contratto quadro
  CAMBO:   { label:'CAMPOBASSO',            codice:'ANGOLO13', tipo:'CC',  posti_max:100, color:'#6366f1', pill:'pill-cambo',   retta:35.00 }, // 1 CC (CC11 100p); attivo da Ago 2025
};
DA.CDC_KEYS = ['PISA','RIETI','DROSSO','LORANZE','VICENZA','MODENA','VICO','CAMBO'];
DA.CDC_ACTIVE = ['PISA','RIETI','DROSSO','LORANZE','VICENZA','VICO']; // hanno dati Zoho completi

// ── REDDITIVITA' CENTRI 2025 (da Zoho: Redditività Centri) ─
// Dati mensili: [fatturato, costi, redditività, prodie_costo]
// Fonte: zoho_export "Redditività Centri"
DA.REDD = {
  PISA: {
    f: [147135,134201,147220,143858,150413,147607,154066,156751,147607,174583,177089,181864],
    c: [121904,119005,115405,111714,138573,137601,130035,136334,135286,150362,141361,139715],
    p: [19.62,21.15,18.96,18.78,22.29,22.55,20.42,21.04,22.17,22.72,21.06,20.26],
  },
  RIETI: {
    f: [73365,62853,63557,54868,52211,55141,58531,66810,60097,56560,68877,73975],
    c: [62768,58030,57343,62750,64431,57032,58364,57843,53703,57772,65548,70195],
    p: [20.87,22.32,20.91,26.50,28.40,24.85,23.98,20.66,21.79,24.91,23.21,23.14],
  },
  DROSSO: {
    f: [360454,128052,139585,135083,139266,134211,342940,345456,343741,359670,347497,357193],
    c: [219883,244736,202266,209412,204897,196838,211181,209662,208108,205284,218145,45705],
    p: [25.04,31.62,23.81,25.48,24.19,24.22,25.55,24.91,24.76,23.39,25.72,5.24],
  },
  LORANZE: {
    f: [79036,69930,76049,73351,82822,76839,85111,81218,76064,86455,80120,81975],
    c: [82074,66180,74115,66673,75464,68197,77917,68630,66675,62710,73867,36045],
    p: [32.27,29.41,30.56,28.42,28.57,27.98,28.24,26.07,27.04,23.03,27.43,12.97],
  },
  VICENZA: {
    f: [109056,96380,108956,101276,104427,96582,102095,107183,106021,111314,18578,0],
    c: [83551,85879,95316,86721,76789,77467,78068,72622,81034,38544,39968,0],
    p: [24.12,28.07,27.71,25.55,21.76,23.80,22.71,20.18,23.00,10.64,11.15,13.12],
  },
  MODENA: {
    f: [0,0,0,0,0,0,0,0,0,0,0,0],
    c: [0,0,0,0,0,0,0,0,0,0,0,0],
    p: [null,null,null,null,null,null,null,null,null,null,null,null],
    note: 'Fatturazione non registrata in Zoho — gestione separata'
  },
  VICO: {
    f: [31043,2440,2702,2615,2702,2615,25729,25729,24899,25729,23928,23958],
    c: [45006,40770,36608,37256,37287,41814,35356,32139,32057,44746,37052,28555],
    p: [76.41,76.64,62.36,76.66,75.18,87.11,71.28,64.80,67.21,93.81,82.34,61.41],
  },
  CAMBO: {
    f: [0,0,0,0,0,0,0,0,0,0,0,0],
    c: [0,0,0,0,0,0,0,0,0,0,0,0],
    p: [null,null,null,null,null,null,null,null,null,null,null,null],
    note: 'Dati non disponibili in Zoho Analytics'
  },
};

// ── TOTALI ANNUI 2025 ─────────────────────────────────────
// Fonte: Zoho "Redditività Centri" (serie mensile 2025) — Aprile 2026
// NOTA: valori derivati dalla somma serie mensile DA.REDD per coerenza interna grafici
// CAMBO: totale da query GRAFICO REDDITIVITA' (serie mensile assente in Zoho per questo CdC)
// MODENA: fatturazione non gestita in Zoho Analytics
DA.ANNO2025 = {
  PISA:    { f:1862395, c:1577295, r:285101,  prodie:20.92 },
  RIETI:   { f:746845,  c:725779,  r:21066,   prodie:23.46 },
  DROSSO:  { f:3133147, c:2376116, r:757031,  prodie:23.66 },
  LORANZE: { f:948971,  c:818547,  r:130424,  prodie:26.83 },
  VICENZA: { f:1061868, c:815959,  r:245909,  prodie:21.70 },
  MODENA:  { f:0,       c:4738277, r:0,       prodie:19.86, note:'Fatturazione non in Zoho; prodie = solo costo personale/presenze (sottostima)' },
  VICO:    { f:194087,  c:448647,  r:-254560, prodie:74.60 },
  CAMBO:   { f:120843,  c:82872,   r:37971,   prodie:13.64, note:'Attivo da Ago 2025 — dati parziali 5 mesi' },
};

// ── REDDITIVITA' 2026 — DATI REALI DA ZOHO ─────────────────────────────────
// Fonte: Zoho QueryTable "Redditività" (385 righe, view_id 189856000002383385)
// Estratto: 11/05/2026 — 32 righe 2026 (8 CdC × 4 mesi)
//
// Stato dati per mese:
//   Gen-Feb 2026: REALI (Fatturazione Totale + Costo Personale Effettivo > 0)
//   Mar-Apr 2026: PREVISIONE Fatturato (costi non ancora caricati in Zoho Creator)
//   Mag-Dic 2026: vuoti (mese non ancora rendicontato)
//
// Note:
// - 'f' = Fatturazione Totale (reale se >0, altrimenti Previsione Fatturato)
// - 'c' = Costo Personale Effettivo + Costi Centro (in 2026 spesso solo personale)
// - 'cp' = solo Costo Personale Effettivo
// - 'r' = Redditività calcolata da Zoho (può essere 0 se costi mancanti)
// - 'p' = prodie costo (Costo Centro/Presenze, fallback su Costo Pers Effett/Presenze)
//
// IMPORTANTE: VICO ha sempre fatturazione Zoho incompleta — usare RETTE_CDC come riferimento
DA.REDD_2026 = {
  PISA:    { f:[179146.58, 153004.0, 153637.12, 130290.82, 0,0,0,0,0,0,0,0],
             c:[193208.97,  50734.38, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[52588.81,  50734.38, 0, 0, 0,0,0,0,0,0,0,0],
             r:[38526.42,    0,       0, 0, 0,0,0,0,0,0,0,0],
             p:[20.71,       8.75,    0, 0, 0,0,0,0,0,0,0,0] },
  RIETI:   { f:[72609.03, 67413.96, 74682.18, 63926.19, 0,0,0,0,0,0,0,0],
             c:[22499.61, 20823.36, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[22499.61, 20823.36, 0, 0, 0,0,0,0,0,0,0,0],
             r:[0,0,0,0, 0,0,0,0,0,0,0,0],
             p:[7.56, 7.53, 0, 0, 0,0,0,0,0,0,0,0] },
  DROSSO:  { f:[354263.57, 323561.94, 214789.26, 296531.92, 0,0,0,0,0,0,0,0],
             c:[94382.36, 94785.09, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[48029.55, 48198.9, 0, 0, 0,0,0,0,0,0,0,0],
             r:[307910.76, 276975.75, 214789.26, 0, 0,0,0,0,0,0,0,0],
             p:[5.37, 5.92, 0, 0, 0,0,0,0,0,0,0,0] },
  LORANZE: { f:[78361.18, 51085.75, 51141.66, 39980.04, 0,0,0,0,0,0,0,0],
             c:[58892.14, 55907.91, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[24252.6, 22419.74, 0, 0, 0,0,0,0,0,0,0,0],
             r:[43721.64, 17597.58, 0, 0, 0,0,0,0,0,0,0,0],
             p:[13.13, 20.81, 0, 0, 0,0,0,0,0,0,0,0] },
  VICENZA: { f:[106977.03, 98444.49, 107974.64, 91242.21, 0,0,0,0,0,0,0,0],
             c:[41090.36, 39149.55, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[41090.36, 39149.55, 0, 0, 0,0,0,0,0,0,0,0],
             r:[0,0,0,0, 0,0,0,0,0,0,0,0],
             p:[11.34, 11.74, 0, 0, 0,0,0,0,0,0,0,0] },
  MODENA:  { f:[632062.16, 564480.65, 617409.45, 529725.97, 0,0,0,0,0,0,0,0],
             c:[190839.7, 185767.19, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[190839.7, 185767.19, 0, 0, 0,0,0,0,0,0,0,0],
             r:[0,0,0,0, 0,0,0,0,0,0,0,0],
             p:[10.26, 11.18, 0, 0, 0,0,0,0,0,0,0,0] },
  VICO:    { f:[23957.73, 21639.24, 21256.08, 20866.41, 0,0,0,0,0,0,0,0],
             c:[63768.47, 63544.8, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[35556.94, 35366.12, 0, 0, 0,0,0,0,0,0,0,0],
             r:[-4253.8, -6539.44, 21256.08, 0, 0,0,0,0,0,0,0,0],
             p:[60.67, 67.09, 0, 0, 0,0,0,0,0,0,0,0] },
  CAMBO:   { f:[32893.0, 27908.25, 29781.5, 25209.5, 0,0,0,0,0,0,0,0],
             c:[5668.13, 5908.44, 0, 0, 0,0,0,0,0,0,0,0],
             cp:[5668.13, 5908.44, 0, 0, 0,0,0,0,0,0,0,0],
             r:[0,0,0,0, 0,0,0,0,0,0,0,0],
             p:[5.47, 6.72, 0, 0, 0,0,0,0,0,0,0,0] },
};

// Totali 2026 (Gen-Feb reali + Mar-Apr fatturato previsionale, costi solo Gen-Feb)
DA.ANNO2026 = {
  PISA:    { f:616079,  c:243943,  cp:103323, r:38526,  prodie:14.73, presenze:23354, mesi_full:2, mesi_prev:2 },
  RIETI:   { f:278631,  c:43323,   cp:43323,  r:0,      prodie:7.54,  presenze:11424, mesi_full:2, mesi_prev:2 },
  DROSSO:  { f:1189147, c:189167,  cp:96228,  r:799676, prodie:5.64,  presenze:32380, mesi_full:2, mesi_prev:2 },
  LORANZE: { f:220569,  c:114800,  cp:46672,  r:61319,  prodie:16.97, presenze:7137,  mesi_full:2, mesi_prev:2 },
  VICENZA: { f:404638,  c:80240,   cp:80240,  r:0,      prodie:11.54, presenze:13677, mesi_full:2, mesi_prev:2 },
  MODENA:  { f:2343678, c:376607,  cp:376607, r:0,      prodie:10.72, presenze:68972, mesi_full:2, mesi_prev:2 },
  VICO:    { f:87719,   c:127313,  cp:70923,  r:10463,  prodie:63.88, presenze:1755,  mesi_full:2, mesi_prev:2 },
  CAMBO:   { f:115792,  c:11577,   cp:11577,  r:0,      prodie:6.09,  presenze:3647,  mesi_full:2, mesi_prev:2 },
};

// ── COMPOSIZIONE COSTI 2025 (da Zoho: Composizione Costi Pivot) ─
// Valori in euro, fonte reale Zoho Analytics
DA.COSTI_CAT = {
  PISA: {
    PERSONALE:           580914,
    VITTO:               349173,
    MANUTENZIONI:        180094,
    UTENZE:              101135,
    STRUTTURA:            80021,
    CONSULENTI_ESTERNI:   58902,
    PRODOTTI_IGIENE:      46723,
    SPESE_SANITARIE:      31205,
    COSTI_GENERALI:       25843,
    MEZZI_TRASPORTO:      23321,
    KIT_VESTITI:          11800,
    ALTRO:                89278,
    TOTALE:             1577295,
  },
  RIETI: {
    PERSONALE:           252491,
    STRUTTURA:           141796,
    VITTO:               137780,
    UTENZE:               65854,
    MANUTENZIONI:         42302,
    CONSULENTI_ESTERNI:   28451,
    SPESE_SANITARIE:      18405,
    COSTI_GENERALI:       14250,
    PRODOTTI_IGIENE:      12210,
    ALTRO:                12240,
    TOTALE:              725779,
  },
  DROSSO: {
    STRUTTURA:           905844,
    PERSONALE:           505654,
    VITTO:               488449,
    UTENZE:              220994,
    MANUTENZIONI:        108542,
    MEZZI_TRASPORTO:      51203,
    CONSULENTI_ESTERNI:   45209,
    COSTI_GENERALI:       30221,
    PRODOTTI_IGIENE:      20000,
    TOTALE:             2376116,
  },
  LORANZE: {
    PERSONALE:           436358,
    VITTO:               152373,
    UTENZE:               60326,
    CONSULENTI_ESTERNI:   48850,
    STRUTTURA:            38902,
    MANUTENZIONI:         34209,
    PRODOTTI_IGIENE:      22512,
    SPESE_SANITARIE:      13209,
    COSTI_GENERALI:       11808,
    TOTALE:              818547,
  },
  VICENZA: {
    PERSONALE:           405737,
    STRUTTURA:           139650,
    VITTO:               106345,
    UTENZE:               59053,
    MANUTENZIONI:         42891,
    CONSULENTI_ESTERNI:   31205,
    SPESE_SANITARIE:      16208,
    COSTI_GENERALI:       14870,
    TOTALE:              815959,
  },
  MODENA: {
    PERSONALE:          4738277,
    VITTO:                    0,
    STRUTTURA:                0,
    UTENZE:                   0,
    MANUTENZIONI:             0,
    CONSULENTI_ESTERNI:       0,
    PRODOTTI_IGIENE:          0,
    TOTALE:             4738277,
    note: 'Solo costo personale disponibile in Zoho Analytics per MODENA',
  },
  VICO: {
    PERSONALE:           298677,
    UTENZE:               36602,
    VITTO:                32544,
    MEZZI_TRASPORTO:      15817,
    STRUTTURA:            24503,
    MANUTENZIONI:         22104,
    SPESE_SANITARIE:      18400,
    TOTALE:              448647,
  },
  CAMBO: {
    PERSONALE:            24291,
    VITTO:                24588,
    STRUTTURA:            17462,
    UTENZE:                8925,
    MANUTENZIONI:          4206,
    ALTRO:                 3400,
    TOTALE:               82872,
  },
};

// ── COSTI ORARI PERSONALE (da Zoho: Costi orari CAS) ─────
// Totali per CdC: ore lavorate (tutte), costo totale, €/h medio
// Aggiornato Apr 2026 — PISA e LORANZÈ da view dedicati; altri da pivot generale
// Nota: 2026 Organico Mensile non ancora compilato dagli operatori → usati totali cumulativi
DA.COSTI_ORE = {
  RIETI:   { ore:35400,  costo:599931,   euro_h:16.95 },
  PISA:    { ore:79857,  costo:1395609,  euro_h:17.48 }, // Aggiornato da "Costi orari CAS-PISA"
  DROSSO:  { ore:64811,  costo:1141625,  euro_h:17.61 },
  LORANZE: { ore:35857,  costo:578865,   euro_h:16.14 }, // Aggiornato da "Costi orari CAS-LORANZE'"
  MODENA:  { ore:237227, costo:4738277,  euro_h:19.97 },
  VICENZA: { ore:48657,  costo:903582,   euro_h:18.57 },
  VICO:    { ore:66179,  costo:1275607,  euro_h:19.28 },
  CAMBO:   { ore:18000,  costo:360000,   euro_h:20.00 }, // Stima — attivo da Aug 2025, ~100 posti
};

// Dettaglio per mansione (Costi orari CAS)
DA.MANSIONI = {
  RIETI: [
    {r:'MEDIATORE INTERCULTURALE',h:4432.5, c:78791, eh:17.78},
    {r:'OPERATORE CENTRO ACCOGLIENZA',h:21197.5,c:341910,eh:16.13},
    {r:'OPERATORE LEGALE',h:3399.5,c:58596,eh:17.24},
    {r:'DIRETTORE/TRICE',h:322,c:7835,eh:24.33},
    {r:'INSEGNANTE',h:47,c:739,eh:15.72},
    {r:'NO MANSIONE',h:6154.5,c:116015,eh:18.85},
  ],
  PISA: [
    {r:'OPERATORE CENTRO ACCOGLIENZA',h:30478,c:492952,eh:16.17},
    {r:'INFERMIERE/A',h:3207.75,c:74724,eh:23.29},
    {r:'ADDETTO PULIZIE',h:2674,c:41816,eh:15.64},
    {r:'MEDIATORE INTERCULTURALE',h:749.96,c:13676,eh:18.24},
    {r:'NO MANSIONE',h:37196.75,c:669117,eh:17.99},
  ],
  DROSSO: [
    {r:'TUTTOFARE',h:19628.25,c:293077,eh:14.93},
    {r:'ADDETTO PULIZIE',h:8008,c:120462,eh:15.04},
    {r:'IMPIEGATO AMMINISTRATIVO',h:7138,c:145082,eh:20.33},
    {r:'OPERATORE CENTRO ACCOGLIENZA',h:4305.5,c:63215,eh:14.68},
    {r:'COORDINATORE/TRICE',h:4262.5,c:159173,eh:37.34},
    {r:'ANIMATORE',h:4683.5,c:75865,eh:16.20},
    {r:'INFERMIERE/A',h:3852.75,c:71302,eh:18.51},
    {r:'MEDICO',h:420,c:9322,eh:22.19},
  ],
  MODENA: [
    {r:'OPERATORE CENTRO ACCOGLIENZA',h:99923,c:2001950,eh:20.03},
    {r:'IMPIEGATO AMMINISTRATIVO',h:14046.8,c:287350,eh:20.46},
    {r:'OPERATORE SOCIALE',h:12944.75,c:248994,eh:19.24},
    {r:'NO MANSIONE',h:86087.25,c:1670892,eh:19.41},
    {r:'EDUCATORE/TRICE',h:5138.25,c:115472,eh:22.47},
    {r:'MEDIATORE INTERCULTURALE',h:4857,c:86154,eh:17.74},
    {r:'COORDINATORE/TRICE',h:2448.5,c:76111,eh:31.08},
    {r:'PSICOLOGO/A',h:2710.3,c:56620,eh:20.89},
  ],
};

// ── ORGANICO MENSILE PER MANSIONE — DATI REALI ZOHO CREATOR ─
// Fonte: "Organico Mensile (Zoho Creator)" — aggregato su tutti i centri con dati
// Struttura: { anno: { mese_0idx: { centri:N, mansioni:{chiave:{ric,er}} } } }
// Chiavi mansioni: op_d, op_n_rep, op_n_eff, med_ling, medico_rep, medico_eff,
//                 inferm, dir, op_soc, amm
// ric = ore Richieste (capitolato/contratto), er = ore Erogate (reali)
// NOTA: solo mesi popolati nel database (altri mesi: null → dato non disponibile)
// Aggiornato: Aprile 2026
DA.ORE_MANSIONI = {
  "2025": {
    "6": { "centri": 15, "mansioni": {
      "op_d":       { "ric": 5836.0, "er": 6087.8 },
      "op_n_rep":   { "ric": 1488.0, "er": 1416.0 },
      "op_n_eff":   { "ric": 2232.0, "er":  336.0 },
      "med_ling":   { "ric": 1170.8, "er":    0.0 },
      "medico_rep": { "ric": 1802.0, "er":    0.0 },
      "medico_eff": { "ric":    0.0, "er":    0.0 },
      "inferm":     { "ric":    0.0, "er":    0.0 },
      "dir":        { "ric":  570.3, "er":   14.0 },
      "op_soc":     { "ric": 1863.9, "er":   22.0 },
      "amm":        { "ric":    0.0, "er":    0.0 }
    }},
    "7": { "centri": 15, "mansioni": {
      "op_d":       { "ric": 5471.0, "er": 5557.8 },
      "op_n_rep":   { "ric": 1488.0, "er": 3210.0 },
      "op_n_eff":   { "ric": 2232.0, "er":  343.5 },
      "med_ling":   { "ric": 1071.0, "er":    0.0 },
      "medico_rep": { "ric": 1642.0, "er":    0.0 },
      "medico_eff": { "ric":    0.0, "er":    0.0 },
      "inferm":     { "ric":    0.0, "er":    0.0 },
      "dir":        { "ric":  517.9, "er":    0.0 },
      "op_soc":     { "ric": 1762.8, "er":    0.0 },
      "amm":        { "ric":    0.0, "er":    0.0 }
    }},
    "11": { "centri": 4, "mansioni": {
      "op_d":       { "ric": 2666.0, "er": 1858.0 },
      "op_n_rep":   { "ric":  496.0, "er":    0.0 },
      "op_n_eff":   { "ric":  868.0, "er":  524.0 },
      "med_ling":   { "ric":  399.0, "er":   86.0 },
      "medico_rep": { "ric":  217.0, "er":    0.0 },
      "medico_eff": { "ric":  159.6, "er":    0.0 },
      "inferm":     { "ric":  186.3, "er":    0.0 },
      "dir":        { "ric":  239.6, "er":   59.0 },
      "op_soc":     { "ric":  585.3, "er":  144.0 },
      "amm":        { "ric":   97.7, "er":    7.5 }
    }}
  },
  "2026": {
    "0": { "centri": 1, "mansioni": {
      "op_d":       { "ric":  720.0, "er":    0.0 },
      "op_n_rep":   null,
      "op_n_eff":   { "ric":  356.0, "er":    0.0 },
      "med_ling":   { "ric":   86.9, "er":    0.0 },
      "medico_rep": null,
      "medico_eff": { "ric":   69.8, "er":    0.0 },
      "inferm":     { "ric":   76.5, "er":    0.0 },
      "dir":        { "ric":   52.2, "er":    0.0 },
      "op_soc":     { "ric":  139.7, "er":    0.0 },
      "amm":        { "ric":   34.5, "er":    0.0 }
    }}
  }
};

// Chiavi e label mansioni Organico Mensile (Zoho Creator)
DA.ORE_MANS_KEYS   = ['op_d','op_n_rep','op_n_eff','med_ling','medico_rep','medico_eff','inferm','dir','op_soc','amm'];
DA.ORE_MANS_LABELS = ['Op. Diurno','Op. Notturno Rep.','Op. Notturno Eff.','Med. Linguistico',
                      'Medico Rep.','Medico Eff.','Infermiere','Direttore','Op. Sociale','Amministrativo'];
DA.ORE_MANS_COLORS = ['#3b82f6','#0f172a','#06b6d4','#10b981','#f59e0b','#d97706','#ec4899','#6366f1','#8b5cf6','#94a3b8'];

// Helper: restituisce il record Organico Mensile per anno+mese (0-indexed), o null se assente
DA.getOrganicoMensile = function(anno, mese){
  const key = String(mese);
  return (DA.ORE_MANSIONI[String(anno)] || {})[key] || null;
};

// ── CAPITOLATO CAS — Valori di riferimento ────────────────
// Fonte: D.M. Ministero Interno - Capitolato CAS
// Valori fissi per categoria su base €35/gg per ospite
// NOTA: i % di ripartizione categoria sono gli stessi per CC e SUA/CAD.
// Ciò che cambia tra CC e SUA/CAD è:
//   1) La RETTA giornaliera (negoziata per contratto, varia per centro)
//   2) Le ORE DI SERVIZIO DOVUTE (Allegato A) — scaglioni diversi per CC vs CAD
//   3) DROSSO e VICO hanno contratto quadro diverso — NON soggetti al capitolato
DA.CAPITOLATO = {
  retta_giornaliera: 35.00,
  categorie: {
    PERSONALE:          { euro_g: 15.40, pct: 44.0, label: 'Personale' },
    VITTO:              { euro_g:  7.70, pct: 22.0, label: 'Vitto' },
    STRUTTURA:          { euro_g:  4.20, pct: 12.0, label: 'Struttura / Affitto' },
    UTENZE:             { euro_g:  2.80, pct:  8.0, label: 'Utenze' },
    MANUTENZIONI:       { euro_g:  1.75, pct:  5.0, label: 'Manutenzioni' },
    CONSULENTI_ESTERNI: { euro_g:  1.40, pct:  4.0, label: 'Consulenti Esterni' },
    PRODOTTI_IGIENE:    { euro_g:  0.70, pct:  2.0, label: 'Prodotti Igiene' },
    SPESE_SANITARIE:    { euro_g:  0.35, pct:  1.0, label: 'Spese Sanitarie' },
    KIT_VESTITI:        { euro_g:  0.35, pct:  1.0, label: 'Kit Vestiti' },
    COSTI_GENERALI:     { euro_g:  0.35, pct:  1.0, label: 'Costi Generali' },
  }
};

// ── PRESENZE 2025 — DATI REALI da Zoho "Andamento presenze 2025" ─
// Fonte: zoho_query "Andamento presenze 2025" — Apr 2025
DA.PRESENZE_M = {
  PISA:    [6214,5627,6086,5947,6218,6102,6369,6480,6102,6618,6713,6896],
  RIETI:   [3008,2600,2742,2368,2269,2295,2434,2800,2464,2319,2824,3033],
  DROSSO:  [8781,7741,8494,8220,8470,8126,8264,8418,8404,8778,8482,8720],
  LORANZE: [2543,2250,2425,2346,2641,2437,2759,2633,2466,2723,2693,2779],
  VICENZA: [3464,3059,3440,3394,3529,3255,3437,3598,3523,3624,3583,3537],
  MODENA:  [20440,19242,21621,20428,21952,21749,22610,18900,16908,18044,18134,18595],
  VICO:    [589,532,587,486,496,480,496,496,477,477,450,465],
  CAMBO:   [0,0,0,0,0,0,0,570,1765,1524,1136,1079],
};

// ── RICOVERI OSPEDALIERI MENSILI 2025 ─────────────────────────
// Fonte: "Genera Fatturazione (Zoho Creator)" — giornate di ricovero ospedaliero
// Nota: ogni CdC ha 2 CIG per mese; valori deduplificati (÷2, factor verificato = 2.00)
// Mesi con 0 = nessun ricovero documentato O dati fatturazione non ancora inseriti
DA.RICOVERI_M_2025 = {
  PISA:    [31, 28, 27,  1, 20,  3,  0,  0, 12,  0,  0,  0], // Jan-Sep verificati; Ott-Dic non ancora
  RIETI:   [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  DROSSO:  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  LORANZE: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  VICENZA: [ 4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  MODENA:  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  VICO:    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  CAMBO:   [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
};

// Presenze annue totali (somma mensile — DATI REALI)
DA.PRESENZE_EST = {};
DA.CDC_KEYS.forEach(k => {
  DA.PRESENZE_EST[k] = DA.sum(DA.PRESENZE_M[k] || []);
});

// ── ALLEGATO A COMPLETO — Dotazione minima personale per scaglione ospiti ──
// Fonte: Capitolato CAS — Allegato A — stesso del DICT_COLLETTIVI/DICT_SUA (specialisti.py)
// Campi per fascia:
//   OpD_h_g  = Operatori Diurni h/giorno
//   OpN_h_g  = Operatori Notturni h/giorno
//   MedP_h_g = Medico Pronta Disponibilità h/giorno
//   Dir_h_s  = Direttore h/settimana
//   Amm_h_s  = Amministrativo h/settimana
//   Inf_h_s  = Infermiere h/settimana
//   Med_h_s  = Medico h/settimana
//   Soc_h_s  = Operatore Sociale h/settimana
//   MedL_h_s = Mediatore Linguistico h/settimana

// ── ALLEGATO A — DOTAZIONE MINIMA CAS (dati reali da Zoho Creator) ──────────
// Fonte: Dotazione Minima Cas.xlsx + Scaglioni Dotazione Report.xlsx (Aprile 2026)
//
// UNITÀ DI MISURA nel capitolato originale:
//   h/giorno  → OpD, OpN  (turnisti: il capitolato esprime già ore di copertura/giorno)
//   h/settimana → Dir, Amm, Inf, Med (effettivo), Soc, MedL
//               → i valori qui sono GIÀ divisi per 7 → h/giorno per uniformità
//               → es: Dir CC 50 posti = 8 h/sett ÷ 7 = 1.15 h/g
//               → es: Soc CC 800 posti = 144 h/sett ÷ 7 = 20.57 h/g (typo Zoho: era 2.58)
//
// rep (reperibilità / pronta disponibilità):
//   NON sono ore lavorate — il lavoratore deve essere rintracciabile e disponibile,
//   ma non è in servizio attivo. Retribuite a tariffa ridotta (DA.REP_COEFF × euro_h).
//   Nel capitolato espresse in h/giorno di reperibilità.
//   Riguardano: Med CC ≤50 posti, Med CD (tutte le fasce), OpN CD (tutte le fasce).
//
// Struttura: {p: max_posti_scaglione, h: h_effettive/g, rep: h_reperibilità/g}
// Lookup: trova primo scaglione con p >= posti_struttura

DA.ALLEGATO_A = {
  CC: {
    // OpD — Operatore Diurno
    // Capitolato: h/giorno (ore di copertura turno diurno/giorno)
    OpD:  [{p:10,h:8},{p:20,h:8},{p:30,h:10},{p:40,h:10},{p:50,h:12},{p:75,h:18},
           {p:100,h:24},{p:150,h:36},{p:200,h:40},{p:250,h:44},{p:300,h:48},
           {p:350,h:52},{p:400,h:56},{p:450,h:60},{p:500,h:64},{p:550,h:68},
           {p:600,h:72},{p:650,h:76},{p:700,h:78},{p:750,h:84},{p:800,h:88},
           {p:850,h:92},{p:900,h:96}],
    // OpN — Operatore Notturno
    // Capitolato: h/giorno (ore turno notturno/giorno) — previsto solo da 75 posti
    // Sotto 75 posti: 0h (entry esplicite per lookup corretto via getAllegatoH)
    OpN:  [{p:10,h:0},{p:20,h:0},{p:30,h:0},{p:40,h:0},{p:50,h:0},
           {p:75,h:8},{p:100,h:12},{p:300,h:16},{p:450,h:20},
           {p:600,h:24},{p:750,h:28},{p:900,h:32}],
    // Dir — Direttore
    // Capitolato: h/settimana → qui convertite ÷7 → h/giorno
    // es: 50 posti = 8 h/sett → 8/7 = 1.15 h/g; 900 posti = 39 h/sett → 5.58 h/g
    Dir:  [{p:20,h:0.58},{p:40,h:0.86},{p:50,h:1.15},{p:75,h:1.43},{p:100,h:1.72},
           {p:150,h:3.43},{p:200,h:3.58},{p:250,h:3.72},{p:300,h:3.86},{p:350,h:4.00},
           {p:400,h:4.15},{p:450,h:4.29},{p:500,h:4.43},{p:550,h:4.58},{p:600,h:4.72},
           {p:650,h:4.86},{p:700,h:5.00},{p:750,h:5.15},{p:800,h:5.29},{p:850,h:5.43},
           {p:900,h:5.58}],
    // Amm — Amministrativo
    // Capitolato: h/settimana → qui ÷7 → h/giorno; 0 fino a 50 posti
    Amm:  [{p:10,h:0},{p:20,h:0},{p:30,h:0},{p:40,h:0},{p:50,h:0},
           {p:75,h:0.86},{p:100,h:1.15},{p:150,h:2.00},{p:200,h:2.29},{p:250,h:2.58},
           {p:300,h:2.86},{p:350,h:3.15},{p:400,h:3.43},{p:450,h:3.72},{p:500,h:4.00},
           {p:550,h:4.29},{p:600,h:4.58},{p:650,h:4.86},{p:700,h:5.15},{p:750,h:5.43},
           {p:800,h:5.72},{p:850,h:6.00},{p:900,h:6.29}],
    // Inf — Infermiere
    // Capitolato: h/settimana → qui ÷7 → h/giorno; 0 fino a 50 posti
    Inf:  [{p:10,h:0},{p:20,h:0},{p:30,h:0},{p:40,h:0},{p:50,h:0},
           {p:75,h:1.72},{p:100,h:2.58},{p:150,h:3.43},{p:200,h:4.29},{p:250,h:5.15},
           {p:300,h:6.00},{p:350,h:6.86},{p:400,h:7.72},{p:450,h:8.58},{p:500,h:9.43},
           {p:550,h:10.29},{p:600,h:11.15},{p:650,h:12.00},{p:700,h:12.86},{p:750,h:13.72},
           {p:800,h:14.58},{p:850,h:15.43},{p:900,h:16.29}],
    // Med — Medico
    // Capitolato: h/settimana → qui ÷7 → h/giorno (campo h = ore effettive, da 75 posti)
    // rep = ore reperibilità/pronta disponibilità h/giorno (≤50 posti):
    //   NON ore lavorate — il medico deve essere rintracciabile, retribuito a tariffa ridotta
    Med:  [{p:20,h:0,rep:2},{p:40,h:0,rep:3},{p:50,h:0,rep:4},
           {p:75,h:2.00,rep:0},{p:100,h:2.29,rep:0},{p:150,h:2.86,rep:0},
           {p:200,h:3.15,rep:0},{p:250,h:3.43,rep:0},{p:300,h:3.72,rep:0},
           {p:350,h:4.00,rep:0},{p:400,h:4.29,rep:0},{p:450,h:4.56,rep:0},
           {p:500,h:4.86,rep:0},{p:550,h:5.15,rep:0},{p:600,h:5.43,rep:0},
           {p:650,h:5.72,rep:0},{p:700,h:6.00,rep:0},{p:750,h:6.29,rep:0},
           {p:800,h:6.58,rep:0},{p:850,h:6.86,rep:0},{p:900,h:7.15,rep:0}],
    // Soc — Operatore Sociale
    // Capitolato: h/settimana → qui ÷7 → h/giorno
    // NOTA: 800 posti corretto 2.58→20.57 (typo Zoho; descrizione "144h/sett" = 144/7 = 20.57)
    Soc:  [{p:10,h:2.00},{p:20,h:2.58},{p:30,h:3.14},{p:40,h:3.43},{p:50,h:3.72},
           {p:75,h:4.00},{p:100,h:4.58},{p:150,h:5.72},{p:200,h:6.86},{p:250,h:8.00},
           {p:300,h:9.15},{p:350,h:10.29},{p:400,h:11.43},{p:450,h:12.58},{p:500,h:13.72},
           {p:550,h:14.86},{p:600,h:16.00},{p:650,h:17.15},{p:700,h:18.29},{p:750,h:19.43},
           {p:800,h:20.57},{p:850,h:21.72},{p:900,h:22.86}],
    // MedL — Mediatore Linguistico
    // Capitolato: h/settimana → qui ÷7 → h/giorno
    MedL: [{p:10,h:0.86},{p:20,h:1.15},{p:30,h:1.43},{p:40,h:1.72},{p:50,h:2.00},
           {p:75,h:2.43},{p:100,h:2.86},{p:150,h:3.72},{p:200,h:4.58},{p:250,h:5.43},
           {p:300,h:6.29},{p:350,h:7.15},{p:400,h:8.00},{p:450,h:8.86},{p:500,h:9.72},
           {p:550,h:10.58},{p:600,h:11.43},{p:650,h:12.29},{p:700,h:13.15},{p:750,h:14.00},
           {p:800,h:14.86},{p:850,h:15.72},{p:900,h:16.58}],
  },
  CD: {
    // Centro Diffuso / SUA / CAD — max 50 posti per singola struttura
    // OpD — Operatore Diurno: h/giorno (capitolato: h/giorno direttamente)
    OpD:  [{p:10,h:8},{p:20,h:9},{p:30,h:11},{p:40,h:12},{p:50,h:14}],
    // OpN — Operatore Notturno CD: solo reperibilità/pronta disponibilità
    // NON ore lavorate — operatore reperibile ma non in turno notturno fisso
    // rep = h/giorno di pronta disponibilità, retribuita a DA.REP_COEFF × euro_h
    OpN:  [{p:50,h:0,rep:8}],
    // Dir — Direttore: h/settimana → qui ÷7 → h/giorno
    Dir:  [{p:10,h:0.58},{p:20,h:0.72},{p:30,h:1.00},{p:40,h:1.15},{p:50,h:1.43}],
    // Med — Medico CD: solo reperibilità per tutti gli scaglioni
    // rep = h/giorno pronta disponibilità (non ore lavorate, tariffa ridotta)
    Med:  [{p:20,h:0,rep:2},{p:40,h:0,rep:3},{p:50,h:0,rep:4}],
    // Soc — Operatore Sociale: h/settimana → qui ÷7 → h/giorno
    Soc:  [{p:10,h:2.29},{p:20,h:2.86},{p:30,h:3.43},{p:40,h:4.00},{p:50,h:4.58}],
    // MedL — Mediatore Linguistico: h/settimana → qui ÷7 → h/giorno
    MedL: [{p:10,h:1.15},{p:20,h:1.72},{p:30,h:2.29},{p:40,h:2.86},{p:50,h:3.43}],
    Amm:  [],   // non previsto in CD (0 per tutti gli scaglioni)
    Inf:  [],   // non previsto in CD (0 per tutti gli scaglioni)
  },
};

// ── REPERIBILITÀ / PRONTA DISPONIBILITÀ — DATI REALI ZOHO ───────────────────
// Le ore "rep" del capitolato NON sono ore lavorate: il lavoratore è rintracciabile
// e disponibile ma non in servizio attivo. CCNL Coop Sociali: retribuita con
// INDENNITÀ FISSA per turno di disponibilità (es. €25,82 per 24h), non a tariffa oraria.
// Quando viene chiamato in servizio durante la reperibilità, le ore lavorate sono
// pagate con maggiorazione (15% diurna feriale, 30% notturna/festiva).
//
// Fonte: zoho "Costo Personale (Zoho Creator)" colonne:
//   REPERIBILITA      (turni di disponibilità)
//   Indenn.Rep.       (€ indennità fissa)
//   Str.15%Rep.D.     (€ maggiorazione diurna chiamate)
//   Str.30% Rep.Nott. (€ maggiorazione notturna chiamate)
// Query verificata: vedi skill zoho-analytics §5 "Costo reperibilità per CdC"
//
// Totale cooperativa 2025: €38.520 (di cui €25.022 indennità + €13.498 maggiorazioni)
// 4.626 ore reperibili erogate (tabella "Ripartizione Ore Organico") = capacità capitolato

// Costo reperibilità annuo per CdC (€) — verificato da Zoho 2025
DA.REPERIBILITA_COSTI_2025 = {
  MODENA:  30853.62,   // 606 turni rep — ind:€17405 + str:€13449 — coperture mediche+OpN
  RIETI:    5896.67,   // 238 turni rep — ind:€5847 + str:€49 — 1 CD 100 posti
  DROSSO:   1656.76,   // 63 turni rep  — ind:€1657 (no straordinari)
  PISA:        0,      // CC grande (250 posti): medico in effettivo, no reperibilità
  LORANZE:     0,      // CC 90 posti: medico in effettivo
  VICENZA:     0,      // CD 50 posti: dato non presente in NC 2025 (verificare)
  VICO:        0,      // SUA 32 posti: dato non presente in NC 2025 (verificare)
  CAMBO:       0,      // CC 100 posti: attivo da Ago 2025, dato parziale
};

// Coefficiente di fallback: rapporto medio reale Modena (3,7%) e Rieti (7,4%) = ~5%
// Usato solo se REPERIBILITA_COSTI_2025[cdc] è 0 o mancante.
DA.REP_COEFF = 0.05;  // 5% del costo orario ordinario (vs €/h piena erronea)

// Calcola €/h equivalente per ore di reperibilità del capitolato per un CdC
// Strategia: usa il dato reale Zoho se disponibile, altrimenti coeff sul costo ordinario
DA.getEuroHRep = function(cdc_key, ore_rep_g_capitolato, euro_h_ord) {
  const costo_anno = DA.REPERIBILITA_COSTI_2025?.[cdc_key] || 0;
  if (costo_anno > 0 && ore_rep_g_capitolato > 0) {
    // €/h reale = costo annuo / ore rep capitolato annue (h/g × 365)
    return +(costo_anno / (ore_rep_g_capitolato * 365)).toFixed(3);
  }
  // Fallback CCNL: percentuale del costo orario ordinario
  return +(euro_h_ord * DA.REP_COEFF).toFixed(3);
};

// Lookup: ore per mansione dato posti e tipo struttura
// posti = CAPACITÀ AUTORIZZATA della singola struttura (non ospiti medi, non totale CdC)
// tipo accettato: 'CC' | 'CD' | 'SUA' | 'CAD' (gli ultimi 3 → tabella CD)
// Ritorna {h: ore_effettive_h/g, rep: ore_reperibilità_h/g}
DA.getAllegatoH = function(posti, tipo, mansione) {
  const t = (tipo === 'CD' || tipo === 'SUA' || tipo === 'CAD') ? 'CD' : 'CC';
  const tab = (DA.ALLEGATO_A[t] || {})[mansione] || [];
  if (!tab.length) return {h:0, rep:0};
  for (const row of tab) { if (posti <= row.p) return {h: row.h || 0, rep: row.rep || 0}; }
  const last = tab[tab.length - 1];
  return {h: last.h || 0, rep: last.rep || 0};
};

// Calcola ore giornaliere per una singola struttura (posti = capacità autorizzata)
// Returns {eff, rep, breakdown} — eff=ore effettive, rep=ore reperibilità
DA.calcOreStruttura = function(posti, tipo) {
  const mans = ['OpD','OpN','Dir','Amm','Inf','Med','Soc','MedL'];
  const breakdown = {};
  let eff = 0, rep = 0;
  mans.forEach(m => {
    const r = DA.getAllegatoH(posti, tipo, m);
    breakdown[m] = r;
    eff += r.h; rep += r.rep;
  });
  return {eff: +eff.toFixed(2), rep: +rep.toFixed(2), breakdown};
};

// Calcola ore totali per un CdC composto da più centri (Allegato A per centro)
// strutture accetta DUE formati:
//   - lista esplicita: [{nome, posti, tipo}, ...]  ← consigliato (1 entry = 1 centro)
//   - lista aggregata: [{n, posti, tipo}, ...]      ← legacy (n centri stesso tipo)
// Returns {eff, rep, breakdown} — breakdown: array per centro con dettaglio mansioni
DA.calcOreCdc = function(strutture) {
  let totEff = 0, totRep = 0;
  const breakdown = [];
  (strutture || []).forEach(s => {
    const r = DA.calcOreStruttura(s.posti, s.tipo);
    const n = s.n || 1;
    totEff += r.eff * n;
    totRep += r.rep * n;
    breakdown.push({
      nome: s.nome || '?', n, posti:s.posti, tipo:s.tipo,
      ore_eff:r.eff, ore_rep:r.rep, mansioni:r.breakdown,
    });
  });
  return {eff: +totEff.toFixed(2), rep: +totRep.toFixed(2), breakdown};
};

// Simulazione aggregazione centri — risponde a:
// "Se MODENA fosse un unico CC da 450 posti, quante ore richiederebbe vs. 9 CC da 50?"
// strutture_attuali = [{n,posti,tipo}, ...] | tipo_aggregato = 'CC'|'CD' | euro_h | ospiti_medi
// euro_h     = costo orario pieno €/h (ore lavorate effettive)
// euro_h_rep = costo orario reperibilità (default: DA.REP_COEFF × euro_h)
//              → per dato reale Zoho passa DA.getEuroHRep(cdc_key, ore_rep_g, euro_h)
DA.simulaAggregazioneCentri = function(strutture_attuali, tipo_aggregato, euro_h, ospiti_medi, euro_h_rep) {
  const ore_att   = DA.calcOreCdc(strutture_attuali);
  const posti_tot = strutture_attuali.reduce((s,x) => s + x.posti * (x.n || 1), 0);
  const ore_agg   = DA.calcOreStruttura(posti_tot, tipo_aggregato);
  const eh        = euro_h || 18.00;
  const eh_rep    = euro_h_rep != null ? euro_h_rep : eh * DA.REP_COEFF;
  const osp       = ospiti_medi || posti_tot;

  // Costo giornaliero: ore effettive a tariffa piena + reperibilità a tariffa ridotta
  const cg_att = +(ore_att.eff * eh + ore_att.rep * eh_rep).toFixed(2);
  const cg_agg = +(ore_agg.eff * eh + ore_agg.rep * eh_rep).toFixed(2);

  return {
    attuali:  {strutture:strutture_attuali,
                ore_eff_g:ore_att.eff, ore_rep_g:ore_att.rep,
                costo_g:cg_att, costo_prodie:+(cg_att/osp).toFixed(3)},
    aggregato:{n_strutture:1, posti_totali:posti_tot, tipo:tipo_aggregato,
                ore_eff_g:ore_agg.eff, ore_rep_g:ore_agg.rep,
                costo_g:cg_agg, costo_prodie:+(cg_agg/osp).toFixed(3),
                breakdown:ore_agg.breakdown},
    delta_ore_eff_g: +(ore_agg.eff - ore_att.eff).toFixed(2),
    delta_costo_g:   +(cg_agg - cg_att).toFixed(2),
    posti_totali:    posti_tot,
    euro_h_usato:    eh,
    euro_h_rep_usato:eh_rep,
    risparmio_pct:   +(Math.abs(cg_att - cg_agg) / cg_att * 100).toFixed(1),
    aggregazione_conveniente: cg_agg < cg_att,
  };
};

// ── Backward-compatibility shim ───────────────────────────────────────────────
// Le pagine esistenti (05_capitolato.html ecc.) usano le API legacy
(function(){
  const CC_P = [10,20,30,40,50,75,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900];
  DA.ALLEGATO_A_CC_FULL = CC_P.map((p,i) => {
    const prev = i === 0 ? 1 : CC_P[i-1] + 1;
    const f = m => DA.getAllegatoH(p,'CC',m);
    return { min:prev, max:p,
      OpD_h_g:f('OpD').h, OpN_h_g:f('OpN').h, MedP_h_g:f('Med').rep,
      Dir_h_s:+(f('Dir').h*7).toFixed(2),  Amm_h_s:+(f('Amm').h*7).toFixed(2),
      Inf_h_s:+(f('Inf').h*7).toFixed(2),  Med_h_s:+(f('Med').h*7).toFixed(2),
      Soc_h_s:+(f('Soc').h*7).toFixed(2),  MedL_h_s:+(f('MedL').h*7).toFixed(2),
    };
  });
  const CD_P = [10,20,30,40,50];
  DA.ALLEGATO_A_SUA_FULL = CD_P.map((p,i) => {
    const prev = i === 0 ? 1 : CD_P[i-1] + 1;
    const f = m => DA.getAllegatoH(p,'SUA',m);
    return { min:prev, max:p,
      OpD_h_g:f('OpD').h, OpN_h_g:0, MedP_h_g:f('Med').rep,
      Dir_h_s:+(f('Dir').h*7).toFixed(2), Amm_h_s:0, Inf_h_s:0, Med_h_s:0,
      Soc_h_s:+(f('Soc').h*7).toFixed(2), MedL_h_s:+(f('MedL').h*7).toFixed(2),
    };
  });
})();
DA.ALLEGATO_A_CC  = DA.ALLEGATO_A_CC_FULL.map(f => ({min:f.min, max:f.max, ore_g:f.OpD_h_g}));
DA.ALLEGATO_A_CAD = DA.ALLEGATO_A_CC;

DA.getFasciaOre = function(osp, tipo='CC'){
  const tab = (tipo==='SUA') ? DA.ALLEGATO_A_SUA_FULL : DA.ALLEGATO_A_CC_FULL;
  for(const f of tab){ if(osp>=f.min && osp<=f.max) return f.OpD_h_g; }
  return tab[tab.length-1].OpD_h_g;
};
DA.getFasciaAllegatoA = function(ospiti, tipo='CC'){
  const tab = (tipo==='SUA') ? DA.ALLEGATO_A_SUA_FULL : DA.ALLEGATO_A_CC_FULL;
  for(const f of tab){ if(ospiti>=f.min && ospiti<=f.max) return f; }
  return tab[tab.length-1];
};
DA.calcOreGiornoAllegatoA = function(fascia){
  if(!fascia) return 0;
  const daily  = (fascia.OpD_h_g||0) + (fascia.OpN_h_g||0) + (fascia.MedP_h_g||0);
  const weekly = (fascia.Dir_h_s||0)+(fascia.Amm_h_s||0)+(fascia.Inf_h_s||0)
               + (fascia.Med_h_s||0)+(fascia.Soc_h_s||0)+(fascia.MedL_h_s||0);
  return +(daily + weekly/7).toFixed(2);
};

// Ospiti medi giornalieri per CdC (da presenze reali)
DA.OSPITI_MEDI = {};
DA.CDC_KEYS.forEach(k => {
  DA.OSPITI_MEDI[k] = Math.round((DA.PRESENZE_EST[k] || 0) / 365);
});

// Ospiti medi ATTIVI: media solo sui mesi con presenze > 0
// Risolve la distorsione su CdC parzialmente operativi (es. CAMBO attivo solo Ago-Dic 2025)
DA.OSPITI_MEDI_ATTIVI = {};
DA.CDC_KEYS.forEach(k => {
  const m = DA.PRESENZE_M[k] || [];
  const attivi = m.filter(v => v > 0);
  const giorni_mese = 30.4;
  DA.OSPITI_MEDI_ATTIVI[k] = attivi.length
    ? Math.round(attivi.reduce((s,v)=>s+v,0) / (attivi.length * giorni_mese))
    : 0;
});

// Helper: numero centri reali (Allegato A)
DA.getNumeroCentri = function(k){ return (DA.CDC_STRUTTURE[k] || []).length; };
// Helper: posti totali reali per CdC (somma su tutti i centri)
DA.getPostiTotali = function(k){
  return (DA.CDC_STRUTTURE[k] || []).reduce((s,c) => s + (c.posti||0), 0);
};
// Helper: ospiti medi adattivo — usa "attivi" se CdC parzialmente operativo, altrimenti standard
DA.getOspMediAdaptive = function(k){
  const standard = DA.OSPITI_MEDI[k] || 0;
  const attivi   = DA.OSPITI_MEDI_ATTIVI[k] || 0;
  const posti    = DA.getPostiTotali(k);
  // Se il riempimento standard < 50% E attivi > standard*1.5 → uso attivi (CdC nuovo)
  if (posti > 0 && standard/posti < 0.5 && attivi > standard * 1.5) {
    return attivi;
  }
  return standard;
};

// ── ORE EROGATE MENSILI — distribuzione proporzionale per presenze ─
// Totale annuo da Zoho "Costi orari CAS"; distribuzione per peso presenze
DA.ORE_M = {};
DA.CDC_KEYS.forEach(k => {
  const costiH = DA.COSTI_ORE[k];
  if(!costiH){ DA.ORE_M[k] = Array(12).fill(0); return; }
  const presM   = DA.PRESENZE_M[k] || Array(12).fill(0);
  const totPres = DA.sum(presM);
  const totOre  = costiH.ore;
  DA.ORE_M[k] = presM.map(p => totPres > 0 ? Math.round(totOre * p / totPres) : 0);
});

// ── INDICE DI CONFORMITÀ — da Zoho (per strutture MODENA) ─
DA.CONFORMITA_STRUTTURE = [
  {nome:'AMARI P1',          val:55},
  {nome:'AMARI P2',          val:62},
  {nome:'AMARI PTERRA',      val:29},
  {nome:'BAGGIOVARA SA',     val:48},
  {nome:'COSTELLAZIONI',     val:45},
  {nome:'EMILIA 1200',       val:21},
  {nome:'FORMIGINE LEONARDI',val:83},
  {nome:'SAN FAUSTINO P1',   val:36},
  {nome:'SAN FAUSTINO P2',   val:79},
  {nome:'VIA GIARDINI',      val:43},
  {nome:'VIGNOLA BATTISTI',  val:71},
];

// Indice di conformità per CdC
// NOTA: dati conformità disponibili SOLO per MODENA IMMIGRAZIONE (ispezioni strutture)
// Tutti gli altri CdC: N/D — non rilevato in Zoho Analytics
DA.CONFORMITA_CDC = {
  PISA:    null,  // N/D — non disponibile in Zoho
  RIETI:   null,  // N/D
  DROSSO:  null,  // N/D
  LORANZE: null,  // N/D
  VICENZA: null,  // N/D
  MODENA:  55,    // media reale strutture da Zoho "Indice di Conformità per Centro"
  VICO:    null,  // N/D
  CAMBO:   null,  // N/D
};

// ── FUNZIONI UTILITY — già definite all'inizio del file ──

DA.reddPct = (f,c) => f>0 ? ((f-c)/f*100).toFixed(1) : null;

DA.totFattAnno = function(anno=2025){
  return DA.CDC_ACTIVE.reduce((s,k)=>{
    const d=DA.REDD[k]; return s+DA.sum(d.f);
  },0);
};
DA.totCostiAnno = function(anno=2025){
  return DA.CDC_ACTIVE.reduce((s,k)=>{
    const d=DA.REDD[k]; return s+DA.sum(d.c);
  },0);
};

DA.getColor = function(k){
  return DA.CDC[k]?.color || '#999';
};

// Genera palette colori per Chart.js
DA.palette = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899','#06b6d4','#ef4444','#6366f1'];
DA.paletteAlpha = (arr,a=0.25)=>arr.map(c=>{
  const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
});

// Default Chart.js global config
DA.chartDefaults = function(Chart){
  Chart.defaults.color           = '#8ca0bc';
  Chart.defaults.borderColor     = '#1e2d4a';
  Chart.defaults.font.family     = "'Segoe UI', system-ui, sans-serif";
  Chart.defaults.font.size       = 11;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.padding  = 14;
  Chart.defaults.plugins.tooltip.backgroundColor= '#0d1526';
  Chart.defaults.plugins.tooltip.borderColor    = '#1e2d4a';
  Chart.defaults.plugins.tooltip.borderWidth    = 1;
  Chart.defaults.plugins.tooltip.padding        = 10;
  Chart.defaults.plugins.tooltip.titleColor     = '#e8edf5';
  Chart.defaults.plugins.tooltip.bodyColor      = '#8ca0bc';
};

DA.mkChart = function(id, cfg){
  const ctx = document.getElementById(id);
  if(!ctx) return null;
  // Chart.js 4.x: destroy existing chart on this canvas
  const existing = Chart.getChart(ctx);
  if(existing) existing.destroy();
  return new Chart(ctx, cfg);
};

// ═══════════════════════════════════════════════════════════
// DATI 2026 — Presenze forecast da Zoho "Andamento presenze"
// Fonte: modello previsionale Zoho (AnalysisView) — Apr 2026
// I valori sono stime/previsioni, non dati consuntivati
// ═══════════════════════════════════════════════════════════
DA.PRESENZE_M_2026 = {
  // Dati reali da Zoho AnalysisView (Gen–Nov 2026), Dic stimato — aggiornato 2026-04-28
  PISA:    [8820, 8179, 8278, 8297, 8682, 8615, 8804, 9587, 9598, 9720, 9441, 9200],
  RIETI:   [2881, 2871, 3123, 3182, 3056, 3097, 3318, 3367, 3441, 3184, 3330, 3200],
  DROSSO:  [9506, 8342, 9621, 8568, 9662, 8851, 9646, 9185, 9587, 9547, 9503, 9300], // no Zoho view — mantenuto
  LORANZE: [2320, 2464, 2811, 3284, 3163, 2900, 3034, 2956, 2580, 2723, 3070, 2800],
  VICENZA: [4595, 4419, 4560, 4512, 4587, 4599, 4703, 4980, 5014, 5324, 5286, 5100],
  MODENA:  [21741,22444,22300,26572,27731,25966,26468,25138,25841,25697,29969,24000],
  VICO:    [455,  395,  430,  376,  406,  357,  382,  338,  358,  318,  335,  320],  // no Zoho view — mantenuto
  CAMBO:   [1036,  879,  938,  794,  850,  850,  850,  850,  850,  850,  850,  850], // Gen–Apr reali, Mag–Dic stimati
};

DA.PRESENZE_EST_2026 = {};
DA.CDC_KEYS.forEach(k => {
  DA.PRESENZE_EST_2026[k] = DA.sum(DA.PRESENZE_M_2026[k] || []);
});

DA.OSPITI_MEDI_2026 = {};
DA.CDC_KEYS.forEach(k => {
  DA.OSPITI_MEDI_2026[k] = Math.round((DA.PRESENZE_EST_2026[k] || 0) / 365);
});

// ORE 2026 — stessa distribuzione proporzionale del 2025 (no nuovi dati Zoho)
DA.ORE_M_2026 = {};
DA.CDC_KEYS.forEach(k => {
  const costiH = DA.COSTI_ORE[k];
  if(!costiH){ DA.ORE_M_2026[k] = Array(12).fill(0); return; }
  const presM   = DA.PRESENZE_M_2026[k] || Array(12).fill(0);
  const totPres = DA.sum(presM);
  const totOre  = costiH.ore;
  DA.ORE_M_2026[k] = presM.map(p => totPres > 0 ? Math.round(totOre * p / totPres) : 0);
});

// REDD_2026 e ANNO2026 sono definiti sopra (riga ~165) con dati reali Zoho Gen-Feb 2026
// + forecast Mar-Apr. NON re-inizializzare a 0 (legacy code rimosso 11/05/2026).

// ── HELPER MULTI-ANNO ─────────────────────────────────────
DA.getPresenzeM = function(anno){ return anno===2026 ? DA.PRESENZE_M_2026 : DA.PRESENZE_M; };
DA.getPresenzeEst = function(anno){ return anno===2026 ? DA.PRESENZE_EST_2026 : DA.PRESENZE_EST; };
DA.getOspMedi = function(anno){ return anno===2026 ? DA.OSPITI_MEDI_2026 : DA.OSPITI_MEDI; };
DA.getOreM = function(anno){ return anno===2026 ? DA.ORE_M_2026 : DA.ORE_M; };
DA.getRedd = function(anno){ return anno===2026 ? DA.REDD_2026 : DA.REDD; };
DA.getAnnoData = function(anno){ return anno===2026 ? DA.ANNO2026 : DA.ANNO2025; };
DA.is2026forecast = function(anno){ return anno===2026; };

// ═══════════════════════════════════════════════════════════
// MALATTIE & ASSENTEISMO
// Fonte: Zoho "ANALISI MALATTIE ED INFORTUNI" e "Analisi Assenteismo"
// ═══════════════════════════════════════════════════════════

// Incidenza ore lavorate per CdC (1 = assenza 0%, valore più basso = più assenze)
// Formula: % assenza = (1 - incidenza) * 100
DA.INCIDENZA_ORE = {
  PISA:    0.9602,   // 3.98% assenza
  RIETI:   0.9542,   // 4.58% assenza
  DROSSO:  0.9224,   // 7.76% assenza
  LORANZE: 0.8942,   // 10.58% assenza
  VICENZA: 0.9143,   // 8.57% assenza
  MODENA:  0.8661,   // 13.39% assenza
  VICO:    0.8249,   // 17.51% assenza
  CAMBO:   0.8131,   // 18.69% assenza
};

// Tasso assenza TOTALE per CdC (TUTTE le cause: malattia, ferie, permessi…)
// Fonte: ANALISI MALATTIE ED INFORTUNI — Avg INCIDENZA ORE LAVORATE
// pct_assenza_tot = incidenza assenze sul totale ore lavorate (storico Zoho)
// NOTA IMPORTANTE: maternità/congedo NON è assenteismo → campo ore_maternita
// separato, NON incluso in pct_assenza_tot. Infortuni e susp. disciplinare esclusi.
// CAMBO ore_maternita = 0: nessun dipendente in congedo maternità a Campobasso (conf. 29/04/2026)
DA.MALATTIA_CDC = {
  PISA:    { pct_assenza_tot:3.98,  pct_malattia:null, ore_malattia: null, ore_maternita: 420 },
  RIETI:   { pct_assenza_tot:4.58,  pct_malattia:null, ore_malattia: null, ore_maternita: 180 },
  DROSSO:  { pct_assenza_tot:7.76,  pct_malattia:null, ore_malattia: null, ore_maternita: 520 },
  LORANZE: { pct_assenza_tot:10.58, pct_malattia:null, ore_malattia: null, ore_maternita: 310 },
  VICENZA: { pct_assenza_tot:8.57,  pct_malattia:null, ore_malattia: null, ore_maternita: 380 },
  MODENA:  { pct_assenza_tot:13.39, pct_malattia:null, ore_malattia: null, ore_maternita:3250 },
  VICO:    { pct_assenza_tot:17.51, pct_malattia:null, ore_malattia: null, ore_maternita: 720 },
  CAMBO:   { pct_assenza_tot:18.69, pct_malattia:null, ore_malattia: null, ore_maternita:   0 }, // nessuna maternità
};
// Campo pct_assenza per retrocompatibilità — usa pct_assenza_tot
Object.keys(DA.MALATTIA_CDC).forEach(k=>{ DA.MALATTIA_CDC[k].pct_assenza = DA.MALATTIA_CDC[k].pct_assenza_tot; });

// ── ASSENTEISMO VERO (MA, MO, MZ, MB, AI) — fonte: Analisi Assenteismo -Dettaglio ──────────────
// NON inclusi: Infortuni (INAIL), Sospensione Disciplinare, Ferie, Maternità, Permessi vari
// Totale "vero assenteismo" cooperativa: 45.947 ore storico
DA.ASSENTEISMO_VERO = [
  { tipo:'Malattia (MA)',               ore:42095, ore_ret:15642, codice:'MA' },
  { tipo:'Malattia in Prova NR (MZ)',   ore: 1905, ore_ret:  539, codice:'MZ' },
  { tipo:'Malattia Ospedaliera (MO)',   ore:  933, ore_ret:  766, codice:'MO' },
  { tipo:'Perm. Malattia Bimbo (MB)',   ore:  647, ore_ret:  149, codice:'MB' },
  { tipo:'Assenza Ingiustificata (AI)', ore:  368, ore_ret:   71, codice:'AI' },
];

// ── ALTRE ASSENZE (non assenteismo) — fonte: Analisi Assenteismo -Dettaglio ────────────────────
DA.ASSENTEISMO_TIPI = [
  // Assenze pianificate / contrattualmente previste
  { tipo:'Ferie',                    ore:86873,  ore_ret:29072, cat:'pianificata' },
  { tipo:'Perm. Ex Festività',       ore:66654,  ore_ret:11364, cat:'pianificata' },
  { tipo:'Ore Formazione Obblig.',   ore:18498,  ore_ret: 2387, cat:'pianificata' },
  { tipo:'Ore Riunione',             ore:15363,  ore_ret: 1538, cat:'pianificata' },
  { tipo:'Banca Ore Goduta',         ore: 8321,  ore_ret: 4900, cat:'pianificata' },
  { tipo:'Assemblea Sindacale',      ore: 5907,  ore_ret:  982, cat:'pianificata' },
  { tipo:'Perm. Legge 104 (gg)',     ore: 4359,  ore_ret: 4181, cat:'pianificata' },
  { tipo:'Sciopero',                 ore: 3533,  ore_ret:  774, cat:'pianificata' },
  { tipo:'Perm. per Esami',          ore: 2219,  ore_ret:  849, cat:'pianificata' },
  { tipo:'Ore Corso',                ore: 1194,  ore_ret:  199, cat:'pianificata' },
  { tipo:'Donazione Sangue',         ore: 1222,  ore_ret:  535, cat:'pianificata' },
  { tipo:'Permesso Elettorale',      ore: 1739,  ore_ret:  376, cat:'pianificata' },
  { tipo:'Permesso Studio',          ore: 1313,  ore_ret:  727, cat:'pianificata' },
  { tipo:'Permesso Sindacale',       ore: 1446,  ore_ret:  325, cat:'pianificata' },
  { tipo:'Congedo Matrimoniale',     ore:  788,  ore_ret:  656, cat:'pianificata' },
  { tipo:'Congedo Padre',            ore:  457,  ore_ret:  157, cat:'pianificata' },
  { tipo:'Allattamento',             ore:  629,  ore_ret:  301, cat:'pianificata' },
  { tipo:'Permesso Lutto',           ore:  499,  ore_ret:   77, cat:'pianificata' },
  // Assenze non retribuite
  { tipo:'Aspettativa NR',           ore:  821,  ore_ret:  130, cat:'non_retribuita' },
  { tipo:'Permesso NR',              ore:  649,  ore_ret:  326, cat:'non_retribuita' },
  // Maternità (diritto, non assenteismo)
  { tipo:'Maternità Obbligatoria',   ore:  359,  ore_ret: 5724, cat:'maternita' },
  { tipo:'Maternità Facoltativa',    ore:  568,  ore_ret: 1583, cat:'maternita' },
  // Separati — non assenteismo per definizione
  { tipo:'Infortuni (INAIL)',        ore: 2347,  ore_ret: 1709, cat:'infortuni' },
  { tipo:'Sosp. Disciplinare',       ore:  397,  ore_ret:   50, cat:'disciplinare' },
];

// ═══════════════════════════════════════════════════════════
// HR — PERSONALE: ASSUNZIONI, CESSAZIONI, CONTRATTI
// Dati 2025 stimati su base organico Zoho "Costi orari CAS"
// ═══════════════════════════════════════════════════════════
// Fonte: Storico Rapporto (Zoho Creator) — contratti ATTIVI al 28/04/2026
// tot = somma contratti ATTIVI da ORGANICO_ALLEGATO (categorie Allegato A mappate)
// ti/td/pt/app = stima proporzionale su base Storico Rapporto (aggiornare con export dedicato)
DA.HR_CDC = {
  PISA:    { tot:21,  assunti:7,  cessati:4,  ti: 9, td: 9, pt:2, app:1 },
  RIETI:   { tot:16,  assunti:4,  cessati:2,  ti: 7, td: 7, pt:2, app:0 },
  DROSSO:  { tot:20,  assunti:6,  cessati:4,  ti: 9, td: 8, pt:2, app:1 },
  LORANZE: { tot:12,  assunti:3,  cessati:2,  ti: 5, td: 5, pt:1, app:1 },
  VICENZA: { tot:35,  assunti:9,  cessati:5,  ti:14, td:16, pt:4, app:1 },
  MODENA:  { tot:148, assunti:38, cessati:24, ti:58, td:70, pt:15, app:5 },
  VICO:    { tot: 9,  assunti:2,  cessati:1,  ti: 4, td: 4, pt:1, app:0 },
  CAMBO:   { tot: 4,  assunti:2,  cessati:1,  ti: 2, td: 2, pt:0, app:0 },
};
// Legenda: ti=Tempo Indeterminato, td=Tempo Determinato, pt=Part-time, app=Apprendistato

// Trend mensile assunzioni/cessazioni 2025 (totale cooperativa)
DA.HR_TREND_M = {
  assunti:  [12, 8, 14, 9, 11, 7, 10, 13, 9, 12, 8, 2],
  cessati:  [6,  5,  8, 6,  7, 4,  5,  9, 7,  8, 7, 1],
};

// ═══════════════════════════════════════════════════════════
// STATUS OSPITI — STATI GIURIDICI
// Fonte REALE: Zoho Creator "Storico Giuridico" — aprile 2026
// Metodologia: record più recente per ospite (2.012 ospiti totali)
// Categorie:
//   in_iter    = Attesa fotosegnalamento/C3/convocazione CT/esito CT/audizione CT
//   ricorrente = Ricorrente avverso rigetto/manifesta infondatezza/titolo diverso
//   titolare   = Titolare di protezione speciale/sussidiaria/temporanea/rifugiato
//   diniegato  = Diniego
// NOTA: VICO = nessun dato in Storico Giuridico Zoho
//       DROSSO/VICENZA = solo fase iniziale (fotosegnalamento) — dati incompleti
// ═══════════════════════════════════════════════════════════
DA.STATUS_OSPITI = {
  MODENA:  { in_iter: 614, ricorrente: 470, titolare: 122, diniegato:  0, totale: 1206 },
  PISA:    { in_iter: 207, ricorrente:  44, titolare:  20, diniegato: 11, totale:  282 },
  LORANZE: { in_iter:  66, ricorrente:  60, titolare:  14, diniegato:  0, totale:  140 },
  RIETI:   { in_iter: 102, ricorrente:  11, titolare:   6, diniegato:  0, totale:  119 },
  CAMBO:   { in_iter:  99, ricorrente:   3, titolare:   0, diniegato:  0, totale:  102 },
  VICENZA: { in_iter: 138, ricorrente:   0, titolare:   0, diniegato:  0, totale:  138, note:'Solo fase iniziale registrata' },
  DROSSO:  { in_iter:  25, ricorrente:   0, titolare:   0, diniegato:  0, totale:   25, note:'Solo fase iniziale registrata' },
  VICO:    null,  // N/D — nessun record in Storico Giuridico Zoho
};

// Etichette stati giuridici (nuove categorie reali)
DA.STATUS_LABELS = ['In Iter Procedurale', 'Ricorrente', 'Titolare Protezione', 'Diniegato'];
DA.STATUS_KEYS   = ['in_iter', 'ricorrente', 'titolare', 'diniegato'];
// Colori per le 4 categorie: in_iter, ricorrente, titolare, diniegato
DA.STATUS_COLORS = ['#3b82f6','#f59e0b','#10b981','#ef4444'];

// Tempi medi di risoluzione/permanenza (giorni) per stato
DA.TEMPI_STATI = [
  { stato:'Decisione Commissione',   giorni_med:365, min:120, max:730, note:'Dalla presentazione alla 1a decisione' },
  { stato:'Appello (Ricorso)',        giorni_med:330, min: 90, max:720, note:'Dal diniego alla sentenza' },
  { stato:'Revoca Protezione',       giorni_med: 45, min: 30, max: 90, note:'Dalla notifica alla revoca' },
  { stato:'Procedura Allontanamento',giorni_med: 30, min:  7, max: 90, note:'Dal provvedimento all esecuzione' },
  { stato:'Trasferimento tra CdC',   giorni_med: 15, min:  3, max: 45, note:'Dalla richiesta al trasferimento' },
  { stato:'Permanenza Media in CAS', giorni_med:540, min:180, max:1095,note:'Durata media soggiorno' },
];

// Trend mensile ingressi/uscite 2025 (totale cooperativa)
DA.OSPITI_MOVIMENTI_M = {
  ingressi: [28,19,32,25,30,22,18,35,29,31,24, 8],
  uscite:   [15,12,18,20,16,14,10,22,19,17,21, 4],
  allont:   [ 3, 2, 4, 3, 2, 1, 2, 4, 3, 2, 3, 1],
  revoche:  [ 2, 1, 3, 2, 2, 1, 1, 3, 2, 2, 2, 1],
};

// ═══════════════════════════════════════════════════════════
// CONFORMITÀ — dati reali Zoho SOLO per MODENA
// Fonte: "Indice di Conformità per Centro" — Aprile 2026
// Per gli altri CdC: dato non disponibile in Zoho → null in DA.CONFORMITA_CDC
// ═══════════════════════════════════════════════════════════

// Conformità per singola struttura (MODENA — dati reali Zoho)
DA.CONFORMITA_STRUTTURE = [
  {nome:'AMARI P1',             cdc:'CAD5', val:55},
  {nome:'AMARI P2',             cdc:'CAD5', val:62},
  {nome:'AMARI PTERRA',         cdc:'CAD5', val:29},
  {nome:'BAGGIOVARA SA',        cdc:'CC8',  val:48},
  {nome:'BAGGIOVARA SB',        cdc:'CC8',  val:52},
  {nome:'BARBERINI 1P',         cdc:'CAD1', val:52},
  {nome:'BARBERINI 2P',         cdc:'CAD1', val:60},
  {nome:'CASTELFRANCO GAIDELLO',cdc:'CAD1', val:52},
  {nome:'CAST. MARTIRI INT. 1', cdc:'CAD3', val:76},
  {nome:'CAST. MARTIRI INT. 4', cdc:'CAD3', val:69},
  {nome:'CAST. MARTIRI INT. 5', cdc:'CAD3', val:83},
  {nome:'COSTELLAZIONI 2P',     cdc:'CC5',  val:45},
  {nome:'COSTELLAZIONI 3P',     cdc:'CC1',  val:57},
  {nome:'COSTELLAZIONI 4P',     cdc:'CC2',  val:76},
  {nome:'COSTELLAZIONI 5P',     cdc:'CC3',  val:57},
  {nome:'COSTELLAZIONI 8P',     cdc:'CC4',  val:55},
  {nome:'COSTELLAZIONI 9P',     cdc:'CC6',  val:69},
  {nome:'EMILIA 1200',          cdc:'CAD6', val:21},
  {nome:'FORMIGINE LEONARDI P1',cdc:'CAD2', val:83},
  {nome:'MAGELLANO P1',         cdc:'CAD2', val:74},
  {nome:'MAGELLANO P2',         cdc:'CAD2', val:74},
  {nome:'SAN FAUSTINO A601',    cdc:'CAD2', val:36},
  {nome:'SAN FAUSTINO A803',    cdc:'CAD2', val:57},
  {nome:'SAN FAUSTINO A804',    cdc:'CAD2', val:71},
  {nome:'SAN FAUSTINO A807',    cdc:'CAD2', val:79},
  {nome:'SAN FAUSTINO B611',    cdc:'CAD2', val:57},
  {nome:'VIA GIARDINI 1405 1P', cdc:'CC9',  val:43},
  {nome:'VIA GIARDINI 1405 PT', cdc:'CC9',  val:74},
  {nome:'VIA GIARDINI 1411 1P', cdc:'CC9',  val:43},
  {nome:'VIA GIARDINI 1411 PT', cdc:'CC9',  val:50},
  {nome:'VIA MONTEGRAPPA 29',   cdc:'CAD5', val:40},
  {nome:'VIGNOLA BATTISTI P1',  cdc:'CAD4', val:29},
  {nome:'VIGNOLA BATTISTI P2',  cdc:'CAD4', val:43},
  {nome:'VIGNOLA BATTISTI P3',  cdc:'CAD4', val:45},
  {nome:'VIGNOLA MINGHELLI',    cdc:'CAD4', val:71},
];

// ═══════════════════════════════════════════════════════════
// RETTE PREFETTURA PER CdC — DATI REALI DA ZOHO
// Formula: retta = fatturato_annuo / (costi_annui / costo_prodie)
// Fonte: Zoho "Redditività Centri" — elaborazione Aprile 2025
// ═══════════════════════════════════════════════════════════
DA.RETTE_CDC = {
  PISA:    24.70,  // €/prodie — retta Prefettura CAS (verificata da Zoho)
  RIETI:   24.14,  // €/prodie — retta Prefettura CAD (verificata da Zoho)
  DROSSO:  31.20,  // €/prodie — retta Prefettura CC  (verificata da Zoho)
  LORANZE: 31.10,  // €/prodie — retta Prefettura CC  (verificata da Zoho)
  VICENZA: 28.24,  // €/prodie — retta Prefettura CC  (verificata da Zoho)
  MODENA:  35.00,  // €/prodie — stima (fatturazione non in Zoho)
  VICO:    57.00,  // €/prodie — retta contrattuale CIG (€57 CC); NOTA: fatturato Zoho Feb-Giu 2025 incompleto (~€25k/mese mancanti), valore derivato Zoho (32.27) non affidabile
  CAMBO:   35.00,  // €/prodie — stima
};

// Centri soggetti al capitolato Allegato A (CC e SUA/CAD standard)
// DROSSO e VICO esclusi (contratto quadro diverso)
DA.CDC_CAPITOLATO = ['PISA','RIETI','LORANZE','VICENZA','MODENA','CAMBO'];
DA.CDC_NON_CAPITOLATO = {
  DROSSO: 'Contratto quadro diverso — non soggetto all\'Allegato A',
  VICO:   'Contratto quadro diverso — non soggetto all\'Allegato A',
};

// Margine per prodie (retta - costo_reale_prodie)
// Per MODENA: confronto solo indicativo perché c=costo_personale solo (sottostima reale)
// Per CAMBO: dato parziale 5 mesi Ago-Dic 2025
DA.MARGINE_PRODIE = {};
DA.CDC_KEYS.forEach(k => {
  const r = DA.RETTE_CDC[k];
  const c = DA.ANNO2025[k].prodie;
  DA.MARGINE_PRODIE[k] = (c && c > 0) ? +(r - c).toFixed(2) : null;
});

// Presenze "finanziarie" per CdC (derivate da costi / costo_prodie)
DA.PRESENZE_FINAN = {};
DA.CDC_KEYS.forEach(k => {
  const d = DA.ANNO2025[k];
  DA.PRESENZE_FINAN[k] = (d.prodie && d.prodie > 0) ? Math.round(d.c / d.prodie) : 0;
});

// ── COSTO PER CATEGORIA PER PRODIE — DATI REALI ───────────
// Calcolato: COSTI_CAT[k][cat] / PRESENZE_FINAN[k]
// Permette comparazione diretta con retta e con capitolato
DA.COSTO_PRODIE_CAT = {};
(function(){
  const CATS = ['PERSONALE','VITTO','STRUTTURA','UTENZE','MANUTENZIONI',
                'CONSULENTI_ESTERNI','PRODOTTI_IGIENE','SPESE_SANITARIE',
                'MEZZI_TRASPORTO','KIT_VESTITI','COSTI_GENERALI','ALTRO'];
  DA.CDC_KEYS.forEach(k => {
    const pres  = DA.PRESENZE_FINAN[k] || 1;
    const costi = DA.COSTI_CAT[k] || {};
    DA.COSTO_PRODIE_CAT[k] = {};
    CATS.forEach(cat => {
      DA.COSTO_PRODIE_CAT[k][cat] = costi[cat] ? +(costi[cat] / pres).toFixed(3) : 0;
    });
    DA.COSTO_PRODIE_CAT[k].TOTALE = costi.TOTALE ? +(costi.TOTALE / pres).toFixed(3) : 0;
  });
})();

// ── STRUTTURE PER CdC — composizione reale dei centri ─────────────────────
// Ogni entry: { nome, posti, tipo } — UNA entry PER CENTRO (non per immobile)
// Tipo: 'CC' = Centro Collettivo | 'CD' = Centro Diffuso/CAD (rete di appartamenti)
//
// MODELLO GERARCHICO:  CdC → Centro → Immobili
//   • Allegato A è applicato PER CENTRO, NON per immobile
//   • Una CAD/rete di N appartamenti = 1 centro per Allegato A
//   • CC/CAD distinzione: CC = struttura collettiva unica; CAD = rete diffusa di appartamenti
//
// Fonte: Zoho Creator "Anagrafica_Strutture_Report" (app gestione-accoglienza)
//        Aggregati per Centro.ID, capacità = somma posti tutti gli immobili (ATTIVA + DISPONIBILE)
//        Esclude solo strutture DISMESSA. Stato del 16/05/2026.
//
// NOTE:
//   • MODENA: 15 centri totali (9 CC + 6 CAD = 844 posti autorizzati)
//        Include CC4 e tutti i CC con immobili DISPONIBILI (chiusi ma autorizzati)
//   • VICENZA: include "CAS MSNA" (Centro Minori Stranieri Non Accompagnati, 10 posti)
//   • DROSSO + VICO: formalmente FUORI capitolato (contratto quadro diverso)
//        ma inclusi per confronto. Distinzione amministrativa CC="Fragili", CD="Diffusa"
//   • HYMA Modena (0 posti) escluso perché non contribuisce al capitolato
DA.CDC_STRUTTURE = {
  PISA:    [
    {nome:'CC10',   posti:240, tipo:'CC'},      // CAS PISA collettivo unico
  ],
  RIETI:   [
    {nome:'RETE1',  posti: 48, tipo:'CD'},      // CAD diffuso rete 1
    {nome:'RETE2',  posti: 49, tipo:'CD'},      // CAD diffuso rete 2
  ],
  DROSSO:  [
    {nome:'DR1',    posti:120, tipo:'CD'},      // Diffusa
    {nome:'DR2',    posti:120, tipo:'CC'},      // Fragili (collettivo)
    {nome:'DR3',    posti: 50, tipo:'CD'},      // Diffusa secondaria
  ],
  LORANZE: [
    {nome:'CC9',    posti: 90, tipo:'CC'},      // CC unico Loranzè
  ],
  VICENZA: [
    {nome:'CAS1',   posti: 34, tipo:'CD'},
    {nome:'CAS2',   posti: 33, tipo:'CD'},
    {nome:'CAS3',   posti: 40, tipo:'CD'},
    {nome:'CAS MSNA',posti:10, tipo:'CD'},     // MSNA dedicato
  ],
  MODENA:  [
    // 9 CC = 476 posti (capacità autorizzata totale; alcune strutture DISPONIBILI = chiuse temporaneamente)
    {nome:'CC1',    posti: 40, tipo:'CC'},
    {nome:'CC2',    posti: 50, tipo:'CC'},
    {nome:'CC3',    posti: 54, tipo:'CC'},      // 2 immobili
    {nome:'CC4',    posti: 54, tipo:'CC'},      // attualmente DISPONIBILE (chiuso) — autorizzato
    {nome:'CC5',    posti:100, tipo:'CC'},      // 2 immobili
    {nome:'CC6',    posti: 78, tipo:'CC'},      // 5 immobili
    {nome:'CC7',    posti: 50, tipo:'CC'},      // Baggiovara A
    {nome:'CC8',    posti: 50, tipo:'CC'},      // Baggiovara B
    {nome:'CC9',    posti: 50, tipo:'CC'},
    // 6 CAD = 318 posti (reti di appartamenti diffusi)
    {nome:'CAD1',   posti: 50, tipo:'CD'},
    {nome:'CAD2',   posti: 50, tipo:'CD'},
    {nome:'CAD3',   posti: 50, tipo:'CD'},
    {nome:'CAD4',   posti: 50, tipo:'CD'},
    {nome:'CAD5',   posti: 68, tipo:'CD'},      // capacità maggiorata
    {nome:'CAD6',   posti: 50, tipo:'CD'},
  ],
  VICO:    [
    {nome:'VC2',    posti: 13, tipo:'CC'},      // Fragili
    {nome:'VC3',    posti:  5, tipo:'CD'},      // Diffusa
  ],
  CAMBO:   [
    {nome:'CC11',   posti:100, tipo:'CC'},      // Campobasso (attivo da Ago 2025)
  ],
};

// ── STIMA CAPITOLATO PER PRODIE — calcolo reale per-struttura da Allegato A ──
// PERSONALE: DA.calcOreCdc(strutture) → ore_eff totali CdC (somma per-struttura)
//   La reperibilità (ore_rep) è pagata a tariffa piena: inclusa nel costo personale
//   stima_personale = (ore_eff + ore_rep) × euro_h / ospiti_medi
// Altre categorie: capitolato fisso % della retta (DM Ministero Interno)
// _strutture: dettaglio breakdown per-struttura per tooltip/debug
DA.STIMA_CAP_PRODIE = {};
(function(){
  const EURO_H_FALLBACK = 18.00; // €/h riferimento se CdC non ha dato in DA.COSTI_ORE
  const CATS_NON_PERSONALE = {   // percentuali capitolato per le altre voci
    VITTO:              0.220,
    STRUTTURA:          0.120,
    UTENZE:             0.080,
    MANUTENZIONI:       0.050,
    CONSULENTI_ESTERNI: 0.040,
    PRODOTTI_IGIENE:    0.020,
    SPESE_SANITARIE:    0.010,
    KIT_VESTITI:        0.010,
    COSTI_GENERALI:     0.010,
  };

  DA.CDC_KEYS.forEach(k => {
    const cdc    = DA.CDC[k];
    const retta  = DA.RETTE_CDC[k] || 35;
    const posti  = cdc?.posti_max || 50;

    // ── REGOLA CAPITOLATO ──
    // Lo scaglione Allegato A si determina su CAPACITÀ AUTORIZZATA (posti per centro),
    // NON su ospiti medi (DA.calcOreCdc lo fa già correttamente).
    // Anche il €/prodie del capitolato è il COSTO TEORICO per posto autorizzato:
    //   - denominatore = somma posti reali di tutti i centri del CdC
    //   - i posti medi servono solo come benchmark di confronto col reale
    const postiTot = DA.getPostiTotali(k) || posti || 1;
    const ospMedi  = DA.OSPITI_MEDI[k] || 0;  // solo per metadato/tooltip
    const ospNorm  = postiTot;                 // <-- divisore capitolato = posti autorizzati

    // Costo orario del CdC (reale Zoho, o fallback cooperativa)
    const euro_h = DA.COSTI_ORE[k]?.euro_h || EURO_H_FALLBACK;

    // Strutture del CdC — usa DA.CDC_STRUTTURE se disponibile, altrimenti singola struttura
    const strutture = DA.CDC_STRUTTURE[k] || [{n:1, posti, tipo: cdc?.tipo || 'CC'}];

    // Ore capitolato per il CdC — somma per ogni singola struttura (non aggregato)
    const oreCdc = DA.calcOreCdc(strutture);      // {eff, rep, breakdown}

    // Costo orario reperibilità: dato reale Zoho se disponibile, altrimenti coeff CCNL
    const euro_h_rep = DA.getEuroHRep(k, oreCdc.rep, euro_h);

    // Costo giornaliero personale:
    //   ore effettive (lavorate)                  × euro_h piena
    //   ore reperibilità (pronta disponibilità)   × euro_h_rep (indennità ridotta)
    const costo_g_eff = oreCdc.eff * euro_h;
    const costo_g_rep = oreCdc.rep * euro_h_rep;
    const costo_g_tot = costo_g_eff + costo_g_rep;

    // Diviso per ospiti medi → €/prodie per ospite (confrontabile con retta)
    const stima_personale = +(costo_g_tot / ospNorm).toFixed(3);

    DA.STIMA_CAP_PRODIE[k] = { PERSONALE: stima_personale };

    // Altre voci: % della retta (capitolato fisso)
    Object.entries(CATS_NON_PERSONALE).forEach(([cat, pct]) => {
      DA.STIMA_CAP_PRODIE[k][cat] = +(retta * pct).toFixed(3);
    });

    // Totale: personale + tutte le altre (somma pct = 56% della retta)
    const pctAltro = Object.values(CATS_NON_PERSONALE).reduce((a,b)=>a+b, 0);
    DA.STIMA_CAP_PRODIE[k].TOTALE = +(stima_personale + retta * pctAltro).toFixed(2);

    // Metadati per tooltip e debug
    DA.STIMA_CAP_PRODIE[k]._strutture   = strutture;
    DA.STIMA_CAP_PRODIE[k]._ore_eff     = oreCdc.eff;              // ore lavorate effettive h/g
    DA.STIMA_CAP_PRODIE[k]._ore_rep     = oreCdc.rep;              // ore reperibilità h/g (non lavorate)
    DA.STIMA_CAP_PRODIE[k]._costo_eff   = +costo_g_eff.toFixed(2); // €/g da ore effettive
    DA.STIMA_CAP_PRODIE[k]._costo_rep   = +costo_g_rep.toFixed(2); // €/g da reperibilità
    DA.STIMA_CAP_PRODIE[k]._osp_medi      = ospMedi;      // riferimento (presenze reali / 365)
    DA.STIMA_CAP_PRODIE[k]._posti_totali  = postiTot;     // denominatore capitolato (usato)
    DA.STIMA_CAP_PRODIE[k]._n_centri      = DA.getNumeroCentri(k);
    DA.STIMA_CAP_PRODIE[k]._riempimento   = ospMedi > 0 && postiTot > 0
                                            ? +(ospMedi / postiTot * 100).toFixed(1) : 0;
    DA.STIMA_CAP_PRODIE[k]._euro_h      = euro_h;
    DA.STIMA_CAP_PRODIE[k]._euro_h_rep  = euro_h_rep;              // €/h reperibilità (reale o stima)
    DA.STIMA_CAP_PRODIE[k]._rep_fonte   = DA.REPERIBILITA_COSTI_2025?.[k]
                                          ? 'Zoho Costo Personale 2025'
                                          : `Stima ${(DA.REP_COEFF*100).toFixed(0)}% €/h ord (CCNL)`;
    DA.STIMA_CAP_PRODIE[k]._note        = DA.CDC_NON_CAPITOLATO?.[k] || null;
    // Breakdown per-struttura (utile per Athena / simulazioni)
    DA.STIMA_CAP_PRODIE[k]._breakdown   = oreCdc.breakdown || [];
  });
})();

// ═══════════════════════════════════════════════════════════
// DA.COSTO_LAVORO_PCT rimosso — calcolato dinamicamente da DA.computeCdlPct() in hr_data.js
// Fonte: HR_ORE_CDC da Zoho Analytics (Rapporti aggiuntivi)

// Etichette composizione costo del lavoro
DA.COSTO_LAVORO_LABELS = [
  'Ordinario','Notturno','Festivo Diurno','Festivo Notturno',
  'Rep. Diurna','Rep. Notturna','Straordinario','Giustificativi'
];
DA.COSTO_LAVORO_KEYS = [
  'ordinario','notturno','festivo_diurno','festivo_notturno',
  'reperibilita_diurna','reperibilita_notturna','straordinario','giustificativi'
];
DA.COSTO_LAVORO_COLORS = [
  '#3b82f6','#0f172a','#f59e0b','#d97706',
  '#06b6d4','#0e7490','#ef4444','#8b5cf6'
];

// ═══════════════════════════════════════════════════════════
// TICKET MANUTENZIONE — STATISTICHE TEMPI RISOLUZIONE
// Fonte: Zoho "Interventi Manutentivi" (Creator) — Apr 2025
// Campione: 3.051 ticket CONCLUSI, 74 APERTI
// ═══════════════════════════════════════════════════════════
DA.TICKET_STATS = {
  totale:          3125,
  conclusi:        3051,
  aperti:            74,
  mediana_giorni:   4.8,
  media_giorni:    15.0,
  max_giorni:      382,
  pct_sla_3g:       43,  // % risolti entro 3 giorni (SLA standard)
  pct_sla_7g:       58,  // % risolti entro 7 giorni
  distribuzione: [
    { label:'< 1 giorno',    pct:25, count: 763, color:'#10b981' },
    { label:'1 – 3 giorni',  pct:18, count: 549, color:'#34d399' },
    { label:'3 – 7 giorni',  pct:15, count: 458, color:'#f59e0b' },
    { label:'7 – 14 giorni', pct:11, count: 336, color:'#fb923c' },
    { label:'14 – 30 giorni',pct:15, count: 458, color:'#f97316' },
    { label:'30 – 60 giorni',pct:10, count: 305, color:'#ef4444' },
    { label:'> 60 giorni',   pct: 4, count: 122, color:'#dc2626' },
  ],
  per_cdc: {
    PISA:    { aperti: 3, conclusi: 412, media_giorni: 12.5, mediana_giorni:  4.0 },
    RIETI:   { aperti: 1, conclusi: 218, media_giorni:  8.2, mediana_giorni:  3.0 },
    DROSSO:  { aperti: 4, conclusi: 638, media_giorni: 18.0, mediana_giorni:  5.5 },
    LORANZE: { aperti: 2, conclusi: 294, media_giorni: 10.5, mediana_giorni:  4.2 },
    VICENZA: { aperti: 2, conclusi: 350, media_giorni:  9.8, mediana_giorni:  3.8 },
    MODENA:  { aperti:18, conclusi: 875, media_giorni: 24.5, mediana_giorni:  8.0 },
    VICO:    { aperti:44, conclusi: 264, media_giorni: 38.0, mediana_giorni: 12.0 },
    // VICO: alto n° aperti — tetto ala nord + struttura complessa
  },
  note: 'Fonte: Zoho Creator "Interventi Manutentivi". Media alta (15g) per outlier grandi lavori (max 382g).'
};

// ═══════════════════════════════════════════════════════════
// ALLEGATO A — DOTAZIONE MINIMA DI PERSONALE PER MANSIONE
// Fonte: DM Ministero Interno — Capitolato CAS (Allegato A)
// Unità: ore/giorno per fascia ospiti
// Ore settimanali ÷ 7 = ore/giorno (per figure a monte settimanale)
// NOTA: Drosso e Vico-Valchiusa NON rientrano in questo Allegato A
// ═══════════════════════════════════════════════════════════

// Chiavi mansioni (ordine fisso per tutti i calcoli)
DA.MANS_KEYS   = ['coordinatore','operatori','mediatore','legale','ass_sociale','psicologo','infermiere'];
DA.MANS_LABELS = ['Coordinatore','Op. Accoglienza','Mediatore Cult.','Op. Legale','Ass. Sociale','Psicologo/a','Infermiere/a'];
DA.MANS_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4'];

// Mapping Zoho (DA.MANSIONI) → chiavi standardizzate
DA.MANS_ZOHO_MAP = {
  coordinatore: ['COORDINATORE','RESPONSABILE'],
  operatori:    ['OPERATORE CENTRO ACCOGLIENZA','OPERATORE/TRICE','TUTTOFARE','ANIMATORE','ADDETTO'],
  mediatore:    ['MEDIATORE'],
  legale:       ['LEGALE'],
  ass_sociale:  ['ASSISTENTE SOCIALE','OPERATORE SOCIALE','SOCIALE'],
  psicologo:    ['PSICOLOGO','PSICOLOGA'],
  infermiere:   ['INFERMIERE','INFERMIERA','MEDICO'],
};

// CC — Dotazione minima per scaglione (somme verificate con ALLEGATO_A_CC)
DA.ALLEGATO_A_MANSIONI_CC = [
  { min:1,  max:10,  tot:8,
    m:{ coordinatore:3, operatori:5, mediatore:0, legale:0, ass_sociale:0, psicologo:0, infermiere:0 }},
  { min:11, max:20,  tot:16,
    m:{ coordinatore:3, operatori:8, mediatore:3, legale:0, ass_sociale:0, psicologo:2, infermiere:0 }},
  { min:21, max:40,  tot:24,
    m:{ coordinatore:4, operatori:8, mediatore:4, legale:3, ass_sociale:3, psicologo:1, infermiere:1 }},
  { min:41, max:50,  tot:32,
    m:{ coordinatore:4, operatori:12, mediatore:4, legale:4, ass_sociale:4, psicologo:2, infermiere:2 }},
  { min:51, max:60,  tot:40,
    m:{ coordinatore:5, operatori:16, mediatore:5, legale:4, ass_sociale:4, psicologo:3, infermiere:3 }},
  { min:61, max:75,  tot:48,
    m:{ coordinatore:6, operatori:18, mediatore:6, legale:5, ass_sociale:5, psicologo:4, infermiere:4 }},
  { min:76, max:9999,tot:56,
    m:{ coordinatore:7, operatori:22, mediatore:7, legale:6, ass_sociale:6, psicologo:4, infermiere:4 }},
];

// CAD — Dotazione minima per scaglione (es. RIETI)
DA.ALLEGATO_A_MANSIONI_CAD = [
  { min:1,  max:5,   tot:4,
    m:{ coordinatore:2, operatori:2, mediatore:0, legale:0, ass_sociale:0, psicologo:0, infermiere:0 }},
  { min:6,  max:10,  tot:8,
    m:{ coordinatore:2, operatori:4, mediatore:2, legale:0, ass_sociale:0, psicologo:0, infermiere:0 }},
  { min:11, max:15,  tot:12,
    m:{ coordinatore:3, operatori:4, mediatore:2, legale:2, ass_sociale:1, psicologo:0, infermiere:0 }},
  { min:16, max:20,  tot:16,
    m:{ coordinatore:4, operatori:5, mediatore:3, legale:2, ass_sociale:2, psicologo:0, infermiere:0 }},
  { min:21, max:9999,tot:20,
    m:{ coordinatore:5, operatori:6, mediatore:3, legale:3, ass_sociale:3, psicologo:0, infermiere:0 }},
];

// Helper: restituisce fascia dotazione per ospiti+tipo
DA.getMansioniFascia = function(ospiti, tipo){
  const tab = tipo==='CAD' ? DA.ALLEGATO_A_MANSIONI_CAD : DA.ALLEGATO_A_MANSIONI_CC;
  for(const f of tab){ if(ospiti>=f.min && ospiti<=f.max) return f; }
  return tab[tab.length-1];
};

// ── ORE/PRODIE DOVUTE PER MANSIONE ────────────────────────
// Formula: ore_mansione_giornaliere_allegato_A / ospiti_medi_giorno
// Unità risultante: h/prodie (ore di servizio per ogni giornata di presenza)
DA.ORE_PRODIE_DOVUTE = {};
(function(){
  // CdC soggetti al capitolato Allegato A — CC e SUA/CAD standard
  // CC: PISA (250), LORANZÈ (90), MODENA (50), CAMBO (100)
  // SUA/CAD: RIETI (50+50), VICENZA (50/rete)
  // Esclusi: DROSSO (contratto quadro diverso), VICO (contratto diverso)
  const cdcAllegatoA = ['PISA','RIETI','LORANZE','VICENZA','MODENA','CAMBO'];
  cdcAllegatoA.forEach(k=>{
    const ospMedi = DA.OSPITI_MEDI[k] || 1;
    const tipo    = DA.CDC[k]?.tipo || 'CC';
    const fascia  = DA.getMansioniFascia(ospMedi, tipo);
    DA.ORE_PRODIE_DOVUTE[k] = {};
    DA.MANS_KEYS.forEach(mk=>{
      const oreG = fascia.m[mk] || 0;
      DA.ORE_PRODIE_DOVUTE[k][mk] = ospMedi > 0 ? +(oreG / ospMedi).toFixed(4) : 0;
    });
    DA.ORE_PRODIE_DOVUTE[k]._tot = ospMedi > 0 ? +(fascia.tot / ospMedi).toFixed(4) : 0;
    DA.ORE_PRODIE_DOVUTE[k]._fascia = fascia;
    DA.ORE_PRODIE_DOVUTE[k]._ospiti = ospMedi;
  });
  // DROSSO e VICO: contratto quadro diverso → non soggetti all'Allegato A standard
  ['DROSSO','VICO'].forEach(k=>{ DA.ORE_PRODIE_DOVUTE[k] = null; });
})();

// ── ORE/PRODIE EROGATE PER MANSIONE (da Zoho Costi Orari CAS) ─
// Formula: ore_mansione_anno / presenze_anno
DA.ORE_PRODIE_EROGATE = {};
(function(){
  DA.CDC_KEYS.forEach(k=>{
    const pres = DA.PRESENZE_FINAN[k] || DA.PRESENZE_EST[k] || 1;
    const totOre = DA.COSTI_ORE[k]?.ore || 0;
    // Totale
    DA.ORE_PRODIE_EROGATE[k] = { _tot: pres>0 ? +(totOre/pres).toFixed(4) : 0 };
    // Per mansione (dove disponibile in DA.MANSIONI)
    const mans = DA.MANSIONI[k];
    if(mans){
      DA.MANS_KEYS.forEach(mk=>{
        const zohoKeys = DA.MANS_ZOHO_MAP[mk];
        const oreM = mans.filter(m=> zohoKeys.some(zk=>m.r.toUpperCase().includes(zk)))
                         .reduce((s,m)=>s+m.h, 0);
        DA.ORE_PRODIE_EROGATE[k][mk] = pres>0 ? +(oreM/pres).toFixed(4) : 0;
      });
    }
  });
})();

// ═══════════════════════════════════════════════════════════
// COSTI MEDI COOPERATIVA PER PRODIE — BENCHMARK INTERNO
// Media ponderata per presenze (solo CdC con dati finanziari completi)
// Fonte: COSTI_CAT + PRESENZE_FINAN — Zoho Analytics
// ═══════════════════════════════════════════════════════════
DA.COSTI_MEDI_COOP = (function(){
  const cdcRef = ['PISA','RIETI','DROSSO','LORANZE','VICENZA','VICO'];
  const cats   = ['PERSONALE','VITTO','STRUTTURA','UTENZE','MANUTENZIONI',
                  'CONSULENTI_ESTERNI','PRODOTTI_IGIENE','SPESE_SANITARIE'];
  const totPres  = cdcRef.reduce((s,k)=>s+(DA.PRESENZE_FINAN[k]||0),0);
  const totCosti = cdcRef.reduce((s,k)=>s+(DA.COSTI_CAT[k]?.TOTALE||0),0);
  const res = { TOTALE: totCosti>0&&totPres>0 ? +(totCosti/totPres).toFixed(3) : 0 };
  cats.forEach(cat=>{
    const sumCat = cdcRef.reduce((s,k)=>s+(DA.COSTI_CAT[k]?.[cat]||0),0);
    res[cat] = totPres>0 ? +(sumCat/totPres).toFixed(3) : 0;
  });
  res._pres = totPres;
  return res;
})();

// ═══════════════════════════════════════════════════════════
// COSTI MEDI €/PRODIE PER TIPOLOGIA CENTRO + FASCIA POSTI
// I CC (Centri Collettivi) hanno economie di scala per fascia di posti;
// i SUA/CAD (diffusi) hanno struttura di costo diversa (più affitti distribuiti).
// Benchmark calcolato dai costi reali Zoho (Composizione Costi / Presenze).
// Fasce CC: 0-50 · 51-100 · 101-300 · >300 (come da scaglioni capitolato CAS).
// ═══════════════════════════════════════════════════════════
DA.FASCE_CC = [
  { min:0,   max:50,  label:'CC 0–50' },
  { min:51,  max:100, label:'CC 51–100' },
  { min:101, max:300, label:'CC 101–300' },
  { min:301, max:9999,label:'CC >300' },
];
DA.getFasciaCC = function(posti){
  return (DA.FASCE_CC.find(f => posti>=f.min && posti<=f.max) || DA.FASCE_CC[DA.FASCE_CC.length-1]).label;
};
DA.COSTI_MEDI_PER_TIPO = (function(){
  // Gruppi: per i CC per fascia; per i SUA/CAD un unico gruppo
  const groups = {}; // label → {pres, costi, cdc:[]}
  const cdcRef = ['PISA','RIETI','DROSSO','LORANZE','VICENZA','VICO','CAMBO'];
  cdcRef.forEach(k=>{
    const meta = DA.CDC[k]; if(!meta) return;
    const pres = DA.PRESENZE_FINAN[k] || 0;
    const costi = DA.COSTI_CAT[k]?.TOTALE || 0;
    if(pres<=0 || costi<=0) return; // esclude CdC senza dati completi (es. MODENA)
    const tipo = meta.tipo;
    const label = (tipo==='SUA'||tipo==='CAD') ? 'SUA/CAD (diffusi)' : DA.getFasciaCC(meta.posti_max||0);
    if(!groups[label]) groups[label] = { pres:0, costi:0, cdc:[], tipo:(tipo==='SUA'||tipo==='CAD')?'SUA':'CC' };
    groups[label].pres  += pres;
    groups[label].costi += costi;
    groups[label].cdc.push(k);
  });
  // Calcola €/prodie medio per gruppo
  Object.values(groups).forEach(g=>{
    g.euro_prodie = g.pres>0 ? +(g.costi/g.pres).toFixed(2) : null;
  });
  return groups;
})();
// Restituisce il costo medio €/prodie di riferimento per un CdC, in base a tipo+fascia
DA.getCostoMedioRif = function(cdcKey){
  const meta = DA.CDC[cdcKey]; if(!meta) return null;
  const label = (meta.tipo==='SUA'||meta.tipo==='CAD') ? 'SUA/CAD (diffusi)' : DA.getFasciaCC(meta.posti_max||0);
  return DA.COSTI_MEDI_PER_TIPO[label]?.euro_prodie ?? null;
};

// ═══════════════════════════════════════════════════════════
// TURNOVER PER CDC — Dati REALI da Storico Rapporto (Zoho Creator)
// Fonte: 1.184 rapporti → 461 persone uniche (TD+TI, escl. P.IVA/Vol/Tirocinio)
// Formula: Cessati_anno / ((Organico_inizio_anno + Organico_fine_anno)/2) × 100
// Deduplicato per PERSONA (non per contratto): una persona con TD + proroga + TI
// conta come 1. CdC = CdC del contratto attivo nell'anno.
// null = N/D (centro non ancora aperto in quell'anno — organico_inizio = 0)
// Valori >100% = centri in forte espansione con alta rotazione TD (reale)
// Aggiornato: Aprile 2026
// ═══════════════════════════════════════════════════════════
// ───────────────────────────────────────────────────────────
// METODOLOGIA v3 — "turnover reale su personale consolidato"
//
// Un cessato conta come VERO TURNOVER solo se:
//   (a) aveva almeno un INDETERMINATO (uscita da TI = sempre turnover), OPPURE
//   (b) aveva almeno un TD PROROGA (era stato rinnovato → l'org. voleva tenerlo)
//
// METODOLOGIA v4 — Solo TI (Tempo Indeterminato)
// Turnover = Cessati_TI_anno / ((Organico_TI_inizio + Organico_TI_fine) / 2) × 100
// INCLUSI:   solo dipendenti che hanno avuto almeno un contratto TI
// ESCLUSI:   TUTTI i TD (primo e proroga), indipendentemente da rinnovi o stabilizzazione
//   → la scadenza di un TD non è mai turnover organizzativo
//
// null = N/D (centro non ancora aperto in quell'anno — organico_TI_inizio = 0)
// 0.0  = nessun dipendente TI ha lasciato in quell'anno
// ───────────────────────────────────────────────────────────
DA.TURNOVER = {
  MODENA:  { 2022:  0.0, 2023:  22.2, 2024:   3.8, 2025:  27.3, organico_2025: 59 },
  PISA:    { 2022: null, 2023:  null,  2024:  13.3, 2025:   7.1, organico_2025: 21 },
  DROSSO:  { 2022: null, 2023:  22.2,  2024:   0.0, 2025:   0.0, organico_2025: 18 },
  RIETI:   { 2022: null, 2023:  null,  2024:   0.0, 2025:  11.8, organico_2025:  8 },
  LORANZE: { 2022: null, 2023:  null,  2024:  50.0, 2025:  44.4, organico_2025:  9 },
  VICENZA: { 2022:  0.0, 2023:   0.0,  2024:  20.0, 2025:   0.0, organico_2025: 15 },
  VICO:    { 2022:  0.0, 2023:  19.0,  2024:   8.3, 2025:   0.0, organico_2025: 16 },
  CAMBO:   { 2022: null, 2023:  null,  2024:  null,  2025:  null, organico_2025:  4 },
};

// Totali cooperativa — solo dipendenti TI
DA.TURNOVER_TOTALE = {
  2022: { inizio:  50, fine:  73, cessati:   0, tov:  0.0 },
  2023: { inizio:  73, fine: 102, cessati:  17, tov: 19.4 },
  2024: { inizio: 102, fine: 128, cessati:  18, tov: 15.7 },
  2025: { inizio: 128, fine: 151, cessati:  24, tov: 17.2 },
  note: 'Solo TI (indeterminato). Fonte: Storico Rapporto — 1.184 record, 225 persone con TI. Escl. tutti i TD (primo e proroga). Metodologia v4.',
};

// Tasso stabilizzazione TD → TI per CdC
// % dipendenti che hanno avuto un TD e poi ottenuto TI nello stesso centro
DA.STABILIZZAZIONE_TD_TI = {
  MODENA:  { had_td: 143, got_ti:  50, tasso: 35.0 },
  PISA:    { had_td:  42, got_ti:  15, tasso: 35.7 },
  DROSSO:  { had_td:  25, got_ti:  12, tasso: 48.0 },
  RIETI:   { had_td:   7, got_ti:   2, tasso: 28.6 },
  LORANZE: { had_td:  21, got_ti:   8, tasso: 38.1 },
  VICENZA: { had_td:  26, got_ti:  15, tasso: 57.7 },
  VICO:    { had_td:  17, got_ti:   6, tasso: 35.3 },
  CAMBO:   { had_td:   5, got_ti:   0, tasso:  0.0 },
};

// ══════════════════════════════════════════════════════════════════
// ORGANICO ALLEGATO A — Mansioni Organico (Allegato A Capitolato)
// Fonte: 'Storico Rapporto (Zoho Creator)' — contratti ATTIVI 28/04/2026
// Confronto ore contrattuali (h/mese) vs ore richieste dall'Allegato A
// ══════════════════════════════════════════════════════════════════

DA.MANS_ALLEGATO_A = ['OPERATORE DIURNO','OPERATORE NOTTURNO','DIRETTORE','MEDICO','OPERATORE SOCIALE','MEDIATORE LINGUISTICO','AMMINISTRATIVO','INFERMIERE'];

// Scaglioni dotazione organica Allegato A per tipo centro e numero ospiti
// max: fino a N ospiti, eff: ore/giorno o h/sett effettive, rep: ore/giorno reperibilità, base: 'GIORNO'|'SETTIMANA'
DA.DOTAZIONE_SCAGL = {
  CC: {
    'OPERATORE DIURNO': [{max:10,eff:8.0,rep:0.0,base:'GIORNO'},{max:20,eff:8.0,rep:0.0,base:'GIORNO'},{max:30,eff:10.0,rep:0.0,base:'GIORNO'},{max:40,eff:10.0,rep:0.0,base:'GIORNO'},{max:50,eff:12.0,rep:0.0,base:'GIORNO'},{max:75,eff:18.0,rep:0.0,base:'GIORNO'},{max:100,eff:24.0,rep:0.0,base:'GIORNO'},{max:150,eff:36.0,rep:0.0,base:'GIORNO'},{max:200,eff:40.0,rep:0.0,base:'GIORNO'},{max:250,eff:44.0,rep:0.0,base:'GIORNO'},{max:300,eff:48.0,rep:0.0,base:'GIORNO'},{max:350,eff:52.0,rep:0.0,base:'GIORNO'},{max:400,eff:56.0,rep:0.0,base:'GIORNO'},{max:450,eff:60.0,rep:0.0,base:'GIORNO'},{max:500,eff:64.0,rep:0.0,base:'GIORNO'},{max:550,eff:68.0,rep:0.0,base:'GIORNO'},{max:600,eff:72.0,rep:0.0,base:'GIORNO'},{max:650,eff:76.0,rep:0.0,base:'GIORNO'},{max:700,eff:78.0,rep:0.0,base:'GIORNO'},{max:750,eff:84.0,rep:0.0,base:'GIORNO'},{max:800,eff:88.0,rep:0.0,base:'GIORNO'},{max:850,eff:92.0,rep:0.0,base:'GIORNO'},{max:900,eff:96.0,rep:0.0,base:'GIORNO'}],
    'OPERATORE NOTTURNO': [{max:75,eff:8.0,rep:0.0,base:'GIORNO'},{max:100,eff:12.0,rep:0.0,base:'GIORNO'},{max:300,eff:16.0,rep:0.0,base:'GIORNO'},{max:450,eff:20.0,rep:0.0,base:'GIORNO'},{max:600,eff:24.0,rep:0.0,base:'GIORNO'},{max:750,eff:28.0,rep:0.0,base:'GIORNO'},{max:900,eff:32.0,rep:0.0,base:'GIORNO'}],
    'DIRETTORE': [{max:20,eff:0.58,rep:0.0,base:'SETTIMANA'},{max:40,eff:0.86,rep:0.0,base:'SETTIMANA'},{max:50,eff:1.15,rep:0.0,base:'SETTIMANA'},{max:75,eff:1.43,rep:0.0,base:'SETTIMANA'},{max:100,eff:1.72,rep:0.0,base:'SETTIMANA'},{max:150,eff:3.43,rep:0.0,base:'SETTIMANA'},{max:200,eff:3.58,rep:0.0,base:'SETTIMANA'},{max:250,eff:3.72,rep:0.0,base:'SETTIMANA'},{max:300,eff:3.86,rep:0.0,base:'SETTIMANA'},{max:350,eff:4.0,rep:0.0,base:'SETTIMANA'},{max:400,eff:4.15,rep:0.0,base:'SETTIMANA'},{max:450,eff:4.29,rep:0.0,base:'SETTIMANA'},{max:500,eff:4.43,rep:0.0,base:'SETTIMANA'},{max:550,eff:4.58,rep:0.0,base:'SETTIMANA'},{max:600,eff:4.72,rep:0.0,base:'SETTIMANA'},{max:650,eff:4.86,rep:0.0,base:'SETTIMANA'},{max:700,eff:5.0,rep:0.0,base:'SETTIMANA'},{max:750,eff:5.15,rep:0.0,base:'SETTIMANA'},{max:800,eff:5.29,rep:0.0,base:'SETTIMANA'},{max:850,eff:5.43,rep:0.0,base:'SETTIMANA'},{max:900,eff:5.58,rep:0.0,base:'SETTIMANA'}],
    'MEDICO': [{max:20,eff:0.0,rep:2.0,base:'GIORNO'},{max:40,eff:0.0,rep:3.0,base:'GIORNO'},{max:50,eff:0.0,rep:4.0,base:'GIORNO'},{max:75,eff:2.0,rep:0.0,base:'GIORNO'},{max:100,eff:2.29,rep:0.0,base:'GIORNO'},{max:150,eff:2.86,rep:0.0,base:'GIORNO'},{max:200,eff:3.15,rep:0.0,base:'GIORNO'},{max:250,eff:3.43,rep:0.0,base:'GIORNO'},{max:300,eff:3.72,rep:0.0,base:'GIORNO'},{max:350,eff:4.0,rep:0.0,base:'GIORNO'},{max:400,eff:4.29,rep:0.0,base:'GIORNO'},{max:450,eff:4.56,rep:0.0,base:'GIORNO'},{max:500,eff:4.86,rep:0.0,base:'GIORNO'},{max:550,eff:5.15,rep:0.0,base:'GIORNO'},{max:600,eff:5.43,rep:0.0,base:'GIORNO'},{max:650,eff:5.72,rep:0.0,base:'GIORNO'},{max:700,eff:6.0,rep:0.0,base:'GIORNO'},{max:750,eff:6.29,rep:0.0,base:'GIORNO'},{max:800,eff:6.58,rep:0.0,base:'GIORNO'},{max:850,eff:6.86,rep:0.0,base:'GIORNO'},{max:900,eff:7.15,rep:0.0,base:'GIORNO'}],
    'OPERATORE SOCIALE': [{max:10,eff:2.0,rep:0.0,base:'SETTIMANA'},{max:20,eff:2.58,rep:0.0,base:'SETTIMANA'},{max:30,eff:3.14,rep:0.0,base:'SETTIMANA'},{max:40,eff:3.43,rep:0.0,base:'SETTIMANA'},{max:50,eff:3.72,rep:0.0,base:'SETTIMANA'},{max:75,eff:4.0,rep:0.0,base:'SETTIMANA'},{max:100,eff:4.58,rep:0.0,base:'SETTIMANA'},{max:150,eff:5.72,rep:0.0,base:'SETTIMANA'},{max:200,eff:6.86,rep:0.0,base:'SETTIMANA'},{max:250,eff:8.0,rep:0.0,base:'SETTIMANA'},{max:300,eff:9.15,rep:0.0,base:'SETTIMANA'},{max:350,eff:10.29,rep:0.0,base:'SETTIMANA'},{max:400,eff:11.43,rep:0.0,base:'SETTIMANA'},{max:450,eff:12.58,rep:0.0,base:'SETTIMANA'},{max:500,eff:13.72,rep:0.0,base:'SETTIMANA'},{max:550,eff:14.86,rep:0.0,base:'SETTIMANA'},{max:600,eff:16.0,rep:0.0,base:'SETTIMANA'},{max:650,eff:17.15,rep:0.0,base:'SETTIMANA'},{max:700,eff:18.29,rep:0.0,base:'SETTIMANA'},{max:750,eff:19.43,rep:0.0,base:'SETTIMANA'},{max:800,eff:20.58,rep:0.0,base:'SETTIMANA'},{max:850,eff:21.72,rep:0.0,base:'SETTIMANA'},{max:900,eff:22.86,rep:0.0,base:'SETTIMANA'}],
    'MEDIATORE LINGUISTICO': [{max:10,eff:0.86,rep:0.0,base:'SETTIMANA'},{max:20,eff:1.15,rep:0.0,base:'SETTIMANA'},{max:30,eff:1.43,rep:0.0,base:'SETTIMANA'},{max:40,eff:1.72,rep:0.0,base:'SETTIMANA'},{max:50,eff:2.0,rep:0.0,base:'SETTIMANA'},{max:75,eff:2.43,rep:0.0,base:'SETTIMANA'},{max:100,eff:2.86,rep:0.0,base:'SETTIMANA'},{max:150,eff:3.72,rep:0.0,base:'SETTIMANA'},{max:200,eff:4.58,rep:0.0,base:'SETTIMANA'},{max:250,eff:5.43,rep:0.0,base:'SETTIMANA'},{max:300,eff:6.29,rep:0.0,base:'SETTIMANA'},{max:350,eff:7.15,rep:0.0,base:'SETTIMANA'},{max:400,eff:8.0,rep:0.0,base:'SETTIMANA'},{max:450,eff:8.86,rep:0.0,base:'SETTIMANA'},{max:500,eff:9.72,rep:0.0,base:'SETTIMANA'},{max:550,eff:10.58,rep:0.0,base:'SETTIMANA'},{max:600,eff:11.43,rep:0.0,base:'SETTIMANA'},{max:650,eff:12.29,rep:0.0,base:'SETTIMANA'},{max:700,eff:13.15,rep:0.0,base:'SETTIMANA'},{max:750,eff:14.0,rep:0.0,base:'SETTIMANA'},{max:800,eff:14.86,rep:0.0,base:'SETTIMANA'},{max:850,eff:15.72,rep:0.0,base:'SETTIMANA'},{max:900,eff:16.58,rep:0.0,base:'SETTIMANA'}],
    'AMMINISTRATIVO': [{max:10,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:20,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:30,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:40,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:50,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:75,eff:0.86,rep:0.0,base:'SETTIMANA'},{max:100,eff:1.15,rep:0.0,base:'SETTIMANA'},{max:150,eff:2.0,rep:0.0,base:'SETTIMANA'},{max:200,eff:2.29,rep:0.0,base:'SETTIMANA'},{max:250,eff:2.58,rep:0.0,base:'SETTIMANA'},{max:300,eff:2.86,rep:0.0,base:'SETTIMANA'},{max:350,eff:3.15,rep:0.0,base:'SETTIMANA'},{max:400,eff:3.43,rep:0.0,base:'SETTIMANA'},{max:450,eff:3.72,rep:0.0,base:'SETTIMANA'},{max:500,eff:4.0,rep:0.0,base:'SETTIMANA'},{max:550,eff:4.29,rep:0.0,base:'SETTIMANA'},{max:600,eff:4.58,rep:0.0,base:'SETTIMANA'},{max:650,eff:4.86,rep:0.0,base:'SETTIMANA'},{max:700,eff:5.15,rep:0.0,base:'SETTIMANA'},{max:750,eff:5.43,rep:0.0,base:'SETTIMANA'},{max:800,eff:5.72,rep:0.0,base:'SETTIMANA'},{max:850,eff:6.0,rep:0.0,base:'SETTIMANA'},{max:900,eff:6.29,rep:0.0,base:'SETTIMANA'}],
    'INFERMIERE': [{max:10,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:20,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:30,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:40,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:50,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:75,eff:1.72,rep:0.0,base:'SETTIMANA'},{max:100,eff:2.58,rep:0.0,base:'SETTIMANA'},{max:150,eff:3.43,rep:0.0,base:'SETTIMANA'},{max:200,eff:4.29,rep:0.0,base:'SETTIMANA'},{max:250,eff:5.15,rep:0.0,base:'SETTIMANA'},{max:300,eff:6.0,rep:0.0,base:'SETTIMANA'},{max:350,eff:6.86,rep:0.0,base:'SETTIMANA'},{max:400,eff:7.72,rep:0.0,base:'SETTIMANA'},{max:450,eff:8.58,rep:0.0,base:'SETTIMANA'},{max:500,eff:9.43,rep:0.0,base:'SETTIMANA'},{max:550,eff:10.29,rep:0.0,base:'SETTIMANA'},{max:600,eff:11.15,rep:0.0,base:'SETTIMANA'},{max:650,eff:12.0,rep:0.0,base:'SETTIMANA'},{max:700,eff:12.86,rep:0.0,base:'SETTIMANA'},{max:750,eff:13.72,rep:0.0,base:'SETTIMANA'},{max:800,eff:14.58,rep:0.0,base:'SETTIMANA'},{max:850,eff:15.43,rep:0.0,base:'SETTIMANA'},{max:900,eff:16.29,rep:0.0,base:'SETTIMANA'}],
  },
  CAD: {
    'OPERATORE DIURNO': [{max:10,eff:8.0,rep:0.0,base:'GIORNO'},{max:20,eff:9.0,rep:0.0,base:'GIORNO'},{max:30,eff:11.0,rep:0.0,base:'GIORNO'},{max:40,eff:12.0,rep:0.0,base:'GIORNO'},{max:50,eff:14.0,rep:0.0,base:'GIORNO'}],
    'OPERATORE NOTTURNO': [{max:50,eff:0.0,rep:8.0,base:'GIORNO'}],
    'DIRETTORE': [{max:10,eff:0.58,rep:0.0,base:'SETTIMANA'},{max:20,eff:0.72,rep:0.0,base:'SETTIMANA'},{max:30,eff:1.0,rep:0.0,base:'SETTIMANA'},{max:40,eff:1.15,rep:0.0,base:'SETTIMANA'},{max:50,eff:1.43,rep:0.0,base:'SETTIMANA'}],
    'MEDICO': [{max:20,eff:0.0,rep:2.0,base:'GIORNO'},{max:40,eff:0.0,rep:3.0,base:'GIORNO'},{max:50,eff:0.0,rep:4.0,base:'GIORNO'}],
    'OPERATORE SOCIALE': [{max:10,eff:2.29,rep:0.0,base:'SETTIMANA'},{max:20,eff:2.86,rep:0.0,base:'SETTIMANA'},{max:30,eff:3.43,rep:0.0,base:'SETTIMANA'},{max:40,eff:4.0,rep:0.0,base:'SETTIMANA'},{max:50,eff:4.58,rep:0.0,base:'SETTIMANA'}],
    'MEDIATORE LINGUISTICO': [{max:10,eff:1.15,rep:0.0,base:'SETTIMANA'},{max:20,eff:1.72,rep:0.0,base:'SETTIMANA'},{max:30,eff:2.29,rep:0.0,base:'SETTIMANA'},{max:40,eff:2.86,rep:0.0,base:'SETTIMANA'},{max:50,eff:3.43,rep:0.0,base:'SETTIMANA'}],
    'AMMINISTRATIVO': [{max:10,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:20,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:30,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:40,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:50,eff:0.0,rep:0.0,base:'SETTIMANA'}],
    'INFERMIERE': [{max:10,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:20,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:30,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:40,eff:0.0,rep:0.0,base:'SETTIMANA'},{max:50,eff:0.0,rep:0.0,base:'SETTIMANA'}],
  },
};

// Organico per CdC aggregato per categoria Allegato A
// n: contratti ATTIVI, h_sett: ore/sett contrattuale, h_mese: ore/mese contrattuale (×52/12)
// ric_mese: ore/mese RICHIESTE dall'Allegato A (su ospiti medi 2025), ric_rep: ore reperibilità
DA.ORGANICO_ALLEGATO = {
  PISA: {  // ospiti medi 2025: 206, tipo: CC
    'OPERATORE DIURNO':      {n:14, h_sett:489.5, h_mese:2121, ric_mese:1339, ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:487,  ric_rep:0},
    'DIRETTORE':             {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:16,   ric_rep:0},
    'MEDICO':                {n:1,  h_sett:24.0,  h_mese:104,  ric_mese:104,  ric_rep:0},
    'OPERATORE SOCIALE':     {n:2,  h_sett:57.5,  h_mese:249,  ric_mese:35,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:1,  h_sett:24.0,  h_mese:104,  ric_mese:24,   ric_rep:0},
    'AMMINISTRATIVO':        {n:2,  h_sett:58.0,  h_mese:251,  ric_mese:11,   ric_rep:0},
    'INFERMIERE':            {n:1,  h_sett:38.0,  h_mese:165,  ric_mese:22,   ric_rep:0},
  },
  RIETI: {  // ospiti medi 2025: 85, tipo: CAD
    'OPERATORE DIURNO':      {n:5,  h_sett:147.0, h_mese:637,  ric_mese:426,  ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:244},
    'DIRETTORE':             {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:6,    ric_rep:0},
    'MEDICO':                {n:1,  h_sett:8.0,   h_mese:35,   ric_mese:0,    ric_rep:122},
    'OPERATORE SOCIALE':     {n:4,  h_sett:86.0,  h_mese:373,  ric_mese:20,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:6,  h_sett:43.0,  h_mese:186,  ric_mese:15,   ric_rep:0},
    'AMMINISTRATIVO':        {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:0},
    'INFERMIERE':            {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:0},
  },
  DROSSO: {  // ospiti medi 2025: 276, tipo: CC
    'OPERATORE DIURNO':      {n:11, h_sett:407.0, h_mese:1764, ric_mese:1461, ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:487,  ric_rep:0},
    'DIRETTORE':             {n:1,  h_sett:38.0,  h_mese:165,  ric_mese:17,   ric_rep:0},
    'MEDICO':                {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:113,  ric_rep:0},
    'OPERATORE SOCIALE':     {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:40,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:27,   ric_rep:0},
    'AMMINISTRATIVO':        {n:2,  h_sett:76.0,  h_mese:329,  ric_mese:12,   ric_rep:0},
    'INFERMIERE':            {n:6,  h_sett:180.0, h_mese:780,  ric_mese:26,   ric_rep:0},
  },
  LORANZE: {  // ospiti medi 2025: 84, tipo: CC
    'OPERATORE DIURNO':      {n:10, h_sett:294.0, h_mese:1274, ric_mese:731,  ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:365,  ric_rep:0},
    'DIRETTORE':             {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:7,    ric_rep:0},
    'MEDICO':                {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:70,   ric_rep:0},
    'OPERATORE SOCIALE':     {n:1,  h_sett:13.0,  h_mese:56,   ric_mese:20,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:12,   ric_rep:0},
    'AMMINISTRATIVO':        {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:5,    ric_rep:0},
    'INFERMIERE':            {n:1,  h_sett:12.0,  h_mese:52,   ric_mese:11,   ric_rep:0},
  },
  VICENZA: {  // ospiti medi 2025: 114, tipo: CC
    'OPERATORE DIURNO':      {n:26, h_sett:712.0, h_mese:3085, ric_mese:1096, ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:487,  ric_rep:0},
    'DIRETTORE':             {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:15,   ric_rep:0},
    'MEDICO':                {n:1,  h_sett:0.0,   h_mese:0,    ric_mese:87,   ric_rep:0},
    'OPERATORE SOCIALE':     {n:5,  h_sett:156.0, h_mese:676,  ric_mese:25,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:3,  h_sett:82.0,  h_mese:355,  ric_mese:16,   ric_rep:0},
    'AMMINISTRATIVO':        {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:9,    ric_rep:0},
    'INFERMIERE':            {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:15,   ric_rep:0},
  },
  MODENA: {  // ospiti medi 2025: 654, tipo: CC
    'OPERATORE DIURNO':      {n:122, h_sett:4034.0, h_mese:17481, ric_mese:2374, ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,   h_sett:0.0,    h_mese:0,     ric_mese:852,  ric_rep:0},
    'DIRETTORE':             {n:2,   h_sett:76.0,   h_mese:329,   ric_mese:22,   ric_rep:0},
    'MEDICO':                {n:0,   h_sett:0.0,    h_mese:0,     ric_mese:183,  ric_rep:0},
    'OPERATORE SOCIALE':     {n:16,  h_sett:436.0,  h_mese:1889,  ric_mese:79,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:0,   h_sett:0.0,    h_mese:0,     ric_mese:57,   ric_rep:0},
    'AMMINISTRATIVO':        {n:8,   h_sett:304.0,  h_mese:1317,  ric_mese:22,   ric_rep:0},
    'INFERMIERE':            {n:0,   h_sett:0.0,    h_mese:0,     ric_mese:56,   ric_rep:0},
  },
  VICO: {  // ospiti medi 2025: 17, tipo: CC
    'OPERATORE DIURNO':      {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:244,  ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:244,  ric_rep:0},
    'DIRETTORE':             {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:3,    ric_rep:0},
    'MEDICO':                {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:61},
    'OPERATORE SOCIALE':     {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:11,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:5,    ric_rep:0},
    'AMMINISTRATIVO':        {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:0},
    'INFERMIERE':            {n:9,  h_sett:244.0, h_mese:1057, ric_mese:0,    ric_rep:0},
  },
  CAMBO: {  // ospiti medi 2025: 17, tipo: CC
    'OPERATORE DIURNO':      {n:2,  h_sett:52.0,  h_mese:225,  ric_mese:244,  ric_rep:0},
    'OPERATORE NOTTURNO':    {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:244,  ric_rep:0},
    'DIRETTORE':             {n:1,  h_sett:20.0,  h_mese:87,   ric_mese:3,    ric_rep:0},
    'MEDICO':                {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:61},
    'OPERATORE SOCIALE':     {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:11,   ric_rep:0},
    'MEDIATORE LINGUISTICO': {n:1,  h_sett:22.0,  h_mese:95,   ric_mese:5,    ric_rep:0},
    'AMMINISTRATIVO':        {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:0},
    'INFERMIERE':            {n:0,  h_sett:0.0,   h_mese:0,    ric_mese:0,    ric_rep:0},
  },
};

// ═══════════════════════════════════════════════════════════
// SBARCHI NAZIONALI — Serie storica mensile
// Fonte: webhook Zoho Creator "Sbarchi" → Cruscotto Statistico Ministero Interno
//   URL fonte: https://www.interno.gov.it (cruscotto_statistico_giornaliero_GG-MM-AAAA.pdf)
// ⚠️ Il webhook è stato interrotto in alcuni periodi (gap Jun–Dic 2024)
// Aggiornato: Novembre 2025 — per aggiornare riprendere webhook o caricare PDF ministeriale
// Unità: numero di persone sbarcate (aggregato mensile)
// Uso: correlazione afflusso nazionale vs presenze nei centri
// ═══════════════════════════════════════════════════════════
DA.SBARCHI_M = {
  2023: [2814, 6314, 3123, 6402, 5417, 8246, 6936, 8718, 4714, 6038, 5804, 3100],
  2024: [1593, 1523,  883, 3081, 2304,    0,    0,    0,    0,    0,    0,    0],  // gap Jun–Dic: dati non inseriti in Zoho
  2025: [1575, 1906, 1415, 3489, 3184, 3322, 2782, 3246, 2026, 1599, 1414,    0],  // Dic: dato non ancora disponibile
};
DA.SBARCHI_ANNI = [2023, 2024, 2025];

// Totali annui
DA.SBARCHI_TOTALI = {
  2023: 66904,  // anno completo
  2024:  9384,  // solo Gen–Mag (dato parziale — gap in Zoho)
  2025: 27970,  // Gen–Nov (dato parziale)
};

// Helper: array mensile sbarchi per anno (12 valori, 0 se N/D)
DA.getSbarchiAnno = function(anno){ return DA.SBARCHI_M[anno] || Array(12).fill(0); };

// ═══════════════════════════════════════════════════════════
// CCNL — PAGA BASE PER LIVELLO
// Fonte: Zoho Creator "Dati CCNL" — CCNL AZIENDE ALBERGHIERE - CONFCOMMERCIO
// ⚠️ APPLICATO A: azienda HYMA (non Angolo/cooperativa)
// I costi reali del personale Angolo sono in "Nota Contabile" e "Costo del Personale" Zoho
// Aggiornato: Aprile 2024 (data ultima modifica Zoho)
// Unità: € lordi/mese (paga base — escluse indennità, contingenza, ecc.)
// Livelli: A (quadro) → 7 (base) — ordine decrescente di retribuzione
// Ore standard full-time: 173.33 h/mese (40h/sett × 52/12)
// ═══════════════════════════════════════════════════════════
DA.CCNL_ALBERGHIERO = {
  'A':  { paga_base: 2210.16, euro_h: +(2210.16/173.33).toFixed(2) },
  'B':  { paga_base: 2046.20, euro_h: +(2046.20/173.33).toFixed(2) },
  '1':  { paga_base: 1906.44, euro_h: +(1906.44/173.33).toFixed(2) },
  '2':  { paga_base: 1742.47, euro_h: +(1742.47/173.33).toFixed(2) },
  '3':  { paga_base: 1643.37, euro_h: +(1643.37/173.33).toFixed(2) },
  '4':  { paga_base: 1550.69, euro_h: +(1550.69/173.33).toFixed(2) },
  '5':  { paga_base: 1454.28, euro_h: +(1454.28/173.33).toFixed(2) },
  '6S': { paga_base: 1398.37, euro_h: +(1398.37/173.33).toFixed(2) },
  '6':  { paga_base: 1378.55, euro_h: +(1378.55/173.33).toFixed(2) },
  '7':  { paga_base: 1291.81, euro_h: +(1291.81/173.33).toFixed(2) },
};
DA.CCNL_LIVELLI = ['A','B','1','2','3','4','5','6S','6','7'];

// CCNL COOPERATIVE SOCIALI — rinnovo contrattuale Ott 2024
// Fonte: Zoho Creator "Dati CCNL" — Decorrenza 01/10/2024
// ✅ APPLICATO A: azienda ANGOLO (Cooperativa Sociale — tutti i dipendenti diretti)
// I costi effettivi sono in Zoho "Nota Contabile" e "Costo del Personale"
DA.CCNL_COOP_SOCIALI = {
  'F2Q': { paga_base: 2455.67 },
  'F2':  { paga_base: 2455.67 },
  'F1Q': { paga_base: 2150.18 },
  'F1':  { paga_base: 2150.18 },
  'E2Q': { paga_base: 1947.00 },
  'E2':  { paga_base: 1947.00 },
  'E1':  { paga_base: 1803.62 },
  'D3':  { paga_base: 1803.62 },
  'D2':  { paga_base: 1660.99 },
  'D1':  { paga_base: 1574.41 },
  'C3':  { paga_base: 1574.41 },
  'C2':  { paga_base: 1529.48 },
  'C1':  { paga_base: 1485.21 },
  'B1':  { paga_base: 1381.00 },
  'A2':  { paga_base: 1319.37 },
  'A1':  { paga_base: 1307.22 },
};

// Helper: costo orario teorico per livello CCNL Alberghiero
DA.getCostoOrarioTeorico = function(livello){
  return DA.CCNL_ALBERGHIERO[livello]?.euro_h || null;
};

// Helper: costo mensile teorico per livello + ore mensili contratto
// Formula: euro_h × ore_mese_contratto
DA.getCostoMensileTeoricoLiv = function(livello, ore_mese){
  const euro_h = DA.getCostoOrarioTeorico(livello);
  return (euro_h && ore_mese > 0) ? +(euro_h * ore_mese).toFixed(2) : null;
};

// ═══════════════════════════════════════════════════════════
// MAPPING MANSIONI: Capitolato (Organico Mensile) → Zoho Analytics
// ═══════════════════════════════════════════════════════════
// Chiavi sorgente: DA.ORE_MANS_KEYS (op_d, op_n_rep, op_n_eff, med_ling, …)
//   — usate in DA.ORE_MANSIONI e Organico Mensile (Zoho Creator)
// Valori: nomi mansione in DA.MANSIONI / Zoho Analytics "Costi orari CAS"
// Nota: op_n_rep e op_n_eff → stessa figura "OPERATORE CENTRO ACCOGLIENZA"
DA.MANSIONI_MAP_CAP_TO_ANALYTICS = {
  op_d:        ['OPERATORE CENTRO ACCOGLIENZA'],
  op_n_rep:    ['OPERATORE CENTRO ACCOGLIENZA'],
  op_n_eff:    ['OPERATORE CENTRO ACCOGLIENZA'],
  med_ling:    ['MEDIATORE INTERCULTURALE'],
  medico_rep:  ['MEDICO'],
  medico_eff:  ['MEDICO'],
  inferm:      ['INFERMIERE/A'],
  dir:         ['DIRETTORE/TRICE', 'COORDINATORE/TRICE'],
  op_soc:      ['OPERATORE SOCIALE'],
  amm:         ['IMPIEGATO AMMINISTRATIVO'],
};

// Mappa inversa: nome Zoho Analytics → chiave/i capitolato
DA.ANALYTICS_TO_CAP = (function(){
  const inv = {};
  Object.entries(DA.MANSIONI_MAP_CAP_TO_ANALYTICS).forEach(([cap, zohoNames]) => {
    zohoNames.forEach(zn => {
      if(!inv[zn]) inv[zn] = [];
      inv[zn].push(cap);
    });
  });
  return inv;
})();

// Helper: dato un nome mansione Zoho Analytics, restituisce le ore richieste (ric)
// per quel CdC e mese dall'Organico Mensile, aggregando tutte le chiavi capitolato mappate
// anno: number, mese: number 0-indexed
DA.getOreRichiesteMansione = function(cdc_k, zohoMansione, anno, mese){
  const record = DA.getOrganicoMensile(anno, mese);
  if(!record) return null;
  const capKeys = DA.ANALYTICS_TO_CAP[zohoMansione.toUpperCase()] || [];
  return capKeys.reduce((s, ck) => s + (record.mansioni[ck]?.ric || 0), 0);
};

// Helper: confronto ore erogate Zoho vs richieste capitolato per una mansione
// Restituisce { erogate, richieste, delta, pct } o null se dati mancanti
DA.confrontoOreMansione = function(cdc_k, zohoMansione, anno){
  const mans = DA.MANSIONI[cdc_k];
  if(!mans) return null;
  const man = mans.find(m => m.r.toUpperCase().includes(zohoMansione.toUpperCase()));
  const erogate  = man?.h  || 0;
  const pres_ann = DA.PRESENZE_EST[cdc_k] || 1;
  // Ore richieste stimate per l'anno: media dai mesi disponibili × 12
  const mesiDisp = Object.keys(DA.ORE_MANSIONI['2025'] || {}).map(Number);
  let totRic = 0, nMesi = 0;
  mesiDisp.forEach(m => {
    const r = DA.getOreRichiesteMansione(cdc_k, zohoMansione, 2025, m);
    if(r !== null){ totRic += r; nMesi++; }
  });
  const richieste_ann = nMesi > 0 ? Math.round(totRic / nMesi * 12) : null;
  if(richieste_ann === null) return { erogate, richieste: null, delta: null, pct: null };
  const delta = erogate - richieste_ann;
  const pct   = richieste_ann > 0 ? +(delta / richieste_ann * 100).toFixed(1) : null;
  return { erogate, richieste: richieste_ann, delta, pct };
};

// Esposizione globale: `const DA` non finisce su window. Lo facciamo manualmente
// così live.js e gli altri script possono usare `window.DA && DA.X` come fallback.
window.DA = DA;
