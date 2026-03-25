import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type ExerciseType = "fill-blank" | "matching" | "true-false" | "ordering";

interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  pairs?: { english: string; italian: string }[];
  words?: string[];
}

const navyExercises: Exercise[] = [
  {
    id: "1",
    type: "fill-blank",
    title: "Riempi gli spazi - Parti della nave",
    question: "The front part of a ship is called the ___.",
    options: ["stern", "bow", "port", "starboard"],
    correctAnswer: 1,
  },
  {
    id: "2",
    type: "fill-blank",
    title: "Riempi gli spazi - Equipaggio",
    question: "A ___ is responsible for navigating the ship.",
    options: ["sailor", "captain", "engineer", "chef"],
    correctAnswer: 1,
  },
  {
    id: "3",
    type: "matching",
    title: "Abbina i termini - Parti della nave",
    question: "Abbina il termine inglese con quello italiano",
    pairs: [
      { english: "Bridge", italian: "Plancia" },
      { english: "Engine Room", italian: "Sala macchine" },
      { english: "Anchor", italian: "Ancora" },
      { english: "Hull", italian: "Scafo" },
    ],
  },
  {
    id: "4",
    type: "true-false",
    title: "Vero o Falso - Marina Militare",
    question: "Port refers to the right side of a ship.",
    correctAnswer: 0, // False
  },
  {
    id: "5",
    type: "true-false",
    title: "Vero o Falso - Navi",
    question: "A frigate is larger than a destroyer.",
    correctAnswer: 0, // False
  },
  {
    id: "6",
    type: "ordering",
    title: "Ordina le parole - Frase navale",
    question: "Ordina le parole per formare una frase corretta",
    words: ["The", "holds", "ship", "cargo", "the"],
    correctAnswer: "The ship holds the cargo",
  },
];

export default function NavyExercisesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const exercise = navyExercises[currentIndex];
  const score = Object.keys(userAnswers).length;

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
    }, 500);
  };

  const getCorrectCount = () => {
    return navyExercises.filter((ex) => {
      const answer = userAnswers[ex.id];
      if (ex.type === "fill-blank" || ex.type === "true-false") {
        return answer === ex.correctAnswer;
      }
      return false;
    }).length;
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
          Esercitazioni Navali
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto">
          Esercizi interattivi per imparare la terminologia e il vocabolario della Marina Militare italiana.
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
              {getCorrectCount() === navyExercises.length
                ? "Perfetto! Hai superato tutti gli esercizi!"
                : `Hai totalizzato ${Math.round((getCorrectCount() / navyExercises.length) * 100)}% di risposte corrette.`}
            </p>
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
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-academy-blue transition-all"
                  style={{ width: `${((currentIndex + 1) / navyExercises.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-academy-dark">{exercise.title}</h2>
            <p className="text-lg text-academy-dark">{exercise.question}</p>

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

            {exercise.type === "matching" && (
              <div className="space-y-3">
                <p className="text-sm text-academy-gray italic">
                  (Questa esercitazione richiede il matching manuale. Clicca sulla risposta corretta)
                </p>
                {exercise.pairs?.map((pair, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(pair.english)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-academy-blue hover:bg-sky-50 transition-colors"
                    data-testid={`pair-${i}`}
                  >
                    <div className="font-bold text-academy-dark">{pair.english}</div>
                    <div className="text-sm text-academy-gray">{pair.italian}</div>
                  </button>
                ))}
              </div>
            )}

            {exercise.type === "ordering" && (
              <div className="space-y-4">
                <p className="text-sm text-academy-gray italic">
                  Ordina le parole per formare una frase corretta
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {exercise.words?.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(exercise.words?.join(" "))}
                      className="p-3 border-2 border-gray-200 rounded-lg hover:border-academy-blue hover:bg-sky-50 transition-colors font-semibold text-center"
                      data-testid={`word-${i}`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
