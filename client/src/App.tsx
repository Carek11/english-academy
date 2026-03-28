import { useState, useEffect, useRef, useMemo } from "react";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import { CONFIG } from "@/lib/config";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/courses";
import MarinaPage from "@/pages/marina";
import QuizMarinaPage from "@/pages/quiz-marina";
import QuizNavigationPage from "@/pages/quiz-navigation";
import QuizEngineRoomPage from "@/pages/quiz-engine-room";
import QuizCommunicationsPage from "@/pages/quiz-communications";
import QuizSafetyPage from "@/pages/quiz-safety";
import QuizCulturaPage from "@/pages/quiz-cultura";
import TeamPage from "@/pages/team";
import ContactsPage from "@/pages/contacts";
import AuthPage from "@/pages/auth";
import GlossaryPage from "@/pages/glossary";
import StatsPage from "@/pages/stats";
import NavyEncyclopediaPage from "@/pages/navy-encyclopedia";
import NavyExercisesPage from "@/pages/navy-exercises";
import PremiumPage from "@/pages/premium";
import ProfilePage from "@/pages/profile";
import { glossaryTerms } from "@/lib/glossaryData";
import { getInstantTranslation } from "@/lib/instantTranslator";
import { courseData } from "@/lib/quizData";
import { loadUserProgress, recordWordTranslation, saveUserProgress } from "@/lib/gamification";

// Cache busting - clear cache on new deployment
const APP_VERSION = "1.0.0";
const CACHE_KEY = "app_version";
if (typeof window !== "undefined") {
  const cachedVersion = localStorage.getItem(CACHE_KEY);
  if (cachedVersion !== APP_VERSION) {
    localStorage.clear();
    sessionStorage.clear();
    // Clear all caches
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    localStorage.setItem(CACHE_KEY, APP_VERSION);
  }
}

// Health check on app load
if (import.meta.env.PROD) {
  fetch("/api/_health").catch(() => logger.warn("Health check failed"));
}

type PageType = "home" | "corsi" | "marina" | "quiz-marina" | "quiz-navigation" | "quiz-engine-room" | "quiz-communications" | "quiz-safety" | "quiz-cultura" | "chi-siamo" | "contatti" | "auth" | "glossario" | "statistiche" | "navy-encyclopedia" | "esercizi-marina" | "premium" | "profilo";

