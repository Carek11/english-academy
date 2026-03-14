import { courseData, quizzes } from "@/lib/quizData";
import { useState, useMemo, useCallback } from "react";

type Course = typeof courseData[0];
type QuizQuestion = { question: string; options: string[]; correct: number };

const DAILY_LIMIT = 50;

// --- Sistema limite giornaliero (reset ogni giorno alle 3:00 AM) ---
function getResetTimestamp(): number {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(3, 0, 0, 0);
  if (now < reset) reset.setDate(reset.getDate() - 1); // prima delle 3:00 → reset era ieri
  return reset.getTime();
}

function loadDailyUsage(): number {
  try {
    const raw = localStorage.getItem("englishQuizDaily");
    if (!raw) return 0;
    const data = JSON.parse(raw) as { count: number; resetAt: number };
    if (data.resetAt < getResetTimestamp()) return 0; // nuovo giorno → azzera
    return data.count;
  } catch { return 0; }
}

function saveDailyUsage(count: number) {
  localStorage.setItem("englishQuizDaily", JSON.stringify({ count, resetAt: getResetTimestamp() }));
}

function getNextReset(): string {
  const now = new Date();
  const next = new Date(now);
  next.setHours(3, 0, 0, 0);
  if (now >= next) next.setDate(next.getDate() + 1);
  return next.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) + " di " +
    next.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

// --- Pool domande per corso ---
const courseQuizKey: Record<string, keyof typeof quizzes> = {
  "Inglese Base (A1–A2)": "base",
  "Inglese Pre-Intermedio (A2–B1)": "preintermedio",
  "Inglese Intermedio (B1–B2)": "intermedio",
  "Inglese Avanzato (C1–C2)": "avanzato",
  "Business English": "business",
  "Inglese per Viaggi": "viaggi",
  "Preparazione IELTS / Cambridge": "ielts",
};

