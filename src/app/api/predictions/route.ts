import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const rounds = await prisma.predictionRound.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      predictions: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });
  return NextResponse.json(rounds);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { title, description, endsAt } = await req.json();
  if (!title || !endsAt) {
    return NextResponse.json({ error: "title and endsAt required" }, { status: 400 });
  }

  const round = await prisma.predictionRound.create({
    data: { title, description, endsAt: new Date(endsAt) },
  });
  return NextResponse.json(round, { status: 201 });
}
