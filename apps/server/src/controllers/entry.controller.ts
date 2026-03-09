import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import type { AuthedRequest } from "../middleware/requireAuth.js";

function getSingleParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function createEntry(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const sessionId = getSingleParam(req.params.id);

  const { exerciseId } = req.body as {
    exerciseId?: string;
  };

  if (!sessionId) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  if (!exerciseId) {
    return res.status(400).json({ error: "exerciseId is required" });
  }

  const session = await prisma.workoutSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) {
    return res.status(404).json({ error: "Exercise not found" });
  }

  const existingCount = await prisma.workoutEntry.count({
    where: { sessionId },
  });

  const entry = await prisma.workoutEntry.create({
    data: {
      sessionId,
      exerciseId,
      order: existingCount,
    },
    include: {
      exercise: true,
      sets: {
        orderBy: { setNumber: "asc" },
      },
    },
  });

  return res.status(201).json({ entry });
}

export async function deleteEntry(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const entryId = getSingleParam(req.params.id);

  if (!entryId) {
    return res.status(400).json({ error: "Invalid entry id" });
  }

  const entry = await prisma.workoutEntry.findFirst({
    where: {
      id: entryId,
      session: {
        userId,
      },
    },
  });

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  await prisma.workoutEntry.delete({
    where: { id: entryId },
  });

  return res.json({ success: true });
}