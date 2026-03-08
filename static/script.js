/* ========================================
   ENGLISH ACADEMY - MAIN APPLICATION
   Applicazione web per l'insegnamento dell'inglese
   ======================================== */

/* ── Patch globale fetch: aggiunge X-CSRF-Token su tutte le chiamate /api/ ── */
(function() {
  const _fetch = window.fetch.bind(window);
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      options = options || {};
      options.headers = Object.assign({}, options.headers || {}, {
        'X-CSRF-Token': window.CSRF_TOKEN || '',
      });
    }
    return _fetch(url, options);
  };
})();

/* ========================================
   SEZIONE 1: DATI
   ======================================== */

// Dati dei quiz per tutte le categorie
const datiQuiz = [
  {
    titolo: "Inglese Base",
    domande: [
      { q: "Come si dice 'Buongiorno' in inglese?", opts: ["Hello", "Good morning", "Good evening", "Goodbye"], ans: 1 },
      { q: "Quale è il plurale di 'child'?", opts: ["Childs", "Children", "Childrens", "Childre"], ans: 1 },
      { q: "Completa: 'She ___ a teacher.'", opts: ["am", "is", "are", "be"], ans: 1 },
      { q: "Come si dice 'Gatto' in inglese?", opts: ["Dog", "Bird", "Cat", "Fish"], ans: 2 },
      { q: "Quale frase è corretta?", opts: ["I doesn't like coffee", "I don't like coffee", "I not like coffee", "I no like coffee"], ans: 1 },
      { q: "Come si dice 'Quanto costa?' in inglese?", opts: ["How much is it?", "What is the price how?", "How many cost?", "Is it how much?"], ans: 0 }
    ]
  },
  {
    titolo: "Inglese Intermedio",
    domande: [
      { q: "Choose the correct form: 'By the time she arrived, we ___ the food.'", opts: ["already ate", "had already eaten", "already had eat", "was eating"], ans: 1 },
      { q: "Which sentence uses the passive voice correctly?", opts: ["The report wrote by him", "The report was written by him", "He written the report", "Written the report by him"], ans: 1 },
      { q: "'Despite the rain, they continued the match.' What does 'despite' mean?", opts: ["Because of", "In spite of", "Thanks to", "Due to"], ans: 1 },
      { q: "Choose the correct preposition: 'She is good ___ mathematics.'", opts: ["in", "on", "at", "for"], ans: 2 },
      { q: "What is the meaning of 'procrastinate'?", opts: ["To plan ahead", "To delay doing something", "To hurry up", "To forget"], ans: 1 },
      { q: "'I wish I ___ more time.' Complete correctly.", opts: ["have", "had", "would have", "will have"], ans: 1 }
    ]
  },
  {
    titolo: "Business English",
    domande: [
      { q: "Which phrase is appropriate to open a formal email?", opts: ["Hey there!", "Yo, what's up?", "Dear Sir/Madam,", "Hiya!"], ans: 2 },
      { q: "What does 'KPI' stand for?", opts: ["Key Performance Indicator", "Knowledge Process Integration", "Key Project Initiative", "Known Process Index"], ans: 0 },
      { q: "'Let's circle back on this' means:", opts: ["Draw a circle", "Return to this topic later", "Cancel the meeting", "Work in a circle"], ans: 1 },
      { q: "Which is the correct way to decline a meeting?", opts: ["No, I can't.", "I'm afraid I won't be able to attend.", "Meeting is bad for me.", "I don't want."], ans: 1 },
      { q: "What does 'due diligence' mean in business?", opts: ["Being polite", "Careful investigation before a deal", "Paying bills on time", "Following orders"], ans: 1 },
      { q: "'Please find attached the document' is used when:", opts: ["You're presenting verbally", "You include a file with an email", "You ask for a document", "You delete a file"], ans: 1 }
    ]
  },
  {
    titolo: "Marina Militare",
    domande: [
      { q: "Come si chiama in inglese la parte anteriore di una nave?", opts: ["Stern", "Port", "Bow", "Starboard"], ans: 2 },
      { q: "Come si chiama la parte posteriore di una nave?", opts: ["Bow", "Stern", "Port", "Keel"], ans: 1 },
      { q: "Cosa è il 'Hull' di una nave?", opts: ["L'albero", "Lo scafo", "Il timone", "Il radar"], ans: 1 },
      { q: "Il 'Keel' è:", opts: ["La chiglia", "Il fumaiolo", "Il ponte", "Il radar"], ans: 0 },
      { q: "Come si chiama il lato sinistro della nave guardando a prua?", opts: ["Starboard", "Bow", "Port", "Stern"], ans: 2 },
      { q: "Come si chiama il lato destro della nave guardando a prua?", opts: ["Port", "Starboard", "Beam", "Aft"], ans: 1 },
      { q: "Il 'Bridge' di una nave è:", opts: ["Il ponte di poppa", "La plancia di comando", "La sala macchine", "L'hangar"], ans: 1 },
      { q: "Il 'Radar' navale serve principalmente per:", opts: ["Comunicare via radio", "Rilevare oggetti e navi", "Navigare sotto l'acqua", "Localizzare mine"], ans: 1 },
      { q: "Il 'Sonar' è usato per:", opts: ["Rilevare aerei", "Rilevare oggetti sott'acqua", "Comunicare con i satelliti", "Misurare il vento"], ans: 1 },
      { q: "Il 'VHF radio' serve per:", opts: ["Comunicazioni corto-medio raggio", "Motore di riserva", "Rilevare siluri", "Gestire il timone"], ans: 0 },
      { q: "Il 'Life jacket' è:", opts: ["Una tuta subacquea", "Un giubbotto di salvataggio", "Una scialuppa", "Un casco"], ans: 1 },
      { q: "Il 'Flight deck' su una portaerei è:", opts: ["Il ponte motori", "La plancia", "Il piano di volo", "La sala equipaggio"], ans: 2 },
      { q: "La 'Catapult' su una portaerei serve per:", opts: ["Lanciare missili", "Accelerare gli aerei per il decollo", "Frenare gli aerei", "Sollevare veicoli"], ans: 1 },
      { q: "Il 'Periscope' è:", opts: ["Un radar", "Un dispositivo ottico", "Una radio", "Un sonar"], ans: 1 },
      { q: "Il 'Rudder' è:", opts: ["Il radar", "Il timone", "L'elica", "Il sonar"], ans: 1 },
      { q: "Il 'Propeller' è:", opts: ["Il timone", "Il sonar", "L'elica", "Il motore"], ans: 2 },
      { q: "I 'Mooring lines' sono:", opts: ["Linee radar", "Cavi di ormeggio", "Cavi dell'ancora", "Linee elettriche"], ans: 1 },
      { q: "Il 'Compass' è:", opts: ["Il GPS", "La bussola", "Il cronometro", "Il sestante"], ans: 1 },
      { q: "Il 'Mayday' è:", opts: ["Un saluto navale", "Il segnale di soccorso massimo", "Un tipo di nave", "Un comando di attracco"], ans: 1 },
      { q: "Il 'Combat Information Center' è:", opts: ["La mensa", "La sala operativa tattica", "La cabina del comandante", "Il magazzino"], ans: 1 }
    ]
  }
];

