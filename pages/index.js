import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

// ─── DATI QUIZ ───────────────────────────────────────────────────────────────
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
      { q: "'She suggested ___ the meeting earlier.'", opts: ["to hold", "holding", "hold", "held"], ans: 1 },
      { q: "The phrasal verb 'put off' means:", opts: ["To organise", "To postpone", "To cancel permanently", "To start immediately"], ans: 1 },
      { q: "'Not only did she win, ___ she broke the record.'", opts: ["but also", "and also", "as well", "also"], ans: 0 },
      { q: "Choose the correct word: 'The meeting was ___.'", opts: ["bored", "boring", "bore", "bores"], ans: 1 },
      { q: "What does 'ambiguous' mean?", opts: ["Very clear", "Open to more than one interpretation", "Completely wrong", "Very long"], ans: 1 }
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
      { q: "What is a 'red herring' in argumentation?", opts: ["A strong point", "A misleading distraction", "A factual error", "A logical conclusion"], ans: 1 },
      { q: "Choose the correct subjunctive: 'The board insisted that he ___ the report.'", opts: ["submits", "submitted", "submit", "had submitted"], ans: 2 },
      { q: "What does 'sycophant' mean?", opts: ["A loud person", "A flatterer who seeks favour", "A music lover", "An honest critic"], ans: 1 }
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
    titolo: "Preparazione IELTS / Cambridge",
    domande: [
      { q: "In the IELTS Writing Task 2, you must write at least ___ words.", opts: ["150", "200", "250", "300"], ans: 2 },
      { q: "What does 'paraphrase' mean?", opts: ["Copy word for word", "Rewrite in different words", "Summarise briefly", "Translate literally"], ans: 1 },
      { q: "The Cambridge C1 Advanced exam tests language at which level?", opts: ["B2", "C1", "C2", "B1"], ans: 1 },
      { q: "In an IELTS essay, the thesis statement appears in:", opts: ["The conclusion", "The body paragraphs", "The introduction", "The summary"], ans: 2 },
      { q: "Which word is a synonym of 'significant'?", opts: ["Trivial", "Important", "Small", "Unclear"], ans: 1 },
      { q: "What is cohesion in academic writing?", opts: ["Vocabulary range", "The logical flow connecting sentences", "Grammar accuracy", "Paragraph length"], ans: 1 },
      { q: "IELTS Academic Writing Task 1 requires you to:", opts: ["Write a letter", "Describe visual data or a diagram", "Write a story", "Write an argument essay"], ans: 1 },
      { q: "Which transition word introduces a contrast?", opts: ["Furthermore", "However", "Therefore", "Additionally"], ans: 1 },
      { q: "A 'Band 9' score in IELTS represents:", opts: ["Basic user", "Competent user", "Expert user", "Proficient user"], ans: 2 },
      { q: "What does 'concise' mean in academic writing?", opts: ["Long and detailed", "Short and clear", "Informal and friendly", "Technical and complex"], ans: 1 }
    ]
  },
  {
    titolo: "Business English",
    domande: [
      { q: "Which phrase opens a formal business email correctly?", opts: ["Hey there!", "I am writing to enquire about...", "Yo, what's up?", "Just checking in..."], ans: 1 },
      { q: "What does 'B2B' stand for?", opts: ["Back to Basics", "Business to Business", "Buy to Build", "Board to Budget"], ans: 1 },
      { q: "A 'KPI' is:", opts: ["A type of contract", "Key Performance Indicator", "Knowledge and Procurement Index", "Key Policy Item"], ans: 1 },
      { q: "How do you politely decline a meeting invitation?", opts: ["No, I can't come.", "I'm afraid I won't be able to attend.", "I don't want to come.", "Not interested."], ans: 1 },
      { q: "Which phrase means 'to reach an agreement'?", opts: ["To fall through", "To come to terms", "To back down", "To give up"], ans: 1 },
      { q: "An 'agenda' in a business context is:", opts: ["A type of agreement", "A list of topics to be discussed", "A financial report", "A marketing strategy"], ans: 1 },
      { q: "What does 'ROI' stand for?", opts: ["Return on Investment", "Rate of Interest", "Risk of Insolvency", "Revenue over Income"], ans: 0 },
      { q: "Which is the correct formal closing for a business email?", opts: ["Cheers!", "Yours faithfully,", "See ya!", "Best (when the recipient's name is unknown)"], ans: 1 },
      { q: "To 'table' a motion in British English means:", opts: ["To reject it", "To postpone it", "To introduce it for discussion", "To approve it"], ans: 2 },
      { q: "'Let's touch base' means:", opts: ["Let's argue", "Let's briefly communicate", "Let's sign a contract", "Let's end the project"], ans: 1 }
    ]
  },
  {
    titolo: "Marina Militare",
    domande: [
      { q: "What is the 'bow' of a ship?", opts: ["The rear", "The front", "The left side", "The right side"], ans: 1 },
      { q: "The 'starboard' side of a ship is:", opts: ["The front", "The rear", "The left side (facing forward)", "The right side (facing forward)"], ans: 3 },
      { q: "What does 'SONAR' stand for?", opts: ["Sound Navigation and Ranging", "Submarine Operations Navigation and Radar", "Surface Operations Naval Asset Recognition", "Sonobuoy Operations Naval Acoustic Research"], ans: 0 },
      { q: "A 'frigate' is primarily used for:", opts: ["Carrying aircraft", "Escort and anti-submarine warfare", "Transporting troops", "Mine-sweeping"], ans: 1 },
      { q: "What is the 'keel' of a ship?", opts: ["The steering device", "The central structural beam at the bottom of the hull", "The propulsion system", "The bridge"], ans: 1 },
      { q: "NATO phonetic alphabet: what does 'Foxtrot' represent?", opts: ["E", "F", "G", "H"], ans: 1 },
      { q: "A 'periscope' is used on:", opts: ["Aircraft carriers", "Destroyers", "Submarines", "Frigates"], ans: 2 },
      { q: "What does 'port' mean in nautical terms?", opts: ["A harbour only", "The right side of a ship", "The left side of a ship", "The front of a ship"], ans: 2 },
      { q: "A 'destroyer' is designed for:", opts: ["Troop transport", "High-speed naval warfare and escort duties", "Supply missions", "Submarine rescue"], ans: 1 },
      { q: "What is the 'bridge' on a naval vessel?", opts: ["The engine room", "The command and navigation centre", "The sleeping quarters", "The weapon storage area"], ans: 1 }
    ]
  }
]

// ─── DATI NAVI ───────────────────────────────────────────────────────────────
const datiNavi = {
  carrier: {
    titolo: "Aircraft Carrier (Portaerei)",
    img: "https://images.unsplash.com/photo-1575540327024-2c69d48e34bc?w=800&q=80",
    desc: "The aircraft carrier is the largest warship class, serving as a mobile airbase.",
    descIt: "La portaerei è la più grande classe di navi da guerra, funziona come una base aerea mobile.",
    componenti: [
      { en: "Flight deck", it: "Piano di volo" }, { en: "Island superstructure", it: "Superstruttura isola" },
      { en: "Catapult", it: "Catapulta di lancio" }, { en: "Arresting wire", it: "Cavo d'arresto" },
      { en: "Hangar deck", it: "Ponte hangar" }, { en: "Elevator", it: "Elevatore aerei" }
    ]
  },
  destroyer: {
    titolo: "Destroyer (Cacciatorpediniere)",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    desc: "Fast and maneuverable warship designed for escort and attack missions.",
    descIt: "Nave da guerra veloce e manovrabile progettata per missioni di scorta e attacco.",
    componenti: [
      { en: "Hull", it: "Scafo" }, { en: "Bow", it: "Prua" },
      { en: "Stern", it: "Poppa" }, { en: "Gun turret", it: "Torretta cannone" },
      { en: "Torpedo tubes", it: "Tubi lanciasiluri" }, { en: "Sonar dome", it: "Cupola sonar" }
    ]
  },
  submarine: {
    titolo: "Submarine (Sottomarino)",
    img: "https://images.unsplash.com/photo-1559567586-cef58d86e77b?w=800&q=80",
    desc: "An underwater vessel capable of stealth missions and torpedo attacks.",
    descIt: "Un'imbarcazione subacquea capace di missioni furtive e attacchi con siluri.",
    componenti: [
      { en: "Conning tower", it: "Torre di comando" }, { en: "Periscope", it: "Periscopio" },
      { en: "Propeller", it: "Elica" }, { en: "Ballast tanks", it: "Serbatoi di zavorra" },
      { en: "Torpedo tubes", it: "Tubi lanciasiluri" }, { en: "Pressure hull", it: "Scafo a pressione" }
    ]
  },
  frigate: {
    titolo: "Frigate (Fregata)",
    img: "https://images.unsplash.com/photo-1494952856671-0d36e5c3c7a0?w=800&q=80",
    desc: "A medium-sized warship used for escort, patrol and anti-submarine duties.",
    descIt: "Una nave da guerra di medie dimensioni usata per scorta, pattugliamento e compiti anti-sottomarino.",
    componenti: [
      { en: "Bridge", it: "Plancia di comando" }, { en: "Mast", it: "Albero" },
      { en: "Helipad", it: "Piazzola elicotteri" }, { en: "VLS system", it: "Sistema VLS" },
      { en: "Sonar", it: "Sonar" }, { en: "Radar dome", it: "Cupola radar" }
    ]
  },
  cruiser: {
    titolo: "Cruiser (Incrociatore)",
    img: "https://images.unsplash.com/photo-1544161343-c6a2d42f7e1d?w=800&q=80",
    desc: "A large, heavily armed warship with long-range combat capabilities.",
    descIt: "Una nave da guerra grande e pesantemente armata con capacità di combattimento a lungo raggio.",
    componenti: [
      { en: "Main battery", it: "Batteria principale" }, { en: "Gun turret", it: "Torretta cannone" },
      { en: "Armored belt", it: "Cintura corazzata" }, { en: "Combat mast", it: "Albero di combattimento" },
      { en: "Missile launchers", it: "Lanciamissili" }, { en: "Aft deck", it: "Ponte posteriore" }
    ]
  },
  trainingship: {
    titolo: "Training Ship (Nave Scuola)",
    img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80",
    desc: "A vessel designed for training naval cadets in seamanship and navigation.",
    descIt: "Un'imbarcazione progettata per addestrare i cadetti navali nelle tecniche di navigazione.",
    componenti: [
      { en: "Classroom deck", it: "Ponte aula" }, { en: "Training rigging", it: "Attrezzatura velica" },
      { en: "Practice bridge", it: "Plancia didattica" }, { en: "Chart room", it: "Sala carteggio" },
      { en: "Navigation lab", it: "Lab. navigazione" }, { en: "Lecture hall", it: "Aula conferenze" }
    ]
  }
}

