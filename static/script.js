const quizData = [
  {
    title: "Inglese Base",
    questions: [
      { q: "Come si dice 'Buongiorno' in inglese?", opts: ["Hello", "Good morning", "Good evening", "Goodbye"], ans: 1 },
      { q: "Quale è il plurale di 'child'?", opts: ["Childs", "Children", "Childrens", "Childre"], ans: 1 },
      { q: "Completa: 'She ___ a teacher.'", opts: ["am", "is", "are", "be"], ans: 1 },
      { q: "Come si dice 'Gatto' in inglese?", opts: ["Dog", "Bird", "Cat", "Fish"], ans: 2 },
      { q: "Quale frase è corretta?", opts: ["I doesn't like coffee", "I don't like coffee", "I not like coffee", "I no like coffee"], ans: 1 },
      { q: "Come si dice 'Quanto costa?' in inglese?", opts: ["How much is it?", "What is the price how?", "How many cost?", "Is it how much?"], ans: 0 }
    ]
  },
  {
    title: "Inglese Intermedio",
    questions: [
      { q: "Choose the correct form: 'By the time she arrived, we ___ the food.'", opts: ["already ate", "had already eaten", "already had eat", "was eating"], ans: 1 },
      { q: "Which sentence uses the passive voice correctly?", opts: ["The report wrote by him", "The report was written by him", "He written the report", "Written the report by him"], ans: 1 },
      { q: "'Despite the rain, they continued the match.' What does 'despite' mean?", opts: ["Because of", "In spite of", "Thanks to", "Due to"], ans: 1 },
      { q: "Choose the correct preposition: 'She is good ___ mathematics.'", opts: ["in", "on", "at", "for"], ans: 2 },
      { q: "What is the meaning of 'procrastinate'?", opts: ["To plan ahead", "To delay doing something", "To hurry up", "To forget"], ans: 1 },
      { q: "'I wish I ___ more time.' Complete correctly.", opts: ["have", "had", "would have", "will have"], ans: 1 }
    ]
  },
  {
    title: "Business English",
    questions: [
      { q: "Which phrase is appropriate to open a formal email?", opts: ["Hey there!", "Yo, what's up?", "Dear Sir/Madam,", "Hiya!"], ans: 2 },
      { q: "What does 'KPI' stand for?", opts: ["Key Performance Indicator", "Knowledge Process Integration", "Key Project Initiative", "Known Process Index"], ans: 0 },
      { q: "'Let's circle back on this' means:", opts: ["Draw a circle", "Return to this topic later", "Cancel the meeting", "Work in a circle"], ans: 1 },
      { q: "Which is the correct way to decline a meeting?", opts: ["No, I can't.", "I'm afraid I won't be able to attend.", "Meeting is bad for me.", "I don't want."], ans: 1 },
      { q: "What does 'due diligence' mean in business?", opts: ["Being polite", "Careful investigation before a deal", "Paying bills on time", "Following orders"], ans: 1 },
      { q: "'Please find attached the document' is used when:", opts: ["You're presenting verbally", "You include a file with an email", "You ask for a document", "You delete a file"], ans: 1 }
    ]
  },
  {
    title: "Marina Militare",
    questions: [
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

const shipData = {
  carrier: {
    name: "Aircraft Carrier",
    nameIT: "Portaerei",
    description: "Una nave da guerra di grandi dimensioni con un ponte di volo continuo per il lancio e l'atterraggio di aerei.",
    image: "https://images.unsplash.com/photo-1552087405-ac1c40e9c629?w=1200&h=800&fit=crop"
  },
  destroyer: {
    name: "Destroyer",
    nameIT: "Cacciatorpediniere",
    description: "Una nave da guerra veloce e manovrabile, principalmente usata per l'escorta e il combattimento tattico.",
    image: "https://images.unsplash.com/photo-1568876694728-451bbf694b39?w=1200&h=800&fit=crop"
  },
  submarine: {
    name: "Submarine",
    nameIT: "Sottomarino",
    description: "Una nave militare sommersa con capacità di navigazione sottomarina, equipaggiata con sensori avanzati.",
    image: "https://images.unsplash.com/photo-1551956470-d5bc2a8f4e72?w=1200&h=800&fit=crop"
  },
  frigate: {
    name: "Frigate",
    nameIT: "Fregata",
    description: "Una nave da guerra multiruolo di medie dimensioni, versatile per molteplici operazioni navali.",
    image: "https://images.unsplash.com/photo-1570454968416-4e83d4ef0e20?w=1200&h=800&fit=crop"
  },
  corvette: {
    name: "Corvette",
    nameIT: "Corvetta",
    description: "Una nave da guerra di piccole-medie dimensioni, rapida e agile, ideale per operazioni costiere.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop"
  },
  patrol: {
    name: "Patrol Vessel",
    nameIT: "Pattugliatore",
    description: "Una nave veloce e leggera utilizzata per la pattuglia, il controllo e l'intervento rapido in acque costiere.",
    image: "https://images.unsplash.com/photo-1608513520737-a6a9ae83ac51?w=1200&h=800&fit=crop"
  }
};

const state = {
  studentName: "",
  quizIndex: -1,
  current: 0,
  score: 0,
  answered: false,
  history: [],
  activeQuestions: []
};

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindAccordion();
  bindQuiz();
  bindContactForm();
  bindShipModal();
});

function bindNavigation() {
  document.querySelectorAll("[data-page], [data-page-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page || btn.dataset.pageTarget;
      if (page) showPage(page);
    });
  });

  const navalQuizBtn = document.getElementById("naval-quiz-cta");
  if (navalQuizBtn) {
    navalQuizBtn.addEventListener("click", () => {
      showPage("quiz");
      setTimeout(() => {
        if (!state.studentName) {
          document.getElementById("step-name").classList.remove("hidden");
          document.getElementById("step-select").classList.add("hidden");
        } else {
          selectQuiz(3);
        }
      }, 100);
    });
  }
}

