import { useState } from "react";
import { shipTypes } from "@/lib/quizData";
import carrierImg from "@assets/AZzOM8EviBgPFGACFMJuAA-AZzOM8EvYcyHuF9kkk6E9g_1773252252710.jpg";
import commandCenterImg from "@assets/AZzOvtLASvPkD6yJZigI4g-AZzOvtLAugwaYz9bVtHHPA_1773251962760.jpg";
import modernDestroyerImg from "@assets/AZzOvPA5obxU0XB_4Mf13A-AZzOvPA59Ews23LsaByuug_1773251962761.jpg";
import frigateImg from "@assets/AZzOu1Ntrknm8qmEucepHQ-AZzOu1NtMmZiqfvN0q-AbQ_1773251962761.jpg";
import submarineImg from "@assets/AZzOumFl0Cnnri88QRRAYw-AZzOumFl-NhYJXndlK7FNQ_1773251962761.jpg";
import patrolVesselImg from "@assets/AZzOuOH7FhqB7jf_xqD1mw-AZzOuOH74M8KZbKDfo7jNw_1773251962762.jpg";

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
  "Corvette": patrolVesselImg,
  "Submarine": submarineImg,
  "Patrol Vessel": commandCenterImg,
};

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

  return (
    <div className="space-y-24">
      {zoomedImage && (
        <ImageLightbox
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
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
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shipTypes.map((ship, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-48 bg-academy-bg overflow-hidden flex items-center justify-center cursor-zoom-in group relative"
                onClick={() => shipImages[ship.name] && setZoomedImage({ src: shipImages[ship.name], alt: `${ship.name} – ${ship.nameIt}` })}
              >
                {shipImages[ship.name] ? (
                  <>
                    <img
                      src={shipImages[ship.name]}
                      alt={ship.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">🔍</span>
                    </div>
                  </>
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
