// restcountries.com's v3.1 API was retired and now requires a paid API key
// (unauthenticated requests get a 200 response wrapping a deprecation error).
// countries.dev is a free, keyless mirror of the classic country dataset and
// is used here instead. Its schema differs from v3.1, so normalize() below
// adapts field names/shapes rather than passing the response through as-is.
const BASE = "https://countries.dev";

function normalize(raw) {
  return {
    cca2: raw.alpha2Code,
    cca3: raw.alpha3Code,
    name: raw.name || "Unknown",
    officialName: raw.name || "Unknown",
    nativeNames: raw.nativeName ? [raw.nativeName] : [],
    capital: raw.capital || null,
    population: raw.population ?? 0,
    area: raw.area ?? null,
    region: raw.region || null,
    subregion: raw.subregion || null,
    continents: raw.region ? [raw.region] : [],
    timezones: raw.timezones || [],
    latlng: raw.latlng || null,
    mapUrl: raw.maps?.googleMaps || null,
    borders: raw.borders || [],
    landlocked: null,
    languages: raw.languages ? raw.languages.map((l) => l.name).filter(Boolean) : [],
    currencies: raw.currencies
      ? raw.currencies.map((c) => ({ code: c.code, name: c.name, symbol: c.symbol }))
      : [],
    flag: raw.flags?.svg || raw.flags?.png || null,
    flagAlt: `Flag of ${raw.name}`,
    coatOfArms: null,
    callingCode: raw.callingCodes?.[0] ? `+${raw.callingCodes[0]}` : null,
    tld: raw.topLevelDomain?.[0] || null,
    drivingSide: null,
  };
}

let cache = null;

/** Fetches and caches the full country list from the countries.dev API. */
export async function fetchAllCountries() {
  if (cache) return cache;
  try {
    const res = await fetch(`${BASE}/countries`);
    if (!res.ok) throw new Error(`Countries request failed: ${res.status}`);
    const data = await res.json();
    cache = data.map(normalize).sort((a, b) => a.name.localeCompare(b.name));
    return cache;
  } catch (err) {
    console.error("Failed to load countries:", err);
    return [];
  }
}
