import { QuizEngine } from "@/pages/quiz";

export default function QuizSafetyPage() {
  return (
    <QuizEngine
      topics={["safety"]}
      pageTitle="Safety Equipment Quiz"
      pageIcon="🛟"
      pageSubtitle="Domande specializzate su giubbotti di salvataggio, zattera, estintore e segnalazioni di emergenza"
      sourceNote="Fonti: SOLAS, IMO, standard di sicurezza marittima internazionali"
    />
  );
}
