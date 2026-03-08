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
});

function bindNavigation() {
  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  const navalQuizBtn = document.getElementById("go-naval-quiz");
  if (navalQuizBtn) {
    navalQuizBtn.addEventListener("click", () => {
      showPage("quiz");
      if (state.studentName) {
        selectQuiz(3);
      }
    });
  }
}

function bindAccordion() {
  document.querySelectorAll(".acc-header").forEach(header => {
    header.addEventListener("click", () => toggleAcc(header));
  });
}

function bindQuiz() {
  const submitNameBtn = document.getElementById("submit-name-btn");
  const nextBtn = document.getElementById("next-btn");
  const retryBtn = document.getElementById("retry-btn");
  const changeQuizBtn = document.getElementById("change-quiz-btn");
  const nameInput = document.getElementById("student-name-input");

  if (submitNameBtn) submitNameBtn.addEventListener("click", submitName);
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion);
  if (retryBtn) retryBtn.addEventListener("click", retryQuiz);
  if (changeQuizBtn) changeQuizBtn.addEventListener("click", changeQuiz);

  if (nameInput) {
    nameInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitName();
      }
    });
  }

  document.querySelectorAll(".quiz-btn-sel").forEach(btn => {
    btn.addEventListener("click", () => {
      const quizIndex = Number(btn.dataset.quiz);
      selectQuiz(quizIndex);
    });
  });
}

function bindContactForm() {
  const form = document.getElementById("contact-form-fields");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    submitForm();
  });
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll("nav button").forEach(button => button.classList.remove("active"));

  const page = document.getElementById(id);
  if (page) page.classList.add("active");

  const navMap = {
    home: 0,
    corsi: 1,
    marina: 2,
    quiz: 3,
    "chi-siamo": 4,
    contatti: 5
  };

  const navButtons = document.querySelectorAll("nav button");
  if (navMap[id] !== undefined && navButtons[navMap[id]]) {
    navButtons[navMap[id]].classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleAcc(header) {
  header.classList.toggle("open");
  const body = header.nextElementSibling;
  if (body) body.classList.toggle("open");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function submitForm() {
  const fields = document.getElementById("contact-form-fields");
  const sent = document.getElementById("form-sent");

  if (fields) fields.style.display = "none";
  if (sent) sent.style.display = "block";

  showToast("✅ Messaggio inviato!");
}

function submitName() {
  const input = document.getElementById("student-name-input");
  if (!input) return;

  const val = input.value.trim();
  if (!val) {
    showToast("⚠️ Inserisci il tuo nome!");
    return;
  }

  state.studentName = val;

  document.getElementById("display-name").textContent = val;
  document.getElementById("step-name").style.display = "none";
  document.getElementById("step-select").style.display = "block";
  document.getElementById("step-quiz").style.display = "none";
  document.getElementById("step-results").style.display = "none";
}

function selectQuiz(idx) {
  if (!quizData[idx]) return;

  state.quizIndex = idx;
  state.current = 0;
  state.score = 0;
  state.answered = false;

  const allQuestions = quizData[idx].questions;

  if (idx === 3 && allQuestions.length > 10) {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    state.activeQuestions = shuffled.slice(0, 10);
  } else {
    state.activeQuestions = [...allQuestions];
  }

  document.getElementById("step-select").style.display = "none";
  document.getElementById("step-results").style.display = "none";
  document.getElementById("step-quiz").style.display = "block";

  document.querySelectorAll(".quiz-btn-sel").forEach(btn => btn.classList.remove("selected"));
  const selectedBtn = document.querySelector(`.quiz-btn-sel[data-quiz="${idx}"]`);
  if (selectedBtn) selectedBtn.classList.add("selected");

  renderQuestion();
}

function renderQuestion() {
  const quiz = quizData[state.quizIndex];
  const q = state.activeQuestions[state.current];
  if (!quiz || !q) return;

  const total = state.activeQuestions.length;
  const progress = (state.current / total) * 100;

  document.getElementById("quiz-student-label").textContent = "👤 " + state.studentName;
  document.getElementById("quiz-progress").textContent = `Domanda ${state.current + 1} di ${total}`;
  document.getElementById("quiz-score-live").textContent = `⭐ ${state.score} / ${state.current}`;
  document.getElementById("q-num").textContent = `DOMANDA ${state.current + 1} – ${quiz.title.toUpperCase()}`;
  document.getElementById("q-text").textContent = q.q;
  document.getElementById("progress-fill").style.width = `${progress}%`;
  document.getElementById("q-feedback").style.display = "none";
  document.getElementById("next-btn").style.display = "none";

  state.answered = false;

  const letters = ["A", "B", "C", "D"];
  const container = document.getElementById("q-options");
  container.innerHTML = "";

  q.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener("click", () => answerQuestion(i, btn));
    container.appendChild(btn);
  });
}

