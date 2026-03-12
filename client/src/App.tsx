import { useState, useEffect, useRef, useMemo } from "react";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/courses";
import MarinaPage from "@/pages/marina";
import QuizMarinaPage from "@/pages/quiz-marina";
import QuizCulturaPage from "@/pages/quiz-cultura";
import TeamPage from "@/pages/team";
import ContactsPage from "@/pages/contacts";
import AuthPage from "@/pages/auth";
import GlossaryPage from "@/pages/glossary";
import StatsPage from "@/pages/stats";
import { glossaryTerms } from "@/lib/glossaryData";
import { courseData } from "@/lib/quizData";

type PageType = "home" | "corsi" | "marina" | "quiz-marina" | "quiz-cultura" | "chi-siamo" | "contatti" | "auth" | "glossario" | "statistiche";

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

function SearchModal({ onNavigate, onClose }: { onNavigate: (p: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lower = q.toLowerCase();
    const glossaryResults = glossaryTerms
      .filter((t) => t.en.toLowerCase().includes(lower) || t.it.toLowerCase().includes(lower) || (t.description?.toLowerCase().includes(lower) ?? false))
      .slice(0, 5)
      .map((t) => ({ type: "glossario" as PageType, label: `${t.en} — ${t.it}`, sub: "Glossario Navale", icon: "📖" }));
    const courseResults = courseData
      .filter((c) => c.title.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower))
      .slice(0, 3)
      .map((c) => ({ type: "corsi" as PageType, label: c.title, sub: "Corsi", icon: "📚" }));
    return [...glossaryResults, ...courseResults];
  }, [q]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b">
          <span className="text-2xl">🔍</span>
          <input
            autoFocus
            data-testid="input-global-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca corsi, termini navali, argomenti..."
            className="flex-1 text-base outline-none text-academy-dark placeholder-gray-400"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>
        {q.trim().length < 2 ? (
          <div className="p-6 text-center text-academy-gray text-sm">Inizia a digitare per cercare...</div>
        ) : results.length === 0 ? (
          <div className="p-6 text-center text-academy-gray text-sm">Nessun risultato per "<strong>{q}</strong>"</div>
        ) : (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  data-testid={`search-result-${i}`}
                  onClick={() => { onNavigate(r.type); onClose(); }}
                  className="w-full text-left px-5 py-3 hover:bg-academy-bg transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <p className="font-semibold text-academy-dark text-sm">{r.label}</p>
                    <p className="text-xs text-academy-gray">{r.sub}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verifyMessage, setVerifyMessage] = useState("");
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: user, isLoading } = useQuery<{ id: string; username: string; fullName: string; email: string } | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  // Gestisce il link di verifica email (?token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;
    setVerifyState("loading");
    // Rimuovi il token dall'URL
    window.history.replaceState({}, "", window.location.pathname);
    fetch(`/api/verify/${token}`)
      .then(async (r) => {
        const data = await r.json();
        if (r.ok) {
          setVerifyState("success");
          setVerifyMessage(`Bentornato/a, ${data.fullName}! Il tuo account è stato attivato con successo.`);
          queryClient.invalidateQueries({ queryKey: ["/api/me"] });
        } else {
          setVerifyState("error");
          setVerifyMessage(data.message || "Link non valido o già utilizzato.");
        }
      })
      .catch(() => {
        setVerifyState("error");
        setVerifyMessage("Errore durante la verifica. Riprova.");
      });
  }, []);

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
    "quiz-marina": <QuizMarinaPage />,
    "quiz-cultura": <QuizCulturaPage />,
    "chi-siamo": <TeamPage />,
    contatti: <ContactsPage />,
    auth: <AuthPage onSuccess={() => { queryClient.invalidateQueries({ queryKey: ["/api/me"] }); setCurrentPage("home"); }} />,
    glossario: <GlossaryPage />,
    statistiche: <StatsPage />,
  };

  const navButtons: Array<{ id: PageType; label: string; emoji: string }> = [
    { id: "home",         label: "Home",           emoji: "🏠" },
    { id: "corsi",        label: "Corsi",           emoji: "📚" },
    { id: "marina",       label: "Marina",          emoji: "⚓" },
    { id: "quiz-marina",  label: "Quiz Marina",     emoji: "🎯" },
    { id: "quiz-cultura", label: "Quiz Cultura",    emoji: "🎓" },
    { id: "statistiche",  label: "Statistiche",     emoji: "📊" },
    { id: "glossario",    label: "Glossario",       emoji: "📖" },
    { id: "chi-siamo",    label: "Chi Siamo",       emoji: "👥" },
    { id: "contatti",     label: "Contatti",        emoji: "✉️" },
  ];

  return (
    <>
      {/* Banner verifica email */}
      {verifyState === "loading" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[300] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-4xl mb-4 animate-spin">⚓</div>
            <p className="text-academy-blue font-semibold text-lg">Verifica in corso...</p>
          </div>
        </div>
      )}
      {(verifyState === "success" || verifyState === "error") && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`p-8 text-center ${verifyState === "success" ? "bg-gradient-to-r from-academy-blue to-academy-dark" : "bg-gradient-to-r from-red-700 to-red-900"} text-white`}>
              <div className="text-5xl mb-3">{verifyState === "success" ? "✅" : "❌"}</div>
              <h2 className="text-xl font-bold">{verifyState === "success" ? "Account Attivato!" : "Verifica fallita"}</h2>
            </div>
            <div className="p-8 text-center space-y-4">
              <p className="text-academy-dark">{verifyMessage}</p>
              <button
                onClick={() => { setVerifyState("idle"); if (verifyState === "success") setCurrentPage("home"); }}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
              >
                {verifyState === "success" ? "⚓ Vai alla Home →" : "Chiudi"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 sm:gap-10">
              <span className="text-xl sm:text-3xl leading-none">⚓</span>
              <h1 className="text-3xl sm:text-5xl font-bold font-display leading-tight whitespace-nowrap">English Academy</h1>
              <span className="text-xl sm:text-3xl leading-none">⚓</span>
            </div>
            <p className="text-xs tracking-[0.28em] opacity-70 font-medium mt-3">IMPARA · PRATICA · ECCELLI</p>
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

      {showSearch && (
        <SearchModal onNavigate={handleNavigate} onClose={() => setShowSearch(false)} />
      )}

      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-2 px-4 py-3">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              data-testid={`nav-${btn.id}`}
              onClick={() => setCurrentPage(btn.id)}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap ${
                currentPage === btn.id
                  ? "bg-academy-blue text-white"
                  : "bg-academy-bg hover:bg-academy-light-blue hover:text-white"
              }`}
            >
              {btn.emoji} {btn.label}
            </button>
          ))}
          <button
            data-testid="button-search"
            onClick={() => setShowSearch(true)}
            className="px-3 py-2 rounded-lg font-semibold transition-colors text-sm bg-academy-bg hover:bg-academy-light-blue hover:text-white"
          >
            🔍 Cerca
          </button>
          <div className="sm:hidden flex items-center">
            {!isLoading && (
              user ? (
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="px-3 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Esci
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage("auth")}
                  className="px-3 py-2 rounded-lg font-semibold text-sm bg-academy-blue text-white hover:bg-academy-light-blue transition-colors"
                >
                  🔐 Accedi
                </button>
              )
            )}
          </div>
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div key={currentPage}>
          {pages[currentPage]}
        </div>
      </main>

      <footer className="bg-academy-dark text-white mt-20 py-12 text-center text-sm">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-semibold text-base mb-6">© 2024 English Academy – Impara l'Inglese in modo Professionale</p>
          
          <div className="border-t border-white border-opacity-20 pt-6 mb-6">
            <p className="font-semibold mb-3 opacity-80">Fonti e Crediti</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs opacity-70">
              <div>
                <p className="font-semibold mb-2">Inglese Generale</p>
                <p>Cambridge Dictionary, Oxford University Press, BBC Learning English, British Council</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Cultura Generale</p>
                <p>Wikipedia, Britannica, National Geographic, Manuali di storia e geografia</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Terminologia Navale</p>
                <p>Marina.difesa.it, IMO (International Maritime Organization), Manuali di navigazione</p>
              </div>
            </div>
          </div>
          
          <p className="opacity-60 text-xs">I contenuti sono per scopi educativi e didattici</p>
        </div>
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
