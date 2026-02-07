import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";
import { signToken } from "../lib/jwt.js";
import { loginSchema, registerSchema } from "../validation/auth.js";
import type { AuthedRequest } from "../middleware/requireAuth.js";

function toUserResponse(user: { id: string; email: string; createdAt: Date; updatedAt: Date }) {
  return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

// /auth/register
export async function register(req: Request, res: Response){
const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: z.treeifyError(parsed.error) });
  }
  
  // Normalize the email and hashpass
  const email = parsed.data.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    const token = signToken({ userId: user.id });
    return res.status(201).json({ token, user: toUserResponse(user) });
  } 
  catch (e: any) {
    // Prisma unique constraint (email)
    if (e?.code === "P2002") {
        return res.status(409).json({ error: "Email already in use" });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /auth/login
export async function login(req: Request, res: Response) {

  // Parse
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: z.treeifyError(parsed.error) });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, createdAt: true, updatedAt: true },
  });
  // No user found
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);

  // Wrong password
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ userId: user.id });
  const { passwordHash, ...safeUser } = user; // Strip passwordHash

  return res.json({ token, user: safeUser });
}

// GET /auth/me
// Middleware before handler
export async function me(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ user });
}
