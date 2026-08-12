/* ============================================================
   Personal Finance Tracker
   Plain HTML/CSS/JS. One state object is the single source of
   truth. Every user action follows: change state -> save -> redraw.
   The dashboard never stores totals — everything is derived from
   the raw entries at render time.
   ============================================================ */

const STORAGE_KEY = "pft_state_v1";

const EXPENSE_CATEGORIES = [
  "Food", "Rent", "Transport", "Utilities", "Shopping",
  "Health", "Entertainment", "Education", "Other",
];

const WATCHLIST = [
  { name: "Growth Bank Ltd", sector: "Banking", price: 842.5, changePct: 2.4 },
  { name: "Nimbus Cloud", sector: "Technology", price: 1345.1, changePct: -1.1 },
  { name: "Sunrise Pharma", sector: "Pharma", price: 512.75, changePct: 3.8 },
  { name: "Bharat Motors", sector: "Auto", price: 2210.0, changePct: 0.6 },
  { name: "Delta Energy", sector: "Energy", price: 305.2, changePct: -0.4 },
  { name: "Coastal Foods", sector: "FMCG", price: 188.9, changePct: 1.2 },
  { name: "Zenith Steel", sector: "Materials", price: 640.35, changePct: 4.5 },
  { name: "Orbit Telecom", sector: "Telecom", price: 96.4, changePct: -2.3 },
  { name: "Vertex Realty", sector: "Realty", price: 421.15, changePct: 1.9 },
  { name: "Prime Insurance", sector: "Insurance", price: 733.0, changePct: 0.2 },
];

/* ---------------- State: load / seed / save ---------------- */

function seedState() {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const monthsAgo = (n) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - n);
    return iso(d);
  };

  return {
    income: [
      { id: uid(), source: "Salary", amount: 85000, date: iso(today) },
    ],
    expenses: [
      { id: uid(), category: "Rent", amount: 22000, date: iso(today), note: "Monthly rent" },
      { id: uid(), category: "Food", amount: 8500, date: iso(today), note: "" },
    ],
    loans: [
      { id: uid(), name: "Car Loan", emi: 9500, rate: 9.2, monthsLeft: 28 },
    ],
    fds: [
      { id: uid(), name: "Bank FD", principal: 150000, rate: 7.1, startDate: monthsAgo(6), maturityDate: iso(addYears(today, 1)) },
    ],
    sips: [
      { id: uid(), name: "Index Fund SIP", monthly: 5000, startDate: monthsAgo(8) },
    ],
    stocks: [
      { id: uid(), name: "Growth Bank Ltd", sector: "Banking", quantity: 10, buyPrice: 780 },
    ],
  };
}

function addYears(date, n) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + n);
  return d;
}

function emptyState() {
  return { income: [], expenses: [], loans: [], fds: [], sips: [], stocks: [] };
}

function isValidState(obj) {
  if (!obj || typeof obj !== "object") return false;
  const keys = ["income", "expenses", "loans", "fds", "sips", "stocks"];
  return keys.every((k) => Array.isArray(obj[k]));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedState();
      saveState(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) throw new Error("Malformed state shape");
    return parsed;
  } catch (err) {
    console.warn("Corrupt localStorage data, falling back to a fresh state:", err);
    const fresh = emptyState();
    saveState(fresh);
    return fresh;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Could not save to localStorage:", err);
  }
}

/* ---------------- Global mutable app state ---------------- */

let state = loadState();

const ui = {
  activeTab: "dashboard",
  expenseCategoryFilter: "all",
  watchlistSectorFilter: "all",
  watchlistTopSort: false,
  editingStockId: null,
};

