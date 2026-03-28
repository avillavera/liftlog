export function estimateEpley1RM(weight: number, reps: number): number | null {
  if (weight <= 0 || reps <= 0) {
    return null;
  }

  return Number((weight * (1 + reps / 30)).toFixed(2));
}

type SessionSetLike = {
  sessionId: string;
  date: Date;
  weight: number;
  reps: number;
};

export type Exercise1RMPoint = {
  sessionId: string;
  date: string;
  estimated1RM: number;
};

export function buildExercise1RMPoints(rows: SessionSetLike[]): Exercise1RMPoint[] {
  const bestBySession = new Map<string,{ date: Date; estimated1RM: number }>();

  for (const row of rows) {
    const estimated = estimateEpley1RM(row.weight, row.reps);

    if (estimated === null) {
      continue;
    }

    const existing = bestBySession.get(row.sessionId);

    if (!existing || estimated > existing.estimated1RM) {
      bestBySession.set(row.sessionId, {
        date: row.date,
        estimated1RM: estimated,
      });
    }
  }

  return Array.from(bestBySession.entries())
    .map(([sessionId, value]) => ({
      sessionId,
      date: value.date.toISOString(),
      estimated1RM: value.estimated1RM,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}