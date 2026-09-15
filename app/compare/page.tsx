import { listTabs, fetchTab } from "@/lib/sheets";
import { normalizeTab } from "@/lib/normalize";
import {
  buildLeadershipTable,
  buildCoverageMatrix,
  leadershipHeadline,
  TENURE_BUCKETS
} from "@/lib/compare";
import CoverageMatrix from "@/components/CoverageMatrix";
import LeadershipTable from "@/components/LeadershipTable";
import RateChart from "@/components/RateChart";
import type { Project } from "@/lib/types";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";
const BASELINE_LABEL = process.env.NEXT_PUBLIC_BASELINE_LABEL || "Our Platform";

export const revalidate = 30;

export default async function ComparePage() {
  const tabs = await listTabs();
  const allProjects: Project[] = [];
  for (const tab of tabs) {
    const rows = await fetchTab(tab);
    allProjects.push(...normalizeTab(tab, rows));
  }

  const platforms = tabs.filter((t) => allProjects.some((p) => p.platform === t));
  const labels: Record<string, string> = {};
  platforms.forEach((p) => {
    labels[p] = p === BASELINE_TAB ? BASELINE_LABEL : p;
  });

  const leadership = buildLeadershipTable(allProjects, platforms);
  const coverage = buildCoverageMatrix(allProjects, platforms);
  const { leadCount, contestedCount } = leadershipHeadline(leadership, BASELINE_TAB);

  const chartData = TENURE_BUCKETS.map((bucket) => {
    const row = leadership.find((r) => r.bucket.label === bucket.label)!;
    const point: { bucket: string; [k: string]: string | number } = { bucket: bucket.label };
    row.stats.forEach((s) => {
      if (s.maxRate !== null) point[s.platform] = s.maxRate;
    });
    return point;
  });

  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-10">
        <div className="text-xs text-muted font-mono mb-2">comparison</div>
        <h1 className="text-4xl font-semibold text-ink leading-tight">
          {contestedCount > 0 ? (
            <>
              You lead in{" "}
              <span className="font-mono text-gold">
                {leadCount} of {contestedCount}
              </span>{" "}
              contested tenure brackets.
            </>
          ) : (
            "Not enough overlapping data yet to compare."
          )}
        </h1>
      </div>

      <div className="mb-10">
        <div className="text-sm text-ink font-medium mb-1">Rate leadership by tenure</div>
        <div className="text-xs text-muted mb-3">
          Highest available rate per platform, within each tenure bracket.
        </div>
        <RateChart data={chartData} platforms={platforms} labels={labels} />
      </div>

      <div className="mb-10">
        <div className="text-sm text-ink font-medium mb-1">Leadership table</div>
        <div className="text-xs text-muted mb-3">
          Gold marks the platform with the best rate in that bracket.
        </div>
        <LeadershipTable rows={leadership} platforms={platforms} labels={labels} />
      </div>

      <div>
        <div className="text-sm text-ink font-medium mb-1">Tenure coverage</div>
        <div className="text-xs text-muted mb-3">
          Does each platform have an active offer at this tenure at all?
        </div>
        <CoverageMatrix rows={coverage} platforms={platforms} labels={labels} />
      </div>
    </div>
  );
}
