import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function NavyEncyclopediaPage() {
  const [search, setSearch] = useState("");
  const [localResults, setLocalResults] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articleContent, setArticleContent] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["navy-wiki", search],
    queryFn: async () => {
      if (search.trim().length < 2) {
        setLocalResults([]);
        return [];
      }

      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(search.trim() + " naval ship navy maritime")}&format=json&origin=*&srlimit=10`
        );
        const data = await res.json();
        setLocalResults(data.query?.search || []);
        return data.query?.search || [];
      } catch (err) {
        setLocalResults([]);
        return [];
      }
    },
    enabled: search.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const handleArticleClick = async (title: string) => {
    setSelectedArticle(title);
    setArticleContent("Caricamento...");
    setTranslatedContent("");
    setIsTranslated(false);
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`
      );
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0] as any;
      setArticleContent(page?.extract || "Contenuto non disponibile");
    } catch (err) {
      setArticleContent("Errore nel caricamento dell'articolo");
    }
  };

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    setIsTranslating(true);
    try {
      const textToTranslate = articleContent.slice(0, 3000);
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|it`
      );
      const data = await res.json();
      if (data.responseStatus === 200) {
        setTranslatedContent(data.responseData.translatedText);
        setIsTranslated(true);
      }
    } catch (err) {
      console.error("Errore traduzione", err);
    }
    setIsTranslating(false);
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm mb-4">
          ⚓ ENCICLOPEDIA NAVALE
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-academy-dark">
          Enciclopedia Navale
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto leading-relaxed">
          Ricerca articoli su navi, termini nautici, storia navale e marina militare internazionale.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded mt-2"></div>
      </section>

      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input
            data-testid="input-navy-wiki-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca navi, termini navali, storia navale..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-academy-blue text-academy-dark placeholder-gray-400"
          />
        </div>
      </div>

      {search.trim().length < 2 ? (
        <div className="text-center py-16">
          <p className="text-academy-gray text-lg">Inizia a digitare per cercare articoli navali...</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-16">
          <p className="text-academy-gray">⏳ Ricerca in corso...</p>
        </div>
      ) : localResults.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-academy-gray text-lg">Nessun risultato per "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {localResults.map((article) => (
            <button
              key={article.pageid}
              onClick={() => handleArticleClick(article.title)}
              className="bg-white rounded-lg p-5 border-l-4 border-academy-blue hover:shadow-lg transition-shadow text-left hover:bg-blue-50"
            >
              <h3 className="font-bold text-academy-dark text-lg hover:text-academy-blue transition-colors">
                {article.title}
              </h3>
              <p className="text-academy-gray text-sm mt-2 line-clamp-3">
                {article.snippet.replace(/<[^>]+>/g, "")}
              </p>
            </button>
          ))}
        </div>
      )}

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedArticle(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b bg-academy-bg">
              <h2 className="text-2xl font-bold text-academy-dark">{selectedArticle}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="px-3 py-1.5 bg-academy-blue text-white text-sm font-semibold rounded hover:bg-academy-light-blue disabled:opacity-50 transition-colors"
                >
                  {isTranslating ? "⏳ Traduzione..." : isTranslated ? "🇬🇧 Inglese" : "🇮🇹 Italiano"}
                </button>
                <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="text-academy-dark whitespace-pre-wrap leading-relaxed">
                {isTranslated ? translatedContent : articleContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