/* Dati delle 6 navi principali per la sezione Marina Militare */
const datiNavi = {
  carrier: {
    nome: "Aircraft Carrier",
    nomeIT: "Portaerei",
    descrizione: "Nave da guerra di grandi dimensioni con ponte di volo per lancio e atterraggio aerei.",
    immagine: "https://images.unsplash.com/photo-1552087405-ac1c40e9c629?w=1200&h=800&fit=crop",
    componentiZone: {
      "Flight deck": { zona: "top", descrizione: "Piano di volo continuo." },
      "Catapult": { zona: "top-center", descrizione: "Sistema di lancio aerei." },
      "Island": { zona: "center-right", descrizione: "Superstruttura centrale." }
    }
  },
  destroyer: {
    nome: "Destroyer",
    nomeIT: "Cacciatorpediniere",
    descrizione: "Nave veloce e manovrabile per escorta e combattimento tattico.",
    immagine: "https://images.unsplash.com/photo-1568876694728-451bbf694b39?w=1200&h=800&fit=crop",
    componentiZone: {
      "Hull": { zona: "center", descrizione: "Scafo principale." },
      "Bow": { zona: "left", descrizione: "Prua anteriore." },
      "Stern": { zona: "right", descrizione: "Poppa posteriore." }
    }
  },
  submarine: {
    nome: "Submarine",
    nomeIT: "Sottomarino",
    descrizione: "Nave militare sommersa con sensori avanzati e navigazione sottomarina.",
    immagine: "https://images.unsplash.com/photo-1551956470-d5bc2a8f4e72?w=1200&h=800&fit=crop",
    componentiZone: {
      "Conning tower": { zona: "top-center", descrizione: "Torre di comando." },
      "Periscope": { zona: "top-left", descrizione: "Dispositivo ottico elevabile." },
      "Propeller": { zona: "bottom-right", descrizione: "Elica motrice." }
    }
  },
  frigate: {
    nome: "Frigate",
    nomeIT: "Fregata",
    descrizione: "Nave multiruolo di medie dimensioni per operazioni navali diversificate.",
    immagine: "https://images.unsplash.com/photo-1570454968416-4e83d4ef0e20?w=1200&h=800&fit=crop",
    componentiZone: {
      "Bridge": { zona: "center-right", descrizione: "Plancia di comando." },
      "Mast": { zona: "top-center", descrizione: "Albero con sensori." },
      "Helipad": { zona: "bottom-right", descrizione: "Piazzola elicotteri." }
    }
  },
  cruiser: {
    nome: "Cruiser",
    nomeIT: "Incrociatore",
    descrizione: "Nave corazzata potentemente armata per battaglia e operazioni strategiche.",
    immagine: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
    componentiZone: {
      "Main battery": { zona: "top-center", descrizione: "Batteria principale cannoni." },
      "Gun turret": { zona: "center", descrizione: "Torretta girevole armata." },
      "Armored belt": { zona: "middle", descrizione: "Corazza di protezione." }
    }
  },
  trainingship: {
    nome: "Training Ship",
    nomeIT: "Nave Scuola",
    descrizione: "Nave specializzata per formazione e addestramento di marinai e ufficiali.",
    immagine: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=1200&h=800&fit=crop",
    componentiZone: {
      "Classroom deck": { zona: "center", descrizione: "Ponte aula didattico." },
      "Training rigging": { zona: "top", descrizione: "Attrezzatura velica." },
      "Practice bridge": { zona: "right", descrizione: "Plancia didattica." }
    }
  }
};

// Placeholder immagine per fallback
const URL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3EImmagine non disponibile%3C/text%3E%3C/svg%3E";

// Debouncing timer per tooltip
let debounceTimer = null;

/* ========================================
   SEZIONE 2: STATO GLOBALE
   ======================================== */

const stato = {
  nomeStudente: "",
  indiceQuiz: -1,
  domandarCorrente: 0,
  punteggio: 0,
  risposto: false,
  storico: [],
  domandeAttive: []
};

/* ========================================
   SEZIONE 3: INIZIALIZZAZIONE
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  try {
    collegaNavigazione();
    collegaAccordion();
    collegaQuiz();
    collegaFormContatti();
    collegaModalNave();
    inizializzaEsercizi();
    inizializzaHubInglese();
  } catch (err) {
    console.error("Errore inizializzazione:", err);
  }
});

/* ========================================
   SEZIONE 4: NAVIGAZIONE TRA PAGINE
   ======================================== */

