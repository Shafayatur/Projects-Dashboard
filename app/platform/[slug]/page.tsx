import { fetchTab } from "@/lib/sheets";
import { normalizeTab } from "@/lib/normalize";
import { summarizePlatform } from "@/lib/compare";
import KpiCard from "@/components/KpiCard";
import TenureBreakdown from "@/components/TenureBreakdown";
import ProjectTable from "@/components/ProjectTable";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";
const BASELINE_LABEL = process.env.NEXT_PUBLIC_BASELINE_LABEL || "Our Platform";

export const dynamic = "force-dynamic";

export default async function PlatformPage({ params }: { params: { slug: string } }) {
  const tabName = decodeURIComponent(params.slug);
  const displayName = tabName === BASELINE_TAB ? BASELINE_LABEL : tabName;

  const rows = await fetchTab(tabName);
  const projects = normalizeTab(tabName, rows);
  const summary = summarizePlatform(tabName, projects);

  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wide text-muted font-bold mb-2">
          Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-ink">{displayName}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Active projects" value={String(summary.projectCount)} />
        <KpiCard
          label="Average rate"
          value={summary.avgRate !== null ? `${summary.avgRate.toFixed(1)}%` : "—"}
        />
        <KpiCard
          label="Rate range"
          value={summary.rateMin !== null ? `${summary.rateMin}–${summary.rateMax}%` : "—"}
        />
      </div>

      <div className="mb-8">
        <TenureBreakdown tenureCounts={summary.tenureCounts} />
      </div>

      <div className="text-xs uppercase tracking-wide text-muted font-bold mb-3">
        All projects
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
