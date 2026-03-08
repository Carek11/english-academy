/* ========================================
   ENGLISH ACADEMY - MAIN APPLICATION
   Applicazione web per l'insegnamento dell'inglese
   ======================================== */

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
        const pagina = btn.dataset.page || btn.dataset.pageTarget;
        const cat    = btn.dataset.cat || "";
        if (pagina) {
          mostraPagina(pagina);
          // Se naviga agli esercizi con categoria preset
          if (pagina === "esercizi" && cat) {
            setTimeout(() => impostaFiltroCategoria(cat), 50);
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

    // Carica esercizi la prima volta che si entra nella sezione
    if (idPagina === "esercizi") {
      const grid = document.getElementById("ex-grid");
      if (grid && !grid.querySelector(".ex-card")) {
        caricaEsercizi();
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
   SEZIONE 11: ESERCIZI (DB-Driven)
   ======================================== */

// Stato globale esercizi
const statoEsercizi = {
  categoriaAttiva: "",
  difficolta: "",
  ricerca: "",
  paginaCorrente: 1,
  pagineTotali: 1,
  perPagina: 12,
  timerRicerca: null
};

// Badge colori per categoria e difficoltà
function badgeCategoria(cat) {
  const mappa = {
    Web:      "badge-web",
    PHP:      "badge-php",
    Database: "badge-db",
    Python:   "badge-py",
    Logica:   "badge-logic"
  };
  return mappa[cat] || "";
}

function badgeDiff(diff) {
  const mappa = { Base: "badge-base", Intermedio: "badge-inter", Avanzato: "badge-avanz" };
  return mappa[diff] || "";
}

// Costruisce HTML di una card esercizio
function creaCardEsercizio(ex) {
  const bCat  = badgeCategoria(ex.categoria);
  const bDiff = badgeDiff(ex.difficolta);
  // Sfondo del bordo superiore card per categoria
  const colBorda = { Web:"#2563eb", PHP:"#7c3aed", Database:"#059669", Python:"#d97706", Logica:"#dc2626" };
  const colore   = colBorda[ex.categoria] || "var(--primary)";

  return `
    <div class="ex-card tw-bg-white tw-rounded-2xl tw-border tw-border-gray-200 tw-p-5 tw-flex tw-flex-col tw-gap-3"
         style="border-top: 4px solid ${colore};">
      <!-- Header -->
      <div class="tw-flex tw-items-start tw-justify-between tw-gap-2">
        <h4 class="tw-font-bold tw-text-sm tw-leading-snug" style="color:var(--primary); flex:1;">${escHtml(ex.titolo)}</h4>
        <div class="tw-flex tw-gap-1 tw-flex-shrink-0">
          <span class="tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-semibold ${bCat}">${escHtml(ex.categoria)}</span>
          <span class="tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-semibold ${bDiff}">${escHtml(ex.difficolta)}</span>
        </div>
      </div>

      <!-- Sotto-categoria -->
      <p class="tw-text-xs tw-text-gray-400 -tw-mt-2">📁 ${escHtml(ex.sotto)}</p>

      <!-- Testo esercizio -->
      <p class="tw-text-sm tw-text-gray-700 tw-leading-relaxed">${escHtml(ex.testo)}</p>

      <!-- Toggle soluzione -->
      <button class="tw-mt-auto tw-text-xs tw-font-semibold tw-py-2 tw-px-3 tw-rounded-lg tw-border tw-border-gray-300 hover:tw-bg-gray-50 tw-text-left"
              style="font-family:inherit; color:var(--primary);"
              onclick="toggleSoluzione(this)">
        👁️ Mostra soluzione
      </button>

      <!-- Box soluzione -->
      <div class="soluzione-box tw-bg-gray-900 tw-rounded-xl tw-p-4 tw-mt-1">
        <p class="tw-text-xs tw-text-gray-400 tw-mb-2 tw-font-semibold">✅ SOLUZIONE</p>
        <pre class="tw-text-xs tw-text-green-300 tw-font-mono">${escHtml(ex.soluzione)}</pre>
      </div>
    </div>
  `;
}

// Escape HTML sicuro
function escHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// Toggle visibilità soluzione
function toggleSoluzione(btn) {
  try {
    const box = btn.nextElementSibling;
    const aperta = box.classList.toggle("aperta");
    btn.textContent = aperta ? "🙈 Nascondi soluzione" : "👁️ Mostra soluzione";
  } catch (err) {
    console.error("Errore toggleSoluzione:", err);
  }
}

// Carica esercizi dall'API Flask
async function caricaEsercizi() {
  try {
    const grid       = document.getElementById("ex-grid");
    const exCount    = document.getElementById("ex-count");
    const pagInfo    = document.getElementById("ex-pag-info");
    const btnPrev    = document.getElementById("ex-prev");
    const btnNext    = document.getElementById("ex-next");

    // Stato caricamento
    grid.innerHTML = `
      <div class="tw-text-center tw-col-span-3 tw-py-12 tw-text-gray-400">
        <div class="tw-text-5xl tw-mb-4">⏳</div>
        <p>Caricamento...</p>
      </div>`;

    // Costruisce URL con parametri
    const params = new URLSearchParams();
    if (statoEsercizi.categoriaAttiva) params.set("categoria",  statoEsercizi.categoriaAttiva);
    if (statoEsercizi.difficolta)      params.set("difficolta", statoEsercizi.difficolta);
    if (statoEsercizi.ricerca)         params.set("q",          statoEsercizi.ricerca);
    params.set("page",     statoEsercizi.paginaCorrente);
    params.set("per_page", statoEsercizi.perPagina);

    const risposta = await fetch(`/api/exercises?${params}`);
    if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
    const dati = await risposta.json();

    // Aggiorna stato paginazione
    statoEsercizi.pagineTotali = dati.pagine_tot || 1;

    // Render card
    if (!dati.esercizi || dati.esercizi.length === 0) {
      grid.innerHTML = `
        <div class="tw-text-center tw-col-span-3 tw-py-16 tw-text-gray-400">
          <div class="tw-text-5xl tw-mb-4">🔍</div>
          <p class="tw-text-lg">Nessun esercizio trovato</p>
          <p class="tw-text-sm tw-mt-1">Prova a modificare i filtri</p>
        </div>`;
    } else {
      grid.innerHTML = dati.esercizi.map(creaCardEsercizio).join("");
    }

    // Aggiorna contatore
    const da  = (statoEsercizi.paginaCorrente - 1) * statoEsercizi.perPagina + 1;
    const a   = Math.min(da + (dati.esercizi?.length || 0) - 1, dati.totale);
    exCount.textContent = dati.totale > 0
      ? `Mostrati ${da}–${a} di ${dati.totale} esercizi`
      : "Nessun esercizio trovato";

    // Paginazione
    pagInfo.textContent = `Pag. ${statoEsercizi.paginaCorrente} / ${statoEsercizi.pagineTotali}`;
    btnPrev.disabled = statoEsercizi.paginaCorrente <= 1;
    btnNext.disabled = statoEsercizi.paginaCorrente >= statoEsercizi.pagineTotali;

  } catch (err) {
    console.error("Errore caricaEsercizi:", err);
    const grid = document.getElementById("ex-grid");
    if (grid) grid.innerHTML = `
      <div class="tw-text-center tw-col-span-3 tw-py-12 tw-text-red-400">
        <div class="tw-text-4xl tw-mb-3">⚠️</div>
        <p>Errore caricamento esercizi.<br><span class="tw-text-xs">${err.message}</span></p>
      </div>`;
  }
}

// Imposta filtro categoria da esterno (es. da "Corsi")
function impostaFiltroCategoria(cat) {
  try {
    statoEsercizi.categoriaAttiva = cat;
    statoEsercizi.paginaCorrente  = 1;
    // Aggiorna UI filtri
    document.querySelectorAll(".filtro-cat").forEach(btn => {
      const attivo = (btn.dataset.cat === cat);
      btn.classList.toggle("filtro-attivo", attivo);
    });
    caricaEsercizi();
  } catch (err) {
    console.error("Errore impostaFiltroCategoria:", err);
  }
}

// Inizializzazione completa sezione esercizi
function inizializzaEsercizi() {
  try {
    // Filtri categoria
    document.querySelectorAll(".filtro-cat").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro-cat").forEach(b => b.classList.remove("filtro-attivo"));
        btn.classList.add("filtro-attivo");
        statoEsercizi.categoriaAttiva = btn.dataset.cat || "";
        statoEsercizi.paginaCorrente  = 1;
        caricaEsercizi();
      });
    });

    // Select difficoltà
    const selDiff = document.getElementById("ex-diff");
    if (selDiff) {
      selDiff.addEventListener("change", () => {
        statoEsercizi.difficolta     = selDiff.value;
        statoEsercizi.paginaCorrente = 1;
        caricaEsercizi();
      });
    }

    // Ricerca con debounce 350ms
    const inputRicerca = document.getElementById("ex-search");
    if (inputRicerca) {
      inputRicerca.addEventListener("input", () => {
        clearTimeout(statoEsercizi.timerRicerca);
        statoEsercizi.timerRicerca = setTimeout(() => {
          statoEsercizi.ricerca        = inputRicerca.value.trim();
          statoEsercizi.paginaCorrente = 1;
          caricaEsercizi();
        }, 350);
      });
    }

    // Reset
    const btnReset = document.getElementById("ex-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        statoEsercizi.categoriaAttiva = "";
        statoEsercizi.difficolta      = "";
        statoEsercizi.ricerca         = "";
        statoEsercizi.paginaCorrente  = 1;
        if (inputRicerca) inputRicerca.value = "";
        if (selDiff) selDiff.value = "";
        document.querySelectorAll(".filtro-cat").forEach(b => b.classList.remove("filtro-attivo"));
        const tuttiBtn = document.querySelector(".filtro-cat[data-cat='']");
        if (tuttiBtn) tuttiBtn.classList.add("filtro-attivo");
        caricaEsercizi();
      });
    }

    // Paginazione
    const btnPrev = document.getElementById("ex-prev");
    const btnNext = document.getElementById("ex-next");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (statoEsercizi.paginaCorrente > 1) {
          statoEsercizi.paginaCorrente--;
          caricaEsercizi();
          document.getElementById("esercizi").scrollIntoView({ behavior: "smooth" });
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (statoEsercizi.paginaCorrente < statoEsercizi.pagineTotali) {
          statoEsercizi.paginaCorrente++;
          caricaEsercizi();
          document.getElementById("esercizi").scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Carica gli esercizi quando si entra nella sezione
    document.querySelectorAll("[data-page='esercizi'], [data-page-target='esercizi']").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!document.getElementById("ex-grid").querySelector(".ex-card")) {
          caricaEsercizi();
        }
      });
    });

  } catch (err) {
    console.error("Errore inizializzaEsercizi:", err);
  }
}

// Logging per debug
console.log("English Academy - App caricata con successo");
