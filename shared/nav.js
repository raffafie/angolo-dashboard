/* ========================================================
   DASHBOARD ANALYTICS — Cooperativa Angolo
   Navigation component — v4 (con home button + breadcrumb)
   ======================================================== */

(function(){
  const pages = [
    { href:'index.html',            icon:'🏠', label:'Hub',          id:'index'    },
    { href:'00_executive.html',     icon:'🎯', label:'Executive',    id:'exec'     },
    { href:'01_presenze.html',      icon:'📊', label:'Presenze',     id:'presenze' },
    { href:'02_redditivita.html',   icon:'💰', label:'Redditività',  id:'redd'     },
    { href:'03_ore.html',           icon:'⏱️', label:'Ore',          id:'ore'      },
    { href:'04_costi.html',         icon:'🧾', label:'Costi',        id:'costi'    },
    { href:'05_capitolato.html',    icon:'📋', label:'Capitolato',   id:'cap'      },
    { href:'06_personale.html',     icon:'👥', label:'Personale',    id:'personale'},
    { href:'07_immobili.html',      icon:'🏢', label:'Immobili',     id:'immobili' },
    { href:'08_ospiti.html',        icon:'⚖️', label:'Ospiti',       id:'ospiti'   },
    { href:'09_hr_assenteismo.html',  icon:'🏥', label:'Assenteismo',  id:'hr'       },
    { href:'10_ingressi_nuclei.html', icon:'🚪', label:'Ingressi',     id:'ingressi' },
    { href:'11_hr_analytics.html',    icon:'📈', label:'HR Analytics', id:'hr-an'    },
    { href:'12_costi_personale.html', icon:'💼', label:'Costi Pers.',  id:'costi-pers'},
    { href:'13_ore_assenteismo.html', icon:'⏱️', label:'Ore & Ass.',   id:'ore-ass'  },
  ];

  const currentPage = document.body.dataset.page || '';
  const isHub = currentPage === 'index';

  // URL Athena (Cloud Run) per link esterni come Settings KB personale
  const ATHENA_BASE = 'https://assistente-direzione-655855748814.europe-west1.run.app';

  function buildNav(){
    const topbar = document.getElementById('topbar');
    if(!topbar) return;

    const brand = `<a href="index.html" class="brand" title="Cooperativa L'Angolo — Torna alla Home" style="display:inline-flex;align-items:center;gap:8px;">
        <img src="shared/logo_angolo.png" alt="L'Angolo" style="height:28px;width:auto;object-fit:contain;border-radius:4px;background:#fff;padding:2px 4px;">
        <span style="font-weight:800;letter-spacing:-.3px;">Angolo Analytics</span>
      </a>`;

    const navLinks = pages
      .filter(p => p.id !== 'index') // Hub link è nel brand
      .map(p => {
        const active = p.id === currentPage ? ' class="active"' : '';
        return `<a href="${p.href}"${active}><span class="icon">${p.icon}</span><span>${p.label}</span></a>`;
      }).join('');

    // Link rapido a Settings Athena per gestire la KB personale (Drive Folder, sync RAG)
    const kbLink = `<a href="${ATHENA_BASE}/settings" target="_blank" rel="noopener"
       title="Athena Settings — Knowledge Base personale (Drive Folder, sync RAG)"
       style="margin-left:8px;border-left:1px solid var(--border2);padding-left:14px;">
       <span class="icon">🧠</span><span>KB Personale</span></a>`;

    const badge = `<div class="data-badge static" id="data-badge">◌ caricamento…</div>`;

    topbar.innerHTML = brand + `<nav>${navLinks}${kbLink}</nav>` + badge;
  }

  function buildBreadcrumb(){
    if(isHub) return; // Hub non ha breadcrumb
    const main = document.querySelector('main') || document.querySelector('.main');
    if(!main) return;

    const current = pages.find(p => p.id === currentPage);
    const label   = current ? `${current.icon} ${current.label}` : currentPage;

    const bc = document.createElement('div');
    bc.className = 'breadcrumb';
    bc.innerHTML = `<a href="index.html" class="bc-home">🏠 Dashboard Hub</a><span class="bc-sep">›</span><span class="bc-current">${label}</span>`;
    main.insertBefore(bc, main.firstChild);
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    buildBreadcrumb();
    // Aggiorna il badge data-badge ora che esiste nel DOM (race con live.js DOMContentLoaded)
    if (window.LIVE && typeof window.LIVE.renderDataBar === 'function') {
      window.LIVE.renderDataBar();
    }
  });
})();
