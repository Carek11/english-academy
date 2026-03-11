import { QuizEngine } from "@/pages/quiz";

export default function QuizMarinaPage() {
  return (
    <QuizEngine
      topics={["marina", "navigation", "engine", "communications", "safety"]}
      pageTitle="Naval English Quiz"
      pageIcon="⚓"
      pageSubtitle="Preparati in inglese tecnico per la Marina Militare · 10 domande per sessione"
      sourceNote="Fonti: SOLAS, IMO, Marina Militare Italiana, standard marittimi internazionali"
    />
  );
}
