import { useState, useEffect, useRef } from "react";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/courses";
import MarinaPage from "@/pages/marina";
import QuizPage from "@/pages/quiz";
import TeamPage from "@/pages/team";
import ContactsPage from "@/pages/contacts";
import AuthPage from "@/pages/auth";

type PageType = "home" | "corsi" | "marina" | "quiz" | "chi-siamo" | "contatti" | "auth";

const TRIAL_DURATION = 5 * 60 * 1000; // 5 minuti

function TrialExpiredModal({ onRegister, onClose }: { onRegister: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-8 text-white text-center">
          <div className="text-5xl mb-4">⚓</div>
          <h2 className="text-2xl font-bold font-display">La prova gratuita è terminata</h2>
          <p className="text-sm opacity-80 mt-2">Hai esplorato English Academy per 5 minuti</p>
        </div>
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-academy-dark font-semibold text-lg">Ti è piaciuto quello che hai visto?</p>
            <p className="text-academy-gray text-sm">
              Registrati gratuitamente per accedere a tutti i corsi, quiz interattivi e alla sezione Marina Militare.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-academy-bg rounded-lg p-3">
              <div className="text-2xl font-bold text-academy-blue">12+</div>
              <div className="text-academy-gray">Corsi</div>
            </div>
            <div className="bg-academy-bg rounded-lg p-3">
              <div className="text-2xl font-bold text-academy-blue">50+</div>
              <div className="text-academy-gray">Quiz</div>
            </div>
            <div className="bg-academy-bg rounded-lg p-3">
              <div className="text-2xl font-bold text-academy-blue">⚓</div>
              <div className="text-academy-gray">Marina</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRegister}
              className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors text-base"
            >
              🎓 Registrati Gratis →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-academy-gray text-sm hover:text-academy-dark transition-colors"
            >
              Continua a esplorare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showTrialModal, setShowTrialModal] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: user, isLoading } = useQuery<{ id: string; username: string; fullName: string; email: string } | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setShowTrialModal(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setShowTrialModal(true);
    }, TRIAL_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, isLoading]);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setCurrentPage("home");
      toast({ title: "Arrivederci!", description: "Disconnessione effettuata." });
    },
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const pages: Record<PageType, React.ReactNode> = {
    home: <HomePage onNavigate={handleNavigate} />,
    corsi: <CoursesPage onNavigate={handleNavigate} />,
    marina: <MarinaPage onNavigate={handleNavigate} />,
    quiz: <QuizPage />,
    "chi-siamo": <TeamPage />,
    contatti: <ContactsPage />,
    auth: <AuthPage onSuccess={() => { queryClient.invalidateQueries({ queryKey: ["/api/me"] }); setCurrentPage("home"); }} />,
  };

  const navButtons: Array<{ id: PageType; label: string; emoji: string }> = [
    { id: "home", label: "Home", emoji: "🏠" },
    { id: "corsi", label: "Corsi", emoji: "📚" },
    { id: "marina", label: "Marina Militare", emoji: "⚓" },
    { id: "quiz", label: "Quiz", emoji: "🎯" },
    { id: "chi-siamo", label: "Chi Siamo", emoji: "👥" },
    { id: "contatti", label: "Contatti", emoji: "✉️" },
  ];

  return (
    <>
      {showTrialModal && !user && !isLoading && (
        <TrialExpiredModal
          onRegister={() => { setShowTrialModal(false); setCurrentPage("auth"); }}
          onClose={() => {
            setShowTrialModal(false);
            timerRef.current = setTimeout(() => setShowTrialModal(true), TRIAL_DURATION);
          }}
        />
      )}

      <header className="bg-gradient-to-r from-academy-blue to-academy-dark text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 hidden sm:block" />
          <div className="flex items-center justify-center gap-10 flex-1">
            <span className="text-3xl hidden sm:block leading-none">⚓</span>
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight whitespace-nowrap">English Academy</h1>
              <p className="text-xs tracking-[0.28em] opacity-70 font-medium whitespace-nowrap hidden sm:block">IMPARA · PRATICA · ECCELLI</p>
            </div>
            <span className="text-3xl hidden sm:block leading-none">⚓</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 min-w-[140px] justify-end flex-1">
            {!isLoading && (
              user ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs opacity-80">👤 {user.fullName}</span>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="text-xs px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold transition-colors"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage("auth")}
                  className="px-4 py-2 bg-white text-academy-blue font-semibold rounded-lg hover:bg-academy-gold hover:text-white transition-colors text-sm"
                >
                  🔐 Accedi
                </button>
              )
            )}
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap justify-center gap-2 bg-white shadow-sm px-4 py-3 sticky top-0 z-50 border-b border-gray-100">
        {navButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setCurrentPage(btn.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              currentPage === btn.id
                ? "bg-academy-blue text-white"
                : "bg-academy-bg hover:bg-academy-light-blue hover:text-white"
            }`}
          >
            {btn.emoji} {btn.label}
          </button>
        ))}
        <div className="sm:hidden ml-auto">
          {!isLoading && (
            user ? (
              <button
                onClick={() => logoutMutation.mutate()}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Esci
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage("auth")}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-academy-blue text-white hover:bg-academy-light-blue transition-colors"
              >
                🔐 Accedi
              </button>
            )
          )}
        </div>
      </nav>

      {user && currentPage !== "auth" && (
        <div className="bg-green-50 border-b border-green-100 py-2 px-4 text-center text-sm text-green-700">
          Bentornato, <strong>{user.fullName}</strong>! 🎓
        </div>
      )}

      {!user && !isLoading && (
        <div className="animate-slow-fade border-b border-academy-blue border-opacity-[0.07] py-1.5 px-4 text-center" style={{ background: "rgba(31,60,136,0.03)" }}>
          <span className="text-[11px] text-academy-blue text-opacity-60 tracking-wide">
            🎓 Prova gratuita attiva &nbsp;·&nbsp;{" "}
            <button
              onClick={() => setCurrentPage("auth")}
              className="opacity-60 hover:opacity-100 transition-opacity duration-300 underline underline-offset-2"
            >
              Accedi per continuare senza limiti
            </button>
          </span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {pages[currentPage]}
      </main>

      <footer className="bg-academy-dark text-white mt-20 py-8 text-center text-sm">
        <p>© 2024 English Academy – Impara l'Inglese in modo Professionale</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppInner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
