import { useEffect, useRef } from "react";
import NewsCard from "./NewsCard";
import { SkeletonNewsCard } from "./SkeletonCard";

export default function TrendingNews({ articles, loading, loadingMore, hasMore, onLoadMore, bookmarkIds, onToggleBookmark, searching }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (searching || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, searching]);

  return (
    <section aria-labelledby="trending-heading">
      <h2 id="trending-heading" className="font-bold text-lg mb-3">Trending News</h2>

      {loading && articles.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonNewsCard key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
          No articles match your search or filter.
        </p>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              isBookmarked={bookmarkIds.has(article.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}

      {!searching && hasMore && (
        <div ref={sentinelRef} className="py-6 flex justify-center">
          {loadingMore && (
            <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">Loading more…</span>
          )}
        </div>
      )}
    </section>
  );
}
