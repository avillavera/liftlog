import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

// better than parseInt imo
function parseLimit(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) {
    return 20;
  }
  return Math.max(1, Math.min(50, Math.trunc(n)));
}

export async function getExercises(req: Request, res: Response) {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const limit = parseLimit(req.query.limit);

  const where: Prisma.ExerciseWhereInput | undefined = q
    ? { name: { contains: q, mode: "insensitive" } }
    : undefined;

  const args: Prisma.ExerciseFindManyArgs = {
    orderBy: [{ name: "asc" }, { id: "asc" }],
    take: limit + 1,
    select: {
      id: true,
      name: true,
      muscleGroup: true,
      equipment: true,
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    ...(where ? { where } : {}),
  };

  const items = await prisma.exercise.findMany(args);

  const hasMore = items.length > limit;
  const trimmed = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? trimmed[trimmed.length - 1]!.id : null;

  return res.json({ items: trimmed, nextCursor });
}