"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, passkey })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border-2 border-line p-8">
        <div className="text-xs uppercase tracking-wide text-muted font-bold mb-2">
          Projects Dashboard
        </div>
        <h1 className="text-2xl font-black text-ink mb-6">Sign in</h1>

        <label className="block text-xs uppercase tracking-wide text-muted font-bold mb-1.5">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border-2 border-line text-ink px-3 py-2 mb-4 font-mono"
          autoFocus
        />

        <label className="block text-xs uppercase tracking-wide text-muted font-bold mb-1.5">
          Passkey
        </label>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          className="w-full bg-black border-2 border-line text-ink px-3 py-2 mb-6 font-mono"
        />

        {error && <div className="text-sm text-gap font-bold mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-black font-black py-2.5 uppercase tracking-wide text-sm hover:bg-white/80 transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
