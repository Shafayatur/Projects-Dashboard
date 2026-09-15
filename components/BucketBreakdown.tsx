export default function BucketBreakdown({
  bucketCounts
}: {
  bucketCounts: { label: string; count: number }[];
}) {
  if (bucketCounts.length === 0) {
    return <div className="text-sm text-muted">No tenure data available.</div>;
  }
  const max = Math.max(...bucketCounts.map((b) => b.count));
  return (
    <div className="border border-border bg-surface rounded-lg px-5 py-4">
      <div className="text-xs text-muted mb-3">Projects by tenure</div>
      <div className="space-y-2.5">
        {bucketCounts.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted shrink-0">{b.label}</div>
            <div className="flex-1 h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald rounded-full"
                style={{ width: `${(b.count / max) * 100}%` }}
              />
            </div>
            <div className="w-6 text-right font-mono text-xs text-ink shrink-0">
              {b.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
