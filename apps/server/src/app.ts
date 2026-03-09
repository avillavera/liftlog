import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma.js";
import { authRouter } from "./routes/auth.routes.js";
import { exercisesRouter } from "./routes/exercises.routes.js"
import { sessionsRouter } from "./routes/sessions.routes.js";
import { entriesRouter } from "./routes/entries.routes.js";
import { setsRouter } from "./routes/sets.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

// Optional: keep this only for dev
if (process.env.NODE_ENV !== "test") {
  app.get("/db-check", async (_req, res) => {
    const result = await prisma.user.findMany({ take: 1 });
    res.json({ ok: true, sampleUsers: result });
  });
}

app.use("/auth", authRouter);
app.use("/exercises", exercisesRouter);
app.use("/sessions", sessionsRouter);
app.use("/entries", entriesRouter);
app.use("/sets", setsRouter)

app.use(notFound);
app.use(errorHandler);