/* ---------------- Helpers ---------------- */

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatINR(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return inrFormatter.format(0);
  return inrFormatter.format(n);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function monthsBetween(fromIso, toDate) {
  const from = new Date(fromIso + "T00:00:00");
  if (Number.isNaN(from.getTime())) return 0;
  const to = toDate instanceof Date ? toDate : new Date();
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

function yearsBetween(fromIso, toDate) {
  const from = new Date(fromIso + "T00:00:00");
  if (Number.isNaN(from.getTime())) return 0;
  const to = toDate instanceof Date ? toDate : new Date();
  const ms = to.getTime() - from.getTime();
  return Math.max(0, ms / (365 * 24 * 3600 * 1000));
}

/* ---------------- Derived / calculated values ----------------
   Nothing here is ever stored. It is recomputed from the raw
   entries every time renderDashboard() runs.
   ---------------------------------------------------------- */

function computeTotals(s) {
  const today = new Date();

  const totalIncome = sum(s.income, (e) => e.amount);
  const totalExpenses = sum(s.expenses, (e) => e.amount);
  const totalEMI = sum(s.loans, (l) => l.emi);
  const outstandingDebt = sum(s.loans, (l) => l.emi * l.monthsLeft);
  const sipMonthly = sum(s.sips, (sp) => sp.monthly);

  const sipContributed = sum(s.sips, (sp) => sp.monthly * monthsBetween(sp.startDate, today));

  const fdValue = sum(s.fds, (fd) => {
    const maturity = fd.maturityDate ? new Date(fd.maturityDate + "T00:00:00") : null;
    const cap = maturity && !Number.isNaN(maturity.getTime()) && maturity < today ? maturity : today;
    const years = yearsBetween(fd.startDate, cap);
    return fd.principal * (1 + (fd.rate / 100) * years);
  });

  const stocksInvested = sum(s.stocks, (st) => st.quantity * st.buyPrice);

  const netCashFlow = totalIncome - totalExpenses - totalEMI - sipMonthly;

  return {
    totalIncome, totalExpenses, totalEMI, outstandingDebt,
    sipMonthly, sipContributed, fdValue, stocksInvested, netCashFlow,
  };
}

function sum(arr, fn) {
  return arr.reduce((acc, item) => acc + (Number(fn(item)) || 0), 0);
}

/* ---------------- Mutations (state -> save -> redraw) ---------------- */

function mutate(fn) {
  fn(state);
  saveState(state);
  render();
}

function addIncome(source, amount, date) {
  mutate((s) => s.income.push({ id: uid(), source, amount, date }));
}
function deleteIncome(id) {
  mutate((s) => { s.income = s.income.filter((e) => e.id !== id); });
}
function addExpense(category, amount, date, note) {
  mutate((s) => s.expenses.push({ id: uid(), category, amount, date, note }));
}
function deleteExpense(id) {
  mutate((s) => { s.expenses = s.expenses.filter((e) => e.id !== id); });
}
function addLoan(name, emi, rate, monthsLeft) {
  mutate((s) => s.loans.push({ id: uid(), name, emi, rate, monthsLeft }));
}
function deleteLoan(id) {
  mutate((s) => { s.loans = s.loans.filter((e) => e.id !== id); });
}
function addFD(name, principal, rate, startDate, maturityDate) {
  mutate((s) => s.fds.push({ id: uid(), name, principal, rate, startDate, maturityDate }));
}
function deleteFD(id) {
  mutate((s) => { s.fds = s.fds.filter((e) => e.id !== id); });
}
function addSIP(name, monthly, startDate) {
  mutate((s) => s.sips.push({ id: uid(), name, monthly, startDate }));
}
function deleteSIP(id) {
  mutate((s) => { s.sips = s.sips.filter((e) => e.id !== id); });
}
function addStock(name, sector, quantity, buyPrice) {
  mutate((s) => s.stocks.push({ id: uid(), name, sector, quantity, buyPrice }));
}
function deleteStock(id) {
  mutate((s) => { s.stocks = s.stocks.filter((e) => e.id !== id); });
}
function updateStock(id, patch) {
  mutate((s) => {
    s.stocks = s.stocks.map((st) => (st.id === id ? { ...st, ...patch } : st));
  });
}

/* ---------------- Rendering ---------------- */

const root = document.getElementById("app-root");

function render() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    const isActive = btn.dataset.tab === ui.activeTab;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  switch (ui.activeTab) {
    case "dashboard": root.innerHTML = renderDashboard(); break;
    case "income-expenses": root.innerHTML = renderIncomeExpenses(); break;
    case "investments": root.innerHTML = renderInvestments(); break;
    case "watchlist": root.innerHTML = renderWatchlist(); break;
    default: root.innerHTML = "";
  }
}

function renderDashboard() {
  const t = computeTotals(state);
  const positive = t.netCashFlow >= 0;

  const outflowBase = t.totalIncome > 0 ? t.totalIncome : (t.totalExpenses + t.totalEMI + t.sipMonthly) || 1;
  const pct = (v) => Math.max(0, Math.min(100, (v / outflowBase) * 100));
  const leftover = Math.max(0, t.netCashFlow);

  return `
    <div class="headline ${positive ? "positive" : "negative"}">
      <div class="headline-label">Net Cash Flow (Income − Expenses − EMI − SIP)</div>
      <div class="headline-value">${formatINR(t.netCashFlow)}</div>
    </div>

    <div class="flow-bar-wrap">
      <div class="flow-bar-title">Where this month's income goes</div>
      <div class="flow-bar">
        <div class="flow-seg expenses" style="width:${pct(t.totalExpenses)}%"></div>
        <div class="flow-seg emi" style="width:${pct(t.totalEMI)}%"></div>
        <div class="flow-seg sip" style="width:${pct(t.sipMonthly)}%"></div>
        <div class="flow-seg leftover" style="width:${pct(leftover)}%"></div>
      </div>
      <div class="flow-legend">
        <span><i class="dot expenses"></i> Expenses ${formatINR(t.totalExpenses)}</span>
        <span><i class="dot emi"></i> EMI ${formatINR(t.totalEMI)}</span>
        <span><i class="dot sip"></i> SIP ${formatINR(t.sipMonthly)}</span>
        <span><i class="dot leftover"></i> Leftover ${formatINR(leftover)}</span>
      </div>
    </div>

    <div class="section-title">Quick Add</div>
    <div class="quick-add-grid">
      <form class="card inline-form" data-form="quick-income">
        <div class="field" style="grid-column: 1 / -1;"><label>Salary / income source</label>
          <input name="source" type="text" placeholder="e.g. Salary" required maxlength="60" />
        </div>
        <div class="field"><label>Amount (₹)</label>
          <input name="amount" type="number" min="0" step="1" placeholder="0" required />
        </div>
        <div class="field"><label>Date</label>
          <input name="date" type="date" required value="${todayIso()}" />
        </div>
        <div class="field"><button class="btn" type="submit">Add income</button></div>
      </form>

      <form class="card inline-form" data-form="quick-expense">
        <div class="field"><label>Category</label>
          <select name="category" required>
            ${EXPENSE_CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Amount (₹)</label>
          <input name="amount" type="number" min="0" step="1" placeholder="0" required />
        </div>
        <div class="field"><label>Date</label>
          <input name="date" type="date" required value="${todayIso()}" />
        </div>
        <div class="field" style="grid-column: 1 / -1;"><label>Why? (optional)</label>
          <input name="note" type="text" maxlength="120" placeholder="Optional note" />
        </div>
        <div class="field"><button class="btn" type="submit">Add expense</button></div>
      </form>
    </div>

    <div class="section-title">Overview</div>
    <div class="stat-grid">
      ${statCard("Income", t.totalIncome)}
      ${statCard("Expenses", t.totalExpenses)}
      ${statCard("EMI (monthly)", t.totalEMI)}
      ${statCard("SIP (monthly)", t.sipMonthly)}
      ${statCard("Outstanding Debt", t.outstandingDebt)}
      ${statCard("FD Value (est.)", t.fdValue)}
      ${statCard("SIP Contributed", t.sipContributed)}
      ${statCard("Stocks Invested", t.stocksInvested)}
    </div>
  `;
}

function statCard(label, value) {
  return `<div class="stat-card"><div class="label">${escapeHtml(label)}</div><div class="value">${formatINR(value)}</div></div>`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function renderIncomeExpenses() {
  const filtered = ui.expenseCategoryFilter === "all"
    ? state.expenses
    : state.expenses.filter((e) => e.category === ui.expenseCategoryFilter);

  return `
    <div class="two-col">
      <div>
        <div class="section-title">Income</div>
        <form class="card inline-form" data-form="income">
          <div class="field"><label>Source</label><input name="source" type="text" required maxlength="60" placeholder="e.g. Freelance" /></div>
          <div class="field"><label>Amount (₹)</label><input name="amount" type="number" min="0" step="1" required /></div>
          <div class="field"><label>Date</label><input name="date" type="date" required value="${todayIso()}" /></div>
          <div class="field"><button class="btn" type="submit">Add</button></div>
        </form>
        <ul class="entry-list">
          ${state.income.length === 0 ? emptyState("No income logged yet.") :
            state.income.slice().reverse().map((e) => `
              <li class="entry-row">
                <div class="entry-main">
                  <span class="entry-title">${escapeHtml(e.source)}</span>
                  <span class="entry-sub">${formatDate(e.date)}</span>
                </div>
                <div class="entry-amount income">+${formatINR(e.amount)}</div>
                <div class="entry-actions">
                  <button class="btn-delete" data-action="delete-income" data-id="${e.id}" aria-label="Delete income entry" title="Delete">✕</button>
                </div>
              </li>
            `).join("")}
        </ul>
      </div>

      <div>
        <div class="section-title">Expenses</div>
        <form class="card inline-form" data-form="expense">
          <div class="field"><label>Category</label>
            <select name="category" required>${EXPENSE_CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}</select>
          </div>
          <div class="field"><label>Amount (₹)</label><input name="amount" type="number" min="0" step="1" required /></div>
          <div class="field"><label>Date</label><input name="date" type="date" required value="${todayIso()}" /></div>
          <div class="field" style="grid-column:1/-1;"><label>Why? (optional)</label><input name="note" type="text" maxlength="120" /></div>
          <div class="field"><button class="btn" type="submit">Add</button></div>
        </form>

        <div class="filter-row">
          <label for="category-filter" style="font-size:0.82rem;color:var(--text-muted);">Filter by category:</label>
          <select id="category-filter" data-action="filter-category">
            <option value="all" ${ui.expenseCategoryFilter === "all" ? "selected" : ""}>All categories</option>
            ${EXPENSE_CATEGORIES.map((c) => `<option value="${escapeHtml(c)}" ${ui.expenseCategoryFilter === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>

        <ul class="entry-list">
          ${filtered.length === 0 ? emptyState("No expenses match this filter.") :
            filtered.slice().reverse().map((e) => `
              <li class="entry-row">
                <div class="entry-main">
                  <span class="entry-title">${escapeHtml(e.category)}</span>
                  <span class="entry-sub">${formatDate(e.date)}${e.note ? " · " + escapeHtml(e.note) : ""}</span>
                </div>
                <div class="entry-amount expense">−${formatINR(e.amount)}</div>
                <div class="entry-actions">
                  <button class="btn-delete" data-action="delete-expense" data-id="${e.id}" aria-label="Delete expense entry" title="Delete">✕</button>
                </div>
              </li>
            `).join("")}
        </ul>
      </div>
    </div>
  `;
}

function emptyState(msg) {
  return `<li class="empty-state">${escapeHtml(msg)}</li>`;
}

function renderInvestments() {
  return `
    <div class="investment-block">
      <div class="section-title">Loans</div>
      <form class="card inline-form" data-form="loan">
        <div class="field"><label>Name</label><input name="name" type="text" required maxlength="60" placeholder="e.g. Home Loan" /></div>
        <div class="field"><label>EMI (₹/month)</label><input name="emi" type="number" min="0" step="1" required /></div>
        <div class="field"><label>Rate (% p.a.)</label><input name="rate" type="number" min="0" step="0.01" required /></div>
        <div class="field"><label>Months left</label><input name="monthsLeft" type="number" min="0" step="1" required /></div>
        <div class="field"><button class="btn" type="submit">Add loan</button></div>
      </form>
      <ul class="entry-list">
        ${state.loans.length === 0 ? emptyState("No loans added.") :
          state.loans.map((l) => `
            <li class="entry-row">
              <div class="entry-main">
                <span class="entry-title">${escapeHtml(l.name)}</span>
                <span class="entry-sub">${l.rate}% p.a. · ${l.monthsLeft} months left</span>
              </div>
              <div class="entry-amount expense">${formatINR(l.emi)}/mo</div>
              <div class="entry-actions"><button class="btn-delete" data-action="delete-loan" data-id="${l.id}" aria-label="Delete loan">✕</button></div>
            </li>
          `).join("")}
      </ul>
    </div>

    <div class="investment-block">
      <div class="section-title">Fixed Deposits</div>
      <form class="card inline-form" data-form="fd">
        <div class="field"><label>Name</label><input name="name" type="text" required maxlength="60" placeholder="e.g. Bank FD" /></div>
        <div class="field"><label>Principal (₹)</label><input name="principal" type="number" min="0" step="1" required /></div>
        <div class="field"><label>Rate (% p.a.)</label><input name="rate" type="number" min="0" step="0.01" required /></div>
        <div class="field"><label>Start date</label><input name="startDate" type="date" required value="${todayIso()}" /></div>
        <div class="field"><label>Maturity date</label><input name="maturityDate" type="date" required /></div>
        <div class="field"><button class="btn" type="submit">Add FD</button></div>
      </form>
      <ul class="entry-list">
        ${state.fds.length === 0 ? emptyState("No fixed deposits added.") :
          state.fds.map((fd) => `
            <li class="entry-row">
              <div class="entry-main">
                <span class="entry-title">${escapeHtml(fd.name)}</span>
                <span class="entry-sub">${fd.rate}% p.a. · ${formatDate(fd.startDate)} → ${formatDate(fd.maturityDate)}</span>
              </div>
              <div class="entry-amount">${formatINR(fd.principal)}</div>
              <div class="entry-actions"><button class="btn-delete" data-action="delete-fd" data-id="${fd.id}" aria-label="Delete FD">✕</button></div>
            </li>
          `).join("")}
      </ul>
    </div>

    <div class="investment-block">
      <div class="section-title">SIPs</div>
      <form class="card inline-form" data-form="sip">
        <div class="field"><label>Name</label><input name="name" type="text" required maxlength="60" placeholder="e.g. Index Fund SIP" /></div>
        <div class="field"><label>Monthly (₹)</label><input name="monthly" type="number" min="0" step="1" required /></div>
        <div class="field"><label>Start date</label><input name="startDate" type="date" required value="${todayIso()}" /></div>
        <div class="field"><button class="btn" type="submit">Add SIP</button></div>
      </form>
      <ul class="entry-list">
        ${state.sips.length === 0 ? emptyState("No SIPs added.") :
          state.sips.map((sp) => `
            <li class="entry-row">
              <div class="entry-main">
                <span class="entry-title">${escapeHtml(sp.name)}</span>
                <span class="entry-sub">Since ${formatDate(sp.startDate)}</span>
              </div>
              <div class="entry-amount expense">${formatINR(sp.monthly)}/mo</div>
              <div class="entry-actions"><button class="btn-delete" data-action="delete-sip" data-id="${sp.id}" aria-label="Delete SIP">✕</button></div>
            </li>
          `).join("")}
      </ul>
    </div>

    <div class="investment-block">
      <div class="section-title">My Stocks</div>
      <form class="card inline-form" data-form="stock">
        <div class="field"><label>Name</label><input name="name" type="text" required maxlength="60" placeholder="e.g. Growth Bank Ltd" /></div>
        <div class="field"><label>Sector</label><input name="sector" type="text" required maxlength="40" placeholder="e.g. Banking" /></div>
        <div class="field"><label>Quantity</label><input name="quantity" type="number" min="0" step="1" required /></div>
        <div class="field"><label>Buy price (₹)</label><input name="buyPrice" type="number" min="0" step="0.01" required /></div>
        <div class="field"><button class="btn" type="submit">Add stock</button></div>
      </form>
      <ul class="entry-list">
        ${state.stocks.length === 0 ? emptyState("No stocks added.") : state.stocks.map(renderStockRow).join("")}
      </ul>
    </div>
  `;
}

function renderStockRow(st) {
  if (ui.editingStockId === st.id) {
    return `
      <li class="entry-row edit-row">
        <form class="inline-form" data-form="edit-stock" data-id="${st.id}" style="flex:1; grid-template-columns: repeat(4, 1fr) auto auto;">
          <div class="field"><input name="name" value="${escapeHtml(st.name)}" required maxlength="60" /></div>
          <div class="field"><input name="sector" value="${escapeHtml(st.sector)}" required maxlength="40" /></div>
          <div class="field"><input name="quantity" type="number" min="0" step="1" value="${st.quantity}" required /></div>
          <div class="field"><input name="buyPrice" type="number" min="0" step="0.01" value="${st.buyPrice}" required /></div>
          <div class="field"><button class="btn btn-sm" type="submit">Save</button></div>
          <div class="field"><button class="btn btn-secondary btn-sm" type="button" data-action="cancel-edit-stock">Cancel</button></div>
        </form>
      </li>
    `;
  }
  return `
    <li class="entry-row">
      <div class="entry-main">
        <span class="entry-title">${escapeHtml(st.name)} <span class="badge">${escapeHtml(st.sector)}</span></span>
        <span class="entry-sub">${st.quantity} shares @ ${formatINR(st.buyPrice)}</span>
      </div>
      <div class="entry-amount">${formatINR(st.quantity * st.buyPrice)}</div>
      <div class="entry-actions">
        <button class="btn btn-secondary btn-sm" data-action="edit-stock" data-id="${st.id}">Edit</button>
        <button class="btn-delete" data-action="delete-stock" data-id="${st.id}" aria-label="Delete stock">✕</button>
      </div>
    </li>
  `;
}

function renderWatchlist() {
  const sectors = Array.from(new Set(WATCHLIST.map((s) => s.sector))).sort();
  let list = ui.watchlistSectorFilter === "all"
    ? WATCHLIST.slice()
    : WATCHLIST.filter((s) => s.sector === ui.watchlistSectorFilter);

  if (ui.watchlistTopSort) {
    list = list.slice().sort((a, b) => b.changePct - a.changePct);
  }

  return `
    <div class="disclaimer">📊 Sample data for learning purposes only — not live prices, not investment advice.</div>
    <div class="filter-row">
      <select data-action="filter-sector">
        <option value="all" ${ui.watchlistSectorFilter === "all" ? "selected" : ""}>All sectors</option>
        ${sectors.map((s) => `<option value="${escapeHtml(s)}" ${ui.watchlistSectorFilter === s ? "selected" : ""}>${escapeHtml(s)}</option>`).join("")}
      </select>
      <button class="btn btn-secondary sort-toggle ${ui.watchlistTopSort ? "active" : ""}" data-action="toggle-top-sort">
        ${ui.watchlistTopSort ? "✓ Sorted: Top performers" : "Sort: Top performers"}
      </button>
    </div>
    <ul class="entry-list">
      ${list.length === 0 ? emptyState("No stocks match this sector.") :
        list.map((s) => `
          <li class="entry-row">
            <div class="entry-main">
              <span class="entry-title">${escapeHtml(s.name)} <span class="badge">${escapeHtml(s.sector)}</span></span>
              <span class="entry-sub">${formatINR(s.price)}</span>
            </div>
            <div class="entry-amount ${s.changePct >= 0 ? "income" : "expense"}">${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(1)}%</div>
          </li>
        `).join("")}
    </ul>
  `;
}

/* ---------------- Event wiring (delegation; state drives all UI) ---------------- */

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    ui.activeTab = btn.dataset.tab;
    ui.editingStockId = null;
    render();
  });
});

root.addEventListener("submit", (ev) => {
  const form = ev.target.closest("form[data-form]");
  if (!form) return;
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  switch (form.dataset.form) {
    case "quick-income":
      addIncome(data.source.trim(), Number(data.amount), data.date);
      break;
    case "quick-expense":
      addExpense(data.category, Number(data.amount), data.date, (data.note || "").trim());
      break;
    case "income":
      addIncome(data.source.trim(), Number(data.amount), data.date);
      break;
    case "expense":
      addExpense(data.category, Number(data.amount), data.date, (data.note || "").trim());
      break;
    case "loan":
      addLoan(data.name.trim(), Number(data.emi), Number(data.rate), Number(data.monthsLeft));
      break;
    case "fd":
      addFD(data.name.trim(), Number(data.principal), Number(data.rate), data.startDate, data.maturityDate);
      break;
    case "sip":
      addSIP(data.name.trim(), Number(data.monthly), data.startDate);
      break;
    case "stock":
      addStock(data.name.trim(), data.sector.trim(), Number(data.quantity), Number(data.buyPrice));
      break;
    case "edit-stock": {
      const id = form.dataset.id;
      updateStock(id, {
        name: data.name.trim(),
        sector: data.sector.trim(),
        quantity: Number(data.quantity),
        buyPrice: Number(data.buyPrice),
      });
      ui.editingStockId = null;
      break;
    }
  }

  if (form.dataset.form !== "edit-stock") form.reset();
});

root.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  const id = el.dataset.id;

  switch (el.dataset.action) {
    case "delete-income": deleteIncome(id); break;
    case "delete-expense": deleteExpense(id); break;
    case "delete-loan": deleteLoan(id); break;
    case "delete-fd": deleteFD(id); break;
    case "delete-sip": deleteSIP(id); break;
    case "delete-stock": deleteStock(id); break;
    case "edit-stock": ui.editingStockId = id; render(); break;
    case "cancel-edit-stock": ui.editingStockId = null; render(); break;
    case "toggle-top-sort": ui.watchlistTopSort = !ui.watchlistTopSort; render(); break;
  }
});

root.addEventListener("change", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  switch (el.dataset.action) {
    case "filter-category": ui.expenseCategoryFilter = el.value; render(); break;
    case "filter-sector": ui.watchlistSectorFilter = el.value; render(); break;
  }
});

/* ---------------- Boot ---------------- */

render();
