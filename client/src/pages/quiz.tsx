import { useState, useMemo } from "react";
import { quizzes } from "@/lib/quizData";

type QuizType = "marina" | "navigation" | "engine" | "communications" | "safety";

const DAILY_QUESTION_LIMIT = 50;
const RESET_HOUR = 3;

const getQuizDay = (): string => {
  const now = new Date();
  if (now.getHours() < RESET_HOUR) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  }
  return now.toDateString();
};

const getDailyQuestionCount = (): { used: number; remaining: number } => {
  const day = getQuizDay();
  const stored = localStorage.getItem("dailyQuizCount");

  if (!stored) {
    localStorage.setItem("dailyQuizCount", JSON.stringify({ date: day, used: 0 }));
    return { used: 0, remaining: DAILY_QUESTION_LIMIT };
  }

  const data = JSON.parse(stored);
  if (data.date !== day) {
    localStorage.setItem("dailyQuizCount", JSON.stringify({ date: day, used: 0 }));
    return { used: 0, remaining: DAILY_QUESTION_LIMIT };
  }

  const used = data.used || 0;
  return { used, remaining: Math.max(0, DAILY_QUESTION_LIMIT - used) };
};

const addDailyQuestions = (count: number): boolean => {
  const daily = getDailyQuestionCount();
  if (daily.remaining < count) return false;
  const day = getQuizDay();
  localStorage.setItem("dailyQuizCount", JSON.stringify({ date: day, used: daily.used + count }));
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

const topicConfig: Record<QuizType, { label: string; icon: string; color: string; bg: string }> = {
  navigation: { label: "Navigation System", icon: "🧭", color: "text-blue-700", bg: "bg-blue-50 border-blue-300" },
  engine: { label: "Engine Room", icon: "⚙️", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" },
  communications: { label: "Communications", icon: "📡", color: "text-green-700", bg: "bg-green-50 border-green-300" },
  safety: { label: "Safety Equipment", icon: "🦺", color: "text-red-700", bg: "bg-red-50 border-red-300" },
  marina: { label: "Marina Generale", icon: "⚓", color: "text-academy-blue", bg: "bg-blue-50 border-blue-300" },
};

const QUESTIONS_PER_ROUND = 10;

export default function QuizPage() {
  const [step, setStep] = useState<"select" | "quiz" | "results" | "limit">("select");
  const [selectedTopic, setSelectedTopic] = useState<QuizType | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<typeof quizzes.marina>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [encouragementMsg, setEncouragementMsg] = useState("");
  const [roundCount, setRoundCount] = useState(0);

  const generateRound = (topic: QuizType) => {
    const source = quizzes[topic];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, QUESTIONS_PER_ROUND);
  };

  const handleStartQuiz = (topic: QuizType) => {
    const daily = getDailyQuestionCount();
    if (daily.remaining < QUESTIONS_PER_ROUND) {
      setStep("limit");
      return;
    }
    if (!addDailyQuestions(QUESTIONS_PER_ROUND)) {
      setStep("limit");
      return;
    }
    const questions = generateRound(topic);
    setSelectedTopic(topic);
    setRoundQuestions(questions);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setRoundScore(0);
    setTotalCorrect(0);
    setTotalAnswered(0);
    setRoundCount(1);
    setStep("quiz");
  };

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    setSelectedAnswer(optionIndex);
    setAnswered(true);
    if (roundQuestions[currentQ].correct === optionIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < roundQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      const finalScore = score + (roundQuestions[currentQ].correct === selectedAnswer ? 1 : 0);
      setRoundScore(finalScore);
      setTotalCorrect((t) => t + finalScore);
      setTotalAnswered((t) => t + roundQuestions.length);
      setEncouragementMsg(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
      setStep("results");
    }
  };

  const handleContinueQuiz = () => {
    const daily = getDailyQuestionCount();
    if (daily.remaining < QUESTIONS_PER_ROUND) {
      setStep("limit");
      return;
    }
    if (!addDailyQuestions(QUESTIONS_PER_ROUND)) {
      setStep("limit");
      return;
    }
    const questions = generateRound(selectedTopic!);
    setRoundQuestions(questions);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setRoundCount((r) => r + 1);
    setStep("quiz");
  };

  const handleBackToSelect = () => {
    setStep("select");
    setSelectedTopic(null);
  };

  if (step === "select") {
    const daily = getDailyQuestionCount();
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-display text-academy-dark">⚓ Quiz Marina Militare</h2>
          <p className="text-academy-gray">Scegli l'argomento su cui vuoi allenarti — 10 domande per sessione.</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${daily.remaining > 10 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            📊 Domande disponibili oggi: {daily.remaining}/50
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["navigation", "engine", "communications", "safety"] as QuizType[]).map((topic) => {
            const cfg = topicConfig[topic];
            return (
              <button
                key={topic}
                onClick={() => handleStartQuiz(topic)}
                disabled={daily.remaining < QUESTIONS_PER_ROUND}
                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${cfg.bg}`}
              >
                <div className="text-4xl mb-3">{cfg.icon}</div>
                <div className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</div>
                <div className="text-sm text-academy-gray mt-1">50 domande disponibili · 10 per round</div>
              </button>
            );
          })}
        </div>

        {daily.remaining === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-700 font-semibold">
            🌙 Hai esaurito le 50 domande di oggi. Il contatore si azzera alle 3:00 AM!
          </div>
        )}
      </div>
    );
  }

  if (step === "quiz" && selectedTopic && roundQuestions.length > 0) {
    const q = roundQuestions[currentQ];
    const cfg = topicConfig[selectedTopic];
    const correctIndex = q.correct;
    const progressScore = score + (answered && selectedAnswer === correctIndex ? 1 : 0);

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={handleBackToSelect} className="text-sm text-academy-gray hover:text-academy-blue transition-colors">
            ← Argomenti
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <span className="ml-auto text-sm text-academy-gray font-semibold">Round {roundCount}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-academy-gray">Domanda {currentQ + 1} di {roundQuestions.length}</span>
            <span className="text-academy-blue">⭐ {progressScore}/{roundQuestions.length}</span>
          </div>
          <div className="h-2 bg-academy-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-academy-blue transition-all"
              style={{ width: `${((currentQ + 1) / roundQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="text-center">
            <div className={`text-sm font-semibold mb-2 ${cfg.color}`}>DOMANDA {currentQ + 1}</div>
            <h3 className="text-xl font-bold text-academy-dark">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`p-4 rounded-lg font-semibold transition-all text-left ${
                  answered
                    ? i === correctIndex
                      ? "bg-green-100 text-green-800 border-2 border-green-400"
                      : i === selectedAnswer
                      ? "bg-red-100 text-red-800 border-2 border-red-400"
                      : "bg-academy-bg text-academy-gray border-2 border-transparent"
                    : "bg-academy-bg hover:bg-academy-blue hover:text-white border-2 border-transparent"
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div className={`p-3 rounded-lg text-center font-semibold ${selectedAnswer === correctIndex ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {selectedAnswer === correctIndex ? "✓ Risposta corretta!" : `✗ Sbagliato! Risposta corretta: ${String.fromCharCode(65 + correctIndex)}`}
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!answered}
          className="w-full px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQ < roundQuestions.length - 1 ? "Prossima →" : "Vedi risultati →"}
        </button>
      </div>
    );
  }

  if (step === "results") {
    const daily = getDailyQuestionCount();
    const percentage = Math.round((roundScore / roundQuestions.length) * 100);
    const totalPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const cfg = topicConfig[selectedTopic!];

    return (
      <div className="max-w-2xl mx-auto text-center py-10 space-y-8">
        <div className="space-y-4">
          <div className="text-5xl">{cfg.icon}</div>
          <h3 className="text-3xl font-bold font-display text-academy-blue">{encouragementMsg}</h3>

          <div className="inline-flex items-center justify-center w-36 h-36 rounded-full border-8 border-academy-blue bg-academy-bg">
            <div className="text-center">
              <div className="text-4xl font-bold text-academy-blue">{percentage}%</div>
              <div className="text-xs font-semibold text-academy-gray">ROUND {roundCount}</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold text-sm">
              ✓ {roundScore} corrette
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg text-red-700 font-semibold text-sm">
              ✗ {roundQuestions.length - roundScore} errate
            </div>
          </div>

          {roundCount > 1 && (
            <div className="px-4 py-2 bg-academy-bg rounded-lg text-academy-dark font-semibold text-sm">
              📊 Totale sessione: {totalCorrect}/{totalAnswered} ({totalPct}%)
            </div>
          )}

          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${daily.remaining >= QUESTIONS_PER_ROUND ? "bg-academy-gold text-white" : "bg-red-50 text-red-700"}`}>
            Domande disponibili oggi: {daily.remaining}/50
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          {daily.remaining >= QUESTIONS_PER_ROUND && (
            <button
              onClick={handleContinueQuiz}
              className="px-6 py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              ➕ Altre 10 domande
            </button>
          )}
          <button
            onClick={() => handleStartQuiz(selectedTopic!)}
            className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
          >
            🔄 Ricomincia
          </button>
          <button
            onClick={handleBackToSelect}
            className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors"
          >
            🗂️ Cambia argomento
          </button>
        </div>
      </div>
    );
  }

  if (step === "limit") {
    const now = new Date();
    const resetTime = new Date(now);
    if (now.getHours() >= RESET_HOUR) {
      resetTime.setDate(resetTime.getDate() + 1);
    }
    resetTime.setHours(RESET_HOUR, 0, 0, 0);
    const hoursLeft = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));

    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
        <div className="text-6xl">⚓😴</div>
        <h3 className="text-3xl font-bold font-display text-academy-dark">Limite giornaliero raggiunto!</h3>
        <p className="text-lg text-academy-gray">
          Hai completato le 50 domande di oggi. Il contatore si azzera ogni notte alle <strong>3:00 AM</strong>.
        </p>
        <div className="px-6 py-4 bg-academy-bg rounded-xl text-academy-dark font-semibold">
          🕐 Mancano circa <span className="text-academy-blue font-bold">{hoursLeft} ore</span> al prossimo reset.
        </div>
        <button
          onClick={handleBackToSelect}
          className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
        >
          ← Torna agli argomenti
        </button>
      </div>
    );
  }

  return null;
}
