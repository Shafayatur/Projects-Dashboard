import { listTabs, fetchTab } from "@/lib/sheets";
import { normalizeTab } from "@/lib/normalize";
import { summarizePlatform } from "@/lib/compare";
import KpiCard from "@/components/KpiCard";
import BucketBreakdown from "@/components/BucketBreakdown";
import ProjectTable from "@/components/ProjectTable";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";
const BASELINE_LABEL = process.env.NEXT_PUBLIC_BASELINE_LABEL || "Our Platform";

export const revalidate = 30;

export default async function PlatformPage({ params }: { params: { slug: string } }) {
  const tabName = decodeURIComponent(params.slug);
  const displayName = tabName === BASELINE_TAB ? BASELINE_LABEL : tabName;

  const rows = await fetchTab(tabName);
  const projects = normalizeTab(tabName, rows);
  const summary = summarizePlatform(tabName, projects);

  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-8">
        <div className="text-xs text-muted font-mono mb-1">platform</div>
        <h1 className="text-3xl font-semibold text-ink">{displayName}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Active projects" value={String(summary.projectCount)} />
        <KpiCard
          label="Average rate"
          value={summary.avgRate !== null ? `${summary.avgRate.toFixed(1)}%` : "—"}
        />
        <KpiCard
          label="Rate range"
          value={
            summary.rateMin !== null
              ? `${summary.rateMin}–${summary.rateMax}%`
              : "—"
          }
        />
      </div>

      <div className="mb-8">
        <BucketBreakdown bucketCounts={summary.bucketCounts} />
      </div>

      <div className="text-xs text-muted mb-3">All projects</div>
      <ProjectTable projects={projects} />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const tabs = await listTabs();
    return tabs.map((tab) => ({ slug: encodeURIComponent(tab) }));
  } catch {
    return [];
  }
}
