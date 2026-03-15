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

test("POST /sessions returns 401 without token", async () => {
  await request(app)
    .post("/sessions")
    .send({ startedAt: new Date().toISOString() })
    .expect(401);
});

test("POST /sessions creates a session", async () => {
  const token = await registerAndGetToken("sessions1@test.com");

  const res = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      startedAt: "2026-03-14T15:00:00.000Z",
      endedAt: "2026-03-14T16:00:00.000Z",
      notes: "Push day",
    })
    .expect(201);

  expect(res.body.session.id).toBeTruthy();
  expect(res.body.session.userId).toBeTruthy();
  expect(res.body.session.notes).toBe("Push day");
  expect(res.body.session.startedAt).toBeTruthy();
});

test("GET /sessions returns paginated sessions for current user only", async () => {
  const tokenA = await registerAndGetToken("sessions2a@test.com");
  const tokenB = await registerAndGetToken("sessions2b@test.com");

  await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ startedAt: "2026-03-14T10:00:00.000Z", notes: "User A session 1" })
    .expect(201);

  await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ startedAt: "2026-03-14T11:00:00.000Z", notes: "User A session 2" })
    .expect(201);

  await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ startedAt: "2026-03-14T12:00:00.000Z", notes: "User B session" })
    .expect(201);

  const res = await request(app)
    .get("/sessions?page=1&limit=10")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);

  expect(Array.isArray(res.body.items)).toBe(true);
  expect(res.body.items.length).toBe(2);
  expect(res.body.totalCount).toBe(2);
  expect(res.body.page).toBe(1);
  expect(res.body.limit).toBe(10);

  for (const item of res.body.items) {
    expect(item.notes).not.toBe("User B session");
  }
});

test("GET /sessions/:id returns one session for owner", async () => {
  const token = await registerAndGetToken("sessions3@test.com");

  const created = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({ startedAt: "2026-03-14T15:00:00.000Z", notes: "Leg day" })
    .expect(201);

  const sessionId = created.body.session.id as string;

  const res = await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.session.id).toBe(sessionId);
  expect(res.body.session.notes).toBe("Leg day");
  expect(Array.isArray(res.body.session.entries)).toBe(true);
});

test("GET /sessions/:id returns 404 for non-owner session", async () => {
  const tokenA = await registerAndGetToken("sessions4a@test.com");
  const tokenB = await registerAndGetToken("sessions4b@test.com");

  const created = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ startedAt: "2026-03-14T15:00:00.000Z" })
    .expect(201);

  const sessionId = created.body.session.id as string;

  await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .expect(404);
});

test("DELETE /sessions/:id deletes an owned session", async () => {
  const token = await registerAndGetToken("sessions5@test.com");

  const created = await request(app)
    .post("/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({ startedAt: "2026-03-14T15:00:00.000Z" })
    .expect(201);

  const sessionId = created.body.session.id as string;

  await request(app)
    .delete(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  await request(app)
    .get(`/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404);
});