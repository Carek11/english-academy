import { useState, useMemo, useEffect } from "react";
import { quizzes } from "@/lib/quizData";

type QuizType = "base" | "intermedio" | "business" | "marina";

const DAILY_QUESTION_LIMIT = 50;

const getDailyQuestionCount = (): { used: number; remaining: number } => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem("dailyQuizCount");
  
  if (!stored) {
    localStorage.setItem("dailyQuizCount", JSON.stringify({ date: today, used: 0 }));
    return { used: 0, remaining: DAILY_QUESTION_LIMIT };
  }

  const data = JSON.parse(stored);
  if (data.date !== today) {
    localStorage.setItem("dailyQuizCount", JSON.stringify({ date: today, used: 0 }));
    return { used: 0, remaining: DAILY_QUESTION_LIMIT };
  }

  const used = data.used || 0;
  return { used, remaining: Math.max(0, DAILY_QUESTION_LIMIT - used) };
};

const addDailyQuestions = (count: number): boolean => {
  const daily = getDailyQuestionCount();
  if (daily.remaining < count) return false;
  
  const today = new Date().toDateString();
  localStorage.setItem("dailyQuizCount", JSON.stringify({ date: today, used: daily.used + count }));
  return true;
};

const encouragementMessages = [
  "🌟 Ben fatto!",
  "⚓ Fantastico!",
  "💪 Ottimo lavoro!",
  "🎯 Eccellente!",
  "🏆 Complimenti!",
  "✨ Meraviglioso!",
  "🚀 Spettacolare!",
  "👏 Bravissimo!",
];

export default function QuizPage() {
  const [step, setStep] = useState<"quiz" | "results" | "limit">("quiz");
  const [selectedQuiz] = useState<QuizType>("marina");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);
  const [quizRound, setQuizRound] = useState(1);
  const [encouragementMsg, setEncouragementMsg] = useState("");

  const generateRandomQuestions = (quizType: QuizType, count: number) => {
    const sourceQuestions = quizzes[quizType];
    const randomQuestions = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * sourceQuestions.length);
      randomQuestions.push(sourceQuestions[randomIndex]);
    }
    return randomQuestions;
  };

  const currentQuiz = useMemo(() => {
    if (quizRound === 1) {
      return quizzes.marina;
    } else {
      return generateRandomQuestions("marina", 10);
    }
  }, [quizRound]);

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    const quiz = currentQuiz;
    const correct = quiz[currentQ].correct === optionIndex;
    if (correct) setScore(score + 1);
    setSelectedAnswer(optionIndex);
    setAnswered(true);
  };

  const handleNext = () => {
    const quiz = currentQuiz;
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      const correctCount = score + (selectedAnswer === currentQuiz[currentQ].correct ? 1 : 0);
      setResults({ correct: correctCount, total: quizRound === 1 ? quizzes.marina.length : ((quizRound - 1) * 10 + quiz.length) });
      setEncouragementMsg(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
      setStep("results");
    }
  };

  const handleContinueQuiz = () => {
    const daily = getDailyQuestionCount();
    if (daily.remaining < 10) {
      setStep("limit");
      return;
    }
    
    if (!addDailyQuestions(10)) {
      setStep("limit");
      return;
    }

    setQuizRound(quizRound + 1);
    setCurrentQ(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setResults(null);
    setStep("quiz");
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setResults(null);
    setQuizRound(1);
    setStep("quiz");
  };

  if (step === "quiz" && selectedQuiz) {
    const quiz = currentQuiz;
    const q = quiz[currentQ];
    const correctAnswerIndex = q.correct;
    const totalCorrect = score + (answered && selectedAnswer === correctAnswerIndex ? 1 : 0);

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-academy-gray">Domanda {currentQ + 1} di {quiz.length}</span>
            <span className="text-academy-blue">⭐ {totalCorrect} / {quiz.length}</span>
          </div>
          <div className="h-2 bg-academy-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-academy-blue transition-all"
              style={{ width: `${((currentQ + 1) / quiz.length) * 100}%` }}
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

  if (step === "results" && results) {
    const percentage = Math.round((results.correct / results.total) * 100);
    const daily = getDailyQuestionCount();

    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">⚓🌊</div>
          <h3 className="text-3xl font-bold font-display text-academy-blue">{encouragementMsg}</h3>
          
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-academy-blue bg-academy-bg">
            <div className="text-center">
              <div className="text-5xl font-bold text-academy-blue">{percentage}%</div>
              <div className="text-sm font-semibold text-academy-gray">PUNTEGGIO</div>
            </div>
          </div>

          <h3 className="text-3xl font-bold font-display text-academy-dark">Risultato</h3>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold">
              ✓ {results.correct} corrette
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg text-red-700 font-semibold">
              ✗ {results.total - results.correct} errate
            </div>
          </div>

          <div className="px-6 py-4 bg-academy-gold text-white rounded-lg font-bold text-lg">
            Domande rimaste oggi: {daily.remaining}/50
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {daily.remaining >= 10 && (
            <button
              onClick={handleContinueQuiz}
              className="px-6 py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              ➕ 10 domande in più
            </button>
          )}
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  if (step === "limit") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
        <div className="text-6xl">⚓😴</div>
        <h3 className="text-3xl font-bold font-display text-academy-dark">Limite giornaliero raggiunto!</h3>
        <p className="text-lg text-academy-gray">
          Hai raggiunto le 50 domande di oggi. Torna domani alle 3:00 di notte per ricaricare altri 50 esercizi! 🌙
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
        >
          🔄 Riprova domani
        </button>
      </div>
    );
  }

  return null;
}
