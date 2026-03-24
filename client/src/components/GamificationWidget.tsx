import { UserProgress, getRecentBadges } from "@/lib/gamification";

interface GamificationWidgetProps {
  progress: UserProgress;
}

export default function GamificationWidget({ progress }: GamificationWidgetProps) {
  const recentBadges = getRecentBadges(progress);
  const nextLevelXp = (progress.level * 100) - progress.xp;

  return (
    <div className="space-y-4">
      {/* Streak Counter */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-orange-600 font-semibold">SERIE ATTIVA</p>
            <p className="text-3xl font-bold text-orange-600">{progress.streak} 🔥</p>
            <p className="text-xs text-orange-500 mt-1">giorni consecutivi</p>
          </div>
          <div className="text-5xl">🔥</div>
        </div>
      </div>

      {/* Level & XP */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-blue-600 font-semibold">LIVELLO</p>
            <p className="text-2xl font-bold text-blue-600">{progress.level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-500">XP: {progress.xp % 100}/100</p>
            <p className="text-xs text-blue-500 mt-1">Prossimo: +{nextLevelXp} XP</p>
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((progress.xp % 100) / 100) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-2xl font-bold text-green-600">{progress.totalQuizzesCompleted}</p>
          <p className="text-xs text-green-600">Quiz Completati</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-2xl font-bold text-purple-600">{progress.totalWordsTranslated}</p>
          <p className="text-xs text-purple-600">Parole Tradotte</p>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-700 font-semibold mb-2">BADGE RECENTI</p>
          <div className="flex gap-2 flex-wrap">
            {recentBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white border border-yellow-300 rounded-lg p-2 text-center"
                title={badge.description}
              >
                <p className="text-2xl">{badge.icon}</p>
                <p className="text-xs font-semibold text-yellow-700 mt-1">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Badges */}
      {progress.badges.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-amber-700 font-semibold mb-2">TUTTI I BADGE ({progress.badges.length})</p>
          <div className="grid grid-cols-4 gap-2">
            {progress.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white border border-amber-300 rounded-lg p-2 text-center hover:shadow-md transition-shadow"
                title={badge.description}
              >
                <p className="text-2xl">{badge.icon}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
