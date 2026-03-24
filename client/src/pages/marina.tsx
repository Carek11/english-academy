import { useState } from "react";
import { shipTypes, shipQuestions } from "@/lib/quizData";
import { Plane, Ship, Waves, Anchor, Target, Eye } from "lucide-react"; // v2
import carrierImg from "@assets/AZzOM8EviBgPFGACFMJuAA-AZzOM8EvYcyHuF9kkk6E9g_1773252252710.jpg";
import modernDestroyerImg from "@assets/AZzOvPA5obxU0XB_4Mf13A-AZzOvPA59Ews23LsaByuug_1773252252709.jpg";
import submarineImg from "@assets/AZzOumFl0Cnnri88QRRAYw-AZzOumFl-NhYJXndlK7FNQ_1773252252709.jpg";
import frigateImg from "@assets/AZzOxmv2TQeANEeFHEBG8A-AZzOxmv2lPvWNJdd-9JMwA_1773252252708.jpg";
import corvetteImg from "@assets/AZzOuOH7FhqB7jf_xqD1mw-AZzOuOH74M8KZbKDfo7jNw_1773252252710.jpg";
import patrolVesselImg from "@assets/AZzOvtLASvPkD6yJZigI4g-AZzOvtLAugwaYz9bVtHHPA_1773252252708.jpg";
import cavourImg from "../assets/images/cavour.png";
import friuliImg from "../assets/images/friuli.png";
import todoroImg from "../assets/images/todaro.png";
import americVespucciImg from "../assets/images/amerigo-vespucci.png";
import bergaminiImg from "../assets/images/bergamini.png";
import carabiniereImg from "../assets/images/carabiniere.png";
import carloMagnoImg from "../assets/images/carlo-magno.png";
import orizzonteImg from "../assets/images/orizzonte.png";
import garibaldi_Img from "../assets/images/garibaldi.png";
import chioggiaImg from "../assets/images/chioggia.png";
import minervaImg from "../assets/images/minerva.png";
import danieleManinImg from "../assets/images/daniele-manin.png";

const iconMap: Record<string, React.ComponentType<any>> = {
  "Aircraft Carrier": Plane,
  "Destroyer": Ship,
  "Submarine": Waves,
  "Frigate": Anchor,
  "Corvette": Target,
  "Patrol Vessel": Eye,
};

const ShipIcon = ({ name, size = "md", color = "text-academy-blue" }: { name: string; size?: "sm" | "md" | "lg"; color?: string }) => {
  const sizeMap = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-10 h-10" };
  const Icon = iconMap[name];
  return Icon ? <Icon className={`${sizeMap[size]} ${color}`} /> : null;
};

const navyComponents = [
  { icon: "🧭", title: "Navigation Systems", desc: "GPS, Compass, ECDIS, Radar, AIS." },
  { icon: "⚡", title: "Engine Room", desc: "Main engine, Boiler, Generator, Bilge pump, Fuel tank." },
  { icon: "📡", title: "Communications", desc: "VHF radio, Satellite phone, Signal lamp, IFF system." },
  { icon: "🛟", title: "Safety Equipment", desc: "Life jacket, Life raft, Fire extinguisher, Emergency beacon, Damage control." },
];

const shipImages: Record<string, string> = {
  "Aircraft Carrier": carrierImg,
  "Destroyer": modernDestroyerImg,
  "Frigate": frigateImg,
  "Corvette": corvetteImg,
  "Submarine": submarineImg,
  "Patrol Vessel": patrolVesselImg,
  "Cavour": cavourImg,
  "Friuli": friuliImg,
  "Todaro": todoroImg,
  "Amerigo Vespucci": americVespucciImg,
  "Bergamini": bergaminiImg,
  "Carabiniere": carabiniereImg,
  "Carlo Magno": carloMagnoImg,
  "Orizzonte": orizzonteImg,
  "Garibaldi": garibaldi_Img,
  "Chioggia": chioggiaImg,
  "Minerva": minervaImg,
  "Daniele Manin": danieleManinImg,
};

interface ShipDetail {
  description: string;
  role: string;
  specs: Array<{ label: string; value: string }>;
  functions: Array<{ icon: string; title: string; desc: string }>;
  funFact: string;
}

