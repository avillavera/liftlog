import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import type { AuthedRequest } from "../middleware/requireAuth.js";

function getSingleParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function createSet(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const entryId = getSingleParam(req.params.id);

  const { setNumber, weight, reps, rpe } = req.body as {
    setNumber?: number;
    weight?: number;
    reps?: number;
    rpe?: number | null;
  };

  if (!entryId) {
    return res.status(400).json({ error: "Invalid entry id" });
  }

  if (
    typeof setNumber !== "number" ||
    typeof weight !== "number" ||
    typeof reps !== "number"
  ) {
    return res.status(400).json({
      error: "setNumber, weight, and reps are required",
    });
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

  const set = await prisma.workoutSet.create({
    data: {
      entryId,
      setNumber,
      weight,
      reps,
      rpe: rpe ?? null,
    },
  });

  return res.status(201).json({ set });
}

export async function updateSet(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const setId = getSingleParam(req.params.id);

  const { weight, reps, rpe } = req.body as {
    weight?: number;
    reps?: number;
    rpe?: number | null;
  };

  if (!setId) {
    return res.status(400).json({ error: "Invalid set id" });
  }

  if (typeof weight !== "number" || typeof reps !== "number") {
    return res.status(400).json({ error: "weight and reps are required" });
  }

  const existingSet = await prisma.workoutSet.findFirst({
    where: {
      id: setId,
      entry: {
        session: {
          userId,
        },
      },
    },
  });

  if (!existingSet) {
    return res.status(404).json({ error: "Set not found" });
  }

  const set = await prisma.workoutSet.update({
    where: { id: setId },
    data: {
      weight,
      reps,
      rpe: rpe ?? null,
    },
  });

  return res.json({ set });
}

export async function deleteSet(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const setId = getSingleParam(req.params.id);

  if (!setId) {
    return res.status(400).json({ error: "Invalid set id" });
  }

  const existingSet = await prisma.workoutSet.findFirst({
    where: {
      id: setId,
      entry: {
        session: {
          userId,
        },
      },
    },
  });

  if (!existingSet) {
    return res.status(404).json({ error: "Set not found" });
  }

  await prisma.workoutSet.delete({
    where: { id: setId },
  });

  return res.json({ success: true });
}