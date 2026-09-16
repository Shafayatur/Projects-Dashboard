export default function CoverageGrid({
  title,
  rowLabels,
  platforms,
  labels,
  hasFn
}: {
  title: string;
  rowLabels: string[];
  platforms: string[];
  labels: Record<string, string>;
  hasFn: (rowLabel: string, platform: string) => boolean;
}) {
  if (rowLabels.length === 0) {
    return null;
  }
  return (
    <div className="border-2 border-line overflow-x-auto">
      <div className="px-4 py-3 border-b-2 border-line text-xs uppercase tracking-wide text-muted font-bold">
        {title}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/20 text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-bold"> </th>
            {platforms.map((p) => (
              <th key={p} className="px-4 py-3 font-bold text-center">
                {labels[p] || p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((row) => (
            <tr key={row} className="border-b border-white/20 last:border-0">
              <td className="px-4 py-3 text-ink font-medium">{row}</td>
              {platforms.map((p) => (
                <td key={p} className="px-4 py-3 text-center font-mono font-black">
                  {hasFn(row, p) ? (
                    <span className="text-lead">✓</span>
                  ) : (
                    <span className="text-gap">✕</span>
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
