import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  type: "fill-blank" | "matching" | "true-false";
  title: string;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
}

const navyExercises: Exercise[] = [
  // PARTI DELLA NAVE
  { id: "1", type: "fill-blank", title: "Parti della nave", question: "The ___ is the front of the ship.", options: ["stern", "bow", "port", "deck"], correctAnswer: 1 },
  { id: "2", type: "fill-blank", title: "Parti della nave", question: "The ___ is the back of the ship.", options: ["bow", "stern", "starboard", "hull"], correctAnswer: 1 },
  { id: "3", type: "fill-blank", title: "Parti della nave", question: "The left side of a ship is called ___.", options: ["starboard", "port", "beam", "keel"], correctAnswer: 1 },
  { id: "4", type: "fill-blank", title: "Parti della nave", question: "The ___ is the body of the ship.", options: ["mast", "hull", "rudder", "anchor"], correctAnswer: 1 },
  { id: "5", type: "fill-blank", title: "Parti della nave", question: "The ___ is used to steer the ship.", options: ["anchor", "sail", "rudder", "mast"], correctAnswer: 2 },
  { id: "6", type: "fill-blank", title: "Parti della nave", question: "The ___ holds the sails up.", options: ["deck", "cabin", "mast", "bridge"], correctAnswer: 2 },
  { id: "7", type: "fill-blank", title: "Parti della nave", question: "The ___ is where the captain controls the ship.", options: ["cabin", "bridge", "galley", "engine room"], correctAnswer: 1 },
  { id: "8", type: "fill-blank", title: "Parti della nave", question: "The ___ is where sailors sleep.", options: ["galley", "berth", "bridge", "hold"], correctAnswer: 1 },
  { id: "9", type: "fill-blank", title: "Parti della nave", question: "The ___ is where food is prepared.", options: ["bridge", "galley", "engine room", "cabin"], correctAnswer: 1 },
  { id: "10", type: "fill-blank", title: "Parti della nave", question: "The ___ holds cargo on the ship.", options: ["deck", "hold", "cabin", "mast"], correctAnswer: 1 },

  // MANOVRE E OPERAZIONI
  { id: "11", type: "fill-blank", title: "Manovre navali", question: "To ___ means to move a ship backward.", options: ["advance", "astern", "port", "starboard"], correctAnswer: 1 },
  { id: "12", type: "fill-blank", title: "Manovre navali", question: "A ___ is a circular movement of the ship.", options: ["turn", "drift", "bearing", "tack"], correctAnswer: 0 },
  { id: "13", type: "fill-blank", title: "Manovre navali", question: "___ is raising the anchor.", options: ["Weighing", "Setting", "Dropping", "Securing"], correctAnswer: 0 },
  { id: "14", type: "fill-blank", title: "Manovre navali", question: "To ___ is to tie a ship to the dock.", options: ["anchor", "moor", "sail", "drift"], correctAnswer: 1 },
  { id: "15", type: "fill-blank", title: "Manovre navali", question: "A ___ is a fast attack ship.", options: ["tanker", "frigate", "container ship", "barge"], correctAnswer: 1 },

  // TIPI DI NAVI
  { id: "16", type: "fill-blank", title: "Tipi di navi", question: "A ___ carries cargo containers.", options: ["frigate", "container ship", "tanker", "sailboat"], correctAnswer: 1 },
  { id: "17", type: "fill-blank", title: "Tipi di navi", question: "A ___ transports oil and liquids.", options: ["frigate", "container ship", "tanker", "ferry"], correctAnswer: 2 },
  { id: "18", type: "fill-blank", title: "Tipi di navi", question: "A ___ carries passengers across water.", options: ["cargo ship", "ferry", "destroyer", "submarine"], correctAnswer: 1 },
  { id: "19", type: "fill-blank", title: "Tipi di navi", question: "A ___ operates underwater.", options: ["frigate", "tanker", "submarine", "ferry"], correctAnswer: 2 },
  { id: "20", type: "fill-blank", title: "Tipi di navi", question: "A ___ carries military aircraft.", options: ["frigate", "aircraft carrier", "destroyer", "submarine"], correctAnswer: 1 },

  // EQUIPAGGIO E RUOLI
  { id: "21", type: "fill-blank", title: "Equipaggio", question: "The ___ commands the ship.", options: ["sailor", "captain", "engineer", "cook"], correctAnswer: 1 },
  { id: "22", type: "fill-blank", title: "Equipaggio", question: "The ___ navigates the ship.", options: ["captain", "navigator", "engineer", "bosun"], correctAnswer: 1 },
  { id: "23", type: "fill-blank", title: "Equipaggio", question: "A ___ operates the engine.", options: ["sailor", "captain", "engineer", "navigator"], correctAnswer: 2 },
  { id: "24", type: "fill-blank", title: "Equipaggio", question: "A ___ supervises the deck crew.", options: ["engineer", "bosun", "navigator", "chef"], correctAnswer: 1 },
  { id: "25", type: "fill-blank", title: "Equipaggio", question: "A ___ works on the deck.", options: ["engineer", "captain", "sailor", "chef"], correctAnswer: 2 },

  // STRUMENTI E ATTREZZATURE
  { id: "26", type: "fill-blank", title: "Strumenti", question: "A ___ keeps the ship in one place.", options: ["rope", "sail", "anchor", "buoy"], correctAnswer: 2 },
  { id: "27", type: "fill-blank", title: "Strumenti", question: "A ___ is used to measure depth.", options: ["compass", "sonar", "speedometer", "chart"], correctAnswer: 1 },
  { id: "28", type: "fill-blank", title: "Strumenti", question: "A ___ shows direction to north.", options: ["sonar", "compass", "chart", "radar"], correctAnswer: 1 },
  { id: "29", type: "fill-blank", title: "Strumenti", question: "A ___ detects objects at sea.", options: ["compass", "chart", "radar", "rudder"], correctAnswer: 2 },
  { id: "30", type: "fill-blank", title: "Strumenti", question: "___ are used to maneuver in tight spaces.", options: ["Anchors", "Ropes", "Sails", "Tugboats"], correctAnswer: 3 },

  // CONDIZIONI METEO E MARE
  { id: "31", type: "true-false", title: "Meteo marino", question: "A gale is a light wind at sea.", correctAnswer: 0 },
  { id: "32", type: "true-false", title: "Meteo marino", question: "High tide occurs twice a day.", correctAnswer: 1 },
  { id: "33", type: "true-false", title: "Meteo marino", question: "A current always moves the same direction.", correctAnswer: 0 },
  { id: "34", type: "true-false", title: "Meteo marino", question: "Fog is dangerous for ships at sea.", correctAnswer: 1 },
  { id: "35", type: "true-false", title: "Meteo marino", question: "Waves always come from the same direction.", correctAnswer: 0 },

  // SICUREZZA IN MARE
  { id: "36", type: "fill-blank", title: "Sicurezza", question: "A ___ is used to save people from water.", options: ["rope", "lifeboat", "anchor", "sail"], correctAnswer: 1 },
  { id: "37", type: "fill-blank", title: "Sicurezza", question: "A ___ is worn to stay safe in water.", options: ["helmet", "life jacket", "uniform", "boots"], correctAnswer: 1 },
  { id: "38", type: "true-false", title: "Sicurezza", question: "All crew members must know how to swim.", correctAnswer: 1 },
  { id: "39", type: "true-false", title: "Sicurezza", question: "Life jackets are optional on ships.", correctAnswer: 0 },
  { id: "40", type: "true-false", title: "Sicurezza", question: "Lifeboats must be checked regularly.", correctAnswer: 1 },

  // NAVIGAZIONE E DIREZIONI
  { id: "41", type: "fill-blank", title: "Navigazione", question: "A ship's ___ shows its speed.", options: ["compass", "log", "chart", "radar"], correctAnswer: 1 },
  { id: "42", type: "fill-blank", title: "Navigazione", question: "A ___ is a marked channel for ships.", options: ["bay", "strait", "shipping lane", "dock"], correctAnswer: 2 },
  { id: "43", type: "fill-blank", title: "Navigazione", question: "The ___ is where ships dock.", options: ["beach", "reef", "port", "buoy"], correctAnswer: 2 },
  { id: "44", type: "true-false", title: "Navigazione", question: "North is always at the top of a chart.", correctAnswer: 1 },
  { id: "45", type: "true-false", title: "Navigazione", question: "A buoy marks shallow water.", correctAnswer: 1 },

  // COMUNICAZIONI E SEGNALI
  { id: "46", type: "fill-blank", title: "Comunicazioni", question: "A ___ is a light signal at sea.", options: ["radio", "flag", "beacon", "horn"], correctAnswer: 2 },
  { id: "47", type: "fill-blank", title: "Comunicazioni", question: "A ship uses a ___ to communicate at distance.", options: ["flag", "radio", "whistle", "light"], correctAnswer: 1 },
  { id: "48", type: "fill-blank", title: "Comunicazioni", question: "Flags are used for ___ between ships.", options: ["navigation", "signaling", "decoration", "anchoring"], correctAnswer: 1 },
  { id: "49", type: "fill-blank", title: "Comunicazioni", question: "A ___ warns of danger at sea.", options: ["sail", "beacon", "flag", "rope"], correctAnswer: 1 },
  { id: "50", type: "fill-blank", title: "Comunicazioni", question: "The ___ sound alerts crew members.", options: ["bell", "horn", "whistle", "buoy"], correctAnswer: 2 },
];

export default function NavyExercisesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const exercise = navyExercises[currentIndex];
  const getCorrectCount = () => {
    return navyExercises.filter((ex) => userAnswers[ex.id] === ex.correctAnswer).length;
  };

  const handleAnswer = (answer: any) => {
    setUserAnswers({ ...userAnswers, [exercise.id]: answer });
    setTimeout(() => {
      if (currentIndex < navyExercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResults(true);
        toast({
          title: "Esercizi completati!",
          description: `Hai risposto correttamente a ${getCorrectCount()} su ${navyExercises.length} esercizi`,
        });
      }
    }, 300);
  };

  const resetExercises = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm">
          ⚓ ESERCIZI MARINA MILITARE
        </div>
        <h1 className="text-4xl font-bold font-display text-academy-dark">
          Esercitazioni Nautiche
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto">
          50 esercizi interattivi sulla terminologia, manovre e operazioni navali della Marina Militare.
        </p>
      </section>

      {showResults ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-10 text-center shadow-lg space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-green-700">Risultati Finali</h2>
            <div className="text-5xl font-black text-green-600">
              {getCorrectCount()} / {navyExercises.length}
            </div>
            <p className="text-lg text-green-600">
              {getCorrectCount() >= 40
                ? "Eccellente! Sei un esperto di nautica! 🏆"
                : getCorrectCount() >= 30
                ? "Molto bene! Conosci bene la terminologia navale! ⚓"
                : getCorrectCount() >= 20
                ? "Buono! Continua a esercitarti! 📚"
                : "Continua a studiare la terminologia navale! 💪"}
            </p>
            <div className="space-y-2 text-sm text-green-600">
              <p>Percentuale: {Math.round((getCorrectCount() / navyExercises.length) * 100)}%</p>
            </div>
            <button
              onClick={resetExercises}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              data-testid="button-restart-exercises"
            >
              🔄 Ricomincia
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-academy-gray">
                Esercizio {currentIndex + 1} di {navyExercises.length}
              </span>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-academy-blue transition-all"
                  style={{ width: `${((currentIndex + 1) / navyExercises.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-academy-dark">{exercise.title}</h2>
              <p className="text-lg text-academy-dark font-medium">{exercise.question}</p>
            </div>

            {exercise.type === "fill-blank" && (
              <div className="space-y-3">
                {exercise.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-academy-blue hover:bg-sky-50 transition-colors font-semibold"
                    data-testid={`option-${i}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {exercise.type === "true-false" && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(1)}
                  className="p-6 border-2 border-gray-200 rounded-lg font-bold text-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  data-testid="button-true"
                >
                  ✓ Vero
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="p-6 border-2 border-gray-200 rounded-lg font-bold text-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                  data-testid="button-false"
                >
                  ✗ Falso
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
