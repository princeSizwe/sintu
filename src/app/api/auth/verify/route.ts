import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashVerificationToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawToken = searchParams.get("token");

  if (!rawToken) {
    return NextResponse.redirect(new URL("/auth/verified?status=invalid", req.url));
  }

  const tokenHash = hashVerificationToken(rawToken);

  const user = await prisma.user.findFirst({
    where: { emailVerificationTokenHash: tokenHash },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/auth/verified?status=invalid", req.url));
  }

  if (!user.emailVerificationTokenExpiresAt || user.emailVerificationTokenExpiresAt < new Date()) {
    return NextResponse.redirect(new URL("/auth/verified?status=expired", req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
    },
  });

  return NextResponse.redirect(new URL("/auth/verified?status=success", req.url));
}
