import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

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
      } finally {
        setLoading(false);
      }
    };

    fetchPremium();
  }, []);

  // Carica PayPal SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"}`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).paypal) {
        (window as any).paypal
          .Buttons({
            createOrder: async () => {
              const res = await fetch("/api/paypal/create-order", { method: "POST" });
              const data = (await res.json()) as { orderId: string };
              return data.orderId;
            },
            onApprove: async (data: any) => {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              });

              if (res.ok) {
                const result = (await res.json()) as { success: boolean; expiresAt: string };
                setIsPremium(true);
                setExpiresAt(result.expiresAt);
                window.location.reload();
              }
            },
            onError: () => alert("Errore durante il pagamento"),
          })
          .render("#paypal-button-container");
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-20">Caricamento...</div>;
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-academy-dark">💎 Premium</h1>
        <p className="text-academy-gray">Sblocca tutte le funzioni</p>
      </section>

      {isPremium ? (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Sei Premium!</h2>
          <p className="text-green-600 mb-4">
            Grazie per il supporto. Scade il{" "}
            {expiresAt
              ? new Date(expiresAt).toLocaleDateString("it-IT")
              : "data sconosciuta"}
          </p>
          <a href="/" className="text-green-700 hover:underline font-semibold">
            Torna alla home
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Vantaggi */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-academy-dark mb-3">📚 Quiz Illimitati</h3>
              <p className="text-academy-gray">Niente limiti giornalieri o mensili</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-academy-dark mb-3">🎯 Statistiche Avanzate</h3>
              <p className="text-academy-gray">Analizza i tuoi progressi in dettaglio</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-academy-dark mb-3">🚀 Niente Ads</h3>
              <p className="text-academy-gray">Esperienza senza pubblicità</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-bold text-academy-dark mb-3">⚡ Accesso Offline</h3>
              <p className="text-academy-gray">Usa l'app anche senza internet</p>
            </div>
          </div>

          {/* Prezzo */}
          <div className="bg-gradient-to-r from-academy-blue to-blue-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">€4.99/mese</h2>
            <p className="mb-6 opacity-90">Primo mese, poi rinnovo automatico</p>
            <div id="paypal-button-container"></div>
          </div>

          {/* Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-sm text-academy-gray">
            <p className="mb-2">
              💳 Pagamento sicuro gestito da PayPal. Nessun dato bancario salvato sui nostri server.
            </p>
            <p>Potrai cancellare l'abbonamento in qualsiasi momento.</p>
          </div>
        </div>
      )}
    </div>
  );
}