function answerQuestion(chosen, btn) {
  if (state.answered) return;

  state.answered = true;

  const q = state.activeQuestions[state.current];
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(button => button.disabled = true);

  const feedback = document.getElementById("q-feedback");
  const total = state.activeQuestions.length;

  if (chosen === q.ans) {
    state.score++;
    btn.classList.add("correct");
    feedback.className = "feedback-msg correct";
    feedback.textContent = "✅ Risposta corretta! Ottimo lavoro!";
  } else {
    btn.classList.add("wrong");
    if (allBtns[q.ans]) allBtns[q.ans].classList.add("correct");
    feedback.className = "feedback-msg wrong";
    feedback.textContent = `❌ Risposta errata. La risposta corretta era: "${q.opts[q.ans]}"`;
  }

  document.getElementById("quiz-score-live").textContent = `⭐ ${state.score} / ${state.current + 1}`;
  feedback.style.display = "block";

  const nextBtn = document.getElementById("next-btn");
  nextBtn.style.display = "inline-block";
  nextBtn.textContent = state.current + 1 >= total ? "🏁 Vedi risultati" : "Prossima →";
}

function nextQuestion() {
  const total = state.activeQuestions.length;

  if (state.current + 1 >= total) {
    showResults();
  } else {
    state.current++;
    renderQuestion();
  }
}

function showResults() {
  const total = state.activeQuestions.length;
  const pct = Math.round((state.score / total) * 100);
  const wrong = total - state.score;

  document.getElementById("step-quiz").style.display = "none";
  document.getElementById("step-results").style.display = "block";

  const degrees = (pct / 100) * 360;
  document.getElementById("score-circle").style.background =
    `conic-gradient(var(--gold) ${degrees}deg, rgba(255,255,255,0.06) ${degrees}deg)`;

  document.getElementById("score-pct").textContent = `${pct}%`;
  document.getElementById("result-student").textContent = `👤 ${state.studentName} – ${quizData[state.quizIndex].title}`;
  document.getElementById("r-correct").textContent = `✓ ${state.score} corrette`;
  document.getElementById("r-wrong").textContent = `✗ ${wrong} errate`;
  document.getElementById("r-total").textContent = `📊 ${total} totali`;

  let grade;
  let color;
  let title;

  if (pct >= 90) {
    grade = "🏆 ECCELLENTE";
    color = "var(--gold2)";
    title = "Risultato Eccellente!";
  } else if (pct >= 75) {
    grade = "⭐ OTTIMO";
    color = "#6ade8a";
    title = "Ottimo Lavoro!";
  } else if (pct >= 60) {
    grade = "👍 BUONO";
    color = "#4ac8f0";
    title = "Buon Risultato!";
  } else if (pct >= 40) {
    grade = "📚 SUFFICIENTE";
    color = "#f0b34a";
    title = "Continua a Studiare!";
  } else {
    grade = "💪 DA MIGLIORARE";
    color = "#e07070";
    title = "Non Mollare!";
  }

  const gradeBadge = document.getElementById("grade-badge");
  gradeBadge.textContent = grade;
  gradeBadge.style.background = `${color}22`;
  gradeBadge.style.color = color;
  gradeBadge.style.border = `1px solid ${color}55`;

  document.getElementById("result-title").textContent = title;

  state.history.unshift({
    name: state.studentName,
    quiz: quizData[state.quizIndex].title,
    score: state.score,
    total,
    pct
  });

  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById("lb-entries");
  const leaderboard = document.getElementById("leaderboard");
  if (!container || !leaderboard) return;

  container.innerHTML = "";

  const last5 = state.history.slice(0, 5);
  if (last5.length === 0) {
    leaderboard.style.display = "none";
    return;
  }

  leaderboard.style.display = "block";

  last5.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "lb-entry";
    div.innerHTML = `
      <div class="lb-rank">${i + 1}</div>
      <div class="lb-name">${entry.name}</div>
      <div class="lb-quiz">${entry.quiz}</div>
      <div class="lb-score">${entry.pct}%</div>
    `;
    container.appendChild(div);
  });
}

function retryQuiz() {
  if (state.quizIndex >= 0) {
    selectQuiz(state.quizIndex);
  }
}

function changeQuiz() {
  document.getElementById("step-results").style.display = "none";
  document.getElementById("step-quiz").style.display = "none";
  document.getElementById("step-select").style.display = "block";
}
