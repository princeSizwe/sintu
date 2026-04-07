import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/events";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const lang = req.nextUrl.searchParams.get("lang") || undefined;

  const entries = await prisma.entry.findMany({
    where: {
      word: { contains: q, mode: "insensitive" },
      ...(lang ? { language: { code: lang } } : {}),
    },
    include: { language: true, morphemes: true },
    take: 20,
  });

  await Promise.all(entries.map((entry) => trackEvent(entry.id, "SEARCH").catch(() => {})));

  return NextResponse.json(entries);
}
