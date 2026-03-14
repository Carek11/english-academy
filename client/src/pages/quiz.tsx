import { useState } from "react";
import { quizzes, shipQuestions } from "@/lib/quizData";
import { saveQuizResult } from "@/lib/statsStorage";

/**
 * CERTIFICATO COPYRIGHT
 * ─────────────────────
 * Le domande di Marina Militare sono CONTENUTO ORIGINALE creato appositamente
 * per English Academy. Non sono copiate da materiali protetti da copyright.
 *
 * Basate su standard pubblici internazionali:
 * - SOLAS (Safety of Life at Sea) - standard pubblico
 * - IMO (International Maritime Organization) - documenti pubblici
 * - Marina Militare Italiana - linee guida pubbliche
 * - Convenzioni marittime - dominio pubblico
 *
 * Ogni domanda è generata originariamente e non costituisce violazione di copyright.
 */

export type QuizType =
  | "marina"
  | "navigation"
  | "engine"
  | "communications"
  | "safety"
  | "storia"
  | "geografia"
  | "scienze"
  | "arte"
  | "astronomia"
  | "matematica";

const DAILY_LIMIT_PER_TOPIC = 50;
const MONTHLY_LIMIT = 1000;
const RESET_HOUR = 3;
const QUESTIONS_PER_ROUND = 10;

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

export const getDaily = (topic?: QuizType): { used: number; remaining: number } => {
  const day = getQuizDay();
  const raw = localStorage.getItem("dailyQuizCount");
  if (!raw) return { used: 0, remaining: DAILY_LIMIT_PER_TOPIC };
  const data = JSON.parse(raw);
  if (data.date !== day) return { used: 0, remaining: DAILY_LIMIT_PER_TOPIC };
  
  if (!topic) {
    const totalUsed = Object.values(data.counts || {}).reduce((a: number, b: any) => a + (b || 0), 0);
    return { used: totalUsed, remaining: Math.max(0, DAILY_LIMIT_PER_TOPIC - totalUsed) };
  }
  
  const used = data.counts?.[topic] || 0;
  return { used, remaining: Math.max(0, DAILY_LIMIT_PER_TOPIC - used) };
};

const recordDaily = (count: number, topic: QuizType) => {
  const day = getQuizDay();
  const raw = localStorage.getItem("dailyQuizCount");
  const data = raw ? JSON.parse(raw) : { date: day, counts: {} };
  
  if (data.date !== day) {
    data.date = day;
    data.counts = {};
  }
  
  data.counts[topic] = (data.counts[topic] || 0) + count;
  localStorage.setItem("dailyQuizCount", JSON.stringify(data));
};

