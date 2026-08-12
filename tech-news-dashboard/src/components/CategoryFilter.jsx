import { CATEGORIES } from "../utils/categorize";

export default function CategoryFilter({ active, onChange }) {
  const all = ["All", ...CATEGORIES];
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      {all.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-ring ${
              isActive
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
