import { QuizEngine } from "@/pages/quiz";

export default function QuizNavigationPage() {
  return (
    <QuizEngine
      topics={["navigation"]}
      pageTitle="Navigation Systems Quiz"
      pageIcon="🧭"
      pageSubtitle="Domande specializzate su GPS, Compass, ECDIS, Radar e AIS"
      sourceNote="Fonti: SOLAS, IMO standard di navigazione marittime internazionali"
    />
  );
}
