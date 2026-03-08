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
    <button class="active" data-page="corsi">📚 Corsi</button>
    <button data-page="marina">⚓ Marina Militare</button>
    <button data-page="avanzato">📙 Avanzato</button>
    <button data-page="quiz" data-quiz-direct="2">🎯 Quiz</button>
    <button data-page="contatti">✉️ Contatti</button>
    <button id="nav-auth-btn" class="nav-auth-btn" data-apri-auth-nav>👤 Iscriviti / Entra</button>
  </nav>

  <main>
    <section id="corsi" class="page active">
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
          <span class="badge">8 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="0">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📗</div>
          <h3>Inglese Pre-Intermedio (A2–B1)</h3>
          <p>Passato, futuro, condizionale, frasi composte e conversazioni pratiche.</p>
          <span class="badge">10 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="1">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📘</div>
          <h3>Inglese Intermedio (B1–B2)</h3>
          <p>Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.</p>
          <span class="badge">12 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="2">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📙</div>
          <h3>Inglese Avanzato (C1–C2)</h3>
          <p>Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.</p>
          <span class="badge">14 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="3">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">✈️</div>
          <h3>Inglese per Viaggi</h3>
          <p>Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.</p>
          <span class="badge">4 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="4">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🎓</div>
          <h3>Preparazione IELTS / Cambridge</h3>
          <p>Simulazioni d'esame, writing task, reading avanzato, speaking test.</p>
          <span class="badge">12 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="5">Vai agli esercizi →</button>
        </div>
      </div>

      <!-- Categoria: Business & Professionale -->
      <h3 class="tw-text-lg tw-font-bold tw-mb-3 tw-mt-8" style="color:var(--primary);">💼 Business & Professionale</h3>
      <div class="cards-grid">
        <div class="card cat-card">
          <div class="card-icon">💼</div>
          <h3>Business English</h3>
          <p>Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.</p>
          <span class="badge">8 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="6">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">🤝</div>
          <h3>Inglese per Negoziazioni</h3>
          <p>Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.</p>
          <span class="badge">6 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="6">Vai agli esercizi →</button>
        </div>
        <div class="card cat-card">
          <div class="card-icon">📊</div>
          <h3>Inglese per Presentazioni</h3>
          <p>Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.</p>
          <span class="badge">4 SETTIMANE</span><br>
          <button class="btn" data-quiz-direct="6">Vai agli esercizi →</button>
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

      <!-- ============================================================ -->
      <!-- ESERCIZI INTERATTIVI NAVALI                                  -->
      <!-- ============================================================ -->
      <h2 class="section-title" style="margin-top:48px;">Esercizi Interattivi</h2>
      <p class="section-sub">Metti alla prova il tuo vocabolario navale con tre tipi di esercizi</p>
      <div class="divider"></div>

      <div class="es-tab-selector">
        <button class="es-tab active" data-es-panel="flashcard">🃏 Flashcard</button>
        <button class="es-tab" data-es-panel="fillblank">✍️ Completa la Frase</button>
        <button class="es-tab" data-es-panel="matching">🔗 Abbinamento</button>
      </div>

      <!-- FLASHCARD -->
      <div id="es-panel-flashcard" class="es-panel">
        <p class="flashcard-score">Clicca ogni card per girare e vedere la traduzione italiana</p>
        <div class="flashcard-grid" id="flashcard-grid"></div>
        <button class="fc-reset-btn" id="fc-reset-btn">↺ Reimposta tutte le card</button>
      </div>

      <!-- FILL IN THE BLANK -->
      <div id="es-panel-fillblank" class="es-panel hidden">
        <p class="blank-score" id="blank-score-label">Punteggio: <strong>0 / 6</strong></p>

        <div class="blank-question" data-blank-answer="HELM">
          <div class="blank-sentence">The <span class="blank-slot">___</span> is used to steer the ship.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="RADAR">RADAR</button>
            <button class="blank-opt" data-val="HELM">HELM</button>
            <button class="blank-opt" data-val="ANCHOR">ANCHOR</button>
            <button class="blank-opt" data-val="MAST">MAST</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <div class="blank-question" data-blank-answer="VHF">
          <div class="blank-sentence">A <span class="blank-slot">___</span> radio is used for short-range communications at sea.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="GPS">GPS</button>
            <button class="blank-opt" data-val="AIS">AIS</button>
            <button class="blank-opt" data-val="VHF">VHF</button>
            <button class="blank-opt" data-val="ECDIS">ECDIS</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <div class="blank-question" data-blank-answer="FLIGHT">
          <div class="blank-sentence">The <span class="blank-slot">___</span> deck is where aircraft take off on an aircraft carrier.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="UPPER">UPPER</button>
            <button class="blank-opt" data-val="MAIN">MAIN</button>
            <button class="blank-opt" data-val="BRIDGE">BRIDGE</button>
            <button class="blank-opt" data-val="FLIGHT">FLIGHT</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <div class="blank-question" data-blank-answer="ANCHOR">
          <div class="blank-sentence">The ship drops its <span class="blank-slot">___</span> to stay in position.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="ANCHOR">ANCHOR</button>
            <button class="blank-opt" data-val="KEEL">KEEL</button>
            <button class="blank-opt" data-val="PROPELLER">PROPELLER</button>
            <button class="blank-opt" data-val="MAST">MAST</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <div class="blank-question" data-blank-answer="CONNING">
          <div class="blank-sentence">The <span class="blank-slot">___</span> tower on a submarine allows observation of the surface.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="MAIN">MAIN</button>
            <button class="blank-opt" data-val="RADAR">RADAR</button>
            <button class="blank-opt" data-val="CONNING">CONNING</button>
            <button class="blank-opt" data-val="CONTROL">CONTROL</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <div class="blank-question" data-blank-answer="JACKET">
          <div class="blank-sentence">A life <span class="blank-slot">___</span> is mandatory safety equipment on all vessels.</div>
          <div class="blank-options">
            <button class="blank-opt" data-val="RING">RING</button>
            <button class="blank-opt" data-val="ROPE">ROPE</button>
            <button class="blank-opt" data-val="RAFT">RAFT</button>
            <button class="blank-opt" data-val="JACKET">JACKET</button>
          </div>
          <div class="blank-feedback"></div>
        </div>

        <button class="blank-reset-btn" id="blank-reset-btn">↺ Ricomincia</button>
      </div>

      <!-- MATCHING -->
      <div id="es-panel-matching" class="es-panel hidden">
        <p class="match-score" id="match-score-label">Abbina ogni termine inglese alla sua traduzione italiana</p>
        <div class="matching-game">
          <div class="match-col" id="match-left-col">
            <h4>🇬🇧 Termine Inglese</h4>
          </div>
          <div class="match-col" id="match-right-col">
            <h4>🇮🇹 Traduzione Italiana</h4>
          </div>
        </div>
        <button class="match-reset-btn" id="match-reset-btn">↺ Nuova partita</button>
      </div>

      <div class="center-block" style="margin-top:48px;">
        <button class="btn-primary" id="naval-quiz-cta">⚓ Metti alla prova le tue conoscenze navali →</button>
      </div>
    </section>

    <section id="avanzato" class="page">
      <h2 class="section-title">Inglese Avanzato (C1–C2)</h2>
      <p class="section-sub">Grammatica complessa, idiomi, stile accademico e padronanza della lingua</p>
      <div class="divider"></div>

      <div class="avanzato-selector">
        <button class="avanzato-tab active" data-panel="grammatica">🔧 Grammatica</button>
        <button class="avanzato-tab" data-panel="idiomi">💬 Idiomi</button>
        <button class="avanzato-tab" data-panel="vocabolario">📚 Vocabolario</button>
        <button class="avanzato-tab" data-panel="scrittura">✍️ Scrittura</button>
      </div>

      <div class="avanzato-panel" id="panel-grammatica">
        <h3 class="panel-title">🔧 Strutture Grammaticali Avanzate</h3>
        <div class="cards-grid">
          <div class="card cat-card">
            <div class="card-icon">🔄</div>
            <h3>Inversione (Inversion)</h3>
            <p><strong>Never had I</strong> seen such a sight.<br><strong>Not only did</strong> she win, but she also broke the record.<br><strong>Hardly had</strong> he arrived when it started raining.<br><strong>Little did</strong> they know what would happen.</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">📐</div>
            <h3>Congiuntivo (Subjunctive)</h3>
            <p>The board insists that he <strong>submit</strong> the report.<br>It is vital that she <strong>be</strong> informed.<br>If I <strong>were</strong> you, I would reconsider.<br>They demanded that he <strong>leave</strong> immediately.</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">✂️</div>
            <h3>Cleft Sentences</h3>
            <p><strong>It was</strong> John <strong>who</strong> called.<br><strong>What</strong> I need <strong>is</strong> more time.<br><strong>It is</strong> hard work <strong>that</strong> leads to success.<br><strong>What happened was</strong> unexpected.</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">📦</div>
            <h3>Nominalizzazione</h3>
            <p>Trasformare verbi/aggettivi in sostantivi:<br><em>discover → <strong>discovery</strong></em><br><em>contribute → <strong>contribution</strong></em><br><em>effective → <strong>effectiveness</strong></em><br><em>analyse → <strong>analysis</strong></em></p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🗣️</div>
            <h3>Discorso Indiretto Avanzato</h3>
            <p>"I will finish it" → She said <strong>she would finish it</strong>.<br>"Have you met him?" → He asked <strong>if I had met him</strong>.<br>"Don't be late!" → She told me <strong>not to be late</strong>.<br>"I might leave" → He said he <strong>might leave</strong>.</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">⚙️</div>
            <h3>Passivo Avanzato</h3>
            <p>The report <strong>is said to have been written</strong> by an expert.<br>He <strong>is believed to be</strong> the leader.<br>It <strong>is thought that</strong> the economy will recover.<br>She <strong>is reported to have left</strong> the country.</p>
            <span class="badge">C1–C2</span>
          </div>
        </div>
        <div class="center-block" style="margin-top:1.5rem;">
          <button class="btn-primary" data-quiz-direct="3">📙 Quiz Grammatica Avanzata →</button>
        </div>
      </div>

      <div class="avanzato-panel hidden" id="panel-idiomi">
        <h3 class="panel-title">💬 Idiomi, Collocazioni e Frasi Fisse</h3>
        <div class="cards-grid">
          <div class="card cat-card">
            <div class="card-icon">🪄</div>
            <h3>Idiomi C1 — Difficoltà</h3>
            <p><strong>Bite the bullet</strong> — affrontare qualcosa di difficile.<br><strong>Burn bridges</strong> — rovinare una relazione per sempre.<br><strong>Cut corners</strong> — fare le cose in modo approssimativo.<br><strong>Bite off more than you can chew</strong> — assumersi troppo.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🌟</div>
            <h3>Idiomi C1 — Successo</h3>
            <p><strong>Hit the nail on the head</strong> — dire la cosa giusta.<br><strong>Go the extra mile</strong> — fare più del necessario.<br><strong>Pull strings</strong> — usare le proprie influenze.<br><strong>Rise to the occasion</strong> — essere all'altezza.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🎯</div>
            <h3>Collocazioni Avanzate</h3>
            <p><strong>Reach a consensus</strong> — trovare un accordo.<br><strong>Draw a conclusion</strong> — trarre una conclusione.<br><strong>Take precedence</strong> — avere la priorità.<br><strong>Strike a balance</strong> — trovare un equilibrio.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">💼</div>
            <h3>Idiomi Formali C2</h3>
            <p><strong>On the fence</strong> — indeciso, neutrale.<br><strong>Play devil's advocate</strong> — difendere una posizione opposta.<br><strong>Catch-22</strong> — situazione senza via d'uscita.<br><strong>The tip of the iceberg</strong> — solo la parte visibile di un problema.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🔑</div>
            <h3>Connettori Accademici</h3>
            <p><strong>Nevertheless</strong> — nonostante ciò.<br><strong>Furthermore</strong> — inoltre, per di più.<br><strong>Consequently</strong> — di conseguenza.<br><strong>Notwithstanding</strong> — nondimeno.<br><strong>Albeit</strong> — sebbene.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🔁</div>
            <h3>Phrasal Verbs Avanzati</h3>
            <p><strong>Account for</strong> — spiegare, giustificare.<br><strong>Bear out</strong> — confermare, dare ragione.<br><strong>Call into question</strong> — mettere in dubbio.<br><strong>Set out to</strong> — proporsi di fare qualcosa.</p>
          </div>
        </div>
        <div class="center-block" style="margin-top:1.5rem;">
          <button class="btn-primary" data-quiz-direct="3">📙 Quiz Idiomi e Frasi →</button>
        </div>
      </div>

      <div class="avanzato-panel hidden" id="panel-vocabolario">
        <h3 class="panel-title">📚 Vocabolario Accademico (AWL)</h3>
        <div class="cards-grid">
          <div class="card cat-card">
            <div class="card-icon">🔬</div>
            <h3>Analisi e Ricerca</h3>
            <p><strong>Corroborate</strong> — confermare con prove.<br><strong>Substantiate</strong> — supportare con fatti.<br><strong>Extrapolate</strong> — estendere dati oltre i valori noti.<br><strong>Juxtapose</strong> — mettere a confronto.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">⚖️</div>
            <h3>Argomentazione</h3>
            <p><strong>Equivocal</strong> — ambiguo, non chiaro.<br><strong>Fallacious</strong> — basato su un errore logico.<br><strong>Unequivocal</strong> — assolutamente chiaro.<br><strong>Postulate</strong> — ipotizzare come vero.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">📊</div>
            <h3>Dati e Statistiche</h3>
            <p><strong>Fluctuate</strong> — variare in modo irregolare.<br><strong>Correlate</strong> — essere in relazione.<br><strong>Plummet</strong> — calare drasticamente.<br><strong>Surge</strong> — aumentare bruscamente.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🏛️</div>
            <h3>Registro Formale</h3>
            <p><strong>Endeavour</strong> — sforzarsi, tentare (formale).<br><strong>Commenced</strong> — iniziato (formale per "started").<br><strong>Ascertain</strong> — accertare, stabilire con certezza.<br><strong>Hitherto</strong> — fino ad ora (molto formale).</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🌍</div>
            <h3>Parole Chiave IELTS/C2</h3>
            <p><strong>Ubiquitous</strong> — presente ovunque.<br><strong>Proliferate</strong> — diffondersi rapidamente.<br><strong>Mitigate</strong> — attenuare, ridurre.<br><strong>Exacerbate</strong> — aggravare, peggiorare.</p>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🎓</div>
            <h3>Stile Accademico</h3>
            <p><strong>Purport to</strong> — pretendere di, affermare di.<br><strong>Allude to</strong> — fare allusione a.<br><strong>Contend</strong> — sostenere (un'opinione).<br><strong>Concede</strong> — ammettere (un punto avversario).</p>
          </div>
        </div>
        <div class="center-block" style="margin-top:1.5rem;">
          <button class="btn-primary" data-quiz-direct="3">📙 Quiz Vocabolario C1–C2 →</button>
        </div>
      </div>

      <div class="avanzato-panel hidden" id="panel-scrittura">
        <h3 class="panel-title">✍️ Scrittura Accademica e Formale</h3>
        <div class="cards-grid">
          <div class="card cat-card">
            <div class="card-icon">📝</div>
            <h3>Struttura del Saggio</h3>
            <p><strong>Introduzione:</strong> hook + contesto + thesis statement.<br><strong>Corpo:</strong> topic sentence → argomenti → esempi → analisi.<br><strong>Conclusione:</strong> riformulazione tesi + implicazioni finali.</p>
            <span class="badge">IELTS / C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🎯</div>
            <h3>Thesis Statement</h3>
            <p>La tesi deve essere chiara, discutibile e specifica.<br><em>Debole:</em> "Technology is important."<br><em>Forte:</em> "Widespread adoption of AI in education risks undermining critical thinking skills unless carefully regulated."</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🔗</div>
            <h3>Coesione e Coerenza</h3>
            <p>Usa pronomi di riferimento, sinonimi e connettori per evitare ripetizioni.<br><strong>Riferimento:</strong> "The study… <em>it</em>… <em>this research</em>…"<br><strong>Sostituzione:</strong> "The results were significant. <em>These findings</em> suggest…"</p>
            <span class="badge">C1–C2</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">⚠️</div>
            <h3>Errori da Evitare</h3>
            <p>❌ Contrazioni: <em>don't → <strong>do not</strong></em><br>❌ Vaghe: <em>things, stuff, a lot → <strong>factors, elements, considerably</strong></em><br>❌ Prima persona: <em>I think → <strong>It can be argued that</strong></em><br>❌ Ripetizioni eccessive dello stesso vocabolo.</p>
            <span class="badge">Formale</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">📧</div>
            <h3>Email Formale C1</h3>
            <p><strong>Apertura:</strong> I am writing to enquire about…<br><strong>Richiesta:</strong> I would be grateful if you could…<br><strong>Chiusura:</strong> I look forward to hearing from you.<br><strong>Firma:</strong> Yours sincerely / Yours faithfully.</p>
            <span class="badge">C1</span>
          </div>
          <div class="card cat-card">
            <div class="card-icon">🏆</div>
            <h3>Registro C2 — Sfumature</h3>
            <p>Distingui tra <strong>nonetheless</strong> (più formale) e <strong>however</strong>.<br>Usa <strong>whilst</strong> invece di <strong>while</strong> in contesti scritti formali.<br><strong>Owing to</strong> è più formale di <strong>because of</strong>.<br><strong>In view of</strong> = considerando che.</p>
            <span class="badge">C2</span>
          </div>
        </div>
        <div class="center-block" style="margin-top:1.5rem;">
          <button class="btn-primary" data-quiz-direct="5">🎓 Quiz IELTS / Cambridge →</button>
        </div>
      </div>
    </section>

    <section id="quiz" class="page">
      <h2 class="section-title">Quiz Interattivi</h2>
      <p class="section-sub">Testa le tue conoscenze. Ogni quiz include punteggio e valutazione finale.</p>
      <div class="divider"></div>

      <div class="quiz-wrapper">

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

  <!-- ============================================================ -->
  <!-- MODAL ACCEDI / ISCRIVITI                                     -->
  <!-- ============================================================ -->
  <div id="auth-modal" class="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
    <div class="auth-box">
      <button class="auth-close" id="auth-close" aria-label="Chiudi">&times;</button>

      <div class="auth-logo">🎓 English Academy</div>

      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="accedi">Accedi</button>
        <button class="auth-tab" data-tab="iscriviti">Iscriviti</button>
      </div>

      <!-- TAB ACCEDI -->
      <div class="auth-panel active" id="auth-panel-accedi">
        <p class="auth-subtitle">Bentornato! Inserisci le tue credenziali.</p>
        <div id="auth-login-error" class="auth-error hidden"></div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="login-email" placeholder="mario@email.it" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="login-password" placeholder="La tua password" autocomplete="current-password">
        </div>
        <button class="btn-primary full-width" id="btn-login">Accedi →</button>
        <p class="auth-switch">Non hai un account? <a href="#" data-tab-switch="iscriviti">Iscriviti gratis</a></p>
      </div>

      <!-- TAB ISCRIVITI -->
      <div class="auth-panel" id="auth-panel-iscriviti">
        <p class="auth-subtitle" id="auth-corso-label">Crea il tuo account gratuito.</p>
        <div id="auth-reg-error" class="auth-error hidden"></div>
        <div class="auth-row-2">
          <div class="auth-field">
            <label>Nome</label>
            <input type="text" id="reg-nome" placeholder="Mario" autocomplete="given-name">
          </div>
          <div class="auth-field">
            <label>Cognome</label>
            <input type="text" id="reg-cognome" placeholder="Rossi" autocomplete="family-name">
          </div>
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="reg-email" placeholder="mario@email.it" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password <span class="auth-hint">(min. 6 caratteri)</span></label>
          <input type="password" id="reg-password" placeholder="Crea una password" autocomplete="new-password">
        </div>
        <button class="btn-primary full-width" id="btn-register">Crea Account →</button>
        <p class="auth-switch">Hai già un account? <a href="#" data-tab-switch="accedi">Accedi</a></p>
      </div>

      <!-- STATO SUCCESSO -->
      <div class="auth-panel" id="auth-panel-success">
        <div class="auth-success-icon">✅</div>
        <h3 id="auth-success-title">Operazione completata!</h3>
        <p id="auth-success-msg" class="auth-subtitle"></p>
        <button class="btn-primary full-width" id="btn-auth-chiudi">Chiudi</button>
      </div>
    </div>
  </div>

  <script>
    window.CSRF_TOKEN = "<?php echo htmlspecialchars($csrfToken, ENT_QUOTES); ?>";
  </script>
  <script src="/static/script.js?v=<?= filemtime(__DIR__.'/static/script.js') ?>"></script>

</body>
</html>
