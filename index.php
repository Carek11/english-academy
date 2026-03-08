<?php
/**
 * English Academy - Main Page
 * Gestisce la sessione e inietta il token CSRF per le chiamate API.
 */
session_start();
if (empty($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['token'];

// Impedisce la cache del browser — ogni visita carica HTML fresco
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>English Academy – Impara l'Inglese</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/static/style.css?v=<?= filemtime(__DIR__.'/static/style.css') ?>">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      prefix: 'tw-',
      corePlugins: { preflight: false }
    }
  </script>
  <style>
    /* ── Card Esercizi ── */
    #esercizi .ex-card {
      transition: box-shadow .2s, transform .2s, opacity .4s, translate .4s;
      opacity: 0;
      translate: 0 16px;
    }
    #esercizi .ex-card.visibile {
      opacity: 1;
      translate: 0 0;
    }
    #esercizi .ex-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.13); transform: translateY(-2px); }
    #esercizi .soluzione-box { display: none; }
    #esercizi .soluzione-box.aperta { display: block; }
    #esercizi pre { white-space: pre-wrap; word-break: break-word; }

    /* ── Badge ── */
    .badge-web   { background:#2563eb; color:#fff; }
    .badge-php   { background:#7c3aed; color:#fff; }
    .badge-db    { background:#059669; color:#fff; }
    .badge-py    { background:#d97706; color:#fff; }
    .badge-logic { background:#dc2626; color:#fff; }
    .badge-base  { background:#d1fae5; color:#065f46; }
    .badge-inter { background:#fef3c7; color:#92400e; }
    .badge-avanz { background:#fee2e2; color:#991b1b; }
    .filtro-attivo { background: var(--primary) !important; color: #fff !important; border-color: var(--primary) !important; }
    #corsi .cat-card { border-left: 4px solid var(--secondary); }

    /* ── Skeleton Loader ── */
    .sk-card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sk-line {
      border-radius: 6px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: sk-shimmer 1.4s infinite;
    }
    .sk-line-title   { height: 14px; width: 70%; }
    .sk-line-sub     { height: 10px; width: 35%; }
    .sk-line-body    { height: 10px; width: 100%; }
    .sk-line-body2   { height: 10px; width: 85%; }
    .sk-line-body3   { height: 10px; width: 60%; }
    .sk-line-btn     { height: 32px; width: 100%; margin-top: 8px; border-radius: 8px; }
    .sk-badges       { display: flex; gap: 6px; }
    .sk-badge        { height: 18px; width: 52px; border-radius: 99px; }
    @keyframes sk-shimmer {
      0%   { background-position:  200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ── AI Tutor Sidebar ── */
    #ai-tutor-sidebar {
      position: fixed;
      top: 0; right: -420px;
      width: 420px; height: 100vh;
      background: #0f172a;
      display: flex; flex-direction: column;
      z-index: 9999;
      transition: right .35s cubic-bezier(.4,0,.2,1);
      box-shadow: -8px 0 32px rgba(0,0,0,.4);
    }
    #ai-tutor-sidebar.aperto { right: 0; }
    #tutor-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,.5);
      z-index: 9998;
    }
    #tutor-overlay.visibile { display: block; }
    .tutor-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #1e3a5f, #0f172a);
      border-bottom: 1px solid #1e293b;
      display: flex; align-items: center; justify-content: space-between;
    }
    .tutor-chat {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .tutor-msg { max-width: 88%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
    .tutor-msg.user { background: #1d4ed8; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .tutor-msg.ai   { background: #1e293b; color: #e2e8f0; align-self: flex-start; border-bottom-left-radius: 4px; }
    .tutor-msg.ai.thinking { opacity: .6; font-style: italic; }
    .tutor-esercizio {
      margin: 12px 16px; padding: 12px 14px;
      background: #1e293b; border-left: 3px solid #3b82f6;
      border-radius: 8px; font-size: 12px; color: #94a3b8;
    }
    .tutor-input-area {
      padding: 12px 16px;
      border-top: 1px solid #1e293b;
      display: flex; gap: 8px; align-items: flex-end;
    }
    #tutor-input {
      flex: 1; background: #1e293b; color: #e2e8f0;
      border: 1px solid #334155; border-radius: 10px;
      padding: 10px 12px; font-size: 13px; resize: none;
      font-family: inherit; max-height: 100px; outline: none;
    }
    #tutor-input:focus { border-color: #3b82f6; }
    #tutor-send {
      background: #1d4ed8; color: white; border: none;
      border-radius: 10px; padding: 10px 14px; cursor: pointer;
      font-size: 16px; transition: background .2s;
    }
    #tutor-send:hover { background: #1e40af; }
    #tutor-send:disabled { opacity: .5; cursor: not-allowed; }

    /* ── Hub Inglese Card ── */
    .hub-card {
      background: white; border-radius: 16px;
      border: 1px solid #e2e8f0; padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      transition: box-shadow .2s, transform .2s, opacity .4s, translate .4s;
      opacity: 0; translate: 0 16px;
    }
    .hub-card.visibile { opacity: 1; translate: 0 0; }
    .hub-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
    .hub-badge-corso {
      display: inline-block; padding: 2px 10px;
      border-radius: 99px; font-size: 11px; font-weight: 700;
    }
    .hub-soluzione-box { display: none; }
    .hub-soluzione-box.aperta {
      display: block;
      background: #f0fdf4; border-left: 3px solid #22c55e;
      border-radius: 8px; padding: 10px 14px;
      font-size: 13px; color: #166534;
    }
    .corso-card-big {
      background: white; border-radius: 20px;
      padding: 24px; cursor: pointer;
      border: 2px solid transparent;
      transition: all .2s;
    }
    .corso-card-big:hover { transform: translateY(-4px); border-color: currentColor; box-shadow: 0 12px 32px rgba(0,0,0,.1); }

    /* ── Load More button ── */
    #btn-load-more {
      display: none;
      margin: 32px auto 0;
      min-width: 180px;
    }
    #btn-load-more.visibile { display: block; }
    #btn-load-more.caricando { opacity: .7; pointer-events: none; }
  </style>
</head>
<body>

  <header>
    <div class="header-anchor">
      <span class="anchor-icon">⚓</span>
      <div>
        <h1>English Academy</h1>
        <p>IMPARA · PRATICA · ECCELLI</p>
      </div>
      <span class="anchor-icon">⚓</span>
    </div>
  </header>

  <nav>
    <button class="active" data-page="home">🏠 Home</button>
    <button data-page="corsi">📚 Corsi</button>
    <button data-page="hub-inglese">🤖 Hub Inglese AI</button>
    <button data-page="esercizi">🛠️ Esercizi</button>
    <button data-page="marina">⚓ Marina Militare</button>
    <button data-page="quiz">🎯 Quiz</button>
    <button data-page="contatti">✉️ Contatti</button>
  </nav>

  <main>
    <section id="home" class="page active">
      <div class="hero">
        <h2>Benvenuto nell'English Academy</h2>
        <p>La piattaforma italiana per imparare l'inglese in modo professionale, moderno e interattivo. Dai corsi base fino all'inglese tecnico per la <strong style="color:var(--gold)">Marina Militare</strong>.</p>
        <div class="hero-btns">
          <button class="btn-primary" data-page-target="esercizi">🛠️ Inizia ad Esercitarti</button>
          <button class="btn-secondary" data-page-target="quiz">🎯 Fai un Quiz</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-box"><div class="stat-num">12+</div><div class="stat-label">Corsi Disponibili</div></div>
        <div class="stat-box"><div class="stat-num">3000+</div><div class="stat-label">Esercizi Pratici</div></div>
        <div class="stat-box"><div class="stat-num">50+</div><div class="stat-label">Quiz Interattivi</div></div>
        <div class="stat-box"><div class="stat-num">98%</div><div class="stat-label">Soddisfazione</div></div>
      </div>

      <h2 class="section-title">Tutti i Corsi</h2>
      <p class="section-sub">Scegli il percorso più adatto alle tue esigenze</p>
      <div class="divider"></div>

      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-6" style="color:var(--primary);">🇬🇧 Inglese Generale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">🌱</div>
          <h3>Inglese Base (A1–A2)</h3>
          <p>Alfabeto, numeri, saluti, presentazioni, verbi essenziali, articoli, presente semplice.</p>
          <span class="badge">8 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Base (A1-A2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📗</div>
          <h3>Inglese Pre-Intermedio (A2–B1)</h3>
          <p>Passato, futuro, condizionale, frasi composte e conversazioni pratiche.</p>
          <span class="badge">10 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Pre-Intermedio (A2-B1)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📘</div>
          <h3>Inglese Intermedio (B1–B2)</h3>
          <p>Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.</p>
          <span class="badge">12 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Intermedio (B1-B2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📙</div>
          <h3>Inglese Avanzato (C1–C2)</h3>
          <p>Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.</p>
          <span class="badge">14 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Avanzato (C1-C2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">✈️</div>
          <h3>Inglese per Viaggi</h3>
          <p>Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.</p>
          <span class="badge">4 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese per Viaggi">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🎓</div>
          <h3>Preparazione IELTS / Cambridge</h3>
          <p>Simulazioni d'esame, writing task, reading avanzato, speaking test.</p>
          <span class="badge">12 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Preparazione IELTS / Cambridge">Vai agli esercizi →</button>
        </div>
      </div>

      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">💼 Business & Professionale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">💼</div>
          <h3>Business English</h3>
          <p>Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.</p>
          <span class="badge">8 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🤝</div>
          <h3>Inglese per Negoziazioni</h3>
          <p>Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.</p>
          <span class="badge">6 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📊</div>
          <h3>Inglese per Presentazioni</h3>
          <p>Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.</p>
          <span class="badge">4 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
      </div>

      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">⚓ Marina Militare</h3>
      <div class="cards-grid">
        <div class="card card-naval cat-card">
          <div class="card-icon">⚓</div>
          <h3>Inglese Navale – Marina Militare</h3>
          <p>Terminologia delle navi da guerra, sottomarini, corvette, fregate e componenti navali NATO.</p>
          <span class="badge badge-blue">TECNICO – 16 SETTIMANE</span>
          <button class="btn" data-page-target="marina">Vai alla sezione Marina →</button>
          <button class="btn" style="margin-top:6px;" data-page-target="hub-inglese" data-hub-corso="Inglese Navale - Marina Militare">Vai agli esercizi →</button>
        </div>
      </div>

      <div class="naval-hero">
        <div class="naval-tag">⚓ NOVITÀ – SEZIONE MARINA MILITARE</div>
        <h2>Inglese Tecnico per la Marina</h2>
        <p>Una sezione dedicata interamente alla terminologia navale in inglese. Studia tipologie di navi, componenti, strumentazione di bordo e vocabolario operativo.</p>
        <button class="btn-primary mt-20" data-page-target="marina">⚓ Esplora la Sezione Marina →</button>
      </div>
    </section>

    <section id="corsi" class="page">
      <h2 class="section-title">Tutti i Corsi</h2>
      <p class="section-sub">Scegli il percorso più adatto alle tue esigenze</p>
      <div class="divider"></div>

      <!-- Categoria: Inglese Generale -->
      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-6" style="color:var(--primary);">🇬🇧 Inglese Generale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">🌱</div>
          <h3>Inglese Base (A1–A2)</h3>
          <p>Alfabeto, numeri, saluti, presentazioni, verbi essenziali, articoli, presente semplice.</p>
          <span class="badge">8 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Base (A1-A2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📗</div>
          <h3>Inglese Pre-Intermedio (A2–B1)</h3>
          <p>Passato, futuro, condizionale, frasi composte e conversazioni pratiche.</p>
          <span class="badge">10 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Pre-Intermedio (A2-B1)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📘</div>
          <h3>Inglese Intermedio (B1–B2)</h3>
          <p>Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.</p>
          <span class="badge">12 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Intermedio (B1-B2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📙</div>
          <h3>Inglese Avanzato (C1–C2)</h3>
          <p>Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.</p>
          <span class="badge">14 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese Avanzato (C1-C2)">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">✈️</div>
          <h3>Inglese per Viaggi</h3>
          <p>Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.</p>
          <span class="badge">4 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Inglese per Viaggi">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🎓</div>
          <h3>Preparazione IELTS / Cambridge</h3>
          <p>Simulazioni d'esame, writing task, reading avanzato, speaking test.</p>
          <span class="badge">12 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Preparazione IELTS / Cambridge">Vai agli esercizi →</button>
        </div>
      </div>

      <!-- Categoria: Business & Professionale -->
      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">💼 Business & Professionale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">💼</div>
          <h3>Business English</h3>
          <p>Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.</p>
          <span class="badge">8 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🤝</div>
          <h3>Inglese per Negoziazioni</h3>
          <p>Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.</p>
          <span class="badge">6 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📊</div>
          <h3>Inglese per Presentazioni</h3>
          <p>Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.</p>
          <span class="badge">4 SETTIMANE</span>
          <button class="btn" data-page-target="hub-inglese" data-hub-corso="Business English">Vai agli esercizi →</button>
        </div>
      </div>

      <!-- Categoria: Programmazione & Tech -->
      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">💻 Programmazione & Tech</h3>
      <div class="cards-grid">
        <div class="card cat-card" style="border-left-color:#2563eb;">
          <div class="card-icon">🌐</div>
          <h3>Web Development</h3>
          <p>HTML5, CSS Grid/Flexbox, JavaScript ES6+, React Hooks. Esercizi pratici inclusi.</p>
          <span class="badge" style="background:#2563eb;color:#fff;">TECNICO</span><br>
          <button class="btn" data-page-target="esercizi" data-cat="Web">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card" style="border-left-color:#7c3aed;">
          <div class="card-icon">🐘</div>
          <h3>PHP</h3>
          <p>Cicli, liste, funzioni, web scraping con cURL, automazione e parsing HTML.</p>
          <span class="badge" style="background:#7c3aed;color:#fff;">TECNICO</span><br>
          <button class="btn" data-page-target="esercizi" data-cat="PHP">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card" style="border-left-color:#059669;">
          <div class="card-icon">🗄️</div>
          <h3>Database SQL & NoSQL</h3>
          <p>Query SQL, JOIN, aggregazioni, CTE, indici. Introduzione a MongoDB.</p>
          <span class="badge" style="background:#059669;color:#fff;">TECNICO</span><br>
          <button class="btn" data-page-target="esercizi" data-cat="Database">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card" style="border-left-color:#d97706;">
          <div class="card-icon">🐍</div>
          <h3>Python & Algoritmi</h3>
          <p>Strutture dati, algoritmi di ordinamento, ricerca, generatori, decoratori.</p>
          <span class="badge" style="background:#d97706;color:#fff;">TECNICO</span><br>
          <button class="btn" data-page-target="esercizi" data-cat="Python">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card" style="border-left-color:#dc2626;">
          <div class="card-icon">🧠</div>
          <h3>Logica & Problem Solving</h3>
          <p>FizzBuzz, palindromi, anagrammi, Fibonacci, duplicati e algoritmi classici.</p>
          <span class="badge" style="background:#dc2626;color:#fff;">LOGICA</span><br>
          <button class="btn" data-page-target="esercizi" data-cat="Logica">Vai agli esercizi →</button>
        </div>
        <div class="card card-naval cat-card">
          <div class="card-icon">⚓</div>
          <h3>Inglese Navale – Marina Militare</h3>
          <p>Terminologia navale NATO, navi da guerra, sottomarini, fregate e comunicazioni.</p>
          <span class="badge badge-blue">TECNICO – 16 SETTIMANE</span><br>
          <button class="btn" data-page-target="marina">Vai alla sezione Marina →</button>
          <button class="btn" style="margin-top:6px;" data-page-target="hub-inglese" data-hub-corso="Inglese Navale - Marina Militare">Vai agli esercizi →</button>
        </div>
      </div>

      <h3 class="section-title faq-title">Domande Frequenti</h3>
      <div class="divider"></div>

      <div class="accordion">
        <button class="acc-header" type="button">
          <span>Come scelgo il corso giusto?</span>
          <span class="acc-chevron">▼</span>
        </button>
        <div class="acc-body">Inizia con un quiz di livello nella sezione Quiz. Ti aiuteremo a individuare il tuo livello e il percorso più adatto.</div>
      </div>

      <div class="accordion">
        <button class="acc-header" type="button">
          <span>I corsi sono online o in presenza?</span>
          <span class="acc-chevron">▼</span>
        </button>
        <div class="acc-body">Offriamo entrambe le modalità. Alcuni corsi specialistici sono disponibili anche in presenza presso sedi convenzionate.</div>
      </div>

      <div class="accordion">
        <button class="acc-header" type="button">
          <span>Ricevo un certificato al termine?</span>
          <span class="acc-chevron">▼</span>
        </button>
        <div class="acc-body">Sì. Al termine di ogni corso ricevi un attestato di completamento.</div>
      </div>

      <div class="accordion">
        <button class="acc-header" type="button">
          <span>Il corso Marina è aperto solo ai militari?</span>
          <span class="acc-chevron">▼</span>
        </button>
        <div class="acc-body">No. È aperto anche a civili, appassionati di nautica, tecnici portuali e professionisti del settore marittimo.</div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SEZIONE ESERCIZI                                             -->
    <!-- ============================================================ -->
    <section id="esercizi" class="page">

      <div class="naval-hero">
        <div class="naval-tag">🛠️ PRATICA ATTIVA</div>
        <h2>Esercizi di Programmazione</h2>
        <p>Studia, pratica e migliora con esercizi reali su Web, PHP, Database, Python e Logica. Clicca su ogni card per vedere la soluzione.</p>
      </div>

      <!-- ── Filtri e Ricerca ── -->
      <div class="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 tw-mb-8" style="margin-top:24px;">
        <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mb-4">
          <!-- Ricerca -->
          <div class="tw-flex-1 tw-min-w-[200px]">
            <input id="ex-search"
                   type="text"
                   placeholder="🔍 Cerca esercizi..."
                   class="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
                   style="font-family:inherit;">
          </div>
          <!-- Select difficoltà -->
          <select id="ex-diff"
                  class="tw-border tw-border-gray-300 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm"
                  style="font-family:inherit;">
            <option value="">Tutti i livelli</option>
            <option value="Base">🟢 Base</option>
            <option value="Intermedio">🟡 Intermedio</option>
            <option value="Avanzato">🔴 Avanzato</option>
          </select>
          <!-- Reset -->
          <button id="ex-reset"
                  class="tw-px-4 tw-py-2 tw-text-sm tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 hover:tw-bg-gray-100"
                  style="font-family:inherit;">
            ✕ Reset
          </button>
        </div>

        <!-- Filtri categoria -->
        <div class="tw-flex tw-flex-wrap tw-gap-2" id="filtri-categoria">
          <button class="filtro-cat filtro-attivo tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold" data-cat="" style="font-family:inherit;">
            Tutti
          </button>
          <button class="filtro-cat tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold badge-web" data-cat="Web" style="font-family:inherit;">
            🌐 Web
          </button>
          <button class="filtro-cat tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold badge-php" data-cat="PHP" style="font-family:inherit;">
            🐘 PHP
          </button>
          <button class="filtro-cat tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold badge-db" data-cat="Database" style="font-family:inherit;">
            🗄️ Database
          </button>
          <button class="filtro-cat tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold badge-py" data-cat="Python" style="font-family:inherit;">
            🐍 Python
          </button>
          <button class="filtro-cat tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-border tw-font-semibold badge-logic" data-cat="Logica" style="font-family:inherit;">
            🧠 Logica
          </button>
        </div>
      </div>

      <!-- ── Contatore risultati ── -->
      <p id="ex-count" class="tw-text-sm tw-text-gray-500 tw-mb-4">Caricamento esercizi...</p>

      <!-- ── Griglia Esercizi ── -->
      <div id="ex-grid" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6"></div>

      <!-- ── Load More ── -->
      <div class="center-block">
        <button id="btn-load-more" class="btn-primary">⬇️ Carica altri esercizi</button>
      </div>

      <!-- ── Nessun risultato (nascosto di default) ── -->
      <div id="ex-empty" style="display:none;" class="tw-text-center tw-py-16 tw-text-gray-400">
        <div class="tw-text-5xl tw-mb-4">🔍</div>
        <p class="tw-text-lg">Nessun esercizio trovato</p>
        <p class="tw-text-sm tw-mt-1">Prova a modificare i filtri o la ricerca</p>
      </div>

      <!-- ── CTA bottom ── -->
      <div class="center-block" style="margin-top:40px;">
        <button class="btn-primary" data-page-target="quiz">🎯 Mettiti alla prova con i Quiz →</button>
      </div>

    </section>

    <!-- ============================================================ -->
    <!-- SEZIONE MARINA MILITARE                                      -->
    <!-- ============================================================ -->
    <section id="marina" class="page">
      <div class="naval-hero">
        <div class="naval-tag">⚓ INGLESE TECNICO – MARINA MILITARE</div>
        <h2>Le Navi e i Componenti Navali</h2>
        <p>Impara la terminologia inglese delle principali imbarcazioni militari e dei loro componenti. Ogni scheda è bilingue.</p>
      </div>

      <h2 class="section-title">Tipologie di Navi</h2>
      <div class="divider"></div>

      <div class="ship-grid">
        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">🛸</span>
            <div><h3>Aircraft Carrier</h3><span>Portaerei</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Flight deck</span><span class="comp-it">Piano di volo continuo.</span></li>
              <li><span class="comp-en">Catapult</span><span class="comp-it">Sistema di lancio aerei.</span></li>
              <li><span class="comp-en">Island</span><span class="comp-it">Superstruttura centrale.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="carrier" title="Visualizza immagine della Portaerei">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>

        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">🚢</span>
            <div><h3>Destroyer</h3><span>Cacciatorpediniere</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Hull</span><span class="comp-it">Scafo principale.</span></li>
              <li><span class="comp-en">Bow</span><span class="comp-it">Prua anteriore.</span></li>
              <li><span class="comp-en">Stern</span><span class="comp-it">Poppa posteriore.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="destroyer" title="Visualizza immagine del Cacciatorpediniere">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>

        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">🤿</span>
            <div><h3>Submarine</h3><span>Sottomarino</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Conning tower</span><span class="comp-it">Torre di comando.</span></li>
              <li><span class="comp-en">Periscope</span><span class="comp-it">Dispositivo ottico elevabile.</span></li>
              <li><span class="comp-en">Propeller</span><span class="comp-it">Elica motrice.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="submarine" title="Visualizza immagine del Sottomarino">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>

        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">⚓</span>
            <div><h3>Frigate</h3><span>Fregata</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Bridge</span><span class="comp-it">Plancia di comando.</span></li>
              <li><span class="comp-en">Mast</span><span class="comp-it">Albero con sensori.</span></li>
              <li><span class="comp-en">Helipad</span><span class="comp-it">Piazzola elicotteri.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="frigate" title="Visualizza immagine della Fregata">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>

        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">🎖️</span>
            <div><h3>Cruiser</h3><span>Incrociatore</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Main battery</span><span class="comp-it">Batteria principale cannoni.</span></li>
              <li><span class="comp-en">Gun turret</span><span class="comp-it">Torretta girevole armata.</span></li>
              <li><span class="comp-en">Armored belt</span><span class="comp-it">Corazza di protezione.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="cruiser" title="Visualizza immagine dell'Incrociatore">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>

        <div class="ship-card">
          <div class="ship-header">
            <span class="ship-emoji">🎓</span>
            <div><h3>Training Ship</h3><span>Nave Scuola</span></div>
          </div>
          <div class="ship-body">
            <ul class="comp-list">
              <li><span class="comp-en">Classroom deck</span><span class="comp-it">Ponte aula didattico.</span></li>
              <li><span class="comp-en">Training rigging</span><span class="comp-it">Attrezzatura velica.</span></li>
              <li><span class="comp-en">Practice bridge</span><span class="comp-it">Plancia didattica.</span></li>
            </ul>
            <button class="ship-icon-btn" data-ship="trainingship" title="Visualizza immagine della Nave Scuola">
              <i class="fas fa-ship"></i>
            </button>
          </div>
        </div>
      </div>

      <h2 class="section-title">Componenti Comuni</h2>
      <div class="divider"></div>

      <div class="cards-grid">
        <div class="card">
          <div class="card-icon">🧭</div>
          <h3>Navigation Systems</h3>
          <p>GPS, Compass, ECDIS, Radar, AIS.</p>
        </div>
        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Engine Room</h3>
          <p>Main engine, Boiler, Generator, Bilge pump, Fuel tank.</p>
        </div>
        <div class="card">
          <div class="card-icon">📡</div>
          <h3>Communications</h3>
          <p>VHF radio, Satellite phone, Signal lamp, IFF system.</p>
        </div>
        <div class="card">
          <div class="card-icon">🛟</div>
          <h3>Safety Equipment</h3>
          <p>Life jacket, Life raft, Fire extinguisher, Emergency beacon, Damage control.</p>
        </div>
      </div>

      <div class="center-block">
        <button class="btn-primary" id="naval-quiz-cta">⚓ Metti alla prova le tue conoscenze navali →</button>
      </div>
    </section>

    <section id="quiz" class="page">
      <h2 class="section-title">Quiz Interattivi</h2>
      <p class="section-sub">Testa le tue conoscenze. Ogni quiz include punteggio e valutazione finale.</p>
      <div class="divider"></div>

      <div class="quiz-wrapper">
        <div id="step-name" class="name-form">
          <h3>👤 Come ti chiami?</h3>
          <p>Inserisci il tuo nome per personalizzare il quiz e salvare il punteggio</p>
          <input type="text" id="student-name-input" class="name-input" placeholder="Il tuo nome..." maxlength="40">
          <button class="btn-primary" id="submit-name-btn">Continua →</button>
        </div>

        <div id="step-select" class="hidden">
          <p class="quiz-greeting">Ciao <strong id="display-name"></strong>! Scegli il quiz:</p>
          <div class="quiz-selector">
            <button class="quiz-btn-sel" data-quiz="0"><span class="qi">🌱</span>Inglese Base</button>
            <button class="quiz-btn-sel" data-quiz="1"><span class="qi">📈</span>Intermedio</button>
            <button class="quiz-btn-sel" data-quiz="2"><span class="qi">💼</span>Business</button>
            <button class="quiz-btn-sel" data-quiz="3"><span class="qi">⚓</span>Marina Militare<br><small>10 domande casuali</small></button>
          </div>
        </div>

        <div id="step-quiz" class="quiz-container hidden">
          <div class="quiz-meta">
            <span class="quiz-student" id="quiz-student-label">👤 Studente</span>
            <span class="quiz-progress-text" id="quiz-progress">Domanda 1 di 6</span>
            <span class="quiz-score-live" id="quiz-score-live">⭐ 0 / 0</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>

          <div class="question-num" id="q-num">DOMANDA 1</div>
          <div class="question-text" id="q-text">Domanda...</div>
          <div class="options-grid" id="q-options"></div>
          <div id="q-feedback" class="feedback-msg hidden"></div>
          <button class="next-btn" id="next-btn">Prossima →</button>
        </div>

        <div id="step-results" class="hidden">
          <div class="quiz-container results-panel">
            <div class="score-circle" id="score-circle">
              <div class="score-circle-inner">
                <span class="score-pct" id="score-pct">0%</span>
                <span class="score-label">PUNTEGGIO</span>
              </div>
            </div>

            <h3 id="result-title">Risultato</h3>
            <p class="student-name" id="result-student"></p>

            <div class="result-details">
              <span class="result-pill pill-correct" id="r-correct">✓ 0 corrette</span>
              <span class="result-pill pill-wrong" id="r-wrong">✗ 0 errate</span>
              <span class="result-pill pill-total" id="r-total">📊 0 totali</span>
            </div>

            <div class="grade-badge" id="grade-badge">—</div>
            <br>
            <button class="btn-primary" id="retry-quiz-btn">🔄 Riprova</button>
            <button class="btn-secondary" id="change-quiz-btn">📚 Altro quiz</button>
          </div>

          <div class="leaderboard hidden" id="leaderboard">
            <div class="lb-title">🏆 I tuoi ultimi risultati</div>
            <div id="lb-entries"></div>
          </div>
        </div>
      </div>
    </section>

    <section id="contatti" class="page">
      <h2 class="section-title">Contatti</h2>
      <p class="section-sub">Invia un messaggio e ti risponderemo al più presto</p>
      <div class="divider"></div>

      <div class="contact-form">
        <h3>📩 Scrivici un messaggio</h3>
        <div id="form-sent" class="form-sent">✅ Messaggio inviato con successo!</div>

        <div id="contact-form-fields">
          <div class="form-row">
            <label for="contact-name">NOME E COGNOME</label>
            <input id="contact-name" type="text" placeholder="Mario Rossi">
          </div>

          <div class="form-row">
            <label for="contact-email">EMAIL</label>
            <input id="contact-email" type="email" placeholder="mario@email.it">
          </div>

          <div class="form-row">
            <label for="contact-message">MESSAGGIO</label>
            <textarea id="contact-message" placeholder="Scrivi qui il tuo messaggio..."></textarea>
          </div>

          <button class="btn-primary full-width" id="submit-form-btn">Invia Messaggio ✉️</button>
        </div>
      </div>
    </section>
    <!-- ============================================================ -->
    <!-- SEZIONE HUB INGLESE AI                                      -->
    <!-- ============================================================ -->
    <section id="hub-inglese" class="page">

      <div class="naval-hero">
        <div class="naval-tag">🤖 AI-POWERED LEARNING HUB</div>
        <h2>Hub Inglese con AI Tutor</h2>
        <p>3000 esercizi su 8 percorsi di inglese. In ogni esercizio puoi chiedere spiegazioni al <strong style="color:var(--gold)">Tutor AI</strong> che ti guida senza darti subito la risposta.</p>
      </div>

      <!-- Selezione corso (vista principale) -->
      <div id="hub-corsi-grid" style="margin-top:28px;">
        <h3 class="section-title" style="font-size:1.2rem;">Scegli il tuo percorso</h3>
        <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4 tw-mt-4">

          <div class="corso-card-big" style="border-left:4px solid #16a34a;color:#16a34a;" onclick="apriCorso('Inglese Base (A1-A2)')">
            <div style="font-size:2rem;margin-bottom:8px;">🌱</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Inglese Base</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">A1–A2 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #2563eb;color:#2563eb;" onclick="apriCorso('Inglese Pre-Intermedio (A2-B1)')">
            <div style="font-size:2rem;margin-bottom:8px;">📗</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Pre-Intermedio</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">A2–B1 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #7c3aed;color:#7c3aed;" onclick="apriCorso('Inglese Intermedio (B1-B2)')">
            <div style="font-size:2rem;margin-bottom:8px;">📘</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Intermedio</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">B1–B2 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #dc2626;color:#dc2626;" onclick="apriCorso('Inglese Avanzato (C1-C2)')">
            <div style="font-size:2rem;margin-bottom:8px;">📙</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Avanzato</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">C1–C2 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #0891b2;color:#0891b2;" onclick="apriCorso('Business English')">
            <div style="font-size:2rem;margin-bottom:8px;">💼</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Business English</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">B2–C1 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #d97706;color:#d97706;" onclick="apriCorso('Inglese per Viaggi')">
            <div style="font-size:2rem;margin-bottom:8px;">✈️</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Inglese per Viaggi</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">A2–B2 · 375 esercizi</p>
          </div>

          <div class="corso-card-big" style="border-left:4px solid #be185d;color:#be185d;" onclick="apriCorso('Preparazione IELTS / Cambridge')">
            <div style="font-size:2rem;margin-bottom:8px;">🎓</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">IELTS / Cambridge</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">B2–C2 · 375 esercizi</p>
          </div>

          <div class="corso-card-big card-naval" style="border-left:4px solid #1a3a52;color:#1a3a52;" onclick="apriCorso('Inglese Navale - Marina Militare')">
            <div style="font-size:2rem;margin-bottom:8px;">⚓</div>
            <h4 style="font-weight:700;font-size:.95rem;color:#111;">Inglese Navale</h4>
            <p style="font-size:.8rem;color:#6b7280;margin-top:4px;">B1–C1 · 375 esercizi</p>
          </div>

        </div>
      </div>

      <!-- Vista esercizi del corso selezionato -->
      <div id="hub-esercizi-view" style="display:none; margin-top:24px;">

        <!-- Breadcrumb + filtri -->
        <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-mb-6">
          <button id="hub-back-btn" class="tw-text-sm tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 tw-bg-white hover:tw-bg-gray-50" style="font-family:inherit;">
            ← Tutti i corsi
          </button>
          <h3 id="hub-corso-titolo" class="tw-font-bold tw-text-lg" style="color:var(--primary);"></h3>
          <div class="tw-flex-1"></div>
          <input id="hub-search" type="text" placeholder="🔍 Cerca..." class="tw-border tw-border-gray-300 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-w-40 focus:tw-outline-none" style="font-family:inherit;">
        </div>

        <!-- Contatore -->
        <p id="hub-count" class="tw-text-sm tw-text-gray-500 tw-mb-4"></p>

        <!-- Griglia esercizi -->
        <div id="hub-grid" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5"></div>

        <!-- Load More -->
        <div class="center-block" style="margin-top:24px;">
          <button id="hub-load-more" class="btn-primary" style="display:none;">⬇️ Carica altri esercizi</button>
        </div>

      </div>

    </section>

  </main>

  <!-- ============================================================ -->
  <!-- AI TUTOR SIDEBAR (globale, sempre presente nel DOM)          -->
  <!-- ============================================================ -->
  <div id="tutor-overlay"></div>

  <aside id="ai-tutor-sidebar" role="complementary" aria-label="AI Tutor">

    <div class="tutor-header">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:1.4rem;">🤖</span>
        <div>
          <div style="color:white;font-weight:700;font-size:.95rem;">Tutor AI</div>
          <div style="color:#94a3b8;font-size:.7rem;">Ti spiega senza darti la risposta</div>
        </div>
      </div>
      <button id="tutor-close" style="background:none;border:none;color:#94a3b8;font-size:1.4rem;cursor:pointer;line-height:1;" aria-label="Chiudi tutor">✕</button>
    </div>

    <!-- Esercizio corrente -->
    <div id="tutor-esercizio-box" class="tutor-esercizio" style="display:none;"></div>

    <!-- Chat -->
    <div class="tutor-chat" id="tutor-chat">
      <div class="tutor-msg ai">
        👋 Ciao! Sono il tuo Tutor AI di inglese.<br>Clicca <strong>"Chiedi al Tutor"</strong> su un esercizio per iniziare.
      </div>
    </div>

    <!-- Input area -->
    <div class="tutor-input-area">
      <textarea id="tutor-input" placeholder="Scrivi la tua domanda..." rows="1"></textarea>
      <button id="tutor-send" aria-label="Invia">➤</button>
    </div>

  </aside>

  <div class="toast" id="toast"></div>

  <div id="ship-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Nave</h2>
        <button class="modal-close" id="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <img id="modal-image" src="" alt="Immagine della nave" style="display:block; margin:20px auto; max-width:100%; height:auto;">
        <h3 id="modal-subtitle"></h3>
        <p id="modal-description"></p>
      </div>
    </div>
  </div>

  <script>
    window.CSRF_TOKEN = "<?php echo htmlspecialchars($csrfToken, ENT_QUOTES); ?>";
  </script>
  <script src="/static/script.js?v=<?= filemtime(__DIR__.'/static/script.js') ?>"></script>

</body>
</html>
