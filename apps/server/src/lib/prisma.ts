import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
