import { api } from "./client";
import type { CursorPage, Exercise } from "../types/exercise";

type GetExercisesParams = {
  limit?: number;
  cursor?: string | null;
  q?: string;
};

export async function getExercises(
  params: GetExercisesParams = {}
): Promise<CursorPage<Exercise>> {
  const { limit = 20, cursor = null, q } = params;

  const res = await api.get<CursorPage<Exercise>>("/exercises", {
    params: {
      limit,
      cursor: cursor ?? undefined,
      q: q?.trim() ? q.trim() : undefined,
    },
  });

  return res.data;
}