function collegaNavigazione() {
  try {
    // Collega pulsanti nav con attributi data-page e data-page-target
    document.querySelectorAll("[data-page], [data-page-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pagina    = btn.dataset.page || btn.dataset.pageTarget;
        const cat       = btn.dataset.cat     || "";
        const hubCorso  = btn.dataset.hubCorso || "";
        if (pagina) {
          mostraPagina(pagina);
          // Naviga agli esercizi programmazione con categoria preset
          if (pagina === "esercizi" && cat) {
            setTimeout(() => impostaFiltroCategoria(cat), 50);
          }
          // Naviga all'Hub Inglese con corso preset
          if (pagina === "hub-inglese" && hubCorso) {
            setTimeout(() => apriCorso(hubCorso), 80);
          }
        }
      });
    });

    // Pulsante speciale per quiz marino
    const btnQuizNavale = document.getElementById("naval-quiz-cta");
    if (btnQuizNavale) {
      btnQuizNavale.addEventListener("click", () => {
        mostraPagina("quiz");
        setTimeout(() => {
          if (!stato.nomeStudente) {
            document.getElementById("step-name").classList.remove("hidden");
            document.getElementById("step-select").classList.add("hidden");
          } else {
            selezionaQuiz(3);
          }
        }, 100);
      });
    }
  } catch (err) {
    console.error("Errore collegaNavigazione:", err);
  }
}

function mostraPagina(idPagina) {
  try {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const pagina = document.getElementById(idPagina);
    if (pagina) pagina.classList.add("active");

    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    const btnNav = document.querySelector(`[data-page="${idPagina}"]`);
    if (btnNav) btnNav.classList.add("active");

    // Quando si naviga all'Hub Inglese direttamente (senza corso preset),
    // mostra la griglia corsi e nascondi la vista esercizi
    if (idPagina === "hub-inglese") {
      const corsiGrid    = document.getElementById("hub-corsi-grid");
      const eserciziView = document.getElementById("hub-esercizi-view");
      if (corsiGrid)    corsiGrid.style.display    = "block";
      if (eserciziView) eserciziView.style.display = "none";
      hubStato.corsoAttivo = "";
    }

    // Carica esercizi la prima volta che si entra nella sezione programmazione
    if (idPagina === "esercizi") {
      const grid = document.getElementById("ex-grid");
      if (grid && !grid.querySelector(".ex-card")) {
        caricaEsercizi("reset");
      }
    }
  } catch (err) {
    console.error("Errore mostraPagina:", err);
  }
}

/* ========================================
   SEZIONE 5: MODAL NAVI E IMMAGINI
   ======================================== */

function collegaModalNave() {
  try {
    document.querySelectorAll(".ship-icon-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tipoNave = btn.dataset.ship;
        const nave = datiNavi[tipoNave];
        if (nave) apriModalNave(nave);
      });
    });

    const modal = document.getElementById("ship-modal");
    const btnChiudi = document.getElementById("modal-close");
    
    if (btnChiudi) {
      btnChiudi.addEventListener("click", chiudiModalNave);
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) chiudiModalNave();
      });
    }
  } catch (err) {
    console.error("Errore collegaModalNave:", err);
  }
}

function apriModalNave(nave) {
  try {
    const modal = document.getElementById("ship-modal");
    const titolo = document.getElementById("modal-title");
    const sottotitolo = document.getElementById("modal-subtitle");
    const immagine = document.getElementById("modal-image");
    const descrizione = document.getElementById("modal-description");

    if (titolo) titolo.textContent = nave.nome;
    if (sottotitolo) sottotitolo.textContent = nave.nomeIT;
    
    if (immagine) {
      immagine.src = nave.immagine;
      immagine.alt = nave.nome;
      immagine.onerror = () => {
        immagine.src = URL_PLACEHOLDER;
        immagine.alt = "Immagine non disponibile";
      };
    }
    
    if (descrizione) descrizione.textContent = nave.descrizione;

    if (modal) modal.classList.add("active");
  } catch (err) {
    console.error("Errore apriModalNave:", err);
  }
}

function chiudiModalNave() {
  try {
    const modal = document.getElementById("ship-modal");
    if (modal) modal.classList.remove("active");
  } catch (err) {
    console.error("Errore chiudiModalNave:", err);
  }
}

/* ========================================
   SEZIONE 6: TOOLTIP COMPONENTI NAVI
   ======================================== */

/* Tooltip e hover effects disabilitati */
function collegaTooltipComponentiNavi() {
  // Funzione vuota - tooltip rimossi
}

/* ========================================
   SEZIONE 7: ACCORDION
   ======================================== */

function collegaAccordion() {
  try {
    document.querySelectorAll(".acc-header").forEach(header => {
      header.addEventListener("click", () => toggleAccordion(header));
    });
  } catch (err) {
    console.error("Errore collegaAccordion:", err);
  }
}

function toggleAccordion(header) {
  try {
    const accordion = header.parentElement;
    accordion.classList.toggle("open");
  } catch (err) {
    console.error("Errore toggleAccordion:", err);
  }
}

/* ========================================
   SEZIONE 8: SISTEMA QUIZ
   ======================================== */

function collegaQuiz() {
  try {
    const btnNome = document.getElementById("submit-name-btn");
    const inputNome = document.getElementById("student-name-input");

    if (btnNome) {
      btnNome.addEventListener("click", () => inviaNome(inputNome.value));
    }

    document.querySelectorAll(".quiz-btn-sel").forEach((btn, idx) => {
      btn.addEventListener("click", () => selezionaQuiz(idx));
    });

    const btnProssimo = document.getElementById("next-btn");
    if (btnProssimo) {
      btnProssimo.addEventListener("click", prossimaDomanda);
    }

    const btnRiprova = document.getElementById("retry-quiz-btn");
    if (btnRiprova) {
      btnRiprova.addEventListener("click", riproviQuiz);
    }

    const btnCambia = document.getElementById("change-quiz-btn");
    if (btnCambia) {
      btnCambia.addEventListener("click", cambiaQuiz);
    }
  } catch (err) {
    console.error("Errore collegaQuiz:", err);
  }
}

