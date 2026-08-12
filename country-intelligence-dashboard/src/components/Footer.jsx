export default function Footer({ totalLoaded }) {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-8 mt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <p>{totalLoaded > 0 ? `${totalLoaded} countries loaded.` : ""} Data from the free, public Countries API (countries.dev) — no auth, no database, fully frontend.</p>
    </footer>
  );
}
