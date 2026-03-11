import { useState } from "react";
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

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<{ id: string; username: string; fullName: string; email: string } | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setCurrentPage("home");
      toast({ title: "Arrivederci!", description: "Disconnessione effettuata." });
    },
  });

  const pages: Record<PageType, React.ReactNode> = {
    home: <HomePage onNavigate={setCurrentPage} />,
    corsi: <CoursesPage onNavigate={setCurrentPage} />,
    marina: <MarinaPage onNavigate={setCurrentPage} />,
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
      <header className="bg-gradient-to-r from-academy-blue to-academy-dark text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-3xl hidden sm:block">⚓</span>
          <div className="text-center flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold font-display">English Academy</h1>
            <p className="text-sm tracking-widest opacity-90">IMPARA · PRATICA · ECCELLI</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 min-w-[140px] justify-end">
            <span className="text-3xl">⚓</span>
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
