"use client";

export default function FilterBar({
  platforms,
  labels,
  activePlatforms,
  onTogglePlatform,
  categories,
  activeCategory,
  onCategoryChange
}: {
  platforms: string[];
  labels: Record<string, string>;
  activePlatforms: string[];
  onTogglePlatform: (p: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (c: string) => void;
}) {
  return (
    <div className="border-2 border-line p-4 mb-8 flex flex-wrap gap-6 items-start">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted font-bold mb-2">Platforms</div>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => {
            const active = activePlatforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => onTogglePlatform(p)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-line transition-colors ${active ? "bg-ink text-black" : "bg-black text-ink hover:bg-white/10"
                  }`}
              >
                {labels[p] || p}
              </button>
            );
          })}
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wide text-muted font-bold mb-2">Category</div>
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-black border-2 border-line text-ink text-xs font-bold px-3 py-1.5"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}