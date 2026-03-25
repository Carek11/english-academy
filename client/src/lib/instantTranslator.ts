import { glossaryTerms } from "./glossaryData";

// Cache locale di traduzioni istantanee
const translationCache: Record<string, string> = {};

// Dizionario di parole comuni inglese-italiano per traduzione istantanea
const commonWords: Record<string, string> = {
  // Verbi comuni
  "is": "è", "are": "sono", "be": "essere", "was": "era", "were": "erano", "been": "stato",
  "have": "avere", "has": "ha", "had": "aveva", "do": "fare", "does": "fa", "did": "ha fatto",
  "go": "andare", "goes": "va", "going": "andando", "went": "è andato", "come": "venire", "comes": "viene",
  "take": "prendere", "makes": "fa", "make": "fare", "get": "ottenere", "gets": "ottiene", "got": "ottenuto",
  "give": "dare", "gives": "dà", "put": "mettere", "say": "dire", "says": "dice", "see": "vedere",
  "know": "sapere", "think": "pensare", "can": "potere", "could": "potrebbe", "will": "sarà", "would": "sarebbe",
  "should": "dovrebbe", "may": "può", "must": "deve", "want": "vuole", "need": "ha bisogno", "try": "prova",
  "use": "usa", "work": "funziona", "call": "chiama", "ask": "chiede",
  "feel": "sente", "become": "diventa", "leave": "lascia", "mean": "significa",
  "keep": "mantiene", "let": "lascia", "begin": "inizia", "seem": "sembra", "help": "aiuta",
  "talk": "parla", "turn": "gira", "start": "inizia", "show": "mostra", "hear": "sente", "play": "gioca",
  "run": "corre", "move": "muove", "like": "piace", "live": "vive", "believe": "crede", "hold": "tiene",
  "bring": "porta", "happen": "accade", "write": "scrive", "provide": "fornisce", "sit": "siede",
  "stand": "sta in piedi", "lose": "perde", "pay": "paga", "meet": "incontra", "include": "include",
  "continue": "continua", "set": "imposta", "learn": "impara", "change": "cambia", "lead": "guida",
  "understand": "capisce", "watch": "guarda", "follow": "segue", "stop": "si ferma", "create": "crea",
  "speak": "parla", "read": "legge", "allow": "consente", "add": "aggiunge", "spend": "spende",
  "grow": "cresce", "open": "apre", "walk": "cammina", "win": "vince", "offer": "offre", "remember": "ricorda",
  "consider": "considera", "appear": "sembra", "buy": "compra", "wait": "aspetta", "serve": "serve",
  "die": "muore", "send": "invia", "expect": "si aspetta", "build": "costruisce", "stay": "rimane",
  "fall": "cade", "cut": "taglia", "reach": "raggiunge", "kill": "uccide", "remain": "rimane",
  "suggest": "suggerisce", "raise": "alza", "pass": "passa", "sell": "vende", "require": "richiede",
  "report": "segnala", "decide": "decide", "describe": "descrive", "pick": "sceglie", "accept": "accetta",
  "obtain": "ottiene", "point": "punta", "consist": "consiste", "cover": "copre", "catch": "cattura",
  "draw": "disegna", "break": "rompe", "eat": "mangia",

  // Sostantivi comuni
  "ship": "nave", "boat": "barca", "water": "acqua", "day": "giorno", "year": "anno", "time": "tempo",
  "man": "uomo", "woman": "donna", "person": "persona", "people": "persone", "child": "bambino",
  "children": "bambini", "hand": "mano", "eye": "occhio", "head": "testa", "heart": "cuore",
  "life": "vita", "world": "mondo", "place": "luogo", "thing": "cosa", "way": "modo",
  "power": "potenza", "money": "soldi", "part": "parte", "case": "caso",
  "fact": "fatto", "government": "governo", "company": "azienda",
  "number": "numero", "group": "gruppo", "problem": "problema", "result": "risultato",
  "system": "sistema", "effort": "sforzo", "cost": "costo", "control": "controllo", "trade": "commercio",
  "age": "età", "name": "nome", "line": "linea", "son": "figlio", "information": "informazioni",
  "body": "corpo", "family": "famiglia", "side": "lato", "service": "servizio", "member": "membro",
  "blood": "sangue", "order": "ordine", "sense": "senso", "nature": "natura", "animal": "animale",
  "mind": "mente", "pain": "dolore", "level": "livello", "reason": "motivo", "action": "azione",
  "war": "guerra", "peace": "pace", "death": "morte", "form": "forma", "building": "edificio",
  "fire": "fuoco", "knowledge": "conoscenza", "game": "gioco", "loss": "perdita", "weight": "peso",
  "sound": "suono", "quality": "qualità", "concern": "preoccupazione", "bottom": "fondo", "success": "successo",
  "window": "finestra", "door": "porta", "table": "tavolo", "chair": "sedia", "bed": "letto",
  "house": "casa", "street": "strada", "road": "strada", "city": "città", "country": "paese",
  "tree": "albero", "flower": "fiore", "mountain": "montagna", "sea": "mare", "sun": "sole",
  "moon": "luna", "star": "stella", "sky": "cielo", "cloud": "nuvola", "rain": "pioggia",
  "wind": "vento", "snow": "neve", "stone": "pietra", "sand": "sabbia", "gold": "oro",
  "car": "auto", "king": "re", "queen": "regina", "president": "presidente",
  "brother": "fratello", "sister": "sorella", "mother": "madre", "father": "padre", "doctor": "medico",
  "teacher": "insegnante", "police": "polizia", "soldier": "soldato", "captain": "capitano",
  "officer": "ufficiale", "crew": "equipaggio", "sailor": "marinaio",

  // Aggettivi comuni
  "good": "buono", "bad": "cattivo", "big": "grande", "small": "piccolo", "new": "nuovo",
  "old": "vecchio", "young": "giovane", "hot": "caldo", "cold": "freddo", "dark": "scuro",
  "light": "chiaro", "fast": "veloce", "slow": "lento", "high": "alto", "low": "basso",
  "long": "lungo", "short": "corto", "wide": "largo", "narrow": "stretto", "thick": "spesso",
  "thin": "sottile", "hard": "duro", "soft": "morbido", "wet": "bagnato", "dry": "asciutto",
  "clean": "pulito", "dirty": "sporco", "bright": "luminoso", "beautiful": "bellissimo",
  "ugly": "brutto", "strong": "forte", "weak": "debole", "rich": "ricco", "poor": "povero",
  "happy": "felice", "sad": "triste", "angry": "arrabbiato", "calm": "calmo", "tired": "stanco",
  "safe": "sicuro", "dangerous": "pericoloso", "easy": "facile", "difficult": "difficile",
  "possible": "possibile", "impossible": "impossibile", "necessary": "necessario", "useful": "utile",
  "complete": "completo", "empty": "vuoto", "full": "pieno", "special": "speciale", "common": "comune",
  "natural": "naturale", "artificial": "artificiale", "real": "reale", "false": "falso",
  "true": "vero", "public": "pubblico", "private": "privato", "free": "libero", "busy": "occupato",
  "quiet": "tranquillo", "loud": "rumoroso", "clear": "chiaro", "blurry": "sfocato", "sharp": "tagliente",
  "dull": "opaco", "smooth": "liscio", "rough": "ruvido", "heavy": "pesante", "lighter": "più leggero",

  // Preposizioni
  "in": "in", "on": "su", "at": "a", "to": "a", "from": "da", "with": "con", "without": "senza",
  "under": "sotto", "over": "sopra", "above": "sopra", "below": "sotto", "between": "tra",
  "among": "tra", "by": "da", "for": "per", "of": "di", "about": "circa", "as": "come",
  "during": "durante", "before": "prima", "after": "dopo", "since": "poiché", "until": "fino",
  "through": "attraverso", "across": "attraverso", "along": "lungo", "around": "intorno",
  "near": "vicino", "far": "lontano", "inside": "dentro", "outside": "fuori", "behind": "dietro",
  "beside": "accanto", "into": "dentro", "out": "fuori", "off": "via", "up": "su", "down": "giù",

  // Numeri e articoli
  "a": "un", "an": "un", "the": "il", "one": "uno", "two": "due", "three": "tre",
  "four": "quattro", "five": "cinque", "six": "sei", "seven": "sette", "eight": "otto",
  "nine": "nove", "ten": "dieci", "hundred": "cento", "thousand": "mille",

  // Avverbi comuni
  "very": "molto", "much": "molto", "more": "più", "most": "più", "less": "meno",
  "few": "pochi", "many": "molti", "some": "alcuni", "all": "tutti", "none": "nessuno",
  "only": "solo", "also": "anche", "too": "anche", "just": "proprio", "already": "già",
  "still": "ancora", "never": "mai", "always": "sempre", "sometimes": "talvolta", "often": "spesso",
  "usually": "di solito", "certainly": "certamente", "probably": "probabilmente", "maybe": "forse",
  "yes": "sì", "no": "no", "not": "non",

  // Termini tecnici navali comuni
  "anchor": "ancora", "rope": "corda", "sail": "vela", "mast": "albero", "deck": "ponte",
  "stern": "poppa", "bow": "prua", "port": "babordo", "starboard": "tribordo", "hull": "scafo",
  "cabin": "cabina", "bridge": "plancia", "engine": "motore", "engine room": "sala macchine",
  "galley": "cucina", "berth": "posto letto", "cargo": "carico", "ballast": "zavorra",
  "rudder": "timone", "propeller": "elica", "buoy": "boa",
  "lighthouse": "faro", "reef": "scogliera", "tide": "marea", "current": "corrente",
  "wave": "onda", "storm": "tempesta", "fog": "nebbia", "visibility": "visibilità",
  "vessel": "nave", "vessels": "navi", "ships": "navi", "boats": "barche", "submarine": "sottomarino",
  "submarines": "sottomarini", "destroyer": "cacciatorpediniere", "frigate": "fregata",
  "frigates": "fregate", "aircraft": "aereo", "aircraft carrier": "portaerei", "tanker": "cisterna",
  "freighter": "carico", "container": "contenitore", "containers": "contenitori", "ports": "porti",
  "harbor": "porto", "dock": "banchina", "pier": "molo", "channel": "canale", "strait": "stretto",
  "navigation": "navigazione", "maritime": "marittimo", "marine": "marino", "navy": "marina",
  "coast": "costa", "coastal": "costiero", "offshore": "largo", "onshore": "costa",
  "speed": "velocità", "knots": "nodi", "depth": "profondità", "buoys": "boe",
  "lights": "luci", "signal": "segnale", "flags": "bandiere", "flag": "bandiera",
};