// ─── DATI COMPONENTI NAVALI ───────────────────────────────────────────────────
const compData = {
  nav: {
    titolo: "🧭 Navigation Systems",
    esercizi: [
      { q: "What does GPS stand for?", opts: ["Global Patrol Sensor", "Global Positioning System", "Geographic Pointing Signal", "General Patrol Service"], ans: 1 },
      { q: "What is ECDIS used for?", opts: ["Detecting submarines", "Measuring wind speed", "Displaying the ship's position on electronic charts", "Communicating with satellites"], ans: 2 },
      { q: "AIS stands for Automatic Identification System.", opts: ["True", "False"], ans: 0 },
      { q: "Which instrument shows the ship's magnetic heading?", opts: ["Radar", "ECDIS", "Compass", "Sonar"], ans: 2 },
      { q: "Radar uses sound waves to detect other vessels.", opts: ["True", "False"], ans: 1 },
      { q: "What does AIS automatically transmit?", opts: ["Engine temperature", "Ship position, speed and identity", "Fuel levels", "Water depth"], ans: 1 },
      { q: "GPS requires at least ___ satellites to calculate an accurate position.", opts: ["2", "3", "4", "8"], ans: 2 },
      { q: "ECDIS can replace traditional paper charts.", opts: ["True", "False"], ans: 0 },
      { q: "Which system warns of other vessels in poor visibility?", opts: ["Sonar", "GPS", "Radar", "IFF"], ans: 2 },
      { q: "The compass rose on a nautical chart shows:", opts: ["Depth contours", "Magnetic and true north directions", "Shipping lanes", "Weather patterns"], ans: 1 }
    ]
  },
  engine: {
    titolo: "⚡ Engine Room",
    esercizi: [
      { q: "What is the main function of the bilge pump?", opts: ["To fuel the engine", "To remove water from the lowest part of the hull", "To cool the boiler", "To generate electricity"], ans: 1 },
      { q: "The generator provides electrical power to the ship.", opts: ["True", "False"], ans: 0 },
      { q: "What is the boiler primarily used for?", opts: ["Storing fuel", "Heating water to produce steam for propulsion", "Cooling the engine", "Filtering seawater"], ans: 1 },
      { q: "Marine diesel is stored in the:", opts: ["Bilge", "Boiler", "Fuel tank", "Ballast tank"], ans: 2 },
      { q: "The main engine directly propels the ship through the water.", opts: ["True", "False"], ans: 0 },
      { q: "What happens if the bilge pump fails?", opts: ["The ship loses communication", "Water accumulates in the hull, risking sinking", "The engine overheats", "Navigation instruments fail"], ans: 1 },
      { q: "A generator converts ___ energy into electrical energy.", opts: ["Solar", "Nuclear", "Mechanical", "Chemical"], ans: 2 },
      { q: "The main engine on naval vessels is typically powered by:", opts: ["Petrol", "Diesel or gas turbine", "Coal", "Wind"], ans: 1 },
      { q: "Ballast tanks are used to adjust the ship's:", opts: ["Speed", "Communication", "Stability and draft", "Engine output"], ans: 2 },
      { q: "The engine room is typically located at the stern of the ship.", opts: ["True", "False"], ans: 0 }
    ]
  },
  comms: {
    titolo: "📡 Communications",
    esercizi: [
      { q: "VHF stands for:", opts: ["Very Heavy Force", "Very High Frequency", "Vessel High Fidelity", "Variable High Frequency"], ans: 1 },
      { q: "A signal lamp uses light to transmit Morse code.", opts: ["True", "False"], ans: 0 },
      { q: "IFF stands for:", opts: ["Integrated Fire and Flame", "International Fleet Force", "Identification Friend or Foe", "Internal Frequency Filter"], ans: 2 },
      { q: "Which device allows communication from any location on Earth?", opts: ["VHF radio", "Signal lamp", "Satellite phone", "Intercom"], ans: 2 },
      { q: "VHF radio is mainly used for long-range intercontinental communication.", opts: ["True", "False"], ans: 1 },
      { q: "Channel 16 on VHF is reserved for:", opts: ["Weather broadcasts", "Distress and calling", "Port traffic", "Military use only"], ans: 1 },
      { q: "The IFF system is mainly used to:", opts: ["Navigate in fog", "Distinguish allied from enemy vessels", "Measure sea depth", "Control engine speed"], ans: 1 },
      { q: "A satellite phone works via orbiting satellites.", opts: ["True", "False"], ans: 0 },
      { q: "GMDSS stands for Global Maritime Distress and Safety ___.", opts: ["Station", "System", "Service", "Standard"], ans: 1 },
      { q: "Which signal indicates a ship in distress?", opts: ["Three short horn blasts", "Mayday repeated three times on VHF", "One long horn blast", "Raising a blue flag"], ans: 1 }
    ]
  },
  safety: {
    titolo: "🛟 Safety Equipment",
    esercizi: [
      { q: "What does a life jacket do?", opts: ["Keeps the ship afloat", "Helps a person float face-up in water", "Signals the ship's position", "Fights fires"], ans: 1 },
      { q: "A life raft can support survivors if the ship sinks.", opts: ["True", "False"], ans: 0 },
      { q: "Which fire extinguisher is safe for electrical fires?", opts: ["Water extinguisher", "Foam extinguisher", "CO₂ extinguisher", "Sand bucket"], ans: 2 },
      { q: "An EPIRB beacon sends a distress signal to:", opts: ["Nearby ships only", "The engine room", "Search and rescue satellites", "Coast guard radio"], ans: 2 },
      { q: "Damage control includes actions to prevent a ship from sinking.", opts: ["True", "False"], ans: 0 },
      { q: "'Man overboard' requires immediate:", opts: ["Engine shutdown", "Recovery and rescue procedures", "Radio silence", "Course continuation"], ans: 1 },
      { q: "Fire extinguishers on ships must be inspected regularly.", opts: ["True", "False"], ans: 0 },
      { q: "A muster station is:", opts: ["A weapons storage area", "The assigned gathering point in an emergency", "The engine control room", "The navigation bridge"], ans: 1 },
      { q: "SOLAS stands for Safety Of Life At ___.", opts: ["Shore", "Sea", "Station", "Ship"], ans: 1 },
      { q: "Immersion suits protect against hypothermia in cold water.", opts: ["True", "False"], ans: 0 }
    ]
  }
}

// ─── POOL FLASHCARD ───────────────────────────────────────────────────────────
const fcPool = [
  { en: "Starboard", it: "Dritta", desc: "Lato destro della nave (guardando la prua)" },
  { en: "Port", it: "Sinistra (Babordo)", desc: "Lato sinistro della nave" },
  { en: "Bow", it: "Prua", desc: "Parte anteriore della nave" },
  { en: "Stern", it: "Poppa", desc: "Parte posteriore della nave" },
  { en: "Helm", it: "Timone", desc: "Dispositivo di sterzo della nave" },
  { en: "Anchor", it: "Ancora", desc: "Dispositivo per ancorare la nave" },
  { en: "Bilge", it: "Sentina", desc: "Parte più bassa dello scafo" },
  { en: "Keel", it: "Chiglia", desc: "Struttura portante centrale dello scafo" },
  { en: "Bridge", it: "Plancia di comando", desc: "Centro di controllo della nave" },
  { en: "Mast", it: "Albero", desc: "Struttura verticale per sensori e segnali" },
  { en: "Helipad", it: "Piazzola elicotteri", desc: "Piattaforma di atterraggio per elicotteri" },
  { en: "Hull", it: "Scafo", desc: "Struttura esterna impermeabile della nave" },
  { en: "Bulkhead", it: "Paratia", desc: "Divisorio interno per compartimenti stagni" },
  { en: "Conning tower", it: "Torre di comando", desc: "Torretta di controllo del sottomarino" },
  { en: "Propeller", it: "Elica", desc: "Dispositivo di propulsione rotante" },
  { en: "Periscope", it: "Periscopio", desc: "Ottica per osservare in superficie" },
  { en: "Deck", it: "Ponte", desc: "Piano orizzontale praticabile della nave" },
  { en: "Radar", it: "Radar", desc: "Sistema di rilevamento via onde radio" },
  { en: "Sonar", it: "Sonar", desc: "Rilevamento subacqueo via onde sonore" },
  { en: "Torpedo", it: "Siluro", desc: "Arma subacquea autopropulsa" },
  { en: "Hatch", it: "Boccaporto", desc: "Apertura con coperchio sul ponte" },
  { en: "Gangway", it: "Passerella", desc: "Collegamento mobile a terra" }
]

function pescaFlashcard(escludi = []) {
  const disponibili = fcPool.filter(t => !escludi.includes(t.en))
  const base = disponibili.length >= 6 ? disponibili : fcPool
  return [...base].sort(() => Math.random() - 0.5).slice(0, 6)
}

// ─── COMPONENTI ────────────────────────────────────────────────────────────────

function Accordion({ domanda, risposta }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`accordion${open ? ' open' : ''}`}>
      <button className="acc-header" onClick={() => setOpen(!open)}>
        <span>{domanda}</span>
        <span className="acc-chevron">▼</span>
      </button>
      <div className="acc-body">{risposta}</div>
    </div>
  )
}

