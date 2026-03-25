import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [statsDropdownOpen, setStatsDropdownOpen] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return null;
      return await res.json();
    },
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ["/api/user/premium"],
    queryFn: async () => {
      const res = await fetch("/api/user/premium");
      if (!res.ok) return null;
      return await res.json();
    },
  });

  const handleCancelPremium = async () => {
    if (!confirm("Sei sicuro di voler cancellare il tuo abbonamento premium? Non potrai più accedere ai contenuti premium.")) {
      return;
    }

    setCancelLoading(true);
    try {
      const res = await fetch("/api/user/cancel-premium", { method: "POST" });
      if (res.ok) {
        alert("✅ Abbonamento cancellato con successo!");
        window.location.reload();
      } else {
        alert("❌ Errore nella cancellazione. Riprova.");
      }
    } catch (err) {
      alert("❌ Errore nella cancellazione. Riprova.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setLocation("/");
      window.location.reload();
    } catch (err) {
      alert("❌ Errore nel logout");
    }
  };

  if (userLoading) {
    return <div className="text-center py-20">Caricamento...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-academy-gray text-lg mb-6">Devi essere loggato per accedere al profilo</p>
        <a href="/auth" className="inline-block px-6 py-3 bg-academy-blue text-white font-bold rounded-lg hover:bg-academy-dark transition-colors">
          Vai al Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="space-y-8 max-w-3xl mx-auto py-12 px-4">
        <section className="text-center space-y-6">
          <div className="inline-block px-6 py-3 bg-sky-200 rounded-full text-sky-900 font-bold text-sm tracking-wider">
            👤 IL TUO PROFILO
          </div>
          <h1 className="text-4xl font-bold text-academy-dark">Profilo Personale</h1>
        </section>

        {/* Info Utente */}
        <div className="bg-white border-2 border-sky-100 rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-academy-dark mb-6">Informazioni Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-academy-gray mb-1">Email</p>
              <p className="text-lg text-academy-dark">{user.email}</p>
            </div>
            {user.googleId && (
              <div>
                <p className="text-sm font-semibold text-academy-gray mb-1">Autenticazione</p>
                <p className="text-lg text-academy-dark">Google Account</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Premium */}
        {premiumStatus && (
          <div className={`rounded-2xl p-8 shadow-md border-2 ${premiumStatus.isPremium ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {premiumStatus.isPremium ? "✨ Stato Premium" : "💎 Abbonamento"}
            </h2>
            {premiumStatus.isPremium ? (
              <div className="space-y-4">
                <p className="text-lg text-green-700 font-semibold">Sei iscritto al piano Premium</p>
                {premiumStatus.expiresAt && (
                  <p className="text-academy-gray">
                    📅 Valido fino al <span className="font-bold text-green-700">
                      {new Date(premiumStatus.expiresAt).toLocaleDateString("it-IT")}
                    </span>
                  </p>
                )}
                <button
                  onClick={handleCancelPremium}
                  disabled={cancelLoading}
                  className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-cancel-premium-profile"
                >
                  {cancelLoading ? "Cancellazione in corso..." : "❌ Cancella Abbonamento"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-academy-gray">Non sei ancora premium</p>
                <a href="/premium" className="inline-block px-8 py-3 bg-academy-blue text-white font-bold rounded-lg hover:bg-academy-dark transition-colors">
                  💎 Passa a Premium →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Statistiche Dropdown */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-md">
          <button
            onClick={() => setStatsDropdownOpen(!statsDropdownOpen)}
            className="w-full flex items-center justify-between text-left"
            data-testid="button-stats-dropdown"
          >
            <h2 className="text-2xl font-bold text-academy-dark flex items-center gap-2">
              📊 Statistiche
            </h2>
            <ChevronDown
              size={24}
              className={`text-academy-gray transition-transform ${statsDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          
          {statsDropdownOpen && (
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              <a
                href="/statistiche"
                className="block px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-lg text-academy-blue font-semibold transition-colors"
                data-testid="link-progress-stats"
              >
                📈 Progresso Generale
              </a>
              <a
                href="/statistiche"
                className="block px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-lg text-academy-blue font-semibold transition-colors"
                data-testid="link-course-stats"
              >
                📚 Statistiche Corsi
              </a>
              <a
                href="/statistiche"
                className="block px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-lg text-academy-blue font-semibold transition-colors"
                data-testid="link-quiz-stats"
              >
                🎯 Risultati Quiz
              </a>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            data-testid="button-logout-profile"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
