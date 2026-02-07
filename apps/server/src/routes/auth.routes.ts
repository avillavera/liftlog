import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { signToken } from "../lib/jwt.js";
import { loginSchema, registerSchema } from "../validation/auth.js";

export const authRouter = Router();

// My response from user model
function toUserResponse(user: { id: string; email: string; createdAt: Date; updatedAt: Date }) {
  return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

// /auth/register
authRouter.post("/register", async (req, res) => {

  // Parse
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
});


// POST /auth/login
authRouter.post("/login", async (req, res) => {

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
  // Strip passwordHash
  const { passwordHash, ...safeUser } = user;

  return res.json({ token, user: safeUser });
});