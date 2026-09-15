import type { Project, TenureBucket } from "./types";

export const TENURE_BUCKETS: TenureBucket[] = [
  { label: "0–3 mo", min: 0, max: 3 },
  { label: "4–6 mo", min: 4, max: 6 },
  { label: "7–9 mo", min: 7, max: 9 },
  { label: "10–12 mo", min: 10, max: 12 },
  { label: "13–24 mo", min: 13, max: 24 },
  { label: "24+ mo", min: 25, max: Infinity }
];

export function bucketFor(months: number | null): TenureBucket | null {
  if (months === null) return null;
  return TENURE_BUCKETS.find((b) => months >= b.min && months <= b.max) || null;
}

export interface BucketStat {
  bucket: TenureBucket;
  platform: string;
  count: number;
  maxRate: number | null;
}

export interface LeadershipRow {
  bucket: TenureBucket;
  stats: { platform: string; count: number; maxRate: number | null }[];
  leader: string | null; // platform with highest maxRate, null if no data anywhere
}

/** For every tenure bucket, compute each platform's project count + best (max) rate,
 *  and determine which platform leads (highest max rate) in that bucket. */
export function buildLeadershipTable(
  allProjects: Project[],
  platforms: string[]
): LeadershipRow[] {
  return TENURE_BUCKETS.map((bucket) => {
    const stats = platforms.map((platform) => {
      const inBucket = allProjects.filter(
        (p) => p.platform === platform && bucketFor(p.tenureMonths)?.label === bucket.label
      );
      const rates = inBucket
        .map((p) => p.rateMax)
        .filter((r): r is number => r !== null);
      return {
        platform,
        count: inBucket.length,
        maxRate: rates.length ? Math.max(...rates) : null
      };
    });

    const withRate = stats.filter((s) => s.maxRate !== null);
    const leader =
      withRate.length > 0
        ? withRate.reduce((a, b) => (a.maxRate! > b.maxRate! ? a : b)).platform
        : null;

    return { bucket, stats, leader };
  });
}

/** Simple coverage: does this platform have ANY project in this tenure bucket? */
export function buildCoverageMatrix(
  allProjects: Project[],
  platforms: string[]
): { bucket: TenureBucket; coverage: Record<string, boolean> }[] {
  return TENURE_BUCKETS.map((bucket) => {
    const coverage: Record<string, boolean> = {};
    platforms.forEach((platform) => {
      coverage[platform] = allProjects.some(
        (p) => p.platform === platform && bucketFor(p.tenureMonths)?.label === bucket.label
      );
    });
    return { bucket, coverage };
  });
}

export interface PlatformSummary {
  platform: string;
  projectCount: number;
  avgRate: number | null;
  rateMin: number | null;
  rateMax: number | null;
  bucketCounts: { label: string; count: number }[];
}

export function summarizePlatform(platform: string, projects: Project[]): PlatformSummary {
  const own = projects.filter((p) => p.platform === platform);
  const rates = own.map((p) => p.rateAvg).filter((r): r is number => r !== null);
  const allRateVals = own
    .flatMap((p) => [p.rateMin, p.rateMax])
    .filter((r): r is number => r !== null);

  const bucketCounts = TENURE_BUCKETS.map((b) => ({
    label: b.label,
    count: own.filter((p) => bucketFor(p.tenureMonths)?.label === b.label).length
  })).filter((b) => b.count > 0);

  return {
    platform,
    projectCount: own.length,
    avgRate: rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null,
    rateMin: allRateVals.length ? Math.min(...allRateVals) : null,
    rateMax: allRateVals.length ? Math.max(...allRateVals) : null,
    bucketCounts
  };
}

/** Headline stat: "You lead in X of Y tenure brackets" */
export function leadershipHeadline(
  leadership: LeadershipRow[],
  baselinePlatform: string
): { leadCount: number; contestedCount: number } {
  const contested = leadership.filter((row) => row.leader !== null);
  const leadCount = contested.filter((row) => row.leader === baselinePlatform).length;
  return { leadCount, contestedCount: contested.length };
}
