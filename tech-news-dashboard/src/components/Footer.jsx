export default function Footer({ totalLoaded, onRefresh, refreshing }) {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-8 mt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>{totalLoaded} items loaded</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 focus-ring"
        >
          {refreshing ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>
      <p className="mt-3">
        Sources: Hacker News (Firebase API), GitHub Search API, TechCrunch, Ars Technica &amp; The Verge (via RSS,
        converted to JSON through rss2json.com). No backend — everything runs client-side.
      </p>
    </footer>
  );
}
