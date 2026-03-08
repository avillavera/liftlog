import type { Response, Request } from "express";
import { prisma } from "../db/prisma.js";
import type { AuthedRequest } from "../middleware/requireAuth.js";

function getSingleParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function createSession(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;

  const { startedAt, endedAt, notes } = req.body as {
    startedAt?: string;
    endedAt?: string | null;
    notes?: string | null;
  };

  if (!startedAt) {
    return res.status(400).json({ error: "startedAt is required" });
  }

  const session = await prisma.workoutSession.create({
    data: {
      userId,
      startedAt: new Date(startedAt),
      endedAt: endedAt ? new Date(endedAt) : null,
      notes: notes ?? null,
    },
  });

  return res.status(201).json({ session });
}

export async function getSessions(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const skip = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        entries: {
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.workoutSession.count({
      where: { userId },
    }),
  ]);

  return res.json({
    items,
    page,
    limit,
    totalCount,
  });
}

export async function getSessionById(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const sessionId = getSingleParam(req.params.id);

  if (!sessionId) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  const session = await prisma.workoutSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      entries: {
        include: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  return res.json({ session });
}

export async function deleteSession(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const sessionId = getSingleParam(req.params.id);

  if (!sessionId) {
    return res.status(400).json({ error: "Invalid session id" });
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

  await prisma.workoutSession.delete({
    where: { id: sessionId },
  });

  return res.json({ success: true });
}