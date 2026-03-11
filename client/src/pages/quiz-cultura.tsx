import { QuizEngine } from "@/pages/quiz";

export default function QuizCulturaPage() {
  return (
    <QuizEngine
      topics={["storia", "geografia", "scienze", "arte", "astronomia", "matematica"]}
      pageTitle="Quiz Cultura Generale"
      pageIcon="🎓"
      pageSubtitle="Allenati su storia, scienze, arte e molto altro · 10 domande per sessione"
      sourceNote="Fonti: Wikipedia, Khan Academy, Enciclopedia Britannica"
    />
  );
}
