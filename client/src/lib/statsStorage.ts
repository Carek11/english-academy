export interface TopicStats {
  completed: number;
  correct: number;
  total: number;
  lastPlayed: string;
}

export interface UserStats {
  [topic: string]: TopicStats;
}

const STATS_KEY = "english_academy_stats";

export function getStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveQuizResult(topic: string, correct: number, total: number): void {
  const stats = getStats();
  const existing = stats[topic] || { completed: 0, correct: 0, total: 0, lastPlayed: "" };
  stats[topic] = {
    completed: existing.completed + 1,
    correct: existing.correct + correct,
    total: existing.total + total,
    lastPlayed: new Date().toLocaleDateString("it-IT"),
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getTotalStats(): { rounds: number; correct: number; total: number; accuracy: number } {
  const stats = getStats();
  const rounds = Object.values(stats).reduce((acc, s) => acc + s.completed, 0);
  const correct = Object.values(stats).reduce((acc, s) => acc + s.correct, 0);
  const total = Object.values(stats).reduce((acc, s) => acc + s.total, 0);
  return { rounds, correct, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

export function clearStats(): void {
  localStorage.removeItem(STATS_KEY);
}
