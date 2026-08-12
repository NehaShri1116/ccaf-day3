import { useEffect } from "react";
import { formatArea, formatDensity, formatNumber, languageNames, currencyNames } from "../utils/format";

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value ?? "—"}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <h3 className="font-bold text-sm mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{children}</div>
    </section>
  );
}

export default function CountryDetail({ country, isFavorite, onToggleFavorite, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!country) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-start justify-center overflow-y-auto p-4" onClick={onClose}>
      <div
        className="bg-gray-50 dark:bg-gray-950 rounded-2xl max-w-3xl w-full my-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${country.name} details`}
      >
        <div className="relative h-40 rounded-t-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
          {country.flag && <img src={country.flag} alt={country.flagAlt} className="w-full h-full object-cover" />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-white dark:hover:bg-gray-800 focus-ring"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">{country.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{country.officialName}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggleFavorite(country.cca3)}
              aria-pressed={isFavorite}
              className={`text-sm rounded-md px-3 py-1.5 border focus-ring shrink-0 ${
                isFavorite
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
            </button>
          </div>

          <SectionCard title="Overview">
            <Field label="Capital" value={country.capital} />
            <Field label="Population" value={formatNumber(country.population)} />
            <Field label="Area" value={formatArea(country.area)} />
            <Field label="Region" value={country.region} />
            <Field label="Subregion" value={country.subregion} />
            <Field label="Timezones" value={country.timezones.length} />
          </SectionCard>

          <SectionCard title="Geography">
            <Field label="Continent" value={country.continents.length ? country.continents.join(", ") : "—"} />
            <Field label="Borders" value={country.borders.length ? country.borders.join(", ") : "None (island / no land borders)"} />
            <Field label="Coordinates" value={country.latlng ? country.latlng.map((n) => n.toFixed(2)).join(", ") : "—"} />
            <Field label="Landlocked" value={country.landlocked === null ? "—" : country.landlocked ? "Yes" : "No"} />
            {country.mapUrl && (
              <div className="col-span-2 sm:col-span-3">
                <a href={country.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 dark:text-brand-500 hover:underline focus-ring">
                  View on Google Maps →
                </a>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Languages &amp; Currency">
            <Field label="Official language(s)" value={languageNames(country)} />
            <Field label="Native name(s)" value={country.nativeNames.length ? country.nativeNames.slice(0, 3).join(", ") : "—"} />
            <Field label="Currency" value={currencyNames(country)} />
          </SectionCard>

          <SectionCard title="National Info">
            <Field label="Calling code" value={country.callingCode} />
            <Field label="Internet domain" value={country.tld} />
            <Field label="Driving side" value={country.drivingSide ? country.drivingSide[0].toUpperCase() + country.drivingSide.slice(1) : "—"} />
            {country.coatOfArms && (
              <div className="col-span-2 sm:col-span-3 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">Coat of arms</span>
                <img src={country.coatOfArms} alt={`Coat of arms of ${country.name}`} className="h-12" />
              </div>
            )}
          </SectionCard>

          <SectionCard title="Statistics">
            <Field label="Density" value={formatDensity(country.population, country.area)} />
            <Field label="Area" value={formatArea(country.area)} />
            <Field label="Borders" value={country.borders.length} />
            <Field label="Time zones" value={country.timezones.length} />
            <Field label="Languages" value={country.languages.length} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
