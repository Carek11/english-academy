import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import paypalLogo from "@assets/image_1774397561915.png";

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50">
    <div className="space-y-16 max-w-4xl mx-auto py-16 px-4">
      <section className="text-center space-y-12 pb-8">
        <div className="inline-block px-8 py-4 bg-sky-200 rounded-full text-sky-900 font-bold text-sm tracking-wider">
          🚀 SBLOCCA IL MASSIMO POTENZIALE
        </div>
        <h1 className="text-5xl font-bold text-academy-dark">
          Diventa <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">Premium</span>
        </h1>
        <p className="text-xl text-academy-gray max-w-2xl mx-auto leading-relaxed">
          Accesso illimitato a tutti i corsi, quiz avanzati e statistiche dettagliate. 
          Prendi il controllo del tuo apprendimento con una soluzione completa.
        </p>
      </section>

      {isPremium ? (
        <div className="space-y-10">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-green-700 mb-3">Benvenuto nel Club Premium!</h2>
            <p className="text-lg text-green-600 mb-6">
              Grazie per il supporto. Stai accedendo a tutti i vantaggi esclusivi.
            </p>
            <p className="text-sm text-green-600 mb-6">
              📅 Valido fino al <span className="font-bold text-green-700">
                {expiresAt ? new Date(expiresAt).toLocaleDateString("it-IT") : "data sconosciuta"}
              </span>
            </p>
            <a href="/" className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              ⚓ Torna alla Home →
            </a>
          </div>

          {/* Ebook Bonus - Solo per Premium */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-10 text-center border-2 border-amber-200 shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-academy-dark mb-3">Bonus Esclusivo Premium</h3>
            <p className="text-academy-gray mb-6 max-w-xl mx-auto text-base leading-relaxed">
              Con il piano premium avrai la possibilità di scaricare un ebook molto utile sull'inglese tecnico!
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
        <div className="space-y-10">
          {/* Vantaggi */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-blue-100 rounded-xl p-7 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-academy-dark mb-2">Quiz Illimitati</h3>
              <p className="text-academy-gray">Pratica quanto vuoi senza limiti giornalieri o mensili. Migliora il tuo inglese al tuo ritmo.</p>
            </div>
            <div className="bg-white border-2 border-green-100 rounded-xl p-7 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-academy-dark mb-2">Analytics Avanzate</h3>
              <p className="text-academy-gray">Segui i tuoi progressi dettagli con grafici, statistiche e insights su aree da migliorare.</p>
            </div>
            <div className="bg-white border-2 border-purple-100 rounded-xl p-7 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-academy-dark mb-2">Niente Ads</h3>
              <p className="text-academy-gray">Concentrati sull'apprendimento senza distrazioni. Esperienza pulita e professionale.</p>
            </div>
            <div className="bg-white border-2 border-orange-100 rounded-xl p-7 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-academy-dark mb-2">Accesso Offline</h3>
              <p className="text-academy-gray">Scarica i contenuti e studia ovunque, anche senza connessione internet.</p>
            </div>
          </div>

          {/* Prezzo - Sezione Principale */}
          <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 rounded-2xl p-12 text-white text-center shadow-xl">
            <h2 className="text-xs font-black tracking-widest opacity-95 mb-4 uppercase letter-spacing-2">Piano Premium</h2>
            <p className="text-base font-bold opacity-100 mb-8 max-w-sm mx-auto bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              🎁 7 giorni gratuiti, poi €7.99 al mese. Cancella quando vuoi.
            </p>
            <div className="mb-10">
              <div className="text-6xl font-black leading-tight">€7.99</div>
              <div className="text-xl font-semibold opacity-90 mt-2">al mese</div>
            </div>
            
            {paypalError ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
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
              <div className="space-y-6">
                <div id="paypal-button-container" className="mb-8 min-h-12"></div>
                
                {!paypalLoaded && (
                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-4">Paga ora</p>
                    <button
                      onClick={() => {
                        if (!user) {
                          alert("❌ Devi essere registrato e loggato per pagare!");
                          return;
                        }
                        // Trigger pagamento manuale se PayPal SDK non è caricato
                        fetch("/api/paypal/create-order", { method: "POST" })
                          .then(res => res.json())
                          .then(data => {
                            window.open(`https://www.sandbox.paypal.com/checkoutnow?token=${data.orderId}`, "_blank");
                          })
                          .catch(() => alert("❌ Errore nell'inizializzazione del pagamento"));
                      }}
                      className="w-full px-10 py-5 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all shadow-lg hover:shadow-2xl active:shadow-md font-bold"
                      data-testid="button-paypal-payment"
                    >
                      <div className="flex items-center justify-center">
                        <img src={paypalLogo} alt="PayPal" className="h-16 object-contain" style={{ mixBlendMode: "darken" }} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-sm font-medium opacity-85 mt-10 pt-10 border-t border-white border-opacity-30">💳 Pagamento 100% sicuro con PayPal</p>
          </div>

          {/* Garanzia */}
          <div className="bg-sky-50 border-l-4 border-sky-500 rounded-lg p-8">
            <h3 className="font-bold text-academy-dark mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span> Garanzia di Soddisfazione
            </h3>
            <ul className="space-y-2 text-academy-gray">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Accesso immediato a tutti i contenuti Premium</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Nessun vincolo: cancella l'abbonamento in qualsiasi momento</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Pagamento sicuro e protetto da PayPal</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Nessun dato bancario salvato sui nostri server</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-academy-dark text-center mb-6">❓ Domande Frequenti</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-academy-dark mb-2">Posso cancellare quando voglio?</h4>
              <p className="text-academy-gray">Sì, cancella il tuo abbonamento in qualsiasi momento dal tuo account. Nessuna penalità.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-academy-dark mb-2">Come funziona il rinnovo?</h4>
              <p className="text-academy-gray">L'abbonamento si rinnova automaticamente ogni mese. Riceverai una notifica 3 giorni prima del rinnovo.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-academy-dark mb-2">Quali metodi di pagamento accettate?</h4>
              <p className="text-academy-gray">Accettiamo PayPal, il metodo più sicuro e affidabile per i tuoi acquisti online.</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
