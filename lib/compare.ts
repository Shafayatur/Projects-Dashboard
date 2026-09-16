import type { Project } from "./types";

/** Every distinct tenure value that actually appears in the data, sorted.
 *  No grouping — each tenure (3mo, 4mo, 5mo...) is its own row, since IR
 *  cares about exact product gaps, not ranges. */
export function distinctTenures(projects: Project[]): number[] {
  const set = new Set<number>();
  projects.forEach((p) => {
    if (p.tenureMonths !== null) set.add(p.tenureMonths);
  });
  return Array.from(set).sort((a, b) => a - b);
}

export function distinctCategories(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => {
    if (p.investmentCategory) set.add(p.investmentCategory);
  });
  return Array.from(set).sort();
}

export function distinctProductTypes(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => {
    if (p.productType) set.add(p.productType);
  });
  return Array.from(set).sort();
}

export interface TenureStat {
  platform: string;
  count: number;
  maxRate: number | null;
  minInvestment: number | null; // lowest min-investment offered at this tenure
}

export interface TenureRow {
  tenure: number;
  stats: TenureStat[];
  rateLeader: string | null;       // highest maxRate
  accessLeader: string | null;     // lowest minInvestment
}

/** For every exact tenure value present in the data, compute each platform's
 *  project count, best (max) rate, and lowest min-investment — and who leads
 *  each of those two dimensions. */
export function buildTenureTable(projects: Project[], platforms: string[]): TenureRow[] {
  const tenures = distinctTenures(projects);

  return tenures.map((tenure) => {
    const stats: TenureStat[] = platforms.map((platform) => {
      const matches = projects.filter(
        (p) => p.platform === platform && p.tenureMonths === tenure
      );
      const rates = matches.map((p) => p.rateMax).filter((r): r is number => r !== null);
      const invs = matches
        .map((p) => p.minInvestment)
        .filter((v): v is number => v !== null);
      return {
        platform,
        count: matches.length,
        maxRate: rates.length ? Math.max(...rates) : null,
        minInvestment: invs.length ? Math.min(...invs) : null
      };
    });

    const withRate = stats.filter((s) => s.maxRate !== null);
    const rateLeader = withRate.length
      ? withRate.reduce((a, b) => (a.maxRate! > b.maxRate! ? a : b)).platform
      : null;

    const withInv = stats.filter((s) => s.minInvestment !== null);
    const accessLeader = withInv.length
      ? withInv.reduce((a, b) => (a.minInvestment! < b.minInvestment! ? a : b)).platform
      : null;

    return { tenure, stats, rateLeader, accessLeader };
  });
}

export interface Scorecard {
  platform: string;
  wins: number;    // tenures where this platform has the single best rate
  ties: number;    // tenures where this platform shares the best rate
  present: number; // tenures where this platform has any offer at all
}

export function buildScorecard(rows: TenureRow[], platforms: string[]): Scorecard[] {
  return platforms.map((platform) => {
    let wins = 0;
    let ties = 0;
    let present = 0;

    rows.forEach((row) => {
      const mine = row.stats.find((s) => s.platform === platform);
      if (mine && mine.count > 0) present++;
      if (mine && mine.maxRate !== null) {
        const topRate = Math.max(
          ...row.stats.filter((s) => s.maxRate !== null).map((s) => s.maxRate!)
        );
        if (mine.maxRate === topRate) {
          const sharedBy = row.stats.filter((s) => s.maxRate === topRate).length;
          if (sharedBy > 1) ties++;
          else wins++;
        }
      }
    });

    return { platform, wins, ties, present };
  });
}

export interface GapPoint {
  tenure: number;
  competitor: string;
  baselineRate: number | null;
  competitorRate: number | null;
  delta: number | null; // baseline - competitor. Positive = ahead, negative = behind.
}

/** Per tenure, per competitor: how far ahead or behind is the baseline platform. */
export function buildGapAnalysis(
  rows: TenureRow[],
  baseline: string,
  competitors: string[]
): GapPoint[] {
  const points: GapPoint[] = [];
  rows.forEach((row) => {
    const base = row.stats.find((s) => s.platform === baseline);
    competitors.forEach((comp) => {
      const other = row.stats.find((s) => s.platform === comp);
      const baselineRate = base?.maxRate ?? null;
      const competitorRate = other?.maxRate ?? null;
      const delta =
        baselineRate !== null && competitorRate !== null
          ? +(baselineRate - competitorRate).toFixed(2)
          : null;
      points.push({ tenure: row.tenure, competitor: comp, baselineRate, competitorRate, delta });
    });
  });
  return points;
}

