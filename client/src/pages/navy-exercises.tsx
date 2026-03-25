import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  type: "calculation" | "beaufort";
  title: string;
  question: string;
  correctAnswer: string | number;
  unit?: string;
  hint?: string;
}

const navyExercises: Exercise[] = [
  // CALCOLO NODI E VELOCITÀ
  { id: "1", type: "calculation", title: "Calcolo nodi", question: "Una nave percorre 10 miglia nautiche in 2 ore. Qual è la velocità in nodi?", correctAnswer: 5, unit: "knots", hint: "1 miglio nautico all'ora = 1 nodo" },
  { id: "2", type: "calculation", title: "Calcolo nodi", question: "Una nave viaggia a 8 nodi. Quante miglia nautiche percorre in 3 ore?", correctAnswer: 24, unit: "nm", hint: "Distanza = Velocità × Tempo" },
  { id: "3", type: "calculation", title: "Calcolo nodi", question: "Una nave percorre 50 miglia nautiche in 5 ore. Qual è la velocità in nodi?", correctAnswer: 10, unit: "knots" },
  { id: "4", type: "calculation", title: "Calcolo nodi", question: "Una nave viaggia a 15 nodi per 4 ore. Quante miglia percorre?", correctAnswer: 60, unit: "nm" },
  { id: "5", type: "calculation", title: "Calcolo nodi", question: "Una nave percorre 90 miglia in 6 ore. Velocità in nodi?", correctAnswer: 15, unit: "knots" },
  { id: "6", type: "calculation", title: "Calcolo nodi", question: "Velocità: 12 nodi, tempo: 2.5 ore. Distanza in miglia nautiche?", correctAnswer: 30, unit: "nm" },
  { id: "7", type: "calculation", title: "Calcolo nodi", question: "Una nave percorre 35 miglia nautiche in 2.5 ore. Velocità in nodi?", correctAnswer: 14, unit: "knots" },
  { id: "8", type: "calculation", title: "Calcolo nodi", question: "Una nave a 20 nodi per 1.5 ore. Distanza coperta?", correctAnswer: 30, unit: "nm" },
  { id: "9", type: "calculation", title: "Calcolo nodi", question: "Una nave percorre 75 miglia in 5 ore. Qual è la velocità?", correctAnswer: 15, unit: "knots" },
  { id: "10", type: "calculation", title: "Calcolo nodi", question: "Velocità 7 nodi, distanza 21 miglia. Tempo impiegato in ore?", correctAnswer: 3, unit: "hours" },

  // CALCOLI CON CONVERSIONI
  { id: "11", type: "calculation", title: "Conversioni nautiche", question: "Una nave a 10 nodi. Quanti km/h sono? (1 nodo ≈ 1.852 km/h)", correctAnswer: 18.52, unit: "km/h", hint: "Moltiplica i nodi per 1.852" },
  { id: "12", type: "calculation", title: "Conversioni nautiche", question: "Una nave va a 25 km/h. Quanti nodi? (arrotonda a 1 decimale)", correctAnswer: 13.5, unit: "knots" },
  { id: "13", type: "calculation", title: "Conversioni nautiche", question: "5 miglia nautiche = ? km (1 nm ≈ 1.852 km)", correctAnswer: 9.26, unit: "km" },
  { id: "14", type: "calculation", title: "Conversioni nautiche", question: "20 km = ? miglia nautiche", correctAnswer: 10.8, unit: "nm" },
  { id: "15", type: "calculation", title: "Conversioni nautiche", question: "Una nave a 18 nodi = ? km/h", correctAnswer: 33.34, unit: "km/h" },
  { id: "16", type: "calculation", title: "Conversioni nautiche", question: "40 km/h = ? nodi", correctAnswer: 21.6, unit: "knots" },
  { id: "17", type: "calculation", title: "Conversioni nautiche", question: "100 miglia nautiche = ? km", correctAnswer: 185.2, unit: "km" },
  { id: "18", type: "calculation", title: "Conversioni nautiche", question: "Una nave a 22 nodi = ? km/h", correctAnswer: 40.74, unit: "km/h" },
  { id: "19", type: "calculation", title: "Conversioni nautiche", question: "60 km = ? miglia nautiche", correctAnswer: 32.4, unit: "nm" },
  { id: "20", type: "calculation", title: "Conversioni nautiche", question: "12 nodi = ? km/h", correctAnswer: 22.22, unit: "km/h" },

  // CALCOLO TEMPO DI ARRIVO
  { id: "21", type: "calculation", title: "Tempo di navigazione", question: "Una nave deve percorrere 120 miglia a 15 nodi. Quanto tempo impiega (ore)?", correctAnswer: 8, unit: "hours" },
  { id: "22", type: "calculation", title: "Tempo di navigazione", question: "Distanza 200 nm, velocità 20 nodi. Tempo in ore?", correctAnswer: 10, unit: "hours" },
  { id: "23", type: "calculation", title: "Tempo di navigazione", question: "Una nave percorre 45 nm a 9 nodi. Tempo impiegato?", correctAnswer: 5, unit: "hours" },
  { id: "24", type: "calculation", title: "Tempo di navigazione", question: "Distanza 80 nm, velocità 16 nodi. Quanto tempo?", correctAnswer: 5, unit: "hours" },
  { id: "25", type: "calculation", title: "Tempo di navigazione", question: "Una nave a 12 nodi deve coprire 84 nm. Tempo?", correctAnswer: 7, unit: "hours" },
  { id: "26", type: "calculation", title: "Tempo di navigazione", question: "Velocità 25 nodi, distanza 150 nm. Tempo totale?", correctAnswer: 6, unit: "hours" },
  { id: "27", type: "calculation", title: "Tempo di navigazione", question: "Una nave percorre 100 nm a 10 nodi. Ore impiegate?", correctAnswer: 10, unit: "hours" },
  { id: "28", type: "calculation", title: "Tempo di navigazione", question: "Distanza 55 nm, velocità 11 nodi. Tempo?", correctAnswer: 5, unit: "hours" },
  { id: "29", type: "calculation", title: "Tempo di navigazione", question: "Una nave deve coprire 300 nm a 20 nodi. Ore?", correctAnswer: 15, unit: "hours" },
  { id: "30", type: "calculation", title: "Tempo di navigazione", question: "Velocità 18 nodi, distanza 90 nm. Tempo impiegato?", correctAnswer: 5, unit: "hours" },

  // SCALA BEAUFORT
  { id: "31", type: "beaufort", title: "Scala Beaufort", question: "Vento 0-1 nodo. Forza Beaufort?", correctAnswer: 0, unit: "Beaufort" },
  { id: "32", type: "beaufort", title: "Scala Beaufort", question: "Vento 1-3 nodi. Forza Beaufort?", correctAnswer: 1, unit: "Beaufort" },
  { id: "33", type: "beaufort", title: "Scala Beaufort", question: "Vento 4-6 nodi. Forza Beaufort?", correctAnswer: 2, unit: "Beaufort" },
  { id: "34", type: "beaufort", title: "Scala Beaufort", question: "Vento 7-10 nodi. Forza Beaufort?", correctAnswer: 3, unit: "Beaufort" },
  { id: "35", type: "beaufort", title: "Scala Beaufort", question: "Vento 11-16 nodi. Forza Beaufort?", correctAnswer: 4, unit: "Beaufort" },
  { id: "36", type: "beaufort", title: "Scala Beaufort", question: "Vento 17-21 nodi. Forza Beaufort?", correctAnswer: 5, unit: "Beaufort" },
  { id: "37", type: "beaufort", title: "Scala Beaufort", question: "Vento 22-27 nodi. Forza Beaufort?", correctAnswer: 6, unit: "Beaufort" },
  { id: "38", type: "beaufort", title: "Scala Beaufort", question: "Vento 28-33 nodi. Forza Beaufort?", correctAnswer: 7, unit: "Beaufort" },
  { id: "39", type: "beaufort", title: "Scala Beaufort", question: "Vento 34-40 nodi. Forza Beaufort?", correctAnswer: 8, unit: "Beaufort" },
  { id: "40", type: "beaufort", title: "Scala Beaufort", question: "Vento 41-47 nodi. Forza Beaufort?", correctAnswer: 9, unit: "Beaufort" },

  // CALCOLI MISTI
  { id: "41", type: "calculation", title: "Calcolo composito", question: "Una nave viaggia a 16 nodi. In 2.5 ore quante miglia percorre?", correctAnswer: 40, unit: "nm" },
  { id: "42", type: "calculation", title: "Calcolo composito", question: "Distanza 130 nm, tempo 10 ore. Velocità in nodi?", correctAnswer: 13, unit: "knots" },
  { id: "43", type: "calculation", title: "Calcolo composito", question: "Una nave a 11 nodi per 6 ore. Distanza coperta?", correctAnswer: 66, unit: "nm" },
  { id: "44", type: "calculation", title: "Calcolo composito", question: "70 nm in 7 ore = ? nodi", correctAnswer: 10, unit: "knots" },
  { id: "45", type: "calculation", title: "Calcolo composito", question: "Una nave a 19 nodi per 2 ore. Distanza?", correctAnswer: 38, unit: "nm" },
  { id: "46", type: "calculation", title: "Calcolo composito", question: "95 nm, velocità 19 nodi. Tempo?", correctAnswer: 5, unit: "hours" },
  { id: "47", type: "calculation", title: "Calcolo composito", question: "Una nave a 8 nodi per 9 ore. Distanza?", correctAnswer: 72, unit: "nm" },
  { id: "48", type: "calculation", title: "Calcolo composito", question: "56 nm in 4 ore = ? nodi", correctAnswer: 14, unit: "knots" },
  { id: "49", type: "calculation", title: "Calcolo composito", question: "Una nave a 17 nodi percorre 85 nm. Tempo?", correctAnswer: 5, unit: "hours" },
  { id: "50", type: "calculation", title: "Calcolo composito", question: "110 nm in 11 ore = ? nodi", correctAnswer: 10, unit: "knots" },
];

