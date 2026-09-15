# Projects Dashboard

A live, comparative dashboard for investment/crowdfunding project listings pulled
directly from a Google Sheet — one page per platform, plus a head-to-head
comparison view (rate leadership by tenure, tenure coverage matrix).

Every tab in the connected spreadsheet becomes a dashboard page automatically.
Add a new tab to the sheet, and it shows up in the sidebar on next load — no
code changes required.

## How it works

- Data lives in a Google Sheet (one tab per platform).
- The app reads every tab via the Google Sheets API (read-only API key, no
  service account needed) on every page request — so it always reflects
  whatever is currently in the sheet.
- Rates, tenure, and investment amounts are parsed from whatever free-text
  formatting the source used (`"14.0 - 16.0%"`, `"10 months"`, `"৳45,000/share"`)
  into clean numeric values for comparison.
- One tab is treated as the "baseline" (your own platform) for the headline
  comparison stat; every other tab is compared against it.

## Setup

1. Share the Google Sheet as **"Anyone with the link: Viewer"**.
2. Get a Google Sheets API key (Google Cloud Console → APIs & Services →
   Credentials → Create API Key), and restrict it to the **Google Sheets API**
   only.
3. Copy `.env.example` to `.env.local` and fill in:

   ```
   GOOGLE_SHEETS_ID=            # the long ID in your sheet's URL
   GOOGLE_SHEETS_API_KEY=       # the restricted API key from step 2
   BASELINE_TAB_NAME=           # the exact tab name to treat as your own platform
   NEXT_PUBLIC_BASELINE_LABEL=  # what to display for that tab, e.g. "Our Platform"
   ```

4. Install and run:

   ```
   npm install
   npm run dev
   ```

## Sheet schema each tab is expected to follow

| Column | Required |
|---|---|
| Project Name | yes |
| Product Type | no |
| Investment Category | no |
| Return Rate | yes (for rate comparisons) |
| Tenure | yes (for tenure comparisons) |
| Min Investment | no |
| Target Amount | no |
| Raised Amount | no |
| Status | no |

## Deploying

Deploy on [Vercel](https://vercel.com): import this repo, add the same four
environment variables in Project Settings → Environment Variables, and deploy.
Every page fetches live on each request, so updating the underlying sheet is
reflected immediately — no rebuild or redeploy needed.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts
