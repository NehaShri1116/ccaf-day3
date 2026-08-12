import { categorize } from "../utils/categorize";
import { readingTimeFromText, stripHtml } from "../utils/time";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

export const FEEDS = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
];

function normalize(item, sourceName) {
  const plainSummary = stripHtml(item.description || item.content || "");
  return {
    id: `${sourceName}-${item.guid || item.link}`,
    source: sourceName,
    title: item.title || "(untitled)",
    url: item.link,
    publishedAt: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
    thumbnail: item.thumbnail || item.enclosure?.link || null,
    points: null,
    comments: null,
    readingTime: readingTimeFromText(plainSummary),
    category: categorize(item.title, plainSummary),
    summary: plainSummary.slice(0, 220),
  };
}

/** Fetches one RSS feed via the rss2json conversion service. Fails soft (returns []). */
async function fetchFeed({ name, url }) {
  try {
    const res = await fetch(`${RSS2JSON}${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`rss2json failed for ${name}: ${res.status}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error(`rss2json status not ok for ${name}`);
    return (data.items || []).map((item) => normalize(item, name));
  } catch (err) {
    console.warn(`Skipping feed "${name}" (fetch/CORS failure):`, err.message);
    return [];
  }
}

/** Fetches all configured RSS feeds in parallel. Each feed fails independently. */
export async function fetchAllFeeds() {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  return results.flat();
}
