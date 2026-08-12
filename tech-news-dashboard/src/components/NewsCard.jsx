import { relativeTime } from "../utils/time";

export default function NewsCard({ article, isBookmarked, onToggleBookmark }) {
  return (
    <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex gap-3 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <span aria-hidden="true">📰</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1 flex-wrap">
          <span className="font-semibold text-brand-600 dark:text-brand-500">{article.source}</span>
          <span aria-hidden="true">·</span>
          <span>{relativeTime(article.publishedAt)}</span>
          {article.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
            </>
          )}
          <span className="ml-auto inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 text-[11px] font-medium">
            {article.category}
          </span>
        </div>

        <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">{article.title}</h3>

        <div className="flex items-center gap-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md px-3 py-1.5 focus-ring"
          >
            Read →
          </a>
          <button
            type="button"
            onClick={() => onToggleBookmark(article)}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            className={`text-xs rounded-md px-2 py-1.5 border focus-ring ${
              isBookmarked
                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {isBookmarked ? "★ Saved" : "☆ Save"}
          </button>
          {article.points !== null && article.points !== undefined && (
            <span className="text-xs text-gray-400 ml-auto">▲ {article.points}{article.comments ? ` · ${article.comments} comments` : ""}</span>
          )}
        </div>
      </div>
    </article>
  );
}
