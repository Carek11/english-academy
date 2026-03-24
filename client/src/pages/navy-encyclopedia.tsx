import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function NavyEncyclopediaPage() {
  const [search, setSearch] = useState("");
  const [localResults, setLocalResults] = useState<any[]>([]);

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

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm mb-8">
          ⚓ ENCICLOPEDIA NAVALE
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-academy-dark">
          Enciclopedia Navale
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto leading-relaxed">
          Ricerca articoli su navi, termini nautici, storia navale e marina militare internazionale.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
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
        <div className="text-center py-12">
          <p className="text-academy-gray text-lg">Inizia a digitare per cercare articoli navali...</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-academy-gray">⏳ Ricerca in corso...</p>
        </div>
      ) : localResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-academy-gray text-lg">Nessun risultato per "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {localResults.map((article) => (
            <div
              key={article.pageid}
              className="bg-white rounded-lg p-5 border-l-4 border-academy-blue hover:shadow-lg transition-shadow"
            >
              <a
                href={`https://en.wikipedia.org/wiki/${article.title.replace(/ /g, "_")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <h3 className="font-bold text-academy-dark text-lg group-hover:text-academy-blue transition-colors">
                  {article.title} ↗
                </h3>
              </a>
              <p className="text-academy-gray text-sm mt-2 line-clamp-3">
                {article.snippet.replace(/<[^>]+>/g, "")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
