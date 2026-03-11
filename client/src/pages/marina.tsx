import { shipTypes } from "@/lib/quizData";
import destroyerTopImg from "@assets/AZzOxmv2TQeANEeFHEBG8A-AZzOxmv2lPvWNJdd-9JMwA_1773251962760.jpg";
import commandCenterImg from "@assets/AZzOvtLASvPkD6yJZigI4g-AZzOvtLAugwaYz9bVtHHPA_1773251962760.jpg";
import modernDestroyerImg from "@assets/AZzOvPA5obxU0XB_4Mf13A-AZzOvPA59Ews23LsaByuug_1773251962761.jpg";
import frigateImg from "@assets/AZzOu1Ntrknm8qmEucepHQ-AZzOu1NtMmZiqfvN0q-AbQ_1773251962761.jpg";
import submarineImg from "@assets/AZzOumFl0Cnnri88QRRAYw-AZzOumFl-NhYJXndlK7FNQ_1773251962761.jpg";
import patrolVesselImg from "@assets/AZzOuOH7FhqB7jf_xqD1mw-AZzOuOH74M8KZbKDfo7jNw_1773251962762.jpg";

const commonComponents = [
  { icon: "🧭", title: "Navigation Systems", desc: "GPS, Compass, ECDIS, Radar, AIS." },
  { icon: "⚡", title: "Engine Room", desc: "Main engine, Boiler, Generator, Bilge pump, Fuel tank." },
  { icon: "📡", title: "Communications", desc: "VHF radio, Satellite phone, Signal lamp, IFF system." },
  { icon: "🛟", title: "Safety Equipment", desc: "Life jacket, Life raft, Fire extinguisher, Emergency beacon, Damage control." },
];

const shipImages: Record<string, string> = {
  "Aircraft Carrier": destroyerTopImg,
  "Destroyer": modernDestroyerImg,
  "Frigate": frigateImg,
  "Corvette": patrolVesselImg,
  "Submarine": submarineImg,
  "Patrol Vessel": commandCenterImg,
};

export default function MarinaPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-16">
      <section className="bg-gradient-to-r from-academy-blue to-academy-dark text-white p-8 rounded-xl space-y-4">
        <div className="text-sm font-semibold opacity-90">⚓ INGLESE TECNICO – MARINA MILITARE</div>
        <h2 className="text-4xl font-bold font-display">Le Navi e i Componenti Navali</h2>
        <p className="text-lg opacity-90">
          Impara la terminologia inglese delle principali imbarcazioni militari e dei loro componenti. Ogni scheda è bilingue.
        </p>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-display text-academy-dark">Tipologie di Navi</h2>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shipTypes.map((ship, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-academy-bg overflow-hidden flex items-center justify-center">
                {shipImages[ship.name] ? (
                  <img src={shipImages[ship.name]} alt={ship.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">{ship.icon}</span>
                )}
              </div>
              <div className="p-6 bg-academy-bg border-b border-academy-gold">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{ship.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-academy-dark">{ship.name}</h3>
                    <span className="text-academy-gold font-semibold text-sm">{ship.nameIt}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {ship.components.map((comp, j) => (
                    <li key={j} className="text-sm">
                      <span className="font-semibold text-academy-blue">{comp.en}</span>
                      <br />
                      <span className="text-academy-gray text-xs">{comp.it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-display text-academy-dark">Componenti Comuni</h2>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commonComponents.map((comp, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{comp.icon}</div>
              <h3 className="font-bold text-academy-dark mb-2">{comp.title}</h3>
              <p className="text-academy-gray text-sm">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <button
          onClick={() => onNavigate("quiz")}
          className="px-8 py-4 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors text-lg"
        >
          ⚓ Metti alla prova le tue conoscenze navali →
        </button>
      </section>
    </div>
  );
}
