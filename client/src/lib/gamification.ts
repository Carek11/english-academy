// Sistema di gamification: streak, badges, progressi

export interface UserProgress {
  userId: string;
  streak: number;
  lastActivityDate: string;
  totalQuizzesCompleted: number;
  totalWordsTranslated: number;
  badges: Badge[];
  level: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

const BADGES = {
  first_quiz: {
    id: "first_quiz",
    name: "Primo Quiz",
    description: "Hai completato il tuo primo quiz",
    icon: "🎯",
  },
  streak_3: {
    id: "streak_3",
    name: "Tre Giorni",
    description: "3 giorni consecutivi di utilizzo",
    icon: "🔥",
  },
  streak_7: {
    id: "streak_7",
    name: "Una Settimana",
    description: "7 giorni consecutivi di utilizzo",
    icon: "⭐",
  },
  streak_30: {
    id: "streak_30",
    name: "Un Mese",
    description: "30 giorni consecutivi di utilizzo",
    icon: "👑",
  },
  translated_50: {
    id: "translated_50",
    name: "Traduttore Esperto",
    description: "50 parole tradotte",
    icon: "📚",
  },
  translated_100: {
    id: "translated_100",
    name: "Maestro di Traduzione",
    description: "100 parole tradotte",
    icon: "🏆",
  },
  quiz_10: {
    id: "quiz_10",
    name: "Quiz Master",
    description: "10 quiz completati",
    icon: "🎓",
  },
  quiz_50: {
    id: "quiz_50",
    name: "Esperto Navale",
    description: "50 quiz completati",
    icon: "⚓",
  },
};

// Recupera progress dal localStorage
export function loadUserProgress(): UserProgress {
  const stored = localStorage.getItem("user_progress");
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    userId: `user_${Date.now()}`,
    streak: 0,
    lastActivityDate: new Date().toISOString().split("T")[0],
    totalQuizzesCompleted: 0,
    totalWordsTranslated: 0,
    badges: [],
    level: 1,
    xp: 0,
  };
}

// Salva progress su localStorage
export function saveUserProgress(progress: UserProgress) {
  localStorage.setItem("user_progress", JSON.stringify(progress));
}

// Aggiorna streak basato sulla data
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = progress.lastActivityDate;

  // Se è la stessa giornata, non fare nulla
  if (lastDate === today) {
    return progress;
  }

  // Controlla se è il giorno successivo
  const lastDateObj = new Date(lastDate + "T00:00:00");
  const todayObj = new Date(today + "T00:00:00");
  const dayDiff = (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24);

  let newStreak = progress.streak;
  if (dayDiff === 1) {
    newStreak = progress.streak + 1;
  } else if (dayDiff > 1) {
    newStreak = 1; // Reset streak se salta giorni
  }

  const updated = {
    ...progress,
    streak: newStreak,
    lastActivityDate: today,
  };

  // Controlla badge per streak
  checkStreakBadges(updated);

  return updated;
}

// Registra completamento quiz
export function recordQuizCompletion(progress: UserProgress, xpGain: number = 10): UserProgress {
  progress = updateStreak(progress);

  const updated = {
    ...progress,
    totalQuizzesCompleted: progress.totalQuizzesCompleted + 1,
    xp: progress.xp + xpGain,
  };

  // Aggiorna level ogni 100 XP
  updated.level = Math.floor(updated.xp / 100) + 1;

  // Controlla badge per quiz
  checkQuizBadges(updated);

  saveUserProgress(updated);
  return updated;
}

// Registra traduzione di parola
export function recordWordTranslation(progress: UserProgress, count: number = 1): UserProgress {
  progress = updateStreak(progress);

  const updated = {
    ...progress,
    totalWordsTranslated: progress.totalWordsTranslated + count,
  };

  // Controlla badge per traduzioni
  checkTranslationBadges(updated);

  saveUserProgress(updated);
  return updated;
}

// Controlla e sblocca badge per streak
function checkStreakBadges(progress: UserProgress) {
  const streakBadges = [
    { threshold: 3, badgeId: "streak_3" },
    { threshold: 7, badgeId: "streak_7" },
    { threshold: 30, badgeId: "streak_30" },
  ];

  streakBadges.forEach(({ threshold, badgeId }) => {
    if (progress.streak >= threshold && !progress.badges.some((b) => b.id === badgeId)) {
      const badge = BADGES[badgeId as keyof typeof BADGES];
      progress.badges.push({
        ...badge,
        unlockedAt: new Date().toISOString(),
      });
    }
  });
}

// Controlla e sblocca badge per quiz
function checkQuizBadges(progress: UserProgress) {
  const quizBadges = [
    { threshold: 1, badgeId: "first_quiz" },
    { threshold: 10, badgeId: "quiz_10" },
    { threshold: 50, badgeId: "quiz_50" },
  ];

  quizBadges.forEach(({ threshold, badgeId }) => {
    if (progress.totalQuizzesCompleted >= threshold && !progress.badges.some((b) => b.id === badgeId)) {
      const badge = BADGES[badgeId as keyof typeof BADGES];
      progress.badges.push({
        ...badge,
        unlockedAt: new Date().toISOString(),
      });
    }
  });
}

// Controlla e sblocca badge per traduzioni
function checkTranslationBadges(progress: UserProgress) {
  const translationBadges = [
    { threshold: 50, badgeId: "translated_50" },
    { threshold: 100, badgeId: "translated_100" },
  ];

  translationBadges.forEach(({ threshold, badgeId }) => {
    if (progress.totalWordsTranslated >= threshold && !progress.badges.some((b) => b.id === badgeId)) {
      const badge = BADGES[badgeId as keyof typeof BADGES];
      progress.badges.push({
        ...badge,
        unlockedAt: new Date().toISOString(),
      });
    }
  });
}

// Ottiene badge sblocchiati di recente (ultimi 7 giorni)
export function getRecentBadges(progress: UserProgress): Badge[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return progress.badges.filter((badge) => {
    const unlockedDate = new Date(badge.unlockedAt);
    return unlockedDate >= sevenDaysAgo;
  });
}
