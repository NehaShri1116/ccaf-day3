export default function Bookmarks({ bookmarks, onRemove }) {
  return (
    <section aria-labelledby="bookmarks-heading" className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-4">
      <h2 id="bookmarks-heading" className="font-bold text-sm mb-3 flex items-center gap-2">
        <span aria-hidden="true">⭐</span> Bookmarks
        <span className="ml-auto text-xs font-normal text-gray-500 dark:text-gray-400">{bookmarks.length}</span>
      </h2>
      {bookmarks.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Saved articles show up here — stored locally in your browser.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {bookmarks.map((b) => (
            <li key={b.id} className="text-xs border border-gray-200 dark:border-gray-800 rounded-lg p-2 flex items-start gap-2">
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="flex-1 hover:underline line-clamp-2">
                {b.title}
              </a>
              <button
                type="button"
                onClick={() => onRemove(b.id)}
                aria-label="Remove bookmark"
                className="text-gray-400 hover:text-red-500 focus-ring shrink-0"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
