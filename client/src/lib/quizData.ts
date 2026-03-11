export const quizzes = {
  base: [
    {
      question: "Come si dice 'grazie' in inglese?",
      options: ["Please", "Thank you", "Hello", "Sorry"],
      correct: 1,
    },
    {
      question: "Quale è il presente semplice di 'to be' (io sono)?",
      options: ["I was", "I am", "I will be", "I have been"],
      correct: 1,
    },
    {
      question: "Come si chiede 'Come stai?' in inglese?",
      options: ["How are you?", "Are you?", "How you are?", "What are you?"],
      correct: 0,
    },
    {
      question: "Quale articolo indeterminativo usiamo prima di 'apple'?",
      options: ["a", "an", "the", "some"],
      correct: 1,
    },
    {
      question: "Qual è il plurale di 'child'?",
      options: ["childs", "children", "childes", "childer"],
      correct: 1,
    },
    {
      question: "Come si dice 'no' in inglese?",
      options: ["Yes", "No", "Not", "Never"],
      correct: 1,
    },
  ],
  intermedio: [
    {
      question: "Completa: 'If I had known, I _____ gone.'",
      options: ["would have", "will have", "have", "would"],
      correct: 0,
    },
    {
      question: "Quale tempo verbale è corretto? 'She ____ live in London for 5 years.'",
      options: ["has lived", "lived", "lives", "is living"],
      correct: 0,
    },
    {
      question: "Quale frase è corretta?",
      options: [
        "Despite of the rain, we went out",
        "Although the rain, we went out",
        "In spite of the rain, we went out",
        "Although of the rain, we went out",
      ],
      correct: 2,
    },
    {
      question: "Cosa significa 'to put up with'?",
      options: ["tollerare", "costruire", "sollevare", "immagazzinare"],
      correct: 0,
    },
    {
      question: "Quale parola è un sinonimo di 'stubborn'?",
      options: ["flexible", "obstinate", "clever", "brave"],
      correct: 1,
    },
    {
      question: "Completa: 'She speaks English _____ fluently than her brother.'",
      options: ["more", "most", "much", "many"],
      correct: 0,
    },
  ],
  business: [
    {
      question: "Come iniziare una email formale in inglese?",
      options: [
        "Hi there!",
        "Dear Sir/Madam,",
        "What's up?",
        "Ciao,",
      ],
      correct: 1,
    },
    {
      question: "Quale è il termine corretto per 'riunione' in contesto aziendale?",
      options: ["gathering", "meeting", "party", "talk"],
      correct: 1,
    },
    {
      question: "Come si dice 'fatturato' in inglese?",
      options: ["revenue", "profit", "income", "turnover"],
      correct: 0,
    },
    {
      question: "Quale frase è più formale?",
      options: [
        "I want a discount",
        "Could you provide a discount?",
        "Gimme a discount",
        "Discount please",
      ],
      correct: 1,
    },
    {
      question: "Cosa significa 'ROI'?",
      options: [
        "Return on Investment",
        "Rate of Interest",
        "Revenue on Income",
        "Ratio of Information",
      ],
      correct: 0,
    },
    {
      question: "Come terminare una email formale?",
      options: [
        "See you later!",
        "Yours sincerely,",
        "Bye bye!",
        "Talk soon",
      ],
      correct: 1,
    },
  ],
  marina: [
    {
      question: "Come si dice 'scafo' in inglese navale?",
      options: ["bridge", "hull", "deck", "bow"],
      correct: 1,
    },
    {
      question: "Cosa significa 'conning tower'?",
      options: ["plancia", "torre di comando", "timone", "vela"],
      correct: 1,
    },
    {
      question: "Quale è la prua di una nave?",
      options: ["stern", "bow", "beam", "draft"],
      correct: 1,
    },
    {
      question: "Come si chiama il sistema che frena l'aereo in atterraggio su una portaerei?",
      options: ["catapult", "arrestor wire", "flight deck", "island"],
      correct: 1,
    },
    {
      question: "Cosa sono le 'ballast tanks'?",
      options: [
        "serbatoi di carburante",
        "casse di zavorra",
        "camere di compensazione",
        "tunnel di navigazione",
      ],
      correct: 1,
    },
    {
      question: "Quale è il termine per 'poppa' di una nave?",
      options: ["bow", "stern", "beam", "keel"],
      correct: 1,
    },
  ],
};

