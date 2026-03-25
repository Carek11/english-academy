import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { glossaryTerms, categoryConfig, type GlossaryCategory } from "@/lib/glossaryData";

export default function GlossaryPage() {
  const [location] = useLocation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch("");
    setActiveCategory("all");
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setSearch("");
      }
    };

    if (search.trim() !== "") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [search]);

  const isSearching = search.trim() !== "" || activeCategory !== "all";

  const filtered = useMemo(() => {
    if (!isSearching) return [];
    return glossaryTerms.filter((term) => {
      const matchSearch =
        search.trim() === "" ||
        term.en.toLowerCase().includes(search.toLowerCase()) ||
        term.it.toLowerCase().includes(search.toLowerCase()) ||
        (term.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchCategory = activeCategory === "all" || term.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory, isSearching]);

  const categories: Array<GlossaryCategory | "all"> = [
    "all", "navigation", "engine", "communications", "safety",
    "ship_parts", "ranks", "weapons", "manoeuvres",
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-2 bg-academy-blue bg-opacity-10 rounded-full text-academy-blue font-semibold text-sm mb-4">
          ⚓ MARINA MILITARE
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-academy-dark">
          Glossario Navale
        </h1>
        <p className="text-academy-gray max-w-2xl mx-auto leading-relaxed">
          Oltre {glossaryTerms.length} termini tecnici della Marina Militare in inglese e italiano. Cerca un termine o filtra per categoria.
        </p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded mt-2"></div>
      </section>

      <div className="max-w-3xl mx-auto">
        <div ref={searchDropdownRef} className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input
            data-testid="input-glossary-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca un termine in inglese o italiano..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-academy-blue text-base shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          )}
          
          {search && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-96 overflow-y-auto z-50">
              {filtered.slice(0, 10).map((term, idx) => (
                <div key={idx} className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="font-semibold text-academy-blue">{term.en}</div>
                  <div className="text-sm text-academy-gray">{term.it}</div>
                  {term.description && (
                    <div className="text-xs text-gray-500 mt-1">{term.description}</div>
                  )}
                </div>
              ))}
              {filtered.length > 10 && (
                <div className="px-4 py-3 text-center text-sm text-academy-gray font-semibold">
                  +{filtered.length - 10} altri risultati
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          data-testid="filter-all"
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
            activeCategory === "all"
              ? "bg-academy-blue text-white border-academy-blue"
              : "bg-white text-academy-gray border-gray-200 hover:border-academy-blue"
          }`}
        >
          🌐 Tutti ({glossaryTerms.length})
        </button>
        {(categories.slice(1) as GlossaryCategory[]).map((cat) => {
          const cfg = categoryConfig[cat];
          const count = glossaryTerms.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              data-testid={`filter-${cat}`}
              onClick={() => setActiveCategory(activeCategory === cat ? "all" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                activeCategory === cat
                  ? "bg-academy-blue text-white border-academy-blue"
                  : `bg-white border-gray-200 hover:border-academy-blue ${cfg.color}`
              }`}
            >
              {cfg.icon} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {!isSearching && (
        <div className="text-center py-16 space-y-3 text-academy-gray">
          <div className="text-5xl opacity-30">📖</div>
          <p className="text-base">Digita un termine o scegli una categoria per visualizzare i risultati.</p>
        </div>
      )}

      {isSearching && filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="text-6xl">🔍</div>
          <p className="text-academy-gray text-lg">
            Nessun termine trovato{search ? ` per "${search}"` : ""}.
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="text-academy-blue underline text-sm"
          >
            Azzera filtri
          </button>
        </div>
      )}

    </div>
  );
}
