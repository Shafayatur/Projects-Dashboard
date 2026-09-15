// Pulls every tab from a public (view-only) Google Sheet via the Sheets API v4,
// using a restricted read-only API key. No service account, no OAuth.
import type { RawRow } from "./types";

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

interface SheetMeta {
  sheets: { properties: { title: string } }[];
}

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`Sheets API request failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** Returns every tab name in the spreadsheet, in sheet order. */
export async function listTabs(): Promise<string[]> {
  if (!SHEETS_ID || !API_KEY) throw new Error("Missing GOOGLE_SHEETS_ID or GOOGLE_SHEETS_API_KEY");
  const meta: SheetMeta = await fetchJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}?key=${API_KEY}&fields=sheets.properties.title`
  );
  return meta.sheets.map((s) => s.properties.title);
}

/** Returns all rows of a tab as objects keyed by the header row. */
export async function fetchTab(tabName: string): Promise<RawRow[]> {
  if (!SHEETS_ID || !API_KEY) throw new Error("Missing GOOGLE_SHEETS_ID or GOOGLE_SHEETS_API_KEY");
  const range = encodeURIComponent(`${tabName}!A1:Z1000`);
  const data = await fetchJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}?key=${API_KEY}`
  );
  const values: string[][] = data.values || [];
  if (values.length < 2) return [];
  const [header, ...rows] = values;
  return rows
    .filter((r) => r.some((cell) => cell && cell.trim() !== ""))
    .map((row) => {
      const obj: RawRow = {};
      header.forEach((key, i) => {
        obj[key.trim()] = (row[i] ?? "").trim();
      });
      return obj;
    });
}
