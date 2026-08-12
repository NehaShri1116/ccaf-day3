import { useState } from "react";
import { formatArea, formatDensity, formatNumber, languageNames, currencyNames } from "../utils/format";

function CountryPicker({ id, label, countries, value, onChange }) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input
        id={id}
        list={`${id}-list`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a country name…"
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus-ring"
      />
      <datalist id={`${id}-list`}>
        {countries.map((c) => <option key={c.cca3} value={c.name} />)}
      </datalist>
    </div>
  );
}

const ROWS = [
  { label: "Flag", render: (c) => (c.flag ? <img src={c.flag} alt={c.flagAlt} className="h-10 rounded" /> : "—") },
  { label: "Official name", render: (c) => c.officialName },
  { label: "Capital", render: (c) => c.capital || "—" },
  { label: "Region", render: (c) => `${c.region || "—"}${c.subregion ? ` / ${c.subregion}` : ""}` },
  { label: "Population", render: (c) => formatNumber(c.population) },
  { label: "Area", render: (c) => formatArea(c.area) },
  { label: "Density", render: (c) => formatDensity(c.population, c.area) },
  { label: "Languages", render: (c) => languageNames(c) },
  { label: "Currency", render: (c) => currencyNames(c) },
  { label: "Timezones", render: (c) => c.timezones.length },
  { label: "Calling code", render: (c) => c.callingCode || "—" },
  { label: "Driving side", render: (c) => c.drivingSide || "—" },
];

export default function CompareView({ countries }) {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  const countryA = countries.find((c) => c.name.toLowerCase() === nameA.trim().toLowerCase());
  const countryB = countries.find((c) => c.name.toLowerCase() === nameB.trim().toLowerCase());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 mb-6">
        <CountryPicker id="compare-a" label="Country A" countries={countries} value={nameA} onChange={setNameA} />
        <CountryPicker id="compare-b" label="Country B" countries={countries} value={nameB} onChange={setNameB} />
      </div>

      {!countryA || !countryB ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
          Pick two countries above to compare them side by side.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900">
                <th className="text-left p-3 font-semibold w-1/3">Field</th>
                <th className="text-left p-3 font-semibold">{countryA.name}</th>
                <th className="text-left p-3 font-semibold">{countryB.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-3 text-gray-500 dark:text-gray-400">{row.label}</td>
                  <td className="p-3">{row.render(countryA)}</td>
                  <td className="p-3">{row.render(countryB)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
