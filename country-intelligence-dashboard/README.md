# Country Intelligence Dashboard

A single-page React + Tailwind app for exploring country data — search,
compare, and save favorites. No backend, no auth, no database.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Data source

All data comes from the free, public [Countries API](https://countries.dev)
(`countries.dev/countries`), fetched once on load and cached in memory for
the session. No API key required.

> Previously this used `restcountries.com/v3.1`, but that API has been
> retired — unauthenticated requests now return a deprecation notice, and the
> replacement (`api.restcountries.com`) requires a paid API key. countries.dev
> mirrors the classic dataset for free with no auth, so it's used here instead.

## Sections

- **Search** — matches country name, official name, capital, region,
  subregion, currency name/code, and language, all client-side.
- **Overview / Geography / Languages & Currency / National Info / Statistics**
  — shown in a detail panel when you open a country card.
- **Compare** — pick any two countries (type-ahead against the full list) for
  a side-by-side table.
- **Favorites** — saved to `localStorage`, so they persist across reloads but
  never leave your browser.

## Notes

- The countries.dev dataset doesn't expose `landlocked`, `continents`,
  `coatOfArms`, or `car`/driving-side fields the old REST Countries v3.1 API
  had. Landlocked and driving side show `—` (unknown) rather than a guessed
  value; continent falls back to the country's region.
- Dark/light preference is saved to `localStorage`.
- If you build/preview this inside a heavily sandboxed environment (corporate
  proxy, restricted container, etc.), the `countries.dev` fetch may be
  blocked — the UI is built to degrade gracefully (loading skeleton → empty
  state, no crash) rather than break when that happens.
