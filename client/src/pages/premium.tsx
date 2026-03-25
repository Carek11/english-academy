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
              fundingSource: (window as any).paypal.FUNDING.PAYPAL,
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
    <div className="space-y-12 max-w-4xl mx-auto py-12 px-4">
      <section className="text-center space-y-6">
        <div className="inline-block px-6 py-3 bg-sky-200 rounded-full text-sky-900 font-bold text-sm tracking-wider">
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
          <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 rounded-2xl p-10 text-white text-center shadow-xl">
            <h2 className="text-sm font-bold tracking-widest opacity-90 mb-3">PIANO ANNUALE</h2>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-bold">€4.99</span>
              <span className="text-xl opacity-90">/mese</span>
            </div>
            <p className="text-sm opacity-90 mb-8">
              Primo mese al prezzo pieno, rinnovo automatico. Cancella quando vuoi.
            </p>
            
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
              <div className="space-y-4">
                <div id="paypal-button-container" className="mb-6 min-h-12"></div>
                
                {!paypalLoaded && (
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
                    className="w-full px-8 py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-blue-600 rounded-lg hover:from-yellow-500 hover:via-yellow-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-2xl active:shadow-md font-bold text-lg"
                    data-testid="button-paypal-payment"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <img src={paypalLogo} alt="PayPal" className="h-8 object-contain mix-blend-mode: darken" style={{ mixBlendMode: "darken" }} />
                      <span className="text-white">Paga Ora</span>
                    </div>
                  </button>
                )}
                
                {!paypalLoaded && (
                  <div className="text-sm opacity-75 text-center">⏳ Caricamento PayPal...</div>
                )}
              </div>
            )}
            
            <p className="text-xs opacity-75">💳 Pagamento 100% sicuro con PayPal</p>
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
