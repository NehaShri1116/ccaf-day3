# Global Tech News Dashboard

A single-page React + Tailwind dashboard that aggregates tech news and trending
GitHub repos from public feeds/APIs. No backend — everything runs client-side.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Data sources

- **Hacker News** — official Firebase REST API (`hacker-news.firebaseio.com`), used
  for the paginated/infinite-scroll part of Trending News.
- **GitHub Trending** — GitHub has no public "trending" API, so this uses the
  official Search API (`api.github.com/search/repositories`) filtered to repos
  created in the last 7 days, sorted by stars, as a stand-in. "Growth today" is
  shown as an honest average (`stars ÷ days since creation`) rather than a
  fabricated live delta, since the REST API doesn't expose per-day star history.
- **TechCrunch / Ars Technica / The Verge** — their RSS feeds, converted to JSON
  via the free [rss2json.com](https://rss2json.com) proxy so the browser can read
  them without hitting CORS errors. If rss2json's free tier is rate-limited or a
  feed changes its URL, that source just contributes 0 articles rather than
  breaking the page — each feed fails independently.

## Notes

- Categories (AI, Programming, Startups, Cybersecurity, Cloud, Mobile, Web Dev)
  are assigned client-side with a simple keyword heuristic over the title/summary
  — there's no ML classification happening, it's intentionally simple.
- Bookmarks and your dark/light preference are saved to `localStorage`, so they
  persist across reloads but never leave your browser.
- Infinite scroll paginates through Hacker News' top-story list (hundreds of IDs)
  12 at a time; RSS + GitHub results load once per refresh since those sources
  aren't paginated by their APIs.
- If you build/preview this inside a heavily sandboxed environment (corporate
  proxy, restricted container, etc.), some of the external fetches above may be
  blocked — the UI is built to degrade gracefully (empty-state messages, no
  crashes) rather than break when that happens.
