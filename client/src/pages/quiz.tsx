import { useState } from "react";
import { quizzes } from "@/lib/quizData";

type QuizType = "marina" | "navigation" | "engine" | "communications" | "safety";

const DAILY_LIMIT = 50;
const MONTHLY_LIMIT = 1000;
const RESET_HOUR = 3;
const QUESTIONS_PER_ROUND = 10;

// ─── helpers per ottenere la "data quiz" (reset alle 3 AM) ───────────────────
const getQuizDay = (): string => {
  const now = new Date();
  if (now.getHours() < RESET_HOUR) {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return y.toDateString();
  }
  return now.toDateString();
};

const getQuizMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
};

// ─── contatori giornalieri ───────────────────────────────────────────────────
const getDaily = (): { used: number; remaining: number } => {
  const day = getQuizDay();
  const raw = localStorage.getItem("dailyQuizCount");
  if (!raw) return { used: 0, remaining: DAILY_LIMIT };
  const data = JSON.parse(raw);
  if (data.date !== day) return { used: 0, remaining: DAILY_LIMIT };
  const used = data.used || 0;
  return { used, remaining: Math.max(0, DAILY_LIMIT - used) };
};

const recordDaily = (count: number) => {
  const day = getQuizDay();
  const { used } = getDaily();
  localStorage.setItem("dailyQuizCount", JSON.stringify({ date: day, used: used + count }));
};

// ─── contatori mensili ───────────────────────────────────────────────────────
const getMonthly = (): { used: number; remaining: number } => {
  const month = getQuizMonth();
  const raw = localStorage.getItem("monthlyQuizCount");
  if (!raw) return { used: 0, remaining: MONTHLY_LIMIT };
  const data = JSON.parse(raw);
  if (data.month !== month) return { used: 0, remaining: MONTHLY_LIMIT };
  const used = data.used || 0;
  return { used, remaining: Math.max(0, MONTHLY_LIMIT - used) };
};

const recordMonthly = (count: number) => {
  const month = getQuizMonth();
  const { used } = getMonthly();
  localStorage.setItem("monthlyQuizCount", JSON.stringify({ month, used: used + count }));
};

// ─── verifica limiti prima di iniziare (solo check, non scala) ───────────────
const canStartRound = (): { ok: boolean; reason?: "daily" | "monthly" } => {
  if (getMonthly().remaining < QUESTIONS_PER_ROUND) return { ok: false, reason: "monthly" };
  if (getDaily().remaining < QUESTIONS_PER_ROUND)   return { ok: false, reason: "daily" };
  return { ok: true };
};

// ─── scala domande al completamento ─────────────────────────────────────────
const consumeRound = () => {
  recordDaily(QUESTIONS_PER_ROUND);
  recordMonthly(QUESTIONS_PER_ROUND);
};

// ─────────────────────────────────────────────────────────────────────────────

const encouragementMessages = [
  "🌟 Ben fatto!", "⚓ Fantastico!", "💪 Ottimo lavoro!", "🎯 Eccellente!",
  "🏆 Complimenti!", "✨ Meraviglioso!", "🚀 Spettacolare!", "👏 Bravissimo!",
];

