// Computes a verification token from the passkey using Web Crypto (SubtleCrypto),
// which is available both in Node.js route handlers and in Edge middleware —
// so the same function works in both places without extra dependencies.
export async function computeAuthToken(passkey: string): Promise<string> {
  const data = new TextEncoder().encode(`dashboard-auth:${passkey}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const AUTH_COOKIE_NAME = "dashboard_auth";
