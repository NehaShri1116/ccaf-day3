import RepoCard from "./RepoCard";
import { SkeletonRepoCard } from "./SkeletonCard";

export default function GithubTrending({ repos, loading }) {
  return (
    <section aria-labelledby="gh-trending-heading" className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-4">
      <h2 id="gh-trending-heading" className="font-bold text-sm mb-3 flex items-center gap-2">
        <span aria-hidden="true">🐙</span> GitHub Trending
      </h2>
      <div className="space-y-2">
        {loading && repos.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonRepoCard key={i} />)
          : repos.length === 0
          ? <p className="text-xs text-gray-500 dark:text-gray-400">No trending repos loaded right now.</p>
          : repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
      </div>
    </section>
  );
}
