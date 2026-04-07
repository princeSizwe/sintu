import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken, tokenExpiresAt } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking whether an email is registered
  if (!user || user.emailVerifiedAt) {
    return NextResponse.json({ ok: true });
  }

  const { token, tokenHash } = generateVerificationToken();
  const expiresAt = tokenExpiresAt(24);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/api/auth/verify?token=${token}`;

  await sendVerificationEmail(email, verificationUrl);

  return NextResponse.json({ ok: true });
}
