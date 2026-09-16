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
    <div className="border-2 border-line overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-bold">Project</th>
            <th className="px-4 py-3 font-bold">Category</th>
            <th className="px-4 py-3 font-bold">Rate</th>
            <th className="px-4 py-3 font-bold">Tenure</th>
            <th className="px-4 py-3 font-bold">Min. investment</th>
            <th className="px-4 py-3 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={i} className="border-b border-white/20 last:border-0">
              <td className="px-4 py-3 text-ink font-medium">{p.projectName}</td>
              <td className="px-4 py-3 text-muted">{p.investmentCategory || "—"}</td>
              <td className="px-4 py-3 font-mono font-bold text-ink">{fmtRate(p)}</td>
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
                No projects match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
