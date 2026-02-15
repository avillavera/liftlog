import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../db/prisma.js";

beforeEach(async () => {
  // - Users get wiped for auth tests
  // - Exercises are stable seeded data (don’t wipe exercises here)
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

test("GET /exercises returns 401 without token", async () => {
  await request(app).get("/exercises").expect(401);
});

test("GET /exercises returns items + nextCursor when authorized", async () => {
  const token = await registerAndGetToken("ex1@test.com");

  const res = await request(app)
    .get("/exercises?limit=5")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(Array.isArray(res.body.items)).toBe(true);
  expect(res.body.items.length).toBeGreaterThan(0);
  expect("nextCursor" in res.body).toBe(true);

  // Basic shape check for returned items
  const first = res.body.items[0];
  expect(first.id).toBeTruthy();
  expect(first.name).toBeTruthy();
  expect(first.muscleGroup).toBeTruthy();
  expect(first.equipment).toBeTruthy();
});

test("GET /exercises supports q search + cursor pagination", async () => {
  const token = await registerAndGetToken("ex2@test.com");

  const first = await request(app)
    .get("/exercises?q=press&limit=2")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(Array.isArray(first.body.items)).toBe(true);
  expect(first.body.items.length).toBeLessThanOrEqual(2);
  expect("nextCursor" in first.body).toBe(true);

  const nextCursor = first.body.nextCursor as string | null;

  // If there’s no second page for this search term, we’re done.
  if (!nextCursor) return;

  const second = await request(app)
    .get(`/exercises?q=press&limit=2&cursor=${nextCursor}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(Array.isArray(second.body.items)).toBe(true);
});
