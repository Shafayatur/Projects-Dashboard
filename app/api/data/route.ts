import { NextResponse } from "next/server";
import { listTabs, fetchTab } from "@/lib/sheets";
import { normalizeTab } from "@/lib/normalize";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tabs = await listTabs();
    const allProjects: Project[] = [];

    for (const tab of tabs) {
      const rows = await fetchTab(tab);
      allProjects.push(...normalizeTab(tab, rows));
    }

    return NextResponse.json({ tabs, projects: allProjects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
