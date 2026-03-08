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
          <button class="btn-primary" data-page-target="quiz">🎯 Fai un Quiz</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-box"><div class="stat-num">12+</div><div class="stat-label">Corsi Disponibili</div></div>
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
        </div>
        <div class="card cat-card">
          <div class="card-icon">📗</div>
          <h3>Inglese Pre-Intermedio (A2–B1)</h3>
          <p>Passato, futuro, condizionale, frasi composte e conversazioni pratiche.</p>
          <span class="badge">10 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📘</div>
          <h3>Inglese Intermedio (B1–B2)</h3>
          <p>Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.</p>
          <span class="badge">12 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📙</div>
          <h3>Inglese Avanzato (C1–C2)</h3>
          <p>Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.</p>
          <span class="badge">14 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">✈️</div>
          <h3>Inglese per Viaggi</h3>
          <p>Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.</p>
          <span class="badge">4 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🎓</div>
          <h3>Preparazione IELTS / Cambridge</h3>
          <p>Simulazioni d'esame, writing task, reading avanzato, speaking test.</p>
          <span class="badge">12 SETTIMANE</span>
        </div>
      </div>

      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">💼 Business & Professionale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">💼</div>
          <h3>Business English</h3>
          <p>Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.</p>
          <span class="badge">8 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🤝</div>
          <h3>Inglese per Negoziazioni</h3>
          <p>Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.</p>
          <span class="badge">6 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📊</div>
          <h3>Inglese per Presentazioni</h3>
          <p>Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.</p>
          <span class="badge">4 SETTIMANE</span>
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
        </div>
        <div class="card cat-card">
          <div class="card-icon">📗</div>
          <h3>Inglese Pre-Intermedio (A2–B1)</h3>
          <p>Passato, futuro, condizionale, frasi composte e conversazioni pratiche.</p>
          <span class="badge">10 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📘</div>
          <h3>Inglese Intermedio (B1–B2)</h3>
          <p>Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.</p>
          <span class="badge">12 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📙</div>
          <h3>Inglese Avanzato (C1–C2)</h3>
          <p>Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.</p>
          <span class="badge">14 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">✈️</div>
          <h3>Inglese per Viaggi</h3>
          <p>Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.</p>
          <span class="badge">4 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🎓</div>
          <h3>Preparazione IELTS / Cambridge</h3>
          <p>Simulazioni d'esame, writing task, reading avanzato, speaking test.</p>
          <span class="badge">12 SETTIMANE</span>
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
        </div>
        <div class="card cat-card">
          <div class="card-icon">🤝</div>
          <h3>Inglese per Negoziazioni</h3>
          <p>Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.</p>
          <span class="badge">6 SETTIMANE</span>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📊</div>
          <h3>Inglese per Presentazioni</h3>
          <p>Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.</p>
          <span class="badge">4 SETTIMANE</span>
        </div>
      </div>

      <!-- Categoria: Marina Militare -->
      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">⚓ Marina Militare</h3>
      <div class="cards-grid">
        <div class="card card-naval cat-card">
          <div class="card-icon">⚓</div>
          <h3>Inglese Navale – Marina Militare</h3>
          <p>Terminologia delle navi da guerra, sottomarini, corvette, fregate e componenti navali NATO.</p>
          <span class="badge badge-blue">TECNICO – 16 SETTIMANE</span><br>
          <button class="btn" data-page-target="marina">Vai alla sezione Marina →</button>
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
  </main>

  <!-- ============================================================ -->
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
