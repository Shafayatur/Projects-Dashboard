import { redirect } from "next/navigation";
import { listTabs } from "@/lib/sheets";

const BASELINE_TAB = process.env.BASELINE_TAB_NAME || "";

export default async function Home() {
  try {
    const tabs = await listTabs();
    const target = BASELINE_TAB && tabs.includes(BASELINE_TAB) ? BASELINE_TAB : tabs[0];
    if (target) redirect(`/platform/${encodeURIComponent(target)}`);
  } catch {
    // fall through to compare page as a safe default
  }
  redirect("/compare");
}
