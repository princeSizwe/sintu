import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WEIGHTS: Record<string, number> = { SEARCH: 1, VIEW: 2, COMPARE: 3, POST_MENTION: 4 };

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "week";
  const now = new Date();
  let since: Date;
  if (period === "day") {
    since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const events = await prisma.wordEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { entryId: true, type: true },
  });

  const scores: Record<string, number> = {};
  for (const e of events) {
    scores[e.entryId] = (scores[e.entryId] || 0) + (WEIGHTS[e.type] || 1);
  }

  const sortedIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  if (sortedIds.length === 0) return NextResponse.json([]);

  const entries = await prisma.entry.findMany({
    where: { id: { in: sortedIds } },
    include: { language: true },
  });

  const ranked = sortedIds.map((id) => ({
    entry: entries.find((e) => e.id === id),
    score: scores[id],
  })).filter((r) => r.entry);

  return NextResponse.json(ranked);
}
