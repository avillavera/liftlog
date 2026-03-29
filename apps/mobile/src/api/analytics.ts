import { api } from "./client";
import { Exercise1RMResponse } from "../types/analytics";

export async function getExercise1RM(exerciseId: string) {
  const res = await api.get<Exercise1RMResponse>(
    `/analytics/exercises/${exerciseId}/1rm`
  );

  return res.data;
}