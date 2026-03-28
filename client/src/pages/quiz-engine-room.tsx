import { QuizEngine } from "@/pages/quiz";

export default function QuizEngineRoomPage() {
  return (
    <QuizEngine
      topics={["engine"]}
      pageTitle="Engine Room Quiz"
      pageIcon="⚡"
      pageSubtitle="Domande specializzate su motore principale, caldaia, generatore e sistemi ausiliari"
      sourceNote="Fonti: SOLAS, IMO, standard di propulsione navale internazionali"
    />
  );
}
