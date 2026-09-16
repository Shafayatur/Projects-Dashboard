export default function TenureBreakdown({
  tenureCounts
}: {
  tenureCounts: { tenure: number; count: number }[];
}) {
  if (tenureCounts.length === 0) {
    return <div className="text-sm text-muted">No tenure data available.</div>;
  }
  const max = Math.max(...tenureCounts.map((b) => b.count));
  return (
    <div className="border-2 border-line px-5 py-4">
      <div className="text-xs uppercase tracking-wide text-muted mb-3 font-bold">
        Projects by tenure (months)
      </div>
      <div className="space-y-2.5">
        {tenureCounts.map((b) => (
          <div key={b.tenure} className="flex items-center gap-3">
            <div className="w-14 text-xs font-mono text-ink shrink-0">{b.tenure}mo</div>
            <div className="flex-1 h-2.5 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-ink"
                style={{ width: `${(b.count / max) * 100}%` }}
              />
            </div>
            <div className="w-6 text-right font-mono text-xs font-bold text-ink shrink-0">
              {b.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
