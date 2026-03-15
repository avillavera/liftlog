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

test("full workout flow: create session, add entry, add set, update set, fetch detail, delete set", async () => {
  const token = await registerAndGetToken("flow1@test.com");
  const exerciseId = await getOneExerciseId();

  const sessionRes = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      startedAt: "2026-03-14T15:00:00.000Z",
      notes: "Chest day",
    })
    .expect(201);

  const sessionId = sessionRes.body.session.id as string;

  const entryRes = await request(app)
    .post(`/sessions/${sessionId}/entries`)
    .set("Authorization", `Bearer ${token}`)
    .send({ exerciseId })
    .expect(201);

  const entryId = entryRes.body.entry.id as string;

  const setRes = await request(app)
    .post(`/entries/${entryId}/sets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      setNumber: 1,
      weight: 135,
      reps: 10,
    })
    .expect(201);

  const setId = setRes.body.set.id as string;

  const updatedRes = await request(app)
    .put(`/sets/${setId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      weight: 140,
      reps: 8,
      rpe: 9,
    })
    .expect(200);

  expect(updatedRes.body.set.weight).toBe(140);
  expect(updatedRes.body.set.reps).toBe(8);
  expect(updatedRes.body.set.rpe).toBe(9);

  const detailRes = await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(detailRes.body.session.id).toBe(sessionId);
  expect(detailRes.body.session.entries.length).toBe(1);
  expect(detailRes.body.session.entries[0].exercise.id).toBe(exerciseId);
  expect(detailRes.body.session.entries[0].sets.length).toBe(1);
  expect(detailRes.body.session.entries[0].sets[0].weight).toBe(140);

  await request(app)
    .delete(`/sets/${setId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const afterDeleteRes = await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(afterDeleteRes.body.session.entries[0].sets.length).toBe(0);
});

test("DELETE /entries/:id deletes an owned entry", async () => {
  const token = await registerAndGetToken("flow2@test.com");
  const exerciseId = await getOneExerciseId();

  const sessionRes = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      startedAt: "2026-03-14T15:00:00.000Z",
    })
    .expect(201);

  const sessionId = sessionRes.body.session.id as string;

  const entryRes = await request(app)
    .post(`/sessions/${sessionId}/entries`)
    .set("Authorization", `Bearer ${token}`)
    .send({ exerciseId })
    .expect(201);

  const entryId = entryRes.body.entry.id as string;

  await request(app)
    .delete(`/entries/${entryId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const detailRes = await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(detailRes.body.session.entries.length).toBe(0);
});

test("set routes are scoped to the owning user", async () => {
  const tokenA = await registerAndGetToken("flow3a@test.com");
  const tokenB = await registerAndGetToken("flow3b@test.com");
  const exerciseId = await getOneExerciseId();

  const sessionRes = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({
      startedAt: "2026-03-14T15:00:00.000Z",
    })
    .expect(201);

  const sessionId = sessionRes.body.session.id as string;

  const entryRes = await request(app)
    .post(`/sessions/${sessionId}/entries`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ exerciseId })
    .expect(201);

  const entryId = entryRes.body.entry.id as string;

  const setRes = await request(app)
    .post(`/entries/${entryId}/sets`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({
      setNumber: 1,
      weight: 100,
      reps: 5,
    })
    .expect(201);

  const setId = setRes.body.set.id as string;

  await request(app)
    .put(`/sets/${setId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .send({
      weight: 105,
      reps: 5,
    })
    .expect(404);

  await request(app)
    .delete(`/sets/${setId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .expect(404);
});
