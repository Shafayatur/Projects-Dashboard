export type RawRow = Record<string, string>;

export interface Project {
  platform: string;        // source tab name
  projectName: string;
  productType: string | null;
  investmentCategory: string | null; // Regular / Shariah / null
  rateMin: number | null;
  rateMax: number | null;
  rateAvg: number | null;
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
