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
    titolo: "Inglese Base (A1–A2)",
    domande: [
      { q: "Come si dice 'Buongiorno' in inglese?", opts: ["Hello", "Good morning", "Good evening", "Goodbye"], ans: 1 },
      { q: "Quale è il plurale di 'child'?", opts: ["Childs", "Children", "Childrens", "Childre"], ans: 1 },
      { q: "Completa: 'She ___ a teacher.'", opts: ["am", "is", "are", "be"], ans: 1 },
      { q: "Come si dice 'Gatto' in inglese?", opts: ["Dog", "Bird", "Cat", "Fish"], ans: 2 },
      { q: "Quale articolo si usa con 'apple'?", opts: ["a", "an", "the", "—"], ans: 1 },
      { q: "Quale frase è corretta?", opts: ["I doesn't like coffee", "I don't like coffee", "I not like coffee", "I no like coffee"], ans: 1 },
      { q: "Come si dice 'Quanto costa?' in inglese?", opts: ["How much is it?", "What is the price how?", "How many cost?", "Is it how much?"], ans: 0 },
      { q: "Come si dice 'Quanti anni hai?' in inglese?", opts: ["How old are you?", "What age do you have?", "How many years?", "How big are you?"], ans: 0 },
      { q: "Completa: 'I ___ to school every day.'", opts: ["goes", "go", "am go", "going"], ans: 1 },
      { q: "Come si dice 'Rosso' in inglese?", opts: ["Blue", "Green", "Red", "Yellow"], ans: 2 }
    ]
  },
  {
    titolo: "Pre-Intermedio (A2–B1)",
    domande: [
      { q: "Yesterday I ___ to the cinema.", opts: ["go", "went", "gone", "going"], ans: 1 },
      { q: "She has ___ in London for three years.", opts: ["lived", "live", "living", "lives"], ans: 0 },
      { q: "If it rains tomorrow, I ___ stay home.", opts: ["would", "will", "am", "have"], ans: 1 },
      { q: "He is taller ___ his brother.", opts: ["then", "as", "than", "that"], ans: 2 },
      { q: "___ you ever been to Paris?", opts: ["Did", "Have", "Are", "Do"], ans: 1 },
      { q: "What were you doing when I ___?", opts: ["call", "called", "am calling", "have called"], ans: 1 },
      { q: "She ___ working for two hours without stopping.", opts: ["is", "has been", "was", "had"], ans: 1 },
      { q: "I will call you when I ___ home.", opts: ["get", "will get", "got", "getting"], ans: 0 },
      { q: "Choose the correct comparative: 'This exercise is ___ than the last one.'", opts: ["more easy", "easyer", "easier", "more easier"], ans: 2 },
      { q: "'She used to ___ tennis every weekend.'", opts: ["plays", "play", "played", "playing"], ans: 1 }
    ]
  },
  {
    titolo: "Intermedio (B1–B2)",
    domande: [
      { q: "By the time she arrived, we ___ the food.", opts: ["already ate", "had already eaten", "already had eat", "was eating"], ans: 1 },
      { q: "Which sentence uses the passive voice correctly?", opts: ["The report wrote by him", "The report was written by him", "He written the report", "Written the report by him"], ans: 1 },
      { q: "'Despite the rain, they continued.' What does 'despite' mean?", opts: ["Because of", "In spite of", "Thanks to", "Due to"], ans: 1 },
      { q: "Choose the correct preposition: 'She is good ___ mathematics.'", opts: ["in", "on", "at", "for"], ans: 2 },
      { q: "What is the meaning of 'procrastinate'?", opts: ["To plan ahead", "To delay doing something", "To hurry up", "To forget"], ans: 1 },
      { q: "'I wish I ___ more time.' Complete correctly.", opts: ["have", "had", "would have", "will have"], ans: 1 },
      { q: "Which sentence is in the third conditional?", opts: ["If I study, I pass.", "If I studied, I would pass.", "If I had studied, I would have passed.", "If I will study, I pass."], ans: 2 },
      { q: "'She suggested ___ the meeting earlier.'", opts: ["to hold", "holding", "hold", "held"], ans: 1 },
      { q: "The phrasal verb 'put off' means:", opts: ["To organise", "To postpone", "To cancel permanently", "To start immediately"], ans: 1 },
      { q: "'Not only did she win, ___ she broke the record.'", opts: ["but also", "and also", "as well", "also"], ans: 0 }
    ]
  },
  {
    titolo: "Avanzato (C1–C2)",
    domande: [
      { q: "What does the idiom 'to bite the bullet' mean?", opts: ["To eat something hard", "To endure a painful situation", "To shoot a gun", "To be very hungry"], ans: 1 },
      { q: "Choose the correct form: 'Had I known earlier, I ___ differently.'", opts: ["would act", "would have acted", "had acted", "will act"], ans: 1 },
      { q: "What does 'ubiquitous' mean?", opts: ["Unique", "Present everywhere", "Extremely large", "Completely unknown"], ans: 1 },
      { q: "'No sooner ___ than the alarm went off.'", opts: ["I fell asleep", "had I fallen asleep", "I had fallen asleep", "did I fall asleep"], ans: 1 },
      { q: "The literary device that gives human qualities to non-human things is:", opts: ["Metaphor", "Simile", "Personification", "Alliteration"], ans: 2 },
      { q: "What does 'equivocal' mean?", opts: ["Clearly stated", "Open to more than one interpretation", "Completely wrong", "Mathematically equal"], ans: 1 },
      { q: "Which sentence is grammatically correct?", opts: ["It is I who am responsible.", "It is me who is responsible.", "It is I who is responsible.", "It is me who are responsible."], ans: 0 },
      { q: "'The government's ___ stance on immigration divided the nation.'", opts: ["ambiguous", "clear-cut", "transparent", "straightforward"], ans: 0 },
      { q: "What is a 'red herring' in argumentation?", opts: ["A strong point", "A misleading distraction", "A factual error", "A logical conclusion"], ans: 1 },
      { q: "Choose the correct subjunctive: 'The board insisted that he ___ the report.'", opts: ["submits", "submitted", "submit", "had submitted"], ans: 2 }
    ]
  },
  {
    titolo: "Inglese per Viaggi",
    domande: [
      { q: "At the airport, where do you go to check your bags?", opts: ["Gate", "Check-in desk", "Customs", "Arrivals"], ans: 1 },
      { q: "What do you say when you arrive at a hotel?", opts: ["I want a room.", "I have a reservation under my name.", "Give me a room.", "Is there any room?"], ans: 1 },
      { q: "'Could you call me a taxi, please?' — Who should you ask?", opts: ["The waiter", "The receptionist", "The pilot", "The customs officer"], ans: 1 },
      { q: "In a restaurant, what do you ask for at the end of the meal?", opts: ["The menu", "The bill / check", "The reservation", "The wine list"], ans: 1 },
      { q: "What does 'boarding pass' mean?", opts: ["Your hotel key card", "Your passport", "The ticket to board the plane", "Your luggage tag"], ans: 2 },
      { q: "'Excuse me, how do I get to the train station?' — What type of phrase is this?", opts: ["Ordering food", "Asking for directions", "Booking a hotel", "Checking in"], ans: 1 },
      { q: "In an emergency, which number do you call in most European countries?", opts: ["911", "999", "112", "000"], ans: 2 },
      { q: "What is 'carry-on luggage'?", opts: ["Luggage checked in the hold", "Luggage you bring onto the plane", "Luggage lost by the airline", "Oversized luggage"], ans: 1 },
      { q: "'The room isn't clean.' What do you say to hotel staff?", opts: ["I'd like a different hotel.", "Could you please have the room cleaned?", "Clean it now!", "It's very dirty, I refuse."], ans: 1 },
      { q: "What does 'jet lag' mean?", opts: ["A type of aircraft", "Tiredness caused by travelling across time zones", "Delayed flight", "Extra luggage charge"], ans: 1 }
    ]
  },
  {
    titolo: "IELTS / Cambridge",
    domande: [
      { q: "In IELTS Writing Task 2, what is required?", opts: ["Describe a graph", "Write a formal letter", "Write an essay presenting an argument", "Summarise a listening passage"], ans: 2 },
      { q: "What does 'paraphrase' mean in academic writing?", opts: ["Copy text directly", "Rewrite ideas in your own words", "Delete unnecessary sentences", "Add citations"], ans: 1 },
      { q: "Choose the most academic synonym for 'big':", opts: ["huge", "large", "substantial", "gigantic"], ans: 2 },
      { q: "In IELTS Reading, 'NOT GIVEN' means:", opts: ["The answer is false", "The information is not in the text", "The question is wrong", "You need to infer the answer"], ans: 1 },
      { q: "Which connector expresses contrast?", opts: ["Furthermore", "Nevertheless", "Therefore", "Consequently"], ans: 1 },
      { q: "What is a 'thesis statement'?", opts: ["The title of the essay", "The main argument stated in the introduction", "The conclusion of the essay", "A list of references"], ans: 1 },
      { q: "'The data ___ a significant increase in unemployment.' Choose the correct verb.", opts: ["show", "shows", "are showing", "have shown"], ans: 0 },
      { q: "In Cambridge C1, 'cohesion' refers to:", opts: ["Grammar accuracy", "The logical flow and connection of ideas", "Vocabulary range", "Spelling"], ans: 1 },
      { q: "Which sentence uses a formal register correctly?", opts: ["We wanna talk about the issue.", "I am writing to enquire about the position.", "Hey, can you help?", "It's kinda important."], ans: 1 },
      { q: "What does 'corroborate' mean?", opts: ["To contradict", "To confirm or support with evidence", "To ignore", "To exaggerate"], ans: 1 }
    ]
  },
  {
    titolo: "Business English",
    domande: [
      { q: "Which phrase is appropriate to open a formal email?", opts: ["Hey there!", "Yo, what's up?", "Dear Sir/Madam,", "Hiya!"], ans: 2 },
      { q: "What does 'KPI' stand for?", opts: ["Key Performance Indicator", "Knowledge Process Integration", "Key Project Initiative", "Known Process Index"], ans: 0 },
      { q: "'Let's circle back on this' means:", opts: ["Draw a circle", "Return to this topic later", "Cancel the meeting", "Work in a circle"], ans: 1 },
      { q: "Which is the correct way to decline a meeting invitation?", opts: ["No, I can't.", "I'm afraid I won't be able to attend.", "Meeting is bad for me.", "I don't want to come."], ans: 1 },
      { q: "What does 'due diligence' mean in business?", opts: ["Being polite", "Careful investigation before a deal", "Paying bills on time", "Following orders"], ans: 1 },
      { q: "'Please find attached the document' is used when:", opts: ["You're presenting verbally", "You include a file in an email", "You ask for a document", "You delete a file"], ans: 1 },
      { q: "What does 'ROI' stand for?", opts: ["Return On Investment", "Rate Of Interest", "Risk Of Inflation", "Report Of Income"], ans: 0 },
      { q: "In a negotiation, 'BATNA' means:", opts: ["Best Alternative To a Negotiated Agreement", "Business Agreement Terms and Negotiation Act", "Bilateral Agreement for Trade and New Assets", "Basic Approval To Negotiate Abroad"], ans: 0 },
      { q: "Which phrase correctly closes a formal business email?", opts: ["See ya!", "Yours faithfully,", "Bye for now,", "Ciao!"], ans: 1 },
      { q: "'The project is behind schedule.' A synonym for 'behind schedule' is:", opts: ["on track", "ahead of time", "delayed", "completed"], ans: 2 }
    ]
  },
  {
    titolo: "Marina Militare",
    domande: [
      { q: "Come si chiama la parte anteriore di una nave in inglese?", opts: ["Stern", "Port", "Bow", "Starboard"], ans: 2 },
      { q: "Come si chiama la parte posteriore di una nave?", opts: ["Bow", "Stern", "Port", "Keel"], ans: 1 },
      { q: "Il 'Hull' di una nave è:", opts: ["L'albero", "Lo scafo", "Il timone", "Il radar"], ans: 1 },
      { q: "Il 'Keel' (chiglia) si trova:", opts: ["In cima all'albero", "Sotto lo scafo", "Nella plancia", "In sala macchine"], ans: 1 },
      { q: "Il lato sinistro della nave guardando a prua si chiama:", opts: ["Starboard", "Bow", "Port", "Stern"], ans: 2 },
      { q: "Il lato destro della nave guardando a prua si chiama:", opts: ["Port", "Starboard", "Beam", "Aft"], ans: 1 },
      { q: "Il 'Bridge' di una nave è:", opts: ["Il ponte di poppa", "La plancia di comando", "La sala macchine", "L'hangar"], ans: 1 },
      { q: "Il segnale di soccorso massimo in radiotelefonia si chiama:", opts: ["Pan-Pan", "Mayday", "Securité", "SOS"], ans: 1 },
      { q: "Nella fonetica NATO, la lettera 'A' si pronuncia:", opts: ["Alpha", "Apple", "Able", "Arrow"], ans: 0 },
      { q: "Il 'Sonar' è usato per:", opts: ["Rilevare aerei", "Rilevare oggetti sott'acqua", "Comunicare con i satelliti", "Misurare il vento"], ans: 1 },
      { q: "Il 'Flight deck' su una portaerei è:", opts: ["Il ponte motori", "La plancia", "Il piano di volo", "La sala equipaggio"], ans: 2 },
      { q: "Il 'Rudder' è:", opts: ["Il radar", "Il timone", "L'elica", "Il sonar"], ans: 1 },
      { q: "I 'Mooring lines' sono:", opts: ["Linee radar", "Cavi di ormeggio", "Cavi dell'ancora", "Linee elettriche"], ans: 1 },
      { q: "Il 'Combat Information Center' (CIC) è:", opts: ["La mensa", "La sala operativa tattica", "La cabina del comandante", "Il magazzino"], ans: 1 },
      { q: "Il comando 'All hands on deck' significa:", opts: ["Tutti in cabina", "Tutti sul ponte", "Fuori dal ponte", "Nessuno in servizio"], ans: 1 }
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
    inizializzaAuth();
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
        if (pagina) {
          mostraPagina(pagina);
        }
      });
    });

    // Pulsante speciale per quiz marino
    document.querySelectorAll("[data-quiz-direct]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.quizDirect, 10);
        mostraPagina("quiz");
        setTimeout(() => {
          if (!stato.nomeStudente) {
            document.getElementById("step-name").classList.remove("hidden");
            document.getElementById("step-select").classList.add("hidden");
          } else {
            selezionaQuiz(idx);
          }
        }, 100);
      });
    });

    const btnQuizNavale = document.getElementById("naval-quiz-cta");
    if (btnQuizNavale) {
      btnQuizNavale.addEventListener("click", () => {
        mostraPagina("quiz");
        setTimeout(() => {
          if (!stato.nomeStudente) {
            document.getElementById("step-name").classList.remove("hidden");
            document.getElementById("step-select").classList.add("hidden");
          } else {
            selezionaQuiz(7);
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

    if (idPagina === "quiz") {
      const nomeLocale = localStorage.getItem("ea_utente");
      if (nomeLocale && !stato.nomeStudente) {
        stato.nomeStudente = nomeLocale;
        document.getElementById("display-name").textContent = nomeLocale;
        document.getElementById("quiz-student-label").textContent = "👤 " + nomeLocale;
        document.getElementById("step-name").classList.add("hidden");
        document.getElementById("step-select").classList.remove("hidden");
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
   SEZIONE: MODAL ACCEDI / ISCRIVITI
   ======================================== */

let _corsoAuth = "";
let _utenteLoggato = !!localStorage.getItem("ea_utente");

function salvaUtenteLoggato(nome) {
  localStorage.setItem("ea_utente", nome);
  _utenteLoggato = true;
  aggiornaNavAuthBtn();
}

function aggiornaNavAuthBtn() {
  const btn  = document.getElementById("nav-auth-btn");
  if (!btn) return;
  const nome = localStorage.getItem("ea_utente");
  if (nome) {
    btn.textContent = "✅ " + nome;
    btn.classList.add("loggato");
  } else {
    btn.textContent = "👤 Iscriviti / Entra";
    btn.classList.remove("loggato");
  }
}

function apriModalAuth(corso) {
  try {
    _corsoAuth = corso || "";
    const label = document.getElementById("auth-corso-label");
    if (label) {
      label.textContent = corso
        ? `Iscriviti per accedere al corso: ${corso}`
        : "Crea il tuo account gratuito.";
    }
    impostaTabAuth("iscriviti");
    document.getElementById("auth-modal").classList.add("aperto");
    document.body.style.overflow = "hidden";
  } catch (err) {
    console.error("Errore apriModalAuth:", err);
  }
}

function chiudiModalAuth() {
  try {
    document.getElementById("auth-modal").classList.remove("aperto");
    document.body.style.overflow = "";
    resetFormAuth();
  } catch (err) {
    console.error("Errore chiudiModalAuth:", err);
  }
}

function impostaTabAuth(tab) {
  document.querySelectorAll(".auth-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".auth-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById("auth-panel-" + tab);
  if (panel) panel.classList.add("active");
}

function resetFormAuth() {
  ["login-email","login-password","reg-nome","reg-cognome","reg-email","reg-password"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  ["auth-login-error","auth-reg-error"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ""; el.classList.add("hidden"); }
  });
}

function inizializzaAuth() {
  try {
    aggiornaNavAuthBtn();

    document.getElementById("nav-auth-btn").addEventListener("click", () => {
      if (_utenteLoggato) {
        impostaTabAuth("accedi");
        document.getElementById("auth-modal").classList.add("aperto");
        document.body.style.overflow = "hidden";
      } else {
        apriModalAuth("");
        impostaTabAuth("iscriviti");
      }
    });

    document.getElementById("auth-close").addEventListener("click", chiudiModalAuth);
    document.getElementById("btn-auth-chiudi").addEventListener("click", chiudiModalAuth);

    document.getElementById("auth-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) chiudiModalAuth();
    });

    document.querySelectorAll(".auth-tab").forEach(btn => {
      btn.addEventListener("click", () => impostaTabAuth(btn.dataset.tab));
    });

    document.querySelectorAll("[data-tab-switch]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        impostaTabAuth(link.dataset.tabSwitch);
      });
    });

    document.querySelectorAll("[data-apri-auth]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (_utenteLoggato) {
          mostraPagina("quiz");
        } else {
          const card = btn.closest(".card");
          const corso = card ? (card.querySelector("h3")?.textContent?.trim() || "") : "";
          apriModalAuth(corso);
        }
      });
    });

    document.getElementById("btn-login").addEventListener("click", async () => {
      const email    = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errEl    = document.getElementById("auth-login-error");
      const btn      = document.getElementById("btn-login");

      if (!email || !password) {
        errEl.textContent = "Inserisci email e password.";
        errEl.classList.remove("hidden");
        return;
      }

      btn.disabled = true; btn.textContent = "⏳ Accesso...";
      try {
        const res  = await fetch("/api/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (data.success) {
          salvaUtenteLoggato(data.nome);
          impostaTabAuth("success");
          document.getElementById("auth-success-title").textContent = "Accesso effettuato!";
          document.getElementById("auth-success-msg").textContent   = data.message;
        } else {
          errEl.textContent = data.message;
          errEl.classList.remove("hidden");
        }
      } catch(e) {
        errEl.textContent = "Errore di connessione. Riprova.";
        errEl.classList.remove("hidden");
      } finally {
        btn.disabled = false; btn.textContent = "Accedi →";
      }
    });

    document.getElementById("btn-register").addEventListener("click", async () => {
      const nome     = document.getElementById("reg-nome").value.trim();
      const cognome  = document.getElementById("reg-cognome").value.trim();
      const email    = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const errEl    = document.getElementById("auth-reg-error");
      const btn      = document.getElementById("btn-register");

      if (!nome || !cognome || !email || !password) {
        errEl.textContent = "Compila tutti i campi.";
        errEl.classList.remove("hidden");
        return;
      }

      btn.disabled = true; btn.textContent = "⏳ Registrazione...";
      try {
        const res  = await fetch("/api/register", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ nome, cognome, email, password, corso: _corsoAuth }) });
        const data = await res.json();
        if (data.success) {
          salvaUtenteLoggato(data.nome);
          impostaTabAuth("success");
          document.getElementById("auth-success-title").textContent = "Iscrizione completata!";
          document.getElementById("auth-success-msg").textContent   = data.message + (_corsoAuth ? ` Hai scelto: ${_corsoAuth}.` : "");
        } else {
          errEl.textContent = data.message;
          errEl.classList.remove("hidden");
        }
      } catch(e) {
        errEl.textContent = "Errore di connessione. Riprova.";
        errEl.classList.remove("hidden");
      } finally {
        btn.disabled = false; btn.textContent = "Crea Account →";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") chiudiModalAuth();
    });

  } catch (err) {
    console.error("Errore inizializzaAuth:", err);
  }
}

// Logging per debug
console.log("English Academy - App caricata con successo");