const shipDetails: Record<string, ShipDetail> = {
  "Aircraft Carrier": {
    description: "La portaerei è la nave da guerra più grande e potente al mondo. Funziona come una vera e propria base aeronavale mobile, capace di proiettare potere aereo in qualsiasi punto degli oceani senza dipendere da basi terrestri.",
    role: "Proiezione di potere aeronavale · Punto di comando delle operazioni · Deterrenza strategica",
    specs: [
      { label: "Lunghezza", value: "270–340 m" },
      { label: "Dislocamento", value: "40.000–100.000 t" },
      { label: "Aeromobili", value: "40–90 velivoli" },
      { label: "Equipaggio", value: "3.000–6.000 marinai" },
      { label: "Velocità", value: "fino a 30+ nodi" },
    ],
    functions: [
      { icon: "✈️", title: "Flight Operations", desc: "Decollo e atterraggio di jet da combattimento, aerei da pattuglia e elicotteri. Il ponte di volo è il cuore della nave." },
      { icon: "🎯", title: "Strike Missions", desc: "Conduce attacchi aerei su obiettivi terrestri e navali fino a centinaia di chilometri di distanza." },
      { icon: "🛡️", title: "Air Defence", desc: "Gli aerei imbarcati proteggono il gruppo d'attacco e scortano le navi alleate contro minacce aeree." },
      { icon: "🧠", title: "Command & Control", desc: "Sede del comandante del gruppo navale, con sistemi avanzati di comunicazione e intelligence." },
    ],
    funFact: "Il ponte di volo di una portaerei nucleare statunitense è lungo come 3 campi da calcio. Gli aerei decollano in meno di 3 secondi grazie alle catapulte a vapore o elettromagnetiche.",
  },
  "Destroyer": {
    description: "Il cacciatorpediniere è una nave da guerra polivalente ad alta velocità, progettata per scortare flotte più grandi e difenderle da sottomarini, aerei e missili. È il principale combattente della marina moderna.",
    role: "Scorta e difesa delle flotte · Guerra antisom e antiaerea · Attacchi con missili da crociera",
    specs: [
      { label: "Lunghezza", value: "140–175 m" },
      { label: "Dislocamento", value: "6.000–10.000 t" },
      { label: "Equipaggio", value: "200–350 marinai" },
      { label: "Velocità", value: "fino a 32 nodi" },
      { label: "Autonomia", value: "4.000–8.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Anti-Aircraft Warfare (AAW)", desc: "Sistema missilistico superficie-aria per abbattere aerei, missili e droni nemici in avvicinamento." },
      { icon: "🤿", title: "Anti-Submarine Warfare (ASW)", desc: "Sonar, elicotteri e siluri per rilevare e distruggere i sottomarini nemici." },
      { icon: "🚀", title: "Land Attack", desc: "Missili da crociera Tomahawk possono colpire obiettivi terrestri a oltre 1.600 km di distanza." },
      { icon: "🛡️", title: "Fleet Escort", desc: "Protegge le portaerei e le navi da trasporto durante le operazioni in zona di guerra." },
    ],
    funFact: "Il nome 'Destroyer' deriva dall'originale 'Torpedo Boat Destroyer': navi veloci progettate per eliminare le piccole e insidiose torpediniere del XIX secolo.",
  },
  "Submarine": {
    description: "Il sottomarino è la nave da guerra più silenziosa e letale dei mari. Opera in immersione per settimane, invisibile ai radar e difficilissimo da individuare. Può lanciare missili balistici o siluri con estrema precisione.",
    role: "Attacchi furtivi · Intelligence e raccolta dati · Deterrenza nucleare (sottomarini SSBN)",
    specs: [
      { label: "Lunghezza", value: "60–175 m" },
      { label: "Dislocamento", value: "1.500–23.000 t in immersione" },
      { label: "Equipaggio", value: "50–160 marinai" },
      { label: "Profondità operativa", value: "200–600 m" },
      { label: "Autonomia", value: "illimitata (se nucleare)" },
    ],
    functions: [
      { icon: "🎯", title: "Torpedo Attack", desc: "Siluri ad alta velocità per affondare navi di superficie e altri sottomarini." },
      { icon: "🚀", title: "Cruise Missile Launch", desc: "Missili da crociera lanciabili in immersione per colpire obiettivi terrestri e navali." },
      { icon: "👁️", title: "Intelligence (ISR)", desc: "Raccolta di segnali, fotografie e dati operativi nelle acque nemiche, senza essere rilevati." },
      { icon: "☢️", title: "Nuclear Deterrence", desc: "I sottomarini SSBN trasportano missili balistici intercontinentali, componente chiave della deterrenza nucleare." },
    ],
    funFact: "I sottomarini nucleari non devono mai fare rifornimento di carburante: la loro batteria di fissione nucleare può durare decenni. Il limite all'autonomia è solo il cibo a bordo per l'equipaggio.",
  },
  "Frigate": {
    description: "La fregata è una nave da guerra polivalente, più piccola del cacciatorpediniere ma estremamente versatile. È la spina dorsale di molte marine europee, tra cui la Marina Militare Italiana con le sue fregate FREMM.",
    role: "Pattugliamento oceanicoanti · ASW e AAW · Protezione dei convogli · Operazioni anfibie",
    specs: [
      { label: "Lunghezza", value: "120–160 m" },
      { label: "Dislocamento", value: "3.500–7.000 t" },
      { label: "Equipaggio", value: "150–250 marinai" },
      { label: "Velocità", value: "fino a 27 nodi" },
      { label: "Autonomia", value: "6.000–8.000 miglia" },
    ],
    functions: [
      { icon: "🚁", title: "Helicopter Operations", desc: "La piazzola elicotteri permette operazioni di pattuglia antisom, SAR e trasporto truppe." },
      { icon: "🤿", title: "Anti-Submarine Warfare", desc: "Sonar a traino e a scafo, sommozzatori e siluri per caccia ai sottomarini." },
      { icon: "🛡️", title: "Convoy Escort", desc: "Protegge navi mercantili e navi da trasporto militare nelle zone ad alta minaccia." },
      { icon: "📡", title: "C2 & Surveillance", desc: "Radar avanzati e sistemi di comunicazione satellitare per coordinare le operazioni navali." },
    ],
    funFact: "La fregata FREMM (Fregata Europea Multi-Missione) è un progetto italo-francese. La Marina Militare Italiana ne opera 10, tra le più avanzate al mondo nel loro categoria.",
  },
  "Corvette": {
    description: "La corvetta è una nave da guerra leggera e veloce, ideale per operazioni costiere e di pattugliamento. Nonostante le dimensioni ridotte, è armata con missili e sistemi avanzati, rendendola formidabile nelle acque ristrette.",
    role: "Pattugliamento costiero · Contrasto alle imbarcazioni veloci · Supporto anfibie",
    specs: [
      { label: "Lunghezza", value: "60–130 m" },
      { label: "Dislocamento", value: "500–3.000 t" },
      { label: "Equipaggio", value: "40–120 marinai" },
      { label: "Velocità", value: "fino a 35 nodi" },
      { label: "Autonomia", value: "2.000–4.000 miglia" },
    ],
    functions: [
      { icon: "🌊", title: "Coastal Patrol", desc: "Sorveglianza e controllo delle acque territoriali, intercettazione di imbarcazioni sospette." },
      { icon: "🎯", title: "Anti-Surface Warfare", desc: "Missili superficie-superficie per ingaggiare navi nemiche in ambienti costieri complessi." },
      { icon: "🔱", title: "Mine Countermeasures", desc: "Alcune corvette sono equipaggiate per rilevare e neutralizzare mine navali." },
      { icon: "🚁", title: "Light Aviation", desc: "Piazzola per elicotteri leggeri per ricognizione e operazioni SAR." },
    ],
    funFact: "Le corvette classe Minerva della Marina Militare Italiana erano famose per la loro efficacia nel Mediterraneo. Sono state poi sostituite dai più moderni pattugliatori d'altura.",
  },
  "Patrol Vessel": {
    description: "Il pattugliatore (o pattugliatore d'altura) è una nave progettata per le operazioni di sorveglianza marittima, ricerca e soccorso (SAR), contrasto all'immigrazione irregolare e lotta al contrabbando. Combina versatilità e resistenza.",
    role: "Sorveglianza marittima · Operazioni SAR · Contrasto a traffici illeciti · Pattugliamento EEZ",
    specs: [
      { label: "Lunghezza", value: "50–100 m" },
      { label: "Dislocamento", value: "400–1.500 t" },
      { label: "Equipaggio", value: "30–80 marinai" },
      { label: "Velocità", value: "fino a 25 nodi" },
      { label: "Autonomia", value: "3.000–6.000 miglia" },
    ],
    functions: [
      { icon: "🔭", title: "Maritime Surveillance", desc: "Pattugliamento della Zona Economica Esclusiva (ZEE) per proteggere le risorse marine nazionali." },
      { icon: "🛟", title: "Search and Rescue (SAR)", desc: "Soccorso di naufraghi e imbarcazioni in difficoltà, una delle missioni più frequenti nel Mediterraneo." },
      { icon: "🚔", title: "Law Enforcement", desc: "Contrasto al traffico di droghe, armi e esseri umani nelle acque internazionali." },
      { icon: "🌡️", title: "Environmental Protection", desc: "Monitoraggio dell'inquinamento marino e sversamenti di idrocarburi." },
    ],
    funFact: "La Marina Militare Italiana coordina le operazioni SAR nel Mediterraneo centrale, uno dei tratti di mare più trafficati e pericolosi al mondo. I pattugliatori sono la prima risposta nelle emergenze in mare.",
  },
  "Cavour": {
    description: "La Cavour è la portaerei della Marina Militare Italiana e il fiore all'occhiello della flotta. Imbarba aerei F-35B e elicotteri, fungendo da base mobile per operazioni in acque lontane dalle coste italiane.",
    role: "Proiezione di potere aereo · Comando flotta · Operazioni multinazionali",
    specs: [
      { label: "Lunghezza", value: "230 m" },
      { label: "Dislocamento", value: "27.500 t" },
      { label: "Aeromobili", value: "fino a 10 F-35B + elicotteri" },
      { label: "Equipaggio", value: "~1.200 marinai" },
      { label: "Velocità", value: "28 nodi" },
    ],
    functions: [
      { icon: "✈️", title: "STOL Operations", desc: "Decolla e atterra gli F-35B in spazi ristretti senza catapulte." },
      { icon: "🚁", title: "Helicopter Transport", desc: "Trasporta elicotteri per SAR, ricognizione e supporto anfibio." },
      { icon: "🧠", title: "Flagship Operations", desc: "Centro comando per operazioni navali multinazionali nel Mediterraneo." },
      { icon: "🛡️", title: "Self Defence", desc: "Sistema missilistico ESSM per la difesa della nave e della flotta." },
    ],
    funFact: "La Cavour è stata la prima nave da guerra italiana ad imbarcare aerei F-35 e rappresenta il simbolo della modernizzazione della Marina Militare Italiana.",
  },
  "Friuli": {
    description: "La Friuli è una fregata FREMM della classe più moderna della Marina Militare Italiana. Specializzata in guerra antisom e antiaerea, è equipaggiata con sistemi di combattimento avanzati.",
    role: "Scorta flotta · Anti-submarine warfare · Difesa aerea integrata",
    specs: [
      { label: "Lunghezza", value: "144 m" },
      { label: "Dislocamento", value: "6.700 t" },
      { label: "Equipaggio", value: "~200 marinai" },
      { label: "Velocità", value: "27 nodi" },
      { label: "Autonomia", value: "6.000 miglia" },
    ],
    functions: [
      { icon: "🤿", title: "Anti-Submarine Warfare", desc: "Sonar avanzato, siluri leggeri e elicottero NH90 per caccia ai sottomarini." },
      { icon: "🎯", title: "Air Defence", desc: "Missili ESSM e cannone OTO Melara per protezione aerea." },
      { icon: "🚁", title: "Helicopter Ops", desc: "Piazzola dedicata per elicotteri da combattimento e SAR." },
      { icon: "📡", title: "Network Ops", desc: "Integrata in reti tattiche NATO per operazioni multinazionali." },
    ],
    funFact: "Le fregate FREMM sono esportate a 7 paesi NATO e rappresentano uno dei maggiori successi industriali della difesa europea.",
  },
  "Todaro": {
    description: "Il Todaro è un sottomarino diesel-elettrico della classe Todaro con propulsione AIP (indipendente dall'aria). Specializzato in operazioni antisom e spionaggio sottomarino nel Mediterraneo.",
    role: "Operazioni ASW · Intelligence sottomarina · Deterrenza tattica",
    specs: [
      { label: "Lunghezza", value: "80 m" },
      { label: "Dislocamento", value: "2.000 t in immersione" },
      { label: "Equipaggio", value: "~50 marinai" },
      { label: "Profondità operativa", value: "300 m" },
      { label: "Autonomia", value: "8.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Torpedo Attack", desc: "Siluri Black Shark per attacchi antisom e anti-nave in immersione." },
      { icon: "👁️", title: "Surveillance", desc: "Rilevamento passivo di sottomarini e navi nemiche tramite sonar." },
      { icon: "🤿", title: "Mine Deployment", desc: "Capacità di posare mine navali nelle acque nemiche." },
      { icon: "📡", title: "Intelligence", desc: "Raccolta di segnali e dati tattici per la Difesa." },
    ],
    funFact: "La propulsione AIP consente al Todaro di restare sott'acqua per settimane senza affiorare, rendendo la scoperta estremamente difficile.",
  },
  "Amerigo Vespucci": {
    description: "La nave scuola Amerigo Vespucci è il simbolo della Marina Militare Italiana. Costruita nel 1931, naviga ancora con le sue storiche 24 vele quadre e addeestra giovani ufficiali e sottoufficiali.",
    role: "Formazione marinai · Diplomazia navale · Conservazione del patrimonio storico",
    specs: [
      { label: "Lunghezza", value: "101 m" },
      { label: "Dislocamento", value: "3.600 t" },
      { label: "Equipaggio", value: "~400 giovani in addestramento" },
      { label: "Velocità", value: "12 nodi a vela" },
      { label: "Anno costruzione", value: "1931" },
    ],
    functions: [
      { icon: "⛵", title: "Sail Training", desc: "Addestramento dei giovani ufficiali e marinai della Marina Militare alle tecniche di navigazione tradizionali." },
      { icon: "📚", title: "Naval Tradition", desc: "Preservazione delle tradizioni navali e della cultura marittima italiana." },
      { icon: "🌍", title: "Diplomacy", desc: "Ambasciatrice dell'Italia nei porti del mondo, rappresenta il patrimonio storico nazionale." },
      { icon: "🧭", title: "Celestial Navigation", desc: "Insegna la navigazione astronomica e il know-how nautico classico." },
    ],
    funFact: "L'Amerigo Vespucci ha circumnavigato il mondo decine di volte ed è una delle navi più fotografate della Marina Militare Italiana. È stata utilizzata come nave scuola ininterrottamente per oltre 90 anni.",
  },
  "Bergamini": {
    description: "La Bergamini è la seconda fregata FREMM della Marina Militare Italiana. Equipaggiata con i sistemi più moderni, opera nel Mediterraneo e oltre per proteggere interessi nazionali e multinazionali.",
    role: "Difesa flotta · Pattugliamento oceanico · Operazioni congiunte NATO",
    specs: [
      { label: "Lunghezza", value: "144 m" },
      { label: "Dislocamento", value: "6.700 t" },
      { label: "Equipaggio", value: "~200 marinai" },
      { label: "Velocità", value: "27 nodi" },
      { label: "Autonomia", value: "6.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Multi-Mission", desc: "Capacità di condurre simultaneamente operazioni ASW, AAW e pattugliamento." },
      { icon: "🚁", title: "Helicopter Ops", desc: "NH90 per operazioni antisom e ricerca-soccorso." },
      { icon: "📡", title: "Integrated Combat", desc: "CMS integrato per coordinare attacchi con altre navi e aerei." },
      { icon: "🌊", title: "Extended Patrol", desc: "Autonomia per operazioni prolungate nel Golfo Persico e Indo-Pacifico." },
    ],
    funFact: "La Bergamini ha operato in zone critiche come il Golfo Persico e il Mar Rosso, dimostrando la versatilità e l'affidabilità della classe FREMM.",
  },
  "Carabiniere": {
    description: "La Carabiniere è la terza fregata FREMM italiana. Rappresenta il vertice della tecnologia navale italiana e opera in scenari complessi del Mediterraneo e oltre.",
    role: "Operazioni avanzate · Deterrenza · Protezione delle rotte commerciali",
    specs: [
      { label: "Lunghezza", value: "144 m" },
      { label: "Dislocamento", value: "6.700 t" },
      { label: "Equipaggio", value: "~200 marinai" },
      { label: "Velocità", value: "27 nodi" },
      { label: "Autonomia", value: "6.000 miglia" },
    ],
    functions: [
      { icon: "🛡️", title: "Force Protection", desc: "Protezione di convogli e operazioni anfibie in acque contese." },
      { icon: "👁️", title: "Surveillance", desc: "Radar avanzato e sistemi optoelettronici per rilevamento a lungo raggio." },
      { icon: "🎯", title: "Strike Capability", desc: "Missili antinave Teseo per deterrenza contro minacce navali." },
      { icon: "🚁", title: "Aviation Support", desc: "Supporto a elicotteri armati per operazioni complesse." },
    ],
    funFact: "La Carabiniere è stata tra le prime navi europee a dispiegare il sistema FREMM completo di tutte le capacità tattiche moderne.",
  },
  "Carlo Magno": {
    description: "La Carlo Magno è la quarta e ultima fregata FREMM della Marina Militare Italiana. Rappresenta l'evoluzione ulteriore della classe con miglioramenti tecnologici e sistemi aggiornati.",
    role: "Operazioni multinazionali · Protezione dell'Artide e Indo-Pacifico",
    specs: [
      { label: "Lunghezza", value: "144 m" },
      { label: "Dislocamento", value: "6.700 t" },
      { label: "Equipaggio", value: "~200 marinai" },
      { label: "Velocità", value: "27 nodi" },
      { label: "Autonomia", value: "6.000 miglia" },
    ],
    functions: [
      { icon: "🌍", title: "Global Deployment", desc: "Capace di operazioni prolungate in scenari lontani dal Mediterraneo." },
      { icon: "🤿", title: "Advanced ASW", desc: "Sistemi sonar più raffinati e siluri aggiornati rispetto alle sorelle." },
      { icon: "📡", title: "Network Integration", desc: "Piattaforma nodal di reti tattiche NATO più recenti." },
      { icon: "🔬", title: "Tech Innovation", desc: "Equipaggiata con sistemi sperimentali e innovativi per la Marina." },
    ],
    funFact: "La Carlo Magno è stata tra le ultime fregate FREMM consegnate e incorpora le lezioni apprese dalle navi precedenti, rendendola una delle più avanzate della classe.",
  },
  "Orizzonte": {
    description: "L'Orizzonte è il primo cacciatorpediniere della sua classe, specializzato in difesa aerea integrata. È il sistema d'arma più sofisticato della Marina Militare Italiana per la difesa della flotta.",
    role: "Difesa aerea flotta · Comando tattico · Operazioni complesse",
    specs: [
      { label: "Lunghezza", value: "155 m" },
      { label: "Dislocamento", value: "7.500 t" },
      { label: "Equipaggio", value: "~250 marinai" },
      { label: "Velocità", value: "30 nodi" },
      { label: "Autonomia", value: "7.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Air Defence System", desc: "Missili Aster ad altissima quota per protezione contro minacce aeree molteplici." },
      { icon: "🤿", title: "Anti-Submarine", desc: "Siluri e sonar per guerra antisom coordinata." },
      { icon: "📡", title: "Command & Control", desc: "Centro di controllo tattico per coordinate le operazioni della flotta." },
      { icon: "🛡️", title: "Close Defence", desc: "Cannone OTO Melara e sistemi CIWS per difesa ravvicinata." },
    ],
    funFact: "L'Orizzonte è la nave da guerra più tecnologicamente avanzata della Marina Militare Italiana, con capacità di dirigere operazioni su un raggio di centinaia di chilometri.",
  },
  "Garibaldi": {
    description: "Il Garibaldi è il secondo cacciatorpediniere della classe Orizzonte. Fratello dell'Orizzonte, rappresenta la potenza di fuoco e il comando tattico della Marina Militare Italiana.",
    role: "Difesa aerea integrata · Leadership flotta · Protezione task force",
    specs: [
      { label: "Lunghezza", value: "155 m" },
      { label: "Dislocamento", value: "7.500 t" },
      { label: "Equipaggio", value: "~250 marinai" },
      { label: "Velocità", value: "30 nodi" },
      { label: "Autonomia", value: "7.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Integrated Air Defence", desc: "Aster 15/30 per protezione a 360° della flotta." },
      { icon: "🚀", title: "Anti-Ship Warfare", desc: "Harpoon e Teseo per deterrenza antisuperficie." },
      { icon: "🧠", title: "Flagship Role", desc: "Spesso ammiraglia di task force multinazionali." },
      { icon: "📡", title: "Network Warfare", desc: "Integrata in sistemi C4I avanzati per la coordinazione tattica." },
    ],
    funFact: "Il Garibaldi ha partecipato a numerose operazioni internazionali, dal Golfo Persico alle acque africane, dimostrando l'affidabilità della sua classe.",
  },
  "Chioggia": {
    description: "La Chioggia è il terzo cacciatorpediniere della classe Orizzonte. Completa la triade di difesa aerea della Marina Militare Italiana e mantiene la continuità operativa della classe.",
    role: "Difesa aerea · Pattugliamento oceanico · Operazioni step-up",
    specs: [
      { label: "Lunghezza", value: "155 m" },
      { label: "Dislocamento", value: "7.500 t" },
      { label: "Equipaggio", value: "~250 marinai" },
      { label: "Velocità", value: "30 nodi" },
      { label: "Autonomia", value: "7.000 miglia" },
    ],
    functions: [
      { icon: "🎯", title: "Multi-Layered Defence", desc: "Aster 15 e 30 per difesa a più livelli da minacce aeree." },
      { icon: "🤿", title: "ASW Capability", desc: "Equipaggiata con sonar a traino Kingklip e elicotteri." },
      { icon: "📡", title: "Data Link", desc: "Nodo di rete Link 16 e Link 22 per coordinamento tattico." },
      { icon: "🛡️", title: "Self Defence", desc: "CIWS Phalanx per protezione ravvicinata." },
    ],
    funFact: "La Chioggia ha incorporato i miglioramenti operativi appresi dalle due sorelle, rendendola una piattaforma ancora più sofisticata.",
  },
  "Minerva": {
    description: "La Minerva è una corvetta della classe Minerva della Marina Militare Italiana. Specializzata in pattugliamento costiero e operazioni anfibie, è una nave agile e ben armata per acque ristrette.",
    role: "Pattugliamento costiero · Operazioni anfibie · Protezione ZEE",
    specs: [
      { label: "Lunghezza", value: "88 m" },
      { label: "Dislocamento", value: "1.300 t" },
      { label: "Equipaggio", value: "~100 marinai" },
      { label: "Velocità", value: "20 nodi" },
      { label: "Autonomia", value: "4.000 miglia" },
    ],
    functions: [
      { icon: "🌊", title: "Coastal Patrol", desc: "Pattugliamento costiero per protezione della ZEE italiana e contrasto a traffici illeciti." },
      { icon: "🎯", title: "Shallow Water Combat", desc: "Cannone OTO Melara 76mm per operazioni in acque ristrette." },
      { icon: "🚁", title: "Helicopter Support", desc: "Piazzola per elicotteri AB-212 per operazioni e SAR." },
      { icon: "🛡️", title: "Mine Warfare", desc: "Equipaggiata per operazioni di sminamento costiero." },
    ],
    funFact: "La classe Minerva è rimasta operativa per decenni nel Mediterraneo e ha provato l'efficacia del design italiano in operazioni costiere complesse.",
  },
  "Daniele Manin": {
    description: "La Daniele Manin è la gemella della Minerva nella classe omonima. Continua la tradizione italiana di corvette specializzate in operazioni nel Mediterraneo e acque costiere.",
    role: "Operazioni marittime costiere · Supporto operazioni anfibie",
    specs: [
      { label: "Lunghezza", value: "88 m" },
      { label: "Dislocamento", value: "1.300 t" },
      { label: "Equipaggio", value: "~100 marinai" },
      { label: "Velocità", value: "20 nodi" },
      { label: "Autonomia", value: "4.000 miglia" },
    ],
    functions: [
      { icon: "🌊", title: "Naval Operations", desc: "Operazioni tattiche in acque ristrette e costiere del Mediterraneo." },
      { icon: "🎯", title: "Firepower", desc: "Cannone da 76mm e sistemi di artiglieria per fuoco di supporto." },
      { icon: "👁️", title: "Surveillance", desc: "Radar moderno per rilevamento di bersagli di superficie." },
      { icon: "🤝", title: "Coalition Warfare", desc: "Capacità di operare in coalizioni multinazionali nel Mediterraneo." },
    ],
    funFact: "La Daniele Manin e la Minerva hanno servito come piattaforme sperimentali per nuove tattiche navali e tecnologie di combattimento italiane.",
  },
};

