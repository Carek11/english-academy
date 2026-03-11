export type GlossaryCategory = "navigation" | "engine" | "communications" | "safety" | "ship_parts" | "ranks";

export interface GlossaryTerm {
  en: string;
  it: string;
  category: GlossaryCategory;
  description?: string;
}

export const categoryConfig: Record<GlossaryCategory, { label: string; icon: string; color: string; bg: string }> = {
  navigation:     { label: "Navigation",     icon: "🧭", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
  engine:         { label: "Engine Room",    icon: "⚙️", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  communications: { label: "Communications", icon: "📡", color: "text-green-700",  bg: "bg-green-50 border-green-200"  },
  safety:         { label: "Safety",         icon: "🦺", color: "text-red-700",    bg: "bg-red-50 border-red-200"      },
  ship_parts:     { label: "Ship Parts",     icon: "⚓", color: "text-academy-blue", bg: "bg-indigo-50 border-indigo-200" },
  ranks:          { label: "Ranks & Roles",  icon: "🎖️", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

export const glossaryTerms: GlossaryTerm[] = [
  // NAVIGATION
  { en: "Heading",       it: "Rotta / Prora",          category: "navigation", description: "La direzione in cui punta la prua della nave, espressa in gradi." },
  { en: "Bearing",       it: "Rilevamento",            category: "navigation", description: "Angolo tra il Nord e la direzione di un oggetto." },
  { en: "Chart",         it: "Carta nautica",          category: "navigation", description: "Mappa marina usata per la navigazione." },
  { en: "GPS",           it: "Sistema di posizionamento globale", category: "navigation", description: "Sistema satellitare per determinare la posizione esatta." },
  { en: "Radar",         it: "Radar",                  category: "navigation", description: "Sistema che rileva oggetti usando onde radio." },
  { en: "Sonar",         it: "Sonar",                  category: "navigation", description: "Sistema che usa onde sonore per rilevare oggetti sott'acqua." },
  { en: "Echo sounder",  it: "Ecoscandaglio",          category: "navigation", description: "Strumento che misura la profondità dell'acqua." },
  { en: "ECDIS",         it: "Sistema elettronico di carte nautiche", category: "navigation", description: "Sistema digitale per la visualizzazione delle carte di navigazione." },
  { en: "AIS",           it: "Sistema di identificazione automatica", category: "navigation", description: "Sistema che trasmette posizione e dati della nave ad altre navi." },
  { en: "Nautical mile", it: "Miglio nautico",         category: "navigation", description: "Unità di distanza marina: 1852 metri." },
  { en: "Knot",          it: "Nodo",                   category: "navigation", description: "Unità di velocità nautica: 1 miglio nautico all'ora." },
  { en: "Waypoint",      it: "Punto di rotta",         category: "navigation", description: "Punto intermedio di navigazione definito da coordinate." },
  { en: "Latitude",      it: "Latitudine",             category: "navigation", description: "Distanza angolare dall'equatore, misurata in gradi." },
  { en: "Longitude",     it: "Longitudine",            category: "navigation", description: "Distanza angolare dal meridiano di Greenwich, in gradi." },
  { en: "Compass",       it: "Bussola",                category: "navigation", description: "Strumento che indica il nord magnetico." },
  { en: "Dead reckoning", it: "Navigazione stimata",  category: "navigation", description: "Calcolo della posizione basato su velocità, direzione e tempo." },
  { en: "Pilot",         it: "Pilota",                 category: "navigation", description: "Esperto locale che guida la nave in porti o canali difficili." },
  { en: "Tidal current", it: "Corrente di marea",     category: "navigation", description: "Spostamento orizzontale dell'acqua causato dalle maree." },

  // ENGINE ROOM
  { en: "Main engine",   it: "Motore principale",     category: "engine", description: "Il motore che aziona il propulsore principale della nave." },
  { en: "Boiler",        it: "Caldaia",               category: "engine", description: "Impianto che produce vapore per la propulsione o i servizi di bordo." },
  { en: "Generator",     it: "Generatore",            category: "engine", description: "Produce energia elettrica per la nave." },
  { en: "Bilge pump",    it: "Pompa di sentina",      category: "engine", description: "Pompa che rimuove l'acqua accumulata nel fondo della nave." },
  { en: "Fuel tank",     it: "Serbatoio carburante",  category: "engine", description: "Contenitore del carburante per i motori." },
  { en: "Propeller",     it: "Elica",                 category: "engine", description: "Dispositivo rotante che spinge la nave nell'acqua." },
  { en: "Shaft",         it: "Asse di trasmissione",  category: "engine", description: "Asse che collega il motore all'elica." },
  { en: "Rudder",        it: "Timone",                category: "engine", description: "Superficie mobile sotto la poppa che controlla la direzione." },
  { en: "Throttle",      it: "Acceleratore",          category: "engine", description: "Controllo della velocità del motore." },
  { en: "Gearbox",       it: "Cambio / Riduttore",   category: "engine", description: "Trasmette e modifica la potenza del motore all'elica." },
  { en: "Ballast pump",  it: "Pompa delle zavorre",   category: "engine", description: "Pompa che gestisce l'acqua nelle casse di zavorra." },
  { en: "Cooling system", it: "Sistema di raffreddamento", category: "engine", description: "Sistema che mantiene il motore a temperatura ottimale." },

  // COMMUNICATIONS
  { en: "VHF radio",     it: "Radio VHF",             category: "communications", description: "Radio per comunicazioni marittime a corto raggio (canale 16 per emergenze)." },
  { en: "Mayday",        it: "Mayday",                category: "communications", description: "Segnale di soccorso internazionale via radio. Ripetuto tre volte." },
  { en: "Pan-Pan",       it: "Pan-Pan",               category: "communications", description: "Segnale di urgenza (meno grave del Mayday)." },
  { en: "GMDSS",         it: "Sistema mondiale di soccorso",  category: "communications", description: "Sistema di comunicazione satellitare e radio per emergenze in mare." },
  { en: "EPIRB",         it: "Radioboa di emergenza", category: "communications", description: "Dispositivo che trasmette la posizione via satellite in emergenza." },
  { en: "SART",          it: "Transponder di ricerca e soccorso", category: "communications", description: "Dispositivo che si attiva e trasmette la posizione ai radar di soccorso." },
  { en: "Channel 16",    it: "Canale 16",             category: "communications", description: "Canale VHF internazionale per l'ascolto e le emergenze." },
  { en: "Signal lamp",   it: "Lampada di segnalazione", category: "communications", description: "Lampada per trasmettere messaggi in codice Morse." },
  { en: "IFF system",    it: "Sistema di identificazione amico/nemico", category: "communications", description: "Sistema elettronico che identifica aerei e navi come amici o nemici." },
  { en: "Satellite phone", it: "Telefono satellitare", category: "communications", description: "Telefono che usa satelliti per comunicazioni in aree remote." },
  { en: "Morse code",    it: "Codice Morse",          category: "communications", description: "Sistema di comunicazione che usa punti e linee." },

  // SAFETY
  { en: "Life jacket",   it: "Giubbotto di salvataggio", category: "safety", description: "Dispositivo indossabile che mantiene a galla una persona in acqua." },
  { en: "Life raft",     it: "Zattera di salvataggio",   category: "safety", description: "Zattera gonfiabile per l'evacuazione di emergenza." },
  { en: "Muster station", it: "Punto di raccolta",     category: "safety", description: "Luogo designato dove l'equipaggio si raduna in emergenza." },
  { en: "Abandon ship",  it: "Abbandonare la nave",    category: "safety", description: "Ordine di evacuare la nave in caso di emergenza estrema." },
  { en: "Fire extinguisher", it: "Estintore",         category: "safety", description: "Dispositivo portatile per spegnere piccoli incendi." },
  { en: "Fire hose",     it: "Manichetta antincendio", category: "safety", description: "Tubo flessibile collegato all'impianto antincendio della nave." },
  { en: "SOLAS",         it: "Convenzione sulla sicurezza in mare", category: "safety", description: "Trattato internazionale sulla sicurezza delle navi (Safety of Life at Sea)." },
  { en: "Immersion suit", it: "Tuta di sopravvivenza", category: "safety", description: "Tuta impermeabile che protegge dal freddo in acqua." },
  { en: "Man overboard", it: "Uomo in mare",          category: "safety", description: "Segnalazione di emergenza quando una persona cade in acqua." },
  { en: "Damage control", it: "Controllo dei danni",  category: "safety", description: "Procedure per contenere danni alla nave (allagamenti, incendi)." },
  { en: "Emergency drill", it: "Esercitazione di emergenza", category: "safety", description: "Simulazione periodica delle procedure di emergenza." },

  // SHIP PARTS
  { en: "Hull",          it: "Scafo",                 category: "ship_parts", description: "La struttura principale del corpo della nave." },
  { en: "Bow",           it: "Prua",                  category: "ship_parts", description: "La parte anteriore della nave." },
  { en: "Stern",         it: "Poppa",                 category: "ship_parts", description: "La parte posteriore della nave." },
  { en: "Port",          it: "Babordo (Sinistra)",    category: "ship_parts", description: "Il lato sinistro della nave guardando verso prua." },
  { en: "Starboard",     it: "Tribordo (Destra)",     category: "ship_parts", description: "Il lato destro della nave guardando verso prua." },
  { en: "Bridge",        it: "Plancia di comando",    category: "ship_parts", description: "Il centro di comando e controllo della nave." },
  { en: "Deck",          it: "Coperta / Ponte",       category: "ship_parts", description: "Il pavimento orizzontale della nave." },
  { en: "Keel",          it: "Chiglia",               category: "ship_parts", description: "La struttura longitudinale alla base dello scafo." },
  { en: "Mast",          it: "Albero",                category: "ship_parts", description: "Struttura verticale che porta antenne, radar e segnali." },
  { en: "Anchor",        it: "Ancora",                category: "ship_parts", description: "Dispositivo pesante che trattiene la nave sul fondo." },
  { en: "Funnel",        it: "Fumaiolo",              category: "ship_parts", description: "Camino da cui fuoriescono i gas di scarico del motore." },
  { en: "Helipad",       it: "Piazzola elicotteri",   category: "ship_parts", description: "Area sulla nave destinata all'atterraggio degli elicotteri." },
  { en: "Waterline",     it: "Linea di galleggiamento", category: "ship_parts", description: "La linea dove lo scafo incontra la superficie dell'acqua." },
  { en: "Draft",         it: "Pescaggio",             category: "ship_parts", description: "Profondità della nave sotto la linea di galleggiamento." },
  { en: "Freeboard",     it: "Bordo libero",          category: "ship_parts", description: "Distanza dalla linea di galleggiamento al ponte principale." },
  { en: "Mooring lines", it: "Cavi di ormeggio",     category: "ship_parts", description: "Cavi usati per legare la nave a banchina o boya." },

  // RANKS & ROLES
  { en: "Captain",       it: "Comandante",            category: "ranks", description: "Il massimo responsabile della nave e dell'equipaggio." },
  { en: "First Officer", it: "Primo Ufficiale",       category: "ranks", description: "Ufficiale di grado immediatamente inferiore al comandante." },
  { en: "Chief Engineer", it: "Capo Macchine",        category: "ranks", description: "Responsabile di tutti i sistemi meccanici della nave." },
  { en: "Navigator",     it: "Ufficiale di rotta",    category: "ranks", description: "Responsabile della navigazione e delle carte nautiche." },
  { en: "Helmsman",      it: "Timoniere",             category: "ranks", description: "Chi controlla il timone e mantiene la rotta." },
  { en: "Boatswain",     it: "Nostromo",              category: "ranks", description: "Responsabile delle operazioni di coperta e dell'equipaggio." },
  { en: "Lookout",       it: "Vedetta",               category: "ranks", description: "Membro dell'equipaggio che osserva e segnala pericoli." },
  { en: "Pilot",         it: "Pilota di porto",       category: "ranks", description: "Esperto locale che guida la nave in ingresso/uscita dal porto." },
];
