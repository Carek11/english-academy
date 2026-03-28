import { QuizEngine } from "@/pages/quiz";

export default function QuizCommunicationsPage() {
  return (
    <QuizEngine
      topics={["communications"]}
      pageTitle="Communications Quiz"
      pageIcon="📡"
      pageSubtitle="Domande specializzate su VHF, satellite phone, lampada segnaletica e sistemi IFF"
      sourceNote="Fonti: SOLAS, IMO, GMDSS standard di comunicazione marittima internazionali"
    />
  );
}