const topicConfig: Record<QuizType, { label: string; icon: string; color: string; bg: string }> = {
  navigation:     { label: "Navigation System",  icon: "🧭", color: "text-blue-700",   bg: "bg-blue-50 border-blue-300"   },
  engine:         { label: "Engine Room",         icon: "⚙️", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" },
  communications: { label: "Communications",      icon: "📡", color: "text-green-700",  bg: "bg-green-50 border-green-300"  },
  safety:         { label: "Safety Equipment",    icon: "🦺", color: "text-red-700",    bg: "bg-red-50 border-red-300"     },
  marina:         { label: "Marina Generale",     icon: "⚓", color: "text-academy-blue", bg: "bg-blue-50 border-blue-300" },
};

export default function QuizPage() {
  const [step, setStep] = useState<"select" | "quiz" | "results">("select");
  const [selectedTopic, setSelectedTopic] = useState<QuizType | null>(null);
  const [currentQ, setCurrentQ]   = useState(0);
  const [score, setScore]         = useState(0);
  const [answered, setAnswered]   = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [roundScore, setRoundScore]         = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<typeof quizzes.marina>([]);
  const [totalCorrect, setTotalCorrect]     = useState(0);
  const [totalAnswered, setTotalAnswered]   = useState(0);
  const [encouragementMsg, setEncouragementMsg] = useState("");
  const [roundCount, setRoundCount] = useState(0);

  const generateRound = (topic: QuizType) =>
    [...quizzes[topic]].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);

  // ── avvia quiz: NON scala ancora, nessun blocco ──────────────────────────
  const handleStartQuiz = (topic: QuizType) => {
    setSelectedTopic(topic);
    setRoundQuestions(generateRound(topic));
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
    if (roundQuestions[currentQ].correct === optionIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    const isLast = currentQ >= roundQuestions.length - 1;
    if (!isLast) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      return;
    }
    // round completato → scala adesso
    const finalScore = score + (roundQuestions[currentQ].correct === selectedAnswer ? 1 : 0);
    consumeRound();
    setRoundScore(finalScore);
    setTotalCorrect((t) => t + finalScore);
    setTotalAnswered((t) => t + roundQuestions.length);
    setEncouragementMsg(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
    setStep("results");
  };

  const handleContinueQuiz = () => {
    setRoundQuestions(generateRound(selectedTopic!));
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

  // ══════════════════════════════════════════════════════════════════════════
  // SCHERMATA SELEZIONE ARGOMENTO
  if (step === "select") {
    const daily   = getDaily();
    const monthly = getMonthly();

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-display text-academy-dark">⚓ Quiz Marina Militare</h2>
          <p className="text-academy-gray">Scegli l'argomento · 10 domande per sessione · scalate solo al completamento</p>

          <div className="flex justify-center gap-3 flex-wrap text-sm">
            <span className="px-3 py-1 rounded-full font-semibold bg-green-50 text-green-700">
              📅 Oggi: {daily.remaining}/{DAILY_LIMIT}
            </span>
            <span className="px-3 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
              📆 Questo mese: {monthly.remaining}/{MONTHLY_LIMIT}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["navigation", "engine", "communications", "safety"] as QuizType[]).map((topic) => {
            const cfg = topicConfig[topic];
            return (
              <button
                key={topic}
                onClick={() => handleStartQuiz(topic)}
                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${cfg.bg}`}
              >
                <div className="text-4xl mb-3">{cfg.icon}</div>
                <div className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</div>
                <div className="text-sm text-academy-gray mt-1">50 domande · 10 per round · conta solo se finisci</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SCHERMATA QUIZ
  if (step === "quiz" && selectedTopic && roundQuestions.length > 0) {
    const q = roundQuestions[currentQ];
    const cfg = topicConfig[selectedTopic];
    const correctIndex = q.correct;
    const progressScore = score + (answered && selectedAnswer === correctIndex ? 1 : 0);

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToSelect}
            className="text-sm text-academy-gray hover:text-academy-blue transition-colors"
          >
            ← Argomenti
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <span className="ml-auto text-sm text-academy-gray font-semibold">Round {roundCount}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-academy-gray">Domanda {currentQ + 1}/{roundQuestions.length}</span>
            <span className="text-academy-blue">⭐ {progressScore}/{roundQuestions.length}</span>
          </div>
          <div className="h-2 bg-academy-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-academy-blue transition-all"
              style={{ width: `${((currentQ + 1) / roundQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className={`text-sm font-semibold mb-3 ${cfg.color}`}>DOMANDA {currentQ + 1}</div>
            <h3 className="text-xl font-bold text-academy-dark">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`p-4 rounded-lg font-semibold transition-all text-left border-2 ${
                  answered
                    ? i === correctIndex
                      ? "bg-green-100 text-green-800 border-green-400"
                      : i === selectedAnswer
                      ? "bg-red-100 text-red-800 border-red-400"
                      : "bg-academy-bg text-academy-gray border-transparent"
                    : "bg-academy-bg hover:bg-academy-blue hover:text-white border-transparent"
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div className={`p-3 rounded-lg text-center font-semibold ${selectedAnswer === correctIndex ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {selectedAnswer === correctIndex
                ? "✓ Risposta corretta!"
                : `✗ Sbagliato! Risposta corretta: ${String.fromCharCode(65 + correctIndex)}`}
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

  // ══════════════════════════════════════════════════════════════════════════
  // SCHERMATA RISULTATI
  if (step === "results") {
    const daily   = getDaily();
    const monthly = getMonthly();
    const percentage = Math.round((roundScore / roundQuestions.length) * 100);
    const totalPct   = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
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
            <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold text-sm">✓ {roundScore} corrette</div>
            <div className="px-4 py-2 bg-red-50 rounded-lg text-red-700 font-semibold text-sm">✗ {roundQuestions.length - roundScore} errate</div>
          </div>

          {roundCount > 1 && (
            <div className="px-4 py-2 bg-academy-bg rounded-lg text-academy-dark font-semibold text-sm">
              📊 Totale sessione: {totalCorrect}/{totalAnswered} ({totalPct}%)
            </div>
          )}

          <div className="flex justify-center gap-3 flex-wrap text-xs">
            <span className="px-3 py-1 bg-academy-bg rounded-full text-academy-gray font-semibold">
              📅 Oggi rimaste: {daily.remaining}/{DAILY_LIMIT}
            </span>
            <span className="px-3 py-1 bg-academy-bg rounded-full text-academy-gray font-semibold">
              📆 Mese: {monthly.remaining}/{MONTHLY_LIMIT}
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleContinueQuiz} className="px-6 py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
            ➕ Altre 10 domande
          </button>
          <button onClick={() => handleStartQuiz(selectedTopic!)} className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors">
            🔄 Ricomincia
          </button>
          <button onClick={handleBackToSelect} className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors">
            🗂️ Cambia argomento
          </button>
        </div>
      </div>
    );
  }

  return null;
}
