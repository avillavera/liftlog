import { Router } from "express";

export const authRouter = Router();


function toUserResponse(user: { id: string; email: string; createdAt: Date; updatedAt: Date }) {
  return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}