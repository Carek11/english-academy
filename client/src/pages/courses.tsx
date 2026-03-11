import { courseData } from "@/lib/quizData";
import { useState } from "react";

type Course = typeof courseData[0];

function CourseModal({ course, onClose, onNavigate }: { course: Course; onClose: () => void; onNavigate: (page: string) => void }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{course.icon}</span>
              <div>
                <h3 className="text-xl font-bold font-display">{course.title}</h3>
                <span className="text-xs font-semibold opacity-80 bg-white bg-opacity-20 px-2 py-1 rounded mt-1 inline-block">
                  {course.badge}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white opacity-70 hover:opacity-100 text-2xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-academy-gray leading-relaxed">{course.description}</p>

          {course.details.length > 0 && (
            <div>
              <h4 className="font-semibold text-academy-dark mb-3">Cosa imparerai:</h4>
              <ul className="space-y-2">
                {course.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-academy-gray">
                    <span className="w-5 h-5 bg-academy-blue text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-academy-bg rounded-lg p-4 text-sm text-academy-gray">
            <div className="font-semibold text-academy-dark mb-1">📅 Durata</div>
            <div>{course.badge} di formazione strutturata</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); onNavigate("auth"); }}
              className="flex-1 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
            >
              🎓 Iscriviti ora
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-bg transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onNavigate={onNavigate}
        />
      )}

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
              onClick={() => setSelectedCourse(course)}
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
