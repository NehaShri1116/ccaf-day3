import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import TrendingNews from "./components/TrendingNews";
import GithubTrending from "./components/GithubTrending";
import Bookmarks from "./components/Bookmarks";
import Footer from "./components/Footer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDarkMode } from "./hooks/useDarkMode";
import { fetchHackerNewsPage } from "./api/hackerNews";
import { fetchGithubTrending } from "./api/github";
import { fetchAllFeeds } from "./api/rss";

const HN_PAGE_SIZE = 12;

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [feedArticles, setFeedArticles] = useState([]);
  const [hnArticles, setHnArticles] = useState([]);
  const [hnOffset, setHnOffset] = useState(0);
  const [hnHasMore, setHnHasMore] = useState(true);

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [bookmarks, setBookmarks] = useLocalStorage("gtnd_bookmarks", []);
  const bookmarkIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const [feeds, firstHnPage, ghRepos] = await Promise.all([
      fetchAllFeeds(),
      fetchHackerNewsPage(0, HN_PAGE_SIZE),
      fetchGithubTrending(12),
    ]);
    setFeedArticles(feeds);
    setHnArticles(firstHnPage.items);
    setHnOffset(HN_PAGE_SIZE);
    setHnHasMore(firstHnPage.hasMore);
    setRepos(ghRepos);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitial();
    setRefreshing(false);
  }, [loadInitial]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hnHasMore) return;
    setLoadingMore(true);
    const page = await fetchHackerNewsPage(hnOffset, HN_PAGE_SIZE);
    setHnArticles((prev) => [...prev, ...page.items]);
    setHnOffset((prev) => prev + HN_PAGE_SIZE);
    setHnHasMore(page.hasMore);
    setLoadingMore(false);
  }, [hnOffset, hnHasMore, loadingMore]);

  const toggleBookmark = useCallback((article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === article.id);
      if (exists) return prev.filter((b) => b.id !== article.id);
      const { id, title, url, source } = article;
      return [{ id, title, url, source }, ...prev];
    });
  }, [setBookmarks]);

  const removeBookmark = useCallback((id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, [setBookmarks]);

  const allArticles = useMemo(() => {
    return [...feedArticles, ...hnArticles].sort((a, b) => b.publishedAt - a.publishedAt);
  }, [feedArticles, hnArticles]);

  const searching = query.trim().length > 0;

  const visibleArticles = useMemo(() => {
    let list = allArticles;
    if (category !== "All") {
      list = list.filter((a) => a.category === category);
    }
    if (searching) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allArticles, category, searching, query]);

  const visibleRepos = useMemo(() => {
    if (!searching) return repos;
    const q = query.trim().toLowerCase();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.language || "").toLowerCase().includes(q)
    );
  }, [repos, searching, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header query={query} onQueryChange={setQuery} dark={dark} onToggleDark={() => setDark((d) => !d)} lastUpdated={lastUpdated} />
      <CategoryFilter active={category} onChange={setCategory} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <TrendingNews
          articles={visibleArticles}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hnHasMore}
          onLoadMore={handleLoadMore}
          bookmarkIds={bookmarkIds}
          onToggleBookmark={toggleBookmark}
          searching={searching}
        />

        <aside className="space-y-6 lg:sticky lg:top-20 h-fit">
          <GithubTrending repos={visibleRepos} loading={loading} />
          <Bookmarks bookmarks={bookmarks} onRemove={removeBookmark} />
        </aside>
      </main>

      <Footer totalLoaded={allArticles.length + repos.length} onRefresh={handleRefresh} refreshing={refreshing} />
    </div>
  );
}
