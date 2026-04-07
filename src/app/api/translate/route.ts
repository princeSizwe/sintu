import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word") || "";
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  if (!word) return NextResponse.json({ error: "word required" }, { status: 400 });

  const source = await prisma.entry.findFirst({
    where: {
      word: { equals: word, mode: "insensitive" },
      ...(from ? { language: { code: from } } : {}),
    },
    include: { language: true, morphemes: true },
  });

  if (!source) return NextResponse.json({ translation: null, message: "No entry found" });

  const target = to
    ? await prisma.entry.findFirst({
        where: {
          word: { equals: word, mode: "insensitive" },
          language: { code: to },
        },
        include: { language: true },
      })
    : null;

  return NextResponse.json({ source, target, note: "MVP: morpheme-based translation coming soon" });
}