function inviaNome(nome) {
  try {
    if (!nome.trim()) {
      mostraNotifica("Per favore, inserisci il tuo nome.");
      return;
    }
    stato.nomeStudente = nome;
    document.getElementById("display-name").textContent = nome;
    document.getElementById("quiz-student-label").textContent = "👤 " + nome;
    document.getElementById("step-name").classList.add("hidden");
    document.getElementById("step-select").classList.remove("hidden");
  } catch (err) {
    console.error("Errore inviaNome:", err);
  }
}

function selezionaQuiz(indice) {
  try {
    stato.indiceQuiz = indice;
    stato.domandarCorrente = 0;
    stato.punteggio = 0;
    stato.risposto = false;
    stato.domandeAttive = [...datiQuiz[indice].domande].sort(() => Math.random() - 0.5);
    document.getElementById("step-select").classList.add("hidden");
    document.getElementById("step-quiz").classList.remove("hidden");
    caricaDomanda();
  } catch (err) {
    console.error("Errore selezionaQuiz:", err);
  }
}

function caricaDomanda() {
  try {
    const d = stato.domandeAttive[stato.domandarCorrente];
    document.getElementById("q-num").textContent = "DOMANDA " + (stato.domandarCorrente + 1);
    document.getElementById("q-text").textContent = d.q;
    document.getElementById("q-feedback").classList.add("hidden");

    const divOpzioni = document.getElementById("q-options");
    divOpzioni.innerHTML = "";
    d.opts.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "option";
      btn.addEventListener("click", () => rispondiDomanda(idx));
      divOpzioni.appendChild(btn);
    });

    const totale = stato.domandeAttive.length;
    document.getElementById("quiz-progress").textContent = `Domanda ${stato.domandarCorrente + 1} di ${totale}`;
    document.getElementById("progress-fill").style.width = ((stato.domandarCorrente + 1) / totale * 100) + "%";
    document.getElementById("quiz-score-live").textContent = "⭐ " + stato.punteggio + " / " + (stato.domandarCorrente + 1);

    stato.risposto = false;
    document.getElementById("next-btn").disabled = true;
  } catch (err) {
    console.error("Errore caricaDomanda:", err);
  }
}

function rispondiDomanda(indiceRisposta) {
  try {
    if (stato.risposto) return;
    stato.risposto = true;

    const d = stato.domandeAttive[stato.domandarCorrente];
    const opzioni = document.querySelectorAll(".option");

    opzioni.forEach((opt, idx) => {
      if (idx === d.ans) {
        opt.classList.add("correct");
      } else if (idx === indiceRisposta) {
        opt.classList.add("wrong");
      }
    });

    const feedback = document.getElementById("q-feedback");
    if (indiceRisposta === d.ans) {
      stato.punteggio++;
      feedback.textContent = "✅ Corretto!";
      feedback.className = "feedback-msg correct";
    } else {
      feedback.textContent = "❌ Sbagliato. La risposta corretta è: " + d.opts[d.ans];
      feedback.className = "feedback-msg wrong";
    }

    feedback.classList.remove("hidden");
    document.getElementById("next-btn").disabled = false;
  } catch (err) {
    console.error("Errore rispondiDomanda:", err);
  }
}

function prossimaDomanda() {
  try {
    stato.domandarCorrente++;
    if (stato.domandarCorrente >= stato.domandeAttive.length) {
      terminaQuiz();
    } else {
      caricaDomanda();
    }
  } catch (err) {
    console.error("Errore prossimaDomanda:", err);
  }
}

function terminaQuiz() {
  try {
    const totale = stato.domandeAttive.length;
    const percentuale = Math.round(stato.punteggio / totale * 100);

    document.getElementById("step-quiz").classList.add("hidden");
    document.getElementById("step-results").classList.remove("hidden");

    document.getElementById("score-pct").textContent = percentuale + "%";
    document.getElementById("r-correct").textContent = "✓ " + stato.punteggio + " corrette";
    document.getElementById("r-wrong").textContent = "✗ " + (totale - stato.punteggio) + " errate";
    document.getElementById("r-total").textContent = "📊 " + totale + " totali";
    document.getElementById("result-student").textContent = stato.nomeStudente;

    let voto = "Eccellente!";
    if (percentuale < 60) voto = "Non ancora... Riprova!";
    else if (percentuale < 75) voto = "Buono!";
    else if (percentuale < 90) voto = "Molto buono!";

    document.getElementById("grade-badge").textContent = voto;

    const entry = stato.nomeStudente + " - " + percentuale + "% - " + new Date().toLocaleDateString("it-IT");
    stato.storico.push(entry);
    aggiornaLeaderboard();
  } catch (err) {
    console.error("Errore terminaQuiz:", err);
  }
}

function aggiornaLeaderboard() {
  try {
    const lb = document.getElementById("lb-entries");
    if (lb && stato.storico.length > 0) {
      lb.innerHTML = stato.storico.map(e => `<div class="lb-entry"><span>${e}</span></div>`).join("");
      document.getElementById("leaderboard").classList.remove("hidden");
    }
  } catch (err) {
    console.error("Errore aggiornaLeaderboard:", err);
  }
}

function riproviQuiz() {
  try {
    selezionaQuiz(stato.indiceQuiz);
    document.getElementById("step-results").classList.add("hidden");
  } catch (err) {
    console.error("Errore riproviQuiz:", err);
  }
}

function cambiaQuiz() {
  try {
    stato.domandarCorrente = 0;
    stato.punteggio = 0;
    stato.risposto = false;
    stato.indiceQuiz = -1;
    document.getElementById("step-results").classList.add("hidden");
    document.getElementById("step-select").classList.remove("hidden");
  } catch (err) {
    console.error("Errore cambiaQuiz:", err);
  }
}

/* ========================================
   SEZIONE 9: FORM CONTATTI
   ======================================== */

