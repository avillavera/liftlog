import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../db/prisma.js";

beforeEach(async () => {
  // Clean in dependency order
  // await prisma.workoutSet.deleteMany();
  // await prisma.workoutEntry.deleteMany();
  // await prisma.workoutSession.deleteMany();
  // WE DONT HAVE THESE YET
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("POST /auth/register returns token + user", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ email: "a@test.com", password: "password123" })
    .expect(201);

  expect(res.body.token).toBeTruthy();
  expect(res.body.user.email).toBe("a@test.com");
});

test("POST /auth/login returns token for valid credentials", async () => {
  await request(app)
    .post("/auth/register")
    .send({ email: "b@test.com", password: "password123" })
    .expect(201);

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "b@test.com", password: "password123" })
    .expect(200);

  expect(res.body.token).toBeTruthy();
});

test("GET /auth/me returns current user when authorized", async () => {
  const reg = await request(app)
    .post("/auth/register")
    .send({ email: "c@test.com", password: "password123" })
    .expect(201);

  const token = reg.body.token;

  const res = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.user.email).toBe("c@test.com");
});
