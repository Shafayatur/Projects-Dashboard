import type { TenureBucket } from "@/lib/types";

export default function CoverageMatrix({
  rows,
  platforms,
  labels
}: {
  rows: { bucket: TenureBucket; coverage: Record<string, boolean> }[];
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.bucket.label} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-ink">{row.bucket.label}</td>
              {platforms.map((p) => (
                <td key={p} className="px-4 py-3 text-center">
                  {row.coverage[p] ? (
                    <span className="inline-block text-emerald font-mono">✓</span>
                  ) : (
                    <span className="inline-block text-red/70 font-mono">✕</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
