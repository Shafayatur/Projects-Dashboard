import type { RawRow, Project } from "./types";

/** "10 months" -> 10, "1 year" -> 12. Fallback only. */
function parseTenureFallback(raw: string | undefined): number | null {
  if (!raw) return null;
  const num = raw.match(/[\d.]+/);
  if (!num) return null;
  const value = parseFloat(num[0]);
  if (/year/i.test(raw)) return value * 12;
  return value;
}

function toMonths(value: number | null, unit: string | null): number | null {
  if (value === null || !unit) return null;
  if (unit === "months") return value;
  if (unit === "days") return value / 30;
  if (unit === "years") return value * 12;
  return null;
}

/** "100000 BDT", "৳2,750,000", "150000" -> number */
function parseMoney(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, "");
  const num = cleaned.match(/[\d.]+/);
  if (!num) return null;
  return parseFloat(num[0]);
}

function parseNum(raw: string | undefined): number | null {
  if (!raw || raw.trim() === "") return null;
  const v = parseFloat(raw);
  return isNaN(v) ? null : v;
}

export function normalizeRow(defaultPlatform: string, row: RawRow): Project | null {
  const projectName = row["project_name"];
  if (!projectName) return null;

  const platform = row["competitor"]?.trim() || defaultPlatform;

  const tenureValue = parseNum(row["tenure_value"]);
  const tenureUnit = row["tenure_unit"] || null;
  const tenureMonths =
    toMonths(tenureValue, tenureUnit) ?? parseTenureFallback(row["tenure"]);

  return {
    platform,
    projectName,
    productType: row["product_type"] || null,
    investmentCategory: row["investment_category"] || null,
    rateMin: parseNum(row["return_rate_min"]),
    rateMax: parseNum(row["return_rate_max"]),
    rateTenureBased: parseNum(row["return_rate_tenure_based"]),
    rateSource: row["return_rate_source"] || null,
    tenureMonths,
    minInvestment: parseMoney(row["min_investment"]),
    targetAmount: parseMoney(row["target_amount"]),
    raisedAmount: parseMoney(row["raised_amount"]),
    status: row["status"] || null
  };
}

export function normalizeTab(platform: string, rows: RawRow[]): Project[] {
  return rows
    .map((r) => normalizeRow(platform, r))
    .filter((p): p is Project => p !== null);
}