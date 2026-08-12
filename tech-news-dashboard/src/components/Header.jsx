export default function Header({ query, onQueryChange, dark, onToggleDark, lastUpdated }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl" aria-hidden="true">📡</span>
          <span className="font-bold text-lg tracking-tight">Global Tech News</span>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label htmlFor="global-search" className="sr-only">Search headlines, repos, categories</label>
          <input
            id="global-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search headlines, repos, categories…"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus-ring"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
            Updated {lastUpdated ? lastUpdated : "—"}
          </span>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus-ring"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
