import { categorize } from "../utils/categorize";

const BASE = "https://hacker-news.firebaseio.com/v0";

let cachedIds = null;

async function getTopStoryIds() {
  if (cachedIds) return cachedIds;
  const res = await fetch(`${BASE}/topstories.json`);
  if (!res.ok) throw new Error(`Hacker News topstories failed: ${res.status}`);
  cachedIds = await res.json();
  return cachedIds;
}

async function fetchItem(id) {
  const res = await fetch(`${BASE}/item/${id}.json`);
  if (!res.ok) throw new Error(`Hacker News item ${id} failed: ${res.status}`);
  return res.json();
}

function normalize(item) {
  if (!item || item.deleted || item.dead) return null;
  return {
    id: `hn-${item.id}`,
    source: "Hacker News",
    title: item.title || "(untitled)",
    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    publishedAt: (item.time || 0) * 1000,
    thumbnail: null,
    points: item.score ?? null,
    comments: item.descendants ?? 0,
    readingTime: null,
    category: categorize(item.title || ""),
    summary: null,
  };
}

/** Fetches a page of Hacker News top stories for infinite scroll. */
export async function fetchHackerNewsPage(offset = 0, limit = 12) {
  try {
    const ids = await getTopStoryIds();
    const pageIds = ids.slice(offset, offset + limit);
    if (pageIds.length === 0) return { items: [], hasMore: false };
    const items = await Promise.all(pageIds.map((id) => fetchItem(id).catch(() => null)));
    return {
      items: items.map(normalize).filter(Boolean),
      hasMore: offset + limit < ids.length,
    };
  } catch (err) {
    console.error("Hacker News fetch failed:", err);
    return { items: [], hasMore: false, error: err.message };
  }
}
