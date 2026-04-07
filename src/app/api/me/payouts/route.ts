import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ledger = await prisma.payoutLedger.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(ledger);
}
