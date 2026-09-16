import type { Insight } from "@/lib/compare";

const ICON: Record<Insight["type"], string> = {
  lead: "▲",
  gap: "▼",
  missing: "○",
  category: "◆"
};

const COLOR: Record<Insight["type"], string> = {
  lead: "text-lead",
  gap: "text-gap",
  missing: "text-flag",
  category: "text-flag"
};

export default function InsightsList({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return (
      <div className="border-2 border-line px-5 py-4 text-sm text-muted">
        Not enough overlapping data yet to generate insights.
      </div>
    );
  }
  return (
    <div className="border-2 border-line divide-y divide-white/20">
      {insights.map((insight, i) => (
        <div key={i} className="flex gap-3 px-5 py-4">
          <span className={`font-mono font-black ${COLOR[insight.type]}`}>
            {ICON[insight.type]}
          </span>
          <span className="text-sm text-ink leading-relaxed">{insight.text}</span>
        </div>
      ))}
    </div>
  );
}
