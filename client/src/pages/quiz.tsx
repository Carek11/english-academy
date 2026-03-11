import { useState } from "react";
import { quizzes } from "@/lib/quizData";

type QuizType = "base" | "intermedio" | "business" | "marina";

export default function QuizPage() {
  const [step, setStep] = useState<"name" | "select" | "quiz" | "results">("name");
  const [studentName, setStudentName] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);

  const quizTypes: Array<{ id: QuizType; label: string; icon: string; desc: string }> = [
    { id: "base", label: "🌱 Inglese Base", icon: "🌱", desc: "Principianti" },
    { id: "intermedio", label: "📈 Intermedio", icon: "📈", desc: "Intermedio" },
    { id: "business", label: "💼 Business", icon: "💼", desc: "Business" },
    { id: "marina", label: "⚓ Marina Militare", icon: "⚓", desc: "10 domande casuali" },
  ];

  const handleStartQuiz = () => {
    if (studentName.trim()) {
      setStep("select");
    }
  };

  const handleSelectQuiz = (quizType: QuizType) => {
    setSelectedQuiz(quizType);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setStep("quiz");
  };

  const handleAnswer = (optionIndex: number) => {
    if (!selectedQuiz || answered) return;
    const quiz = quizzes[selectedQuiz];
    const correct = quiz[currentQ].correct === optionIndex;
    if (correct) setScore(score + 1);
    setSelectedAnswer(optionIndex);
    setAnswered(true);
  };

  const handleNext = () => {
    if (!selectedQuiz) return;
    const quiz = quizzes[selectedQuiz];
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setResults({ correct: score + (selectedAnswer === quizzes[selectedQuiz][currentQ].correct ? 1 : 0), total: quiz.length });
      setStep("results");
    }
  };

  const handleRetry = () => {
    if (!selectedQuiz) return;
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setStep("quiz");
  };

  const handleChangeQuiz = () => {
    setStep("select");
  };

  if (step === "name") {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-12">
        <h3 className="text-3xl font-bold font-display text-academy-dark">👤 Come ti chiami?</h3>
        <p className="text-academy-gray">Inserisci il tuo nome per personalizzare il quiz e salvare il punteggio</p>
        <input
          type="text"
          placeholder="Il tuo nome..."
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          maxLength={40}
          onKeyPress={(e) => e.key === "Enter" && handleStartQuiz()}
          className="w-full px-4 py-3 border border-academy-gray border-opacity-30 rounded-lg focus:outline-none focus:border-academy-blue text-center"
        />
        <button
          onClick={handleStartQuiz}
          className="w-full px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
        >
          Continua →
        </button>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <p className="text-2xl font-semibold text-academy-dark">
          Ciao <span className="text-academy-blue">{studentName}</span>! Scegli il quiz:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizTypes.map((qt) => (
            <button
              key={qt.id}
              onClick={() => handleSelectQuiz(qt.id)}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-academy-bg transition-all border-2 border-transparent hover:border-academy-blue"
            >
              <span className="text-4xl block mb-2">{qt.icon}</span>
              <div className="font-semibold text-academy-dark">{qt.label}</div>
              {qt.desc && <div className="text-xs text-academy-gray mt-1">{qt.desc}</div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "quiz" && selectedQuiz) {
    const quiz = quizzes[selectedQuiz];
    const q = quiz[currentQ];
    const correctAnswerIndex = q.correct;
    const totalQuestions = quiz.length;
    const totalCorrect = score + (answered && selectedAnswer === correctAnswerIndex ? 1 : 0);

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-academy-blue">👤 {studentName}</span>
            <span className="text-academy-gray">Domanda {currentQ + 1} di {totalQuestions}</span>
            <span className="text-academy-blue">⭐ {totalCorrect} / {totalQuestions}</span>
          </div>
          <div className="h-2 bg-academy-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-academy-blue transition-all"
              style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-sm font-semibold text-academy-gold mb-2">DOMANDA {currentQ + 1}</div>
            <h3 className="text-2xl font-bold text-academy-dark">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`p-4 rounded-lg font-semibold transition-all text-left ${
                  answered
                    ? i === correctAnswerIndex
                      ? "bg-green-100 text-green-800 border-2 border-green-400"
                      : i === selectedAnswer
                      ? "bg-red-100 text-red-800 border-2 border-red-400"
                      : "bg-academy-bg text-academy-gray"
                    : "bg-academy-bg hover:bg-academy-blue hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div
              className={`p-4 rounded-lg text-center font-semibold ${
                selectedAnswer === correctAnswerIndex
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {selectedAnswer === correctAnswerIndex ? "✓ Corretto!" : "✗ Sbagliato!"}
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!answered}
          className="w-full px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prossima →
        </button>
      </div>
    );
  }

  if (step === "results" && results && selectedQuiz) {
    const quiz = quizzes[selectedQuiz];
    const percentage = Math.round((results.correct / results.total) * 100);
    const grade =
      percentage >= 90 ? "🌟 Eccellente!" : percentage >= 70 ? "👍 Buono!" : percentage >= 50 ? "📚 Non male!" : "💪 Continua a studiare!";

    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-academy-blue bg-academy-bg">
            <div className="text-center">
              <div className="text-5xl font-bold text-academy-blue">{percentage}%</div>
              <div className="text-sm font-semibold text-academy-gray">PUNTEGGIO</div>
            </div>
          </div>

          <h3 className="text-3xl font-bold font-display text-academy-dark">Risultato</h3>
          <p className="text-lg text-academy-gray">{studentName}</p>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold">
              ✓ {results.correct} corrette
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg text-red-700 font-semibold">
              ✗ {results.total - results.correct} errate
            </div>
            <div className="px-4 py-2 bg-blue-50 rounded-lg text-academy-blue font-semibold">
              📊 {results.total} totali
            </div>
          </div>

          <div className="px-6 py-4 bg-academy-gold text-white rounded-lg font-bold text-xl">{grade}</div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
          >
            🔄 Riprova
          </button>
          <button
            onClick={handleChangeQuiz}
            className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors"
          >
            📚 Altro quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}
