import { buildExercise1RMPoints, estimateEpley1RM } from "../lib/analytics.js";

describe("estimateEpley1RM", () => {
  test("returns calculated 1RM for valid inputs", () => {
    expect(estimateEpley1RM(100, 5)).toBe(116.67);
  });

  test("returns null when weight is zero or less", () => {
    expect(estimateEpley1RM(0, 5)).toBeNull();
    expect(estimateEpley1RM(-10, 5)).toBeNull();
  });

  test("returns null when reps is zero or less", () => {
    expect(estimateEpley1RM(100, 0)).toBeNull();
    expect(estimateEpley1RM(100, -2)).toBeNull();
  });
});

describe("buildExercise1RMPoints", () => {
  test("returns best estimated 1RM per session ordered by date ascending", () => {
    const points = buildExercise1RMPoints([
      {
        sessionId: "s2",
        date: new Date("2026-03-20T10:00:00.000Z"),
        weight: 110,
        reps: 5,
      },
      {
        sessionId: "s1",
        date: new Date("2026-03-10T10:00:00.000Z"),
        weight: 100,
        reps: 5,
      },
      {
        sessionId: "s1",
        date: new Date("2026-03-10T10:00:00.000Z"),
        weight: 105,
        reps: 5,
      },
    ]);

    expect(points).toEqual([
      {
        sessionId: "s1",
        date: "2026-03-10T10:00:00.000Z",
        estimated1RM: 122.5,
      },
      {
        sessionId: "s2",
        date: "2026-03-20T10:00:00.000Z",
        estimated1RM: 128.33,
      },
    ]);
  });

  test("ignores invalid sets", () => {
    const points = buildExercise1RMPoints([
      {
        sessionId: "s1",
        date: new Date("2026-03-10T10:00:00.000Z"),
        weight: 0,
        reps: 5,
      },
      {
        sessionId: "s1",
        date: new Date("2026-03-10T10:00:00.000Z"),
        weight: 100,
        reps: 0,
      },
    ]);

    expect(points).toEqual([]);
  });
});