const TRIAL_DURATION = Infinity; // ✅ Accesso completamente libero, nessun limite temporale
const MODAL_DISABLED = true; // ✅ NON mostrare MAI il modal registrazione finché non riattivato

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
              disabled={true}
              className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg opacity-60 cursor-not-allowed text-base disabled:opacity-60"
            >
              ⏸ Temporaneamente disabilitato
            </button>
            <p className="text-center text-sm text-orange-600 font-semibold bg-orange-50 p-2 rounded">
              Registrazione disabilitata per 24h. Torna presto!
            </p>
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
  const [dictResults, setDictResults] = useState<any[]>([]);
  const [dictLoading, setDictLoading] = useState(false);
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [navyWikiResults, setNavyWikiResults] = useState<any[]>([]);
  const [navyWikiLoading, setNavyWikiLoading] = useState(false);
  const [selectedWikiArticle, setSelectedWikiArticle] = useState<any>(null);
  const [wikiContent, setWikiContent] = useState<string>("");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [wordTranslation, setWordTranslation] = useState<string>("");
  const [isTranslatingWord, setIsTranslatingWord] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [wordTranslations, setWordTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (q.trim().length < 2) {
      setDictResults([]);
      setWikiResults([]);
      setNavyWikiResults([]);
      return;
    }

    const fetchDict = async () => {
      setDictLoading(true);
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${q.toLowerCase().trim()}`);
        if (res.ok) {
          const data = await res.json();
          setDictResults(data);
        } else {
          setDictResults([]);
        }
      } catch (err) {
        setDictResults([]);
      }
      setDictLoading(false);
    };

    const fetchWiki = async () => {
      setWikiLoading(true);
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q.trim())}&format=json&origin=*&srlimit=2`);
        const data = await res.json();
        setWikiResults(data.query?.search || []);
      } catch (err) {
        setWikiResults([]);
      }
      setWikiLoading(false);
    };

    const fetchNavyWiki = async () => {
      setNavyWikiLoading(true);
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q.trim() + " naval")}&format=json&origin=*&srlimit=2`);
        const data = await res.json();
        setNavyWikiResults(data.query?.search || []);
      } catch (err) {
        setNavyWikiResults([]);
      }
      setNavyWikiLoading(false);
    };

    const timer = setTimeout(() => {
      fetchDict();
      fetchWiki();
      fetchNavyWiki();
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const handleWikiArticleClick = async (title: string) => {
    setSelectedWikiArticle(title);
    setWikiContent("Caricamento...");
    setWordTranslations({});
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`
      );
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0] as any;
      const content = page?.extract || "Contenuto non disponibile";
      setWikiContent(content);
      
      // Pre-traduce tutte le parole in background
      const translations: Record<string, string> = {};
      content.split(/\s+/).forEach((word) => {
        const cleaned = word.replace(/[.,!?;:"()—–-]/g, "");
        const normalized = cleaned.toLowerCase().trim();
        if (normalized && !translations[normalized]) {
          const translation = getInstantTranslation(cleaned);
          translations[normalized] = translation;
        }
      });
      setWordTranslations(translations);
      
      // Gamification: track words translated
      const translatedCount = Object.keys(translations).filter(
        (key) => translations[key] && translations[key] !== key
      ).length;
      if (translatedCount > 0) {
        let progress = loadUserProgress();
        progress = recordWordTranslation(progress, translatedCount);
        saveUserProgress(progress);
      }
    } catch (err) {
      setWikiContent("Errore nel caricamento dell'articolo");
    }
  };

  // Chiudi tooltip quando il mouse si muove
  useEffect(() => {
    if (!hoveredWord) return;

    const handleMouseMove = () => {
      setHoveredWord(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredWord]);

  const handleWordClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.className.includes("word-unit")) {
      const word = target.textContent?.trim();
      if (!word || word.length === 0) return;

      setHoveredWord(word);
      
      // Usa la traduzione pre-calcolata
      const cleaned = word.replace(/[.,!?;:"()—–-]/g, "");
      const normalized = cleaned.toLowerCase().trim();
      const translation = wordTranslations[normalized] || getInstantTranslation(cleaned);
      setWordTranslation(translation);
      setIsTranslatingWord(false);

      // Position tooltip, keeping it within viewport
      let x = e.clientX;
      let y = e.clientY + 25;
      if (window.innerWidth && x + 200 > window.innerWidth) {
        x = window.innerWidth - 220;
      }
      setTooltipPos({ x, y });
    }
  };

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
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {(dictLoading || wikiLoading || navyWikiLoading) && (
              <div className="p-4 text-center text-sm text-academy-gray">
                ⏳ Ricerca in corso...
              </div>
            )}
            {!wikiLoading && wikiResults.length > 0 && (
              <div className="border-b border-gray-200 p-4 bg-blue-50">
                <p className="text-xs font-bold text-academy-dark mb-3">📖 ENCICLOPEDIA GENERICA</p>
                {wikiResults.map((article) => (
                  <button key={article.pageid} onClick={() => handleWikiArticleClick(article.title)} className="mb-2 pb-2 border-b border-gray-300 last:border-b-0 w-full text-left hover:bg-blue-100 p-1 rounded transition-colors">
                    <p className="font-bold text-academy-blue hover:text-academy-light-blue text-sm">{article.title}</p>
                    <p className="text-xs text-academy-gray mt-1 line-clamp-2">{article.snippet.replace(/<[^>]+>/g, "")}</p>
                  </button>
                ))}
              </div>
            )}
            {!navyWikiLoading && navyWikiResults.length > 0 && (
              <div className="border-b border-gray-200 p-4 bg-blue-50">
                <p className="text-xs font-bold text-academy-dark mb-3">⚓ ENCICLOPEDIA NAVALE</p>
                {navyWikiResults.map((article) => (
                  <button key={article.pageid} onClick={() => handleWikiArticleClick(article.title)} className="mb-2 pb-2 border-b border-gray-300 last:border-b-0 w-full text-left hover:bg-blue-100 p-1 rounded transition-colors">
                    <p className="font-bold text-academy-blue hover:text-academy-light-blue text-sm">{article.title}</p>
                    <p className="text-xs text-academy-gray mt-1 line-clamp-2">{article.snippet.replace(/<[^>]+>/g, "")}</p>
                  </button>
                ))}
              </div>
            )}
            {!dictLoading && dictResults.length > 0 && (
              <div className="border-b border-gray-200 p-4 bg-academy-bg">
                <p className="text-xs font-bold text-academy-dark mb-3">📚 VOCABOLARIO INGLESE</p>
                {dictResults.map((word) => (
                  <div key={word.word} className="mb-3 pb-3 border-b border-gray-300 last:border-b-0">
                    <p className="font-bold text-academy-dark text-sm">{word.word}</p>
                    {word.phonetic && <p className="text-xs text-academy-gray italic">{word.phonetic}</p>}
                    {word.meanings && word.meanings[0]?.definitions && (
                      <p className="text-xs text-academy-dark mt-1">
                        {word.meanings[0].definitions[0]?.definition || "Nessuna definizione disponibile"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {results.length === 0 && dictResults.length === 0 && wikiResults.length === 0 && navyWikiResults.length === 0 && (
              <div className="p-6 text-center text-academy-gray text-sm">Nessun risultato per "<strong>{q}</strong>"</div>
            )}
            {results.length > 0 && (
              <>
                <p className="text-xs font-bold text-academy-dark bg-gray-50 px-5 py-2">🎓 ACADEMY</p>
                <ul className="py-2">
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
              </>
            )}
          </div>
        )}
      </div>

      {hoveredWord && (
        <div
          className="fixed bg-academy-dark text-white px-3 py-2 rounded shadow-lg z-[9999] max-w-xs"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            pointerEvents: "auto",
          }}
        >
          <p className="text-xs font-semibold text-academy-gold mb-1">{hoveredWord}</p>
          <p className="text-sm font-light text-white">
            {isTranslatingWord ? "⏳ Traduzione..." : wordTranslation || hoveredWord}
          </p>
          <button
            onClick={() => setHoveredWord(null)}
            className="text-xs mt-2 opacity-60 hover:opacity-100 transition-opacity w-full text-center"
          >
            ✕ Chiudi
          </button>
        </div>
      )}

      {selectedWikiArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[201] flex items-center justify-center p-4" onClick={() => {
          setSelectedWikiArticle(null);
          setHoveredWord(null);
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b bg-academy-bg">
              <h2 className="text-xl font-bold text-academy-dark truncate">{selectedWikiArticle}</h2>
              <button onClick={() => {
                setSelectedWikiArticle(null);
                setHoveredWord(null);
              }} className="text-gray-400 hover:text-gray-600 text-2xl font-bold flex-shrink-0">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6" onClick={handleWordClick}>
              <p className="text-xs text-academy-gray mb-4">💡 Clicca su una parola per la traduzione</p>
              <div className="text-academy-dark leading-relaxed text-sm">
                {wikiContent.slice(0, 2000).split(/\s+/).map((word, i) => {
                  const cleaned = word.replace(/[.,!?;:"()—–-]/g, "");
                  const normalized = cleaned.toLowerCase().trim();
                  const isTranslated = !!wordTranslations[normalized] && wordTranslations[normalized] !== cleaned;
                  
                  return (
                    <span 
                      key={i} 
                      className={`word-unit px-1 rounded transition-colors inline-block ${
                        isTranslated 
                          ? "text-academy-blue font-semibold hover:bg-academy-light-blue hover:text-white cursor-pointer" 
                          : "hover:bg-gray-200 cursor-pointer"
                      }`}
                      role="button"
                      tabIndex={0}
                      title={isTranslated ? `${cleaned} = ${wordTranslations[normalized]}` : ""}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
                {wikiContent.length > 2000 ? "..." : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showGoogleWelcome, setShowGoogleWelcome] = useState(false);
  const [googleWelcomeName, setGoogleWelcomeName] = useState("");
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading } = useQuery<{ id: string; username: string; fullName: string; email: string } | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  // Gestisce redirect Google OAuth (?googleLogin=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleLogin") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] }).then(() => {
        // Recupera il nome utente e mostra il modal benvenuto
        fetch("/api/me").then(r => r.ok ? r.json() : null).then(u => {
          if (u?.fullName) {
            setGoogleWelcomeName(u.fullName.split(" ")[0]);
            setShowGoogleWelcome(true);
          }
        }).catch(() => {});
      });
    }
    if (params.get("authError") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      setCurrentPage("auth");
      toast({ title: "Accesso fallito", description: "Impossibile accedere con Google. Riprova.", variant: "destructive" });
    }
  }, []);

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
    // ✅ Se MODAL_DISABLED, non mostrare MAI il modal
    if (MODAL_DISABLED) {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

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
    "quiz-navigation": <QuizNavigationPage />,
    "quiz-engine-room": <QuizEngineRoomPage />,
    "quiz-communications": <QuizCommunicationsPage />,
    "quiz-safety": <QuizSafetyPage />,
    "quiz-cultura": <QuizCulturaPage />,
    "chi-siamo": <TeamPage />,
    contatti: <ContactsPage />,
    auth: <AuthPage onSuccess={() => { queryClient.invalidateQueries({ queryKey: ["/api/me"] }); setCurrentPage("home"); }} />,
    glossario: <GlossaryPage />,
    statistiche: <StatsPage />,
    "navy-encyclopedia": <NavyEncyclopediaPage />,
    "esercizi-marina": <NavyExercisesPage />,
    premium: <PremiumPage />,
    profilo: <ProfilePage />,
  };

  const navItems = [
    { id: "home", label: "Home", emoji: "🏠" },
    { 
      id: "corsi-dropdown", 
      label: "Corsi", 
      emoji: "📚",
      submenu: [
        { id: "corsi", label: "Corsi d'Inglese", emoji: "📚" },
        { id: "quiz-cultura", label: "Quiz Cultura", emoji: "🎓" },
      ]
    },
    { 
      id: "marina-dropdown", 
      label: "Marina", 
      emoji: "⚓",
      submenu: [
        { id: "marina", label: "Navi Militari", emoji: "⚓" },
        { id: "navy-encyclopedia", label: "Enciclopedia Navale", emoji: "📚" },
        { id: "esercizi-marina", label: "Esercitazioni", emoji: "✏️" },
        { id: "quiz-marina", label: "Quiz Marina", emoji: "🎯" },
      ]
    },
    {
      id: "risorse-dropdown",
      label: "Risorse",
      emoji: "ℹ️",
      submenu: [
        { id: "glossario", label: "Glossario", emoji: "📖" },
        { id: "contatti", label: "Contatti", emoji: "✉️" },
      ]
    },
    { id: "premium",      label: "Premium",        emoji: "💎", highlight: true },
    { id: "profilo",      label: "Profilo",        emoji: "👤" },
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

      {/* Modal Benvenuto Google Login */}
      {showGoogleWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-8 text-white text-center">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold">Benvenuto, {googleWelcomeName}!</h2>
              <p className="text-sm opacity-80 mt-1">Accesso con Google completato</p>
            </div>
            <div className="p-8 text-center space-y-4">
              <p className="text-academy-gray">Sei pronto a migliorare il tuo inglese navale!</p>
              <button
                data-testid="button-google-welcome-quiz"
                onClick={() => { setShowGoogleWelcome(false); setCurrentPage("quiz-marina"); }}
                className="w-full py-3 bg-academy-blue text-white font-bold rounded-lg hover:bg-academy-dark transition-colors shadow-lg"
              >
                ⚓ Inizia Quiz Navale →
              </button>
              <button
                onClick={() => setShowGoogleWelcome(false)}
                className="w-full py-2 text-sm text-academy-gray hover:text-academy-dark transition-colors"
              >
                Esplora il sito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL DISABLED - NON MOSTRARE MAI IL MODAL REGISTRAZIONE */}
      {MODAL_DISABLED === false && showTrialModal && !user && !isLoading && (
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
          <div className="hidden sm:flex items-center gap-2 min-w-[200px] justify-end flex-1">
            {!isLoading && user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold opacity-90 truncate max-w-[120px]">Ciao {user.fullName.split(" ")[0]} 👋</span>
                <button
                  data-testid="button-logout"
                  onClick={() => logoutMutation.mutate()}
                  className="px-3 py-1.5 text-xs font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors border border-white border-opacity-30"
                >
                  Esci
                </button>
              </div>
            ) : !isLoading ? (
              <div className="flex items-center gap-2">
                <a
                  href="/auth/google"
                  data-testid="button-google-navbar"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </a>
                <button
                  data-testid="button-accedi"
                  onClick={() => setCurrentPage("auth")}
                  className="px-4 py-2 text-sm font-bold bg-academy-gold hover:bg-opacity-90 text-white rounded-lg transition-colors shadow"
                >
                  🔐 Accedi
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {showSearch && (
        <SearchModal onNavigate={handleNavigate} onClose={() => setShowSearch(false)} />
      )}

      <nav ref={navRef} className="bg-white shadow-sm border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-2 px-4 py-3 relative">
          {navItems.map((item) => (
            item.submenu ? (
              <div key={item.id} className="relative">
                <button
                  data-testid={`nav-${item.id}`}
                  onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-1 ${
                    currentPage === "corsi" || currentPage === "quiz-cultura" || currentPage === "marina" || currentPage === "quiz-marina" || currentPage === "navy-encyclopedia" || currentPage === "esercizi-marina"
                      ? "bg-academy-blue text-white"
                      : "bg-academy-bg hover:bg-academy-light-blue hover:text-white"
                  }`}
                >
                  {item.emoji} {item.label}
                  <span className={`text-xs transition-transform ${openDropdown === item.id ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id}
                        data-testid={`nav-${sub.id}`}
                        onClick={() => {
                          setCurrentPage(sub.id as PageType);
                          setOpenDropdown(null);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                          currentPage === sub.id
                            ? "bg-academy-blue text-white"
                            : "hover:bg-academy-light-blue hover:text-white"
                        }`}
                      >
                        {sub.emoji} {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => setCurrentPage(item.id as PageType)}
                className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap ${
                  (item as any).highlight
                    ? currentPage === item.id
                      ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-lg"
                      : "bg-gradient-to-r from-sky-300 to-sky-400 text-white hover:shadow-lg"
                    : currentPage === item.id
                      ? "bg-academy-blue text-white"
                      : "bg-academy-bg hover:bg-academy-light-blue hover:text-white"
                }`}
              >
                {item.emoji} {item.label}
              </button>
            )
          ))}
          <button
            data-testid="button-search"
            onClick={() => setShowSearch(true)}
            className="px-3 py-2 rounded-lg font-semibold transition-colors text-sm bg-academy-bg hover:bg-academy-light-blue hover:text-white"
          >
            🔍 Cerca
          </button>
          <div className="sm:hidden flex items-center gap-1">
            {!isLoading && user ? (
              <button
                data-testid="button-logout-mobile"
                onClick={() => logoutMutation.mutate()}
                className="px-3 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Ciao {user.fullName.split(" ")[0]} 👋 · Esci
              </button>
            ) : !isLoading ? (
              <>
                <a
                  href="/auth/google"
                  data-testid="button-google-navbar-mobile"
                  className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </a>
                <button
                  data-testid="button-accedi-mobile"
                  onClick={() => setCurrentPage("auth")}
                  className="px-3 py-2 rounded-lg font-bold text-sm bg-academy-gold text-white hover:bg-opacity-90 transition-colors"
                >
                  🔐 Accedi
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>


      <main className="max-w-6xl mx-auto px-6 py-12">
        <div key={currentPage}>
          {pages[currentPage]}
        </div>
      </main>

      <footer className="bg-academy-dark text-white mt-20 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-bold text-lg mb-10 tracking-tight">© 2024 English Academy – Impara l'Inglese in modo Professionale</p>
          
          <div className="border-t border-white border-opacity-20 pt-8 mb-8">
            <h3 className="font-bold text-base mb-2 opacity-90 tracking-tight">Fonti e Crediti</h3>
            <p className="text-sm opacity-75 mb-6 leading-relaxed">Contenuti creati personalmente con ispirazione dalle seguenti fonti:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-75">
              <div>
                <p className="font-semibold mb-2 text-white opacity-90">Inglese Generale</p>
                <p className="text-xs leading-loose">Cambridge Dictionary, Oxford University Press, BBC Learning English, British Council</p>
              </div>
              <div>
                <p className="font-semibold mb-2 text-white opacity-90">Cultura Generale</p>
                <p className="text-xs leading-loose">Wikipedia, Britannica, National Geographic, Manuali di storia e geografia</p>
              </div>
              <div>
                <p className="font-semibold mb-2 text-white opacity-90">Terminologia Navale</p>
                <p className="text-xs leading-loose">Marina.difesa.it, IMO (International Maritime Organization), Manuali di navigazione</p>
              </div>
            </div>
          </div>
          
          <p className="opacity-60 text-xs tracking-wide">I contenuti sono per scopi educativi e didattici</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppInner />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
