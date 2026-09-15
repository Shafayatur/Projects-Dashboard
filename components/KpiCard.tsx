export default function KpiCard({
  label,
  value,
  sub,
  accent = false
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-surface px-5 py-4 rounded-lg">
      <div className="text-xs text-muted mb-2">{label}</div>
      <div
        className={`font-mono text-3xl font-semibold tabular-nums ${
          accent ? "text-gold" : "text-ink"
        }`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}
