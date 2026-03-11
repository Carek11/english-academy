import { courseData } from "@/lib/quizData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CoursesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCourseClick = (courseName: string) => {
    toast({
      title: "Corso selezionato",
      description: `${courseName} - Contatta info@englishacademy.it per iscriverti!`,
    });
  };

  const faqs = [
    {
      q: "Come scelgo il corso giusto?",
      a: "Inizia con un quiz di livello nella sezione Quiz. Ti aiuteremo a individuare il tuo livello e il percorso più adatto.",
    },
    {
      q: "I corsi sono online o in presenza?",
      a: "Offriamo entrambe le modalità. Alcuni corsi specialistici sono disponibili anche in presenza presso sedi convenzionate.",
    },
    {
      q: "Ricevo un certificato al termine?",
      a: "Sì. Al termine di ogni corso ricevi un attestato di completamento.",
    },
    {
      q: "Il corso Marina è aperto solo ai militari?",
      a: "No. È aperto anche a civili, appassionati di nautica, tecnici portuali e professionisti del settore marittimo.",
    },
  ];

  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-display text-academy-dark">Tutti i Corsi</h2>
        <p className="text-academy-gray">Scegli il percorso più adatto alle tue esigenze</p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseData.map((course, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
            <div className="text-3xl mb-3">{course.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-academy-dark">{course.title}</h3>
            <p className="text-academy-gray text-sm mb-4 flex-grow">{course.description}</p>
            <span className="inline-block px-3 py-1 bg-academy-blue text-white text-xs font-semibold rounded mb-4">
              {course.badge}
            </span>
            {course.details.length > 0 && (
              <div className="text-xs text-academy-gray mb-4 space-y-1">
                {course.details.map((d, idx) => (
                  <div key={idx}>✓ {d}</div>
                ))}
              </div>
            )}
            <button
              onClick={() => handleCourseClick(course.title)}
              className="w-full px-4 py-2 bg-academy-blue text-white font-semibold rounded hover:bg-academy-light-blue transition-colors text-sm"
            >
              Scopri →
            </button>
          </div>
        ))}
      </div>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold font-display text-academy-dark">Domande Frequenti</h3>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-academy-gray border-opacity-30 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-academy-bg transition-colors"
              >
                <span className="font-semibold text-academy-dark text-left">{faq.q}</span>
                <span className={`text-academy-blue transition-transform ${openAccordion === i ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {openAccordion === i && (
                <div className="px-6 py-4 bg-academy-bg text-academy-gray border-t border-academy-gray border-opacity-30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
