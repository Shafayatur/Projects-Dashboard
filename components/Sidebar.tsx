import Link from "next/link";
import { listTabs } from "@/lib/sheets";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";
const BASELINE_LABEL = process.env.NEXT_PUBLIC_BASELINE_LABEL || "Our Platform";

export default async function Sidebar() {
  let tabs: string[] = [];
  try {
    tabs = await listTabs();
  } catch {
    tabs = [];
  }

  const others = tabs.filter((t) => t !== BASELINE_TAB);

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface px-5 py-8 hidden md:block">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-wide text-muted">projects</div>
        <div className="text-lg font-semibold text-ink">dashboard</div>
      </div>

      <nav className="space-y-1">
        <div className="text-xs text-muted mb-2 px-1">Platforms</div>
        {BASELINE_TAB && (
          <Link
            href={`/platform/${encodeURIComponent(BASELINE_TAB)}`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-ink hover:bg-surface2 transition-colors"
          >
            {BASELINE_LABEL}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </Link>
        )}
        {others.map((tab) => (
          <Link
            key={tab}
            href={`/platform/${encodeURIComponent(tab)}`}
            className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-surface2 transition-colors"
          >
            {tab}
          </Link>
        ))}

        <div className="text-xs text-muted mt-6 mb-2 px-1">Analysis</div>
        <Link
          href="/compare"
          className="block rounded-md px-3 py-2 text-sm text-emerald font-medium hover:bg-surface2 transition-colors"
        >
          Comparison
        </Link>
      </nav>
    </aside>
  );
}
