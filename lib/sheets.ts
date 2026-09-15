// Pulls every tab from the Google Sheet using a service account (JWT auth).
// This bypasses any "anyone with the link" org policy, since it's an explicit
// named grant (the sheet is shared with the service account's email) rather
// than relying on public link access.
import { JWT } from "google-auth-library";
import type { RawRow } from "./types";

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

let cachedClient: JWT | null = null;

function getClient(): JWT {
  if (cachedClient) return cachedClient;
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }
  // Vercel env vars sometimes store the key with literal "\n" sequences
  // instead of real newlines, depending on how it was pasted. Handle both.
  const privateKey = SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n");

  cachedClient = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });
  return cachedClient;
}

interface SheetMeta {
  sheets: { properties: { title: string } }[];
}

/** Returns every tab name in the spreadsheet, in sheet order. */
export async function listTabs(): Promise<string[]> {
  if (!SHEETS_ID) throw new Error("Missing GOOGLE_SHEETS_ID");
  const client = getClient();
  const res = await client.request<SheetMeta>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}?fields=sheets.properties.title`
  });
  return res.data.sheets.map((s) => s.properties.title);
}

/** Returns all rows of a tab as objects keyed by the header row. */
export async function fetchTab(tabName: string): Promise<RawRow[]> {
  if (!SHEETS_ID) throw new Error("Missing GOOGLE_SHEETS_ID");
  const client = getClient();
  const range = encodeURIComponent(`${tabName}!A1:Z1000`);
  const res = await client.request<{ values?: string[][] }>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}`
  });
  const values = res.data.values || [];
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
