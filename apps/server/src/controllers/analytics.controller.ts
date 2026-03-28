import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import type { AuthedRequest } from "../middleware/requireAuth.js";
import { buildExercise1RMPoints } from "../lib/analytics.js";

function getSingleParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function getExercise1RMProgress(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const exerciseId = getSingleParam(req.params.exerciseId);

  if (!exerciseId) {
    return res.status(400).json({ error: "Invalid exercise id" });
  }

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      entries: {
        some: {
          exerciseId,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      createdAt: true,
      entries: {
        where: {
          exerciseId,
        },
        select: {
          sets: {
            select: {
              weight: true,
              reps: true,
            },
            orderBy: {
              setNumber: "asc",
            },
          },
        },
      },
    },
  });

  const rows = sessions.flatMap((session) =>
    session.entries.flatMap((entry) =>
      entry.sets.map((set) => ({
        sessionId: session.id,
        date: session.createdAt,
        weight: set.weight,
        reps: set.reps,
      }))
    )
  );

  const points = buildExercise1RMPoints(rows);

  return res.json({
    exerciseId,
    points,
  });
}