function collegaFormContatti() {
  try {
    const btnInvia = document.getElementById("submit-form-btn");
    if (btnInvia) {
      btnInvia.addEventListener("click", inviaContatto);
    }
    
    collegaTooltipComponentiNavi();
  } catch (err) {
    console.error("Errore collegaFormContatti:", err);
  }
}

function inviaContatto() {
  try {
    const nome = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const messaggio = document.getElementById("contact-message").value;

    if (!nome || !email || !messaggio) {
      mostraNotifica("Per favore, compila tutti i campi.");
      return;
    }

    const btnInvia = document.getElementById("submit-form-btn");
    btnInvia.disabled = true;
    btnInvia.textContent = "Invio...";

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nome, email, message: messaggio })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("contact-form-fields").style.display = "none";
        document.getElementById("form-sent").classList.add("show");
        
        setTimeout(() => {
          document.getElementById("contact-form-fields").style.display = "block";
          document.getElementById("form-sent").classList.remove("show");
          document.getElementById("contact-name").value = "";
          document.getElementById("contact-email").value = "";
          document.getElementById("contact-message").value = "";
          btnInvia.disabled = false;
          btnInvia.textContent = "Invia Messaggio ✉️";
        }, 3000);
      } else {
        mostraNotifica("Errore: " + data.message);
        btnInvia.disabled = false;
        btnInvia.textContent = "Invia Messaggio ✉️";
      }
    })
    .catch(error => {
      console.error("Errore fetch:", error);
      mostraNotifica("Errore di connessione");
      btnInvia.disabled = false;
      btnInvia.textContent = "Invia Messaggio ✉️";
    });
  } catch (err) {
    console.error("Errore inviaContatto:", err);
  }
}

/* ========================================
   SEZIONE 10: UTILITÀ
   ======================================== */

function mostraNotifica(messaggio) {
  try {
    const toast = document.getElementById("toast");
    toast.textContent = messaggio;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  } catch (err) {
    console.error("Errore mostraNotifica:", err);
  }
}

/* ========================================
   SEZIONE 11: ESERCIZI (Load More + Skeleton + Lazy)
   ======================================== */

// ── Stato globale ────────────────────────────────────────────────────────────
const statoEsercizi = {
  categoriaAttiva: "",
  difficolta:      "",
  ricerca:         "",
  paginaCorrente:  1,
  pagineTotali:    1,
  perPagina:       20,      // 20 per volta come da specifica
  totale:          0,
  caricamento:     false,
  timerRicerca:    null,
  observer:        null     // IntersectionObserver per lazy loading
};

// ── Colori per categoria ─────────────────────────────────────────────────────
const COLORI_CAT = {
  Web:      { bordo: "#2563eb", badge: "badge-web" },
  PHP:      { bordo: "#7c3aed", badge: "badge-php" },
  Database: { bordo: "#059669", badge: "badge-db"  },
  Python:   { bordo: "#d97706", badge: "badge-py"  },
  Logica:   { bordo: "#dc2626", badge: "badge-logic"}
};
const BADGE_DIFF = { Base: "badge-base", Intermedio: "badge-inter", Avanzato: "badge-avanz" };

// ── Skeleton Loader: 6 carte animate ─────────────────────────────────────────
function htmlScheletro(n = 6) {
  const card = `
    <div class="sk-card">
      <div class="sk-badges">
        <div class="sk-line sk-badge"></div>
        <div class="sk-line sk-badge"></div>
      </div>
      <div class="sk-line sk-line-title"></div>
      <div class="sk-line sk-line-sub"></div>
      <div class="sk-line sk-line-body"></div>
      <div class="sk-line sk-line-body2"></div>
      <div class="sk-line sk-line-body3"></div>
      <div class="sk-line sk-line-btn"></div>
    </div>`;
  return Array(n).fill(card).join("");
}

// ── Costruisce HTML di una singola card ───────────────────────────────────────
function creaCardEsercizio(ex) {
  const cfg    = COLORI_CAT[ex.categoria] || { bordo: "var(--primary)", badge: "" };
  const bDiff  = BADGE_DIFF[ex.difficolta] || "";
  return `
    <div class="ex-card tw-bg-white tw-rounded-2xl tw-border tw-border-gray-200 tw-p-5 tw-flex tw-flex-col tw-gap-3"
         style="border-top: 4px solid ${cfg.bordo};">
      <div class="tw-flex tw-items-start tw-justify-between tw-gap-2">
        <h4 class="tw-font-bold tw-text-sm tw-leading-snug" style="color:var(--primary);flex:1;">${escHtml(ex.titolo)}</h4>
        <div class="tw-flex tw-gap-1 tw-flex-shrink-0">
          <span class="tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-semibold ${cfg.badge}">${escHtml(ex.categoria)}</span>
          <span class="tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-semibold ${bDiff}">${escHtml(ex.difficolta)}</span>
        </div>
      </div>
      <p class="tw-text-xs tw-text-gray-400 -tw-mt-2">📁 ${escHtml(ex.sotto)}</p>
      <p class="tw-text-sm tw-text-gray-700 tw-leading-relaxed">${escHtml(ex.testo)}</p>
      <button class="tw-mt-auto tw-text-xs tw-font-semibold tw-py-2 tw-px-3 tw-rounded-lg tw-border tw-border-gray-300 hover:tw-bg-gray-50 tw-text-left"
              style="font-family:inherit;color:var(--primary);"
              onclick="toggleSoluzione(this)">
        👁️ Mostra soluzione
      </button>
      <div class="soluzione-box tw-bg-gray-900 tw-rounded-xl tw-p-4 tw-mt-1">
        <p class="tw-text-xs tw-text-gray-400 tw-mb-2 tw-font-semibold">✅ SOLUZIONE</p>
        <pre class="tw-text-xs tw-text-green-300 tw-font-mono">${escHtml(ex.soluzione)}</pre>
      </div>
    </div>`;
}