interface ShipDetailModalProps {
  ship: typeof shipTypes[0];
  detail: ShipDetail;
  image: string | null;
  onClose: () => void;
}

function ShipQuizModal({ shipName, onClose, onBack }: { shipName: string; onClose: () => void; onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [round, setRound] = useState(1);

  const questions = shipQuestions[shipName] || [];
  if (questions.length === 0) return null;

  const q = questions[currentQ % questions.length];
  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (questions[currentQ % questions.length].correct === idx) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ < 9) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setRound(r => r + 1);
      setCurrentQ(0);
      setScore(0);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[160] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-academy-blue p-4 text-white flex justify-between items-center">
          <h3 className="font-bold">🎯 Quiz: {shipName}</h3>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between text-sm font-semibold">
            <span>Domanda {currentQ + 1}/10</span>
            <span className="text-academy-blue">⭐ {score}/10</span>
          </div>
          <h4 className="text-lg font-bold text-academy-dark">{q.question}</h4>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={`w-full p-3 text-left rounded-lg font-semibold transition-all border-2 ${answered ? (i === q.correct ? "bg-green-100 border-green-400" : i === selectedAnswer ? "bg-red-100 border-red-400" : "bg-gray-50 border-transparent") : "bg-academy-bg border-transparent hover:border-academy-blue"}`}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          {answered && <div className={`p-3 text-center rounded-lg font-semibold ${selectedAnswer === q.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {selectedAnswer === q.correct ? "✓ Corretto!" : `✗ Sbagliato! Risposta: ${String.fromCharCode(65 + q.correct)}`}
          </div>}
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 py-2 border-2 border-academy-blue text-academy-blue rounded-lg font-semibold hover:bg-academy-blue hover:text-white transition-colors">← Indietro</button>
            <button onClick={handleNext} disabled={!answered} className="flex-1 py-2 bg-academy-blue text-white rounded-lg font-semibold hover:bg-academy-light-blue transition-colors disabled:opacity-50">{currentQ < 9 ? "Prossima →" : "Nuovo Round →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShipDetailModal({ ship, detail, image, onClose }: ShipDetailModalProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  
  if (showQuiz) return <ShipQuizModal shipName={ship.name} onClose={onClose} onBack={() => setShowQuiz(false)} />;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-[150] flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con immagine */}
        <div className="relative h-64 bg-academy-dark overflow-hidden sticky top-0 z-10 flex-shrink-0">
          {image ? (
            <img src={image} alt={ship.name} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="flex items-center justify-center h-full text-8xl">{ship.icon}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-80 transition-colors text-lg font-bold"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-white"><ShipIcon name={ship.name} size="lg" color="text-white" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white font-display">{ship.name}</h2>
                <p className="text-academy-gold font-semibold text-sm">{ship.nameIt}</p>
              </div>
            </div>
            <p className="text-white text-xs opacity-70 mt-1">{detail.role}</p>
          </div>
        </div>

        <div className="p-6 space-y-7 overflow-y-auto flex-1">
          {/* Descrizione */}
          <p className="text-academy-dark leading-relaxed text-base">{detail.description}</p>

          {/* Specifiche tecniche */}
          <div>
            <h3 className="font-bold text-academy-blue text-sm uppercase tracking-wide mb-3">📐 Caratteristiche tecniche</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {detail.specs.map((s, i) => (
                <div key={i} className="bg-academy-bg rounded-xl p-3 text-center">
                  <div className="text-xs text-academy-gray font-semibold uppercase tracking-wide">{s.label}</div>
                  <div className="font-bold text-academy-dark text-sm mt-1">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Funzioni */}
          <div>
            <h3 className="font-bold text-academy-blue text-sm uppercase tracking-wide mb-3">⚙️ Funzioni principali</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detail.functions.map((fn, i) => (
                <div key={i} className="flex gap-3 p-4 bg-academy-bg rounded-xl">
                  <span className="text-2xl flex-shrink-0">{fn.icon}</span>
                  <div>
                    <div className="font-bold text-academy-dark text-sm">{fn.title}</div>
                    <div className="text-academy-gray text-xs leading-relaxed mt-0.5">{fn.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Componenti bilingue */}
          <div>
            <h3 className="font-bold text-academy-blue text-sm uppercase tracking-wide mb-3">📖 Vocabolario tecnico</h3>
            <div className="grid grid-cols-2 gap-2">
              {ship.components.map((comp, i) => (
                <div key={i} className="p-3 border-l-2 border-academy-gold bg-academy-bg rounded-r-lg">
                  <div className="font-bold text-academy-dark text-sm">{comp.en}</div>
                  <div className="text-academy-gray text-xs">{comp.it}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun fact */}
          <div className="bg-academy-blue bg-opacity-5 border border-academy-blue border-opacity-20 rounded-xl p-4">
            <div className="text-academy-blue font-bold text-sm mb-1">💡 Lo sapevi?</div>
            <p className="text-academy-dark text-sm leading-relaxed">{detail.funFact}</p>
          </div>

          {/* Quiz Button */}
          <button onClick={() => setShowQuiz(true)} className="w-full py-3 bg-academy-gold text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors text-base">
            🎯 Fai il Quiz su {ship.name} →
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-85 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-3xl opacity-80 hover:opacity-100 leading-none"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
        />
        <p className="text-center text-white text-sm mt-3 opacity-70">{alt}</p>
      </div>
    </div>
  );
}

export default function MarinaPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const [selectedShip, setSelectedShip] = useState<typeof shipTypes[0] | null>(null);

  const selectedDetail = selectedShip ? shipDetails[selectedShip.name] : null;
  const selectedImage = selectedShip ? (shipImages[selectedShip.name] ?? null) : null;

  return (
    <div className="space-y-24">
      {zoomedImage && (
        <ImageLightbox
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
        />
      )}

      {selectedShip && selectedDetail && (
        <ShipDetailModal
          ship={selectedShip}
          detail={selectedDetail}
          image={selectedImage}
          onClose={() => setSelectedShip(null)}
        />
      )}

      <section className="bg-gradient-to-r from-academy-blue to-academy-dark text-white p-12 rounded-xl space-y-6">
        <div className="text-base font-display font-semibold opacity-90 tracking-wider">⚓ INGLESE TECNICO – MARINA MILITARE</div>
        <h2 className="text-4xl font-bold font-display leading-tight">Le Navi e i Componenti Navali</h2>
        <p className="text-xl opacity-90 leading-relaxed max-w-3xl font-light">
          Impara la terminologia inglese delle principali imbarcazioni militari e dei loro componenti. Ogni scheda è bilingue.
        </p>
      </section>

      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-display text-academy-dark">Tipologie di Navi</h2>
          <p className="text-academy-gray text-sm">Clicca su una nave per scoprire descrizione, funzioni e vocabolario tecnico</p>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        {/* Navi Generiche */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-display text-academy-blue border-b-2 border-academy-gold pb-2">🌍 Navi Generiche</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipTypes.filter(s => s.category === "Generic").map((ship, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-48 bg-academy-bg overflow-hidden flex items-center justify-center cursor-zoom-in group relative"
                onClick={() => shipImages[ship.name] && setZoomedImage({ src: shipImages[ship.name], alt: `${ship.name} – ${ship.nameIt}` })}
              >
                {/* Icona sempre di base */}
                <div className="absolute inset-0 flex items-center justify-center bg-academy-bg">
                  <div className="text-academy-blue opacity-40"><ShipIcon name={ship.name} size="lg" /></div>
                </div>
                
                {/* Immagine se disponibile */}
                {shipImages[ship.name] && (
                  <>
                    <img
                      src={shipImages[ship.name]}
                      alt={ship.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center z-20">
                      <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">🔍</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-5 bg-academy-bg border-b border-academy-gold">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0"><ShipIcon name={ship.name} size="md" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-academy-dark">{ship.name}</h3>
                    <span className="text-academy-gold font-semibold text-sm">{ship.nameIt}</span>
                  </div>
                  <button
                    data-testid={`button-ship-detail-${i}`}
                    onClick={() => setSelectedShip(ship)}
                    className="flex-shrink-0 px-4 py-2 bg-academy-blue text-white text-xs font-bold rounded-lg hover:bg-academy-light-blue transition-colors"
                  >
                    Scopri di più →
                  </button>
                </div>
              </div>
            </div>
          ))}
            </div>
          </div>

        {/* Navi Italiane */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-display text-academy-blue border-b-2 border-academy-gold pb-2">Navi Italiane della Marina Militare</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipTypes.filter(s => s.category === "Italian").map((ship, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-48 bg-academy-bg overflow-hidden flex items-center justify-center cursor-zoom-in group relative"
                onClick={() => shipImages[ship.name] && setZoomedImage({ src: shipImages[ship.name], alt: `${ship.name} – ${ship.nameIt}` })}
              >
                {/* Icona sempre di base */}
                <div className="absolute inset-0 flex items-center justify-center bg-academy-bg">
                  <div className="text-academy-blue opacity-40"><ShipIcon name={ship.name} size="lg" /></div>
                </div>
                
                {/* Immagine se disponibile */}
                {shipImages[ship.name] && (
                  <>
                    <img
                      src={shipImages[ship.name]}
                      alt={ship.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center z-20">
                      <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">🔍</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-5 bg-academy-bg border-b border-academy-gold">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0"><ShipIcon name={ship.name} size="md" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-academy-dark">{ship.name}</h3>
                    <span className="text-academy-gold font-semibold text-sm">{ship.nameIt}</span>
                  </div>
                  <button
                    data-testid={`button-ship-detail-${i}`}
                    onClick={() => setSelectedShip(ship)}
                    className="flex-shrink-0 px-4 py-2 bg-academy-blue text-white text-xs font-bold rounded-lg hover:bg-academy-light-blue transition-colors"
                  >
                    Scopri di più →
                  </button>
                </div>
              </div>
            </div>
            ))}
            </div>
          </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-academy-dark">Componenti della Marina Militare:</h2>
          <p className="text-academy-gray text-sm">Clicca su un argomento per gli esercizi specifici</p>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navyComponents.map((comp, i) => (
            <button
              key={i}
              onClick={() => onNavigate("quiz-marina")}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center group border-2 border-transparent hover:border-academy-gold cursor-pointer"
            >
              <div className="text-5xl mb-3">{comp.icon}</div>
              <h3 className="font-bold text-academy-dark text-lg group-hover:text-academy-blue transition-colors">{comp.title}</h3>
              <p className="text-academy-gray text-sm">{comp.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="text-center">
        <button
          onClick={() => onNavigate("quiz-marina")}
          className="px-8 py-4 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors text-lg"
        >
          ⚓ Metti alla prova le tue conoscenze navali →
        </button>
      </section>
    </div>
  );
}