function bindShipModal() {
  document.querySelectorAll(".ship-icon-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const shipType = btn.dataset.ship;
      const ship = shipData[shipType];
      if (ship) {
        openShipModal(ship);
      }
    });
  });

  const modal = document.getElementById("ship-modal");
  const closeBtn = document.getElementById("modal-close");
  
  if (closeBtn) {
    closeBtn.addEventListener("click", closeShipModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeShipModal();
      }
    });
  }
}

function openShipModal(ship) {
  const modal = document.getElementById("ship-modal");
  const title = document.getElementById("modal-title");
  const subtitle = document.getElementById("modal-subtitle");
  const image = document.getElementById("modal-image");
  const description = document.getElementById("modal-description");

  if (title) title.textContent = ship.name;
  if (subtitle) subtitle.textContent = ship.nameIT;
  if (image) {
    image.src = ship.image;
    image.alt = ship.name;
  }
  if (description) description.textContent = ship.description;

  if (modal) {
    modal.classList.add("active");
  }
}

function closeShipModal() {
  const modal = document.getElementById("ship-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function bindAccordion() {
  document.querySelectorAll(".acc-header").forEach(header => {
    header.addEventListener("click", () => toggleAcc(header));
  });
}

function toggleAcc(header) {
  const acc = header.parentElement;
  acc.classList.toggle("open");
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active");
}

function bindQuiz() {
  const nameBtn = document.getElementById("submit-name-btn");
  const nameInput = document.getElementById("student-name-input");

  if (nameBtn) {
    nameBtn.addEventListener("click", () => submitName(nameInput.value));
  }

  document.querySelectorAll(".quiz-btn-sel").forEach((btn, idx) => {
    btn.addEventListener("click", () => selectQuiz(idx));
  });

  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", nextQuestion);
  }

  const retryBtn = document.getElementById("retry-quiz-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", retryQuiz);
  }

  const changeBtn = document.getElementById("change-quiz-btn");
  if (changeBtn) {
    changeBtn.addEventListener("click", changeQuiz);
  }
}

function submitName(name) {
  if (!name.trim()) {
    alert("Per favore, inserisci il tuo nome.");
    return;
  }
  state.studentName = name;
  document.getElementById("display-name").textContent = name;
  document.getElementById("quiz-student-label").textContent = "👤 " + name;
  document.getElementById("step-name").classList.add("hidden");
  document.getElementById("step-select").classList.remove("hidden");
}

function selectQuiz(idx) {
  state.quizIndex = idx;
  state.current = 0;
  state.score = 0;
  state.answered = false;
  state.activeQuestions = [...quizData[idx].questions].sort(() => Math.random() - 0.5);
  document.getElementById("step-select").classList.add("hidden");
  document.getElementById("step-quiz").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  const q = state.activeQuestions[state.current];
  document.getElementById("q-num").textContent = "DOMANDA " + (state.current + 1);
  document.getElementById("q-text").textContent = q.q;
  document.getElementById("q-feedback").classList.add("hidden");

  const optDiv = document.getElementById("q-options");
  optDiv.innerHTML = "";
  q.opts.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";
    btn.addEventListener("click", () => answerQuestion(idx));
    optDiv.appendChild(btn);
  });

  const total = state.activeQuestions.length;
  document.getElementById("quiz-progress").textContent = `Domanda ${state.current + 1} di ${total}`;
  document.getElementById("progress-fill").style.width = ((state.current + 1) / total * 100) + "%";
  document.getElementById("quiz-score-live").textContent = "⭐ " + state.score + " / " + (state.current + 1);

  state.answered = false;
  document.getElementById("next-btn").disabled = true;
}

