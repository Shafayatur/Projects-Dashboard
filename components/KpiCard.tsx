export default function KpiCard({
  label,
  value,
  sub,
  tone = "default"
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "lead" | "gap";
}) {
  const valueColor =
    tone === "lead" ? "text-lead" : tone === "gap" ? "text-gap" : "text-ink";
  return (
    <div className="border-2 border-line px-5 py-4">
      <div className="text-xs uppercase tracking-wide text-muted mb-2 font-bold">
        {label}
      </div>
      <div className={`font-mono text-4xl font-black tabular-nums ${valueColor}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}
