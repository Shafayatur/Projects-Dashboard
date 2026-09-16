import { listTabs, fetchTab } from "@/lib/sheets";
import { normalizeTab } from "@/lib/normalize";
import CompareClient from "@/components/CompareClient";
import type { Project } from "@/lib/types";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";
const BASELINE_LABEL = process.env.NEXT_PUBLIC_BASELINE_LABEL || "Our Platform";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const tabs = await listTabs();
  const allProjects: Project[] = [];
  for (const tab of tabs) {
    const rows = await fetchTab(tab);
    allProjects.push(...normalizeTab(tab, rows));
  }

  const platforms = tabs.filter((t) => allProjects.some((p) => p.platform === t));
  const labels: Record<string, string> = {};
  platforms.forEach((p) => {
    labels[p] = p === BASELINE_TAB ? BASELINE_LABEL : p;
  });

  return (
    <div className="px-8 py-10 max-w-6xl">
      <div className="text-xs uppercase tracking-wide text-muted font-bold mb-8">
        Comparison
      </div>
      <CompareClient
        allProjects={allProjects}
        platforms={platforms}
        labels={labels}
        baseline={BASELINE_TAB}
        baselineLabel={BASELINE_LABEL}
      />
    </div>
  );
}