function SezioneCorsi({ onNaviga }) {
  return (
    <section id="corsi" className="page active">
      <h2 className="section-title">Tutti i Corsi</h2>
      <p className="section-sub">Scegli il percorso più adatto alle tue esigenze</p>
      <div className="divider"></div>

      <h3 style={{ color: 'var(--primary)', fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>🇬🇧 Inglese Generale</h3>
      <div className="cards-grid">
        {[
          { icon: '🌱', titolo: 'Inglese Base (A1–A2)', desc: 'Alfabeto, numeri, saluti, presentazioni, verbi essenziali, articoli, presente semplice.', durata: '8 SETTIMANE', quiz: 0 },
          { icon: '📗', titolo: 'Inglese Pre-Intermedio (A2–B1)', desc: 'Passato, futuro, condizionale, frasi composte e conversazioni pratiche.', durata: '10 SETTIMANE', quiz: 1 },
          { icon: '📘', titolo: 'Inglese Intermedio (B1–B2)', desc: 'Grammatica avanzata, reading comprehension, scrittura formale e conversazione fluente.', durata: '12 SETTIMANE', quiz: 2 },
          { icon: '📙', titolo: 'Inglese Avanzato (C1–C2)', desc: 'Letteratura, stile accademico, dibattiti, idiomi, pronunce regionali.', durata: '14 SETTIMANE', quiz: 3 },
          { icon: '✈️', titolo: 'Inglese per Viaggi', desc: 'Aeroporti, alberghi, ristoranti, emergenze, acquisti e orientamento.', durata: '4 SETTIMANE', quiz: 4 },
          { icon: '🎓', titolo: 'Preparazione IELTS / Cambridge', desc: 'Simulazioni d\'esame, writing task, reading avanzato, speaking test.', durata: '12 SETTIMANE', quiz: 5 }
        ].map((c, i) => (
          <div key={i} className="card cat-card">
            <div className="card-icon">{c.icon}</div>
            <h3>{c.titolo}</h3>
            <p>{c.desc}</p>
            <span className="badge">{c.durata}</span><br />
            <button className="btn" style={{ marginTop: 12 }} onClick={() => onNaviga('quiz', c.quiz)}>Vai agli esercizi →</button>
          </div>
        ))}
      </div>

      <h3 style={{ color: 'var(--primary)', fontWeight: 700, margin: '2rem 0 0.75rem' }}>💼 Business & Professionale</h3>
      <div className="cards-grid">
        {[
          { icon: '💼', titolo: 'Business English', desc: 'Email aziendali, riunioni, presentazioni in inglese, negoziazioni internazionali.', durata: '8 SETTIMANE' },
          { icon: '🤝', titolo: 'Inglese per Negoziazioni', desc: 'Tecniche di negoziazione in inglese, gestione conflitti, contratti internazionali.', durata: '6 SETTIMANE' },
          { icon: '📊', titolo: 'Inglese per Presentazioni', desc: 'Struttura di una presentazione efficace, vocabulary, storytelling e Q&A in inglese.', durata: '4 SETTIMANE' }
        ].map((c, i) => (
          <div key={i} className="card cat-card">
            <div className="card-icon">{c.icon}</div>
            <h3>{c.titolo}</h3>
            <p>{c.desc}</p>
            <span className="badge">{c.durata}</span><br />
            <button className="btn" style={{ marginTop: 12 }} onClick={() => onNaviga('quiz', 6)}>Vai agli esercizi →</button>
          </div>
        ))}
      </div>

      <h3 style={{ color: 'var(--primary)', fontWeight: 700, margin: '2rem 0 0.75rem' }}>⚓ Marina Militare</h3>
      <div className="cards-grid">
        <div className="card card-naval cat-card">
          <div className="card-icon">⚓</div>
          <h3>Inglese Navale – Marina Militare</h3>
          <p>Terminologia delle navi da guerra, sottomarini, corvette, fregate e componenti navali NATO.</p>
          <span className="badge badge-blue">TECNICO – 16 SETTIMANE</span><br />
          <button className="btn" style={{ marginTop: 12 }} onClick={() => onNaviga('marina')}>Vai alla sezione Marina →</button>
        </div>
      </div>

      <h3 className="section-title faq-title">Domande Frequenti</h3>
      <div className="divider"></div>
      <Accordion domanda="Come scelgo il corso giusto?" risposta="Inizia con un quiz di livello nella sezione Quiz. Ti aiuteremo a individuare il tuo livello e il percorso più adatto." />
      <Accordion domanda="I corsi sono online o in presenza?" risposta="Offriamo entrambe le modalità. Alcuni corsi specialistici sono disponibili anche in presenza presso sedi convenzionate." />
      <Accordion domanda="Ricevo un certificato al termine?" risposta="Sì. Al termine di ogni corso ricevi un attestato di completamento." />
      <Accordion domanda="Il corso Marina è aperto solo ai militari?" risposta="No. È aperto anche a civili, appassionati di nautica, tecnici portuali e professionisti del settore marittimo." />
    </section>
  )
}

function ModalNave({ nave, onClose }) {
  const dati = datiNavi[nave]
  if (!dati) return null
  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚓ {dati.titolo}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <img src={dati.img} alt={dati.titolo} style={{ maxHeight: 320, width: '100%', objectFit: 'cover' }} />
          <h3>Description</h3>
          <p>{dati.desc}</p>
          <h3>Descrizione</h3>
          <p>{dati.descIt}</p>
          <h3 style={{ marginTop: 20 }}>Componenti Principali</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid var(--secondary)', padding: '8px 12px', color: 'var(--primary)' }}>English</th>
                <th style={{ borderBottom: '2px solid var(--secondary)', padding: '8px 12px', color: 'var(--primary)' }}>Italiano</th>
              </tr>
            </thead>
            <tbody>
              {dati.componenti.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{c.en}</td>
                  <td style={{ padding: '8px 12px', color: '#666' }}>{c.it}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PannelloComp({ cat, onClose }) {
  const dati = compData[cat]
  const [domande] = useState(() => [...dati.esercizi].sort(() => Math.random() - 0.5))
  const [risposte, setRisposte] = useState({})
  const [punteggio, setPunteggio] = useState(0)

  const rispondi = (idx, scelta) => {
    if (risposte[idx] !== undefined) return
    const corretto = scelta === domande[idx].ans
    setRisposte(prev => ({ ...prev, [idx]: scelta }))
    if (corretto) setPunteggio(p => p + 1)
  }

  const totale = domande.length
  const risposti = Object.keys(risposte).length
  const progresso = risposti / totale

  return (
    <div className="comp-exer-panel">
      <div className="ce-header">
        <span className="ce-title">{dati.titolo}</span>
        <span className="ce-score">⭐ {punteggio} / {totale}</span>
        <button className="ce-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="ce-progress">
        <div className="ce-progress-fill" style={{ width: `${progresso * 100}%` }}></div>
      </div>
      {domande.map((es, i) => {
        const risposta = risposte[i]
        const haRisposto = risposta !== undefined
        return (
          <div key={i} className="ce-question">
            <div className="ce-qnum">Domanda {i + 1} · {es.opts.length === 2 ? 'Vero / Falso' : 'Scelta multipla'}</div>
            <div className="ce-qtext">{es.q}</div>
            <div className="ce-opts">
              {es.opts.map((o, j) => {
                let cls = 'ce-opt'
                if (haRisposto) {
                  if (j === es.ans) cls += ' ce-correct'
                  else if (j === risposta && risposta !== es.ans) cls += ' ce-wrong'
                }
                return (
                  <button key={j} className={cls} disabled={haRisposto} onClick={() => rispondi(i, j)}>{o}</button>
                )
              })}
            </div>
            {haRisposto && (
              <div className={`ce-feedback ${risposta === es.ans ? 'ok' : 'err'}`}>
                {risposta === es.ans ? '✅ Corretto!' : `❌ Risposta: ${es.opts[es.ans]}`}
              </div>
            )}
          </div>
        )
      })}
      {risposti === totale && (
        <div className="ce-all-done">
          {punteggio === totale ? '🏆 Perfetto!' : punteggio >= totale * 0.7 ? '👍 Ottimo!' : '📚 Continua a studiare!'}{' '}
          Hai risposto correttamente a <strong>{punteggio}/{totale}</strong> domande.
        </div>
      )}
    </div>
  )
}

function Flashcard({ termine, enToIt, onFlip }) {
  const [flipped, setFlipped] = useState(false)
  const handleClick = () => {
    const nuovoStato = !flipped
    setFlipped(nuovoStato)
    if (nuovoStato) onFlip()
  }
  return (
    <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={handleClick}>
      <div className="flashcard-face flashcard-front">
        <span className="fc-term">{enToIt ? termine.en : termine.it}</span>
        <span className="fc-hint">Clicca per tradurre</span>
      </div>
      <div className="flashcard-face flashcard-back">
        <span className="fc-it">{enToIt ? termine.it : termine.en}</span>
        <span className="fc-desc">{termine.desc}</span>
      </div>
    </div>
  )
}

function EserciziFlashcard() {
  const [termini, setTermini] = useState(() => pescaFlashcard())
  const [ultimi, setUltimi] = useState([])
  const [enToIt, setEnToIt] = useState(true)
  const [flippedCount, setFlippedCount] = useState(0)

  const handleFlip = useCallback(() => {
    setFlippedCount(c => {
      const nuovo = c + 1
      if (nuovo === 6) {
        setTimeout(() => {
          if (enToIt) {
            setEnToIt(false)
            setFlippedCount(0)
          } else {
            const nuovi = pescaFlashcard(ultimi)
            setTermini(nuovi)
            setUltimi(nuovi.map(t => t.en))
            setEnToIt(true)
            setFlippedCount(0)
          }
        }, 5000)
      }
      return nuovo
    })
  }, [enToIt, ultimi])

  const reset = () => {
    const nuovi = pescaFlashcard()
    setTermini(nuovi)
    setUltimi(nuovi.map(t => t.en))
    setEnToIt(true)
    setFlippedCount(0)
  }

  return (
    <div>
      <p className="flashcard-score">Clicca ogni card per abbinare il termine inglese a quello italiano</p>
      <p className="fc-serie-badge">{enToIt ? 'Inglese - Italiano' : 'Italiano - Inglese'}</p>
      <div className="flashcard-grid">
        {termini.map((t, i) => <Flashcard key={`${t.en}-${enToIt}`} termine={t} enToIt={enToIt} onFlip={handleFlip} />)}
      </div>
      <button className="fc-reset-btn" onClick={reset}>↺ Nuove card</button>
    </div>
  )
}

function FillBlank() {
  const domande = [
    { frase: 'The ___ is used to steer the ship.', parola: 'HELM', opzioni: ['RADAR', 'HELM', 'ANCHOR', 'MAST'] },
    { frase: 'A ___ radio is used for short-range communications at sea.', parola: 'VHF', opzioni: ['GPS', 'AIS', 'VHF', 'ECDIS'] },
    { frase: 'The ___ deck is where aircraft take off on an aircraft carrier.', parola: 'FLIGHT', opzioni: ['UPPER', 'MAIN', 'BRIDGE', 'FLIGHT'] },
    { frase: 'The ship drops its ___ to stay in position.', parola: 'ANCHOR', opzioni: ['ANCHOR', 'KEEL', 'PROPELLER', 'MAST'] },
    { frase: 'The ___ tower on a submarine allows observation of the surface.', parola: 'CONNING', opzioni: ['MAIN', 'RADAR', 'CONNING', 'CONTROL'] },
    { frase: 'A life ___ is mandatory safety equipment on all vessels.', parola: 'JACKET', opzioni: ['RING', 'ROPE', 'RAFT', 'JACKET'] }
  ]
  const [risposte, setRisposte] = useState({})
  const [punteggio, setPunteggio] = useState(0)
  const [reset, setReset] = useState(0)

  const rispondi = (i, val) => {
    if (risposte[i]) return
    const ok = val === domande[i].parola
    setRisposte(prev => ({ ...prev, [i]: val }))
    if (ok) setPunteggio(p => p + 1)
  }

  const handleReset = () => {
    setRisposte({})
    setPunteggio(0)
    setReset(r => r + 1)
  }

  return (
    <div key={reset}>
      <p className="blank-score">Punteggio: <strong>{punteggio} / 6</strong></p>
      {domande.map((d, i) => {
        const risposta = risposte[i]
        const parti = d.frase.split('___')
        return (
          <div key={i} className="blank-question">
            <div className="blank-sentence">
              {parti[0]}<span className="blank-slot">{risposta || '___'}</span>{parti[1]}
            </div>
            <div className="blank-options">
              {d.opzioni.map((o, j) => {
                let cls = 'blank-opt'
                if (risposta) {
                  if (o === d.parola) cls += ' correct'
                  else if (o === risposta) cls += ' wrong'
                }
                return <button key={j} className={cls} disabled={!!risposta} onClick={() => rispondi(i, o)}>{o}</button>
              })}
            </div>
            {risposta && (
              <div className={`blank-feedback ${risposta === d.parola ? 'ok' : 'err'}`}>
                {risposta === d.parola ? '✅ Corretto!' : `❌ Sbagliato. La risposta è: ${d.parola}`}
              </div>
            )}
          </div>
        )
      })}
      <button className="blank-reset-btn" onClick={handleReset}>↺ Ricomincia</button>
    </div>
  )
}

function Matching() {
  const coppie = [
    { en: "Flight deck", it: "Piano di volo" }, { en: "Periscope", it: "Periscopio" },
    { en: "Hull", it: "Scafo" }, { en: "Bridge", it: "Plancia di comando" },
    { en: "Helipad", it: "Piazzola elicotteri" }, { en: "Stern", it: "Poppa" }
  ]
  const [sinistri] = useState(() => [...coppie].sort(() => Math.random() - 0.5))
  const [destri, setDestri] = useState(() => [...coppie].sort(() => Math.random() - 0.5))
  const [selSx, setSelSx] = useState(null)
  const [selDx, setSelDx] = useState(null)
  const [abbinati, setAbbinati] = useState([])
  const [errori, setErrori] = useState([])
  const [reset, setReset] = useState(0)

  useEffect(() => {
    if (!selSx || !selDx) return
    const ok = selSx.en === selDx.en
    if (ok) {
      setAbbinati(prev => [...prev, selSx.en])
      setSelSx(null); setSelDx(null)
    } else {
      setErrori([selSx.en, selDx.en])
      setTimeout(() => { setErrori([]); setSelSx(null); setSelDx(null) }, 600)
    }
  }, [selSx, selDx])

  const abbinatiTutti = abbinati.length === coppie.length

  const handleReset = () => {
    setDestri([...coppie].sort(() => Math.random() - 0.5))
    setSelSx(null); setSelDx(null); setAbbinati([]); setErrori([])
    setReset(r => r + 1)
  }

  return (
    <div key={reset}>
      <p className="match-score">
        {abbinatiTutti ? '🎉 Perfetto! Hai abbinato tutte le coppie!' : `Abbinati: ${abbinati.length} / ${coppie.length} — Clicca un termine, poi la sua traduzione`}
      </p>
      <div className="matching-game">
        <div className="match-col">
          <h4>🇬🇧 Termine Inglese</h4>
          {sinistri.map(c => {
            const isAbbinato = abbinati.includes(c.en)
            const isSelezionato = selSx?.en === c.en
            const isErrore = errori.includes(c.en)
            let cls = 'match-item'
            if (isAbbinato) cls += ' matched-ok'
            else if (isErrore) cls += ' matched-err'
            else if (isSelezionato) cls += ' selected'
            return (
              <div key={c.en} className={cls} onClick={() => !isAbbinato && !isErrore && setSelSx(c)}>{c.en}</div>
            )
          })}
        </div>
        <div className="match-col">
          <h4>🇮🇹 Traduzione Italiana</h4>
          {destri.map(c => {
            const isAbbinato = abbinati.includes(c.en)
            const isSelezionato = selDx?.en === c.en
            const isErrore = errori.includes(c.en)
            let cls = 'match-item'
            if (isAbbinato) cls += ' matched-ok'
            else if (isErrore) cls += ' matched-err'
            else if (isSelezionato) cls += ' selected'
            return (
              <div key={c.en} className={cls} onClick={() => !isAbbinato && !isErrore && setSelDx(c)}>{c.it}</div>
            )
          })}
        </div>
      </div>
      <button className="match-reset-btn" onClick={handleReset}>↺ Nuova partita</button>
    </div>
  )
}

function SezioneMarina({ onNaviga }) {
  const [modalNave, setModalNave] = useState(null)
  const [compAttivo, setCompAttivo] = useState(null)
  const [esTab, setEsTab] = useState('flashcard')
  const navi = [
    { key: 'carrier', emoji: '🛸', en: 'Aircraft Carrier', it: 'Portaerei', comps: [['Flight deck', 'Piano di volo continuo.'], ['Catapult', 'Sistema di lancio aerei.'], ['Island', 'Superstruttura centrale.']] },
    { key: 'destroyer', emoji: '🚢', en: 'Destroyer', it: 'Cacciatorpediniere', comps: [['Hull', 'Scafo principale.'], ['Bow', 'Prua anteriore.'], ['Stern', 'Poppa posteriore.']] },
    { key: 'submarine', emoji: '🤿', en: 'Submarine', it: 'Sottomarino', comps: [['Conning tower', 'Torre di comando.'], ['Periscope', 'Dispositivo ottico elevabile.'], ['Propeller', 'Elica motrice.']] },
    { key: 'frigate', emoji: '⚓', en: 'Frigate', it: 'Fregata', comps: [['Bridge', 'Plancia di comando.'], ['Mast', 'Albero con sensori.'], ['Helipad', 'Piazzola elicotteri.']] },
    { key: 'cruiser', emoji: '🎖️', en: 'Cruiser', it: 'Incrociatore', comps: [['Main battery', 'Batteria principale cannoni.'], ['Gun turret', 'Torretta girevole armata.'], ['Armored belt', 'Corazza di protezione.']] },
    { key: 'trainingship', emoji: '🎓', en: 'Training Ship', it: 'Nave Scuola', comps: [['Classroom deck', 'Ponte aula didattico.'], ['Training rigging', 'Attrezzatura velica.'], ['Practice bridge', 'Plancia didattica.']] }
  ]
  const componenti = [
    { key: 'nav', icon: '🧭', titolo: 'Navigation Systems', desc: 'GPS, Compass, ECDIS, Radar, AIS.' },
    { key: 'engine', icon: '⚡', titolo: 'Engine Room', desc: 'Main engine, Boiler, Generator, Bilge pump, Fuel tank.' },
    { key: 'comms', icon: '📡', titolo: 'Communications', desc: 'VHF radio, Satellite phone, Signal lamp, IFF system.' },
    { key: 'safety', icon: '🛟', titolo: 'Safety Equipment', desc: 'Life jacket, Life raft, Fire extinguisher, Emergency beacon, Damage control.' }
  ]

  return (
    <section id="marina" className="page active">
      <div className="naval-hero">
        <div className="naval-tag">⚓ INGLESE TECNICO – MARINA MILITARE</div>
        <h2>Le Navi e i Componenti Navali</h2>
        <p>Impara la terminologia inglese delle principali imbarcazioni militari e dei loro componenti. Ogni scheda è bilingue.</p>
      </div>

      <h2 className="section-title">Tipologie di Navi</h2>
      <div className="divider"></div>
      <div className="ship-grid">
        {navi.map(n => (
          <div key={n.key} className="ship-card">
            <div className="ship-header">
              <span className="ship-emoji">{n.emoji}</span>
              <div><h3>{n.en}</h3><span>{n.it}</span></div>
            </div>
            <div className="ship-body">
              <ul className="comp-list">
                {n.comps.map(([en, it], i) => (
                  <li key={i}><span className="comp-en">{en}</span><span className="comp-it">{it}</span></li>
                ))}
              </ul>
              <button className="ship-icon-btn" onClick={() => setModalNave(n.key)} title={`Visualizza ${n.it}`}>⛵</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Componenti Comuni</h2>
      <div className="divider"></div>
      <div className="cards-grid">
        {componenti.map(c => (
          <div key={c.key} className={`card comp-card${compAttivo === c.key ? ' active' : ''}`} onClick={() => setCompAttivo(compAttivo === c.key ? null : c.key)}>
            <div className="card-icon">{c.icon}</div>
            <h3>{c.titolo}</h3>
            <p>{c.desc}</p>
            <span className="comp-card-hint">▸ Clicca per gli esercizi</span>
          </div>
        ))}
      </div>
      {compAttivo && <PannelloComp key={compAttivo} cat={compAttivo} onClose={() => setCompAttivo(null)} />}

      <h2 className="section-title" style={{ marginTop: 48 }}>Esercizi Interattivi</h2>
      <p className="section-sub">Metti alla prova il tuo vocabolario navale con tre tipi di esercizi</p>
      <div className="divider"></div>

      <div className="es-tab-selector">
        {[['flashcard', '🃏 Flashcard'], ['fillblank', '✍️ Completa la Frase'], ['matching', '🔗 Abbinamento']].map(([k, l]) => (
          <button key={k} className={`es-tab${esTab === k ? ' active' : ''}`} onClick={() => setEsTab(k)}>{l}</button>
        ))}
      </div>

      {esTab === 'flashcard' && <EserciziFlashcard />}
      {esTab === 'fillblank' && <FillBlank />}
      {esTab === 'matching' && <Matching />}

      <div className="center-block" style={{ marginTop: 48 }}>
        <button className="btn-primary" onClick={() => onNaviga('quiz', 7)}>⚓ Metti alla prova le tue conoscenze navali →</button>
      </div>

      {modalNave && <ModalNave nave={modalNave} onClose={() => setModalNave(null)} />}
    </section>
  )
}

function SezioneQuiz({ quizIniziale }) {
  const [quizIdx, setQuizIdx] = useState(quizIniziale ?? 2)
  const [domandaIdx, setDomandaIdx] = useState(0)
  const [scelto, setScelto] = useState(null)
  const [punteggio, setPunteggio] = useState(0)
  const [sbagliati, setSbagliati] = useState(0)
  const [fine, setFine] = useState(false)
  const [mostraFeedback, setMostraFeedback] = useState(false)
  const [nome] = useState(() => typeof window !== 'undefined' ? (localStorage.getItem('ea_utente') || 'Studente') : 'Studente')

  const quiz = datiQuiz[quizIdx]
  const domanda = quiz.domande[domandaIdx]
  const totaleDomande = quiz.domande.length

  const scegli = (i) => {
    if (scelto !== null) return
    setScelto(i)
    setMostraFeedback(true)
    if (i === domanda.ans) setPunteggio(p => p + 1)
    else setSbagliati(s => s + 1)
  }

  const prossima = () => {
    setMostraFeedback(false)
    setScelto(null)
    if (domandaIdx + 1 >= totaleDomande) setFine(true)
    else setDomandaIdx(d => d + 1)
  }

  const ricomincia = (idx) => {
    setQuizIdx(idx ?? quizIdx)
    setDomandaIdx(0)
    setScelto(null)
    setPunteggio(0)
    setSbagliati(0)
    setFine(false)
    setMostraFeedback(false)
  }

  const percentuale = Math.round((punteggio / totaleDomande) * 100)
  const voto = percentuale >= 90 ? '🏆 Eccellente!' : percentuale >= 70 ? '👍 Buono!' : percentuale >= 50 ? '📚 Sufficiente' : '💪 Da rivedere'

  const categorie = [
    { emoji: '🌱', label: 'Base\nA1–A2' }, { emoji: '📗', label: 'Pre-Int\nA2–B1' },
    { emoji: '📘', label: 'Inter.\nB1–B2' }, { emoji: '📙', label: 'Avanzato\nC1–C2' },
    { emoji: '✈️', label: 'Viaggi' }, { emoji: '🎓', label: 'IELTS' },
    { emoji: '💼', label: 'Business' }, { emoji: '⚓', label: 'Marina' }
  ]

  return (
    <section id="quiz" className="page active">
      <div className="quiz-wrapper">
        <p className="quiz-greeting">Ciao, <strong>{nome}</strong>! Scegli la categoria:</p>
        <div className="quiz-selector">
          {categorie.map((c, i) => (
            <button key={i} className="quiz-btn-sel" onClick={() => ricomincia(i)}>
              <span className="qi">{c.emoji}</span>
              {c.label.split('\n').map((l, j) => <span key={j} style={{ display: 'block', fontSize: j > 0 ? '0.8em' : undefined }}>{l}</span>)}
            </button>
          ))}
        </div>

        {!fine ? (
          <div className="quiz-container">
            <div className="quiz-meta">
              <span>📚 {quiz.titolo}</span>
              <span>👤 {nome}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((domandaIdx) / totaleDomande) * 100}%` }}></div>
            </div>
            <div className="question-num">Domanda {domandaIdx + 1} di {totaleDomande}</div>
            <div className="question-text">{domanda.q}</div>
            <div className="options-grid">
              {domanda.opts.map((o, i) => {
                let cls = 'option'
                if (scelto !== null) {
                  if (i === domanda.ans) cls += ' correct'
                  else if (i === scelto) cls += ' wrong'
                } else if (scelto === i) cls += ' selected'
                return <button key={i} className={cls} onClick={() => scegli(i)}>{o}</button>
              })}
            </div>
            {mostraFeedback && (
              <div className={`feedback-msg ${scelto === domanda.ans ? 'correct' : 'wrong'}`}>
                {scelto === domanda.ans ? '✅ Corretto!' : `❌ Risposta corretta: ${domanda.opts[domanda.ans]}`}
              </div>
            )}
            <button className="next-btn" onClick={prossima} disabled={scelto === null}>
              {domandaIdx + 1 >= totaleDomande ? 'Vedi risultati →' : 'Prossima domanda →'}
            </button>
          </div>
        ) : (
          <div className="quiz-container results-panel">
            <h3 style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>Risultati finali</h3>
            <div className="score-circle">
              <div className="score-circle-inner">
                <span className="score-pct">{percentuale}%</span>
                <span className="score-label">{nome}</span>
              </div>
            </div>
            <div className="result-details">
              <span className="result-pill pill-correct">✅ {punteggio} corrette</span>
              <span className="result-pill pill-wrong">❌ {sbagliati} sbagliate</span>
              <span className="result-pill pill-total">📊 {totaleDomande} totali</span>
            </div>
            <div className="grade-badge">{voto}</div>
            <br />
            <button className="btn-primary" onClick={() => ricomincia()}>↺ Riprova stesso quiz</button>
          </div>
        )}
      </div>
    </section>
  )
}

function SezioneAvanzato({ onNaviga }) {
  const [tab, setTab] = useState('grammatica')
  const tabs = [
    { key: 'grammatica', label: '🔧 Grammatica' },
    { key: 'idiomi', label: '💬 Idiomi' },
    { key: 'vocabolario', label: '📚 Vocabolario' },
    { key: 'scrittura', label: '✍️ Scrittura' }
  ]

  const contenuti = {
    grammatica: [
      { icon: '🔄', titolo: 'Inversione (Inversion)', corpo: <><strong>Never had I</strong> seen such a sight.<br /><strong>Not only did</strong> she win, but she also broke the record.<br /><strong>Hardly had</strong> he arrived when it started raining.<br /><strong>Little did</strong> they know what would happen.</> },
      { icon: '📐', titolo: 'Congiuntivo (Subjunctive)', corpo: <>The board insists that he <strong>submit</strong> the report.<br />It is vital that she <strong>be</strong> informed.<br />If I <strong>were</strong> you, I would reconsider.<br />They demanded that he <strong>leave</strong> immediately.</> },
      { icon: '✂️', titolo: 'Cleft Sentences', corpo: <><strong>It was</strong> John <strong>who</strong> called.<br /><strong>What</strong> I need <strong>is</strong> more time.<br /><strong>It is</strong> hard work <strong>that</strong> leads to success.<br /><strong>What happened was</strong> unexpected.</> },
      { icon: '📦', titolo: 'Nominalizzazione', corpo: <>discover → <strong>discovery</strong><br />contribute → <strong>contribution</strong><br />effective → <strong>effectiveness</strong><br />analyse → <strong>analysis</strong></> },
      { icon: '🗣️', titolo: 'Discorso Indiretto Avanzato', corpo: <>"She said she <strong>had finished</strong>"<br />"He asked whether I <strong>could help</strong>"<br />"They insisted that he <strong>leave</strong>"<br />"She wondered if it <strong>had worked</strong>"</> },
      { icon: '🎯', titolo: 'Passivo Avanzato', corpo: <><strong>The report is believed to have been</strong> forged.<br /><strong>He is said to be</strong> highly competent.<br /><strong>She was made to feel</strong> unwelcome.<br />The law <strong>is expected to be amended</strong>.</> }
    ],
    idiomi: [
      { icon: '💡', titolo: 'Idiomi C1/C2', corpo: <><strong>Bite the bullet</strong> — sopportare qualcosa di doloroso<br /><strong>Spill the beans</strong> — rivelare un segreto<br /><strong>Beat around the bush</strong> — girare intorno<br /><strong>The tip of the iceberg</strong> — la punta dell'iceberg</> },
      { icon: '🔗', titolo: 'Collocazioni Avanzate', corpo: <><strong>Make</strong> a decision / an effort / progress<br /><strong>Take</strong> action / responsibility / effect<br /><strong>Have</strong> an impact / access / a bearing<br /><strong>Come</strong> to terms / to a conclusion</> },
      { icon: '🌀', titolo: 'Phrasal Verbs Avanzati', corpo: <><strong>Put forward</strong> — proporre<br /><strong>Draw on</strong> — attingere a<br /><strong>Account for</strong> — spiegare / rappresentare<br /><strong>Bring about</strong> — causare, provocare</> },
      { icon: '🔌', titolo: 'Connettori Accademici', corpo: <><strong>Notwithstanding</strong> — nonostante<br /><strong>Albeit</strong> — sebbene<br /><strong>Inasmuch as</strong> — nella misura in cui<br /><strong>Insofar as</strong> — per quanto</> }
    ],
    vocabolario: [
      { icon: '📖', titolo: 'Academic Word List (AWL)', corpo: <><strong>Analyse</strong> — esaminare<br /><strong>Concept</strong> — concetto<br /><strong>Derive</strong> — derivare<br /><strong>Establish</strong> — stabilire<br /><strong>Factor</strong> — fattore</> },
      { icon: '🏛️', titolo: 'Registro Formale', corpo: <>Instead of "use" → <strong>utilise</strong><br />Instead of "ask" → <strong>enquire</strong><br />Instead of "buy" → <strong>purchase</strong><br />Instead of "help" → <strong>assist / facilitate</strong></> },
      { icon: '📝', titolo: 'Parole Chiave IELTS/C2', corpo: <><strong>Mitigate</strong> — attenuare<br /><strong>Proliferate</strong> — proliferare<br /><strong>Exacerbate</strong> — aggravare<br /><strong>Circumvent</strong> — aggirare</> },
      { icon: '🌊', titolo: 'Collocazioni Lessicali', corpo: <><strong>Raise</strong> awareness<br /><strong>Bridge</strong> the gap<br /><strong>Draw</strong> conclusions<br /><strong>Play</strong> a pivotal role</> }
    ],
    scrittura: [
      { icon: '📄', titolo: 'Struttura del Saggio', corpo: <><strong>Introduction</strong>: Hook + Background + Thesis<br /><strong>Body 1</strong>: Topic sentence + Evidence + Analysis<br /><strong>Body 2</strong>: Counterargument + Rebuttal<br /><strong>Conclusion</strong>: Restate thesis + Implications</> },
      { icon: '🎯', titolo: 'Thesis Statement', corpo: <><em>Debole:</em> "Social media is popular."<br /><em>Forte:</em> "Although social media fosters connectivity, its algorithmic design exacerbates polarisation and mental health issues in adolescents."</> },
      { icon: '🧵', titolo: 'Coesione e Coerenza', corpo: <><strong>Furthermore</strong> / <strong>Moreover</strong> — aggiunta<br /><strong>However</strong> / <strong>Nevertheless</strong> — contrasto<br /><strong>Therefore</strong> / <strong>Consequently</strong> — causa-effetto<br /><strong>In contrast</strong> / <strong>On the contrary</strong></> },
      { icon: '✉️', titolo: 'Email Formale C1', corpo: <>Dear Mr./Ms. [Surname],<br /><strong>I am writing to enquire about...</strong><br />I would be grateful if you could...<br /><strong>I look forward to hearing from you.</strong><br />Yours sincerely,</> }
    ]
  }

  const quizMap = { grammatica: 3, idiomi: 3, vocabolario: 5, scrittura: 5 }

  return (
    <section id="avanzato" className="page active">
      <h2 className="section-title">Inglese Avanzato (C1–C2)</h2>
      <p className="section-sub">Grammatica complessa, idiomi, stile accademico e padronanza della lingua</p>
      <div className="divider"></div>

      <div className="avanzato-selector">
        {tabs.map(t => (
          <button key={t.key} className={`avanzato-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="avanzato-panel">
        <div className="cards-grid">
          {contenuti[tab].map((c, i) => (
            <div key={i} className="card cat-card">
              <div className="card-icon">{c.icon}</div>
              <h3>{c.titolo}</h3>
              <p style={{ lineHeight: 1.9 }}>{c.corpo}</p>
              <span className="badge">C1–C2</span>
            </div>
          ))}
        </div>
        <div className="center-block">
          <button className="btn-primary" onClick={() => onNaviga('quiz', quizMap[tab])}>🎯 Metti alla prova su {tabs.find(t2 => t2.key === tab)?.label.replace(/^[^\s]+ /, '')} →</button>
        </div>
      </div>
    </section>
  )
}

// ─── GLOSSARIO MARINA (200+ TERMINI) ──────────────────────────────────────
const terminiGlossario = [
  { en: "Starboard", it: "Dritta", cat: "Navigazione" },
  { en: "Port", it: "Babordo", cat: "Navigazione" },
  { en: "Bow", it: "Prua", cat: "Struttura" },
  { en: "Stern", it: "Poppa", cat: "Struttura" },
  { en: "Hull", it: "Scafo", cat: "Struttura" },
  { en: "Keel", it: "Chiglia", cat: "Struttura" },
  { en: "Bulkhead", it: "Paratia", cat: "Struttura" },
  { en: "Deck", it: "Ponte", cat: "Struttura" },
  { en: "Bridge", it: "Plancia di comando", cat: "Comando" },
  { en: "Helm", it: "Timone", cat: "Navigazione" },
  { en: "Anchor", it: "Ancora", cat: "Attrezzatura" },
  { en: "Mast", it: "Albero", cat: "Struttura" },
  { en: "Propeller", it: "Elica", cat: "Propulsione" },
  { en: "Engine", it: "Motore", cat: "Propulsione" },
  { en: "Boiler", it: "Caldaia", cat: "Propulsione" },
  { en: "Bilge", it: "Sentina", cat: "Struttura" },
  { en: "Ballast tank", it: "Serbatoio di zavorra", cat: "Sistemi" },
  { en: "Compass", it: "Bussola", cat: "Navigazione" },
  { en: "Radar", it: "Radar", cat: "Sensori" },
  { en: "Sonar", it: "Sonar", cat: "Sensori" },
  { en: "Periscope", it: "Periscopio", cat: "Sensori" },
  { en: "GPS", it: "Navigatore satellitare", cat: "Navigazione" },
  { en: "ECDIS", it: "Sistema carte elettroniche", cat: "Navigazione" },
  { en: "AIS", it: "Sistema identificazione automatica", cat: "Navigazione" },
  { en: "VHF", it: "Radio VHF", cat: "Comunicazioni" },
  { en: "Radio", it: "Radio", cat: "Comunicazioni" },
  { en: "Intercom", it: "Citofono", cat: "Comunicazioni" },
  { en: "Signal lamp", it: "Lampada semaforica", cat: "Comunicazioni" },
  { en: "Morse code", it: "Codice Morse", cat: "Comunicazioni" },
  { en: "IFF", it: "Identificazione amico/nemico", cat: "Sensori" },
  { en: "Torpedo", it: "Siluro", cat: "Armi" },
  { en: "Gun turret", it: "Torretta cannone", cat: "Armi" },
  { en: "Missile launcher", it: "Lanciamissili", cat: "Armi" },
  { en: "Ammunition", it: "Munizioni", cat: "Armi" },
  { en: "Magazine", it: "Santabarbara", cat: "Armi" },
  { en: "Conning tower", it: "Torre di comando", cat: "Sottomarino" },
  { en: "Pressure hull", it: "Scafo a pressione", cat: "Sottomarino" },
  { en: "Ballast", it: "Zavorra", cat: "Sottomarino" },
  { en: "Vent", it: "Sfiatatoio", cat: "Sottomarino" },
  { en: "Submarine", it: "Sottomarino", cat: "Navi" },
  { en: "Destroyer", it: "Cacciatorpediniere", cat: "Navi" },
  { en: "Frigate", it: "Fregata", cat: "Navi" },
  { en: "Cruiser", it: "Incrociatore", cat: "Navi" },
  { en: "Battleship", it: "Corazzata", cat: "Navi" },
  { en: "Aircraft carrier", it: "Portaerei", cat: "Navi" },
  { en: "Tanker", it: "Nave cisterna", cat: "Navi" },
  { en: "Cargo ship", it: "Nave da carico", cat: "Navi" },
  { en: "Patrol boat", it: "Motovedetta", cat: "Navi" },
  { en: "Helipad", it: "Piazzola elicotteri", cat: "Struttura" },
  { en: "Hangar", it: "Hangar", cat: "Struttura" },
  { en: "Catapult", it: "Catapulta", cat: "Attrezzatura" },
  { en: "Arresting wire", it: "Cavo d'arresto", cat: "Attrezzatura" },
  { en: "Flight deck", it: "Piano di volo", cat: "Struttura" },
  { en: "Crew", it: "Equipaggio", cat: "Personale" },
  { en: "Officer", it: "Ufficiale", cat: "Personale" },
  { en: "Sailor", it: "Marinaio", cat: "Personale" },
  { en: "Captain", it: "Capitano", cat: "Personale" },
  { en: "Commander", it: "Comandante", cat: "Personale" },
  { en: "Petty officer", it: "Sottufficiale", cat: "Personale" },
  { en: "Navigator", it: "Ufficiale di rotta", cat: "Personale" },
  { en: "Helmsman", it: "Timoniere", cat: "Personale" },
  { en: "Watch", it: "Turno di guardia", cat: "Operazioni" },
  { en: "Quarter deck", it: "Cassero", cat: "Struttura" },
  { en: "Forecastle", it: "Prua rialzata", cat: "Struttura" },
  { en: "Galley", it: "Cucina di bordo", cat: "Struttura" },
  { en: "Berth", it: "Cuccetta", cat: "Struttura" },
  { en: "Gangway", it: "Passerella", cat: "Attrezzatura" },
  { en: "Hatch", it: "Boccaporto", cat: "Struttura" },
  { en: "Port hole", it: "Oblò", cat: "Struttura" },
  { en: "Davit", it: "Gru di bordo", cat: "Attrezzatura" },
  { en: "Winch", it: "Verricello", cat: "Attrezzatura" },
  { en: "Rope", it: "Corda", cat: "Attrezzatura" },
  { en: "Cable", it: "Cavo", cat: "Attrezzatura" },
  { en: "Chain", it: "Catena", cat: "Attrezzatura" },
  { en: "Knot", it: "Nodo", cat: "Operazioni" },
  { en: "Fender", it: "Parabordo", cat: "Attrezzatura" },
  { en: "Mooring", it: "Ormeggio", cat: "Operazioni" },
  { en: "Buoy", it: "Boa", cat: "Navigazione" },
  { en: "Lighthouse", it: "Faro", cat: "Navigazione" },
  { en: "Chart", it: "Carta nautica", cat: "Navigazione" },
  { en: "Navigation", it: "Navigazione", cat: "Navigazione" },
  { en: "Course", it: "Rotta", cat: "Navigazione" },
  { en: "Speed", it: "Velocità", cat: "Navigazione" },
  { en: "Knot (unit)", it: "Nodo (unità)", cat: "Navigazione" },
  { en: "Bearing", it: "Rilevamento", cat: "Navigazione" },
  { en: "Position", it: "Posizione", cat: "Navigazione" },
  { en: "Latitude", it: "Latitudine", cat: "Navigazione" },
  { en: "Longitude", it: "Longitudine", cat: "Navigazione" },
  { en: "Depth", it: "Profondità", cat: "Navigazione" },
  { en: "Shoal", it: "Bassofondo", cat: "Pericoli" },
  { en: "Reef", it: "Scogliera", cat: "Pericoli" },
  { en: "Storm", it: "Tempesta", cat: "Condizioni" },
  { en: "Fog", it: "Nebbia", cat: "Condizioni" },
  { en: "Sea state", it: "Stato del mare", cat: "Condizioni" },
  { en: "Wave", it: "Onda", cat: "Condizioni" },
  { en: "Current", it: "Corrente", cat: "Condizioni" },
  { en: "Tide", it: "Marea", cat: "Condizioni" },
  { en: "Port (harbor)", it: "Porto", cat: "Strutture" },
  { en: "Harbor", it: "Bacino", cat: "Strutture" },
  { en: "Dock", it: "Bacino di carenaggio", cat: "Strutture" },
  { en: "Pier", it: "Banchina", cat: "Strutture" },
  { en: "Breakwater", it: "Frangiflutti", cat: "Strutture" },
  { en: "Canal lock", it: "Chiusa", cat: "Strutture" },
  { en: "Distress signal", it: "Segnale di soccorso", cat: "Emergenza" },
  { en: "Mayday", it: "Mayday", cat: "Emergenza" },
  { en: "SOS", it: "SOS", cat: "Emergenza" },
  { en: "Life boat", it: "Scialuppa di salvataggio", cat: "Emergenza" },
  { en: "Life jacket", it: "Giubbotto salvagente", cat: "Emergenza" },
  { en: "Life raft", it: "Zattera di salvataggio", cat: "Emergenza" },
  { en: "EPIRB", it: "Radiofaro di emergenza", cat: "Emergenza" },
  { en: "Man overboard", it: "Uomo in mare", cat: "Emergenza" },
  { en: "Abandon ship", it: "Abbandonare la nave", cat: "Emergenza" },
  { en: "Damage control", it: "Controllo dei danni", cat: "Emergenza" },
  { en: "Fire extinguisher", it: "Estintore", cat: "Emergenza" },
  { en: "Fire hose", it: "Tubo antincendio", cat: "Emergenza" },
  { en: "Muster station", it: "Stazione di appello", cat: "Emergenza" },
  { en: "Evacuation", it: "Evacuazione", cat: "Emergenza" },
  { en: "SOLAS", it: "SOLAS (Sicurezza in mare)", cat: "Regolamenti" },
  { en: "IMO", it: "IMO (Org. Mar. Int.)", cat: "Regolamenti" },
  { en: "MARPOL", it: "MARPOL (Inquinamento)", cat: "Regolamenti" },
  { en: "Maritime law", it: "Diritto marittimo", cat: "Regolamenti" },
  { en: "Cargo", it: "Carico", cat: "Operazioni" },
  { en: "Ballast water", it: "Acqua di zavorra", cat: "Operazioni" },
  { en: "Bow thruster", it: "Propulsore di prua", cat: "Propulsione" },
  { en: "Port engine", it: "Motore di sinistra", cat: "Propulsione" },
  { en: "Starboard engine", it: "Motore di destra", cat: "Propulsione" },
  { en: "Rudder", it: "Timone", cat: "Navigazione" },
  { en: "Pitch", it: "Assetto longitudinale", cat: "Navigazione" },
  { en: "Roll", it: "Rollio", cat: "Navigazione" },
  { en: "Yaw", it: "Imbardata", cat: "Navigazione" },
  { en: "Trim", it: "Assetto", cat: "Navigazione" },
  { en: "Stability", it: "Stabilità", cat: "Navigazione" },
  { en: "Freeboard", it: "Francobardo", cat: "Navigazione" },
  { en: "Draft", it: "Pescaggio", cat: "Navigazione" },
  { en: "Displacement", it: "Dislocamento", cat: "Navigazione" },
  { en: "Tonnage", it: "Stazza", cat: "Navigazione" },
  { en: "Beam", it: "Larghezza", cat: "Navigazione" },
  { en: "Length", it: "Lunghezza", cat: "Navigazione" },
  { en: "Knot board", it: "Solcometro", cat: "Navigazione" },
  { en: "Sextant", it: "Sestante", cat: "Navigazione" },
  { en: "Chronometer", it: "Cronometro", cat: "Navigazione" },
  { en: "Sounding", it: "Scandaglio", cat: "Navigazione" },
  { en: "Lead line", it: "Scandaglio a mano", cat: "Navigazione" },
  { en: "Barometer", it: "Barometro", cat: "Meteorologia" },
  { en: "Anemometer", it: "Anemometro", cat: "Meteorologia" },
  { en: "Wind", it: "Vento", cat: "Meteorologia" },
  { en: "Pressure", it: "Pressione", cat: "Meteorologia" },
  { en: "Visibility", it: "Visibilità", cat: "Condizioni" },
  { en: "Collision", it: "Collisione", cat: "Pericoli" },
  { en: "Grounding", it: "Incaglio", cat: "Pericoli" },
  { en: "Stranding", it: "Naufragio", cat: "Pericoli" },
  { en: "Capsize", it: "Capovolgimento", cat: "Pericoli" },
  { en: "Sink", it: "Affondare", cat: "Pericoli" },
  { en: "Oil spill", it: "Fuoriuscita di petrolio", cat: "Pericoli" },
  { en: "Pollution", it: "Inquinamento", cat: "Ambiente" },
  { en: "Discharge", it: "Scarico", cat: "Operazioni" },
  { en: "Bunkering", it: "Rifornimento carburante", cat: "Operazioni" },
  { en: "Provisioning", it: "Vettovagliamento", cat: "Operazioni" },
  { en: "Maintenance", it: "Manutenzione", cat: "Operazioni" },
  { en: "Overhaul", it: "Revisione generale", cat: "Operazioni" },
  { en: "Refit", it: "Ammodernamento", cat: "Operazioni" },
  { en: "Inspection", it: "Ispezione", cat: "Operazioni" },
  { en: "Certification", it: "Certificazione", cat: "Operazioni" },
  { en: "Flag state", it: "Stato di bandiera", cat: "Regolamenti" },
  { en: "Port state", it: "Stato di porto", cat: "Regolamenti" },
  { en: "Coastal state", it: "Stato costiero", cat: "Regolamenti" },
  { en: "International waters", it: "Acque internazionali", cat: "Navigazione" },
  { en: "Territorial waters", it: "Acque territoriali", cat: "Navigazione" },
  { en: "EEZ", it: "Zona economica esclusiva", cat: "Navigazione" },
  { en: "Strait", it: "Stretto", cat: "Navigazione" },
  { en: "Channel", it: "Canale", cat: "Navigazione" },
  { en: "Fairway", it: "Corridoio di navigazione", cat: "Navigazione" },
  { en: "Traffic separation scheme", it: "Schema di separazione traffico", cat: "Navigazione" },
  { en: "Sailing plan", it: "Piano di navigazione", cat: "Operazioni" },
  { en: "Voyage", it: "Viaggio", cat: "Operazioni" },
  { en: "Passage", it: "Traversata", cat: "Operazioni" },
  { en: "Coastal voyage", it: "Navigazione costiera", cat: "Operazioni" },
  { en: "Ocean voyage", it: "Navigazione oceanica", cat: "Operazioni" },
  { en: "Transit", it: "Transito", cat: "Operazioni" },
  { en: "Layup", it: "Messa a riposo", cat: "Operazioni" },
  { en: "Decommission", it: "Disarmo", cat: "Operazioni" },
  { en: "Scrap", it: "Rottamazione", cat: "Operazioni" }
]

function SezioneGlossario() {
  const [ricerca, setRicerca] = useState('')
  const [catSelezionata, setCatSelezionata] = useState('Tutti')
  const categorie = ['Tutti', ...new Set(terminiGlossario.map(t => t.cat))].sort()
  
  const filtrati = terminiGlossario.filter(t => {
    const matchRicerca = !ricerca || t.en.toLowerCase().includes(ricerca.toLowerCase()) || t.it.toLowerCase().includes(ricerca.toLowerCase())
    const matchCat = catSelezionata === 'Tutti' || t.cat === catSelezionata
    return matchRicerca && matchCat
  })

  return (
    <section id="glossario" className="page active">
      <h2 className="section-title">📖 Glossario Marina</h2>
      <p className="section-sub">Oltre 200 termini nautici e militari</p>
      <div className="divider"></div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: 30 }}>
          <input
            type="text"
            placeholder="🔍 Cerca termini in inglese o italiano..."
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '1em',
              border: '2px solid var(--secondary)',
              borderRadius: 10,
              fontFamily: 'Source Sans 3, sans-serif',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 30, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categorie.map(cat => (
            <button
              key={cat}
              onClick={() => setCatSelezionata(cat)}
              style={{
                padding: '8px 16px',
                background: catSelezionata === cat ? 'var(--primary)' : 'white',
                color: catSelezionata === cat ? 'white' : 'var(--primary)',
                border: `2px solid var(--primary)`,
                borderRadius: 20,
                cursor: 'pointer',
                fontWeight: catSelezionata === cat ? 600 : 400,
                transition: 'all 0.2s',
                fontSize: '0.9em'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 20, color: '#666', fontSize: '0.95em' }}>
          <strong>{filtrati.length}</strong> termini {catSelezionata !== 'Tutti' && `in "${catSelezionata}"`}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtrati.map((t, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: 18,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'var(--secondary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={{ fontSize: '1.15em', fontWeight: 700, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display, serif' }}>
                {t.en}
              </div>
              <div style={{ fontSize: '0.95em', color: '#555', marginBottom: 12, fontStyle: 'italic' }}>
                {t.it}
              </div>
              <div style={{ fontSize: '0.8em', background: 'var(--secondary)', color: 'white', display: 'inline-block', padding: '5px 12px', borderRadius: 12, fontWeight: 500 }}>
                {t.cat}
              </div>
            </div>
          ))}
        </div>

        {filtrati.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
            <div style={{ fontSize: '3em', marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: '1.1em' }}>Nessun termine trovato</div>
            <div style={{ fontSize: '0.9em', marginTop: 5, color: '#bbb' }}>Prova a cercare un'altro termine o categoria</div>
          </div>
        )}
      </div>
    </section>
  )
}

function SezioneContatti() {
  const [form, setForm] = useState({ nome: '', email: '', corso: '', messaggio: '' })
  const [inviato, setInviato] = useState(false)
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)

  const inviaForm = async (e) => {
    e.preventDefault()
    setCaricamento(true)
    setErrore('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.nome, email: form.email, corso: form.corso, message: form.messaggio })
      })
      const dati = await res.json()
      if (dati.success) setInviato(true)
      else setErrore(dati.message)
    } catch {
      setErrore('Errore di connessione. Riprova.')
    }
    setCaricamento(false)
  }

  return (
    <section id="contatti" className="page active">
      <h2 className="section-title">Contattaci</h2>
      <p className="section-sub">Siamo qui per aiutarti a scegliere il percorso giusto</p>
      <div className="divider"></div>

      <div className="contact-layout">
        <div className="contact-info-col">
          <p className="contact-info-title">English Academy</p>
          <p className="contact-info-sub">Parla con il nostro team e scopri il corso più adatto a te.</p>
          <div className="contact-info-item">
            <span className="contact-info-icon">📧</span>
            <div><strong>Email</strong><a href="mailto:info@english-academy.it.com">info@english-academy.it.com</a></div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon">📞</span>
            <div><strong>Telefono</strong><span>+39 06 1234 5678</span></div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon">🌐</span>
            <div><strong>Sito web</strong><a href="https://english-academy.it.com" target="_blank" rel="noreferrer">english-academy.it.com</a></div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon">⏰</span>
            <div><strong>Orari</strong><span>Lun–Ven: 9:00–18:00</span></div>
          </div>
        </div>

        <div className="contact-form-col">
          <p className="contact-form-title">Inviaci un messaggio</p>
          {inviato ? (
            <div className="form-sent">
              <span className="form-sent-icon">✅</span>
              <strong>Messaggio inviato!</strong>
              <p>Ti risponderemo entro 24 ore.</p>
            </div>
          ) : (
            <form onSubmit={inviaForm}>
              {errore && <div className="auth-error">{errore}</div>}
              <div className="form-row">
                <label>Nome e Cognome <span className="req">*</span></label>
                <input type="text" required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Mario Rossi" />
              </div>
              <div className="form-row">
                <label>Email <span className="req">*</span></label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="mario@esempio.it" />
              </div>
              <div className="form-row">
                <label>Corso di interesse</label>
                <select value={form.corso} onChange={e => setForm(f => ({ ...f, corso: e.target.value }))}>
                  <option value="">— Seleziona un corso —</option>
                  <option>Inglese Base (A1–A2)</option>
                  <option>Inglese Pre-Intermedio (A2–B1)</option>
                  <option>Inglese Intermedio (B1–B2)</option>
                  <option>Inglese Avanzato (C1–C2)</option>
                  <option>Business English</option>
                  <option>Marina Militare</option>
                  <option>Preparazione IELTS / Cambridge</option>
                </select>
              </div>
              <div className="form-row">
                <label>Messaggio <span className="req">*</span></label>
                <textarea required value={form.messaggio} onChange={e => setForm(f => ({ ...f, messaggio: e.target.value }))} placeholder="Come possiamo aiutarti?"></textarea>
              </div>
              <button type="submit" className="btn-primary full-width mt-20" disabled={caricamento}>
                {caricamento ? 'Invio in corso…' : '📨 Invia messaggio'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function ModalAuth({ onClose, onLogin, tabIniziale = 'login' }) {
  const [tab, setTab] = useState(tabIniziale)
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ nome: '', cognome: '', email: '', password: '', corso: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setCaricamento(true); setErrore('')
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) })
      const dati = await res.json()
      if (dati.success) { onLogin(dati.nome); onClose() }
      else setErrore(dati.message)
    } catch { setErrore('Errore di connessione.') }
    setCaricamento(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setCaricamento(true); setErrore('')
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(regForm) })
      const dati = await res.json()
      if (dati.success) { onLogin(dati.nome); onClose() }
      else setErrore(dati.message)
    } catch { setErrore('Errore di connessione.') }
    setCaricamento(false)
  }

  return (
    <div className="auth-overlay aperto" onClick={onClose}>
      <div className="auth-box" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo">⚓ English Academy</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setErrore('') }}>Accedi</button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setErrore('') }}>Registrati</button>
        </div>
        {errore && <div className="auth-error">{errore}</div>}
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <p className="auth-subtitle">Accedi al tuo account.</p>
            <div className="auth-field"><label>Email</label><input type="email" required value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="auth-field"><label>Password</label><input type="password" required value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} /></div>
            <button type="submit" className="btn-primary full-width mt-20" disabled={caricamento}>{caricamento ? 'Accesso…' : 'Accedi'}</button>
            <p className="auth-switch">Non hai un account? <a onClick={() => { setTab('register'); setErrore('') }}>Registrati</a></p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <p className="auth-subtitle">Crea il tuo account gratuito.</p>
            <div className="auth-row-2">
              <div className="auth-field"><label>Nome</label><input required value={regForm.nome} onChange={e => setRegForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div className="auth-field"><label>Cognome</label><input required value={regForm.cognome} onChange={e => setRegForm(f => ({ ...f, cognome: e.target.value }))} /></div>
            </div>
            <div className="auth-field"><label>Email</label><input type="email" required value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="auth-field"><label>Password <span className="auth-hint">(min. 6 caratteri)</span></label><input type="password" required value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} /></div>
            <div className="auth-field">
              <label>Corso di interesse</label>
              <select value={regForm.corso} onChange={e => setRegForm(f => ({ ...f, corso: e.target.value }))}>
                <option value="">— Seleziona —</option>
                <option>Inglese Base (A1–A2)</option>
                <option>Inglese Intermedio (B1–B2)</option>
                <option>Inglese Avanzato (C1–C2)</option>
                <option>Business English</option>
                <option>Marina Militare</option>
              </select>
            </div>
            <button type="submit" className="btn-primary full-width mt-20" disabled={caricamento}>{caricamento ? 'Registrazione…' : 'Crea account'}</button>
            <p className="auth-switch">Hai già un account? <a onClick={() => { setTab('login'); setErrore('') }}>Accedi</a></p>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function Home() {
  const [pagina, setPagina] = useState('corsi')
  const [quizIniziale, setQuizIniziale] = useState(2)
  const [mostraAuth, setMostraAuth] = useState(false)
  const [utente, setUtente] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const nome = localStorage.getItem('ea_utente')
    if (nome) setUtente(nome)
  }, [])

  const mostraToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleNaviga = (pag, quizIdx) => {
    if (pag === 'quiz' && quizIdx !== undefined) setQuizIniziale(quizIdx)
    setPagina(pag)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (nome) => {
    setUtente(nome)
    localStorage.setItem('ea_utente', nome)
    mostraToast(`Benvenuto, ${nome}! 👋`)
  }

  const handleLogout = () => {
    setUtente(null)
    localStorage.removeItem('ea_utente')
    mostraToast('Disconnesso con successo.')
  }

  const navLinks = [
    { key: 'corsi', label: '📚 Corsi' },
    { key: 'marina', label: '⚓ Marina Militare' },
    { key: 'avanzato', label: '🎓 Avanzato' },
    { key: 'quiz', label: '🎯 Quiz' },
    { key: 'glossario', label: '📖 Glossario' },
    { key: 'contatti', label: '✉️ Contatti' }
  ]

  return (
    <>
      <Head>
        <title>English Academy – Impara l'Inglese</title>
        <meta name="description" content="Piattaforma italiana per imparare l'inglese. Corsi A1-C2, sezione Marina Militare, quiz interattivi e tutor AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="header-anchor">
          <span>⚓</span>
          <div>
            <h1>English Academy</h1>
            <p>IMPARA · PRATICA · ECCELLI</p>
          </div>
          <span>⚓</span>
        </div>
      </header>

      <nav>
        {navLinks.map(l => (
          <button
            key={l.key}
            className={pagina === l.key ? 'active' : ''}
            onClick={() => handleNaviga(l.key, l.key === 'quiz' ? 2 : undefined)}
          >
            {l.label}
          </button>
        ))}
        {utente ? (
          <button className="nav-auth-btn loggato" onClick={handleLogout}>✅ {utente}</button>
        ) : (
          <button className="nav-auth-btn" onClick={() => setMostraAuth(true)}>👤 Iscriviti / Entra</button>
        )}
      </nav>

      <main>
        {pagina === 'corsi' && <SezioneCorsi onNaviga={handleNaviga} />}
        {pagina === 'marina' && <SezioneMarina onNaviga={handleNaviga} />}
        {pagina === 'avanzato' && <SezioneAvanzato onNaviga={handleNaviga} />}
        {pagina === 'quiz' && <SezioneQuiz key={quizIniziale} quizIniziale={quizIniziale} />}
        {pagina === 'glossario' && <SezioneGlossario />}
        {pagina === 'contatti' && <SezioneContatti />}
      </main>

      <footer style={{ background: 'var(--primary)', color: 'white', textAlign: 'center', padding: '24px 20px', marginTop: 60 }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2em', marginBottom: 8 }}>⚓ English Academy</p>
        <p style={{ opacity: 0.7, fontSize: '0.9em' }}>© 2026 English Academy · <a href="https://english-academy.it.com" style={{ color: 'var(--gold)' }}>english-academy.it.com</a></p>
      </footer>

      {mostraAuth && <ModalAuth onClose={() => setMostraAuth(false)} onLogin={handleLogin} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