export default function NavyExercisesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const { toast } = useToast();

  const exercise = navyExercises[currentIndex];

  const getCorrectCount = () => {
    return navyExercises.filter((ex) => {
      const answer = userAnswers[ex.id];
      if (answer === undefined) return false;
      const correct = parseFloat(String(answer));
      const expectedAnswer = parseFloat(String(ex.correctAnswer));
      return Math.abs(correct - expectedAnswer) < 0.1;
    }).length;
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setFeedback("Inserisci una risposta!");
      return;
    }

    const userNum = parseFloat(userAnswer);
    const expectedNum = parseFloat(String(exercise.correctAnswer));
    const isCorrect = Math.abs(userNum - expectedNum) < 0.1;

    setUserAnswers({ ...userAnswers, [exercise.id]: userNum });
    setFeedback(isCorrect ? "✓ Corretto!" : `✗ Sbagliato. Risposta: ${exercise.correctAnswer} ${exercise.unit}`);

    setTimeout(() => {
      if (currentIndex < navyExercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer("");
        setFeedback("");
      } else {
        setShowResults(true);
        toast({
          title: "Esercizi completati!",
          description: `Hai risposto correttamente a ${getCorrectCount()} su ${navyExercises.length}`,
        });
      }
    }, 1500);
  };

  const resetExercises = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResults(false);
    setFeedback("");
  };

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm">
          ⚓ CALCOLI NAUTICI
        </div>
        <h1 className="text-4xl font-bold font-display text-academy-dark">
          Esercitazioni Calcoli Navali
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto">
          50 esercizi su nodi, velocità nave, conversioni e scala Beaufort. Calcoli pratici di navigazione.
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
                ? "Eccellente! Sei un esperto di calcoli nautici! 🏆"
                : getCorrectCount() >= 30
                ? "Molto bene! Conosci bene i calcoli navali! ⚓"
                : getCorrectCount() >= 20
                ? "Buono! Continua a praticare! 📚"
                : "Continua ad allenarti! 💪"}
            </p>
            <p className="text-sm text-green-600">Percentuale: {Math.round((getCorrectCount() / navyExercises.length) * 100)}%</p>
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
              {exercise.hint && <p className="text-sm text-academy-gray italic">💡 {exercise.hint}</p>}
            </div>

            <div className="space-y-3">
              <input
                type="number"
                step="0.1"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Inserisci la risposta numerica..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-academy-blue focus:outline-none text-lg"
                data-testid="input-answer"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
              {exercise.unit && <p className="text-sm text-academy-gray text-center">Unità: {exercise.unit}</p>}
            </div>

            {feedback && (
              <div className={`p-4 rounded-lg text-center font-bold ${feedback.startsWith("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {feedback}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="w-full p-4 bg-academy-blue text-white font-bold rounded-lg hover:bg-academy-dark transition-colors disabled:opacity-50"
              data-testid="button-submit-answer"
            >
              Verifica Risposta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
