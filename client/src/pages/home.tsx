export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-20">
      <section className="text-center space-y-8 mb-16 pt-8">
        <div className="space-y-3">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-academy-dark leading-tight">
            Come un <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Pro</span>
          </h2>
          <p className="text-sm sm:text-base text-academy-gray font-medium">
            (professionista)
          </p>
          <div className="h-1 w-24 bg-academy-gold mx-auto rounded"></div>
        </div>
        <p className="text-lg text-academy-gray max-w-3xl mx-auto leading-relaxed">
          La piattaforma italiana che trasforma il tuo inglese. Corsi strutturati, quiz interattivi e una sezione specializzata per l'inglese tecnico della{" "}
          <span className="font-semibold text-academy-blue">Marina Militare</span>.
        </p>
        <div className="flex gap-4 justify-center flex-wrap pt-6">
          <button
            onClick={() => onNavigate("corsi")}
            className="px-10 py-5 bg-gradient-to-r from-sky-300 to-academy-blue text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-xl flex items-center gap-3 justify-center"
          >
            <span className="text-3xl">🎓</span> Inizia i Corsi
          </button>
          <button
            onClick={() => onNavigate("quiz-marina")}
            className="px-8 py-4 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors text-lg"
          >
            🎯 Prova i Quiz
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-academy-blue mb-3">12+</div>
          <div className="text-academy-gray font-semibold text-base">Corsi Disponibili</div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-academy-blue mb-3">500+</div>
          <div className="text-academy-gray font-semibold text-base">Studenti Attivi</div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-academy-blue mb-3">50+</div>
          <div className="text-academy-gray font-semibold text-base">Quiz Interattivi</div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-academy-blue mb-3">98%</div>
          <div className="text-academy-gray font-semibold text-base">Soddisfazione</div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-academy-blue to-academy-dark text-white p-16 rounded-2xl space-y-10 my-8">
        <div className="space-y-6">
          <div className="text-sm font-display font-semibold opacity-90 tracking-widest uppercase">⚓ Esclusivo – Marina Militare</div>
          <h2 className="text-5xl font-bold font-display leading-tight">
            Inglese Tecnico per i Professionisti del Mare
          </h2>
          <p className="text-xl opacity-95 leading-relaxed font-light max-w-2xl">
            Una sezione specializzata con terminologia navale autentica. Navi, componenti, strumentazione e vocabolario operativo della Marina Militare. Ideale per chi lavora in ambito militare e marittimo.
          </p>
        </div>
        <button
          onClick={() => onNavigate("marina")}
          className="px-8 py-4 bg-white text-academy-blue font-semibold rounded-lg hover:bg-academy-gold hover:text-white transition-colors text-lg shadow-lg"
        >
          ⚓ Scopri l'Inglese Navale →
        </button>
      </section>
    </div>
  );
}