// ── Escape HTML sicuro ────────────────────────────────────────────────────────
function escHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ── Toggle soluzione ─────────────────────────────────────────────────────────
function toggleSoluzione(btn) {
  try {
    const box   = btn.nextElementSibling;
    const aperta = box.classList.toggle("aperta");
    btn.textContent = aperta ? "🙈 Nascondi soluzione" : "👁️ Mostra soluzione";
  } catch (err) {
    console.error("Errore toggleSoluzione:", err);
  }
}

// ── IntersectionObserver: anima le card quando entrano nel viewport ───────────
function osservaCard(card) {
  if (!statoEsercizi.observer) {
    statoEsercizi.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visibile");
            statoEsercizi.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
  }
  statoEsercizi.observer.observe(card);
}

// ── Aggiorna UI contatore + pulsante Load More ────────────────────────────────
function aggiornaUiLoadMore() {
  const exCount    = document.getElementById("ex-count");
  const btnLoad    = document.getElementById("btn-load-more");
  const exEmpty    = document.getElementById("ex-empty");
  const grid       = document.getElementById("ex-grid");
  const cardCaricate = grid ? grid.querySelectorAll(".ex-card").length : 0;

  if (exCount) {
    exCount.textContent = statoEsercizi.totale > 0
      ? `Mostrati ${cardCaricate} di ${statoEsercizi.totale} esercizi`
      : "";
  }

  if (exEmpty) {
    exEmpty.style.display = statoEsercizi.totale === 0 ? "block" : "none";
  }

  if (btnLoad) {
    const haAltri = cardCaricate < statoEsercizi.totale;
    btnLoad.classList.toggle("visibile", haAltri);
    btnLoad.classList.remove("caricando");
    btnLoad.textContent = "⬇️ Carica altri esercizi";
  }
}

// ── Caricamento esercizi (append o reset) ─────────────────────────────────────
async function caricaEsercizi(modalita = "reset") {
  if (statoEsercizi.caricamento) return;
  statoEsercizi.caricamento = true;

  const grid    = document.getElementById("ex-grid");
  const btnLoad = document.getElementById("btn-load-more");

  try {
    if (modalita === "reset") {
      // Svuota griglia e mostra skeleton
      if (grid) grid.innerHTML = htmlScheletro(6);
      if (btnLoad) btnLoad.classList.remove("visibile");
      statoEsercizi.paginaCorrente = 1;
    } else {
      // Load More: aggiunge skeleton in fondo
      if (btnLoad) {
        btnLoad.classList.add("caricando");
        btnLoad.textContent = "⏳ Caricamento...";
      }
    }

    // Costruisce query
    const params = new URLSearchParams();
    if (statoEsercizi.categoriaAttiva) params.set("categoria",  statoEsercizi.categoriaAttiva);
    if (statoEsercizi.difficolta)      params.set("difficolta", statoEsercizi.difficolta);
    if (statoEsercizi.ricerca)         params.set("q",          statoEsercizi.ricerca);
    params.set("page",     statoEsercizi.paginaCorrente);
    params.set("per_page", statoEsercizi.perPagina);

    const risposta = await fetch(`/api/exercises?${params}`);
    if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
    const dati = await risposta.json();

    statoEsercizi.totale      = dati.totale    || 0;
    statoEsercizi.pagineTotali = dati.pagine_tot || 1;

    if (modalita === "reset") {
      if (grid) grid.innerHTML = "";
    }

    // Inserisce le nuove card con lazy loading
    if (dati.esercizi && dati.esercizi.length > 0) {
      const frammento = document.createDocumentFragment();
      dati.esercizi.forEach(ex => {
        const tmp = document.createElement("div");
        tmp.innerHTML = creaCardEsercizio(ex);
        const card = tmp.firstElementChild;
        frammento.appendChild(card);
        osservaCard(card);
      });
      if (grid) grid.appendChild(frammento);
    }

    aggiornaUiLoadMore();

  } catch (err) {
    console.error("Errore caricaEsercizi:", err);
    if (grid && modalita === "reset") {
      grid.innerHTML = `
        <div class="tw-text-center tw-col-span-3 tw-py-12 tw-text-red-400">
          <div class="tw-text-4xl tw-mb-3">⚠️</div>
          <p>Errore caricamento.<br><span class="tw-text-xs">${err.message}</span></p>
        </div>`;
    }
    if (btnLoad) {
      btnLoad.classList.remove("caricando");
      btnLoad.textContent = "⬇️ Carica altri esercizi";
    }
  } finally {
    statoEsercizi.caricamento = false;
  }
}

// ── Imposta filtro categoria da esterno (es. da "Corsi") ─────────────────────
function impostaFiltroCategoria(cat) {
  try {
    statoEsercizi.categoriaAttiva = cat;
    document.querySelectorAll(".filtro-cat").forEach(btn => {
      btn.classList.toggle("filtro-attivo", btn.dataset.cat === cat);
    });
    caricaEsercizi("reset");
  } catch (err) {
    console.error("Errore impostaFiltroCategoria:", err);
  }
}

// ── Inizializzazione completa sezione esercizi ────────────────────────────────
function inizializzaEsercizi() {
  try {
    const selDiff    = document.getElementById("ex-diff");
    const inputRic   = document.getElementById("ex-search");
    const btnReset   = document.getElementById("ex-reset");
    const btnLoad    = document.getElementById("btn-load-more");

    // Filtri categoria
    document.querySelectorAll(".filtro-cat").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro-cat").forEach(b => b.classList.remove("filtro-attivo"));
        btn.classList.add("filtro-attivo");
        statoEsercizi.categoriaAttiva = btn.dataset.cat || "";
        caricaEsercizi("reset");
      });
    });

    // Select difficoltà
    if (selDiff) {
      selDiff.addEventListener("change", () => {
        statoEsercizi.difficolta = selDiff.value;
        caricaEsercizi("reset");
      });
    }

    // Ricerca con debounce 400ms
    if (inputRic) {
      inputRic.addEventListener("input", () => {
        clearTimeout(statoEsercizi.timerRicerca);
        statoEsercizi.timerRicerca = setTimeout(() => {
          statoEsercizi.ricerca = inputRic.value.trim();
          caricaEsercizi("reset");
        }, 400);
      });
    }

    // Reset filtri
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        statoEsercizi.categoriaAttiva = "";
        statoEsercizi.difficolta      = "";
        statoEsercizi.ricerca         = "";
        if (inputRic)  inputRic.value  = "";
        if (selDiff)   selDiff.value   = "";
        document.querySelectorAll(".filtro-cat").forEach(b => b.classList.remove("filtro-attivo"));
        const tuttiBtn = document.querySelector(".filtro-cat[data-cat='']");
        if (tuttiBtn) tuttiBtn.classList.add("filtro-attivo");
        caricaEsercizi("reset");
      });
    }

    // Load More: carica pagina successiva e appende
    if (btnLoad) {
      btnLoad.addEventListener("click", () => {
        statoEsercizi.paginaCorrente++;
        caricaEsercizi("append");
      });
    }

  } catch (err) {
    console.error("Errore inizializzaEsercizi:", err);
  }
}

