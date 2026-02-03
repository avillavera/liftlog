/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: requireEnv("DATABASE_URL"),
  },
});

