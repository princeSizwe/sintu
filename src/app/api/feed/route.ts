import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/events";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, entryIds } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const post = await prisma.post.create({
    data: { content, authorId: session.id },
  });

  if (Array.isArray(entryIds)) {
    for (const id of entryIds) {
      await trackEvent(id, "POST_MENTION").catch(() => {});
    }
  }

  return NextResponse.json(post, { status: 201 });
}
