const TABS = [
  { id: "browse", label: "🔍 Search" },
  { id: "compare", label: "⚖️ Compare" },
  { id: "favorites", label: "⭐ Favorites" },
];

export default function Header({ query, onQueryChange, tab, onTabChange, dark, onToggleDark, favoritesCount }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl" aria-hidden="true">🌍</span>
          <span className="font-bold text-lg tracking-tight">Country Intelligence</span>
        </div>

        {tab === "browse" && (
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="country-search" className="sr-only">Search by name, capital, region, currency, or language</label>
            <input
              id="country-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, capital, region, currency, or language…"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus-ring"
            />
          </div>
        )}
        {tab !== "browse" && <div className="flex-1" />}

        <button
          type="button"
          onClick={onToggleDark}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus-ring shrink-0"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <nav className="max-w-6xl mx-auto px-4 pb-2 flex gap-2" role="tablist" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-ring ${
              tab === t.id
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {t.label}{t.id === "favorites" && favoritesCount > 0 ? ` (${favoritesCount})` : ""}
          </button>
        ))}
      </nav>
    </header>
  );
}
