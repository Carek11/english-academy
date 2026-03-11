export default function TeamPage() {
  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm">
          LA NOSTRA STORIA
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-academy-dark tracking-tight">
          Come è nata English Academy
        </h1>
        <p className="text-lg text-academy-gray max-w-3xl mx-auto leading-loose">
          Una visione semplice: far imparare l'inglese a chi vuole davvero farlo, in modo vero e pratico, senza compromessi.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>

      {/* STORY 1 */}
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-display text-academy-dark">Il punto di partenza</h2>
            <p className="text-academy-gray leading-loose">
              Abbiamo visto troppi corsi online generici, piattaforme che insegnano come se stessi imparando una formula matematica. Parole senza contesto, grammatica senza vita, niente che assomigliasse a come si parla veramente.
            </p>
            <p className="text-academy-gray leading-loose">
              Così abbiamo deciso: facciamo diverso. Un luogo dove l'inglese non è solo una lingua, ma uno strumento reale per raggiungere i tuoi obiettivi.
            </p>
          </div>
          <div className="bg-gradient-to-br from-academy-blue to-academy-dark rounded-2xl p-12 text-white text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-lg font-semibold">Imparare davvero significa fare, non solo leggere.</p>
          </div>
        </div>
      </section>

      {/* STORY 2 */}
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-academy-gold via-yellow-400 to-orange-400 rounded-2xl p-12 text-white text-center md:order-2">
            <div className="text-6xl mb-4">⚓</div>
            <p className="text-lg font-semibold">L'inglese tecnico della Marina Militare: dove la lingua salva le vite.</p>
          </div>
          <div className="space-y-4 md:order-1">
            <h2 className="text-3xl font-bold font-display text-academy-dark">Una specialità unica</h2>
            <p className="text-academy-gray leading-loose">
              Cosa succede se l'equipaggio di una nave non capisce i comandi in inglese? Cosa succede se manca una comunicazione critica tra porti? Per la Marina Militare italiana, l'inglese non è opzionale — è essenziale.
            </p>
            <p className="text-academy-gray leading-loose">
              Per questo abbiamo creato una sezione completamente dedicata all'inglese navale: terminologia di bordo, sistemi di navigazione, comunicazioni radio d'emergenza. Rigoroso, pratico, salvavita.
            </p>
          </div>
        </div>
      </section>

      {/* STORY 3 */}
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-display text-academy-dark">Quiz interattivi come strumento di crescita</h2>
            <p className="text-academy-gray leading-loose">
              Non crediamo nella passività. Non basta guardare video: la lingua si impara facendo, rispondendo a domande, sbagliando, corregendo, riprovando.
            </p>
            <p className="text-academy-gray leading-loose">
              I nostri quiz non sono banali quiz a quiz — sono esercitazioni reali su Navigation Systems, Engine Room, Communications, Safety Equipment. Cose che servono davvero sul campo.
            </p>
            <p className="text-academy-gray leading-loose font-semibold text-academy-blue">
              50 domande al giorno, 1000 al mese. Non di più, non di meno. La qualità conta.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg font-semibold text-academy-dark">Imparare con un proposito richiede focus e costanza.</p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold font-display text-academy-dark text-center mb-12">Quello in cui crediamo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-academy-dark mb-3">Pratico, non teorico</h3>
            <p className="text-academy-gray text-sm leading-loose">
              L'inglese deve servire. Se non puoi usarlo per comunicare davvero, non lo stai imparando.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">⚓</div>
            <h3 className="text-xl font-bold text-academy-dark mb-3">Specializzazione significa serietà</h3>
            <p className="text-academy-gray text-sm leading-loose">
              Non siamo tutto per tutti. Siamo eccellenti in quello che facciamo: corsi generali e inglese navale.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-academy-dark mb-3">Trasparenza totale</h3>
            <p className="text-academy-gray text-sm leading-loose">
              Niente costi nascosti, niente panico marketing. Solo: prova gratis, poi scegli se continuare.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-r from-academy-blue to-academy-dark text-white py-16 px-6 rounded-2xl text-center space-y-6">
        <h2 className="text-4xl font-bold font-display">Il tuo viaggio con English Academy inizia ora</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Non è mai troppo tardi per imparare l'inglese. Che tu voglia partecipare a riunioni internazionali, leggere articoli in lingua, o servire in una nave da guerra della Marina Militare — sei nel posto giusto.
        </p>
        <p className="text-sm opacity-80">
          5 minuti gratis. Nessuna carta di credito. Nessun trucco. Soltanto vero insegnamento.
        </p>
        <div className="text-6xl">⚓</div>
      </section>

      {/* VISION */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold font-display text-academy-dark">La visione</h2>
        <p className="text-lg text-academy-gray leading-loose">
          In 5 anni vogliamo essere il riferimento per chi vuole imparare l'inglese in modo serio e pratico. Non il più grande, ma il migliore. Non per tutti, ma per chi conta.
        </p>
        <p className="text-lg text-academy-gray leading-loose">
          Vogliamo che i nostri studenti non solo parlino inglese, ma lo usino con confidenza e precisione. Nella sala riunioni, al porto, sulla nave, in qualsiasi situazione.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>
    </div>
  );
}
