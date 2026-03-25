import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import paypalLogo from "@assets/image_1774397561915.png";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Posso cancellare quando voglio?",
    a: "Sì, puoi cancellare il tuo abbonamento in qualsiasi momento direttamente dal tuo profilo. Nessuna penalità, nessuna burocrazia.",
  },
  {
    q: "Come funziona il periodo gratuito di 7 giorni?",
    a: "Hai 7 giorni completi per esplorare tutti i contenuti Premium senza alcun costo. Se non sei soddisfatto, cancella prima della scadenza e non ti verrà addebitato nulla.",
  },
  {
    q: "Come funziona il rinnovo mensile?",
    a: "L'abbonamento si rinnova automaticamente ogni mese tramite PayPal. Riceverai una notifica via email 3 giorni prima di ogni rinnovo.",
  },
  {
    q: "Quali metodi di pagamento accettate?",
    a: "Accettiamo pagamenti tramite PayPal, che supporta carte di credito, debito e il saldo del tuo conto PayPal. Tutti i pagamenti sono cifrati e sicuri.",
  },
  {
    q: "I miei dati bancari sono al sicuro?",
    a: "Assolutamente sì. Non salviamo mai i tuoi dati bancari sui nostri server. Ogni transazione è gestita interamente da PayPal, che garantisce i massimi standard di sicurezza.",
  },
  {
    q: "Quando ricevo l'eBook in omaggio?",
    a: "L'eBook viene inviato automaticamente via email all'attivazione del piano Premium. Controlla anche la cartella spam se non lo trovi entro pochi minuti.",
  },
];

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Verifica se utente è loggato
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return null;
      return await res.json();
    },
  });

  // Carica stato premium
  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const res = await fetch("/api/user/premium");
        if (res.ok) {
          const data = (await res.json()) as { isPremium: boolean; expiresAt: string | null };
          setIsPremium(data.isPremium);
          setExpiresAt(data.expiresAt);
        }
      } catch (err) {
        console.error("Errore verifica premium:", err);
      }
    };

    if (user) {
      fetchPremium();
    }
  }, [user]);

  // Carica PayPal SDK solo se non premium
  useEffect(() => {
    if (isPremium || !user) return;

    const renderPaypalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (!container) return;

      if ((window as any).paypal && (window as any).paypal.Buttons) {
        try {
          (window as any).paypal
            .Buttons({
              createOrder: async () => {
                // Verifica se l'utente è loggato SOLO al click su PayPal
                if (!user) {
                  alert("❌ Devi essere registrato e loggato per pagare!");
                  throw new Error("Non autenticato");
                }
                const res = await fetch("/api/paypal/create-order", { method: "POST" });
                if (!res.ok) throw new Error("Errore nella creazione dell'ordine");
                const data = (await res.json()) as { orderId: string };
                return data.orderId;
              },
              onApprove: async (data: any) => {
                try {
                  const res = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId: data.orderID }),
                  });

                  if (res.ok) {
                    const result = (await res.json()) as { success: boolean; expiresAt: string };
                    setIsPremium(true);
                    setExpiresAt(result.expiresAt);
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    alert("❌ Errore nel salvataggio del pagamento");
                  }
                } catch (err) {
                  console.error("Errore capture:", err);
                  alert("❌ Errore durante il completamento del pagamento");
                }
              },
              onError: () => alert("❌ Errore durante il pagamento. Riprova."),
            })
            .render("#paypal-button-container");
        } catch (err) {
          console.error("Errore rendering PayPal:", err);
          setPaypalError("Errore nel rendering del bottone PayPal");
        }
      }
    };

    // Check se lo script PayPal esiste già
    if ((window as any).paypal && (window as any).paypal.Buttons) {
      setPaypalLoaded(true);
      renderPaypalButton();
      return;
    }

    // Verifica se lo script è già nel DOM
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    if (existingScript) {
      // Se lo script esiste, attendi che PayPal carichi
      let retries = 0;
      const checkPaypal = () => {
        if ((window as any).paypal && (window as any).paypal.Buttons) {
          setPaypalLoaded(true);
          renderPaypalButton();
        } else if (retries < 10) {
          retries++;
          setTimeout(checkPaypal, 200);
        } else {
          setPaypalError("PayPal SDK non è stato caricato correttamente");
        }
      };
      checkPaypal();
      return;
    }

    const container = document.getElementById("paypal-button-container");
    if (!container) {
      setPaypalError("Contenitore PayPal non trovato");
      return;
    }

    const script = document.createElement("script");
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "AZGdJmVQPfzqNWl8BLgI-v7s9Z6k2M-QJV3pQK4n5_kFXZ8-N0YoJuZ8N3B4K5Z6L7M8";
    
    // Client ID sandbox di default per i test

    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;

    script.onload = () => {
      // Aspetta che PayPal sia disponibile
      let retries = 0;
      const checkPaypal = () => {
        if ((window as any).paypal && (window as any).paypal.Buttons) {
          setPaypalLoaded(true);
          renderPaypalButton();
        } else if (retries < 10) {
          retries++;
          setTimeout(checkPaypal, 200);
        } else {
          setPaypalError("PayPal SDK non è stato caricato correttamente");
        }
      };
      checkPaypal();
    };

    script.onerror = () => {
      setPaypalError("❌ Errore nel caricamento di PayPal. Ricarica la pagina.");
    };

    document.body.appendChild(script);

    return () => {
      // Nulla - lascia lo script in memoria
    };
  }, [isPremium, user]);

  if (userLoading) {
    return <div className="text-center py-20">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4">

        {/* Hero */}
        <section className="text-center space-y-6 mb-14">
          <div className="inline-block px-6 py-3 bg-sky-100 rounded-full text-sky-800 font-semibold text-sm tracking-wide">
            🚀 SBLOCCA IL MASSIMO POTENZIALE
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-academy-dark">
              Diventa <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Premium</span>
            </h1>
            <p className="text-lg text-academy-gray leading-relaxed max-w-2xl mx-auto">
              Accesso illimitato a tutti i corsi, quiz avanzati e statistiche dettagliate.
              Prendi il controllo del tuo apprendimento con una soluzione completa.
            </p>
          </div>
        </section>

        {isPremium ? (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-10 text-center shadow-lg">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-green-700 mb-3">Benvenuto nel Club Premium!</h2>
              <p className="text-lg text-green-600 mb-4">
                Grazie per il supporto. Stai accedendo a tutti i vantaggi esclusivi.
              </p>
              <p className="text-sm text-green-600 mb-6">
                📅 Valido fino al{" "}
                <span className="font-bold text-green-700">
                  {expiresAt ? new Date(expiresAt).toLocaleDateString("it-IT") : "data sconosciuta"}
                </span>
              </p>
              <a href="/" className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                ⚓ Torna alla Home →
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-10 text-center border-2 border-amber-200 shadow-lg">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-academy-dark mb-2">Bonus Esclusivo Premium</h3>
              <p className="text-academy-gray mb-2 text-sm font-medium">Ti verrà spedito via mail</p>
              <p className="text-academy-gray mb-6 text-base leading-relaxed">
                Appena diventi premium ricevi un ebook professionale di inglese navale!
              </p>
              <a
                href="/ebook-english-naval.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                data-testid="button-download-ebook"
              >
                ⬇️ Scarica l&apos;eBook Gratuito
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-14">

            {/* Vantaggi */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-blue-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-academy-dark mb-1">Quiz Illimitati</h3>
                <p className="text-academy-gray text-sm">Pratica quanto vuoi senza limiti giornalieri o mensili. Migliora il tuo inglese al tuo ritmo.</p>
              </div>
              <div className="bg-white border border-green-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-academy-dark mb-1">Analytics Avanzate</h3>
                <p className="text-academy-gray text-sm">Segui i tuoi progressi con grafici, statistiche e insights sulle aree da migliorare.</p>
              </div>
              <div className="bg-white border border-purple-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-academy-dark mb-1">Niente Pubblicità</h3>
                <p className="text-academy-gray text-sm">Concentrati sull'apprendimento senza distrazioni. Esperienza pulita e professionale.</p>
              </div>
              <div className="bg-white border border-orange-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-academy-dark mb-1">Accesso Offline</h3>
                <p className="text-academy-gray text-sm">Scarica i contenuti e studia ovunque, anche senza connessione internet.</p>
              </div>
            </div>

            {/* Ebook Bonus */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center border-2 border-amber-200 shadow-sm">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-academy-dark mb-1">Bonus Esclusivo Premium</h3>
              <p className="text-academy-gray text-sm mb-1">Ti verrà spedito via mail</p>
              <p className="text-academy-gray text-sm leading-relaxed">
                Appena diventi premium ricevi un ebook professionale di inglese navale!
              </p>
            </div>

            {/* Prezzo */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-10 text-white text-center shadow-xl">
              <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">Piano Premium</p>
              <div className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm font-semibold mb-6">
                🎁 7 giorni gratuiti, poi €7.99/mese — cancella quando vuoi
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-6xl font-black">€7.99</span>
                <span className="text-lg font-semibold opacity-80">/mese</span>
              </div>

              {paypalError ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                  <p className="font-bold">⚠️ {paypalError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    data-testid="button-reload-premium"
                  >
                    🔄 Ricarica Pagina
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div id="paypal-button-container" className="mb-2 min-h-12"></div>
                  {!paypalLoaded && (
                    <div className="text-center">
                      <p className="text-white font-semibold text-base mb-3">Paga ora con PayPal</p>
                      <button
                        onClick={() => {
                          if (!user) {
                            alert("❌ Devi essere registrato e loggato per pagare!");
                            return;
                          }
                          fetch("/api/paypal/create-order", { method: "POST" })
                            .then(res => res.json())
                            .then(data => {
                              window.open(`https://www.sandbox.paypal.com/checkoutnow?token=${data.orderId}`, "_blank");
                            })
                            .catch(() => alert("❌ Errore nell'inizializzazione del pagamento"));
                        }}
                        className="w-full max-w-sm mx-auto px-10 py-4 bg-yellow-400 hover:bg-yellow-500 rounded-xl transition-all shadow-lg hover:shadow-2xl font-bold text-yellow-900"
                        data-testid="button-paypal-payment"
                      >
                        <div className="flex items-center justify-center">
                          <img src={paypalLogo} alt="PayPal" className="h-14 object-contain" style={{ mixBlendMode: "darken" }} />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs font-medium opacity-70 mt-8 pt-6 border-t border-white/20">
                💳 Pagamento 100% sicuro con PayPal
              </p>
            </div>

            {/* Garanzia */}
            <div className="bg-sky-50 border-l-4 border-sky-500 rounded-lg p-7">
              <h3 className="font-bold text-academy-dark mb-3 flex items-center gap-2">
                <span className="text-xl">🛡️</span> Garanzia di Soddisfazione
              </h3>
              <ul className="space-y-2 text-academy-gray text-sm">
                <li className="flex gap-2"><span className="text-sky-600 font-bold">✓</span><span>Accesso immediato a tutti i contenuti Premium</span></li>
                <li className="flex gap-2"><span className="text-sky-600 font-bold">✓</span><span>Nessun vincolo: cancella l'abbonamento in qualsiasi momento</span></li>
                <li className="flex gap-2"><span className="text-sky-600 font-bold">✓</span><span>Pagamento sicuro e protetto da PayPal</span></li>
                <li className="flex gap-2"><span className="text-sky-600 font-bold">✓</span><span>Nessun dato bancario salvato sui nostri server</span></li>
              </ul>
            </div>

            {/* FAQ */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-2xl font-bold text-academy-dark">Domande Frequenti</h3>
                <p className="text-academy-gray text-sm">Tutto quello che devi sapere prima di iscriverti</p>
              </div>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm mt-10">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-sky-50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      data-testid={`faq-toggle-${i}`}
                    >
                      <span className="font-semibold text-academy-dark text-sm md:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="px-6 pb-5 text-academy-gray text-sm leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
