import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma.js";
import { authRouter } from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.get("/db-check", async (_req, res) => {
  const result = await prisma.user.findMany({ take: 1 });
  res.json({ ok: true, sampleUsers: result });
});

app.use("/auth", authRouter);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
