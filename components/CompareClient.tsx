"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import {
  buildTenureTable,
  buildScorecard,
  buildAccessScorecard,
  buildGapAnalysis,
  generateInsights,
  categoryGap,
  distinctCategories
} from "@/lib/compare";
import FilterBar from "./FilterBar";
import RateChart from "./RateChart";
import TenureTable from "./TenureTable";
import ScorecardPanel from "./Scorecard";
import InsightsList from "./InsightsList";
import CoverageGrid from "./CoverageGrid";

export default function CompareClient({
  allProjects,
  platforms,
  labels,
  baseline,
  baselineLabel
}: {
  allProjects: Project[];
  platforms: string[];
  labels: Record<string, string>;
  baseline: string;
  baselineLabel: string;
}) {
  const [activePlatforms, setActivePlatforms] = useState<string[]>(platforms);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => distinctCategories(allProjects), [allProjects]);

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      if (!activePlatforms.includes(p.platform)) return false;
      if (activeCategory !== "all" && p.investmentCategory !== activeCategory) return false;
      return true;
    });
  }, [allProjects, activePlatforms, activeCategory]);

  const shownPlatforms = platforms.filter((p) => activePlatforms.includes(p));
  const competitors = shownPlatforms.filter((p) => p !== baseline);

  const tenureRows = useMemo(
    () => buildTenureTable(filtered, shownPlatforms),
    [filtered, shownPlatforms]
  );
  const scorecard = useMemo(
    () => buildScorecard(tenureRows, shownPlatforms),
    [tenureRows, shownPlatforms]
  );
  const accessScorecard = useMemo(
    () => buildAccessScorecard(tenureRows, shownPlatforms),
    [tenureRows, shownPlatforms]
  );
  const gaps = useMemo(
    () => buildGapAnalysis(tenureRows, baseline, competitors),
    [tenureRows, baseline, competitors]
  );
  const catGap = useMemo(() => categoryGap(filtered, baseline), [filtered, baseline]);
  const insights = useMemo(
    () =>
      generateInsights(
        tenureRows,
        gaps,
        baseline,
        baselineLabel,
        shownPlatforms,
        labels,
        catGap
      ),
    [tenureRows, gaps, baseline, baselineLabel, shownPlatforms, labels, catGap]
  );

  const chartData = tenureRows.map((row) => {
    const point: { tenure: string;[k: string]: string | number } = {
      tenure: `${row.tenure}mo`
    };
    row.stats.forEach((s) => {
      if (s.maxRate !== null) point[s.platform] = s.maxRate;
    });
    return point;
  });

  const contested = tenureRows.filter((r) => r.rateLeader !== null);
  const leadCount = contested.filter((r) => r.rateLeader === baseline).length;

  return (
    <div>
      <FilterBar
        platforms={platforms}
        labels={labels}
        activePlatforms={activePlatforms}
        onTogglePlatform={(p) =>
          setActivePlatforms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
          )
        }
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-tight">
          {contested.length > 0 ? (
            <>
              Leading{" "}
              <span className="font-mono text-lead">
                {leadCount}/{contested.length}
              </span>{" "}
              contested tenures.
            </>
          ) : (
            "Not enough overlapping data to compare."
          )}
        </h1>
      </div>

      <div className="mb-10">
        <div className="text-sm text-ink font-bold uppercase tracking-wide mb-3">
          Decision points
        </div>
        <InsightsList insights={insights} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <ScorecardPanel scores={scorecard} labels={labels} title="Rate wins by platform" winLabel="wins" />
        <ScorecardPanel
          scores={accessScorecard}
          labels={labels}
          title="Lowest entry cost by platform"
          winLabel="cheapest"
        />
      </div>

      {categories.length > 0 && (
        <div className="mb-10">
          <CoverageGrid
            title="Category coverage"
            rowLabels={categories}
            platforms={shownPlatforms}
            labels={labels}
            hasFn={(cat, platform) =>
              filtered.some((p) => p.platform === platform && p.investmentCategory === cat)
            }
          />
        </div>
      )}

      <div className="mb-10">
        <div className="text-sm text-ink font-bold uppercase tracking-wide mb-1">
          Best rate by exact tenure
        </div>
        <div className="text-xs text-muted mb-3">
          Every tenure length that appears in the data, shown individually.
        </div>
        <RateChart data={chartData} platforms={shownPlatforms} labels={labels} />
      </div>

      <div>
        <div className="text-sm text-ink font-bold uppercase tracking-wide mb-1">
          Full tenure breakdown
        </div>
        <div className="text-xs text-muted mb-3">
          Gold marks lowest entry cost; green marks the top rate at that tenure.
        </div>
        <TenureTable rows={tenureRows} platforms={shownPlatforms} labels={labels} />
      </div>
    </div>
  );
}