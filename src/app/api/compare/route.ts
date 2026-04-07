import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/events";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) || [];
  if (ids.length < 2) {
    return NextResponse.json({ error: "Provide at least 2 entry ids" }, { status: 400 });
  }

  const entries = await prisma.entry.findMany({
    where: { id: { in: ids } },
    include: { language: true, morphemes: true },
  });

  for (const entry of entries) {
    await trackEvent(entry.id, "COMPARE").catch(() => {});
  }

  return NextResponse.json(entries);
}
