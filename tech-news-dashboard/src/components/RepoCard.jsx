export default function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:shadow-md transition-shadow focus-ring"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-semibold text-sm text-brand-600 dark:text-brand-500 truncate">{repo.fullName}</span>
        <span className="text-xs shrink-0 text-amber-600 dark:text-amber-400">★ {repo.stars.toLocaleString("en-US")}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{repo.description}</p>
      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" aria-hidden="true" />
          {repo.language}
        </span>
        <span aria-hidden="true">·</span>
        <span>~{repo.avgStarsPerDay}★/day since created</span>
      </div>
    </a>
  );
}
