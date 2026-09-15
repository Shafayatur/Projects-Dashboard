import type { LeadershipRow } from "@/lib/compare";

export default function LeadershipTable({
  rows,
  platforms,
  labels
}: {
  rows: LeadershipRow[];
  platforms: string[];
  labels: Record<string, string>;
}) {
  return (
    <div className="border border-border bg-surface rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted">
            <th className="px-4 py-3 font-normal">Tenure</th>
            {platforms.map((p) => (
              <th key={p} className="px-4 py-3 font-normal text-center">
                {labels[p] || p}
              </th>
            ))}
            <th className="px-4 py-3 font-normal text-right">Leader</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.bucket.label} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-ink">{row.bucket.label}</td>
              {row.stats.map((s) => (
                <td key={s.platform} className="px-4 py-3 text-center font-mono">
                  {s.maxRate !== null ? (
                    <span className={s.platform === row.leader ? "text-gold" : "text-ink"}>
                      {s.maxRate}%
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-xs">
                {row.leader ? (
                  <span className="text-gold font-medium">{labels[row.leader] || row.leader}</span>
                ) : (
                  <span className="text-muted">no data</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