const relatedKeys: Record<string, Array<keyof typeof quizzes>> = {
  "base":          ["base", "preintermedio"],
  "preintermedio": ["preintermedio", "base", "intermedio"],
  "intermedio":    ["intermedio", "preintermedio", "avanzato"],
  "avanzato":      ["avanzato", "intermedio", "ielts"],
  "business":      ["business", "intermedio", "avanzato"],
  "viaggi":        ["viaggi", "base", "preintermedio"],
  "ielts":         ["ielts", "avanzato", "intermedio"],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizPool(courseKey: keyof typeof quizzes, total = 50): QuizQuestion[] {
  const keys = relatedKeys[courseKey as string] ?? [courseKey];
  const primary = shuffle(quizzes[keys[0]] as QuizQuestion[]);
  const secondary = shuffle(keys.slice(1).flatMap(k => quizzes[k] as QuizQuestion[]));
  const combined = [...primary, ...secondary];
  const seen = new Set<string>();
  const unique = combined.filter(q => { if (seen.has(q.question)) return false; seen.add(q.question); return true; });
  return unique.slice(0, total);
}

// --- Componente Quiz ---
function CourseQuiz({
  questions, courseKey, usedToday, onBack, onReload
}: {
  questions: QuizQuestion[];
  courseKey: keyof typeof quizzes;
  usedToday: number;
  onBack: () => void;
  onReload: (newUsed: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      const newUsed = usedToday + questions.length;
      saveDailyUsage(newUsed);
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function handleReload() {
    const newUsed = usedToday + questions.length;
    saveDailyUsage(newUsed);
    onReload(newUsed);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const newUsed = usedToday + questions.length;
    const remaining = Math.max(0, DAILY_LIMIT - newUsed);
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-5xl">{pct >= 70 ? "🏆" : pct >= 40 ? "👍" : "📚"}</div>
        <h3 className="text-xl font-bold text-academy-dark">Quiz completato!</h3>
        <p className="text-3xl font-bold text-academy-blue">{score}/{questions.length}</p>
        <p className="text-academy-gray">{pct >= 70 ? "Ottimo risultato!" : pct >= 40 ? "Buon lavoro, continua a studiare!" : "Continua a esercitarti!"}</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-academy-gold h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {remaining > 0 ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-academy-gray">
              Domande rimanenti oggi: <span className="font-bold text-academy-blue">{remaining}</span>
            </p>
            <button
              onClick={handleReload}
              className="w-full py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              🔄 Rifai con 50 nuove domande
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-bold mb-1">⏰ Limite giornaliero raggiunto</p>
            <p>Hai completato le 50 domande di oggi. Torna domani alle <strong>03:00</strong> per un nuovo set!</p>
            <p className="mt-1 text-xs text-amber-600">Prossimo reset: {getNextReset()}</p>
          </div>
        )}

        <button onClick={onBack} className="w-full px-6 py-2 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-bg transition-colors">
          ← Torna al corso
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-academy-gray font-semibold">Domanda {current + 1} di {questions.length}</span>
        <span className="text-xs text-academy-blue font-semibold">Punteggio: {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-academy-blue h-2 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>
      <p className="font-semibold text-academy-dark text-base leading-snug">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let cls = "w-full text-left px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ";
          if (selected === null) cls += "border-gray-200 hover:border-academy-blue hover:bg-academy-bg";
          else if (idx === q.correct) cls += "border-green-500 bg-green-50 text-green-800";
          else if (idx === selected) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-gray-200 opacity-60";
          return (
            <button key={idx} onClick={() => handleAnswer(idx)} className={cls}>
              <span className="font-bold mr-2">{["A", "B", "C", "D"][idx]}.</span> {opt}
              {selected !== null && idx === q.correct && <span className="ml-2">✓</span>}
              {selected !== null && idx === selected && idx !== q.correct && <span className="ml-2">✗</span>}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={handleNext} className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors">
          {current + 1 >= questions.length ? "Vedi risultati →" : "Prossima →"}
        </button>
      )}
    </div>
  );
}

// --- Modal del corso ---
function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const quizKey = courseQuizKey[course.title];
  const [quizStarted, setQuizStarted] = useState(false);
  const [usedToday, setUsedToday] = useState(() => loadDailyUsage());
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => quizKey ? buildQuizPool(quizKey) : []);

  const remaining = Math.max(0, DAILY_LIMIT - usedToday);

  const handleReload = useCallback((newUsed: number) => {
    setUsedToday(newUsed);
    if (quizKey) setQuestions(buildQuizPool(quizKey));
    setCurrent_hack(c => c + 1); // forza re-mount del quiz
    setQuizStarted(true);
  }, [quizKey]);

  // trick per re-mountare CourseQuiz con nuove domande
  const [quizKey2, setCurrent_hack] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{course.icon}</span>
              <div>
                <h3 className="text-xl font-bold font-display">{course.title}</h3>
                <span className="text-xs font-semibold opacity-80 bg-white bg-opacity-20 px-2 py-1 rounded mt-1 inline-block">{course.badge}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 text-2xl leading-none">✕</button>
          </div>
        </div>

        {!quizStarted ? (
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

            {questions.length > 0 && (
              <>
                {remaining > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-academy-gray">
                      <span>Domande disponibili oggi</span>
                      <span className="font-bold text-academy-blue">{remaining}/{DAILY_LIMIT}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-academy-gold h-2 rounded-full" style={{ width: `${(remaining / DAILY_LIMIT) * 100}%` }} />
                    </div>
                    <button
                      onClick={() => setQuizStarted(true)}
                      className="w-full py-3 bg-academy-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-base"
                      data-testid="button-start-quiz"
                    >
                      🎯 Inizia il Quiz — {course.title}
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-bold mb-1">⏰ Limite giornaliero raggiunto</p>
                    <p>Hai completato le 50 domande di oggi. Torna alle <strong>03:00</strong> per un nuovo set!</p>
                    <p className="mt-1 text-xs text-amber-600">Prossimo reset: {getNextReset()}</p>
                  </div>
                )}
              </>
            )}

            <button onClick={onClose} className="w-full px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-bg transition-colors">
              Chiudi
            </button>
          </div>
        ) : (
          <CourseQuiz
            key={quizKey2}
            questions={questions}
            courseKey={quizKey!}
            usedToday={usedToday}
            onBack={() => setQuizStarted(false)}
            onReload={handleReload}
          />
        )}
      </div>
    </div>
  );
}

// --- Pagina Corsi ---
export default function CoursesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const faqs = [
    { q: "Come scelgo il corso giusto?", a: "Inizia con un quiz di livello nella sezione Quiz. Ti aiuteremo a individuare il tuo livello e il percorso più adatto." },
    { q: "I corsi sono online o in presenza?", a: "Offriamo entrambe le modalità. Alcuni corsi specialistici sono disponibili anche in presenza presso sedi convenzionate." },
    { q: "Ricevo un certificato al termine?", a: "Sì. Al termine di ogni corso ricevi un attestato di completamento." },
    { q: "Il corso Marina è aperto solo ai militari?", a: "No. È aperto anche a civili, appassionati di nautica, tecnici portuali e professionisti del settore marittimo." },
  ];

  return (
    <div className="space-y-16">
      {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}

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
            <span className="inline-block px-3 py-1 bg-academy-blue text-white text-xs font-semibold rounded mb-4">{course.badge}</span>
            {course.details.length > 0 && (
              <div className="text-xs text-academy-gray mb-4 space-y-1">
                {course.details.map((d, idx) => <div key={idx}>✓ {d}</div>)}
              </div>
            )}
            <button
              data-testid={`button-course-${i}`}
              onClick={() => setSelectedCourse(course)}
              className="w-full px-4 py-2 bg-academy-blue text-white font-semibold rounded hover:bg-academy-light-blue transition-colors text-sm mt-auto"
            >
              Scopri e fai il Quiz →
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
                <span className={`text-academy-blue transition-transform ${openAccordion === i ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openAccordion === i && (
                <div className="px-6 py-4 bg-academy-bg text-academy-gray border-t border-academy-gray border-opacity-30">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
