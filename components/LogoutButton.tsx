"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="text-xs uppercase tracking-wide text-muted font-bold px-3 py-2 text-left hover:text-ink transition-colors"
    >
      Sign out
    </button>
  );
}
