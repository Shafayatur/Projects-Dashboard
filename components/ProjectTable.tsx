import type { Project } from "@/lib/types";

function fmtRate(p: Project) {
  if (p.rateMin === null) return "—";
  if (p.rateMin === p.rateMax) return `${p.rateMin}%`;
  return `${p.rateMin}–${p.rateMax}%`;
}

function fmtMoney(v: number | null) {
  if (v === null) return "—";
  return `৳${v.toLocaleString()}`;
}

export default function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="border border-border bg-surface rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted">
            <th className="px-4 py-3 font-normal">Project</th>
            <th className="px-4 py-3 font-normal">Category</th>
            <th className="px-4 py-3 font-normal">Rate</th>
            <th className="px-4 py-3 font-normal">Tenure</th>
            <th className="px-4 py-3 font-normal">Min. investment</th>
            <th className="px-4 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-ink">{p.projectName}</td>
              <td className="px-4 py-3 text-muted">{p.investmentCategory || "—"}</td>
              <td className="px-4 py-3 font-mono text-emerald">{fmtRate(p)}</td>
              <td className="px-4 py-3 font-mono text-ink">
                {p.tenureMonths !== null ? `${p.tenureMonths} mo` : "—"}
              </td>
              <td className="px-4 py-3 font-mono text-ink">{fmtMoney(p.minInvestment)}</td>
              <td className="px-4 py-3 text-muted">{p.status || "—"}</td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted">
                No projects captured yet for this platform.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
