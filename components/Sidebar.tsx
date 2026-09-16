import Link from "next/link";
import { listTabs } from "@/lib/sheets";
import LogoutButton from "./LogoutButton";

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
    <aside className="w-64 shrink-0 border-r-2 border-line px-5 py-8 hidden md:flex md:flex-col">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-wide text-muted font-bold">projects</div>
        <div className="text-xl font-black text-ink">dashboard</div>
      </div>

      <nav className="space-y-1 flex-1">
        <div className="text-xs uppercase tracking-wide text-muted font-bold mb-2 px-1">
          Platforms
        </div>
        {BASELINE_TAB && (
          <Link
            href={`/platform/${encodeURIComponent(BASELINE_TAB)}`}
            className="flex items-center justify-between px-3 py-2 text-sm font-bold text-ink hover:bg-white/10 transition-colors"
          >
            {BASELINE_LABEL}
            <span className="h-2 w-2 bg-flag" />
          </Link>
        )}
        {others.map((tab) => (
          <Link
            key={tab}
            href={`/platform/${encodeURIComponent(tab)}`}
            className="block px-3 py-2 text-sm font-bold text-ink hover:bg-white/10 transition-colors"
          >
            {tab}
          </Link>
        ))}

        <div className="text-xs uppercase tracking-wide text-muted font-bold mt-6 mb-2 px-1">
          Analysis
        </div>
        <Link
          href="/compare"
          className="block px-3 py-2 text-sm font-black text-lead hover:bg-white/10 transition-colors"
        >
          Comparison
        </Link>
      </nav>

      <LogoutButton />
    </aside>
  );
}
