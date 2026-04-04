import type { Exercise1RMPoint } from "../types/analytics";

export type Exercise1RMPointWithPR = Exercise1RMPoint & {
  isPR: boolean;
};

export function markPRs(points: Exercise1RMPoint[]): Exercise1RMPointWithPR[] {
  let best = -Infinity;

  return points.map((point) => {
    const isPR = point.estimated1RM > best;

    if (isPR) {
      best = point.estimated1RM;
    }

    return {
      ...point,
      isPR,
    };
  });
}