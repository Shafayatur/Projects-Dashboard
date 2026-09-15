# Projects Dashboard

A live, comparative dashboard for investment/crowdfunding project listings pulled
directly from a Google Sheet — one page per platform, plus a head-to-head
comparison view (rate leadership by tenure, tenure coverage matrix).

Every tab in the connected spreadsheet becomes a dashboard page automatically.
Add a new tab to the sheet, and it shows up in the sidebar on next load — no
code changes required.

## How it works

- Data lives in a Google Sheet (one tab per platform).
- The app reads every tab via the Google Sheets API, authenticated as a
  read-only service account, on every page request — so it always reflects
  whatever is currently in the sheet.
- Rates, tenure, and investment amounts are parsed from whatever free-text
  formatting the source used (`"14.0 - 16.0%"`, `"10 months"`, `"৳45,000/share"`)
  into clean numeric values for comparison.
- One tab is treated as the "baseline" (your own platform) for the headline
  comparison stat; every other tab is compared against it.

## Setup

1. Create a Google Cloud service account (IAM & Admin → Service Accounts →
   Create Service Account), then create a JSON key for it.
2. Open the Google Sheet → Share → add the service account's email
   (`...@...iam.gserviceaccount.com`, from the JSON key) as **Viewer**.
   This works even if org policy blocks "anyone with the link" sharing,
   since it's an explicit named grant.
3. Copy `.env.example` to `.env.local` and fill in, using values from the
   downloaded JSON key file:

   ```
   GOOGLE_SHEETS_ID=                     # the long ID in your sheet's URL
   GOOGLE_SERVICE_ACCOUNT_EMAIL=         # "client_email" from the JSON key
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=   # "private_key" from the JSON key, including BEGIN/END lines
   BASELINE_TAB_NAME=                    # the exact tab name to treat as your own platform
   NEXT_PUBLIC_BASELINE_LABEL=           # what to display for that tab, e.g. "Our Platform"
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

Deploy on [Vercel](https://vercel.com): import this repo, add the same five
environment variables in Project Settings → Environment Variables, and deploy.
Mark `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` as **Secret**, since it's a real credential.
Every page fetches live on each request, so updating the underlying sheet is
reflected immediately — no rebuild or redeploy needed.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts
