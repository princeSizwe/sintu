import { prisma } from "./prisma";
import { EventType } from "@prisma/client";

const WEIGHTS: Record<EventType, number> = {
  SEARCH: 1,
  VIEW: 2,
  COMPARE: 3,
  POST_MENTION: 4,
};

export async function trackEvent(entryId: string, type: EventType) {
  await prisma.wordEvent.create({ data: { entryId, type } });
}

export async function getWeightedScore(entryId: string, since?: Date): Promise<number> {
  const where = since
    ? { entryId, createdAt: { gte: since } }
    : { entryId };
  const events = await prisma.wordEvent.findMany({ where, select: { type: true } });
  return events.reduce((sum, e) => sum + WEIGHTS[e.type], 0);
}