function answerQuestion(chosenIdx) {
  if (state.answered) return;
  state.answered = true;

  const q = state.activeQuestions[state.current];
  const opts = document.querySelectorAll(".option");

  opts.forEach((opt, idx) => {
    if (idx === q.ans) {
      opt.classList.add("correct");
    } else if (idx === chosenIdx) {
      opt.classList.add("wrong");
    }
  });

  const feedback = document.getElementById("q-feedback");
  if (chosenIdx === q.ans) {
    state.score++;
    feedback.textContent = "✅ Corretto!";
    feedback.className = "feedback-msg correct";
  } else {
    feedback.textContent = "❌ Sbagliato. La risposta corretta è: " + q.opts[q.ans];
    feedback.className = "feedback-msg wrong";
  }

  feedback.classList.remove("hidden");
  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  state.current++;
  if (state.current >= state.activeQuestions.length) {
    endQuiz();
  } else {
    loadQuestion();
  }
}

function endQuiz() {
  const total = state.activeQuestions.length;
  const pct = Math.round(state.score / total * 100);

  document.getElementById("step-quiz").classList.add("hidden");
  document.getElementById("step-results").classList.remove("hidden");

  document.getElementById("score-pct").textContent = pct + "%";
  document.getElementById("r-correct").textContent = "✓ " + state.score + " corrette";
  document.getElementById("r-wrong").textContent = "✗ " + (total - state.score) + " errate";
  document.getElementById("r-total").textContent = "📊 " + total + " totali";
  document.getElementById("result-student").textContent = state.studentName;

  let grade = "Eccellente!";
  if (pct < 60) grade = "Non ancora... Riprova!";
  else if (pct < 75) grade = "Buono!";
  else if (pct < 90) grade = "Molto buono!";

  document.getElementById("grade-badge").textContent = grade;

  const entry = state.studentName + " - " + pct + "% - " + new Date().toLocaleDateString("it-IT");
  state.history.push(entry);
  updateLeaderboard();
}

function updateLeaderboard() {
  const lb = document.getElementById("lb-entries");
  if (lb && state.history.length > 0) {
    lb.innerHTML = state.history.map(e => `<div class="lb-entry"><span>${e}</span></div>`).join("");
    document.getElementById("leaderboard").classList.remove("hidden");
  }
}

function retryQuiz() {
  selectQuiz(state.quizIndex);
  document.getElementById("step-results").classList.add("hidden");
}

function changeQuiz() {
  state.current = 0;
  state.score = 0;
  state.answered = false;
  state.quizIndex = -1;
  document.getElementById("step-results").classList.add("hidden");
  document.getElementById("step-select").classList.remove("hidden");
}

function bindContactForm() {
  const submitBtn = document.getElementById("submit-form-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitContact);
  }
  
  bindShipPartTooltips();
}

function submitContact() {
  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const message = document.getElementById("contact-message").value;

  if (!name || !email || !message) {
    showToast("Per favore, compila tutti i campi.");
    return;
  }

  const submitBtn = document.getElementById("submit-form-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Invio...";

  fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
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
        submitBtn.disabled = false;
        submitBtn.textContent = "Invia Messaggio ✉️";
      }, 3000);
    } else {
      showToast("Errore: " + data.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Invia Messaggio ✉️";
    }
  })
  .catch(error => {
    showToast("Errore di connessione");
    submitBtn.disabled = false;
    submitBtn.textContent = "Invia Messaggio ✉️";
  });
}

function bindShipPartTooltips() {
  document.querySelectorAll(".comp-list li").forEach(item => {
    item.style.cursor = "pointer";
    item.style.position = "relative";
    
    item.addEventListener("mouseenter", (e) => {
      const compEn = item.querySelector(".comp-en").textContent;
      const compIt = item.querySelector(".comp-it").textContent;
      
      let tooltip = item.querySelector(".ship-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "ship-tooltip";
        tooltip.innerHTML = `<strong>${compEn}</strong><br>${compIt}`;
        item.appendChild(tooltip);
      }
      tooltip.style.display = "block";
    });
    
    item.addEventListener("mouseleave", () => {
      const tooltip = item.querySelector(".ship-tooltip");
      if (tooltip) {
        tooltip.style.display = "none";
      }
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
