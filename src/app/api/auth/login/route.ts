import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Email not verified. Please check your inbox and verify your email before logging in." },
      { status: 403 }
    );
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}