export const getMonthly = (): { used: number; remaining: number } => {
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

export const consumeRound = (topic: QuizType) => {
  recordDaily(QUESTIONS_PER_ROUND, topic);
  recordMonthly(QUESTIONS_PER_ROUND);
};

const encouragementMessages = [
  "🌟 Ben fatto!", "⚓ Fantastico!", "💪 Ottimo lavoro!", "🎯 Eccellente!",
  "🏆 Complimenti!", "✨ Meraviglioso!", "🚀 Spettacolare!", "👏 Bravissimo!",
];

export const topicConfig: Record<QuizType, { label: string; icon: string; color: string; bg: string }> = {
  navigation:     { label: "Navigation System",  icon: "🧭", color: "text-blue-700",   bg: "bg-blue-50 border-blue-300"     },
  engine:         { label: "Engine Room",         icon: "⚙️", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" },
  communications: { label: "Communications",      icon: "📡", color: "text-green-700",  bg: "bg-green-50 border-green-300"   },
  safety:         { label: "Safety Equipment",    icon: "🦺", color: "text-red-700",    bg: "bg-red-50 border-red-300"       },
  marina:         { label: "Marina Generale",     icon: "⚓", color: "text-academy-blue", bg: "bg-blue-50 border-blue-300"  },
  storia:         { label: "Storia",              icon: "🏛️", color: "text-purple-700", bg: "bg-purple-50 border-purple-300" },
  geografia:      { label: "Geografia",           icon: "🌍", color: "text-teal-700",   bg: "bg-teal-50 border-teal-300"     },
  scienze:        { label: "Scienze",             icon: "🧪", color: "text-green-700",  bg: "bg-green-50 border-green-300"   },
  arte:           { label: "Arte",                icon: "🎨", color: "text-pink-700",   bg: "bg-pink-50 border-pink-300"     },
  astronomia:     { label: "Astronomia",          icon: "🌌", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-300" },
  matematica:     { label: "Matematica",          icon: "📐", color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-300"     },
};

interface QuizEngineProps {
  topics: QuizType[];
  pageTitle: string;
  pageIcon: string;
  pageSubtitle: string;
  sourceNote: string;
}

export function QuizEngine({ topics, pageTitle, pageIcon, pageSubtitle, sourceNote }: QuizEngineProps) {
  const [step, setStep] = useState<"select" | "quiz" | "results" | "loading">("select");
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
  const [autoLoadTimeout, setAutoLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAutoLoadMsg, setShowAutoLoadMsg] = useState(false);

  const generateRound = (topic: QuizType) => {
    if (topic === "marina") {
      const shipOrder = ["Aircraft Carrier", "Destroyer", "Submarine", "Frigate", "Corvette", "Patrol Vessel"];
      const shipQs = shipOrder.map((ship) => {
        const pool = shipQuestions[ship];
        return pool[Math.floor(Math.random() * pool.length)];
      });
      const generalQs = [...quizzes.marina].sort(() => Math.random() - 0.5).slice(0, 4);
      return [...shipQs, ...generalQs];
    }
    return [...quizzes[topic]].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);
  };

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
    const finalScore = score + (roundQuestions[currentQ].correct === selectedAnswer ? 1 : 0);
    if (selectedTopic) consumeRound(selectedTopic);
    setRoundScore(finalScore);
    setTotalCorrect((t) => t + finalScore);
    setTotalAnswered((t) => t + roundQuestions.length);
    setEncouragementMsg(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
    if (selectedTopic) saveQuizResult(selectedTopic, finalScore, roundQuestions.length);
    
    // Auto-load prossime domande se disponibili per questo argomento
    const daily = selectedTopic ? getDaily(selectedTopic) : getDaily();
    if (daily.remaining > 0) {
      setStep("results");
      setShowAutoLoadMsg(true);
      const timeout = setTimeout(() => {
        handleAutoLoadNextRound();
      }, 3000);
      setAutoLoadTimeout(timeout);
    } else {
      setStep("results");
      setShowAutoLoadMsg(false);
    }
  };

  const handleAutoLoadNextRound = () => {
    setShowAutoLoadMsg(false);
    setRoundQuestions(generateRound(selectedTopic!));
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setRoundCount((r) => r + 1);
    setStep("quiz");
  };

  const handleStopAutoLoad = () => {
    if (autoLoadTimeout) {
      clearTimeout(autoLoadTimeout);
      setAutoLoadTimeout(null);
    }
    setShowAutoLoadMsg(false);
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

  // ─── SELEZIONE ARGOMENTO ───────────────────────────────────────────────────
  if (step === "select") {
    const monthly = getMonthly();

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">{pageIcon}</div>
          <h2 className="text-3xl font-bold font-display text-academy-dark">{pageTitle}</h2>
          <p className="text-academy-gray">{pageSubtitle}</p>
          <p className="text-xs text-academy-gray opacity-70">{sourceNote}</p>
          <div className="flex justify-center gap-3 flex-wrap text-sm">
            <span className="px-3 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
              📆 Questo mese: {monthly.remaining}/{MONTHLY_LIMIT}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const cfg = topicConfig[topic];
            const daily = getDaily(topic);
            const isLimitReached = daily.remaining === 0;
            return (
              <button
                key={topic}
                data-testid={`start-quiz-${topic}`}
                onClick={() => !isLimitReached && handleStartQuiz(topic)}
                disabled={isLimitReached}
                className={`p-6 rounded-xl border-2 text-left transition-all ${isLimitReached ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} ${cfg.bg}`}
              >
                <div className="text-4xl mb-3">{cfg.icon}</div>
                <div className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</div>
                <div className="text-sm text-academy-gray mt-1">
                  {isLimitReached 
                    ? "❌ Limite giornaliero raggiunto"
                    : `10 domande per round · ${daily.remaining}/50 rimaste oggi`
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
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
                data-testid={`answer-option-${i}`}
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
          data-testid="button-next"
          onClick={handleNext}
          disabled={!answered}
          className="w-full px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQ < roundQuestions.length - 1 ? "Prossima →" : "Vedi risultati →"}
        </button>
      </div>
    );
  }

  // ─── RISULTATI ────────────────────────────────────────────────────────────
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
              📅 Oggi rimaste per {selectedTopic}: {daily.remaining}/{DAILY_LIMIT_PER_TOPIC}
            </span>
            <span className="px-3 py-1 bg-academy-bg rounded-full text-academy-gray font-semibold">
              📆 Mese: {monthly.remaining}/{MONTHLY_LIMIT}
            </span>
          </div>
        </div>

        {showAutoLoadMsg && (
          <div className="p-4 rounded-lg bg-blue-50 border-2 border-academy-blue text-center">
            <div className="text-sm font-semibold text-academy-blue mb-3">⏳ Auto-caricamento nuove domande in 3 secondi...</div>
            <button
              data-testid="button-stop-auto-load"
              onClick={handleStopAutoLoad}
              className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm border border-red-300"
            >
              ⏹ Ferma auto-load
            </button>
          </div>
        )}

        {!showAutoLoadMsg && (
          <div className="flex gap-3 justify-center flex-wrap">
            <button data-testid="button-more-questions" onClick={handleContinueQuiz} className="px-6 py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
              ➕ Altre 10 domande
            </button>
            <button data-testid="button-restart" onClick={() => handleStartQuiz(selectedTopic!)} className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors">
              🔄 Ricomincia
            </button>
            <button data-testid="button-change-topic" onClick={handleBackToSelect} className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors">
              🗂️ Cambia argomento
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