export interface Insight {
  type: "gap" | "lead" | "missing" | "category";
  text: string;
}

/** Plain-language, decision-oriented takeaways for the IR team. */
export function generateInsights(
  rows: TenureRow[],
  gaps: GapPoint[],
  baseline: string,
  baselineLabel: string,
  platforms: string[],
  labels: Record<string, string>,
  categories: { present: string[]; missing: string[] }
): Insight[] {
  const insights: Insight[] = [];

  // Biggest gap (most behind)
  const behind = gaps.filter((g) => g.delta !== null && g.delta < 0);
  if (behind.length) {
    const worst = behind.reduce((a, b) => (a.delta! < b.delta! ? a : b));
    insights.push({
      type: "gap",
      text: `Biggest gap: at ${worst.tenure} months, ${labels[worst.competitor] || worst.competitor} offers ${worst.competitorRate}% vs ${baselineLabel}'s ${worst.baselineRate}% — ${Math.abs(worst.delta!).toFixed(1)} pts behind.`
    });
  }

  // Biggest lead
  const ahead = gaps.filter((g) => g.delta !== null && g.delta > 0);
  if (ahead.length) {
    const best = ahead.reduce((a, b) => (a.delta! > b.delta! ? a : b));
    insights.push({
      type: "lead",
      text: `Strongest edge: at ${best.tenure} months, ${baselineLabel} offers ${best.baselineRate}% vs ${labels[best.competitor] || best.competitor}'s ${best.competitorRate}% — ${best.delta!.toFixed(1)} pts ahead.`
    });
  }

  // Missing tenures — a competitor has an offer at a tenure baseline doesn't
  const missingTenures = rows.filter((row) => {
    const mine = row.stats.find((s) => s.platform === baseline);
    const someoneElseHas = row.stats.some(
      (s) => s.platform !== baseline && s.count > 0
    );
    return (!mine || mine.count === 0) && someoneElseHas;
  });
  if (missingTenures.length) {
    const list = missingTenures.map((r) => `${r.tenure}mo`).join(", ");
    insights.push({
      type: "missing",
      text: `${baselineLabel} has no product at these tenures, while at least one competitor does: ${list}.`
    });
  }

  // Category coverage gap
  if (categories.missing.length) {
    insights.push({
      type: "category",
      text: `${baselineLabel} doesn't offer: ${categories.missing.join(", ")} — at least one competitor does.`
    });
  }

  return insights;
}

/** Which investment categories (Regular/Shariah/etc) does the baseline
 *  platform lack that at least one competitor offers? */
export function categoryGap(
  projects: Project[],
  baseline: string
): { present: string[]; missing: string[] } {
  const all = distinctCategories(projects);
  const baselineHas = new Set(
    projects.filter((p) => p.platform === baseline && p.investmentCategory).map((p) => p.investmentCategory!)
  );
  return {
    present: all.filter((c) => baselineHas.has(c)),
    missing: all.filter((c) => !baselineHas.has(c))
  };
}

export interface PlatformSummary {
  platform: string;
  projectCount: number;
  avgRate: number | null;
  rateMin: number | null;
  rateMax: number | null;
  tenureCounts: { tenure: number; count: number }[];
}

export function summarizePlatform(platform: string, projects: Project[]): PlatformSummary {
  const own = projects.filter((p) => p.platform === platform);
  const rates = own.map((p) => p.rateAvg).filter((r): r is number => r !== null);
  const allRateVals = own.flatMap((p) => [p.rateMin, p.rateMax]).filter((r): r is number => r !== null);

  const tenures = distinctTenures(own);
  const tenureCounts = tenures.map((t) => ({
    tenure: t,
    count: own.filter((p) => p.tenureMonths === t).length
  }));

  return {
    platform,
    projectCount: own.length,
    avgRate: rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null,
    rateMin: allRateVals.length ? Math.min(...allRateVals) : null,
    rateMax: allRateVals.length ? Math.max(...allRateVals) : null,
    tenureCounts
  };
}
