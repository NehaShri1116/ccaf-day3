import { formatNumber } from "../utils/format";

export default function CountryCard({ country, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <button type="button" onClick={() => onOpen(country)} className="text-left focus-ring">
        <div className="h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {country.flag && (
            <img src={country.flag} alt={country.flagAlt} className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2">{country.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {country.capital || "No capital"} · {country.region || "—"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pop. {formatNumber(country.population)}
          </p>
        </div>
      </button>
      <div className="px-3 pb-3 mt-auto">
        <button
          type="button"
          onClick={() => onToggleFavorite(country.cca3)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`w-full text-xs rounded-md px-2 py-1.5 border focus-ring ${
            isFavorite
              ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
              : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
        </button>
      </div>
    </div>
  );
}
