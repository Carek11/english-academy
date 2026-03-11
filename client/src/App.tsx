import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/courses";
import MarinaPage from "@/pages/marina";
import QuizPage from "@/pages/quiz";
import TeamPage from "@/pages/team";
import ContactsPage from "@/pages/contacts";

type PageType = "home" | "corsi" | "marina" | "quiz" | "chi-siamo" | "contatti";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  const pages: Record<PageType, React.ReactNode> = {
    home: <HomePage onNavigate={setCurrentPage} />,
    corsi: <CoursesPage onNavigate={setCurrentPage} />,
    marina: <MarinaPage onNavigate={setCurrentPage} />,
    quiz: <QuizPage />,
    "chi-siamo": <TeamPage />,
    contatti: <ContactsPage />,
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        
        <header className="bg-gradient-to-r from-academy-blue to-academy-dark text-white py-8 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
            <span className="text-4xl">⚓</span>
            <div className="text-center">
              <h1 className="text-5xl font-bold font-display">English Academy</h1>
              <p className="text-sm tracking-widest opacity-90">IMPARA · PRATICA · ECCELLI</p>
            </div>
            <span className="text-4xl">⚓</span>
          </div>
        </header>

        <nav className="flex flex-wrap justify-center gap-3 bg-white shadow-sm p-4 sticky top-0 z-50">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentPage(btn.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === btn.id
                  ? "bg-academy-blue text-white"
                  : "bg-academy-bg hover:bg-academy-light-blue hover:text-white"
              }`}
            >
              {btn.emoji} {btn.label}
            </button>
          ))}
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          {pages[currentPage]}
        </main>

        <footer className="bg-academy-dark text-white mt-20 py-8 text-center text-sm">
          <p>© 2024 English Academy – Impara l'Inglese in modo Professionale</p>
        </footer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
