import { useState } from "react";
import { shipTypes, shipQuestions } from "@/lib/quizData";
import { Plane, Ship, Waves, Anchor, Target, Eye } from "lucide-react"; // v2
import carrierImg from "@assets/AZzOM8EviBgPFGACFMJuAA-AZzOM8EvYcyHuF9kkk6E9g_1773252252710.jpg";
import modernDestroyerImg from "@assets/AZzOvPA5obxU0XB_4Mf13A-AZzOvPA59Ews23LsaByuug_1773252252709.jpg";
import submarineImg from "@assets/AZzOxmv2TQeANEeFHEBG8A-AZzOxmv2lPvWNJdd-9JMwA_1773252252708.jpg";
import frigateImg from "@assets/AZzOumFl0Cnnri88QRRAYw-AZzOumFl-NhYJXndlK7FNQ_1773252252709.jpg";
import corvettteImg from "@assets/AZzOuOH7FhqB7jf_xqD1mw-AZzOuOH74M8KZbKDfo7jNw_1773252252710.jpg";
import patrolVesselImg from "@assets/AZzOvtLASvPkD6yJZigI4g-AZzOvtLAugwaYz9bVtHHPA_1773252252708.jpg";

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
  "Corvette": corvettteImg,
  "Submarine": submarineImg,
  "Patrol Vessel": patrolVesselImg,
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

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-display text-academy-dark">Tipologie di Navi</h2>
          <p className="text-academy-gray text-sm">Clicca su una nave per scoprire descrizione, funzioni e vocabolario tecnico</p>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shipTypes.map((ship, i) => (
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
