const numberFmt = new Intl.NumberFormat("en-US");

export function formatNumber(n) {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return "—";
  return numberFmt.format(n);
}

export function formatArea(sqKm) {
  if (!sqKm) return "—";
  return `${formatNumber(Math.round(sqKm))} km²`;
}

export function formatDensity(population, area) {
  if (!population || !area) return "—";
  return `${formatNumber(Math.round(population / area))} /km²`;
}

export function languageNames(country) {
  return country.languages.length ? country.languages.join(", ") : "—";
}

export function currencyNames(country) {
  return country.currencies.length
    ? country.currencies.map((c) => `${c.name} (${c.symbol || c.code})`).join(", ")
    : "—";
}

export function matchesQuery(country, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    country.name.toLowerCase().includes(q) ||
    country.officialName.toLowerCase().includes(q) ||
    (country.capital || "").toLowerCase().includes(q) ||
    (country.region || "").toLowerCase().includes(q) ||
    (country.subregion || "").toLowerCase().includes(q) ||
    country.currencies.some((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) ||
    country.languages.some((l) => l.toLowerCase().includes(q))
  );
}
