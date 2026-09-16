import { NextResponse } from "next/server";
import { computeAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, passkey } = await req.json();

  const expectedName = process.env.AUTH_NAME;
  const expectedPasskey = process.env.AUTH_PASSKEY;

  if (!expectedName || !expectedPasskey) {
    return NextResponse.json(
      { ok: false, error: "Server auth is not configured." },
      { status: 500 }
    );
  }

  if (name !== expectedName || passkey !== expectedPasskey) {
    return NextResponse.json({ ok: false, error: "Incorrect name or passkey." }, { status: 401 });
  }

  const token = await computeAuthToken(passkey);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}