// Logging per debug
console.log("English Academy - App caricata con successo");


// ============================================================
// SEZIONE 12: HUB INGLESE AI — ESERCIZI + AI TUTOR
// ============================================================

/* ── Stato Hub Inglese ── */
const hubStato = {
  corsoAttivo:   "",
  pagina:        1,
  perPagina:     20,
  totale:        0,
  ricerca:       "",
  cronologiaTutor: [],
  esercizioTutor: null,
};

/* ── Colori per corso ── */
const CORSO_COLORI = {
  "Inglese Base (A1-A2)":              { bg: "#dcfce7", text: "#16a34a", badge: "#bbf7d0" },
  "Inglese Pre-Intermedio (A2-B1)":    { bg: "#dbeafe", text: "#2563eb", badge: "#bfdbfe" },
  "Inglese Intermedio (B1-B2)":        { bg: "#ede9fe", text: "#7c3aed", badge: "#ddd6fe" },
  "Inglese Avanzato (C1-C2)":          { bg: "#fee2e2", text: "#dc2626", badge: "#fecaca" },
  "Business English":                  { bg: "#cffafe", text: "#0891b2", badge: "#a5f3fc" },
  "Inglese per Viaggi":                { bg: "#fef3c7", text: "#d97706", badge: "#fde68a" },
  "Preparazione IELTS / Cambridge":    { bg: "#fce7f3", text: "#be185d", badge: "#fbcfe8" },
  "Inglese Navale - Marina Militare":  { bg: "#dbeafe", text: "#1a3a52", badge: "#93c5fd" },
};

/* ── Apri corso (click su card) ── */
window.apriCorso = function(corso) {
  hubStato.corsoAttivo = corso;
  hubStato.pagina      = 1;
  hubStato.ricerca     = "";

  const search = document.getElementById("hub-search");
  if (search) search.value = "";

  document.getElementById("hub-corsi-grid").style.display   = "none";
  document.getElementById("hub-esercizi-view").style.display = "block";
  document.getElementById("hub-corso-titolo").textContent    = corso;

  caricaEserciziHub("reset");
};

/* ── Torna alla griglia corsi ── */
function tornaCors() {
  document.getElementById("hub-corsi-grid").style.display   = "block";
  document.getElementById("hub-esercizi-view").style.display = "none";
  hubStato.corsoAttivo = "";
}

/* ── Carica esercizi inglese dall'API ── */
async function caricaEserciziHub(modo) {
  const grid     = document.getElementById("hub-grid");
  const countEl  = document.getElementById("hub-count");
  const btnMore  = document.getElementById("hub-load-more");

  if (modo === "reset") {
    hubStato.pagina = 1;
    grid.innerHTML = "";
    grid.innerHTML = Array(6).fill(
      `<div class="hub-card">
        <div class="sk-line" style="height:12px;width:40%;border-radius:6px;"></div>
        <div class="sk-line" style="height:16px;width:90%;border-radius:6px;"></div>
        <div class="sk-line" style="height:12px;width:65%;border-radius:6px;"></div>
      </div>`
    ).join("");
    if (btnMore) btnMore.style.display = "none";
  }

  try {
    const params = new URLSearchParams({
      corso:    hubStato.corsoAttivo,
      q:        hubStato.ricerca,
      page:     hubStato.pagina,
      per_page: hubStato.perPagina,
    });
    const res  = await fetch(`/api/english?${params}`);
    const data = await res.json();

    if (modo === "reset") grid.innerHTML = "";
    hubStato.totale = data.totale || 0;

    if (countEl) {
      const inizio = (hubStato.pagina - 1) * hubStato.perPagina + 1;
      const fine   = Math.min(hubStato.pagina * hubStato.perPagina, hubStato.totale);
      countEl.textContent = hubStato.totale
        ? `Esercizi ${inizio}–${fine} di ${hubStato.totale.toLocaleString("it-IT")}`
        : "Nessun esercizio trovato";
    }

    (data.esercizi || []).forEach((ex, i) => {
      const card = creaHubCard(ex, i);
      grid.appendChild(card);
      setTimeout(() => card.classList.add("visibile"), i * 40);
    });

    if (btnMore) {
      const mostrati = hubStato.pagina * hubStato.perPagina;
      btnMore.style.display = (mostrati < hubStato.totale) ? "block" : "none";
    }

  } catch (err) {
    console.error("caricaEserciziHub:", err);
    if (modo === "reset") grid.innerHTML = `<p style="color:#ef4444;grid-column:1/-1;">Errore caricamento esercizi. Riprova.</p>`;
  }
}

