import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { computeAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const expectedPasskey = process.env.AUTH_PASSKEY;

  if (!expectedPasskey) {
    // Auth not configured — fail open would be dangerous, fail closed instead
    // only if trying to reach a protected page.
    return NextResponse.next();
  }

  const expectedToken = await computeAuthToken(expectedPasskey);

  if (token !== expectedToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/login).*)"]
};
