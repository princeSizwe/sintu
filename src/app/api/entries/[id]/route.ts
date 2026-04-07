import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/events";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { language: true, morphemes: true },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await trackEvent(id, "VIEW").catch(() => {});
  return NextResponse.json(entry);
}