// Inizializza cache dalle glossary terms
export function initTranslationCache() {
  glossaryTerms.forEach((term) => {
    translationCache[term.en.toLowerCase()] = term.it;
  });
  // Aggiungi parole comuni
  Object.entries(commonWords).forEach(([en, it]) => {
    if (!translationCache[en.toLowerCase()]) {
      translationCache[en.toLowerCase()] = it;
    }
  });
}

// Traduci istantaneamente usando il cache locale
export function getInstantTranslation(word: string): string {
  const normalized = word.toLowerCase().trim();
  
  // Assicurati che il cache sia inizializzato
  if (Object.keys(translationCache).length === 0) {
    initTranslationCache();
  }
  
  return translationCache[normalized] || word;
}

// Pre-traduce il testo: restituisce array di {word, translation} per ogni parola
export function preTranslateText(text: string): Array<{ word: string; translation: string; isTranslated: boolean }> {
  if (Object.keys(translationCache).length === 0) {
    initTranslationCache();
  }
  
  return text.split(/\s+/).map((word) => {
    const cleaned = word.replace(/[.,!?;:"()—–-]/g, "");
    const normalized = cleaned.toLowerCase().trim();
    const translation = translationCache[normalized];
    
    return {
      word,
      translation: translation || cleaned,
      isTranslated: !!translation,
    };
  });
}
