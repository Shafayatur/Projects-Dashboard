import type { TenureRow } from "@/lib/compare";

export default function TenureTable({
  rows,
  platforms,
  labels
}: {
  rows: TenureRow[];
  platforms: string[];
  labels: Record<string, string>;
}) {
  return (
    <div className="border-2 border-line overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-bold">Tenure</th>
            {platforms.map((p) => (
              <th key={p} className="px-4 py-3 font-bold text-center">
                {labels[p] || p}
              </th>
            ))}
            <th className="px-4 py-3 font-bold text-right">Rate leader</th>
            <th className="px-4 py-3 font-bold text-right">Lowest entry</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.tenure} className="border-b border-white/20 last:border-0">
              <td className="px-4 py-3 font-mono font-bold text-ink">{row.tenure}mo</td>
              {row.stats.map((s) => (
                <td key={s.platform} className="px-4 py-3 text-center font-mono">
                  {s.rate !== null ? (
                    <span className={s.platform === row.rateLeader ? "text-lead font-black" : "text-ink"}>
                      {s.rate}%
                    </span>
                  ) : (
                    <span className="text-muted">✕</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-xs">
                {row.rateLeader ? (
                  <span className="text-lead font-bold">{labels[row.rateLeader] || row.rateLeader}</span>
                ) : (
                  <span className="text-muted">no data</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-xs">
                {row.accessLeader ? (
                  <span className="text-flag font-bold">{labels[row.accessLeader] || row.accessLeader}</span>
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