export const courseData = [
  {
    icon: "🌱",
    title: "Inglese Base (A1–A2)",
    description: "Alfabeto, numeri, saluti, presentazioni, verbi essenziali, articoli, il presente semplice.",
    badge: "8 SETTIMANE",
    details: ["Grammatica di base", "Vocabolario quotidiano", "Conversazione semplice"],
  },
  {
    icon: "📗",
    title: "Inglese Pre-Intermedio (A2–B1)",
    description: "Passato, futuro, condizionale, frasi composte e conversazioni pratiche.",
    badge: "10 SETTIMANE",
    details: ["Tempi verbali", "Listening avanzato", "Scrittura formale base"],
  },
  {
    icon: "📘",
    title: "Inglese Intermedio (B1–B2)",
    description: "Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.",
    badge: "12 SETTIMANE",
    details: ["Grammatica avanzata", "Reading comprehension", "Conversazione fluente"],
  },
  {
    icon: "📙",
    title: "Inglese Avanzato (C1–C2)",
    description: "Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.",
    badge: "14 SETTIMANE",
    details: ["Letteratura e stile", "Dibattiti e argomentazione", "Idiomi e pronunce"],
  },
  {
    icon: "💼",
    title: "Business English",
    description: "Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.",
    badge: "8 SETTIMANE",
    details: [],
  },
  {
    icon: "✈️",
    title: "Inglese per Viaggi",
    description: "Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.",
    badge: "4 SETTIMANE",
    details: [],
  },
  {
    icon: "🎓",
    title: "Preparazione IELTS / Cambridge",
    description: "Simulazioni d'esame, writing task, reading avanzato, speaking test.",
    badge: "12 SETTIMANE",
    details: [],
  },
];

export const shipTypes = [
  {
    icon: "🛸",
    name: "Aircraft Carrier",
    nameIt: "Portaerei",
    components: [
      { en: "Flight deck", it: "Piano di volo." },
      { en: "Catapult", it: "Sistema che accelera gli aerei per il decollo." },
      { en: "Arrestor wire", it: "Cavo che frena l'aereo in atterraggio." },
      { en: "Island", it: "Superstruttura con plancia e controllo aereo." },
    ],
  },
  {
    icon: "🚢",
    name: "Destroyer",
    nameIt: "Cacciatorpediniere",
    components: [
      { en: "Hull", it: "Scafo." },
      { en: "Bow", it: "Prua." },
      { en: "Stern", it: "Poppa." },
      { en: "CIC", it: "Centro operativo di combattimento." },
    ],
  },
  {
    icon: "🤿",
    name: "Submarine",
    nameIt: "Sottomarino",
    components: [
      { en: "Conning tower", it: "Torre di comando." },
      { en: "Ballast tanks", it: "Casse di zavorra." },
      { en: "Periscope", it: "Periscopio." },
      { en: "Dive planes", it: "Timoni di profondità." },
    ],
  },
  {
    icon: "⚓",
    name: "Frigate",
    nameIt: "Fregata",
    components: [
      { en: "Bridge", it: "Plancia di comando." },
      { en: "Mast", it: "Albero con sensori e radar." },
      { en: "Funnel", it: "Fumaiolo." },
      { en: "Helipad", it: "Piazzola elicotteri." },
    ],
  },
  {
    icon: "🔱",
    name: "Corvette",
    nameIt: "Corvetta",
    components: [
      { en: "Main gun", it: "Cannone principale." },
      { en: "Depth charges", it: "Bombe di profondità." },
      { en: "Rudder", it: "Timone." },
      { en: "Propeller", it: "Elica." },
    ],
  },
  {
    icon: "🔭",
    name: "Patrol Vessel",
    nameIt: "Pattugliatore",
    components: [
      { en: "Waterline", it: "Linea di galleggiamento." },
      { en: "Draft", it: "Pescaggio." },
      { en: "Freeboard", it: "Bordo libero." },
      { en: "Mooring lines", it: "Cavi di ormeggio." },
    ],
  },
];

export const teamMembers = [
  {
    avatar: "👩‍🏫",
    name: "Prof.ssa Laura Ferretti",
    role: "DIRETTRICE DIDATTICA",
    bio: "Esperta di insegnamento dell'inglese per adulti e contesti professionali.",
  },
  {
    avatar: "👨‍✈️",
    name: "Cap. Marco Olivieri",
    role: "ESPERTO INGLESE NAVALE",
    bio: "Ex ufficiale della Marina Militare Italiana e referente del curriculum tecnico-navale.",
  },
  {
    avatar: "👩‍💼",
    name: "Dott.ssa Sofia Ricci",
    role: "COORDINATRICE CORSI",
    bio: "Linguista specializzata in inglese per scopi specifici e percorsi business.",
  },
  {
    avatar: "🧑‍💻",
    name: "Ing. Davide Conti",
    role: "RESPONSABILE PIATTAFORMA",
    bio: "Sviluppatore e specialista e-learning per un'esperienza digitale semplice e stabile.",
  },
];
