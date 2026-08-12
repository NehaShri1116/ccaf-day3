# Assignment 1 — Personal Finance Tracker

A single-page app — plain HTML, CSS &amp; JavaScript. No backend, no frameworks,
no libraries, no build step.

## Files

```
personal-finance-tracker/
├── index.html
├── style.css
└── script.js
```

## Run it

No installs, no bash commands required — this is plain HTML/CSS/JS.

**Option A — VS Code Live Server (recommended, matches the assignment)**

1. Open the `personal-finance-tracker` folder in VS Code.
2. Install the "Live Server" extension if you don't already have it (Extensions
   panel → search "Live Server" by Ritwick Dey → Install).
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens automatically at something like `http://127.0.0.1:5500`.

**Option B — a quick local server from the terminal**, if you'd rather not
install the extension. Run one of these from inside the
`personal-finance-tracker` folder:

```bash
# Node (no install needed, uses npx)
npx serve .

# or, if you have Python 3
python3 -m http.server 5500
```

Then open the printed URL (e.g. `http://localhost:5500`) in your browser.

**Option C — just double-click `index.html`** to open it directly as a
`file://` URL. Everything works this way too, since there's no server-side
code — this app only uses `localStorage`, which works fine from a local file.

## What it does

- **Dashboard** — net cash flow, a flow bar, and eight stat cards, all
  recalculated from your raw entries every time the screen redraws. Nothing
  is stored pre-computed.
- **Income & Expenses** — add/delete entries; expenses take a category, date,
  and optional note; a category filter hides (never deletes) entries.
- **Investments** — Loans, FDs, SIPs, and My Stocks, with add/delete and
  inline editing for stocks.
- **Stocks to Watch** — a fixed sample list with sector filter and a
  top-performers sort toggle. Clearly labelled as sample data, not live
  prices or investment advice.

## Data & persistence

Everything lives in your browser's `localStorage` under the key
`pft_state_v1` — nothing is sent anywhere. On first run it seeds a few sample
entries so the dashboard isn't empty; after that, your own data persists
across reloads. If the stored data ever gets corrupted (e.g. edited by hand
into invalid JSON), the app detects that and falls back to a clean empty
state instead of crashing.

## Notes

- FD "value" is an estimate — simple interest applied from the start date
  (capped at the maturity date) using the rate you entered, not a live
  market figure.
- "Stocks Invested" reflects money actually put in (quantity × buy price),
  not a fabricated live price, since this app has no real market data
  source.
