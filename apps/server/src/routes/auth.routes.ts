import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { signToken } from "../lib/jwt.js";
import { loginSchema, registerSchema } from "../validation/auth.js";

export const authRouter = Router();

//My response from user model
function toUserResponse(user: { id: string; email: string; createdAt: Date; updatedAt: Date }) {
  return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.format() });
  }
  
  const email = parsed.data.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    const token = signToken({ userId: user.id });
    return res.status(201).json({ token, user: toUserResponse(user) });
  } catch (e: any) {
    // Prisma unique constraint (email)
    if (e?.code === "P2002") {
        return res.status(409).json({ error: "Email already in use" });
    }
    return res.status(500).json({ error: "Server error" });
  }
});