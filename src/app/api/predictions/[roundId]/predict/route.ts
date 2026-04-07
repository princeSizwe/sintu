import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roundId } = await params;
  const { value } = await req.json();
  if (!value) return NextResponse.json({ error: "value required" }, { status: 400 });

  try {
    const prediction = await prisma.prediction.create({
      data: { roundId, userId: session.id, value },
    });
    return NextResponse.json(prediction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already predicted or round not found" }, { status: 409 });
  }
}
