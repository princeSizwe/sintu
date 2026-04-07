import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateVerificationToken, tokenExpiresAt } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const role = adminEmail && email === adminEmail ? "ADMIN" : "USER";

  const { token, tokenHash } = generateVerificationToken();
  const expiresAt = tokenExpiresAt(24);

  await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash: await hashPassword(password),
      role,
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/api/auth/verify?token=${token}`;

  await sendVerificationEmail(email, verificationUrl);

  return NextResponse.json(
    { ok: true, message: "Registration successful. Please check your email to verify your account." },
    { status: 201 }
  );
}

