import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import CountryCard from "./components/CountryCard";
import CountryDetail from "./components/CountryDetail";
import CompareView from "./components/CompareView";
import FavoritesView from "./components/FavoritesView";
import Footer from "./components/Footer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDarkMode } from "./hooks/useDarkMode";
import { fetchAllCountries } from "./api/countries";
import { matchesQuery } from "./utils/format";

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [tab, setTab] = useState("browse");
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useLocalStorage("cid_favorites", []);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  useEffect(() => {
    fetchAllCountries().then((data) => {
      setCountries(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return countries;
    return countries.filter((c) => matchesQuery(c, query));
  }, [countries, query]);

  const favoriteCountries = useMemo(
    () => countries.filter((c) => favoriteSet.has(c.cca3)),
    [countries, favoriteSet]
  );

  const toggleFavorite = (cca3) => {
    setFavorites((prev) => (prev.includes(cca3) ? prev.filter((x) => x !== cca3) : [...prev, cca3]));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        query={query}
        onQueryChange={setQuery}
        tab={tab}
        onTabChange={setTab}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {tab === "browse" && (
          loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="skeleton h-28 w-full" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-16">
              No countries match "{query}".
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((country) => (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  isFavorite={favoriteSet.has(country.cca3)}
                  onToggleFavorite={toggleFavorite}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )
        )}

        {tab === "compare" && <CompareView countries={countries} />}

        {tab === "favorites" && (
          <FavoritesView favoriteCountries={favoriteCountries} onToggleFavorite={toggleFavorite} onOpen={setSelected} />
        )}
      </main>

      <Footer totalLoaded={countries.length} />

      {selected && (
        <CountryDetail
          country={selected}
          isFavorite={favoriteSet.has(selected.cca3)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
