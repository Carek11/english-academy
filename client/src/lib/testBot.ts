/**
 * TestBot: Simula un utente che fa quiz e traduzioni
 * SOLO PER LOCALHOST - Non usare in produzione!
 */

import { loadUserProgress, recordQuizCompletion, recordWordTranslation, saveUserProgress } from "./gamification";

export interface TestBotConfig {
  interval: number; // millisecondi tra le azioni
  quizzes: boolean; // se fare quiz
  translations: boolean; // se tradurre parole
  verbose: boolean; // log console
}

const DEFAULT_CONFIG: TestBotConfig = {
  interval: 5000, // ogni 5 secondi
  quizzes: true,
  translations: true,
  verbose: true,
};

let botRunning = false;
let botInterval: NodeJS.Timeout | null = null;

export function startTestBot(config: Partial<TestBotConfig> = {}) {
  if (botRunning) {
    log("❌ Bot già in esecuzione");
    return;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  botRunning = true;

  log(`🤖 TestBot avviato! Interval: ${finalConfig.interval}ms`);

  botInterval = setInterval(() => {
    if (Math.random() < 0.6 && finalConfig.quizzes) {
      simulateQuizCompletion();
    } else if (finalConfig.translations) {
      simulateTranslation();
    }
  }, finalConfig.interval);

  // Esponi funzione per stoppa
  (window as any).stopTestBot = stopTestBot;
  log("💡 Digita: stopTestBot() per fermare");
}

export function stopTestBot() {
  if (!botRunning) {
    log("❌ Bot non è in esecuzione");
    return;
  }

  if (botInterval) clearInterval(botInterval);
  botRunning = false;
  log("⏹️ TestBot fermato");
}

function simulateQuizCompletion() {
  try {
    let progress = loadUserProgress();

    // Simula risposta: 60% corrette, 40% sbagliate
    const score = Math.floor(Math.random() * 10);
    const xpGain = 10 + Math.floor(score / 2); // 10 base + bonus

    progress = recordQuizCompletion(progress, xpGain);
    saveUserProgress(progress);

    log(`📚 Quiz completato: +${xpGain} XP | Score: ${score}/10 | Livello: ${progress.level}`);
  } catch (err) {
    log(`❌ Errore quiz: ${err}`);
  }
}

function simulateTranslation() {
  try {
    let progress = loadUserProgress();

    // Simula 10-50 parole tradotte
    const wordCount = Math.floor(Math.random() * 40) + 10;

    progress = recordWordTranslation(progress, wordCount);
    saveUserProgress(progress);

    log(`🌐 ${wordCount} parole tradotte | Totale: ${progress.totalWordsTranslated}`);
  } catch (err) {
    log(`❌ Errore traduzione: ${err}`);
  }
}

function log(msg: string) {
  const timestamp = new Date().toLocaleTimeString("it-IT");
  console.log(`[${timestamp}] ${msg}`);
}

// Esporta funzioni globalmente
if (typeof window !== "undefined") {
  (window as any).startTestBot = startTestBot;
  (window as any).stopTestBot = stopTestBot;
}
