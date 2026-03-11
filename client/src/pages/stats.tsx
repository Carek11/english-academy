import { useState, useEffect } from "react";
import { getStats, getTotalStats, clearStats, type UserStats } from "@/lib/statsStorage";

const topicLabels: Record<string, { label: string; icon: string }> = {
  marina:         { label: "Marina Generale", icon: "⚓" },
  navigation:     { label: "Navigation",      icon: "🧭" },
  engine:         { label: "Engine Room",     icon: "⚙️" },
  communications: { label: "Communications",  icon: "📡" },
  safety:         { label: "Safety",          icon: "🦺" },
  storia:         { label: "Storia",          icon: "🏛️" },
  geografia:      { label: "Geografia",       icon: "🌍" },
  scienze:        { label: "Scienze",         icon: "🧪" },
  arte:           { label: "Arte",            icon: "🎨" },
  astronomia:     { label: "Astronomia",      icon: "🌌" },
  matematica:     { label: "Matematica",      icon: "📐" },
};

function AccuracyBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const totals = getTotalStats();
  const topicsPlayed = Object.keys(stats);

  const handleClear = () => {
    clearStats();
    setStats({});
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm">
          📊 IL TUO PROGRESSO
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-academy-dark">
          Statistiche Personali
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto leading-relaxed">
          Monitora i tuoi progressi nei quiz. I dati vengono salvati sul tuo dispositivo.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-5 text-center" data-testid="stat-rounds">
          <div className="text-3xl font-bold text-academy-blue">{totals.rounds}</div>
          <div className="text-sm text-academy-gray font-semibold mt-1">Round giocati</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center" data-testid="stat-correct">
          <div className="text-3xl font-bold text-green-600">{totals.correct}</div>
          <div className="text-sm text-academy-gray font-semibold mt-1">Risposte corrette</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center" data-testid="stat-total">
          <div className="text-3xl font-bold text-academy-dark">{totals.total}</div>
          <div className="text-sm text-academy-gray font-semibold mt-1">Domande totali</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center" data-testid="stat-accuracy">
          <div className={`text-3xl font-bold ${totals.accuracy >= 80 ? "text-green-600" : totals.accuracy >= 60 ? "text-yellow-600" : "text-red-500"}`}>
            {totals.accuracy}%
          </div>
          <div className="text-sm text-academy-gray font-semibold mt-1">Precisione</div>
        </div>
      </div>

      {topicsPlayed.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-7xl">🎯</div>
          <h2 className="text-2xl font-bold font-display text-academy-dark">Ancora nessuna statistica</h2>
          <p className="text-academy-gray max-w-md mx-auto">
            Completa il tuo primo quiz per vedere le statistiche qui. Ogni round completato verrà registrato automaticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-display text-academy-dark text-center">Per argomento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topicsPlayed.map((topic) => {
              const s = stats[topic];
              const accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              const meta = topicLabels[topic] || { label: topic, icon: "📝" };
              return (
                <div
                  key={topic}
                  data-testid={`stat-topic-${topic}`}
                  className="bg-white rounded-xl shadow-md p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{meta.icon}</span>
                      <span className="font-bold text-academy-dark">{meta.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${accuracy >= 80 ? "text-green-600" : accuracy >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                      {accuracy}%
                    </span>
                  </div>
                  <AccuracyBar value={accuracy} />
                  <div className="flex justify-between text-xs text-academy-gray">
                    <span>✅ {s.correct}/{s.total} corrette</span>
                    <span>🎮 {s.completed} round</span>
                    <span>📅 {s.lastPlayed}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {topicsPlayed.length > 0 && (
        <div className="text-center">
          {!showClearConfirm ? (
            <button
              data-testid="button-clear-stats"
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-red-400 hover:text-red-600 underline transition-colors"
            >
              🗑️ Azzera tutte le statistiche
            </button>
          ) : (
            <div className="inline-flex flex-col items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-6 py-4">
              <p className="text-red-700 font-semibold text-sm">Sei sicuro? Questa azione non è reversibile.</p>
              <div className="flex gap-3">
                <button onClick={handleClear} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors">
                  Sì, azzera
                </button>
                <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 bg-white text-red-500 text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
