export type RawRow = Record<string, string>;

export interface Project {
  platform: string;        // "competitor" column value, or tab name as fallback
  projectName: string;
  productType: string | null;
  investmentCategory: string | null; // Regular / Shariah / null
  rateMin: number | null;         // raw displayed min (or single value) — display only
  rateMax: number | null;         // raw displayed max, null if not a range — display only
  rateTenureBased: number | null; // THE number for all comparisons — already normalized
  rateSource: string | null;      // breakdown_actual | converted_from_annualized | as_displayed | assumed_tenure_based | needs_manual_review
  tenureMonths: number | null;
  minInvestment: number | null;
  targetAmount: number | null;
  raisedAmount: number | null;
  status: string | null;
}

export interface TenureBucket {
  label: string;
  min: number;
  max: number;
}