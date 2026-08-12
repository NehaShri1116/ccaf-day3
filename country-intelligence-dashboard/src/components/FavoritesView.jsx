import CountryCard from "./CountryCard";

export default function FavoritesView({ favoriteCountries, onToggleFavorite, onOpen }) {
  if (favoriteCountries.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-16">
        No favorites yet — star a country from Search to save it here. Stored locally in your browser.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {favoriteCountries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          isFavorite
          onToggleFavorite={onToggleFavorite}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
