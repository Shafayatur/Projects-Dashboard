import type { Scorecard } from "@/lib/compare";

export default function ScorecardPanel({
  scores,
  labels
}: {
  scores: Scorecard[];
  labels: Record<string, string>;
}) {
  const maxWins = Math.max(...scores.map((s) => s.wins), 1);
  return (
    <div className="border-2 border-line">
      <div className="px-4 py-3 border-b-2 border-line text-xs uppercase tracking-wide text-muted font-bold">
        Rate wins by platform
      </div>
      <div className="p-5 space-y-4">
        {scores
          .slice()
          .sort((a, b) => b.wins - a.wins)
          .map((s) => (
            <div key={s.platform}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-bold text-ink">{labels[s.platform] || s.platform}</span>
                <span className="font-mono text-sm text-muted">
                  <span className="text-lead font-black">{s.wins}</span> wins
                  {s.ties > 0 && <span> · {s.ties} tied</span>}
                  <span> · {s.present} active tenures</span>
                </span>
              </div>
              <div className="h-3 bg-white/10">
                <div
                  className="h-full bg-lead"
                  style={{ width: `${(s.wins / maxWins) * 100}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
