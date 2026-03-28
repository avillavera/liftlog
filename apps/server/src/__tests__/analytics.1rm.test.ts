import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../db/prisma.js";

beforeEach(async () => {
  await prisma.workoutSet.deleteMany();
  await prisma.workoutEntry.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function registerAndGetToken(email: string) {
  const reg = await request(app)
    .post("/auth/register")
    .send({ email, password: "password123" })
    .expect(201);

  return reg.body.token as string;
}

async function getOneExerciseId() {
  const exercise = await prisma.exercise.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!exercise) {
    throw new Error("No seeded exercises found for tests");
  }

  return exercise.id;
}

test("GET /analytics/exercises/:exerciseId/1rm requires auth", async () => {
  const exerciseId = await getOneExerciseId();

  await request(app)
    .get(`/analytics/exercises/${exerciseId}/1rm`)
    .expect(401);
});

test("GET /analytics/exercises/:exerciseId/1rm returns empty points when user has no data", async () => {
  const token = await registerAndGetToken("analytics-empty@test.com");
  const exerciseId = await getOneExerciseId();

  const res = await request(app)
    .get(`/analytics/exercises/${exerciseId}/1rm`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.exerciseId).toBe(exerciseId);
  expect(res.body.points).toEqual([]);
});

test("GET /analytics/exercises/:exerciseId/1rm returns best estimated 1RM per session ordered by date", async () => {
  const token = await registerAndGetToken("analytics1@test.com");
  const exerciseId = await getOneExerciseId();

  const session1Res = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      startedAt: "2026-03-10T10:00:00.000Z",
      notes: "Session 1",
    })
    .expect(201);

  const session1Id = session1Res.body.session.id as string;

  const entry1Res = await request(app)
    .post(`/sessions/${session1Id}/entries`)
    .set("Authorization", `Bearer ${token}`)
    .send({ exerciseId })
    .expect(201);

  const entry1Id = entry1Res.body.entry.id as string;

  await request(app)
    .post(`/entries/${entry1Id}/sets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      setNumber: 1,
      weight: 100,
      reps: 5,
    })
    .expect(201);

  await request(app)
    .post(`/entries/${entry1Id}/sets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      setNumber: 2,
      weight: 105,
      reps: 5,
    })
    .expect(201);

  const session2Res = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      startedAt: "2026-03-20T10:00:00.000Z",
      notes: "Session 2",
    })
    .expect(201);

  const session2Id = session2Res.body.session.id as string;

  const entry2Res = await request(app)
    .post(`/sessions/${session2Id}/entries`)
    .set("Authorization", `Bearer ${token}`)
    .send({ exerciseId })
    .expect(201);

  const entry2Id = entry2Res.body.entry.id as string;

  await request(app)
    .post(`/entries/${entry2Id}/sets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      setNumber: 1,
      weight: 110,
      reps: 5,
    })
    .expect(201);

  const res = await request(app)
    .get(`/analytics/exercises/${exerciseId}/1rm`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.exerciseId).toBe(exerciseId);
  expect(res.body.points).toEqual([
    {
      sessionId: session1Id,
      date: expect.any(String),
      estimated1RM: 122.5,
    },
    {
      sessionId: session2Id,
      date: expect.any(String),
      estimated1RM: 128.33,
    },
  ]);

  expect(new Date(res.body.points[0].date).getTime()).toBeLessThan(
    new Date(res.body.points[1].date).getTime()
  );
});

test("GET /analytics/exercises/:exerciseId/1rm only returns data for the owning user", async () => {
  const tokenA = await registerAndGetToken("analytics-owner@test.com");
  const tokenB = await registerAndGetToken("analytics-other@test.com");
  const exerciseId = await getOneExerciseId();

  const sessionARes = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({
      startedAt: "2026-03-10T10:00:00.000Z",
    })
    .expect(201);

  const sessionAId = sessionARes.body.session.id as string;

  const entryARes = await request(app)
    .post(`/sessions/${sessionAId}/entries`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ exerciseId })
    .expect(201);

  const entryAId = entryARes.body.entry.id as string;

  await request(app)
    .post(`/entries/${entryAId}/sets`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({
      setNumber: 1,
      weight: 100,
      reps: 5,
    })
    .expect(201);

  const sessionBRes = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenB}`)
    .send({
      startedAt: "2026-03-15T10:00:00.000Z",
    })
    .expect(201);

  const sessionBId = sessionBRes.body.session.id as string;

  const entryBRes = await request(app)
    .post(`/sessions/${sessionBId}/entries`)
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ exerciseId })
    .expect(201);

  const entryBId = entryBRes.body.entry.id as string;

  await request(app)
    .post(`/entries/${entryBId}/sets`)
    .set("Authorization", `Bearer ${tokenB}`)
    .send({
      setNumber: 1,
      weight: 200,
      reps: 2,
    })
    .expect(201);

  const res = await request(app)
    .get(`/analytics/exercises/${exerciseId}/1rm`)
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);

  expect(res.body.exerciseId).toBe(exerciseId);
  expect(res.body.points).toHaveLength(1);
  expect(res.body.points[0].sessionId).toBe(sessionAId);
  expect(res.body.points[0].estimated1RM).toBe(116.67);
});