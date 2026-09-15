import type { RawRow, Project } from "./types";

/** "14.0 - 16.0%" -> [14, 16], "17.0" -> [17, 17], "" -> [null, null] */
function parseRate(raw: string | undefined): [number | null, number | null] {
  if (!raw) return [null, null];
  const nums = raw.match(/[\d.]+/g);
  if (!nums || nums.length === 0) return [null, null];
  if (nums.length === 1) {
    const v = parseFloat(nums[0]);
    return [v, v];
  }
  const values = nums.map(parseFloat);
  return [Math.min(...values), Math.max(...values)];
}

/** "10 months" -> 10, "1 year" -> 12 */
function parseTenure(raw: string | undefined): number | null {
  if (!raw) return null;
  const num = raw.match(/[\d.]+/);
  if (!num) return null;
  const value = parseFloat(num[0]);
  if (/year/i.test(raw)) return value * 12;
  return value;
}

/** "৳ 45000/share", "50000 BDT", "৳2,750,000" -> 45000 */
function parseMoney(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, "");
  const num = cleaned.match(/[\d.]+/);
  if (!num) return null;
  return parseFloat(num[0]);
}

export function normalizeRow(platform: string, row: RawRow): Project | null {
  const projectName = row["Project Name"];
  if (!projectName) return null;

  const [rateMin, rateMax] = parseRate(row["Return Rate"]);
  const rateAvg =
    rateMin !== null && rateMax !== null ? (rateMin + rateMax) / 2 : null;

  return {
    platform,
    projectName,
    productType: row["Product Type"] || null,
    investmentCategory: row["Investment Category"] || null,
    rateMin,
    rateMax,
    rateAvg,
    tenureMonths: parseTenure(row["Tenure"]),
    minInvestment: parseMoney(row["Min Investment"]),
    targetAmount: parseMoney(row["Target Amount"]),
    raisedAmount: parseMoney(row["Raised Amount"]),
    status: row["Status"] || null
  };
}

export function normalizeTab(platform: string, rows: RawRow[]): Project[] {
  return rows
    .map((r) => normalizeRow(platform, r))
    .filter((p): p is Project => p !== null);
}
