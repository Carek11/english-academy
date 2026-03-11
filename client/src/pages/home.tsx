import { courseData } from "@/lib/quizData";

export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 mb-12">
        <h2 className="text-5xl font-bold font-display text-academy-dark">
          Benvenuto nell'English Academy
        </h2>
        <p className="text-lg text-academy-gray max-w-2xl mx-auto">
          La piattaforma italiana per imparare l'inglese in modo professionale, moderno e interattivo. Dai corsi base fino all'inglese tecnico per la{" "}
          <span className="font-semibold text-academy-gold">Marina Militare</span>.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => onNavigate("corsi")}
            className="px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
          >
            🎓 Scopri i Corsi
          </button>
          <button
            onClick={() => onNavigate("quiz")}
            className="px-6 py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors"
          >
            🎯 Fai un Quiz
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-academy-blue">12+</div>
          <div className="text-academy-gray font-semibold">Corsi Disponibili</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-academy-blue">500+</div>
          <div className="text-academy-gray font-semibold">Studenti Attivi</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-academy-blue">50+</div>
          <div className="text-academy-gray font-semibold">Quiz Interattivi</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-academy-blue">98%</div>
          <div className="text-academy-gray font-semibold">Soddisfazione</div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-display text-academy-dark">I Nostri Corsi</h2>
          <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseData.slice(0, 4).map((course, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{course.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-academy-dark">{course.title}</h3>
              <p className="text-academy-gray text-sm mb-4">{course.description}</p>
              <span className="inline-block px-3 py-1 bg-academy-blue text-white text-xs font-semibold rounded">
                {course.badge}
              </span>
              <br />
              <button
                onClick={() => onNavigate("corsi")}
                className="mt-4 px-4 py-2 bg-academy-blue text-white font-semibold rounded hover:bg-academy-light-blue transition-colors text-sm"
              >
                Scopri →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-academy-blue to-academy-dark text-white p-8 rounded-xl space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-semibold opacity-90">⚓ NOVITÀ – SEZIONE MARINA MILITARE</div>
          <h2 className="text-4xl font-bold font-display">Inglese Tecnico per la Marina</h2>
          <p className="text-lg opacity-90">
            Una sezione dedicata interamente alla terminologia navale in inglese. Studia tipologie di navi, componenti, strumentazione di bordo e vocabolario operativo.
          </p>
        </div>
        <button
          onClick={() => onNavigate("marina")}
          className="px-6 py-3 bg-white text-academy-blue font-semibold rounded-lg hover:bg-academy-gold hover:text-white transition-colors"
        >
          ⚓ Esplora la Sezione Marina →
        </button>
      </section>
    </div>
  );
}