/* ── Crea card HTML per un esercizio inglese ── */
function creaHubCard(ex, indice) {
  const colore = CORSO_COLORI[ex.corso] || { bg: "#f1f5f9", text: "#334155", badge: "#e2e8f0" };
  const card   = document.createElement("div");
  card.className = "hub-card";
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
      <span class="hub-badge-corso" style="background:${colore.badge};color:${colore.text};">${ex.argomento}</span>
      <span style="font-size:11px;color:#94a3b8;white-space:nowrap;">${ex.livello}</span>
    </div>
    <p style="font-size:.95rem;font-weight:600;color:#1e293b;line-height:1.4;">${esc(ex.testo)}</p>
    <div class="hub-soluzione-box" id="sol-${ex.id}">
      <span style="font-size:11px;font-weight:700;color:#15803d;display:block;margin-bottom:4px;">✅ Soluzione</span>
      ${esc(ex.soluzione)}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn-secondary" style="font-size:12px;padding:6px 12px;"
        onclick="toggleSoluzione(${ex.id})">👁 Mostra soluzione</button>
      <button class="btn-primary" style="font-size:12px;padding:6px 12px;background:${colore.text};"
        onclick="apriTutor(${ex.id}, \`${esc(ex.testo)}\`)">🤖 Chiedi al Tutor</button>
    </div>
  `;
  return card;
}

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/`/g, "&#96;");
}

/* ── Toggle soluzione ── */
window.toggleSoluzione = function(id) {
  const box = document.getElementById(`sol-${id}`);
  if (!box) return;
  box.classList.toggle("aperta");
};

/* ── AI TUTOR: apri sidebar ── */
window.apriTutor = function(id, testo) {
  hubStato.esercizioTutor = testo;
  hubStato.cronologiaTutor = [];

  const sidebar  = document.getElementById("ai-tutor-sidebar");
  const overlay  = document.getElementById("tutor-overlay");
  const eBox     = document.getElementById("tutor-esercizio-box");
  const chatEl   = document.getElementById("tutor-chat");

  eBox.innerHTML = `<strong style="color:#60a5fa;font-size:11px;">ESERCIZIO</strong><br><span style="color:#e2e8f0;">${esc(testo)}</span>`;
  eBox.style.display = "block";

  chatEl.innerHTML = `
    <div class="tutor-msg ai">
      Ciao! Sono pronto ad aiutarti con questo esercizio. 😊<br>
      Cosa non ti è chiaro? Puoi chiedermi la regola grammaticale, il significato di una parola o come ragionare sulla struttura della frase.
    </div>`;

  sidebar.classList.add("aperto");
  overlay.classList.add("visibile");
  document.getElementById("tutor-input").focus();
};

/* ── Chiudi tutor ── */
function chiudiTutor() {
  document.getElementById("ai-tutor-sidebar").classList.remove("aperto");
  document.getElementById("tutor-overlay").classList.remove("visibile");
}

/* ── Invia messaggio al tutor ── */
async function inviaTutor() {
  const input  = document.getElementById("tutor-input");
  const chat   = document.getElementById("tutor-chat");
  const btn    = document.getElementById("tutor-send");
  const testo  = input.value.trim();
  if (!testo) return;

  input.value = "";
  input.style.height = "auto";

  // Messaggio utente
  const msgU = document.createElement("div");
  msgU.className = "tutor-msg user";
  msgU.textContent = testo;
  chat.appendChild(msgU);

  // Messaggio "sto pensando..."
  const msgAI = document.createElement("div");
  msgAI.className = "tutor-msg ai thinking";
  msgAI.textContent = "⏳ Il tutor sta pensando...";
  chat.appendChild(msgAI);
  chat.scrollTop = chat.scrollHeight;

  btn.disabled = true;
  input.disabled = true;

  try {
    const res  = await fetch("/api/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        esercizio:  hubStato.esercizioTutor,
        domanda:    testo,
        cronologia: hubStato.cronologiaTutor,
      }),
    });
    const data = await res.json();

    if (data.risposta) {
      msgAI.className = "tutor-msg ai";
      msgAI.textContent = data.risposta;

      // Aggiorna cronologia
      hubStato.cronologiaTutor.push({ role: "user",      content: testo });
      hubStato.cronologiaTutor.push({ role: "assistant", content: data.risposta });

      // Tieni cronologia a max 12 messaggi
      if (hubStato.cronologiaTutor.length > 12) {
        hubStato.cronologiaTutor = hubStato.cronologiaTutor.slice(-12);
      }
    } else {
      msgAI.className = "tutor-msg ai";
      msgAI.textContent = "⚠️ " + (data.errore || "Errore sconosciuto.");
    }
  } catch (err) {
    msgAI.className = "tutor-msg ai";
    msgAI.textContent = "⚠️ Errore di connessione. Riprova.";
    console.error("AI Tutor:", err);
  } finally {
    btn.disabled = false;
    input.disabled = false;
    chat.scrollTop = chat.scrollHeight;
    input.focus();
  }
}

/* ── Inizializza Hub Inglese (chiamata da initPage) ── */
function inizializzaHubInglese() {
  try {
    const backBtn  = document.getElementById("hub-back-btn");
    const searchEl = document.getElementById("hub-search");
    const loadMore = document.getElementById("hub-load-more");
    const overlay  = document.getElementById("tutor-overlay");
    const closeBtn = document.getElementById("tutor-close");
    const sendBtn  = document.getElementById("tutor-send");
    const input    = document.getElementById("tutor-input");

    if (backBtn)  backBtn.addEventListener("click", tornaCors);
    if (overlay)  overlay.addEventListener("click", chiudiTutor);
    if (closeBtn) closeBtn.addEventListener("click", chiudiTutor);
    if (sendBtn)  sendBtn.addEventListener("click", inviaTutor);

    if (input) {
      input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); inviaTutor(); }
      });
      input.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 100) + "px";
      });
    }

    let debounceTimer;
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          hubStato.ricerca = searchEl.value.trim();
          caricaEserciziHub("reset");
        }, 400);
      });
    }

    if (loadMore) {
      loadMore.addEventListener("click", () => {
        hubStato.pagina++;
        caricaEserciziHub("append");
      });
    }

  } catch (err) {
    console.error("inizializzaHubInglese:", err);
  }
}

